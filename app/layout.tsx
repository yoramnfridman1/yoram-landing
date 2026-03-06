import type { Metadata } from "next";
import { Heebo, Rubik } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
  weight: ["300", "400", "500", "700", "800", "900"],
});

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "יורם פרידמן - סוכנות לביטוח | בדיקת תיק ביטוח בחינם",
  description: "יורם פרידמן, סוכן ביטוח עצמאי עם למעלה מ-40 שנות ניסיון. בדיקת תיק ביטוח חינם — ביטוח חיים, פנסיה, משכנתא וחיסכון. חסכו עד 60% על הפרמיות שלכם.",
  keywords: ["ביטוח חיים", "סוכן ביטוח", "בדיקת ביטוח", "פנסיה", "משכנתא", "חיסכון", "יורם פרידמן", "ביטוח בחינם"],
  openGraph: {
    title: "יורם פרידמן - בדיקת תיק ביטוח חינם",
    description: "סוכן ביטוח עצמאי עם 40+ שנות ניסיון. בדיקת תיק חינם — חסכו עד 60%.",
    url: "https://yoramfriedman.co.il",
    siteName: "יורם פרידמן סוכנות לביטוח",
    locale: "he_IL",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://yoramfriedman.co.il" },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  name: "יורם פרידמן סוכנות לביטוח",
  url: "https://yoramfriedman.co.il",
  telephone: "04-866-9460",
  email: "yoram@friedmanbit.co.il",
  foundingDate: "1984",
  description: "סוכן ביטוח עצמאי עם למעלה מ-40 שנות ניסיון. ביטוח חיים, פנסיה, משכנתאות וחיסכון.",
  areaServed: { "@type": "Country", name: "Israel" },
  priceRange: "Free consultation",
  sameAs: ["https://www.facebook.com/friedmanbit"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "שירותי ביטוח",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "בדיקת תיק ביטוח חינם" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "ביטוח חיים" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "פנסיה" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "ביטוח משכנתא" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "חיסכון והשקעות" } },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable + " " + rubik.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="font-[var(--font-heebo)] antialiased bg-[#faf8f5] text-[#1a1a1a]">
        {children}
      </body>
    </html>
  );
}
