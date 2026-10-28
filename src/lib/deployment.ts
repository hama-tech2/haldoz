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

export const previewTarget = {
  account: "11de8ff2142cb705ddccb688df41621a",
  name: "haldoz-preview",
  origin: "https://haldoz-preview.mahmadmajed149.workers.dev",
  branch: "codex/phone-and-release-prep",
} as const;
export function previewReleaseError(env: Record<string,string|undefined>, branch: string, dryRun=false) {
  if(!dryRun && env.HALDOZ_PREVIEW_ENABLED !== "true") return "Preview deployment requires exact-target owner approval.";
  if(branch !== previewTarget.branch) return "Preview must use the tested Haldoz development branch.";
  if(env.CLOUDFLARE_ACCOUNT_ID !== previewTarget.account) return "Unexpected Cloudflare account.";
  if(env.HALDOZ_SITE_URL !== previewTarget.origin) return "Unexpected preview origin.";
  if(env.NEXT_PUBLIC_SUPABASE_URL !== "https://wickyjtjhgfzntifuzac.supabase.co") return "Unexpected Supabase project.";
  if(!/^sb_publishable_[A-Za-z0-9_-]+$/.test(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "")) return "Only the existing publishable key is allowed.";
  if(env.HALDOZ_AUTH_READY !== "true" || env.HALDOZ_PAGES_READY !== "true" || env.HALDOZ_JOBS_READY !== "false") return "Preview needs real login/pages with new job publishing disabled.";
  if(env.HALDOZ_HOSTED_PREVIEW !== "true") return "Hosted previews must hide development fixture routes.";
  if(!dryRun && env.HALDOZ_PREVIEW_CALLBACK_VERIFIED !== "true") return "The exact preview OAuth callback must be approved and verified first.";
  return null;
}
