import Link from "next/link";
import {notFound} from "next/navigation";
import {ownerJobsContext,loadOwnedDraft} from "../../../../../lib/owner-jobs";
import {draftFromRecord} from "../../../../../lib/job-drafts";
import {DraftReview} from "../../../../../components/draft-review";
import {JobsUnavailable} from "../../../../../components/owner-jobs-shell";
export const dynamic="force-dynamic";
export default async function ReviewDraft({params}:{params:Promise<{id:string}>}){const context=await ownerJobsContext();if(!context)return <JobsUnavailable/>;const row=await loadOwnedDraft(context,(await params).id);if(!row)notFound();return <><h1>پێداچوونەوەی ڕەشنووس</h1><DraftReview draft={draftFromRecord(row)}/><Link className="secondary-button" href={"/owner/jobs/"+row.id}>گەڕانەوە بۆ دەستکاریکردن</Link></>;}
