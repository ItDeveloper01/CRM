import { DASHBOARDSTYLES } from "./itineraryStyles";

// ─── MONTHS ───────────────────────────────────────────────────────────────
export const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
export const getMonths = (year) => MONTH_NAMES.map((m) => `${m} ${year}`);
export const ALL_MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

// ─── TIMELINE COLORS ──────────────────────────────────────────────────────
export const BAR_COLORS = [
  "#2563EB", "#0284c7", "#0891b2", "#059669", "#d97706", "#dc2626",
  "#7c3aed", "#0e7490", "#475569", "#2563eb", "#0369a1", "#15803d",
];

// ─── STATUS ───────────────────────────────────────────────────────────────
// Hardcoded for now. Jab status API se aayega, sirf ye do exports
// (STATUS_FILTERS / STATUS_MAPPING) API response se replace karne honge —
// baaki poora app inhi do exports ko import karta hai, kahin aur kuch
// nahi badalna padega.
// export const STATUS_FILTERS = [
//   { id: 1, name: "Active" },
//   { id: 2, name: "Ongoing" },
//   { id: 4, name: "Cancelled" },
//   { id: 6, name: "Completed" },
//   { id: 5, name: "On Hold" },
//   { id: 7, name: "Draft" },
// ];

// export const STATUS_MAPPING = {
//   Active: 1,
//   Ongoing: 2,
//   Cancelled: 4,
//   Completed: 6,
//   Draft: 7,
//   "On Hold": 5,
// };
// export const getStatusName = (statusId) => STATUS_MAPPING[statusId] || "Active";


// Converts API response [{id, name}] -> [{id, name}] (shape used by FilterPill map)
export const buildStatusFilters = (apiStatuses = []) =>
  apiStatuses.map((s) => ({ id: s.id, name: s.statusName }));

// Converts API response [{id, name}] -> { Active: 1, Ongoing: 2, ... }
export const buildStatusMapping = (apiStatuses = []) =>
  apiStatuses.reduce((acc, s) => {
    acc[s.statusName] = s.id;
    return acc;
  }, {});



// export const buildStatusFilters = (apiStatuses = []) =>
//   apiStatuses.map((s) => ({ id: s.id, name: s.name }));
 
// API se aaya array -> { "Active": 1, "Draft": 7, ... } lookup
// export const buildStatusMapping = (apiStatuses = []) =>
//   apiStatuses.reduce((acc, s) => {
//     acc[s.name] = s.id;
//     return acc;
//   }, {});
 
// Jab tak API ka response nahi aata (pehla render / loading state), isse
// use karo taaki screen blank na dikhe. API aate hi ye replace ho jaata hai.
// export const FALLBACK_STATUS_FILTERS = [
//   { id: 1, name: "Active" },
//   { id: 2, name: "Ongoing" },
//   { id: 4, name: "Cancelled" },
//   { id: 6, name: "Completed" },
//   { id: 5, name: "On Hold" },
//   { id: 7, name: "Draft" },
// ];
 
// export const FALLBACK_STATUS_MAPPING = {
//   Active: 1,
//   Ongoing: 2,
//   Cancelled: 4,
//   Completed: 6,
//   Draft: 7,
//   "On Hold": 5,
// };


// ─── BOARD SIZING ─────────────────────────────────────────────────────────
export const COLUMN_WIDTH = 238;
export const COLUMN_GAP = 12;
export const COLUMN_PITCH = COLUMN_WIDTH + COLUMN_GAP;

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────
export function daysInMonth(month) {
  const [mn, yr] = month.split(" ");
  const idx = MONTH_NAMES.indexOf(mn);
  return new Date(+yr, idx + 1, 0).getDate();
}

export function badgeClass(status) {
  return (
    {
      Confirmed: DASHBOARDSTYLES.badgeConfirmed,
      Active: DASHBOARDSTYLES.badgeActive,
      Draft: DASHBOARDSTYLES.badgeDraft,
      Ongoing: DASHBOARDSTYLES.badgeOngoing,
    }[status] ?? DASHBOARDSTYLES.badgeDraft
  );
}

export function blankCard(id, month) {
  return {
    id,
    title: "",
    status: "Draft",
    cat: "Leisure",
    start: 1,
    end: 7,
    dates: "",
    guide: "",
    cities: "",
    seats: 0,
    total: 0,
    rate: "₹0",
    month,
  };
}

export const getCacheKey = (year, status, month) => `${year}-${status}-${month}`;
