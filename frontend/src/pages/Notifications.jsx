import { motion } from "framer-motion";
import { FiBell, FiCheckCircle, FiPackage, FiZap } from "react-icons/fi";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      message: "Smart Match Found for Samsung Phone",
      time: "2 minutes ago",
    },
    {
      id: 2,
      message: "New Found Item Added",
      time: "10 minutes ago",
    },
    {
      id: 3,
      message: "Claim Verification Successful",
      time: "1 hour ago",
    },
  ];

  const iconFor = (id) => {
    if (id === 1) return FiZap;
    if (id === 2) return FiPackage;
    return FiCheckCircle;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        eyebrow="Activity"
        title="Notifications"
        subtitle="Stay up to date with matches, claims and new items."
        icon={FiBell}
      />

      <div className="space-y-4">
        {notifications.map((notification, index) => {
          const Icon = iconFor(notification.id);
          return (
            <Card
              key={notification.id}
              hover
              delay={index * 0.08}
              className="p-5"
            >
              <div className="flex items-start gap-4">
                <div className="accent-soft grid h-11 w-11 shrink-0 place-items-center rounded-2xl">
                  <Icon className="accent-text" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold" style={{ color: "var(--text)" }}>
                    {notification.message}
                  </h3>
                  <p className="text-sm faint mt-1">{notification.time}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
