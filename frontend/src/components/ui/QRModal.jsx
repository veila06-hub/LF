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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl dark:bg-gray-900"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">QR Code</h3>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            {src && (
              <img
                src={src}
                alt={`QR for ${claimId}`}
                className="mx-auto rounded-xl border border-gray-200 dark:border-gray-700"
              />
            )}
            <p className="mt-4 font-mono text-sm text-indigo-600 dark:text-indigo-400">{claimId}</p>
            <p className="mt-1 text-xs text-gray-500">Scan to verify your claim</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
