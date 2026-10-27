"use client";
import {useSyncExternalStore} from "react";
import {createSavedStore} from "../lib/jobs";
import {validJobId} from "../lib/job-drafts";
function sharedStore(demo:boolean){
 const store=createSavedStore(demo ? id=>/^demo-[a-z-]+$/.test(id) : validJobId,()=>window.localStorage,demo?"haldoz.saved.v1":"haldoz.saved.jobs.v2");
 let subscribers=0;
 return {...store,subscribe(listener:()=>void){const unsubscribe=store.subscribe(listener);if(subscribers++===0)window.addEventListener("storage",store.refresh);return()=>{unsubscribe();if(--subscribers===0)window.removeEventListener("storage",store.refresh);};}};
}
const real=sharedStore(false),fixture=sharedStore(true);
export function useSavedJobs(demo=false){const store=demo?fixture:real;return {...useSyncExternalStore(store.subscribe,store.getSnapshot,store.getServerSnapshot),toggle:store.toggle};}
