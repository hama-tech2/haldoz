import Link from "next/link";
import { EntryHeader, GoogleMark } from "../../components/entry-header";
import { Icon } from "../../components/icon";
import { authReadiness } from "../../lib/supabase/readiness";
import { verifiedOwner } from "../../lib/supabase/server";
import { ownerDestination, ownerPageState } from "../../lib/owner-routing";
import { authErrorMessage } from "../../lib/account-errors";
import { redirect } from "next/navigation";
import "../entry.css";

export const dynamic = "force-dynamic";
export default async function CreatePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const owner = await verifiedOwner();
  if (owner) redirect(ownerDestination(await ownerPageState(owner)));
  const readiness = await authReadiness();
  const { error } = await searchParams;
  return <div className="entry-screen"><EntryHeader back/><main id="main-content" className="entry-main login-entry">
    <p className="entry-eyebrow">پەڕەی تایبەتی هەلی کار</p>
    <h1>پەڕەی خۆت دروست بکە</h1>
    <p className="entry-description">بە <bdi lang="en" dir="ltr">Google</bdi> بچۆ ژوورەوە و پەڕەکەت ئامادە بکە.</p>
    <form action="/auth/login" method="post"><button className="google-button" disabled={!readiness.ready} aria-describedby={!readiness.ready ? "login-status" : undefined}><GoogleMark/><span>بەردەوامبوون بە <bdi lang="en" dir="ltr">Google</bdi></span></button></form>
    {!readiness.ready && <p id="login-status" className="entry-status" role="status">چوونەژوورەوە بە Google هێشتا چالاک نییە.</p>}
    {error && <p role="alert" className="entry-error">{authErrorMessage(error)}</p>}
    <p className="entry-help">دوای چوونەژوورەوە، ناوی پەڕەکەت دیاری دەکەیت.</p>
    <Link className="entry-browse" href="/jobs"><Icon name="arrow"/>گەڕانەوە بۆ هەلەکانی کار</Link>
  </main></div>;
}
