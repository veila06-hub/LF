import { motion } from 'framer-motion'

export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="relative h-12 w-12">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent, var(--accent))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        <div className="accent-grad absolute inset-[18px] rounded-full" />
      </div>
      <p className="text-sm muted">{label}</p>
    </div>
  )
}
