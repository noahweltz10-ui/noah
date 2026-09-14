"use client";

import { useState, type FormEvent } from "react";
import RevealText from "./RevealText";

export default function ContactSection() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", comment: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  const onChange = (key: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("done");
      setMessage(data.message ?? "Message sent.");
      setValues({ name: "", email: "", phone: "", comment: "" });
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section id="contact" className="bg-ink py-24 text-paper sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <RevealText
          as="h2"
          className="font-display text-[clamp(2.4rem,7vw,4rem)] italic leading-[0.95]"
        >
          contact
        </RevealText>

        <form onSubmit={onSubmit} className="mt-14 flex flex-col gap-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <Field label="name" required value={values.name} onChange={onChange("name")} />
            <Field
              label="email"
              type="email"
              required
              value={values.email}
              onChange={onChange("email")}
            />
          </div>
          <Field label="phone" type="tel" value={values.phone} onChange={onChange("phone")} />
          <div>
            <label className="text-[0.68rem] uppercase tracking-[0.16em] text-paper/50">
              comment
            </label>
            <textarea
              value={values.comment}
              onChange={onChange("comment")}
              rows={4}
              className="mt-2 w-full resize-none border-b border-paper/25 bg-transparent py-2 text-base outline-none transition-colors focus:border-paper"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            data-cursor="link"
            className="mt-4 self-start rounded-full border border-paper px-8 py-3 text-sm uppercase tracking-[0.14em] transition-colors hover:bg-paper hover:text-ink disabled:opacity-50"
          >
            {status === "loading" ? "sending…" : "submit"}
          </button>

          {message && (
            <p className="text-xs text-paper/50" role="status">
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  type = "text",
  required,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="text-[0.68rem] uppercase tracking-[0.16em] text-paper/50">
        {label}
        {required && " *"}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="mt-2 w-full border-b border-paper/25 bg-transparent py-2 text-base outline-none transition-colors focus:border-paper"
      />
    </div>
  );
}
