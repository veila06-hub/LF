import { motion } from 'framer-motion'
import { useCountUp } from '../../hooks/useCountUp'

// Optional tone gradients; when omitted the icon uses the live accent.
const TONES = {
  blue: ['#3b82f6', '#06b6d4'],
  green: ['#10b981', '#22c55e'],
  amber: ['#f59e0b', '#f97316'],
  violet: ['#8b5cf6', '#d946ef'],
  rose: ['#f43f5e', '#fb7185'],
}

export default function StatCard({ title, value, icon: Icon, tone, delay = 0, hint }) {
  const count = useCountUp(typeof value === 'number' ? value : 0)
  const grad = TONES[tone]
  const iconStyle = grad
    ? { backgroundImage: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})` }
    : undefined

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className="glass-card card-hover relative overflow-hidden rounded-2xl p-5"
    >
      {/* subtle corner glow */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl"
        style={iconStyle || { background: 'var(--accent)' }}
      />
      <div className="flex items-start justify-between">
        <div
          className={`grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg ${
            grad ? '' : 'accent-grad'
          }`}
          style={iconStyle}
        >
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        <span className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
          {count}
        </span>
      </div>
      <p className="mt-4 text-sm font-medium muted">{title}</p>
      {hint && <p className="mt-0.5 text-xs faint">{hint}</p>}
    </motion.div>
  )
}
