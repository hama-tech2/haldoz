import { cities } from "./page-validation.ts";
export const shifts = { unspecified: "دیاری نەکراوە", morning: "بەیانی", evening: "ئێوارە", night: "شەو", flexible: "گۆڕاو" } as const;
export type JobDraft = { title: string; city: string; description: string; salary_mode: string; salary: string; start_time: string; end_time: string; shift: string; workplace: string; placement_fee_mode: string; placement_fee: string; placement_fee_terms: string };
export type DraftErrors = Partial<Record<keyof JobDraft, string>>;
export const blankDraft: JobDraft = { title: "", city: "", description: "", salary_mode: "unspecified", salary: "", start_time: "", end_time: "", shift: "unspecified", workplace: "", placement_fee_mode: "unspecified", placement_fee: "", placement_fee_terms: "" };
export const validJobId = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const digits = (value: string) => value.replace(/[٠-٩۰-۹]/g,c => String(c.charCodeAt(0) - (c <= "٩" ? 0x660 : 0x6f0)));
export function validateDraft(raw: Record<string, unknown>) {
 const draft = Object.fromEntries(Object.entries(blankDraft).map(([key,fallback]) => [key, typeof raw[key] === "string" ? raw[key].trim() : fallback])) as JobDraft;
 draft.salary = digits(draft.salary);
 const errors: DraftErrors = {};
 if(draft.title.length < 2 || draft.title.length > 120) errors.title = "ناوی کار دەبێت ٢–١٢٠ پیت بێت.";
 if(!(cities as readonly string[]).includes(draft.city)) errors.city = "شارێک هەڵبژێرە.";
 if(draft.description.length > 4000) errors.description = "دەربارەی کار نابێت لە ٤٠٠٠ پیت زیاتر بێت.";
 if(!["fixed","negotiable","unspecified"].includes(draft.salary_mode)) errors.salary_mode = "دۆخی مووچە هەڵبژێرە.";
 if(draft.salary_mode === "fixed" && (!/^\d+$/.test(draft.salary) || !Number.isSafeInteger(Number(draft.salary)) || Number(draft.salary) > 2147483647)) errors.salary = "بڕێکی دروستی دیناری عێراقی بنووسە؛ ژمارەی نەرێنی یان دەهەمی ناگونجێت.";
 if(draft.salary_mode !== "fixed") draft.salary = "";
 for(const field of ["start_time","end_time"] as const) if(draft[field] && !/^([01]\d|2[0-3]):[0-5]\d$/.test(draft[field])) errors[field] = "کاتێکی دروست هەڵبژێرە.";
 if(Boolean(draft.start_time) !== Boolean(draft.end_time)) errors.end_time = "هەردوو کاتی دەستپێک و کۆتایی بنووسە، یان هەردووکیان بەتاڵ بهێڵە.";
 if(!Object.hasOwn(shifts,draft.shift)) errors.shift = "کاتێکی کاری بەردەست هەڵبژێرە.";
 if(draft.workplace.length > 200) errors.workplace = "شوێنی کار نابێت لە ٢٠٠ پیت زیاتر بێت.";
 if(!["unspecified","none","fixed","percentage"].includes(draft.placement_fee_mode)) errors.placement_fee_mode = "دۆخی کرێی نووسینگە هەڵبژێرە.";
 draft.placement_fee = digits(draft.placement_fee);
 if(["fixed","percentage"].includes(draft.placement_fee_mode)) {
   const pattern = draft.placement_fee_mode === "fixed" ? /^\d+$/ : /^\d+(?:\.\d{1,2})?$/;
   const limit = draft.placement_fee_mode === "fixed" ? 2147483647 : 100;
   if(!pattern.test(draft.placement_fee) || Number(draft.placement_fee) <= 0 || Number(draft.placement_fee) > limit) errors.placement_fee = draft.placement_fee_mode === "fixed" ? "بڕێکی دروستی دیناری عێراقی بنووسە." : "ڕێژەیەک لە سەرووی سفر تا ١٠٠ بنووسە.";
 } else { draft.placement_fee = ""; draft.placement_fee_terms = ""; }
 if(draft.placement_fee_terms.length > 500) errors.placement_fee_terms = "مەرجی کرێ نابێت لە ٥٠٠ پیت زیاتر بێت.";
 return { draft, errors };
}
export function draftWriteFields(draft: JobDraft) {
 return { title: draft.title, city: draft.city, description: draft.description, salary_mode: draft.salary_mode, salary: draft.salary_mode === "fixed" ? Number(draft.salary) : null, start_time: draft.start_time || null, end_time: draft.end_time || null, shift: draft.shift, status: "draft" as const };
}
export type JobStatus = "draft" | "active" | "worker_found" | "archived";
export type JobRecord = Omit<ReturnType<typeof draftWriteFields>,"status"> & { id: string; created_at: string; status: JobStatus; page_id?: string; published_at?: string | null; revision?: number; workplace?: string; placement_fee_mode?: string; placement_fee?: number | null; placement_fee_terms?: string };
export function draftFromRecord(row: JobRecord): JobDraft {
 return { title:row.title,city:row.city,description:row.description,salary_mode:row.salary_mode,salary:row.salary === null ? "" : String(row.salary),start_time:row.start_time?.slice(0,5) ?? "",end_time:row.end_time?.slice(0,5) ?? "",shift:row.shift,workplace:row.workplace ?? "",placement_fee_mode:row.placement_fee_mode ?? "unspecified",placement_fee:row.placement_fee == null ? "" : String(row.placement_fee),placement_fee_terms:row.placement_fee_terms ?? "" };
}
export function salaryText(draft: JobDraft) {
 return draft.salary_mode === "fixed" ? Number(draft.salary).toLocaleString("en-US") + " IQD / مانگ" : draft.salary_mode === "negotiable" ? "مووچە بە ڕێککەوتن" : "مووچە دیاری نەکراوە";
}
export type DraftState = { errors?: DraftErrors; message?: string; savedId?: string; savedRevision?: number; savedStatus?: JobStatus };
export type SaveDraft = (previous: DraftState, formData: FormData) => Promise<DraftState>;
