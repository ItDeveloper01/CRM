import React from "react";
import { Award } from "lucide-react";

const TeamPerformance = ({
    teamMembers = [],
    selectedExecutive,
    setSelectedExecutive
}) => {

    const maxPending = Math.max(
        ...teamMembers.map(x => x.pending),
        1
    );

    return (

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">

                <Award className="h-4 w-4" />

                Team Performance

            </div>

            <p className="mt-1 mb-3 text-[11px] text-slate-400">
                Pending follow-ups by executive
            </p>

            <div className="space-y-2">

                {teamMembers.map(member => {

                    const active =
                        selectedExecutive === member.id;

                    return (

                        <button
                            key={member.id}
                            onClick={() =>
                                setSelectedExecutive(
                                    active ? "" : member.id
                                )
                            }
                            className={`block w-full rounded-lg p-2 text-left transition
                                ${
                                    active
                                        ? "bg-blue-50 ring-1 ring-blue-200"
                                        : "hover:bg-slate-50"
                                }`}
                        >

                            <div className="flex justify-between text-xs">

                                <span className="font-semibold text-slate-700">
                                    {member.name}
                                </span>

                                <span className="font-bold text-slate-500">
                                    {member.pending}
                                </span>

                            </div>

                            <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">

                                <div
                                    className={`h-full rounded-full ${
                                        member.pending === maxPending
                                            ? "bg-red-400"
                                            : "bg-blue-400"
                                    }`}
                                    style={{
                                        width:
                                            `${member.pending / maxPending * 100}%`
                                    }}
                                />

                            </div>

                        </button>

                    );

                })}

            </div>

        </div>

    );

};

export default TeamPerformance;