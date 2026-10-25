import Link from "next/link";
import { Icon } from "./icon";
export function SiteHeader() {
  return <header className="owner-header"><Link className="brand" href="/" aria-label="هەڵدۆز — سەرەتا"><span className="brand-mark"><Icon name="bag"/></span><span>هەڵدۆز<small lang="en" dir="ltr">HALDOZ</small></span></Link><Link className="quiet-link" href="/create">بۆ خاوەن پەڕەکان<Icon name="arrow"/></Link></header>;
}
