import { Link, useLocation } from 'react-router-dom';
import { Menu, LayoutDashboard, UserPlus, BarChart, Users, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGetSessionUser } from './SessionContext'; // ✅ import

const iconMap = {
  dashboard: LayoutDashboard,
  smtpsettings: Settings,
  users: Users,
  newlead: UserPlus,
  leadanalytics: BarChart,
};

export default function Sidebar({ auth, setAuth}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation(); // for active route highlighting
  const { menu, setMenu } = useGetSessionUser(); // ✅ get menu from context

useEffect(() => {
  console.log('Menu items:', menu);
  debugger;
}, [menu]);

  debugger;

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-md transition-all duration-300`}>
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <h2 className={`text-xl font-bold ${!sidebarOpen && 'hidden'}`}>CRM Panel</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded hover:bg-gray-200"
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="mt-6 space-y-2 px-2">
        {!Array.isArray(menu) || menu.length === 0 ? (
          <p className="px-2 text-sm text-gray-500">
            No tasks assigned to the user. Contact admin.
          </p>
        ) : (
          menu
            .filter((item) => {
              // Optional: filter by role if you have allowedRoles in backend
              if (!auth || !auth.role) return false;
              return true; // or add role-based filtering
            })
            .map((item) => {
              const Icon = iconMap[item.icon]; // dynamically pick icon
              const isActive = location.pathname === item.route;
              return (
                <Link
                  key={item.route}
                  to={item.route}
                  className={`flex items-center gap-3 p-2 rounded hover:bg-blue-100 ${
                    isActive ? 'bg-blue-200 font-bold' : ''
                  }`}
                >
                  {Icon && <Icon size={20} />}
                  {sidebarOpen && item.menuName}
                </Link>
              );
            })
        )}
      </nav>
    </div>
  );
}
