import React from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import LeadRow from "./LeadRow";

const BUCKET_META = {
    overdue: {
        label: "Overdue",
        dot: "bg-red-500",
        header: "bg-red-50 text-red-700"
    },
    today: {
        label: "Today",
        dot: "bg-emerald-500",
        header: "bg-emerald-50 text-emerald-700"
    },
    tomorrow: {
        label: "Tomorrow",
        dot: "bg-blue-500",
        header: "bg-blue-50 text-blue-700"
    },
    next7: {
        label: "Next 7 Days",
        dot: "bg-slate-400",
        header: "bg-slate-100 text-slate-600"
    }
};

const BucketCard = ({
    bucket,
    leads,
    showOwner,
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
    onCancelInline
}) => {

    const meta = BUCKET_META[bucket];

    return (

        <div
            className={`flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm ${expanded ? "md:col-span-2" : ""
                }`}
        >

            {/* Header */}

            <div
                className={`flex items-center gap-2 rounded-t-xl px-3 py-2 text-xs font-bold uppercase tracking-wide ${meta.header}`}
            >

                <span className={`h-2 w-2 rounded-full ${meta.dot}`} />

                {meta.label}

                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                    {leads.length}
                </span>

                <button
                    onClick={onToggleExpand}
                    className="ml-auto flex h-5 w-5 items-center justify-center rounded-md bg-white text-slate-400 hover:text-slate-700"
                >
                    {expanded
                        ? <Minimize2 className="h-3 w-3" />
                        : <Maximize2 className="h-3 w-3" />
                    }
                </button>

            </div>

            {/* Body */}

            <div
                className={`space-y-1 overflow-y-auto p-2 ${expanded
                        ? "max-h-[32rem]"
                        : "max-h-72"
                    }`}
            >

                {leads.length === 0 ? (

                    <div className="py-6 text-center text-sm text-slate-400">
                        No follow-ups
                    </div>

                ) : (

                    leads.map((lead) => (

                        <LeadRow
                            key={lead.id}
                            lead={lead}
                            bucket={bucket}
                            showOwner={showOwner}

                            onCall={onCall}
                            onNote={onNote}
                            onReschedule={onReschedule}
                            onOpen={onOpen}

                            noteOpen={noteOpen === lead.id}
                            rescheduleOpen={rescheduleOpen === lead.id}

                            onSaveNote={onSaveNote}
                            onSaveReschedule={onSaveReschedule}
                            onCancelInline={onCancelInline}
                        />

                    ))

                )}

            </div>

        </div>

    );

};

export default BucketCard;