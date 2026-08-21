// import React from "react";
// import { Award } from "lucide-react";

// const TeamPerformanceSidebar = ({
//     executives,
//     selectedExecutive,
//     setSelectedExecutive
// }) => {

//     if (!executives || executives.length === 0)
//         return null;

//     const maxPending = Math.max(
//         ...executives.map(x => x.pending)
//     );

//     return (

//         <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

//             <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">

//                 <Award className="h-4 w-4" />

//                 Team Performance

//             </div>

//             <p className="mt-1 mb-3 text-[11px] text-slate-400">
//                 Pending follow-ups by executive
//             </p>

//             <div className="space-y-2">

//                 {executives
//                     .sort((a, b) => b.pending - a.pending)
//                     .map(exec => {

//                         const active =
//                             selectedExecutive === exec.id;

//                         return (

//                             <button
//                                 key={exec.id}
//                                 onClick={() =>
//                                     setSelectedExecutive(
//                                         active ? "" : exec.id
//                                     )
//                                 }
//                                 className={`block w-full rounded-lg p-2 text-left transition
//                                 ${
//                                     active
//                                         ? "bg-blue-50 ring-1 ring-blue-200"
//                                         : "hover:bg-slate-50"
//                                 }`}
//                             >

//                                 <div className="flex justify-between text-xs">

//                                     <span className="font-semibold">
//                                         {exec.name}
//                                     </span>

//                                     <span className="font-bold text-slate-500">
//                                         {exec.pending}
//                                     </span>

//                                 </div>

//                                 <div className="mt-1 h-2 rounded-full bg-slate-100 overflow-hidden">

//                                     <div
//                                         className={`h-full rounded-full ${
//                                             exec.pending === maxPending
//                                                 ? "bg-red-400"
//                                                 : "bg-blue-400"
//                                         }`}
//                                         style={{
//                                             width: `${(exec.pending / maxPending) * 100}%`
//                                         }}
//                                     />

//                                 </div>

//                             </button>

//                         );

//                     })}

//             </div>

//         </div>

//     );

// };

// export default TeamPerformanceSidebar;

import React from "react";
import { Award } from "lucide-react";

const TeamPerformanceSidebar = ({
    executives,
    selectedExecutive,
    setSelectedExecutive
}) => {

    if (!executives || executives.length === 0)
        return null;

    const maxPending = Math.max(
        ...executives.map(x => x.pending)
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

                {[...executives]
                    .sort((a, b) => b.pending - a.pending)
                    .map(exec => {

                        const active =
                            selectedExecutive === exec.name;

                        return (

                            <button
                                key={exec.id}
                                onClick={() =>
                                    setSelectedExecutive(
                                        active ? "" : exec.name
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

                                    <span className="font-semibold">
                                        {exec.name}
                                    </span>

                                    <span className="font-bold text-slate-500">
                                        {exec.pending}
                                    </span>

                                </div>

                                <div className="mt-1 h-2 rounded-full bg-slate-100 overflow-hidden">

                                    <div
                                        className={`h-full rounded-full ${
                                            exec.pending === maxPending
                                                ? "bg-red-400"
                                                : "bg-blue-400"
                                        }`}
                                        style={{
                                            width: `${(exec.pending / maxPending) * 100}%`
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

export default TeamPerformanceSidebar;