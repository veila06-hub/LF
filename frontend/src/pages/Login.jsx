import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiLock, FiArrowRight, FiCompass } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(form)
      const first = data?.user?.modules?.[0]?.path || '/dashboard'
      navigate(first)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

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
            <FiCompass size={28} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
            Welcome back
          </h1>
          <p className="mt-1 text-sm muted">Sign in to your Lost &amp; Found account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Username
            </label>
            <div className="relative">
              <FiUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 faint" />
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="input-field pl-10"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Password
            </label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 faint" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field pl-10"
                placeholder="Enter password"
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl bg-red-500/15 px-3 py-2.5 text-sm text-red-400"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-semibold"
          >
            {loading ? 'Signing in…' : 'Sign In'}
            {!loading && <FiArrowRight />}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm muted">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold accent-text hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
