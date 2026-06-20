import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiCalendar, FiEdit2, FiTrash2, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { mediaUrl } from "../../utils/mediaUrl";

const statusStyles = {
  Lost: "bg-red-500/15 text-red-400 border border-red-500/20",
  Found: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  Recovered: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
};

export default function ItemCard({
  item,
  type = "lost",
  onEdit,
  onDelete,
  onRecover,
  canManage,
}) {
  const navigate = useNavigate();
  const imageSrc = mediaUrl(item.image);
  const dateField = type === "lost" ? item.date_lost : item.date_found;
  const status = item.status || (type === "lost" ? "Lost" : "Found");
  const detailPath = type === "lost" ? `/lost-item/${item.id}` : `/found-item/${item.id}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(detailPath)}
      className="glass-card card-hover group cursor-pointer overflow-hidden rounded-2xl"
    >
      <div className="relative h-44 overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="accent-grad flex h-full w-full items-center justify-center text-5xl opacity-90">
            📦
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${
            statusStyles[status] || statusStyles.Lost
          }`}
        >
          {status}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>
          {item.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm muted">{item.description}</p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs faint">
          <span className="flex items-center gap-1.5">
            <FiMapPin /> {item.location}
          </span>
          <span className="flex items-center gap-1.5">
            <FiCalendar /> {dateField}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(detailPath);
            }}
            className="accent-soft flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition hover:brightness-110"
          >
            View <FiArrowRight size={12} />
          </button>

          {canManage && onRecover && !item.is_recovered && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRecover(item.id); }}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/25"
            >
              <FiCheckCircle size={13} /> Recover
            </button>
          )}
          {canManage && onEdit && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onEdit(item); }}
              className="btn-ghost grid h-8 w-8 place-items-center rounded-lg"
            >
              <FiEdit2 size={13} />
            </button>
          )}
          {canManage && onDelete && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
              className="grid h-8 w-8 place-items-center rounded-lg bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
            >
              <FiTrash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
