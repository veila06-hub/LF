import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiCalendar, FiTag, FiCheckCircle, FiFileText } from "react-icons/fi";
import api from "../api/axios";
import { toast } from "react-toastify";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const EASE = [0.22, 1, 0.36, 1];

export default function LostItemDetail() {
  const { id } = useParams();

  const [item, setItem] = useState(null);

  useEffect(() => {
    loadItem();
  }, []);

  const loadItem = async () => {
    try {
      const res = await api.get(`/lost-item/${id}/`);
      setItem(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const markRecovered = async () => {
    try {
      await api.put(`/lost-items/${id}/recover/`);

      setItem({
        ...item,
        status: "Recovered",
        is_recovered: true,
      });

      toast.success("Item marked as recovered");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update item");
    }
  };

  if (!item) {
    return <LoadingSpinner />;
  }

  const details = [
    { label: "Description", value: item.description, icon: FiFileText },
    { label: "Location", value: item.location, icon: FiMapPin },
    { label: "Date Lost", value: item.date_lost, icon: FiCalendar },
    { label: "Status", value: item.status, icon: FiTag },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-3xl space-y-6 p-2 sm:p-4"
    >
      <Card delay={0.05} className="overflow-hidden">
        {item.image && (
          <div className="relative h-72 overflow-hidden">
            <img
              src={`http://127.0.0.1:8000${item.image}`}
              alt={item.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] accent-text">
            Lost Item
          </p>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">
            {item.title}
          </h1>

          <div className="mt-6 space-y-4">
            {details.map(({ label, value, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: EASE }}
                className="flex items-start gap-3 rounded-xl p-3"
                style={{ background: "var(--surface-2)" }}
              >
                <div className="accent-soft mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide faint">{label}</p>
                  <p className="mt-0.5" style={{ color: "var(--text)" }}>{value}</p>
                </div>
              </motion.div>
            ))}

            {!item.is_recovered && (
              <Button
                variant="primary"
                size="lg"
                icon={FiCheckCircle}
                onClick={markRecovered}
                className="mt-2"
              >
                Mark as Recovered
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
