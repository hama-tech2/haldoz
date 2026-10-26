import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfig, authCookieOptions } from "./lib/supabase/config";
export async function proxy(request: NextRequest) {
  const config = supabaseConfig();
  let response = NextResponse.next({ request });
  if (config) {
    const client = createServerClient(config.url, config.key, { cookieOptions: authCookieOptions, cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        for (const { name, value } of values) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of values) response.cookies.set(name, value, options);
      },
    } });
    await client.auth.getClaims();
  }
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}
export const config = { matcher: ["/create", "/page-setup", "/owner/:path*", "/auth/:path*"] };
