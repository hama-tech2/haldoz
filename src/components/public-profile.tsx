import Link from "next/link";
import type { PublicPage } from "../lib/page-validation";
import { Icon } from "./icon";
export function PublicProfile({ page, preview = false }: { page: PublicPage; preview?: boolean }) {
  return <article className={"public-profile profile-" + page.brand_tone}>
    {preview && <p className="preview-label"><Icon name="info"/>پێشبینین — ئەم پەڕەیە بڵاونەکراوەتەوە</p>}
    <div className="profile-cover" aria-hidden="true"><span/><span/><span/></div>
    <div className="profile-body"><div className="profile-avatar" aria-hidden="true">{page.display_name.trim().slice(0,1) || "ه"}</div>
      <p className="profile-handle" dir="ltr">@{page.handle || "your-page"}</p>
      <h1>{page.display_name || "ناوی پەڕەکەت"}</h1>
      <p className="profile-bio">{page.bio || "لێرە کار و خزمەتگوزارییەکانت بناسێنە."}</p>
      {page.city && <p className="profile-city"><Icon name="pin"/>{page.city}</p>}
      <div className="profile-contacts">
        {page.public_phone && (preview ? <span className="contact-preview"><bdi dir="ltr">{page.public_phone}</bdi> · پێشبینین</span> : <a className="primary-button" href={"tel:" + page.public_phone}>پەیوەندی بکە <bdi dir="ltr">{page.public_phone}</bdi></a>)}
        {page.public_whatsapp && (preview ? <span className="contact-preview">واتساپ · پێشبینین</span> : <a className="secondary-button" href={"https://wa.me/" + page.public_whatsapp.slice(1)} target="_blank" rel="noopener noreferrer">واتساپ</a>)}
      </div>
    </div>
    <section className="profile-opportunities"><h2>هەلەکانی کار</h2><div className="profile-empty"><Icon name="bag"/><p>بڵاوکردنەوەی هەلی کار لە هەنگاوی داهاتوودا چالاک دەکرێت.</p></div></section>
    <footer className="profile-footer"><p>زانیارییەکانی ئەم پەڕەیە لەلایەن خاوەنەکەیەوە دەنووسرێن.</p><Link href="/">دروستکراوە بە هەڵدۆز · بەخۆڕایی</Link></footer>
  </article>;
}
