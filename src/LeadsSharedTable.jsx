// Shared pieces used by LeadListWithFilters and CreatedLeadsListWithFilters
// (and any future lead-table page). Keeping these in one place means the
// wait-cursor, sort-arrow, filter-dropdown, and icon styling only need to
// change in ONE file to apply everywhere.
import React, { useRef, useEffect, useState } from "react";

// ---------------- Wait cursor / loading overlay ----------------
// Centralized styling — tweak these two strings to restyle the wait
// indicator everywhere it's used, without touching any page component.
export const LOADING_OVERLAY_STYLES = {
  overlay: "fixed inset-0 z-[999] flex items-center justify-center bg-black/10",
  card: "flex flex-col items-center gap-2 bg-white px-6 py-4 rounded-lg shadow-lg",
  spinner: "h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600",
  label: "text-sm text-gray-600",
};

export function LoadingOverlay({ visible, label = "Loading..." }) {
  if (!visible) return null;
  return (
    <div className={LOADING_OVERLAY_STYLES.overlay} style={{ cursor: "wait" }}>
      <div className={LOADING_OVERLAY_STYLES.card}>
        <div className={LOADING_OVERLAY_STYLES.spinner} />
        <span className={LOADING_OVERLAY_STYLES.label}>{label}</span>
      </div>
    </div>
  );
}

// ---------------- Holiday-category helpers ----------------
// Read live off lead.category every call rather than caching primitives —
// category can be patched onto the same lead object later (mutation)
// without the containing array reference changing, so cached copies can
// go stale. See LeadListWithFilters for the fuller explanation.
export const splitDestinations = (str) =>
  (str || "")
    .split(/[,;]/)
    .map((d) => d.trim())
    .filter(Boolean);

export const isHolidayLead = (lead) =>
  lead.category?.$type === "HOLIDAY" || lead.categoryName?.toUpperCase() === "HOLIDAY";
export const getTripType = (lead) => lead.category?.tripType || null;
export const getLeadType = (lead) => lead.category?.leadType || null;
export const getDestinations = (lead) => lead.category?.requestedDestinations || "";
export const getLatestUpdate = (lead) => lead.histories?.[0]?.createdAt || lead.updatedAt || null;

// ---------------- Small inline icons (no extra dependency) ----------------
export function SwapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 7h11l-3-3M17 17H6l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ---------------- Checkbox dropdown (multi-select) ----------------
// Flip ALLOW_MULTI_SELECT (imported/used by each page) to switch back to
// single-select — this component itself doesn't care either way, the
// page's handleFilterChange decides whether to toggle or replace.
export function MultiSelectFilter({ label, options, selected, onToggle }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="border p-2 rounded text-sm min-w-[130px] bg-white text-left flex justify-between items-center gap-2"
      >
        <span className="truncate">
          {selected.length ? `${label} (${selected.length})` : `Filter by ${label}`}
        </span>
        <span className="text-[10px]">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 bg-white border rounded shadow-lg max-h-56 overflow-auto min-w-[190px]">
          {options.length === 0 && (
            <div className="px-2 py-1.5 text-xs text-gray-400">No options</div>
          )}
          {options.map((op) => (
            <label
              key={op}
              className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(op)}
                onChange={() => onToggle(op)}
              />
              <span className="truncate">{op}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------- Sortable header cell ----------------
// Always shows a small triangle (light gray when this column isn't the
// active sort, darker + directional when it is) so users notice sorting
// is available even before they've tried it.
export function SortableHeader({ label, sortKey, sortConfig, onSort, className = "" }) {
  const isActive = sortConfig.key === sortKey;
  const direction = isActive ? sortConfig.direction : "asc";
  return (
    <th
      className={`p-2 text-left sticky top-0 z-10 bg-gray-100 cursor-pointer select-none hover:bg-gray-200 ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className={`text-[9px] leading-none ${isActive ? "text-gray-600" : "text-gray-300"}`}>
          {direction === "asc" ? "▲" : "▼"}
        </span>
      </span>
    </th>
  );
}
