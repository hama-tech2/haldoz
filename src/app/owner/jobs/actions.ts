"use server";
import { revalidatePath } from "next/cache";
import { verifiedOwner } from "../../../lib/supabase/server";
import { loadOwnedPage } from "../../../lib/owner-page";
import { validateDraft, draftWriteFields, validJobId, type DraftState } from "../../../lib/job-drafts";
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
