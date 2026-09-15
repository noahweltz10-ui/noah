"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function moderateReview(id: number, status: "approved" | "rejected") {
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/reviews");
  return { success: true };
}
