"use client";

import { useState, useTransition } from "react";
import { requestPasswordReset } from "./actions";

export default function PasswordReset() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-2xl border border-paper/10 bg-paper/[0.03] p-5">
      <p className="text-sm">password</p>
      <p className="mt-1 text-xs text-paper/50">sends a reset link to your account email.</p>
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const result = await requestPasswordReset();
            setStatus(result.error ? "error" : "sent");
          })
        }
        className="mt-3 rounded-full border border-paper/20 px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
      >
        send reset link
      </button>
      {status === "sent" && <p className="mt-2 text-xs text-emerald-300">check your email.</p>}
      {status === "error" && <p className="mt-2 text-xs text-red-400">couldn&rsquo;t send it — try again.</p>}
    </div>
  );
}
