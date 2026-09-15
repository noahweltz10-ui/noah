"use client";

import { useTransition } from "react";
import { Badge } from "@/components/dashboard/ui";
import { markInboxStatus } from "./actions";

type Item = {
  id: number;
  kind: "contact" | "notify_me";
  name: string | null;
  email: string;
  message: string | null;
  product_handle: string | null;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
};

export default function InboxItem({ item }: { item: Item }) {
  const [isPending, startTransition] = useTransition();

  const tone = item.status === "new" ? "warning" : item.status === "archived" ? "neutral" : "success";

  return (
    <div className="rounded-2xl border border-paper/10 bg-paper/[0.03] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone={item.kind === "notify_me" ? "neutral" : "warning"}>
              {item.kind === "notify_me" ? "restock request" : "contact form"}
            </Badge>
            <Badge tone={tone}>{item.status}</Badge>
          </div>
          <p className="mt-2 text-sm">{item.name ?? item.email}</p>
          <p className="text-xs text-paper/45">{item.email}</p>
          {item.product_handle && (
            <p className="mt-1 text-xs text-paper/50">product: {item.product_handle}</p>
          )}
          {item.message && <p className="mt-2 max-w-lg text-sm text-paper/75">{item.message}</p>}
        </div>
        <p className="text-xs text-paper/35">{new Date(item.created_at).toLocaleString()}</p>
      </div>

      {item.status !== "archived" && (
        <div className="mt-4 flex gap-2">
          {item.status === "new" && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => startTransition(async () => { await markInboxStatus(item.id, "read"); })}
              className="rounded-full border border-paper/15 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.08em]"
            >
              mark read
            </button>
          )}
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(async () => { await markInboxStatus(item.id, "replied"); })}
            className="rounded-full border border-paper/15 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.08em]"
          >
            mark replied
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(async () => { await markInboxStatus(item.id, "archived"); })}
            className="rounded-full border border-paper/15 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.08em]"
          >
            archive
          </button>
        </div>
      )}
    </div>
  );
}
