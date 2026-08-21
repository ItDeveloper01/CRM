
import { DASHBOARDSTYLES } from "../itineraryStyles";
import { BAR_COLORS ,daysInMonth,badgeClass} from "../Constant";

export function TimelineModal({ month, cards, onClose }) {
  if (!month) return null;
  const days = daysInMonth(month);
  const totalSeats = cards.reduce((a, c) => a + c.total, 0);
  const booked = cards.reduce((a, c) => a + c.seats, 0);
  const avail = totalSeats - booked;

  return (
    <div className={DASHBOARDSTYLES.modalOverlay} onClick={onClose}>
      <div className={DASHBOARDSTYLES.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={DASHBOARDSTYLES.modalHeader}>
          <span className={DASHBOARDSTYLES.modalTitle}>📅 {month} — Timeline</span>
          <button className={DASHBOARDSTYLES.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={DASHBOARDSTYLES.tlStatGrid}>
          {[
            { num: cards.length, label: "Itineraries" },
            { num: booked, label: "Seats booked" },
            { num: avail, label: "Available" },
          ].map(({ num, label }) => (
            <div key={label} className={DASHBOARDSTYLES.tlStatBox}>
              <div className={DASHBOARDSTYLES.tlStatNum}>{num}</div>
              <div className={DASHBOARDSTYLES.tlStatLabel}>{label}</div>
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
                <span className="w-28 shrink-0 font-medium text-gray-700 truncate" title={c.title}>
                  {c.title}
                </span>
                <div className={DASHBOARDSTYLES.tlTrack} style={{ flex: 1 }}>
                  <div
                    className={DASHBOARDSTYLES.tlBar}
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
          <span className="ml-auto text-gray-400 italic">
            Click month header to open timeline
          </span>
        </div>
      </div>
    </div>
  );
}
