import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "יורם פרידמן - סוכנות לביטוח | בדיקת תיק ביטוח בחינם",
  description:
    "יורם פרידמן סוכנות לביטוח — מומחים בביטוח משכנתא, חיים ובריאות. הירשמו עכשיו לבדיקת תיק הביטוח שלכם ללא עלות.",
  openGraph: {
    title: "יורם פרידמן - סוכנות לביטוח | בדיקת תיק ביטוח בחינם",
    description:
      "85% מהישראלים משלמים על ביטוח שהם כבר מכוסים בו. בדיקה חינם עכשיו.",
    locale: "he_IL",
    type: "website",
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
      </head>
      <body style={{ fontFamily: "'Heebo', sans-serif" }}>{children}</body>
    </html>
  );
}
