import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [access, setAccess] = useState(() => localStorage.getItem('access'))
  const [username, setUsername] = useState(() => localStorage.getItem('username'))
  const [profile, setProfile] = useState(null) // { id, roles, permissions, modules, ... }
  const [loadingProfile, setLoadingProfile] = useState(Boolean(localStorage.getItem('access')))

  // Fetch the current user's permissions/modules from the backend.
  const loadProfile = useCallback(async () => {
    if (!localStorage.getItem('access')) {
      setProfile(null)
      setLoadingProfile(false)
      return null
    }
    setLoadingProfile(true)
    try {
      const { data } = await api.get('/me/')
      setProfile(data)
      return data
    } catch {
      setProfile(null)
      return null
    } finally {
      setLoadingProfile(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [access, loadProfile])

  const login = async (credentials) => {
    const { data } = await api.post('/login/', credentials)
    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)
    localStorage.setItem('username', credentials.username)
    setAccess(data.access)
    setUsername(credentials.username)
    if (data.user) setProfile(data.user) // login already returns the payload
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
    setProfile(null)
  }

  // Permission helpers --------------------------------------------------
  const permissions = profile?.permissions || {}

  const can = useCallback(
    (module, action) => {
      if (!profile) return false
      if (profile.is_superuser) return true
      return Boolean(permissions[module]?.includes(action))
    },
    [profile, permissions]
  )

  const canView = useCallback((module) => can(module, 'view'), [can])

  const value = useMemo(
    () => ({
      access,
      username,
      profile,
      roles: profile?.roles || [],
      modules: profile?.modules || [],
      isSuperuser: Boolean(profile?.is_superuser),
      isAuthenticated: Boolean(access),
      loadingProfile,
      login,
      register,
      logout,
      reloadProfile: loadProfile,
      can,
      canView,
    }),
    [access, username, profile, loadingProfile, loadProfile, can, canView]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
