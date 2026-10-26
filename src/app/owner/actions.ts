"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifiedOwner } from "../../lib/supabase/server";
import { loadOwnedPage } from "../../lib/owner-page";
import { editablePublicFields, profilePath } from "../../lib/profile-workflow";
import { validatePage } from "../../lib/page-validation";
import type { SetupState } from "../page-setup/actions";
export async function updatePage(_previous: SetupState, formData: FormData): Promise<SetupState> {
  const owner = await verifiedOwner();
  if (!owner) return { message: "بۆ دەستکاریکردن سەرەتا بچۆ ژوورەوە." };
  if (process.env.HALDOZ_PAGES_READY !== "true") return { message: "پاشەکەوتکردن هێشتا چالاک نییە." };
  const current = await loadOwnedPage(owner);
  if (!current) return { message: "پەڕەیەکت نییە؛ سەرەتا پەڕەکەت دروست بکە." };
  // The server selects the owner/page ID and stable handle. Never trust form identity fields.
  const { page, errors } = validatePage({ ...Object.fromEntries(formData), handle: current.handle });
  if (Object.keys(errors).length) return { errors, message: "تکایە خانە دیاریکراوەکان پشکنە." };
  const { data, error } = await owner.client.from("haldoz_pages").update(editablePublicFields(page)).eq("id",current.id).select("id").maybeSingle();
  if (error || !data || data.id !== current.id) return { message: "پاشەکەوتکردن پشتڕاست نەکرایەوە. پەڕەکەت نوێ بکەرەوە و دووبارە پشکنین بکە." };
  revalidatePath(profilePath(current.handle));
  revalidatePath("/owner");
  redirect("/owner");
}
