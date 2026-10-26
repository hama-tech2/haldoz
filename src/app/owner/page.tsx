import { redirect } from "next/navigation";
import { EntryHeader } from "../../components/entry-header";
import { OwnerPageView } from "../../components/owner-page-view";
import { verifiedOwner } from "../../lib/supabase/server";
import { ownerPageState } from "../../lib/owner-routing";
import { siteOrigin } from "../../lib/supabase/config";
import { profileUrl } from "../../lib/profile-workflow";
import "../entry.css";
import "../owner.css";
import "./account.css";
export const dynamic = "force-dynamic";
export default async function MyPage() {
  const owner = await verifiedOwner();
  if (!owner) redirect("/create");
  const state = await ownerPageState(owner);
  if (state.status !== "saved") redirect("/page-setup");
  const page = state.page;
  return <div><EntryHeader/><main id="main-content" className="owner-shell account-shell"><OwnerPageView page={page} url={profileUrl(siteOrigin(),page.handle)}/></main></div>;
}
