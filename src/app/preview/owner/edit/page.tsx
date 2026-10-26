import Link from "next/link";
import { EntryHeader } from "../../../../components/entry-header";
import { PageSetupForm } from "../../../../components/page-setup-form";
import { previewPage } from "../../../../lib/page-validation";
import "../../../entry.css";
import "../../../owner.css";
import "../../../owner/account.css";
export default function EditPreview() {
  return <div><EntryHeader/><main id="main-content" className="owner-shell"><div className="setup-heading"><Link className="text-link" href="/preview/owner">گەڕانەوە بۆ نموونەی پەڕەکەم</Link><h1>پێشبینینی دەستکاریکردن</h1><p className="form-alert">ئەمە فۆڕمی نموونەییە؛ ئەکاونت نییە و هیچ گۆڕانکارییەک پاشەکەوت ناکرێت.</p></div><PageSetupForm canSave={false} initialPage={previewPage} mode="edit"/></main></div>;
}
