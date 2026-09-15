"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "./actions";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setPending(true);
    setError(null);
    const result = await login(formData);
    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form action={handleSubmit} className="mt-8 flex flex-col gap-4">
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
          className="mt-1.5 w-full rounded-lg border border-paper/15 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-paper/40"
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-paper px-6 py-3 text-xs uppercase tracking-[0.14em] text-ink transition-opacity hover:opacity-85 disabled:opacity-40"
      >
        {pending ? "signing in…" : "sign in"}
      </button>
    </form>
  );
}
