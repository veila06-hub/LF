import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

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

    alert("Item marked as recovered");
  } catch (err) {
    console.log(err);
    alert("Failed to update item");
  }
};
if (!item) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
}

return (
  <div className="p-6">
    <div className="rounded-2xl bg-white shadow-lg p-6">
      {item.image && (
        <img
          src={`http://127.0.0.1:8000${item.image}`}
          alt={item.title}
          className="w-full h-72 object-cover rounded-xl mb-6"
        />
      )}
      <h1 className="text-3xl font-bold text-indigo-600">
        {item.title}
      </h1>

      <div className="mt-6 space-y-3">

        <p>
          <strong>Description:</strong>
          {" "}
          {item.description}
        </p>

        <p>
          <strong>Location:</strong>
          {" "}
          {item.location}
        </p>

        <p>
          <strong>Date Lost:</strong>
          {" "}
          {item.date_lost}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {item.status}
        </p>

        {!item.is_recovered && (
          <button
            onClick={markRecovered}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
          >
            Mark as Recovered
          </button>
        )}
      </div>
    </div>
  </div>
);
}
