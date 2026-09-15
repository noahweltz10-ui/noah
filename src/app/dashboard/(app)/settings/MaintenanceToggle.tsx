"use client";

import { useState, useTransition } from "react";
import { setMaintenanceMode } from "./actions";

export default function MaintenanceToggle({
  initialEnabled,
  initialMessage,
}: {
  initialEnabled: boolean;
  initialMessage: string;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [message, setMessage] = useState(initialMessage);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const save = (next: boolean) => {
    setEnabled(next);
    startTransition(async () => {
      const result = await setMaintenanceMode(next, message);
      if (!result.error) {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2000);
      }
    });
  };

  return (
    <div className="rounded-2xl border border-paper/10 bg-paper/[0.03] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm">maintenance mode</p>
          <p className="text-xs text-paper/50">
            takes the storefront and product pages offline with a holding page. the dashboard stays up.
          </p>
        </div>
        <button
          type="button"
          disabled={isPending}
          onClick={() => save(!enabled)}
          className={[
            "rounded-full px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em]",
            enabled ? "bg-red-400/20 text-red-300" : "bg-paper text-ink",
          ].join(" ")}
        >
          {enabled ? "turn off" : "turn on"}
        </button>
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onBlur={() => save(enabled)}
        placeholder="we're making a quick update — check back in a bit."
        className="mt-4 w-full rounded-md border border-paper/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-paper/40"
      />
      {saved && <p className="mt-2 text-xs text-emerald-300">saved.</p>}
    </div>
  );
}
