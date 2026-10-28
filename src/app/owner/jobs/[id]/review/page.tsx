import Link from "next/link";
import {notFound} from "next/navigation";
import {ownerJobsContext,loadOwnedJob} from "../../../../../lib/owner-jobs";
import {draftFromRecord} from "../../../../../lib/job-drafts";
import {jobsReady,publicationErrors} from "../../../../../lib/job-publication";
import {siteOrigin} from "../../../../../lib/supabase/config";
import {DraftReview} from "../../../../../components/draft-review";
import {JobStatusAction} from "../../../../../components/job-status-action";
import {CopyProfileLink} from "../../../../../components/copy-profile-link";
import {JobsUnavailable} from "../../../../../components/owner-jobs-shell";
export const dynamic="force-dynamic";
export default async function ReviewJob({params}:{params:Promise<{id:string}>}){
 const context=await ownerJobsContext(); if(!context)return <JobsUnavailable/>;
 const row=await loadOwnedJob(context,(await params).id); if(!row)notFound();
 const draft=draftFromRecord(row),ready=jobsReady(),errors=publicationErrors(draft);
 return <><h1>پێداچوونەوەی هەلی کار</h1><DraftReview draft={draft} status={row.status}/>
 <p className="field-help">پەیوەندی لە ڕێگەی ژمارەی گشتیی پەڕەکەتە: <bdi dir="ltr">{context.page.public_phone}</bdi>{context.page.public_whatsapp ? " · واتساپ چالاکە" : ""}</p>
 {["draft","active"].includes(row.status) && <Link className="secondary-button" href={"/owner/jobs/"+row.id}>دەستکاریکردن</Link>}
 {!ready && <p className="form-alert">بڵاوکردنەوە هێشتا بەردەست نییە؛ ڕەشنووسەکەت پارێزراوە.</p>}
 {ready && row.status === "draft" && (Object.keys(errors).length ? <div className="form-alert"><p>پێش بڵاوکردنەوە:</p><ul>{Object.entries(errors).map(([field,error])=><li key={field}><Link href={"/owner/jobs/"+row.id+"#"+field}>{error}</Link></li>)}</ul></div> : <JobStatusAction key={row.revision} id={row.id} revision={row.revision!} target="active"/>)}
 {ready && row.status === "active" && <><div className="draft-card-actions"><Link className="text-link" href={"/jobs/"+row.id}>بینینی هەلی گشتی</Link><CopyProfileLink url={siteOrigin()+"/jobs/"+row.id}/></div><JobStatusAction key={row.revision} id={row.id} revision={row.revision!} target="worker_found"/></>}
 {["worker_found","archived"].includes(row.status) && <p className="form-alert">ئەم هەلە داخراوە و لە گەڕانی گشتی پیشان نادرێت.</p>}
 </>;
}
