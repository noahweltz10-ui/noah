import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, EmptyState, Badge } from "@/components/dashboard/ui";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default async function CustomersPage() {
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .order("lifetime_value", { ascending: false });

  return (
    <div>
      <PageHeader
        title="customers"
        description="demo data until Shopify Admin API is connected — will sync automatically once it is."
      />
      {!customers || customers.length === 0 ? (
        <EmptyState title="no customers yet" body="they'll show up here once orders start coming in." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-paper/10 text-left text-[0.62rem] uppercase tracking-[0.1em] text-paper/45">
                <th className="px-5 py-3 font-normal">customer</th>
                <th className="px-5 py-3 font-normal">orders</th>
                <th className="px-5 py-3 font-normal">lifetime value</th>
                <th className="px-5 py-3 font-normal">tags</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-paper/5 last:border-0">
                  <td className="px-5 py-3">
                    <p>{c.name ?? c.email}</p>
                    <p className="text-xs text-paper/45">{c.email}</p>
                  </td>
                  <td className="px-5 py-3">{c.orders_count}</td>
                  <td className="px-5 py-3">{formatCurrency(Number(c.lifetime_value))}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1.5">
                      {c.tags.map((t: string) => (
                        <Badge key={t} tone={t === "vip" ? "success" : "neutral"}>
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
