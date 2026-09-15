import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, EmptyState } from "@/components/dashboard/ui";
import DiscountForm from "./DiscountForm";
import DiscountRow from "./DiscountRow";

export default async function DiscountsPage() {
  const supabase = await createClient();
  const { data: discounts } = await supabase
    .from("discount_codes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="discount codes"
        description="live on the storefront once Shopify Admin API sync is connected — for now these are tracked here."
      />
      <div className="mb-6">
        <DiscountForm />
      </div>
      {!discounts || discounts.length === 0 ? (
        <EmptyState title="no codes yet" body="create one above." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-paper/10 text-left text-[0.62rem] uppercase tracking-[0.1em] text-paper/45">
                <th className="px-5 py-3 font-normal">code</th>
                <th className="px-5 py-3 font-normal">value</th>
                <th className="px-5 py-3 font-normal">used</th>
                <th className="px-5 py-3 font-normal">status</th>
                <th className="px-5 py-3 font-normal" />
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => (
                <DiscountRow key={d.id} discount={d} />
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
