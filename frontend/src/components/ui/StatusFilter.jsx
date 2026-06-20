const options = ['All', 'Lost', 'Found', 'Recovered']

export default function StatusFilter({ value, onChange, statuses = options }) {
  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => onChange(status)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            value === status
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  )
}
