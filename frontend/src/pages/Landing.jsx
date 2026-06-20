import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FiArrowRight,
  FiZap,
  FiShield,
  FiSearch,
  FiBarChart2,
  FiCompass,
  FiSun,
  FiMoon,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const SLIDES = [
  {
    icon: FiZap,
    tag: 'AI Smart Matching',
    title: 'Reunite people with what they lost.',
    body: 'Our matching engine cross-references every lost and found report in real time, surfacing the right match before anyone gives up hope.',
    stat: '92%',
    statLabel: 'Match accuracy',
  },
  {
    icon: FiShield,
    tag: 'Secure Claims',
    title: 'QR-verified, tamper-proof handovers.',
    body: 'Every recovery runs through a verified claim flow with QR codes and audit trails — so items reach the right owner, every time.',
    stat: '100%',
    statLabel: 'Verified handovers',
  },
  {
    icon: FiSearch,
    tag: 'Effortless Reporting',
    title: 'Report in seconds, track from anywhere.',
    body: 'A beautiful, fast reporting flow with photos and locations. Follow your item from "lost" to "recovered" on a single timeline.',
    stat: '10s',
    statLabel: 'Avg. report time',
  },
  {
    icon: FiBarChart2,
    tag: 'Insightful Analytics',
    title: 'Understand recovery at a glance.',
    body: 'Live dashboards reveal trends, hotspots and recovery rates — turning lost-and-found chaos into measurable outcomes.',
    stat: '24/7',
    statLabel: 'Live insights',
  },
]

const FEATURES = [
  { icon: FiSearch, title: 'Lost & Found Hub', text: 'One place for every report, beautifully organized.' },
  { icon: FiZap, title: 'Smart Matches', text: 'AI links lost reports to found items instantly.' },
  { icon: FiShield, title: 'Verified Claims', text: 'QR-based verification keeps recoveries honest.' },
  { icon: FiBarChart2, title: 'Analytics', text: 'Recovery rates and trends in real time.' },
]

export default function Landing() {
  const { isAuthenticated, modules } = useAuth()
  const { dark, toggleTheme } = useTheme()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const slide = SLIDES[index]
  const Icon = slide.icon
  const appHome = modules?.[0]?.path || '/dashboard'

  return (
    <div className="app-bg aurora min-h-screen">
      {/* Nav */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="accent-grad grid h-10 w-10 place-items-center rounded-2xl text-white shadow-lg">
            <FiCompass size={20} />
          </div>
          <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Lost &amp; Found
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="btn-ghost grid h-10 w-10 place-items-center rounded-xl">
            {dark ? <FiSun /> : <FiMoon />}
          </button>
          {isAuthenticated ? (
            <Link to={appHome} className="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold">
              Open App
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost rounded-xl px-5 py-2.5 text-sm font-medium">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold">
                Get started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-10 lg:grid-cols-2 lg:pt-20">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="accent-soft mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
          >
            <FiZap size={14} /> Smart recovery, reimagined
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-5xl font-extrabold leading-[1.05] tracking-tight lg:text-6xl"
            style={{ color: 'var(--text)' }}
          >
            Lost something?
            <br />
            <span className="gradient-text">Find it faster.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-lg text-lg muted"
          >
            A premium lost &amp; found platform with AI matching, verified claims and
            live analytics — designed to bring belongings back to their owners.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              to={isAuthenticated ? appHome : '/register'}
              className="btn-primary group flex items-center gap-2 rounded-2xl px-7 py-3.5 text-base font-semibold"
            >
              {isAuthenticated ? 'Open dashboard' : 'Start for free'}
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/login" className="btn-ghost rounded-2xl px-7 py-3.5 text-base font-medium">
              I have an account
            </Link>
          </motion.div>

          {/* Feature chips */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="glass-card rounded-2xl p-4"
              >
                <f.icon className="accent-text mb-2" size={20} />
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  {f.title}
                </p>
                <p className="mt-0.5 text-xs faint">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Slides */}
        <div className="relative">
          <div className="glass-card relative overflow-hidden rounded-[2rem] p-8">
            <div
              className="accent-grad pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative min-h-[320px]"
              >
                <div className="accent-grad mb-6 grid h-14 w-14 place-items-center rounded-2xl text-white shadow-lg">
                  <Icon size={26} />
                </div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] accent-text">
                  {slide.tag}
                </p>
                <h3 className="text-2xl font-bold leading-snug" style={{ color: 'var(--text)' }}>
                  {slide.title}
                </h3>
                <p className="mt-4 muted">{slide.body}</p>

                <div className="mt-8 flex items-end gap-3">
                  <span className="text-5xl font-extrabold gradient-text">{slide.stat}</span>
                  <span className="mb-1.5 text-sm faint">{slide.statLabel}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* dots */}
            <div className="mt-8 flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: i === index ? 28 : 8,
                    background: i === index ? 'var(--accent)' : 'var(--border-strong)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* floating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-card float absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-2xl px-4 py-3 sm:flex"
          >
            <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500/20 text-emerald-400">
              <FiShield size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                Verified claim
              </p>
              <p className="text-xs faint">Item recovered ✓</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
