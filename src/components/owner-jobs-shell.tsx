import Link from "next/link";
import type { ReactNode } from "react";
import { EntryHeader } from "./entry-header";
export function OwnerJobsShell({children}: {children:ReactNode}) {
 return <div><EntryHeader/><main id="main-content" className="owner-shell drafts-shell"><nav className="draft-nav" aria-label="ڕێنیشاندەری خاوەن پەڕە"><Link href="/owner">پەڕەکەم</Link><Link href="/owner/jobs">داشبۆردی کارەکان</Link></nav>{children}</main></div>;
}
export function JobsUnavailable() { return <><h1>هەلەکانی کار</h1><p className="form-alert">خزمەتگوزاریی ڕەشنووس هێشتا چالاک نییە. ئەکاونتی ڕاستەقینە و ڕێگەپێدانی داتابەیس پێویستن.</p></>; }
