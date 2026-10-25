import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authCookieOptions, siteOrigin, supabaseConfig } from "../../../lib/supabase/config";
import { ownerDestination, ownerPageState } from "../../../lib/owner-routing";
export async function GET(request: NextRequest) {
  const origin = siteOrigin();
  const config = supabaseConfig();
  const jar = new Map(request.cookies.getAll().map(cookie => [cookie.name, cookie.value]));
  const pending = new Map<string, { name: string; value: string; options: CookieOptions }>();
  const cacheHeaders: Record<string, string> = {};
  function finish(path: string) {
    const response = NextResponse.redirect(new URL(path, origin), 303);
    for (const cookie of pending.values()) response.cookies.set(cookie.name, cookie.value, cookie.options);
    for (const [name, value] of Object.entries(cacheHeaders)) response.headers.set(name, value);
    response.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }
  function fail(stage: string) {
    // Only fixed categories: never log request URLs, codes, cookie values, tokens or identities.
    console.warn("[haldoz-auth]", stage);
    return finish("/create?error=" + stage);
  }
  if (request.headers.get("host") !== new URL(origin).host) return fail("callback_origin");
  if (!config) return fail("callback_configuration");
  const client = createServerClient(config.url, config.key, { cookieOptions: authCookieOptions, cookies: {
    getAll: () => [...jar].map(([name, value]) => ({ name, value })),
    setAll(values, headers) {
      for (const cookie of values) { jar.set(cookie.name, cookie.value); pending.set(cookie.name, cookie); }
      Object.assign(cacheHeaders, headers);
    },
  } });
  try {
    const code = request.nextUrl.searchParams.get("code");
    let failure = request.nextUrl.searchParams.has("error") ? "callback_denied" : "callback_missing_code";
    let exchanged = false;
    if (code && !request.nextUrl.searchParams.has("error")) {
      const verifierName = authCookieOptions.name + "-code-verifier";
      const verifierPresent = [...jar.keys()].some(name => name === verifierName || name.startsWith(verifierName + "."));
      if (!verifierPresent) failure = "callback_verifier_missing";
      else {
        const { error } = await client.auth.exchangeCodeForSession(code);
        exchanged = !error;
        failure = "callback_exchange_failed";
      }
    }
    const { data, error } = await client.auth.getClaims();
    if (error || !data?.claims.sub || data.claims.is_anonymous === true) return fail(exchanged ? "callback_identity_failed" : failure);
    const destination = ownerDestination(await ownerPageState({ client, id: data.claims.sub }));
    console.info("[haldoz-auth]", exchanged ? "exchange_verified" : "existing_session_verified", destination);
    return finish(destination);
  } catch {
    return fail("callback_exchange_failed");
  }
}
