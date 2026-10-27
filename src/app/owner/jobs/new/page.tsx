import {ownerJobsContext} from "../../../../lib/owner-jobs";
import {DraftForm} from "../../../../components/draft-form";
import {JobsUnavailable} from "../../../../components/owner-jobs-shell";
import {saveJobDraft} from "../actions";
import {jobsReady} from "../../../../lib/job-publication";
export const dynamic="force-dynamic";
export default async function NewDraft(){const context=await ownerJobsContext();if(!context)return <JobsUnavailable/>;return <><h1>زیادکردنی هەلی کار</h1><DraftForm extended={jobsReady()} save={saveJobDraft}/></>;}
