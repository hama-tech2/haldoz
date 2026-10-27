"use client";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
// No cached availability across focus/back navigation. Hidden tabs do not poll.
export function RefreshPublicJobs(){const router=useRouter();useEffect(()=>{const refresh=()=>{if(document.visibilityState==="visible")router.refresh();};const timer=setInterval(refresh,30000);window.addEventListener("focus",refresh);window.addEventListener("pageshow",refresh);document.addEventListener("visibilitychange",refresh);return()=>{clearInterval(timer);window.removeEventListener("focus",refresh);window.removeEventListener("pageshow",refresh);document.removeEventListener("visibilitychange",refresh);};},[router]);return null;}
