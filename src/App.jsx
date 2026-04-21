import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import './App.css'

const W3F_KEY = '1c6f1269-cc49-4b16-bae9-d7d8462d8e1a'

// ── Data ──────────────────────────────────────────────────────────────────────
const NAV_ITEMS  = ['about', 'services', 'projects', 'skills', 'process', 'contact']
const NAV_LABELS = { about: 'À propos', services: 'Services', projects: 'Projets', skills: 'Compétences', process: 'Méthode', contact: 'Contact' }

const ROLES = [
  'Développeur Web',
  'Créateur de Sites Vitrines',
  'Étudiant Supinfo 3A',
  'Disponible pour missions',
]

const STATUS_STEPS = [
  { at:  0, text: 'Initialisation...' },
  { at: 15, text: 'Chargement des modules...' },
  { at: 33, text: 'Compilation des projets...' },
  { at: 54, text: "Préparation de l'interface..." },
  { at: 72, text: 'Optimisation des ressources...' },
  { at: 89, text: 'Vérification finale...' },
  { at: 99, text: 'Portfolio prêt ✦' },
]

const MARQUEE_ITEMS = [
  'React', '◆', 'Node.js', '◆', 'TypeScript', '◆', 'Next.js', '◆',
  'PostgreSQL', '◆', 'Tailwind CSS', '◆', 'Figma', '◆', 'Docker', '◆',
  'REST API', '◆', 'Vercel', '◆', 'Git', '◆', 'MongoDB', '◆',
]

const SERVICES = [
  {
    id: 1, num: '01', icon: '◈', title: 'Site Vitrine',
    description: "Design élégant sur mesure pour artisans, restaurateurs et indépendants.",
    features: ['Design sur mesure', 'Responsive mobile', 'SEO optimisé', 'Formulaire de contact'],
  },
  {
    id: 2, num: '02', icon: '◉', title: 'Refonte de Site',
    description: "Modernisation complète — design actuel, performance optimisée, meilleure UX.",
    features: ["Audit de l'existant", 'Nouveau design', 'Migration du contenu', 'Optimisation performance'],
  },
]

const PROJECTS = [
  {
    id: 1, title: 'Biblly', year: '2024', link: 'https://biblly.vercel.app', placeholder: false,
    category: 'Bibliothèque sociale',
    role: 'Full-Stack',
    status: 'Livré',
    team: '4 pers.',
    description: "Réseau social autour de la lecture — suivez vos amis, partagez vos lectures et découvrez de nouveaux livres.",
    tags: ['React', 'Node.js', 'PostgreSQL'],
  },
  { id: 2, placeholder: true },
  { id: 3, placeholder: true },
]

const EXPERTISE = [
  {
    num: '01', title: 'Frontend',
    description: 'Interfaces modernes, responsives et accessibles.',
    items: ['React', 'Next.js', 'TypeScript', 'HTML / CSS', 'Tailwind CSS'],
  },
  {
    num: '02', title: 'Backend',
    description: 'APIs robustes et bases de données, du prototype à la production.',
    items: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'REST API'],
  },
  {
    num: '03', title: 'Design & UX',
    description: 'Du wireframe au pixel-perfect, centré sur l\'utilisateur.',
    items: ['Figma', 'Responsive Design', 'Animations CSS', 'Accessibilité'],
  },
  {
    num: '04', title: 'Outils & Deploy',
    description: 'Workflow moderne pour un déploiement rapide et serein.',
    items: ['Git', 'Docker', 'Vercel', 'VS Code', 'CI/CD'],
  },
]

const PROCESS = [
  { num: '01', title: 'Découverte', duration: '1–2 jours', desc: 'Écoute de vos besoins, objectifs et contraintes. On pose les bases du projet ensemble.' },
  { num: '02', title: 'Conception', duration: '3–5 jours', desc: 'Maquettes et prototypes. Le design est validé avant tout développement.' },
  { num: '03', title: 'Développement', duration: '1–4 semaines', desc: 'Intégration et développement des fonctionnalités. Tests continus à chaque étape.' },
  { num: '04', title: 'Livraison', duration: '1–2 jours', desc: 'Mise en ligne, tests finaux et prise en main de votre outil.' },
]

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useTypewriter(words, speed = 80, pause = 2200) {
  const [display, setDisplay] = useState('')
  const state = useRef({ wi: 0, del: false })
  useEffect(() => {
    const { wi, del } = state.current
    const cur = words[wi]
    if (!del && display === cur) {
      const t = setTimeout(() => { state.current.del = true; setDisplay(d => d.slice(0, -1)) }, pause)
      return () => clearTimeout(t)
    }
    if (del && display === '') {
      state.current.del = false
      state.current.wi = (wi + 1) % words.length
      return
    }
    const t = setTimeout(() => setDisplay(del ? display.slice(0, -1) : cur.slice(0, display.length + 1)), del ? speed / 2 : speed)
    return () => clearTimeout(t)
  }, [display, words, speed, pause])
  return display
}

function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => e.isIntersecting && e.target.classList.add('revealed')),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  })
}

function useScramble(text, active) {
  const [display, setDisplay] = useState(text)
  const frame = useRef(null)
  const CHARS = 'アイウエカキクケサシスタ!@#$%◈◉◆'
  useEffect(() => {
    if (!active) { setDisplay(text); return }
    let it = 0
    cancelAnimationFrame(frame.current)
    const tick = () => {
      setDisplay(text.split('').map((c, i) => {
        if (c === ' ') return ' '
        if (i < it) return c
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      }).join(''))
      if (it < text.length) { it += 0.4; frame.current = requestAnimationFrame(tick) }
      else setDisplay(text)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [active, text])
  return display
}

// ── Components ────────────────────────────────────────────────────────────────
function SplitText({ text, className, animate, delay = 0 }) {
  return (
    <span className={`split ${className || ''} ${animate ? 'split--in' : ''}`} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span key={i} className="split-ch" style={{ '--d': `${delay + i * 0.042}s` }} aria-hidden="true">
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  )
}

function StaggerWords({ text, animate, baseDelay = 0, className }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="sw-wrap">
          <span className={`sw ${animate ? 'sw--in' : ''}`} style={{ '--d': `${baseDelay + i * 0.06}s` }}>
            {w}
          </span>{' '}
        </span>
      ))}
    </span>
  )
}

function ParticleCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    let id, visible = true
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize, { passive: true })
    const obs = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
    obs.observe(canvas)
    class P {
      constructor() { this.x=Math.random()*canvas.width; this.y=Math.random()*canvas.height; this.vx=(Math.random()-.5)*.2; this.vy=(Math.random()-.5)*.2; this.r=Math.random()*1.1+.3 }
      tick() { this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>canvas.width)this.vx*=-1; if(this.y<0||this.y>canvas.height)this.vy*=-1 }
      draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle='rgba(74,140,110,0.18)'; ctx.fill() }
    }
    const pts = Array.from({ length: Math.min(Math.floor(canvas.width*canvas.height/22000), 32) }, () => new P())
    const DIST = 85
    const loop = () => {
      id = requestAnimationFrame(loop)
      if (!visible) return
      ctx.clearRect(0,0,canvas.width,canvas.height)
      for(let i=0;i<pts.length;i++){
        pts[i].tick(); pts[i].draw()
        for(let j=i+1;j<pts.length;j++){
          const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.hypot(dx,dy)
          if(d<DIST){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(74,140,110,${(1-d/DIST)*.08})`;ctx.lineWidth=.5;ctx.stroke()}
        }
      }
    }
    loop()
    return () => { cancelAnimationFrame(id); obs.disconnect(); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="particle-canvas" />
}

function ScrambleTitle({ text, tag: T = 'h3', className }) {
  const [hov, setHov] = useState(false)
  const disp = useScramble(text, hov)
  return <T className={className} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>{disp}</T>
}

function Grain() {
  return <div className="grain" aria-hidden="true" />
}

function Decor({ children }) {
  return <div className="s-decor" aria-hidden="true">{children}</div>
}

function StarField({ count = 30, dark = false }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.5,
      delay: +(Math.random() * 7).toFixed(2),
      dur:   +(Math.random() * 3 + 2).toFixed(2),
      sparkle: Math.random() > 0.6,
      warm: Math.random() > 0.45,
    })), [count]
  )
  return (
    <div className={`sf ${dark ? 'sf--dark' : ''}`} aria-hidden="true">
      {stars.map(s => (
        <span
          key={s.id}
          className={s.sparkle ? 'sf-sp' : 'sf-dot'}
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            '--sz': `${s.size}px`,
            '--dl': `${s.delay}s`,
            '--dr': `${s.dur}s`,
            '--c': s.warm
              ? (dark ? 'rgba(240,228,195,0.75)' : 'rgba(200,168,92,0.6)')
              : (dark ? 'rgba(180,230,200,0.55)' : 'rgba(74,140,110,0.5)'),
          }}
        />
      ))}
    </div>
  )
}

function Divider() {
  return <div className="sec-div" aria-hidden="true" />
}

function MagBtn({ children, className, onClick, type, href, download, disabled }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const mv = e => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left - r.width/2) * 0.22
      const y = (e.clientY - r.top - r.height/2) * 0.22
      el.style.transform = `translate(${x}px, ${y}px)`
    }
    const lv = () => { el.style.transform = '' }
    el.addEventListener('mousemove', mv); el.addEventListener('mouseleave', lv)
    return () => { el.removeEventListener('mousemove', mv); el.removeEventListener('mouseleave', lv) }
  }, [])
  if (href) return <a ref={ref} className={className} href={href} download={download}>{children}</a>
  return <button ref={ref} className={className} onClick={onClick} type={type} disabled={disabled}>{children}</button>
}

// ── Loading Screen ────────────────────────────────────────────────────────────
function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [status,   setStatus]   = useState('Initialisation...')
  const [nameIn,   setNameIn]   = useState(false)
  const [fadeOut,  setFadeOut]  = useState(false)
  const [exitAnim, setExitAnim] = useState(false)
  const [gone,     setGone]     = useState(false)

  useEffect(() => {
    const t0 = setTimeout(() => setNameIn(true), 200)
    const DURATION = 2400
    let startTs = null
    let rafId

    const tick = (ts) => {
      if (!startTs) startTs = ts
      const raw   = Math.min((ts - startTs) / DURATION, 1)
      const eased = 1 - Math.pow(1 - raw, 2.5)
      const p     = Math.round(eased * 100)
      setProgress(p)
      let txt = STATUS_STEPS[0].text
      for (const s of STATUS_STEPS) if (p >= s.at) txt = s.text
      setStatus(txt)
      if (raw < 1) rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    // Phase 1 : contenu fond
    const tFade   = setTimeout(() => setFadeOut(true),   2500)
    // Phase 2 : iris se FERME (0.6s → terminée à ~3350ms)
    const tExit   = setTimeout(() => setExitAnim(true),  2750)
    // Phase 3 : page iris s'OUVRE (350ms après le début de fermeture = croisement cinéma)
    const tReveal = setTimeout(() => onComplete(),        3100)
    // Phase 4 : loader retiré du DOM
    const tGone   = setTimeout(() => setGone(true),       4000)
    return () => {
      clearTimeout(t0); cancelAnimationFrame(rafId)
      clearTimeout(tFade); clearTimeout(tExit); clearTimeout(tReveal); clearTimeout(tGone)
    }
  }, [onComplete])

  if (gone) return null

  return (
    <div className={`loader ${exitAnim ? 'loader--exit' : ''}`}>
      <div className="ldr-glow ldr-glow--1" />
      <div className="ldr-glow ldr-glow--2" />
      <div className="ldr-orn ldr-orn--tl"><span /><span /></div>
      <div className="ldr-orn ldr-orn--tr"><span /><span /></div>
      <div className="ldr-orn ldr-orn--bl"><span /><span /></div>
      <div className="ldr-orn ldr-orn--br"><span /><span /></div>
      <span className="ldr-side-label ldr-side-label--l">ANDREA COUSTENOBLE</span>
      <span className="ldr-side-label ldr-side-label--r">PORTFOLIO 2025</span>

      <div className={`ldr-content ${fadeOut ? 'ldr-content--out' : ''}`}>
        <div className="ldr-rings">
          <svg className="ldr-svg ldr-svg--spin" viewBox="0 0 240 240">
            <circle cx="120" cy="120" r="112" fill="none" stroke="rgba(74,140,110,0.2)" strokeWidth="1" strokeDasharray="6 14" />
            <circle cx="120" cy="120" r="112" fill="none" stroke="rgba(200,168,92,0.08)" strokeWidth="0.5" strokeDasharray="2 30" />
          </svg>
          <svg className="ldr-svg ldr-svg--draw" viewBox="0 0 240 240">
            <circle cx="120" cy="120" r="96" fill="none" stroke="rgba(74,140,110,0.12)" strokeWidth="1" />
            <circle cx="120" cy="120" r="96" fill="none"
              stroke="rgba(200,168,92,0.75)" strokeWidth="1.2"
              strokeDasharray="603" strokeDashoffset="603"
              strokeLinecap="round" className="ldr-ring-draw" />
          </svg>
          <span className="ldr-diamond ldr-diamond--n" />
          <span className="ldr-diamond ldr-diamond--e" />
          <span className="ldr-diamond ldr-diamond--s" />
          <span className="ldr-diamond ldr-diamond--w" />
          <div className="ldr-ring-glow" />
          <div className="ldr-ac"><span>A</span><span>C</span></div>
        </div>

        <div className={`ldr-name ${nameIn ? 'ldr-name--in' : ''}`}>
          <div className="ldr-name-row ldr-name-row--first">
            {'Andrea'.split('').map((c, i) => (
              <span key={i} className="ldr-letter" style={{ '--i': i }}>{c}</span>
            ))}
          </div>
          <div className="ldr-name-row ldr-name-row--bold">
            {'Coustenoble'.split('').map((c, i) => (
              <span key={i} className="ldr-letter" style={{ '--i': i + 6 }}>{c}</span>
            ))}
          </div>
        </div>

        <div className="ldr-divider">
          <span className="ldr-div-line" /><span className="ldr-div-label">Développeur Web</span><span className="ldr-div-line" />
        </div>

        <div className="ldr-progress">
          <div className="ldr-bar">
            <div className="ldr-bar-fill" style={{ width: `${progress}%` }} />
            <div className="ldr-bar-dot" style={{ left: `${progress}%` }} />
          </div>
          <div className="ldr-progress-meta">
            <span className="ldr-status">{status}</span>
            <span className="ldr-pct">{String(progress).padStart(3,'0')}<small>%</small></span>
          </div>
        </div>
      </div>

      <p className="ldr-bottom">Supinfo · 3ème année · Disponible pour missions</p>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [loaded,       setLoaded]      = useState(false)
  const [scrollPct,    setScroll]      = useState(0)
  const [activeSection,setActive]      = useState('about')
  const [menuOpen,     setMenuOpen]    = useState(false)
  const [showTop,      setShowTop]     = useState(false)
  const [navScrolled,  setNavScrolled] = useState(false)
  const [formData,     setFormData]    = useState({ name: '', email: '', message: '' })
  const [formErrors,   setFormErrors]  = useState({})
  const [sent,         setSent]        = useState(false)
  const [sending,      setSending]     = useState(false)
  const [sendError,    setSendError]   = useState(false)
  const [settled,      setSettled]     = useState(false)
  const roleText = useTypewriter(ROLES)
  useScrollReveal()

  const handleLoaded = useCallback(() => setLoaded(true), [])

  useEffect(() => {
    if (!loaded) return
    const t = setTimeout(() => setSettled(true), 1400)
    return () => clearTimeout(t)
  }, [loaded])

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setScroll((scrolled / total) * 100)
      setShowTop(scrolled > 400)
      setNavScrolled(scrolled > 18)
      const y = scrolled + 130
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i])
        if (el && el.offsetTop <= y) { setActive(NAV_ITEMS[i]); break }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = id => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 68
    window.scrollTo({ top, behavior: 'smooth' })
    setMenuOpen(false)
  }

  const validateForm = () => {
    const e = {}
    if (!formData.name.trim() || formData.name.trim().length < 2)
      e.name = 'Merci d\'indiquer ton nom (min. 2 caractères)'
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email))
      e.email = 'Adresse email invalide'
    if (!formData.message.trim() || formData.message.trim().length < 10)
      e.message = 'Message trop court (min. 10 caractères)'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length) { setFormErrors(errors); return }
    setFormErrors({})
    setSending(true); setSendError(false)
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: W3F_KEY,
          subject:    'Nouveau message — Portfolio Andrea Coustenoble',
          name:       formData.name,
          email:      formData.email,
          message:    formData.message,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSent(true)
        setFormData({ name: '', email: '', message: '' })
        setTimeout(() => setSent(false), 6000)
      } else { throw new Error() }
    } catch {
      setSendError(true)
      setTimeout(() => setSendError(false), 5000)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {!loaded && <LoadingScreen onComplete={handleLoaded} />}
      <Grain />

      <div className={`app${loaded ? ' app--loaded' : ''}${settled ? ' app--settled' : ''}`}>

        <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />

        <button
          className={`back-top ${showTop ? 'back-top--visible' : ''}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Retour en haut"
        >↑</button>

        {/* ── NAV ── */}
        <nav className={`nav ${navScrolled ? 'nav--scrolled' : ''}`}>
          <div className="nav-inner">
            <span className="nav-logo" onClick={() => scrollTo('about')}>
              <span className="nav-logo-text">AC</span>
              <span className="nav-logo-dot" />
            </span>
            <ul className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
              {NAV_ITEMS.map(item => (
                <li key={item}>
                  <button className={activeSection === item ? 'active' : ''} onClick={() => scrollTo(item)}>
                    {NAV_LABELS[item]}
                  </button>
                </li>
              ))}
            </ul>
            <div className="nav-right">
              <MagBtn className="nav-cta" onClick={() => scrollTo('contact')}>Me contacter ↗</MagBtn>
              <button className="nav-burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="menu">
                <span className={menuOpen ? 'open' : ''} />
                <span className={menuOpen ? 'open' : ''} />
                <span className={menuOpen ? 'open' : ''} />
              </button>
            </div>
          </div>
        </nav>

        <main>

          {/* ── HERO ── */}
          <section id="about" className="section section--hero">
            <div className="hero-scan" aria-hidden="true" />
            <ParticleCanvas />
            <div className="aurora aurora--1" />
            <div className="aurora aurora--2" />
            <div className="aurora aurora--3" />
            <div className="hfog hfog--1" />
            <div className="hfog hfog--2" />
            <div className="hflare" />
            <div className="shoot shoot--1" />
            <div className="shoot shoot--2" />
            <div className="hero-glow hero-glow--1" />
            <div className="hero-glow hero-glow--2" />
            <div className="hblob hblob--1" />
            <div className="hblob hblob--2" />
            <div className="hring hring--1" />
            <div className="hring hring--2" />
            <div className="hring hring--3" />
            <div className="hring hring--4" />
            <StarField count={22} />

            <div className="container hero-container">

              {/* ── Left — main content ── */}
              <div className="hero-content">
                <div className={`hero-meta ${loaded ? 'hero-meta--in' : ''}`}>
                  <span className="hero-meta-item">Développeur Web</span>
                  <span className="hero-meta-sep">·</span>
                  <span className="hero-meta-item">Supinfo 3A</span>
                </div>

                <h1 className="hero-name" aria-label="Andrea Coustenoble">
                  <span className="hero-name-line">
                    <SplitText text="Andrea" animate={loaded} delay={0.1} className="hn-first" />
                  </span>
                  <span className="hero-name-line">
                    <SplitText text="Coustenoble" animate={loaded} delay={0.32} className="hn-last" />
                  </span>
                </h1>

                <div className={`hero-role ${loaded ? 'hero-role--in' : ''}`}>
                  <span className="role-dash">—&nbsp;</span>
                  <span className="role-text">{roleText}</span>
                  <span className="cursor-blink">|</span>
                </div>

                <p className="hero-bio">
                  <StaggerWords
                    text="Je crée des sites web élégants et sur mesure pour les particuliers et professionnels. Passionné par l'expérience utilisateur et le design moderne — chaque projet reflète votre identité."
                    animate={loaded}
                    baseDelay={0.85}
                  />
                </p>

                <div className={`hero-actions ${loaded ? 'hero-actions--in' : ''}`}>
                  <MagBtn className="btn btn--primary" onClick={() => scrollTo('projects')}>Voir mes projets</MagBtn>
                  <MagBtn className="btn btn--ghost" onClick={() => scrollTo('contact')}>Me contacter ↗</MagBtn>
                  <MagBtn className="btn btn--outline" href="#" download>↓ CV</MagBtn>
                </div>

                <div className={`hero-socials ${loaded ? 'hero-socials--in' : ''}`}>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="social-link">GitHub ↗</a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link">LinkedIn ↗</a>
                  <a href="mailto:andrea.coustenoble@email.com" className="social-link">Email ↗</a>
                </div>
              </div>

              {/* ── Right — info sidebar ── */}
              <aside className={`hero-aside ${loaded ? 'hero-aside--in' : ''}`}>
                {/* Statut */}
                <div className="ha-status">
                  <span className="ha-status-dot" />
                  <span className="ha-status-text">Disponible</span>
                </div>
                <div className="ha-sep" />
                {/* Localisation */}
                <div className="ha-geo">
                  <span className="ha-geo-city">Paris</span>
                  <span className="ha-geo-line">France · 48°51′N</span>
                </div>
                <div className="ha-sep" />
                {/* Stack */}
                <div className="ha-stack">
                  <span className="ha-stack-label">Stack</span>
                  <div className="ha-stack-tags">
                    {['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Next.js'].map(t => (
                      <span key={t} className="ha-tag">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="ha-sep" />
                {/* Année */}
                <div className="ha-year-block">
                  <span className="ha-year-num">2025</span>
                  <span className="ha-year-label">Supinfo · 3A</span>
                </div>
              </aside>

            </div>

            {/* Marquee */}
            <div className="hero-marquee">
              <div className="hero-marquee-track">
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                  <span key={i} className={item === '◆' ? 'mq-sep' : 'mq-item'}>{item}</span>
                ))}
              </div>
            </div>
          </section>

          <Divider />

          {/* ── SERVICES ── */}
          <section id="services" className="section section--forest">
            <Decor>
              <div className="sr sr--sv1" /><div className="sr sr--sv2" /><div className="sr sr--sv3" />
              <div className="sm sm--sv" />
              <div className="sd sd--1" /><div className="sd sd--2" /><div className="sd sd--3" />
              <div className="sd sd--4" /><div className="sd sd--5" />
            </Decor>
            <StarField count={14} dark />
            <div className="container">
              <div className="section-header reveal">
                <span className="section-label"><span className="sl-num">01 /</span> Ce que je propose</span>
                <div className="clip-reveal"><h2 className="clip-inner">Services</h2></div>
                <p>Des solutions web sur mesure pour mettre en valeur votre activité</p>
              </div>
              <div className="services-grid">
                {SERVICES.map((s, i) => (
                  <div key={s.id} className="service-card reveal" style={{ '--delay': `${i * 0.15}s` }}>
                    <div className="service-head">
                      <span className="service-num">{s.num}</span>
                      <span className="service-icon">{s.icon}</span>
                    </div>
                    <h3 className="service-title">{s.title}</h3>
                    <p className="service-desc">{s.description}</p>
                    <ul className="service-features">
                      {s.features.map(f => <li key={f}><span className="fmark">✦</span>{f}</li>)}
                    </ul>
                    <div className="service-footer">
                      <span className="service-price">Devis sur demande</span>
                      <MagBtn className="btn btn--ghost btn--sm" onClick={() => scrollTo('contact')}>Demander un devis ↗</MagBtn>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Divider />

          {/* ── PROJECTS ── */}
          <section id="projects" className="section section--alt">
            <StarField count={10} />
            <Decor>
              <div className="sr sr--pj1" /><div className="sr sr--pj2" /><div className="sr sr--pj3" /><div className="sr sr--pj4" />
              <div className="sm sm--pj" /><div className="sm sm--pj2" />
              <div className="sdiam sdiam--1" /><div className="sdiam sdiam--2" /><div className="sdiam sdiam--3" />
              <div className="pj-beam pj-beam--1" /><div className="pj-beam pj-beam--2" />
              <div className="pj-corner pj-corner--tl" /><div className="pj-corner pj-corner--br" />
            </Decor>
            <div className="container">
              <div className="section-header reveal">
                <span className="section-label"><span className="sl-num">02 /</span> Réalisations</span>
                <div className="clip-reveal"><h2 className="clip-inner">Projets</h2></div>
                <p>Une sélection de ce que j'ai construit</p>
              </div>
              <div className="projects-grid">
                {PROJECTS.map((p, i) => (
                  p.placeholder
                    ? (
                      <div key={p.id} className="project-card project-card--empty reveal" style={{ '--delay': `${i * 0.1}s` }}>
                        <span className="empty-plus">+</span>
                        <p>Projet à venir</p>
                      </div>
                    ) : (
                      <div key={p.id} className="project-card reveal" style={{ '--delay': `${i * 0.1}s` }}>
                        {/* Head row */}
                        <div className="project-top">
                          <div className="project-ids">
                            <span className="project-num">Nº {String(p.id).padStart(3, '0')}</span>
                            <span className="project-cat">{p.category}</span>
                          </div>
                          <a href={p.link} className="project-arrow" aria-label="voir le projet">↗</a>
                        </div>
                        <h3 className="project-title">{p.title}</h3>
                        <p className="project-desc">{p.description}</p>
                        {/* Metadata row */}
                        <div className="project-meta">
                          <div className="project-meta-item">
                            <span className="meta-label">Rôle</span>
                            <span className="meta-value">{p.role}</span>
                          </div>
                          <div className="project-meta-item">
                            <span className="meta-label">Année</span>
                            <span className="meta-value">{p.year}</span>
                          </div>
                          <div className="project-meta-item">
                            <span className="meta-label">Statut</span>
                            <span className="meta-value">{p.status}</span>
                          </div>
                          <div className="project-meta-item">
                            <span className="meta-label">Équipe</span>
                            <span className="meta-value">{p.team}</span>
                          </div>
                        </div>
                        <div className="project-tags">
                          {p.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                        </div>
                        <a href={p.link} className="project-link">Voir le projet ↗</a>
                        <div className="project-line" />
                      </div>
                    )
                ))}
              </div>
            </div>
          </section>

          <Divider />

          {/* ── SKILLS / EXPERTISE ── */}
          <section id="skills" className="section">
            <StarField count={10} />
            <Decor>
              <div className="sr sr--sk1" /><div className="sr sr--sk2" /><div className="sr sr--sk3" />
              <div className="sm sm--sk" />
              <div className="sdiam sdiam--4" /><div className="sdiam sdiam--5" />
              <div className="sd sd--6" /><div className="sd sd--7" /><div className="sd sd--8" />
            </Decor>
            <div className="container">
              <div className="section-header reveal">
                <span className="section-label"><span className="sl-num">03 /</span> Compétences</span>
                <div className="clip-reveal"><h2 className="clip-inner">Expertise</h2></div>
                <p>Technologies et domaines avec lesquels je travaille</p>
              </div>
              <div className="expertise-grid">
                {EXPERTISE.map((e, i) => (
                  <div key={e.num} className="expertise-card reveal" style={{ '--delay': `${i * 0.12}s` }}>
                    <div className="expertise-head">
                      <span className="expertise-num">{e.num}</span>
                      <span className="expertise-total">/ 04</span>
                    </div>
                    <h3 className="expertise-title">{e.title}</h3>
                    <p className="expertise-desc">{e.description}</p>
                    <div className="expertise-tags">
                      {e.items.map(item => <span key={item} className="tag">{item}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Divider />

          {/* ── PROCESS / MÉTHODE ── */}
          <section id="process" className="section section--alt">
            <StarField count={8} />
            <Decor>
              <div className="sr sr--tm1" /><div className="sr sr--tm2" />
              <div className="sm sm--tm" />
              <div className="sd sd--9" /><div className="sd sd--10" />
            </Decor>
            <div className="container">
              <div className="section-header reveal">
                <span className="section-label"><span className="sl-num">04 /</span> Ma méthode</span>
                <div className="clip-reveal"><h2 className="clip-inner">Processus</h2></div>
                <p>De la première idée à la mise en ligne</p>
              </div>
              <div className="process-list">
                {PROCESS.map((step, i) => (
                  <div key={step.num} className="process-step reveal" style={{ '--delay': `${i * 0.1}s` }}>
                    <span className="process-num">{step.num}</span>
                    <div className="process-body">
                      <div className="process-head">
                        <h3 className="process-title">{step.title}</h3>
                        <span className="process-dur">{step.duration}</span>
                      </div>
                      <p className="process-desc">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Divider />

          {/* ── CONTACT ── */}
          <section id="contact" className="section section--forest">
            <StarField count={14} dark />
            <Decor>
              <div className="sr sr--ct1" /><div className="sr sr--ct2" /><div className="sr sr--ct3" />
              <div className="sm sm--ct" />
              <div className="spulse" /><div className="spulse spulse--2" /><div className="spulse spulse--3" />
            </Decor>
            <div className="container container--narrow">
              <div className="section-header reveal">
                <span className="section-label"><span className="sl-num">05 /</span> Parlons-en</span>
                <div className="clip-reveal"><h2 className="clip-inner">Contact</h2></div>
                <p>Un projet en tête ? Décrivez-le moi.</p>
              </div>
              {sent ? (
                <div className="form-success reveal">
                  <span>✦</span> Message envoyé — je vous réponds rapidement.
                </div>
              ) : (
                <form className="contact-form reveal" onSubmit={handleSubmit} noValidate>
                  <div className="form-row">
                    <div className={`form-field form-field--float ${formErrors.name ? 'form-field--error' : ''}`}>
                      <input id="name" type="text" placeholder=" "
                        value={formData.name}
                        onChange={e => { setFormData({ ...formData, name: e.target.value }); setFormErrors(p => ({ ...p, name: '' })) }} />
                      <label htmlFor="name">Nom complet</label>
                      {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                    </div>
                    <div className={`form-field form-field--float ${formErrors.email ? 'form-field--error' : ''}`}>
                      <input id="email" type="email" placeholder=" "
                        value={formData.email}
                        onChange={e => { setFormData({ ...formData, email: e.target.value }); setFormErrors(p => ({ ...p, email: '' })) }} />
                      <label htmlFor="email">Adresse email</label>
                      {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                    </div>
                  </div>
                  <div className={`form-field form-field--float form-field--textarea ${formErrors.message ? 'form-field--error' : ''}`}>
                    <textarea id="message" rows={5} placeholder=" "
                      value={formData.message}
                      onChange={e => { setFormData({ ...formData, message: e.target.value }); setFormErrors(p => ({ ...p, message: '' })) }} />
                    <label htmlFor="message">Ton message</label>
                    {formErrors.message && <span className="field-error">{formErrors.message}</span>}
                  </div>
                  {sendError && (
                    <div className="form-error">
                      Une erreur est survenue — réessaie ou écris directement à maverickjet12@gmail.com
                    </div>
                  )}
                  <MagBtn type="submit" className="btn btn--primary btn--full" disabled={sending}>
                    {sending ? 'Envoi en cours…' : 'Envoyer le message ↗'}
                  </MagBtn>
                </form>
              )}
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="container footer-inner">
            <span className="footer-logo">AC</span>
            <p>© 2025 Andrea Coustenoble — Développé avec React & déployé sur Vercel</p>
            <div className="footer-links">
              <a href="https://github.com" target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn ↗</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
