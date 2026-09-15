import "server-only";
import { createPublicClient, isSupabaseConfigured } from "./supabase/public";

export async function getSiteSettings() {
  if (!isSupabaseConfigured) return { maintenanceMode: false, maintenanceMessage: null };

  const supabase = createPublicClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", true).single();
  if (!data) return { maintenanceMode: false, maintenanceMessage: null };

  return {
    maintenanceMode: data.maintenance_mode as boolean,
    maintenanceMessage: data.maintenance_message as string | null,
  };
}
