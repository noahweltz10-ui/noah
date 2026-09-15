import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoMark } from "@/components/LogoMark";

type OrderItem = { title: string; size: string; qty: number; price: number };

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default async function OrderPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase.from("orders").select("*").eq("id", id).single();
  if (!order) notFound();

  const items = (order.items ?? []) as OrderItem[];

  return (
    <div className="mx-auto max-w-xl bg-paper px-6 py-10 text-ink">
      <div className="flex items-center justify-between border-b border-ink/15 pb-6">
        <div className="flex items-center gap-2.5">
          <LogoMark width={22} />
          <span className="font-display text-lg italic">shift culture</span>
        </div>
        <div className="text-right text-sm">
          <p className="font-medium">{order.order_number}</p>
          <p className="text-ink/50">{new Date(order.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-[0.14em] text-ink/45">ship to</p>
        <p className="mt-1 text-sm">{order.customer_email}</p>
      </div>

      <table className="mt-8 w-full text-sm">
        <thead>
          <tr className="border-b border-ink/15 text-left text-xs uppercase tracking-[0.1em] text-ink/45">
            <th className="pb-2 font-normal">item</th>
            <th className="pb-2 font-normal">size</th>
            <th className="pb-2 font-normal">qty</th>
            <th className="pb-2 text-right font-normal">price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b border-ink/10">
              <td className="py-2">{item.title}</td>
              <td className="py-2">{item.size}</td>
              <td className="py-2">{item.qty}</td>
              <td className="py-2 text-right">{formatCurrency(item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <p className="text-sm font-medium">total {formatCurrency(Number(order.total))}</p>
      </div>

      <p className="mt-10 text-center text-xs text-ink/40">drop 001 — cream / midnight</p>
    </div>
  );
}
