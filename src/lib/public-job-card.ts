import {draftFromRecord} from "./job-drafts.ts";
import {placementFeeText} from "./job-publication.ts";
import type {PublicJob} from "./public-jobs";
import type {Job} from "./jobs";
export function publicJobCard(row: PublicJob): Job {return {id:row.id,title:row.title,pageName:row.page.display_name,initial:Array.from(row.page.display_name)[0] ?? "ه",logoTone:row.page.brand_tone,salary:row.salary,salaryMode:row.salary_mode as Job["salaryMode"],start:row.start_time,end:row.end_time,shift:row.shift as Job["shift"],city:row.city,district:row.workplace ?? null,category:"",postedAt:row.published_at!,href:"/jobs/"+row.id,pageHref:"/p/"+row.page.handle,placementFee:placementFeeText(draftFromRecord(row))};}
