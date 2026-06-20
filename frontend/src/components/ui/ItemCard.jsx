import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiCalendar } from "react-icons/fi";
import { mediaUrl } from "../../utils/mediaUrl";

const statusStyles = {
Lost: "bg-red-100 text-red-700",
Found: "bg-blue-100 text-blue-700",
Recovered: "bg-green-100 text-green-700",
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
const dateField =
type === "lost" ? item.date_lost : item.date_found;

const status =
item.status || (type === "lost" ? "Lost" : "Found");

return (
<motion.div
layout
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
whileHover={{ y: -4 }}
onClick={() => navigate(`/lost-item/${item.id}`)}
className="cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
> <div className="relative">
{imageSrc ? ( <img
         src={imageSrc}
         alt={item.title}
         className="h-48 w-full object-cover"
       />
) : ( <div className="flex h-48 items-center justify-center text-6xl">
📦 </div>
)}

```
    <span
      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
        statusStyles[status] || statusStyles.Lost
      }`}
    >
      {status}
    </span>
  </div>

  <div className="p-4 text-left">
    <h3 className="text-lg font-semibold">
      {item.title}
    </h3>

    <p className="mt-1 text-sm text-gray-500">
      {item.description}
    </p>

    <div className="mt-3 flex flex-col gap-1 text-xs text-gray-500">
      <span className="flex items-center gap-1">
        <FiMapPin />
        {item.location}
      </span>

      <span className="flex items-center gap-1">
        <FiCalendar />
        {dateField}
      </span>
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/lost-item/${item.id}`);
        }}
        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
      >
        View Details
      </button>

      {canManage && onRecover && !item.is_recovered && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRecover(item.id);
          }}
          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
        >
          Mark Recovered
        </button>
      )}

      {canManage && onEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
        >
          Edit
        </button>
      )}

      {canManage && onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
        >
          Delete
        </button>
      )}
    </div>
  </div>
</motion.div>

);
}
