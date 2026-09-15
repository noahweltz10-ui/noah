import { redirect } from "next/navigation";
import { getDashboardUser } from "@/lib/dashboard/session";
import { pickGreeting } from "@/lib/dashboard/greetings";
import Sidebar from "@/components/dashboard/Sidebar";
import ThemeToggle from "@/components/dashboard/ThemeToggle";
import { signOut } from "./actions";

export default async function DashboardAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getDashboardUser();
  if (!user) redirect("/dashboard/login");

  const firstName = user.displayName.split(" ")[0];

  return (
    <div className="dashboard-root flex min-h-screen bg-ink text-paper">
      <Sidebar role={user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-paper/10 px-4 py-4 pl-16 print:hidden lg:px-8 lg:pl-8">
          <div>
            <p className="text-sm">{pickGreeting(firstName)}</p>
            <p className="mt-0.5 text-[0.68rem] uppercase tracking-[0.12em] text-paper/40">
              {user.role === "owner" ? "owner" : "staff"} — {user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-paper/15 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.12em] text-paper/70 hover:text-paper"
              >
                sign out
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
