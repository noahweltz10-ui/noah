"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "./actions";

const STATUSES = ["pending", "fulfilled", "shipped", "cancelled", "refunded"] as const;

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: number;
  status: string;
}) {
  const [value, setValue] = useState(status);
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={value}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        setValue(next);
        startTransition(async () => {
          const result = await updateOrderStatus(orderId, next);
          if (result.error) setValue(status);
        });
      }}
      className="rounded-full border border-paper/15 bg-transparent px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.1em] outline-none"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-ink text-paper">
          {s}
        </option>
      ))}
    </select>
  );
}
