import Link from "next/link";
import { EntryHeader } from "../components/entry-header";
import { Icon } from "../components/icon";
import "./entry.css";

export default function Landing() {
  return <div className="entry-screen"><EntryHeader/><main id="main-content" className="entry-main landing-entry">
    <p className="entry-eyebrow">پەڕەی تایبەتی هەلی کار</p>
    <h1>پەڕەی هەلی کاری خۆت دروست بکە</h1>
    <p className="entry-description">هەلی کار بڵاو بکەرەوە و لینکی پەڕەکەت هاوبەش بکە.</p>
    <Link className="entry-primary" href="/create">پەڕە دروست بکە<Icon name="arrow"/></Link>
    <Link className="entry-browse" href="/jobs">بەدوای کاردا دەگەڕێیت؟ هەلەکانی کار ببینە</Link>
  </main></div>;
}
