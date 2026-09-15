import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, EmptyState } from "@/components/dashboard/ui";
import OrderStatusSelect from "./OrderStatusSelect";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (q) {
    query = query.or(`order_number.ilike.%${q}%,customer_email.ilike.%${q}%`);
  }
  const { data: orders } = await query;

  return (
    <div>
      <PageHeader title="orders" description="demo data until Shopify Admin API is connected." />

      <form className="mb-6 max-w-sm">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="search by order # or email"
          className="w-full rounded-full border border-paper/15 bg-transparent px-4 py-2 text-sm outline-none focus:border-paper/40"
        />
      </form>

      {!orders || orders.length === 0 ? (
        <EmptyState title="no orders found" body="try a different search, or check back once orders come in." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-paper/10 text-left text-[0.62rem] uppercase tracking-[0.1em] text-paper/45">
                <th className="px-5 py-3 font-normal">order</th>
                <th className="px-5 py-3 font-normal">customer</th>
                <th className="px-5 py-3 font-normal">total</th>
                <th className="px-5 py-3 font-normal">status</th>
                <th className="px-5 py-3 font-normal">placed</th>
                <th className="px-5 py-3 font-normal" />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-paper/5 last:border-0">
                  <td className="px-5 py-3 font-medium">{o.order_number}</td>
                  <td className="px-5 py-3 text-paper/70">{o.customer_email}</td>
                  <td className="px-5 py-3">{formatCurrency(Number(o.total))}</td>
                  <td className="px-5 py-3">
                    <OrderStatusSelect orderId={o.id} status={o.status} />
                  </td>
                  <td className="px-5 py-3 text-paper/50">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/dashboard/orders/${o.id}/print`}
                      target="_blank"
                      className="text-xs underline decoration-paper/30 underline-offset-4 hover:decoration-paper"
                    >
                      print
                    </Link>
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
