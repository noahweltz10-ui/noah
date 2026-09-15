import { getProducts } from "@/lib/shopify";
import { getDashboardUser } from "@/lib/dashboard/session";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/ui";
import InventoryRow from "./InventoryRow";
import PendingChanges from "./PendingChanges";

export default async function InventoryPage() {
  const user = await getDashboardUser();
  const { products } = await getProducts();

  let pendingRequests: Awaited<ReturnType<typeof fetchPending>> = [];
  if (user?.role === "owner") {
    pendingRequests = await fetchPending();
  }

  return (
    <div>
      <PageHeader
        title="inventory & pricing"
        description={
          user?.role === "owner"
            ? "edits go live immediately on the storefront."
            : "changes here are sent to Noah for approval before they go live."
        }
      />

      {user?.role === "owner" && <PendingChanges requests={pendingRequests} />}

      <div className="flex flex-col gap-4">
        {products.map((p) => (
          <InventoryRow key={p.handle} product={p} role={user?.role ?? "staff"} />
        ))}
      </div>
    </div>
  );
}

async function fetchPending() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("change_requests")
    .select("id, entity_id, new_value, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  return data ?? [];
}
