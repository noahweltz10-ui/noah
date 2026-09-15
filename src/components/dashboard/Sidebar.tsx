"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_GROUPS } from "./nav";

export default function Sidebar({ role }: { role: "owner" | "staff" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-6">
      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="px-3 text-[0.62rem] uppercase tracking-[0.18em] text-paper/35">
            {group.title}
          </p>
          <div className="mt-2 flex flex-col gap-0.5">
            {group.items
              .filter((item) => !item.ownerOnly || role === "owner")
              .map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "rounded-lg px-3 py-2 text-sm transition-colors",
                      active ? "bg-paper/10 text-paper" : "text-paper/60 hover:bg-paper/5 hover:text-paper",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-paper/15 bg-ink text-paper print:hidden lg:hidden"
        aria-label="Open navigation"
      >
        <span className="flex flex-col gap-[5px]">
          <span className="h-px w-4 bg-current" />
          <span className="h-px w-4 bg-current" />
        </span>
      </button>

      <aside className="hidden w-60 shrink-0 border-r border-paper/10 bg-ink px-3 py-8 print:hidden lg:block">
        {nav}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-64 overflow-y-auto border-r border-paper/10 bg-ink px-3 py-8">
            {nav}
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            className="flex-1 bg-ink/60"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </>
  );
}
