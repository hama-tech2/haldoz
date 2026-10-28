"use client";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { cities } from "../lib/page-validation";
import { blankDraft, shifts, type JobDraft, type SaveDraft, type DraftState } from "../lib/job-drafts";
export function DraftForm({ initial = blankDraft, id = "", revision = 0, active = false, extended = false, save, fixture = false, onReview }: { initial?: JobDraft; id?: string; revision?: number; active?: boolean; extended?: boolean; save: SaveDraft; fixture?: boolean; onReview?: (id:string)=>void }) {
 const [draft,setDraft] = useState<JobDraft>(()=>({...initial}));
 const [dirty,setDirty] = useState(false);
 const [loadedRevision] = useState(revision);
 const [state,action,pending] = useActionState<DraftState,FormData>(save,{});
 useEffect(()=>{if(!pending && state.errors){const first=Object.keys(state.errors)[0];if(first)document.getElementById(first)?.focus();}},[pending,state.errors]);
 const currentId = state.savedId || id;
 const saved = !!state.savedId && !dirty && !pending;
 const change = (name:keyof JobDraft,value:string)=>{setDraft(previous=>({...previous,[name]:value}));setDirty(true);};

 const errors = dirty ? {} : state.errors ?? {};
 return <form action={action} onReset={event=>event.preventDefault()} onSubmit={()=>setDirty(false)} className="setup-form draft-form">
  <input type="hidden" name="draft_id" value={currentId}/>
  <input type="hidden" name="revision" value={state.savedRevision ?? loadedRevision}/>
  <div className="form-section"><h2>زانیاریی سەرەکی</h2><p className="field-help">بۆ ڕەشنووس ناوی کار و شار پێویستن. پاشەکەوتکردن بە واتای بڵاوکردنەوە نییە.</p>
   <label htmlFor="title">ناوی کار *</label><input id="title" name="title" value={draft.title} onChange={e=>change("title",e.target.value)} required minLength={2} maxLength={120} aria-invalid={!!errors.title} aria-describedby="title-error"/><p className="field-error" id="title-error">{errors.title}</p>
   <label htmlFor="city">شار *</label><select id="city" name="city" value={draft.city} onChange={e=>change("city",e.target.value)} required aria-invalid={!!errors.city} aria-describedby="city-error"><option value="">شارێک هەڵبژێرە</option>{cities.map(city=><option key={city}>{city}</option>)}</select><p className="field-error" id="city-error">{errors.city}</p>
   {extended && <><label htmlFor="workplace">شوێنی کار</label><input id="workplace" name="workplace" value={draft.workplace} onChange={e=>change("workplace",e.target.value)} maxLength={200} aria-invalid={!!errors.workplace} aria-describedby="workplace-error"/><p className="field-error" id="workplace-error">{errors.workplace}</p></>}
   <label htmlFor="description">دەربارەی کار <span className="optional-label">ئارەزوومەندانە</span></label><textarea id="description" name="description" value={draft.description} onChange={e=>change("description",e.target.value)} maxLength={4000} rows={5} aria-describedby="description-help description-error"/><p className="field-help" id="description-help">ئەرک و مەرجەکان بنووسە. ژمارە یان زانیاریی تایبەتیی کەسانی تر مەنووسە.</p><p className="field-error" id="description-error">{errors.description}</p>
  </div>
  <details className="form-section draft-optional" open={!!(errors.salary || errors.salary_mode || errors.start_time || errors.end_time || errors.shift)}><summary>مووچە و کاتی کار</summary>
   <label htmlFor="salary_mode">دۆخی مووچە</label><select id="salary_mode" name="salary_mode" value={draft.salary_mode} onChange={e=>change("salary_mode",e.target.value)} aria-describedby="salary_mode-error"><option value="unspecified">دیاری نەکراوە</option><option value="fixed">بڕی دیاریکراو</option><option value="negotiable">بە ڕێککەوتن</option></select><p className="field-error" id="salary_mode-error">{errors.salary_mode}</p>
   {draft.salary_mode === "fixed" && <><label htmlFor="salary">مووچەی مانگانە — IQD</label><input id="salary" name="salary" dir="ltr" inputMode="numeric" value={draft.salary} onChange={e=>change("salary",e.target.value)} maxLength={10} required aria-invalid={!!errors.salary} aria-describedby="salary-error"/><p className="field-error" id="salary-error">{errors.salary}</p></>}
   <label htmlFor="shift">کاتی کار</label><select id="shift" name="shift" value={draft.shift} onChange={e=>change("shift",e.target.value)} aria-describedby="shift-error">{Object.entries(shifts).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select><p className="field-error" id="shift-error">{errors.shift}</p>
   <div className="draft-time-grid">{(["start_time","end_time"] as const).map((field,index)=><div key={field}><label htmlFor={field}>{index ? "کۆتایی" : "دەستپێک"}</label><input type="time" dir="ltr" id={field} name={field} defaultValue={initial[field]} onInput={()=>setDirty(true)} onChange={()=>setDirty(true)} aria-invalid={!!errors[field]} aria-describedby={field+"-error"}/><p className="field-error" id={field+"-error"}>{errors[field]}</p></div>)}</div><p className="field-help">کاتی بەتاڵ وەک دیاری نەکراو پیشان دەدرێت؛ کۆتایی زووتر لە دەستپێک واتای شەوەڕۆ دەدات.</p>
  </details>
  {extended && <details className="form-section draft-optional" open={!!(errors.placement_fee_mode || errors.placement_fee || errors.placement_fee_terms)}><summary>کرێی نووسینگە</summary>
   <p className="field-help">هەڵدۆز بەخۆڕاییە. ئەگەر نووسینگەکەت کرێ وەردەگرێت، لێرە ڕوونی بکەرەوە.</p>
   <label htmlFor="placement_fee_mode">کرێ هەیە؟</label><select id="placement_fee_mode" name="placement_fee_mode" value={draft.placement_fee_mode} onChange={e=>change("placement_fee_mode",e.target.value)} aria-invalid={!!errors.placement_fee_mode} aria-describedby="placement_fee_mode-error"><option value="unspecified">هەڵبژێرە</option><option value="none">نەخێر، بێ کرێ</option><option value="fixed">بڕێکی دیاریکراو — IQD</option><option value="percentage">ڕێژەی سەدی</option></select><p className="field-error" id="placement_fee_mode-error">{errors.placement_fee_mode}</p>
   {["fixed","percentage"].includes(draft.placement_fee_mode) && <><label htmlFor="placement_fee">{draft.placement_fee_mode === "fixed" ? "بڕی کرێ — IQD" : "ڕێژە — %"}</label><input id="placement_fee" name="placement_fee" dir="ltr" inputMode="decimal" value={draft.placement_fee} onChange={e=>change("placement_fee",e.target.value)} maxLength={16} required aria-invalid={!!errors.placement_fee} aria-describedby="placement_fee-error"/><p className="field-error" id="placement_fee-error">{errors.placement_fee}</p><label htmlFor="placement_fee_terms">بنەمای کرێ و کاتی پارەدان</label><textarea id="placement_fee_terms" name="placement_fee_terms" value={draft.placement_fee_terms} onChange={e=>change("placement_fee_terms",e.target.value)} maxLength={500} rows={3} aria-invalid={!!errors.placement_fee_terms} aria-describedby="placement_fee_terms-error"/><p className="field-error" id="placement_fee_terms-error">{errors.placement_fee_terms}</p></>}
  </details>}
  <p className="field-help">پەیوەندی بە ژمارەی گشتیی پەڕەکەت دەکرێت؛ ژمارەی تایبەتی کەسێکی تر زیاد مەکە.</p>
  {state.message && !dirty && !pending && <p role={state.errors ? "alert" : "status"} className="form-alert">{state.message}</p>}
  <div className="setup-actions"><button className="primary-button" disabled={pending}>{pending ? "پاشەکەوتکردن…" : fixture ? "پاشەکەوتکردنی ڕەشنووسی تاقیکردنەوە" : active ? "پاشەکەوتکردنی گۆڕانکارییەکان" : "پاشەکەوتکردنی ڕەشنووس"}</button>
   {saved && (fixture ? <button type="button" className="secondary-button" onClick={()=>onReview?.(currentId)}>پێداچوونەوەی ڕەشنووس</button> : <Link className="secondary-button" href={"/owner/jobs/"+currentId+"/review"}>پێداچوونەوەی ڕەشنووس</Link>)}
  </div>
  {dirty && currentId && <p className="field-help" role="status">گۆڕانکارییەکان هێشتا پاشەکەوت نەکراون.</p>}
 </form>;
}
