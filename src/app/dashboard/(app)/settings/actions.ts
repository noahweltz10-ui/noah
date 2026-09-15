"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDashboardUser } from "@/lib/dashboard/session";

export async function setMaintenanceMode(enabled: boolean, message: string) {
  const user = await getDashboardUser();
  if (!user) return { error: "Not signed in." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      maintenance_mode: enabled,
      maintenance_message: message || null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true);
  if (error) return { error: error.message };

  await supabase.from("audit_log").insert({
    actor_id: user.id,
    action: "set_maintenance_mode",
    entity_type: "site_settings",
    entity_id: "site",
    new_value: { enabled, message },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/");
  return { success: true };
}

export async function requestPasswordReset() {
  const user = await getDashboardUser();
  if (!user) return { error: "Not signed in." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(user.email);
  if (error) return { error: error.message };
  return { success: true };
}
