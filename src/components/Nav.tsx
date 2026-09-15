"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { LogoMark } from "./LogoMark";

const LINKS: { href: string; label: string; preview?: boolean }[] = [
  { href: "#drop", label: "shop", preview: true },
  { href: "#brand", label: "brand", preview: true },
  { href: "#contact", label: "contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [preview, setPreview] = useState<{ label: string; x: number; y: number } | null>(
    null
  );
  const { cart, openCart } = useCart();
  const cartBadgeRef = useRef<HTMLSpanElement | null>(null);
  const prevQty = useRef(cart?.totalQuantity ?? 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const qty = cart?.totalQuantity ?? 0;
    if (qty !== prevQty.current && cartBadgeRef.current) {
      const el = cartBadgeRef.current;
      el.classList.remove("cart-badge-pulse");
      // Force reflow so the animation can restart on rapid successive adds.
      void el.offsetWidth;
      el.classList.add("cart-badge-pulse");
    }
    prevQty.current = qty;
  }, [cart?.totalQuantity]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-500",
        "px-4 sm:px-6",
      ].join(" ")}
      style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
    >
      <div
        className={[
          "flex w-full items-center justify-between transition-all duration-500",
          scrolled
            ? "mt-3 max-w-3xl rounded-full border border-ink/10 bg-paper/90 px-5 py-2.5 text-ink shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur"
            : "mt-6 max-w-6xl px-2 py-2 text-paper",
        ].join(" ")}
        style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
      >
        <Link
          href="#top"
          data-cursor="link"
          className="flex items-center gap-2.5"
        >
          <LogoMark width={22} />
          <span
            className={[
              "font-display italic tracking-tight transition-all duration-500",
              scrolled ? "text-base" : "text-lg sm:text-xl",
            ].join(" ")}
          >
            shift culture
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-[0.72rem] uppercase tracking-[0.16em] sm:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-cursor="link"
              className="nav-underline relative py-1"
              onMouseMove={(e) => {
                if (!l.preview) return;
                setPreview({ label: l.label, x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setPreview(null)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={openCart}
            data-cursor="link"
            className="relative text-[0.72rem] uppercase tracking-[0.16em]"
            aria-label="Open cart"
          >
            cart
            {Boolean(cart?.totalQuantity) && (
              <span
                ref={cartBadgeRef}
                className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[0.6rem] text-paper"
              >
                {cart?.totalQuantity}
              </span>
            )}
          </button>

          <button
            type="button"
            className="flex flex-col gap-[5px] sm:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span
              className="h-px w-5 bg-current transition-transform duration-300"
              style={mobileOpen ? { transform: "translateY(3px) rotate(45deg)" } : undefined}
            />
            <span
              className="h-px w-5 bg-current transition-transform duration-300"
              style={mobileOpen ? { transform: "translateY(-3px) rotate(-45deg)" } : undefined}
            />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="absolute left-4 right-4 top-[72px] z-40 rounded-2xl border border-ink/10 bg-paper p-2 shadow-xl sm:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm uppercase tracking-[0.14em]"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

      {preview && (
        <div
          className="pointer-events-none fixed z-[60] hidden -translate-x-1/2 -translate-y-[calc(100%+18px)] sm:block"
          style={{ left: preview.x, top: preview.y }}
        >
          <div className="tex-placeholder flex h-24 w-20 items-end overflow-hidden rounded-md border border-ink/10 bg-paper p-2 shadow-xl">
            <span className="font-display text-xs italic text-ink/40">
              {preview.label}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
