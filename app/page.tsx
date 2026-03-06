"use client";
import * as React from "react";
import { YORAM_CONFIG } from "../lib/content";

/* ── Scroll-reveal hook ── */
function useScrollReveal<T extends HTMLElement>(threshold = 0.05) {
  const ref = React.useRef<T>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => setIsVisible(true);
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { show(); obs.disconnect(); clearTimeout(timer); } },
      { threshold: 0.01, rootMargin: "50px" }
    );
    obs.observe(el);
    const timer = setTimeout(show, 1800);
    return () => { obs.disconnect(); clearTimeout(timer); };
  }, []);
  return { ref, isVisible };
}

/* ── Animated counter hook ── */
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

/* ── SVG Icons ── */
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
      <path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}
function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-emerald-500 flex-shrink-0">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" />
      <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const DIFF_ICONS: Record<string, React.ReactNode> = {
  shield: <ShieldIcon />,
  chart: <ChartIcon />,
  heart: <HeartIcon />,
};

/* ── WhatsApp FAB ── */
function WhatsAppFAB() {
  const [expanded, setExpanded] = React.useState(false);
  const waUrl = `https://wa.me/${YORAM_CONFIG.whatsapp}?text=${encodeURIComponent("\u05D4\u05D9\u05D9, \u05D0\u05E9\u05DE\u05D7 \u05DC\u05E7\u05D1\u05DC \u05D1\u05D3\u05D9\u05E7\u05EA \u05EA\u05D9\u05E7 \u05D1\u05D9\u05D8\u05D5\u05D7 \u05D7\u05D9\u05E0\u05DD")}`;
  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-end gap-3" dir="ltr">
      {expanded && (
        <a href={waUrl} target="_blank" rel="noopener noreferrer"
          className="bg-white text-gray-800 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium
                     animate-[fadeIn_0.2s_ease-out] hover:bg-gray-50 transition-colors whitespace-nowrap">
          {"\u05E9\u05DC\u05D7\u05D5 \u05D4\u05D5\u05D3\u05E2\u05D4 \u05D1\u05D5\u05D5\u05D0\u05D8\u05E1\u05D0\u05E4 \u2709\uFE0F"}
        </a>
      )}
      <button onClick={() => setExpanded(!expanded)}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg
                   hover:scale-110 transition-transform flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.3 0-4.438-.744-6.166-2.008l-.43-.322-2.65.888.888-2.65-.322-.43A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════ */
export default function YoramLandingPage() {
  const [formData, setFormData] = React.useState({ name: "", phone: "" });
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `\u05E9\u05DC\u05D5\u05DD, \u05E7\u05D5\u05E8\u05D0\u05D9\u05DD \u05DC\u05D9 ${formData.name}. \u05D0\u05E9\u05DE\u05D7 \u05DC\u05D1\u05D3\u05D9\u05E7\u05EA \u05EA\u05D9\u05E7 \u05D1\u05D9\u05D8\u05D5\u05D7 \u05D7\u05D9\u05E0\u05DD. \u05D8\u05DC\u05E4\u05D5\u05DF: ${formData.phone}`;
    window.open(`https://wa.me/${YORAM_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  /* Scroll-reveal refs */
  const stepsSection = useScrollReveal<HTMLElement>(0.1);
  const diffSection = useScrollReveal<HTMLElement>(0.1);
  const statsSection = useScrollReveal<HTMLElement>(0.15);
  const credSection = useScrollReveal<HTMLElement>(0.1);
  const ctaSection = useScrollReveal<HTMLElement>(0.15);

  const stat0 = useAnimatedCounter(YORAM_CONFIG.stats[0].value, 1800, statsSection.isVisible);
  const stat1 = useAnimatedCounter(YORAM_CONFIG.stats[1].value, 2200, statsSection.isVisible);
  const stat2 = useAnimatedCounter(YORAM_CONFIG.stats[2].value, 1400, statsSection.isVisible);
  const statVals = [stat0, stat1, stat2];

  return (
    <div className="min-h-screen bg-white text-gray-900" dir="rtl">

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-[#1a2a5e]/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <span className="text-[#1a2a5e] font-bold text-lg" style={{ fontFamily: "Georgia, serif" }}>YF</span>
            </div>
            <span className="text-white font-semibold text-sm hidden sm:block">
              {"\u05D9\u05D5\u05E8\u05DD \u05E4\u05E8\u05D9\u05D3\u05DE\u05DF \u05D1\u05D9\u05D8\u05D5\u05D7"}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-white/90 text-sm font-medium">
            <a href="#steps" className="hover:text-white transition-colors">{"\u05D0\u05D9\u05DA \u05D6\u05D4 \u05E2\u05D5\u05D1\u05D3?"}</a>
            <a href="#why" className="hover:text-white transition-colors">{"\u05DC\u05DE\u05D4 \u05D3\u05E8\u05DB\u05E0\u05D5?"}</a>
            <a href="#credentials" className="hover:text-white transition-colors">{"\u05E0\u05D9\u05E1\u05D9\u05D5\u05DF"}</a>
            <a href={`tel:${YORAM_CONFIG.phone}`} className="bg-[#f97316] text-white px-4 py-2 rounded-lg hover:bg-[#ea580c] transition-colors">
              <span className="flex items-center gap-2">
                <PhoneIcon />
                {YORAM_CONFIG.phone}
              </span>
            </a>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              {menuOpen
                ? <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                : <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-[#1a2a5e]/95 backdrop-blur-md border-t border-white/10 px-6 py-4 space-y-3">
            <a href="#steps" onClick={() => setMenuOpen(false)} className="block text-white/90 hover:text-white py-2">{"\u05D0\u05D9\u05DA \u05D6\u05D4 \u05E2\u05D5\u05D1\u05D3?"}</a>
            <a href="#why" onClick={() => setMenuOpen(false)} className="block text-white/90 hover:text-white py-2">{"\u05DC\u05DE\u05D4 \u05D3\u05E8\u05DB\u05E0\u05D5?"}</a>
            <a href="#credentials" onClick={() => setMenuOpen(false)} className="block text-white/90 hover:text-white py-2">{"\u05E0\u05D9\u05E1\u05D9\u05D5\u05DF"}</a>
            <a href={`tel:${YORAM_CONFIG.phone}`} className="block bg-[#f97316] text-white text-center px-4 py-2 rounded-lg">
              {YORAM_CONFIG.phone}
            </a>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-[#1a2a5e] via-[#1e3470] to-[#2b6cb0] pt-16 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }} />

        <div className="relative max-w-6xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center py-12">
          {/* Right side - Text (RTL) */}
          <div className="text-white space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight" style={{ fontFamily: "Georgia, serif" }}>
              {"\u05DE\u05E9\u05DC\u05DE\u05D9\u05DD \u05D9\u05D5\u05EA\u05E8 \u05DE\u05D3\u05D9?"}
              <br />
              <span className="text-[#f97316]">{"\u05D6\u05D4 \u05D4\u05D6\u05DE\u05DF \u05DC\u05D1\u05D3\u05D5\u05E7."}</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-lg leading-relaxed">
              {YORAM_CONFIG.heroSubheadline}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <span className="flex items-center gap-2"><CheckCircleIcon /> {"\u05DC\u05DC\u05D0 \u05E2\u05DC\u05D5\u05EA"}</span>
              <span className="flex items-center gap-2"><CheckCircleIcon /> {"\u05DC\u05DC\u05D0 \u05D4\u05EA\u05D7\u05D9\u05D9\u05D1\u05D5\u05EA"}</span>
              <span className="flex items-center gap-2"><CheckCircleIcon /> {"25+ \u05E9\u05E0\u05D5\u05EA \u05E0\u05D9\u05E1\u05D9\u05D5\u05DF"}</span>
            </div>
          </div>

          {/* Left side - Form card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-gray-900">
            <h2 className="text-2xl font-bold mb-2 text-[#1a2a5e]" style={{ fontFamily: "Georgia, serif" }}>
              {"\u05D1\u05D3\u05D9\u05E7\u05EA \u05EA\u05D9\u05E7 \u05D7\u05D9\u05E0\u05DD"}
            </h2>
            <p className="text-gray-500 text-sm mb-6">{"\u05DE\u05DC\u05D0\u05D5 \u05E4\u05E8\u05D8\u05D9\u05DD \u05D5\u05E0\u05D7\u05D6\u05D5\u05E8 \u05D0\u05DC\u05D9\u05DB\u05DD \u05EA\u05D5\u05DA 24 \u05E9\u05E2\u05D5\u05EA"}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{"\u05E9\u05DD \u05DE\u05DC\u05D0"}</label>
                <input type="text" required placeholder={"\u05D9\u05D5\u05E8\u05DD \u05D9\u05E9\u05E8\u05D0\u05DC\u05D9"}
                  value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#2b6cb0] focus:border-transparent outline-none transition-all text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{"\u05D8\u05DC\u05E4\u05D5\u05DF"}</label>
                <input type="tel" required placeholder="050-000-0000" dir="ltr"
                  value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#2b6cb0] focus:border-transparent outline-none transition-all text-gray-900" />
              </div>
              <button type="submit"
                className="w-full py-4 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-lg
                           shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]">
                {YORAM_CONFIG.ctaText}
              </button>
            </form>
            <p className="text-center text-xs text-gray-400 mt-4">{"\u05DC\u05D0 \u05E1\u05E4\u05DD \u2022 \u05D0\u05D5\u05D1\u05D9\u05D9\u05E7\u05D8\u05D9\u05D1\u05D9\u05D5\u05EA \u05DE\u05DC\u05D0\u05D4"}</p>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ── STEPS SECTION ── */}
      <section id="steps" ref={stepsSection.ref}
        className="py-20 bg-white" style={{ opacity: stepsSection.isVisible ? 1 : 0, transform: stepsSection.isVisible ? 'none' : 'translateY(32px)', transition: 'all 0.7s ease-out' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1a2a5e] mb-4" style={{ fontFamily: "Georgia, serif" }}>
            {"\u05D0\u05D9\u05DA \u05D6\u05D4 \u05E2\u05D5\u05D1\u05D3?"}
          </h2>
          <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
            {"\u05EA\u05D4\u05DC\u05D9\u05DA \u05E4\u05E9\u05D5\u05D8 \u05D1-5 \u05E6\u05E2\u05D3\u05D9\u05DD \u2013 \u05D0\u05E0\u05D7\u05E0\u05D5 \u05E2\u05D5\u05E9\u05D9\u05DD \u05D0\u05EA \u05D4\u05E2\u05D1\u05D5\u05D3\u05D4"}
          </p>
          <div className="grid sm:grid-cols-5 gap-6">
            {YORAM_CONFIG.steps.map((step, i) => (
              <div key={i} className="text-center group" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1a2a5e] to-[#2b6cb0] text-white flex items-center justify-center mx-auto mb-4
                               text-xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                  {i + 1}
                </div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US (DIFFERENTIATORS) ── */}
      <section id="why" ref={diffSection.ref}
        className="py-20 bg-gray-50" style={{ opacity: diffSection.isVisible ? 1 : 0, transform: diffSection.isVisible ? 'none' : 'translateY(32px)', transition: 'all 0.7s ease-out' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1a2a5e] mb-4" style={{ fontFamily: "Georgia, serif" }}>
            {"\u05DC\u05DE\u05D4 \u05D3\u05E8\u05DB\u05E0\u05D5?"}
          </h2>
          <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
            {"\u05D9\u05D5\u05E8\u05DD \u05E4\u05E8\u05D9\u05D3\u05DE\u05DF \u2013 \u05E1\u05D5\u05DB\u05DF \u05D1\u05D9\u05D8\u05D5\u05D7 \u05DE\u05D5\u05E8\u05E9\u05D4 \u05E2\u05DD 25+ \u05E9\u05E0\u05D5\u05EA \u05E0\u05D9\u05E1\u05D9\u05D5\u05DF"}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {YORAM_CONFIG.differentiators.map((diff, i) => (
              <div key={i}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#2b6cb0]/30 transition-all group"
                style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="w-14 h-14 rounded-xl bg-[#1a2a5e]/10 text-[#1a2a5e] flex items-center justify-center mb-5 group-hover:bg-[#1a2a5e] group-hover:text-white transition-colors">
                  {DIFF_ICONS[diff.icon] || <ShieldIcon />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{diff.title}</h3>
                <p className="text-gray-500 leading-relaxed">{diff.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section ref={statsSection.ref}
        className="py-16 bg-gradient-to-r from-[#1a2a5e] to-[#2b6cb0]" style={{ opacity: statsSection.isVisible ? 1 : 0, transform: statsSection.isVisible ? 'none' : 'translateY(32px)', transition: 'all 0.7s ease-out' }}>
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center text-white">
          {YORAM_CONFIG.stats.map((stat, i) => (
            <div key={i}>
              <div className="text-4xl sm:text-5xl font-bold mb-2" style={{ fontFamily: "Georgia, serif" }}>
                {statVals[i]}{stat.suffix}
              </div>
              <div className="text-white/70 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CREDENTIALS SECTION ── */}
      <section id="credentials" ref={credSection.ref}
        className="py-20 bg-white" style={{ opacity: credSection.isVisible ? 1 : 0, transform: credSection.isVisible ? 'none' : 'translateY(32px)', transition: 'all 0.7s ease-out' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1a2a5e] mb-14" style={{ fontFamily: "Georgia, serif" }}>
            {"\u05E0\u05D9\u05E1\u05D9\u05D5\u05DF \u05D5\u05D0\u05DE\u05D9\u05E0\u05D5\u05EA"}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {YORAM_CONFIG.credentials.map((cred, i) => (
              <div key={i}
                className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:border-[#2b6cb0]/30 hover:shadow-md transition-all"
                style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="text-4xl mb-4">{cred.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{cred.title}</h3>
                <p className="text-sm text-gray-500">{cred.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── CTA Section ── */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a2a5e 0%, #2b4a8e 50%, #1a2a5e 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            {"הגיע הזמן לבדוק את התיק שלך"}
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            {"בדיקה חינם ללא התחייבות — תוך 5 דקות תדעו אם אתם משלמים יותר מדי"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${YORAM_CONFIG.whatsapp}?text=${encodeURIComponent('היי, אשמח לבדיקת תיק ביטוח חינם')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{ background: '#25D366' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.67-1.228A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.143 0-4.142-.612-5.848-1.678a.5.5 0 00-.398-.052l-3.4.895.737-3.088a.5.5 0 00-.07-.422A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
              {"שלחו הודעה בוואטסאפ"}
            </a>
            <a
              href={`tel:${YORAM_CONFIG.phone}`}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-lg font-bold text-white border-2 border-white/30 transition-all duration-300 hover:bg-white/10 hover:border-white/60"
            >
              <PhoneIcon />
              {YORAM_CONFIG.phone}
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #1a2a5e, #2b6cb0)' }}>YF</div>
                <span className="text-white font-semibold">{YORAM_CONFIG.businessName}</span>
              </div>
              <p className="text-sm leading-relaxed">
                {"סוכן ביטוח מורשה עם ניסיון של מעל ל-25 שנה. מתמחה במציאת הפתרונות הטובות ביותר עבור כל לקוח."}
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{"תחומי התמחות"}</h4>
              <ul className="space-y-2 text-sm">
                <li>{"ביטוח חיים ומשכנתא"}</li>
                <li>{"פנסיה וגמל"}</li>
                <li>{"חיסכונות והשקעות"}</li>
                <li>{"ביטוח עסקי ורכב"}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{"צור קשר"}</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <PhoneIcon />
                  <a href={`tel:${YORAM_CONFIG.phone}`} className="hover:text-white transition-colors">{YORAM_CONFIG.phone}</a>
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <span>yoram@friedmanbit.co.il</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-xs">
            <p>{YORAM_CONFIG.complianceFooter}</p>
            <p className="mt-2 text-gray-600">{"© "}{new Date().getFullYear()}{" "}{YORAM_CONFIG.businessName}{". כל הזכויות שמורות."}</p>
          </div>
        </div>
      </footer>

      <WhatsAppFAB />
    </div>
  );
}
