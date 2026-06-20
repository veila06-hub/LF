import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
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
  FiCompass,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

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
};

export default function Sidebar() {
  const { modules, roles, username } = useAuth();

  return (
    <aside
      className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r p-5 md:flex"
      style={{
        background: "var(--sidebar-bg)",
        backdropFilter: "blur(20px)",
        borderColor: "var(--border)",
      }}
    >
      {/* Brand */}
      <div className="mb-8 flex items-center gap-3 px-1">
        <div className="accent-grad grid h-11 w-11 place-items-center rounded-2xl text-white shadow-lg">
          <FiCompass size={22} />
        </div>
        <div className="leading-tight">
          <h1 className="text-[15px] font-bold tracking-tight" style={{ color: "var(--text)" }}>
            Lost &amp; Found
          </h1>
          <p className="text-xs faint">Smart Recovery</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {modules.map(({ key, label, path }) => {
          const Icon = ICONS[key] || FiHome;
          return (
            <NavLink key={path} to={path} className="block">
              {({ isActive }) => (
                <div className="group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors">
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="accent-grad absolute inset-0 rounded-xl opacity-100 shadow-lg"
                      style={{ boxShadow: "0 10px 26px -12px var(--accent)" }}
                    />
                  )}
                  <span
                    className="relative z-10 grid place-items-center"
                    style={{ color: isActive ? "#fff" : "var(--text-muted)" }}
                  >
                    <Icon size={18} />
                  </span>
                  <span
                    className="relative z-10"
                    style={{ color: isActive ? "#fff" : "var(--text-muted)" }}
                  >
                    {label}
                  </span>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User chip */}
      <div className="mt-4 rounded-2xl border p-3" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
        <div className="flex items-center gap-3">
          <div className="accent-grad grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white uppercase">
            {(username || "?").slice(0, 1)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold" style={{ color: "var(--text)" }}>
              {username || "Guest"}
            </p>
            <p className="truncate text-xs faint">{roles?.join(", ") || "No role"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
