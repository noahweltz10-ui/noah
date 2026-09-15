"use client";

import { useTransition } from "react";
import { Badge } from "@/components/dashboard/ui";
import { toggleDiscount } from "./actions";

type Discount = {
  id: number;
  code: string;
  kind: "percent" | "fixed";
  value: number;
  usage_limit: number | null;
  used_count: number;
  active: boolean;
};

export default function DiscountRow({ discount }: { discount: Discount }) {
  const [isPending, startTransition] = useTransition();

  return (
    <tr className="border-b border-paper/5 last:border-0">
      <td className="px-5 py-3 font-medium">{discount.code}</td>
      <td className="px-5 py-3">
        {discount.kind === "percent" ? `${discount.value}%` : `$${discount.value}`}
      </td>
      <td className="px-5 py-3">
        {discount.used_count}
        {discount.usage_limit ? ` / ${discount.usage_limit}` : ""}
      </td>
      <td className="px-5 py-3">
        <Badge tone={discount.active ? "success" : "neutral"}>
          {discount.active ? "active" : "disabled"}
        </Badge>
      </td>
      <td className="px-5 py-3">
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await toggleDiscount(discount.id, !discount.active);
            })
          }
          className="text-xs underline decoration-paper/30 underline-offset-4 hover:decoration-paper"
        >
          {discount.active ? "disable" : "enable"}
        </button>
      </td>
    </tr>
  );
}
