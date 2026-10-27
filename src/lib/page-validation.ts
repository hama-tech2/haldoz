import { parsePhoneNumberFromString } from "libphonenumber-js/max";

export const cities = ["هەولێر", "سلێمانی", "دهۆک", "هەڵەبجە", "کەرکووک", "شارێکی تر"] as const;
export const reservedHandles = new Set(["admin","api","auth","create","dashboard","favorites","haldoz","help","jobs","login","owner","p","page-setup","preview","settings","support","www"]);
export type PublicPage = { id?: string; handle: string; display_name: string; bio: string; city: string; public_phone: string; public_whatsapp: string; brand_tone: "blue" | "teal" | "violet" };
export type PageInput = PublicPage & { confirm_public: boolean };
export type PageErrors = Partial<Record<keyof PageInput, string>>;
export const blankPage: PublicPage = { handle: "", display_name: "", bio: "", city: "", public_phone: "", public_whatsapp: "", brand_tone: "blue" };
// Creating a page must never inherit a contact from account data or preview props.
export function initialPageForm(page: PublicPage, mode: "create" | "edit"): PublicPage {
  return { ...page, public_phone: mode === "edit" ? page.public_phone || page.public_whatsapp : "", public_whatsapp: mode === "edit" ? page.public_whatsapp : "" };
}
export function validHandle(value: string) { return /^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/.test(value) && !reservedHandles.has(value); }
export function normalizePhone(value: string) {
  const input = value.normalize("NFKC")
    .replace(/[٠-٩۰-۹]/g, digit => String(digit.charCodeAt(0) - (digit <= "٩" ? 0x660 : 0x6f0)))
    .replace(/[\u200e\u200f\u061c]/g, "")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .trim();
  const compact = input.replace(/[\s().-]/g, "");
  const international = /^964\d+$/.test(compact) ? "+" + compact : input;
  const phone = parsePhoneNumberFromString(international, { defaultCountry: "IQ", extract: false });
  return phone && !phone.ext && phone.isValid() ? phone.number : "";
}
export function validatePage(raw: Record<string, unknown>): { page: PublicPage; errors: PageErrors } {
  const text = (key: string) => typeof raw[key] === "string" ? (raw[key] as string).trim() : "";
  const phone = normalizePhone(text("public_phone"));
  const whatsappEnabled = raw.whatsapp_enabled === true || raw.whatsapp_enabled === "on";
  // A second number is never accepted from the browser, including forged legacy fields.
  const page: PublicPage = { handle: text("handle").toLowerCase(), display_name: text("display_name"), bio: text("bio"), city: text("city"), public_phone: phone, public_whatsapp: whatsappEnabled ? phone : "", brand_tone: text("brand_tone") as PublicPage["brand_tone"] };
  const errors: PageErrors = {};
  if (!validHandle(page.handle)) errors.handle = "٣–٣٢ پیتی لاتینی بچووک، ژمارە یان هێڵ؛ ناوە پارێزراوەکان بەردەست نین.";
  if (Array.from(page.display_name).length < 2 || Array.from(page.display_name).length > 80) errors.display_name = "ناوی پەڕە دەبێت ٢–٨٠ پیت بێت.";
  // Preserve natural scripts, spaces and joining marks; reject invisible control/override characters.
  if (/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u.test(page.display_name)) errors.display_name = "تکایە ناوەکە دووبارە بنووسە؛ پیتی نادیاری تێدایە.";
  if (page.bio.length > 500) errors.bio = "کورتەکە نابێت لە ٥٠٠ پیت زیاتر بێت.";
  if (!(cities as readonly string[]).includes(page.city)) errors.city = "شارێک هەڵبژێرە.";
  if (!phone) errors.public_phone = "ژمارەیەکی دروستی مۆبایل بنووسە.";
  if (!["blue","teal","violet"].includes(page.brand_tone)) errors.brand_tone = "ڕەنگێکی بەردەست هەڵبژێرە.";
  if (raw.confirm_public !== true && raw.confirm_public !== "on") errors.confirm_public = "تکایە بڵاوکردنەوەی ئەم زانیارییانە پشتڕاست بکەرەوە.";
  return { page, errors };
}
export const previewPage: PublicPage = { ...blankPage, handle: "aso-demo", display_name: "پەڕەی ئاسۆ — نموونە", bio: "پەڕەیەکی نموونەیی بۆ ناساندنی کار و هەلەکانت. ئەمە پەڕەی دامەزراوەیەکی ڕاستەقینە نییە.", city: "هەولێر" };
