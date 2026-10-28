import "server-only";
import { redirect } from "next/navigation";
import { verifiedOwner } from "./supabase/server";
import { loadOwnedPage } from "./owner-page";
import { validJobId, type JobRecord } from "./job-drafts";
import { jobsReady } from "./job-publication";
export const draftColumns = "id,title,city,description,salary_mode,salary,start_time,end_time,shift,status,created_at";
export function ownerJobColumns() { return draftColumns + (jobsReady() ? ",published_at,revision,workplace,placement_fee_mode,placement_fee,placement_fee_terms" : ""); }
export async function ownerJobsContext() {
 const owner = await verifiedOwner();
 if(!owner) redirect("/create");
 if(process.env.HALDOZ_PAGES_READY !== "true") return null;
 const page = await loadOwnedPage(owner);
 if(!page) redirect("/page-setup");
 return {owner,page};
}
export async function loadOwnedJob(context: NonNullable<Awaited<ReturnType<typeof ownerJobsContext>>>, id: string) {
 if(!validJobId(id)) return null;
 const {data,error} = await context.owner.client.from("haldoz_jobs").select(ownerJobColumns()).eq("page_id",context.page.id).eq("id",id).returns<JobRecord[]>().maybeSingle();
 if(error) throw new Error("Draft temporarily unavailable");
 return data as JobRecord | null;
}
