"use client";
import Link from "next/link";
import { useState } from "react";
import { RefreshPublicJobs } from "./refresh-public-jobs";
import { emptyFilters, filterJobs, shiftLabels, type Filters, type Job } from "../lib/jobs";
import { Icon, type IconName } from "./icon";
import { JobCard } from "./job-card";
import { useSavedJobs } from "./use-saved-jobs";
const PAGE_SIZE = 6;

function FilterField({ label, name, icon, value, options, onChange }: { label: string; name: string; icon: IconName; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) {
  return <div className="filter-field"><Icon name={icon}/><select aria-label={label} name={name} value={value} onChange={event => onChange(event.target.value)}><option value="">{label}</option>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select><Icon name="chevron" className="filter-chevron"/></div>;
}
export function JobBrowser({ favorites = false, now, jobs = [], demo = false, unavailable = false }: { favorites?: boolean; now: string; jobs?: readonly Job[]; demo?: boolean; unavailable?: boolean }) {
  const cities = [...new Set(jobs.map(job=>job.city))];
  const categories = [...new Set(jobs.map(job=>job.category).filter(Boolean))];
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const { ids: saved, loaded, available: storageAvailable, toggle } = useSavedJobs(demo);
  const [announcement, setAnnouncement] = useState("");
  function update(field: keyof Filters, value: string) {
    setFilters(previous => ({ ...previous, [field]: value })); setLimit(PAGE_SIZE);
  }
  function saveJob(id: string, title: string) {
    const isSaved = toggle(id);
    setAnnouncement(isSaved ? title + " پاشەکەوت کرا." : title + " لە دڵخوازەکان لابرا.");
  }
  const activeSavedCount = jobs.filter(job=>saved.includes(job.id)).length;
  const source = favorites ? jobs.filter(job => saved.includes(job.id)) : jobs;
  const results = filterJobs(source, filters);
  const filtering = Object.values(filters).some(Boolean);
  const shown = results.slice(0, limit);
  function reset() { setFilters(emptyFilters); setLimit(PAGE_SIZE); }
  return <div className="app-shell">{!demo && <RefreshPublicJobs/>}
    <header className="site-header">
      <Link className="brand" href="/jobs" aria-label="هەلی کار — سەرەتا"><span className="brand-mark"><Icon name="bag"/></span><span>هەلی کار<small lang="en" dir="ltr">HALDOZ</small></span></Link>
      {demo && <span className="demo-tag"><span/>نموونەی تاقیکردنەوە</span>}
    </header>
    <main id="main-content">
      {favorites ? <div className="intro">
        <p className="eyebrow">{favorites ? "لە هەمان وێبگەڕدا پاشەکەوت کراوە" : "هەنگاوێک بەرەو هەلێکی نوێ"}</p>
        <h1>{favorites ? "دڵخوازەکانت" : <>هەلی کاری گونجاو،<br className="mobile-break"/> لێرە بدۆزەرەوە.</>}</h1>
        <p className="intro-copy">{favorites ? "ئەو هەلانەی بۆ بینینەوە هەڵتگرتوون." : "بەدوای کاردا بگەڕێ، هەلەکان بەراورد بکە و دڵخوازەکانت هەڵبگرە."}</p>
      </div> : <h1 className="sr-only">هەلی کار</h1>}
      <section className="search-section" aria-label="گەڕان و پاڵاوتنی هەلی کار">
        <div className="search-box"><Icon name="search"/><label className="sr-only" htmlFor="job-search">گەڕان بۆ کار</label><input id="job-search" type="search" value={filters.query} onChange={event => update("query", event.target.value)} placeholder="بەدوای چ کارێکدا دەگەڕێیت؟" autoComplete="off"/>{filters.query && <button type="button" className="clear-search" aria-label="پاککردنەوەی گەڕان" onClick={() => update("query", "")}><Icon name="close"/></button>}</div>
        <div className="filters">
          <FilterField label="شار" name="city" icon="pin" value={filters.city} options={cities.map(value => ({ value, label: value }))} onChange={value => update("city", value)}/>
          {!!categories.length && <FilterField label="پۆلی کار" name="category" icon="grid" value={filters.category} options={categories.map(value => ({ value, label: value }))} onChange={value => update("category", value)}/>}
          <FilterField label="کاتی کار" name="shift" icon="clock" value={filters.shift} options={Object.entries(shiftLabels).map(([value, label]) => ({ value, label }))} onChange={value => update("shift", value)}/>
        </div>
      </section>
      {demo && <div className="demo-notice"><Icon name="info"/><p>هەموو هەل و پەڕەکان نموونەی ساختەن؛ بۆ تاقیکردنەوەن.</p></div>}
      {unavailable && <p className="storage-notice" role="status">هەلەکان ئێستا بار نابن؛ دواتر دووبارە هەوڵ بدەرەوە.</p>}
      {jobs.length >= 200 && <p className="field-help">نوێترین ٢٠٠ هەلی بەردەست پیشان دەدرێت.</p>}
      {!storageAvailable && <p className="storage-notice" role="status">وێبگەڕەکەت ڕێگە بە پاشەکەوتکردن نادات؛ دڵخوازەکان تەنها تا داخستنی ئەم پەڕەیەن.</p>}
      <section className="results-section" aria-labelledby="results-title">
        <div className="section-heading"><div><h2 id="results-title">{favorites ? "هەلە هەڵگیراوەکان" : filtering ? "ئەنجامی گەڕان" : "نوێترین هەلەکان"}</h2><p role="status" aria-live="polite">{favorites && !loaded ? "بارکردنی دڵخوازەکان…" : unavailable ? "بارکردن سەرکەوتوو نەبوو" : results.length + (demo ? " هەلی نموونە" : " هەلی بەردەست")}</p></div>{filtering && <button type="button" className="reset-button" onClick={reset}><Icon name="close"/>پاککردنەوە</button>}</div>
        {unavailable ? null : favorites && !loaded ? <div className="empty-state"><p>بارکردنی دڵخوازەکان…</p></div> : results.length ? <><div className="job-grid">{shown.map(job => <JobCard key={job.id} job={job} saved={saved.includes(job.id)} now={now} onToggle={() => saveJob(job.id, job.title)}/>)}</div>{results.length > limit && <button type="button" className="load-more" onClick={() => setLimit(previous => previous + PAGE_SIZE)}>پیشاندانی هەلی زیاتر<Icon name="chevron"/></button>}</> : <div className="empty-state"><span className="empty-icon"><Icon name={favorites && !filtering ? "heart" : "search"}/></span><h3>{favorites && !filtering ? "هێشتا هەلێکت هەڵنەگرتووە" : "هیچ هەلێک نەدۆزرایەوە"}</h3><p>{favorites && !filtering ? "لە سەرەتا، دڵەکەی تەنیشت هەر هەلێک داگرە بۆ پاشەکەوتکردن." : "وشە یان پاڵاوتنەکان بگۆڕە و دووبارە هەوڵ بدە."}</p>{filtering ? <button type="button" className="primary-button" onClick={reset}>پاککردنەوەی پاڵاوتنەکان</button> : <Link className="primary-button" href="/jobs">بینینی هەلەکان<Icon name="arrow"/></Link>}</div>}
      </section>
      <footer className="page-footer"><span lang="en" dir="ltr">HALDOZ</span><p>گەڕان بێ ئەکاونت · هەموو خزمەتگوزارییەکان بەخۆڕایین</p>{favorites && <p>دڵخوازەکان لەم وێبگەڕەدان؛ بە سڕینەوەی داتای وێبگەڕ دەسڕێنەوە.</p>}</footer>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
    </main>
    <nav className="bottom-nav" aria-label="ڕێنیشاندەری سەرەکی"><div>
      <Link href="/jobs" aria-current={!favorites ? "page" : undefined}><Icon name="home"/><span>سەرەتا</span></Link>
      <Link href="/favorites" aria-current={favorites ? "page" : undefined}><Icon name="heart"/><span>دڵخوازەکان</span>{loaded && activeSavedCount > 0 && <span className="nav-count">{activeSavedCount}</span>}</Link>
    </div></nav>
  </div>;
}
