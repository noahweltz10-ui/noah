"use client";

import { useState, useTransition } from "react";
import type { Product } from "@/lib/types";
import { submitInventoryChange } from "./actions";

export default function InventoryRow({
  product,
  role,
}: {
  product: Product;
  role: "owner" | "staff";
}) {
  const [price, setPrice] = useState(product.priceRange.minVariantPrice.amount);
  const [compareAt, setCompareAt] = useState(
    product.compareAtPriceRange?.minVariantPrice.amount ?? ""
  );
  const [sizes, setSizes] = useState(
    Object.fromEntries(
      product.variants.map((v) => [
        v.selectedOptions.find((o) => o.name === "Size")?.value ?? v.title,
        v.availableForSale,
      ])
    )
  );
  const [status, setStatus] = useState<"idle" | "saved" | "requested">("idle");
  const [isPending, startTransition] = useTransition();

  const save = () => {
    startTransition(async () => {
      const result = await submitInventoryChange(product.handle, {
        price,
        compareAtPrice: compareAt,
        sizeAvailability: sizes,
      });
      if (!result.error) {
        setStatus(result.applied ? "saved" : "requested");
        window.setTimeout(() => setStatus("idle"), 2500);
      }
    });
  };

  return (
    <div className="rounded-2xl border border-paper/10 bg-paper/[0.03] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm">{product.title}</p>
          <p className="text-xs text-paper/40">{product.handle}</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-paper/50">
            $
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-16 rounded-md border border-paper/15 bg-transparent px-2 py-1 outline-none focus:border-paper/40"
            />
          </label>
          <label className="flex items-center gap-1.5 text-xs text-paper/50">
            was $
            <input
              value={compareAt}
              onChange={(e) => setCompareAt(e.target.value)}
              className="w-16 rounded-md border border-paper/15 bg-transparent px-2 py-1 outline-none focus:border-paper/40"
            />
          </label>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(sizes).map(([size, available]) => (
          <button
            key={size}
            type="button"
            onClick={() => setSizes((prev) => ({ ...prev, [size]: !prev[size] }))}
            className={[
              "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.08em] transition-colors",
              available
                ? "border-paper/30 bg-paper/10 text-paper"
                : "border-paper/10 text-paper/35 line-through",
            ].join(" ")}
          >
            {size}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="rounded-full bg-paper px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em] text-ink disabled:opacity-40"
        >
          {isPending
            ? "saving…"
            : role === "owner"
              ? "save changes"
              : "submit for approval"}
        </button>
        {status === "saved" && <span className="text-xs text-emerald-300">saved live.</span>}
        {status === "requested" && (
          <span className="text-xs text-amber-300">sent to Noah for approval.</span>
        )}
      </div>
    </div>
  );
}
