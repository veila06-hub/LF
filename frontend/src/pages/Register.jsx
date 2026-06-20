import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiLock, FiMail } from 'react-icons/fi'
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
      if (typeof errors === 'object') {
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

  return (
    <div className="gradient-bg flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl">
            ✨
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="mt-1 text-sm text-white/70">Join the Lost & Found community</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {[
            { key: 'username', label: 'Username', icon: FiUser, type: 'text' },
            { key: 'email', label: 'Email', icon: FiMail, type: 'email' },
            { key: 'password', label: 'Password', icon: FiLock, type: 'password' },
          ].map(({ key, label, icon: Icon, type }) => (
            <div key={key}>
              <label className="mb-1 block text-sm text-white/80">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type={type}
                  required
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-10 pr-4 text-white placeholder-white/40 outline-none focus:border-white/40"
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </div>
            </div>
          ))}

          {error && (
            <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-3 font-semibold text-indigo-700 shadow-lg disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Register'}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-white/70">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-white underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
