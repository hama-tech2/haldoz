import type {ReactNode} from "react";
import {OwnerJobsShell} from "../../../components/owner-jobs-shell";
import "../../entry.css";
import "../../owner.css";
import "../account.css";
import "./drafts.css";
export default function JobsLayout({children}:{children:ReactNode}) { return <OwnerJobsShell>{children}</OwnerJobsShell>; }
