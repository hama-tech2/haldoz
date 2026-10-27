import Link from "next/link";
import { PublicProfile } from "./public-profile";
import { CopyProfileLink } from "./copy-profile-link";
import type { PublicPage } from "../lib/page-validation";
export function OwnerPageView({ page, url, preview = false }: { page: PublicPage; url: string; preview?: boolean }) {
  return <><div className="owner-account-heading"><p className="owner-eyebrow">پەڕەکەم</p><Link className="text-link" href={preview ? "/preview/page" : "/p/" + page.handle}>بینینی پەڕەی گشتی</Link></div>
    {preview && <p className="form-alert" role="status">نموونەی پێشبینینە؛ ئەکاونت یان پەڕەیەک دروست نەکراوە و هیچ زانیارییەک پاشەکەوت ناکرێت.</p>}
    <div className="owner-action-panel" aria-label="کردارەکانی خاوەن پەڕە"><div className="owner-action-buttons">
      {preview ? <button className="primary-button" disabled aria-describedby="publishing-status">زیادکردنی هەلی کار</button> : <Link className="primary-button" href="/owner/jobs/new">زیادکردنی هەلی کار</Link>}
      <Link className="secondary-button" href={preview ? "/preview/owner/edit" : "/owner/edit"}>{preview ? "پێشبینینی دەستکاریکردن" : "دەستکاریکردنی پڕۆفایل"}</Link>
      {!preview && <CopyProfileLink url={url}/>}
    </div><div className="owner-action-note"><p className="field-help" id="publishing-status">هەلەکان وەک ڕەشنووس پاشەکەوت دەکرێن.</p>{!preview && <Link className="text-link" href="/owner/jobs">داشبۆردی کارەکان</Link>}</div></div>
    <PublicProfile page={page} preview={preview}/>
    {!preview && <form action="/auth/logout" method="post" className="owner-signout"><button className="secondary-button">چوونەدەرەوە</button></form>}
  </>;
}
