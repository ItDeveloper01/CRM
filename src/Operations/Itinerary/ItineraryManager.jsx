import { useState, useRef, useEffect } from "react";
import ManageItineraryForm from "./ItineraryForm";
import { useItinerary } from "./UseItinerary";
import axios from "axios";
import config from "../../config";
import { ColumnsSettings } from "lucide-react";

//fetchedMonthsCache: Stores only whether a month has already been fetched
const fetchedMonthsCache = new Set();     // to check  which months already fetch to avoid duplicate call 
// survives re-render but not page refresh
let dashboardMemory = {};    //JavaScript variable
const inFlightRequests = new Map();       // abhi pending requests: key -> Promise
// Currently visible month cache keys
//const visibleMonthCache = new Set();    
// ... STYLES, MONTH_NAMES, badgeClass, etc. same rahenge ...
const STYLES = {
  pageBg: "bg-[#f0f4f8]",
  pagePadding: "p-5",

  // Column
  colWidth: "min-w-[238px] max-w-[238px]",
  colWrapper:
    "flex flex-col bg-white border-[1.5px] border-blue-100 rounded-2xl shrink-0 shadow-sm self-start",

  // Column header — rounded top, blue bg, clickable (NOT sticky — lives outside scroll)
  colHeader:
    "flex items-center justify-between px-3 py-2.5 bg-blue-700 hover:bg-blue-800 cursor-pointer rounded-t-2xl transition-colors",
  colHeaderText:
    "text-[13px] font-semibold text-white flex items-center gap-1.5",
  colCount:
    "bg-white/25 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full",

  // Column body scroll — fills remaining height dynamically
  colBody: "flex flex-col gap-2 p-2.5 overflow-y-auto scrollbar-thin",

  // Card — with hover highlight
  cardBase:
    "bg-white border-[1.5px] border-gray-200 rounded-xl p-3 cursor-pointer group relative transition-all duration-150 hover:border-blue-500 hover:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] hover:bg-blue-50/50",
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
  deleteBtn:
    "absolute top-2 right-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md w-[22px] h-[22px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",

  // Add itinerary button
  addBtn:
    "w-full border-[1.5px] border-dashed border-blue-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl py-2 text-[12px] text-blue-600 font-medium flex items-center justify-center gap-1 transition-colors mt-0.5",

  // Toolbar
  filterBtn:
    "flex items-center gap-1.5 border border-gray-300 bg-white rounded-xl px-3.5 py-2 text-sm hover:bg-gray-50",
  newBtn:
    "flex items-center gap-1.5 bg-blue-700 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-blue-800 transition-colors",

  // Filter pills
  pill: "px-3.5 py-1.5 rounded-full border border-gray-200 text-xs text-gray-500 bg-white cursor-pointer hover:bg-gray-50 transition-colors",
  pillActive: "bg-blue-700 text-white border-blue-700",

  // Modal overlay
  modalOverlay:
    "fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4",
  modalBox:
    "bg-white rounded-2xl shadow-xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto",
  modalHeader:
    "flex items-center justify-between px-5 py-4 border-b border-gray-100",
  modalTitle: "text-base font-semibold text-gray-800",
  closeBtn:
    "bg-slate-100 hover:bg-slate-200 border-none rounded-lg w-8 h-8 flex items-center justify-center text-gray-500 text-lg cursor-pointer",

  // Timeline modal
  tlStatGrid: "grid grid-cols-3 gap-3 px-5 pt-4 pb-3",
  tlStatBox: "bg-blue-50 rounded-xl p-3 text-center",
  tlStatNum: "text-2xl font-bold text-blue-700",
  tlStatLabel: "text-xs text-gray-400 mt-0.5",
  tlTrack: "h-5 bg-slate-100 rounded-md relative overflow-hidden",
  tlBar:
    "h-full rounded-md absolute flex items-center px-2 text-[10px] font-semibold text-white whitespace-nowrap overflow-hidden",

  // Form styles
  formLabel: "block text-xs font-semibold text-gray-600 mb-1",
  formInput:
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition",
  formSelect:
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-white",
  formGrid2: "grid grid-cols-2 gap-3",
  formSection: "px-5 py-4 flex flex-col gap-3",
  primaryBtn:
    "bg-blue-700 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-blue-800 transition-colors",
  secondaryBtn:
    "border border-gray-200 text-gray-600 rounded-lg px-5 py-2 text-sm font-medium hover:bg-gray-50 transition-colors",
  dangerBtn:
    "border border-red-200 text-red-500 rounded-lg px-5 py-2 text-sm font-medium hover:bg-red-50 transition-colors",
};

//-------------------------------------------------------------
const STATUS_FILTERS = [
  {
    id: 1,
    name: "Active",
  },
  {
    id: 2,
    name: "Ongoing",
  },
  {
    id: 4,
    name: "Cancelled",
  },
  {
    id: 6,
    name: "Completed",
  },
  {
    id: 5,
    name: "On Hold",
  },
  {
    id: 7,
    name: "Draft",
  },
];
//---------------------------------------------------
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const getMonths = (year) => {
  return MONTH_NAMES.map((month) => `${month} ${year}`);
};

//------------------------------------------------------
const BAR_COLORS = [
  "#2563EB",
  "#0284c7",
  "#0891b2",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0e7490",
  "#475569",
  "#2563eb",
  "#0369a1",
  "#15803d",
];

//-----------------------------------------------------
function daysInMonth(month) {
  const [mn, yr] = month.split(" ");
  const idx = MONTH_NAMES.indexOf(mn);
  return new Date(+yr, idx + 1, 0).getDate();
}

function badgeClass(status) {
  return (
    {
      Confirmed: STYLES.badgeConfirmed,
      Active: STYLES.badgeActive,
      Draft: STYLES.badgeDraft,
      Ongoing: STYLES.badgeOngoing,
    }[status] ?? STYLES.badgeDraft
  );
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
//-------------------------------------------------------
function StatusBadge({ status }) {
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${badgeClass(status)}`}
    >
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
        <span>
          {seats}/{total} seats
        </span>
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
    <button
      onClick={onClick}
      className={`${STYLES.pill} ${active ? STYLES.pillActive : ""}`}
    >
      {label}
    </button>
  );
}

// ─── ITINERARY CARD ───────────────────────────────────────────────────────────
function ItineraryCard({ card, onDelete, onEdit }) {
  // debugger;
  // const mapToCard = (item) => {
  //   debugger;
  //   return {

  //     id: item.variantId,

  //     title: item.itName,

  //     variantName: item.variantsName,

  //     status: item.statusName,

  //     //to get status Name from id 
  //     // status:
  //     //   item.statusName ||
  //     //   getStatusName(item.status),

  //     guide: item.guideName,



  //     // Guide name ki requirement nahi hai
  //   // ID display karna ho toh:
  //   // guide:
  //   //     item.guideName ||
  //   //     (
  //   //         item.guideId != null
  //   //             ? `Guide ID: ${item.guideId}`
  //   //             : ""
  //   //     ),
  //     cities: `${item.startLocation} → ${item.endLocation}`,

  //     dates: new Date(item.startDate).toLocaleDateString(),

  //     startDate: item.startDate,

  //     endDate: item.endDate,

  //     seats: item.occupiedSeats,

  //     total: item.totalSeats,

  //     rate: `₹${item.perPaxBaseAmount}`,

  //     raw: item

  //   };

  // };

  return (
    <div className={STYLES.cardBase} onClick={() => onEdit(card)}>
      {/* Delete button */}
      <button
        className={STYLES.deleteBtn}
        title="Remove itinerary"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(card.variantId);
        }}
        aria-label="Remove itinerary"
      >
        🗑
      </button>

      <div className="flex items-start justify-between gap-2 mb-1.5">
        {/* <span className={STYLES.cardTitle}>{card.title}</span> */}
        <span className={STYLES.cardTitle}>{card.variantsName}</span>
        <StatusBadge status={card.statusName} />
      </div>

      <MetaRow icon="📅" text={new Date(card.startDate).toLocaleDateString()} />
      <MetaRow icon="👤" text={card.guideName} />
      <MetaRow icon="📍" text={`${card.startLocation} → ${card.endLocation}`} />

      <SeatBar seats={card.occupiedSeats} total={card.totalSeats} />
      <div className={STYLES.rateText}>₹{card.perPaxBaseAmount}/pax</div>
    </div>
  );
}
//----------------------------------------------------------
function KanbanColumn({
  month,
  cards,
  onDelete,
  onAddClick,
  onHeaderClick,
  onEdit,
}) {
  return (
    <div
      className={`${STYLES.colWidth} ${STYLES.colWrapper} shrink-0 h-full flex flex-col`}
    >
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
      <div
        className={`${STYLES.colBody} flex-1`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#bfdbfe #f0f4f8",
        }}
      >
        {/* Here we mapping and api data to kanben board to see properly on Itinerary card in card formate */}
        
        {cards.map((card) => (
          <ItineraryCard
            // key={card.id}
            key={card.variantId}
            card={card}
            // onDelete={(id) => onDelete(month, id)}
            onDelete={(variantId) => onDelete(month, variantId)}
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
          <button
            className={STYLES.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
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
                <span
                  className="w-28 shrink-0 font-medium text-gray-700 truncate"
                  title={c.title}
                >
                  {c.title}
                </span>
                <div className={STYLES.tlTrack} style={{ flex: 1 }}>
                  <div
                    className={STYLES.tlBar}
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      background: color,
                    }}
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
              <span
                className={`inline-block w-2.5 h-2.5 rounded-sm ${badgeClass(s)}`}
              />
              <span>{s}</span>
            </div>
          ))}
          <span className="ml-auto text-gray-400 italic">
            Click month header to open timeline
          </span>
        </div>
      </div>
    </div>
  );
}


//==========================================================
const COLUMN_WIDTH = 238;
const COLUMN_GAP = 12;
const COLUMN_PITCH = COLUMN_WIDTH + COLUMN_GAP;
const ALL_MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const STATUS_MAPPING = {
  Active: 1,
  Ongoing: 2,
  Cancelled: 4,
  Completed: 6,
  Draft: 7,
  "On Hold": 5,
};

const getStatusName = (statusId) => {
  // return STATUS_MAPPING[statusId] || "Draft";
  return STATUS_MAPPING[statusId] || "Active";
};


export default function TravelAgencyItineraryManager() {
  const { createItinerary, updateItinerary, loading, error } = useItinerary();
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const [data, setData] = useState({});
  const [timelineMonth, setTimelineMonth] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const nextId = useRef(100);
  const boardRef = useRef(null);
  const columnRefs = useRef({});

  // ── Yehi asli fix hai: cache-check ke liye REF, state nahi ──
  // Ye Set track karta hai ke kaunse cacheKey ka fetch already ho chuka
  // hai (ya chal raha hai), taaki IntersectionObserver ke stale closure
  // ki wajah se duplicate calls na jaayein.
  const fetchedKeysRef = useRef(new Set());

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthNum = currentDate.getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeFilter, setActiveFilter] = useState("Active");
  debugger;
  //dashboardCache: Stores the actual month data returned from the API.
  // const [dashboardCache, setDashboardCache] = useState({});
  const [, forceRender] = useState({});
  //floe of forceRender
  //   dashboardMemory["2026-1-7"] = rows;
  // ↓
  // forceRender({});
  // ↓
  // React Render
  // ↓
  // UI updated
  // console.log("Monthly itinerary Dashboard Data  : ", dashboardCache);
  console.log("Monthly itinerary Dashboard Data  : ", dashboardMemory);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  const getMonthLabel = (month) => `${MONTH_NAMES[month - 1]} ${selectedYear}`;
  const getCacheKey = (year, status, month) => `${year}-${status}-${month}`;

  const findMonth = (card) =>
    Object.keys(data).find((m) => data[m].some((c) => c.id === card.id)) || null;

  const handleDelete = (month, id) => {
    setData((prev) => ({
      ...prev,
      [month]: prev[month].filter((c) => c.id !== id),
    }));
  };

  const handleAddClick = (month) => {
    setSelectedMonth(month);
    setEditingItinerary(null);
    setShowItineraryModal(true);
  };

  const handleEditCard = (card) => {
    setEditingItinerary(card);
    setShowItineraryModal(true);
  };

  const handleNewBtn = () => {
    handleAddClick(getMonthLabel(Math.max(1, currentMonthNum - 1)));
  };

  const tlCards = timelineMonth ? data[timelineMonth] || [] : [];

  // const mapToCard = (item) => ({
  //   id: item.variantId,
  //   title: item.itName,
  //   variantName: item.variantsName,
  //   status: item.statusName,
  //   guide: item.guideName,
  //   cities: `${item.startLocation} → ${item.endLocation}`,
  //   dates: new Date(item.startDate).toLocaleDateString(),
  //   startDate: item.startDate,
  //   endDate: item.endDate,
  //   seats: item.occupiedSeats,
  //   total: item.totalSeats,
  //   rate: `₹${item.perPaxBaseAmount}`,
  //   raw: item,
  // });

  // const addCreatedItineraryToDashboard = (createdItinerary) => {
  //   debugger;

  //   if (!createdItinerary?.variantsDetails?.length) {
  //     console.log("No variants found in created itinerary");
  //     return;
  //   }

  //   console.log(
  //     "Adding created itinerary to dashboard:",
  //     createdItinerary
  //   );

  //   createdItinerary.variantsDetails.forEach((variant) => {
  //     debugger;
  //     if (!variant.startDate) {
  //       console.log("StartDate not found for variant:", variant);
  //       return;
  //     }

  //     // -----------------------------------------
  //     // 1. Get Year and Month from StartDate
  //     // -----------------------------------------

  //     const dateParts = variant.startDate.split("-");

  //     const year = Number(dateParts[0]);
  //     const month = Number(dateParts[1]);

  //     // -----------------------------------------
  //     // 2. Variant status
  //     // -----------------------------------------

  //     const status = variant.status;

  //     // -----------------------------------------
  //     // 3. Create dashboard cache key
  //     // year-status-month
  //     // Example: 2026-1-8
  //     // -----------------------------------------

  //     const cacheKey = `${year}-${status}-${month}`;

  //     console.log(
  //       "Created Variant Cache Key:",
  //       cacheKey
  //     );

  //     // -----------------------------------------
  //     // 4. Check whether this month/status
  //     // is already fetched in dashboard
  //     // -----------------------------------------
  //     debugger;
  //     if (dashboardMemory[cacheKey] == null) {

  //       console.log(
  //         `Dashboard cache ${cacheKey} not loaded yet.`
  //       );

  //       return;
  //     }

  //     // -----------------------------------------
  //     // 5. Create object compatible with
  //     // ItineraryVariantFlatDto / mapToCard
  //     // -----------------------------------------
  //     debugger;
  //     const newDashboardItem = {

  //       // Itinerary ID
  //       // itineraryId: createdItinerary.itineraryId,

  //       // Variant ID
  //       variantId: variant.id,

  //       // Basic itinerary details
  //       itName:
  //         createdItinerary.itineraryBasicDetails?.itName || "",

  //       // Variant details
  //       variantsName: variant.variantsName,

  //       startLocation: variant.startLocation,

  //       endLocation: variant.endLocation,

  //       startDate: variant.startDate,

  //       endDate: variant.endDate,

  //       totalSeats: variant.totalSeats ?? 0,

  //       occupiedSeats: variant.occupiedSeats ?? 0,

  //       perPaxBaseAmount:
  //         variant.perPaxBaseAmount ?? 0,

  //       // IDs only — names not required
  //       guideId: variant.guideId,
        

  //       targetAudienceId: variant.targetAudienceId,

  //       // Status ID
  //       status: variant.status,

  //       // Frontend UI ke liye locally generated
  //       statusName: getStatusName(variant.status),

  //       // Names ki requirement nahi hai
  //       guideName: "",

  //       targetAudienceName: ""
  //     };

  //     // -----------------------------------------
  //     // 6. Duplicate check
  //     // -----------------------------------------

  //     const alreadyExists =
  //       dashboardMemory[cacheKey].some(

  //         item =>
  //           item.variantId === newDashboardItem.variantId
  //       );

  //     if (alreadyExists) {

  //       console.log(
  //         "Created variant already exists:",
  //         newDashboardItem.variantId
  //       );

  //       return;
  //     }

  //     // -----------------------------------------
  //     // 7. Existing fetched array mein add karo
  //     // -----------------------------------------

  //     dashboardMemory[cacheKey] = [
  //       newDashboardItem,
  //       ...dashboardMemory[cacheKey]
  //     ];

  //     console.log(
  //       `Created itinerary added to dashboardMemory[${cacheKey}]`,
  //       dashboardMemory[cacheKey]
  //     );
  //   });

  //   // -----------------------------------------
  //   // 8. Force React re-render
  //   // -----------------------------------------
  //   debugger;
  //   forceRender({});
  // };

  // Debug ke liye — sirf tracing, logic same
  
  //used to update DashboardMemory data 
  const mergeVariantsIntoDashboard = (variants) => {

  if (!variants?.length) return;

  variants.forEach((variant) => {

    // Current variant ka key
    const newCacheKey = `${variant.year}-${variant.statusId}-${variant.month}`;

    // ----------------------------
    // STEP 1 : Remove Old Variant from all places
    // ----------------------------
    Object.keys(dashboardMemory).forEach((key) => {

      dashboardMemory[key] = dashboardMemory[key].filter(
        item => item.variantId !== variant.variantId
      );

    });

    // ----------------------------
    // STEP 2 :If new Month Not LOaded then skip
    // ----------------------------
    if (!dashboardMemory[newCacheKey]) {
      return;
    }

    // ----------------------------
    // STEP 3 : Add into New place 
    // ----------------------------
    dashboardMemory[newCacheKey].unshift(variant);

  });

  // React re-render
  forceRender({});
};

  
  let callCounter = 0;
  // ── fetchMonth: ab ref se hi check karta hai, state se nahi ──
  // const fetchMonth = async (year, month, status, forceRefresh = false) => {
  //   const cacheKey = getCacheKey(year, status, month);
  //   const callId = ++callCounter;

  //   // Ref se sync check — already fetch ho chuka ya chal raha hai toh skip
  //   if (!forceRefresh && fetchedKeysRef.current.has(cacheKey)) {
  //     return;
  //   }

  //   // Turant mark kar do — taaki isi waqt aane wali doosri intersection
  //   // events (ya rapid scroll) dobara call na bhej sakein
  //   fetchedKeysRef.current.add(cacheKey);
  //    console.log(`[REQUEST SENT #${callId}] month=${month} key=${cacheKey} at ${Date.now()}`);


  //   try {
  //     debugger;
  //     const response = await axios.get(
  //       `${config.operationsUrl}/Itinerary/GetItineraryDashboard`,
  //       { params: { Year: year, Month: month, Status: status } }
  //     );

  //     const rows = response.data.data || [];
  //     // console.log("Itinerary monthly Data : ",  response.data);
  //     console.log(`[RESPONSE RECEIVED #${callId}] month=${month} key=${cacheKey} at ${Date.now()}`);
  //     setDashboardCache((prev) => ({
  //       ...prev,
  //       [cacheKey]: rows,
  //     }));
  //   } catch (err) {
  //     console.error(err);
  //     // Fetch fail hua toh ref se hata do taaki dobara try ho sake
  //     fetchedKeysRef.current.delete(cacheKey);
  //   }
  // };
  const fetchMonth = (year, month, status, forceRefresh = false) => {
    const cacheKey = `${year}-${status}-${month}`;
    debugger;


    //Used to refresh after Create,Update,Delete 
    if (!forceRefresh) {
      // Remembers which year-status-month combinations have already been successfully fetched.
      if (fetchedMonthsCache.has(cacheKey)) {
        console.log(`[SKIP - already done] ${cacheKey}`);
        return Promise.resolve(); //Do not call api for already fetch Data 
      }
      //Prevents multiple simultaneous requests for the same year-status-month.
      if (inFlightRequests.has(cacheKey)) {
        console.log(`[SKIP - in flight] ${cacheKey}`);
        return inFlightRequests.get(cacheKey); //to prevent two api call for same month
      }
    }

    // console.log(`[REQUEST SENT] month=${month} key=${cacheKey} at ${Date.now()}`);
    console.log("Request Send :", cacheKey)

    // IMPORTANT: axios.get() call se pehle hi Map mein daal do —
    // taaki isi tick mein doosri call aaye toh turant SKIP mile
    const requestPromise = axios
      .get(`${config.operationsUrl}/Itinerary/GetItineraryDashboard`, {
        params: { Year: year, Month: month, Status: status },
      })
      .then((response) => {
        debugger;
        const rows = response.data.data || [];
        fetchedMonthsCache.add(cacheKey);
        // console.log(`[RESPONSE RECEIVED] month=${month} key=${cacheKey} at ${Date.now()}`);
        console.log("Fetch Dashboard Response : ", response);
        //setDashboardCache((prev) => ({ ...prev, [cacheKey]: rows }));
        dashboardMemory[cacheKey] = rows;

        forceRender({});
        return rows;
      })
      .catch((err) => {
        console.error(`[ERROR] month=${month} key=${cacheKey}`, err);
        fetchedMonthsCache.delete(cacheKey);
      })
      .finally(() => {
        inFlightRequests.delete(cacheKey);
      });

    // Ye line axios.get() ke turant baad, SYNCHRONOUSLY chalti hai —
    // isse pehle koi await nahi hai, isliye race-condition-proof hai
    inFlightRequests.set(cacheKey, requestPromise);

    return requestPromise;
  };

  const refreshDashboard = async () => {
    debugger;
    setLoadingDashboard(true);
    const statusId = STATUS_MAPPING[activeFilter];

    // forceRefresh=true call karo, aur cacheKey ko ref mein already
    // maujood maan ke fresh fetch karao (delete+add taaki turant re-trigger na ho)
    const requests = ALL_MONTHS.map((month) => {
      const cacheKey = getCacheKey(selectedYear, statusId, month);
      // if (fetchedKeysRef.current.has(cacheKey)) {
      //   return fetchMonth(selectedYear, month, statusId, true);
      // }
      // Sirf already fetched months ko refresh karo
      if (fetchedMonthsCache.has(cacheKey)) {
        return fetchMonth(selectedYear, month, statusId, true);
      }
      return Promise.resolve();
    });

    await Promise.all(requests);
    setLoadingDashboard(false);
  };

  const handleSave = async (request) => {
    try {
      debugger;
      let response;
      if (request.id) {

        //=================Update Itinerary===================
        response = await updateItinerary(request);
        console.log("Updated Itinerary Data is :", response);

         // it will merge Updated Variant array into Dashboard memroy
        mergeVariantsIntoDashboard(response);
        debugger;

      } else {
        // ===============Create Itinerary===================
        response = await createItinerary(request);
        console.log("create Itinerary Data is :", response);

        // it will merge newly created Variant array into Dashboard memroy
        mergeVariantsIntoDashboard(response);
        debugger;
      }

      console.log("API Response:", response);
      //await refreshDashboard();  // used to refresh Dashboard it refresh whole fetch data 
      // IMPORTANT:
      // Full dashboard refresh nahi karna.
      // Sirf already fetched month mein new object add karna.
      // addCreatedItineraryToDashboard(response);
      mergeVariantsIntoDashboard(response);
      // =============close itinerary from

      setShowItineraryModal(false);
      setEditingItinerary(null);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  // ── Filter/Year badalne par ref ko reset karo (naya filter = naya cache) ──
  // useEffect(() => {
  //   debugger;
  //   fetchedKeysRef.current = new Set();
  //   setDashboardCache({});
  // }, [selectedYear, activeFilter]);
  useEffect(() => {
    debugger;
    fetchedKeysRef.current = new Set();

  }, [selectedYear, activeFilter]);
  useEffect(() => {
    debugger;
    console.log("Dashboard Mounted");
    return () => {

      console.log("Memory Clear");
      dashboardMemory = {};

      fetchedMonthsCache.clear();

      inFlightRequests.clear();

      fetchedKeysRef.current.clear();

    };

  }, []);

  // ── Initial window fetch: current month ke pichle 1 + agle 6 (total 7) ──
  // useEffect(() => {
  //   debugger;
  //   const loadInitialWindow = async () => {
  //     setLoadingDashboard(true);
  //     const statusId = STATUS_MAPPING[activeFilter];

  //     const startMonth = Math.max(1, currentMonthNum - 1);
  //     const endMonth = Math.min(12, startMonth + 6); // 7 columns total

  //     const requests = [];
  //     for (let m = startMonth; m <= endMonth; m++) {
  //       requests.push(fetchMonth(selectedYear, m, statusId));
  //     }
  //     await Promise.all(requests);
  //     setLoadingDashboard(false);
  //   };

  //   loadInitialWindow();
  // }, [selectedYear, activeFilter]);

  // ── Initial scroll position set karo ──
  useEffect(() => {
    const container = boardRef.current;
    if (!container) return;
    const startMonth = Math.max(1, currentMonthNum - 1);
    container.scrollLeft = (startMonth - 1) * COLUMN_PITCH;
  }, [selectedYear]);

  // ── IntersectionObserver: sirf actually visible column ka fetch, no buffer ──
  useEffect(() => {
    debugger
    const container = boardRef.current;
    if (!container) return;

    const statusId = STATUS_MAPPING[activeFilter];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const month = Number(entry.target.dataset.month);
            fetchMonth(selectedYear, month, statusId);
          }

        });
      },
      {
        root: container,
        rootMargin: "0px",
        threshold: 0.15,
      }
    );

    ALL_MONTHS.forEach((month) => {
      const el = columnRefs.current[month];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [selectedYear, activeFilter]);


  return (
    <div className={`h-screen flex flex-col ${STYLES.pageBg} ${STYLES.pagePadding}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg text-blue-700">📍</span>
          <h1 className="text-base font-semibold text-gray-800">Itinerary Manager</h1>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded-lg px-3 py-2"
          >
            {[2025, 2026, 2027, 2028].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button className={STYLES.filterBtn}>⊞ Filter</button>
          <button className={STYLES.newBtn} onClick={handleNewBtn}>＋ New itinerary</button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-2">
        {STATUS_FILTERS.map((status) => (
          <FilterPill
            key={status.id}
            label={status.name}
            active={activeFilter === status.name}
            onClick={() => setActiveFilter(status.name)}
          />
        ))}
      </div>

      {loadingDashboard && (
        <div className="text-blue-700 font-medium mb-2">Loading Dashboard...</div>
      )}

      {/* Kanban board — hamesha 12 columns render, jinke paas data nahi unke liye placeholder */}
      <div ref={boardRef} className="flex-1 overflow-x-auto overflow-y-hidden pb-3 min-h-0">
        <div className="flex gap-3 h-full" style={{ minWidth: "max-content" }}>
          {ALL_MONTHS.map((month) => {
            const statusId = STATUS_MAPPING[activeFilter];
            const cacheKey = getCacheKey(selectedYear, statusId, month);
            // const isLoaded = Object.prototype.hasOwnProperty.call(dashboardCache, cacheKey);
            // const cards = isLoaded ? dashboardCache[cacheKey].map(mapToCard) : [];
            const isLoaded = dashboardMemory[cacheKey] != null;
            //it checks is data available for cahekey  isLoaded = true; 

            const cards = isLoaded
              ? dashboardMemory[cacheKey]
              : [];
              // console.log("Cards details :",cards);
            //	If isLoaded is true
            //		   ↓
            //	take dashboardMemory[cacheKey]
            //		   ↓
            //	convert each API item using mapToCard
            //		   ↓
            //	store result in cards

            //	Otherwise
            //		   ↓
            //	cards = []     it stores whole fecth data and we map it to Kanben

            //if isLoaded = true; condition is true 
            return (
              <div
                key={month}
                ref={(el) => (columnRefs.current[month] = el)}
                data-month={month}
                className={`${STYLES.colWidth} shrink-0 h-full`}
              >
                {isLoaded ? (
                  <KanbanColumn
                    month={getMonthLabel(month)}
                    cards={cards}
                    onDelete={handleDelete}
                    onAddClick={handleAddClick}
                    onHeaderClick={setTimelineMonth}
                    onEdit={handleEditCard}
                  />
                ) : (
                  <PlaceholderColumn month={getMonthLabel(month)} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {timelineMonth && (
        <TimelineModal month={timelineMonth} cards={tlCards} onClose={() => setTimelineMonth(null)} />
      )}

      <ManageItineraryForm
        open={showItineraryModal}
        onClose={() => setShowItineraryModal(false)}
        initialData={editingItinerary}
        onSave={handleSave}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p style={{ color: "gray" }}>Saving…</p>}
    </div>
  );
}

function PlaceholderColumn({ month }) {
  return (
    <div className={`${STYLES.colWrapper} h-full flex flex-col animate-pulse`}>
      <div className="flex items-center justify-between px-3 py-2.5 bg-blue-100 rounded-t-2xl">
        <span className="text-[13px] font-semibold text-blue-700 flex items-center gap-1.5">
          <span>📅</span> {month}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-2.5">
        <div className="h-20 bg-gray-100 rounded-xl" />
        <div className="h-20 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}