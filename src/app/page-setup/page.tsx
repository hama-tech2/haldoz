import { EntryHeader } from "../../components/entry-header";
import { PageSetupForm } from "../../components/page-setup-form";
import { verifiedOwner } from "../../lib/supabase/server";
import { ownerPageState } from "../../lib/owner-routing";
import { authErrorMessage, pageDatabasePending, pageDatabaseUnavailable } from "../../lib/account-errors";
import { redirect } from "next/navigation";
import "../entry.css";
import "../owner.css";
import "../owner/account.css";
export const dynamic = "force-dynamic";
export default async function PageSetup() {
  const owner = await verifiedOwner();
  const state = owner ? await ownerPageState(owner) : null;
  if (state?.status === "saved") redirect("/owner");
  const ready = state?.status === "new";
  const unavailableReason = !owner ? authErrorMessage("session_missing") : state?.status === "database-pending" ? pageDatabasePending : pageDatabaseUnavailable;
  return <div><EntryHeader/><main id="main-content" className="owner-shell"><div className="setup-heading"><p className="owner-eyebrow">هەنگاوی دووەم · زانیاریی گشتی</p><h1>پەڕەکەت بە ناوی خۆت.</h1><p>زانیارییەکان بنووسە و پێش پاشەکەوتکردن پێشبینینەکە ببینە.</p></div><PageSetupForm canSave={!!owner && ready} authenticated={!!owner} unavailableReason={unavailableReason}/>{owner && <form action="/auth/logout" method="post" className="owner-signout"><button className="secondary-button">چوونەدەرەوە</button></form>}</main></div>;
}
