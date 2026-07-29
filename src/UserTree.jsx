import React, { useState, useRef } from "react";
import { Check, Users } from "lucide-react";
import { COLORS } from "./Constants";

const ROLE_BADGE = {
  1: { text: "Super Admin", color: "bg-superAdmin" },
  2: { text: "Admin",       color: "bg-admin" },
  3: { text: "HOD",         color: "bg-hod" },
  4: { text: "Manager",     color: "bg-manager" },
  5: { text: "User",        color: "bg-user" },
};

// Count ALL descendants (not just immediate children)
function countAllDescendants(node) {
  if (!node || !node.subordinate || node.subordinate.length === 0) return 0;
  return node.subordinate.reduce((acc, c) => acc + 1 + countAllDescendants(c), 0);
}

// Flatten the nested tree into a plain array for table view
function flattenTree(node, reportsTo = "—", depth = 0) {
  if (!node) return [];
  const row = {
    userId:      node.userId,
    fName:       node.fName,
    lName:       node.lName,
    roleId:      node.roleId,
    status:      node.status,
    verticleName: node.verticleName,
    reportsTo,
    teamSize:    countAllDescendants(node), // full team including nested
    depth,
  };
  const name = `${node.fName} ${node.lName}`;
  const children = (node.subordinate || []).flatMap(c => flattenTree(c, name, depth + 1));
  return [row, ...children];
}

// ── TABLE VIEW ──────────────────────────────────────────────
function TableView({ data, selectedIds, onToggle, onSelectAllActive, isLoading, viewActiveOnly, roleFilter = "all", sortOrder = "none" }) {
  const [search, setSearch] = useState("");
  const [tooltipUser, setTooltipUser] = useState(null);
  const [tooltipPos, setTooltipPos]   = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);

  const allRows = flattenTree(data);
  let rows = allRows.filter(r => {
    if (viewActiveOnly && (r.status ?? "").trim().toLowerCase() !== "active") return false;
    if (roleFilter !== "all" && String(r.roleId) !== roleFilter) return false;
    if (search && !`${r.fName} ${r.lName}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  if (sortOrder !== "none") {
    rows = [...rows].sort((a, b) => {
      const na = `${a.fName} ${a.lName}`.toLowerCase();
      const nb = `${b.fName} ${b.lName}`.toLowerCase();
      return sortOrder === "asc" ? na.localeCompare(nb) : nb.localeCompare(na);
    });
  }

  const getStatusColor = (s) => {
    const v = (s ?? "").trim().toLowerCase();
    if (v === "active")   return "#22c55e";
    if (v === "inactive") return "#ef4444";
    return "#9ca3af";
  };

  const roleMeta = (roleId) => ROLE_BADGE[roleId] || { text: "Unknown", color: "bg-gray-400" };

  // Tailwind badge colours map → inline styles since we need dynamic values
  const ROLE_INLINE = {
    1: { bg: "#dbeafe", color: "#1d4ed8" },
    2: { bg: "#dbeafe", color: "#1d4ed8" },
    3: { bg: "#d1fae5", color: "#065f46" },
    4: { bg: "#fef3c7", color: "#92400e" },
    5: { bg: "#f3f4f6", color: "#374151" },
  };

  const handleMouseEnter = (e, row) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.right + 8, y: rect.top });
    setTooltipUser(row);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-2 py-1.5 border-b flex-shrink-0">
        <input
          type="text"
          placeholder="Search by name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-sm px-2 py-1.5 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* Loading banner */}
      {isLoading && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border-b border-blue-200 text-blue-700 text-sm flex-shrink-0">
          <svg className="h-3.5 w-3.5 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Fetching data…
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="p-2 text-left font-medium text-gray-500 w-5"></th>
              <th className="p-2 text-left font-medium text-gray-500">Name</th>
              <th className="p-2 text-left font-medium text-gray-500">Role</th>
              <th className="p-2 text-center font-medium text-gray-500">
                {/* Toggle Select All / Deselect All — computes full new array in one shot */}
                <button
                  onClick={() => {
                    const activeIds = rows
                      .filter(r => (r.status ?? "").trim().toLowerCase() === "active")
                      .map(r => r.userId);
                    const allSelected = activeIds.every(id => selectedIds.includes(id));
                    // Compute the complete new array and pass it up once
                    const newIds = allSelected
                      ? selectedIds.filter(id => !activeIds.includes(id)) // remove all active visible
                      : [...new Set([...selectedIds, ...activeIds])];      // add all active visible
                    onToggle(newIds);
                  }}
                  disabled={isLoading}
                  title="Toggle select all active"
                  className="flex items-center gap-1 mx-auto text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-40"
                >
                  <input
                    type="checkbox"
                    readOnly
                    className="accent-blue-600 pointer-events-none"
                    checked={
                      rows.some(r => (r.status ?? "").trim().toLowerCase() === "active") &&
                      rows
                        .filter(r => (r.status ?? "").trim().toLowerCase() === "active")
                        .every(r => selectedIds.includes(r.userId))
                    }
                  />
                  All
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const inactive = (row.status ?? "").trim().toLowerCase() !== "active";
              const isSelected = selectedIds.includes(row.userId);
              const ri = ROLE_INLINE[row.roleId] || { bg: "#f3f4f6", color: "#374151" };
              return (
                <tr
                  key={row.userId + idx}
                  className={`border-b border-gray-100 ${idx % 2 === 1 ? "bg-gray-50" : ""} ${inactive ? "opacity-40" : ""}`}
                >
                  <td className="p-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: getStatusColor(row.status) }} />
                  </td>
                  <td
                    className="p-2 font-medium text-gray-800 cursor-default"
                    onMouseEnter={e => handleMouseEnter(e, row)}
                    onMouseLeave={() => setTooltipUser(null)}
                  >
                    {row.fName} {row.lName}
                  </td>
                  <td className="p-2">
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: ri.bg, color: ri.color }}
                    >
                      {roleMeta(row.roleId).text}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      disabled={inactive || isLoading}
                      checked={isSelected}
                      onChange={() => {
                        const newIds = isSelected
                          ? selectedIds.filter(id => id !== row.userId)
                          : [...selectedIds, row.userId];
                        onToggle(newIds);
                      }}
                      className="accent-blue-600 h-3.5 w-3.5"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-2 py-1.5 border-t bg-gray-50 flex-shrink-0 text-xs">
        <span className="text-gray-500 font-medium">{selectedIds.length} selected</span>
      </div>

      {/* Hover tooltip — fixed positioned so it escapes the panel */}
      {tooltipUser && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs w-52 pointer-events-none"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <p className="font-semibold text-gray-800 mb-2">{tooltipUser.fName} {tooltipUser.lName}</p>
          <div className="flex flex-col gap-1.5 text-gray-600">
            <div className="flex justify-between gap-2">
              <span>Role</span>
              <span className="font-medium text-gray-800">{roleMeta(tooltipUser.roleId).text}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span>Reports to</span>
              <span className="font-medium text-gray-800 truncate max-w-[110px]" title={tooltipUser.reportsTo}>{tooltipUser.reportsTo}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span>Team size</span>
              <span className="font-medium text-gray-800">{tooltipUser.teamSize > 0 ? tooltipUser.teamSize : "—"}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span>Status</span>
              <span className="font-medium" style={{ color: getStatusColor(tooltipUser.status) }}>
                {(tooltipUser.status ?? "Unknown").charAt(0).toUpperCase() + (tooltipUser.status ?? "Unknown").slice(1)}
              </span>
            </div>
            {tooltipUser.verticleName && (
              <div className="flex justify-between gap-2">
                <span>Vertical</span>
                <span className="font-medium text-gray-800">{tooltipUser.verticleName}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────
export default function UserTree({ data, onSelectionChange, isLoading = false, selectedIds = [] }) {
  const [expandedMap, setExpandedMap]       = useState({});
  const [showTooltip, setShowTooltip]       = useState(false);
  const [viewActiveOnly, setViewActiveOnly] = useState(false);
  const [viewVerticles, setViewVerticles]   = useState(false);
  const [viewMode, setViewMode]             = useState("tree"); // "tree" | "table"
  const [roleFilter, setRoleFilter]         = useState("all");
  const [sortOrder, setSortOrder]           = useState("none");

  // All selection changes go straight to parent — no local state
  const updateSelection = (updated) => {
    onSelectionChange?.(updated);
  };

  const handleNodeClick = (userId) => {
    const updated = selectedIds.includes(userId)
      ? selectedIds.filter(id => id !== userId)
      : [...selectedIds, userId];
    updateSelection(updated);
  };

  // Table passes complete new array — no local computation needed here
  const handleTableToggle = (newSelectedIds) => {
    updateSelection(newSelectedIds);
  };

  const handleSelectAllActive = () => {
    const allActive = flattenTree(data)
      .filter(r => (r.status ?? "").trim().toLowerCase() === "active")
      .map(r => r.userId);
    const merged = [...new Set([...selectedIds, ...allActive])];
    updateSelection(merged);
  };

  const handleChildrenSelect = (allChildIds, select) => {
    let updated = [...selectedIds];
    if (select) {
      allChildIds.forEach(id => { if (!updated.includes(id)) updated.push(id); });
    } else {
      updated = updated.filter(id => !allChildIds.includes(id));
    }
    updateSelection(updated);
  };

  const toggleExpand = (userId) =>
    setExpandedMap((prev) => ({ ...prev, [userId]: !prev[userId] }));

  React.useEffect(() => {
    console.log("UserTree data changed:", data);
  }, [data]);

  const filterActiveNodes = (node) => {
    if (!viewActiveOnly) return node;
    const isActive = (node?.status ?? "").trim().toLowerCase() === "active";
    const filteredChildren = node.subordinate?.map(filterActiveNodes).filter(Boolean) || [];
    return (isActive || filteredChildren.length > 0)
      ? { ...node, subordinate: filteredChildren }
      : null;
  };

  // Apply role filter and sort to tree nodes recursively
  const filterSortTree = (node) => {
    if (!node) return null;
    let children = (node.subordinate || [])
      .map(filterSortTree)
      .filter(Boolean);

    if (sortOrder !== "none") {
      children = [...children].sort((a, b) => {
        const na = `${a.fName} ${a.lName}`.toLowerCase();
        const nb = `${b.fName} ${b.lName}`.toLowerCase();
        return sortOrder === "asc" ? na.localeCompare(nb) : nb.localeCompare(na);
      });
    }

    const roleMatch = roleFilter === "all" || String(node.roleId) === roleFilter;
    // keep node if it matches role OR has children that survive the filter
    if (roleMatch || children.length > 0) {
      return { ...node, subordinate: children };
    }
    return null;
  };

  const filteredTree = filterSortTree(filterActiveNodes(data));

  return (
    <div className="flex flex-col h-full">

      {/* ── TOP BAR: view toggle + tree controls ── */}
      <div className="flex items-center gap-2 px-2 py-1.5 border-b bg-white flex-shrink-0">
        {/* View toggle */}
        <button
          onClick={() => setViewMode("tree")}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition
            ${viewMode === "tree"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"}`}
          title="Tree view"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Tree
        </button>
        <button
          onClick={() => setViewMode("table")}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition
            ${viewMode === "table"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"}`}
          title="Table view"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>
          Table
        </button>

        {/* Tree-only controls — hidden in table mode */}
        {viewMode === "tree" && (
          <>
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <label className="flex items-center gap-1 cursor-pointer select-none text-xs text-gray-600">
              <input type="checkbox" checked={showTooltip} onChange={() => setShowTooltip(v => !v)} className="h-3 w-3 accent-blue-600" />
              Tips
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-xs text-gray-600">
              <input type="checkbox" checked={viewActiveOnly} onChange={() => setViewActiveOnly(v => !v)} className="h-3 w-3 accent-blue-600" />
              Active
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-xs text-gray-600">
              <input type="checkbox" checked={viewVerticles} onChange={() => setViewVerticles(v => !v)} className="h-3 w-3 accent-blue-600" />
              Verticals
            </label>
          </>
        )}
      </div>

      {/* ── ROLE FILTER + SORT BAR (both modes) ── */}
      <div className="flex items-center gap-2 px-2 py-1 border-b bg-gray-50 flex-shrink-0">
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="text-xs border border-gray-200 rounded px-1.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 flex-1"
        >
          <option value="all">All Roles</option>
          <option value="1">Super Admin</option>
          <option value="2">Admin</option>
          <option value="3">HOD</option>
          <option value="4">Manager</option>
          <option value="5">User</option>
        </select>

        <button
          onClick={() => setSortOrder(s => s === "asc" ? "desc" : s === "desc" ? "none" : "asc")}
          className={`flex items-center gap-1 px-2 py-1 rounded border text-xs transition flex-shrink-0
            ${sortOrder !== "none" ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"}`}
          title={sortOrder === "asc" ? "Sorted A→Z (click for Z→A)" : sortOrder === "desc" ? "Sorted Z→A (click to clear)" : "Sort by name"}
        >
          {sortOrder === "asc" ? "A→Z" : sortOrder === "desc" ? "Z→A" : "Sort"}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {sortOrder === "desc"
              ? <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
              : <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            }
          </svg>
        </button>
      </div>

      {/* ── LOADING BANNER (tree mode only — table has its own) ── */}
      {isLoading && viewMode === "tree" && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border-b border-blue-200 text-blue-700 text-xs flex-shrink-0">
          <svg className="h-3.5 w-3.5 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Fetching data…
        </div>
      )}

      {/* ── CONTENT ── */}
      {viewMode === "tree" ? (
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
      ) : (
        <TableView
          data={data}
          selectedIds={selectedIds}
          onToggle={handleTableToggle}
          onSelectAllActive={handleSelectAllActive}
          isLoading={isLoading}
          viewActiveOnly={viewActiveOnly}
          roleFilter={roleFilter}
          sortOrder={sortOrder}
        />
      )}
    </div>
  );
}

// ── TREE NODE (unchanged) ────────────────────────────────────
function TreeNode({
  node, selectedIds, onNodeClick, onChildrenSelect,
  expandedMap, onToggleExpand, showTooltip, viewVerticles, viewActiveOnly, isLoading = false,
}) {
  const roleMeta = ROLE_BADGE[node.roleId] || { text: "Unknown", color: COLORS?.unknown || "bg-gray-400" };
  const [hover, setHover] = useState(false);

  const children = (node.subordinate || []).filter(c => {
    if (!viewActiveOnly) return true;
    return (c?.status ?? "").trim().toLowerCase() === "active";
  });

  const hasChildren = children.length > 0;
  const isSelected  = selectedIds.includes(node.userId);
  const expanded    = expandedMap[node.userId] ?? true;

  const getStatusButtonClasses = (status) => {
    const s = (status ?? "").trim().toLowerCase();
    if (s === "inactive")                      return "bg-red-100 border-red-500 text-red-800";
    if (s === "deferred" || s === "suspended") return "bg-orange-100 border-orange-500 text-orange-800";
    return "bg-gray-100 border-gray-300 text-gray-800";
  };

  const getAllChildIds = (n) => {
    let ids = n.subordinate?.map((c) => c.userId) || [];
    n.subordinate?.forEach((c) => { ids = ids.concat(getAllChildIds(c)); });
    return ids;
  };

  const allChildIds = getAllChildIds(node);
  const allSelected = allChildIds.length > 0 && allChildIds.every((id) => selectedIds.includes(id));

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
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleExpand(node.userId); }}
            className="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-200 transition text-gray-500 hover:text-black flex-shrink-0"
            style={{ fontSize: "18px", lineHeight: 1 }}
          >
            {expanded ? "▾" : "▸"}
          </button>
        ) : (
          <span className="w-6 h-6 flex-shrink-0 opacity-0" style={{ fontSize: "18px" }}>▾</span>
        )}

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

        <span className={`text-white text-[10px] px-2 py-[1px] rounded-full ${roleMeta.color}`}>
          {roleMeta.text}
          {viewVerticles && node.verticleName && (
            <><br /><span>{"(" + node.verticleName + ")"}</span></>
          )}
        </span>

        {hasChildren && (
          <span className="text-xs bg-gray-600 text-white px-2 py-[1px] border-gray-500 rounded-full">
            {children.length}
          </span>
        )}

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
