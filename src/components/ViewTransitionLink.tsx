"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

type Props = ComponentProps<typeof Link>;

// Progressive enhancement: uses the native View Transitions API when the
// browser supports it (Chrome/Edge today), falls back to a plain Next.js
// navigation everywhere else — never blocks the click.
export default function ViewTransitionLink({ href, onClick, children, ...rest }: Props) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (typeof document === "undefined" || !("startViewTransition" in document)) return;

    e.preventDefault();
    const target = typeof href === "string" ? href : (href.pathname ?? "/");
    (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(
      () => {
        router.push(target);
      }
    );
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
