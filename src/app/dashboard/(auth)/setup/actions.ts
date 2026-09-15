"use server";

import { createClient } from "@/lib/supabase/server";

export async function completeSetup(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (!email || !password || !displayName) {
    return { error: "Fill in every field." };
  }
  if (password.length < 8) {
    return { error: "Password needs to be at least 8 characters." };
  }

  const supabase = await createClient();

  const { data: ownerExists } = await supabase.rpc("dashboard_owner_exists");
  if (ownerExists) {
    return { error: "An owner account already exists — go to login instead." };
  }

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) {
    return { error: error?.message ?? "Could not create the account." };
  }

  const { error: insertError } = await supabase.from("dashboard_users").insert({
    id: data.user.id,
    role: "owner",
    display_name: displayName,
  });
  if (insertError) {
    return { error: insertError.message };
  }

  if (!data.session) {
    return {
      success: true,
      needsEmailConfirm: true,
      message: "Account created — check your email to confirm it, then log in.",
    };
  }

  return { success: true, needsEmailConfirm: false };
}
