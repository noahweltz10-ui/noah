import "server-only";
import { createClient } from "@/lib/supabase/server";

export type DashboardUser = {
  id: string;
  email: string;
  role: "owner" | "staff";
  displayName: string;
};

export async function getDashboardUser(): Promise<DashboardUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("dashboard_users")
    .select("role, display_name")
    .eq("id", user.id)
    .single();
  if (!profile) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    role: profile.role,
    displayName: profile.display_name,
  };
}
