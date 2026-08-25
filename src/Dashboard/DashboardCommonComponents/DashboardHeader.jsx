import React from "react";
import { RefreshCw } from "lucide-react";

const DashboardHeader = ({ title, subtitle, user }) => {
    return (
        <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-sm text-slate-500">
                        {subtitle}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium text-slate-700">
                            {user}
                        </div>
                        <div className="text-xs text-slate-400">
                            {new Date().toLocaleDateString(undefined, {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                            })}
                        </div>
                    </div>

                    <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md
                                   border border-slate-200 text-slate-600   
                                   hover:bg-slate-50 hover:text-slate-900
                                   text-sm font-medium transition"
                    >
                        <RefreshCw size={15} />
                        Refresh
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;