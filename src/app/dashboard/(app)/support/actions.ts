"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markInboxStatus(id: number, status: "read" | "replied" | "archived") {
  const supabase = await createClient();
  const { error } = await supabase.from("support_inbox").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/support");
  revalidatePath("/dashboard");
  return { success: true };
}
