import { useState, useEffect } from "react";
// import VariantsSection, { mkVariant } from "./VariantsSection";
// import DayWiseSchedule, { mkDay }     from "./DayWiseSchedule";
import DayWiseSchedule from "./ItineraryDayWiseSchedule";
import VariantsSection from "./VariantsSection";
import { mkDay } from "./ItineraryDayWiseSchedule";
import { mkVariant } from "./VariantsSection";

import { colors, labelStyle, inputStyle } from "../itineraryStyles";
import ItineraryDetailsSection from "./Itinerarydetailssection";


// ── ManageItineraryForm ───────────────────────────────────────────────────
/**
 * Props:
 *   open        {boolean}
 *   onClose     {Function}
 *   onSave      {Function}  – receives { itName, description, numDays, variants, days }
 *   initialData {object|null}
 */
export default function ManageItineraryForm({ open, onClose, onSave, initialData = null }) {
  const [itName,      setItName]  = useState("");
  const [description, setDesc]    = useState("");
  const [numDays,     setNumDays] = useState(0);
  const [days,        setDays]    = useState([]);
  const [variants,    setVariants] = useState(() => [
    {
      ...mkVariant(1),
      name: "Standard Package",
      startLocation: "Kochi",
      endLocation: "Alleppey",
      totalSeats: 0,
      occupiedSeats: 0,
    },
  ]);

  // ── Sync state when modal opens or initialData changes ──────────────────
  useEffect(() => {
    if (!open) return;

    debugger;
    if (initialData) {
      setItName(initialData.title || "");
      setDesc(initialData.description || "");
      const n = initialData.numDays || initialData.days?.length || 0;
      setNumDays(n);
      setDays(initialData.days || []);
      setVariants(
        initialData.variants?.length
          ? initialData.variants
          : [
              {
                ...mkVariant(1),
                name: "Standard Package",
                totalSeats: initialData.totalSeats || 0,
                occupiedSeats: initialData.bookedSeats || 0,
              },
            ]
      );
    } else {
      setItName("");
      setDesc("");
      setNumDays(0);
      setDays([]);
      setVariants([{ ...mkVariant(1), name: "Standard Package" }]);
    }
  }, [open, initialData]);

  // ── Update day count ────────────────────────────────────────────────────
  const updateNumDays = (n) => {
    const nn = Math.max(1, Math.min(30, Number(n) || 1));
    setNumDays(nn);
    setDays((prev) => {
      if (nn > prev.length)
        return [
          ...prev,
          ...Array.from({ length: nn - prev.length }, (_, i) =>
            mkDay(prev.length + i + 1)
          ),
        ];
      return prev.slice(0, nn);
    });
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "20px 0",
      }}
    >
      {/* Modal container */}
      <div
        style={{
          background: "#f5f6fa",
          width: "100%",
          maxWidth: "1400px",
          borderRadius: 12,
          minHeight: "90vh",
        }}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div
          style={{
            background: colors.white,
            borderBottom: `1px solid ${colors.border}`,
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 50,
            boxShadow: "0 1px 6px rgba(0,0,0,.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: colors.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              ✈️
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: colors.primary }}>
                {initialData ? "Update Itinerary" : "Create Itinerary"}
              </div>
              <div style={{ fontSize: 12, color: colors.textSubtle }}>
                Create itinerary with multiple variants and day wise schedule
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose}>✕ Cancel</button>
            <button
              onClick={() => {
                // onSave?.({ itName, description, numDays, variants, days });
                onSave?.({
  id: initialData?.id ?? null,
  itineraryBasicDetails: {
    itName,
    description,
    numDays,
  },
  variantsDetails: variants,
  days,
});
                
                onClose?.();
              }}
            >
              💾 Save Itinerary
            </button>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: 1300,
            margin: "20px auto",
            padding: "0 20px",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 16,
            height: "80vh",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto", paddingRight: 8 }}>

            {/* ── Section 1: Itinerary Details ─────────────────────────── */}
            {/* <div
              style={{
                background: colors.white,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span
                  style={{
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
                  }}
                >
                  1
                </span>
                <span style={{ fontWeight: 700, fontSize: 15, color: colors.primary }}>
                  Itinerary Details
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr 130px", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Itinerary Name *</label>
                  <input
                    value={itName}
                    onChange={(e) => setItName(e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. Kerala Backwaters Escape"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Description</label>
                  <input
                    value={description}
                    onChange={(e) => setDesc(e.target.value)}
                    style={inputStyle}
                    placeholder="e.g. Explore the beautiful backwaters…"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Number of Days *</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={numDays}
                      onChange={(e) => updateNumDays(e.target.value)}
                      style={{ ...inputStyle, paddingRight: 36 }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: colors.textSubtle,
                        fontSize: 12,
                      }}
                    >
                      days
                    </span>
                  </div>
                </div>
              </div>
            </div> */}
            <ItineraryDetailsSection
            itName = {itName}
            setItName={setItName}
            description={description}
            setDesc={setDesc}
            numDays={numDays}
            updateNumDays={updateNumDays}
            />



            {/* ── Section 2: Variants ───────────────────────────────────── */}
            <VariantsSection
              variants={variants}
              setVariants={setVariants}
              numDays={numDays}
            />

            {/* ── Section 3: Day Wise Schedule ─────────────────────────── */}
            <DayWiseSchedule days={days} setDays={setDays} />

          </div>
        </div>
      </div>
    </div>
  );
}