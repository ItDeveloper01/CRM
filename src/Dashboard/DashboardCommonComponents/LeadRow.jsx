// LeadRow.jsx
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

import {
    Phone,
    Mail,
    MessageSquarePlus,
    CalendarClock,
    Eye,
    X
} from "lucide-react";


const STATUS_STYLE = {
    Confirmed: "bg-emerald-100 text-emerald-700",
    Lost: "bg-red-100 text-red-700",
    Open: "bg-amber-100 text-amber-700",
    "Quote Sent": "bg-purple-100 text-purple-700",
    "Follow-up": "bg-blue-100 text-blue-700",
    "New Lead": "bg-slate-200 text-slate-700"
};


const formatDate = (value) => {

    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-GB", {

        day: "2-digit",
        month: "short",
        year: "numeric"

    });
};

const getLatestHistory = (lead) => {
    const histories =
        Array.isArray(lead?.Histories)
            ? lead.Histories
            : Array.isArray(lead?.histories)
                ? lead.histories
                : [];

    if (!histories.length) return null;

    /* Backend is expected to return latest first. */
    return histories[0];
};


const LeadRow = ({
    lead,
    index,

    expanded,
    isHoliday,

    columnStyle,

    onCall,
    onNote,
    onReschedule,
    onOpen,

    noteOpen,
    rescheduleOpen,

    onSaveNote,
    onSaveReschedule,
    onCancelInline
}) => {

    const [noteText, setNoteText] = useState("");
    const [showContact, setShowContact] = useState(false);
    const [contactPos, setContactPos] = useState(null);

    const phoneBtnRef = useRef(null);

    const [newDate, setNewDate] = useState(
        lead?.FollowUpDate ??
        lead?.followUpDate ??
        ""
    );
    /* =============================================================
       CUSTOMER NAME
    ============================================================= */

    const customerName = [
        lead?.title ?? lead?.Title,
        lead?.fName ?? lead?.FName,
        lead?.mName ?? lead?.MName,
        lead?.lName ?? lead?.LName
    ]
        .filter(Boolean)
        .join(" ")
        .trim();



    /* =============================================================
       LATEST HISTORY / NOTES
    ============================================================= */

    const latestHistory = getLatestHistory(lead);

    const notes =
        latestHistory?.Notes ??
        latestHistory?.notes ??
        "-";


    /* =============================================================
       STATUS
    ============================================================= */

    const status =
        lead?.StatusDescription ??
        lead?.statusDescription ??
        "-";


    /* =============================================================
       ASSIGNEE
    ============================================================= */

    const assignee =
        lead?.LeadAssignedToName ??
        lead?.leadAssignedToName ??
        lead?.LeadAssignedTo ??
        lead?.leadAssignedTo ??
        "-";


    /* =============================================================
       CONTACT
    ============================================================= */

    const mobile = lead?.mobileNo ?? lead?.MobileNo ?? "-";
    const email = lead?.emailId ?? lead?.EmailId ?? "-";


    /* =============================================================
       DESTINATION
    ============================================================= */

    const destination = lead?.destination ?? lead?.Destination ?? "-";

    const holidayCategory = lead?.category ?? lead?.Category ?? null;

    const isHolidayLead =
        isHoliday &&
        holidayCategory;
    /* Preferred Destination */
    const preferredDestination =
        holidayCategory?.requestedDestinations ??
        holidayCategory?.RequestedDestinations ??
        "-";

    /* Preferred Travel Date */
    const preferredTravelDate =
        holidayCategory?.preferredTravelDate ??
        holidayCategory?.PreferredTravelDate ??
        null;

    /* FIT / GIT */
    const leadType =
        holidayCategory?.leadType ??
        holidayCategory?.LeadType ??
        "-";

    /* Domestic / International */
    const tripType =
        holidayCategory?.tripType ??
        holidayCategory?.TripType ??
        "-";

    /* =============================================================
       DATES
    ============================================================= */

    const followUpDate = lead?.FollowUpDate ?? lead?.followUpDate;
    const enquiryDate = lead?.EnquiryDate ?? lead?.enquiryDate;


    /* =============================================================
       CONTACT TOOLTIP (rendered via portal so it can never be
       clipped by an ancestor's overflow-hidden scroll container)
    ============================================================= */

    const openContactTooltip = () => {
        if (phoneBtnRef.current) {
            const rect = phoneBtnRef.current.getBoundingClientRect();
            const TOOLTIP_WIDTH = 256; // w-64

            setContactPos({
                top: rect.bottom + 6,
                left: Math.max(
                    8,
                    Math.min(
                        rect.right - TOOLTIP_WIDTH,
                        window.innerWidth - TOOLTIP_WIDTH - 8
                    )
                )
            });
        }
        setShowContact(true);
    };

    const closeContactTooltip = () => setShowContact(false);

    useEffect(() => {
        if (rescheduleOpen) {
            const existingDate =
                lead?.FollowUpDate ??
                lead?.followUpDate ??
                "";

            setNewDate(
                existingDate
                    ? String(existingDate).split("T")[0]
                    : ""
            );
        }
    }, [rescheduleOpen, lead]);

    return (
        <>

            {/* =====================================================
                MAIN ROW
            ===================================================== */}

            <div
                className={`
                    min-w-0
                    w-full
                    overflow-hidden
                    border-b
                    border-slate-100
                    ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    hover:bg-slate-100
                `}
            >

                <div
                    className="grid min-w-0 w-full min-h-[42px] items-center"
                    style={columnStyle}
                >

                    {/* ROW NUMBER */}
                    <div className="w-8 flex-shrink-0 text-right pr-2">
                        <span className="block min-w-0 break-words text-[13px] font-semibold leading-4 text-slate-800">
                            {index + 1}.
                        </span>
                    </div>
                    <div className="min-w-0 px-2 flex items-center">
                        <span
                            className="truncate text-xs text-slate-500"
                            title={String(
                                lead?.LeadID ??
                                lead?.leadID ??
                                ""
                            )}
                        >
                            {lead?.LeadID ??
                                lead?.leadID ??
                                "-"}
                        </span>
                    </div>
                    {/* CUSTOMER — always visible */}
                    <div className="min-w-0 overflow-hidden px-2">
                        <span
                            className="block min-w-0 break-words text-[13px] font-semibold leading-4 text-slate-800 line-clamp-2"
                            title={customerName || "Unnamed Lead"}
                        >
                            {customerName || "Unnamed Lead"}
                        </span>
                    </div>
                    {/* =================================================
                        COLLAPSED: Follow-up, Enquiry only
                    ================================================= */}

                    {!expanded && (
                        <>
                            <div className="min-w-0 px-2">
                                <span className="block truncate text-[12px] font-medium text-slate-600">
                                    {formatDate(followUpDate)}
                                </span>
                            </div>

                            <div className="min-w-0 px-2">
                                <span className="block truncate text-[12px] text-slate-500">
                                    {formatDate(enquiryDate)}
                                </span>
                            </div>
                        </>
                    )}

                    {/* =================================================
                        EXPANDED: everything else
                    ================================================= */}

                    {expanded && (
                        <>
                            {/* NOTES — only in expanded view now */}
                            <div className="min-w-0 px-2">
                                <span
                                    className="block whitespace-normal break-words text-[12px] leading-4 text-slate-500"
                                    title={notes}
                                >
                                    {notes}
                                </span>
                            </div>

                            {/* DESTINATION */}
                            {/* <div className="min-w-0 px-2">
                                <span
                                    className="block truncate text-[12px] text-slate-600"
                                    title={destination}
                                >
                                    {destination}
                                </span>
                            </div> */}

                            {/* PREFERRED DESTINATION — holiday only */}
                            {/* =================================================
                                    HOLIDAY-SPECIFIC FIELDS
                                ================================================= */}

                            {/* PREFERRED DESTINATION — Holiday only */}
                            {isHoliday && (
                                <div className="min-w-0 px-2">
                                    <span
                                        className="block whitespace-normal break-words text-[12px] leading-4 text-slate-600"
                                        title={preferredDestination}
                                    >
                                        {preferredDestination}
                                    </span>
                                </div>
                            )}

                            {/* TRAVEL DATE — Holiday only */}
                            {isHoliday && (
                                <div className="min-w-0 px-2">
                                    <span className="block truncate text-[12px] text-slate-600">
                                        {formatDate(preferredTravelDate)}
                                    </span>
                                </div>
                            )}

                            {/* FIT / GIT + DOMESTIC / INTERNATIONAL */}
                            {isHoliday && (
                                <div className="min-w-0 px-2">
                                    <div className="flex flex-col items-start gap-0.5">

                                        {/* FIT / GIT */}
                                        <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                                            {leadType}
                                        </span>

                                        {/* DOMESTIC / INTERNATIONAL */}
                                        <span
                                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${tripType === "International"
                                                ? "bg-purple-50 text-purple-700"
                                                : tripType === "Domestic"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {tripType}
                                        </span>

                                    </div>
                                </div>
                            )}
                            {/* FOLLOW-UP */}
                            <div className="min-w-0 px-2">
                                <span className="block truncate text-[12px] font-medium text-slate-600">
                                    {formatDate(followUpDate)}
                                </span>
                            </div>

                            {/* ENQUIRY */}
                            <div className="min-w-0 px-2">
                                <span className="block truncate text-[12px] text-slate-500">
                                    {formatDate(enquiryDate)}
                                </span>
                            </div>

                            {/* ASSIGNEE */}
                            <div className="min-w-0 px-2">
                                <span
                                    className="block truncate text-[12px] font-medium text-slate-600"
                                    title={assignee}
                                >
                                    {assignee}
                                </span>
                            </div>

                            {/* CONTACT */}
                            <div className="min-w-0 px-2">
                                <div className="flex min-w-0 flex-col leading-4">

                                    <span
                                        className="block truncate text-[11px] text-slate-600"
                                        title={mobile}
                                    >
                                        {mobile}
                                    </span>

                                    <span
                                        className="block truncate text-[11px] text-slate-500"
                                        title={email}
                                    >
                                        {email}
                                    </span>

                                </div>
                            </div>

                            {/* STATUS */}
                            <div className="min-w-0 px-2">
                                {status !== "-" ? (
                                    <span
                                        className={`
                                            inline-flex max-w-full truncate rounded-full
                                            px-2 py-0.5 text-[10px] font-semibold
                                            ${STATUS_STYLE[status] || "bg-slate-100 text-slate-600"}
                                        `}
                                        title={status}
                                    >
                                        {status}
                                    </span>
                                ) : (
                                    <span className="text-[11px] text-slate-400">-</span>
                                )}
                            </div>
                        </>
                    )}

                    {/* =================================================
                            ACTIONS
                        ================================================= */}
                    <div className="flex min-w-0 items-center justify-center gap-0.5 px-1">

                        {/* COLLAPSED ACTIONS */}
                        {!expanded && (
                            <>
                                {/* PHONE */}
                                <button
                                    ref={phoneBtnRef}
                                    type="button"
                                    onMouseEnter={openContactTooltip}
                                    onMouseLeave={closeContactTooltip}
                                    onClick={() => onCall?.(lead)}
                                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition hover:bg-emerald-50"
                                    title="Call"
                                >
                                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                                </button>

                                {/* NOTE */}
                                <button
                                    type="button"
                                    onClick={() => onNote?.(lead)}
                                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition hover:bg-blue-50"
                                    title="Add note"
                                >
                                    <MessageSquarePlus className="h-3.5 w-3.5 text-blue-600" />
                                </button>

                                {/* RESCHEDULE */}
                                <button
                                    type="button"
                                    onClick={() => onReschedule?.(lead)}
                                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition hover:bg-purple-50"
                                    title="Reschedule"
                                >
                                    <CalendarClock className="h-3.5 w-3.5 text-purple-600" />
                                </button>
                            </>
                        )}

                        {/* VIEW — ALWAYS AVAILABLE */}
                        <button
                            type="button"
                            onClick={() => onOpen?.(lead)}
                            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition hover:bg-slate-100"
                            title="Open Lead"
                        >
                            <Eye className="h-4 w-4 text-slate-600" />
                        </button>

                    </div>

                </div>


                {/* =====================================================
                    INLINE NOTE
                ===================================================== */}

                {noteOpen && (
                    <div className="border-t border-blue-100 bg-blue-50 px-3 py-2">
                        <div className="flex items-center gap-2">

                            <input
                                autoFocus
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Add note..."
                                className="min-w-0 flex-1 rounded border border-blue-200 bg-white px-3 py-1.5 text-xs focus:outline-none"
                            />

                            <button
                                type="button"
                                onClick={() => {
                                    onSaveNote?.(lead, noteText);
                                    setNoteText("");
                                }}
                                className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white"
                            >
                                Save
                            </button>

                            <button
                                type="button"
                                onClick={onCancelInline}
                                className="rounded-full p-1"
                            >
                                <X className="h-4 w-4 text-slate-500" />
                            </button>

                        </div>
                    </div>
                )}

                {/* =====================================================
                    INLINE RESCHEDULE
                ===================================================== */}

                {rescheduleOpen && (
                    <div className="border-t border-purple-100 bg-purple-50 px-3 py-2">
                        <div className="flex items-center justify-end gap-2">
                            <input
                                type="date"
                                value={newDate}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="rounded border border-purple-200 bg-white px-3 py-1.5 text-xs"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    onSaveReschedule?.(lead, newDate);
                                    setNewDate("");
                                }}
                                className="rounded bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white"
                            >
                                Save
                            </button>
                            <button type="button" onClick={onCancelInline} className="rounded-full p-1">
                                <X className="h-4 w-4 text-slate-500" />
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* =====================================================
                CONTACT TOOLTIP — portaled to <body> so it's never
                clipped by the scroll container's overflow-hidden
            ===================================================== */}

            {showContact && contactPos && createPortal(
                <div
                    onMouseEnter={openContactTooltip}
                    onMouseLeave={closeContactTooltip}
                    style={{
                        position: "fixed",
                        top: contactPos.top,
                        left: contactPos.left
                    }}
                    className="z-[9999] w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-xl"
                >
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Contact Details
                    </div>

                    <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" />
                        <span className="text-[12px] text-slate-700">{mobile}</span>
                    </div>

                    <div className="mt-2 flex min-w-0 items-center gap-2">
                        <Mail className="h-3.5 w-3.5 flex-shrink-0 text-blue-600" />
                        <span className="min-w-0 truncate text-[12px] text-slate-700">{email}</span>
                    </div>
                </div>,
                document.body
            )}

        </>
    );
};

export default LeadRow;