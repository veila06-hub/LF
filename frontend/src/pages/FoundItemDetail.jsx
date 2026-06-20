import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPackage, FiHash } from "react-icons/fi";
import Card from "../components/ui/Card";

export default function FoundItemDetail() {
  const { id } = useParams();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-3xl p-2 sm:p-4"
    >
      <Card delay={0.05} className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="accent-grad grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-lg">
            <FiPackage size={22} />
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] accent-text">
              Found Item
            </p>
            <h1 className="text-3xl font-bold tracking-tight gradient-text">
              Found Item Details
            </h1>
          </div>
        </div>

        <div
          className="mt-6 flex items-center gap-3 rounded-xl p-4"
          style={{ background: "var(--surface-2)" }}
        >
          <div className="accent-soft grid h-9 w-9 shrink-0 place-items-center rounded-lg">
            <FiHash size={16} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide faint">Item ID</p>
            <p className="mt-0.5" style={{ color: "var(--text)" }}>{id}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
