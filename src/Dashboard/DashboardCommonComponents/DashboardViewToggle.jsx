import React from "react";
import { User, Users } from "lucide-react";

const DashboardViewToggle = ({
    canViewTeamDashboard,
    viewMode,
    setViewMode
}) => {

    if (!canViewTeamDashboard)
        return null;

    return (

        <div className="inline-flex gap-2">

            <button
                onClick={() => setViewMode("mine")}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all
                    ${
                        viewMode === "mine"
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-slate-200 bg-white text-slate-400 hover:text-slate-600"
                    }`}
            >
                <User className="h-3 w-3" strokeWidth={1.75} />
                My Dashboard
            </button>

            <button
                onClick={() => setViewMode("team")}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all
                    ${
                        viewMode === "team"
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-slate-200 bg-white text-slate-400 hover:text-slate-600"
                    }`}
            >
                <Users className="h-3 w-3" strokeWidth={1.75} />
                Team Dashboard
            </button>

        </div>

    );

};

export default DashboardViewToggle;