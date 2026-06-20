import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiLock, FiMail, FiArrowRight, FiUserPlus } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/login')
    } catch (err) {
      const errors = err.response?.data
      if (typeof errors === 'object' && errors) {
        const msg = Object.entries(errors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join(' | ')
        setError(msg)
      } else {
        setError('Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'username', label: 'Username', icon: FiUser, type: 'text' },
    { key: 'email', label: 'Email', icon: FiMail, type: 'email' },
    { key: 'password', label: 'Password', icon: FiLock, type: 'password' },
  ]

  return (
    <div className="app-bg aurora flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card w-full max-w-md rounded-3xl p-8"
      >
        <div className="text-center">
          <div className="accent-grad mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl text-white shadow-xl">
            <FiUserPlus size={26} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
            Create your account
          </h1>
          <p className="mt-1 text-sm muted">Join the Lost &amp; Found community</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {fields.map(({ key, label, icon: Icon, type }) => (
            <div key={key}>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                {label}
              </label>
              <div className="relative">
                <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 faint" />
                <input
                  type={type}
                  required
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="input-field pl-10"
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </div>
            </div>
          ))}

          {error && (
            <p className="rounded-xl bg-red-500/15 px-3 py-2.5 text-sm text-red-400">{error}</p>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-semibold"
          >
            {loading ? 'Creating account…' : 'Create account'}
            {!loading && <FiArrowRight />}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold accent-text hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
