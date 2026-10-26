import { validateDraft, validJobId, type JobDraft } from "./job-drafts.ts";
export const fixtureStorageKey = "haldoz-development-drafts-v1";
export type FixtureDraft = { id: string; draft: JobDraft };
export function readFixtureDrafts(raw: string | null): FixtureDraft[] {
 if(raw === null) return [];
 if(raw.length > 200000) throw new Error("Development draft storage too large");
 const data: unknown = JSON.parse(raw);
 if(!data || typeof data !== "object" || !("version" in data) || data.version !== 1 || !("jobs" in data) || !Array.isArray(data.jobs) || data.jobs.length > 30) throw new Error("Invalid development drafts");
 const seen = new Set<string>();
 return data.jobs.map((row: unknown) => {
  if(!row || typeof row !== "object" || !("id" in row) || typeof row.id !== "string" || !validJobId(row.id) || seen.has(row.id) || !("draft" in row) || !row.draft || typeof row.draft !== "object") throw new Error("Invalid development draft");
  seen.add(row.id);
  const {draft,errors} = validateDraft(row.draft as Record<string,unknown>);
  if(Object.keys(errors).length) throw new Error("Invalid development fields");
  return {id:row.id,draft};
 });
}
export function saveFixtureDraft(raw: string | null, id: string, draft: JobDraft) {
 const jobs = readFixtureDrafts(raw);
 if(!validJobId(id) || Object.keys(validateDraft(draft).errors).length) throw new Error("Invalid development save");
 const index = jobs.findIndex(job => job.id === id);
 if(index < 0 && jobs.length >= 30) throw new Error("Development storage limit");
 const row = {id,draft:validateDraft(draft).draft};
 if(index < 0) jobs.unshift(row); else jobs[index] = row;
 return JSON.stringify({version:1,jobs});
}
