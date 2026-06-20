import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { mediaUrl } from '../../utils/mediaUrl'

export default function QRModal({ open, qrPath, claimId, onClose }) {
  const src = mediaUrl(qrPath)

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
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                QR Code
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="faint transition-colors hover:opacity-80"
                style={{ color: 'var(--text)' }}
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            {src && (
              <div
                className="mx-auto inline-block rounded-2xl p-3 border hairline"
                style={{ background: 'var(--surface-2)' }}
              >
                <img
                  src={src}
                  alt={`QR for ${claimId}`}
                  className="mx-auto rounded-xl"
                />
              </div>
            )}
            <p className="mt-4 font-mono text-sm accent-text">{claimId}</p>
            <p className="mt-1 text-xs faint">Scan to verify your claim</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
