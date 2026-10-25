import "server-only";
import { supabaseConfig } from "./config";
export async function authReadiness() {
  const config = supabaseConfig();
  if (!config) return { ready: false, reason: "configuration" };
  if (process.env.HALDOZ_AUTH_READY !== "true") return { ready: false, reason: "review" };
  try {
    const response = await fetch(config.url + "/auth/v1/settings", { headers: { apikey: config.key }, cache: "no-store", signal: AbortSignal.timeout(5000) });
    const settings = response.ok ? await response.json() : null;
    return settings?.external?.google === true ? { ready: true, reason: "" } : { ready: false, reason: "provider" };
  } catch { return { ready: false, reason: "connection" }; }
}
