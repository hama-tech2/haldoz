import test from "node:test";
import assert from "node:assert/strict";
import { jobs } from "../src/data/jobs.ts";
import { emptyFilters, filterJobs, normalizeSearch, formatAge, formatTime, parseSaved, readSaved, writeSaved, toggleSaved, createSavedStore } from "../src/lib/jobs.ts";
test("search normalizes Arabic variants without changing fixture text", () => {
  assert.equal(normalizeSearch(" كـار يَ "), "کار ی");
  assert.equal(filterJobs(jobs, { ...emptyFilters, query: "كۆمپیوتەر" })[0].id, "demo-support");
  assert.equal(filterJobs(jobs, { ...emptyFilters, query: "ژمێریار دهۆک" })[0].id, "demo-accountant");
});
test("city/category/declared shift combine with AND and reset restores all", () => {
  const filters = { query: "", city: "هەولێر", category: "فرۆشتن", shift: "morning" };
  assert.deepEqual(filterJobs(jobs, filters).map(j => j.id), ["demo-sales"]);
  assert.equal(filterJobs(jobs, { ...filters, query: "ژمێریار" }).length, 0);
  assert.equal(filterJobs(jobs, emptyFilters).length, 12);
});
test("unknown and flexible hours are explicit, not derived from time duration", () => {
  assert.deepEqual(filterJobs(jobs, { ...emptyFilters, shift: "unspecified" }).map(j => j.id), ["demo-stock"]);
  assert.deepEqual(filterJobs(jobs, { ...emptyFilters, shift: "flexible" }).map(j => j.id), ["demo-designer"]);
  assert.equal(jobs.find(j => j.id === "demo-stock").salary, null);
  assert.equal(formatTime("00:00"), "12:00 AM");
  assert.equal(formatTime("22:00"), "10:00 PM");
});
test("saved IDs reject corrupt, unexpected, duplicated and obsolete data", () => {
  const ids = jobs.map(j => j.id);
  for (const raw of [null, "{", "{}", "false"]) assert.deepEqual(parseSaved(raw, ids), []);
  assert.deepEqual(parseSaved('["demo-sales","demo-sales","unknown",null,4]', ids), ["demo-sales"]);
  assert.deepEqual(toggleSaved(toggleSaved([], "demo-sales"), "demo-sales"), []);
});
test("storage denial fails gracefully and never falls back to a remote request", () => {
  const storage = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("quota"); } };
  assert.deepEqual(readSaved(storage, []), { ids: [], available: false });
  assert.equal(writeSaved(storage, ["demo-sales"]), false);
});
test("fixture IDs are unique and unknown fields do not fabricate salary or hours", () => {
  assert.equal(new Set(jobs.map(j => j.id)).size, jobs.length);
  for (const job of jobs) {
    assert.ok(job.title && job.pageName && job.city && job.category);
    assert.equal("phone" in job || "email" in job, false);
    assert.equal(job.start === null, job.end === null);
    assert.equal(job.salaryMode === "fixed", typeof job.salary === "number");
  }
});
test("posting age is deterministic, clamps future times, and crosses day boundaries", () => {
  const now = "2026-10-22T08:00:00Z";
  assert.equal(formatAge("2026-10-22T06:00:00Z", now), "2 کاتژمێر");
  assert.equal(formatAge("2026-10-21T08:00:00Z", now), "1 ڕۆژ");
  assert.equal(formatAge("2026-10-23T08:00:00Z", now), "ئێستا");
});

test("shared favorites survive route remounts even when storage is denied", () => {
  const store = createSavedStore(["demo-sales"], () => { throw new Error("denied"); });
  let signals = 0;
  const unsubscribe = store.subscribe(() => signals++);
  store.toggle("demo-sales");
  unsubscribe();
  const unsubscribeNextPage = store.subscribe(() => signals++);
  assert.deepEqual(store.getSnapshot().ids, ["demo-sales"]);
  assert.equal(store.getSnapshot().available, false);
  assert.ok(signals >= 2);
  assert.deepEqual(store.getServerSnapshot(), { ids: [], available: true, loaded: false });
  unsubscribeNextPage();
});
test("external-tab changes refresh saved state and reject unknown IDs", () => {
  let raw = '["demo-sales"]';
  const store = createSavedStore(["demo-sales", "demo-office"], () => ({ getItem: () => raw, setItem: (_key, value) => { raw = value; } }));
  const unsubscribe = store.subscribe(() => {});
  raw = '["demo-office"]'; store.refresh();
  assert.deepEqual(store.getSnapshot().ids, ["demo-office"]);
  assert.equal(store.toggle("unknown"), false);
  assert.deepEqual(store.getSnapshot().ids, ["demo-office"]);
  unsubscribe();
});
