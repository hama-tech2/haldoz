"use client";
import {useMemo,useState,useSyncExternalStore} from "react";
import {DraftForm} from "./draft-form";
import {DraftReview} from "./draft-review";
import {blankDraft,validateDraft,validJobId,salaryText,type SaveDraft} from "../lib/job-drafts";
import {fixtureStorageKey,readFixtureDrafts,saveFixtureDraft} from "../lib/draft-fixtures";
const subscribe=(callback:()=>void)=>{window.addEventListener("storage",callback);window.addEventListener("haldoz-drafts",callback);return()=>{window.removeEventListener("storage",callback);window.removeEventListener("haldoz-drafts",callback);};};
const snapshot=()=>{try{return window.localStorage.getItem(fixtureStorageKey) ?? "";}catch{return "__storage_blocked__";}};
const serverSnapshot=()=>"";
export function DraftWorkspace() {
 const raw=useSyncExternalStore(subscribe,snapshot,serverSnapshot);
 const {jobs,error}=useMemo(()=>{try{return {jobs:readFixtureDrafts(raw || null),error:""};}catch{return {jobs:[],error:"ناتوانرێت ڕەشنووسەکانی تاقیکردنەوە بخوێندرێنەوە. زانیارییەک نەگۆڕدراوە."};}},[raw]);
 const [view,setView]=useState<"list"|"edit"|"review">("list");
 const [selected,setSelected]=useState("");
 const [editorKey,setEditorKey]=useState(0);
 const row=jobs.find(job=>job.id===selected);
 const edit=(id:string)=>{setSelected(id);setEditorKey(key=>key+1);setView("edit");};
 const save:SaveDraft=async(_previous,data)=>{
  const {draft,errors}=validateDraft(Object.fromEntries(data));
  if(Object.keys(errors).length)return {errors,message:"تکایە خانە دیاریکراوەکان پشکنە."};
  const supplied=data.get("draft_id");if(supplied && (typeof supplied!=="string" || !validJobId(supplied)))return {message:"ناسنامەی ڕەشنووس ناگونجێت."};
  try {
   const id=typeof supplied==="string" && supplied ? supplied : crypto.randomUUID();
   const current=window.localStorage.getItem(fixtureStorageKey);
   window.localStorage.setItem(fixtureStorageKey,saveFixtureDraft(current,id,draft));
   window.dispatchEvent(new Event("haldoz-drafts"));setSelected(id);
   return {savedId:id,message:"ڕەشنووسی تاقیکردنەوە تەنها لەم وێبگەڕە پاشەکەوت کرا؛ بە گشتی بڵاونەکراوەتەوە."};
  }catch{return {message:"پاشەکەوتکردنی ناوخۆیی سەرکەوتوو نەبوو. ئەم ڕەشنووسە کۆپی بکە؛ بەردەستبوونی بیرگەی وێبگەڕ بپشکنە."};}
 };
 return <><div className="development-notice" role="note"><p><strong>تەنها تاقیکردنەوەی پەرەپێدان</strong> — ئەکاونتی ڕاستەقینە نییە. تەنها زانیاریی ساختە بنووسە؛ ڕەشنووسەکان لەم وێبگەڕە دەمێننەوە و بۆ Supabase نانێردرێن. هیچ لینکێکی گشتی دروست ناکرێت.</p></div>
 <div className="draft-fixture-toolbar"><button className="secondary-button" onClick={()=>setView("list")}>داشبۆردی تاقیکردنەوە</button><button className="primary-button" onClick={()=>edit("")}>زیادکردنی هەلی کار</button></div>
 {error && <p role="alert" className="form-alert">{error}</p>}
 {view==="list" && <><h1>ڕەشنووسەکانی تاقیکردنەوە</h1><section className="draft-list" aria-label="ڕەشنووسەکان">{!jobs.length && !error && <p className="form-alert">هێشتا ڕەشنووسێکت نییە. یەکەم هەلی کارت زیاد بکە.</p>}{jobs.map(job=><article className="draft-list-card" key={job.id}><span className="draft-badge">ڕەشنووس</span><h2>{job.draft.title}</h2><p>{job.draft.city} · <bdi>{salaryText(job.draft)}</bdi></p><div className="draft-card-actions"><button className="secondary-button" onClick={()=>edit(job.id)}>دەستکاریکردن</button><button className="secondary-button" onClick={()=>{setSelected(job.id);setView("review");}}>پێداچوونەوە</button></div></article>)}</section></>}
 {view==="edit" && <><h1>{selected ? "دەستکاریکردنی ڕەشنووس" : "زیادکردنی هەلی کار"}</h1><DraftForm key={editorKey} id={row?.id} initial={row?.draft ?? blankDraft} save={save} fixture onReview={id=>{setSelected(id);setView("review");}}/></>}
 {view==="review" && row && <><h1>پێداچوونەوەی ڕەشنووس</h1><DraftReview draft={row.draft}/><button className="secondary-button" onClick={()=>edit(row.id)}>گەڕانەوە بۆ دەستکاریکردن</button></>}
 </>;
}
