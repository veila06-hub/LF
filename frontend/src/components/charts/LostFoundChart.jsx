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
import { useTheme } from '../../context/ThemeContext'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function LostFoundChart({ lost, found, recovered }) {
  const { dark } = useTheme()
  const textColor = dark ? '#9ca3af' : '#6b7280'
  const gridColor = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'

  const data = {
    labels: ['Lost Items', 'Found Items', 'Recovered Items'],
    datasets: [
      {
        label: 'Count',
        data: [lost, found, recovered],
        backgroundColor: ['#6366f1', '#3b82f6', '#22c55e'],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Items Overview',
        color: dark ? '#f3f4f6' : '#111827',
        font: { size: 16, weight: '600' },
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
    <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <Bar data={data} options={options} />
    </div>
  )
}
