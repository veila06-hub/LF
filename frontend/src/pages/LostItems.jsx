import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiTrendingDown, FiCheckCircle, FiPercent } from 'react-icons/fi'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import SearchBar from '../components/ui/SearchBar'
import StatusFilter from '../components/ui/StatusFilter'
import ItemCard from '../components/ui/ItemCard'
import Modal from '../components/ui/Modal'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const emptyForm = {
  title: '',
  description: '',
  location: '',
  date_lost: '',
  image: null,
}

export default function LostItems() {
  const { isAuthenticated, userId } = useAuth()
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lost Items</h1>
          <p className="text-gray-500">Browse and report lost belongings</p>
        </div>
        {isAuthenticated && (
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-all"
          >
            <FiPlus /> Report Lost Item
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Lost Items</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <FiTrendingDown className="text-4xl opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Items Recovered</p>
              <p className="text-3xl font-bold mt-2">{stats.recovered}</p>
            </div>
            <FiCheckCircle className="text-4xl opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Recovery Rate</p>
              <p className="text-3xl font-bold mt-2">{stats.recoveryRate}%</p>
            </div>
            <FiPercent className="text-4xl opacity-20" />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-lg flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search lost items..." />
        </div>
        <StatusFilter value={status} onChange={setStatus} statuses={['All', 'Lost', 'Recovered']} />
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 rounded-2xl bg-white dark:bg-slate-900 shadow-lg"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            No Lost Items Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Try adjusting your search or create a new report.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{
                scale: 1.03,
                y: -5
              }}
              transition={{ duration: 0.2 }}
            >
              <ItemCard
                item={item}
                type="lost"
                canManage={userId === item.user}
                onEdit={openEdit}
                onDelete={handleDelete}
                onRecover={handleRecover}
              />
            </motion.div>
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
              Date Lost
            </label>
            <input
              type="date"
              required
              value={form.date_lost}
              onChange={(e) => setForm({ ...form, date_lost: e.target.value })}
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
            {submitting ? 'Saving...' : editing ? 'Update Item' : 'Submit Report'}
          </button>
        </form>
      </Modal>
    </motion.div>
  )
}
