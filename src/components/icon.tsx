import type { CSSProperties } from "react";
const paths = {
  bag: <><path d="M8 6V4h8v2M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M3 12a25 25 0 0 0 18 0M10 13h4"/></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>,
  pin: <><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/></>,
  chevron: <path d="m7 10 5 5 5-5"/>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  arrow: <path d="m14 6-6 6 6 6M8 12h13"/>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>,
  wallet: <><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 8h18M21 12h-6v5h6M17 14.5h.01"/></>,
} as const;
export type IconName = keyof typeof paths;
export function Icon({ name, className = "", filled = false, style }: { name: IconName; className?: string; filled?: boolean; style?: CSSProperties }) {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={className} style={style}>{paths[name]}</svg>;
}
