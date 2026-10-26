"use client";
export default function OwnerError({ reset }: { reset: () => void }) { return <main id="main-content" className="service-state"><h1>پەڕەکەت ئێستا بەردەست نییە</h1><p>ناتوانین دۆخی پەڕەکەت پشتڕاست بکەینەوە. تکایە دووبارە پشکنین بکە.</p><button className="primary-button" onClick={reset}>دووبارە هەوڵ بدەوە</button></main>; }
