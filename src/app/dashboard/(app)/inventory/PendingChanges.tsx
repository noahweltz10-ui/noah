"use client";

import { useTransition } from "react";
import { reviewChangeRequest } from "./actions";
import { Card } from "@/components/dashboard/ui";

type ChangeRequest = {
  id: number;
  entity_id: string;
  new_value: Record<string, unknown>;
  created_at: string;
};

export default function PendingChanges({ requests }: { requests: ChangeRequest[] }) {
  const [isPending, startTransition] = useTransition();

  if (requests.length === 0) return null;

  return (
    <Card className="mb-6 border-amber-400/25 bg-amber-400/5">
      <p className="text-[0.68rem] uppercase tracking-[0.14em] text-amber-300">
        pending approval ({requests.length})
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {requests.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span>
              {r.entity_id} — {JSON.stringify(r.new_value)}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await reviewChangeRequest(r.id, "approved");
                  })
                }
                className="rounded-full bg-paper px-3 py-1 text-[0.62rem] uppercase tracking-[0.08em] text-ink"
              >
                approve
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await reviewChangeRequest(r.id, "rejected");
                  })
                }
                className="rounded-full border border-paper/20 px-3 py-1 text-[0.62rem] uppercase tracking-[0.08em]"
              >
                reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
