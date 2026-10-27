import "server-only";
import {createClient} from "@supabase/supabase-js";
import {supabaseConfig} from "./supabase/config";
import {isPubliclyAvailable,jobsReady} from "./job-publication";
import type {JobRecord} from "./job-drafts";
import type {PublicPage} from "./page-validation";
export type PublicJob = JobRecord & {page: Pick<PublicPage,"handle"|"display_name"|"public_phone"|"public_whatsapp"|"brand_tone">};
export async function loadPublicJobs({pageId,id}:{pageId?:string;id?:string}={}) : Promise<{jobs:PublicJob[];unavailable:boolean}> {
 const config=supabaseConfig();
 if(!config || process.env.HALDOZ_PAGES_READY !== "true")return {jobs:[],unavailable:true};
 // Always anonymous, even when an owner is viewing their own public page.
 const client=createClient(config.url,config.key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},global:{fetch:(input,init)=>fetch(input,{...init,cache:"no-store"})}});
 const fields="id,page_id,title,city,description,salary_mode,salary,start_time,end_time,shift,status,published_at,created_at"+(jobsReady()?",revision,workplace,placement_fee_mode,placement_fee,placement_fee_terms":"")+",page:haldoz_pages!inner(handle,display_name,public_phone,public_whatsapp,brand_tone)";
 let query=client.from("haldoz_jobs").select(fields).eq("status","active").lte("published_at",new Date().toISOString()).order("published_at",{ascending:false}).order("id",{ascending:false}).limit(id?1:200);
 if(pageId)query=query.eq("page_id",pageId);
 if(id)query=query.eq("id",id);
 const {data,error}=await query;
 if(error)return {jobs:[],unavailable:true};
 const rows=(data ?? []) as unknown as PublicJob[];
 return {jobs:rows.filter(row=>isPubliclyAvailable(row)&&!!row.page),unavailable:false};
}
