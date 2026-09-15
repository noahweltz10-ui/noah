import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardUser } from "@/lib/dashboard/session";
import { PageHeader, Card, Badge, EmptyState } from "@/components/dashboard/ui";
import InviteForm from "./InviteForm";

export default async function StaffPage() {
  const user = await getDashboardUser();
  if (!user || user.role !== "owner") redirect("/dashboard");

  const supabase = await createClient();
  const [{ data: staff }, { data: auditLog }] = await Promise.all([
    supabase.from("dashboard_users").select("*").order("created_at", { ascending: true }),
    supabase
      .from("audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <div>
      <PageHeader title="staff & access" description="invite accounts and see who's changed what." />

      <div className="mb-6">
        <InviteForm />
      </div>

      <div className="mb-3 flex flex-col gap-2">
        {(staff ?? []).map((s) => (
          <Card key={s.id} className="flex items-center justify-between">
            <p className="text-sm">{s.display_name}</p>
            <Badge tone={s.role === "owner" ? "success" : "neutral"}>{s.role}</Badge>
          </Card>
        ))}
      </div>

      <p className="mb-3 mt-8 text-[0.68rem] uppercase tracking-[0.14em] text-paper/45">
        recent activity
      </p>
      {!auditLog || auditLog.length === 0 ? (
        <EmptyState title="nothing logged yet" body="changes made through the dashboard show up here." />
      ) : (
        <div className="flex flex-col gap-1.5 text-sm text-paper/70">
          {auditLog.map((entry) => (
            <p key={entry.id} className="border-b border-paper/5 py-2">
              <span className="text-paper/40">
                {new Date(entry.created_at).toLocaleString()} —
              </span>{" "}
              {entry.action} on {entry.entity_type} {entry.entity_id}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
