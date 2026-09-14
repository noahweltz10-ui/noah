"use client";

import { useState, type FormEvent } from "react";
import RevealText from "./RevealText";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("done");
      setMessage(data.message ?? "You're on the list.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <RevealText
            as="h2"
            className="font-display text-[clamp(1.9rem,5.5vw,3.4rem)] italic leading-[1.05]"
          >
            become a part of shift culture.
          </RevealText>
          <p
            className="reveal-fade mt-3 max-w-sm text-sm text-ink/60"
            data-reveal
          >
            get exclusive deals and early access to new products.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="reveal-fade flex w-full max-w-md flex-col gap-3 border-b border-ink/20 pb-2 sm:flex-row sm:items-center"
          data-reveal
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email address"
            className="w-full flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-ink/40"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            data-cursor="link"
            className="shrink-0 whitespace-nowrap text-sm uppercase tracking-[0.14em] underline decoration-ink/30 underline-offset-4 hover:decoration-ink disabled:opacity-50"
          >
            {status === "loading" ? "sending…" : "join"}
          </button>
        </form>
      </div>

      {message && (
        <p className="mx-auto mt-4 max-w-6xl px-4 text-xs text-ink/50 sm:px-6" role="status">
          {message}
        </p>
      )}
    </section>
  );
}
