import React from "react";
import { X } from "lucide-react";

const STATUS_STYLE = {
    Confirmed: "bg-emerald-100 text-emerald-700",
    Lost: "bg-red-100 text-red-700",
    Open: "bg-amber-100 text-amber-700",
    "Quote Sent": "bg-purple-100 text-purple-700",
    "Follow-up": "bg-blue-100 text-blue-700",
    "New Lead": "bg-slate-200 text-slate-700"
};

const LeadDetailsModal = ({
    lead,
    onClose
}) => {

    if (!lead) return null;

    return (

        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >

            <div
                className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="flex items-start justify-between">

                    <div>

                        <h2 className="text-lg font-bold">
                            {lead.customer}
                        </h2>

                        <p className="text-sm text-slate-500">
                            {lead.phone}
                        </p>

                    </div>

                    <button onClick={onClose}>
                        <X className="h-5 w-5 text-slate-500" />
                    </button>

                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">

                    <InfoBox
                        title="Destination"
                        value={lead.destination}
                    />

                    <InfoBox
                        title="Category"
                        value={lead.category}
                    />

                    <div className="rounded-lg bg-slate-50 p-3">

                        <p className="text-xs text-slate-500">
                            Status
                        </p>

                        <span
                            className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-semibold ${STATUS_STYLE[lead.status]}`}
                        >
                            {lead.status}
                        </span>

                    </div>

                    <InfoBox
                        title="Priority"
                        value={lead.priority}
                    />

                    <div className="col-span-2 rounded-lg bg-slate-50 p-3">

                        <p className="text-xs text-slate-500">
                            Executive
                        </p>

                        <p className="font-semibold">
                            {lead.executive}
                        </p>

                    </div>

                    <div className="col-span-2 rounded-lg bg-slate-50 p-3">

                        <p className="text-xs text-slate-500">
                            Latest Notes
                        </p>

                        <p className="mt-1 text-sm">
                            {lead.notes}
                        </p>

                    </div>

                </div>

                <button
                    onClick={onClose}
                    className="mt-5 w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
                >
                    Close
                </button>

            </div>

        </div>

    );

};

const InfoBox = ({ title, value }) => (

    <div className="rounded-lg bg-slate-50 p-3">

        <p className="text-xs text-slate-500">
            {title}
        </p>

        <p className="font-semibold">
            {value}
        </p>

    </div>

);

export default LeadDetailsModal;