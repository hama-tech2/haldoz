import { Icon } from "./icon";
import Link from "next/link";
import { formatAge, formatTime, shiftLabels, type Job } from "../lib/jobs";
export function JobCard({ job, saved, onToggle, now }: { job: Job; saved: boolean; onToggle: () => void; now: string }) {
  const overnight = job.start && job.end && job.end <= job.start;
  return <article className="job-card" aria-labelledby={job.id + "-title"}>
    <div className="card-top">
      <div className="page-identity"><span className={"page-avatar tone-" + job.logoTone} aria-hidden="true">{job.initial}</span><span className="page-name">{job.pageName}</span></div>
      <span className="posting-age"><Icon name="clock"/><time dateTime={job.postedAt}>{formatAge(job.postedAt, now)}</time></span>
    </div>
    <h3 id={job.id + "-title"}>{job.href ? <Link href={job.href}>{job.title}</Link> : job.title}</h3>
    {job.placementFee && <p className="fee-disclosure"><bdi>{job.placementFee}</bdi></p>}
    <p className="salary">{job.salaryMode === "fixed" && job.salary !== null ? <><bdi dir="ltr">{job.salary.toLocaleString("en-US")} IQD</bdi><span className="salary-period"> / مانگ</span></> : job.salaryMode === "negotiable" ? "مووچە بە ڕێککەوتن" : "مووچە دیاری نەکراوە"}</p>
    <div className="card-bottom">
      <div className="job-facts">
        <p><Icon name="clock"/>{job.start && job.end ? <><bdi dir="ltr">{formatTime(job.start)} – {formatTime(job.end)}</bdi>{overnight && <span className="overnight">ڕۆژی دواتر</span>}</> : <span>{job.shift === "flexible" ? shiftLabels.flexible : "کات دیاری نەکراوە"}</span>}</p>
        <p><Icon name="pin"/><span>{[job.district, job.city].filter(Boolean).join("، ")}</span></p>
      </div>
      <button className={"save-button" + (saved ? " is-saved" : "")} type="button" aria-pressed={saved} aria-label={(saved ? "لابردنی " : "پاشەکەوتکردنی ") + job.title} onClick={onToggle}><Icon name="heart" filled={saved}/></button>
    </div>
  </article>;
}
