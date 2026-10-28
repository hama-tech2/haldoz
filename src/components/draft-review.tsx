import { shifts, salaryText, type JobDraft, type JobStatus } from "../lib/job-drafts";
import { placementFeeText, jobStatusLabels } from "../lib/job-publication";
export function DraftReview({draft,status="draft"}:{draft:JobDraft;status?:JobStatus}) {
 return <article className="form-section draft-review"><span className="draft-badge">{jobStatusLabels[status]}</span><h2>{draft.title}</h2><dl>
  <div><dt>شوێنی کار</dt><dd>{[draft.workplace,draft.city].filter(Boolean).join("، ")}</dd></div>
  <div><dt>مووچە</dt><dd><bdi>{salaryText(draft)}</bdi></dd></div>
  <div><dt>کاتی کار</dt><dd>{shifts[draft.shift as keyof typeof shifts]}</dd></div>
  <div><dt>کاتژمێر</dt><dd>{draft.start_time && draft.end_time ? <bdi dir="ltr">{draft.start_time} – {draft.end_time}{draft.end_time <= draft.start_time ? " (+1)" : ""}</bdi> : "دیاری نەکراوە"}</dd></div>
  <div><dt>کرێی نووسینگە</dt><dd><bdi>{placementFeeText(draft)}</bdi></dd></div>
 </dl>{draft.placement_fee_terms && <p className="draft-description fee-disclosure">{draft.placement_fee_terms}</p>}<h3>ئەرک و مەرجەکان</h3><p className="draft-description">{draft.description || "هێشتا زانیارییەک زیاد نەکراوە."}</p></article>;
}
