import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiTrendingDown, FiCheckCircle, FiPercent, FiSearch } from 'react-icons/fi'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import SearchBar from '../components/ui/SearchBar'
import StatusFilter from '../components/ui/StatusFilter'
import ItemCard from '../components/ui/ItemCard'
import Modal from '../components/ui/Modal'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import PageHeader from '../components/ui/PageHeader'

const emptyForm = {
  title: '',
  description: '',
  location: '',
  date_lost: '',
  image: null,
}

const EASE = [0.22, 1, 0.36, 1]

export default function LostItems() {
  const { isAuthenticated, userId, can, isSuperuser } = useAuth()
  const canCreate = can('lost_items', 'create')
  const canEditModule = can('lost_items', 'edit')
  const isStaff = isSuperuser || can('users', 'view')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadItems = async () => {
    try {
      const { data } = await api.get('/view-lost-items/')
     console.log("Lost Items:", data);
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

      const matchesStatus =
        status === 'All' ||
        (status === 'Recovered' ? item.is_recovered : item.status === status)

      return matchesSearch && matchesStatus
    })
  }, [items, search, status])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      title: item.title,
      description: item.description,
      location: item.location,
      date_lost: item.date_lost,
      image: null,
    })
    setError('')
    setModalOpen(true)
  }

  const buildPayload = () => {
    if (form.image) {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('location', form.location)
      fd.append('date_lost', form.date_lost)
      fd.append('image', form.image)
      return fd
    }
    return {
      title: form.title,
      description: form.description,
      location: form.location,
      date_lost: form.date_lost,
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      setError('Please login to add items')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const payload = buildPayload()
      if (editing) {
        await api.put(`/update-lost-item/${editing.id}/`, payload)
      } else {
        await api.post('/lost-items/', payload)
      }
      setModalOpen(false)
      await loadItems()
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to save item')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return
    await api.delete(`/delete-lost-item/${id}/`)
    loadItems()
  }

  const handleRecover = async (id) => {
    await api.put(`/lost-items/${id}/recover/`)
    loadItems()
  }

  const stats = useMemo(() => {
    const total = items.length
    const recovered = items.filter((i) => i.is_recovered).length
    const recoveryRate = total > 0 ? Math.round((recovered / total) * 100) : 0
    return { total, recovered, recoveryRate }
  }, [items])

  if (loading) return <LoadingSpinner />

  const statCards = [
    { label: 'Total Lost Items', value: stats.total, icon: FiTrendingDown },
    { label: 'Items Recovered', value: stats.recovered, icon: FiCheckCircle },
    { label: 'Recovery Rate', value: `${stats.recoveryRate}%`, icon: FiPercent },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <PageHeader
        eyebrow="Lost & Found"
        title="Lost Items"
        subtitle="Browse and report lost belongings"
        icon={FiSearch}
        actions={
          isAuthenticated && canCreate ? (
            <Button variant="primary" icon={FiPlus} onClick={openCreate}>
              Report Lost Item
            </Button>
          ) : null
        }
      />

      <div className="grid gap-5 sm:grid-cols-3">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} delay={0.05 + i * 0.08} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm muted">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold gradient-text">{stat.value}</p>
                </div>
                <div className="accent-soft grid h-12 w-12 place-items-center rounded-2xl">
                  <Icon size={22} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card delay={0.3} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search lost items..." />
        </div>
        <StatusFilter value={status} onChange={setStatus} statuses={['All', 'Lost', 'Recovered']} />
      </Card>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="glass-card rounded-2xl py-16 text-center"
        >
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
            No Lost Items Found
          </h3>
          <p className="mt-2 muted">Try adjusting your search or create a new report.</p>
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              type="lost"
              canManage={canEditModule && (userId === item.user || isStaff)}
              onEdit={openEdit}
              onDelete={handleDelete}
              onRecover={handleRecover}
            />
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Lost Item' : 'Report Lost Item'}
        onClose={() => setModalOpen(false)}
      >
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
              Date Lost
            </label>
            <input
              type="date"
              required
              value={form.date_lost}
              onChange={(e) => setForm({ ...form, date_lost: e.target.value })}
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
            {submitting ? 'Saving...' : editing ? 'Update Item' : 'Submit Report'}
          </Button>
        </form>
      </Modal>
    </motion.div>
  )
}
