import { NavLink } from 'react-router-dom'
import {
  FiHome,
  FiSearch,
  FiPackage,
  FiBarChart2,
  FiZap,
  FiShield,
  FiBell,
  FiUsers,
  FiLock,
  FiSliders,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const ICONS = {
  dashboard: FiHome,
  lost_items: FiSearch,
  found_items: FiPackage,
  matches: FiZap,
  verify: FiShield,
  notifications: FiBell,
  analytics: FiBarChart2,
  users: FiUsers,
  roles: FiLock,
}

export default function MobileNav({ onOpenCustomizer }) {
  const { modules } = useAuth()
  const items = modules.slice(0, 4)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex border-t px-2 py-1.5 md:hidden"
      style={{
        borderColor: 'var(--border)',
        background: 'color-mix(in srgb, var(--bg) 80%, transparent)',
        backdropFilter: 'blur(18px)',
      }}
    >
      {items.map(({ key, label, path }) => {
        const Icon = ICONS[key] || FiHome
        return (
          <NavLink
            key={path}
            to={path}
            className="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium"
          >
            {({ isActive }) => (
              <>
                <Icon
                  className="h-5 w-5"
                  style={{ color: isActive ? 'var(--accent)' : 'var(--text-faint)' }}
                />
                <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-faint)' }}>
                  {label.split(' ')[0]}
                </span>
              </>
            )}
          </NavLink>
        )
      })}
      <button
        onClick={onOpenCustomizer}
        className="flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[11px] font-medium"
        style={{ color: 'var(--text-faint)' }}
      >
        <FiSliders className="h-5 w-5" />
        Theme
      </button>
    </nav>
  )
}
