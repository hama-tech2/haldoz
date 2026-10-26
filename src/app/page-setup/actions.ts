"use server";
import { redirect } from "next/navigation";
import { verifiedOwner } from "../../lib/supabase/server";
import { ownerPageState } from "../../lib/owner-routing";
import { pageDatabasePending, pageDatabaseUnavailable } from "../../lib/account-errors";
import { validatePage, type PageErrors } from "../../lib/page-validation";
export type SetupState = { errors?: PageErrors; message?: string };
export async function savePage(_previous: SetupState, formData: FormData): Promise<SetupState> {
  const owner = await verifiedOwner();
  if (!owner) return { message: "بۆ پاشەکەوتکردن سەرەتا بچۆ ژوورەوە." };
  const state = await ownerPageState(owner);
  if (state.status === "saved") redirect("/owner");
  if (state.status === "database-pending") return { message: pageDatabasePending };
  if (state.status === "database-unavailable") return { message: pageDatabaseUnavailable };
  const { page, errors } = validatePage(Object.fromEntries(formData));
  if (Object.keys(errors).length) return { errors, message: "تکایە خانە دیاریکراوەکان پشکنە." };
  const { data, error } = await owner.client.rpc("haldoz_create_page", { page_handle: page.handle, page_name: page.display_name, page_bio: page.bio, page_city: page.city, page_phone: page.public_phone || null, page_whatsapp: page.public_whatsapp || null, page_tone: page.brand_tone });
  if (error || typeof data !== "string") return { message: error?.code === "23505" ? "ئەم ناونیشانە یان ئەکاونتە پێشتر پەڕەی هەیە. پەڕەکەت نوێ بکەرەوە یان ناونیشانێکی تر تاقی بکەرەوە." : "پاشەکەوتکردن پشتڕاست نەکرایەوە. پەڕەکەت نوێ بکەرەوە و دووبارە پشکنین بکە." };
  redirect("/owner");
}
