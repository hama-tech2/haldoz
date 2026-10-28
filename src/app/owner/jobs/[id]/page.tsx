import Link from "next/link";
import {notFound} from "next/navigation";
import {ownerJobsContext,loadOwnedJob} from "../../../../lib/owner-jobs";
import {draftFromRecord} from "../../../../lib/job-drafts";
import {jobsReady} from "../../../../lib/job-publication";
import {DraftForm} from "../../../../components/draft-form";
import {JobsUnavailable} from "../../../../components/owner-jobs-shell";
import {saveJobDraft} from "../actions";
export const dynamic="force-dynamic";
export default async function EditJob({params}:{params:Promise<{id:string}>}){
 const context=await ownerJobsContext(); if(!context)return <JobsUnavailable/>;
 const row=await loadOwnedJob(context,(await params).id); if(!row)notFound();
 if(!["draft","active"].includes(row.status))return <><h1>ئەم هەلە داخراوە</h1><Link href={"/owner/jobs/"+row.id+"/review"}>بینینی زانیارییەکان</Link></>;
 return <><h1>{row.status === "active" ? "دەستکاریکردنی هەلی کار" : "دەستکاریکردنی ڕەشنووس"}</h1><DraftForm id={row.id} revision={row.revision} active={row.status==="active"} extended={jobsReady()} initial={draftFromRecord(row)} save={saveJobDraft}/></>;
}
