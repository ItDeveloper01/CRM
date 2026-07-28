
import { useState, useRef } from "react";
import ManageItineraryForm from "./ItineraryForm";
import { useItinerary } from "./UseItinerary";
import axios from "axios";
import config from "../../config";



// ─── STYLE CONSTANTS ──────────────────────────────────────────────────────────
const STYLES = {
  pageBg: "bg-[#f0f4f8]",
  pagePadding: "p-5",

  // Column
  colWidth: "min-w-[238px] max-w-[238px]",
  colWrapper: "flex flex-col bg-white border-[1.5px] border-blue-100 rounded-2xl shrink-0 shadow-sm self-start",

  // Column header — rounded top, blue bg, clickable (NOT sticky — lives outside scroll)
  colHeader: "flex items-center justify-between px-3 py-2.5 bg-blue-700 hover:bg-blue-800 cursor-pointer rounded-t-2xl transition-colors",
  colHeaderText: "text-[13px] font-semibold text-white flex items-center gap-1.5",
  colCount: "bg-white/25 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full",

  // Column body scroll — fills remaining height dynamically
  colBody: "flex flex-col gap-2 p-2.5 overflow-y-auto scrollbar-thin",

  // Card — with hover highlight
  cardBase: "bg-white border-[1.5px] border-gray-200 rounded-xl p-3 cursor-pointer group relative transition-all duration-150 hover:border-blue-500 hover:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] hover:bg-blue-50/50",
  cardTitle: "text-[13px] font-semibold leading-snug text-gray-800 pr-5",
  metaRow: "text-[11px] text-gray-400 flex items-center gap-1 mt-1",
  seatSection: "mt-2.5 pt-2 border-t border-gray-100",
  seatRow: "flex items-center justify-between text-[11px] text-gray-500 mb-1.5",
  seatTrack: "h-[5px] bg-gray-200 rounded-full overflow-hidden",
  seatFill: "h-full bg-blue-500 rounded-full transition-all",
  rateText: "text-[11px] text-gray-400 text-right mt-1",

  // Status badges
  badgeConfirmed: "bg-green-100 text-green-800",
  badgeActive: "bg-blue-100 text-blue-800",
  badgeDraft: "bg-slate-100 text-slate-600",
  badgeOngoing: "bg-amber-100 text-amber-800",

  // Delete button (shown on hover)
  deleteBtn: "absolute top-2 right-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md w-[22px] h-[22px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",

  // Add itinerary button
  addBtn: "w-full border-[1.5px] border-dashed border-blue-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl py-2 text-[12px] text-blue-600 font-medium flex items-center justify-center gap-1 transition-colors mt-0.5",

  // Toolbar
  filterBtn: "flex items-center gap-1.5 border border-gray-300 bg-white rounded-xl px-3.5 py-2 text-sm hover:bg-gray-50",
  newBtn: "flex items-center gap-1.5 bg-blue-700 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-blue-800 transition-colors",

  // Filter pills
  pill: "px-3.5 py-1.5 rounded-full border border-gray-200 text-xs text-gray-500 bg-white cursor-pointer hover:bg-gray-50 transition-colors",
  pillActive: "bg-blue-700 text-white border-blue-700",

  // Modal overlay
  modalOverlay: "fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4",
  modalBox: "bg-white rounded-2xl shadow-xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto",
  modalHeader: "flex items-center justify-between px-5 py-4 border-b border-gray-100",
  modalTitle: "text-base font-semibold text-gray-800",
  closeBtn: "bg-slate-100 hover:bg-slate-200 border-none rounded-lg w-8 h-8 flex items-center justify-center text-gray-500 text-lg cursor-pointer",

  // Timeline modal
  tlStatGrid: "grid grid-cols-3 gap-3 px-5 pt-4 pb-3",
  tlStatBox: "bg-blue-50 rounded-xl p-3 text-center",
  tlStatNum: "text-2xl font-bold text-blue-700",
  tlStatLabel: "text-xs text-gray-400 mt-0.5",
  tlTrack: "h-5 bg-slate-100 rounded-md relative overflow-hidden",
  tlBar: "h-full rounded-md absolute flex items-center px-2 text-[10px] font-semibold text-white whitespace-nowrap overflow-hidden",

  // Form styles
  formLabel: "block text-xs font-semibold text-gray-600 mb-1",
  formInput: "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition",
  formSelect: "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-white",
  formGrid2: "grid grid-cols-2 gap-3",
  formSection: "px-5 py-4 flex flex-col gap-3",
  primaryBtn: "bg-blue-700 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-blue-800 transition-colors",
  secondaryBtn: "border border-gray-200 text-gray-600 rounded-lg px-5 py-2 text-sm font-medium hover:bg-gray-50 transition-colors",
  dangerBtn: "border border-red-200 text-red-500 rounded-lg px-5 py-2 text-sm font-medium hover:bg-red-50 transition-colors",
};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const STATUS_FILTERS = ["All", "Confirmed", "Active", "Ongoing", "Draft"];
const MONTHS_ORDER = ["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const STATUS_OPTIONS = ["Draft", "Active", "Confirmed", "Ongoing"];
const CAT_OPTIONS = ["Leisure", "Family", "Adventure", "Corporate"];

const BAR_COLORS = [
  "#2563EB", "#0284c7", "#0891b2", "#059669", "#d97706", "#dc2626",
  "#7c3aed", "#0e7490", "#475569", "#2563eb", "#0369a1", "#15803d",
];

function daysInMonth(month) {
  const [mn, yr] = month.split(" ");
  const idx = MONTH_NAMES.indexOf(mn);
  return new Date(+yr, idx + 1, 0).getDate();
}

function badgeClass(status) {
  return { Confirmed: STYLES.badgeConfirmed, Active: STYLES.badgeActive, Draft: STYLES.badgeDraft, Ongoing: STYLES.badgeOngoing }[status] ?? STYLES.badgeDraft;
}

// ─── BLANK CARD TEMPLATE ─────────────────────────────────────────────────────
function blankCard(id, month) {
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

// ─── DUMMY DATA ───────────────────────────────────────────────────────────────
const INITIAL_DATA = {
  "Jan 2026": [
    {

    //   id: 1,
    //   title: "Kerala Backwaters Escape",
    //   description: "Explore the beautiful backwaters of Kerala with houseboat stays and scenic village walks.",
    //   numDays: 4,
    //   // ── top-level fields editingCard passes directly ──
    //   total: 20,                           // → totalSeats
    //   seats: 8,                            // → bookedSeats  (lowercase 's')
    //   startDate: "2026-01-05",
    //   endDate: "2026-01-08",
    //   guide: "James D'Silva",
    //   rate: "₹18000",
    //   variants: [
    //     {
    //       // ── Variant Meta ──
    //       id: "1001",
    //       variantName: "Standard Package",
    //       status: "Active",           // references a status string / enum
    //       startLocation: "Kochi",
    //       endLocation: "Alleppey",
    //       startDate: "2026-01-05",
    //       endDate: "2026-01-08",    // auto-calc: startDate + numDays - 1

    //       // ── Seats & Pricing ──
    //       totalSeats: 20,
    //       occupiedSeats: 8,
    //       // availableSeats & occupancyRate are computed:
    //       //   availableSeats = totalSeats - occupiedSeats  → 12
    //       //   occupancyRate  = (occupiedSeats/totalSeats)*100 → 40%

    //       guideId: 1,                 // → James D'Silva
    //       perPaxBaseAmount: 18000.00,
    //       discountPercent: 10,            // %
    //       // totalAmount is computed: baseAmount - (baseAmount * discount/100) → 16200

    //       // ── Pickup Points ──
    //       pickupPoints: [
    //         {
    //           id: "1",                  // → Kochi Airport / Kochi, Kerala
    //           point: "kochi",
    //           location: "kerala",
    //           rate: 25000,
    //           totalSeats: 12,
    //           occupiedSeats: 5,
    //         },

    //       ],

    //       // ── Day-wise Schedule ──

    //     },

    //   ],
    //   days: [
    //     {
    //       dayId: 1,
    //       // title: "Arrival & Kochi Sightseeing",
    //       // description: "Welcome to Kochi! City tour and evening by the harbour.",
    //       activities: [
    //         { id: "a1", time: "09:00 AM", title: "Airport Pickup", notes: "Pickup from Kochi Airport, transfer to hotel." },
    //         { id: "a2", time: "11:00 AM", title: "Hotel Check-in", notes: "Check-in at Fragrant Nature Kochi." },
    //         { id: "a3", time: "02:00 PM", title: "Fort Kochi Walk", notes: "Visit Chinese Fishing Nets, Dutch Palace & Jew Town." },
    //         { id: "a4", time: "06:30 PM", title: "Sunset at Marine Drive", notes: "Leisure walk along Marine Drive." },
    //       ],
    //     },
    //     {
    //       dayId: 2,
    //       // title: "Kochi → Alleppey Houseboat",
    //       // description: "Board a traditional kettuvallam and cruise the backwaters.",
    //       activities: [
    //         { id: "a5", time: "08:00 AM", title: "Breakfast & Checkout", notes: "Buffet breakfast at hotel, luggage transfer arranged." },
    //         { id: "a6", time: "10:00 AM", title: "Drive to Alleppey", notes: "1.5 hr drive via NH66." },
    //         { id: "a7", time: "12:00 PM", title: "Houseboat Check-in", notes: "Welcome drink & orientation on houseboat." },
    //         { id: "a8", time: "03:00 PM", title: "Backwater Cruise", notes: "Cruise through narrow canals & village life." },
    //         { id: "a9", time: "07:00 PM", title: "Dinner on Deck", notes: "Kerala fish curry & karimeen served on board." },
    //       ],
    //     },
    //     {
    //       dayId: 3,
    //       // title: "Alleppey Village Experience",
    //       // description: "Morning canoe ride and local village interactions.",
    //       activities: [
    //         { id: "a10", time: "06:30 AM", title: "Sunrise Canoe Ride", notes: "Small canoe through narrow canals at sunrise." },
    //         { id: "a11", time: "09:00 AM", title: "Breakfast on Board", notes: "Traditional Kerala breakfast — appam & stew." },
    //         { id: "a12", time: "11:00 AM", title: "Village Walk", notes: "Visit toddy-tapper families and coir-making units." },
    //         { id: "a13", time: "04:00 PM", title: "Cooking Demo", notes: "Learn to cook Kerala prawn masala with local chef." },
    //       ],
    //     },
    //     {
    //       dayId: 4,
    //       // title: "Departure",
    //       // description: "Check-out, souvenir shopping and drop-off.",
    //       activities: [
    //         { id: "a14", time: "08:00 AM", title: "Checkout from Houseboat", notes: "Pack bags, final breakfast on board." },
    //         { id: "a15", time: "10:00 AM", title: "Souvenir Shopping", notes: "Stop at Alleppey market — spices, coir products." },
    //         { id: "a16", time: "12:00 PM", title: "Drop-off at Kochi Airport", notes: "Transfer to Kochi Airport for onward journey." },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   id: 2, title: "Spiti Valley Expedition", description: "spiti testing ", numDays: [3], status: "Draft", cat: "Family", start: 20, end: 30, dates: "20–30 Jan", guide: "TBD", cities: "Delhi", seats: 4, total: 12, rate: "₹55,000",
    //   days: [3]


    // },

    id: 1,

  itineraryBasicDetails: {
    tourCode: "KD001",
    itName: "Kerala Backwaters Escape",
    description:
      "Explore the beautiful backwaters of Kerala with houseboat stays and scenic village walks.",
    numDays: 4,
    travelScope: 1 // 1 = Domestic, 2 = International
  },

  variantsDetails: [
    {
      id: "1001",
      variantsName: "Standard Package",
      status: "Active",

      startLocation: "Kochi",
      endLocation: "Alleppey",

      startDate: "2026-01-05",
      endDate: "2026-01-08",

      totalSeats: 20,
      occupiedSeats: 8,

      guideId: 1,

      perPaxBaseAmount: 18000,
      discountPercent: 10,

      pickupPoints: [
        {
          id: "1",
          pickupPoint: "Kochi Airport",
          pickupLocation: "Kerala",
          ratePerPax: 25000,
          // totalSeats: 12,
          // occupiedSeats: 5
        }
      ]
    }
  ],

  days: [
    {
      dayId: 1,
      activities: [
        {
          id: "a1",
          activityTime: "09:00 AM",
          activityTitle: "Airport Pickup",
          activityNotes: "Pickup from Kochi Airport"
        },
        {
          id: "a2",
          activityTime: "11:00 AM",
          activityTitle: "Hotel Check-in",
          activityNotes: "Check in to hotel"
        }
      ]
    },

    {
      dayId: 2,
      activities: [
        {
          id: "a3",
          time: "09:00 AM",
          title: "Drive to Alleppey",
          notes: "Travel to Alleppey"
        }
      ]
    },

    {
      dayId: 3,
      activities: [
        {
          id: "a4",
          time: "10:00 AM",
          title: "Village Tour",
          notes: "Explore local villages"
        }
      ]
    },

    {
      dayId: 4,
      activities: [
        {
          id: "a5",
          time: "09:00 AM",
          title: "Departure",
          notes: "Drop to Airport"
        }
      ]
    }
  
  ],
}
],
  "Feb 2026": [
    { id: 3, title: "Rann of Kutch Festival", status: "Confirmed", cat: "Leisure", start: 2, end: 6, dates: "2–6 Feb", guide: "Sneha Patel", cities: "Ahmedabad, Bhuj", seats: 22, total: 25, rate: "₹18,000" },
    { id: 4, title: "Coorg Coffee Trail", status: "Active", cat: "Leisure", start: 14, end: 18, dates: "14–18 Feb", guide: "Priya Nair", cities: "Bangalore, Coorg", seats: 10, total: 16, rate: "₹21,000" },
    { id: 5, title: "Sundarbans Safari", status: "Draft", cat: "Family", start: 22, end: 26, dates: "22–26 Feb", guide: "TBD", cities: "Kolkata", seats: 0, total: 15, rate: "₹28,000" },
  ],
  "Mar 2026": [
    { id: 6, title: "Holi Vrindavan Special", status: "Confirmed", cat: "Leisure", start: 10, end: 14, dates: "10–14 Mar", guide: "Arjun Mehta", cities: "Delhi, Mathura, Agra", seats: 30, total: 30, rate: "₹15,000" },
    { id: 7, title: "Meghalaya Living Roots", status: "Active", cat: "Family", start: 20, end: 27, dates: "20–27 Mar", guide: "Riya Sharma", cities: "Guwahati, Shillong", seats: 14, total: 20, rate: "₹32,000" },
  ],
  "Apr 2026": [
    { id: 8, title: "Hampi Heritage Walk", status: "Confirmed", cat: "Leisure", start: 3, end: 7, dates: "3–7 Apr", guide: "Kabir Singh", cities: "Bangalore, Hampi", seats: 18, total: 20, rate: "₹16,500" },
    { id: 9, title: "Valley of Flowers Trek", status: "Draft", cat: "Family", start: 15, end: 22, dates: "15–22 Apr", guide: "TBD", cities: "Haridwar, Govindghat", seats: 2, total: 18, rate: "₹38,000" },
    { id: 10, title: "Kaziranga Rhino Trail", status: "Active", cat: "Leisure", start: 25, end: 30, dates: "25–30 Apr", guide: "James D'Silva", cities: "Guwahati, Kaziranga", seats: 12, total: 14, rate: "₹26,000" },
  ],
  "May 2026": [
    { id: 11, title: "Kerala Backwaters Tour", status: "Confirmed", cat: "Leisure", start: 4, end: 10, dates: "4–10 May", guide: "Rajan Pillai", cities: "Mumbai, Pune, Nashik", seats: 12, total: 18, rate: "₹24,500" },
    { id: 12, title: "Rajasthan Desert Circuit", status: "Draft", cat: "Leisure", start: 15, end: 22, dates: "15–22 May", guide: "Vikram Singh", cities: "Delhi, Jaipur", seats: 8, total: 24, rate: "₹32,000" },
    { id: 13, title: "Char Dham Yatra", status: "Ongoing", cat: "Family", start: 5, end: 20, dates: "5–20 May", guide: "Priya Nair", cities: "Haridwar, Rishikesh", seats: 35, total: 40, rate: "₹45,000" },
    { id: 14, title: "Darjeeling Tea Tour", status: "Confirmed", cat: "Leisure", start: 18, end: 23, dates: "18–23 May", guide: "Sneha Patel", cities: "Kolkata, Darjeeling", seats: 16, total: 16, rate: "₹22,000" },
  ],
  "Jun 2026": [
    { id: 15, title: "Goa Monsoon Escape", status: "Active", cat: "Leisure", start: 10, end: 14, dates: "10–14 Jun", guide: "Sunita Naik", cities: "Mumbai, Pune", seats: 28, total: 30, rate: "₹18,500" },
    { id: 16, title: "Himachal Mountain Drive", status: "Confirmed", cat: "Family", start: 18, end: 25, dates: "18–25 Jun", guide: "Mohan Thakur", cities: "Delhi, Chandigarh", seats: 14, total: 16, rate: "₹28,000" },
    { id: 17, title: "Coorg Monsoon Retreat", status: "Draft", cat: "Leisure", start: 22, end: 26, dates: "22–26 Jun", guide: "TBD", cities: "Bangalore, Coorg", seats: 0, total: 12, rate: "₹19,000" },
  ],
  "Jul 2026": [
    { id: 18, title: "Andaman Island Hop", status: "Confirmed", cat: "Leisure", start: 5, end: 12, dates: "5–12 Jul", guide: "James D'Silva", cities: "Chennai, Kolkata, Bangalore", seats: 18, total: 20, rate: "₹42,000" },
    { id: 19, title: "Spiti Valley Expedition", status: "Draft", cat: "Family", start: 20, end: 30, dates: "20–30 Jul", guide: "TBD", cities: "Delhi", seats: 4, total: 12, rate: "₹55,000" },
    { id: 20, title: "Ladakh Bike Tour", status: "Active", cat: "Leisure", start: 12, end: 22, dates: "12–22 Jul", guide: "Kabir Singh", cities: "Delhi, Manali, Leh", seats: 9, total: 10, rate: "₹48,000" },
  ],
  "Aug 2026": [
    { id: 21, title: "Northeast Explorer", status: "Confirmed", cat: "Family", start: 5, end: 14, dates: "5–14 Aug", guide: "Riya Sharma", cities: "Kolkata, Shillong, Tawang", seats: 16, total: 18, rate: "₹36,000" },
    { id: 22, title: "Independence Day Special", status: "Active", cat: "Leisure", start: 12, end: 16, dates: "12–16 Aug", guide: "Arjun Mehta", cities: "Delhi, Agra, Jaipur", seats: 40, total: 45, rate: "₹14,000" },
  ],
  "Sep 2026": [
    { id: 23, title: "Pushkar Camel Fair", status: "Draft", cat: "Leisure", start: 20, end: 26, dates: "20–26 Sep", guide: "TBD", cities: "Jaipur, Pushkar, Ajmer", seats: 0, total: 20, rate: "₹22,000" },
    { id: 24, title: "Mysore Dasara Tour", status: "Confirmed", cat: "Family", start: 28, end: 30, dates: "28–30 Sep", guide: "Priya Nair", cities: "Bangalore, Mysore", seats: 24, total: 30, rate: "₹17,500" },
  ],
  "Oct 2026": [
    { id: 25, title: "Diwali Varanasi Exp.", status: "Confirmed", cat: "Leisure", start: 18, end: 23, dates: "18–23 Oct", guide: "Kabir Singh", cities: "Mumbai, Varanasi", seats: 20, total: 20, rate: "₹25,000" },
    { id: 26, title: "Jim Corbett Safari", status: "Active", cat: "Family", start: 5, end: 10, dates: "5–10 Oct", guide: "Vikram Singh", cities: "Delhi, Ramnagar", seats: 12, total: 16, rate: "₹30,000" },
    { id: 27, title: "Sikkim Autumn Trek", status: "Draft", cat: "Family", start: 15, end: 24, dates: "15–24 Oct", guide: "TBD", cities: "Bagdogra, Gangtok", seats: 3, total: 14, rate: "₹40,000" },
  ],
  "Nov 2026": [
    { id: 28, title: "Rajasthan Royal Tour", status: "Confirmed", cat: "Leisure", start: 2, end: 10, dates: "2–10 Nov", guide: "Arjun Mehta", cities: "Delhi, Jaipur, Udaipur", seats: 18, total: 20, rate: "₹52,000" },
    { id: 29, title: "Goa Beach Holiday", status: "Active", cat: "Leisure", start: 15, end: 22, dates: "15–22 Nov", guide: "Sunita Naik", cities: "Mumbai, Goa", seats: 35, total: 40, rate: "₹20,000" },
    { id: 30, title: "Hampi Winter Special", status: "Draft", cat: "Family", start: 25, end: 29, dates: "25–29 Nov", guide: "TBD", cities: "Bangalore, Hampi", seats: 0, total: 16, rate: "₹15,000" },
  ],
  "Dec 2026": [
    { id: 31, title: "Christmas in Goa", status: "Confirmed", cat: "Leisure", start: 22, end: 28, dates: "22–28 Dec", guide: "Sunita Naik", cities: "Mumbai, Goa", seats: 45, total: 50, rate: "₹28,000" },
    { id: 32, title: "New Year Kerala", status: "Active", cat: "Leisure", start: 26, end: 31, dates: "26–31 Dec", guide: "Rajan Pillai", cities: "Kochi, Alleppey, Kovalam", seats: 28, total: 30, rate: "₹35,000" },
    { id: 33, title: "Himalayan New Year", status: "Confirmed", cat: "Family", start: 27, end: 31, dates: "27–31 Dec", guide: "Mohan Thakur", cities: "Delhi, Manali", seats: 16, total: 20, rate: "₹42,000" },
  ],
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${badgeClass(status)}`}>
      {status}
    </span>
  );
}

// ─── SEAT BAR ─────────────────────────────────────────────────────────────────
function SeatBar({ seats, total }) {
  const p = total > 0 ? Math.round((seats / total) * 100) : 0;
  return (
    <div className={STYLES.seatSection}>
      <div className={STYLES.seatRow}>
        <span>{seats}/{total} seats</span>
        <span>{p}%</span>
      </div>
      <div className={STYLES.seatTrack}>
        <div className={STYLES.seatFill} style={{ width: `${p}%` }} />
      </div>
    </div>
  );
}

// ─── META ROW ─────────────────────────────────────────────────────────────────
function MetaRow({ icon, text }) {
  return (
    <div className={STYLES.metaRow}>
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}

// ─── FILTER PILL ──────────────────────────────────────────────────────────────
function FilterPill({ label, active, onClick }) {
  return (
    <button onClick={onClick} className={`${STYLES.pill} ${active ? STYLES.pillActive : ""}`}>
      {label}
    </button>
  );
}

// ─── ITINERARY CARD ───────────────────────────────────────────────────────────
function ItineraryCard({ card, onDelete, onEdit }) {
  // debugger;
  return (
    <div
      className={STYLES.cardBase}
      onClick={() => onEdit(card)}
    >
      {/* Delete button */}
      <button
        className={STYLES.deleteBtn}
        title="Remove itinerary"
        onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
        aria-label="Remove itinerary"
      >
        🗑
      </button>

      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className={STYLES.cardTitle}>{card.title}</span>
        <StatusBadge status={card.status} />
      </div>

      <MetaRow icon="📅" text={card.dates} />
      <MetaRow icon="👤" text={card.guide} />
      <MetaRow icon="📍" text={card.cities} />

      <SeatBar seats={card.seats} total={card.total} />
      <div className={STYLES.rateText}>{card.rate}/pax</div>
    </div>
  );
}


// ─── ITINERARY FORM MODAL (shared for Add + Edit) ────────────────────────────
// function ItineraryFormModal({ mode, card, month, onClose, onSave, onDelete }) {
//   const [form, setForm] = useState(card);

//   const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

//   const handleSave = () => {
//     if (!form.title.trim()) return;
//     onSave(form);
//     onClose();
//   };

//   const handleDelete = () => {
//     if (window.confirm("Delete this itinerary?")) {
//       onDelete(form.id);
//       onClose();
//     }
//   };

//   return (
//     <div className={STYLES.modalOverlay} onClick={onClose}>
//       <div className={STYLES.modalBox} onClick={(e) => e.stopPropagation()}>
//         {/* Header */}
//         <div className={STYLES.modalHeader}>
//           <div className="flex items-center gap-2">
//             <span className="text-blue-700 text-lg">{mode === "edit" ? "✏️" : "➕"}</span>
//             <span className={STYLES.modalTitle}>
//               {mode === "edit" ? "Edit Itinerary" : `Add Itinerary — ${month}`}
//             </span>
//           </div>
//           <button className={STYLES.closeBtn} onClick={onClose} aria-label="Close">✕</button>
//         </div>

//         <div className={STYLES.formSection}>
//           {/* Title */}
//           <div>
//             <label className={STYLES.formLabel}>Itinerary Title *</label>
//             <input
//               className={STYLES.formInput}
//               placeholder="e.g. Andaman Island Hop"
//               value={form.title}
//               onChange={(e) => set("title", e.target.value)}
//             />
//           </div>

//           {/* Status & Category */}
//           <div className={STYLES.formGrid2}>
//             <div>
//               <label className={STYLES.formLabel}>Status</label>
//               <select className={STYLES.formSelect} value={form.status} onChange={(e) => set("status", e.target.value)}>
//                 {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className={STYLES.formLabel}>Category</label>
//               <select className={STYLES.formSelect} value={form.cat} onChange={(e) => set("cat", e.target.value)}>
//                 {CAT_OPTIONS.map((c) => <option key={c}>{c}</option>)}
//               </select>
//             </div>
//           </div>

//           {/* Dates */}
//           <div className={STYLES.formGrid2}>
//             <div>
//               <label className={STYLES.formLabel}>Start Day</label>
//               <input
//                 type="number" min={1} max={31}
//                 className={STYLES.formInput}
//                 value={form.start}
//                 onChange={(e) => set("start", +e.target.value)}
//               />
//             </div>
//             <div>
//               <label className={STYLES.formLabel}>End Day</label>
//               <input
//                 type="number" min={1} max={31}
//                 className={STYLES.formInput}
//                 value={form.end}
//                 onChange={(e) => set("end", +e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Dates label */}
//           <div>
//             <label className={STYLES.formLabel}>Date Label</label>
//             <input
//               className={STYLES.formInput}
//               placeholder="e.g. 5–12 Jan"
//               value={form.dates}
//               onChange={(e) => set("dates", e.target.value)}
//             />
//           </div>

//           {/* Guide */}
//           <div>
//             <label className={STYLES.formLabel}>Guide Name</label>
//             <input
//               className={STYLES.formInput}
//               placeholder="e.g. James D'Silva"
//               value={form.guide}
//               onChange={(e) => set("guide", e.target.value)}
//             />
//           </div>

//           {/* Cities */}
//           <div>
//             <label className={STYLES.formLabel}>Cities / Route</label>
//             <input
//               className={STYLES.formInput}
//               placeholder="e.g. Mumbai, Goa"
//               value={form.cities}
//               onChange={(e) => set("cities", e.target.value)}
//             />
//           </div>

//           {/* Seats & Total */}
//           <div className={STYLES.formGrid2}>
//             <div>
//               <label className={STYLES.formLabel}>Booked Seats</label>
//               <input
//                 type="number" min={0}
//                 className={STYLES.formInput}
//                 value={form.seats}
//                 onChange={(e) => set("seats", +e.target.value)}
//               />
//             </div>
//             <div>
//               <label className={STYLES.formLabel}>Total Seats</label>
//               <input
//                 type="number" min={0}
//                 className={STYLES.formInput}
//                 value={form.total}
//                 onChange={(e) => set("total", +e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Rate */}
//           <div>
//             <label className={STYLES.formLabel}>Rate per Pax</label>
//             <input
//               className={STYLES.formInput}
//               placeholder="e.g. ₹24,000"
//               value={form.rate}
//               onChange={(e) => set("rate", e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between gap-2">
//           {mode === "edit" ? (
//             <button className={STYLES.dangerBtn} onClick={handleDelete}>
//               🗑 Delete
//             </button>
//           ) : <div />}
//           <div className="flex gap-2">
//             <button className={STYLES.secondaryBtn} onClick={onClose}>Cancel</button>
//             <button className={STYLES.primaryBtn} onClick={handleSave}>
//               {mode === "edit" ? "Save Changes" : "Add Itinerary"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// ─── KANBAN COLUMN ────────────────────────────────────────────────────────────
function KanbanColumn({ month, cards, onDelete, onAddClick, onHeaderClick, onEdit }) {
  return (
    <div className={`${STYLES.colWidth} ${STYLES.colWrapper} shrink-0 h-full flex flex-col`}>
      {/* Sticky header — sits outside scroll container */}
      <button
        className={STYLES.colHeader}
        onClick={() => onHeaderClick(month)}
        title={`View ${month} timeline`}
        aria-label={`Open timeline for ${month}`}
      >
        <span className={STYLES.colHeaderText}>
          <span>📅</span> {month}
        </span>
        <span className={STYLES.colCount}>{cards.length}</span>
      </button>

      {/* Scrollable card body — grows to fill remaining column height */}
      <div className={`${STYLES.colBody} flex-1`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#bfdbfe #f0f4f8",
        }}
      >
        {cards.map((card) => (
          <ItineraryCard
            key={card.id}
            card={card}
            onDelete={(id) => onDelete(month, id)}
            onEdit={onEdit}
          />
        ))}
        <button className={STYLES.addBtn} onClick={() => onAddClick(month)}>
          <span>＋</span> Add itinerary
        </button>
      </div>
    </div>
  );
}

// ─── TIMELINE MODAL ───────────────────────────────────────────────────────────
function TimelineModal({ month, cards, onClose }) {
  if (!month) return null;
  const days = daysInMonth(month);
  const totalSeats = cards.reduce((a, c) => a + c.total, 0);
  const booked = cards.reduce((a, c) => a + c.seats, 0);
  const avail = totalSeats - booked;

  return (
    <div className={STYLES.modalOverlay} onClick={onClose}>
      <div className={STYLES.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={STYLES.modalHeader}>
          <span className={STYLES.modalTitle}>📅 {month} — Timeline</span>
          <button className={STYLES.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={STYLES.tlStatGrid}>
          {[
            { num: cards.length, label: "Itineraries" },
            { num: booked, label: "Seats booked" },
            { num: avail, label: "Available" },
          ].map(({ num, label }) => (
            <div key={label} className={STYLES.tlStatBox}>
              <div className={STYLES.tlStatNum}>{num}</div>
              <div className={STYLES.tlStatLabel}>{label}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between px-5 pb-1 text-[10px] text-gray-400">
          <span className="w-28 shrink-0" />
          {[1, 5, 10, 15, 20, 25, days].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="px-5 pb-5 flex flex-col gap-2">
          {cards.map((c, i) => {
            const leftPct = ((c.start - 1) / days) * 100;
            const widthPct = ((c.end - c.start + 1) / days) * 100;
            const color = BAR_COLORS[i % BAR_COLORS.length];
            return (
              <div key={c.id} className="flex items-center gap-2 text-xs">
                <span className="w-28 shrink-0 font-medium text-gray-700 truncate" title={c.title}>{c.title}</span>
                <div className={STYLES.tlTrack} style={{ flex: 1 }}>
                  <div
                    className={STYLES.tlBar}
                    style={{ left: `${leftPct}%`, width: `${widthPct}%`, background: color }}
                  >
                    {c.dates}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-5 pb-4 pt-1 border-t border-gray-100 flex gap-4 flex-wrap text-xs text-gray-500">
          {[...new Set(cards.map((c) => c.status))].map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <span className={`inline-block w-2.5 h-2.5 rounded-sm ${badgeClass(s)}`} />
              <span>{s}</span>
            </div>
          ))}
          <span className="ml-auto text-gray-400 italic">Click month header to open timeline</span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function TravelAgencyItineraryManager() {
  debugger;
  const { createItinerary, updateItinerary, loading, error } = useItinerary();
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null); // null = add mode
  const [data, setData] = useState(INITIAL_DATA);
  console.log("Monthly itinerary : ", data);
  const [activeFilter, setActiveFilter] = useState("All");
  const [timelineMonth, setTimelineMonth] = useState(null);
  // const [editCard, setEditCard] = useState(null);         // card being edited
  // const [addMonth, setAddMonth] = useState(null);          // month for new card modal
  // const [addModalCard, setAddModalCard] = useState(null);  // blank card for add modal
  const [manageFormOpen, setManageFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const nextId = useRef(100);

  // Find which month a card belongs to
  const findMonth = (card) => {
    return Object.keys(data).find((m) => data[m].some((c) => c.id === card.id)) || null;
  };

  debugger;
  // console.log("MOnthly data :" + data);


  // Delete a card from a month
  const handleDelete = (month, id) => {
    setData((prev) => ({
      ...prev,
      [month]: prev[month].filter((c) => c.id !== id),
    }));
  };

  // Open add modal
  // const handleAddClick = (month) => {
  //   const newCard = blankCard(nextId.current, month);
  //   setAddMonth(month);
  //   setAddModalCard(newCard);
  // };

  const handleAddClick = (month) => {
    setSelectedMonth(month);
    // setEditingCard(null);
    // setManageFormOpen(true);
    setEditingItinerary(null);
    setShowItineraryModal(true);
    console.log("HandleADDClick :", month);
    debugger;
  };

  // Save a new card
  // const handleAddSave = (card) => {
  //   nextId.current++;
  //   setData((prev) => ({
  //     ...prev,
  //     [addMonth]: [...(prev[addMonth] || []), card],
  //   }));
  //   setAddMonth(null);
  //   setAddModalCard(null);
  // };

  const handleAddSave = (card) => {
    setData((prev) => ({
      ...prev,
      [selectedMonth]: [...(prev[selectedMonth] || []), card],


    }));

    setManageFormOpen(false);
    setSelectedMonth(null);

    debugger;

    console.log("Card Details : ", card);
  };

  // Open edit modal
  // const handleEditCard = (card) => {
  //   setEditCard(card);
  // };
  const handleEditCard = (card) => {
    // setEditingCard(card);
    // setManageFormOpen(true);


    // setEditingItinerary(INITIAL_DATA); // pass the full itinerary object
    setEditingItinerary(card); // ← was passing INITIAL_DATA by mistake
    setShowItineraryModal(true);
    debugger;

  };
  // Save edits to existing card
  const handleEditSave = (updated) => {
    const month = findMonth(updated);
    if (!month) return;
    setData((prev) => ({
      ...prev,
      [month]: prev[month].map((c) => (c.id === updated.id ? updated : c)),
    }));
    // setEditCard(null);
    setEditingCard(null);
    setManageFormOpen(false);
  };

  // Delete from edit modal
  // const handleEditDelete = (id) => {
  //   const month = findMonth(editCard);
  //   if (!month) return;
  //   handleDelete(month, id);
  //   setEditCard(null);
  // };
  const handleEditDelete = (id) => {
    if (!editingCard) return;

    const month = findMonth(editingCard);
    if (!month) return;

    handleDelete(month, id);

    setEditingCard(null);
    setManageFormOpen(false);
  };

  // "New itinerary" button — open add modal for current/first month
  const handleNewBtn = () => {
    const month = MONTHS_ORDER[0];
    handleAddClick(month);
  };

  const handleManageFormSave = (formData) => {
    debugger;
    console.log("new itinerary :", formData);
    if (editingCard) {
      const month = findMonth(editingCard);

      setData((prev) => ({
        ...prev,
        [month]: prev[month].map((c) =>
          c.id === editingCard.id
            ? {
              ...c,
              title: formData.destination,
              guide: formData.guide,
              status: formData.status,
              seats: formData.bookedSeats,
              total: formData.totalSeats,
              rate: `₹${formData.ratePerPax}`,
              itineraryDays: formData.days,
            }
            : c
        ),
      }));
    } else {
      debugger;
      const newCard = {
        id: nextId.current++,     //bcoz of this you will get duplicate id to new created card 
        title: formData.destination,
        guide: formData.guide,
        status: formData.status,
        seats: formData.bookedSeats,
        total: formData.totalSeats,
        rate: `₹${formData.ratePerPax}`,
        itineraryDays: formData.days,
      };

      setData((prev) => ({
        ...prev,
        [selectedMonth]: [
          ...(prev[selectedMonth] || []),
          newCard,
        ],
      }));
    }

    setManageFormOpen(false);
    setEditingCard(null);
    console.log("Formdata", formData);

  };

  const tlCards = timelineMonth ? (data[timelineMonth] || []) : [];

  /// New Hanldesave 
  const handleSave = async (request) => {

    // ============API written inside useItinerary=============

    try {
       console.log("Request object:", request);

      debugger;
      let response;

      if (request.id) {

        response = await updateItinerary(request);

      } else {

        response = await createItinerary(request);
        console.log("Payload : ",response);
        
      }

      console.log("API Response :", response);

      if (request.id) {

        debugger;
        // UPDATE
        const month = findMonth(editingItinerary);

        if (month) {

          setData(prev => ({
            ...prev,
            [month]: prev[month].map(c =>
              c.id === request.id
                ? response
                : c
            )
          }));

        }

      } else {

        // CREATE
        setData(prev => ({
          ...prev,
          [selectedMonth]: [
            ...(prev[selectedMonth] || []),
            response
          ]
        }));

      }

      setShowItineraryModal(false);
      setEditingItinerary(null);

    } catch (err) {

      console.error(err);

    }

  };

  return (
    <div className={`h-screen flex flex-col ${STYLES.pageBg} ${STYLES.pagePadding}`}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg text-blue-700">📍</span>
          <h1 className="text-base font-semibold text-gray-800">Itinerary Manager</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className={STYLES.filterBtn}>⊞ Filter</button>
          <button className={STYLES.newBtn} onClick={handleNewBtn}>＋ New itinerary</button>
        </div>
      </div>

      {/* ── Filter Pills ── */}
      <div className="flex gap-2 mb-4 flex-wrap shrink-0">
        {STATUS_FILTERS.map((f) => (
          <FilterPill key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
        ))}
      </div>

      {/* ── Kanban Board — fills remaining height, scrolls horizontally ── */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-3 min-h-0">
        <div className="flex gap-3 h-full" style={{ minWidth: "max-content" }}>
          {MONTHS_ORDER.map((month) => {
            const allCards = data[month] || [];
            const cards = activeFilter === "All"
              ? allCards
              : allCards.filter((c) => c.status === activeFilter);
            return (
              <KanbanColumn
                key={month}
                month={month}
                cards={cards}
                onDelete={handleDelete}
                onAddClick={handleAddClick}
                onHeaderClick={setTimelineMonth}
                onEdit={handleEditCard}
              />
            );
          })}
        </div>
      </div>

      {/* ── Timeline Modal ── */}
      {timelineMonth && (
        <TimelineModal
          month={timelineMonth}
          cards={tlCards}
          onClose={() => setTimelineMonth(null)}
        />
      )}

      {/* ── Edit Card Modal ── */}
      {/* {editCard && (
        <ItineraryFormModal
          mode="edit"
          card={editCard}
          month={findMonth(editCard)}
          onClose={() => setEditCard(null)}
          onSave={handleEditSave}
          onDelete={handleEditDelete}
        />
      )} */}

      {/* ── Add Card Modal ── */}
      {/* {addMonth && addModalCard && (
        <ItineraryFormModal
          mode="add"
          card={addModalCard}
          month={addMonth}
          onClose={() => { setAddMonth(null); setAddModalCard(null); }}
          onSave={handleAddSave}
          onDelete={() => {}}
        />
      )} */}

      {/* 09.06.2026 */}
      {/* <ManageItineraryForm
        open={manageFormOpen}
        onClose={() => {
          setManageFormOpen(false);
          setEditingCard(null);
        }}
        onSave={handleManageFormSave}
        initialData={
          editingCard
            ? {
              title: editingCard.title,
              description: editingCard.description,
              numDays: editingCard.numDays,
              // destination: editingCard.title,
              // status: editingCard.status,
              // guide: editingCard.guide,
              totalSeats: editingCard.total,
              bookedSeats: editingCard.seats,
              // ratePerPax: editingCard.rate?.replace("₹", ""),
              // days: editingCard.itineraryDays || [],
              days: editingCard.days || [],
              // startDate: editingCard.startDate,
              // endDate: editingCard.endDate,
              variants: editingCard.variants || []
            }
            : null
        }
      /> */}

      {/* <ManageItineraryForm
        open={showItineraryModal}
        onClose={() => setShowItineraryModal(false)}
        initialData={editingItinerary}
        onSave={ async (formData) => {
          console.log(" itineray formData details : ", formData);
            try {
              debugger;

              // let str= config.operationsUrl + "/Itinerary/GetTestOperations";
               let str= config.operationsUrl + "/Itinerary/CreateItinerary";
              console.log(config.operationsUrl);
              const response = await axios.post(str,formData);


              console.log("Response from API:", response.data);

          } catch (err) {
              console.error(err);
          }

          if (editingItinerary) {
            // UPDATE — find which month this card lives in and replace it
            const month = findMonth(editingItinerary);
            if (month) {
              setData((prev) => ({
                ...prev,
                [month]: prev[month].map((c) =>
                  c.id === editingItinerary.id
                    ? {
                      ...c,
                      // ...formData,    .......unccomment and delete below lines to get data from form data directly 
                      title: formData.itName,
                      description: formData.description,
                      numDays: formData.numDays,
                      days: formData.days,
                      variantsDetails: formData.variants,
                      total: formData.variants[0]?.totalSeats ?? c.total,
                      seats: formData.variants[0]?.occupiedSeats ?? c.seats,
                    }
                    : c
                ),
              }));
            }
          } else {
            // CREATE — add to the selected month


            const createItinerary = {
              id: nextId.current++,
              
              // itineraryBasicDetails: {
              //   itName: formData.itName,
              //   description: formData.description,
              //   numDays: formData.numDays,
              // },

              // days: formData.days,
              // variantsDetails: formData.variants,
              ...formData,
              
            };

            console.log("created formdata :", createItinerary.formData);

            console.log("Created itinerary:", createItinerary);

            setData((prev) => ({
              ...prev,
              [selectedMonth]: [
                ...(prev[selectedMonth] || []),
                createItinerary,
              ],
            }));
          }

          setShowItineraryModal(false);
          setEditingItinerary(null);
        }}
      /> */}

      <ManageItineraryForm
        open={showItineraryModal}
        onClose={() => setShowItineraryModal(false)
                      //  setEditingItinerary(null);
        }
        initialData={editingItinerary}
        onSave={handleSave}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p style={{ color: "gray" }}>Saving…</p>}
    </div>
  );
}
