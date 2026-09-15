import { PageHeader, Card } from "@/components/dashboard/ui";

const ITEMS = [
  {
    title: "abandoned cart recovery",
    body: "needs Shopify checkout data (Admin API) to know who abandoned what.",
  },
  {
    title: "automated email flows",
    body: "needs an email platform connected — Klaviyo keys are already wired in .env, just not filled in.",
  },
  {
    title: "A/B test tracking",
    body: "worth building once there's a second price point or promo to actually test against.",
  },
];

export default function MarketingPage() {
  return (
    <div>
      <PageHeader
        title="marketing"
        description="not faked — these need real connections before they'd show real numbers."
      />
      <div className="flex flex-col gap-3">
        {ITEMS.map((item) => (
          <Card key={item.title}>
            <p className="text-sm">{item.title}</p>
            <p className="mt-1 text-xs text-paper/50">{item.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
