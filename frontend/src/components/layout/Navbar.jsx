import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiSun,
  FiMoon,
  FiLogOut,
  FiBell,
} from "react-icons/fi";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { username, isAuthenticated, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] =
    useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const { data } = await api.get("/notifications/");
      setNotifications(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold text-indigo-600">
            Lost & Found Portal
          </h1>

          {isAuthenticated && (
            <p className="text-sm text-gray-500">
              Welcome, {username}
            </p>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* Notifications */}
          <div className="relative">

            <button
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
              className="rounded-xl border border-gray-200 p-2.5 text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <FiBell className="h-5 w-5" />
            </button>

            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {notifications.length}
            </span>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">

                <div className="border-b p-4 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                </div>

                {notifications.length === 0 ? (
                  <p className="p-4 text-gray-500">
                    No notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="border-b p-4 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300"
                    >
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-gray-200 p-2.5 text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            title={
              dark ? "Light mode" : "Dark mode"
            }
          >
            {dark ? (
              <FiSun className="h-5 w-5" />
            ) : (
              <FiMoon className="h-5 w-5" />
            )}
          </button>

         {/* Login / Logout */}
        {isAuthenticated ? (
          <>
            <NavLink
              to="/user-management"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Users
            </NavLink>

            <NavLink
              to="/permission-matrix"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Permissions
            </NavLink>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
            >
              <FiLogOut />
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Login
          </NavLink>
        )}
        </div>
      </div>
    </header>
  );
}
