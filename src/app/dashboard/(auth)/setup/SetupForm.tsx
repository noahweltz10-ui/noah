"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeSetup } from "./actions";

export default function SetupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setPending(true);
    setError(null);
    const result = await completeSetup(formData);
    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.needsEmailConfirm) {
      setMessage(result.message ?? "Check your email to confirm your account.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  if (message) {
    return <p className="mt-8 text-sm text-paper/70">{message}</p>;
  }

  return (
    <form action={handleSubmit} className="mt-8 flex flex-col gap-4">
      <div>
        <label className="text-xs uppercase tracking-[0.14em] text-paper/50">
          your name
        </label>
        <input
          name="displayName"
          required
          className="mt-1.5 w-full rounded-lg border border-paper/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-paper/40"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.14em] text-paper/50">
          email
        </label>
        <input
          name="email"
          type="email"
          required
          className="mt-1.5 w-full rounded-lg border border-paper/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-paper/40"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.14em] text-paper/50">
          password
        </label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="mt-1.5 w-full rounded-lg border border-paper/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-paper/40"
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-paper px-6 py-3 text-xs uppercase tracking-[0.14em] text-ink transition-opacity hover:opacity-85 disabled:opacity-40"
      >
        {pending ? "creating…" : "create owner account"}
      </button>
    </form>
  );
}
