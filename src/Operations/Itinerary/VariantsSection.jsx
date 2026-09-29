import { useEffect, useRef, useState } from "react";
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

import {
  getEmptyVariantObj,
  getEmptyPickupPointObj
} from "../Model/ItineraryModel";

import { useItinerary } from "./UseItinerary";

// IMPORTANT:
// Change this path if your BulkVariantModal.jsx is in another folder.
import BulkVariantModal from "./BulkVariantModal";


// ── helpers ───────────────────────────────────────────────────────────────
function addDays(ds, n) {
  if (!ds || !n) return "";

  const d = new Date(ds);

  if (isNaN(d)) return "";

  d.setDate(d.getDate() + Number(n) - 1);

  return d.toISOString().split("T")[0];
}


// ── Create Empty Variant ──────────────────────────────────────────────────
export function mkVariant(n) {

  const obj = getEmptyVariantObj();

  obj.variantsName = `Variant ${n}`;

  obj.pickupPoints = [
    getEmptyPickupPointObj()
  ];

  return obj;
}


// ── StatusDropdown ────────────────────────────────────────────────────────
function StatusDropdown({ value, onChange }) {

  const [open, setOpen] = useState(false);

  const cfg = STATUS_CFG[value] || STATUS_CFG.Active;

  return (
    <div style={{ position: "relative" }}>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
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

        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6
          }}
        >

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

        <span style={{ fontSize: 10 }}>
          ▾
        </span>

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
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 14px",
                  cursor: "pointer",
                  background:
                    s === value
                      ? "#f8f9ff"
                      : colors.white,
                }}
              >

                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: c.dot
                  }}
                />

                <span
                  style={{
                    color: c.text,
                    fontWeight: 500
                  }}
                >
                  {s}
                </span>

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
  const [editingPickupId, setEditingPickupId] = useState(null);
  const upd = (index, field, value) => {

    const arr = [...pickups];

    arr[index] = {
      ...arr[index],
      [field]: value
    };

    onChange(arr);
  };

  // ============================================================
  // ADD PICKUP POINT
  // ============================================================
  // const add = () => {

  //   onChange([
  //     ...pickups,
  //     getEmptyPickupPointObj()
  //   ]);

  // };
  const add = () => {
    const newPickup = getEmptyPickupPointObj();

    // temporary id only for frontend edit tracking
    newPickup.id =
      newPickup.id ?? Date.now() + Math.random();

    onChange([
      ...pickups,
      newPickup,
    ]);

    // Newly added pickup automatically opens in edit mode
    setEditingPickupId(newPickup.id);
  };

  // ============================================================
  // EDIT PICKUP POINT
  // ============================================================

  const editPickup = (id) => {
    setEditingPickupId(id);
  };

  // ============================================================
  // SAVE PICKUP POINT
  // ============================================================

  const savePickup = () => {
    setEditingPickupId(null);
  };

  // const del = (index) => {

  //   if (pickups.length <= 1)
  //     return;

  //   onChange(
  //     pickups.filter((_, i) => i !== index)
  //   );

  // };

  // ============================================================
  // DELETE PICKUP POINT
  // ============================================================

  const del = (id) => {
    const updatedPickups = pickups.filter(
      (item) => item.id !== id
    );

    onChange(updatedPickups);

    if (editingPickupId === id) {
      setEditingPickupId(null);
    }
  };


  return (

    <div style={{ marginTop: 12 }}>

      <div
        style={{
          color: colors.primary,
          fontWeight: 600,
          fontSize: 12,
          marginBottom: 8
        }}
      >
        Pickup Points &amp; Pricing
      </div>


      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 12
        }}
      >

        <thead>

          <tr style={{ background: "#f8f9ff" }}>

            {[
              "#",
              "Pickup Point",
              "Pickup City",
              "Per Pax Rate (₹)",
              "Desc%",
              "Actions"
            ].map((h) => (

              <th
                key={h}
                style={tableHeaderCellStyle}
              >
                {h}
              </th>

            ))}

          </tr>

        </thead>


        <tbody>

          {pickups?.map((p, i) => {

            const isEditing =
              editingPickupId === p.id;

            return (
              <tr
                key={p.id ?? i}
                style={{
                  borderBottom:
                    `1px solid ${colors.borderLight}`,
                }}
              >

                {/* NUMBER */}
                <td
                  style={{
                    padding: "8px 10px",
                    color: colors.textSubtle,
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  {i + 1}
                </td>

                {/* PICKUP POINT */}
                <td style={tableCellStyle}>

                  <input
                    value={p.pickupPoint ?? ""}
                    onChange={(e) =>
                      upd(
                        i,
                        "pickupPoint",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Kochi Airport"
                    style={inputStyle}
                    disabled={
                      !isEditing &&
                      pickups.length > 1
                    }
                  />

                </td>

                {/* PICKUP CITY */}
                <td style={tableCellStyle}>

                  <input
                    value={p.pickupCity ?? ""}
                    onChange={(e) =>
                      upd(
                        i,
                        "pickupCity",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Kochi, Kerala"
                    style={inputStyle}
                    disabled={
                      !isEditing &&
                      pickups.length > 1
                    }
                  />

                </td>

                {/* RATE */}
                <td style={tableCellStyle}>

                  <input
                    type="number"
                    min="0"
                    value={
                      p.ratePerPax === null ||
                        p.ratePerPax === undefined
                        ? ""
                        : p.ratePerPax
                    }
                    onChange={(e) =>
                      upd(
                        i,
                        "ratePerPax",
                        e.target.value === ""
                          ? null
                          : Number(e.target.value)
                      )
                    }
                    placeholder="25,000"
                    style={{
                      ...inputStyle,
                      width: 90,
                    }}
                    disabled={
                      !isEditing &&
                      pickups.length > 1
                    }
                  />

                </td>

                {/* DISCOUNT % */}
                <td style={tableCellStyle}>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={
                      p.discountPercent === null ||
                        p.discountPercent === undefined
                        ? ""
                        : p.discountPercent
                    }
                    onChange={(e) =>
                      upd(
                        i,
                        "discountPercent",
                        e.target.value === ""
                          ? null
                          : Number(e.target.value)
                      )
                    }
                    placeholder="0"
                    style={{
                      ...inputStyle,
                      width: 70,
                    }}
                    disabled={
                      !isEditing &&
                      pickups.length > 1
                    }
                  />

                </td>

                {/* ACTIONS */}
                <td
                  style={{
                    ...tableCellStyle,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >

                  {/* EDIT / SAVE */}
                  <button
                    type="button"
                    onClick={() => {

                      if (isEditing) {
                        savePickup();
                      } else {
                        editPickup(p.id);
                      }

                    }}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 14,
                      padding: "4px 5px",
                    }}
                    title={
                      isEditing
                        ? "Save"
                        : "Edit"
                    }
                  >
                    {isEditing ? "✓" : "✏️"}
                  </button>

                  {/* DELETE */}
                  <button
                    type="button"
                    onClick={() => del(p.id)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 14,
                      padding: "4px 5px",
                    }}
                    title="Delete"
                  >
                    🗑️
                  </button>

                </td>

              </tr>
            );
          })}


        </tbody>

      </table>


      <button
        type="button"
        onClick={add}
        style={{
          ...dashedAddButtonStyle,
          marginTop: 10
        }}
      >
        + Add Pickup Point
      </button>

    </div>

  );
}


// ── VariantPanel ──────────────────────────────────────────────────────────
function VariantPanel({
  variant,
  numDays,
  onChange
}) {

  const {
    getGuidesList,
    getTargetAudienceList,
    fetchStatuses
  } = useItinerary();


  const [guides, setGuides] = useState([]);
  const [targetAudiences, setTargetAudiences] = useState([]);
  const [status, setStatus] = useState([]);


  const set = (k, v) => {

    const upd = {
      ...variant,
      [k]: v
    };

    if (k === "startDate") {

      upd.endDate = addDays(v, numDays);

    }

    onChange(upd);

  };


  const pct =
    variant.totalSeats > 0
      ? Math.round(
        (variant.occupiedSeats /
          variant.totalSeats) *
        100
      )
      : 0;


  const avail = Math.max(
    0,
    variant.totalSeats -
    variant.occupiedSeats
  );


  const totalAmountAfterDiscount =
    (Number(variant.perPaxBaseAmount) || 0) -
    (
      (Number(variant.perPaxBaseAmount) || 0) *
      (Number(variant.discountPercent) || 0)
    ) / 100;


  useEffect(() => {

    const fetchGuides = async () => {

      try {

        const data = await getGuidesList();

        setGuides(data);

      }
      catch (error) {

        console.error(
          "Failed to fetch guides:",
          error
        );

      }

    };


    const fetchTargetAudience = async () => {

      try {

        const data =
          await getTargetAudienceList();

        setTargetAudiences(data);

      }
      catch (error) {

        console.error(
          "Failed to fetch target audience:",
          error
        );

      }

    };


    const fetchStatus = async () => {

      try {

        const data =
          await fetchStatuses();

        setStatus(data);

      }
      catch (error) {

        console.error(
          "Failed to fetch variant Status:",
          error
        );

      }

    };


    fetchGuides();
    fetchTargetAudience();
    fetchStatus();

  }, []);


  return (

    <div
      style={{
        border: "1.5px solid #6366f1",
        borderRadius: 10,
        padding: 16,
        background: colors.white,
      }}
    >

      {/* Row 1 */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 160px 1fr 1fr 180px",
          gap: 12,
          marginBottom: 12,
        }}
      >

        <div>

          <label style={labelStyle}>
            Variant Name *
          </label>

          <input
            value={variant.variantsName ?? ""}
            onChange={(e) =>
              set(
                "variantsName",
                e.target.value
              )
            }
            style={inputStyle}
            placeholder="Standard Package"
          />

        </div>


        <div>

          <label style={labelStyle}>
            Status *
          </label>

          <select
            value={variant.status ?? ""}
            onChange={(e) =>
              set(
                "status",
                e.target.value === ""
                  ? null
                  : Number(e.target.value)
              )
            }
            style={{
              ...inputStyle,
              width: 160
            }}
          >

            <option value="">
              Select Status
            </option>

            {status.map((s) => (

              <option
                key={s.id}
                value={s.id}
              >
                {s.statusName}
              </option>

            ))}

          </select>

        </div>


        <div>

          <label style={labelStyle}>
            Start City *
          </label>

          <input
            value={variant.startLocation ?? ""}
            onChange={(e) =>
              set(
                "startLocation",
                e.target.value
              )
            }
            style={inputStyle}
            placeholder="Kochi"
          />

        </div>


        <div>

          <label style={labelStyle}>
            End City *
          </label>

          <input
            value={variant.endLocation ?? ""}
            onChange={(e) =>
              set(
                "endLocation",
                e.target.value
              )
            }
            style={inputStyle}
            placeholder="Alleppey"
          />

        </div>


        <div>

          <label style={labelStyle}>
            Target Audience *
          </label>

          <select
            value={
              variant.targetAudienceId ?? ""
            }
            onChange={(e) =>
              set(
                "targetAudienceId",
                e.target.value === ""
                  ? null
                  : Number(e.target.value)
              )
            }
            style={inputStyle}
          >

            <option value="">
              Select Audience
            </option>

            {targetAudiences.map((aud) => (

              <option
                key={aud.id}
                value={aud.id}
              >
                {aud.targetAudienceName}
              </option>

            ))}

          </select>

        </div>

      </div>


      {/* Row 2 */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "auto auto 1fr",
          gap: 16,
          alignItems: "center",
          marginBottom: 12,
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 10
          }}
        >

          <div>

            <label style={labelStyle}>
              Start Date *
            </label>

            <input
              type="date"
              value={
                variant.startDate ?? ""
              }
              onChange={(e) =>
                set(
                  "startDate",
                  e.target.value
                )
              }
              style={{
                ...inputStyle,
                width: 145
              }}
            />

          </div>


          <div
            style={{
              paddingBottom: 2,
              color: colors.primary,
              fontSize: 18
            }}
          >
            →
          </div>


          <div>

            <label style={labelStyle}>
              End Date (Auto)
            </label>

            <input
              value={
                variant.endDate ?? ""
              }
              readOnly
              style={{
                ...readonlyInputStyle,
                width: 115
              }}
              placeholder="Auto"
            />

          </div>

        </div>


        <div
          style={{
            width: 1,
            height: 50,
            background: colors.border
          }}
        />


        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4,1fr)"
          }}
        >

          {[
            {
              label: "Total Seats",
              val: variant.totalSeats,
              color: colors.text
            },
            {
              label: "Occupied Seats",
              val: variant.occupiedSeats,
              color: colors.text
            },
            {
              label: "Available Seats",
              val: avail,
              color: colors.success
            },
            {
              label: "Occupancy Rate",
              val: pct + "%",
              color: colors.primary
            }
          ].map(
            ({ label, val, color }, i, arr) => (

              <div
                key={label}
                style={{
                  textAlign: "center",
                  borderRight:
                    i < arr.length - 1
                      ? `1px solid ${colors.border}`
                      : "none",
                  padding: "4px 8px",
                }}
              >

                <div style={statLabelStyle}>
                  {label}
                </div>

                <div
                  style={statValueStyle(color)}
                >
                  {val}
                </div>

              </div>

            )
          )}

        </div>

      </div>


      {/* Row 3 */}

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 4
        }}
      >

        <div>

          <label style={labelStyle}>
            Total Seats
          </label>

          <input
            type="number"
            min="0"
            value={variant.totalSeats ?? 0}
            onChange={(e) =>
              set(
                "totalSeats",
                Number(e.target.value)
              )
            }
            style={{
              ...inputStyle,
              width: 100
            }}
          />

        </div>


        <div>

          <label style={labelStyle}>
            Occupied Seats
          </label>

          <input
            type="number"
            min="0"
            max={variant.totalSeats}
            value={
              variant.occupiedSeats ?? 0
            }
            onChange={(e) =>
              set(
                "occupiedSeats",
                Math.min(
                  Number(e.target.value),
                  variant.totalSeats
                )
              )
            }
            style={{
              ...inputStyle,
              width: 100
            }}
          />

        </div>


        <div>

          <label style={labelStyle}>
            Guide *
          </label>

          <select
            value={variant.guideId ?? ""}
            onChange={(e) =>
              set(
                "guideId",
                e.target.value === ""
                  ? null
                  : Number(e.target.value)
              )
            }
            style={{
              ...inputStyle,
              width: 180
            }}
          >

            <option value="">
              Select Guide
            </option>

            {guides.map((guide) => (

              <option
                key={guide.id}
                value={guide.id}
              >
                {guide.guideName}
              </option>

            ))}

          </select>

        </div>


        <div>

          <label style={labelStyle}>
            Base Amount
          </label>

          <input
            type="number"
            min="0"
            value={
              variant.perPaxBaseAmount ?? ""
            }
            onChange={(e) =>
              set(
                "perPaxBaseAmount",
                Number(e.target.value)
              )
            }
            style={{
              ...inputStyle,
              width: 140
            }}
            placeholder="0.00"
          />

        </div>


        <div>

          <label style={labelStyle}>
            Discount (%)
          </label>

          <input
            type="number"
            min="0"
            max="100"
            value={
              variant.discountPercent ?? ""
            }
            onChange={(e) =>
              set(
                "discountPercent",
                Number(e.target.value)
              )
            }
            style={{
              ...inputStyle,
              width: 120
            }}
            placeholder="0"
          />

        </div>


        <div>

          <label style={labelStyle}>
            Total Amount
          </label>

          <input
            value={
              totalAmountAfterDiscount.toFixed(2)
            }
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
        pickups={
          variant.pickupPoints ?? []
        }
        onChange={(pts) =>
          onChange({
            ...variant,
            pickupPoints: pts
          })
        }
      />

    </div>

  );
}


// ── VariantsSection ───────────────────────────────────────────────────────
export default function VariantsSection({
  itineraryObj,
  setItineraryObj
}) {
  const {
    getGuidesList,
    getTargetAudienceList,
    fetchStatuses
  } = useItinerary();

  const variants =
    itineraryObj.variantsDetails ?? [];

  const numDays =
    itineraryObj.itineraryBasicDetails.numDays;

  // ============================================================
  // CHECK WHETHER NO. OF DAYS IS SELECTED
  // ============================================================
  const hasNumDays =
    numDays !== null &&
    numDays !== undefined &&
    Number(numDays) > 0;

  // ============================================================
  // VARIANT FORM VISIBILITY
  //
  // Initially false.
  // It becomes true only when:
  // 1. Generate Variant is clicked
  // 2. Bulk Variant is generated
  // 3. Add Variant is clicked
  // ============================================================
  const [showVariantForm, setShowVariantForm] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState(0);

  // Tracks whether the user has changed any variant data.
  // Adding blank variants does NOT make the form dirty.
  const [variantFormDirty, setVariantFormDirty] =
    useState(false);

  // Last valid No. of Days, used when the user chooses
  // "No, Keep Form" in the confirmation.
  const previousValidNumDaysRef = useRef(
    hasNumDays ? numDays : null
  );

  const [showDaysWarning, setShowDaysWarning] =
    useState(false);


  // ── BULK MODAL STATE ────────────────────────────────────────────────────
  const [showBulkModal, setShowBulkModal] =
    useState(false);
  const [guides, setGuides] = useState([]);
  const [targetAudiences, setTargetAudiences] = useState([]);
  const [status, setStatus] = useState([]);

  const activeIndexFromTab =
    Math.min(
      activeTab,
      Math.max(variants.length - 1, 0)
    );


  const activeVariant =
    variants[activeIndexFromTab];


  const activeIndex =
    activeIndexFromTab;


  // ============================================================
  // HANDLE NO. OF DAYS CHANGED TO 0
  // ============================================================
  useEffect(() => {

    if (hasNumDays) {
      previousValidNumDaysRef.current = numDays;
      setShowDaysWarning(false);
      return;
    }

    if (!showVariantForm || Number(numDays) !== 0) {
      return;
    }

    // If the user only added empty variant tabs and entered nothing,
    // close the form and CLEAR ALL variants immediately.
    if (!variantFormDirty) {
      setShowVariantForm(false);
      setShowDaysWarning(false);
      setActiveTab(0);

      setItineraryObj(prev => ({
        ...prev,
        variantsDetails: []
      }));

      return;
    }

    // There is entered data, so ask before clearing it.
    setShowDaysWarning(true);

  }, [
    numDays,
    hasNumDays,
    showVariantForm,
    variantFormDirty,
    setItineraryObj
  ]);


  // ── Update Variant ─────────────────────────────────────────────────────
  const updVariant = (
    index,
    newVariant
  ) => {

    // Called by VariantPanel/PickupTable when the user edits data.
    setVariantFormDirty(true);

    setItineraryObj(prev => {

      const arr = [
        ...prev.variantsDetails
      ];

      arr[index] = newVariant;

      return {
        ...prev,
        variantsDetails: arr
      };

    });

  };

  // ============================================================
  // GENERATE SINGLE VARIANT
  // ============================================================
  const generateVariant = () => {

    // Safety check
    if (!hasNumDays) {
      return;
    }


    // const v =
    //   mkVariant(
    //     variants.length + 1
    //   );

    // If a variant already exists, simply show it.
    // DO NOT create another variant.
    if (variants.length > 0) {
      setShowVariantForm(true);
      setActiveTab(0);
      return;
    }

    // Create first variant only when there are no variants
    const v = mkVariant(1);


    setItineraryObj(prev => ({

      ...prev,

      variantsDetails: [
        ...(prev.variantsDetails ?? []),
        v
      ]

    }));


    // Fresh blank variant starts clean.
    setVariantFormDirty(false);
    setShowDaysWarning(false);

    // Show variant form
    setShowVariantForm(true);


    // Open newly created variant
    setActiveTab(
      variants.length
    );
  };




  // ── Add Single Variant ─────────────────────────────────────────────────
  // const addVariant = () => {

  //   const v =
  //     mkVariant(
  //       variants.length + 1
  //     );


  //   setItineraryObj(prev => ({

  //     ...prev,

  //     variantsDetails: [
  //       ...prev.variantsDetails,
  //       v
  //     ]

  //   }));


  //   setActiveTab(
  //     variants.length
  //   );

  // };
  // ── Add Single Variant ─────────────────────────────────────────────────
  const addVariant = () => {

    // Safety check
    if (!hasNumDays) {
      return;
    }


    const v =
      mkVariant(
        variants.length + 1
      );


    setItineraryObj(prev => ({

      ...prev,

      variantsDetails: [
        ...(prev.variantsDetails ?? []),
        v
      ]

    }));


    // Show variant form
    setShowVariantForm(true);


    setActiveTab(
      variants.length
    );

  };




  // ── Remove Variant ─────────────────────────────────────────────────────
  const removeVariant = (index) => {

    if (variants.length <= 1)
      return;


    setItineraryObj(prev => {

      const arr =
        prev.variantsDetails.filter(
          (_, i) => i !== index
        );


      return {
        ...prev,
        variantsDetails: arr
      };

    });


    if (activeTab === index) {

      setActiveTab(
        Math.max(0, index - 1)
      );

    }
    else if (activeTab > index) {

      setActiveTab(
        activeTab - 1
      );

    }

  };


  // ── BULK GENERATE ──────────────────────────────────────────────────────
  const handleBulkGenerate = (
    newVariants
  ) => {

    if (
      !newVariants ||
      newVariants.length === 0
    ) {
      return;
    }


    setItineraryObj(prev => {

      const existingVariants =
        prev.variantsDetails ?? [];


      /*
       * Add bulk variants after existing variants.
       *
       * Every object inside newVariants already contains:
       *
       * startDate
       * endDate
       * startLocation
       * endLocation
       * targetAudienceId
       * totalSeats
       * guideId
       * perPaxBaseAmount
       * discountPercent
       * season
       * pickupPoints
       *
       * So the same bulk-form details automatically
       * exist in every generated variant.
       */

      const variantsToAdd =
        newVariants.map(
          (variant, index) => ({

            ...variant,

            /*
             * Keep id null for newly generated
             * variants.
             */
            id: null,

            /*
             * Ensure pickupPoints is always present.
             */
            pickupPoints:
              variant.pickupPoints?.length
                ? variant.pickupPoints
                : [
                  getEmptyPickupPointObj()
                ],

            /*
             * Make sure variant name is unique/readable.
             */
            variantsName:
              variant.variantsName ||
              `Variant ${existingVariants.length +
              index +
              1
              }`

          })
        );


      return {

        ...prev,

        variantsDetails: [
          ...existingVariants,
          ...variantsToAdd
        ]

      };

    });

    // ============================================================
    // SHOW VARIANT FORM AFTER BULK GENERATION
    // ============================================================
    setShowVariantForm(true);


    /*
     * Open the first newly-created
     * variant tab.
     *
     * Existing count becomes the index
     * of the first bulk variant.
     */
    setActiveTab(
      variants.length
    );

  };

  // ============================================================
  // LOAD BULK DROPDOWN DATA
  // ============================================================
  useEffect(() => {

    const loadBulkDropdownData = async () => {

      try {

        const guideData =
          await getGuidesList();

        const audienceData =
          await getTargetAudienceList();

        const statusData =
          await fetchStatuses();
        debugger;
        console.log("GUIDES:", guideData);
        console.log("TARGET AUDIENCES:", audienceData);
        console.log("Status List : ", statusData);

        setGuides(guideData || []);
        setTargetAudiences(audienceData || []);
        setStatus(statusData || []);

      } catch (error) {

        console.error(
          "Failed to load bulk variant dropdown data:",
          error
        );

      }

    };

    loadBulkDropdownData();

  }, []);

  return (

    <div
      style={{
        background: colors.white,
        border:
          `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: 20,
      }}
    >

      {/* ────────────────────────────────────────────────────────────────
          SECTION HEADER
      ──────────────────────────────────────────────────────────────── */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >

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


        <span
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: colors.primary
          }}
        >
          Variants
        </span>


        <span
          style={{
            fontSize: 11,
            color: colors.textSubtle
          }}
        >
          ⓘ Add multiple variants for this itinerary
        </span>

        {/* ============================================================
            GENERATE BUTTONS
        ============================================================ */}

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 8,
          }}
        >

          {/* ─────────────────────────────────────────────────────
              GENERATE VARIANT
          ───────────────────────────────────────────────────── */}

          <button
            type="button"
            onClick={generateVariant}
            disabled={!hasNumDays}
            style={{
              border: "none",
              background:
                hasNumDays
                  ? colors.primary
                  : "#d1d5db",
              color: colors.white,
              borderRadius: 6,
              padding: "8px 14px",
              fontSize: 12,
              fontWeight: 600,
              cursor:
                hasNumDays
                  ? "pointer"
                  : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: 6,
              opacity:
                hasNumDays
                  ? 1
                  : 0.7,
            }}
          >
            ＋ Generate Variant
          </button>


          {/* ── Generate Bulk Variant Button ── */}

          <button
            type="button"
            onClick={() =>
              setShowBulkModal(true)
            }
            disabled={!hasNumDays}
            style={{
              marginLeft: "auto",
              border: "none",
              // background: colors.primary,
              background:
                hasNumDays
                  ? colors.primary
                  : "#d1d5db",
              color: colors.white,
              borderRadius: 6,
              padding: "8px 14px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              opacity:
                hasNumDays
                  ? 1
                  : 0.7,
            }}
          >
            ⚡ Generate Bulk Variant
          </button>
        </div>
      </div>

      {/* ============================================================
          VARIANT FORM
          
          IMPORTANT:
          This entire section is hidden initially.
          It appears only after Generate Variant,
          Generate Bulk Variant, or Add Variant.
      ============================================================ */}

      {showVariantForm && (

        <>
          {/* ────────────────────────────────────────────────────────────────
          TAB ROW
      ──────────────────────────────────────────────────────────────── */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,

              // borderBottom:
              //   `2px solid ${colors.border}`,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >

            {variants.map((v, index) => {

              const act =
                index === activeIndexFromTab;


              return (

                <div
                  key={v.id ?? index}
                  onClick={() =>
                    setActiveTab(index)
                  }
                  style={variantTabStyle(act)}
                >

                  {v.variantsName ||
                    `Variant ${index + 1}`}


                  {variants.length > 1 && (

                    <span
                      onClick={(e) => {

                        e.stopPropagation();

                        removeVariant(index);

                      }}
                      style={{
                        // marginLeft: 4,
                        // color: colors.textSubtle,
                        // fontSize: 14,
                        // lineHeight: 1,
                        // cursor: "pointer"
                        marginLeft: 4,
                        fontSize: 15,
                        lineHeight: 1,
                        cursor: "pointer",
                        opacity: 0.7,
                      }}
                    >
                      ×
                    </span>

                  )}

                </div>

              );

            })}


            {/* ── Add Single Variant ── */}

            <button
              type="button"
              onClick={addVariant}
              style={{
                ...dashedAddButtonStyle,
                // marginLeft: 6,
                // marginBottom: 4
                marginLeft: 4,
                fontSize: 15,
                lineHeight: 1,
                cursor: "pointer",
                opacity: 0.7,
              }}
            >
              + Add Variant
            </button>

          </div>


          {/* ────────────────────────────────────────────────────────────────
          ACTIVE VARIANT
      ──────────────────────────────────────────────────────────────── */}

          {activeVariant && (

            <VariantPanel
              variant={activeVariant}
              numDays={numDays}
              onChange={(v) =>
                updVariant(
                  activeIndex,
                  v
                )
              }
            />

          )}
        </>
      )}

      {/* ────────────────────────────────────────────────────────────────
          BULK VARIANT MODAL
          This can open even though VariantPanel is not rendered.
      ──────────────────────────────────────────────────────────────── */}

      {/* ============================================================
          CLOSE VARIANT FORM CONFIRMATION
      ============================================================ */}
      {showDaysWarning && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: 400,
              maxWidth: "90%",
              background: colors.white,
              borderRadius: 10,
              padding: 20,
              boxShadow: "0 12px 35px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: colors.primary,
                marginBottom: 10,
              }}
            >
              Close Variant Form?
            </div>

            <div
              style={{
                fontSize: 13,
                color: colors.text,
                lineHeight: 1.5,
                marginBottom: 18,
              }}
            >
              Some variant details have been entered. If you continue,
              all variant data will be cleared. Do you want to continue?
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  // NO: restore previous valid days and keep everything.
                  setShowDaysWarning(false);

                  const previousDays =
                    previousValidNumDaysRef.current;

                  if (previousDays !== null && previousDays !== undefined) {
                    setItineraryObj(prev => ({
                      ...prev,
                      itineraryBasicDetails: {
                        ...prev.itineraryBasicDetails,
                        numDays: previousDays,
                      },
                    }));
                  }
                }}
                style={{
                  border: `1px solid ${colors.border}`,
                  background: colors.white,
                  color: colors.text,
                  borderRadius: 6,
                  padding: "7px 14px",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                No, Keep Form
              </button>

              <button
                type="button"
                onClick={() => {
                  // YES: close form AND completely clear all variants.
                  setShowDaysWarning(false);
                  setShowVariantForm(false);
                  setVariantFormDirty(false);
                  setActiveTab(0);

                  setItineraryObj(prev => ({
                    ...prev,
                    variantsDetails: [],
                  }));
                }}
                style={{
                  border: "none",
                  background: colors.primary,
                  color: colors.white,
                  borderRadius: 6,
                  padding: "7px 14px",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Yes, Close Form
              </button>
            </div>
          </div>
        </div>
      )}

      {showBulkModal && (

        <BulkVariantModal

          numDays={numDays}

          /*
           * BulkVariantModal needs these lists.
           *
           * VariantPanel fetches them internally,
           * but the modal expects them as props.
           *
           * Therefore we fetch them here.
           */
          tourCode={itineraryObj.itineraryBasicDetails.tourCode}
          guides={guides}

          targetAudiences={targetAudiences}

          status={status}

          onClose={() =>
            setShowBulkModal(false)
          }

          onGenerate={
            handleBulkGenerate
          }

        />

      )}

    </div>

  );

}