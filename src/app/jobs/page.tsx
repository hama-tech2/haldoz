import { JobBrowser } from "../../components/job-browser";
export const dynamic = "force-dynamic";
export default function Jobs() { return <JobBrowser now={new Date().toISOString()}/>; }
