import fs from "node:fs";
try { process.loadEnvFile(".env.local"); } catch {}
const url="https://wickyjtjhgfzntifuzac.supabase.co";
const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const report={ projectRef:"wickyjtjhgfzntifuzac", urlMatches:process.env.NEXT_PUBLIC_SUPABASE_URL===url, publishableKeyPresent:!!key, authenticatedConnectivity:false, googleEnabled:null, hostedCountsVerified:false, warningsVerified:false };
if (report.urlMatches) {
 try {
  const validKey=!!key && /^sb_publishable_[A-Za-z0-9_-]+$/.test(key);
  const response=await fetch(url+"/auth/v1/settings",{headers:validKey?{apikey:key}:{},signal:AbortSignal.timeout(10000)});
  report.authSettingsStatus=response.status;
  if(response.ok && validKey){const settings=await response.json();report.authenticatedConnectivity=true;report.googleEnabled=settings?.external?.google===true;}
 } catch(error){report.networkError=error.cause?.code??error.name;}
}
fs.mkdirSync(".local/qa",{recursive:true});
fs.writeFileSync(".local/qa/supabase-connectivity.json",JSON.stringify(report,null,2));
console.log(JSON.stringify(report));
if(!report.authenticatedConnectivity) process.exitCode=1;
