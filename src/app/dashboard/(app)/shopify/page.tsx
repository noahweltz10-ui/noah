import { PageHeader, Card, Badge } from "@/components/dashboard/ui";
import { isShopifyConfigured } from "@/lib/shopify";

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const ADMIN_SYNC_CONFIGURED = Boolean(process.env.SHOPIFY_ADMIN_API_TOKEN);

const CUT_ITEMS = [
  { label: "orders & payouts", path: "orders" },
  { label: "tax settings", path: "settings/taxes" },
  { label: "chargebacks & disputes", path: "orders" },
  { label: "fraud analysis", path: "orders" },
  { label: "shipping labels", path: "settings/shipping" },
  { label: "returns & exchanges", path: "settings/policies" },
  { label: "vendor / cost of goods", path: "products" },
];

export default function ShopifyAdminPage() {
  const adminBase = STORE_DOMAIN
    ? `https://${STORE_DOMAIN.replace(".myshopify.com", "")}.myshopify.com/admin`
    : null;

  return (
    <div>
      <PageHeader
        title="shopify admin"
        description="tax, fraud, chargebacks, and shipping are Shopify's job, not a shadow rebuild — open them directly."
      />

      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm">storefront data (products, checkout)</p>
            <p className="text-xs text-paper/50">Storefront API</p>
          </div>
          <Badge tone={isShopifyConfigured ? "success" : "neutral"}>
            {isShopifyConfigured ? "connected" : "not connected"}
          </Badge>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-paper/10 pt-3">
          <div>
            <p className="text-sm">orders / inventory / customers sync</p>
            <p className="text-xs text-paper/50">Admin API — needs SHOPIFY_ADMIN_API_TOKEN</p>
          </div>
          <Badge tone={ADMIN_SYNC_CONFIGURED ? "success" : "neutral"}>
            {ADMIN_SYNC_CONFIGURED ? "connected" : "not connected — using dashboard's own data"}
          </Badge>
        </div>
      </Card>

      <p className="mb-3 text-[0.68rem] uppercase tracking-[0.14em] text-paper/45">
        open in shopify
      </p>
      <div className="flex flex-col gap-2">
        {CUT_ITEMS.map((item) =>
          adminBase ? (
            <a
              key={item.label}
              href={`${adminBase}/${item.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-paper/10 bg-paper/[0.03] px-4 py-3 text-sm hover:bg-paper/[0.06]"
            >
              {item.label} <span className="text-paper/40">→</span>
            </a>
          ) : (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl border border-paper/10 bg-paper/[0.03] px-4 py-3 text-sm text-paper/40"
            >
              {item.label} <span>set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN to enable</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
