import "server-only";
import { loadOwnedPage } from "./owner-page";
import type { verifiedOwner } from "./supabase/server";
export type Owner = NonNullable<Awaited<ReturnType<typeof verifiedOwner>>>;
export type OwnerPageState =
  | { status: "database-pending" | "database-unavailable" | "new"; page: null }
  | { status: "saved"; page: NonNullable<Awaited<ReturnType<typeof loadOwnedPage>>> };
export async function ownerPageState(owner: Owner): Promise<OwnerPageState> {
  if (process.env.HALDOZ_PAGES_READY !== "true") return { status: "database-pending", page: null };
  try {
    const page = await loadOwnedPage(owner);
    return page ? { status: "saved", page } : { status: "new", page: null };
  } catch {
    // An unavailable table/permission/network is not evidence that the owner has no page.
    return { status: "database-unavailable", page: null };
  }
}
export function ownerDestination(state: OwnerPageState) {
  return state.status === "saved" ? "/owner" : "/page-setup";
}
