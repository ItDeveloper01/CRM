import React, { useEffect, useMemo, useState } from "react";

// ─── Dummy data (replace with API response) ───────────────────────────────────
const DUMMY_REQUIREMENTS = [
  { id: 1,  specialRequirements: "Wheelchair access",   isFree: true,  extraCostLabel: null },
  { id: 2,  specialRequirements: "Vegetarian meals",    isFree: true,  extraCostLabel: null },
  { id: 3,  specialRequirements: "Vegan meals",         isFree: true,  extraCostLabel: null },
  { id: 4,  specialRequirements: "Jain meals",          isFree: true,  extraCostLabel: null },
  { id: 5,  specialRequirements: "Early check-in",      isFree: true,  extraCostLabel: null },
  { id: 6,  specialRequirements: "Late check-out",      isFree: true,  extraCostLabel: null },
  { id: 7,  specialRequirements: "Child-friendly room", isFree: true,  extraCostLabel: null },
  { id: 8,  specialRequirements: "Infant cot",          isFree: true,  extraCostLabel: null },
  { id: 9,  specialRequirements: "Private transfer",    isFree: false, extraCostLabel: "₹2,500/pax" },
  { id: 10, specialRequirements: "Honeymoon setup",     isFree: false, extraCostLabel: "₹3,000/booking" },
  { id: 11, specialRequirements: "Adventure activities",isFree: false, extraCostLabel: "₹1,800/pax" },
  { id: 12, specialRequirements: "Spa package",         isFree: false, extraCostLabel: "₹4,500/pax" },
];

// ─── API loader (swap dummy for real fetch when ready) ────────────────────────
async function fetchSpecialRequirements() {
  // TODO: replace with real endpoint
  // const res = await fetch("/api/master/special-requirements");
  // if (!res.ok) throw new Error("Failed to load");
  // return res.json();

  // Dummy fallback
  return new Promise((resolve) =>
    setTimeout(() => resolve(DUMMY_REQUIREMENTS), 400)
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function HolidaySpecialRequirements({
  selectedIds = [],
  onSave,
  onClose,
  onRequirementsLoaded, // optional — parent uses this to resolve chip labels
}) {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [selected, setSelected]         = useState([]);

  // Load from API on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchSpecialRequirements()
      .then((data) => { if (!cancelled) { setRequirements(data); setLoading(false); onRequirementsLoaded?.(data); } })
      .catch((err)  => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  // Initialise selection (edit mode: pre-tick whatever was saved)
  useEffect(() => {
    setSelected(Array.isArray(selectedIds) ? selectedIds : []);
  }, [selectedIds]);

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return requirements;
    return requirements.filter((x) =>
      (x.specialRequirements ?? x.name ?? "").toLowerCase().includes(q)
    );
  }, [requirements, search]);

  const toggleSelection = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const paidSelectedCount = requirements.filter(
    (r) => !r.isFree && selected.includes(r.id)
  ).length;

  // ── Render states ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.center}>
        <span style={styles.muted}>Loading requirements…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <span style={{ color: "#A32D2D" }}>Error: {error}</span>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "inherit" }}>

      {/* Search */}
      <input
        type="text"
        placeholder="Search requirements…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
        autoFocus
      />
{/* Bulk action bar */}
<div style={{
  display: "flex", alignItems: "center", gap: 8,
  marginBottom: 12,
}}>
  <button type="button"
    onClick={() => setSelected(filteredItems.map((x) => x.id))}
    style={bulkBtn}
  >
    Select all
  </button>

  <button type="button"
    onClick={() => setSelected([])}
    style={bulkBtn}
  >
    Clear all
  </button>

  <button type="button"
    onClick={() => setSelected(Array.isArray(selectedIds) ? selectedIds : [])}
    style={bulkBtn}
  >
    ↺ Reset
  </button>

  {/* live count on the right */}
  <span style={{ marginLeft: "auto", fontSize: 12, color: "#666" }}>
    {selected.length} of {requirements.length} selected
  </span>
</div>
      {/* Grid */}
      <div style={styles.grid}>
        {filteredItems.length === 0 && (
          <div style={{ ...styles.muted, gridColumn: "1 / -1", padding: "12px 0" }}>
            No requirements found.
          </div>
        )}

        {filteredItems.map((item) => {
          const isChecked = selected.includes(item.id);
          const isFree    = item.isFree !== false;

          return (
            <label
              key={item.id}
              style={{
                ...styles.card,
                border: isChecked
                  ? `1px solid ${isFree ? "#639922" : "#BA7517"}`
                  : "1px solid rgba(0,0,0,0.12)",
                background: isChecked
                  ? (isFree ? "#EAF3DE" : "#FAEEDA")
                  : "#fff",
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleSelection(item.id)}
                style={{
                  marginTop: 2,
                  accentColor: isFree ? "#639922" : "#BA7517",
                  flexShrink: 0,
                }}
              />
              <div>
                <span style={styles.cardLabel}>{item.specialRequirements}</span>
                {isFree ? (
                  <span style={{ ...styles.badge, color: "#3B6D11" }}>✓ Free</span>
                ) : (
                  <span style={{ ...styles.badge, color: "#854F0B" }}>
                    + {item.extraCostLabel ?? "Paid add-on"}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        <span style={styles.legendItem}>
          <span style={{ ...styles.legendDot, background: "#EAF3DE", border: "1px solid #639922" }} />
          Free
        </span>
        <span style={styles.legendItem}>
          <span style={{ ...styles.legendDot, background: "#FAEEDA", border: "1px solid #BA7517" }} />
          Paid add-on
        </span>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerLeft}>
          <span style={styles.muted}>
            Selected: <strong style={{ color: "#111" }}>{selected.length}</strong>
          </span>
          {paidSelectedCount > 0 && (
            <span style={styles.paidBadge}>
              ⚠ {paidSelectedCount} paid add-on{paidSelectedCount > 1 ? "s" : ""} selected
            </span>
          )}
        </div>

        <div style={styles.footerRight}>
          <button type="button" onClick={onClose} style={styles.cancelBtn}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave?.(selected)}
            style={styles.saveBtn}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const bulkBtn = {
  padding: "5px 12px",
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,0.15)",
  background: "transparent",
  cursor: "pointer",
  color: "#444",
};
const styles = {
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 12px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.15)",
    fontSize: 14,
    outline: "none",
    marginBottom: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 10,
  },
  card: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "11px 13px",
    borderRadius: 10,
    cursor: "pointer",
    transition: "border 0.15s, background 0.15s",
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: 500,
    display: "block",
    lineHeight: 1.35,
    color: "#111",
  },
  badge: {
    fontSize: 11,
    marginTop: 4,
    display: "block",
  },
  legend: {
    display: "flex",
    gap: 16,
    marginTop: 12,
    fontSize: 12,
    color: "#666",
  },
  legendItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    display: "inline-block",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 14,
    borderTop: "1px solid rgba(0,0,0,0.08)",
  },
  footerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  footerRight: {
    display: "flex",
    gap: 8,
  },
  muted: {
    fontSize: 13,
    color: "#666",
  },
  paidBadge: {
    fontSize: 12,
    color: "#854F0B",
    background: "#FAEEDA",
    border: "1px solid #BA7517",
    padding: "3px 8px",
    borderRadius: 6,
  },
  cancelBtn: {
    padding: "8px 16px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.15)",
    background: "transparent",
    cursor: "pointer",
    fontSize: 13,
  },
  saveBtn: {
    padding: "8px 18px",
    borderRadius: 10,
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
  },
  center: {
    padding: "24px 0",
    textAlign: "center",
  },
  
};
