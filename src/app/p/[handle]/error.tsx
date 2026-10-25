"use client";
export default function ProfileError({ reset }: { reset: () => void }) { return <main id="main-content" className="service-state"><h1>پەڕەکە ئێستا بەردەست نییە</h1><p>هیچ زانیارییەکی تایبەتی پیشان نادرێت. تکایە دواتر هەوڵ بدەوە.</p><button className="primary-button" onClick={reset}>دووبارە هەوڵ بدەوە</button></main>; }
