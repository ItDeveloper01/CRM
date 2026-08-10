import React, { useState } from "react";
import {
    Phone,
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

const PRIORITY_DOT = {
    High: "bg-red-500",
    Medium: "bg-orange-400",
    Low: "bg-slate-300"
};

const LeadRow = ({
    lead,
    bucket,
    showOwner,

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
    const [newDate, setNewDate] = useState("");

    return (

        <div className="rounded-lg border border-transparent hover:border-slate-100 hover:bg-slate-50">

            <div className="flex items-center gap-2 px-2 py-2">

                {/* Priority */}

                <span
                    className={`h-2 w-2 rounded-full ${PRIORITY_DOT[lead.priority]}`}
                />

                {/* Customer */}

                <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-2">

                        <span className="truncate text-[13px] font-bold text-slate-900">
                            {lead.customerName}
                        </span>

                        <span className="text-[11px] text-slate-400 truncate">
                            {lead.destination}
                        </span>

                    </div>

                    <div className="mt-0.5 text-[11px] text-slate-500 truncate">

                        {lead.notes}

                    </div>

                </div>

                {/* Status */}

                <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[lead.status]}`}
                >
                    {lead.status}
                </span>

                {/* Actions */}

                <div className="flex items-center gap-1">

                    <button
                        onClick={() => onCall?.(lead)}
                        className="rounded-full p-1 hover:bg-emerald-50"
                    >
                        <Phone className="h-4 w-4 text-emerald-600" />
                    </button>

                    <button
                        onClick={() => onNote?.(lead)}
                        className="rounded-full p-1 hover:bg-blue-50"
                    >
                        <MessageSquarePlus className="h-4 w-4 text-blue-600" />
                    </button>

                    <button
                        onClick={() => onReschedule?.(lead)}
                        className="rounded-full p-1 hover:bg-purple-50"
                    >
                        <CalendarClock className="h-4 w-4 text-purple-600" />
                    </button>

                    <button
                        onClick={() => onOpen?.(lead)}
                        className="rounded-full p-1 hover:bg-slate-100"
                    >
                        <Eye className="h-4 w-4 text-slate-600" />
                    </button>

                </div>

            </div>

            {/* Note */}

            {noteOpen && (

                <div className="mx-2 mb-2 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 p-2">

                    <input
                        autoFocus
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add note..."
                        className="flex-1 rounded border border-blue-200 bg-white px-2 py-1 text-xs focus:outline-none"
                    />

                    <button
                        onClick={() => {

                            onSaveNote?.(lead, noteText);

                            setNoteText("");

                        }}
                        className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white"
                    >
                        Save
                    </button>

                    <button onClick={onCancelInline}>
                        <X className="h-4 w-4 text-slate-500" />
                    </button>

                </div>

            )}

            {/* Reschedule */}

            {rescheduleOpen && (

                <div className="mx-2 mb-2 flex items-center gap-2 rounded-lg border border-purple-100 bg-purple-50 p-2">

                    <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="rounded border border-purple-200 bg-white px-2 py-1 text-xs"
                    />

                    <button
                        onClick={() => {

                            onSaveReschedule?.(lead, newDate);

                            setNewDate("");

                        }}
                        className="rounded bg-purple-600 px-3 py-1 text-xs font-semibold text-white"
                    >
                        Save
                    </button>

                    <button onClick={onCancelInline}>
                        <X className="h-4 w-4 text-slate-500" />
                    </button>

                </div>

            )}

        </div>

    );

};

export default LeadRow;