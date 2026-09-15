"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDashboardUser } from "@/lib/dashboard/session";

const STATUSES = ["pending", "fulfilled", "shipped", "cancelled", "refunded"] as const;

export async function updateOrderStatus(orderId: number, status: string) {
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
    return { error: "Invalid status." };
  }

  const user = await getDashboardUser();
  if (!user) return { error: "Not signed in." };

  const supabase = await createClient();
  const { data: existing } = await supabase.from("orders").select("status, order_number").eq("id", orderId).single();

  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) return { error: error.message };

  await supabase.from("audit_log").insert({
    actor_id: user.id,
    action: "update_order_status",
    entity_type: "order",
    entity_id: String(orderId),
    field: "status",
    old_value: existing?.status,
    new_value: status,
  });

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard");
  return { success: true };
}
