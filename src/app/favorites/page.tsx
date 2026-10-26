import type { Metadata } from "next";
import { JobBrowser } from "../../components/job-browser";
export const metadata: Metadata = { title: "دڵخوازەکان" };
export const dynamic = "force-dynamic";
export default function Favorites() { return <JobBrowser favorites now={new Date().toISOString()}/>; }
