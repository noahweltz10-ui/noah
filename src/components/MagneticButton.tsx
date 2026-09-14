"use client";

import { useRef } from "react";
import type { ReactNode, MouseEvent as ReactMouseEvent } from "react";

export default function MagneticButton({
  children,
  className,
  strength = 0.35,
  as: Component = "button",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "button" | "a";
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);

  const onMouseMove = (e: ReactMouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  };

  const Tag = Component as "button";

  return (
    <Tag
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      style={{ transition: "transform 0.25s var(--ease-out-quart)" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
