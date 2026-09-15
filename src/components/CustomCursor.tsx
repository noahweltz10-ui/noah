"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isTouch) return;

    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let renderedX = x;
    let renderedY = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const loop = () => {
      renderedX += (x - renderedX) * 0.22;
      renderedY += (y - renderedY) * 0.22;
      dot.style.transform = `translate(${renderedX}px, ${renderedY}px) translate(-50%, -50%)`;
      label.style.transform = `translate(${renderedX}px, ${renderedY + 34}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor]"
      );
      if (!target) {
        dot.dataset.state = "";
        label.dataset.visible = "false";
        return;
      }
      const kind = target.dataset.cursor;
      dot.dataset.state = kind ?? "hover";
      const text = target.dataset.cursorText;
      if (text) {
        label.textContent = text;
        label.dataset.visible = "true";
      } else {
        label.dataset.visible = "false";
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={labelRef} className="cursor-label" aria-hidden="true" />
    </>
  );
}
