import React from "react";

const colors = {
    red: {
        header: "bg-red-100 text-red-700",
        dot: "bg-red-500"
    },
    amber: {
        header: "bg-amber-100 text-amber-700",
        dot: "bg-amber-500"
    },
    green: {
        header: "bg-green-100 text-green-700",
        dot: "bg-green-500"
    }
};

const TimelineSection = ({
    title,
    color,
    leads = []
}) => {

    return (

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            <div className={`px-5 py-3 font-semibold ${colors[color].header}`}>

                {title} ({leads.length})

            </div>

            <div>

                {leads.map((lead) => (

                    <div
                        key={lead.id}
                        className="flex items-center justify-between px-5 py-4 border-b last:border-b-0 hover:bg-slate-50"
                    >

                        <div className="flex items-center gap-3">

                            <div
                                className={`w-3 h-3 rounded-full ${colors[color].dot}`}
                            />

                            <div>

                                <div className="font-medium">

                                    {lead.customerName}

                                </div>

                            </div>

                        </div>

                        <div className="text-sm text-gray-500">

                            {lead.days}

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

};

export default TimelineSection;