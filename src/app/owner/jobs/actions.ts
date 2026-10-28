"use server";
import { revalidatePath } from "next/cache";
import { verifiedOwner } from "../../../lib/supabase/server";
import { loadOwnedPage } from "../../../lib/owner-page";
import { validateDraft, draftWriteFields, validJobId, draftFromRecord, type JobRecord, type DraftState } from "../../../lib/job-drafts";
import { jobsReady, jobContentFields, publicationErrors, validRevision, receiptMatches } from "../../../lib/job-publication";
import { ownerJobColumns } from "../../../lib/owner-jobs";

function refreshJob(id: string,handle: string) {
 for(const path of ["/owner/jobs","/owner/jobs/"+id,"/owner/jobs/"+id+"/review","/owner","/jobs","/jobs/"+id,"/favorites","/p/"+handle]) revalidatePath(path);
}
const changedMessage = "هەلی کار گۆڕاوە یان بەردەست نییە. پەڕەکە نوێ بکەرەوە و دووبارە پشکنە.";
export async function saveJobDraft(_previous: DraftState, formData: FormData): Promise<DraftState> {
 const owner = await verifiedOwner();
 if(!owner) return {message:"بۆ پاشەکەوتکردنی ڕەشنووس سەرەتا بچۆ ژوورەوە."};
 if(process.env.HALDOZ_PAGES_READY !== "true") return {message:"پاشەکەوتکردن هێشتا چالاک نییە."};
 const page = await loadOwnedPage(owner);
 if(!page) return {message:"سەرەتا پەڕەکەت دروست بکە."};
 const {draft,errors} = validateDraft(Object.fromEntries(formData));
 if(Object.keys(errors).length) return {errors,message:"تکایە خانە دیاریکراوەکان پشکنە."};
 const rawId = formData.get("draft_id");
 if(rawId !== null && typeof rawId !== "string") return {message:"ناسنامەی ڕەشنووس ناگونجێت."};
 const id = rawId || "";
 if(id && !validJobId(id)) return {message:"ناسنامەی ڕەشنووس ناگونجێت."};
 if(jobsReady()) {
  const revision = Number(formData.get("revision"));
  let expectedStatus: "draft" | "active" = "draft";
  if(id && !validRevision(revision)) return {message:changedMessage};
  if(id) {
   const current = await owner.client.from("haldoz_jobs").select(ownerJobColumns()).eq("page_id",page.id).eq("id",id).returns<JobRecord[]>().maybeSingle();
   if(current.error || !current.data || current.data.revision !== revision || !["draft","active"].includes(current.data.status)) return {message:changedMessage};
   expectedStatus = current.data.status as "draft" | "active";
   if(current.data.status === "active") { const publishErrors=publicationErrors(draft); if(Object.keys(publishErrors).length) return {errors:publishErrors,message:"زانیاریی پێویست بۆ هەلی بەردەست تەواو بکە."}; }
  }
  const {data,error}=await owner.client.rpc("haldoz_save_job",{job_id:id || null,expected_revision:id?revision:null,job_payload:jobContentFields(draft)});
  if(error || !receiptMatches(data,id,expectedStatus) || !validJobId(data[0].id) || data[0].revision !== (id ? revision + 1 : 1)) return {message:error?.code === "40001" ? changedMessage : "پاشەکەوتکردن پشتڕاست نەکرایەوە. دووبارە پشکنە."};
  refreshJob(data[0].id,page.handle);
  return {savedId:data[0].id,savedRevision:data[0].revision,savedStatus:data[0].status,message:data[0].status === "active" ? "گۆڕانکارییەکان پاشەکەوت کران." : "ڕەشنووس پاشەکەوت کرا؛ هێشتا بڵاونەکراوەتەوە."};
 }
 if(draft.workplace || draft.placement_fee_mode !== "unspecified" || draft.placement_fee || draft.placement_fee_terms) return {message:"پاشەکەوتکردنی وردەکاریی نوێ هێشتا بەردەست نییە؛ زانیارییەکانت لابەرە مەبە."};
 // Ownership and draft state are selected server-side; never accept page_id/status from the form.
 const query = id
  ? owner.client.from("haldoz_jobs").update(draftWriteFields(draft)).eq("page_id",page.id).eq("id",id).eq("status","draft")
  : owner.client.from("haldoz_jobs").insert({...draftWriteFields(draft),page_id:page.id});
 const {data,error} = await query.select("id").maybeSingle();
 if(error || !data || !validJobId(data.id) || (id && data.id !== id)) return {message:"پاشەکەوتکردن پشتڕاست نەکرایەوە. لیستی ڕەشنووسەکان نوێ بکەرەوە و دووبارە پشکنە."};
 revalidatePath("/owner/jobs");
 revalidatePath("/owner/jobs/"+data.id);
 revalidatePath("/owner/jobs/"+data.id+"/review");
 return {savedId:data.id,message:"ڕەشنووس پاشەکەوت کرا؛ بە گشتی بڵاونەکراوەتەوە."};
}

export async function changeJobStatus(_previous: DraftState,formData: FormData): Promise<DraftState> {
 const owner=await verifiedOwner();
 if(!owner) return {message:"سەرەتا بچۆ ژوورەوە."};
 if(process.env.HALDOZ_PAGES_READY !== "true" || !jobsReady()) return {message:"بڵاوکردنەوە هێشتا بەردەست نییە."};
 const page=await loadOwnedPage(owner); if(!page) return {message:"پەڕەکەت بەردەست نییە."};
 const id=formData.get("job_id"),target=formData.get("target_status"),revision=Number(formData.get("revision"));
 if(typeof id !== "string" || !validJobId(id) || !validRevision(revision) || !["active","worker_found"].includes(String(target))) return {message:changedMessage};
 if(formData.get("confirm") !== "on") return {message:"تکایە کردارەکە پشتڕاست بکەرەوە."};
 const {data:row,error:readError}=await owner.client.from("haldoz_jobs").select(ownerJobColumns()).eq("page_id",page.id).eq("id",id).returns<JobRecord[]>().maybeSingle();
 if(readError || !row || row.revision !== revision || row.status !== (target === "active" ? "draft" : "active")) return {message:changedMessage};
 if(target === "active") {const errors=publicationErrors(draftFromRecord(row as JobRecord)); if(Object.keys(errors).length) return {errors,message:"پێش بڵاوکردنەوە زانیارییە پێویستەکان تەواو بکە."};}
 const {data,error}=await owner.client.rpc("haldoz_change_job_status",{job_id:id,expected_revision:revision,target_status:target});
 if(error || !receiptMatches(data,id,target as "active"|"worker_found") || data[0].revision !== revision + 1) return {message:error?.code === "40001" ? changedMessage : "گۆڕینی دۆخ پشتڕاست نەکرایەوە. پەڕەکە نوێ بکەرەوە."};
 refreshJob(id,page.handle);
 return {savedId:id,savedRevision:data[0].revision,savedStatus:data[0].status,message:target === "active" ? "هەلی کار بڵوکرایەوە." : "هەلی کار داخرا؛ چیتر بەردەست نییە."};
}
