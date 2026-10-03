// BucketCard.jsx

import React, { useMemo, useRef, useState, useEffect } from "react";
import axios from "axios";
import {
    Maximize2,
    Minimize2,
    Search,
    X,
    Filter,
    ChevronDown
} from "lucide-react";

import LeadRow from "./LeadRow";
import UpdateLeadsModal from "../../UpdateLeadsModal";
import { getEmptyLeadObj } from "../../Model/LeadModel";
import config from "../../config";
import { useGetSessionUser } from "../../SessionContext";
import { MESSAGE_TYPES } from "../../Constants";
import { useMessageBox } from "../../Notification";

/* =========================================================
   BUCKET META
========================================================= */

const BUCKET_META = {
    overdue: {
        label: "Overdue Followups",
        dot: "bg-red-500",
        header: "bg-red-50 text-red-700"
    },
    today: {
        label: "Today Due Followups",
        dot: "bg-emerald-500",
        header: "bg-emerald-50 text-emerald-700"
    },
    created: {
        label: "Today's Created Leads",
        dot: "bg-blue-500",
        header: "bg-blue-50 text-blue-700"
    },
    upcoming: {
        label: "Upcoming Followups",
        dot: "bg-slate-400",
        header: "bg-slate-100 text-slate-600"
    }
};

/* =========================================================
   COLUMN WIDTHS
========================================================= */

const COLLAPSED_COLUMNS = {
    gridTemplateColumns: "4% 6% 32% 20% 18% 20%"
};

const EXPANDED_COLUMNS = {
    gridTemplateColumns:
        "2% 6% 15% 9% 11% 9% 11% 11% 10% 16%"
};

const EXPANDED_HOLIDAY_COLUMNS = {
    gridTemplateColumns:
        "2% 5% 14% 9% 8% 8% 7% 8% 8% 9% 7% 7% 8%"
};

/* =========================================================
   SEARCH HELPERS
========================================================= */

const flattenSearchableText = (obj, depth = 0) => {
    if (!obj || typeof obj !== "object" || depth > 1) {
        return "";
    }

    return Object.values(obj)
        .map((v) => {
            if (v === null || v === undefined) {
                return "";
            }

            if (
                typeof v === "string" ||
                typeof v === "number"
            ) {
                return String(v);
            }

            if (typeof v === "object") {
                return flattenSearchableText(v, depth + 1);
            }

            return "";
        })
        .join(" ");
};

const getLeadNameText = (lead) => {
    const nameParts = [
        lead?.FirstName,
        lead?.firstName,
        lead?.MiddleName,
        lead?.middleName,
        lead?.LastName,
        lead?.lastName,
        lead?.Name,
        lead?.name,
        lead?.CustomerName,
        lead?.customerName,
        lead?.LeadName,
        lead?.leadName,
        lead?.FullName,
        lead?.fullName,

        lead?.customer?.FirstName,
        lead?.customer?.MiddleName,
        lead?.customer?.LastName,
        lead?.customer?.Name,
        lead?.customer?.name,

        lead?.Customer?.FirstName,
        lead?.Customer?.MiddleName,
        lead?.Customer?.LastName,
        lead?.Customer?.Name
    ].filter(Boolean);

    if (nameParts.length > 0) {
        return nameParts.join(" ");
    }

    const {
        category,
        histories,
        ...rest
    } = lead || {};

    return flattenSearchableText(rest);
};

const getLeadDestinationText = (lead) => {
    const candidates = [
        lead?.category?.preferredDestinations,
        lead?.category?.PreferredDestinations,
        lead?.category?.requestedDestinations,
        lead?.category?.RequestedDestinations,
        lead?.category?.destination,
        lead?.category?.Destination,
        lead?.PreferredDestination,
        lead?.preferredDestination
    ].filter(Boolean);

    if (candidates.length > 0) {
        return candidates.join(" ");
    }

    return flattenSearchableText(lead?.category);
};

/* =========================================================
   GENERIC FIELD HELPERS
========================================================= */

const getLeadIdSortValue = (lead) => {
    const value = getLeadId(lead);

    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ) {
        return null;
    }

    const numericValue = Number(
        String(value).replace(/,/g, "").trim()
    );

    return Number.isFinite(numericValue)
        ? numericValue
        : null;
};

const getLeadId = (lead) =>
    lead?.LeadID ??
    lead?.leadID ??
    lead?.LeadId ??
    lead?.leadId ??
    "";

const getFollowUpValue = (lead) =>
    lead?.followUpDate ??
    lead?.FollowUpDate ??
    lead?.followupDate ??
    lead?.FollowupDate ??
    "";

const getEnquiryValue = (lead) =>
    lead?.EnquiryDate ??
    lead?.enquiryDate ??
    lead?.createdAt ??
    lead?.CreatedAt ??
    "";

const getTravelDateValue = (lead) =>
    lead?.category?.preferredTravelDate ??
    lead?.category?.PreferredTravelDate ??
    lead?.preferredTravelDate ??
    lead?.PreferredTravelDate ??
    "";

const getCategoryText = (lead) =>
    lead?.categoryName ??
    lead?.CategoryName ??
    lead?.category?.categoryName ??
    lead?.category?.CategoryName ??
    lead?.category?.name ??
    lead?.category?.Name ??
    lead?.Category ??
    lead?.category ??
    "";

const getAssigneeText = (lead) =>
    lead?.leadAssignedTo ??
    lead?.LeadAssignedTo ??
    lead?.assignedTo ??
    lead?.AssignedTo ??
    lead?.assignedUserId ??
    lead?.AssignedUserId ??
    lead?.userId ??
    lead?.UserId ??
    lead?.assignedUserName ??
    lead?.AssignedUserName ??
    lead?.userName ??
    lead?.UserName ??
    "";

/*
   Assignee display text is intentionally kept separate from the
   assignee filter value. The backend/filtering continues to use the
   assignee ID, while the UI shows the same full name used in the row.
*/
const getAssigneeNameText = (lead) =>
    lead?.leadAssignedToName ??
    lead?.LeadAssignedToName ??
    lead?.assignedUserName ??
    lead?.AssignedUserName ??
    lead?.assignedToName ??
    lead?.AssignedToName ??
    lead?.leadAssignedUserName ??
    lead?.LeadAssignedUserName ??
    lead?.userFullName ??
    lead?.UserFullName ??
    lead?.fullName ??
    lead?.FullName ??
    lead?.userName ??
    lead?.UserName ??
    "";

const getStatusText = (lead) =>
    lead?.statusDescription ??
    lead?.StatusDescription ??
    lead?.statusName ??
    lead?.StatusName ??
    "";

const getContactText = (lead) => {
    const values = [];

    const visit = (value, depth = 0) => {
        if (value === null || value === undefined || depth > 4) {
            return;
        }

        if (typeof value === "string" || typeof value === "number") {
            values.push(String(value));
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((item) => visit(item, depth + 1));
            return;
        }

        if (typeof value !== "object") {
            return;
        }

        Object.entries(value).forEach(([key, item]) => {
            const normalizedKey = key
                .replace(/[^a-zA-Z0-9]/g, "")
                .toLowerCase();

            const isContactField =
                normalizedKey.includes("phone") ||
                normalizedKey.includes("mobile") ||
                normalizedKey.includes("telephone") ||
                normalizedKey.includes("contactnumber") ||
                normalizedKey.includes("contactno") ||
                normalizedKey === "email" ||
                normalizedKey.includes("emailaddress");

            if (isContactField) {
                if (item !== null && item !== undefined) {
                    values.push(String(item));
                }
            } else if (item && typeof item === "object") {
                visit(item, depth + 1);
            }
        });
    };

    visit(lead);

    return [...new Set(values)].join(" ");
};

const getTypeTripText = (lead) => {
    const values = [
        lead?.type,
        lead?.Type,
        lead?.tripType,
        lead?.TripType,
        lead?.leadType,
        lead?.LeadType,

        lead?.category?.type,
        lead?.category?.Type,
        lead?.category?.tripType,
        lead?.category?.TripType,
        lead?.category?.leadType,
        lead?.category?.LeadType
    ].filter(Boolean);

    return values.join(" ");
};

const getDisplayDate = (value) => {
    if (!value) {
        return "";
    }

    const text = String(value).trim();

    // Support values already formatted as DD/MM/YYYY or DD-MM-YYYY.
    const parts = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);

    let date;

    if (parts) {
        date = new Date(
            Number(parts[3]),
            Number(parts[2]) - 1,
            Number(parts[1])
        );
    } else {
        date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) {
        return text;
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const getDateSearchText = (value) => {
    // Search only the same human-readable date shown in the table.
    // Do not include the raw backend timestamp because its time portion
    // can cause unrelated numeric matches (for example searching "19").
    return getDisplayDate(value).toLowerCase();
};

/* =========================================================
   HEADER TEXT
========================================================= */

const HeaderText = ({
    text,
    center = false,
    wrap = false
}) => (
    <div
        className={`
            min-w-0
            h-full
            flex
            items-center
            text-[10px]
            font-bold
            uppercase
            tracking-wide
            text-slate-400
            ${wrap
                ? "whitespace-normal break-words leading-3"
                : "truncate"
            }
            ${center ? "justify-center text-center" : ""}
        `}
        title={text}
    >
        {text}
    </div>
);

/* =========================================================
   FILTER POPOVER
========================================================= */

const FilterPopover = ({
    filterKey,
    title,
    value,
    onChange,
    onClear,
    options = [],
    type = "text"
}) => {
    const [localSearch, setLocalSearch] = useState("");

    const normalizedOptions = useMemo(
        () =>
            options.map((option) => {
                if (
                    option &&
                    typeof option === "object"
                ) {
                    return {
                        value: String(option.value ?? ""),
                        label: String(
                            option.label ??
                                option.value ??
                                ""
                        )
                    };
                }

                return {
                    value: String(option ?? ""),
                    label: String(option ?? "")
                };
            }),
        [options]
    );

    const filteredOptions = useMemo(() => {
        if (!localSearch.trim()) {
            return normalizedOptions;
        }

        const searchText =
            localSearch.trim().toLowerCase();

        return normalizedOptions.filter(
            (option) =>
                option.label
                    .toLowerCase()
                    .includes(searchText) ||
                option.value
                    .toLowerCase()
                    .includes(searchText)
        );
    }, [normalizedOptions, localSearch]);

    const selectedValues = Array.isArray(value)
        ? value.map((item) => String(item))
        : String(value || "").trim()
            ? [String(value)]
            : [];

    const hasValue = selectedValues.length > 0;

    return (
        <div
            className="
                absolute
                right-0
                top-full
                z-[100]
                mt-1
                w-60
                rounded-lg
                border
                border-slate-200
                bg-white
                p-2
                shadow-xl
            "
            onClick={(e) => e.stopPropagation()}
        >
            {/* HEADER */}

            <div
                className="
                    mb-2
                    flex
                    items-center
                    justify-between
                    border-b
                    border-slate-100
                    pb-2
                "
            >
                <span
                    className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wide
                        text-slate-500
                    "
                >
                    Filter {title}
                </span>

                <button
                    type="button"
                    onClick={onClear}
                    disabled={!hasValue}
                    className="
                        text-[10px]
                        font-semibold
                        text-slate-400
                        hover:text-slate-700
                        disabled:cursor-default
                        disabled:opacity-40
                    "
                >
                    Clear
                </button>
            </div>

            {/* TEXT */}

            {type === "text" && (
                <div className="relative">
                    <Search
                        className="
                            pointer-events-none
                            absolute
                            left-2
                            top-1/2
                            h-3.5
                            w-3.5
                            -translate-y-1/2
                            text-slate-400
                        "
                    />

                    <input
                        autoFocus
                        type="text"
                        value={value || ""}
                        onChange={(e) =>
                            onChange(e.target.value)
                        }
                        placeholder={`Search ${title.toLowerCase()}...`}
                        className="
                            h-7
                            w-full
                            rounded-md
                            border
                            border-slate-200
                            bg-white
                            pl-7
                            pr-2
                            text-[11px]
                            text-slate-700
                            outline-none
                            focus:border-slate-300
                            focus:ring-1
                            focus:ring-slate-200
                        "
                    />
                </div>
            )}

            {/* SELECTABLE VALUES */}

            {type === "select" && (
                <>
                    <div className="relative mb-2">
                        <Search
                            className="
                                pointer-events-none
                                absolute
                                left-2
                                top-1/2
                                h-3.5
                                w-3.5
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            autoFocus
                            type="text"
                            value={localSearch}
                            onChange={(e) =>
                                setLocalSearch(
                                    e.target.value
                                )
                            }
                            placeholder={`Find ${title.toLowerCase()}...`}
                            className="
                                h-7
                                w-full
                                rounded-md
                                border
                                border-slate-200
                                pl-7
                                pr-2
                                text-[11px]
                                outline-none
                                focus:border-slate-300
                                focus:ring-1
                                focus:ring-slate-200
                            "
                        />
                    </div>

                    <div className="max-h-44 overflow-y-auto">
                        {filteredOptions.length === 0 ? (
                            <div
                                className="
                                    py-3
                                    text-center
                                    text-[10px]
                                    text-slate-400
                                "
                            >
                                No values found
                            </div>
                        ) : (
                            filteredOptions.map(
                                (option) => {
                                    const selected =
                                        selectedValues.some(
                                            (item) =>
                                                item.toLowerCase() ===
                                                option.value.toLowerCase()
                                        );

                                    return (
                                        <button
                                            key={String(option)}
                                            type="button"
                                            onClick={() => {
                                                const next = selected
                                                    ? selectedValues.filter(
                                                          (item) =>
                                                              item.toLowerCase() !==
                                                              option.value.toLowerCase()
                                                      )
                                                    : [
                                                          ...selectedValues,
                                                          option.value
                                                      ];

                                                onChange(next);
                                            }}
                                            className={`
                                                flex
                                                w-full
                                                items-center
                                                rounded
                                                px-2
                                                py-1.5
                                                text-left
                                                text-[11px]
                                                transition
                                                ${
                                                    selected
                                                        ? "bg-slate-100 font-semibold text-slate-700"
                                                        : "text-slate-600 hover:bg-slate-50"
                                                }
                                            `}
                                        >
                                            <span
                                                className={`
                                                    mr-2
                                                    flex
                                                    h-3
                                                    w-3
                                                    flex-shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded
                                                    border
                                                    ${
                                                        selected
                                                            ? "border-slate-500 bg-slate-600"
                                                            : "border-slate-300"
                                                    }
                                                `}
                                            >
                                                {selected && (
                                                    <span className="text-[9px] font-bold leading-none text-white">
                                                        ✓
                                                    </span>
                                                )}
                                            </span>

                                            <span
                                                className="min-w-0 truncate"
                                                title={option.label}
                                            >
                                                {option.label}
                                            </span>
                                        </button>
                                    );
                                }
                            )
                        )}
                    </div>
                </>
            )}

            {/* DATE FILTER */}

            {type === "date" && (
                <div className="space-y-2">
                    <input
                        autoFocus
                        type="date"
                        value={value || ""}
                        onChange={(e) =>
                            onChange(e.target.value)
                        }
                        className="
                            h-7
                            w-full
                            rounded-md
                            border
                            border-slate-200
                            px-2
                            text-[11px]
                            text-slate-700
                            outline-none
                            focus:border-slate-300
                            focus:ring-1
                            focus:ring-slate-200
                        "
                    />

                    <div className="grid grid-cols-2 gap-1">
                        <button
                            type="button"
                            onClick={() => {
                                const today =
                                    new Date();

                                const year =
                                    today.getFullYear();

                                const month =
                                    String(
                                        today.getMonth() + 1
                                    ).padStart(2, "0");

                                const day =
                                    String(
                                        today.getDate()
                                    ).padStart(2, "0");

                                onChange(
                                    `${year}-${month}-${day}`
                                );
                            }}
                            className="
                                rounded
                                border
                                border-slate-200
                                px-2
                                py-1.5
                                text-[10px]
                                font-medium
                                text-slate-600
                                hover:bg-slate-50
                            "
                        >
                            Today
                        </button>

                        <button
                            type="button"
                            onClick={onClear}
                            className="
                                rounded
                                border
                                border-slate-200
                                px-2
                                py-1.5
                                text-[10px]
                                font-medium
                                text-slate-600
                                hover:bg-slate-50
                            "
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

/* =========================================================
   SORTABLE / FILTERABLE HEADER
========================================================= */

const SortFilterHeader = ({
    text,
    sortKey,
    filterKey,
    sortConfig,
    onSort,
    filterValue,
    onFilterChange,
    onFilterClear,
    filterType = "text",
    filterOptions = [],
    center = false,
    wrap = false,
    showFilter = true
}) => {
    const [filterOpen, setFilterOpen] =
        useState(false);

    const wrapperRef = useRef(null);

    const isSortActive =
        sortConfig.key === sortKey;

    const hasFilter =
        filterValue !== null &&
        filterValue !== undefined &&
        String(filterValue).trim() !== "";

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(
                    event.target
                )
            ) {
                setFilterOpen(false);
            }
        };

        if (filterOpen) {
            document.addEventListener(
                "mousedown",
                handleOutsideClick
            );
        }

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, [filterOpen]);

    return (
        <div
            ref={wrapperRef}
            className="
                relative
                flex
                h-full
                w-full
                min-w-0
                items-center
                justify-start
                gap-0.5
            "
        >
            {/* SORT BUTTON */}

            <button
                type="button"
                onClick={() => onSort(sortKey)}
                className={`
                    min-w-0
                    flex-none
                    h-full
                    flex
                    items-center
                    gap-1
                    overflow-hidden
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-400
                    hover:text-slate-600
                    ${
                        center
                            ? "justify-center text-center"
                            : ""
                    }
                `}
                title={`Sort by ${text}`}
            >
                <span
                    className={`
                        min-w-0
                        ${
                            wrap
                                ? "whitespace-normal break-words leading-3"
                                : "truncate"
                        }
                    `}
                >
                    {text}
                </span>

                <span
                    className="
                        flex
                        flex-shrink-0
                        flex-col
                        justify-center
                        leading-[6px]
                        text-[11px]
                    "
                >
                    <span
                        className={
                            isSortActive &&
                            sortConfig.direction ===
                                "asc"
                                ? "text-slate-600"
                                : "text-slate-300"
                        }
                    >
                        ▲
                    </span>

                    <span
                        className={
                            isSortActive &&
                            sortConfig.direction ===
                                "desc"
                                ? "text-slate-600"
                                : "text-slate-300"
                        }
                    >
                        ▼
                    </span>
                </span>
            </button>

            {showFilter && (
                <>
            {/* FILTER BUTTON */}

            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setFilterOpen(
                        (current) => !current
                    );
                }}
                className={`
                    relative
                    ml-0.5
                    flex
                    h-6
                    w-6
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded
                    transition
                    ${
                        filterOpen || hasFilter
                            ? "bg-slate-200 text-slate-700"
                            : "text-slate-300 hover:bg-slate-100 hover:text-slate-500"
                    }
                `}
                title={`Filter ${text}`}
            >
                <Filter className="h-4 w-4" />

                {hasFilter && (
                    <span
                        className="
                            absolute
                            -right-0.5
                            -top-0.5
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-blue-500
                        "
                    />
                )}
            </button>

            {/* POPOVER */}

            {filterOpen && (
                <FilterPopover
                    filterKey={filterKey}
                    title={text}
                    value={filterValue}
                    onChange={onFilterChange}
                    onClear={() => {
                        onFilterClear();
                        setFilterOpen(false);
                    }}
                    options={filterOptions}
                    type={filterType}
                />
            )}
                </>
            )}
        </div>
    );
};

/* =========================================================
   SIMPLE HEADER
========================================================= */

const SimpleHeader = ({
    text,
    center = false,
    wrap = false
}) => (
    <HeaderText
        text={text}
        center={center}
        wrap={wrap}
    />
);

/* =========================================================
   COMPONENT
========================================================= */

const BucketCard = ({
    bucket,
    leads = [],
    category,

    expanded,
    onToggleExpand,

    onCall,
    onNote,
    onReschedule,
    onOpen,

    noteOpen,
    rescheduleOpen,

    onSaveNote,
    onSaveReschedule,
    onRescheduleSuccess,
    onCancelInline
}) => {
    const meta = BUCKET_META[bucket];

    const safeLeads = Array.isArray(leads)
        ? leads
        : [];

    const { user: sessionUser } =
        useGetSessionUser();

    const { showMessage } =
        useMessageBox();

    /* =========================================================
       SORT
    ========================================================= */

    const [sortConfig, setSortConfig] =
        useState({
            key: null,
            direction: "asc"
        });

    /* =========================================================
       FILTERS
    ========================================================= */

    const [filters, setFilters] =
        useState({
            name: "",
            destination: "",
            category: "",
            typeTrip: "",
            followUp: "",
            enquiry: "",
            travelDate: "",
            assignee: "",
            contact: "",
            status: ""
        });

    const updateFilter = (
        key,
        value
    ) => {
        setFilters((current) => ({
            ...current,
            [key]: value
        }));
    };

    const clearFilter = (key) => {
        setFilters((current) => ({
            ...current,
            [key]: ""
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            name: "",
            destination: "",
            category: "",
            typeTrip: "",
            followUp: "",
            enquiry: "",
            travelDate: "",
            assignee: "",
            contact: "",
            status: ""
        });
    };

    /* =========================================================
       SORT
    ========================================================= */

    const handleSort = (key) => {
        setSortConfig((current) => ({
            key,
            direction:
                current.key === key &&
                current.direction === "asc"
                    ? "desc"
                    : "asc"
        }));
    };

    const getSortValue = (
        lead,
        key
    ) => {
        switch (key) {
            case "leadId":
             return  getLeadIdSortValue(lead);

            case "followUp":
                return getFollowUpValue(
                    lead
                );

            case "enquiry":
                return getEnquiryValue(
                    lead
                );

            case "travelDate":
                return getTravelDateValue(
                    lead
                );

            case "category":
                return getCategoryText(lead);

            case "typeTrip":
                return getTypeTripText(lead);

            case "assignee":
                return getAssigneeText(lead);

            case "contact":
                return getContactText(lead);

            case "status":
                return getStatusText(lead);

            default:
                return "";
        }
    };

    /* =========================================================
       HOLIDAY
    ========================================================= */

    const isHoliday =
        safeLeads.length > 0 &&
        String(
            safeLeads[0]?.categoryName ??
                safeLeads[0]?.CategoryName ??
                ""
        ).toUpperCase() ===
            "HOLIDAY";

    /* =========================================================
       FILTER OPTIONS
    ========================================================= */

    const getUniqueOptions = (
        getter
    ) => {
        const values = safeLeads
            .map((lead) =>
                getter(lead)
            )
            .flatMap((value) =>
                String(value || "")
                    .split(",")
            )
            .map((value) =>
                value.trim()
            )
            .filter(Boolean);

        return [...new Set(values)].sort(
            (a, b) =>
                a.localeCompare(b)
        );
    };

    const categoryOptions =
        useMemo(
            () =>
                getUniqueOptions(
                    getCategoryText
                ),
            [safeLeads]
        );

    const assigneeOptions =
        useMemo(() => {
            const map = new Map();

            safeLeads.forEach((lead) => {
                const id = String(
                    getAssigneeText(lead) || ""
                ).trim();

                if (!id) {
                    return;
                }

                const name = String(
                    getAssigneeNameText(lead) || ""
                ).trim();

                const label = name
                    ? `${name} (${id})`
                    : id;

                if (!map.has(id)) {
                    map.set(id, {
                        value: id,
                        label
                    });
                }
            });

            return [...map.values()].sort((a, b) =>
                a.label.localeCompare(
                    b.label,
                    undefined,
                    {
                        sensitivity: "base"
                    }
                )
            );
        }, [safeLeads]);

    const statusOptions =
        useMemo(
            () => getUniqueOptions(getStatusText),
            [safeLeads]
        );

    const typeTripOptions =
        useMemo(
            () =>
                getUniqueOptions(
                    getTypeTripText
                ),
            [safeLeads]
        );

    /* =========================================================
       FILTERED LEADS
    ========================================================= */

    const searchedLeads =
        useMemo(() => {
            return safeLeads.filter(
                (lead) => {
                    const nameQuery =
                        filters.name
                            .trim()
                            .toLowerCase();

                    const destinationQuery =
                        isHoliday
                            ? filters.destination
                                  .trim()
                                  .toLowerCase()
                            : "";

                    const categoryQuery =
                        Array.isArray(filters.category)
                            ? ""
                            : filters.category.trim().toLowerCase();

                    const typeTripQuery =
                        Array.isArray(filters.typeTrip)
                            ? ""
                            : filters.typeTrip.trim().toLowerCase();

                    const followUpQuery =
                        filters.followUp
                            .trim()
                            .toLowerCase();

                    const enquiryQuery =
                        filters.enquiry
                            .trim()
                            .toLowerCase();

                    const travelDateQuery =
                        filters.travelDate
                            .trim()
                            .toLowerCase();

                    const assigneeQuery =
                        Array.isArray(filters.assignee)
                            ? ""
                            : filters.assignee.trim().toLowerCase();

                    const contactQuery =
                        filters.contact
                            .trim()
                            .toLowerCase();

                    const contactDigitsQuery =
                        contactQuery.replace(/\D/g, "");

                    const statusQuery =
                        filters.status;

                    const matchesSelected = (value, selected) => {
                        const selectedValues = Array.isArray(selected)
                            ? selected
                            : String(selected || "").trim()
                                ? [selected]
                                : [];

                        if (!selectedValues.length) return true;

                        const text = String(value || "").toLowerCase();
                        return selectedValues.some((item) =>
                            text.includes(String(item).toLowerCase())
                        );
                    };

                    if (
                        nameQuery &&
                        !getLeadNameText(
                            lead
                        )
                            .toLowerCase()
                            .includes(
                                nameQuery
                            )
                    ) {
                        return false;
                    }

                    if (
                        destinationQuery &&
                        !getLeadDestinationText(
                            lead
                        )
                            .toLowerCase()
                            .includes(
                                destinationQuery
                            )
                    ) {
                        return false;
                    }

                    if (
                        !matchesSelected(
                            getCategoryText(lead),
                            filters.category
                        )
                    ) {
                        return false;
                    }

                    if (
                        !matchesSelected(
                            getTypeTripText(lead),
                            filters.typeTrip
                        )
                    ) {
                        return false;
                    }

                    if (
                        followUpQuery
                    ) {
                        const value =
                            getDateSearchText(
                                getFollowUpValue(lead)
                            );

                        if (
                            !value.includes(
                                followUpQuery
                            )
                        ) {
                            return false;
                        }
                    }

                    if (
                        enquiryQuery
                    ) {
                        const value =
                            getDateSearchText(
                                getEnquiryValue(lead)
                            );

                        if (
                            !value.includes(
                                enquiryQuery
                            )
                        ) {
                            return false;
                        }
                    }

                    if (
                        travelDateQuery
                    ) {
                        const value =
                            getDateSearchText(
                                getTravelDateValue(lead)
                            );

                        if (
                            !value.includes(
                                travelDateQuery
                            )
                        ) {
                            return false;
                        }
                    }

                    if (
                        !matchesSelected(
                            getAssigneeText(lead),
                            filters.assignee
                        )
                    ) {
                        return false;
                    }

                    if (contactQuery) {
                        const contactText = getContactText(lead).toLowerCase();
                        const contactDigits = contactText.replace(/\D/g, "");

                        const matchesContactText =
                            contactText.includes(contactQuery);

                        const matchesContactDigits =
                            contactDigitsQuery.length > 0 &&
                            contactDigits.includes(contactDigitsQuery);

                        if (!matchesContactText && !matchesContactDigits) {
                            return false;
                        }
                    }

                    if (
                        !matchesSelected(
                            getStatusText(lead),
                            statusQuery
                        )
                    ) {
                        return false;
                    }

                    return true;
                }
            );
        }, [safeLeads, filters, isHoliday]);

    /* =========================================================
       SORTED LEADS
    ========================================================= */

    // const sortedLeads =
    //     useMemo(() => {
    //         return [
    //             ...searchedLeads
    //         ].sort((a, b) => {
    //             if (!sortConfig.key) {
    //                 return 0;
    //             }

    //             const valueA =
    //                 getSortValue(
    //                     a,
    //                     sortConfig.key
    //                 );

    //             const valueB =
    //                 getSortValue(
    //                     b,
    //                     sortConfig.key
    //                 );

    //             if (
    //                 !valueA &&
    //                 !valueB
    //             ) {
    //                 return 0;
    //             }

    //             if (!valueA) {
    //                 return 1;
    //             }

    //             if (!valueB) {
    //                 return -1;
    //             }

    //             let comparison = 0;

    //             if (
    //                 sortConfig.key ===
    //                 "leadId"
    //             ) {
    //                 comparison =
    //                     Number(valueA) -
    //                     Number(valueB);
    //             } else if (
    //                 [
    //                     "category",
    //                     "typeTrip",
    //                     "assignee",
    //                     "contact",
    //                     "status"
    //                 ].includes(sortConfig.key)
    //             ) {
    //                 comparison = String(valueA).localeCompare(
    //                     String(valueB),
    //                     undefined,
    //                     {
    //                         numeric: true,
    //                         sensitivity: "base"
    //                     }
    //                 );
    //             } else {
    //                 const dateA =
    //                     new Date(
    //                         valueA
    //                     ).getTime();

    //                 const dateB =
    //                     new Date(
    //                         valueB
    //                     ).getTime();

    //                 if (
    //                     !Number.isNaN(
    //                         dateA
    //                     ) &&
    //                     !Number.isNaN(
    //                         dateB
    //                     )
    //                 ) {
    //                     comparison =
    //                         dateA -
    //                         dateB;
    //                 } else {
    //                     comparison =
    //                         String(
    //                             valueA
    //                         ).localeCompare(
    //                             String(
    //                                 valueB
    //                             )
    //                         );
    //                 }
    //             }

    //             return sortConfig.direction ===
    //                 "asc"
    //                 ? comparison
    //                 : -comparison;
    //         });
    //     }, [
    //         searchedLeads,
    //         sortConfig
    //     ]);

    const sortedLeads = useMemo(() => {
    return [...searchedLeads].sort((a, b) => {
        if (!sortConfig.key) {
            return 0;
        }

        const valueA = getSortValue(
            a,
            sortConfig.key
        );

        const valueB = getSortValue(
            b,
            sortConfig.key
        );

        // Keep empty values at the bottom
        if (
            valueA === null ||
            valueA === undefined ||
            valueA === ""
        ) {
            return (
                valueB === null ||
                valueB === undefined ||
                valueB === ""
            )
                ? 0
                : 1;
        }

        if (
            valueB === null ||
            valueB === undefined ||
            valueB === ""
        ) {
            return -1;
        }

        let comparison = 0;

        // LEAD ID — numeric sorting
        if (sortConfig.key === "leadId") {
            comparison = valueA - valueB;
        }

        // TEXT sorting
        else if (
            [
                "category",
                "typeTrip",
                "assignee",
                "contact",
                "status"
            ].includes(sortConfig.key)
        ) {
            comparison = String(valueA).localeCompare(
                String(valueB),
                undefined,
                {
                    numeric: true,
                    sensitivity: "base"
                }
            );
        }

        // DATE sorting
        else {
            const dateA = new Date(
                valueA
            ).getTime();

            const dateB = new Date(
                valueB
            ).getTime();

            if (
                !Number.isNaN(dateA) &&
                !Number.isNaN(dateB)
            ) {
                comparison = dateA - dateB;
            } else {
                comparison = String(
                    valueA
                ).localeCompare(
                    String(valueB),
                    undefined,
                    {
                        numeric: true,
                        sensitivity: "base"
                    }
                );
            }
        }

        return sortConfig.direction === "asc"
            ? comparison
            : -comparison;
    });
}, [
    searchedLeads,
    sortConfig
]);

    /* =========================================================
       SEARCH STATE
    ========================================================= */

    const isSearching = Object.values(
        filters
    ).some(
        (value) =>
            String(value || "")
                .trim()
                .length > 0
    );

    /* =========================================================
       MODAL STATE
    ========================================================= */

    const [modalOpen, setModalOpen] =
        useState(false);

    const [modalMode, setModalMode] =
        useState("edit");

    const [openNoteId, setOpenNoteId] =
        useState(null);

    const [
        openRescheduleId,
        setOpenRescheduleId
    ] = useState(null);

    const GetLeadsForEditAPI =
        config.apiUrl +
        "/TempLead/GetLeadForEdit";

    const UpdateFollowupDateAPI =
        config.apiUrl +
        "/TempLead/UpdateFollowUpDate";

    const UpdateNotesAPI =
        config.apiUrl +
        "/TempLead/UpdateNotes";

    const [selectedLead, setSelectedLead] =
        useState(
            getEmptyLeadObj()
        );

    /* =========================================================
       FETCH LEAD DETAILS
    ========================================================= */

    async function fetchLeadDetails(
        lead
    ) {
        try {
            const res =
                await axios.post(
                    GetLeadsForEditAPI,
                    lead,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${sessionUser.token}`,
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            if (
                res &&
                res.data
            ) {
                return res.data;
            }

            showMessage(
                "Empty response from server.",
                MESSAGE_TYPES.WARNING
            );

            return null;
        } catch (error) {
            console.error(
                "Error fetching Lead for edit...",
                error
            );

            const message =
                error.response?.data ||
                error.response?.statusText ||
                error.message ||
                "Unknown error";

            showMessage(
                "Error fetching Lead for edit. " +
                    JSON.stringify(
                        message
                    ),
                MESSAGE_TYPES.ERROR
            );

            return null;
        }
    }

    /* =========================================================
       OPEN LEAD
    ========================================================= */

    const handleOpenLead =
        async (lead) => {
            try {
                const leadId =
                    getLeadId(lead);

                if (!leadId) {
                    console.error(
                        "Lead ID not found",
                        lead
                    );
                    return;
                }

                const templead =
                    await fetchLeadDetails(
                        lead
                    );

                if (templead) {
                    setSelectedLead(
                        templead
                    );

                    setModalMode(
                        "edit"
                    );

                    setModalOpen(
                        true
                    );
                }
            } catch (error) {
                console.error(
                    "Error opening lead:",
                    error
                );

                showMessage(
                    "Exception thrown.",
                    MESSAGE_TYPES.ERROR
                );
            }
        };

    /* =========================================================
       COLUMN STYLE
    ========================================================= */

    let columnStyle;

    if (!expanded) {
        columnStyle =
            COLLAPSED_COLUMNS;
    } else if (isHoliday) {
        columnStyle =
            EXPANDED_HOLIDAY_COLUMNS;
    } else {
        columnStyle =
            EXPANDED_COLUMNS;
    }

    /* =========================================================
       INLINE ACTIONS
    ========================================================= */

    const handleNote = (lead) => {
        const leadId =
            getLeadId(lead);

        setOpenNoteId(
            (current) =>
                current === leadId
                    ? null
                    : leadId
        );

        setOpenRescheduleId(null);
    };

    const handleReschedule =
        (lead) => {
            const leadId =
                getLeadId(lead);

            setOpenRescheduleId(
                (current) =>
                    current === leadId
                        ? null
                        : leadId
            );

            setOpenNoteId(null);
        };

    const handleCancelInline =
        () => {
            setOpenNoteId(null);
            setOpenRescheduleId(
                null
            );

            if (onCancelInline) {
                onCancelInline();
            }
        };

    /* =========================================================
       SAVE NOTE
    ========================================================= */

    const handleSaveNote =
        async (
            lead,
            noteText
        ) => {
            if (
                !noteText?.trim()
            ) {
                showMessage(
                    "Please enter a note.",
                    MESSAGE_TYPES.WARNING
                );
                return;
            }

            try {
                const response =
                    await axios.post(
                        UpdateNotesAPI,
                        {
                            lead,
                            notes: noteText,
                            currentUser:
                                sessionUser
                                    .user
                                    .userId
                        },
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${sessionUser.token}`,
                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );

                console.log(
                    "Notes API response:",
                    response.data
                );

                showMessage(
                    "Notes updated successfully.",
                    MESSAGE_TYPES.SUCCESS
                );

                if (
                    lead?.category
                ) {
                    lead.category.notes =
                        noteText;
                }

                if (
                    Array.isArray(
                        lead?.histories
                    ) &&
                    lead.histories
                        .length > 0
                ) {
                    lead.histories[
                        0
                    ].notes =
                        noteText;
                }

                setOpenNoteId(null);
            } catch (error) {
                console.error(
                    "Error saving note:",
                    error
                );

                showMessage(
                    "Error saving note.",
                    MESSAGE_TYPES.ERROR
                );
            }
        };

    /* =========================================================
       SAVE RESCHEDULE
    ========================================================= */

    const handleSaveReschedule =
        async (
            lead,
            newDate
        ) => {
            try {
                const leadId =
                    getLeadId(lead);

                if (!leadId) {
                    console.error(
                        "Lead ID not found",
                        lead
                    );
                    return false;
                }

                if (!newDate) {
                    console.error(
                        "Follow-up date is required"
                    );
                    return false;
                }

                const response =
                    await axios.post(
                        UpdateFollowupDateAPI,
                        {
                            Lead: lead,
                            FollowUPDate:
                                newDate,
                            currentUser:
                                sessionUser
                                    .user
                                    .userId
                        },
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${sessionUser.token}`,
                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );

                console.log(
                    "FollowUpDate API response:",
                    response.data
                );

                if (
                    response.data ===
                    true
                ) {
                    lead.followUpDate =
                        newDate;

                    if (
                        onRescheduleSuccess
                    ) {
                        onRescheduleSuccess(
                            lead,
                            newDate
                        );
                    }

                    showMessage(
                        "Follow-up date updated successfully.",
                        MESSAGE_TYPES.SUCCESS
                    );

                    setOpenRescheduleId(
                        null
                    );

                    return true;
                }

                return false;
            } catch (error) {
                console.error(
                    "Error updating FollowUpDate:",
                    error
                );

                const message =
                    error.response
                        ?.data ||
                    error.response
                        ?.statusText ||
                    error.message ||
                    "Unknown error";

                showMessage(
                    "Error updating Follow-up date: " +
                        JSON.stringify(
                            message
                        ),
                    MESSAGE_TYPES.ERROR
                );

                return false;
            }
        };

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <div>
            {/* BUCKET CARD */}

            <div
                className={`
                    flex
                    flex-col
                    min-w-0
                    w-full
                    h-full
                    min-h-0
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    ${
                        expanded
                            ? "col-span-full row-span-full"
                            : ""
                    }
                `}
            >
                {/* BUCKET HEADER */}

                <div
                    className={`
                        flex
                        h-10
                        flex-shrink-0
                        items-center
                        gap-2
                        rounded-t-xl
                        px-3
                        text-xs
                        font-bold
                        uppercase
                        tracking-wide
                        ${meta.header}
                    `}
                >
                    <span
                        className={`
                            h-2.5
                            w-2.5
                            flex-shrink-0
                            rounded-full
                            ${meta.dot}
                        `}
                    />

                    <span>
                        {meta.label}
                    </span>

                    <span
                        className="
                            rounded-full
                            bg-white
                            px-2
                            py-0.5
                            text-[11px]
                            font-semibold
                            text-slate-500
                        "
                    >
                        {isSearching
                            ? `${sortedLeads.length} / ${safeLeads.length}`
                            : safeLeads.length}
                    </span>

                    {isSearching && (
                        <button
                            type="button"
                            onClick={
                                clearAllFilters
                            }
                            className="
                                flex
                                items-center
                                gap-1
                                rounded-md
                                bg-white
                                px-2
                                py-1
                                text-[9px]
                                font-semibold
                                normal-case
                                tracking-normal
                                text-slate-500
                                hover:text-slate-700
                            "
                            title="Clear all filters"
                        >
                            <X className="h-3 w-3" />
                            Clear filters
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={
                            onToggleExpand
                        }
                        className="
                            ml-auto
                            flex
                            h-6
                            w-6
                            items-center
                            justify-center
                            rounded-md
                            bg-white
                            text-slate-400
                            transition
                            hover:text-slate-700
                        "
                        title={
                            expanded
                                ? "Collapse"
                                : "Expand"
                        }
                    >
                        {expanded ? (
                            <Minimize2 className="h-3.5 w-3.5" />
                        ) : (
                            <Maximize2 className="h-3.5 w-3.5" />
                        )}
                    </button>
                </div>

                {/* COLUMN HEADER */}

                <div
                    className="
                        min-w-0
                        flex-shrink-0
                        overflow-visible
                        border-b
                        border-slate-200
                        bg-slate-50
                    "
                >
                    <div
                        className="
                            grid
                            h-9
                            min-w-0
                            w-full
                            items-center
                        "
                        style={
                            columnStyle
                        }
                    >
                        {/* # */}

                        <div className="min-w-0 px-2">
                            <SimpleHeader text="#" center />
                        </div>

                        {/* LEAD ID */}

                        <div className="min-w-0 px-2">
                            <SortFilterHeader
                                text="Lead ID"
                                sortKey="leadId"
                                filterKey="leadId"
                                sortConfig={
                                    sortConfig
                                }
                                onSort={
                                    handleSort
                                }
                                filterValue=""
                                onFilterChange={() => {}}
                                onFilterClear={() => {}}
                                showFilter={false}
                            />
                        </div>

                        {/* CUSTOMER */}

                        <div className="min-w-0 px-2">
                            <div className="flex min-w-0 items-center justify-center">
                                <div className="relative w-full">
                                    <Search className="pointer-events-none absolute left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-300" />
                                    <input
                                        type="text"
                                        value={filters.name}
                                        onChange={(e) =>
                                            updateFilter("name", e.target.value)
                                        }
                                        placeholder="Customer"
                                        className="h-6 w-full rounded border border-slate-200 bg-white pl-5 pr-1 text-[10px] text-slate-600 outline-none placeholder:text-slate-300 focus:border-slate-300 focus:ring-1 focus:ring-slate-100"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* COLLAPSED */}

                        {!expanded && (
                            <>
                                {/* FOLLOW-UP */}

                                <div className="min-w-0 px-2">
                                    <SortFilterHeader
                                        text="Follow-up"
                                        sortKey="followUp"
                                        filterKey="followUp"
                                        sortConfig={
                                            sortConfig
                                        }
                                        onSort={
                                            handleSort
                                        }
                                        filterValue={
                                            filters.followUp
                                        }
                                        onFilterChange={(
                                            value
                                        ) =>
                                            updateFilter(
                                                "followUp",
                                                value
                                            )
                                        }
                                        onFilterClear={() =>
                                            clearFilter(
                                                "followUp"
                                            )
                                        }
                                        filterType="text"
                                    />
                                </div>

                                {/* ENQUIRY */}

                                <div className="min-w-0 px-2">
                                    <SortFilterHeader
                                        text="Enquiry"
                                        sortKey="enquiry"
                                        filterKey="enquiry"
                                        sortConfig={
                                            sortConfig
                                        }
                                        onSort={
                                            handleSort
                                        }
                                        filterValue={
                                            filters.enquiry
                                        }
                                        onFilterChange={(
                                            value
                                        ) =>
                                            updateFilter(
                                                "enquiry",
                                                value
                                            )
                                        }
                                        onFilterClear={() =>
                                            clearFilter(
                                                "enquiry"
                                            )
                                        }
                                        filterType="text"
                                    />
                                </div>

                                {/* ACTIONS */}

                                <div className="min-w-0 px-1">
                                    <SimpleHeader
                                        text="Actions"
                                        center
                                        wrap
                                    />
                                </div>
                            </>
                        )}

                        {/* EXPANDED */}

                        {expanded && (
                            <>
                                {/* HOLIDAY DESTINATION */}

                                {isHoliday && (
                                    <>
                                        <div className="min-w-0 px-2">
                                            <div className="flex min-w-0 flex-col justify-center">
                                                <div className="relative w-full">
                                                    <Search className="pointer-events-none absolute left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-300" />
                                                    <input
                                                        type="text"
                                                        value={filters.destination}
                                                        onChange={(e) =>
                                                            updateFilter("destination", e.target.value)
                                                        }
                                                        placeholder="Destination"
                                                        className="h-6 w-full rounded border border-slate-200 bg-white pl-5 pr-1 text-[10px] text-slate-600 outline-none placeholder:text-slate-300 focus:border-slate-300 focus:ring-1 focus:ring-slate-100"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* TRAVEL DATE */}

                                        <div className="min-w-0 px-2">
                                            <SortFilterHeader
                                                text="Travel Date"
                                                sortKey="travelDate"
                                                filterKey="travelDate"
                                                sortConfig={
                                                    sortConfig
                                                }
                                                onSort={
                                                    handleSort
                                                }
                                                filterValue={
                                                    filters.travelDate
                                                }
                                                onFilterChange={(
                                                    value
                                                ) =>
                                                    updateFilter(
                                                        "travelDate",
                                                        value
                                                    )
                                                }
                                                onFilterClear={() =>
                                                    clearFilter(
                                                        "travelDate"
                                                    )
                                                }
                                                filterType="text"
                                                wrap
                                            />
                                        </div>
                                    </>
                                )}

                                {/* CATEGORY */}

                                <div className="min-w-0 px-2">
                                    <SortFilterHeader
                                        text="Category"
                                        sortKey="category"
                                        filterKey="category"
                                        sortConfig={
                                            sortConfig
                                        }
                                        onSort={handleSort}
                                        filterValue={
                                            filters.category
                                        }
                                        onFilterChange={(
                                            value
                                        ) =>
                                            updateFilter(
                                                "category",
                                                value
                                            )
                                        }
                                        onFilterClear={() =>
                                            clearFilter(
                                                "category"
                                            )
                                        }
                                        filterType="select"
                                        filterOptions={
                                            categoryOptions
                                        }
                                        center
                                        wrap
                                    />
                                </div>

                                {/* TYPE / TRIP */}

                                {isHoliday && (
                                    <div className="min-w-0 px-2">
                                        <SortFilterHeader
                                            text="Type / Trip"
                                            sortKey="typeTrip"
                                            filterKey="typeTrip"
                                            sortConfig={
                                                sortConfig
                                            }
                                            onSort={handleSort}
                                            filterValue={
                                                filters.typeTrip
                                            }
                                            onFilterChange={(
                                                value
                                            ) =>
                                                updateFilter(
                                                    "typeTrip",
                                                    value
                                                )
                                            }
                                            onFilterClear={() =>
                                                clearFilter(
                                                    "typeTrip"
                                                )
                                            }
                                            filterType="select"
                                            filterOptions={
                                                typeTripOptions
                                            }
                                            center
                                            wrap
                                        />
                                    </div>
                                )}

                                {/* FOLLOW-UP */}

                                <div className="min-w-0 px-2">
                                    <SortFilterHeader
                                        text="Follow-up"
                                        sortKey="followUp"
                                        filterKey="followUp"
                                        sortConfig={
                                            sortConfig
                                        }
                                        onSort={
                                            handleSort
                                        }
                                        filterValue={
                                            filters.followUp
                                        }
                                        onFilterChange={(
                                            value
                                        ) =>
                                            updateFilter(
                                                "followUp",
                                                value
                                            )
                                        }
                                        onFilterClear={() =>
                                            clearFilter(
                                                "followUp"
                                            )
                                        }
                                    />
                                </div>

                                {/* ENQUIRY */}

                                <div className="min-w-0 px-2">
                                    <SortFilterHeader
                                        text="Enquiry"
                                        sortKey="enquiry"
                                        filterKey="enquiry"
                                        sortConfig={
                                            sortConfig
                                        }
                                        onSort={
                                            handleSort
                                        }
                                        filterValue={
                                            filters.enquiry
                                        }
                                        onFilterChange={(
                                            value
                                        ) =>
                                            updateFilter(
                                                "enquiry",
                                                value
                                            )
                                        }
                                        onFilterClear={() =>
                                            clearFilter(
                                                "enquiry"
                                            )
                                        }
                                    />
                                </div>

                                {/* ASSIGNEE */}

                                <div className="min-w-0 px-2">
                                    <SortFilterHeader
                                        text="Assignee"
                                        sortKey="assignee"
                                        filterKey="assignee"
                                        sortConfig={
                                            sortConfig
                                        }
                                        onSort={handleSort}
                                        filterValue={
                                            filters.assignee
                                        }
                                        onFilterChange={(
                                            value
                                        ) =>
                                            updateFilter(
                                                "assignee",
                                                value
                                            )
                                        }
                                        onFilterClear={() =>
                                            clearFilter(
                                                "assignee"
                                            )
                                        }
                                        filterType="select"
                                        filterOptions={
                                            assigneeOptions
                                        }
                                    />
                                </div>

                                {/* CONTACT */}

                                <div className="min-w-0 px-2">
                                    <SortFilterHeader
                                        text="Contact"
                                        sortKey="contact"
                                        filterKey="contact"
                                        sortConfig={
                                            sortConfig
                                        }
                                        onSort={handleSort}
                                        filterValue={
                                            filters.contact
                                        }
                                        onFilterChange={(
                                            value
                                        ) =>
                                            updateFilter(
                                                "contact",
                                                value
                                            )
                                        }
                                        onFilterClear={() =>
                                            clearFilter(
                                                "contact"
                                            )
                                        }
                                    />
                                </div>

                                {/* STATUS */}

                                <div className="min-w-0 px-2">
                                    <SortFilterHeader
                                        text="Status"
                                        sortKey="status"
                                        filterKey="status"
                                        sortConfig={
                                            sortConfig
                                        }
                                        onSort={handleSort}
                                        filterValue={
                                            filters.status
                                        }
                                        onFilterChange={(
                                            value
                                        ) =>
                                            updateFilter(
                                                "status",
                                                value
                                            )
                                        }
                                        onFilterClear={() =>
                                            clearFilter(
                                                "status"
                                            )
                                        }
                                        filterType="select"
                                        filterOptions={
                                            statusOptions
                                        }
                                    />
                                </div>

                                {/* ACTIONS */}

                                <div className="min-w-0 px-1">
                                    <SimpleHeader
                                        text="Actions"
                                        center
                                        wrap
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* ROWS */}

                <div
                    className="
                        min-w-0
                        w-full
                        flex-1
                        min-h-0
                        overflow-y-auto
                        overflow-x-hidden
                    "
                >
                    {sortedLeads.length ===
                    0 ? (
                        <div
                            className="
                                flex
                                h-full
                                min-h-[240px]
                                items-center
                                justify-center
                                text-sm
                                text-slate-400
                            "
                        >
                            {isSearching
                                ? "No leads match your filters"
                                : "No follow-ups"}
                        </div>
                    ) : (
                        sortedLeads.map(
                            (
                                lead,
                                index
                            ) => {
                                const leadId =
                                    getLeadId(
                                        lead
                                    );

                                return (
                                    <LeadRow
                                        key={`${leadId}-${index}`}
                                        lead={lead}
                                        index={
                                            index
                                        }
                                        expanded={
                                            expanded
                                        }
                                        isHoliday={
                                            isHoliday
                                        }
                                        columnStyle={
                                            columnStyle
                                        }

                                        onCall={
                                            onCall
                                        }

                                        onNote={
                                            handleNote
                                        }

                                        onReschedule={
                                            handleReschedule
                                        }

                                        onOpen={
                                            handleOpenLead
                                        }

                                        noteOpen={
                                            openNoteId ===
                                            leadId
                                        }

                                        rescheduleOpen={
                                            openRescheduleId ===
                                            leadId
                                        }

                                        onSaveNote={
                                            handleSaveNote
                                        }

                                        onSaveReschedule={
                                            handleSaveReschedule
                                        }

                                        onCancelInline={
                                            handleCancelInline
                                        }
                                    />
                                );
                            }
                        )
                    )}
                </div>
            </div>

            {/* LEAD MODAL */}

            <UpdateLeadsModal
                parent="Lead Table for existing Phone no"
                isOpen={modalOpen}
                onClose={() =>
                    setModalOpen(
                        false
                    )
                }
                lead={selectedLead}
                mode={modalMode}
                viewAllLeads={false}
            />
        </div>
    );
};

export default BucketCard;