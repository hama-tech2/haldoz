import "server-only";
import type { verifiedOwner } from "./supabase/server";
import { publicPageColumns } from "./profile-workflow";
import type { PublicPage } from "./page-validation";
export async function loadOwnedPage(owner: NonNullable<Awaited<ReturnType<typeof verifiedOwner>>>) {
  const { data: ownership, error: ownerError } = await owner.client.from("haldoz_owner_pages").select("id").eq("owner_id", owner.id).maybeSingle();
  if (ownerError) throw new Error("Owner page temporarily unavailable");
  if (!ownership) return null;
  const { data, error } = await owner.client.from("haldoz_pages").select(publicPageColumns).eq("id",ownership.id).maybeSingle();
  if (error || !data) throw new Error("Owner page temporarily unavailable");
  const page: PublicPage & { id: string } = { ...data, id: ownership.id, bio: data.bio ?? "", public_phone: data.public_phone ?? "", public_whatsapp: data.public_whatsapp ?? "" };
  return page;
}
