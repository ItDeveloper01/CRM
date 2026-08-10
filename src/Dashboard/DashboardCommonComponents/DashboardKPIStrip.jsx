import React from "react";
import {
    PhoneCall,
    FileText,
    CheckCircle2,
    Clock
} from "lucide-react";

const DashboardKPIStrip = ({ kpis = [] }) => {
    const iconMap = {
        phone: PhoneCall,
        file: FileText,
        check: CheckCircle2,
        clock: Clock
    };

    return (
        <div className="mt-0 flex flex-wrap gap-1">

            {kpis.map((item) => {

                const Icon = iconMap[item.icon] || Clock;

                return (
                    <div
                        key={item.id}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm"
                    >
                        <Icon className="h-4 w-4 text-blue-500" />

                        <div>
                            <div className="text-sm font-bold text-slate-800">
                                {item.value}
                            </div>

                            <div className="text-[11px] text-slate-500">
                                {item.title}
                            </div>
                        </div>
                    </div>
                );

            })}

        </div>
    );
};

export default DashboardKPIStrip;