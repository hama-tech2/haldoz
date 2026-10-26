import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { EntryHeader } from "../../../components/entry-header";
import { PublicProfile } from "../../../components/public-profile";
import { supabaseConfig } from "../../../lib/supabase/config";
import { validHandle, type PublicPage } from "../../../lib/page-validation";
import "../../entry.css";
import "../../owner.css";
export const dynamic = "force-dynamic";
export default async function Profile({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  if (!validHandle(handle)) notFound();
  const config = supabaseConfig();
  if (!config || process.env.HALDOZ_PAGES_READY !== "true") return <div className="owner-shell narrow-shell"><EntryHeader/><main id="main-content" className="service-state"><h1>پەڕەکان هێشتا چالاک نین</h1><p>خزمەتگوزاریی پەڕەکان لە ئامادەکردندایە. هیچ پەڕەیەکی ساختە بە ناوی ئەم ناونیشانە پیشان نادرێت.</p></main></div>;
  const client = createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) } });
  const { data, error } = await client.from("haldoz_pages").select("id,handle,display_name,bio,city,public_phone,public_whatsapp,brand_tone").eq("handle",handle).maybeSingle();
  if (error) return <div><EntryHeader/><main id="main-content" className="owner-shell service-state"><h1>پەڕەکە ئێستا بەردەست نییە</h1><p>خزمەتگوزاریی پەڕەکان کاتییانە بەردەست نییە. تکایە دواتر دووبارە هەوڵ بدەوە.</p></main></div>;
  if (!data) notFound();
  const page: PublicPage = { ...data, bio: data.bio ?? "", public_phone: data.public_phone ?? "", public_whatsapp: data.public_whatsapp ?? "" };
  return <div className="owner-shell narrow-shell"><EntryHeader/><main id="main-content"><PublicProfile page={page}/></main></div>;
}
