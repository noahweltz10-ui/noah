"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wordmarkRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const subRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([wordmarkRef.current, subRef.current], { opacity: 1, y: 0 });
        return;
      }

      gsap.set(subRef.current, { opacity: 0, y: 16 });
      gsap
        .timeline({ delay: 0.15 })
        .to(wordmarkRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "expo.out",
        })
        .to(
          subRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" },
          "-=0.6"
        );

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      })
        .to(wordmarkRef.current, { scale: 0.72, yPercent: -8, ease: "none" }, 0)
        .to(imageRef.current, { scale: 1.18, ease: "none" }, 0)
        .to(sectionRef.current, { opacity: 1 }, 0)
        .to(subRef.current, { opacity: 0, y: -20, ease: "none" }, 0);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex h-[100svh] min-h-[560px] w-full items-end overflow-hidden bg-ink text-paper"
    >
      <div ref={imageRef} className="tex-placeholder-dark absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
      </div>

      <div className="relative z-10 flex w-full flex-col gap-8 px-4 pb-14 sm:px-6 sm:pb-20">
        <div
          ref={wordmarkRef}
          className="origin-bottom-left font-display leading-[0.86] italic opacity-0 translate-y-6"
          style={{ fontSize: "clamp(3.2rem, 13vw, 11rem)" }}
        >
          shift
          <br />
          culture
        </div>

        <div ref={subRef} className="flex max-w-xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm uppercase tracking-[0.2em] text-paper/70">
            drop 001 — now available
          </p>
          <a
            href="#drop"
            data-cursor="link"
            data-cursor-text="scroll"
            className="text-sm underline decoration-paper/40 underline-offset-4 transition-colors hover:decoration-paper"
          >
            view the drop
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-paper/60 sm:flex">
        <span className="text-[0.62rem] uppercase tracking-[0.3em]">scroll</span>
        <span className="h-10 w-px bg-paper/40" />
      </div>
    </section>
  );
}
