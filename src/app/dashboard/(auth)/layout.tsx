import { LogoMark } from "@/components/LogoMark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 text-paper">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <LogoMark width={20} />
          <span className="font-display text-lg italic">shift culture</span>
        </div>
        {children}
      </div>
    </div>
  );
}
