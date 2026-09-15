"use client";

import { useState } from "react";
import { scheduleDrop } from "./actions";

export default function DropForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async (formData) => {
        setPending(true);
        setError(null);
        const result = await scheduleDrop(formData);
        setPending(false);
        if (result.error) setError(result.error);
      }}
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-paper/10 bg-paper/[0.03] p-5"
    >
      <div>
        <label className="text-xs uppercase tracking-[0.1em] text-paper/50">title</label>
        <input
          name="title"
          required
          placeholder="drop 002"
          className="mt-1 block w-40 rounded-md border border-paper/15 bg-transparent px-2.5 py-1.5 text-sm outline-none focus:border-paper/40"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.1em] text-paper/50">launch</label>
        <input
          name="launchAt"
          type="datetime-local"
          required
          className="mt-1 block rounded-md border border-paper/15 bg-transparent px-2.5 py-1.5 text-sm outline-none focus:border-paper/40"
        />
      </div>
      <div className="flex-1">
        <label className="text-xs uppercase tracking-[0.1em] text-paper/50">notes</label>
        <input
          name="notes"
          className="mt-1 block w-full rounded-md border border-paper/15 bg-transparent px-2.5 py-1.5 text-sm outline-none focus:border-paper/40"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-paper px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em] text-ink disabled:opacity-40"
      >
        {pending ? "scheduling…" : "schedule"}
      </button>
      {error && <p className="w-full text-xs text-red-400">{error}</p>}
    </form>
  );
}
