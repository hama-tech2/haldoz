import {notFound} from "next/navigation";
import {ownerJobsContext,loadOwnedDraft} from "../../../../lib/owner-jobs";
import {draftFromRecord} from "../../../../lib/job-drafts";
import {DraftForm} from "../../../../components/draft-form";
import {JobsUnavailable} from "../../../../components/owner-jobs-shell";
import {saveJobDraft} from "../actions";
export const dynamic="force-dynamic";
export default async function EditDraft({params}:{params:Promise<{id:string}>}){const context=await ownerJobsContext();if(!context)return <JobsUnavailable/>;const row=await loadOwnedDraft(context,(await params).id);if(!row)notFound();return <><h1>دەستکاریکردنی ڕەشنووس</h1><DraftForm id={row.id} initial={draftFromRecord(row)} save={saveJobDraft}/></>;}
