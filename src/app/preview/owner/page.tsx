import { EntryHeader } from "../../../components/entry-header";
import { OwnerPageView } from "../../../components/owner-page-view";
import { previewPage } from "../../../lib/page-validation";
import { siteOrigin } from "../../../lib/supabase/config";
import "../../entry.css";
import "../../owner.css";
import "../../owner/account.css";
export const dynamic = "force-dynamic";
export default function OwnerPreview() {
  return <div><EntryHeader/><main id="main-content" className="owner-shell account-shell"><OwnerPageView page={previewPage} url={siteOrigin()+"/preview/page"} preview/></main></div>;
}
