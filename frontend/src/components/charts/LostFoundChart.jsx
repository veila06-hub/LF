import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function LostFoundChart({ lost, found, recovered }) {
  const { dark } = useTheme()

  // Live accent colours so the chart matches the active theme.
  const accent =
    getComputedStyle(document.documentElement)
      .getPropertyValue('--accent')
      .trim() || '#6366f1'
  const accent2 =
    getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-2')
      .trim() || '#06b6d4'

  const textColor = '#94a3b8'
  const gridColor = 'rgba(148,163,184,0.15)'

  const data = {
    labels: ['Lost Items', 'Found Items', 'Recovered Items'],
    datasets: [
      {
        label: 'Count',
        data: [lost, found, recovered],
        backgroundColor: [accent, accent2, '#22c55e'],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Items Overview',
        color: dark ? '#f3f4f6' : '#111827',
        font: { size: 16, weight: '600' },
      },
      tooltip: {
        backgroundColor: dark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
        titleColor: dark ? '#f3f4f6' : '#111827',
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        beginAtZero: true,
        ticks: { color: textColor, stepSize: 1 },
        grid: { color: gridColor },
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
        <Bar data={data} options={options} />
      </div>
    </motion.div>
  )
}
