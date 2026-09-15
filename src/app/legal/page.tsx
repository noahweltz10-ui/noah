import type { Metadata } from "next";
import ViewTransitionLink from "@/components/ViewTransitionLink";

export const metadata: Metadata = { title: "Terms and Policies" };

export default function LegalPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-32 sm:px-6">
      <ViewTransitionLink
        href="/"
        data-cursor="link"
        className="text-xs uppercase tracking-[0.14em] text-ink/50 underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
      >
        ← back
      </ViewTransitionLink>
      <h1 className="mt-6 font-display text-4xl italic">terms and policies</h1>
      <p className="mt-8 rounded-2xl border border-dashed border-ink/30 bg-ink/5 p-6 text-sm leading-relaxed text-ink/70">
        Placeholder — the real Terms of Service, Privacy Policy, Shipping,
        and Returns copy from shiftcultr.com&rsquo;s Shopify policies needs
        to be dropped in here before this page goes live. Nothing on this
        page is legally binding yet.
      </p>
    </main>
  );
}
