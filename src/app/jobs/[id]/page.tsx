import Link from "next/link";
import {notFound} from "next/navigation";
import {loadPublicJobs} from "../../../lib/public-jobs";
import {validJobId,draftFromRecord} from "../../../lib/job-drafts";
import {siteOrigin} from "../../../lib/supabase/config";
import {EntryHeader} from "../../../components/entry-header";
import {DraftReview} from "../../../components/draft-review";
import {CopyProfileLink} from "../../../components/copy-profile-link";
import {RefreshPublicJobs} from "../../../components/refresh-public-jobs";
import "../../entry.css";
import "../../owner.css";
import "../../owner/account.css";
import "../../owner/jobs/drafts.css";
export const dynamic="force-dynamic";
export default async function PublicJobPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params;if(!validJobId(id))notFound();
 const result=await loadPublicJobs({id});
 if(result.unavailable)return <><EntryHeader/><main id="main-content" className="owner-shell narrow-shell service-state"><h1>هەلی کار ئێستا بار نابێت</h1><p>دواتر دووبارە هەوڵ بدەرەوە.</p></main></>;
 const row=result.jobs[0];if(!row)notFound();
 return <><EntryHeader/><main id="main-content" className="owner-shell narrow-shell"><RefreshPublicJobs/><Link className="text-link" href={"/p/"+row.page.handle}>{row.page.display_name}</Link><h1 className="sr-only">{row.title}</h1><DraftReview draft={draftFromRecord(row)} status="active"/>
 <section aria-label="پەیوەندی" className="profile-contacts"><a className="primary-button" href={"tel:"+row.page.public_phone}>پەیوەندی بکە</a>{row.page.public_whatsapp && <a className="secondary-button" href={"https://wa.me/"+row.page.public_whatsapp.slice(1)} rel="noopener noreferrer" target="_blank">واتساپ</a>}<CopyProfileLink url={siteOrigin()+"/jobs/"+id}/></section><Link className="text-link" href="/jobs">هەموو هەلەکان</Link></main></>;
}
