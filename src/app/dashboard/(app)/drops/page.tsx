import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, EmptyState, Badge } from "@/components/dashboard/ui";
import DropForm from "./DropForm";

export default async function DropsPage() {
  const supabase = await createClient();
  const [{ data: drops }, { data: waitlist }] = await Promise.all([
    supabase.from("drop_schedule").select("*").order("launch_at", { ascending: true }),
    supabase
      .from("support_inbox")
      .select("product_handle")
      .eq("kind", "notify_me")
      .not("product_handle", "is", null),
  ]);

  const waitlistCounts = (waitlist ?? []).reduce<Record<string, number>>((acc, row) => {
    const handle = row.product_handle as string;
    acc[handle] = (acc[handle] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="drops & waitlist"
        description="scheduling here is a planning tool — the storefront hero still needs to be pointed at a live date manually."
      />

      <div className="mb-6">
        <DropForm />
      </div>

      <p className="mb-3 text-[0.68rem] uppercase tracking-[0.14em] text-paper/45">scheduled</p>
      {!drops || drops.length === 0 ? (
        <EmptyState title="nothing scheduled" body="add the next drop's date above." />
      ) : (
        <div className="mb-8 flex flex-col gap-3">
          {drops.map((d) => (
            <Card key={d.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm">{d.title}</p>
                  <p className="text-xs text-paper/50">
                    {new Date(d.launch_at).toLocaleString()}
                  </p>
                </div>
                <Badge tone={d.status === "live" ? "success" : "neutral"}>{d.status}</Badge>
              </div>
              {d.notes && <p className="mt-2 text-sm text-paper/70">{d.notes}</p>}
            </Card>
          ))}
        </div>
      )}

      <p className="mb-3 text-[0.68rem] uppercase tracking-[0.14em] text-paper/45">
        restock waitlist by product
      </p>
      {Object.keys(waitlistCounts).length === 0 ? (
        <EmptyState title="no one's waiting" body="restock-me signups will tally here by product." />
      ) : (
        <div className="flex flex-wrap gap-2">
          {Object.entries(waitlistCounts).map(([handle, count]) => (
            <Badge key={handle} tone="warning">
              {handle} — {count} waiting
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
