import { NavLink } from 'react-router-dom'
import { FiHome, FiSearch, FiPackage, FiBarChart2 } from 'react-icons/fi'

const links = [
  { to: '/dashboard', label: 'Home', icon: FiHome },
  { to: '/lost-items', label: 'Lost', icon: FiSearch },
  { to: '/found-items', label: 'Found', icon: FiPackage },
  { to: '/analytics', label: 'Stats', icon: FiBarChart2 },
]

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 md:hidden">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'
            }`
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
