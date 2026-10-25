export const shiftLabels = {
  morning: "بەیانی", evening: "ئێوارە", night: "شەو", flexible: "کاتی گۆڕاو", unspecified: "دیاری نەکراو",
} as const;
export type Shift = keyof typeof shiftLabels;
export type Job = {
  id: string; title: string; pageName: string; initial: string;
  logoTone: "blue" | "amber" | "teal" | "violet";
  salary: number | null; salaryMode: "fixed" | "negotiable" | "unspecified";
  start: string | null; end: string | null; shift: Shift;
  city: string; district: string | null; category: string; postedAt: string;
};
export type Filters = { query: string; city: string; category: string; shift: string };
export const emptyFilters: Filters = { query: "", city: "", category: "", shift: "" };
export function normalizeSearch(value = ""): string {
  return value.normalize("NFKC").replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/ك/g, "ک").replace(/[يى]/g, "ی").trim().toLocaleLowerCase("ckb");
}
export function filterJobs(jobs: readonly Job[], filters: Filters): Job[] {
  const terms = normalizeSearch(filters.query).split(/\s+/).filter(Boolean);
  return jobs.filter(job =>
    (!filters.city || job.city === filters.city) &&
    (!filters.category || job.category === filters.category) &&
    (!filters.shift || job.shift === filters.shift) &&
    terms.every(term => normalizeSearch([job.title, job.pageName, job.category, job.city, job.district ?? ""].join(" ")).includes(term)),
  );
}
export function formatAge(postedAt: string, now: string): string {
  const elapsed = Math.max(0, Date.parse(now) - Date.parse(postedAt));
  const hours = Math.floor(elapsed / 3_600_000);
  if (!Number.isFinite(hours)) return "نموونە";
  if (hours < 1) return "ئێستا";
  if (hours < 24) return hours + " کاتژمێر";
  return Math.floor(hours / 24) + " ڕۆژ";
}
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  return (hours % 12 || 12) + ":" + String(minutes).padStart(2, "0") + (hours < 12 ? " AM" : " PM");
}
export function toggleSaved(ids: readonly string[], id: string): string[] {
  return ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id];
}
export function parseSaved(raw: string | null, validIds: readonly string[]): string[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const valid = new Set(validIds);
    return [...new Set(data.filter((id): id is string => typeof id === "string" && valid.has(id)))];
  } catch { return []; }
}
export function readSaved(storage: Pick<Storage, "getItem">, validIds: readonly string[]) {
  try { return { ids: parseSaved(storage.getItem("haldoz.saved.v1"), validIds), available: true }; }
  catch { return { ids: [], available: false }; }
}
export function writeSaved(storage: Pick<Storage, "setItem">, ids: readonly string[]): boolean {
  try { storage.setItem("haldoz.saved.v1", JSON.stringify(ids)); return true; }
  catch { return false; }
}

export type SavedSnapshot = { ids: string[]; available: boolean; loaded: boolean };
export function createSavedStore(validIds: readonly string[], getStorage: () => Pick<Storage, "getItem" | "setItem">) {
  const serverSnapshot: SavedSnapshot = { ids: [], available: true, loaded: false };
  let snapshot = serverSnapshot;
  const listeners = new Set<() => void>();
  function publish(next: SavedSnapshot) { snapshot = next; listeners.forEach(listener => listener()); }
  function refresh() {
    let result: { ids: string[]; available: boolean };
    try { result = readSaved(getStorage(), validIds); }
    catch { result = { ids: [], available: false }; }
    const ids = result.available ? result.ids : snapshot.ids;
    if (!snapshot.loaded || snapshot.available !== result.available || JSON.stringify(ids) !== JSON.stringify(snapshot.ids)) {
      publish({ ids, available: result.available, loaded: true });
    }
  }
  return {
    getServerSnapshot: () => serverSnapshot,
    getSnapshot: () => snapshot,
    refresh,
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (!snapshot.loaded) refresh();
      return () => { listeners.delete(listener); };
    },
    toggle(id: string) {
      if (!validIds.includes(id)) return false;
      const ids = toggleSaved(snapshot.ids, id);
      let available = false;
      try { available = writeSaved(getStorage(), ids); } catch {}
      publish({ ids, available, loaded: true });
      return ids.includes(id);
    },
  };
}
