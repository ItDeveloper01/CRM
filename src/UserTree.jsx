// import React, { useState } from "react";

// export default function UserTree({ data, onUserClick }) {
//   return (
//     <div className="p-2">
//       <TreeNode node={data} onUserClick={onUserClick} />
//     </div>
//   );
// }

// // Role badge map - with soft pastel modern colors
// const ROLE_BADGE = {
//   1: { text: "Super Admin", color: "bg-red-400" },
//   2: { text: "Admin",       color: "bg-orange-400" },
//   3: { text: "HOD",         color: "bg-purple-400" },
//   4: { text: "Manager",     color: "bg-blue-400" },
//   5: { text: "User",        color: "bg-green-400" }
// };

// function TreeNode({ node, onUserClick }) {
//   const roleMeta = ROLE_BADGE[node.roleId] || { text: "Unknown", color: "bg-gray-400" };
//   const [expanded, setExpanded] = useState(true);
//   const [hover, setHover] = useState(false);

//   const hasChildren = node.subordinate && node.subordinate.length > 0;

//   return (
//     <div className="ml-3 relative">

//       {/* Row */}
//       <div
//         className="flex items-center gap-2 mb-1 relative"
//         onMouseEnter={() => setHover(true)}
//         onMouseLeave={() => setHover(false)}
//       >

//         {/* Clean slim arrow */}
//         {hasChildren ? (
//           <button
//             onClick={() => setExpanded(!expanded)}
//             className="text-sm text-gray-600 hover:text-black transition"
//           >
//             {expanded ? "▾" : "▸"}
//           </button>
//         ) : (
//           <span className="text-sm opacity-0">•</span>
//         )}

//         {/* Slim Node Button */}
//         <button
//           onClick={() => onUserClick(node)}
//           className="
//             px-2 py-1 
//             bg-gray-100 
//             hover:bg-gray-200 
//             border 
//             border-gray-300 
//             rounded-md 
//             text-sm 
//             text-gray-800
//             shadow-sm
//             transition
//           "
//         >
//           {node.fName} {node.lName}
//         </button>

//         {/* Minimal Badge */}
//         <span
//           className={`text-white text-[10px] px-2 py-[1px] rounded-full ${roleMeta.color}`}
//         >
//           {roleMeta.text}
//         </span>

//         {/* Hover Tooltip - slim, modern */}
//         {hover && (
//           <div
//             className="
//               absolute 
//               left-56 
//               top-0 
//               bg-white 
//               shadow-lg 
//               border 
//               rounded-md 
//               p-3 
//               w-52 
//               text-xs 
//               z-50
//             "
//           >
//             <p><strong>Name:</strong> {node.fName} {node.lName}</p>
//             <p><strong>Role:</strong> {roleMeta.text}</p>
//             {node.categoryID !== undefined && (
//               <p><strong>CategoryID:</strong> {node.categoryID}</p>
//             )}
//             {node.managerId && <p><strong>Manager:</strong> {node.managerId}</p>}
//             <p><strong>Subordinates:</strong> {node.subordinate?.length || 0}</p>
//           </div>
//         )}

//       </div>

//       {/* Children */}
//       {expanded && hasChildren && (
//         <div className="ml-5 border-l pl-3">
//           {node.subordinate.map((child, idx) => (
//             <TreeNode
//               key={child.userId + idx}
//               node={child}
//               onUserClick={onUserClick}
//             />
//           ))}
//         </div>
//       )}

//     </div>
//   );
// }
import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function UserTree({ data, onSelectionChange }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [showTooltip, setShowTooltip] = useState(true); // new state

  const handleNodeClick = (userId) => {
    setSelectedIds((prev) => {
      const exists = prev.includes(userId);
      const updated = exists ? prev.filter((id) => id !== userId) : [...prev, userId];
      onSelectionChange && onSelectionChange(updated);
      return updated;
    });
  };

  const handleChildrenSelect = (allChildIds, select) => {
    setSelectedIds((prev) => {
      let updated = [...prev];
      if (select) {
        allChildIds.forEach((id) => {
          if (!updated.includes(id)) updated.push(id);
        });
      } else {
        updated = updated.filter((id) => !allChildIds.includes(id));
      }
      onSelectionChange && onSelectionChange(updated);
      return updated;
    });
  };

  return (
    <div className="p-2 relative">
      {/* Tooltip Toggle */}
      <div className="absolute top-2 left-2 flex items-center gap-1 text-sm">
        <label className="cursor-pointer select-none">Tooltips:</label>
        <input
          type="checkbox"
          checked={showTooltip}
          onChange={() => setShowTooltip(!showTooltip)}
          className="h-4 w-8 accent-blue-500 cursor-pointer"
        />
      </div>

      <div className="mt-6"> {/* Add margin to avoid toggle overlapping first node */}
        <TreeNode
          node={data}
          selectedIds={selectedIds}
          onNodeClick={handleNodeClick}
          onChildrenSelect={handleChildrenSelect}
          showTooltip={showTooltip}
        />
      </div>
    </div>
  );
}

// ----- ROLE BADGES -----
const ROLE_BADGE = {
  1: { text: "Super Admin", color: "bg-red-400" },
  2: { text: "Admin", color: "bg-orange-400" },
  3: { text: "HOD", color: "bg-purple-400" },
  4: { text: "Manager", color: "bg-blue-400" },
  5: { text: "User", color: "bg-green-400" },
};

function TreeNode({ node, selectedIds, onNodeClick, onChildrenSelect, showTooltip }) {
  const roleMeta = ROLE_BADGE[node.roleId] || { text: "Unknown", color: "bg-gray-400" };
  const [expanded, setExpanded] = useState(true);
  const [hover, setHover] = useState(false);

  const hasChildren = node.subordinate && node.subordinate.length > 0;
  const isSelected = selectedIds.includes(node.userId);

  const getAllChildIds = (n) => {
    let ids = n.subordinate?.map((c) => c.userId) || [];
    n.subordinate?.forEach((c) => {
      ids = ids.concat(getAllChildIds(c));
    });
    return ids;
  };

  const toggleChildrenSelection = () => {
    const allChildIds = getAllChildIds(node);
    const select = !allChildIds.every((id) => selectedIds.includes(id));
    onChildrenSelect(allChildIds, select);
  };

  return (
    <div className="ml-3 relative">
      {/* ROW */}
      <div
        className="flex items-center gap-2 mb-1 relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Arrow */}
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-gray-600 hover:text-black transition"
          >
            {expanded ? "▾" : "▸"}
          </button>
        ) : (
          <span className="text-sm opacity-0">•</span>
        )}

        {/* Node Button */}
        <button
          onClick={() => onNodeClick(node.userId)}
          className={`px-2 py-1 border rounded-md text-sm shadow-sm transition
            ${isSelected
              ? "bg-blue-100 border-blue-500 text-blue-800"
              : "bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-800"
            }`}
        >
          {node.fName} {node.lName}
        </button>

        {/* Role Badge */}
        <span
          className={`text-white text-[10px] px-2 py-[1px] rounded-full ${roleMeta.color}`}
        >
          {roleMeta.text}
        </span>

        {/* Count Badge */}
        {hasChildren && (
          <span className="text-xs bg-gray-800 text-white px-2 py-[1px] rounded-full shadow">
            {node.subordinate.length}
          </span>
        )}

        {/* Select/Deselect All Children Icon */}
        {hasChildren && (
          <button
            onClick={toggleChildrenSelection}
            className="ml-2 text-gray-600 hover:text-gray-900 text-sm"
            title="Select/Deselect all children"
          >
            ⚡
          </button>
        )}

        {/* Tooltip */}
        {hover && showTooltip && (
          <div
            className="
              absolute 
              left-56 
              top-0 
              bg-white 
              shadow-lg 
              border 
              rounded-md 
              p-3 
              w-52 
              text-xs 
              z-50
            "
          >
            <p><strong>Name:</strong> {node.fName} {node.lName}</p>
            <p><strong>Role:</strong> {roleMeta.text}</p>
            {node.categoryID !== undefined && (
              <p><strong>CategoryID:</strong> {node.categoryID}</p>
            )}
            {node.managerId && <p><strong>Manager:</strong> {node.managerId}</p>}
            <p><strong>Subordinates:</strong> {node.subordinate?.length || 0}</p>
          </div>
        )}
      </div>

      {/* CHILDREN */}
      {expanded && hasChildren && (
        <div className="ml-5 border-l pl-3">
          {node.subordinate.map((child, idx) => (
            <TreeNode
              key={child.userId + idx}
              node={child}
              selectedIds={selectedIds}
              onNodeClick={onNodeClick}
              onChildrenSelect={onChildrenSelect}
              showTooltip={showTooltip}
            />
          ))}
        </div>
      )}
    </div>
  );
}

