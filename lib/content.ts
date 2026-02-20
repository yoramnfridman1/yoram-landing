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

  heroHeadline: "אל תשלמו יותר מדי על ביטוח המשכנתא שלכם!",
  // 85% stat from Israeli Insurance Strategy — THE key conversion message
  heroSubheadline:
    "85% מהישראלים משלמים על ביטוח שהם כבר מכוסים בו. יורם פרידמן וצוות המומחים שלנו יבדקו את תיק הביטוח שלכם בעזרת מערכת הר הביטוח הממשלתית — לגמרי בחינם.",
  ctaText: "בדקו את הביטוח שלי עכשיו",

  // Contact from FB page (facebook.com/friedmanbit)
  whatsappNumber: "972522422274",
  phone: "04-866-9460",
  email: "yoram@friedmanbit.co.il",

  sections: {
    // 5-step process from Social Media Content Strategy, post #10
    steps: [
      {
        title: "משאירים פרטים",
        description: "שם וטלפון. 10 שניות. זה הכל.",
      },
      {
        title: "אנחנו מתקשרים",
        description: "לוקחים ת.ז. ותאריך לידה. בלי מסמכים.",
      },
      {
        title: "בודקים את הר הביטוח",
        description: "מנתחים מה יש, מזהים כפלים וכיסויים מיותרים.",
      },
      {
        title: "מקבלים הצעה",
        description: "שחור על לבן. כמה משלמים, כמה אפשר לשלם.",
      },
      {
        title: "מחליטים",
        description:
          "רוצים לעבור? מטפלים בהכל. לא רוצים? לוחצים ידיים. בחינם.",
      },
    ],

    // Credentials from Blueprint Q&A (questions 20, 16, 73)
    credentials: [
      { label: "שנות ניסיון", value: "40+" },
      { label: "פרסי סוכן מצטיין", value: "10" },
      { label: "חברות ביטוח", value: "כולן" },
      { label: "הוזלה עד", value: "50%" },
    ],

    // NO testimonials — Blueprint: "אין במה להשתמש כרגע"
    testimonials: [],

    // Differentiators from Blueprint Q&A (questions 16-18)
    differentiators: [
      {
        title: "עובדים עם כל החברות",
        description:
          "לא מחויבים לחברה אחת. משווים בין כולן למחיר הכי טוב עבורכם.",
      },
      {
        title: "ניסיון של מעל 40 שנה",
        description: "10 פעמים זוכה פרס סוכן מצטיין. ליווי אישי לכל משפחה.",
      },
      {
        title: "בדיקה ממשלתית בחינם",
        description:
          "בודקים את הר הביטוח הממשלתי, מזהים כפלים, ומראים בדיוק איפה אפשר לחסוך.",
      },
    ],

    // Compliance — Section 55 CMISA, license 604725
    complianceFooter:
      "יורם פרידמן — סוכן ביטוח ופיננסים מורשה | רישיון מס׳ 604725. האמור אינו מהווה ייעוץ ביטוחי. הפרטים מוגנים ולא יועברו לצד שלישי. פרסומת.",
  },
} as const;
