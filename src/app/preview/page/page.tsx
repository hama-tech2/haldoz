import { EntryHeader } from "../../../components/entry-header";
import { PublicProfile } from "../../../components/public-profile";
import { previewPage } from "../../../lib/page-validation";
import Link from "next/link";
import "../../entry.css";
import "../../owner.css";
export default function PreviewPage() { return <div className="owner-shell narrow-shell"><EntryHeader/><main id="main-content"><PublicProfile page={previewPage} preview/><Link className="primary-button full-width preview-cta" href="/page-setup">زانیاریی پەڕەکەت تاقی بکەرەوە</Link></main></div>; }
