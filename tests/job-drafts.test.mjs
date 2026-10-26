import test from "node:test";
import assert from "node:assert/strict";
import {blankDraft,validateDraft,draftWriteFields,salaryText} from "../src/lib/job-drafts.ts";
import {readFixtureDrafts,saveFixtureDraft} from "../src/lib/draft-fixtures.ts";
const base={...blankDraft,title:"فرۆشیار",city:"هەولێر"};
test("drafts require title and a supported city but allow missing optional detail",()=>{
 assert.deepEqual(validateDraft(base).errors,{});
 assert.ok(validateDraft({...base,title:" "}).errors.title);
 assert.ok(validateDraft({...base,city:"unknown"}).errors.city);
 assert.ok(validateDraft({...base,description:"x".repeat(4001)}).errors.description);
});
test("salary is explicit, normalizes Kurdish digits and respects integer bounds",()=>{
 const fixed=validateDraft({...base,salary_mode:"fixed",salary:"٦٥٠٠٠٠"});assert.deepEqual(fixed.errors,{});assert.equal(draftWriteFields(fixed.draft).salary,650000);
 for(const salary of ["-1","1.5","1e6","2147483648","NaN",""])assert.ok(validateDraft({...base,salary_mode:"fixed",salary}).errors.salary);
 assert.equal(draftWriteFields(validateDraft({...base,salary:"650000"}).draft).salary,null);
 assert.equal(salaryText(base),"مووچە دیاری نەکراوە");
});
test("time is paired and strict; overnight shifts are allowed without fabricated hours",()=>{
 assert.ok(validateDraft({...base,start_time:"09:00"}).errors.end_time);
 assert.ok(validateDraft({...base,start_time:"25:00",end_time:"17:00"}).errors.start_time);
 assert.deepEqual(validateDraft({...base,start_time:"22:00",end_time:"06:00",shift:"night"}).errors,{});
 assert.ok(validateDraft({...base,shift:"constructor"}).errors.shift);
});
test("draft write whitelist ignores forged ownership, publication and identity fields",()=>{
 const {draft,errors}=validateDraft({...base,id:"forged",page_id:"other",owner_id:"other",status:"active",published_at:"now"});
 assert.deepEqual(errors,{});const fields=draftWriteFields(draft);assert.equal(fields.status,"draft");
 for(const key of ["id","page_id","owner_id","published_at","completed_at"])assert.equal(key in fields,false);
});
test("development drafts persist independently and reject corrupt/versioned/oversized storage",()=>{
 const id="44444444-4444-4444-8444-444444444444";let raw=saveFixtureDraft(null,id,base);
 assert.equal(readFixtureDrafts(raw)[0].draft.title,base.title);
 raw=saveFixtureDraft(raw,id,{...base,title:"کارمەندی ئۆفیس"});assert.equal(readFixtureDrafts(raw).length,1);assert.equal(readFixtureDrafts(raw)[0].draft.title,"کارمەندی ئۆفیس");
 for(const bad of ["{",JSON.stringify({version:2,jobs:[]}),JSON.stringify({version:1,jobs:[{id:"../escape",draft:base}]}),"x".repeat(200001)])assert.throws(()=>readFixtureDrafts(bad));
 const rows=readFixtureDrafts(raw);assert.throws(()=>readFixtureDrafts(JSON.stringify({version:1,jobs:[rows[0],rows[0]]})));
 assert.throws(()=>saveFixtureDraft("{",id,base));
});
