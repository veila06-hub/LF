import { motion } from 'framer-motion'

/** Consistent page title block with an optional eyebrow, icon and actions. */
export default function PageHeader({ eyebrow, title, subtitle, icon: Icon, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-wrap items-end justify-between gap-4"
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="accent-grad grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-lg">
            <Icon size={22} />
          </div>
        )}
        <div>
          {eyebrow && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] accent-text">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            {title}
          </h1>
          {subtitle && <p className="mt-1 muted">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </motion.div>
  )
}
