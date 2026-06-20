import { createContext, useContext, useMemo, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

function parseJwt(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [access, setAccess] = useState(() => localStorage.getItem('access'))
  const [username, setUsername] = useState(() => localStorage.getItem('username'))

  const userId = useMemo(() => {
    if (!access) return null
    const payload = parseJwt(access)
    return payload?.user_id ?? null
  }, [access])

  const login = async (credentials) => {
    const { data } = await api.post('/login/', credentials)
    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)
    localStorage.setItem('username', credentials.username)
    setAccess(data.access)
    setUsername(credentials.username)
    return data
  }

  const register = async (payload) => {
    const { data } = await api.post('/register/', payload)
    return data
  }

  const logout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('username')
    setAccess(null)
    setUsername(null)
  }

  const isAuthenticated = Boolean(access)

  return (
    <AuthContext.Provider
      value={{ access, username, userId, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
