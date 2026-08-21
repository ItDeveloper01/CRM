// import React from "react";
// import { ChevronDown } from "lucide-react";

// const DashboardFilters = ({
//     userRole,
//     viewMode,
//     setViewMode,

//     teamMembers,
//     selectedTeamMember,
//     setSelectedTeamMember
// }) => {


//     const canViewTeam =
//         ["Team Lead", "Manager", "HOD", "Admin", "SuperAdmin"]
//         .includes(userRole);


//     return (
//         <div className="flex items-center gap-2">

//             {/* Dashboard Switch */}
//             {canViewTeam && (

//                 <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">

//                     <button
//                         onClick={() => setViewMode("mine")}
//                         className={`
//                             px-3 py-1.5 text-xs font-semibold rounded-md
//                             transition
//                             ${
//                                 viewMode === "mine"
//                                 ? "bg-blue-600 text-white"
//                                 : "text-slate-500 hover:bg-slate-50"
//                             }
//                         `}
//                     >
//                         My Dashboard
//                     </button>


//                     <button
//                         onClick={() => setViewMode("team")}
//                         className={`
//                             px-3 py-1.5 text-xs font-semibold rounded-md
//                             transition
//                             ${
//                                 viewMode === "team"
//                                 ? "bg-blue-600 text-white"
//                                 : "text-slate-500 hover:bg-slate-50"
//                             }
//                         `}
//                     >
//                         My Team
//                     </button>

//                 </div>

//             )}


//             {/* Executive should directly see own dashboard */}
//             {!canViewTeam && (

//                 <div className="
//                     rounded-lg 
//                     border border-slate-200 
//                     bg-white 
//                     px-3 py-1.5
//                     text-xs 
//                     font-semibold 
//                     text-slate-600
//                 ">
//                     My Dashboard
//                 </div>

//             )}



//             {/* Team Member Dropdown */}
//             {
//                 canViewTeam &&
//                 viewMode === "team" && (

//                 <div className="relative">

//                     <select

//                         value={selectedTeamMember}

//                         onChange={(e)=>
//                             setSelectedTeamMember(e.target.value)
//                         }

//                         className="
//                             appearance-none
//                             rounded-lg
//                             border border-slate-200
//                             bg-white
//                             px-3
//                             py-1.5
//                             pr-8
//                             text-xs
//                             font-medium
//                             text-slate-600
//                             focus:outline-none
//                         "
//                     >

//                         <option value="">
//                             All Team Members
//                         </option>


//                         {
//                             teamMembers.map(member => (

//                                 <option
//                                     key={member.id}
//                                     value={member.id}
//                                 >
//                                     {member.name}
//                                 </option>

//                             ))
//                         }

//                     </select>


//                     <ChevronDown
//                         className="
//                             absolute
//                             right-2
//                             top-1/2
//                             h-3
//                             w-3
//                             -translate-y-1/2
//                             text-slate-400
//                         "
//                     />

//                 </div>

//             )}

//         </div>
//     );
// };


// export default DashboardFilters;

import React from "react";
import { ChevronDown } from "lucide-react";

const DashboardFilters = ({
    userRole,
    viewMode,
    setViewMode,

    teamMembers,
    selectedExecutive,
    setSelectedExecutive
}) => {

    const canViewTeam =
        ["Team Lead", "Manager", "HOD", "Admin", "SuperAdmin"]
        .includes(userRole);

    return (
        <div className="flex items-center gap-2">

            {canViewTeam && (
                <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
                    <button
                        onClick={() => setViewMode("mine")}
                        className={`
                            px-3 py-1.5 text-xs font-semibold rounded-md
                            transition
                            ${viewMode === "mine" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"}
                        `}
                    >
                        My Dashboard
                    </button>

                    <button
                        onClick={() => setViewMode("team")}
                        className={`
                            px-3 py-1.5 text-xs font-semibold rounded-md
                            transition
                            ${viewMode === "team" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"}
                        `}
                    >
                        My Team
                    </button>
                </div>
            )}

            {!canViewTeam && (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                    My Dashboard
                </div>
            )}

            {canViewTeam && viewMode === "team" && (
                <div className="relative">
                    <select
                        value={selectedExecutive}
                        onChange={(e) => setSelectedExecutive(e.target.value)}
                        className="appearance-none rounded-lg border border-slate-200 bg-white px-3 py-1.5 pr-8 text-xs font-medium text-slate-600 focus:outline-none"
                    >
                        <option value="">All Team Members</option>

                        {teamMembers.map(member => (
                            <option key={member.id} value={member.name}>
                                {member.name}
                            </option>
                        ))}
                    </select>

                    <ChevronDown className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                </div>
            )}

        </div>
    );
};

export default DashboardFilters;