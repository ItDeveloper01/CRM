import React, { useState } from "react";
import { UsersRound, Check ,Users ,ClipboardCheck,ClipboardCheckIcon} from "lucide-react";
import { COLORS } from "./Constants";


const ROLE_BADGE = {
  1: { text: "Super Admin", color: "bg-superAdmin" },
  2: { text: "Admin", color: "bg-admin" },
  3: { text: "HOD", color: "bg-hod" },
  4: { text: "Manager", color: "bg-manager" },
  5: { text: "User", color: "bg-user" },
};

export default function UserTree({ data, onSelectionChange }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedMap, setExpandedMap] = useState({});
  const [showTooltip, setShowTooltip] = useState(false);
  const [viewActiveOnly, setViewActiveOnly] = useState(false);
  const [viewVerticles, setViewVerticles] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });


  
  const handleNodeClick = (userId) => {
    setSelectedIds((prev) => {
      const exists = prev.includes(userId);
      const updated = exists
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];

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

  const toggleExpand = (userId) => {
    setExpandedMap((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  React.useEffect(() => {
    console.log("Data prop changed:", data);
  }, [data]);

 // FILTER LOGIC FOR ACTIVE ONLY
  const filterActiveNodes = (node) => {
    if (!viewActiveOnly) return node;

    const isActive = (node?.status ?? "").trim().toLowerCase() === "active";

    const filteredChildren =
      node.subordinate
        ?.map(filterActiveNodes)
        .filter((c) => c != null) || [];

    if (isActive || filteredChildren.length > 0) {
      return { ...node, subordinate: filteredChildren };
    }

    return null;
  };

  const filteredTree = filterActiveNodes(data);

  return (

    
    
    <div className="p-2 relative">

      {/* === CONTROLS (TOOLTIP + ACTIVE ONLY) === */}
      <div className="absolute top-2 left-2 flex items-center gap-4 text-sm bg-white/80 px-3 py-1 rounded-md shadow border">

        {/* Tooltip */}
        <label className="flex items-center gap-1 cursor-pointer select-none">
          <span>Tooltips</span>
          <input
            type="checkbox"
            checked={showTooltip}
            onChange={() => setShowTooltip(!showTooltip)}
            className="h-4 w-4 accent-blue-600 cursor-pointer"
          />
        </label>

        {/* Active Only */}
        <label className="flex items-center gap-1 cursor-pointer select-none">
          <span>Active Users Only</span>
          <input
            type="checkbox"
            checked={viewActiveOnly}
            onChange={() => setViewActiveOnly(!viewActiveOnly)}
            className="h-4 w-4 accent-blue-600 cursor-pointer"
          />
        </label>

         {/* View Verticles */}
        <label className="flex items-center gap-1 cursor-pointer select-none">
          <span>View Verticles</span>
          <input
            type="checkbox"
            checked={viewVerticles}
            onChange={() => setViewVerticles(!viewVerticles)}
            className="h-4 w-4 accent-blue-600 cursor-pointer"
          />
        </label>
      </div>

      <div className="mt-10">
        {filteredTree ? (
          <TreeNode
            node={filteredTree}
            selectedIds={selectedIds}
            onNodeClick={handleNodeClick}
            onChildrenSelect={handleChildrenSelect}
            expandedMap={expandedMap}
            onToggleExpand={toggleExpand}
            showTooltip={showTooltip}
            viewVerticles={viewVerticles}
            viewActiveOnly={viewActiveOnly}
          />
        ) : (
          <p className="text-gray-500 text-sm">No active users found.</p>
        )}
      </div>
    </div>
  );
}

function TreeNode({
  node,
  selectedIds,
  onNodeClick,
  onChildrenSelect,
  expandedMap,
  onToggleExpand,
  showTooltip,
  viewVerticles,
  viewActiveOnly,
}) {
  const roleMeta = ROLE_BADGE[node.roleId] || {
    text: "Unknown",
    // color: "bg-gray-400",
    color: COLORS.unknown,
  };

  const [hover, setHover] = useState(false);

const children = (node.subordinate || []).filter(c => {
  if (!viewActiveOnly) return true;
  return (c?.status ?? "").trim().toLowerCase() === "active";
});

  const hasChildren = children.length > 0;
  const isSelected = selectedIds.includes(node.userId);
  const expanded = expandedMap[node.userId] ?? true;

  // ===== STATUS DOT COLORS =====
const getStatusDot = (status) => {
  const s = (status ?? "").trim().toLowerCase();

  if (s === "active") return "bg-green-500";
  if (s === "inactive") return "bg-red-500";
  if (s === "suspended") return "bg-orange-500";

  return "bg-gray-400";
};


const getStatusButtonClasses = (status) => {
  const s = (status ?? "").trim().toLowerCase();

  if (s === "inactive")
    return "bg-red-100 border-red-500 text-red-800";

  if (s === "deferred" || s === "suspended")
    return "bg-orange-100 border-orange-500 text-orange-800";

  // if (s === "active")
  //   return "bg-green-100 border-green-500 text-green-800";

  return "bg-gray-100 border-gray-300 text-gray-800"; // default
};

  const getAllChildIds = (n) => {
    let ids = n.subordinate?.map((c) => c.userId) || [];
    n.subordinate?.forEach((c) => {
      ids = ids.concat(getAllChildIds(c));
    });
    return ids;
  };

  const allChildIds = getAllChildIds(node);
  const allSelected = allChildIds.every((id) => selectedIds.includes(id));


  const toggleChildrenSelection = (e) => {
    e.stopPropagation();
    const allChildIds = getAllChildIds(node);
    const select = !allChildIds.every((id) => selectedIds.includes(id));
    onChildrenSelect(allChildIds, select);
  };

  // FADE NON-ACTIVE USERS
 const isActive =
  (node?.status ?? "").trim().toLowerCase() === "active";

const opacityClass = isActive ? "opacity-100" : "opacity-50";

  return (
    
    <div className="ml-3 relative">
      {/* ROW */}
      <div
        className={`flex items-center gap-2 mb-1 relative `}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Expand / collapse */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.userId);
            }}
            className="text-sm text-gray-600 hover:text-black transition"
          >
            {expanded ? "▾" : "▸"}
          </button>
        ) : (
          <span className="text-sm opacity-0">•</span>
        )}

        {/* === STATUS DOT (always visible) === */}
        {/* <div
          className={`h-1.5 w-1.5 rounded-full border border-black/10 shrink-0 ${getStatusDot(
            node.status
          )}`}
        ></div> */}

        {/* User button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNodeClick(node.userId);
          }}
          className={`px-2 py-1 border rounded-md text-sm shadow-sm transition
            ${
              isSelected
               ? "bg-blue-100 border-blue-500 text-blue-800"
        : getStatusButtonClasses(node.status)
            }
          `}
        >
          {node.fName} {node.lName}
         
        </button>

        {/* Role badge */}
        <span
          className={`text-white text-[10px] px-2 py-[1px] rounded-full ${roleMeta.color}`}
        >
          {roleMeta.text}
          {viewVerticles && node.verticleName && (
  <>
    <br />
    <span>{"(" + node.verticleName + ")"}</span>
  </>
)}
        </span>

        {/* Children count */}
        {hasChildren && (
          <span className="text-xs bg-gray-600 text-white px-2 py-[1px] border-gray-500 rounded-full">
            {children.length}
          </span>
        )}

        {/* Select all children */}
        {hasChildren && (
            <button
              onClick={toggleChildrenSelection}
              className="ml-2 flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm"
              title={allSelected ? "Deselect Team" : "Select Team"}
            >
              <Users className="h-3 w-3" />
              {allSelected && <Check className="h-2 w-2 text-green-600" />}
            </button>
              )}

        {/* Tooltip */}
        {hover && showTooltip && (
          <div
    className="absolute left-16 top-0 bg-white shadow-lg border rounded-md p-3 w-52 text-xs z-[9999]"
  >
            <p>
              <strong>Name:</strong> {node.fName} {node.lName}
            </p>
            <p>
              <strong>Role:</strong> {roleMeta.text}
            </p>
            <p>
              <strong>Status:</strong> {node.status}
            </p>
            {node.categoryID && (
              <p>
                <strong>Category ID:</strong> {node.categoryID}
              </p>
            )}
            <p>
              <strong>Subordinates:</strong> {children.length}
            </p>
          </div>
        )}
      </div>

      {/* CHILDREN */}
      {expanded && hasChildren && (
        <div className="ml-5 border-l pl-3">
          {children.map((child, idx) => (
            <TreeNode
              key={child.userId + idx}
              node={child}
              selectedIds={selectedIds}
              onNodeClick={onNodeClick}
              onChildrenSelect={onChildrenSelect}
              expandedMap={expandedMap}
              onToggleExpand={onToggleExpand}
              showTooltip={showTooltip}
              viewVerticles={viewVerticles}
              viewActiveOnly={viewActiveOnly}
            />
          ))}
        </div>
      )}
    </div>
  );
}
