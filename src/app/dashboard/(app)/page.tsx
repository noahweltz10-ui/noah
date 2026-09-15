import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProducts } from "@/lib/shopify";
import { PageHeader, StatCard, Card, EmptyState, Badge } from "@/components/dashboard/ui";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default async function DashboardHome() {
  const supabase = await createClient();

  const [{ data: orders }, { count: unreadCount }, { products }] = await Promise.all([
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("support_inbox").select("*", { count: "exact", head: true }).eq("status", "new"),
    getProducts(),
  ]);

  const allOrders = orders ?? [];
  const revenue = allOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const pendingCount = allOrders.filter((o) => o.status === "pending").length;

  const soldOutSizes = products.flatMap((p) =>
    p.variants.filter((v) => !v.availableForSale).map((v) => `${p.title} (${v.title})`)
  );

  // Orders per day, last 7 days — a real computed chart, not decorative.
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const dayCounts = days.map((d) => {
    const key = d.toDateString();
    return allOrders.filter((o) => new Date(o.created_at).toDateString() === key).length;
  });
  const maxCount = Math.max(1, ...dayCounts);

  return (
    <div>
      <PageHeader
        title="overview"
        description="drop 001 — cream / midnight. demo data until Shopify Admin API is connected."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="orders" value={String(allOrders.length)} hint={`${pendingCount} pending`} />
        <StatCard label="revenue" value={formatCurrency(revenue)} hint="non-cancelled orders" />
        <StatCard label="support inbox" value={String(unreadCount ?? 0)} hint="unread" />
        <StatCard label="sizes sold out" value={String(soldOutSizes.length)} hint="across drop 001" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="text-[0.68rem] uppercase tracking-[0.14em] text-paper/45">orders — last 7 days</p>
          <div className="mt-6 flex h-32 items-end gap-3">
            {days.map((d, i) => (
              <div key={d.toISOString()} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-paper/70"
                  style={{ height: `${(dayCounts[i] / maxCount) * 100}%`, minHeight: dayCounts[i] ? "4px" : "1px" }}
                />
                <span className="text-[0.6rem] text-paper/40">
                  {d.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-[0.68rem] uppercase tracking-[0.14em] text-paper/45">quick links</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/dashboard/orders" className="hover:underline">
              review pending orders →
            </Link>
            <Link href="/dashboard/support" className="hover:underline">
              answer support inbox →
            </Link>
            <Link href="/dashboard/inventory" className="hover:underline">
              update prices / stock →
            </Link>
            <Link href="/dashboard/reviews" className="hover:underline">
              moderate reviews →
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-[0.68rem] uppercase tracking-[0.14em] text-paper/45">
          currently sold out
        </p>
        {soldOutSizes.length === 0 ? (
          <EmptyState title="everything's in stock" body="no sizes are marked sold out right now." />
        ) : (
          <div className="flex flex-wrap gap-2">
            {soldOutSizes.map((s) => (
              <Badge key={s} tone="warning">
                {s}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
