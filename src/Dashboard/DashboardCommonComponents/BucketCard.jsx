// BucketCard.jsx
import React, { useState } from "react";
import axios from "axios";
import { Maximize2, Minimize2 } from "lucide-react";
import LeadRow from "./LeadRow";
import UpdateLeadsModal from "../../UpdateLeadsModal";
import { getEmptyLeadObj } from "../../Model/LeadModel";
import config from "../../config";
import { useGetSessionUser } from "../../SessionContext"
import { MESSAGE_TYPES } from "../../Constants"
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

const COLLAPSED_COLUMNS = {
    gridTemplateColumns: "4% 6% 32% 20% 18% 20%"
};

const EXPANDED_COLUMNS = {
    gridTemplateColumns:
        "2% 6% 16% 14% 8% 8% 8% 9% 9% 10% 5% 9%"
};

const EXPANDED_HOLIDAY_COLUMNS = {
    gridTemplateColumns:
        "2% 5% 15% 8% 8% 8% 7% 7% 8% 8% 11% 5% 10%"
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

            {/* Sort indicator */}
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
    console.log(
        "🔥 BUCKETCARD CALLBACK:",
        onRescheduleSuccess
    );
    const meta = BUCKET_META[bucket];

    const safeLeads = Array.isArray(leads)
        ? leads
        : [];
    const { user: sessionUser } = useGetSessionUser();
    const { showMessage } = useMessageBox();
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });


    const handleSort = (key) => {
        setSortConfig((current) => ({
            key,
            direction:
                current.key === key && current.direction === "asc"
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

    const sortedLeads = [...safeLeads].sort((a, b) => {
        if (!sortConfig.key) {
            return 0;
        }

        const valueA = getSortValue(a, sortConfig.key);
        const valueB = getSortValue(b, sortConfig.key);

        if (!valueA && !valueB) return 0;
        if (!valueA) return 1;
        if (!valueB) return -1;

        let comparison = 0;

        // Lead ID
        if (sortConfig.key === "leadId") {
            comparison = valueA - valueB;
        } else {
            // Dates
            const dateA = new Date(valueA).getTime();
            const dateB = new Date(valueB).getTime();

            comparison = dateA - dateB;
        }

        return sortConfig.direction === "asc"
            ? comparison
            : -comparison;
    });
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
       MODAL STATE
    ========================================================= */

    const [modalOpen, setModalOpen] = useState(false);

    const [modalMode, setModalMode] = useState("edit");

    const [openNoteId, setOpenNoteId] = useState(null);
    const [openRescheduleId, setOpenRescheduleId] = useState(null);

    const GetLeadsForEditAPI = config.apiUrl + "/TempLead/GetLeadForEdit";
    const UpdateFollowupDateAPI = config.apiUrl + "/TempLead/UpdateFollowUpDate";
    const UpdateNotesAPI = config.apiUrl + "/TempLead/UpdateNotes"


    const [selectedLead, setSelectedLead] = useState(
        getEmptyLeadObj()
    );


    /* =========================================================
       OPEN LEAD
    ========================================================= */

    async function fetchLeadDetails(lead) {
        let res = null;
        try {
            debugger;
            console.log("GetLeadsForEditAPI:", GetLeadsForEditAPI);
            console.log("LEad data to be passed to API", lead);
            res = await axios.post(GetLeadsForEditAPI, lead, {
                headers: {
                    Authorization: `Bearer ${sessionUser.token}`,// ✅ JWT token
                    "Content-Type": "application/json"

                },
                // params: {
                //   lead: lead,
                // }
            });
            debugger;
            if (res && res.data) {
                console.log("Leads details fetched:" + res.data);
                return res.data;
            } else {
                showMessage("Empty response from server.", MESSAGE_TYPES.WARNING);
                return null;
            }

        } catch (error) {
            debugger;
            console.log("Error fetching Lead for edit...", error);

            const message =
                error.response?.data ||
                error.response?.statusText ||
                error.message ||
                "Unknown error";

            showMessage("Error fetching Lead for edit." + JSON.stringify(message), MESSAGE_TYPES.ERROR);
            return null;

        }

    }

    const handleOpenLead = async (lead) => {

        try {

            const leadId =
                lead?.LeadID ??
                lead?.leadID;

            console.log(
                "Lead Received for modal:",
                lead
            );

            if (!leadId) {
                console.error(
                    "Lead ID not found",
                    lead
                );
                return;
            }


            /* ---------------------------------------------
               For now use the lead already available.
               We can add API call here later.
            --------------------------------------------- */


            try {

                let templead = await fetchLeadDetails(lead);
                setSelectedLead(templead);
                setModalMode("edit");
                setModalOpen(true);
            } catch {
                showMessage("Exception thrown.", MESSAGE_TYPES.ERROR);
            }

            //  setSelectedLead(lead);



            //   setModalOpen(true);


            /* ---------------------------------------------
               API can be called here later if required:

            const response = await axios.get(
                `${apiUrl}/Lead/GetLeadById`,
                {
                    params: {
                        leadId: leadId
                    },
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setSelectedLead(response.data);

            --------------------------------------------- */

        } catch (error) {

            console.error(
                "Error opening lead:",
                error
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

    const handleNote = (lead) => {
        const leadId = lead?.LeadID ?? lead?.leadID;

        setOpenNoteId(current =>
            current === leadId ? null : leadId
        );

        // Close reschedule if opening note
        setOpenRescheduleId(null);
    };


    const handleReschedule = (lead) => {
        const leadId = lead?.LeadID ?? lead?.leadID;

        setOpenRescheduleId(current =>
            current === leadId ? null : leadId
        );

        // Close note if opening reschedule
        setOpenNoteId(null);
    };


    const handleCancelInline = () => {
        setOpenNoteId(null);
        setOpenRescheduleId(null);
    };

    const handleSaveNote = async (lead, noteText) => {
        lead.category.notes = noteText;
        console.log("SAVE NOTE CLICKED", lead, noteText);

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
                    lead: lead,
                    notes: noteText,
                    currentUser: sessionUser.user.userId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${sessionUser.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Notes API response:", response.data);

            showMessage(
                "Notes updated successfully.", MESSAGE_TYPES.SUCCESS
            );

            lead.histories[0].notes = noteText;
            setOpenNoteId(null);

        } catch (error) {
            console.error("Error saving note:", error);
        }
    };

    const handleSaveReschedule = async (lead, newDate) => {
        try {
            const leadId = lead?.LeadID ?? lead?.leadID;

            if (!leadId) {
                console.error("Lead ID not found", lead);
                return false;
            }

            if (!newDate) {
                console.error("Follow-up date is required");
                return false;
            }

            console.log("Saving FollowUpDate:", {
                leadId,
                newDate
            });

            const response = await axios.post(UpdateFollowupDateAPI,
                {
                    Lead: lead,
                    FollowUPDate: newDate,
                    currentUser: sessionUser.user.userId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${sessionUser.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("FollowUpDate API response:", response.data);

            if (response.data === true) {

                // Update the current lead object immediately
                lead.followUpDate = newDate;

                debugger;
                // Update the dashboard timeline immediately
                if (onRescheduleSuccess) {
                    onRescheduleSuccess(lead, newDate);
                }


                showMessage(
                    "Follow-up date updated successfully.",
                    MESSAGE_TYPES.SUCCESS
                );

                // Close reschedule
                setOpenRescheduleId(null);

                return true;
            }


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

    return (

        <div>

            {/* =====================================================
                BUCKET CARD
            ===================================================== */}

            <div
                className={`
                    flex flex-col
                    min-w-0
                    w-full
                    h-full
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

                {/* =====================================================
                    BUCKET HEADER
                ===================================================== */}

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
                        {safeLeads.length}
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
                            <Minimize2
                                className="h-3.5 w-3.5"
                            />
                        ) : (
                            <Maximize2
                                className="h-3.5 w-3.5"
                            />
                        )}

                    </button>

                </div>


                {/* =====================================================
                    COLUMN HEADER
                ===================================================== */}

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
                        "
                        style={columnStyle}
                    >

                        {/* DOT */}

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

                            <HeaderText
                                text="Name"
                            />

                        </div>


                        {/* =================================================
                            COLLAPSED
                        ================================================= */}

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

                            </>
                        )}


                        {/* =================================================
                            EXPANDED
                        ================================================= */}

                        {expanded && (
                            <>

                                {/* NOTES */}

                                <div className="min-w-0 px-2">

                                    <HeaderText
                                        text="Notes"
                                        wrap
                                    />

                                </div>


                                {/* =================================================
                                    HOLIDAY ONLY
                                ================================================= */}

                                {isHoliday && (
                                    <>

                                        {/* PREFERRED DESTINATION */}

                                        <div className="min-w-0 px-2">

                                            <HeaderText
                                                text="Preferred Destination"
                                                wrap
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


                                        {/* TYPE / TRIP */}

                                        <div className="min-w-0 px-2">

                                            <HeaderText
                                                text="Type / Trip"
                                                center
                                                wrap
                                            />

                                        </div>

                                    </>
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

                                    <HeaderText
                                        text="Assignee"
                                    />

                                </div>


                                {/* CONTACT */}

                                <div className="min-w-0 px-2">

                                    <HeaderText
                                        text="Contact"
                                    />

                                </div>


                                {/* STATUS */}

                                <div className="min-w-0 px-2">

                                    <HeaderText
                                        text="Status"
                                    />

                                </div>

                            </>
                        )}


                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <div className="min-w-0 px-1">

                            <HeaderText
                                text="Actions"
                                center
                                wrap
                            />

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    ROWS
                ===================================================== */}

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

                    {safeLeads.length === 0 ? (

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
                            No follow-ups
                        </div>

                    ) : (

                        sortedLeads.map(
                            (lead, index) => (

                                <LeadRow
                                    key={
                                        lead?.LeadID ??
                                        lead?.leadID ??
                                        index
                                    }

                                    lead={lead}
                                    index={index}
                                    expanded={expanded}
                                    isHoliday={isHoliday}
                                    columnStyle={columnStyle}

                                    onCall={onCall}

                                    onNote={handleNote}   // ✅ THIS IS THE FIX

                                    onReschedule={handleReschedule}

                                    onOpen={handleOpenLead}

                                    noteOpen={
                                        openNoteId ===
                                        (lead?.LeadID ?? lead?.leadID)
                                    }

                                    rescheduleOpen={
                                        openRescheduleId ===
                                        (lead?.LeadID ?? lead?.leadID)
                                    }

                                    onSaveNote={handleSaveNote}
                                    onSaveReschedule={handleSaveReschedule}
                                    onCancelInline={handleCancelInline}
                                />

                            )
                        )

                    )}

                </div>

            </div>


            {/* =====================================================
                LEAD MODAL
            ===================================================== */}

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