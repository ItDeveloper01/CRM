// ── Shared style tokens ───────────────────────────────────────────────────
// Edit this file to update styles across VariantsSection and DayWiseSchedule

export const colors = {
  primary: "#2563EB",
  primaryLight: "#eff6ff",
  primaryBg: "#f8f9ff",
  success: "#16a34a",
  successBg: "#f0fdf4",
  danger: "#ef4444",
  dangerBg: "#fef2f2",
  border: "#e2e8f0",
  borderLight: "#f1f5f9",
  text: "#1e293b",
  textMuted: "#64748b",
  textSubtle: "#94a3b8",
  white: "#fff",
  sectionBg: "#f5f4ef",
};

// export const STATUS_CFG = {
//   Active:    { dot: "#22c55e", bg: "#f0fdf4", border: "#86efac", text: "#16a34a" },
//   Ongoing:   { dot: "#f97316", bg: "#fff7ed", border: "#fdba74", text: "#ea580c" },
//   Completed: { dot: "#3b82f6", bg: "#eff6ff", border: "#93c5fd", text: "#2563eb" },
//   Cancelled: { dot: "#ef4444", bg: "#fef2f2", border: "#fca5a5", text: "#dc2626" },
// };

export const STATUS_CFG = {
  1: {
    label: "Active",
    dot: "#22c55e",
    bg: "#f0fdf4",
    border: "#86efac",
    text: "#16a34a",
  },
  2: {
    label: "Ongoing",
    dot: "#f97316",
    bg: "#fff7ed",
    border: "#fdba74",
    text: "#ea580c",
  },
  3: {
    label: "Completed",
    dot: "#3b82f6",
    bg: "#eff6ff",
    border: "#93c5fd",
    text: "#2563eb",
  },
  4: {
    label: "Cancelled",
    dot: "#ef4444",
    bg: "#fef2f2",
    border: "#fca5a5",
    text: "#dc2626",
  },
};

// export const STATUS_OPTIONS = [
//   { value: 1, label: "Active" },
//   { value: 2, label: "Ongoing" },
//   { value: 3, label: "Completed" },
//   { value: 4, label: "Cancelled" },
// ];

export const DAY_COLORS = [
  "#8b5cf6", "#3b82f6", "#22c55e", "#f59e0b",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316",
];

// Base label style used above every input
export const labelStyle = {
  display: "block",
  fontSize: 11,
  color: colors.textMuted,
  fontWeight: 600,
  marginBottom: 4,
  textTransform: "uppercase",
  letterSpacing: ".03em",
};

// Base input style
export const inputStyle = {
  border: `1px solid ${colors.border}`,
  borderRadius: 6,
  padding: "8px 10px",
  fontSize: 13,
  width: "100%",
  outline: "none",
  color: colors.text,
  fontFamily: "inherit",
};

// Read-only / computed input style
export const readonlyInputStyle = {
  ...inputStyle,
  background: colors.primaryBg,
  color: colors.textSubtle,
};

// Section card wrapper
export const sectionCardStyle = {
  background: colors.white,
  border: `1px solid ${colors.border}`,
  borderRadius: 12,
  padding: 20,
};

// Section heading row
export const sectionHeadingStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 14,
};

// Numbered badge next to section title
export const sectionBadgeStyle = {
  background: colors.primary,
  color: colors.white,
  borderRadius: "50%",
  width: 22,
  height: 22,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontWeight: 700,
};

// Dashed "add" button
export const dashedAddButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 14px",
  border: `1.5px dashed ${colors.primary}`,
  borderRadius: 6,
  background: "transparent",
  color: colors.primary,
  fontWeight: 600,
  fontSize: 12,
  cursor: "pointer",
  fontFamily: "inherit",
};

// Icon action button — pass variant "edit" | "delete"
export const iconButtonStyle = (variant = "edit") =>
  variant === "edit"
    ? { background: colors.primaryLight, border: "none", borderRadius: 5, padding: "5px 8px", color: colors.primary, cursor: "pointer" }
    : { background: colors.dangerBg,    border: "none", borderRadius: 5, padding: "5px 8px", color: colors.danger,  cursor: "pointer" };

// Variant tab item
export const variantTabStyle = (active) => ({
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 16px",
  borderBottom: active ? `2px solid ${colors.primary}` : "2px solid transparent",
  marginBottom: -2,
  cursor: "pointer",
  color: active ? colors.primary : colors.textMuted,
  fontWeight: active ? 600 : 500,
  fontSize: 13,
  background: active ? colors.primaryBg : "transparent",
});

// Pickup table header cell
export const tableHeaderCellStyle = {
  padding: "8px 10px",
  textAlign: "left",
  color: colors.textMuted,
  fontWeight: 600,
  borderBottom: `1px solid ${colors.border}`,
  whiteSpace: "nowrap",
};

// Pickup table row cell wrapper
export const tableCellStyle = {
  padding: "4px 6px",
};

// Stat box (occupancy widget)
export const statLabelStyle = {
  fontSize: 11,
  color: colors.textMuted,
  marginBottom: 4,
};

export const statValueStyle = (color) => ({
  fontSize: 22,
  fontWeight: 700,
  color: color || colors.text,
});

// Activity card row
export const activityCardStyle = {
  display: "flex",
  alignItems: "center",
  border: `1px solid ${colors.border}`,
  borderRadius: 8,
  padding: "10px 14px",
  marginBottom: 8,
  background: colors.white,
  gap: 12,
};

export const activityTimeStyle = {
  width: 70,
  fontSize: 12,
  color: colors.textMuted,
  fontWeight: 500,
  flexShrink: 0,
};

export const activityTitleStyle = {
  fontWeight: 600,
  fontSize: 14,
  color: colors.text,
};

export const activityNotesStyle = {
  fontSize: 12,
  color: colors.textMuted,
  marginTop: 2,
};

// Day schedule panel background
export const dayPanelStyle = {
  background: colors.sectionBg,
  borderRadius: 16,
  padding: 20,
  border: `1px solid ${colors.border}`,
  marginTop: 16,
};

// Add Activity plain button
export const addActivityButtonStyle = {
  marginTop: 20,
  border: `1px solid ${colors.border}`,
  background: colors.white,
  padding: "8px 20px",
  borderRadius: 12,
  cursor: "pointer",
  fontSize: 13,
  fontFamily: "inherit",
};



// ==========================Dashboard Style===========================
export const DASHBOARDSTYLES = {
  pageBg: "bg-[#f0f4f8]",
  pagePadding: "p-5",

  colWidth: "min-w-[238px] max-w-[238px]",
  colWrapper:
    "flex flex-col bg-white border-[1.5px] border-blue-100 rounded-2xl shrink-0 shadow-sm self-start",

  colHeader:
    "flex items-center justify-between px-3 py-2.5 bg-blue-700 hover:bg-blue-800 cursor-pointer rounded-t-2xl transition-colors",
  colHeaderText: "text-[13px] font-semibold text-white flex items-center gap-1.5",
  colCount: "bg-white/25 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full",

  colBody: "flex flex-col gap-2 p-2.5 overflow-y-auto scrollbar-thin",

  cardBase:
    "bg-white border-[1.5px] border-gray-200 rounded-xl p-3 cursor-pointer group relative transition-all duration-150 hover:border-blue-500 hover:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] hover:bg-blue-50/50",
  cardTitle: "text-[12px] font-semibold leading-snug text-gray-800 pr-5",
  metaRow: "text-[11px] text-gray-600 flex items-center gap-1 mt-1",
  seatSection: "mt-2.5 pt-2 border-t border-gray-100",
  seatRow: "flex items-center justify-between text-[11px] text-gray-600 mb-1.5",
  seatTrack: "h-[5px] bg-gray-200 rounded-full overflow-hidden",
  seatFill: "h-full bg-blue-500 rounded-full transition-all",
  rateText: "text-[11px] text-gray-600 text-right mt-1",

  badgeConfirmed: "bg-green-100 text-green-800",
  badgeActive: "bg-blue-100 text-blue-800",
  badgeDraft: "bg-slate-100 text-slate-600",
  badgeOngoing: "bg-amber-100 text-amber-800",

  deleteBtn:
    "absolute top-2 right-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md w-[22px] h-[22px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",

  addBtn:
    "w-full border-[1.5px] border-dashed border-blue-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl py-2 text-[12px] text-blue-600 font-medium flex items-center justify-center gap-1 transition-colors mt-0.5",

  filterBtn:
    "flex items-center gap-1.5 border border-gray-300 bg-white rounded-xl px-3.5 py-2 text-sm hover:bg-gray-50",
  newBtn:
    "flex items-center gap-1.5 bg-blue-700 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-blue-800 transition-colors",

  // pill: "px-3.5 py-1.5 rounded-full border border-gray-200 text-xs text-gray-500 bg-white cursor-pointer hover:bg-gray-50 transition-colors",
  // pillActive: "bg-blue-700 text-white border-blue-700",
  pill: "px-3.5 py-1.5 rounded-full border text-xs cursor-pointer transition-colors",
  
  pillInactive:
    "bg-white text-gray-500 border-gray-200 hover:bg-gray-50",

  pillActive:
    "bg-blue-700 text-white border-blue-700",

  modalOverlay: "fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4",
  modalBox: "bg-white rounded-2xl shadow-xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto",
  modalHeader: "flex items-center justify-between px-5 py-4 border-b border-gray-100",
  modalTitle: "text-base font-semibold text-gray-800",
  closeBtn:
    "bg-slate-100 hover:bg-slate-200 border-none rounded-lg w-8 h-8 flex items-center justify-center text-gray-500 text-lg cursor-pointer",

  tlStatGrid: "grid grid-cols-3 gap-3 px-5 pt-4 pb-3",
  tlStatBox: "bg-blue-50 rounded-xl p-3 text-center",
  tlStatNum: "text-2xl font-bold text-blue-700",
  tlStatLabel: "text-xs text-gray-400 mt-0.5",
  tlTrack: "h-5 bg-slate-100 rounded-md relative overflow-hidden",
  tlBar:
    "h-full rounded-md absolute flex items-center px-2 text-[10px] font-semibold text-white whitespace-nowrap overflow-hidden",

  formLabel: "block text-xs font-semibold text-gray-600 mb-1",
  formInput:
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition",
  formSelect:
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-white",
  formGrid2: "grid grid-cols-2 gap-3",
  formSection: "px-5 py-4 flex flex-col gap-3",
  primaryBtn: "bg-blue-700 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-blue-800 transition-colors",
  secondaryBtn:
    "border border-gray-200 text-gray-600 rounded-lg px-5 py-2 text-sm font-medium hover:bg-gray-50 transition-colors",
  dangerBtn: "border border-red-200 text-red-500 rounded-lg px-5 py-2 text-sm font-medium hover:bg-red-50 transition-colors",
};
