"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { YORAM_CONFIG } from "@/lib/content";

/* ============ HOOKS ============ */
function useScrollReveal(threshold = 0.15) {
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

function useAnimatedCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

/* ============ ICONS ============ */
function ShieldIcon() {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
}
function ChartIcon() {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>);
}
function HeartIcon() {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>);
}
function PhoneIcon() {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
}
function CheckCircleIcon() {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
}

/* ============ WHATSAPP FAB ============ */
function WhatsAppFAB() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 3000); return () => clearTimeout(t); }, []);
  if (!show) return null;
  return (
    <a href={`https://wa.me/${YORAM_CONFIG.whatsappNumber}?text=${encodeURIComponent("שלום, אשמח לבדיקת תיק ביטוח חינם")}`} target="_blank" rel="noopener noreferrer"
      className="animate-fade-in" style={{ position:"fixed", bottom:24, left:24, zIndex:50, width:60, height:60, borderRadius:"50%", background:"#25D366", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(37,211,102,0.4)", transition:"transform 0.3s, box-shadow 0.3s" }}
      onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.1)";e.currentTarget.style.boxShadow="0 6px 30px rgba(37,211,102,0.6)"}}
      onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 20px rgba(37,211,102,0.4)"}}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
  );
}

/* ============ HELPER ============ */
const iconMap: Record<string, () => JSX.Element> = { shield: ShieldIcon, chart: ChartIcon, heart: HeartIcon };
function smoothScroll(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }
function trackEvent(action: string, label?: string) { if (typeof window !== "undefined" && (window as any).gtag) { (window as any).gtag("event", action, { event_category: "landing", event_label: label }); } }
function isValidIsraeliPhone(p: string): boolean { const d = p.replace(/[\s\-()]/g, ""); return /^(\+972|972|0)[2-9]\d{7,8}$/.test(d); }

/* ============ MAIN COMPONENT ============ */

export default function YoramLandingPage() {
  const C = YORAM_CONFIG;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const heroReveal = useScrollReveal(0.1);
  const stepsReveal = useScrollReveal(0.1);
  const diffReveal = useScrollReveal(0.1);
  const statsReveal = useScrollReveal(0.1);
  const credReveal = useScrollReveal(0.1);
  const ctaReveal = useScrollReveal(0.1);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.name.trim()) { setError("\u05D0\u05E0\u05D0 \u05D4\u05D6\u05D9\u05E0\u05D5 \u05E9\u05DD"); return; }
    if (!isValidIsraeliPhone(formData.phone)) { setError("\u05DE\u05E1\u05E4\u05E8 \u05D8\u05DC\u05E4\u05D5\u05DF \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF"); return; }
    setSending(true);
    trackEvent("form_submit", "hero_form");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, phone: formData.phone, source: "yoram-landing", business: "yoram-friedman" }),
      });
      if (!res.ok) throw new Error("fail");
      setSent(true);
      trackEvent("form_success", "hero_form");
      setTimeout(() => {
        window.open(`https://wa.me/${C.whatsappNumber}?text=${encodeURIComponent(`\u05E9\u05DC\u05D5\u05DD, \u05D0\u05E0\u05D9 ${formData.name}. \u05D0\u05E9\u05DE\u05D7 \u05DC\u05D1\u05D3\u05D9\u05E7\u05EA \u05EA\u05D9\u05E7 \u05D1\u05D9\u05D8\u05D5\u05D7 \u05D7\u05D9\u05E0\u05DD. \u05D8\u05DC\u05E4\u05D5\u05DF: ${formData.phone}`)}`, "_blank");
      }, 1500);
    } catch { setError("\u05E9\u05D2\u05D9\u05D0\u05D4, \u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1"); }
    setSending(false);
  }, [formData, C.whatsappNumber]);

  return (
    <div dir="rtl" lang="he" style={{ minHeight:"100vh", background:"#0a1628", color:"white", fontFamily:"system-ui,-apple-system,sans-serif" }}>

      {/* ===== NAVBAR ===== */}
      <nav style={{ position:"fixed", top:0, right:0, left:0, zIndex:40, transition:"all 0.4s ease", background: scrolled ? "rgba(10,22,40,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", WebkitBackdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(59,143,212,0.15)" : "none", boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <img src="/yf-logo.svg" alt="YF Logo" width={44} height={44} style={{ borderRadius: 8 }} />
            <span style={{ fontSize:18, fontWeight:700, background:"linear-gradient(135deg,#fff,#b8dcf5)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{C.businessName}</span>
          </div>
          {/* Desktop nav */}
          <div style={{ display:"flex", alignItems:"center", gap:28 }} className="hidden md:flex">
            {[{l:"\u05D0\u05D9\u05DA \u05D6\u05D4 \u05E2\u05D5\u05D1\u05D3",id:"steps"},{l:"\u05DC\u05DE\u05D4 \u05D0\u05E0\u05D7\u05E0\u05D5",id:"diff"},{l:"\u05E0\u05D9\u05E1\u05D9\u05D5\u05DF",id:"cred"}].map(n=>(
              <button key={n.id} onClick={()=>smoothScroll(n.id)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:15, fontWeight:500, transition:"color 0.3s", padding:"4px 0", position:"relative" }}
                onMouseEnter={e=>{e.currentTarget.style.color="#3b8fd4"}} onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.7)"}}>{n.l}</button>
            ))}
            <a href={`tel:${C.phone}`} onClick={()=>trackEvent("click_phone","nav")} style={{ display:"flex", alignItems:"center", gap:8, background:"linear-gradient(135deg,#3b8fd4,#1a2b5e)", color:"white", padding:"10px 20px", borderRadius:50, fontSize:14, fontWeight:600, textDecoration:"none", transition:"all 0.3s", boxShadow:"0 4px 15px rgba(59,143,212,0.3)" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 25px rgba(59,143,212,0.5)"}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 15px rgba(59,143,212,0.3)"}}>
              <PhoneIcon/>{C.phone}
            </a>
          </div>
          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={()=>setMenuOpen(!menuOpen)} style={{ background:"none", border:"none", color:"white", padding:8, cursor:"pointer" }} aria-label="menu">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={menuOpen?"M6 6l12 12M6 18L18 6":"M4 6h16M4 12h16M4 18h16"}/></svg>
          </button>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden" style={{ background:"rgba(10,22,40,0.98)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(59,143,212,0.15)", padding:20 }}>
            {[{l:"\u05D0\u05D9\u05DA \u05D6\u05D4 \u05E2\u05D5\u05D1\u05D3",id:"steps"},{l:"\u05DC\u05DE\u05D4 \u05D0\u05E0\u05D7\u05E0\u05D5",id:"diff"},{l:"\u05E0\u05D9\u05E1\u05D9\u05D5\u05DF",id:"cred"}].map(n=>(
              <button key={n.id} onClick={()=>{smoothScroll(n.id);setMenuOpen(false)}} style={{ display:"block", width:"100%", textAlign:"right", background:"none", border:"none", color:"rgba(255,255,255,0.8)", padding:"12px 0", fontSize:16, cursor:"pointer", borderBottom:"1px solid rgba(59,143,212,0.1)" }}>{n.l}</button>
            ))}
            <a href={`tel:${C.phone}`} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:"linear-gradient(135deg,#3b8fd4,#1a2b5e)", color:"white", padding:"12px", borderRadius:12, fontSize:15, fontWeight:600, textDecoration:"none", marginTop:12 }}>
              <PhoneIcon/>{C.phone}
            </a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section ref={heroReveal.ref} className={`relative min-h-screen flex items-center justify-center overflow-hidden pt-20 ${heroReveal.isVisible ? 'animate-fadeIn' : 'animate-fadeIn'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#12244a] to-[#1a2b5e]" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#3b8fd4] rounded-full opacity-10 blur-3xl animate-[orbFloat_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#1a2b5e] rounded-full opacity-15 blur-3xl animate-[orbFloat_12s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#3b8fd4] to-[#1a2b5e] rounded-full opacity-5 blur-3xl" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-right">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
              <span className="gradient-text-hero">{YORAM_CONFIG.heroHeadline}</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-200/80 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 lg:mr-0">{YORAM_CONFIG.heroSubheadline}</p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-end mb-8">
              {YORAM_CONFIG.stats.map((s, i) => (
                <div key={i} className="glass px-5 py-3 rounded-xl text-center min-w-[100px]">
                  <div className="text-2xl font-bold gradient-text">{s.value}</div>
                  <div className="text-xs text-blue-300/70 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#3b8fd4] to-[#1a2b5e] rounded-2xl blur opacity-30 animate-[pulseGlow_3s_ease-in-out_infinite]" />
            <div className="glass-card relative rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white text-center mb-2">{YORAM_CONFIG.formTitle}</h2>
              <p className="text-blue-300/70 text-center text-sm mb-6">{YORAM_CONFIG.formSubtitle}</p>
              {sent ? (
                <div className="text-center py-8 animate-fadeIn">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon />
                  </div>
                  <p className="text-xl font-bold text-white mb-2">{YORAM_CONFIG.successTitle}</p>
                  <p className="text-blue-300/70">{YORAM_CONFIG.successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input type="text" placeholder={YORAM_CONFIG.formNamePlaceholder} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:border-[#3b8fd4] focus:ring-1 focus:ring-[#3b8fd4] transition-all" required />
                  </div>
                  <div>
                    <input type="tel" placeholder={YORAM_CONFIG.formPhonePlaceholder} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/40 focus:outline-none focus:border-[#3b8fd4] focus:ring-1 focus:ring-[#3b8fd4] transition-all" required />
                  </div>
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                  <button type="submit" disabled={sending} className="btn-gradient w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {sending ? YORAM_CONFIG.formSending : YORAM_CONFIG.ctaText}
                  </button>
                  <p className="text-blue-400/40 text-xs text-center mt-2">{YORAM_CONFIG.formDisclaimer}</p>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a1628] to-transparent" />
      </section>

      {/* Steps */}
      <section id="steps" ref={stepsReveal.ref} className={`py-24 relative ${stepsReveal.isVisible ? 'animate-fadeIn' : 'animate-fadeIn'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
            <span className="gradient-text">{YORAM_CONFIG.stepsTitle}</span>
          </h2>
          <p className="text-blue-300/60 text-center mb-16 max-w-2xl mx-auto">{YORAM_CONFIG.stepsSubtitle}</p>
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#3b8fd4]/30 to-transparent -translate-y-1/2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {YORAM_CONFIG.steps.map((step, i) => (
                <div key={i} className="card-hover relative flex flex-col items-center text-center p-6 rounded-2xl glass" style={{animationDelay: `${i * 150}ms`}}>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3b8fd4] to-[#1a2b5e] flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-blue-500/20">
                    {i + 1}
                  </div>
                  <h3 className="text-white font-bold mb-2">{step.title}</h3>
                  <p className="text-blue-300/60 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section id="why" ref={diffReveal.ref} className={`py-24 relative ${diffReveal.isVisible ? 'animate-fadeIn' : 'animate-fadeIn'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
            <span className="gradient-text">{YORAM_CONFIG.diffTitle}</span>
          </h2>
          <p className="text-blue-300/60 text-center mb-16 max-w-2xl mx-auto">{YORAM_CONFIG.diffSubtitle}</p>
          <div className="grid md:grid-cols-3 gap-8">
            {YORAM_CONFIG.differentiators.map((d, i) => {
              const Icon = iconMap[d.icon] || ShieldIcon;
              return (
                <div key={i} className="card-hover glass-card rounded-2xl p-8 text-center group" style={{animationDelay: `${i * 200}ms`}}>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3b8fd4]/20 to-[#1a2b5e]/20 flex items-center justify-center mx-auto mb-6 group-hover:from-[#3b8fd4]/40 group-hover:to-[#1a2b5e]/40 transition-all duration-300">
                    <div className="text-[#3b8fd4]"><Icon /></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{d.title}</h3>
                  <p className="text-blue-300/60 leading-relaxed">{d.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsReveal.ref} className={`py-24 relative ${statsReveal.isVisible ? 'animate-fadeIn' : 'animate-fadeIn'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a2b5e]/50 to-[#0a1628]/50" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {YORAM_CONFIG.stats.map((s, i) => (
              <div key={i} className="text-center glass rounded-2xl p-8">
                <div className="text-4xl sm:text-5xl font-black gradient-text mb-2">{s.value}</div>
                <div className="text-blue-300/60 text-sm">{s.label}</div>
              </div>
            ))}
            <div className="text-center glass rounded-2xl p-8">
              <div className="text-4xl sm:text-5xl font-black gradient-text mb-2">24/7</div>
              <div className="text-blue-300/60 text-sm">זמינות מלאה</div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section id="credentials" ref={credReveal.ref} className={`py-24 relative ${credReveal.isVisible ? 'animate-fadeIn' : 'animate-fadeIn'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
            <span className="gradient-text">{YORAM_CONFIG.credentialsTitle}</span>
          </h2>
          <p className="text-blue-300/60 text-center mb-16 max-w-2xl mx-auto">{YORAM_CONFIG.credentialsSubtitle}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {YORAM_CONFIG.credentials.map((c, i) => (
              <div key={i} className="card-hover glass rounded-2xl p-6 text-center" style={{animationDelay: `${i * 100}ms`}}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3b8fd4]/20 to-[#1a2b5e]/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon />
                </div>
                <h3 className="text-white font-bold mb-1">{c.title}</h3>
                <p className="text-blue-300/50 text-sm">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaReveal.ref} className={`py-24 relative overflow-hidden ${ctaReveal.isVisible ? 'animate-fadeIn' : 'animate-fadeIn'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2b5e] via-[#3b8fd4]/20 to-[#0a1628]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#3b8fd4] rounded-full opacity-10 blur-3xl animate-[orbFloat_10s_ease-in-out_infinite]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-6">
            <span className="gradient-text-hero">{YORAM_CONFIG.ctaTitle}</span>
          </h2>
          <p className="text-blue-200/70 text-lg mb-8 max-w-xl mx-auto">{YORAM_CONFIG.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => smoothScroll('hero')} className="btn-gradient px-8 py-4 rounded-xl text-white font-bold text-lg">
              {YORAM_CONFIG.ctaText}
            </button>
            <a href={`tel:${YORAM_CONFIG.phone}`} className="glass px-8 py-4 rounded-xl text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <PhoneIcon /> {YORAM_CONFIG.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/yf-logo.svg" alt="YF Logo" width={40} height={40} style={{ borderRadius: 8 }} />
              <span className="text-white font-bold">{YORAM_CONFIG.businessName}</span>
            </div>
            <div className="flex items-center gap-6 text-blue-300/50 text-sm">
              <a href={`tel:${YORAM_CONFIG.phone}`} className="hover:text-[#3b8fd4] transition-colors">{YORAM_CONFIG.phone}</a>
              <span>© {new Date().getFullYear()} {YORAM_CONFIG.businessName}</span>
            </div>
          </div>
        </div>
      </footer>

      <WhatsAppFAB />
    </div>
  );
}
