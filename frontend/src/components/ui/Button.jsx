import { motion } from 'framer-motion'

const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-6 py-3 text-base gap-2.5 rounded-2xl',
}

const VARIANTS = {
  primary: 'btn-primary font-semibold',
  ghost: 'btn-ghost font-medium',
  danger:
    'font-medium text-red-500 bg-red-500/10 border border-red-500/20 hover:bg-red-500/15',
  soft: 'accent-soft font-medium hover:brightness-110',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="shrink-0" size={size === 'sm' ? 14 : 18} />}
      {children}
    </motion.button>
  )
}
