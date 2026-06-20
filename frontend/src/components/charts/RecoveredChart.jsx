import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useTheme } from '../../context/ThemeContext'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function RecoveredChart({ lost, found, recovered }) {
  const { dark } = useTheme()
  const pending = Math.max(lost - recovered, 0)

  const data = {
    labels: ['Still Lost', 'Recovered', 'Found Items'],
    datasets: [
      {
        data: [pending, recovered, found],
        backgroundColor: ['#ef4444', '#22c55e', '#3b82f6'],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: dark ? '#9ca3af' : '#6b7280', padding: 16 },
      },
      title: {
        display: true,
        text: 'Status Breakdown',
        color: dark ? '#f3f4f6' : '#111827',
        font: { size: 16, weight: '600' },
      },
    },
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <Doughnut data={data} options={options} />
    </div>
  )
}
