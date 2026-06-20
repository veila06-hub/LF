import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiPackage,
  FiCheckCircle,
  FiBell,
  FiArrowUpRight,
  FiActivity,
  FiZap,
} from "react-icons/fi";
import api from "../api/axios";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";

const TONES = { "Lost Items": "blue", "Found Items": "violet", Recovered: "green", Notifications: "amber" };
const ICONS = { "Lost Items": FiSearch, "Found Items": FiPackage, Recovered: FiCheckCircle, Notifications: FiBell };

const ACTIVITY = [
  { color: "#22c55e", title: "Samsung Phone matched successfully", time: "10 minutes ago" },
  { color: "#3b82f6", title: "New found item reported", time: "30 minutes ago" },
  { color: "#f59e0b", title: "Wallet recovered successfully", time: "1 hour ago" },
  { color: "#8b5cf6", title: "New claim verified via QR", time: "2 hours ago" },
];

function ProgressBar({ label, value, delay }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="muted">{label}</span>
        <span className="font-bold gradient-text">{value}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-3)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
          className="accent-grad h-full rounded-full"
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { username } = useAuth();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    api
      .get("dashboard/")
      .then((res) => setStats(res.data.stats || []))
      .catch((err) => console.log("Dashboard API Error:", err));
  }, []);

  return (
    <div className="space-y-7">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="accent-grad relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-black/10 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
            <FiZap size={12} /> Smart Recovery System
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
            Welcome back{username ? `, ${username}` : ""} 👋
          </h1>
          <p className="mt-2 max-w-xl text-white/85">
            Your AI-powered platform for tracking, matching and recovering lost items.
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, i) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={ICONS[item.title] || FiSearch}
            tone={TONES[item.title]}
            delay={i * 0.08}
          />
        ))}
      </div>

      {/* Two-column */}
      <div className="grid gap-5 lg:grid-cols-5">
        <Card delay={0.2} className="p-6 lg:col-span-3">
          <div className="mb-5 flex items-center gap-2">
            <FiActivity className="accent-text" />
            <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
              Recent Activity
            </h2>
          </div>
          <div className="space-y-1">
            {ACTIVITY.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-[var(--surface-2)]"
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: a.color, boxShadow: `0 0 12px ${a.color}` }} />
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{a.title}</p>
                  <p className="text-xs faint">{a.time}</p>
                </div>
                <FiArrowUpRight className="faint" />
              </motion.div>
            ))}
          </div>
        </Card>

        <Card delay={0.28} className="p-6 lg:col-span-2">
          <h2 className="mb-6 text-lg font-bold" style={{ color: "var(--text)" }}>
            Smart Match Status
          </h2>
          <div className="space-y-6">
            <ProgressBar label="AI Match Accuracy" value={92} delay={0.4} />
            <ProgressBar label="Recovery Success Rate" value={77} delay={0.55} />
            <ProgressBar label="Claims Verified" value={64} delay={0.7} />
          </div>
          <div className="mt-7 rounded-2xl p-4" style={{ background: "var(--surface-2)" }}>
            <p className="text-sm muted">
              Matching engine is <span className="font-semibold accent-text">active</span> and scanning
              new reports in real time.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
