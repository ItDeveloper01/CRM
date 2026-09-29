import { useEffect, useState } from "react";
import {
  colors,
  labelStyle,
  inputStyle,
  tableHeaderCellStyle,
  tableCellStyle,
} from "../itineraryStyles";
import { getEmptyPickupPointObj } from "../Model/ItineraryModel";
import config from "../../config";
import axios from "axios";
import { id } from "intl-tel-input/i18n";



const SEASON_OPTIONS = [
  "Peak Season",
  "Off Season",
  "Monsoon",
  "Winter",
  "Summer",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ============================================================
// DATE HELPERS
// ============================================================

function addDays(ds, n) {
  if (!ds || !n) return "";

  const d = new Date(ds);

  if (isNaN(d.getTime())) return "";

  d.setDate(d.getDate() + Number(n) - 1);

  return d.toISOString().split("T")[0];
}

function toISO(y, m, d) {
  const mm = String(m + 1).padStart(2, "0");
  const dd = String(d).padStart(2, "0");

  return `${y}-${mm}-${dd}`;
}

// ============================================================
// MINI CALENDAR
// ============================================================

function MiniCalendar({ selected, onToggle }) {
  const today = new Date();

  const [viewYear, setViewYear] = useState(
    today.getFullYear()
  );

  const [viewMonth, setViewMonth] = useState(
    today.getMonth()
  );

  const [showMonthPicker, setShowMonthPicker] =
    useState(false);

  const [showYearPicker, setShowYearPicker] =
    useState(false);

  const firstDay = new Date(
    viewYear,
    viewMonth,
    1
  ).getDay();

  const daysInMonth = new Date(
    viewYear,
    viewMonth + 1,
    0
  ).getDate();

  const todayISO = toISO(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const selectMonth = (monthIndex) => {
    setViewMonth(monthIndex);
    setShowMonthPicker(false);
  };

  const selectYear = (year) => {
    setViewYear(year);
    setShowYearPicker(false);
  };

  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  const years = [];

  for (
    let year = viewYear - 10;
    year <= viewYear + 10;
    year++
  ) {
    years.push(year);
  }

  return (
    <div style={calendarBoxStyle}>

      {/* CALENDAR HEADER */}
      <div style={calHeaderStyle}>

        <button
          type="button"
          onClick={prevMonth}
          style={calNavBtnStyle}
        >
          ‹
        </button>

        <div style={calendarTitleWrapStyle}>

          {/* MONTH */}
          <button
            type="button"
            onClick={() => {
              setShowMonthPicker((prev) => !prev);
              setShowYearPicker(false);
            }}
            style={monthYearBtnStyle}
          >
            {MONTHS[viewMonth]}
          </button>

          {/* YEAR */}
          <button
            type="button"
            onClick={() => {
              setShowYearPicker((prev) => !prev);
              setShowMonthPicker(false);
            }}
            style={monthYearBtnStyle}
          >
            {viewYear}
          </button>

        </div>

        <button
          type="button"
          onClick={nextMonth}
          style={calNavBtnStyle}
        >
          ›
        </button>

      </div>

      {/* MONTH PICKER */}
      {showMonthPicker && (
        <div style={monthPickerStyle}>

          {MONTHS.map((month, index) => (
            <button
              type="button"
              key={month}
              onClick={() => selectMonth(index)}
              style={{
                ...pickerItemStyle,
                background:
                  index === viewMonth
                    ? colors.primary
                    : "transparent",
                color:
                  index === viewMonth
                    ? colors.white
                    : colors.text,
              }}
            >
              {month}
            </button>
          ))}

        </div>
      )}

      {/* YEAR PICKER */}
      {showYearPicker && (
        <div style={yearPickerStyle}>

          {years.map((year) => (
            <button
              type="button"
              key={year}
              onClick={() => selectYear(year)}
              style={{
                ...pickerItemStyle,
                background:
                  year === viewYear
                    ? colors.primary
                    : "transparent",
                color:
                  year === viewYear
                    ? colors.white
                    : colors.text,
              }}
            >
              {year}
            </button>
          ))}

        </div>
      )}

      {/* WEEKDAYS */}
      <div style={calWeekRowStyle}>
        {WEEKDAYS.map((day) => (
          <span
            key={day}
            style={calWeekLabelStyle}
          >
            {day}
          </span>
        ))}
      </div>

      {/* DAYS */}
      <div style={calGridStyle}>

        {cells.map((day, index) => {

          if (day === null) {
            return (
              <span
                key={`empty-${index}`}
              />
            );
          }

          const iso = toISO(
            viewYear,
            viewMonth,
            day
          );

          const isSelected =
            selected.includes(iso);

          const isToday =
            iso === todayISO;

          return (
            <button
              type="button"
              key={iso}
              onClick={() => onToggle(iso)}
              style={calDayStyle(
                isSelected,
                isToday
              )}
            >
              {day}
            </button>
          );
        })}

      </div>

    </div>
  );
}

// ============================================================
// BULK VARIANT MODAL
// ============================================================

export default function BulkVariantModal({
  numDays,
  tourCode,
  guides = [],
  targetAudiences = [],
  status = [],
  onClose,
  onGenerate,
}) {


  const getSeasonListEndPoint = config.operationsUrl + "/SharedMaster/SeasonList";
  const [season, setSeason] = useState([]);

  useEffect(() => {
    const fetchSeasonList = async () => {
      try {
        debugger;
        const sea = await axios.get(getSeasonListEndPoint, {});
        console.log("Season API response:", sea.date);
        setSeason(sea.data || []);
      }
      catch (error) {
        console.error("Error fetching Season list :", error);
      }

    };
    fetchSeasonList();
  }, []);
  // ----------------------------------------------------------
  // DATES
  // ----------------------------------------------------------

  const [dates, setDates] = useState([]);

  //const[targetAudiences,setTargetAudiences] = useState([]);
  // console.log("Target Audiences :", targetAudiences);
  // ----------------------------------------------------------
  // COMMON VARIANT FORM
  // ----------------------------------------------------------

  const [form, setForm] = useState({
    startLocation: "",
    endLocation: "",
    targetAudienceId: null,
    totalSeats: 0,
    guideId: null,
    perPaxBaseAmount: 0,
    season: "",
    status: null
  });

  // ----------------------------------------------------------
  // PICKUP POINTS
  // ----------------------------------------------------------

  const [pickupPoints, setPickupPoints] = useState([
    {
      id: Date.now(),
      pickupPoint: "",
      pickupCity: "",
      ratePerPax: "",
      discountPercent: "",
    },
  ]);


  const [editingPickupId, setEditingPickupId] =
    useState(null);

  // ==========================================================
  // COMMON FORM CHANGE
  // ==========================================================

  const setField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ==========================================================
  // DATE FUNCTIONS
  // ==========================================================

  const toggleDate = (iso) => {
    setDates((prev) => {
      if (prev.includes(iso)) {
        return prev.filter(
          (date) => date !== iso
        );
      }

      return [...prev, iso].sort();
    });
  };

  const removeDate = (date) => {
    setDates((prev) =>
      prev.filter((item) => item !== date)
    );
  };

  //set selected date of variant 
  const formatChip = (date) => {
    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  //set for variant name formate  
  const formateVariantDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);

    return `${day}${month}${year}`;
  };

  // ==========================================================
  // PICKUP POINT FUNCTIONS
  // ==========================================================

  const updatePickupPoint = (
    id,
    field,
    value
  ) => {
    setPickupPoints((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            [field]: value,
          }
          : item
      )
    );
  };

  // ADD PICKUP POINT
  const addPickupPoint = () => {
    const newPickupPoint = {
      id: Date.now() + Math.random(),
      pickupPoint: "",
      pickupCity: "",
      ratePerPax: "",
      discountPercent: "",
    };

    setPickupPoints((prev) => [
      ...prev,
      newPickupPoint,
    ]);

    setEditingPickupId(
      newPickupPoint.id
    );
  };

  // EDIT PICKUP POINT
  const editPickupPoint = (id) => {
    setEditingPickupId(id);
  };

  // SAVE PICKUP POINT
  const savePickupPoint = () => {
    setEditingPickupId(null);
  };

  // DELETE PICKUP POINT
  const deletePickupPoint = (id) => {
    setPickupPoints((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );

    if (editingPickupId === id) {
      setEditingPickupId(null);
    }
  };

  // ==========================================================
  // GENERATE VARIANTS
  // ==========================================================

  const handleGenerate = () => {
    if (dates.length === 0) {
      return;
    }

    const newVariants = dates.map(
      (startDate) => {

        const variantPickupPoints =
          pickupPoints.map(
            (pickup) => {

              const emptyPickup =
                getEmptyPickupPointObj();

              return {
                ...emptyPickup,

                pickupPoint:
                  pickup.pickupPoint,

                pickupCity:
                  pickup.pickupCity,

                ratePerPax:
                  pickup.ratePerPax === ""
                    ? null
                    : Number(
                      pickup.ratePerPax
                    ),

                discountPercent:
                  pickup.discountPercent === ""
                    ? null
                    : Number(
                      pickup.discountPercent
                    ),
              };
            }
          );

        return {
          id: null,

          variantsName:
            `${tourCode}${formateVariantDate(
              startDate
            )}`,

          status: form.status,

          startLocation:
            form.startLocation,

          endLocation:
            form.endLocation,

          startDate,

          endDate:
            addDays(
              startDate,
              numDays
            ),

          totalSeats:
            Number(form.totalSeats) || 0,

          occupiedSeats: 0,

          targetAudienceId:
            form.targetAudienceId,

          guideId:
            form.guideId,

          perPaxBaseAmount:
            Number(
              form.perPaxBaseAmount
            ) || 0,

          season:
            form.season,

          pickupPoints:
            variantPickupPoints,
        };
      }
    );

    onGenerate(newVariants);

    onClose();
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div style={overlayStyle}>

      <div style={modalStyle}>

        {/* ================================================= */}
        {/* HEADER (fixed) */}
        {/* ================================================= */}

        <div style={headerRowStyle}>

          <span
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: colors.primary,
            }}
          >
            Generate Bulk Variants
          </span>

          <button
            type="button"
            onClick={onClose}
            style={closeBtnStyle}
          >
            ✕
          </button>

        </div>

        {/* ================= BODY (scrolls) ================= */}
        <div style={bodyStyle}>
          {/* ================================================= */}
          {/* CALENDAR + SELECTED DATES */}
          {/* ================================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "300px 1fr",
              gap: 16,
              marginBottom: 16,
            }}
          >

            {/* CALENDAR */}
            <div>

              <label style={labelStyle}>
                Departure Dates *
              </label>

              <MiniCalendar
                selected={dates}
                onToggle={toggleDate}
              />

            </div>

            {/* SELECTED DATE CHIPS */}
            <div>

              <label style={labelStyle}>
                Selected Departure Dates (
                {dates.length}
                )
              </label>

              <div
                style={chipWrapStyle}
              >

                {dates.length === 0 && (
                  <span
                    style={{
                      color:
                        colors.textSubtle,
                      fontSize: 12,
                    }}
                  >
                    No dates selected yet —
                    click dates on the calendar.
                  </span>
                )}

                {dates.map((date) => (
                  <span
                    key={date}
                    style={chipStyle}
                  >

                    {formatChip(date)}

                    <button
                      type="button"
                      onClick={() =>
                        removeDate(date)
                      }
                      style={chipRemoveStyle}
                    >
                      ✕
                    </button>

                  </span>
                ))}

              </div>

            </div>

          </div>

          {/* DIVIDER */}
          <div
            style={{
              height: 1,
              background: colors.border,
              margin:
                "4px 0 16px",
            }}
          />

          {/* ================================================= */}
          {/* COMMON VARIANT FIELDS */}
          {/* ================================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, 1fr)",
              gap: 12,
              marginBottom: 16,
            }}
          >

            {/* START CITY */}
            <div>
              <label style={labelStyle}>
                Start City
              </label>

              <input
                value={
                  form.startLocation
                }
                onChange={(e) =>
                  setField(
                    "startLocation",
                    e.target.value
                  )
                }
                style={inputStyle}
                placeholder="Kochi"
              />
            </div>

            {/* END CITY */}
            <div>
              <label style={labelStyle}>
                End City
              </label>

              <input
                value={
                  form.endLocation
                }
                onChange={(e) =>
                  setField(
                    "endLocation",
                    e.target.value
                  )
                }
                style={inputStyle}
                placeholder="Alleppey"
              />
            </div>

            {/* TARGET AUDIENCE */}
            <div>
              <label style={labelStyle}>
                Target Audience
              </label>

              <select
                value={
                  form.targetAudienceId ??
                  ""
                }
                onChange={(e) =>
                  setField(
                    "targetAudienceId",
                    e.target.value === ""
                      ? null
                      : Number(
                        e.target.value
                      )
                  )
                }
                style={inputStyle}
              >
                <option value="">
                  Select Audience
                </option>

                {targetAudiences.map(
                  (audience) => (
                    <option
                      key={audience.id}
                      value={
                        audience.id
                      }
                    >
                      {
                        audience.targetAudienceName
                      }
                    </option>
                  )
                )}

              </select>
            </div>

            {/* TOTAL SEATS */}
            <div>
              <label style={labelStyle}>
                Total Seats
              </label>

              <input
                type="number"
                min="0"
                value={
                  form.totalSeats
                }
                onChange={(e) =>
                  setField(
                    "totalSeats",
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>

            {/* GUIDE */}
            <div>
              <label style={labelStyle}>
                Guide
              </label>

              <select
                value={
                  form.guideId ?? ""
                }
                onChange={(e) =>
                  setField(
                    "guideId",
                    e.target.value === ""
                      ? null
                      : Number(
                        e.target.value
                      )
                  )
                }
                style={inputStyle}
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

            {/* BASE AMOUNT */}
            <div>
              <label style={labelStyle}>
                Base Amount
              </label>

              <input
                type="number"
                min="0"
                value={
                  form.perPaxBaseAmount
                }
                onChange={(e) =>
                  setField(
                    "perPaxBaseAmount",
                    e.target.value
                  )
                }
                style={inputStyle}
                placeholder="0.00"
              />
            </div>

            {/* SEASON */}
            <div>
              <label style={labelStyle}>
                Season
              </label>

              <select
                value={form.season}
                onChange={(e) =>
                  setField(
                    "season",
                    e.target.value === ""
                      ? null
                      : Number(e.target.value)
                  )
                }
                style={inputStyle}
              >
                <option value="">
                  Select Season
                </option>

                {season.map(
                  (season) => (
                    <option
                      key={season.id}
                      value={season.id}
                    >
                      {season.seasonName}
                    </option>
                  )
                )}

              </select>
            </div>

            <div>
              <label style={labelStyle}>
                Status
              </label>

              <select
                value={
                  form.status ?? ""
                }
                onChange={(e) =>
                  setField(
                    "status",
                    e.target.value === ""
                      ? null
                      : Number(
                        e.target.value
                      )
                  )
                }
                style={inputStyle}
              >
                <option value="">
                  Select Status
                </option>

                {status.map((sts) => (
                  <option
                    key={sts.id}
                    value={sts.id}
                  >
                    {sts.statusName}
                  </option>
                ))}

              </select>
            </div>
          </div>

          {/* ================================================= */}
          {/* PICKUP POINT & PRICING */}
          {/* ================================================= */}

          <div
            style={{
              marginBottom: 16,
            }}
          >

            <div
              style={{
                color: colors.primary,
                fontWeight: 600,
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              Pickup Point & Pricing
            </div>

            <div
              style={{
                overflowX: "auto",
              }}
            >

              <table
                style={{
                  width: "100%",
                  borderCollapse:
                    "collapse",
                  fontSize: 12,
                }}
              >

                <thead>

                  <tr
                    style={{
                      background:
                        "#f8f9ff",
                    }}
                  >

                    <th
                      style={
                        tableHeaderCellStyle
                      }
                    >
                      #
                    </th>

                    <th
                      style={
                        tableHeaderCellStyle
                      }
                    >
                      Pickup Point
                    </th>

                    <th
                      style={
                        tableHeaderCellStyle
                      }
                    >
                      Pickup City
                    </th>

                    <th
                      style={
                        tableHeaderCellStyle
                      }
                    >
                      Per Pax Rate (₹)
                    </th>

                    <th
                      style={
                        tableHeaderCellStyle
                      }
                    >
                      Disc. (%)
                    </th>

                    <th
                      style={
                        tableHeaderCellStyle
                      }
                    >
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {pickupPoints.map(
                    (pickup, index) => {

                      const isEditing =
                        editingPickupId ===
                        pickup.id;

                      return (
                        <tr
                          key={
                            pickup.id
                          }
                          style={{
                            borderBottom:
                              `1px solid ${colors.borderLight}`,
                          }}
                        >

                          {/* NUMBER */}
                          <td
                            style={{
                              padding:
                                "8px 10px",
                              color:
                                colors.textSubtle,
                              fontWeight: 500,
                              textAlign:
                                "center",
                            }}
                          >
                            {index + 1}
                          </td>

                          {/* PICKUP POINT */}
                          <td
                            style={
                              tableCellStyle
                            }
                          >

                            <input
                              value={
                                pickup.pickupPoint
                              }
                              onChange={(e) =>
                                updatePickupPoint(
                                  pickup.id,
                                  "pickupPoint",
                                  e.target.value
                                )
                              }
                              placeholder="e.g. Kochi Airport"
                              style={
                                inputStyle
                              }
                              disabled={
                                !isEditing &&
                                pickupPoints.length >
                                1
                              }
                            />

                          </td>

                          {/* PICKUP CITY */}
                          <td
                            style={
                              tableCellStyle
                            }
                          >

                            <input
                              value={
                                pickup.pickupCity
                              }
                              onChange={(e) =>
                                updatePickupPoint(
                                  pickup.id,
                                  "pickupCity",
                                  e.target.value
                                )
                              }
                              placeholder="e.g. Kochi, Kerala"
                              style={
                                inputStyle
                              }
                              disabled={
                                !isEditing &&
                                pickupPoints.length >
                                1
                              }
                            />

                          </td>

                          {/* RATE */}
                          <td
                            style={
                              tableCellStyle
                            }
                          >

                            <input
                              type="number"
                              min="0"
                              value={
                                pickup.ratePerPax
                              }
                              onChange={(e) =>
                                updatePickupPoint(
                                  pickup.id,
                                  "ratePerPax",
                                  e.target.value
                                )
                              }
                              placeholder="25000"
                              style={{
                                ...inputStyle,
                                width: 100,
                              }}
                              disabled={
                                !isEditing &&
                                pickupPoints.length >
                                1
                              }
                            />

                          </td>

                          {/* DISCOUNT */}
                          <td
                            style={
                              tableCellStyle
                            }
                          >

                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={
                                pickup.discountPercent
                              }
                              onChange={(e) =>
                                updatePickupPoint(
                                  pickup.id,
                                  "discountPercent",
                                  e.target.value
                                )
                              }
                              placeholder="0"
                              style={{
                                ...inputStyle,
                                width: 70,
                              }}
                              disabled={
                                !isEditing &&
                                pickupPoints.length >
                                1
                              }
                            />

                          </td>

                          {/* ACTION */}
                          <td
                            style={{
                              ...tableCellStyle,
                              whiteSpace:
                                "nowrap",
                              textAlign:
                                "center",
                            }}
                          >

                            {/* EDIT / SAVE */}
                            <button
                              type="button"
                              onClick={() => {

                                if (
                                  isEditing
                                ) {
                                  savePickupPoint();
                                } else {
                                  editPickupPoint(
                                    pickup.id
                                  );
                                }

                              }}
                              style={
                                actionButtonStyle
                              }
                              title={
                                isEditing
                                  ? "Save"
                                  : "Edit"
                              }
                            >
                              {isEditing
                                ? "✓"
                                : "✏️"}
                            </button>

                            {/* DELETE */}
                            <button
                              type="button"
                              onClick={() =>
                                deletePickupPoint(
                                  pickup.id
                                )
                              }
                              style={
                                deleteButtonStyle
                              }
                              title="Delete"
                            >
                              🗑️
                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

            {/* ADD VARIANT BUTTON */}
            <button
              type="button"
              onClick={
                addPickupPoint
              }
              style={
                addPickupBtnStyle
              }
            >
              + Add Variant
            </button>

          </div>

        </div>
        {/* ================================================= */}
        {/* FOOTER (fixed)*/}
        {/* ================================================= */}

        {/* <div
          style={{
            display: "flex",
            justifyContent:
              "flex-end",
            gap: 10,
          }}
        > */}

        <div style={footerStyle}>

          <button
            type="button"
            onClick={onClose}
            style={
              cancelBtnStyle
            }
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              handleGenerate
            }
            disabled={
              dates.length === 0
            }
            style={generateBtnStyle(
              dates.length > 0
            )}
          >
            Generate{" "}
            {dates.length > 0
              ? `${dates.length} `
              : ""}
            Variant
            {dates.length === 1
              ? ""
              : "s"}
          </button>

        </div>

      </div>

    </div>
  );
}

// ============================================================
// MAIN STYLES
// ============================================================

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background:
    "rgba(15,23,42,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: colors.white,
  borderRadius: 12,
  // padding: 22,
  display: "flex",
  flexDirection: "column",
  width: "min(920px, 94vw)",
  maxHeight: "90vh",
  overflow: "hidden",          // the modal itself never scrolls
  boxShadow:
    "0 20px 60px rgba(0,0,0,0.25)",
};

const headerRowStyle = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  //marginBottom: 18,
  padding: "16px 22px",
  borderBottom: `1px solid ${colors.border}`,
  background: colors.white,
  flexShrink: 0,               // header keeps its height
};
const bodyStyle = {
  flex: 1,
  minHeight: 0,                // required so a flex child can scroll
  overflowY: "auto",
  padding: "18px 22px",
};

const footerStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  padding: "14px 22px",
  borderTop: `1px solid ${colors.border}`,
  background: colors.white,
  flexShrink: 0,               // footer keeps its height
};

const closeBtnStyle = {
  border: "none",
  background: "transparent",
  fontSize: 16,
  cursor: "pointer",
  color: colors.textSubtle,
};

// ============================================================
// DATE CHIP
// ============================================================

const chipWrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignContent:
    "flex-start",
  minHeight: 263,
  maxHeight: 263,
  // height : 263,
  border:
    `1px solid ${colors.border}`,
  borderRadius: 8,
  padding: 10,
  background: "#f8f9ff",
  overflowY: "auto"
};

const chipStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: colors.primary,
  color: colors.white,
  borderRadius: 20,
  padding: "5px 10px",
  fontSize: 12,
  fontWeight: 500,
  height: "fit-content",
};

const chipRemoveStyle = {
  border: "none",
  background: "transparent",
  color: colors.white,
  cursor: "pointer",
  opacity: 0.85,
  fontSize: 11,
  padding: 0,
};

// ============================================================
// BUTTONS
// ============================================================

const cancelBtnStyle = {
  border:
    `1px solid ${colors.border}`,
  background: colors.white,
  color: colors.text,
  borderRadius: 6,
  padding: "9px 18px",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
};

const generateBtnStyle = (
  enabled
) => ({
  border: "none",
  background: enabled
    ? colors.primary
    : "#c7cbe6",
  color: colors.white,
  borderRadius: 6,
  padding: "9px 18px",
  fontSize: 13,
  fontWeight: 600,
  cursor: enabled
    ? "pointer"
    : "not-allowed",
});

const addPickupBtnStyle = {
  marginTop: 10,
  border:
    `1px dashed ${colors.primary}`,
  background: "transparent",
  color: colors.primary,
  borderRadius: 6,
  padding: "7px 14px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

const actionButtonStyle = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 14,
  padding: "4px 5px",
};

const deleteButtonStyle = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 14,
  padding: "4px 5px",
};

// ============================================================
// CALENDAR
// ============================================================

const calendarBoxStyle = {
  border:
    `1px solid ${colors.border}`,
  borderRadius: 8,
  padding: 12,
  background: colors.white,
  position: "relative",
};

const calHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent:
    "space-between",
  marginBottom: 8,
};

const calendarTitleWrapStyle = {
  display: "flex",
  alignItems: "center",
  gap: 2,
};

const monthYearBtnStyle = {
  border: "none",
  background: "transparent",
  fontWeight: 600,
  fontSize: 13,
  color: colors.text,
  cursor: "pointer",
  padding: "4px 5px",
  borderRadius: 5,
};

const calNavBtnStyle = {
  border: "none",
  background: "transparent",
  fontSize: 20,
  cursor: "pointer",
  color: colors.primary,
  padding: "2px 8px",
  fontWeight: 700,
};

const calWeekRowStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(7, 1fr)",
  marginBottom: 4,
};

const calWeekLabelStyle = {
  textAlign: "center",
  fontSize: 10,
  color: colors.textSubtle,
  fontWeight: 600,
};

const calGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(7, 1fr)",
  gap: 4,
};

const calDayStyle = (
  selected,
  isToday
) => ({
  border:
    isToday && !selected
      ? `1px solid ${colors.primary}`
      : "none",
  borderRadius: 6,
  padding: "7px 0",
  fontSize: 12,
  cursor: "pointer",
  background: selected
    ? colors.primary
    : "transparent",
  color: selected
    ? colors.white
    : colors.text,
  fontWeight: selected
    ? 600
    : 400,
});

// ============================================================
// MONTH / YEAR PICKER
// ============================================================

const monthPickerStyle = {
  position: "absolute",
  top: 45,
  left: 10,
  right: 10,
  zIndex: 20,
  background: colors.white,
  border:
    `1px solid ${colors.border}`,
  borderRadius: 8,
  padding: 8,
  display: "grid",
  gridTemplateColumns:
    "repeat(3, 1fr)",
  gap: 5,
  boxShadow:
    "0 8px 25px rgba(0,0,0,0.15)",
};

const yearPickerStyle = {
  position: "absolute",
  top: 45,
  left: 20,
  right: 20,
  zIndex: 20,
  background: colors.white,
  border:
    `1px solid ${colors.border}`,
  borderRadius: 8,
  padding: 8,
  display: "grid",
  gridTemplateColumns:
    "repeat(4, 1fr)",
  gap: 5,
  maxHeight: 230,
  overflowY: "auto",
  boxShadow:
    "0 8px 25px rgba(0,0,0,0.15)",
};

const pickerItemStyle = {
  border: "none",
  borderRadius: 5,
  padding: "7px 4px",
  fontSize: 11,
  cursor: "pointer",
};