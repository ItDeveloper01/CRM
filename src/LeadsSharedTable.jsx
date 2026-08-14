// Shared pieces used by LeadListWithFilters and CreatedLeadsListWithFilters
// (and any future lead-table page).

import React, {
  useRef,
  useEffect,
  useState
} from "react";


// ============================================================
// WAIT CURSOR / LOADING OVERLAY
// ============================================================

export const LOADING_OVERLAY_STYLES = {
  overlay:
    "fixed inset-0 z-[999] flex items-center justify-center bg-black/10",

  card:
    "flex flex-col items-center gap-2 bg-white px-6 py-4 rounded-lg shadow-lg",

  spinner:
    "h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600",

  label:
    "text-sm text-gray-600",
};


export function LoadingOverlay({
  visible,
  label = "Loading..."
}) {
  if (!visible) return null;

  return (
    <div
      className={LOADING_OVERLAY_STYLES.overlay}
      style={{ cursor: "wait" }}
    >
      <div className={LOADING_OVERLAY_STYLES.card}>

        <div
          className={
            LOADING_OVERLAY_STYLES.spinner
          }
        />

        <span
          className={
            LOADING_OVERLAY_STYLES.label
          }
        >
          {label}
        </span>

      </div>
    </div>
  );
}


// ============================================================
// HOLIDAY CATEGORY HELPERS
// ============================================================

export const splitDestinations = (str) =>
  (str || "")
    .split(/[,;]/)
    .map((d) => d.trim())
    .filter(Boolean);


export const isHolidayLead = (lead) =>
  lead.category?.$type === "HOLIDAY" ||
  lead.categoryName?.toUpperCase() === "HOLIDAY";


export const getTripType = (lead) =>
  lead.category?.tripType || null;


export const getLeadType = (lead) =>
  lead.category?.leadType || null;


export const getDestinations = (lead) =>
  lead.category?.requestedDestinations || "";


export const getLatestUpdate = (lead) =>
  lead.histories?.[0]?.createdAt ||
  lead.updatedAt ||
  null;


export const getTravelDate = (lead) =>
  lead.category?.preferredTravelDate || "-";


// ============================================================
// SMALL INLINE ICONS
// ============================================================

export function SwapIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M7 7h11l-3-3M17 17H6l3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


export function EyeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="12"
        r="3"
      />
    </svg>
  );
}


// ============================================================
// MULTI SELECT FILTER
// ============================================================

export function MultiSelectFilter({
    label,
    options,
    selected,
    onToggle,
    onClear,
}) {
    const [open, setOpen] = useState(false);
    const wrapperRef = React.useRef(null);

    const isActive = selected.length > 0;

    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    return (
        <div
            className="relative w-full min-w-0"
            ref={wrapperRef}
        >
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`
                    w-full
                    min-w-0
                    border
                    px-2
                    py-1.5
                    rounded
                    text-sm
                    text-left
                    flex
                    items-center
                    gap-1.5
                    transition
                    font-medium

                    ${isActive
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-400 text-gray-700 hover:border-gray-600"
                    }
                `}
            >
                <span className="truncate flex-1 min-w-0">
                    {isActive
                        ? `${label} (${selected.length})`
                        : label}
                </span>

                {isActive && (
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            onClear();
                        }}
                        className="
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                            w-4
                            h-4
                            rounded-full
                            bg-white
                            text-red-500
                            text-xs
                            font-bold
                            cursor-pointer
                            hover:text-red-600
                        "
                    >
                        ✕
                    </span>
                )}

                <span className="flex-shrink-0">
                    {open ? "▲" : "▼"}
                </span>
            </button>

            {open && (
                <div
                    className="
                        absolute
                        left-0
                        top-full
                        z-50
                        mt-1
                        w-full
                        min-w-[190px]
                        bg-white
                        border
                        border-gray-200
                        rounded
                        shadow-lg
                        max-h-56
                        overflow-auto
                    "
                >
                    {options.map((option) => {
                        const isSelected =
                            selected.includes(option);

                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() =>
                                    onToggle(option)
                                }
                                className={`
                                    w-full
                                    text-left
                                    px-3
                                    py-2
                                    text-sm
                                    transition

                                    ${isSelected
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-700 hover:bg-gray-50"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-2">

                                    <span
                                        className={`
                                            flex-shrink-0
                                            w-4
                                            h-4
                                            rounded
                                            border
                                            flex
                                            items-center
                                            justify-center

                                            ${isSelected
                                                ? "bg-blue-600 border-blue-600"
                                                : "bg-white border-gray-300"
                                            }
                                        `}
                                    >
                                        {isSelected && (
                                            <span className="text-white text-xs">
                                                ✓
                                            </span>
                                        )}
                                    </span>

                                    <span className="truncate">
                                        {option}
                                    </span>

                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
// ============================================================
// CALENDAR HELPERS
// ============================================================

const MONTHS_CAL = [
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
  "December"
];


const WEEK_DAYS = [
  "Su",
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa"
];


function calDs(y, m, d) {

  return `${y}-${String(m).padStart(
    2,
    "0"
  )}-${String(d).padStart(
    2,
    "0"
  )}`;
}


function calFmt(d) {

  if (!d) return "—";

  const [
    y,
    m,
    day
  ] = d.split("-");

  return `${day}-${m}-${y}`;
}


function calInSels(date, sels) {

  return sels.some((s) => {

    if (
      s.type === "single"
    ) {
      return s.date === date;
    }

    const [
      a,
      b
    ] = [
      s.from,
      s.to
    ].sort();

    return (
      date >= a &&
      date <= b
    );
  });
}


// ============================================================
// CALENDAR GRID
// ============================================================

function CalGrid({
  vy,
  vm,
  selections,
  dragFrom,
  dragCur,
  isDragging,
  onMouseDown,
  onMouseMove,
  onMouseUp
}) {

  const first =
    new Date(
      vy,
      vm - 1,
      1
    ).getDay();

  const days =
    new Date(
      vy,
      vm,
      0
    ).getDate();


  const getClass = (date) => {

    const all = [
      ...selections
    ];


    // Current drag preview
    if (
      isDragging &&
      dragFrom &&
      dragCur
    ) {

      const [
        a,
        b
      ] = [
        dragFrom,
        dragCur
      ].sort();


      all.push(
        a === b
          ? {
            type: "single",
            date: a
          }
          : {
            type: "range",
            from: a,
            to: b
          }
      );
    }


    let inAny = false;

    let isStart = false;

    let isEnd = false;

    let isMid = false;

    let isSingle = false;


    all.forEach((s) => {

      if (
        s.type === "single" &&
        s.date === date
      ) {

        inAny = true;

        isSingle = true;
      }


      if (
        s.type === "range"
      ) {

        const [
          a,
          b
        ] = [
          s.from,
          s.to
        ].sort();


        if (
          date >= a &&
          date <= b
        ) {

          inAny = true;


          if (
            date === a
          ) {
            isStart = true;
          }


          if (
            date === b
          ) {
            isEnd = true;
          }


          if (
            date > a &&
            date < b
          ) {
            isMid = true;
          }
        }
      }

    });


    if (!inAny)
      return "";


    // Single date or one-day range
    if (isSingle)
      return "cal-sel";


    if (
      isStart &&
      isEnd
    ) {
      return "cal-sel";
    }


    if (isStart)
      return "cal-range-start";


    if (isEnd)
      return "cal-range-end";


    if (isMid)
      return "cal-range-mid";


    return "";
  };


  const cells = [];


  // Empty cells
  for (
    let i = 0;
    i < first;
    i++
  ) {

    cells.push(
      <span
        key={`empty-${i}`}
        style={{
          height: "30px"
        }}
      />
    );
  }


  // Dates
  for (
    let d = 1;
    d <= days;
    d++
  ) {

    const date =
      calDs(
        vy,
        vm,
        d
      );


    const cls =
      getClass(date);


    const dark =
      cls === "cal-sel" ||
      cls === "cal-range-start" ||
      cls === "cal-range-end";


    cells.push(

      <span
        key={date}
        data-date={date}

        onMouseDown={(e) => {

          e.preventDefault();

          onMouseDown(
            date
          );
        }}

        onMouseMove={() =>
          onMouseMove(
            date
          )
        }

        onMouseUp={() =>
          onMouseUp(
            date
          )
        }

        style={{
          position:
            "relative",

          height:
            "30px",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          fontSize:
            "12px",

          cursor:
            "pointer",

          userSelect:
            "none"
        }}
      >

        {/* Range middle */}

        {cls ===
          "cal-range-mid" && (

            <span
              style={{
                position:
                  "absolute",

                left: 0,

                right: 0,

                top:
                  "3px",

                bottom:
                  "3px",

                background:
                  "#dbeafe"
              }}
            />

          )}


        {/* Range START */}

        {cls ===
          "cal-range-start" && (

            <span
              style={{
                position:
                  "absolute",

                left:
                  "2px",

                right: 0,

                top:
                  "2px",

                bottom:
                  "2px",

                background:
                  "#2563eb",

                borderRadius:
                  "4px 0 0 4px"
              }}
            />

          )}


        {/* Range END */}

        {cls ===
          "cal-range-end" && (

            <span
              style={{
                position:
                  "absolute",

                left: 0,

                right:
                  "2px",

                top:
                  "2px",

                bottom:
                  "2px",

                background:
                  "#2563eb",

                borderRadius:
                  "0 4px 4px 0"
              }}
            />

          )}


        {/* Single date */}

        {cls ===
          "cal-sel" && (

            <span
              style={{
                position:
                  "absolute",

                width:
                  "26px",

                height:
                  "26px",

                background:
                  "#2563eb",

                border:
                  "1px solid #1d4ed8",

                borderRadius:
                  "4px"
              }}
            />

          )}


        {/* Date number */}

        <span
          style={{
            position:
              "relative",

            zIndex:
              2,

            fontWeight:
              dark
                ? 600
                : 400,

            color:
              dark
                ? "#ffffff"
                : "#111827"
          }}
        >
          {d}
        </span>

      </span>
    );
  }


  return (

    <div
      style={{
        display:
          "grid",

        gridTemplateColumns:
          "repeat(7, 1fr)",

        textAlign:
          "center"
      }}
    >
      {cells}
    </div>
  );
}


// ============================================================
// CALENDAR ICON
// ============================================================

function CalendarIcon({
  size = 15
}) {

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >

      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
      />

      <line
        x1="16"
        y1="2"
        x2="16"
        y2="6"
      />

      <line
        x1="8"
        y1="2"
        x2="8"
        y2="6"
      />

      <line
        x1="3"
        y1="10"
        x2="21"
        y2="10"
      />

    </svg>
  );
}


// ============================================================
// CALENDAR FILTER
// ============================================================

export function CalendarFilter({
  label,
  selections = [],
  onApply,
  onClear
}) {

  const [open, setOpen] =
    useState(false);

  const [vy, setVy] =
    useState(
      new Date().getFullYear()
    );

  const [vm, setVm] =
    useState(
      new Date().getMonth() + 1
    );

  const [pending, setPending] =
    useState(selections);

  const [dragFrom, setDragFrom] =
    useState(null);

  const [dragCur, setDragCur] =
    useState(null);

  const [isDragging, setIsDragging] =
    useState(false);

  const [showMonthYear, setShowMonthYear] =
    useState(false);

  // Infinite-scrolling year list for the year/month picker.
  // Starts centered on the current year; grows at either end
  // as the user scrolls near the top or bottom edge.
  const [yearList, setYearList] =
    useState(() => {
      const start = new Date().getFullYear() - 5;
      return Array.from(
        { length: 11 },
        (_, i) => start + i
      );
    });

  const wrapRef =
    useRef(null);

  const yearScrollRef =
    useRef(null);

  const loadingMoreYearsRef =
    useRef(false);

  // Map of year -> DOM node for the year-row buttons in the
  // year/month picker, used to scroll a clicked/target year
  // to the top of the (short) scroll pane so its month grid
  // is fully visible without extra scrolling.
  const yearRefs =
    useRef({});


  // ========================================================
  // RECENTER YEAR LIST EACH TIME THE PICKER OPENS
  // ========================================================

  useEffect(() => {

    if (showMonthYear) {

      const start = vy - 5;

      setYearList(
        Array.from(
          { length: 11 },
          (_, i) => start + i
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMonthYear]);


  // ========================================================
  // INFINITE SCROLL: APPEND / PREPEND YEARS
  // ========================================================

  const YEAR_ROW_HEIGHT = 29;
  const YEAR_BATCH = 5;

  const appendYears = () => {

    if (loadingMoreYearsRef.current)
      return;

    loadingMoreYearsRef.current = true;

    setYearList((prev) => {

      const last = prev[prev.length - 1];

      const more = Array.from(
        { length: YEAR_BATCH },
        (_, i) => last + i + 1
      );

      return [...prev, ...more];
    });

    setTimeout(() => {
      loadingMoreYearsRef.current = false;
    }, 150);
  };

  const prependYears = () => {

    if (loadingMoreYearsRef.current)
      return;

    loadingMoreYearsRef.current = true;

    const el = yearScrollRef.current;

    const prevScrollTop =
      el ? el.scrollTop : 0;

    setYearList((prev) => {

      const first = prev[0];

      const more = Array.from(
        { length: YEAR_BATCH },
        (_, i) => first - YEAR_BATCH + i
      );

      return [...more, ...prev];
    });

    // Keep the viewport steady after new rows are
    // inserted above the currently visible ones.
    requestAnimationFrame(() => {

      if (yearScrollRef.current) {

        yearScrollRef.current.scrollTop =
          prevScrollTop +
          YEAR_BATCH * YEAR_ROW_HEIGHT;
      }

      loadingMoreYearsRef.current = false;
    });
  };

  const handleYearScroll = (e) => {

    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = e.target;

    if (
      scrollHeight - (scrollTop + clientHeight) <
      30
    ) {
      appendYears();
    } else if (scrollTop < 30) {
      prependYears();
    }
  };


  // Scroll an already-visible year's row to the TOP of the
  // pane (no list recentering) so its month grid lands fully
  // in view without the user needing to scroll further.
  const scrollYearToTop = (year) => {

    requestAnimationFrame(() => {

      const el =
        yearRefs.current[year];

      if (el) {
        el.scrollIntoView({
          block: "start"
        });
      }
    });
  };

  // Recenter the year list around `year` AND scroll that
  // year's row to the top. Used when jumping to a year that
  // may be far outside the currently scrolled range (e.g.
  // "Today" while the pane is showing years from a decade ago).
  const jumpYearPickerTo = (year) => {

    const start = year - 5;

    setYearList(
      Array.from(
        { length: 11 },
        (_, i) => start + i
      )
    );

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        const el =
          yearRefs.current[year];

        if (el) {
          el.scrollIntoView({
            block: "start"
          });
        }
      });
    });
  };


  // ========================================================
  // SYNC EXTERNAL SELECTIONS
  // FIX: only resync `pending` from the parent's `selections`
  // when the popup is opened - not on every render where the
  // parent happens to pass a new `selections` array reference.
  // Previously this ran on every `selections` change, which
  // could stomp on in-progress edits (e.g. a deselect click)
  // before the user had a chance to see it take effect.
  // ========================================================

  useEffect(() => {

    if (open) {
      setPending(
        selections
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);


  // ========================================================
  // GLOBAL MOUSE UP
  // ========================================================

  useEffect(() => {

    const up = () => {

      if (isDragging) {

        setIsDragging(
          false
        );

        setDragFrom(
          null
        );

        setDragCur(
          null
        );
      }
    };


    document.addEventListener(
      "mouseup",
      up
    );


    return () =>
      document.removeEventListener(
        "mouseup",
        up
      );

  }, [isDragging]);


  // ========================================================
  // OUTSIDE CLICK
  // ========================================================

  useEffect(() => {

    const handler = (e) => {

      if (
        wrapRef.current &&
        !wrapRef.current.contains(
          e.target
        )
      ) {

        setOpen(
          false
        );

        setShowMonthYear(
          false
        );
      }
    };


    document.addEventListener(
      "click",
      handler
    );


    return () =>
      document.removeEventListener(
        "click",
        handler
      );

  }, []);


  // ========================================================
  // DRAG START
  // ========================================================

  const handleMouseDown = (
    date
  ) => {

    setIsDragging(
      true
    );

    setDragFrom(
      date
    );

    setDragCur(
      date
    );
  };


  // ========================================================
  // DRAG MOVE
  // ========================================================

  const handleMouseMove = (
    date
  ) => {

    if (!isDragging)
      return;

    setDragCur(
      date
    );
  };


  // ========================================================
  // DRAG END
  // FIX: read/update `pending` via the functional setState
  // form so a single click on an already-selected date always
  // toggles it OFF using the latest state, not a stale closure.
  // ========================================================

  const handleMouseUp = (
    date
  ) => {

    if (!isDragging)
      return;


    setIsDragging(
      false
    );


    const end =
      dragCur || date;


    const [
      a,
      b
    ] = [
      dragFrom,
      end
    ].sort();


    if (a === b) {

      // Single date click - TOGGLE selection
      setPending(
        (p) => {

          const idx =
            p.findIndex(
              (s) =>
                s.type ===
                "single" &&
                s.date === a
            );


          if (idx >= 0) {

            // Already selected -> deselect it
            return p.filter(
              (_, i) =>
                i !== idx
            );
          }


          // Not selected -> select it
          return [
            ...p,
            {
              type:
                "single",

              date:
                a
            }
          ];
        }
      );

    } else {

      setPending(
        (p) => [
          ...p,
          {
            type:
              "range",

            from:
              a,

            to:
              b
          }
        ]
      );
    }


    setDragFrom(
      null
    );

    setDragCur(
      null
    );
  };


  // ========================================================
  // PREVIOUS MONTH
  // ========================================================

  const prevMonth = (e) => {

    e.stopPropagation();


    if (vm === 1) {

      setVy(
        (y) => y - 1
      );

      setVm(
        12
      );

    } else {

      setVm(
        (m) => m - 1
      );
    }
  };


  // ========================================================
  // NEXT MONTH
  // ========================================================

  const nextMonth = (e) => {

    e.stopPropagation();


    if (vm === 12) {

      setVy(
        (y) => y + 1
      );

      setVm(
        1
      );

    } else {

      setVm(
        (m) => m + 1
      );
    }
  };


  // ========================================================
  // SELECTED DISPLAY AT BOTTOM
  // ========================================================

  const selectedDateLines =
    pending.map(
      (s) => {

        if (
          s.type ===
          "single"
        ) {

          return calFmt(
            s.date
          );
        }


        const [
          from,
          to
        ] =
          [
            s.from,
            s.to
          ].sort();


        return `${calFmt(
          from
        )} → ${calFmt(
          to
        )}`;
      }
    );


  // ========================================================
  // ACTIVE FILTER
  // ========================================================

  const isActive =
    selections.length > 0;


  // ========================================================
  // BUTTON LABEL
  // ========================================================

  const btnLabel =
    selections.length === 0

      ? label

      : selections.length === 1 &&
        selections[0].type ===
        "single"

        ? `${label}: ${calFmt(
          selections[0].date
        )}`

        : selections.length === 1

          ? `${label}: ${calFmt(
            [
              selections[0].from,
              selections[0].to
            ].sort()[0]
          )} → ${calFmt(
            [
              selections[0].from,
              selections[0].to
            ].sort()[1]
          )}`

          : `${label} (${selections.length})`;


  // ========================================================
  // TOOLTIP
  // ========================================================

  const getSelectedDatesTooltip =
    () => {

      if (
        !selections ||
        selections.length === 0
      ) {
        return "";
      }


      return selections
        .map(
          (s) => {

            if (
              s.type ===
              "single"
            ) {

              return calFmt(
                s.date
              );
            }


            const [
              from,
              to
            ] =
              [
                s.from,
                s.to
              ].sort();


            return `${calFmt(
              from
            )} → ${calFmt(
              to
            )}`;
          }
        )
        .join(
          "\n"
        );
    };


  return (

    <div
      ref={wrapRef}

      style={{
        position:
          "relative",

        display:
          "inline-block"
      }}
    >

      {/* ==================================================
                FILTER BUTTON
            ================================================== */}

      <div className="relative group">

        <button
          type="button"

          onClick={(e) => {

            e.stopPropagation();

            setOpen(
              (o) => !o
            );

            setShowMonthYear(
              false
            );
          }}

          className={`
                        border
                        px-2
                        py-1.5
                        rounded
                        text-sm
                        min-w-[195px]
                        text-left
                        flex
                        items-center
                        gap-1.5
                        transition
                        font-medium

                        ${isActive
              ? "bg-blue-600 border-blue-600 text-white"
              : "bg-white border-gray-400 text-gray-700 hover:border-gray-600"
            }
                    `}
        >

          {/* Calendar icon */}

          <span
            className="
                            flex-shrink-0
                            flex
                            items-center
                            justify-center
                        "
          >
            <CalendarIcon
              size={15}
            />
          </span>


          {/* Text */}

          <span
            className="
                            truncate
                            flex-1
                            min-w-0
                        "
          >
            {btnLabel}
          </span>


          {/* Selected = EXACT SAME CROSS
                        AS OTHER DROPDOWNS */}

          {isActive ? (

            <span
              onMouseDown={(e) => {

                e.stopPropagation();

                e.preventDefault();

                setPending([]);

                onClear();

                setOpen(false);
              }}

              title="Clear filter"

              className="
                                flex-shrink-0
                                w-4
                                h-4
                                rounded-full
                                bg-white
                                text-red-600
                                flex
                                items-center
                                justify-center
                                text-[11px]
                                font-black
                                leading-none
                                hover:bg-red-100
                                cursor-pointer
                            "
            >
              ✕
            </span>

          ) : (

            <span
              className="
                                text-[10px]
                                text-gray-500
                                flex-shrink-0
                            "
            >
              {open
                ? "▲"
                : "▼"}
            </span>

          )}

        </button>


        {/* ==================================================
                    SELECTED DATES TOOLTIP
                ================================================== */}

        {isActive &&
          selections.length > 0 && (

            <div
              className="
                                pointer-events-none
                                absolute
                                left-1/2
                                -translate-x-1/2
                                top-full
                                mt-2
                                z-[10000]

                                hidden
                                group-hover:block

                                w-[270px]

                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                shadow-xl

                                px-3
                                py-2.5

                                text-xs
                                text-gray-700
                            "
            >

              {/* Arrow */}

              <div
                className="
                                    absolute
                                    -top-1
                                    left-1/2
                                    -translate-x-1/2
                                    w-2
                                    h-2
                                    rotate-45
                                    bg-white
                                    border-l
                                    border-t
                                    border-gray-200
                                "
              />


              <div
                className="
                                    relative
                                    font-semibold
                                    text-gray-800
                                    mb-2
                                "
              >
                Selected Date :
              </div>


              <div
                className="
                                    relative
                                    space-y-1.5
                                    max-h-[180px]
                                    overflow-y-auto
                                "
              >

                {selections.map(
                  (
                    s,
                    index
                  ) => {

                    let text;


                    if (
                      s.type ===
                      "single"
                    ) {

                      text =
                        calFmt(
                          s.date
                        );

                    } else {

                      const [
                        from,
                        to
                      ] =
                        [
                          s.from,
                          s.to
                        ].sort();


                      text =
                        `${calFmt(
                          from
                        )} → ${calFmt(
                          to
                        )}`;
                    }


                    return (

                      <div
                        key={
                          index
                        }

                        className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-gray-600
                                                "
                      >

                        <span
                          className="
                                                        w-1.5
                                                        h-1.5
                                                        rounded-full
                                                        bg-blue-500
                                                        flex-shrink-0
                                                    "
                        />

                        <span>
                          {text}
                        </span>

                      </div>
                    );
                  }
                )}

              </div>

            </div>
          )}

      </div>


      {/* ==================================================
                CALENDAR POPUP
            ================================================== */}

      {open && (

        <div
          onClick={(e) =>
            e.stopPropagation()
          }

          style={{
            position:
              "absolute",

            top:
              "calc(100% + 6px)",

            left: 0,

            zIndex:
              9999,

            width:
              "290px",

            background:
              "#ffffff",

            border:
              "1px solid #d1d5db",

            borderRadius:
              "8px",

            boxShadow:
              "0 12px 35px rgba(0,0,0,0.18)",

            overflow:
              "hidden"
          }}
        >

          {/* ==================================================
                        HEADER
                    ================================================== */}

          <div
            style={{
              height:
                "42px",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              padding:
                "0 8px",

              borderBottom:
                "1px solid #f3f4f6"
            }}
          >

            {/* Month / Year */}

            <button
              type="button"

              onClick={() =>
                setShowMonthYear(
                  (v) =>
                    !v
                )
              }

              style={{
                border:
                  "none",

                background:
                  "transparent",

                padding:
                  "4px 6px",

                fontSize:
                  "13px",

                fontWeight:
                  600,

                color:
                  "#374151",

                cursor:
                  "pointer",

                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "4px"
              }}
            >

              <span>
                {
                  MONTHS_CAL[
                  vm - 1
                  ]
                }, {vy}
              </span>

              <span
                style={{
                  fontSize:
                    "13px",

                  fontWeight:
                    700,

                  color:
                    "#374151"
                }}
              >
                ▾
              </span>

            </button>


            {/* Exact image-style arrows */}

            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "1px"
              }}
            >

              <button
                type="button"

                onClick={
                  prevMonth
                }

                style={{
                  width:
                    "28px",

                  height:
                    "28px",

                  border:
                    "none",

                  background:
                    "transparent",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  color:
                    "#374151",

                  cursor:
                    "pointer",

                  fontSize:
                    "20px",

                  fontWeight:
                    300
                }}
              >
                ↑
              </button>


              <button
                type="button"

                onClick={
                  nextMonth
                }

                style={{
                  width:
                    "28px",

                  height:
                    "28px",

                  border:
                    "none",

                  background:
                    "transparent",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  color:
                    "#374151",

                  cursor:
                    "pointer",

                  fontSize:
                    "20px",

                  fontWeight:
                    300
                }}
              >
                ↓
              </button>

            </div>

          </div>


          {/* ==================================================
                        MONTH / YEAR PICKER
                        FIX: month grid now renders immediately
                        below the currently SELECTED year (not
                        after the full year list), matching the
                        reference screenshot - click a year and
                        its months appear right there, no scroll
                        needed.
                    ================================================== */}

          {showMonthYear && (

            <div
              ref={yearScrollRef}

              onScroll={
                handleYearScroll
              }

              style={{
                background:
                  "#ffffff",

                maxHeight:
                  "145px",

                overflowY:
                  "auto"
              }}
            >

              {yearList.map(
                (year) => (

                  <React.Fragment
                    key={
                      year
                    }
                  >

                    {/* Year row - fixed height so
                        the infinite-scroll math above
                        (YEAR_ROW_HEIGHT) stays accurate */}

                    <button
                      type="button"

                      ref={(el) => {
                        yearRefs.current[year] = el;
                      }}

                      onClick={() => {
                        setVy(year);
                        scrollYearToTop(year);
                      }}

                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        width:
                          "100%",

                        height:
                          "29px",

                        border:
                          "none",

                        borderBottom:
                          "1px solid #e5e7eb",

                        background:
                          year ===
                            vy
                            ? "#f3f4f6"
                            : "#ffffff",

                        textAlign:
                          "left",

                        padding:
                          "0 22px",

                        fontSize:
                          "12px",

                        color:
                          year ===
                            vy
                            ? "#111827"
                            : "#374151",

                        fontWeight:
                          year ===
                            vy
                            ? 600
                            : 400,

                        cursor:
                          "pointer"
                      }}
                    >
                      {year}
                    </button>


                    {/* Month grid - only under the
                        currently selected year */}

                    {year === vy && (

                      <div
                        style={{
                          display:
                            "grid",

                          gridTemplateColumns:
                            "repeat(4, 1fr)",

                          padding:
                            "6px 10px",

                          gap:
                            "2px",

                          borderBottom:
                            "1px solid #e5e7eb"
                        }}
                      >

                        {MONTHS_CAL.map(
                          (
                            month,
                            index
                          ) => {

                            const selected =
                              vm ===
                              index +
                              1;


                            return (

                              <button
                                key={
                                  month
                                }

                                type="button"

                                onClick={() => {

                                  setVm(
                                    index +
                                    1
                                  );

                                  setShowMonthYear(
                                    false
                                  );
                                }}

                                style={{
                                  border:
                                    selected
                                      ? "2px solid #374151"
                                      : "none",

                                  background:
                                    selected
                                      ? "#e5e7eb"
                                      : "transparent",

                                  borderRadius:
                                    "2px",

                                  padding:
                                    "6px 2px",

                                  fontSize:
                                    "11px",

                                  color:
                                    selected
                                      ? "#111827"
                                      : "#9ca3af",

                                  fontWeight:
                                    selected
                                      ? 600
                                      : 400,

                                  cursor:
                                    "pointer"
                                }}
                              >
                                {
                                  month.slice(
                                    0,
                                    3
                                  )
                                }
                              </button>

                            );
                          }
                        )}

                      </div>
                    )}

                  </React.Fragment>
                )
              )}

            </div>
          )}


          {/* ==================================================
                        DAY HEADERS
                    ================================================== */}

          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "repeat(7, 1fr)",

              textAlign:
                "center",

              margin:
                "8px 10px 4px",

              borderBottom:
                "1px solid #f3f4f6",

              paddingBottom:
                "4px"
            }}
          >

            {WEEK_DAYS.map(
              (d) => (

                <span
                  key={d}

                  style={{
                    fontSize:
                      "11px",

                    color:
                      "#374151",

                    padding:
                      "2px",

                    fontWeight:
                      500
                  }}
                >
                  {d}
                </span>

              )
            )}

          </div>


          {/* ==================================================
                        CALENDAR GRID
                    ================================================== */}

          <div
            style={{
              padding:
                "0 10px 5px"
            }}
          >

            <CalGrid
              vy={vy}
              vm={vm}
              selections={
                pending
              }
              dragFrom={
                dragFrom
              }
              dragCur={
                dragCur
              }
              isDragging={
                isDragging
              }
              onMouseDown={
                handleMouseDown
              }
              onMouseMove={
                handleMouseMove
              }
              onMouseUp={
                handleMouseUp
              }
            />

          </div>


          {/* ==================================================
                        SELECTED DATES AT BOTTOM
                    ================================================== */}

          <div
            style={{
              borderTop:
                "1px solid #f3f4f6",

              padding:
                "7px 10px 6px",

              background:
                "#fafafa"
            }}
          >

            <div
              style={{
                fontSize:
                  "10px",

                fontWeight:
                  600,

                color:
                  "#6b7280",

                marginBottom:
                  "3px"
              }}
            >
              Selected Date :
            </div>


            {pending.length === 0 ? (

              <div
                style={{
                  fontSize:
                    "11px",

                  color:
                    "#9ca3af"
                }}
              >
                No date selected
              </div>

            ) : (

              <div
                style={{
                  fontSize:
                    "11px",

                  color:
                    "#374151",

                  lineHeight:
                    "17px",

                  maxHeight:
                    "52px",

                  overflowY:
                    "auto"
                }}
              >

                {selectedDateLines.map(
                  (
                    line,
                    index
                  ) => (

                    <div
                      key={
                        index
                      }
                    >
                      {line}
                    </div>

                  )
                )}

              </div>

            )}

          </div>


          {/* ==================================================
                        FOOTER
                    ================================================== */}

          <div
            style={{
              height:
                "42px",

              borderTop:
                "1px solid #f3f4f6",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              padding:
                "0 10px"
            }}
          >

            {/* Clear */}

            <button
              type="button"

              onClick={(e) => {

                e.stopPropagation();

                setPending([]);

                onClear();

              }}

              style={{
                border:
                  "none",

                background:
                  "transparent",

                color:
                  "#2563eb",

                fontSize:
                  "11px",

                cursor:
                  "pointer"
              }}
            >
              Clear
            </button>


            {/* Today */}

            <button
              type="button"

              onClick={(e) => {

                e.stopPropagation();

                const now =
                  new Date();

                const today =
                  calDs(
                    now.getFullYear(),
                    now.getMonth() +
                    1,
                    now.getDate()
                  );


                setVy(
                  now.getFullYear()
                );

                setVm(
                  now.getMonth() +
                  1
                );

                setPending([
                  {
                    type:
                      "single",

                    date:
                      today
                  }
                ]);

                // Bring the year/month picker (if open) in
                // sync with "today" - recenter the year list
                // around this year and scroll it to the top,
                // so the user isn't left staring at whatever
                // range they'd scrolled to before.
                jumpYearPickerTo(
                  now.getFullYear()
                );

              }}

              style={{
                border:
                  "none",

                background:
                  "transparent",

                color:
                  "#9ca3af",

                fontSize:
                  "11px",

                cursor:
                  "pointer"
              }}
            >
              Today
            </button>


            {/* Apply */}

            <button
              type="button"

              onClick={(e) => {

                e.stopPropagation();

                onApply([
                  ...pending
                ]);

                setOpen(
                  false
                );

                setShowMonthYear(
                  false
                );

              }}

              style={{
                border:
                  "none",

                background:
                  "transparent",

                color:
                  "#2563eb",

                fontSize:
                  "11px",

                fontWeight:
                  500,

                cursor:
                  "pointer"
              }}
            >
              Apply
            </button>

          </div>

        </div>
      )}

    </div>
  );
}


// ============================================================
// LEADS SUMMARY BAR
// ============================================================

export function LeadsSummaryBar({
  dateRange,
  leads = []
}) {

  const fmt = (d) =>
    d
      ? new Date(d)
        .toLocaleDateString(
          "en-GB"
        )
        .replace(
          /\//g,
          "-"
        )
      : null;


  const counts =
    leads.reduce(
      (acc, l) => {

        const s =
          (
            l.status ||
            ""
          ).toLowerCase();


        if (
          s === "open"
        )
          acc.open++;

        else if (
          s === "confirmed"
        )
          acc.confirmed++;

        else if (
          s === "lost"
        )
          acc.lost++;

        else if (
          s === "postponed"
        )
          acc.postponed++;


        return acc;

      },
      {
        open: 0,
        confirmed: 0,
        lost: 0,
        postponed: 0
      }
    );


  const hasDate =
    dateRange?.from &&
    dateRange?.to;


  return (

    <div
      className="
                flex
                flex-wrap
                items-center
                gap-3
                px-3
                py-2
                bg-blue-50
                border
                border-blue-100
                rounded-lg
                mb-2
                text-xs
            "
    >

      {hasDate && (

        <>
          <div
            className="
                            flex
                            items-center
                            gap-1
                            text-blue-700
                            font-medium
                        "
          >

            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >

              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
              />

              <path
                d="M16 2v4M8 2v4M3 10h18"
              />

            </svg>


            {dateRange.from ===
              dateRange.to ? (

              <span>
                Data for{" "}
                <b>
                  {
                    fmt(
                      dateRange.from
                    )
                  }
                </b>
              </span>

            ) : (

              <span>
                Data from{" "}
                <b>
                  {
                    fmt(
                      dateRange.from
                    )
                  }
                </b>{" "}
                to{" "}
                <b>
                  {
                    fmt(
                      dateRange.to
                    )
                  }
                </b>
              </span>

            )}

          </div>


          <div
            className="
                            w-px
                            h-4
                            bg-blue-200
                        "
          />

        </>
      )}


      <span className="text-openText font-medium">
        Open: {counts.open}
      </span>


      <span className="text-confirmedText font-medium">
        Confirmed: {counts.confirmed}
      </span>


      <span className="text-lostText font-medium">
        Lost: {counts.lost}
      </span>


      <span className="text-postponedText font-medium">
        Postponed: {counts.postponed}
      </span>


      <div
        className="
                    w-px
                    h-4
                    bg-blue-200
                "
      />


      <span className="text-gray-500">
        Total:{" "}
        <b>
          {leads.length}
        </b>
      </span>

    </div>
  );
}


// ============================================================
// SORTABLE HEADER
// ============================================================

export function SortableHeader({
  label,
  sortKey,
  sortConfig,
  onSort,
  className = ""
}) {

  const isActive =
    sortConfig.key ===
    sortKey;

  const direction =
    isActive
      ? sortConfig.direction
      : "asc";


  return (

    <th
      className={`
                p-2
                text-left
                sticky
                top-0
                z-10
                bg-gray-100
                cursor-pointer
                select-none
                hover:bg-gray-200
                ${className}
            `}
      onClick={() =>
        onSort(sortKey)
      }
    >

      <span
        className="
                    inline-flex
                    items-center
                    gap-1
                "
      >

        {label}

        <span
          className={`
                        text-[9px]
                        leading-none

                        ${isActive
              ? "text-gray-600"
              : "text-gray-300"
            }
                    `}
        >
          {direction ===
            "asc"
            ? "▲"
            : "▼"}
        </span>

      </span>

    </th>
  );
}
