"use client";
import {useActionState,useEffect} from "react";
import {useRouter} from "next/navigation";
import {changeJobStatus} from "../app/owner/jobs/actions";
import type {DraftState} from "../lib/job-drafts";
export function JobStatusAction({id,revision,target}:{id:string;revision:number;target:"active"|"worker_found"}) {
 const [state,action,pending]=useActionState<DraftState,FormData>(changeJobStatus,{});
 const router=useRouter();
 useEffect(()=>{if(state.savedId)router.refresh();},[state.savedId,router]);
 return <form action={action} className="job-status-action"><input type="hidden" name="job_id" value={id}/><input type="hidden" name="revision" value={revision}/><input type="hidden" name="target_status" value={target}/>
 <label className="public-consent"><input type="checkbox" name="confirm" required/><span>{target === "active" ? "زانیارییەکان و کرێی نووسینگە ڕاستن؛ ڕازیم بە گشتی بڵاو بکرێنەوە." : "کارمەند دۆزراوەتەوە؛ ئەم هەلە چیتر بەردەست نییە."}</span></label>
 <button className={target === "active" ? "primary-button" : "secondary-button"} disabled={pending || !!state.savedId}>{pending ? "پاشەکەوتکردن…" : target === "active" ? "بڵاوکردنەوەی هەلی کار" : "داخستنی هەلی کار"}</button>
 {state.message && <p className="form-alert" role={state.savedId?"status":"alert"}>{state.message}</p>}{state.errors && <ul>{Object.values(state.errors).map(error=><li key={error}>{error}</li>)}</ul>}
 </form>;
}
