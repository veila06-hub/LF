import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function RecoveredChart({ lost, found, recovered }) {
  const { dark } = useTheme()
  const pending = Math.max(lost - recovered, 0)

  // Live accent colours so the chart matches the active theme.
  const accent2 =
    getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-2')
      .trim() || '#06b6d4'

  const data = {
    labels: ['Still Lost', 'Recovered', 'Found Items'],
    datasets: [
      {
        data: [pending, recovered, found],
        backgroundColor: ['#f43f5e', '#22c55e', accent2],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', padding: 16, usePointStyle: true },
      },
      title: {
        display: true,
        text: 'Status Breakdown',
        color: dark ? '#f3f4f6' : '#111827',
        font: { size: 16, weight: '600' },
      },
      tooltip: {
        backgroundColor: dark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
        titleColor: dark ? '#f3f4f6' : '#111827',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(148,163,184,0.15)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
      },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="h-72">
        <Doughnut data={data} options={options} />
      </div>
    </motion.div>
  )
}
