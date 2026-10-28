import Link from "next/link";
import {ownerJobsContext,ownerJobColumns} from "../../../lib/owner-jobs";
import {JobsUnavailable} from "../../../components/owner-jobs-shell";
import {type JobRecord,salaryText,draftFromRecord} from "../../../lib/job-drafts";
import {jobStatusLabels} from "../../../lib/job-publication";
import {Icon} from "../../../components/icon";
export const dynamic="force-dynamic";
export default async function JobDashboard() {
 const context=await ownerJobsContext();if(!context)return <JobsUnavailable/>;
 const {data,error}=await context.owner.client.from("haldoz_jobs").select(ownerJobColumns()).eq("page_id",context.page.id).order("created_at",{ascending:false}).order("id",{ascending:false}).limit(50).returns<JobRecord[]>();
 if(error)throw new Error("Job list temporarily unavailable");
 const rows=data ?? [];
 return <><header className="draft-heading"><p className="owner-eyebrow">{context.page.display_name}</p><h1>داشبۆردی کارەکان</h1><Link className="primary-button" href="/owner/jobs/new">زیادکردنی هەلی کار</Link></header>
 <section className="draft-list" aria-label="هەلەکانی کار">{!rows.length && <div className="profile-empty"><Icon name="bag"/><div><h2>یەکەم هەلی کارت زیاد بکە</h2><p>ڕەشنووس پاشەکەوت بکە؛ کاتێک ئامادە بوویت بڵاوی بکەرەوە.</p></div></div>}{rows.map(row=><article className="draft-list-card" key={row.id}><span className={"draft-badge status-"+row.status}>{jobStatusLabels[row.status]}</span><h2>{row.title}</h2><p>{row.city} · <bdi>{salaryText(draftFromRecord(row))}</bdi></p><div className="draft-card-actions">{["draft","active"].includes(row.status) && <Link href={"/owner/jobs/"+row.id}>دەستکاریکردن</Link>}<Link href={"/owner/jobs/"+row.id+"/review"}>پێداچوونەوە</Link>{row.status==="active" && <Link href={"/jobs/"+row.id}>بینینی هەلی گشتی</Link>}</div></article>)}</section>
 {rows.length===50 && <p className="field-help">نوێترین ٥٠ هەلی کار پیشان دەدرێت.</p>}</>;
}
