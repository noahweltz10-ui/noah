import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, EmptyState } from "@/components/dashboard/ui";
import ChangelogForm from "./ChangelogForm";

export default async function ChangelogPage() {
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("changelog")
    .select("*, dashboard_users(display_name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="changelog" description="a plain-language feed of what changed and when." />
      <div className="mb-6">
        <ChangelogForm />
      </div>
      {!entries || entries.length === 0 ? (
        <EmptyState title="nothing posted yet" body="log a change above so it's not a mystery later." />
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((e) => (
            <Card key={e.id}>
              <p className="text-sm">{e.summary}</p>
              {e.detail && <p className="mt-1 text-sm text-paper/60">{e.detail}</p>}
              <p className="mt-2 text-xs text-paper/40">
                {new Date(e.created_at).toLocaleString()}
                {e.dashboard_users?.display_name ? ` — ${e.dashboard_users.display_name}` : ""}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
