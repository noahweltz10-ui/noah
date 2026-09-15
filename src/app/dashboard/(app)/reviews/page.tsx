import { createClient } from "@/lib/supabase/server";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";
import ReviewRow from "./ReviewRow";

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="reviews" description="approve before they show up on product pages." />
      {!reviews || reviews.length === 0 ? (
        <EmptyState title="no reviews yet" body="submissions will land here for approval." />
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <ReviewRow key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
