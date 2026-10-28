"use client";
import { useActionState, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { blankPage, cities, initialPageForm, normalizePhone, validatePage, type PublicPage, type PageErrors } from "../lib/page-validation";
import { PublicProfile } from "./public-profile";
import { updatePage } from "../app/owner/actions";
import { savePage, type SetupState } from "../app/page-setup/actions";
export function PageSetupForm({ canSave, initialPage = blankPage, mode = "create", authenticated = false, unavailableReason }: { canSave: boolean; initialPage?: PublicPage; mode?: "create" | "edit"; authenticated?: boolean; unavailableReason?: string }) {
  const [page, setPage] = useState<PublicPage>(() => initialPageForm(initialPage, mode));
  const [whatsappEnabled, setWhatsappEnabled] = useState(() => mode === "create" || !!initialPage.public_whatsapp);
  const [confirmed, setConfirmed] = useState(false);
  const [localErrors, setLocalErrors] = useState<PageErrors>({});
  const [dirty, setDirty] = useState(false);
  const [state, action, pending] = useActionState<SetupState, FormData>(mode === "edit" ? updatePage : savePage, {});
  const errors = { ...(!dirty && state.errors), ...localErrors };
  const changed = () => { setLocalErrors({}); setDirty(true); };
  const update = (name: keyof PublicPage, value: string) => { setPage(previous => ({ ...previous, [name]: value })); changed(); };
  useEffect(() => { if (!pending && !dirty && state.errors) document.getElementById(Object.keys(state.errors)[0])?.focus(); }, [pending, dirty, state.errors]);
  function submit(event: FormEvent<HTMLFormElement>) {
    // Read the actual form, including browser autofill; normalize only on submission.
    const next = validatePage(Object.fromEntries(new FormData(event.currentTarget))).errors;
    setLocalErrors(next);
    if (Object.keys(next).length) { event.preventDefault(); requestAnimationFrame(() => document.getElementById(Object.keys(next)[0])?.focus()); }
    else setDirty(false);
  }
  const previewPhone = normalizePhone(page.public_phone);
  const previewPage = { ...page, public_phone: previewPhone, public_whatsapp: whatsappEnabled ? previewPhone : "" };
  return <div className="setup-grid"><form action={action} onSubmit={submit} onReset={event => event.preventDefault()} className="setup-form">
    {!canSave && authenticated && <p className="form-alert" role="status">{unavailableReason}</p>}
    <div className="form-section"><h2>پەڕەکەت بناسێنە</h2>
      <label htmlFor="display_name">ناوی پەڕە <span aria-hidden="true">*</span></label><input id="display_name" name="display_name" value={page.display_name} onChange={e => update("display_name", e.target.value)} autoComplete="organization" spellCheck={false} required aria-invalid={!!errors.display_name} aria-describedby="display_name-error"/><p className="field-error" id="display_name-error">{errors.display_name}</p>
      <label htmlFor="handle">بەستەری پەڕە <span aria-hidden="true">*</span></label><div className="handle-input" dir="ltr"><span>/p/</span><input id="handle" name="handle" readOnly={mode === "edit"} className={mode === "edit" ? "handle-readonly" : undefined} value={page.handle} onChange={e => update("handle", e.target.value)} autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={32} minLength={3} required aria-invalid={!!errors.handle} aria-describedby="handle-help handle-error"/></div><p className="field-help" id="handle-help">{mode === "edit" ? "بەستەری پەڕە ناگۆڕدرێت." : "٣–٣٢ پیتی لاتینی، ژمارە یان هێڵ؛ پاش دروستکردن ناگۆڕدرێت."}</p><p className="field-error" id="handle-error">{errors.handle}</p>
      <label htmlFor="city">شار <span aria-hidden="true">*</span></label><select id="city" name="city" value={page.city} onChange={e => update("city", e.target.value)} required aria-invalid={!!errors.city} aria-describedby="city-error"><option value="">شارێک هەڵبژێرە</option>{cities.map(city => <option key={city}>{city}</option>)}</select><p className="field-error" id="city-error">{errors.city}</p>
      <label htmlFor="bio">دەربارەی پەڕە <span className="optional-label">ئارەزوومەندانە</span></label><textarea id="bio" name="bio" value={page.bio} onChange={e => update("bio", e.target.value)} maxLength={500} rows={4} aria-describedby="bio-count bio-error"/><div className="field-count" id="bio-count">{page.bio.length}/500</div><p className="field-error" id="bio-error">{errors.bio}</p>
    </div><div className="form-section"><h2>پەیوەندیی گشتی</h2>
      <label htmlFor="public_phone">ژمارەی تەلەفۆنی گشتی <span aria-hidden="true">*</span></label><input id="public_phone" name="public_phone" type="tel" dir="ltr" inputMode="tel" autoComplete="tel" placeholder="ژمارەی مۆبایل بنووسە" value={page.public_phone} onChange={e => update("public_phone", e.target.value)} maxLength={64} required aria-invalid={!!errors.public_phone} aria-describedby="public_phone-help public_phone-error"/><p className="field-help" id="public_phone-help">ژمارەکەت بە شێوەی ئاسایی بنووسە؛ هەمان ژمارە بۆ پەیوەندی و واتساپ بەکاردێت.</p><p className="field-error" id="public_phone-error">{errors.public_phone}</p>
      <label className="public-consent"><input name="whatsapp_enabled" type="checkbox" checked={whatsappEnabled} onChange={e => { setWhatsappEnabled(e.target.checked); changed(); }}/><span>واتساپ بە هەمان ژمارە</span></label>
    </div><details className="form-section setup-appearance"><summary>ڕەنگی پەڕە <span className="optional-label">ئارەزوومەندانە</span></summary><select name="brand_tone" aria-label="ڕەنگی پەڕە" value={page.brand_tone} onChange={e => update("brand_tone",e.target.value)}><option value="blue">شین</option><option value="teal">سەوزی تۆخ</option><option value="violet">مۆر</option></select></details>
    <label className="public-consent"><input id="confirm_public" name="confirm_public" type="checkbox" checked={confirmed} onChange={e => { setConfirmed(e.target.checked); changed(); }} required aria-describedby="confirm-error"/><span>ڕازیم ئەم ناو، کورتە، شار و ژمارەیە بە گشتی پیشان بدرێن.</span></label><p className="field-error" id="confirm-error">{errors.confirm_public}</p>
    {!!Object.keys(localErrors).length && <p role="alert" className="validation-summary">تکایە خانە دیاریکراوەکان پشکنە.</p>}
    {state.message && !dirty && !pending && <p role="alert" className="form-alert">{state.message}</p>}
    <div className="setup-actions"><button className="primary-button" disabled={!canSave || pending}>{pending ? "پاشەکەوتکردن…" : mode === "edit" ? "پاشەکەوتکردنی گۆڕانکارییەکان" : "دروستکردنی پەڕە"}</button></div>
    {!canSave && !authenticated && <p className="form-alert" role="status">{unavailableReason ?? "ئەمە پێشبینینە؛ پاشەکەوتکردن هێشتا بەردەست نییە."} <Link href="/create">چوونەژوورەوە و دۆخی خزمەتگوزاری</Link></p>}
  </form><aside className="setup-preview" aria-label="پێشبینینی پەڕە"><h2>پەڕەکەت چۆن دەردەکەوێت</h2><PublicProfile page={previewPage} preview/></aside></div>;
}
