import Link from "next/link";
import { redirect } from "next/navigation";
import { EntryHeader } from "../../../components/entry-header";
import { PageSetupForm } from "../../../components/page-setup-form";
import { verifiedOwner } from "../../../lib/supabase/server";
import { ownerPageState } from "../../../lib/owner-routing";
import "../../entry.css";
import "../../owner.css";
import "../account.css";
export const dynamic = "force-dynamic";
export default async function EditProfile() {
  const owner = await verifiedOwner();
  if (!owner) redirect("/create");
  const state = await ownerPageState(owner);
  if (state.status !== "saved") redirect("/page-setup");
  const page = state.page;
  return <div><EntryHeader/><main id="main-content" className="owner-shell"><div className="setup-heading"><Link className="text-link" href="/owner">گەڕانەوە بۆ پەڕەکەم</Link><h1>دەستکاریکردنی پڕۆفایل</h1><p>تەنها زانیارییە گشتییەکانی پەڕەکەت دەگۆڕدرێن.</p></div><PageSetupForm canSave initialPage={page} mode="edit"/></main></div>;
}
