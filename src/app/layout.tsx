import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "هەڵدۆز | Haldoz", template: "%s | Haldoz" },
  description: "هەڵدۆز — پەڕەی پیشەیی و هەلی کار بە زمانی کوردیی سۆرانی.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#F7FAFF" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ckb" dir="rtl"><head><link rel="preload" href="/fonts/Vazirmatn-variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body><a className="skip-link" href="#main-content">بازدان بۆ ناوەڕۆک</a>{children}</body></html>;
}
