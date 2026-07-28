import React, { useState } from "react";
import { Check, Users } from "lucide-react";
import { COLORS } from "./Constants";

const ROLE_BADGE = {
  1: { text: "Super Admin", color: "bg-superAdmin" },
  2: { text: "Admin", color: "bg-admin" },
  3: { text: "HOD", color: "bg-hod" },
  4: { text: "Manager", color: "bg-manager" },
  5: { text: "User", color: "bg-user" },
};

// UserTree renders as a flex column:
//   [controls strip]  ← never scrolls
//   [loading banner]  ← never scrolls
//   [tree nodes]      ← scrolls when content overflows
// The parent just needs to give this component a defined height (flex-1, h-full, etc.)
// and overflow will be handled internally.
export default function UserTree({ data, onSelectionChange, isLoading = false }) {
  const [selectedIds, setSelectedIds]   = useState([]);
  const [expandedMap, setExpandedMap]   = useState({});
  const [showTooltip, setShowTooltip]   = useState(false);
  const [viewActiveOnly, setViewActiveOnly] = useState(false);
  const [viewVerticles, setViewVerticles]   = useState(false);

  const handleNodeClick = (userId) => {
    setSelectedIds((prev) => {
      const updated = prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];
      onSelectionChange?.(updated);
      return updated;
    });
  };

  const handleChildrenSelect = (allChildIds, select) => {
    setSelectedIds((prev) => {
      let updated = [...prev];
      if (select) {
        allChildIds.forEach((id) => { if (!updated.includes(id)) updated.push(id); });
      } else {
        updated = updated.filter((id) => !allChildIds.includes(id));
      }
      onSelectionChange?.(updated);
      return updated;
    });
  };

  const toggleExpand = (userId) =>
    setExpandedMap((prev) => ({ ...prev, [userId]: !prev[userId] }));

  React.useEffect(() => {
    console.log("UserTree data changed:", data);
  }, [data]);

  // FILTER LOGIC FOR ACTIVE ONLY
  const filterActiveNodes = (node) => {
    if (!viewActiveOnly) return node;
    const isActive = (node?.status ?? "").trim().toLowerCase() === "active";
    const filteredChildren = node.subordinate?.map(filterActiveNodes).filter(Boolean) || [];
    return (isActive || filteredChildren.length > 0)
      ? { ...node, subordinate: filteredChildren }
      : null;
  };

  const filteredTree = filterActiveNodes(data);

  return (
    // flex column — controls pinned at top, tree scrolls below
    <div className="flex flex-col h-full">

      {/* ── CONTROLS STRIP (never scrolls) ── */}
      <div className="flex flex-wrap items-center gap-3 px-3 py-1.5 border-b bg-white text-xs flex-shrink-0">
        <label className="flex items-center gap-1 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showTooltip}
            onChange={() => setShowTooltip(v => !v)}
            className="h-3.5 w-3.5 accent-blue-600 cursor-pointer"
          />
          <span>Tooltips</span>
        </label>
        <label className="flex items-center gap-1 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={viewActiveOnly}
            onChange={() => setViewActiveOnly(v => !v)}
            className="h-3.5 w-3.5 accent-blue-600 cursor-pointer"
          />
          <span>Active Only</span>
        </label>
        <label className="flex items-center gap-1 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={viewVerticles}
            onChange={() => setViewVerticles(v => !v)}
            className="h-3.5 w-3.5 accent-blue-600 cursor-pointer"
          />
          <span>Verticles</span>
        </label>
      </div>

      {/* ── LOADING BANNER (never scrolls) ── */}
      {isLoading && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border-b border-blue-200 text-blue-700 text-xs flex-shrink-0">
          <svg className="h-3.5 w-3.5 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Fetching data…
        </div>
      )}

      {/* ── TREE NODES (this part scrolls) ── */}
      <div className="flex-1 overflow-auto min-h-0 p-2">
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
            isLoading={isLoading}
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
  isLoading = false,
}) {
  const roleMeta = ROLE_BADGE[node.roleId] || { text: "Unknown", color: COLORS?.unknown || "bg-gray-400" };
  const [hover, setHover] = useState(false);

  const children = (node.subordinate || []).filter(c => {
    if (!viewActiveOnly) return true;
    return (c?.status ?? "").trim().toLowerCase() === "active";
  });

  const hasChildren  = children.length > 0;
  const isSelected   = selectedIds.includes(node.userId);
  const expanded     = expandedMap[node.userId] ?? true;
  const isActive     = (node?.status ?? "").trim().toLowerCase() === "active";

  const getStatusDot = (status) => {
    const s = (status ?? "").trim().toLowerCase();
    if (s === "active")    return "bg-green-500";
    if (s === "inactive")  return "bg-red-500";
    if (s === "suspended") return "bg-orange-500";
    return "bg-gray-400";
  };

  const getStatusButtonClasses = (status) => {
    const s = (status ?? "").trim().toLowerCase();
    if (s === "inactive")                    return "bg-red-100 border-red-500 text-red-800";
    if (s === "deferred" || s === "suspended") return "bg-orange-100 border-orange-500 text-orange-800";
    return "bg-gray-100 border-gray-300 text-gray-800";
  };

  const getAllChildIds = (n) => {
    let ids = n.subordinate?.map((c) => c.userId) || [];
    n.subordinate?.forEach((c) => { ids = ids.concat(getAllChildIds(c)); });
    return ids;
  };

  const allChildIds  = getAllChildIds(node);
  const allSelected  = allChildIds.length > 0 && allChildIds.every((id) => selectedIds.includes(id));

  const toggleChildrenSelection = (e) => {
    e.stopPropagation();
    const ids    = getAllChildIds(node);
    const select = !ids.every((id) => selectedIds.includes(id));
    onChildrenSelect(ids, select);
  };

  return (
    <div className="ml-3 relative">
      <div
        className="flex items-center gap-2 mb-1 relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Expand / collapse */}
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleExpand(node.userId); }}
            className="text-xl text-gray-500 hover:text-black transition leading-none"
          >
            {expanded ? "▾" : "▸"}
          </button>
        ) : (
          <span className="text-xl opacity-0">▾</span>
        )}

        {/* User button */}
        <button
          onClick={(e) => { e.stopPropagation(); if (!isLoading) onNodeClick(node.userId); }}
          disabled={isLoading}
          title={isLoading ? "Loading data, please wait…" : undefined}
          className={`px-2 py-1 border rounded-md text-sm shadow-sm transition
            ${isLoading ? "opacity-60 cursor-wait" : ""}
            ${isSelected ? "bg-blue-100 border-blue-500 text-blue-800" : getStatusButtonClasses(node.status)}
          `}
        >
          {node.fName} {node.lName}
        </button>

        {/* Role badge */}
        <span className={`text-white text-[10px] px-2 py-[1px] rounded-full ${roleMeta.color}`}>
          {roleMeta.text}
          {viewVerticles && node.verticleName && (
            <><br /><span>{"(" + node.verticleName + ")"}</span></>
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
            disabled={isLoading}
            className={`ml-2 flex items-center gap-1 text-gray-600 text-sm
              ${isLoading ? "opacity-50 cursor-wait" : "hover:text-gray-900"}`}
            title={isLoading ? "Loading…" : allSelected ? "Deselect Team" : "Select Team"}
          >
            <Users className="h-3 w-3" />
            {allSelected && <Check className="h-2 w-2 text-green-600" />}
          </button>
        )}

        {/* Tooltip */}
        {hover && showTooltip && (
          <div className="absolute left-16 top-0 bg-white shadow-lg border rounded-md p-3 w-52 text-xs z-[9999]">
            <p><strong>Name:</strong> {node.fName} {node.lName}</p>
            <p><strong>Role:</strong> {roleMeta.text}</p>
            <p><strong>Status:</strong> {node.status}</p>
            {node.categoryID && <p><strong>Category ID:</strong> {node.categoryID}</p>}
            <p><strong>Subordinates:</strong> {children.length}</p>
          </div>
        )}
      </div>

      {/* Children */}
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
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
