"use client";

import Image from "next/image";
import { useCart } from "./CartProvider";

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}

export default function CartDrawer() {
  const { cart, isOpen, closeCart, updateLine, removeLine, isLoading } = useCart();

  return (
    <>
      <div
        className={[
          "fixed inset-0 z-[90] bg-ink/40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        className={[
          "fixed right-0 top-0 z-[95] flex h-full w-full max-w-sm flex-col bg-paper shadow-2xl transition-transform duration-500",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
        role="dialog"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="text-sm uppercase tracking-[0.14em]">cart</h2>
          <button type="button" onClick={closeCart} aria-label="Close cart" data-cursor="link">
            close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!cart || cart.lines.length === 0 ? (
            <p className="mt-10 text-sm text-ink/50">your cart is empty.</p>
          ) : (
            <ul className="flex flex-col gap-6">
              {cart.lines.map((line) => (
                <li key={line.id} className="flex gap-4">
                  <div className="tex-placeholder relative h-20 w-16 shrink-0 overflow-hidden">
                    {line.merchandise.image && (
                      <Image
                        src={line.merchandise.image.url}
                        alt={line.merchandise.image.altText ?? line.merchandise.product.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-sm">{line.merchandise.product.title}</p>
                    <p className="text-xs text-ink/50">
                      {formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => updateLine(line.id, Math.max(0, line.quantity - 1))}
                        disabled={isLoading}
                        aria-label="Decrease quantity"
                        data-cursor="link"
                      >
                        −
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateLine(line.id, line.quantity + 1)}
                        disabled={isLoading}
                        aria-label="Increase quantity"
                        data-cursor="link"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        disabled={isLoading}
                        className="ml-2 underline decoration-ink/30 underline-offset-4"
                        data-cursor="link"
                      >
                        remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart && cart.lines.length > 0 && (
          <div className="border-t border-ink/10 px-6 py-5">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span>subtotal</span>
              <span>
                {formatPrice(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
              </span>
            </div>
            <a
              href={cart.checkoutUrl}
              data-cursor="link"
              className="block w-full rounded-full bg-ink py-3 text-center text-sm uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-85"
            >
              checkout
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
