"use client";
import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig, authCookieOptions } from "./config";
export function browserSupabase() {
  const config = supabaseConfig();
  if (!config) throw new Error("Supabase public configuration is incomplete");
  return createBrowserClient(config.url, config.key, { cookieOptions: authCookieOptions });
}
