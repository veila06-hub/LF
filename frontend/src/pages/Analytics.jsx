import {
  FiPackage,
  FiCheckCircle,
  FiSearch,
  FiTrendingUp,
  } from "react-icons/fi";
  
  import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  } from "recharts";
  
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
  
  return ( <div className="space-y-8"> <div> <h1 className="text-3xl font-bold text-white">
  Analytics Dashboard </h1>
  
  ```
      <p className="text-gray-400">
        Lost & Found system performance overview
      </p>
    </div>
  
    <div className="grid md:grid-cols-4 gap-6">
      {stats.map((item) => {
        const Icon = item.icon;
  
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
  
    <div className="bg-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        Recovery Performance
      </h2>
  
      <div className="w-full bg-slate-700 rounded-full h-6">
        <div
          className="bg-green-500 h-6 rounded-full"
          style={{ width: "77%" }}
        ></div>
      </div>
  
      <p className="text-green-400 mt-3">
        77% Recovery Success Rate
      </p>
    </div>
  
    <div className="bg-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        Monthly Lost vs Found Trend
      </h2>
  
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
  
          <XAxis dataKey="month" />
  
          <YAxis />
  
          <Tooltip />
  
          <Line
            type="monotone"
            dataKey="lost"
            stroke="#ef4444"
            strokeWidth={3}
          />
  
          <Line
            type="monotone"
            dataKey="found"
            stroke="#22c55e"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  
    <div className="bg-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        Top Locations
      </h2>
  
      <div className="space-y-4">
        <div className="flex justify-between text-gray-300">
          <span>📚 Library</span>
          <span>42 Items</span>
        </div>
  
        <div className="flex justify-between text-gray-300">
          <span>🍔 Canteen</span>
          <span>31 Items</span>
        </div>
  
        <div className="flex justify-between text-gray-300">
          <span>🎤 Auditorium</span>
          <span>19 Items</span>
        </div>
  
        <div className="flex justify-between text-gray-300">
          <span>🏫 Classroom Block</span>
          <span>15 Items</span>
        </div>
      </div>
    </div>
  </div>

  );
  }
  