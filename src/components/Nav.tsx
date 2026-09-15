"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { LogoBadge } from "./LogoMark";

const LINKS = [
  { href: "#drop", label: "shop" },
  { href: "#brand", label: "brand" },
  { href: "#contact", label: "contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cart, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <LogoBadge width={16} padding={7} />
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
            <a key={l.href} href={l.href} data-cursor="link" className="opacity-70 transition-opacity hover:opacity-100">
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
              <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[0.6rem] text-paper">
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
    </header>
  );
}
