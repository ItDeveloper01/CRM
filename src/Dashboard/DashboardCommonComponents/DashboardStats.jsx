import React from "react";

const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    gray: "bg-slate-100 text-slate-600"
};

const DashboardStats = ({ cards }) => {

    return (
        <div
            className="
               
                grid
                grid-cols-2
                sm:grid-cols-3
                lg:grid-cols-4
                gap-2
            "
        >

            {cards.map(card => (

                <div
                    key={card.id}
                    className="
                        flex
                        items-center
                        justify-between
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-2.5
                        py-1.5
                        shadow-sm
                        min-h-[52px]
                    "
                >

                    {/* Left */}
                    <div className="flex flex-col min-w-0">

                        <span
                            className="
                                truncate
                                text-[10px]
                                font-medium
                                text-slate-500
                            "
                        >
                            {card.title}
                        </span>


                        <span
                            className="
                                text-lg
                                font-bold
                                leading-tight
                                text-slate-900
                            "
                        >
                            {card.value}
                        </span>

                    </div>


                    {/* Small indicator */}
                    <div
                        className={`
                            h-7
                            w-7
                            flex
                            items-center
                            justify-center
                            rounded-md
                            text-[11px]
                            font-bold
                            ${colorMap[card.color]}
                        `}
                    >
                        {card.value}
                    </div>

                </div>

            ))}

        </div>
    );
};

export default DashboardStats;