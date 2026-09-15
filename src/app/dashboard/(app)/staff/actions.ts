"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDashboardUser } from "@/lib/dashboard/session";

export async function inviteStaff(formData: FormData) {
  const user = await getDashboardUser();
  if (!user || user.role !== "owner") return { error: "Owner only." };

  const email = String(formData.get("email") ?? "").trim();
  const displayName = String(formData.get("displayName") ?? "").trim();
  if (!email || !displayName) return { error: "Name and email are required." };

  const admin = createAdminClient();
  if (!admin) {
    return {
      error:
        "SUPABASE_SERVICE_ROLE_KEY isn't set yet — add it as an environment variable to enable staff invites (see Supabase project settings → API).",
    };
  }

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email);
  if (error || !data.user) {
    return { error: error?.message ?? "Could not send invite." };
  }

  const supabase = await createClient();
  const { error: insertError } = await supabase.from("dashboard_users").insert({
    id: data.user.id,
    role: "staff",
    display_name: displayName,
  });
  if (insertError) return { error: insertError.message };

  await supabase.from("audit_log").insert({
    actor_id: user.id,
    action: "invite_staff",
    entity_type: "dashboard_user",
    entity_id: data.user.id,
    new_value: { email, displayName },
  });

  revalidatePath("/dashboard/staff");
  return { success: true };
}
