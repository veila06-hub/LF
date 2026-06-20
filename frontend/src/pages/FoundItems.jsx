import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus } from 'react-icons/fi'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import SearchBar from '../components/ui/SearchBar'
import StatusFilter from '../components/ui/StatusFilter'
import ItemCard from '../components/ui/ItemCard'
import Modal from '../components/ui/Modal'
import MatchAlert from '../components/ui/MatchAlert'
import QRModal from '../components/ui/QRModal'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const emptyForm = {
  title: '',
  description: '',
  location: '',
  date_found: '',
  image: null,
}

export default function FoundItems() {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [matchOpen, setMatchOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [matchData, setMatchData] = useState(null)

  const loadItems = async () => {
    try {
      const { data } = await api.get('/view-found-items/')
      setItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = status === 'All' || item.status === status
      return matchesSearch && matchesStatus
    })
  }, [items, search, status])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      setError('Please login to report found items')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      let payload
      if (form.image) {
        payload = new FormData()
        payload.append('title', form.title)
        payload.append('description', form.description)
        payload.append('location', form.location)
        payload.append('date_found', form.date_found)
        payload.append('image', form.image)
      } else {
        payload = {
          title: form.title,
          description: form.description,
          location: form.location,
          date_found: form.date_found,
        }
      }

      const { data } = await api.post('/found-items/', payload)
      setModalOpen(false)
      setForm(emptyForm)
      await loadItems()

      if (data.match_found) {
        setMatchData(data)
        setMatchOpen(true)
      }
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Found Items</h1>
          <p className="text-gray-500">Items reported by finders</p>
        </div>
        {isAuthenticated && (
          <button
            type="button"
            onClick={() => {
              setForm(emptyForm)
              setError('')
              setModalOpen(true)
            }}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <FiPlus /> Report Found Item
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search found items..." />
        </div>
        <StatusFilter value={status} onChange={setStatus} statuses={['All', 'Found']} />
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-gray-500">No items found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} type="found" />
          ))}
        </div>
      )}

      <Modal open={modalOpen} title="Report Found Item" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['title', 'description', 'location'].map((field) => (
            <div key={field}>
              <label className="mb-1 block text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                {field}
              </label>
              {field === 'description' ? (
                <textarea
                  required
                  rows={3}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                />
              ) : (
                <input
                  required
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                />
              )}
            </div>
          ))}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date Found
            </label>
            <input
              type="date"
              required
              value={form.date_found}
              onChange={(e) => setForm({ ...form, date_found: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              className="w-full text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </Modal>

      <MatchAlert
        open={matchOpen}
        claimId={matchData?.claim_id}
        matches={matchData?.matches}
        onClose={() => setMatchOpen(false)}
        onViewQr={() => {
          setMatchOpen(false)
          setQrOpen(true)
        }}
      />

      <QRModal
        open={qrOpen}
        qrPath={matchData?.qr_code}
        claimId={matchData?.claim_id}
        onClose={() => setQrOpen(false)}
      />
    </motion.div>
  )
}
