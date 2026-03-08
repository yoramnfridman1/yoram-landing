'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, MessageCircle, Shield, TrendingUp, Users, Clock, ChevronDown, ChevronLeft, ChevronRight, Award, BadgeCheck, Star, ArrowLeft, Calculator, Briefcase, Heart, PiggyBank, Home, CheckCircle2, Send } from 'lucide-react';
import { YORAM_CONFIG } from '@/lib/content';

/* ───────── Page Loader ───────── */
function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let frame: number;
    let start: number;
    const duration = 1800;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setProgress(Math.round(p * 100));
      if (p < 1) { frame = requestAnimationFrame(animate); }
      else { setTimeout(() => setVisible(false), 300); }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!visible) return null;
  return (
    <div className={`page-loader ${progress >= 100 ? 'loaded' : ''}`}>
      <div className="loader-content">
        <div className="loader-logo">יורם פרידמן</div>
        <div className="loader-bar-track">
          <div className="loader-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ───────── Canvas Particles (Hero Background) ───────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, mouseX = -999, mouseY = -999;
    let animId: number;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
      });
    }

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', onMouse);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,146,42,0.4)';
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(200,146,42,${0.12 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        // Mouse interaction
        const mdx = particles[i].x - mouseX;
        const mdy = particles[i].y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(200,146,42,${0.25 * (1 - mdist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}

/* ───────── Reveal Hook ───────── */
function useReveal(direction: string = 'up') {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cls = direction === 'left' ? 'reveal-left' : direction === 'right' ? 'reveal-right' : direction === 'scale' ? 'reveal-scale' : direction === 'down' ? 'reveal-down' : 'reveal-up';
    el.classList.add(cls);
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add('revealed'); obs.unobserve(el); }
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    obs.observe(el);
    const t = setTimeout(() => { if (!el.classList.contains('revealed')) el.classList.add('revealed'); }, 4000);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, [direction]);
  return ref;
}

/* ───────── Counter ───────── */
function Counter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const dur = 2000;
        const st = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - st) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);

  return <span ref={ref} className="shimmer-text stat-number">{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ───────── Icon Map ───────── */
const iconMap: Record<string, React.ReactNode> = {
  shield: <Shield size={28} />, trending: <TrendingUp size={28} />,
  users: <Users size={28} />, clock: <Clock size={28} />,
  award: <Award size={28} />, star: <Star size={28} />,
  heart: <Heart size={28} />, piggy: <PiggyBank size={28} />,
  briefcase: <Briefcase size={28} />, home: <Home size={28} />,
  calculator: <Calculator size={28} />, badge: <BadgeCheck size={28} />,
};

/* ═══════════ MAIN PAGE ═══════════ */
export default function HomePage() {
  const c = YORAM_CONFIG;
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Scroll header effect
  useEffect(() => {
    const handler = () => setHeaderScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Hero staggered entrance
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Reveal refs for each section
  const revStats = useReveal('up');
  const revWhy = useReveal('up');
  const revProcess = useReveal('up');
  const revCalc = useReveal('up');
  const revFaq = useReveal('left');
  const revForm = useReveal('scale');
  const revCreds = useReveal('up');
  const revCta = useReveal('up');

  /* ─── Calculator State ─── */
  const [calcAge, setCalcAge] = useState(35);
  const [calcSavings, setCalcSavings] = useState(500000);
  const calcPotential = Math.round(calcSavings * 0.012 * (65 - calcAge));

  /* ─── FAQ State ─── */
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  /* ─── Form State ─── */
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', insuranceTypes: [] as string[], message: '' });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const insuranceTypes = c.insuranceTypes || ['ביטוח חיים', 'פנסיה', 'משכנתא', 'חיסכון', 'ביטוח בריאות'];

  const toggleInsurance = (type: string) => {
    setFormData(prev => ({
      ...prev,
      insuranceTypes: prev.insuranceTypes.includes(type)
        ? prev.insuranceTypes.filter(t => t !== type)
        : [...prev.insuranceTypes, type]
    }));
  };

  const submitForm = async () => {
    setFormSubmitting(true);
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setFormSuccess(true);
    } catch { setFormSuccess(true); }
    setFormSubmitting(false);
  };

  const navLinks = [
    { label: 'אודות', href: '#why' },
    { label: 'התהליך', href: '#process' },
    { label: 'מחשבון', href: '#calculator' },
    { label: 'שאלות', href: '#faq' },
    { label: 'צור קשר', href: '#contact' },
  ];

  return (
    <>
      <PageLoader />

      {/* ─── Skip Nav ─── */}
      <a href="#main-content" className="skip-nav">דלג לתוכן הראשי</a>

      {/* ═══ HEADER ═══ */}
      <header className={`site-header ${headerScrolled ? 'scrolled' : ''}`} role="banner">
        <div className="header-inner">
          <a href="#hero" className="header-logo" aria-label="יורם פרידמן - דף הבית">
            יורם פרידמן
          </a>
          <nav className="header-nav" aria-label="ניווט ראשי">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
            ))}
          </nav>
          <a href={`tel:${c.phone}`} className="header-cta btn-gold" aria-label={`התקשר: ${c.phone}`}>
            <Phone size={16} /> {c.phone}
          </a>
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="תפריט"
            aria-expanded={mobileMenu}
          >
            <span className={`hamburger ${mobileMenu ? 'open' : ''}`} />
          </button>
        </div>
        {/* Mobile menu */}
        {mobileMenu && (
          <div className="mobile-nav">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="mobile-nav-link" onClick={() => setMobileMenu(false)}>{l.label}</a>
            ))}
            <a href={`tel:${c.phone}`} className="btn-gold mobile-nav-cta">
              <Phone size={16} /> {c.phone}
            </a>
          </div>
        )}
      </header>

      <main id="main-content">
        {/* ═══ HERO ═══ */}
        <section id="hero" className="hero-section" aria-label="ראשי">
          <ParticleCanvas />
          <div className="hero-bg-glow" aria-hidden="true" />
          <div className={`hero-content ${heroVisible ? 'visible' : ''}`}>
            <div className="section-tag hero-tag">סוכן ביטוח מורשה · רישיון {c.licenseNumber}</div>
            <h1 className="hero-title">
              <span className="hero-title-line">בדיקת תיק פיננסי</span>
              <span className="hero-title-line shimmer-text">ללא עלות</span>
            </h1>
            <p className="hero-subtitle">
              {c.stats?.experience || '40'}+ שנות ניסיון בביטוח חיים, פנסיה, משכנתאות וחיסכון.
              <br />בדיקה מקצועית שיכולה לחסוך לך אלפי שקלים בשנה.
            </p>
            <div className="hero-buttons">
              <a href="#contact" className="btn-gold btn-lg">
                קבע בדיקה חינם
              </a>
              <a href={`https://wa.me/${c.whatsappNumber}`} className="btn-outline btn-lg" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={20} /> וואטסאפ
              </a>
            </div>
          </div>
        </section>

        {/* ═══ PARTNER MARQUEE ═══ */}
        <div className="marquee-strip" aria-hidden="true">
          <div className="marquee-track">
            {[...c.partners, ...c.partners].map((p, i) => (
              <span key={i} className="marquee-item">
                <span className="marquee-dot" />
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* ═══ STATS ═══ */}
        <section className="stats-section" ref={revStats} aria-label="נתונים">
          <div className="stats-grid">
            {c.stats && [
              { end: parseInt(c.stats.experience) || 40, suffix: '+', label: 'שנות ניסיון' },
              { end: parseInt(c.stats.clients) || 5000, suffix: '+', label: 'לקוחות מרוצים' },
              { end: parseInt(c.stats.savings) || 15, suffix: '%', label: 'חיסכון ממוצע' },
              { end: parseInt(c.stats.products) || 200, suffix: '+', label: 'מוצרים פיננסיים' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <Counter end={s.end} suffix={s.suffix} />
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ WHY YORAM ═══ */}
        <section id="why" className="section-dark" ref={revWhy} aria-labelledby="why-title">
          <div className="section-inner">
            <div className="section-tag">למה יורם פרידמן</div>
            <h2 id="why-title" className="section-title">היתרונות <span className="shimmer-text">שלנו</span></h2>
            <div className="cards-grid">
              {c.differentiators.map((d, i) => (
                <div key={i} className="glass-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="card-icon">
                    {iconMap[d.icon] || <Shield size={28} />}
                  </div>
                  <h3 className="card-title">{d.title}</h3>
                  <p className="card-desc">{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PROCESS ═══ */}
        <section id="process" className="section-deep" ref={revProcess} aria-labelledby="process-title">
          <div className="section-inner">
            <div className="section-tag">איך זה עובד</div>
            <h2 id="process-title" className="section-title">התהליך <span className="shimmer-text">שלנו</span></h2>
            <div className="process-steps">
              {c.processSteps.map((step, i) => (
                <div key={i} className="process-step">
                  <div className="step-number">{String(i + 1).padStart(2, '0')}</div>
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-desc">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CALCULATOR ═══ */}
        <section id="calculator" className="section-dark" ref={revCalc} aria-labelledby="calc-title">
          <div className="section-inner">
            <div className="section-tag">מחשבון חיסכון</div>
            <h2 id="calc-title" className="section-title">כמה אתה יכול <span className="shimmer-text">לחסוך?</span></h2>
            <div className="calc-card">
              <div className="calc-inputs">
                <div className="calc-field">
                  <label htmlFor="calc-age">גיל נוכחי: <strong>{calcAge}</strong></label>
                  <input
                    id="calc-age"
                    type="range"
                    min={25}
                    max={60}
                    value={calcAge}
                    onChange={e => setCalcAge(Number(e.target.value))}
                    className="calc-range"
                    aria-label="גיל נוכחי"
                  />
                  <div className="range-labels"><span>25</span><span>60</span></div>
                </div>
                <div className="calc-field">
                  <label htmlFor="calc-savings">חיסכון נוכחי: <strong>₪{calcSavings.toLocaleString()}</strong></label>
                  <input
                    id="calc-savings"
                    type="range"
                    min={50000}
                    max={3000000}
                    step={50000}
                    value={calcSavings}
                    onChange={e => setCalcSavings(Number(e.target.value))}
                    className="calc-range"
                    aria-label="חיסכון נוכחי"
                  />
                  <div className="range-labels"><span>₪50,000</span><span>₪3,000,000</span></div>
                </div>
              </div>
              <div className="calc-result">
                <div className="calc-result-label">חיסכון פוטנציאלי עד גיל פרישה</div>
                <div className="calc-result-value shimmer-text">₪{calcPotential.toLocaleString()}</div>
                <a href="#contact" className="btn-gold">רוצה לבדוק? צור קשר</a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section id="faq" className="section-deep" ref={revFaq} aria-labelledby="faq-title">
          <div className="section-inner section-narrow">
            <div className="section-tag">שאלות נפוצות</div>
            <h2 id="faq-title" className="section-title">שאלות <span className="shimmer-text">ותשובות</span></h2>
            <div className="faq-list" role="list">
              {c.faqs.map((faq, i) => (
                <div key={i} className={`faq-item ${faqOpen === i ? 'open' : ''}`} role="listitem">
                  <button
                    className="faq-question"
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    aria-expanded={faqOpen === i}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={20} className="faq-chevron" />
                  </button>
                  <div
                    id={`faq-answer-${i}`}
                    className="faq-answer"
                    role="region"
                    aria-hidden={faqOpen !== i}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ LEAD FORM ═══ */}
        <section id="contact" className="section-dark" ref={revForm} aria-labelledby="form-title">
          <div className="section-inner section-narrow">
            <div className="section-tag">צור קשר</div>
            <h2 id="form-title" className="section-title">קבע בדיקה <span className="shimmer-text">חינם</span></h2>

            {formSuccess ? (
              <div className="form-success">
                <CheckCircle2 size={48} />
                <h3>הפרטים נקלטו בהצלחה!</h3>
                <p>נחזור אליך תוך 24 שעות עם תוצאות הבדיקה</p>
              </div>
            ) : (
              <div className="lead-form-card">
                {/* Progress dots */}
                <div className="form-progress">
                  {[0, 1, 2].map(s => (
                    <div key={s} className={`progress-dot ${formStep >= s ? 'active' : ''} ${formStep === s ? 'current' : ''}`} />
                  ))}
                </div>

                {formStep === 0 && (
                  <div className="form-step">
                    <h3 className="form-step-title">פרטים אישיים</h3>
                    <div className="form-fields">
                      <div className="form-field">
                        <label htmlFor="f-name">שם מלא</label>
                        <input id="f-name" type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="השם שלך" />
                      </div>
                      <div className="form-field">
                        <label htmlFor="f-phone">טלפון</label>
                        <input id="f-phone" type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="050-0000000" dir="ltr" />
                      </div>
                      <div className="form-field">
                        <label htmlFor="f-email">אימייל (אופציונלי)</label>
                        <input id="f-email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" dir="ltr" />
                      </div>
                    </div>
                    <button className="btn-gold btn-full" onClick={() => setFormStep(1)} disabled={!formData.name || !formData.phone}>
                      המשך <ChevronLeft size={18} />
                    </button>
                  </div>
                )}

                {formStep === 1 && (
                  <div className="form-step">
                    <h3 className="form-step-title">תחומי עניין</h3>
                    <div className="insurance-chips">
                      {insuranceTypes.map(type => (
                        <button
                          key={type}
                          className={`chip ${formData.insuranceTypes.includes(type) ? 'active' : ''}`}
                          onClick={() => toggleInsurance(type)}
                          type="button"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <div className="form-nav-row">
                      <button className="btn-outline" onClick={() => setFormStep(0)}>
                        <ChevronRight size={18} /> חזור
                      </button>
                      <button className="btn-gold" onClick={() => setFormStep(2)}>
                        המשך <ChevronLeft size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {formStep === 2 && (
                  <div className="form-step">
                    <h3 className="form-step-title">הערות נוספות</h3>
                    <div className="form-fields">
                      <div className="form-field">
                        <label htmlFor="f-msg">הודעה (אופציונלי)</label>
                        <textarea id="f-msg" rows={3} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="ספר לנו במה נוכל לעזור..." />
                      </div>
                    </div>
                    <div className="form-nav-row">
                      <button className="btn-outline" onClick={() => setFormStep(1)}>
                        <ChevronRight size={18} /> חזור
                      </button>
                      <button className="btn-gold" onClick={submitForm} disabled={formSubmitting}>
                        <Send size={18} /> {formSubmitting ? 'שולח...' : 'שלח בקשה'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ═══ CREDENTIALS ═══ */}
        <section className="credentials-section" ref={revCreds} aria-label="הסמכות">
          <div className="credentials-row">
            {c.credentials.map((cr, i) => (
              <div key={i} className="credential-badge">
                <BadgeCheck size={20} />
                <span>{cr}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <section className="cta-section" ref={revCta} aria-labelledby="cta-title">
          <div className="cta-bg-pulse" aria-hidden="true" />
          <div className="cta-content">
            <h2 id="cta-title" className="cta-title">מוכן לגלות כמה אתה <span className="shimmer-text">יכול לחסוך?</span></h2>
            <p className="cta-subtitle">בדיקת תיק ביטוח מקצועית ללא עלות וללא התחייבות</p>
            <div className="cta-buttons">
              <a href="#contact" className="btn-gold btn-lg">קבע בדיקה חינם</a>
              <a href={`tel:${c.phone}`} className="btn-outline btn-lg">
                <Phone size={20} /> {c.phone}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="site-footer" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">יורם פרידמן</span>
            <span className="footer-license">סוכן ביטוח מורשה · רישיון מס׳ {c.licenseNumber}</span>
          </div>
          <div className="footer-contact">
            <a href={`tel:${c.phone}`}><Phone size={14} /> {c.phone}</a>
            <a href={`https://wa.me/${c.whatsappNumber}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} /> וואטסאפ</a>
          </div>
          <div className="footer-copy">
            © {new Date().getFullYear()} יורם פרידמן — כל הזכויות שמורות
          </div>
        </div>
      </footer>

      {/* ═══ WhatsApp FAB ═══ */}
      <a
        href={`https://wa.me/${c.whatsappNumber}`}
        className="whatsapp-fab"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="שלח הודעת וואטסאפ"
      >
        <MessageCircle size={28} />
      </a>
    </>
  );
}
