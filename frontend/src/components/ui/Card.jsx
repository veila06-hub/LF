import { motion } from 'framer-motion'

/**
 * Frosted premium container. `hover` adds the lift interaction,
 * `as` lets it animate in via framer-motion when `delay` is set.
 */
export default function Card({
  children,
  className = '',
  hover = false,
  delay,
  onClick,
  ...props
}) {
  const animate =
    delay !== undefined
      ? {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        }
      : {}

  return (
    <motion.div
      {...animate}
      onClick={onClick}
      className={`glass-card rounded-2xl ${hover ? 'card-hover' : ''} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
