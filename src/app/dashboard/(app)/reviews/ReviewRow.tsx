"use client";

import { useTransition } from "react";
import { Badge } from "@/components/dashboard/ui";
import { moderateReview } from "./actions";

type Review = {
  id: number;
  product_handle: string;
  author_name: string;
  rating: number;
  body: string | null;
  status: "pending" | "approved" | "rejected";
};

export default function ReviewRow({ review }: { review: Review }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-2xl border border-paper/10 bg-paper/[0.03] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm">
            {review.author_name} — {"★".repeat(review.rating)}
            {"☆".repeat(5 - review.rating)}
          </p>
          <p className="text-xs text-paper/45">{review.product_handle}</p>
        </div>
        <Badge
          tone={
            review.status === "approved" ? "success" : review.status === "rejected" ? "danger" : "warning"
          }
        >
          {review.status}
        </Badge>
      </div>
      {review.body && <p className="mt-2 text-sm text-paper/75">{review.body}</p>}
      {review.status === "pending" && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(async () => { await moderateReview(review.id, "approved"); })}
            className="rounded-full bg-paper px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.08em] text-ink"
          >
            approve
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(async () => { await moderateReview(review.id, "rejected"); })}
            className="rounded-full border border-paper/20 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.08em]"
          >
            reject
          </button>
        </div>
      )}
    </div>
  );
}
