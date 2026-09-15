"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealText from "./RevealText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BrandStatement() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const creamRef = useRef<HTMLDivElement | null>(null);
  const midnightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
      };
      gsap.to(creamRef.current, { yPercent: -8, ease: "none", scrollTrigger: trigger });
      gsap.to(midnightRef.current, { yPercent: 8, ease: "none", scrollTrigger: trigger });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="brand" className="bg-ink py-28 text-paper sm:py-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealText
          as="h2"
          splitBy="word"
          className="font-display text-[clamp(2.2rem,7vw,4.6rem)] italic leading-[1.05]"
        >
          two tones. one drop. no noise.
        </RevealText>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:mt-24 sm:grid-cols-2 sm:gap-16">
          <div className="reveal-mask on-dark relative aspect-[4/5] overflow-hidden" data-reveal>
            <div
              ref={creamRef}
              className="reveal-mask-inner absolute inset-[-6%] flex items-end p-6"
            >
              <Image
                src="/products/shift-cream-pullover-front.webp"
                alt=""
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/80 to-transparent" />
              <span className="relative z-10 text-xs uppercase tracking-[0.2em] text-paper">
                cream
              </span>
            </div>
          </div>
          <div className="reveal-mask on-dark relative aspect-[4/5] overflow-hidden" data-reveal data-reveal-delay="120">
            <div
              ref={midnightRef}
              className="reveal-mask-inner absolute inset-[-6%] flex items-end p-6"
            >
              <Image
                src="/products/shift-midnight-pullover-front.webp"
                alt=""
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/80 to-transparent" />
              <span className="relative z-10 text-xs uppercase tracking-[0.2em] text-paper">
                midnight
              </span>
            </div>
          </div>
        </div>

        <p
          className="reveal-fade mt-16 max-w-lg text-sm leading-relaxed text-paper/60 sm:mt-24"
          data-reveal
        >
          drop 001 — cream and midnight, side by side. pullovers, sweatpants,
          and tees, cut from the same line.
        </p>
      </div>
    </section>
  );
}
