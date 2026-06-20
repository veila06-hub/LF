import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiSun, FiMoon, FiCheck, FiDroplet } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeCustomizer({ open, onClose }) {
  const { dark, setDark, accent, presets, setAccent, setCustomAccent } = useTheme()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="glass-card fixed right-0 top-0 z-[61] flex h-full w-[330px] max-w-[88vw] flex-col rounded-none rounded-l-3xl p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] accent-text">
                  Personalize
                </p>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                  Appearance
                </h2>
              </div>
              <button
                onClick={onClose}
                className="btn-ghost grid h-9 w-9 place-items-center rounded-xl"
              >
                <FiX />
              </button>
            </div>

            {/* Mode toggle */}
            <p className="mb-2 text-sm font-semibold" style={{ color: 'var(--text)' }}>
              Mode
            </p>
            <div className="mb-7 grid grid-cols-2 gap-2">
              {[
                { label: 'Light', value: false, icon: FiSun },
                { label: 'Dark', value: true, icon: FiMoon },
              ].map(({ label, value, icon: Icon }) => {
                const active = dark === value
                return (
                  <button
                    key={label}
                    onClick={() => setDark(value)}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
                      active ? 'accent-soft accent-ring' : 'btn-ghost'
                    }`}
                  >
                    <Icon /> {label}
                  </button>
                )
              })}
            </div>

            {/* Accent presets */}
            <p className="mb-3 text-sm font-semibold" style={{ color: 'var(--text)' }}>
              Accent palette
            </p>
            <div className="mb-7 grid grid-cols-4 gap-3">
              {presets.map((p) => {
                const active = accent.from === p.from && accent.to === p.to
                return (
                  <button
                    key={p.key}
                    onClick={() => setAccent(p)}
                    title={p.name}
                    className="group relative aspect-square rounded-2xl"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${p.from}, ${p.to})`,
                      boxShadow: active
                        ? `0 0 0 2px var(--surface), 0 0 0 4px ${p.from}`
                        : 'none',
                    }}
                  >
                    {active && (
                      <FiCheck className="absolute inset-0 m-auto text-white drop-shadow" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Custom color */}
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text)' }}>
              <FiDroplet /> Custom
            </p>
            <div className="flex items-center gap-3">
              <label className="flex flex-1 items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm">
                <span className="muted">Start</span>
                <input
                  type="color"
                  value={accent.from}
                  onChange={(e) => setCustomAccent(e.target.value, accent.to)}
                  className="h-7 w-10 cursor-pointer rounded bg-transparent"
                />
              </label>
              <label className="flex flex-1 items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm">
                <span className="muted">End</span>
                <input
                  type="color"
                  value={accent.to}
                  onChange={(e) => setCustomAccent(accent.from, e.target.value)}
                  className="h-7 w-10 cursor-pointer rounded bg-transparent"
                />
              </label>
            </div>

            <div className="mt-auto pt-6">
              <div
                className="rounded-2xl p-4 text-center text-sm font-medium text-white"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                }}
              >
                Live preview · {accent.name || 'Custom'}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
