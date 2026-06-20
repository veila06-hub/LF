import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCheckCircle } from 'react-icons/fi'

export default function MatchAlert({ open, claimId, matches, onClose, onViewQr }) {
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
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl dark:bg-gray-900"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <FiCheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🎉 Possible Match Found!
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {matches} matching lost item{matches !== 1 ? 's' : ''} found
            </p>
            <p className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 font-mono text-lg font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              Claim ID: {claimId}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onViewQr}
                className="flex-1 rounded-xl bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-700"
              >
                View QR Code
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-200 px-4 py-2.5 dark:border-gray-700"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
