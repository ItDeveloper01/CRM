import { useState } from "react";
import {
  colors,
  STATUS_CFG,
  labelStyle,
  inputStyle,
  readonlyInputStyle,
  dashedAddButtonStyle,
  iconButtonStyle,
  variantTabStyle,
  tableHeaderCellStyle,
  tableCellStyle,
  statLabelStyle,
  statValueStyle,
  STATUS_OPTIONS,
} from "../itineraryStyles";
import { getEmptyPickupPointObj, getEmptyVariantObj } from "../Model/ItineraryModel";
// import { STATUS_OPTIONS } from "../ItineraryStyle";

// ── helpers ───────────────────────────────────────────────────────────────
function addDays(ds, n) {
  if (!ds || !n) return "";
  const d = new Date(ds);
  if (isNaN(d)) return "";
  d.setVariantFieldDate(d.getDate() + Number(n) - 1);
  // return d.toLocaleDateString("en-GB");
  return d.toISOString().split("T")[0]; // ✅ FIX
}

// let _id = 100;
// const uid = () => String(++_id);

// export function mkVariant(n) {

//   return {
//     id: uid(),
//     variantsName: `Variant ${n}`,
//     // status: "Active",
//     status: null,
//     startLocation: "",
//     endLocation: "",
//     startDate: null,
//     endDate: null,
//     totalSeats: 0,
//     occupiedSeats: 0,
//     targetAudienceId: null,
//     // pickups:[]
//     // pickups: [{ id: uid(), point: "", location: "", rate: "" }],
//     // , total: 0, occupied: 0
//   };
// }

// const guides = [
//   { id: 1, guidename: "Priya Mishra" },
//   { id: 2, guidename: "Diya Mirza" },
//   { id: 3, guidename: "Shantanu Naidu" },
// ];

// ── StatusDropdown ────────────────────────────────────────────────────────
export function mkVariant(n) {

    const obj = getEmptyVariantObj();

    // obj.id = uid();
    obj.variantsName = `Variant ${n}`;

    obj.pickupPoints = [
        {
            ...getEmptyPickupPointObj(),
            // id: uid()
        }
    ];

    return obj;
}

function StatusDropdown({ value, onChange }) {
  const [open, setVariantFieldOpen] = useState(false);
  const cfg = STATUS_CFG[value] || STATUS_CFG.Active;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setVariantFieldOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          width: "100%",
          border: `1px solid ${cfg.border}`,
          borderRadius: 6,
          padding: "7px 10px",
          background: cfg.bg,
          color: cfg.text,
          fontWeight: 500,
          fontSize: 13,
          cursor: "pointer",
          justifyContent: "space-between",
          fontFamily: "inherit",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: cfg.dot,
              display: "inline-block",
            }}
          />
          {value}
        </span>
        <span style={{ fontSize: 10 }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            zIndex: 100,
            background: colors.white,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            minWidth: "100%",
            overflow: "hidden",
          }}
        >
          {Object.keys(STATUS_CFG).map((s) => {
            const c = STATUS_CFG[s];
            return (
              <div
                key={s}
                onClick={() => { onChange(s); setVariantFieldOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 14px",
                  cursor: "pointer",
                  background: s === value ? "#f8f9ff" : colors.white,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot }} />
                <span style={{ color: c.text, fontWeight: 500 }}>{s}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── PickupTable ───────────────────────────────────────────────────────────
function PickupTable({ pickups = [], onChange }) {
  debugger;
  // const upd = (id, k, v) =>
  //   onChange(pickups.map((p) => (p.id === id ? { ...p, [k]: v } : p)));
  const upd = (index, field, value) => {

    const arr = [...pickups];

    arr[index] = {
        ...arr[index],
        [field]: value
    };

    onChange(arr);
};
  // const add = () =>
  //   onChange([...pickups, { id: uid(), pickupPoint: "", pickupCity: "", ratePerPax: 0 }]);
  //=======new========
  const add = () =>
    onChange([
        ...pickups,
        {
            ...getEmptyPickupPointObj(),
            // id: uid()
        }
    ]);

  // , total: 0, occupied: 0
  // const del = (id) => {
  //   if (pickups.length > 1) onChange(pickups.filter((p) => p.id !== id));
  // };
  const del = (index) => {

    if (pickups.length <= 1)
        return;

    onChange(
        pickups.filter((_, i) => i !== index)
    );

};

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ color: colors.primary, fontWeight: 600, fontSize: 12, marginBottom: 8 }}>
        Pickup Points &amp; Pricing
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: "#f8f9ff" }}>
            {["#", "Pickup Point", "Pickup Location", "Per Pax Rate (₹)", "Actions"].map((h) => (
              <th key={h} style={tableHeaderCellStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pickups?.map((p, i) => (
            <tr key={p.id || i} style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
              {/*old=== key={p.id} */}
              <td style={{ padding: "8px 10px", color: colors.textSubtle, fontWeight: 500 }}>
                {i + 1}.
              </td>
              <td style={tableCellStyle}>
                <input
                  value={p.pickupPoint}
                  // onChange={(e) => upd(p.id, "pickupPoint", e.target.value)}
                  onChange={(e)=>upd(i,"pickupPoint",e.target.value)}
                  placeholder="e.g. Kochi Airport"
                  style={inputStyle}
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  value={p.pickupCity}
                  // onChange={(e) => upd(p.id, "pickupCity", e.target.value)}
                  onChange={(e)=>upd(i,"pickupCity",e.target.value)}
                  placeholder="e.g. Kochi, Kerala"
                  style={inputStyle}
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  value={p.ratePerPax || ""}
                  // onChange={(e) => upd(p.id, "ratePerPax", e.target.value)}
                  // onChange={(e) => upd(p.id, "ratePerPax", e.target.value === "" ? null : Number(e.target.value))}
                  onChange={(e)=>
upd(
i,
"ratePerPax",
e.target.value===""?null:Number(e.target.value)
)
}
                  placeholder="25,000"
                  style={{ ...inputStyle, width: 90 }}
                />
              </td>
              <td style={{ padding: "4px 10px" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={iconButtonStyle("edit")}>✏️</button>
                  {/* <button onClick={() => del(p.id)} style={iconButtonStyle("delete")}>🗑️</button> */}
                  <button onClick={()=>del(i)} style={iconButtonStyle("delete")}>🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={add} style={{ ...dashedAddButtonStyle, marginTop: 10 }}>
        + Add Pickup Point
      </button>
    </div>
  );
}

// ── VariantPanel ──────────────────────────────────────────────────────────
function VariantPanel({ variant, numDays, onChange }) {
  debugger;
  // const setVariantField = (k, v) => {
  //   const upd = { ...variant, [k]: v };
  //   if (k === "startDate") upd.endDate = addDays(v, numDays);
  //   onChange(upd);
  // };

  // =========new======
  const setVariantField = (field,value)=>{

    const updatedVariant={
        ...variant,
        [field]:value
    };

    if(field==="startDate"){
        updatedVariant.endDate=addDays(value,numDays);
    }

    onChange(updatedVariant);
}

  const pct =
    variant.totalSeats > 0
      ? Math.round((variant.occupiedSeats / variant.totalSeats) * 100)
      : 0;
  const avail = Math.max(0, variant.totalSeats - variant.occupiedSeats);

  const totalAmountAfterDiscount =
    (Number(variant.perPaxBaseAmount) || 0) -
    ((Number(variant.perPaxBaseAmount) || 0) * (Number(variant.discountPercent) || 0)) / 100;

  const targetAudiences = [
    { id: 1, audiencename: "Family" },
    { id: 2, audiencename: "Couple" },
    { id: 3, audiencename: "Friends" },
    { id: 4, audiencename: "Solo Traveller" },
  ];
  //  console.log("Target audiemce list ", targetAudiences);
  const guides = [
    { id: 1, guidename: "Priya Mishra" },
    { id: 2, guidename: "Diya Mirza" },
    { id: 3, guidename: "Shantanu Naidu" },
  ];

  return (
    <div
      style={{
        border: "1.5px solid #6366f1",
        borderRadius: 10,
        padding: 16,
        background: colors.white,
      }}
    >
      {/* Row 1: name, status, locations */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 160px 1fr 1fr 180px",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div>
          <label style={labelStyle}>Variant Name *</label>
          <input
            value={variant.variantsName}
            onChange={(e) => setVariantField("variantsName", e.target.value)}
            style={inputStyle}
            placeholder="Standard Package"
          />
        </div>
        <div>
          <label style={labelStyle}>Status *</label>
          {/* <StatusDropdown value={variant.status} onChange={(v) => setVariantField("status", v)} /> */}
          <select
            value={variant.status ?? ""}
            // onChange={(e) =>
            //     handleVariantChange(
            //         index,
            //         "status",
            //         Number(e.target.value) // converts string to integer
            //     )
            // }
            // onChange={(e) => setVariantField("status", e.target.value)}
            onChange={(e) =>
              setVariantField(
                "status",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
            style={{ ...inputStyle, width: 160 }}
          >
            <option value="">Select Status</option>

            {STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Start City *</label>
          <input
            value={variant.startLocation}
            onChange={(e) => setVariantField("startLocation", e.target.value)}
            style={inputStyle}
            placeholder="Kochi"
          />
        </div>
        <div>
          <label style={labelStyle}>End City *</label>
          <input
            value={variant.endLocation}
            onChange={(e) => setVariantField("endLocation", e.target.value)}
            style={inputStyle}
            placeholder="Alleppey"
          />
        </div>
        <div>
          <label style={labelStyle}>Target Audience *</label>
          <select
            value={variant.targetAudienceId ?? ""}
            // onChange={(e) => setVariantField("targetAudienceId", Number(e.target.value))}
            onChange={(e) =>
              setVariantField(
                "targetAudienceId",
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
            style={inputStyle}
          >
            <option value="">Select Audience</option>
            {targetAudiences.map((aud) => (
              <option key={aud.id} value={aud.id}>
                {aud.audiencename}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: dates + occupancy stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto 1fr",
          gap: 16,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
          <div>
            <label style={labelStyle}>Start Date *</label>
            <input
              type="date"
              value={variant.startDate}
              onChange={(e) => setVariantField("startDate", e.target.value)}
              style={{ ...inputStyle, width: 145 }}
            />
          </div>
          <div style={{ paddingBottom: 2, color: colors.primary, fontSize: 18 }}>→</div>
          <div>
            <label style={labelStyle}>End Date (Auto)</label>
            <input
              value={variant.endDate}
              readOnly
              style={{ ...readonlyInputStyle, width: 115 }}
              placeholder="Auto"
            />
          </div>
        </div>

        <div style={{ width: 1, height: 50, background: colors.border }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {[
            { label: "Total Seats", val: variant.totalSeats, color: colors.text },
            { label: "Occupied Seats", val: variant.occupiedSeats, color: colors.text },
            { label: "Available Seats", val: avail, color: colors.success },
            { label: "Occupancy Rate", val: pct + "%", color: colors.primary },
          ].map(({ label, val, color }, i, arr) => (
            <div
              key={label}
              style={{
                textAlign: "center",
                borderRight: i < arr.length - 1 ? `1px solid ${colors.border}` : "none",
                padding: "4px 8px",
              }}
            >
              <div style={statLabelStyle}>{label}</div>
              <div style={statValueStyle(color)}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: seats, guide, pricing */}
      <div style={{ display: "flex", gap: 12, marginBottom: 4 }}>
        <div>
          <label style={labelStyle}>Total Seats</label>
          <input
            type="number"
            min="0"
            value={variant.totalSeats}
            onChange={(e) => setVariantField("totalSeats", Number(e.target.value))}
            style={{ ...inputStyle, width: 100 }}
          />
        </div>
        <div>
          <label style={labelStyle}>Occupied Seats</label>
          <input
            type="number"
            min="0"
            max={variant.totalSeats}
            value={variant.occupiedSeats}
            onChange={(e) =>
              setVariantField("occupiedSeats", Math.min(Number(e.target.value), variant.totalSeats))
            }
            style={{ ...inputStyle, width: 100 }}
          />
        </div>
        <div>
          <label style={labelStyle}>Guide *</label>
          <select
            value={variant.guideId || ""}
            onChange={(e) => setVariantField("guideId", e.target.value)}
            // uncomment below code to pass null or int value to backend  adjust setVariantField for guide
            //            onChange={(e) =>
            //   setVariantFieldGuide(
            //     e.target.value === "" ? null : Number(e.target.value)
            //   )
            // }
            style={{ ...inputStyle, width: 180 }}
          >
            <option value="">Select Guide</option>
            {guides.map((guide) => (
              <option key={guide.id} value={guide.id}>
                {guide.guidename}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Base Amount</label>
          <input
            type="number"
            min="0"
            value={variant.perPaxBaseAmount || ""}
            onChange={(e) => setVariantField("perPaxBaseAmount", Number(e.target.value))}
            style={{ ...inputStyle, width: 140 }}
            placeholder="0.00"
          />
        </div>
        <div>
          <label style={labelStyle}>Discount (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={variant.discountPercent || ""}
            onChange={(e) => setVariantField("discountPercent", Number(e.target.value))}
            style={{ ...inputStyle, width: 120 }}
            placeholder="0"
          />
        </div>
        <div>
          <label style={labelStyle}>Total Amount</label>
          <input
            value={totalAmountAfterDiscount.toFixed(2)}
            readOnly
            style={{
              ...inputStyle,
              width: 140,
              background: "#f8f9ff",
              color: colors.success,
              fontWeight: 600,
            }}
          />
        </div>
      </div>

      <PickupTable
        pickups={variant.pickupPoints}
        onChange={(pts) => onChange({ ...variant, pickupPoints: pts })}
      />
    </div>
  );
}

// ── VariantsSection ───────────────────────────────────────────────────────
/**
 * Props:
 *   variants      {Array}    – array of variant objects
 *   setVariantFieldVariants   {Function} – state setVariantFieldter from parent
 *   numDays       {number}   – used to auto-calculate end date
 */
export default function VariantsSection({ variants, setVariantFieldVariants, numDays }) {
  const [activeTab, setVariantFieldActiveTab] = useState(null);

  const tabId = activeTab || variants[0]?.id;
  const activeVariant = variants.find((v) => v.id === tabId) || variants[0];
  const activeIndex = variants.findIndex(
    v => v.id === activeVariant.id
);

  // const updVariant = (id, v) =>
  //   setVariantFieldVariants((prev) => prev.map((x) => (x.id === id ? v : x)));
const updVariant=(index,newVariant)=>{

    setVariantFieldVariants(prev=>{

        const arr=[...prev];

        arr[index]=newVariant;

        return arr;

    });

}


  // const addVariant = () => {
  //   const v = mkVariant(variants.length + 1);
  //   setVariantFieldVariants((prev) => [...prev, v]);
  //   setVariantFieldActiveTab(v.id);
  // };

  const addVariant = () => {

    const v = mkVariant(variants.length + 1);

    setVariantFieldVariants(prev => {

        const arr = [...prev, v];

        setVariantFieldActiveTab(arr.length - 1);

        return arr;

    });

};

  // const removeVariant = (id) => {
  //   if (variants.length === 1) return;
  //   const rest = variants.filter((v) => v.id !== id);
  //   setVariantFieldVariants(rest);
  //   if (tabId === id) setVariantFieldActiveTab(rest[0].id);
  // };

  const removeVariant = (index) => {

    if (variants.length <= 1)
        return;

    const arr = variants.filter((_, i) => i !== index);

    setVariantFieldVariants(arr);

    if (activeTab === variants[index]?.id) {
        setVariantFieldActiveTab(arr[0]?.id ?? null);
    }

};

  return (
    <div
      style={{
        background: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: 20,
      }}
    >
      {/* Section heading */}
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
          2
        </span>
        <span style={{ fontWeight: 700, fontSize: 15, color: colors.primary }}>Variants</span>
        <span style={{ fontSize: 11, color: colors.textSubtle }}>
          ⓘ Add multiple variants for this itinerary
        </span>
      </div>

      {/* Tab row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          borderBottom: `2px solid ${colors.border}`,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        {variants.map((v,index) => {
          const act = v.id === tabId;
          return (
            <div key={v.id} onClick={() => setVariantFieldActiveTab(v.id)} style={variantTabStyle(act)}>
              {v.variantsName}
              {variants.length > 1 && (
                <span
                  // onClick={(e) => { e.stopPropagation(); removeVariant(v.id); }}
                  onClick={(e)=>{

e.stopPropagation();

removeVariant(index);

}}
                  style={{ marginLeft: 4, color: colors.textSubtle, fontSize: 14, lineHeight: 1 }}
                >
                  ×
                </span>
              )}
            </div>
          );
        })}

        <button
          onClick={addVariant}
          style={{ ...dashedAddButtonStyle, marginLeft: 6, marginBottom: 4 }}
        >
          + Add Variant
        </button>
      </div>

      {/* Active variant panel */}
      {activeVariant && (
        <VariantPanel
          variant={activeVariant}
          numDays={numDays}
          // onChange={(v) => updVariant(activeVariant.id, v)}
           onChange={(v)=>updVariant(activeIndex,v)}
        />
      )}
    </div>
  );
}