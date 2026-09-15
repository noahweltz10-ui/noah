"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDashboardUser } from "@/lib/dashboard/session";

export async function scheduleDrop(formData: FormData) {
  const user = await getDashboardUser();
  if (!user) return { error: "Not signed in." };

  const title = String(formData.get("title") ?? "").trim();
  const launchAt = String(formData.get("launchAt") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!title || !launchAt) return { error: "Title and launch date are required." };

  const supabase = await createClient();
  const { error } = await supabase.from("drop_schedule").insert({
    title,
    launch_at: new Date(launchAt).toISOString(),
    notes: notes || null,
    created_by: user.id,
  });
  if (error) return { error: error.message };

  revalidatePath("/dashboard/drops");
  return { success: true };
}
