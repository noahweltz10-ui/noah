"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: amount.endsWith(".00") ? 0 : 2,
  }).format(Number(amount));
}

export default function ProductCard({ product }: { product: Product }) {
  const { addLine, isLoading } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange?.minVariantPrice;
  const onSale =
    compareAt && Number(compareAt.amount) > Number(price.amount);
  const image = product.images[0];
  const defaultVariant = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const soldOut = !product.availableForSale;

  const handleAdd = async () => {
    if (!defaultVariant) return;
    await addLine(defaultVariant.id, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  const handleTilt = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const resetTilt = () => {
    const el = frameRef.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)";
  };

  return (
    <div className="group flex w-[78vw] shrink-0 flex-col gap-4 sm:w-[340px]">
      <div
        ref={frameRef}
        onMouseMove={handleTilt}
        onMouseLeave={resetTilt}
        className="reveal-mask relative aspect-[4/5] w-full overflow-hidden bg-ink/5 transition-transform duration-300 ease-out"
        data-reveal
        data-cursor={soldOut ? undefined : "hover"}
        data-cursor-text={soldOut ? undefined : "view"}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="reveal-mask-inner absolute inset-0">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? product.title}
              fill
              sizes="(min-width: 640px) 340px, 78vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="tex-placeholder flex h-full w-full items-end p-5">
              <span className="font-display text-2xl italic leading-tight text-ink/25">
                {product.title}
              </span>
            </div>
          )}
        </div>
        {soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-paper px-3 py-1 text-[0.62rem] uppercase tracking-[0.14em]">
            sold out
          </span>
        )}
        {!soldOut && onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-paper">
            sale
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm">{product.title}</h3>
          <p className="mt-1 flex items-center gap-2 text-sm">
            <span>{formatPrice(price.amount, price.currencyCode)}</span>
            {onSale && compareAt && (
              <span className="text-ink/40 line-through">
                {formatPrice(compareAt.amount, compareAt.currencyCode)}
              </span>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut || isLoading || !defaultVariant}
          data-cursor="link"
          className="shrink-0 whitespace-nowrap rounded-full border border-ink px-4 py-2 text-[0.68rem] uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
        >
          {soldOut ? "sold out" : justAdded ? "added" : "add to cart"}
        </button>
      </div>
    </div>
  );
}
