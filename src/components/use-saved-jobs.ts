"use client";
import { useSyncExternalStore } from "react";
import { jobs } from "../data/jobs";
import { createSavedStore } from "../lib/jobs";
const store = createSavedStore(jobs.map(job => job.id), () => window.localStorage);
let subscribers = 0;
function subscribe(listener: () => void) {
  const unsubscribe = store.subscribe(listener);
  if (subscribers++ === 0) window.addEventListener("storage", store.refresh);
  return () => {
    unsubscribe();
    if (--subscribers === 0) window.removeEventListener("storage", store.refresh);
  };
}
export function useSavedJobs() {
  return { ...useSyncExternalStore(subscribe, store.getSnapshot, store.getServerSnapshot), toggle: store.toggle };
}
