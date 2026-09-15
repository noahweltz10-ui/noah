"use client";

import Image from "next/image";
import { useState } from "react";
import type { FormEvent } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import ViewTransitionLink from "./ViewTransitionLink";

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: amount.endsWith(".00") ? 0 : 2,
  }).format(Number(amount));
}

export default function ProductDetail({ product }: { product: Product }) {
  const { addLine, isLoading } = useCart();
  const firstAvailable = product.variants.find((v) => v.availableForSale);
  const [selectedId, setSelectedId] = useState(firstAvailable?.id ?? product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyStatus, setNotifyStatus] = useState<"idle" | "loading" | "done">("idle");
  const [activeImage, setActiveImage] = useState(0);

  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange?.minVariantPrice;
  const onSale = compareAt && Number(compareAt.amount) > Number(price.amount);
  const soldOut = !product.availableForSale;
  const selectedVariant = product.variants.find((v) => v.id === selectedId);
  const image = product.images[activeImage] ?? product.images[0];

  const handleAdd = async () => {
    if (!selectedVariant?.availableForSale) return;
    await addLine(selectedVariant.id, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  const handleNotify = async (e: FormEvent) => {
    e.preventDefault();
    setNotifyStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: notifyEmail, productHandle: product.handle }),
      });
    } finally {
      setNotifyStatus("done");
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-24 pt-32 sm:gap-16 sm:px-6 sm:pt-40 lg:grid-cols-2 lg:items-start">
      <div className="lg:sticky lg:top-28">
        <ViewTransitionLink
          href="/#drop"
          data-cursor="link"
          className="mb-6 inline-block text-xs uppercase tracking-[0.14em] text-ink/50 underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
        >
          ← back to shop
        </ViewTransitionLink>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/5">
          {image ? (
            <Image
              key={image.url}
              src={image.url}
              alt={image.altText ?? product.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="tex-placeholder flex h-full w-full items-end p-6">
              <span className="font-display text-3xl italic leading-tight text-ink/25">
                {product.title}
              </span>
            </div>
          )}
          {soldOut && (
            <span className="absolute left-4 top-4 rounded-full bg-paper px-3 py-1 text-[0.62rem] uppercase tracking-[0.14em]">
              sold out
            </span>
          )}
          {!soldOut && onSale && (
            <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-paper">
              sale
            </span>
          )}
        </div>

        {product.images.length > 1 && (
          <div className="mt-3 flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={img.url}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
                data-cursor="link"
                className={[
                  "relative aspect-[4/5] w-16 overflow-hidden bg-ink/5 transition-opacity",
                  i === activeImage ? "opacity-100 ring-1 ring-ink/40" : "opacity-50 hover:opacity-80",
                ].join(" ")}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-lg">
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] italic leading-[0.95]">
          {product.title}
        </h1>

        <p className="mt-4 flex items-center gap-3 text-lg">
          <span>{formatPrice(price.amount, price.currencyCode)}</span>
          {onSale && compareAt && (
            <span className="text-ink/40 line-through">
              {formatPrice(compareAt.amount, compareAt.currencyCode)}
            </span>
          )}
        </p>

        <div className="mt-8 border-t border-ink/10 pt-8">
          <p className="text-xs uppercase tracking-[0.14em] text-ink/50">size</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {product.variants.map((variant) => {
              const size = variant.selectedOptions.find((o) => o.name === "Size")?.value ?? variant.title;
              const isSelected = variant.id === selectedId;
              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={!variant.availableForSale}
                  onClick={() => setSelectedId(variant.id)}
                  data-cursor={variant.availableForSale ? "link" : undefined}
                  className={[
                    "relative rounded-xl border py-3 text-sm uppercase transition-colors",
                    isSelected && variant.availableForSale
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/15 text-ink/70 hover:border-ink/40",
                    !variant.availableForSale && "cursor-not-allowed text-ink/25 hover:border-ink/15",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {size}
                  {!variant.availableForSale && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-xl"
                      style={{
                        background:
                          "linear-gradient(to top right, transparent calc(50% - 0.5px), currentColor, transparent calc(50% + 0.5px))",
                        opacity: 0.35,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {soldOut ? (
          <form onSubmit={handleNotify} className="mt-8 flex items-center gap-2 border-b border-ink/20 pb-2">
            {notifyStatus === "done" ? (
              <p className="py-2 text-sm text-ink/50">we&rsquo;ll email you when it&rsquo;s back.</p>
            ) : (
              <>
                <input
                  type="email"
                  required
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="notify me when back"
                  className="w-full flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-ink/40"
                />
                <button
                  type="submit"
                  disabled={notifyStatus === "loading"}
                  data-cursor="link"
                  className="shrink-0 text-xs uppercase tracking-[0.1em] underline decoration-ink/30 underline-offset-4 hover:decoration-ink disabled:opacity-50"
                >
                  {notifyStatus === "loading" ? "…" : "notify"}
                </button>
              </>
            )}
          </form>
        ) : (
          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-ink/15">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="px-3 py-2.5 text-sm"
              >
                −
              </button>
              <span className="min-w-[1.5rem] text-center text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="px-3 py-2.5 text-sm"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={isLoading || !selectedVariant?.availableForSale}
              data-cursor="link"
              className="flex-1 rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-30"
            >
              {justAdded ? "added" : "add to cart"}
            </button>
          </div>
        )}

        <p className="mt-10 whitespace-pre-line text-sm leading-relaxed text-ink/70">
          {product.description}
        </p>
      </div>
    </div>
  );
}
