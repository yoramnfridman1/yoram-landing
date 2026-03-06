"use client";
import * as React from "react";
import { YORAM_CONFIG } from "../lib/content";

/* ── Helpers ── */
function isValidIsraeliPhone(phone: string) {
  const cleaned = phone.replace(/[\s\-]/g, "");
  return /^(0[2-9]\d{7,8}|\+972[2-9]\d{7,8})$/.test(cleaned);
}

function smoothScroll(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function trackEvent(name: string, params?: Record<string, string>) {
  try {
    if (typeof window !== "undefined") {
      if ((window as any).gtag) (window as any).gtag("event", name, params);
      if ((window as any).fbq) (window as any).fbq("track", name, params);
    }
  } catch {}
}

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
function useAnimatedCounter(end: number, start: boolean, duration: number = 2000) {
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
/* ── SVG Icon Components ── */
function ShieldIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  );
}
function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}
const DIFF_ICONS: Record<string, () => React.JSX.Element> = { shield: ShieldIcon, chart: ChartIcon, heart: HeartIcon };

/* ── WhatsApp FAB ── */
function WhatsAppFAB() {
  return (
    <a href={`https://wa.me/${YORAM_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer"
      style={{ position:"fixed", bottom:"28px", left:"28px", zIndex:50, width:"64px", height:"64px", borderRadius:"50%", background:"#25D366", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(37,211,102,0.4)", transition:"transform 0.2s" }}
      onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.1)")} onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
}
/* ── Main Component ── */
export default function YoramLandingPage() {
  const [formData, setFormData] = React.useState({ name: "", phone: "" });
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [phoneError, setPhoneError] = React.useState("");

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");
    if (!formData.name.trim()) return;
    if (!isValidIsraeliPhone(formData.phone)) {
      setPhoneError("מספר טלפון לא תקין");
      return;
    }
    trackEvent("lead_submit", { name: formData.name });
    try {
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, phone: formData.phone, source: "hero_form" }),
      }).catch(() => {});
    } catch {}
    setSubmitted(true);
    const msg = `שלום, קוראים לי ${formData.name}. אשמח לבדיקת תיק ביטוח חינם. טלפון: ${formData.phone}`;
    window.open(`https://wa.me/${YORAM_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const stepsRef = useScrollReveal<HTMLElement>();
  const diffRef = useScrollReveal<HTMLElement>();
  const statsRef = useScrollReveal<HTMLElement>();
  const credRef = useScrollReveal<HTMLElement>();

  const stat0 = useAnimatedCounter(YORAM_CONFIG.stats[0].value, statsRef.isVisible);
  const stat1 = useAnimatedCounter(YORAM_CONFIG.stats[1].value, statsRef.isVisible);
  const stat2 = useAnimatedCounter(YORAM_CONFIG.stats[2].value, statsRef.isVisible);
  const statValues = [stat0, stat1, stat2];

  const navItems = [
    { label: "איך זה עובד?", id: "steps" },
    { label: "למה דרכנו?", id: "why" },
    { label: "ניסיון", id: "credentials" },
  ];
  return (
    <main className="min-h-screen" style={{ background: "#f8f9fa", direction: "rtl" }}>
      {/* ── Navbar ── */}
      <nav style={{ position:"fixed", top:0, right:0, left:0, zIndex:40, transition:"all 0.3s", background: scrolled ? "rgba(26,42,94,0.97)" : "transparent", backdropFilter: scrolled ? "blur(8px)" : "none", boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.15)" : "none" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"16px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ width:"44px", height:"44px", borderRadius:"10px", background:"linear-gradient(135deg,#1a2a5e,#2b6cb0)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, fontSize:"1.1rem" }}>YF</div>
            <span style={{ color:"white", fontWeight:700, fontSize:"1.1rem" }}>{YORAM_CONFIG.businessName}</span>
          </div>
          <div className="hidden md:flex" style={{ gap:"32px", alignItems:"center" }}>
            {navItems.map(n => (
              <a key={n.id} href={`#${n.id}`} onClick={(e) => { e.preventDefault(); smoothScroll(n.id); }} style={{ color:"rgba(255,255,255,0.85)", fontSize:"0.95rem", textDecoration:"none", transition:"color 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.color="#f97316"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.85)"}>{n.label}</a>
            ))}
            <a href={`tel:${YORAM_CONFIG.phone}`} style={{ background:"#f97316", color:"white", padding:"10px 24px", borderRadius:"8px", fontWeight:700, fontSize:"0.9rem", textDecoration:"none", display:"flex", alignItems:"center", gap:"8px" }}>
              <PhoneIcon />{YORAM_CONFIG.phone}
            </a>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ color:"white", background:"none", border:"none", fontSize:"1.5rem", cursor:"pointer" }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden" style={{ background:"rgba(26,42,94,0.98)", padding:"16px 24px", borderTop:"1px solid rgba(255,255,255,0.1)" }}>
            {navItems.map(n => (
              <a key={n.id} href={`#${n.id}`} onClick={(e) => { e.preventDefault(); smoothScroll(n.id); setMenuOpen(false); }} style={{ display:"block", padding:"12px 0", color:"rgba(255,255,255,0.85)", textDecoration:"none", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>{n.label}</a>
            ))}
            <a href={`tel:${YORAM_CONFIG.phone}`} style={{ display:"block", marginTop:"12px", background:"#f97316", color:"white", padding:"12px", borderRadius:"8px", fontWeight:700, textAlign:"center", textDecoration:"none" }}>{YORAM_CONFIG.phone}</a>
          </div>
        )}
      </nav>
      {/* ── Hero ── */}
      <section style={{ position:"relative", minHeight:"100vh", background:"linear-gradient(135deg,#1a2a5e 0%,#1e3a6e 50%,#2b6cb0 100%)", display:"flex", alignItems:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, opacity:0.06 }}>
          <div style={{ position:"absolute", top:"-10%", right:"-10%", width:"600px", height:"600px", borderRadius:"50%", background:"radial-gradient(circle,#2b6cb0,transparent 70%)" }}/>
          <div style={{ position:"absolute", bottom:"-20%", left:"-10%", width:"800px", height:"800px", borderRadius:"50%", background:"radial-gradient(circle,#1a2a5e,transparent 70%)" }}/>
        </div>
        <div style={{ position:"relative", zIndex:1, maxWidth:"1200px", margin:"0 auto", padding:"140px 24px 80px", display:"grid", gridTemplateColumns:"1fr", gap:"48px", width:"100%" }} className="md:!grid-cols-2">
          <div style={{ display:"flex", flexDirection:"column", justifyContent:"center" }}>
            <h1 style={{ fontFamily:"Georgia, serif", fontSize:"clamp(2rem,5vw,3.2rem)", fontWeight:700, color:"white", lineHeight:1.2, marginBottom:"24px" }}>
              {YORAM_CONFIG.heroHeadline.split("60%").map((part, i, arr) => i < arr.length - 1 ? <React.Fragment key={i}>{part}<span style={{ color:"#f97316" }}>60%</span></React.Fragment> : part)}
            </h1>
            <p style={{ fontSize:"1.2rem", color:"rgba(255,255,255,0.8)", marginBottom:"32px", maxWidth:"500px" }}>{YORAM_CONFIG.heroSubheadline}</p>
            <div style={{ display:"flex", gap:"16px", flexWrap:"wrap" }}>
              <a href={`https://wa.me/${YORAM_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("hero_whatsapp_click")}
                style={{ background:"#25D366", color:"white", padding:"16px 32px", borderRadius:"12px", fontWeight:700, fontSize:"1.1rem", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"10px", transition:"transform 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a href={`tel:${YORAM_CONFIG.phone}`} onClick={() => trackEvent("hero_phone_click")}
                style={{ border:"2px solid rgba(255,255,255,0.3)", color:"white", padding:"16px 32px", borderRadius:"12px", fontWeight:700, fontSize:"1.1rem", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"10px", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="white";e.currentTarget.style.transform="translateY(-2px)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.3)";e.currentTarget.style.transform="translateY(0)"}}>
                <PhoneIcon />{YORAM_CONFIG.phone}
              </a>
            </div>
          </div>
          {/* Form Card */}
          <div className="hidden md:flex" style={{ justifyContent:"center", alignItems:"center" }}>
            <div style={{ background:"white", borderRadius:"20px", padding:"40px", boxShadow:"0 25px 60px rgba(0,0,0,0.2)", maxWidth:"420px", width:"100%" }}>
              {submitted ? (
                <div style={{ textAlign:"center", padding:"20px 0" }}>
                  <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:"#22c55e", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 style={{ fontSize:"1.5rem", fontWeight:700, color:"#1a2a5e", marginBottom:"8px" }}>תודה!</h3>
                  <p style={{ color:"#666", marginBottom:"20px" }}>נחזור אליך תוך 24 שעות</p>
                  <a href={`https://wa.me/${YORAM_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer"
                    style={{ display:"inline-flex", alignItems:"center", gap:"8px", color:"#25D366", fontWeight:700, textDecoration:"none" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    או דברו איתנו ישירות בוואטסאפ
                  </a>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize:"1.4rem", fontWeight:700, color:"#1a2a5e", marginBottom:"4px" }}>{YORAM_CONFIG.ctaText}</h3>
                  <p style={{ color:"#888", fontSize:"0.9rem", marginBottom:"24px" }}>ללא התחייבות • 100% חינם</p>
                  <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="שם מלא" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required
                      style={{ width:"100%", padding:"14px 16px", borderRadius:"10px", border:"2px solid #e5e7eb", fontSize:"1rem", marginBottom:"12px", outline:"none", transition:"border-color 0.2s" }}
                      onFocus={e=>e.currentTarget.style.borderColor="#2b6cb0"} onBlur={e=>e.currentTarget.style.borderColor="#e5e7eb"} />
                    <div>
                      <input type="tel" placeholder="טלפון" value={formData.phone} onChange={e => { setFormData({ ...formData, phone: e.target.value }); setPhoneError(""); }} required
                        style={{ width:"100%", padding:"14px 16px", borderRadius:"10px", border:`2px solid ${phoneError ? "#ef4444" : "#e5e7eb"}`, fontSize:"1rem", outline:"none", transition:"border-color 0.2s" }}
                        onFocus={e=>e.currentTarget.style.borderColor=phoneError?"#ef4444":"#2b6cb0"} onBlur={e=>e.currentTarget.style.borderColor=phoneError?"#ef4444":"#e5e7eb"} />
                      {phoneError && <p style={{ color:"#ef4444", fontSize:"0.8rem", marginTop:"4px" }}>{phoneError}</p>}
                    </div>
                    <button type="submit"
                      style={{ width:"100%", marginTop:"12px", padding:"16px", borderRadius:"10px", background:"#f97316", color:"white", fontWeight:800, fontSize:"1.1rem", border:"none", cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}
                      onMouseEnter={e=>e.currentTarget.style.background="#ea580c"} onMouseLeave={e=>e.currentTarget.style.background="#f97316"}>
                      <CheckCircleIcon />{YORAM_CONFIG.ctaText}
                    </button>
                  </form>
                  <p style={{ textAlign:"center", marginTop:"16px", fontSize:"0.78rem", color:"#aaa" }}>🔒 המידע שלך מאובטח ולא יועבר לגורם שלישי</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* ── Steps ── */}
      <section id="steps" ref={stepsRef.ref} style={{ padding:"100px 24px", maxWidth:"1200px", margin:"0 auto", opacity: stepsRef.isVisible ? 1 : 0, transform: stepsRef.isVisible ? "translateY(0)" : "translateY(30px)", transition:"opacity 0.8s ease-out, transform 0.8s ease-out" }}>
        <h2 style={{ textAlign:"center", fontSize:"2rem", fontWeight:700, color:"#1a2a5e", marginBottom:"60px" }}>איך זה עובד?</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:"32px" }}>
          {YORAM_CONFIG.steps.map((s, i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:"linear-gradient(135deg,#1a2a5e,#2b6cb0)", color:"white", fontWeight:800, fontSize:"1.4rem", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", boxShadow:"0 4px 15px rgba(26,42,94,0.25)" }}>{i + 1}</div>
              <h3 style={{ fontWeight:700, color:"#1a2a5e", marginBottom:"6px" }}>{s.title}</h3>
              <p style={{ color:"#666", fontSize:"0.9rem" }}>{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Differentiators ── */}
      <section id="why" ref={diffRef.ref} style={{ padding:"80px 24px", background:"white", opacity: diffRef.isVisible ? 1 : 0, transform: diffRef.isVisible ? "translateY(0)" : "translateY(30px)", transition:"opacity 0.8s ease-out, transform 0.8s ease-out" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <h2 style={{ textAlign:"center", fontSize:"2rem", fontWeight:700, color:"#1a2a5e", marginBottom:"60px" }}>למה דרכנו?</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"32px" }}>
            {YORAM_CONFIG.differentiators.map((d, i) => {
              const Icon = DIFF_ICONS[d.icon] || ShieldIcon;
              return (
                <div key={i} style={{ background:"#f8f9fa", borderRadius:"16px", padding:"36px", textAlign:"center", transition:"transform 0.3s, box-shadow 0.3s", cursor:"default" }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 8px 30px rgba(0,0,0,0.08)"}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
                  <div style={{ display:"flex", justifyContent:"center", marginBottom:"16px" }}><Icon /></div>
                  <h3 style={{ fontWeight:700, color:"#1a2a5e", marginBottom:"8px", fontSize:"1.15rem" }}>{d.title}</h3>
                  <p style={{ color:"#666", fontSize:"0.92rem", lineHeight:1.7 }}>{d.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* ── Stats ── */}
      <section ref={statsRef.ref} style={{ padding:"80px 24px", background:"linear-gradient(135deg,#1a2a5e,#2b6cb0)", opacity: statsRef.isVisible ? 1 : 0, transform: statsRef.isVisible ? "translateY(0)" : "translateY(30px)", transition:"opacity 0.8s ease-out, transform 0.8s ease-out" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"32px", textAlign:"center" }}>
          {YORAM_CONFIG.stats.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize:"3rem", fontWeight:800, color:"#f97316" }}>
                {s.value.includes("%") ? statValues[i] + "%" : s.value.includes("+") ? "+" + statValues[i].toLocaleString() : statValues[i].toLocaleString()}
              </div>
              <div style={{ color:"rgba(255,255,255,0.8)", fontSize:"1rem", marginTop:"8px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Credentials ── */}
      <section id="credentials" ref={credRef.ref} style={{ padding:"100px 24px", maxWidth:"1200px", margin:"0 auto", opacity: credRef.isVisible ? 1 : 0, transform: credRef.isVisible ? "translateY(0)" : "translateY(30px)", transition:"opacity 0.8s ease-out, transform 0.8s ease-out" }}>
        <h2 style={{ textAlign:"center", fontSize:"2rem", fontWeight:700, color:"#1a2a5e", marginBottom:"60px" }}>ניסיון ואמינות</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:"24px" }}>
          {YORAM_CONFIG.credentials.map((c, i) => (
            <div key={i} style={{ background:"white", borderRadius:"16px", padding:"32px", textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.05)", border:"1px solid #eee", transition:"transform 0.3s" }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              <div style={{ fontSize:"2.5rem", marginBottom:"12px" }}>{c.icon}</div>
              <h3 style={{ fontWeight:700, color:"#1a2a5e", marginBottom:"6px" }}>{c.title}</h3>
              <p style={{ color:"#666", fontSize:"0.9rem" }}>{c.value}</p>
            </div>
          ))}
        </div>
      </section>
      {/* ── CTA Section ── */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a2a5e 0%, #2b6cb0 100%)" }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "Georgia, serif" }}>
            {YORAM_CONFIG.heroHeadline.split("60%")[0]}
            <span style={{ color: "#f97316" }}>60%</span>
            {YORAM_CONFIG.heroHeadline.split("60%")[1] || ""}
          </h2>
          <p className="text-lg text-blue-100 mb-8">{YORAM_CONFIG.heroSubheadline}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${YORAM_CONFIG.whatsapp}?text=${encodeURIComponent("שלום, אשמח לבדיקת תיק ביטוח חינם")}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("cta_whatsapp_click")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-bold text-white transition-transform hover:scale-105"
              style={{ background: "#25d366" }}
            >
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.913.913l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.37 0-4.567-.696-6.416-1.89l-.447-.287-3.174 1.064 1.064-3.174-.287-.447A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              WhatsApp
            </a>
            <a
              href={`tel:${YORAM_CONFIG.phone}`}
              onClick={() => trackEvent("cta_phone_click")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-bold border-2 border-white/30 text-white transition-all hover:bg-white/10"
            >
              <PhoneIcon />
              {YORAM_CONFIG.phone}
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t" style={{ background: "#0f172a", borderColor: "#1e3a5f" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #1a2a5e, #2b6cb0)" }}>YF</div>
                <span className="text-white font-bold text-lg">{YORAM_CONFIG.businessName}</span>
              </div>
              <p className="text-sm" style={{ color: "#94a3b8" }}>{YORAM_CONFIG.complianceFooter}</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">קישורים</h4>
              <div className="space-y-2">
                {navItems.map((n) => (
                  <a key={n.id} href={`#${n.id}`} onClick={(e) => { e.preventDefault(); smoothScroll(n.id); }} className="block text-sm transition-colors hover:text-white" style={{ color: "#94a3b8" }}>{n.label}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">צור קשר</h4>
              <div className="space-y-2 text-sm" style={{ color: "#94a3b8" }}>
                <a href={`tel:${YORAM_CONFIG.phone}`} className="block transition-colors hover:text-white">{YORAM_CONFIG.phone}</a>
                <a href={`https://wa.me/${YORAM_CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer" className="block transition-colors hover:text-white">WhatsApp</a>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t text-center text-xs" style={{ borderColor: "#1e3a5f", color: "#64748b" }}>
            © {new Date().getFullYear()} {YORAM_CONFIG.businessName}. כל הזכויות שמורות.
          </div>
        </div>
      </footer>

      <WhatsAppFAB />
    </main>
  );
}
