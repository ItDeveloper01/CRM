import { useState, useEffect } from "react";
// import VariantsSection, { mkVariant } from "./VariantsSection";
// import DayWiseSchedule, { mkDay }     from "./DayWiseSchedule";
import DayWiseSchedule from "./ItineraryDayWiseSchedule";
import VariantsSection from "./VariantsSection";
import { mkDay } from "./ItineraryDayWiseSchedule";
import { mkVariant } from "./VariantsSection";

import { colors, labelStyle, inputStyle } from "../itineraryStyles";
import ItineraryDetailsSection from "./Itinerarydetailssection";
import { getEmptyItineraryObj } from "../Model/ItineraryModel";
import { de } from "intl-tel-input/i18n";


// ── ManageItineraryForm ───────────────────────────────────────────────────
/**
 * Props:
 *   open        {boolean}
 *   onClose     {Function}
 *   onSave      {Function}  – receives { itName, description, numDays, variants, days }
 *   initialData {object|null}
 */
export default function ManageItineraryForm({ open, onClose, onSave, initialData = null }) {
  // const [tourCode, setTourCode] = useState("");
  // const [itName, setItName] = useState("");
  // const [description, setDesc] = useState("");
  // const [numDays, setNumDays] = useState(0);
  // const [days, setDays] = useState([]);
  // const [travelScope, setTravelScope] = useState([])
  // const [variants, setVariants] = useState(() => [
  //   {
  //     ...mkVariant(1),
  //     name: "Standard Package",
  //     startLocation: "Kochi",
  //     endLocation: "Alleppey",
  //     totalSeats: 0,
  //     occupiedSeats: 0,
  //   },
  // ]);
  const [itineraryObj, setItineraryObj] = useState(getEmptyItineraryObj());
  debugger;

  // ── Sync state when modal opens or initialData changes ──────────────────
  // useEffect(() => {
  //   if (!open) return;

  //   debugger;
  //   if (initialData) {
  //     setTourCode(initialData.tourCode || "");
  //     setItName(initialData.title || "");
  //     setDesc(initialData.description || "");
  //     const n = initialData.numDays || initialData.days?.length || 0;
  //     setNumDays(n);
  //     setDays(initialData.days || []);
  //     // setTravelScope(initialData.travelScope || "");       ......not null issue 
  //     setTravelScope(initialData?.travelScope ?? null)
  //     setVariants(
  //       initialData.variants?.length
  //         ? initialData.variants
  //         : [
  //           {
  //             ...mkVariant(1),
  //             name: "Standard Package",
  //             totalSeats: initialData.totalSeats || 0,
  //             occupiedSeats: initialData.bookedSeats || 0,
  //           },
  //         ]
  //     );
  //   } else {
  //     setTourCode("");
  //     setItName("");
  //     setDesc("");
  //     setNumDays(0);
  //     setDays([]);
  //     // setTravelScope("");
  //     setTravelScope(null);
  //     setVariants([{ ...mkVariant(1), name: "Standard Package" }]);
  //   }
  // }, [open, initialData]);
  useEffect(() => {

    if (!open) return;

    if (initialData) {

      setItineraryObj(structuredClone(initialData));

    }
    else {

      const obj = getEmptyItineraryObj();

      obj.variantsDetails = [
        {
          ...mkVariant(1),
          variantsName: "Standard Package"
        }
      ];

      setItineraryObj(obj);

    }

  }, [open, initialData]);



  // ── Update day count ────────────────────────────────────────────────────
  // const updateNumDays = (n) => {
  //   const nn = Math.max(1, Math.min(30, Number(n) || 1));
  //   setNumDays(nn);
  //   setDays((prev) => {
  //     if (nn > prev.length)
  //       return [
  //         ...prev,
  //         ...Array.from({ length: nn - prev.length }, (_, i) =>
  //           mkDay(prev.length + i + 1)
  //         ),
  //       ];
  //     return prev.slice(0, nn);
  //   });
  // };
  const updateNumDays = (value) => {

    const nn = Math.max(1, Math.min(30, Number(value) || 1));

    setItineraryObj(prev => {

      const days = [...prev.days];

      if (nn > days.length) {

        days.push(
          ...Array.from(
            { length: nn - days.length },
            (_, i) => mkDay(days.length + i + 1)
          )
        );

      }
      else {

        days.length = nn;
        //  days = days.slice(0, nn);    .......to print days title search in future 

      }

      return {

        ...prev,

        itineraryBasicDetails: {

          ...prev.itineraryBasicDetails,

          numDays: nn

        },

        days

      };

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
                // onSave?.({
                //   id: initialData?.id ?? null,
                //   itineraryBasicDetails: {
                //     tourCode,
                //     itName,
                //     description,
                //     numDays,
                //     travelScope,
                //   },
                //   variantsDetails: variants,
                //   days,
                // });
                onSave?.(itineraryObj);

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


            {/* <ItineraryDetailsSection
              tourCode={tourCode}
              setTourCode={setTourCode}
              itName={itName}
              setItName={setItName}
              description={description}
              setDesc={setDesc}
              numDays={numDays}
              updateNumDays={updateNumDays}
              travelScope={travelScope}
              setTravelScope={setTravelScope}
            /> */}
            <ItineraryDetailsSection

              itineraryObj={itineraryObj}
              setItineraryObj={setItineraryObj}
              updateNumDays={updateNumDays}

            />




            {/* ── Section 2: Variants ───────────────────────────────────── */}
            {/* <VariantsSection
              variants={variants}
              setVariants={setVariants}
              numDays={numDays}
            /> */}

            <VariantsSection

              itineraryObj={itineraryObj}
              setItineraryObj={setItineraryObj}

            />

            {/* ── Section 3: Day Wise Schedule ─────────────────────────── */}
            {/* <DayWiseSchedule days={days} setDays={setDays} /> */}
            <DayWiseSchedule

itineraryObj={itineraryObj}
setItineraryObj={setItineraryObj}

/>

          </div>
        </div>
      </div>
    </div>
  );
}