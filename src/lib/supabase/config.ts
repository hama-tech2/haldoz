export const confirmedProjectUrl = "https://wickyjtjhgfzntifuzac.supabase.co";
export function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (url !== confirmedProjectUrl || !key || !/^sb_publishable_[A-Za-z0-9_-]+$/.test(key)) return null;
  return { url, key };
}
export function siteOrigin() {
  const raw = process.env.HALDOZ_SITE_URL ?? "http://127.0.0.1:3100";
  const url = new URL(raw);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && ["127.0.0.1", "localhost"].includes(url.hostname))) throw new Error("Invalid site origin");
  return url.origin;
}

export const authCookieOptions = { name: 'haldoz-wickyjtjhgfzntifuzac-auth-token', path: '/', sameSite: 'lax' as const };
