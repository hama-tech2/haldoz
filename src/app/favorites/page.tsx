import type {Metadata} from "next";
import {JobBrowser} from "../../components/job-browser";
import {loadPublicJobs} from "../../lib/public-jobs";
import {publicJobCard} from "../../lib/public-job-card";
export const metadata:Metadata={title:"دڵخوازەکان"};
export const dynamic="force-dynamic";
export default async function Favorites(){const result=await loadPublicJobs();return <JobBrowser favorites jobs={result.jobs.map(publicJobCard)} unavailable={result.unavailable} now={new Date().toISOString()}/>;}
