import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Anonymous, session-less client for reads that don't need cookies/auth —
 * e.g. the storefront pulling live price/stock overrides written from the
 * dashboard. Row-level security (not this client) is what actually gates
 * access; this just avoids the request-context plumbing the cookie-bound
 * client needs.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);
