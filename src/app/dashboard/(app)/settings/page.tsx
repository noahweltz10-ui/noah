import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card } from "@/components/dashboard/ui";
import MaintenanceToggle from "./MaintenanceToggle";
import PasswordReset from "./PasswordReset";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", true).single();

  return (
    <div>
      <PageHeader title="settings" />

      <div className="flex flex-col gap-4">
        <MaintenanceToggle
          initialEnabled={settings?.maintenance_mode ?? false}
          initialMessage={settings?.maintenance_message ?? ""}
        />
        <PasswordReset />
        <Card>
          <p className="text-sm">export data</p>
          <p className="mt-1 text-xs text-paper/50">
            your own copy — not locked to this dashboard.
          </p>
          <div className="mt-3 flex gap-3">
            <a
              href="/api/dashboard/export?type=orders"
              className="rounded-full border border-paper/20 px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
            >
              orders.csv
            </a>
            <a
              href="/api/dashboard/export?type=customers"
              className="rounded-full border border-paper/20 px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
            >
              customers.csv
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
