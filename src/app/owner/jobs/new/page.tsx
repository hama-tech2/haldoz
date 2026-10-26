import {ownerJobsContext} from "../../../../lib/owner-jobs";
import {DraftForm} from "../../../../components/draft-form";
import {JobsUnavailable} from "../../../../components/owner-jobs-shell";
import {saveJobDraft} from "../actions";
export const dynamic="force-dynamic";
export default async function NewDraft(){const context=await ownerJobsContext();if(!context)return <JobsUnavailable/>;return <><h1>زیادکردنی هەلی کار</h1><DraftForm save={saveJobDraft}/></>;}
