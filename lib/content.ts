/**
 * Yoram Friedman Landing Page Content
 *
 * ALL content extracted from yoram-leads/ strategy docs:
 * - Blueprint Q&A (questions 16-20, 73)
 * - Social Media Content Strategy post #10 ("ככה עובדת הבדיקה")
 * - Israeli Insurance Strategy landing page spec
 * - Optimizing Mortgage Life Insurance Strategies
 *
 * DO NOT invent content. Update only from verified sources.
 */

export const YORAM_CONFIG = {
  businessName: "יורם פרידמן סוכנות לביטוח",
  businessNameEn: "Yoram Friedman Insurance",
  tagline: "בדיקה חינם. הוזלה אמיתית. שקט למשפחה.",
  logoUrl: "/lp/yoram-logo.png",

  // Colors from YF logo
  primaryColor: "#1a2a5e",
  accentColor: "#2b6cb0",
  ctaColor: "#f97316",

  heroHeadline: "ביטוח משכנתא או ביטוח חיים?\nסיכוי גבוה שאתם משלמים יותר מדי.",
  heroSubheadline:
    "בדיקה חינמית אחת דרך הר הביטוח הממשלתי — וחיסכון של עד 60% מהתשלום החודשי. בלי התחייבות, בלי ניירת.",
  ctaText: "לבדיקה חינם — תוך 24 שעות",

  // Contact from FB page (facebook.com/friedmanbit)
  whatsappNumber: "972522422274",
  phone: "04-866-9460",
  email: "yoram@friedmanbit.co.il",

  sections: {
    // 5-step process from Social Media Content Strategy, post #10
    steps: [
      {
        title: "משאירים פרטים",
        description: "שם וטלפון. 10 שניות וסיימתם.",
      },
      {
        title: "שיחה קצרה",
        description: "מתאמים שיחה, לוקחים ת.ז. ותאריך לידה — בלי ניירת.",
      },
      {
        title: "בדיקה מול הר הביטוח",
        description: "סורקים את כל הפוליסות שלכם — ביטוח חיים, משכנתא, בריאות. מזהים כפלים ותשלומי יתר.",
      },
      {
        title: "הצעה שקופה",
        description: "מקבלים דוח מסודר: כמה משלמים היום, כמה אפשר לחסוך, ואיך.",
      },
      {
        title: "ההחלטה שלכם",
        description:
          "רוצים לעבור? אנחנו מטפלים בהכל. לא מתאים? נפרדים כחברים. הבדיקה חינם לגמרי.",
      },
    ],

    // Credentials from Blueprint Q&A (questions 20, 16, 73)
    credentials: [
      { label: "שנות ניסיון", value: "40+" },
      { label: "פרסי סוכן מצטיין", value: "10" },
      { label: "חברות ביטוח", value: "כולן" },
      { label: "חיסכון עד", value: "60%" },
    ],

    // NO testimonials — Blueprint: "אין במה להשתמש כרגע"
    testimonials: [],

    // Differentiators from Blueprint Q&A (questions 16-18)
    differentiators: [
      {
        title: "משווים בין כל החברות",
        description:
          "לא קשורים לחברה אחת. בודקים את כולן ומביאים לכם את המחיר הכי טוב — על ביטוח חיים ומשכנתא.",
      },
      {
        title: "40+ שנה בשטח",
        description: "עשרה פרסי סוכן מצטיין. ליווי אישי מהבדיקה ועד החתימה.",
      },
      {
        title: "בדיקה ממשלתית — בחינם",
        description:
          "שולפים את כל הנתונים מהר הביטוח הממשלתי. רואים בדיוק איפה יש כפלים ואיפה אפשר לחסוך.",
      },
    ],

    // Compliance — Section 55 CMISA, license 604725
    complianceFooter:
      "יורם פרידמן — סוכן ביטוח ופיננסים מורשה | רישיון מס׳ 604725. האמור אינו מהווה ייעוץ ביטוחי. הפרטים מוגנים ולא יועברו לצד שלישי. פרסומת.",
  },
} as const;
