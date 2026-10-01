
// BucketCard.jsx

import React, { useState } from "react";
import axios from "axios";
import { Maximize2, Minimize2, Search, X } from "lucide-react";

import LeadRow from "./LeadRow";
import UpdateLeadsModal from "../../UpdateLeadsModal";
import { getEmptyLeadObj } from "../../Model/LeadModel";
import config from "../../config";
import { useGetSessionUser } from "../../SessionContext";
import { MESSAGE_TYPES } from "../../Constants";
import { useMessageBox } from "../../Notification";

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

/*
   COLLAPSED
   Sr No | Lead ID | Customer | Follow-up | Enquiry | Actions
*/
const COLLAPSED_COLUMNS = {
    gridTemplateColumns:
        "4% 6% 32% 20% 18% 20%"
};

/*
   EXPANDED - NON HOLIDAY
   Sr No | Lead ID | Customer | Category | Follow-up |
   Enquiry | Assignee | Contact | Status | Actions
*/
const EXPANDED_COLUMNS = {
    gridTemplateColumns:
        "2% 6% 15% 9% 11% 9% 11% 11% 10% 16%"
};

/*
   EXPANDED - HOLIDAY
   Sr No | Lead ID | Customer | Destination | Travel Date |
   Category | Type / Trip | Follow-up | Enquiry | Assignee |
   Contact | Status | Actions
*/
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
            if (v === null || v === undefined) return "";

            if (typeof v === "string" || typeof v === "number") {
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

    const { category, histories, ...rest } = lead || {};

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

const SortableHeader = ({
    text,
    sortKey,
    sortConfig,
    onSort,
    center = false,
    wrap = false
}) => {
    const isActive = sortConfig.key === sortKey;

    return (
        <button
            type="button"
            onClick={() => onSort(sortKey)}
            className={`
                w-full
                h-full
                min-w-0
                flex
                items-center
                gap-1
                text-[10px]
                font-bold
                uppercase
                tracking-wide
                text-slate-400
                hover:text-slate-600
                ${center ? "justify-center text-center" : ""}
                ${wrap
                    ? "whitespace-normal break-words leading-3"
                    : "truncate"
                }
            `}
            title={`Sort by ${text}`}
        >
            <span className="min-w-0">
                {text}
            </span>

            <span
                className={`
                    flex
                    flex-col
                    flex-shrink-0
                    justify-center
                    leading-[5px]
                    text-[7px]
                    ${isActive
                        ? "text-slate-600"
                        : "text-slate-300"
                    }
                `}
            >
                <span
                    className={
                        isActive &&
                        sortConfig.direction === "asc"
                            ? "text-slate-600"
                            : "text-slate-300"
                    }
                >
                    ▲
                </span>

                <span
                    className={
                        isActive &&
                        sortConfig.direction === "desc"
                            ? "text-slate-600"
                            : "text-slate-300"
                    }
                >
                    ▼
                </span>
            </span>
        </button>
    );
};

/* =========================================================
   COLUMN SEARCH
========================================================= */

const ColumnSearchInput = ({
    value,
    onChange,
    placeholder
}) => (
    <div className="relative h-full w-full min-w-0">
        <Search
            className="
                pointer-events-none
                absolute left-1 top-1/2
                h-3 w-3
                -translate-y-1/2
                text-slate-400
            "
        />

        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            title={placeholder}
            className="
                h-6
                w-full
                min-w-0
                rounded
                border border-slate-200
                bg-white
                pl-5 pr-5
                text-[10px]
                normal-case
                font-normal
                tracking-normal
                text-slate-700
                placeholder:text-slate-400
                focus:outline-none
                focus:ring-1
                focus:ring-slate-300
            "
        />

        {value && (
            <button
                type="button"
                onClick={() => onChange("")}
                className="
                    absolute right-1 top-1/2
                    flex h-3.5 w-3.5
                    -translate-y-1/2
                    items-center justify-center
                    rounded-full
                    text-slate-400
                    hover:text-slate-600
                "
                title="Clear"
            >
                <X className="h-2.5 w-2.5" />
            </button>
        )}
    </div>
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

    const { user: sessionUser } = useGetSessionUser();
    const { showMessage } = useMessageBox();

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc"
    });

    /* =========================================================
       SEARCH STATE
    ========================================================= */

    const [searchName, setSearchName] = useState("");
    const [searchDestination, setSearchDestination] = useState("");

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

    const getSortValue = (lead, key) => {
        switch (key) {
            case "leadId":
                return Number(
                    lead?.LeadID ??
                    lead?.leadID ??
                    0
                );

            case "followUp":
                return (
                    lead?.followUpDate ??
                    lead?.FollowUpDate ??
                    ""
                );

            case "enquiry":
                return (
                    lead?.EnquiryDate ??
                    lead?.enquiryDate ??
                    lead?.createdAt ??
                    lead?.CreatedAt ??
                    ""
                );

            case "travelDate":
                return (
                    lead?.category?.preferredTravelDate ??
                    lead?.category?.PreferredTravelDate ??
                    ""
                );

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
        ).toUpperCase() === "HOLIDAY";

    /* =========================================================
       SEARCH
    ========================================================= */

    const normalizedNameQuery =
        searchName.trim().toLowerCase();

    const normalizedDestinationQuery = isHoliday
        ? searchDestination.trim().toLowerCase()
        : "";

    const searchedLeads = safeLeads.filter((lead) => {
        const nameMatch =
            !normalizedNameQuery ||
            getLeadNameText(lead)
                .toLowerCase()
                .includes(normalizedNameQuery);

        if (!nameMatch) {
            return false;
        }

        const destinationMatch =
            !normalizedDestinationQuery ||
            getLeadDestinationText(lead)
                .toLowerCase()
                .includes(normalizedDestinationQuery);

        return destinationMatch;
    });

    const isSearching =
        normalizedNameQuery.length > 0 ||
        normalizedDestinationQuery.length > 0;

    const sortedLeads = [...searchedLeads].sort((a, b) => {
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

        if (!valueA && !valueB) return 0;
        if (!valueA) return 1;
        if (!valueB) return -1;

        let comparison = 0;

        if (sortConfig.key === "leadId") {
            comparison = valueA - valueB;
        } else {
            const dateA =
                new Date(valueA).getTime();

            const dateB =
                new Date(valueB).getTime();

            comparison = dateA - dateB;
        }

        return sortConfig.direction === "asc"
            ? comparison
            : -comparison;
    });

    /* =========================================================
       MODAL STATE
    ========================================================= */

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("edit");

    const [openNoteId, setOpenNoteId] = useState(null);
    const [openRescheduleId, setOpenRescheduleId] =
        useState(null);

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
        useState(getEmptyLeadObj());

    /* =========================================================
       FETCH LEAD DETAILS
    ========================================================= */

    async function fetchLeadDetails(lead) {
        try {
            const res = await axios.post(
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

            if (res && res.data) {
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
                JSON.stringify(message),
                MESSAGE_TYPES.ERROR
            );

            return null;
        }
    }

    /* =========================================================
       OPEN LEAD
    ========================================================= */

    const handleOpenLead = async (lead) => {
        try {
            const leadId =
                lead?.LeadID ??
                lead?.leadID;

            if (!leadId) {
                console.error(
                    "Lead ID not found",
                    lead
                );
                return;
            }

            const templead =
                await fetchLeadDetails(lead);

            if (templead) {
                setSelectedLead(templead);
                setModalMode("edit");
                setModalOpen(true);
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
        columnStyle = COLLAPSED_COLUMNS;
    } else if (isHoliday) {
        columnStyle = EXPANDED_HOLIDAY_COLUMNS;
    } else {
        columnStyle = EXPANDED_COLUMNS;
    }

    /* =========================================================
       INLINE ACTIONS
    ========================================================= */

    const handleNote = (lead) => {
        const leadId =
            lead?.LeadID ??
            lead?.leadID;

        setOpenNoteId((current) =>
            current === leadId
                ? null
                : leadId
        );

        setOpenRescheduleId(null);
    };

    const handleReschedule = (lead) => {
        const leadId =
            lead?.LeadID ??
            lead?.leadID;

        setOpenRescheduleId((current) =>
            current === leadId
                ? null
                : leadId
        );

        setOpenNoteId(null);
    };

    const handleCancelInline = () => {
        setOpenNoteId(null);
        setOpenRescheduleId(null);

        if (onCancelInline) {
            onCancelInline();
        }
    };

    /* =========================================================
       SAVE NOTE
    ========================================================= */

    const handleSaveNote = async (
        lead,
        noteText
    ) => {
        if (!noteText?.trim()) {
            showMessage(
                "Please enter a note.",
                MESSAGE_TYPES.WARNING
            );
            return;
        }

        try {
            const response = await axios.post(
                UpdateNotesAPI,
                {
                    lead,
                    notes: noteText,
                    currentUser:
                        sessionUser.user.userId
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

            if (lead?.category) {
                lead.category.notes = noteText;
            }

            if (
                Array.isArray(lead?.histories) &&
                lead.histories.length > 0
            ) {
                lead.histories[0].notes =
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

    const handleSaveReschedule = async (
        lead,
        newDate
    ) => {
        try {
            const leadId =
                lead?.LeadID ??
                lead?.leadID;

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

            const response = await axios.post(
                UpdateFollowupDateAPI,
                {
                    Lead: lead,
                    FollowUPDate: newDate,
                    currentUser:
                        sessionUser.user.userId
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

            if (response.data === true) {
                lead.followUpDate = newDate;

                if (onRescheduleSuccess) {
                    onRescheduleSuccess(
                        lead,
                        newDate
                    );
                }

                showMessage(
                    "Follow-up date updated successfully.",
                    MESSAGE_TYPES.SUCCESS
                );

                setOpenRescheduleId(null);

                return true;
            }

            return false;
        } catch (error) {
            console.error(
                "Error updating FollowUpDate:",
                error
            );

            const message =
                error.response?.data ||
                error.response?.statusText ||
                error.message ||
                "Unknown error";

            showMessage(
                "Error updating Follow-up date: " +
                JSON.stringify(message),
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
                    flex flex-col
                    min-w-0
                    w-full
                    h-full
                    min-h-0
                    overflow-hidden
                    rounded-xl
                    border border-slate-200
                    bg-white
                    shadow-sm
                    ${expanded
                        ? "col-span-full row-span-full"
                        : ""
                    }
                `}
            >
                {/* BUCKET HEADER */}

                <div
                    className={`
                        flex h-10 flex-shrink-0
                        items-center gap-2
                        rounded-t-xl px-3
                        text-xs font-bold uppercase
                        tracking-wide
                        ${meta.header}
                    `}
                >
                    <span
                        className={`
                            h-2.5 w-2.5
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
                            px-2 py-0.5
                            text-[11px]
                            font-semibold
                            text-slate-500
                        "
                    >
                        {isSearching
                            ? `${sortedLeads.length} / ${safeLeads.length}`
                            : safeLeads.length}
                    </span>

                    <button
                        type="button"
                        onClick={onToggleExpand}
                        className="
                            ml-auto
                            flex h-6 w-6
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
                        overflow-hidden
                        border-b
                        border-slate-200
                        bg-slate-50
                    "
                >
                    <div
                        className="
                            grid
                            h-8
                            min-w-0
                            w-full
                            items-center
                        "
                        style={columnStyle}
                    >
                        {/* # */}

                        <div className="min-w-0 px-2" />

                        {/* LEAD ID */}

                        <div className="min-w-0 px-2">
                            <SortableHeader
                                text="Lead ID"
                                sortKey="leadId"
                                sortConfig={sortConfig}
                                onSort={handleSort}
                            />
                        </div>

                        {/* NAME */}

                        <div className="min-w-0 px-2">
                            <ColumnSearchInput
                                value={searchName}
                                onChange={setSearchName}
                                placeholder="Search name..."
                            />
                        </div>

                        {/* COLLAPSED COLUMNS */}

                        {!expanded && (
                            <>
                                <div className="min-w-0 px-2">
                                    <SortableHeader
                                        text="Follow-up"
                                        sortKey="followUp"
                                        sortConfig={sortConfig}
                                        onSort={handleSort}
                                    />
                                </div>

                                <div className="min-w-0 px-2">
                                    <SortableHeader
                                        text="Enquiry"
                                        sortKey="enquiry"
                                        sortConfig={sortConfig}
                                        onSort={handleSort}
                                    />
                                </div>

                                {/* Actions column */}

                                <div className="min-w-0 px-1">
                                    <HeaderText
                                        text="Actions"
                                        center
                                        wrap
                                    />
                                </div>
                            </>
                        )}

                        {/* EXPANDED COLUMNS */}

                        {expanded && (
                            <>
                                {/* HOLIDAY: DESTINATION */}

                                {isHoliday && (
                                    <>
                                        <div className="min-w-0 px-2">
                                            <ColumnSearchInput
                                                value={searchDestination}
                                                onChange={
                                                    setSearchDestination
                                                }
                                                placeholder="Search destination..."
                                            />
                                        </div>

                                        {/* TRAVEL DATE */}

                                        <div className="min-w-0 px-2">
                                            <SortableHeader
                                                text="Travel Date"
                                                sortKey="travelDate"
                                                sortConfig={sortConfig}
                                                onSort={handleSort}
                                                wrap
                                            />
                                        </div>
                                    </>
                                )}

                                {/* CATEGORY */}

                                <div className="min-w-0 px-2">
                                    <HeaderText
                                        text="Category"
                                        center
                                        wrap
                                    />
                                </div>

                                {/* TYPE / TRIP */}

                                {isHoliday && (
                                    <div className="min-w-0 px-2">
                                        <HeaderText
                                            text="Type / Trip"
                                            center
                                            wrap
                                        />
                                    </div>
                                )}

                                {/* FOLLOW-UP */}

                                <div className="min-w-0 px-2">
                                    <SortableHeader
                                        text="Follow-up"
                                        sortKey="followUp"
                                        sortConfig={sortConfig}
                                        onSort={handleSort}
                                    />
                                </div>

                                {/* ENQUIRY */}

                                <div className="min-w-0 px-2">
                                    <SortableHeader
                                        text="Enquiry"
                                        sortKey="enquiry"
                                        sortConfig={sortConfig}
                                        onSort={handleSort}
                                    />
                                </div>

                                {/* ASSIGNEE */}

                                <div className="min-w-0 px-2">
                                    <HeaderText text="Assignee" />
                                </div>

                                {/* CONTACT */}

                                <div className="min-w-0 px-2">
                                    <HeaderText text="Contact" />
                                </div>

                                {/* STATUS */}

                                <div className="min-w-0 px-2">
                                    <HeaderText text="Status" />
                                </div>

                                {/* ACTIONS */}

                                <div className="min-w-0 px-1">
                                    <HeaderText
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
                    {sortedLeads.length === 0 ? (
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
                                ? "No leads match your search"
                                : "No follow-ups"}
                        </div>
                    ) : (
                        sortedLeads.map(
                            (lead, index) => {
                                const leadId =
                                    lead?.LeadID ??
                                    lead?.leadID;

                                return (
                                    <LeadRow
                                        key={`${leadId}-${index}`}
                                        lead={lead}
                                        index={index}
                                        expanded={expanded}
                                        isHoliday={isHoliday}
                                        columnStyle={columnStyle}

                                        onCall={onCall}

                                        onNote={handleNote}

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
                    setModalOpen(false)
                }
                lead={selectedLead}
                mode={modalMode}
                viewAllLeads={false}
            />
        </div>
    );
};

export default BucketCard;
