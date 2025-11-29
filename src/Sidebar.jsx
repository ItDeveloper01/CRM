import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  LayoutDashboard,
  UserPlus,
  BarChart,
  Users,
  Settings,
  Megaphone,
  CheckSquare2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGetSessionUser } from './SessionContext';
import { ChevronRight, ChevronDown } from 'lucide-react';

 

const iconMap = {
  dashboard: LayoutDashboard,
  smtpsettings: Settings,
  users: Users,
  newlead: UserPlus,
  leadanalytics: BarChart,
  broadcastmessage: Megaphone,
};

// Helper: build nested tree from flat menu
function buildMenuTree(items, parentId = null) {
  debugger;
  return items
    .filter((item) => item.parent_MenuID === parentId)
    .map((item) => ({
      ...item,
      children: buildMenuTree(items, item.id),
    }));
}

export default function Sidebar({ auth }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({}); // store open state keyed by menu ID
  const location = useLocation();
  const { menu } = useGetSessionUser();
  const [menuTree,setmenuTree]=useState([]);

  const toggleMenu = (id) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(()=>{

    debugger;
    console.log("Menu From session:" ,menu);
  let tempmenuTree = menu ? buildMenuTree(menu) : [];
  setmenuTree(tempmenuTree);

  },[] );
  
  
  useEffect (()=>
  {
debugger;
console.log("Contructed Menu Tree: ", menuTree);

  },[menuTree]);
  
  
  const renderMenuItems = (items) =>
  items.map((item) => {
    const Icon = iconMap[item.icon];
    const isActive = location.pathname === item.route;
    const isOpen = openMenus[item.id];
    const hasChildren = item.children?.length > 0;

    return (
      <div key={item.id}>
        {/* Parent Menu (only if has children) */}
        {hasChildren ? (
          <div
            className={`flex items-center gap-3 p-2 rounded hover:bg-blue-100 cursor-pointer ${
              isActive ? 'bg-blue-200 font-bold' : ''
            }`}
            onClick={() => toggleMenu(item.id)}
          >
            {Icon && <Icon size={20} />}
            {sidebarOpen && item.menuName}
           
          <span className="ml-auto">
            {isOpen ? (
              <ChevronDown  size={20} strokeWidth={2} />
            ) : (
              <ChevronRight size={20} strokeWidth={2} />
            )}
          </span>
          </div>
        ) : (
          /* Leaf Link (only if NO children) */
          <Link
            to={item.route}
            className={`flex items-center gap-3 p-2 rounded hover:bg-blue-100 ${
              isActive ? 'bg-blue-200 font-bold' : ''
            }`}
          >
            {Icon && <Icon size={20} />}
            {sidebarOpen && item.menuName}
          </Link>
        )}

        {/* Render submenu when open */}
        {hasChildren && isOpen && (
          <div className="pl-6">{renderMenuItems(item.children)}</div>
        )}
      </div>
    );
  });


  

  return (
    <div
      className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-md transition-all duration-300`}
    >
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
          renderMenuItems(menuTree)
        )}
      </nav>
    </div>
  );
}
