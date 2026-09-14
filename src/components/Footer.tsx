import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-paper px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 border-t border-ink/10 pt-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-xl italic">shift culture</p>
          <p className="mt-2 text-xs text-ink/50">
            drop 001 — cream / midnight
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-xs uppercase tracking-[0.14em]">
          <a href="#top" data-cursor="link">home</a>
          <a href="#drop" data-cursor="link">shop</a>
          <a href="#brand" data-cursor="link">brand</a>
          <a href="#contact" data-cursor="link">contact</a>
        </nav>

        <div className="flex flex-col gap-2 text-xs text-ink/50">
          <span>© {year} shift culture</span>
          <Link href="/legal" data-cursor="link" className="underline decoration-ink/20 underline-offset-4 hover:decoration-ink">
            terms and policies
          </Link>
        </div>
      </div>
    </footer>
  );
}
