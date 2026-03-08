"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { YORAM_CONFIG } from "@/lib/content";
import {
  Phone, Mail, MessageCircle, FileSearch, BarChart3, ClipboardCheck,
  HeartHandshake, Shield, Calendar, Scale, Briefcase, Award, Home,
  UserCheck, PiggyBank, Users, Building2, TrendingDown, ChevronDown,
  ChevronRight, Menu, X, Calculator, Send, ArrowDown, Star, CheckCircle2
} from "lucide-react";

const C = YORAM_CONFIG;

const ICON_MAP: Record<string, any> = {
  Phone, Mail, MessageCircle, FileSearch, BarChart3, ClipboardCheck,
  HeartHandshake, Shield, Calendar, Scale, Briefcase, Award, Home,
  UserCheck, PiggyBank, Users, Building2, TrendingDown, ChevronDown,
  ChevronRight, Menu, X, Calculator, Send, ArrowDown, Star, CheckCircle2,
};

function Icon({ name, className = "w-6 h-6" }: { name: string; className?: string }) {
  const Comp = ICON_MAP[name];
  return Comp ? <Comp className={className} /> : null;
}

/* ─── Animated Counter ─── */
function Counter({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref} className="tabular-nums">{count.toLocaleString("he-IL")}{suffix}</span>;
}

/* ─── Scroll reveal hook ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.05, rootMargin: "0px 0px 50px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    // Fallback: force all reveals visible after 2.5s (ensures no invisible sections)
    const fallback = setTimeout(() => {
      document.querySelectorAll(".reveal:not(.visible)").forEach((el) => el.classList.add("visible"));
    }, 2500);
    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, []);
}

/* ─── Savings Calculator ─── */
function SavingsCalc() {
  const [premium, setPremium] = useState(C.calculator.defaultPremium);
  const savings = Math.round(premium * C.calculator.avgSavingsPercent);
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg mx-auto border border-[var(--gold)]/20">
      <div className="text-center mb-6">
        <Calculator className="w-10 h-10 text-[var(--gold)] mx-auto mb-3" />
        <h3 className="text-2xl font-bold text-[var(--navy)]">{C.calculator.title}</h3>
        <p className="text-gray-600 mt-1 text-sm">{C.calculator.subtitle}</p>
      </div>
      <label className="block text-sm font-medium text-gray-700 mb-2">סכום פרמיה חודשי (₪)</label>
      <input
        type="range" min={C.calculator.minPremium} max={C.calculator.maxPremium} step={50}
        value={premium} onChange={(e) => setPremium(+e.target.value)}
        aria-label="בחר סכום פרמיה חודשי" className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--gold)]"
      />
      <div className="flex justify-between text-sm text-gray-500 mt-1 mb-6">
        <span>₪{C.calculator.minPremium}</span>
        <span className="font-bold text-[var(--navy)] text-lg">₪{premium.toLocaleString("he-IL")}</span>
        <span>₪{C.calculator.maxPremium.toLocaleString("he-IL")}</span>
      </div>
      <div className="bg-gradient-to-l from-[var(--navy)] to-[var(--navy-light)] text-white rounded-xl p-6 text-center">
        <p className="text-sm opacity-80 mb-1">חיסכון שנתי משוער</p>
        <p className="text-4xl font-bold font-[var(--font-rubik)]">₪{(savings * 12).toLocaleString("he-IL")}</p>
        <p className="text-xs opacity-60 mt-2">(₪{savings.toLocaleString("he-IL")} לחודש)</p>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">{C.calculator.disclaimerText}</p>
    </div>
  );
}

/* ─── Multi-step Form ─── */
function LeadForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ fullName: "", phone: "", insuranceType: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch { setSubmitted(true); }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-[var(--navy)]">תודה רבה!</h3>
        <p className="text-gray-600 mt-2">קיבלנו את הפרטים שלכם. יורם יחזור אליכם בהקדם.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-8">
        {C.formSteps.map((s) => (
          <div key={s.step} className="flex items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              step >= s.step ? "bg-[var(--gold)] text-white shadow-lg" : "bg-gray-200 text-gray-500"
            }`}>{s.step}</div>
            {s.step < 3 && <div className={`flex-1 h-1 mx-2 rounded transition-all duration-500 ${step > s.step ? "bg-[var(--gold)]" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-gray-500 mb-6">{C.formSteps[step - 1].title}</p>

      {step === 1 && (
        <div className="space-y-4 animate-fadeInUp">
          <input
            type="text" placeholder="שם מלא" aria-label="שם מלא" name="fullName" id="fullName" autoComplete="name" value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--gold)] focus:outline-none transition text-right"
          />
          <input
            type="tel" placeholder="טלפון" aria-label="מספר טלפון" name="phone" id="phone" autoComplete="tel" value={form.phone} dir="ltr"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--gold)] focus:outline-none transition text-left"
          />
          <button onClick={() => setStep(2)} disabled={!form.fullName || !form.phone}
            className="w-full py-3 bg-[var(--gold)] text-white font-bold rounded-xl hover:bg-[var(--gold-dark)] transition disabled:opacity-40 disabled:cursor-not-allowed">
            המשך <ChevronRight className="inline w-4 h-4 mr-1 rotate-180" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3 animate-fadeInUp">
          {C.insuranceTypes.map((t) => (
            <button key={t} onClick={() => { setForm({ ...form, insuranceType: t }); setStep(3); }}
              className={`w-full px-4 py-3 text-right border-2 rounded-xl transition ${
                form.insuranceType === t ? "border-[var(--gold)] bg-[var(--gold)]/5 font-bold" : "border-gray-200 hover:border-[var(--gold)]/50"
              }`}>{t}</button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-fadeInUp">
          <textarea
            placeholder="הערות נוספות (לא חובה)" aria-label="הערות נוספות" name="notes" id="notes" value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--gold)] focus:outline-none transition text-right h-28 resize-none"
          />
          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-4 bg-gradient-to-l from-[var(--gold)] to-[var(--gold-light)] text-white font-bold rounded-xl hover:shadow-lg transition text-lg animate-pulseGold">
            {loading ? "שולח..." : "שליחה — בדיקת תיק חינם"}
            <Send className="inline w-5 h-5 mr-2" />
          </button>
          <button onClick={() => setStep(2)} className="w-full text-sm text-gray-400 hover:text-gray-600">חזרה</button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */
export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Skip Navigation */}
      <a href="#form" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:bg-[var(--gold)] focus:text-white focus:px-4 focus:py-3 focus:rounded-lg focus:text-lg focus:shadow-lg">דלג לטופס</a>

      {/* ─── Sticky Header ─── */}
      <header className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 header-scrolled py-2" : "bg-transparent py-4"
      }`}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/yf-logo.svg" alt="יורם פרידמן" className="h-10 w-auto" />
            <span className={`font-bold text-sm hidden sm:block transition-colors ${scrolled ? "text-[var(--navy)]" : "text-white"}`}>
              יורם פרידמן | סוכנות לביטוח
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href={"tel:" + C.phone} aria-label="התקשר עכשיו" className={`hidden sm:flex items-center gap-1 text-sm font-medium min-h-[44px] transition-colors ${scrolled ? "text-[var(--navy)]" : "text-white"}`}>
              <Phone className="w-4 h-4" /> {C.phone}
            </a>
            <a href="#form" className="bg-[var(--gold)] text-white px-5 py-3 min-h-[44px] rounded-full text-sm font-bold hover:bg-[var(--gold-dark)] transition shadow-md">
              בדיקה חינם
            </a>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-gradient-to-bl from-[var(--navy-dark)] via-[var(--navy)] to-[var(--navy-light)]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--gold)] rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-32 relative z-10 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8 animate-fadeInUp">
            <span className="text-white/90 text-sm">✦ למעלה מ-40 שנות ניסיון מקצועי ✦</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-6 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
            משלמים יותר מדי?
            <br />
            <span className="text-gold-gradient">זה הזמן לבדוק</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 max-w-2xl mx-auto mb-10 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
            {C.heroSubtext}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            <a href="#form" className="bg-[var(--gold)] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[var(--gold-dark)] transition shadow-xl hover:shadow-2xl hover:scale-105 animate-pulseGold">
              בדיקת תיק חינם — ללא התחייבות
            </a>
            <a href={"https://wa.me/" + C.whatsappNumber} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-4 rounded-full text-lg font-bold hover:bg-[#20bd5a] transition shadow-xl">
              <MessageCircle className="w-5 h-5" /> שליחת הודעה בוואטסאפ
            </a>
          </div>
          <div className="mt-16 animate-fadeInUp" style={{ animationDelay: "0.5s" }}>
            <ArrowDown className="w-6 h-6 text-white/40 mx-auto animate-float" />
          </div>
        </div>
        {/* Diagonal cut */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-[var(--cream)]" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }} />
      </section>

      {/* ─── Partner Logo Strip ─── */}
      <section className="py-8 bg-[var(--cream)] border-b border-gray-100">
        <p className="text-center text-sm text-gray-400 mb-4">עובדים מול חברות הביטוח המובילות בישראל</p>
        <div className="partner-strip overflow-hidden">
          <div className="flex animate-marquee gap-12 items-center whitespace-nowrap">
            {[...C.partnerCompanies, ...C.partnerCompanies].map((name, i) => (
              <span key={i} className="text-gray-400 font-medium text-lg px-4">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="py-20 bg-[var(--cream)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {C.stats.map((s, i) => (
              <div key={i} className="reveal text-center" style={{ transitionDelay: i * 0.1 + "s" }}>
                <div className="w-16 h-16 rounded-2xl bg-[var(--navy)]/5 flex items-center justify-center mx-auto mb-4">
                  <Icon name={s.icon} className="w-8 h-8 text-[var(--gold)]" />
                </div>
                <div className="text-4xl sm:text-5xl font-black text-[var(--navy)] font-[var(--font-rubik)]">
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <p className="text-gray-600 mt-2 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Yoram (Differentiators) ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl font-black text-[var(--navy)] mb-4">למה דווקא יורם?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">40 שנה של ניסיון, אובייקטיביות מלאה, ושירות אישי שלא תמצאו בשום מקום אחר</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {C.differentiators.map((d, i) => (
              <div key={i} className="reveal group p-6 rounded-2xl border-2 border-gray-100 hover:border-[var(--gold)]/30 hover:shadow-lg transition-all duration-300" style={{ transitionDelay: i * 0.08 + "s" }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--gold)]/10 to-[var(--gold)]/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon name={d.icon} className="w-6 h-6 text-[var(--gold)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--navy)] mb-2">{d.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works (5-step timeline) ─── */}
      <section className="py-24 bg-gradient-to-b from-[var(--cream)] to-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl font-black text-[var(--navy)] mb-4">איך זה עובד?</h2>
            <p className="text-gray-600">תהליך פשוט וברור — מהפנייה הראשונה ועד ליווי שוטף</p>
          </div>
          <div className="space-y-0">
            {C.steps.map((s, i) => (
              <div key={i} className="reveal flex gap-6 items-start" style={{ transitionDelay: i * 0.1 + "s" }}>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[var(--navy)] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                    <Icon name={s.icon} className="w-6 h-6" />
                  </div>
                  {i < C.steps.length - 1 && <div className="w-0.5 h-16 bg-[var(--gold)]/30 mt-2" />}
                </div>
                <div className="pb-12">
                  <span className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider">שלב {s.num}</span>
                  <h3 className="text-xl font-bold text-[var(--navy)] mt-1">{s.title}</h3>
                  <p className="text-gray-600 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Savings Calculator ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 reveal">
          <SavingsCalc />
        </div>
      </section>

      {/* ─── FAQ Accordion ─── */}
      <section className="py-24 bg-[var(--cream)]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <h2 className="text-4xl font-black text-[var(--navy)] mb-4">שאלות נפוצות</h2>
          </div>
          <div className="space-y-3">
            {C.faq.map((item, i) => (
              <details key={i} className="reveal group bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ transitionDelay: i * 0.05 + "s" }}>
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition">
                  <span className="font-bold text-[var(--navy)] text-right">{item.q}</span>
                  <ChevronDown className="faq-chevron w-5 h-5 text-[var(--gold)] flex-shrink-0 mr-4 transition-transform duration-300" />
                </summary>
                <div className="faq-answer px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Lead Form ─── */}
      <section id="form" className="py-24 bg-gradient-to-b from-white to-[var(--cream)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <h2 className="text-4xl font-black text-[var(--navy)] mb-4">בדיקת תיק ביטוח — חינם</h2>
            <p className="text-gray-600 max-w-xl mx-auto">השאירו פרטים ויורם יחזור אליכם תוך מספר שעות. ללא התחייבות, ללא לחץ.</p>
          </div>
          <div className="reveal">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* ─── Credentials ─── */}
      <section className="py-20 bg-[var(--navy)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <h2 className="text-3xl font-black text-white mb-2">הכישורים שלנו</h2>
            <p className="text-white/60">רישיון מקצועי, ניסיון עשיר, ואובייקטיביות מלאה</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {C.credentials.map((c, i) => (
              <div key={i} className="reveal text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition" style={{ transitionDelay: i * 0.1 + "s" }}>
                <Icon name={c.icon} className="w-8 h-8 text-[var(--gold)] mx-auto mb-3" />
                <h3 className="text-white font-bold mb-1">{c.label}</h3>
                <p className="text-white/60 text-sm">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-20 bg-gradient-to-l from-[var(--gold)] to-[var(--gold-light)]">
        <div className="max-w-4xl mx-auto px-4 text-center reveal">
          <h2 className="text-4xl font-black text-white mb-4">מוכנים לגלות כמה אפשר לחסוך?</h2>
          <p className="text-white/90 text-xl mb-8">בדיקת תיק ביטוח חינם — ללא התחייבות, ללא לחץ</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#form" className="bg-white text-[var(--navy)] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition hover:scale-105">
              בדיקה חינם עכשיו
            </a>
            <a href={"tel:" + C.phone} className="flex items-center gap-2 text-white border-2 border-white/40 px-6 py-4 rounded-full font-bold hover:bg-white/10 transition">
              <Phone className="w-5 h-5" /> {C.phone}
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-12 bg-[var(--navy-dark)] text-white/60">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-right">
              <img src="/yf-logo.svg" alt="יורם פרידמן" className="h-8 w-auto mx-auto sm:mx-0 mb-2" />
              <p className="text-sm">יורם פרידמן — סוכנות לביטוח | מאז 1984</p>
              <p className="text-xs mt-1">רישיון סוכן ביטוח מס׳ {C.licenseNumber}</p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href={"tel:" + C.phone} className="flex items-center gap-1 hover:text-white transition min-h-[44px] py-2"><Phone className="w-4 h-4" /> {C.phone}</a>
              <a href={"mailto:" + C.email} className="flex items-center gap-1 hover:text-white transition min-h-[44px] py-2"><Mail className="w-4 h-4" /> {C.email}</a>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-white/40">
            © {new Date().getFullYear()} {C.businessName}. כל הזכויות שמורות.
          </div>
        </div>
      </footer>

      {/* ─── WhatsApp FAB ─── */}
      <a href={"https://wa.me/" + C.whatsappNumber + "?text=" + encodeURIComponent("שלום, קוראים לי ________. אשמח לבדיקת תיק ביטוח חינם.")}
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 bg-[#25D366] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform animate-whatsappPulse"
        aria-label="שליחת הודעה בוואטסאפ">
        <MessageCircle className="w-8 h-8" />
      </a>

      {/* ─── FAQ Schema (JSON-LD) ─── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: C.faq.map((f) => ({
          "@type": "Question", name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      })}} />
    </>
  );
}
