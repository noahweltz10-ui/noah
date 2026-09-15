import { LogoMark } from "./LogoMark";

export default function MaintenanceSplash({ message }: { message?: string | null }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-6 text-center text-paper">
      <LogoMark width={40} />
      <h1 className="font-display text-3xl italic">back shortly.</h1>
      <p className="max-w-sm text-sm text-paper/60">
        {message || "we're making a quick update — check back in a bit."}
      </p>
    </main>
  );
}
