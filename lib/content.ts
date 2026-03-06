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
  primaryColor: "#1a2a5e",
  accentColor: "#2b6cb0",
  ctaColor: "#f97316",
  heroHeadline: "המשכנתא שלך יקרה מדי. ביטוח החיים שלך – גם.",
  heroSubheadline: "בדיקה חינם של תיק הביטוח – משכנתא, ביטוח חיים, ביטוח רכב ופנסיה – ולגלות חיסכון אמיתי בלי לוותר על כיסוי.",
  ctaText: "לבדיקה חינם בוואטסאפ",
  whatsappNumber: "972522422274",
  phone: "04-866-9460",
  email: "yoram@friedmanbit.co.il",

  // Stats for animated counters — from Blueprint & strategy docs
  stats: [
    { value: 60, suffix: "%", label: "חיסכון ממוצע" },
    { value: 3500, suffix: "+", label: "משפחות שנבדקו" },
    { value: 25, suffix: "+", label: "שנות ניסיון" },
  ],

  sections: {
    steps: [
      { number: 1, title: "שלחו פרטים בוואטסאפ", description: "שם + טלפון + תמונת תעודת משכנתא" },
      { number: 2, title: "ננתח את התיק שלכם", description: "משכנתא, ביטוח חיים, ביטוח רכב, פנסיה" },
      { number: 3, title: "דו״ח השוואה אישי", description: "מראים לכם בדיוק איפה אפשר לשפר" },
      { number: 4, title: "מיישמים את השינוי", description: "אנחנו מטפלים בכל הבירוקרטיה מולכם" },
      { number: 5, title: "נהנים מחיסכון אמיתי", description: "בממוצע 60% חיסכון בביטוח החיים צמוד למשכנתא" },
    ],
    credentials: [
      { label: "סוכן ביטוח מורשה", value: "משרד האוצר – רישיון מלא" },
      { label: "ניסיון", value: "25+ שנות בתחום" },
      { label: "התמחות", value: "ביטוח חיים + משכנתא + רכב + פנסיה" },
      { label: "גישה", value: "שירות אישי וזמין בכל שלב" },
    ],
    testimonials: [],
    differentiators: [
      {
        title: "בדיקה אישית, לא רובוטית",
        description: "יורם בודק כל תיק באופן אישי – לא אלגוריתם ולא מרכז מכירות",
      },
      {
        title: "חיסכון בלי לוותר על כיסוי",
        description: "אותו ביטוח, אותו רמת שירות – רק בחברה טובה יותר",
      },
      {
        title: "משכנתא + חיים + רכב + פנסיה במקום אחד",
        description: "במקום לרוץ בין סוכנים – הכל נבדק במקום אחד",
      },
    ],
    complianceFooter:
      "יורם פרידמן – סוכן ביטוח מורשה | משרד האוצר, רישיון מלא | האמור באתר אינו מהווה המלצה לביצוע בפועל ואינו מהווה הצעה לפעולה מסוימת",
  },
} as const;
