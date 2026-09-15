"use client";

import { useState } from "react";
import { addChangelogEntry } from "./actions";

export default function ChangelogForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async (formData: FormData) => {
        setPending(true);
        setError(null);
        const result = await addChangelogEntry(formData);
        setPending(false);
        if (result.error) setError(result.error);
        else (document.getElementById("changelog-form") as HTMLFormElement)?.reset();
      }}
      id="changelog-form"
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-paper/10 bg-paper/[0.03] p-5"
    >
      <div className="flex-1">
        <label className="text-xs uppercase tracking-[0.1em] text-paper/50">what changed</label>
        <input
          name="summary"
          required
          placeholder="Dropped the midnight t-shirt price to $30 for the weekend"
          className="mt-1 block w-full rounded-md border border-paper/15 bg-transparent px-2.5 py-1.5 text-sm outline-none focus:border-paper/40"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-paper px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em] text-ink disabled:opacity-40"
      >
        {pending ? "posting…" : "post"}
      </button>
      {error && <p className="w-full text-xs text-red-400">{error}</p>}
    </form>
  );
}
