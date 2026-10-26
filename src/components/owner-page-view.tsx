import Link from "next/link";
import { PublicProfile } from "./public-profile";
import { CopyProfileLink } from "./copy-profile-link";
import type { PublicPage } from "../lib/page-validation";
export function OwnerPageView({ page, url, preview = false }: { page: PublicPage; url: string; preview?: boolean }) {
  return <><div className="owner-account-heading"><p className="owner-eyebrow">پەڕەکەم</p><Link className="text-link" href={preview ? "/preview/page" : "/p/" + page.handle}>بینینی پەڕەی گشتی</Link></div>
    {preview && <p className="form-alert" role="status">نموونەی پێشبینینە؛ ئەکاونت یان پەڕەیەک دروست نەکراوە و هیچ زانیارییەک پاشەکەوت ناکرێت.</p>}
    <div className="owner-action-panel" aria-label="کردارەکانی خاوەن پەڕە"><div className="owner-action-buttons">
      <Link className="primary-button" href={preview ? "/preview/owner/edit" : "/owner/edit"}>{preview ? "پێشبینینی دەستکاریکردن" : "دەستکاریکردنی پڕۆفایل"}</Link>
      {preview ? <button className="secondary-button" disabled aria-describedby="publishing-status">زیادکردنی هەلی کار</button> : <Link className="secondary-button" href="/owner/jobs/new">زیادکردنی هەلی کار</Link>}
      {!preview && <CopyProfileLink url={url}/>}
    </div><p className="field-help" id="publishing-status">بڵاوکردنەوەی هەلی کار هێشتا چالاک نییە.</p></div>
    {!preview && <p><Link className="secondary-button" href="/owner/jobs">داشبۆردی کارەکان</Link></p>}
    <PublicProfile page={page} preview={preview}/>
    {!preview && <form action="/auth/logout" method="post" className="owner-signout"><button className="secondary-button">چوونەدەرەوە</button></form>}
  </>;
}
