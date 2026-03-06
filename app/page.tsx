"use client";
import { YORAM_CONFIG as C } from "@/lib/content";
import { useState, useEffect, useRef, useCallback } from "react";

/* ── Hooks ── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useCounter(end: number, duration = 2000, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setVal(Math.floor(p * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, end, duration]);
  return val;
}

/* ── Form ── */
function LeadForm({ variant = "hero" }: { variant?: "hero" | "bottom" }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSending(true);
    try {
      await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone, source: "landing-" + variant }) });
    } catch {}
    setDone(true);
    setSending(false);
  }, [name, phone, variant]);

  if (done) return (
    <div className="text-center py-8">
      <div className="text-4xl mb-3">\u2705</div>
      <h3 className="text-xl font-bold text-white">{C.successTitle}</h3>
      <p className="text-blue-200 mt-2">{C.successMessage}</p>
    </div>
  );

  const isHero = variant === "hero";
  return (
    <form onSubmit={submit} className="space-y-4" dir="rtl">
      <h3 className={`text-xl font-bold ${isHero ? "text-white" : "text-white"}`}>{C.formTitle}</h3>
      <p className={`text-sm ${isHero ? "text-blue-200" : "text-blue-200"}`}>{C.formSubtitle}</p>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={C.formNamePlaceholder} required className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-sky-400 backdrop-blur-sm" />
      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder={C.formPhonePlaceholder} required className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-sky-400 backdrop-blur-sm" dir="ltr" />
      <button type="submit" disabled={sending} className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-l from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-white shadow-lg shadow-sky-500/30 transition-all duration-300 hover:shadow-sky-400/50 hover:-translate-y-0.5 disabled:opacity-60">
        {sending ? C.formSending : C.ctaText}
      </button>
      <p className="text-xs text-blue-300/60 text-center">{C.formDisclaimer}</p>
    </form>
  );
}

/* ── Stat Counter ── */
function StatBlock({ value, suffix, label, delay = 0 }: { value: number; suffix: string; label: string; delay?: number }) {
  const { ref, visible } = useInView(0.3);
  const count = useCounter(value, 2200, visible);
  return (
    <div ref={ref} className="text-center" style={{ animationDelay: delay + "ms" }}>
      <div className="text-5xl md:text-6xl font-black text-white tabular-nums">
        {count}<span className="text-sky-400">{suffix}</span>
      </div>
      <div className="text-blue-200 text-sm mt-1 font-medium">{label}</div>
    </div>
  );
}

/* ── Page ── */
export default function YoramLanding() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const whyRef = useInView(0.1);
  const stepsRef = useInView(0.1);
  const expRef = useInView(0.1);

  return (
    <div className="min-h-screen bg-[#0a1628] text-white overflow-x-hidden" dir="rtl">

      {/* ▸ Nav */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0d1b33]/90 backdrop-blur-xl shadow-2xl shadow-black/30 py-3" : "bg-transparent py-5"}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <img src="/yf-logo.svg" alt="YF" className="h-10 w-auto" />
          <div className="flex items-center gap-4">
            <a href={"tel:" + C.phone} className="hidden sm:block text-sm text-blue-300 hover:text-white transition">{C.phone}</a>
            <a href="#form" className="px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-l from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 shadow-lg shadow-sky-500/25 transition-all hover:shadow-sky-400/40">{C.ctaText}</a>
          </div>
        </div>
      </nav>

      {/* ▸ Hero — full viewport, diagonal cut */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* bg layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#132044] to-[#1a3060]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full bg-sky-500/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* text col */}
            <div className="lg:col-span-3 space-y-8 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                40+ שנות ניסיון | סוכן מורשה
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                <span className="block">משלמים יותר מדי?</span>
                <span className="block mt-2 bg-gradient-to-l from-sky-300 via-blue-400 to-sky-500 bg-clip-text text-transparent">זה הזמן לבדוק</span>
              </h1>
              <p className="text-lg text-blue-200/80 max-w-xl leading-relaxed">{C.heroSubheadline}</p>

              {/* stats row */}
              <div className="flex gap-8 pt-4">
                {C.stats.map((s, i) => <StatBlock key={i} value={s.value} suffix={s.suffix} label={s.label} delay={i * 200} />)}
              </div>
            </div>

            {/* form col */}
            <div id="form" className="lg:col-span-2 animate-fadeIn" style={{ animationDelay: "300ms" }}>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-sky-400/30 to-blue-600/30 rounded-2xl blur-xl" />
                <div className="relative bg-[#0d1b33]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                  <LeadForm variant="hero" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* diagonal bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24">
          <svg viewBox="0 0 1440 96" fill="none" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 96L1440 0V96H0Z" fill="#0f1d35" />
          </svg>
        </div>
      </section>

      {/* ▸ Trust Bar */}
      <section className="bg-[#0f1d35] py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            {C.credentials.map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <div className="font-bold text-white">{c.title}</div>
                  <div className="text-blue-300/70 text-xs">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ▸ Why Yoram — alternating layout, NOT cards */}
      <section ref={whyRef.ref} className="bg-[#0f1d35] py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black">{C.diffTitle}</h2>
            <p className="text-blue-200/70 mt-3 text-lg">{C.diffSubtitle}</p>
          </div>
          <div className="space-y-20">
            {C.differentiators.map((d, i) => {
              const icons: Record<string, string> = { shield: "\uD83D\uDEE1\uFE0F", chart: "\uD83D\uDCC8", heart: "\u2764\uFE0F" };
              const isEven = i % 2 === 0;
              return (
                <div key={i} className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? "" : "md:flex-row-reverse"} ${whyRef.visible ? "animate-fadeIn" : "opacity-0"}`} style={{ animationDelay: (i * 200) + "ms" }}>
                  <div className="flex-shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/20 flex items-center justify-center text-5xl">
                    {icons[d.icon] || "\u2B50"}
                  </div>
                  <div className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"}`}>
                    <h3 className="text-2xl font-bold text-white mb-2">{d.title}</h3>
                    <p className="text-blue-200/70 text-lg leading-relaxed">{d.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ▸ How it works — vertical timeline */}
      <section ref={stepsRef.ref} className="relative py-24 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black">{C.stepsTitle}</h2>
            <p className="text-blue-200/70 mt-3 text-lg">{C.stepsSubtitle}</p>
          </div>
          <div className="relative">
            {/* timeline line */}
            <div className="absolute right-6 md:right-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-sky-500/50 via-blue-500/30 to-transparent" />
            <div className="space-y-12">
              {C.steps.map((s, i) => (
                <div key={i} className={`relative flex items-start gap-6 md:gap-12 ${stepsRef.visible ? "animate-fadeIn" : "opacity-0"}`} style={{ animationDelay: (i * 150) + "ms" }}>
                  {/* dot */}
                  <div className="absolute right-4 md:right-[calc(50%-8px)] w-4 h-4 rounded-full bg-sky-400 border-4 border-[#0a1628] z-10 shadow-lg shadow-sky-400/30" />
                  {/* content */}
                  <div className={`mr-12 md:mr-0 ${i % 2 === 0 ? "md:ml-auto md:w-[45%] md:pr-12" : "md:mr-auto md:w-[45%] md:pl-12 md:text-left"}`}>
                    <div className="bg-[#0f1d35] border border-white/5 rounded-xl p-6 hover:border-sky-500/20 transition-all duration-500">
                      <div className="text-sky-400 text-sm font-bold mb-1">{s.number}</div>
                      <h3 className="text-xl font-bold text-white mb-1">{s.title}</h3>
                      <p className="text-blue-200/60 text-sm">{s.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ▸ Experience — big statement section */}
      <section ref={expRef.ref} className="relative py-32 bg-[#0f1d35] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
          <span className="text-[20rem] font-black leading-none">40+</span>
        </div>
        <div className={`max-w-4xl mx-auto px-6 text-center relative z-10 ${expRef.visible ? "animate-fadeIn" : "opacity-0"}`}>
          <h2 className="text-3xl md:text-4xl font-black mb-4">{C.credentialsTitle}</h2>
          <p className="text-blue-200/70 text-lg mb-12">{C.credentialsSubtitle}</p>
          <div className="flex flex-wrap justify-center gap-6">
            {C.credentials.map((c, i) => (
              <div key={i} className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-xl px-8 py-6 hover:border-sky-500/30 transition-all duration-500 group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{c.icon}</div>
                <div className="font-bold text-white">{c.title}</div>
                <div className="text-sky-300/70 text-sm mt-1">{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ▸ Final CTA */}
      <section className="relative py-24 bg-gradient-to-br from-[#132044] to-[#1a3060]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black">{C.ctaTitle}</h2>
            <p className="text-blue-200/70 mt-3 text-lg">{C.ctaSubtitle}</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-br from-sky-400/20 to-blue-600/20 rounded-2xl blur-2xl" />
            <div className="relative bg-[#0d1b33]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <LeadForm variant="bottom" />
            </div>
          </div>
        </div>
      </section>

      {/* ▸ Footer */}
      <footer className="bg-[#060e1d] border-t border-white/5 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <img src="/yf-logo.svg" alt="YF" className="h-8 w-auto opacity-60" />
          <p className="text-blue-300/40 text-sm">{C.complianceFooter}</p>
          <div className="flex gap-4 text-sm text-blue-300/50">
            <a href={"tel:" + C.phone} className="hover:text-white transition">{C.phone}</a>
            <a href={"mailto:" + C.email} className="hover:text-white transition">{C.email}</a>
          </div>
        </div>
      </footer>

      {/* ▸ WhatsApp FAB */}
      <a href={"https://wa.me/" + C.whatsapp} target="_blank" rel="noopener" className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 shadow-lg shadow-green-500/30 flex items-center justify-center transition-all hover:scale-110 hover:shadow-green-400/40">
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </a>
    </div>
  );
}
