import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "יורם פרידמן - סוכנות לביטוח | בדיקת תיק ביטוח בחינם",
  description:
    "ביטוח משכנתא או ביטוח חיים? חיסכון של עד 60% בבדיקה חינמית אחת דרך הר הביטוח הממשלתי. יורם פרידמן סוכנות לביטוח.",
  metadataBase: new URL("https://yoramfriedman.co.il"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "יורם פרידמן - סוכנות לביטוח | בדיקת תיק ביטוח בחינם",
    description:
      "ביטוח משכנתא או ביטוח חיים? חיסכון של עד 60% בבדיקה חינמית אחת. בלי התחייבות.",
    locale: "he_IL",
    type: "website",
    siteName: "יורם פרידמן - סוכנות לביטוח",
  },
  robots: { index: true, follow: true },
  other: {
    "theme-color": "#1a2a5e",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#1a2a5e" />

        {/* JSON-LD LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "InsuranceAgency",
              name: "יורם פרידמן - סוכנות לביטוח",
              url: "https://yoramfriedman.co.il",
              telephone: "+972-4-866-9460",
              description:
                "סוכנות ביטוח עצמאית עם 25+ שנות ניסיון. בדיקת תיק ביטוח חינמית דרך הר הביטוח הממשלתי. חיסכון של עד 60%.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "חיפה",
                addressCountry: "IL",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 32.794,
                longitude: 34.989,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                ],
                opens: "09:00",
                closes: "18:00",
              },
              sameAs: ["https://www.facebook.com/friedmanbit"],
              areaServed: {
                "@type": "Country",
                name: "Israel",
              },
              priceRange: "חינם - בדיקת תיק ללא עלות",
            }),
          }}
        />

        {/* GA4 — replace G-XXXXXXXXXX with actual ID */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />

        {/* Facebook Pixel — replace XXXXXXXXXX with actual ID */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'XXXXXXXXXX');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body style={{ fontFamily: "'Heebo', sans-serif" }}>{children}</body>
    </html>
  );
}
