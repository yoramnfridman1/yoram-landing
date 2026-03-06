"use client";

import * as React from "react";
import { YORAM_CONFIG } from "../lib/content";

function useScrollReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = React.useRef<T>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); } },
      { threshold, rootMargin: "-40px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

function useAnimatedCounter(end: number, duration: number, start: boolean) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!start) return;
    let frame: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setVal(Math.round(end * p));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, start]);
  return val;
}

const ShieldIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);
const ChartIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);
const HeartIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const DIFF_ICONS: Record<string, React.ReactNode> = {
  shield: <ShieldIcon />,
  chart: <ChartIcon />,
  heart: <HeartIcon />,
};

function CredentialCard({ cred, isVisible, delay }: { cred: { title: string; value: string; icon: string }; isVisible: boolean; delay: number }) {
  return (
    <div
      className="bg-white/10 backdrop-blur rounded-xl p-6 text-center transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
        transitionDelay: delay + "ms",
      }}
    >
      <div className="text-3xl mb-2">{cred.icon}</div>
      <div className="text-2xl font-bold text-white mb-1">{cred.value}</div>
      <div className="text-blue-200 text-sm">{cred.title}</div>
    </div>
  );
}

function WhatsAppFAB({ phone, text }: { phone: string; text: string }) {
  const [hovered, setHovered] = React.useState(false);
  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 items-center overflow-hidden rounded-full shadow-2xl font-semibold text-sm text-white bg-green-500 hover:bg-green-600 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
      style={{ width: hovered ? "220px" : "56px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={text}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center">
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.932 1.395 5.608L.054 23.395a.75.75 0 00.92.92l5.787-1.341A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.875 0-3.632-.5-5.147-1.373l-.37-.22-3.834.889.889-3.834-.22-.37A9.712 9.712 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
        </svg>
      </div>
      <span
        className="whitespace-nowrap pr-4 transition-opacity duration-200"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        {text}
      </span>
    </a>
  );
}

export default function YoramLandingPage() {
  const c = YORAM_CONFIG;
  const [mounted, setMounted] = React.useState(false);
  const [formState, setFormState] = React.useState<"idle" | "sending" | "sent">("idle");
  const [formData, setFormData] = React.useState({ name: "", phone: "", email: "" });

  const stepsReveal = useScrollReveal<HTMLDivElement>();
  const diffReveal = useScrollReveal<HTMLDivElement>();
  const statsReveal = useScrollReveal<HTMLDivElement>();
  const credReveal = useScrollReveal<HTMLDivElement>();
  const ctaReveal = useScrollReveal<HTMLDivElement>();

  const stat1 = useAnimatedCounter(c.stats[0]?.value ?? 0, 2000, statsReveal.isVisible);
  const stat2 = useAnimatedCounter(c.stats[1]?.value ?? 0, 2000, statsReveal.isVisible);
  const stat3 = useAnimatedCounter(c.stats[2]?.value ?? 0, 2000, statsReveal.isVisible);
  const statVals = [stat1, stat2, stat3];

  React.useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");
    const waText = `${c.heroHeadline}\n${formData.name}\n${formData.phone}${formData.email ? "\n" + formData.email : ""}`;
    window.open(`https://wa.me/${c.whatsapp}?text=${encodeURIComponent(waText)}`, "_blank");
    setTimeout(() => setFormState("sent"), 1000);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-[#1a2a5e] via-[#1e3470] to-[#2b6cb0] font-sans overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-right space-y-6">
            <h1
              className="text-4xl md:text-6xl font-black text-white leading-tight transition-all duration-700 ease-out"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(30px)",
                transitionDelay: "0ms",
              }}
            >
              {c.heroHeadline}
            </h1>
            <p
              className="text-xl md:text-2xl text-blue-100 font-light transition-all duration-700 ease-out"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(30px)",
                transitionDelay: "150ms",
              }}
            >
              {c.heroSubheadline}
            </p>
            <p
              className="text-blue-200/80 text-lg transition-all duration-700 ease-out"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(30px)",
                transitionDelay: "300ms",
              }}
            >
              {c.tagline}
            </p>
            <div
              className="flex gap-4 justify-center md:justify-end transition-all duration-700 ease-out"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(30px)",
                transitionDelay: "450ms",
              }}
            >
              <a href={`tel:${c.phone}`} className="flex items-center gap-2 bg-white/10 backdrop-blur px-5 py-3 rounded-full text-white hover:bg-white/20 transition-colors">
                <PhoneIcon />
                <span>{c.phone}</span>
              </a>
            </div>
          </div>

          {/* Form Card */}
          <div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 transition-all duration-700 ease-out"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
              transitionDelay: "300ms",
            }}
          >
            {formState === "sent" ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4 animate-bounce-in">{"✅"}</div>
                <p className="text-white text-xl font-bold">{"תודה!"}</p>
                <p className="text-blue-200 mt-2">{"נחזור אליך בהקדם"}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-white text-lg font-bold text-center mb-2">{"השאירו פרטים לבדיקה חינם"}</p>
                <input
                  type="text"
                  required
                  placeholder={"שם מלא"}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200/60 border border-white/30 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 outline-none transition"
                />
                <input
                  type="tel"
                  required
                  placeholder={"טלפון"}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200/60 border border-white/30 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 outline-none transition"
                />
                <input
                  type="email"
                  placeholder={"אימייל (רשות)"}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200/60 border border-white/30 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 outline-none transition"
                />
                <button
                  type="submit"
                  disabled={formState === "sending"}
                  className="w-full py-4 bg-gradient-to-l from-orange-500 to-orange-600 text-white font-bold rounded-lg text-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:opacity-50"
                >
                  {formState === "sending" ? "…" : c.ctaText}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section ref={stepsReveal.ref} className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-16">{"איך זה עובד?"}</h2>
          <div className="space-y-8">
            {c.steps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-6 transition-all duration-700 ease-out"
                style={{
                  opacity: stepsReveal.isVisible ? 1 : 0,
                  transform: stepsReveal.isVisible ? "translateX(0)" : "translateX(40px)",
                  transitionDelay: (i * 150) + "ms",
                }}
              >
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-blue-200/80">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section ref={diffReveal.ref} className="py-20 px-4 bg-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-16">{"למה דרכנו?"}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {c.differentiators.map((diff, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center border border-white/10 hover:border-orange-400/30 transition-all duration-700 ease-out hover:transform hover:scale-105"
                style={{
                  opacity: diffReveal.isVisible ? 1 : 0,
                  transform: diffReveal.isVisible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.9)",
                  transitionDelay: (i * 200) + "ms",
                }}
              >
                <div className="text-orange-400 mb-4 flex justify-center">
                  {DIFF_ICONS[diff.icon] || <ShieldIcon />}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{diff.title}</h3>
                <p className="text-blue-200/80 text-sm leading-relaxed">{diff.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsReveal.ref} className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-16">{"המספרים מדברים"}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {c.stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl md:text-6xl font-black text-orange-400 mb-2">
                  {statVals[i]}{stat.suffix}
                </div>
                <div className="text-blue-200 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section ref={credReveal.ref} className="py-20 px-4 bg-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {c.credentials.map((cred, i) => (
            <CredentialCard key={i} cred={cred} isVisible={credReveal.isVisible} delay={i * 150} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaReveal.ref} className="py-20 px-4">
        <div
          className="max-w-3xl mx-auto text-center transition-all duration-700 ease-out"
          style={{
            opacity: ctaReveal.isVisible ? 1 : 0,
            transform: ctaReveal.isVisible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">{"רוצים לבדוק אם אתם משלמים יותר מדי?"}</h2>
          <a
            href={`https://wa.me/${c.whatsapp}?text=${encodeURIComponent(c.heroHeadline)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-4 px-10 bg-gradient-to-l from-orange-500 to-orange-600 text-white font-bold rounded-full text-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            {c.ctaText}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center space-y-2">
          <p className="text-blue-200/60 text-sm">{c.complianceFooter}</p>
          <p className="text-blue-200/40 text-xs">{c.companyName} | {c.phone}</p>
        </div>
      </footer>

      <WhatsAppFAB phone={c.whatsapp} text={"דברו איתנו בוואטסאפ"} />
    </div>
  );
}
