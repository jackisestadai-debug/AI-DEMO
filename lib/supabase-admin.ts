import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only client using the service role key. Returns null when the store's
// Supabase env vars aren't configured yet, so checkout can still run in test mode.
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
