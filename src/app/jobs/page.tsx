import {JobBrowser} from "../../components/job-browser";
import {loadPublicJobs} from "../../lib/public-jobs";
import {publicJobCard} from "../../lib/public-job-card";
export const dynamic="force-dynamic";
export default async function Jobs(){const result=await loadPublicJobs();return <JobBrowser jobs={result.jobs.map(publicJobCard)} unavailable={result.unavailable} now={new Date().toISOString()}/>;}
