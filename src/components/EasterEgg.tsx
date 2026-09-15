"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

const TRIGGER = "sparkle";

export default function EasterEgg() {
  const [active, setActive] = useState(false);
  const markRef = useRef<HTMLDivElement | null>(null);
  const buffer = useRef("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typingInField =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typingInField) return;

      if (e.key.length === 1) {
        buffer.current = (buffer.current + e.key.toLowerCase()).slice(
          -TRIGGER.length
        );
        if (buffer.current === TRIGGER) {
          buffer.current = "";
          setActive(true);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!active || !markRef.current) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      const timeout = window.setTimeout(() => setActive(false), 900);
      return () => window.clearTimeout(timeout);
    }

    const tl = gsap.timeline({
      onComplete: () => setActive(false),
    });
    tl.fromTo(
      markRef.current,
      { xPercent: -120, rotate: -25, opacity: 0, scale: 0.6 },
      { xPercent: 0, rotate: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.6)" }
    ).to(markRef.current, {
      xPercent: 120,
      rotate: 25,
      opacity: 0,
      duration: 0.6,
      ease: "expo.in",
      delay: 0.35,
    });

    return () => {
      tl.kill();
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[300] flex items-center justify-center"
      aria-hidden="true"
    >
      <div ref={markRef} className="relative h-[22vh] w-[22vh] max-h-56 max-w-56">
        <Image
          src="/brand/shift-culture-logo-outlined.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
