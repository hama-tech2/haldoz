import { NextResponse, type NextRequest } from "next/server";
import { serverSupabase } from "../../../lib/supabase/server";
import { siteOrigin } from "../../../lib/supabase/config";
export async function POST(request: NextRequest) {
  const origin = siteOrigin();
  const headers = { "Cache-Control": "private, no-store" };
  if (request.headers.get("origin") !== origin) return new Response("Forbidden", { status: 403, headers });
  try {
    const client = await serverSupabase();
    if (!client) return new Response("Sign out is unavailable. Please try again.", { status: 503, headers });
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error) return new Response("Sign out did not complete. Please try again.", { status: 503, headers });
    const response = NextResponse.redirect(new URL("/", origin), 303);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch {
    return new Response("Sign out did not complete. Please try again.", { status: 503, headers });
  }
}
