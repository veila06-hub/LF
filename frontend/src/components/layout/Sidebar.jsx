import { NavLink } from "react-router-dom";
import {
FiHome,
FiSearch,
FiPackage,
FiBarChart2,
FiZap,
FiShield,
FiBell
} from "react-icons/fi";

const links = [
{
to: "/dashboard",
label: "Dashboard",
icon: FiHome,
},
{
to: "/lost-items",
label: "Lost Items",
icon: FiSearch,
},
{
to: "/found-items",
label: "Found Items",
icon: FiPackage,
},
{
to: "/matches",
label: "Smart Matches",
icon: FiZap,
},
{
  to: "/verify",
  label: "Verify Claim",
  icon: FiShield,
},
{
  to: "/notifications",
  label: "Notifications (3)",
  icon: FiBell,
},
{
to: "/analytics",
label: "Analytics",
icon: FiBarChart2,
},
];

export default function Sidebar() {
return ( <aside className="hidden md:flex w-64 flex-col bg-slate-900 border-r border-slate-800 p-4"> <div className="mb-8"> <h1 className="text-xl font-bold text-white">
Lost & Found Portal </h1> <p className="text-sm text-gray-400">
Smart Recovery System </p> </div>

```
  <nav className="space-y-2">
    {links.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
            isActive
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
              : "text-gray-300 hover:bg-slate-800 hover:text-white"
          }`
        }
      >
        <Icon size={18} />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
</aside>


);
}
