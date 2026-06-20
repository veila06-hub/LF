import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiSun,
  FiMoon,
  FiLogOut,
  FiBell,
  FiSliders,
  FiUsers,
  FiLock,
} from "react-icons/fi";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar({ onOpenCustomizer }) {
  const { username, isAuthenticated, logout, can } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const canSeeNotifications = can("notifications", "view");
  const canManageUsers = can("users", "view");
  const canManageRoles = can("roles", "view");

  useEffect(() => {
    if (canSeeNotifications) loadNotifications();
  }, [canSeeNotifications]);

  const loadNotifications = async () => {
    try {
      const { data } = await api.get("/notifications/");
      setNotifications(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const iconBtn =
    "btn-ghost grid h-10 w-10 place-items-center rounded-xl transition-all";

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{
        borderColor: "var(--border)",
        background:
          "color-mix(in srgb, var(--bg) 72%, transparent)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-8">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold gradient-text">
            Lost &amp; Found Portal
          </h1>
          {isAuthenticated && (
            <p className="truncate text-xs faint">Welcome back, {username}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          {canSeeNotifications && (
            <div className="relative">
              <button
                onClick={() => setShowNotifications((s) => !s)}
                className={iconBtn}
              >
                <FiBell className="h-5 w-5" />
              </button>
              {notifications.length > 0 && (
                <span className="accent-grad pulse-ring absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold text-white">
                  {notifications.length}
                </span>
              )}

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    className="glass-card absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl"
                  >
                    <div className="border-b p-4" style={{ borderColor: "var(--border)" }}>
                      <h3 className="font-semibold" style={{ color: "var(--text)" }}>
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-sm muted">No notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className="border-b p-4 text-sm last:border-0"
                            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                          >
                            {n.message}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button onClick={onOpenCustomizer} className={iconBtn} title="Customize theme">
            <FiSliders className="h-5 w-5" />
          </button>

          <button
            onClick={toggleTheme}
            className={iconBtn}
            title={dark ? "Light mode" : "Dark mode"}
          >
            {dark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>

          {isAuthenticated ? (
            <>
              {canManageUsers && (
                <NavLink to="/user-management" className={`${iconBtn} hidden sm:grid`} title="Users">
                  <FiUsers className="h-5 w-5" />
                </NavLink>
              )}
              {canManageRoles && (
                <NavLink to="/permission-matrix" className={`${iconBtn} hidden sm:grid`} title="Roles">
                  <FiLock className="h-5 w-5" />
                </NavLink>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500/20"
              >
                <FiLogOut /> <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
