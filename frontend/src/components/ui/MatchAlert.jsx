import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCheckCircle } from 'react-icons/fi'
import Button from './Button'

export default function MatchAlert({ open, claimId, matches, onClose, onViewQr }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 12 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card w-full max-w-md rounded-3xl p-8 text-center shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15">
              <FiCheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
              🎉 Possible Match Found!
            </h2>
            <p className="mt-2 muted">
              {matches} matching lost item{matches !== 1 ? 's' : ''} found
            </p>
            <p
              className="mt-4 rounded-xl px-4 py-3 font-mono text-lg font-semibold accent-soft accent-text"
            >
              Claim ID: {claimId}
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={onViewQr}
                className="flex-1"
              >
                View QR Code
              </Button>
              <Button type="button" variant="ghost" size="lg" onClick={onClose}>
                <FiX className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
