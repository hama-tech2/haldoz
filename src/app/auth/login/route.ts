import { NextResponse, type NextRequest } from "next/server";
import { serverSupabase } from "../../../lib/supabase/server";
import { authReadiness } from "../../../lib/supabase/readiness";
import { siteOrigin } from "../../../lib/supabase/config";
export async function POST(request: NextRequest) {
  const origin = siteOrigin();
  if (request.headers.get("origin") !== origin) return new Response("Forbidden", { status: 403 });
  const readiness = await authReadiness();
  const client = readiness.ready ? await serverSupabase() : null;
  if (!client) return NextResponse.redirect(new URL("/create?error=unavailable", origin), 303);
  const { data, error } = await client.auth.signInWithOAuth({ provider: "google", options: { redirectTo: origin + "/auth/callback", scopes: "openid email profile", skipBrowserRedirect: true } });
  if (error || !data.url) return NextResponse.redirect(new URL("/create?error=login", origin), 303);
  const target = new URL(data.url);
  if (target.origin !== "https://wickyjtjhgfzntifuzac.supabase.co") return new Response("Invalid OAuth destination", { status: 502 });
  return NextResponse.redirect(target, 303);
}
