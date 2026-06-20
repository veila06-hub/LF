import { useEffect, useState } from "react";
import {
FiSearch,
FiPackage,
FiCheckCircle,
FiBell,
} from "react-icons/fi";

import api from "../api/axios";

export default function Dashboard() {
const [stats, setStats] = useState([]);

useEffect(() => {
loadStats();
}, []);

const loadStats = async () => {
try {
const response = await api.get("dashboard/");
setStats(response.data.stats);
} catch (error) {
console.log("Dashboard API Error:", error);
}
};

const getIcon = (title) => {
switch (title) {
case "Lost Items":
return FiSearch;
case "Found Items":
return FiPackage;
case "Recovered":
return FiCheckCircle;
case "Notifications":
return FiBell;
default:
return FiSearch;
}
};

return ( <div className="space-y-8"> <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-xl"> <h1 className="text-4xl font-bold">
Lost & Found Management System </h1>

```
    <p className="mt-3 text-indigo-100 text-lg">
      Smart AI-powered platform for tracking, matching,
      and recovering lost items.
    </p>
  </div>

  <div className="grid md:grid-cols-4 gap-6">
    {stats.map((item) => {
      const Icon = getIcon(item.title);

      return (
        <div
          key={item.title}
          className="bg-slate-800 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex justify-between items-center">
            <Icon
              size={28}
              className="text-indigo-400"
            />

            <span className="text-3xl font-bold text-white">
              {item.value}
            </span>
          </div>

          <p className="mt-4 text-gray-400">
            {item.title}
          </p>
        </div>
      );
    })}
  </div>

  <div className="grid md:grid-cols-2 gap-6">
    <div className="bg-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        Recent Activity
      </h2>

      <div className="space-y-4">
        <div className="border-l-4 border-green-500 pl-4">
          <p className="text-white">
            Samsung Phone matched successfully
          </p>
          <p className="text-gray-400 text-sm">
            10 minutes ago
          </p>
        </div>

        <div className="border-l-4 border-blue-500 pl-4">
          <p className="text-white">
            New found item reported
          </p>
          <p className="text-gray-400 text-sm">
            30 minutes ago
          </p>
        </div>

        <div className="border-l-4 border-yellow-500 pl-4">
          <p className="text-white">
            Wallet recovered successfully
          </p>
          <p className="text-gray-400 text-sm">
            1 hour ago
          </p>
        </div>
      </div>
    </div>

    <div className="bg-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        Smart Match Status
      </h2>

      <div className="space-y-4">
        <div>
          <p className="text-gray-300">
            AI Match Accuracy
          </p>

          <div className="w-full bg-slate-700 rounded-full h-4 mt-2">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: "92%" }}
            ></div>
          </div>

          <p className="text-green-400 mt-2">
            92%
          </p>
        </div>

        <div>
          <p className="text-gray-300">
            Recovery Success Rate
          </p>

          <div className="w-full bg-slate-700 rounded-full h-4 mt-2">
            <div
              className="bg-indigo-500 h-4 rounded-full"
              style={{ width: "77%" }}
            ></div>
          </div>

          <p className="text-indigo-400 mt-2">
            77%
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

);
}
