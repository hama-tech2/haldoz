import test from "node:test";
import assert from "node:assert/strict";
import { productionReleaseError, previewReleaseError, previewTarget } from "../src/lib/deployment.ts";
const env={HALDOZ_RELEASE_ENABLED:"true",HALDOZ_SITE_URL:"https://haldoz.example",NEXT_PUBLIC_SUPABASE_URL:"https://wickyjtjhgfzntifuzac.supabase.co",NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:"sb_publishable_"+"synthetic",HALDOZ_AUTH_READY:"true",HALDOZ_PAGES_READY:"true"};
test("production deployment fails closed without release approval, main and verified integration",()=>{
 assert.equal(productionReleaseError(env,"main"),null);
 for(const branch of ["feature/example","recovery/phone-and-release-prep",""])assert.ok(productionReleaseError(env,branch));
 for(const key of ["HALDOZ_RELEASE_ENABLED","HALDOZ_AUTH_READY","HALDOZ_PAGES_READY","NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"])assert.ok(productionReleaseError({...env,[key]:undefined},"main"),key);
 for(const origin of ["http://127.0.0.1:3100","https://user:password@haldoz.example","https://haldoz.example/path"])assert.ok(productionReleaseError({...env,HALDOZ_SITE_URL:origin},"main"));
 assert.ok(productionReleaseError({...env,NEXT_PUBLIC_SUPABASE_URL:"https://another-project.invalid"},"main"));
 assert.ok(productionReleaseError({...env,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:"privileged-key"},"main"));
});

const previewEnv={...env,HALDOZ_PREVIEW_ENABLED:"true",HALDOZ_PREVIEW_CALLBACK_VERIFIED:"true",CLOUDFLARE_ACCOUNT_ID:previewTarget.account,HALDOZ_SITE_URL:previewTarget.origin,HALDOZ_JOBS_READY:"false",HALDOZ_HOSTED_PREVIEW:"true"};
test("test deployment requires approval, exact account/branch/origin and approved backend",()=>{
 assert.equal(previewReleaseError(previewEnv,previewTarget.branch),null);
 for(const branch of ["main","codex/unreviewed",""])assert.ok(previewReleaseError(previewEnv,branch));
 for(const key of ["HALDOZ_PREVIEW_ENABLED","HALDOZ_PREVIEW_CALLBACK_VERIFIED","CLOUDFLARE_ACCOUNT_ID","HALDOZ_AUTH_READY","HALDOZ_PAGES_READY","HALDOZ_HOSTED_PREVIEW"])assert.ok(previewReleaseError({...previewEnv,[key]:undefined},previewTarget.branch),key);
 for(const [key,value]of Object.entries({CLOUDFLARE_ACCOUNT_ID:"another-account",HALDOZ_SITE_URL:"https://haldoz.example",HALDOZ_JOBS_READY:"true",NEXT_PUBLIC_SUPABASE_URL:"https://another.invalid",NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:"sb_secret_synthetic"}))assert.ok(previewReleaseError({...previewEnv,[key]:value},previewTarget.branch));
 assert.equal(previewReleaseError({...previewEnv,HALDOZ_PREVIEW_ENABLED:undefined,HALDOZ_PREVIEW_CALLBACK_VERIFIED:undefined},previewTarget.branch,true),null,"Dry-run packaging needs no hosted approval and uploads nothing");
 assert.ok(previewReleaseError({...previewEnv,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:"privileged"},previewTarget.branch,true));
});
