import { createClient } from "@/lib/supabase/server";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";
import InboxItem from "./InboxItem";

export default async function SupportPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("support_inbox")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="support inbox" description="contact form + restock-me submissions, in one place." />

      {!items || items.length === 0 ? (
        <EmptyState title="inbox zero" body="nothing waiting on a reply." />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <InboxItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
