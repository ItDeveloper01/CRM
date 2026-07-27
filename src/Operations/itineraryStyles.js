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

export const STATUS_OPTIONS = [
  { value: 1, label: "Active" },
  { value: 2, label: "Ongoing" },
  { value: 3, label: "Completed" },
  { value: 4, label: "Cancelled" },
];

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