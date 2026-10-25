"use client";
import { useState } from "react";
import { copyProfileLink } from "../lib/profile-workflow";
export function CopyProfileLink({ url, preview = false }: { url: string; preview?: boolean }) {
  const [state,setState] = useState<"idle"|"copied"|"manual">("idle");
  async function copy() {
    const copied = await copyProfileLink(url, text => navigator.clipboard.writeText(text));
    setState(copied ? "copied" : "manual");
  }
  return <div className="copy-profile"><button type="button" className="secondary-button" onClick={copy}>{preview ? "کۆپیکردنی لینکی نموونە" : "کۆپیکردنی لینک"}</button>{["127.0.0.1","localhost"].includes(new URL(url).hostname) && <p className="field-help">ئەم لینکە تەنها لە ئامێری پەرەپێدان کار دەکات.</p>}<p role="status" aria-live="polite" className="copy-status">{state === "copied" ? "لینک کۆپی کرا." : state === "manual" ? "کۆپیکردن بەردەست نییە؛ لینکەکە هەڵبژێرە و بە دەستی کۆپی بکە." : ""}</p>{state === "manual" && <label className="manual-link">لینکی پەڕە<input dir="ltr" value={url} readOnly onFocus={event=>event.currentTarget.select()}/></label>}</div>;
}
