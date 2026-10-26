import { validHandle, type PublicPage } from "./page-validation.ts";
export const publicPageColumns = "id,handle,display_name,bio,city,public_phone,public_whatsapp,brand_tone";
export function profilePath(handle: string) {
  if (!validHandle(handle)) throw new Error("Invalid public handle");
  return "/p/" + handle;
}
export function profileUrl(origin: string, handle: string) {
  const url = new URL(origin);
  if (url.username || url.password || (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost","127.0.0.1"].includes(url.hostname)))) throw new Error("Invalid public origin");
  return url.origin + profilePath(handle);
}
export function editablePublicFields(page: PublicPage) {
  return { display_name: page.display_name, bio: page.bio, city: page.city, public_phone: page.public_phone || null, public_whatsapp: page.public_whatsapp || null, brand_tone: page.brand_tone };
}
export async function copyProfileLink(url: string, write: (text: string) => Promise<void>) {
  try { await write(url); return true; } catch { return false; }
}
