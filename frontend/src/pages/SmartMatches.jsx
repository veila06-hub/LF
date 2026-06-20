import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiZap, FiMapPin, FiAward, FiArrowRight, FiCpu, FiTarget, FiTrendingUp } from 'react-icons/fi'
import api from '../api/axios'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'

const ConfidenceBar = ({ score }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium muted">Confidence</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-bold gradient-text"
        >
          {score}%
        </motion.span>
      </div>
      <div
        className="h-2 w-full rounded-full overflow-hidden"
        style={{ background: 'var(--surface-3)' }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full accent-grad rounded-full"
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

  const stats = [
    { label: 'Total Matches', value: matches.length, icon: FiTarget },
    {
      label: 'Avg. Confidence',
      value: `${Math.round(matches.reduce((a, b) => a + b.score, 0) / matches.length)}%`,
      icon: FiTrendingUp,
    },
    { label: 'Success Rate', value: '88%', icon: FiZap },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header Section */}
      <PageHeader
        eyebrow="AI Recommendations"
        title="Smart Match Recommendations"
        subtitle="AI-powered intelligent matching between lost and found items"
        icon={FiCpu}
      />

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-3 gap-4"
      >
        {stats.map((stat, i) => (
          <Card key={stat.label} delay={0.05 * i} className="p-5">
            <div className="flex items-center gap-3">
              <div className="accent-soft grid h-10 w-10 shrink-0 place-items-center rounded-xl">
                <stat.icon className="accent-text" size={18} />
              </div>
              <div>
                <p className="text-sm faint">{stat.label}</p>
                <p className="text-2xl font-bold mt-0.5" style={{ color: 'var(--text)' }}>
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Matches Grid */}
      {matches.length === 0 ? (
        <Card delay={0.1} className="text-center py-20">
          <div className="text-6xl mb-4">🔮</div>
          <h3 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
            No Matches Found
          </h3>
          <p className="muted">More items reported will unlock better matches</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {matches.map((match, index) => (
            <Card key={match.id} hover delay={index * 0.1} className="p-8 group">
              {/* Match Header */}
              <div
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 pb-6 border-b hairline"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold accent-soft accent-text">
                      {match.matchType}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                    {match.lostItem}
                  </h2>
                  <p className="muted text-sm">{match.lostDescription}</p>
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
                        stroke="var(--surface-3)"
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
                        <p className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
                          {match.score}
                        </p>
                        <p className="text-xs faint mt-1">Score</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Found Item Info */}
              <div
                className="rounded-2xl p-5 mb-6 border hairline"
                style={{ background: 'var(--surface-2)' }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <FiAward className="text-emerald-400 text-lg mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm faint mb-1">Matched with Found Item</p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                      {match.foundItem}
                    </p>
                  </div>
                </div>
                <p className="muted text-sm ml-7">{match.foundDescription}</p>
              </div>

              {/* Confidence Bar */}
              <div className="mb-6">
                <ConfidenceBar score={match.score} />
              </div>

              {/* Location & Tags */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <FiMapPin className="accent-text flex-shrink-0" />
                  <span className="font-medium">{match.location}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {match.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-lg accent-soft accent-text"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  icon={FiZap}
                  onClick={() => navigate('/verify-claim')}
                  className="flex-1"
                >
                  Verify Match
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  icon={FiArrowRight}
                  onClick={() => navigate(`/lost-item/${match.id}`)}
                  className="flex-1"
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  )
}
