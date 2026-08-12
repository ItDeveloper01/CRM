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
export const getTravelDate = (lead) => {
    const date = lead.category?.preferredTravelDate;

    if (!date) return "-";

    const [year, month, day] = date.split("-");

    return `${day}-${month}-${year}`;
};

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
export function MultiSelectFilter({ label, options, selected, onToggle, onClear }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isActive = selected.length > 0;

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
        className={`border px-2 py-1.5 rounded text-sm min-w-[110px] text-left flex items-center gap-1.5 transition font-medium
          ${isActive
            ? "bg-blue-600 border-blue-600 text-white"
            : "bg-white border-gray-400 text-gray-700 hover:border-gray-600"}`}
      >
        <span className="truncate flex-1">
          {isActive ? `${label} (${selected.length})` : label}
        </span>
        {isActive ? (
          <span
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClear && onClear();
              setOpen(false);
            }}
            title={`Clear ${label} filter`}
            className="flex-shrink-0 w-4 h-4 rounded-full bg-white text-red-600 flex items-center justify-center text-[11px] font-black leading-none hover:bg-red-100 cursor-pointer"
          >✕</span>
        ) : (
          <span className="text-[10px] text-gray-500 flex-shrink-0">{open ? "▲" : "▼"}</span>
        )}
      </button>

      {open && (
        <div className="absolute z-20 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-56 overflow-auto min-w-[190px]">
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


// ---------------- Drag-select calendar filter ----------------
// Reusable anywhere in the app — not specific to follow-up dates.
// selections: array of { type:'single', date } | { type:'range', from, to }
// onApply(selections) / onClear()
//
// Usage:
//   <CalendarFilter
//     label="Follow-up Date"
//     selections={followUpSels}
//     onApply={setSels => setFollowUpSels(setSels)}
//     onClear={() => setFollowUpSels([])}
//   />

const MONTHS_CAL = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function calDs(y, m, d) {
  return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
function calFmt(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}-${m}-${y}`;
}
function calInSels(date, sels) {
  return sels.some(s => {
    if (s.type === 'single') return s.date === date;
    const [a, b] = [s.from, s.to].sort();
    return date >= a && date <= b;
  });
}

function CalGrid({ vy, vm, selections, dragFrom, dragCur, isDragging, onMouseDown, onMouseMove, onMouseUp }) {
  const first = new Date(vy, vm - 1, 1).getDay();
  const days  = new Date(vy, vm, 0).getDate();

  const getClass = (date) => {
    const all = [...selections];
    if (isDragging && dragFrom && dragCur) {
      const [a, b] = [dragFrom, dragCur].sort();
      all.push(a === b ? { type:'single', date:a } : { type:'range', from:a, to:b });
    }
    let inAny=false, isStart=false, isEnd=false, isMid=false, isSingle=false;
    all.forEach(s => {
      if (s.type==='single' && s.date===date) { inAny=true; isSingle=true; }
      if (s.type==='range') {
        const [a,b] = [s.from, s.to].sort();
        if (date>=a && date<=b) {
          inAny=true;
          if (date===a) isStart=true;
          if (date===b) isEnd=true;
          if (date>a && date<b) isMid=true;
        }
      }
    });
    if (!inAny) return "";
    if (isSingle) return "cal-sel";
    if (isStart && isEnd) return "cal-sel";
    if (isStart) return "cal-range-start";
    if (isEnd)   return "cal-range-end";
    if (isMid)   return "cal-range-mid";
    return "";
  };

  const cells = [];
  for (let i = 0; i < first; i++) cells.push(<span key={`e${i}`} style={{ padding:"6px 2px" }} />);
  for (let d = 1; d <= days; d++) {
    const date = calDs(vy, vm, d);
    const cls  = getClass(date);
    cells.push(
      <span
        key={date}
        data-date={date}
        onMouseDown={e => { e.preventDefault(); onMouseDown(date); }}
        onMouseMove={() => onMouseMove(date)}
        onMouseUp={() => onMouseUp(date)}
        style={{
          padding: "6px 4px",
          fontSize: "13px",
          cursor: "pointer",
          borderRadius:
            cls === "cal-range-mid"   ? 0 :
            cls === "cal-range-start" ? "4px 0 0 4px" :
            cls === "cal-range-end"   ? "0 4px 4px 0" : "4px",
          background:
            (cls === "cal-sel" || cls === "cal-range-start" || cls === "cal-range-end") ? "#2563eb" :
             cls === "cal-range-mid" ? "#bfdbfe" : "transparent",
          color:
            (cls === "cal-sel" || cls === "cal-range-start" || cls === "cal-range-end") ? "#ffffff" :
             cls === "cal-range-mid" ? "#1e40af" : "#111827",
          fontWeight: (cls === "cal-sel" || cls === "cal-range-start" || cls === "cal-range-end") ? "600" : "400",
          userSelect: "none",
          display: "block",
          textAlign: "center",
          lineHeight: "1.8",
        }}
      >{d}</span>
    );
  }
  return <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", textAlign:"center" }}>{cells}</div>;
}

export function CalendarFilter({ label, selections = [], onApply, onClear }) {
  const [open, setOpen]       = useState(false);
  const [vy, setVy]           = useState(new Date().getFullYear());
  const [vm, setVm]           = useState(new Date().getMonth() + 1);
  const [pending, setPending] = useState(selections);
  const [dragFrom, setDragFrom] = useState(null);
  const [dragCur, setDragCur]   = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const wrapRef = useRef(null);

  // sync pending when external selections change
  useEffect(() => { setPending(selections); }, [selections]);

  useEffect(() => {
    const up = () => { if (isDragging) { setIsDragging(false); setDragFrom(null); setDragCur(null); } };
    document.addEventListener("mouseup", up);
    return () => document.removeEventListener("mouseup", up);
  }, [isDragging]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleMouseDown = (date) => {
    setIsDragging(true);
    setDragFrom(date);
    setDragCur(date);
  };
  const handleMouseMove = (date) => {
    if (!isDragging) return;
    setDragCur(date);
  };
  const handleMouseUp = (date) => {
    if (!isDragging) return;
    setIsDragging(false);
    const [a, b] = [dragFrom, date].sort();
    if (a === b) {
      // toggle single date
      const idx = pending.findIndex(s => s.type === 'single' && s.date === a);
      if (idx >= 0) setPending(p => p.filter((_, i) => i !== idx));
      else setPending(p => [...p, { type:'single', date:a }]);
    } else {
      setPending(p => [...p, { type:'range', from:a, to:b }]);
    }
    setDragFrom(null); setDragCur(null);
  };

  const prevMonth = (e) => { e.stopPropagation(); setVm(m => { if (m === 1) { setVy(y => y-1); return 12; } return m-1; }); };
  const nextMonth = (e) => { e.stopPropagation(); setVm(m => { if (m === 12) { setVy(y => y+1); return 1; } return m+1; }); };

  const selDisplay = pending.length === 0 ? "No date selected" :
    pending.map(s => s.type === 'single' ? calFmt(s.date) :
      `${calFmt([s.from,s.to].sort()[0])} → ${calFmt([s.from,s.to].sort()[1])}`).join(" · ");

  const isActive = selections.length > 0;

  const btnLabel = selections.length === 0 ? label :
    selections.length === 1 && selections[0].type === 'single' ? `${label}: ${calFmt(selections[0].date)}` :
    selections.length === 1 ? `${label}: ${calFmt([selections[0].from,selections[0].to].sort()[0])} → ${calFmt([selections[0].from,selections[0].to].sort()[1])}` :
    `${label} (${selections.length})`;

  return (
    <div ref={wrapRef} style={{ position:"relative", display:"inline-block" }}>
      <button
        type="button"
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        className={`border px-2 py-1.5 rounded text-sm min-w-[110px] text-left flex items-center gap-1.5 transition font-medium
          ${isActive
            ? "bg-blue-600 border-blue-600 text-white"
            : "bg-white border-gray-400 text-gray-700 hover:border-gray-600"}`}
      >
        <span className="truncate flex-1">{btnLabel}</span>
        {isActive ? (
          <span
            onMouseDown={e => { e.stopPropagation(); e.preventDefault(); setPending([]); onClear(); setOpen(false); }}
            title="Clear filter"
            className="flex-shrink-0 w-4 h-4 rounded-full bg-white text-red-600 flex items-center justify-center text-[11px] font-black leading-none hover:bg-red-100 cursor-pointer"
          >✕</span>
        ) : (
          <span className="text-[10px] text-gray-500 flex-shrink-0">{open ? "▲" : "▼"}</span>
        )}
      </button>

      {open && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 9999,
            background: "#ffffff",
            border: "1px solid #d1d5db",
            borderRadius: "12px",
            padding: "14px",
            width: "290px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.20)",
          }}
        >
          {/* Month nav */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
            <button onClick={prevMonth} style={{ padding:"3px 10px", fontSize:"18px", background:"none", border:"none", cursor:"pointer", color:"#6b7280", lineHeight:1 }}>‹</button>
            <span style={{ fontSize:"13px", fontWeight:600, color:"#111827" }}>{MONTHS_CAL[vm-1]} {vy}</span>
            <button onClick={nextMonth} style={{ padding:"3px 10px", fontSize:"18px", background:"none", border:"none", cursor:"pointer", color:"#6b7280", lineHeight:1 }}>›</button>
          </div>

          {/* Day headers */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", textAlign:"center", marginBottom:"4px", borderBottom:"1px solid #f3f4f6", paddingBottom:"4px" }}>
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
              <span key={d} style={{ fontSize:"11px", color:"#9ca3af", padding:"2px", fontWeight:500 }}>{d}</span>
            ))}
          </div>

          {/* Calendar grid */}
          <CalGrid
            vy={vy} vm={vm}
            selections={pending}
            dragFrom={dragFrom} dragCur={dragCur} isDragging={isDragging}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />

          {/* Footer */}
          <div style={{ marginTop:"10px", paddingTop:"8px", borderTop:"1px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:"11px", color:"#6b7280", flex:1, marginRight:"8px", wordBreak:"break-word" }}>{selDisplay}</span>
            <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
              <button
                onClick={e => { e.stopPropagation(); setPending([]); onClear(); }}
                style={{ border:"1px solid #d1d5db", background:"#fff", padding:"4px 10px", borderRadius:"6px", fontSize:"12px", cursor:"pointer", color:"#374151" }}
              >Clear</button>
              <button
                onClick={e => { e.stopPropagation(); onApply([...pending]); setOpen(false); }}
                style={{ background:"#2563eb", color:"#fff", border:"none", padding:"4px 10px", borderRadius:"6px", fontSize:"12px", cursor:"pointer", fontWeight:500 }}
              >Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- Leads summary bar ----------------
// Shows the LHS selected date range + live status counts of filtered leads.
// Only shows date context if dateRange has been set.
export function LeadsSummaryBar({ dateRange, leads = [] }) {
  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-GB").replace(/\//g, "-") : null;

  const counts = leads.reduce((acc, l) => {
    const s = (l.status || "").toLowerCase();
    if (s === "open")           acc.open++;
    else if (s === "confirmed") acc.confirmed++;
    else if (s === "lost")      acc.lost++;
    else if (s === "postponed") acc.postponed++;
    return acc;
  }, { open: 0, confirmed: 0, lost: 0, postponed: 0 });

  const hasDate = dateRange?.from && dateRange?.to;

  return (
    <div className="flex flex-wrap items-center gap-3 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg mb-2 text-xs">
      {hasDate && (
        <>
          <div className="flex items-center gap-1 text-blue-700 font-medium">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            {dateRange.from === dateRange.to
              ? <span>Data for <b>{fmt(dateRange.from)}</b></span>
              : <span>Data from <b>{fmt(dateRange.from)}</b> to <b>{fmt(dateRange.to)}</b></span>
            }
          </div>
          <div className="w-px h-4 bg-blue-200" />
        </>
      )}
      <span className="text-openText font-medium">Open: {counts.open}</span>
      <span className="text-confirmedText font-medium">Confirmed: {counts.confirmed}</span>
      <span className="text-lostText font-medium">Lost: {counts.lost}</span>
      <span className="text-postponedText font-medium">Postponed: {counts.postponed}</span>
      <div className="w-px h-4 bg-blue-200" />
      <span className="text-gray-500">Total: <b>{leads.length}</b></span>
    </div>
  );
}


// ---------------- Sortable header cell ----------------
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
