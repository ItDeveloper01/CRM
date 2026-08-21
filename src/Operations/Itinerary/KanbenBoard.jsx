import { useEffect, useRef } from "react";
import { DASHBOARDSTYLES } from "../itineraryStyles";
// import { ALL_MONTHS, STATUS_MAPPING, COLUMN_PITCH, badgeClass, getCacheKey } from "../Constant";
import { ALL_MONTHS, COLUMN_PITCH, badgeClass, getCacheKey } from "../Constant";

// STATUS_MAPPING,
// ─── STATUS BADGE ─────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${badgeClass(status)}`}
    >
      {status}
    </span>
  );
}

// ─── SEAT BAR ─────────────────────────────────────────────────────────────
function SeatBar({ seats, total }) {
  const p = total > 0 ? Math.round((seats / total) * 100) : 0;
  return (
    <div className={DASHBOARDSTYLES.seatSection}>
      <div className={DASHBOARDSTYLES.seatRow}>
        <span>{seats}/{total} seats</span>
        <span>{p}%</span>
      </div>
      <div className={DASHBOARDSTYLES.seatTrack}>
        <div className={DASHBOARDSTYLES.seatFill} style={{ width: `${p}%` }} />
      </div>
    </div>
  );
}

// ─── META ROW ─────────────────────────────────────────────────────────────
function MetaRow({ icon, text }) {
  return (
    <div className={DASHBOARDSTYLES.metaRow}>
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}

// ─── ITINERARY CARD ───────────────────────────────────────────────────────
// card.guideName / card.statusName abhi API row se seedha aate hain.
// Jab guide / status / targetAudience id-only aane lagein aur lookup se
// naam resolve karna pade, wo resolution UseItinerary.js mein (fetch ke
// baad) karna — is component ko lookup tables ke baare mein kuch pata
// nahi hona chahiye, ye sirf ready-made string dikhata hai.
function ItineraryCard({ card, onDelete, onEdit }) {
  return (
    <div className={DASHBOARDSTYLES.cardBase} onClick={() => onEdit(card)}>
      <button
        className={DASHBOARDSTYLES.deleteBtn}
        title="Remove itinerary"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(card.variantId);
        }}
        aria-label="Remove itinerary"
      >
        🗑
      </button>
      {/* 
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className={DASHBOARDSTYLES.cardTitle}>{card.variantsName}</span>
        <StatusBadge status={card.statusName} />
      </div> */}

        {/* Status */}
  <div className="flex justify-end mb-1">
    <StatusBadge status={card.statusName} />
  </div>

  {/* Itinerary Name + Tour Code */}
  <div className="flex items-center  gap-2 mb-1">
    {/* justify-between */}

    <span className="text-[12px] text-black bg-orange-400 px-2 py-0.5 rounded-md font-medium whitespace-nowrap">
      {card.tourCode}
    </span>
    <span className="text-[13px] font-semibold leading-snug text-gray-800 ">
      {card.itName}
    </span>

    
  </div>

  {/* Variant Name */}
  {/* <div className={`${DASHBOARDSTYLES.cardTitle} mb-2 border-l-4 border-orange-500 pl-2`}>
    {card.variantsName}
  </div> */}

  <div className={`${DASHBOARDSTYLES.cardTitle} mb-2 bg-orange-50 border-l-4 border-orange-400 px-2 py-1 rounded-r`}>
  {card.variantsName}
</div>

      <MetaRow icon="📅" text={new Date(card.startDate).toLocaleDateString()} />
      <MetaRow icon="👤" text={card.guideName} />
      <MetaRow icon="📍" text={`${card.startLocation} → ${card.endLocation}`} />

      <SeatBar seats={card.occupiedSeats} total={card.totalSeats} />
      <div className={DASHBOARDSTYLES.rateText}>₹{card.perPaxBaseAmount}/pax</div>
    </div>
  );
}

// ─── KANBAN COLUMN ────────────────────────────────────────────────────────
function KanbanColumn({ month, cards, onDelete, onAddClick, onHeaderClick, onEdit }) {
  return (
    <div className={`${DASHBOARDSTYLES.colWidth} ${DASHBOARDSTYLES.colWrapper} shrink-0 h-full flex flex-col`}>
      <button
        className={DASHBOARDSTYLES.colHeader}
        onClick={() => onHeaderClick(month)}
        title={`View ${month} timeline`}
        aria-label={`Open timeline for ${month}`}
      >
        <span className={DASHBOARDSTYLES.colHeaderText}>
          <span>📅</span> {month}
        </span>
        <span className={DASHBOARDSTYLES.colCount}>{cards.length}</span>
      </button>

      <div
        className={`${DASHBOARDSTYLES.colBody} flex-1`}
        style={{ scrollbarWidth: "thin", scrollbarColor: "#bfdbfe #f0f4f8" }}
      >
        {cards.map((card) => (
          <ItineraryCard
            key={card.variantId}
            card={card}
            onDelete={(variantId) => onDelete(month, variantId)}
            onEdit={onEdit}
          />
        ))}
        <button className={DASHBOARDSTYLES.addBtn} onClick={() => onAddClick(month)}>
          <span>＋</span> Add itinerary
        </button>
      </div>
    </div>
  );
}

// ─── PLACEHOLDER COLUMN (loading state) ───────────────────────────────────
function PlaceholderColumn({ month }) {
  return (
    <div className={`${DASHBOARDSTYLES.colWrapper} h-full flex flex-col animate-pulse`}>
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

// ─── KANBAN BOARD (exported — this is what the main file imports) ────────
// Scroll container + IntersectionObserver + 12 month columns.
// Data/caching is NOT owned here — it's injected via props so this stays
// a pure presentation component.
export function KanbanBoard({
  data,               // { [cacheKey]: rows[] }  — from useItinerary()
  selectedYear,
  activeFilter,
  // statusMapping,
  statusMapping,      // ⬅️ NEW — comes from parent, built from the API response
  getMonthLabel,      // (monthNum) => "Jan 2026"
  fetchMonth,         // (year, month, statusId) => Promise  — from useItinerary()
  onDelete,
  onAddClick,
  onHeaderClick,
  onEdit,
}) {
  const boardRef = useRef(null);
  const columnRefs = useRef({});
  const currentMonthNum = new Date().getMonth() + 1;

  // Initial scroll position — ek column pehle "abhi wale month" se
  useEffect(() => {
    const container = boardRef.current;
    if (!container) return;
    const startMonth = Math.max(1, currentMonthNum - 1);
    container.scrollLeft = (startMonth - 1) * COLUMN_PITCH;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  // Sirf actually visible column ka fetch — IntersectionObserver
  useEffect(() => {
    const container = boardRef.current;
    if (!container) return;

    // const statusId = STATUS_MAPPING[activeFilter];
    const statusId = statusMapping[activeFilter]; // ⬅️ was STATUS_MAPPING[activeFilter]


    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const month = Number(entry.target.dataset.month);
            fetchMonth(selectedYear, month, statusId);
          }
        });
      },
      { root: container, rootMargin: "0px", threshold: 0.15 }
    );

    ALL_MONTHS.forEach((month) => {
      const el = columnRefs.current[month];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [selectedYear, activeFilter, fetchMonth,statusMapping]);      // ⬅️ statusMapping added to deps

  return (
    <div ref={boardRef} className="flex-1 overflow-x-auto overflow-y-hidden pb-3 min-h-0">
      <div className="flex gap-3 h-[660px]" style={{ minWidth: "max-content" }}>
        {ALL_MONTHS.map((month) => {
          // const statusId = STATUS_MAPPING[activeFilter];
           const statusId = statusMapping[activeFilter]; // ⬅️ was STATUS_MAPPING[activeFilter]
          // const statusId = statusMapping[activeFilter];
          const cacheKey = getCacheKey(selectedYear, statusId, month);
          const isLoaded = data[cacheKey] != null;
          const cards = isLoaded ? data[cacheKey] : [];

          return (
            <div
              key={month}
              ref={(el) => (columnRefs.current[month] = el)}
              data-month={month}
              className="min-w-[238px] max-w-[238px] shrink-0 h-full"
            >
              {isLoaded ? (
                <KanbanColumn
                  month={getMonthLabel(month)}
                  cards={cards}
                  onDelete={onDelete}
                  onAddClick={onAddClick}
                  onHeaderClick={onHeaderClick}
                  onEdit={onEdit}
                />
              ) : (
                <PlaceholderColumn month={getMonthLabel(month)} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
