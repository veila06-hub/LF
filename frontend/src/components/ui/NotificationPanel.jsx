import { motion } from "framer-motion";
import { FiBell } from "react-icons/fi";

export default function NotificationPanel() {
  const notifications = [
    {
      id: 1,
      text: "Match found for Samsung Phone",
    },
    {
      id: 2,
      text: "Claim verified successfully",
    },
    {
      id: 3,
      text: "New found item added",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card absolute right-0 mt-2 w-80 rounded-2xl p-4 z-50 shadow-2xl"
    >
      <div className="flex items-center gap-2 mb-3">
        <FiBell className="accent-text" size={16} />
        <h3 className="font-bold" style={{ color: "var(--text)" }}>
          Notifications
        </h3>
      </div>

      <div className="space-y-1">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="rounded-xl px-3 py-3 text-sm transition-colors hover:brightness-110"
            style={{ color: "var(--text)", background: "var(--surface-2)" }}
          >
            {n.text}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
