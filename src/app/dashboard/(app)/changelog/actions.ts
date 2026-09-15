"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDashboardUser } from "@/lib/dashboard/session";

export async function addChangelogEntry(formData: FormData) {
  const user = await getDashboardUser();
  if (!user) return { error: "Not signed in." };

  const summary = String(formData.get("summary") ?? "").trim();
  const detail = String(formData.get("detail") ?? "").trim();
  if (!summary) return { error: "Summary is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("changelog").insert({
    summary,
    detail: detail || null,
    actor_id: user.id,
  });
  if (error) return { error: error.message };

  revalidatePath("/dashboard/changelog");
  return { success: true };
}
