import test from "node:test";
import assert from "node:assert/strict";
import { productionReleaseError } from "../src/lib/deployment.ts";
const env={HALDOZ_RELEASE_ENABLED:"true",HALDOZ_SITE_URL:"https://haldoz.example",NEXT_PUBLIC_SUPABASE_URL:"https://wickyjtjhgfzntifuzac.supabase.co",NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:"sb_publishable_"+"synthetic",HALDOZ_AUTH_READY:"true",HALDOZ_PAGES_READY:"true"};
test("production deployment fails closed without release approval, main and verified integration",()=>{
 assert.equal(productionReleaseError(env,"main"),null);
 for(const branch of ["feature/example","recovery/phone-and-release-prep",""])assert.ok(productionReleaseError(env,branch));
 for(const key of ["HALDOZ_RELEASE_ENABLED","HALDOZ_AUTH_READY","HALDOZ_PAGES_READY","NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"])assert.ok(productionReleaseError({...env,[key]:undefined},"main"),key);
 for(const origin of ["http://127.0.0.1:3100","https://user:password@haldoz.example","https://haldoz.example/path"])assert.ok(productionReleaseError({...env,HALDOZ_SITE_URL:origin},"main"));
 assert.ok(productionReleaseError({...env,NEXT_PUBLIC_SUPABASE_URL:"https://another-project.invalid"},"main"));
 assert.ok(productionReleaseError({...env,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:"privileged-key"},"main"));
});
