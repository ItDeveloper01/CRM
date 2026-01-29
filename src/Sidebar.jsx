import { Link, useLocation } from "react-router-dom";

import {
  Menu,
  LayoutDashboard,
  UserPlus,
  BarChart,
  Users,
  Settings,
  Megaphone,
  PieChart,
  ChartColumn,
  ChevronRight,
  ChevronDown,
  Bell
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGetSessionUser } from "./SessionContext";
import React from "react";
import ReminderPanel from "./ReminderPanel";


/* ---------------- ICON MAP ---------------- */

const iconMap = {
  dashboard: LayoutDashboard,
  smtpsettings: Settings,
  users: Users,
  newlead: UserPlus,
  leadanalytics: BarChart,
  broadcastmessage: Megaphone,
  "my dashboard": PieChart,
  "my team": ChartColumn
};

/* ---------------- BUILD MENU TREE ---------------- */

function buildMenuTree(items, parentId = null) {
  return items
    .filter(item => item.parent_MenuID === parentId)
    .map(item => ({
      ...item,
      children: buildMenuTree(items, item.id)
    }));
}

/* ---------------- DUMMY REMINDERS ---------------- */

const dummyReminders = [
  { id: 1, type: "Birthday", text: "Rahul Patil", urgent: true },
  { id: 2, type: "Birthday", text: "Sneha Joshi", urgent: false },
  { id: 3, type: "Anniversary", text: "Amit Shah", urgent: false },
  { id: 4, type: "Visa Expiry", text: "John – 15 Dec", urgent: true },
  { id: 5, type: "Visa Expiry", text: "Maria – 20 Dec", urgent: false }
];

/* ---------------- REMINDER PANEL ---------------- */

// function ReminderPanel({ reminders }) {
//   const grouped = reminders.reduce((acc, r) => {
//     acc[r.type] = acc[r.type] || [];
//     acc[r.type].push(r);
//     return acc;
//   }, {});

//   return (
// <div className="relative mx-2 mb-3 rounded-lg p-[2px] rainbow-border">
//   <div className="bg-white rounded-lg shadow-sm h-120 flex flex-col">
//       {/* Header */}
//     <div className="font-bold p-2 border-b flex items-center justify-center animate-pulse text-red-600">
//   <Bell size={18} /> REMINDERS
//       </div>

//       {/* Marquee container */}
//       <div className="relative h-60 overflow-hidden text-sm px-2 py-1">
//         {/* Moving content */}
//         <div className="animate-vertical-marquee">
//           {/* Original content */}
//           {Object.keys(grouped).map(group => (
//             <div key={group} className="mb-2">
//               <div className="font-semibold">{group}</div>
//               {grouped[group].map(r => (
//                 <div
//                   key={r.id}
//                   className={`pl-2 py-0.5 rounded ${
//                     r.urgent
//                       ? "bg-red-100 text-red-700 font-semibold"
//                       : "text-gray-700"
//                   }`}
//                 >
//                   • {r.text}
//                 </div>
//               ))}
//             </div>
//           ))}

//           {/* Duplicate content for infinite scroll */}
//           {Object.keys(grouped).map(group => (
//             <div key={`${group}-dup`} className="mb-2">
//               <div className="font-semibold">{group}</div>
//               {grouped[group].map(r => (
//                 <div
//                   key={`${r.id}-dup`}
//                   className={`pl-2 py-0.5 rounded ${
//                     r.urgent
//                       ? "bg-red-100 text-red-700 font-semibold"
//                       : "text-gray-700"
//                   }`}
//                 >
//                   • {r.text}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Marquee animation */}
//       <style>{`
//         @keyframes vertical-marquee {
//           0% {
//             transform: translateY(0%);
//           }
//           100% {
//             transform: translateY(-50%);
//           }
//         }

//         .animate-vertical-marquee {
//           animation: vertical-marquee 20s linear infinite;
//         }
//       `}</style>
//     </div>
//     </div>
//   );
// }


/* ---------------- SIDEBAR ---------------- */

export default function Sidebar() {
  const location = useLocation();
  const { menu } = useGetSessionUser();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  const [menuTree, setMenuTree] = useState([]);

  const toggleMenu = id => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (Array.isArray(menu)) {
      setMenuTree(buildMenuTree(menu));
    }
  }, [menu]);

  const renderMenuItems = items =>
    items.map(item => {
      const Icon = iconMap[item.icon];
      const isActive = location.pathname === item.route;
      const isOpen = openMenus[item.id];
      const hasChildren = item.children?.length > 0;

      return (
        <div key={item.id}>
          {hasChildren ? (
            <div
              onClick={() => toggleMenu(item.id)}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-blue-100 ${
                isActive ? "bg-blue-200 font-bold" : ""
              }`}
            >
              {Icon && <Icon size={20} />}
              {sidebarOpen && item.menuName}
              <span className="ml-auto">
                {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </span>
            </div>
          ) : (
            <Link
              to={item.route}
              className={`flex items-center gap-3 p-2 rounded hover:bg-blue-100 ${
                isActive ? "bg-blue-200 font-bold" : ""
              }`}
            >
              {Icon && <Icon size={20} />}
              {sidebarOpen && item.menuName}
            </Link>
          )}

          {hasChildren && isOpen && (
            <div className="pl-6">{renderMenuItems(item.children)}</div>
          )}
        </div>
      );
    });

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-white shadow-md transition-all duration-300 flex flex-col`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <h2 className={`text-xl font-bold ${!sidebarOpen && "hidden"}`}>
          CRM Panel
        </h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded hover:bg-gray-200"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* MENU */}
      <nav className="mt-4 space-y-2 px-2 flex-1 overflow-y-auto">
       {!Array.isArray(menu) || menu.length === 0 ? (
          <p className="px-2 text-sm text-gray-500">
            No tasks assigned to the user. Contact admin.
          </p>
        ) : (
          renderMenuItems(menuTree)
        )}
      </nav>

      {/* 🔔 REMINDERS PANEL AT BOTTOM */}
      {sidebarOpen && dummyReminders.length > 0 && (
        <ReminderPanel reminders={dummyReminders} />
      )}
    </div>
  );
}
