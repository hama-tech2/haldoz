import Link from "next/link";
import {ownerJobsContext,draftColumns} from "../../../lib/owner-jobs";
import {JobsUnavailable} from "../../../components/owner-jobs-shell";
import {type JobRecord,salaryText,draftFromRecord} from "../../../lib/job-drafts";
export const dynamic="force-dynamic";
export default async function JobDashboard() {
 const context=await ownerJobsContext();if(!context)return <JobsUnavailable/>;
 const {data,error}=await context.owner.client.from("haldoz_jobs").select(draftColumns).eq("page_id",context.page.id).eq("status","draft").order("created_at",{ascending:false}).order("id",{ascending:false}).limit(20);
 if(error)throw new Error("Draft list temporarily unavailable");
 const rows=(data ?? []) as JobRecord[];
 return <><header className="draft-heading"><p className="owner-eyebrow">{context.page.display_name}</p><h1>داشبۆردی کارەکان</h1><p>ڕەشنووسەکانت پاشەکەوت بکە و پێداچوونەوەیان بۆ بکە.</p><Link className="primary-button" href="/owner/jobs/new">زیادکردنی هەلی کار</Link></header><section className="draft-list" aria-label="ڕەشنووسەکان">{!rows.length && <p className="form-alert">هێشتا ڕەشنووسێکت نییە. یەکەم هەلی کارت زیاد بکە.</p>}{rows.map(row=><article className="draft-list-card" key={row.id}><span className="draft-badge">ڕەشنووس</span><h2>{row.title}</h2><p>{row.city} · <bdi>{salaryText(draftFromRecord(row))}</bdi></p><div className="draft-card-actions"><Link href={"/owner/jobs/"+row.id}>دەستکاریکردن</Link><Link href={"/owner/jobs/"+row.id+"/review"}>پێداچوونەوە</Link></div></article>)}</section><p className="field-help">نوێترین ٢٠ ڕەشنووس پیشان دەدرێت. هیچ ڕەشنووسێک بە گشتی دیار نییە.</p></>;
}
