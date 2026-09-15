"use client";

import { useState } from "react";
import { createDiscount } from "./actions";

export default function DiscountForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async (formData) => {
        setPending(true);
        setError(null);
        const result = await createDiscount(formData);
        setPending(false);
        if (result.error) setError(result.error);
      }}
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-paper/10 bg-paper/[0.03] p-5"
    >
      <div>
        <label className="text-xs uppercase tracking-[0.1em] text-paper/50">code</label>
        <input
          name="code"
          required
          placeholder="SHIFT20"
          className="mt-1 block w-32 rounded-md border border-paper/15 bg-transparent px-2.5 py-1.5 text-sm outline-none focus:border-paper/40"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.1em] text-paper/50">type</label>
        <select
          name="kind"
          className="mt-1 block rounded-md border border-paper/15 bg-transparent px-2.5 py-1.5 text-sm outline-none"
        >
          <option value="percent" className="bg-ink">percent off</option>
          <option value="fixed" className="bg-ink">fixed amount</option>
        </select>
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.1em] text-paper/50">value</label>
        <input
          name="value"
          type="number"
          step="0.01"
          required
          className="mt-1 block w-24 rounded-md border border-paper/15 bg-transparent px-2.5 py-1.5 text-sm outline-none focus:border-paper/40"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.1em] text-paper/50">usage limit</label>
        <input
          name="usageLimit"
          type="number"
          placeholder="unlimited"
          className="mt-1 block w-28 rounded-md border border-paper/15 bg-transparent px-2.5 py-1.5 text-sm outline-none focus:border-paper/40"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-paper px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em] text-ink disabled:opacity-40"
      >
        {pending ? "creating…" : "create code"}
      </button>
      {error && <p className="w-full text-xs text-red-400">{error}</p>}
    </form>
  );
}
