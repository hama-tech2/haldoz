import Link from "next/link";
import type {PublicJob} from "../lib/public-jobs";
import {draftFromRecord,salaryText} from "../lib/job-drafts";
import {placementFeeText} from "../lib/job-publication";
import {RefreshPublicJobs} from "./refresh-public-jobs";
export function PublicJobList({jobs,unavailable=false}:{jobs:PublicJob[];unavailable?:boolean}) {
 return <><RefreshPublicJobs/>{unavailable?<p role="status">هەلەکان ئێستا بار نابن؛ دواتر دووبارە هەوڵ بدەرەوە.</p>:jobs.length?<div className="profile-job-list">{jobs.map(job=>{const draft=draftFromRecord(job);return <article className="job-card" key={job.id}><h3><Link href={"/jobs/"+job.id}>{job.title}</Link></h3><p className="salary"><bdi>{salaryText(draft)}</bdi></p><p>{[draft.workplace,job.city].filter(Boolean).join("، ")}</p><p className="fee-disclosure"><bdi>{placementFeeText(draft)}</bdi></p><Link className="text-link" href={"/jobs/"+job.id}>بینینی وردەکارییەکان</Link></article>;})}</div>:<div className="profile-empty"><div><h3>هێشتا هەلی کار نییە</h3><p>هەلە نوێیەکان لێرە دەردەکەون.</p></div></div>}</>;
}
