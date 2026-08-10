import React from "react";

const KPICard = ({
    title,
    value,
    color = "blue"
}) => {

    const colors = {
        blue: "bg-blue-50 border-blue-200 text-blue-700",
        red: "bg-red-50 border-red-200 text-red-700",
        green: "bg-green-50 border-green-200 text-green-700",
        amber: "bg-amber-50 border-amber-200 text-amber-700",
        purple: "bg-purple-50 border-purple-200 text-purple-700",
        gray: "bg-slate-50 border-slate-200 text-slate-700"
    };

    return (

        <div
            className={`rounded-xl border p-5 shadow-sm ${colors[color]}`}
        >

            <div className="text-sm font-medium">
                {title}
            </div>

            <div className="mt-3 text-4xl font-bold">
                {value}
            </div>

        </div>

    );
};

export default KPICard;