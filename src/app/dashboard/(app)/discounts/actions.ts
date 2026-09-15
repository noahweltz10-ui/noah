"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDashboardUser } from "@/lib/dashboard/session";

export async function createDiscount(formData: FormData) {
  const user = await getDashboardUser();
  if (!user) return { error: "Not signed in." };

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const kind = String(formData.get("kind") ?? "percent");
  const value = Number(formData.get("value") ?? 0);
  const usageLimit = formData.get("usageLimit") ? Number(formData.get("usageLimit")) : null;

  if (!code || !value) return { error: "Code and value are required." };

  const supabase = await createClient();
  const { error } = await supabase.from("discount_codes").insert({
    code,
    kind,
    value,
    usage_limit: usageLimit,
    created_by: user.id,
  });
  if (error) return { error: error.message };

  revalidatePath("/dashboard/discounts");
  return { success: true };
}

export async function toggleDiscount(id: number, active: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("discount_codes").update({ active }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/discounts");
  return { success: true };
}
