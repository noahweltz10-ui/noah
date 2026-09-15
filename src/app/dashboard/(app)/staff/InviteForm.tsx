"use client";

import { useState } from "react";
import { inviteStaff } from "./actions";

export default function InviteForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async (formData) => {
        setPending(true);
        setError(null);
        const result = await inviteStaff(formData);
        setPending(false);
        if (result.error) setError(result.error);
        else setSuccess(true);
      }}
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-paper/10 bg-paper/[0.03] p-5"
    >
      <div>
        <label className="text-xs uppercase tracking-[0.1em] text-paper/50">name</label>
        <input
          name="displayName"
          required
          placeholder="Tziyon"
          className="mt-1 block w-40 rounded-md border border-paper/15 bg-transparent px-2.5 py-1.5 text-sm outline-none focus:border-paper/40"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.1em] text-paper/50">email</label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 block w-56 rounded-md border border-paper/15 bg-transparent px-2.5 py-1.5 text-sm outline-none focus:border-paper/40"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-paper px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em] text-ink disabled:opacity-40"
      >
        {pending ? "sending…" : "send invite"}
      </button>
      {success && <p className="text-xs text-emerald-300">invite sent.</p>}
      {error && <p className="w-full text-xs text-red-400">{error}</p>}
    </form>
  );
}
