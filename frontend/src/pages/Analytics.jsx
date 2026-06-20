import {
  FiPackage,
  FiCheckCircle,
  FiSearch,
  FiTrendingUp,
  FiBarChart2,
  FiMapPin,
} from "react-icons/fi";

import { motion } from "framer-motion";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";

const EASE = [0.22, 1, 0.36, 1];

export default function Analytics() {
  const stats = [
    {
      title: "Lost Items",
      value: "124",
      icon: FiSearch,
    },
    {
      title: "Found Items",
      value: "98",
      icon: FiPackage,
    },
    {
      title: "Recovered",
      value: "76",
      icon: FiCheckCircle,
    },
    {
      title: "Recovery Rate",
      value: "77%",
      icon: FiTrendingUp,
    },
  ];

  const data = [
    { month: "Jan", lost: 20, found: 15 },
    { month: "Feb", lost: 35, found: 28 },
    { month: "Mar", lost: 42, found: 36 },
    { month: "Apr", lost: 38, found: 34 },
    { month: "May", lost: 45, found: 40 },
    { month: "Jun", lost: 30, found: 25 },
  ];

  // Live accent colours so the chart matches the active theme.
  const accent =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim() || "#6366f1";
  const accent2 =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--accent-2")
      .trim() || "#06b6d4";

  const tones = ["rose", "blue", "green", "violet"];

  const locations = [
    { emoji: "📚", name: "Library", count: 42 },
    { emoji: "🍔", name: "Canteen", count: 31 },
    { emoji: "🎤", name: "Auditorium", count: 19 },
    { emoji: "🏫", name: "Classroom Block", count: 15 },
  ];
  const maxLocation = Math.max(...locations.map((l) => l.count));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Insights"
        title="Analytics Dashboard"
        subtitle="Lost & Found system performance overview"
        icon={FiBarChart2}
      />

      <div className="grid gap-5 md:grid-cols-4">
        {stats.map((item, i) => {
          const isPercent = String(item.value).includes("%");
          const numeric = parseInt(item.value, 10) || 0;
          return (
            <StatCard
              key={item.title}
              title={item.title}
              value={numeric}
              icon={item.icon}
              tone={tones[i % tones.length]}
              delay={i * 0.08}
              hint={isPercent ? "of all reported items" : undefined}
            />
          );
        })}
      </div>

      <Card delay={0.1} className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>
            Recovery Performance
          </h2>
          <span className="text-2xl font-extrabold gradient-text">77%</span>
        </div>

        <div
          className="mt-5 h-6 w-full overflow-hidden rounded-full"
          style={{ background: "var(--surface-2)" }}
        >
          <motion.div
            className="h-6 rounded-full accent-grad"
            initial={{ width: 0 }}
            animate={{ width: "77%" }}
            transition={{ duration: 1, ease: EASE, delay: 0.3 }}
          />
        </div>

        <p className="mt-3 text-sm muted">
          <span className="accent-text font-semibold">77%</span> Recovery Success Rate
        </p>
      </Card>

      <Card delay={0.15} className="p-6">
        <h2 className="mb-4 text-xl font-semibold" style={{ color: "var(--text)" }}>
          Monthly Lost vs Found Trend
        </h2>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />

              <XAxis dataKey="month" tick={{ fill: "#94a3b8" }} stroke="rgba(148,163,184,0.25)" />

              <YAxis tick={{ fill: "#94a3b8" }} stroke="rgba(148,163,184,0.25)" />

              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--text)",
                }}
              />

              <Legend wrapperStyle={{ color: "#94a3b8" }} />

              <Line
                type="monotone"
                dataKey="lost"
                stroke={accent}
                strokeWidth={3}
                dot={{ r: 3, fill: accent }}
                activeDot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="found"
                stroke={accent2}
                strokeWidth={3}
                dot={{ r: 3, fill: accent2 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card delay={0.2} className="p-6">
        <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold" style={{ color: "var(--text)" }}>
          <FiMapPin className="accent-text" />
          Top Locations
        </h2>

        <div className="space-y-4">
          {locations.map((loc, i) => (
            <motion.div
              key={loc.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.06, duration: 0.45, ease: EASE }}
            >
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium" style={{ color: "var(--text)" }}>
                  <span className="mr-2">{loc.emoji}</span>
                  {loc.name}
                </span>
                <span className="muted">{loc.count} Items</span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full"
                style={{ background: "var(--surface-2)" }}
              >
                <motion.div
                  className="h-2 rounded-full accent-grad"
                  initial={{ width: 0 }}
                  animate={{ width: `${(loc.count / maxLocation) * 100}%` }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.8, ease: EASE }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
