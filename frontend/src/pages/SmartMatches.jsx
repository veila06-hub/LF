import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiZap, FiMapPin, FiAward, FiArrowRight } from 'react-icons/fi'
import api from '../api/axios'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const ConfidenceBar = ({ score }) => {
  const getColor = (score) => {
    if (score >= 90) return 'from-green-400 to-green-600'
    if (score >= 75) return 'from-blue-400 to-blue-600'
    return 'from-yellow-400 to-yellow-600'
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">Confidence</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-bold text-white"
        >
          {score}%
        </motion.span>
      </div>
      <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${getColor(score)} rounded-full`}
        />
      </div>
    </div>
  )
}

export default function SmartMatches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  

  useEffect(() => {
    const loadMatches = async () => {
      try {
        // Simulated data - in production, fetch from your API
        // const { data } = await api.get('/smart-matches/')
        // setMatches(data)

        // For now, using enhanced dummy data
        const dummyMatches = [
          {
            id: 1,
            lostItem: 'Samsung Galaxy S23',
            lostDescription: 'Blue color, last seen at library',
            foundItem: 'Samsung Phone - Black cover',
            foundDescription: 'Found near the library entrance',
            location: 'Library',
            score: 92,
            tags: ['Electronics', 'Phone'],
            matchType: 'Exact Model Match',
          },
          {
            id: 2,
            lostItem: 'Black Leather Wallet',
            lostDescription: 'Contains ID and cards, lost on campus',
            foundItem: 'Dark Leather Wallet',
            foundDescription: 'Found in student cafeteria',
            location: 'Canteen',
            score: 85,
            tags: ['Accessories', 'Wallet'],
            matchType: 'Similar Description',
          },
          {
            id: 3,
            lostItem: 'AirPods Pro',
            lostDescription: 'White wireless earbuds with charger case',
            foundItem: 'Apple AirPods - Case Found',
            foundDescription: 'Found near computer lab',
            location: 'Computer Lab',
            score: 88,
            tags: ['Electronics', 'Audio'],
            matchType: 'Item Type Match',
          },
        ]
        setMatches(dummyMatches)
      } catch (error) {
        console.error('Failed to load matches:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMatches()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header Section */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Smart Match Recommendations
        </h1>
        <p className="text-gray-400 text-lg">
          AI-powered intelligent matching between lost and found items
        </p>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-gray-400 text-sm">Total Matches</p>
          <p className="text-2xl font-bold text-white mt-1">{matches.length}</p>
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-gray-400 text-sm">Avg. Confidence</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {Math.round(matches.reduce((a, b) => a + b.score, 0) / matches.length)}%
          </p>
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-gray-400 text-sm">Success Rate</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">88%</p>
        </div>
      </motion.div>

      {/* Matches Grid */}
      {matches.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl"
        >
          <div className="text-6xl mb-4">🔮</div>
          <h3 className="text-2xl font-semibold text-white mb-2">No Matches Found</h3>
          <p className="text-gray-400">More items reported will unlock better matches</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {matches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:border-white/40 hover:shadow-2xl hover:shadow-indigo-500/20">
                {/* Match Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 pb-6 border-b border-white/10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {match.matchType}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{match.lostItem}</h2>
                    <p className="text-gray-400 text-sm">{match.lostDescription}</p>
                  </div>

                  {/* Score Badge */}
                  <motion.div
                    initial={{ scale: 0.5, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="flex items-center justify-center"
                  >
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full -rotate-90 transform">
                        <circle
                          cx="48"
                          cy="48"
                          r="44"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="48"
                          cy="48"
                          r="44"
                          fill="none"
                          stroke="url(#scoreGradient)"
                          strokeWidth="8"
                          strokeDasharray={`${2 * Math.PI * 44}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                          animate={{
                            strokeDashoffset: 2 * Math.PI * 44 * (1 - match.score / 100),
                          }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4f46e5" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-white">{match.score}</p>
                          <p className="text-xs text-gray-400 mt-1">Score</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Found Item Info */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                  <div className="flex items-start gap-3 mb-3">
                    <FiAward className="text-green-400 text-lg mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">Matched with Found Item</p>
                      <p className="text-lg font-semibold text-white">{match.foundItem}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm ml-7">{match.foundDescription}</p>
                </div>

                {/* Confidence Bar */}
                <div className="mb-6">
                  <ConfidenceBar score={match.score} />
                </div>

                {/* Location & Tags */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiMapPin className="text-indigo-400 flex-shrink-0" />
                    <span className="font-medium">{match.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {match.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/verify-claim')}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                  >
                    <FiZap size={18} />
                    Verify Match
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/lost-item/${match.id}`)}
                    className="flex-1 border border-white/20 hover:border-white/40 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                  >
                    <FiArrowRight size={18} className="inline mr-2" />
                    View Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
