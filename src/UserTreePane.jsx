import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function UserTreePane({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative">
      {/* LEFT TREE PANEL */}
      <div
        className={`
          h-screen bg-white shadow-md border-r transition-all duration-300 
          overflow-hidden
          ${collapsed ? "w-0" : "w-72"}
        `}
      >
        <div className="h-full overflow-y-auto p-4 pr-6">
          {children}
        </div>
      </div>

      {/* COLLAPSE BUTTON */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 -right-4 z-50 
                   bg-gray-200 hover:bg-gray-300 
                   rounded-full p-1 shadow transition"
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </div>
  );
}
