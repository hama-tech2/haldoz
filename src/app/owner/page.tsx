import { redirect } from "next/navigation";
import { EntryHeader } from "../../components/entry-header";
import { OwnerPageView } from "../../components/owner-page-view";
import { verifiedOwner } from "../../lib/supabase/server";
import { ownerPageState } from "../../lib/owner-routing";
import { siteOrigin } from "../../lib/supabase/config";
import { profileUrl } from "../../lib/profile-workflow";
import {loadPublicJobs} from "../../lib/public-jobs";
import {PublicJobList} from "../../components/public-job-list";
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
  const result=await loadPublicJobs({pageId:page.id});
  return <div><EntryHeader/><main id="main-content" className="owner-shell account-shell"><OwnerPageView page={page} url={profileUrl(siteOrigin(),page.handle)} jobsContent={<PublicJobList jobs={result.jobs} unavailable={result.unavailable}/>}/></main></div>;
}
