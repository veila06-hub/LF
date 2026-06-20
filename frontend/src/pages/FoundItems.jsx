import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiPackage } from 'react-icons/fi'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import SearchBar from '../components/ui/SearchBar'
import StatusFilter from '../components/ui/StatusFilter'
import ItemCard from '../components/ui/ItemCard'
import Modal from '../components/ui/Modal'
import MatchAlert from '../components/ui/MatchAlert'
import QRModal from '../components/ui/QRModal'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'

const emptyForm = {
  title: '',
  description: '',
  location: '',
  date_found: '',
  image: null,
}

const EASE = [0.22, 1, 0.36, 1]

export default function FoundItems() {
  const { isAuthenticated, can } = useAuth()
  const canCreate = can('found_items', 'create')
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <PageHeader
        eyebrow="Lost & Found"
        title="Found Items"
        subtitle="Items reported by finders"
        icon={FiPackage}
        actions={
          isAuthenticated && canCreate ? (
            <Button
              variant="primary"
              icon={FiPlus}
              onClick={() => {
                setForm(emptyForm)
                setError('')
                setModalOpen(true)
              }}
            >
              Report Found Item
            </Button>
          ) : null
        }
      />

      <Card delay={0.05} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search found items..." />
        </div>
        <StatusFilter value={status} onChange={setStatus} statuses={['All', 'Found']} />
      </Card>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="glass-card rounded-2xl py-16 text-center"
        >
          <div className="mb-4 text-6xl">📦</div>
          <h3 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
            No items found.
          </h3>
          <p className="mt-2 muted">Try adjusting your search or report a found item.</p>
        </motion.div>
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
              <label className="mb-1.5 block text-sm font-medium capitalize" style={{ color: 'var(--text-muted)' }}>
                {field}
              </label>
              {field === 'description' ? (
                <textarea
                  required
                  rows={3}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="input-field"
                />
              ) : (
                <input
                  required
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="input-field"
                />
              )}
            </div>
          ))}
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Date Found
            </label>
            <input
              type="date"
              required
              value={form.date_found}
              onChange={(e) => setForm({ ...form, date_found: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              className="w-full text-sm muted"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" variant="primary" size="lg" disabled={submitting} className="w-full">
            {submitting ? 'Submitting...' : 'Submit Report'}
          </Button>
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
