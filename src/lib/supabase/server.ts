import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfig, authCookieOptions } from "./config";
export async function serverSupabase() {
  const config = supabaseConfig();
  if (!config) return null;
  const jar = await cookies();
  return createServerClient(config.url, config.key, { cookieOptions: authCookieOptions, cookies: {
    getAll: () => jar.getAll(),
    setAll(values) { try { for (const { name, value, options } of values) jar.set(name, value, options); } catch { /* Server Components are read-only; Proxy refreshes cookies. */ } },
  } });
}
export async function verifiedOwner() {
  const client = await serverSupabase();
  if (!client) return null;
  const { data, error } = await client.auth.getClaims();
  if (error || !data?.claims.sub || data.claims.is_anonymous === true) return null;
  return { client, id: data.claims.sub };
}
