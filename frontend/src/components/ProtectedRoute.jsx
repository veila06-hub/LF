import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Guards a route.
 *  - Not logged in  -> redirect to /login.
 *  - Logged in but lacking `module` view permission -> redirect to the first
 *    module they CAN see (or a friendly "no access" screen).
 *
 * Pass `module` to gate a specific page; omit it to only require auth.
 */
export default function ProtectedRoute({ module, children }) {
  const { isAuthenticated, loadingProfile, canView, modules } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Wait for /me/ before deciding what they can see.
  if (loadingProfile) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-gray-400">
        Loading…
      </div>
    )
  }

  if (module && !canView(module)) {
    const fallback = modules[0]?.path
    if (fallback && fallback !== location.pathname) {
      return <Navigate to={fallback} replace />
    }
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-center">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
          Access denied
        </h2>
        <p className="text-gray-500">
          You don&apos;t have permission to view this module.
        </p>
      </div>
    )
  }

  return children
}
