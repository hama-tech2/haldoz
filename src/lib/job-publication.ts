import { validateDraft, draftWriteFields, type JobDraft, type JobStatus } from "./job-drafts.ts";

export const jobStatusLabels: Record<JobStatus,string> = {draft:"ڕەشنووس",active:"بەردەستە",worker_found:"کارمەند دۆزرایەوە",archived:"داخراوە"};
export function jobsReady() { return process.env.HALDOZ_JOBS_READY === "true"; }
export function validRevision(value: unknown): value is number { return typeof value === "number" && Number.isSafeInteger(value) && value > 0 && value < 2147483647; }
export function publicationErrors(draft: JobDraft) {
  const {errors} = validateDraft(draft);
  if(draft.description.trim().length < 10) errors.description = "ئەرک و مەرجەکانی کار ڕوون بکەرەوە (لانیکەم ١٠ پیت).";
  if(draft.workplace.trim().length < 2) errors.workplace = "شوێنی کار بنووسە؛ تەنها شار بەس نییە.";
  if(draft.salary_mode === "unspecified") errors.salary_mode = "مووچە دیاری بکە یان «بە ڕێککەوتن» هەڵبژێرە.";
  if(draft.salary_mode === "fixed" && Number(draft.salary) <= 0) errors.salary = "مووچە دەبێت لە سفر زیاتر بێت.";
  if(draft.placement_fee_mode === "unspecified") errors.placement_fee_mode = "دیاری بکە کرێی نووسینگە هەیە یان نا.";
  if(["fixed","percentage"].includes(draft.placement_fee_mode) && draft.placement_fee_terms.trim().length < 5) errors.placement_fee_terms = "بنەمای کرێ و کاتی پارەدان ڕوون بکەرەوە.";
  return errors;
}
export function jobContentFields(draft: JobDraft) {
  const {status: _status,...base} = draftWriteFields(draft);
  void _status;
  return {...base,workplace:draft.workplace,placement_fee_mode:draft.placement_fee_mode,placement_fee:["fixed","percentage"].includes(draft.placement_fee_mode)?Number(draft.placement_fee):null,placement_fee_terms:draft.placement_fee_terms};
}
export function placementFeeText(draft: JobDraft) {
  if(draft.placement_fee_mode === "none") return "بێ کرێی نووسینگە";
  if(draft.placement_fee_mode === "fixed") return Number(draft.placement_fee).toLocaleString("en-US") + " IQD — کرێی نووسینگە";
  if(draft.placement_fee_mode === "percentage") return draft.placement_fee + "% — کرێی نووسینگە";
  return "کرێی نووسینگە دیاری نەکراوە";
}
export function isPubliclyAvailable(row: {status: string; published_at?: string | null}, now = Date.now()) {
  const published = Date.parse(row.published_at ?? "");
  return row.status === "active" && Number.isFinite(published) && published <= now;
}
export function receiptMatches(data: unknown,id?: string,status?: JobStatus) {
  if(!Array.isArray(data) || data.length !== 1) return false;
  const row=data[0];
  return !!row && typeof row.id === "string" && (!id || row.id === id) && validRevision(row.revision) && (status ? row.status === status : ["draft","active"].includes(row.status));
}
