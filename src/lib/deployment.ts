export function productionReleaseError(env: Record<string, string | undefined>, branch: string) {
  if (env.HALDOZ_RELEASE_ENABLED !== "true") return "Production release is disabled pending owner approval.";
  if (branch !== "main") return "Only main may deploy production.";
  try {
    const url = new URL(env.HALDOZ_SITE_URL ?? "");
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) return "A canonical HTTPS production origin is required.";
  } catch { return "A canonical HTTPS production origin is required."; }
  if (env.NEXT_PUBLIC_SUPABASE_URL !== "https://wickyjtjhgfzntifuzac.supabase.co") return "The confirmed Haldoz backend must be configured.";
  if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "")) return "A publishable client key is required; privileged keys are forbidden.";
  if (env.HALDOZ_AUTH_READY !== "true" || env.HALDOZ_PAGES_READY !== "true") return "Verified authentication and approved page persistence are required before release.";
  return null;
}
