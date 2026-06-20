const options = ['All', 'Lost', 'Found', 'Recovered']

export default function StatusFilter({ value, onChange, statuses = options }) {
  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => {
        const active = value === status
        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(status)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
              active ? 'accent-grad text-white shadow-lg' : 'btn-ghost'
            }`}
          >
            {status}
          </button>
        )
      })}
    </div>
  )
}
