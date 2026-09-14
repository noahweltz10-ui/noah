"use client";

import { useRef } from "react";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import RevealText from "./RevealText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function DropShowcase({
  products,
  live,
}: {
  products: Product[];
  live: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };
        if (!isDesktop) return;

        const distance = track.scrollWidth - window.innerWidth + 96;
        if (distance <= 0) return;

        const trigger = ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            gsap.set(track, { x: -self.progress * distance });
          },
        });

        return () => trigger.kill();
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section id="drop" className="bg-paper py-24 sm:py-32">
      <div ref={containerRef} className="relative">
        <div className="px-4 sm:px-6">
          <RevealText
            as="h2"
            splitBy="word"
            className="font-display text-[clamp(2.4rem,8vw,5.5rem)] italic leading-[0.95]"
          >
            drop 001
          </RevealText>
          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
            <p className="reveal-fade max-w-md text-sm text-ink/60" data-reveal>
              {live
                ? "the current lineup — pulled live from the shift culture shop."
                : "a preview of the current lineup. connect the shopify storefront api to make this live."}
            </p>
            <a
              href="https://shiftcultr.com/collections/all"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="text-sm underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
            >
              view full catalog
            </a>
          </div>
        </div>

        <div
          ref={trackRef}
          className="no-scrollbar mt-12 flex gap-6 overflow-x-auto px-4 pb-4 sm:gap-10 sm:overflow-visible sm:px-6"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {products.map((product, i) => (
            <div
              key={product.id}
              className="reveal-fade"
              data-reveal
              data-reveal-delay={i * 60}
              style={{ scrollSnapAlign: "start" }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
