import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import SetupForm from "./SetupForm";

export default async function SetupPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-2xl border border-paper/15 bg-paper/5 p-6 text-sm text-paper/70">
        The dashboard isn&rsquo;t configured yet — it needs
        <code className="mx-1 rounded bg-paper/10 px-1.5 py-0.5 text-xs">
          NEXT_PUBLIC_SUPABASE_URL
        </code>
        and
        <code className="mx-1 rounded bg-paper/10 px-1.5 py-0.5 text-xs">
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
        </code>
        set as environment variables.
      </div>
    );
  }

  const supabase = await createClient();
  const { data: ownerExists } = await supabase.rpc("dashboard_owner_exists");

  if (ownerExists) {
    redirect("/dashboard/login");
  }

  return (
    <div>
      <h1 className="font-display text-2xl italic">create the owner account</h1>
      <p className="mt-2 text-sm text-paper/60">
        This is a one-time setup — the first account created here becomes
        the dashboard owner.
      </p>
      <SetupForm />
    </div>
  );
}
