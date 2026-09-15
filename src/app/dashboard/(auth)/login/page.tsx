import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
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

  if (!ownerExists) {
    redirect("/dashboard/setup");
  }

  return (
    <div>
      <h1 className="font-display text-2xl italic">dashboard login</h1>
      <p className="mt-2 text-sm text-paper/60">shift culture — staff access only.</p>
      <LoginForm />
    </div>
  );
}
