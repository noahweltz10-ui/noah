"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDashboardUser } from "@/lib/dashboard/session";

export type InventoryPatch = {
  price?: string;
  compareAtPrice?: string;
  sizeAvailability?: Record<string, boolean>;
};

export async function submitInventoryChange(handle: string, patch: InventoryPatch) {
  const user = await getDashboardUser();
  if (!user) return { error: "Not signed in." };

  const supabase = await createClient();

  if (user.role === "owner") {
    const { data: existing } = await supabase
      .from("product_overrides")
      .select("*")
      .eq("handle", handle)
      .maybeSingle();

    const { error } = await supabase.from("product_overrides").upsert({
      handle,
      price: patch.price ?? existing?.price ?? null,
      compare_at_price: patch.compareAtPrice ?? existing?.compare_at_price ?? null,
      size_availability: patch.sizeAvailability
        ? { ...(existing?.size_availability ?? {}), ...patch.sizeAvailability }
        : existing?.size_availability ?? null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    });
    if (error) return { error: error.message };

    await supabase.from("audit_log").insert({
      actor_id: user.id,
      action: "update_product_override",
      entity_type: "product",
      entity_id: handle,
      new_value: patch,
    });

    revalidatePath("/dashboard/inventory");
    revalidatePath("/");
    revalidatePath(`/products/${handle}`);
    return { success: true, applied: true };
  }

  // Scoped staff: log a change request instead of writing live data.
  const { error } = await supabase.from("change_requests").insert({
    requested_by: user.id,
    entity_type: "product",
    entity_id: handle,
    field: Object.keys(patch).join(","),
    new_value: patch,
    status: "pending",
  });
  if (error) return { error: error.message };

  revalidatePath("/dashboard/inventory");
  return { success: true, applied: false };
}

export async function reviewChangeRequest(id: number, decision: "approved" | "rejected") {
  const user = await getDashboardUser();
  if (!user || user.role !== "owner") return { error: "Owner only." };

  const supabase = await createClient();
  const { data: request } = await supabase
    .from("change_requests")
    .select("*")
    .eq("id", id)
    .single();
  if (!request) return { error: "Request not found." };

  if (decision === "approved" && request.entity_type === "product") {
    const patch = request.new_value as InventoryPatch;
    const { data: existing } = await supabase
      .from("product_overrides")
      .select("*")
      .eq("handle", request.entity_id)
      .maybeSingle();

    await supabase.from("product_overrides").upsert({
      handle: request.entity_id,
      price: patch.price ?? existing?.price ?? null,
      compare_at_price: patch.compareAtPrice ?? existing?.compare_at_price ?? null,
      size_availability: patch.sizeAvailability
        ? { ...(existing?.size_availability ?? {}), ...patch.sizeAvailability }
        : existing?.size_availability ?? null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    });

    await supabase.from("audit_log").insert({
      actor_id: user.id,
      action: "approve_change_request",
      entity_type: "product",
      entity_id: request.entity_id,
      new_value: patch,
    });
  }

  await supabase
    .from("change_requests")
    .update({
      status: decision === "approved" ? "applied" : "rejected",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/dashboard/inventory");
  revalidatePath("/");
  return { success: true };
}
