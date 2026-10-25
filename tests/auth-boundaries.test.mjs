import test from "node:test";
import assert from "node:assert/strict";
import { supabaseConfig, siteOrigin } from "../src/lib/supabase/config.ts";
test("configuration rejects another project, legacy or privileged keys",()=>{
 const previous={...process.env};
 try {
  process.env.NEXT_PUBLIC_SUPABASE_URL="https://other-project.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="invalid";
  assert.equal(supabaseConfig(),null);
  process.env.NEXT_PUBLIC_SUPABASE_URL="https://wickyjtjhgfzntifuzac.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=["sb","secret","fixture"].join("_");
  assert.equal(supabaseConfig(),null);
  process.env.HALDOZ_SITE_URL="http://untrusted.example";
  assert.throws(siteOrigin,/Invalid site origin/);
  process.env.HALDOZ_SITE_URL="http://127.0.0.1:3100";
  assert.equal(siteOrigin(),"http://127.0.0.1:3100");
 } finally {for(const name of ["NEXT_PUBLIC_SUPABASE_URL","NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY","HALDOZ_SITE_URL"]){if(previous[name]===undefined)delete process.env[name];else process.env[name]=previous[name];}}
});
