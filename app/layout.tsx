import type { Metadata, Viewport } from "next";
import { Manrope, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import "./theme.css";
const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const heading = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL("https://www.detailcliniclacrosse.com"),
  title: "Detail Clinic | Professional Auto Detailing in La Crosse, WI",
  description:
    "Professional auto detailing in La Crosse, WI. Explore interior and exterior detailing, window tint, ceramic coating, and paint correction at Detail Clinic.",
  authors: [{ name: "Detail Clinic" }],
  publisher: "Detail Clinic",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Detail Clinic",
    title: "Detail Clinic — Precision in Every Detail",
    description:
      "Professional automotive detailing and window tint in La Crosse, Wisconsin.",
    images: [
      {
        url: "/images/studio.webp",
        width: 1920,
        height: 1440,
        alt: "Inside the Detail Clinic studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Detail Clinic — Precision in Every Detail",
    images: ["/images/studio.webp"],
  },
};
export const viewport: Viewport = { themeColor: "#ffffff" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${body.variable} ${heading.variable}`}>
      {/* Browser extensions can inject body attributes before React hydrates. */}
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main" title="Skip to main content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
