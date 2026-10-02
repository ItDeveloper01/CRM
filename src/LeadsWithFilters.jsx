
// import React, { useMemo, useState } from "react";
// import { CardContent } from "@mui/material";
// import { MESSAGE_TYPES } from "./Constants";
// import axios from "axios";
// import UpdateLeadsModal from "./UpdateLeadsModal";
// import { getEmptyLeadObj } from "./Model/LeadModel";
// import config from "./config";
// import { useMessageBox } from "./Notification";
// import { useGetSessionUser } from "./SessionContext";
// import MessageBox from "./MessageBox";
// import LeadTransferModal from "./LeadTransferModal";
// import ReOpenLeadModal from "./ReOpenLeadModal";

// import {
//   LoadingOverlay,
//   MultiSelectFilter,
//   SortableHeader,
//   SwapIcon,
//   EyeIcon,
//   splitDestinations,
//   isHolidayLead,
//   getTripType,
//   getLeadType,
//   getDestinations,
//   getLatestUpdate,
//   getTravelDate,
//   CalendarFilter,
//   LeadsSummaryBar,
// } from "./LeadsSharedTable";

// // ============================================================
// // GENERAL FILTER CONFIGURATION
// // ============================================================

// const ALLOW_MULTI_SELECT = true;

// // ============================================================
// // FILTER LABELS
// // ============================================================

// const FILTER_LABELS = {
//   status: "Status",
//   customerTypeDescription: "Customer Type",
//   categoryName: "Category",
//   assignedTo: "Assigned To",
//   tripType: "Domestic/International",
//   leadType: "FIT/GIT",
//   preferredDestination: "Destination",
// };

// // ============================================================
// // FILTER GROUPS
// // ============================================================

// const BASE_FILTER_KEYS = [
//   "categoryName",
//   "assignedTo",
//   "status",
//   "customerTypeDescription",
// ];

// const HOLIDAY_FILTER_KEYS = [
//   "tripType",
//   "leadType",
//   "preferredDestination",
// ];

// // ============================================================
// // LEAD TRANSFER PERMISSIONS
// // ============================================================

// const SHOW_TRANSFER_OPTIONS = true;
// const CAN_TRANSFER_CONFIRMED = true;
// const CAN_TRANSFER_LOST = true;

// // ============================================================
// // LEAD REOPEN PERMISSIONS
// // ============================================================

// const SHOW_REOPEN_OPTIONS = true;
// const CAN_REOPEN_CONFIRMED = true;
// const CAN_REOPEN_LOST = true;
// const CAN_REOPEN_POSTPONED = true;
// const CAN_REOPEN_CLOSED = true;

// // ============================================================
// // CHECK WHETHER A LEAD CAN BE TRANSFERRED
// // ============================================================

// const isLeadTransferable = (lead) => {
//   if (!SHOW_TRANSFER_OPTIONS) {
//     return false;
//   }

//   const status = (lead?.status || "").trim().toLowerCase();

//   if (status === "confirmed") {
//     return CAN_TRANSFER_CONFIRMED;
//   }

//   if (status === "lost") {
//     return CAN_TRANSFER_LOST;
//   }

//   return true;
// };

// // ============================================================
// // CHECK WHETHER A LEAD CAN BE REOPENED
// // ============================================================

// const isLeadReopenable = (lead) => {
//   if (!SHOW_REOPEN_OPTIONS) {
//     return false;
//   }

//   const status = (lead?.status || "").trim().toLowerCase();

//   if (status === "confirmed") {
//     return CAN_REOPEN_CONFIRMED;
//   }

//   if (status === "lost") {
//     return CAN_REOPEN_LOST;
//   }

//   if (status === "postponed") {
//     return CAN_REOPEN_POSTPONED;
//   }

//   if (status === "closed") {
//     return CAN_REOPEN_CLOSED;
//   }

//   return false;
// };

// // ============================================================
// // SEARCHABLE MULTI SELECT FILTER
// // ============================================================

// function SearchableMultiSelectFilter({
//   label,
//   options,
//   selected,
//   onToggle,
//   onClear,
// }) {
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [showTooltip, setShowTooltip] = useState(false);

//   const wrapperRef = React.useRef(null);

//   const isActive = selected.length > 0;

//   React.useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         wrapperRef.current &&
//         !wrapperRef.current.contains(e.target)
//       ) {
//         setOpen(false);
//         setShowTooltip(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () =>
//       document.removeEventListener(
//         "mousedown",
//         handleClickOutside
//       );
//   }, []);

//   const filteredOptions = useMemo(
//     () =>
//       options.filter((o) =>
//         o.toLowerCase().includes(search.toLowerCase())
//       ),
//     [options, search]
//   );

//   return (
//     <div
//       className="relative w-full min-w-0"
//       ref={wrapperRef}
//     >
//       <div
//         className="relative w-full"
//         onMouseEnter={() => {
//           if (isActive && !open) {
//             setShowTooltip(true);
//           }
//         }}
//         onMouseLeave={() => {
//           setShowTooltip(false);
//         }}
//       >
//         <button
//           type="button"
//           onClick={() => {
//             setOpen((o) => !o);
//             setShowTooltip(false);
//           }}
//           className={`
//             border
//             px-2
//             py-1.5
//             rounded
//             text-sm
//             w-full
//             min-w-0
//             text-left
//             flex
//             items-center
//             gap-1.5
//             transition
//             font-medium
//             ${isActive
//               ? "bg-blue-600 border-blue-600 text-white"
//               : "bg-white border-gray-400 text-gray-700 hover:border-gray-600"
//             }
//           `}
//         >
//           <span className="truncate flex-1 min-w-0">
//             {isActive
//               ? `${label} (${selected.length})`
//               : label}
//           </span>

//           {isActive ? (
//             <span
//               onMouseDown={(e) => {
//                 e.stopPropagation();
//                 e.preventDefault();

//                 onClear && onClear();

//                 setOpen(false);
//                 setShowTooltip(false);
//               }}
//               title={`Clear ${label} filter`}
//               className="
//                 flex-shrink-0
//                 w-4
//                 h-4
//                 rounded-full
//                 bg-white
//                 text-red-600
//                 flex
//                 items-center
//                 justify-center
//                 text-[11px]
//                 font-black
//                 leading-none
//                 hover:bg-red-100
//                 cursor-pointer
//               "
//             >
//               ✕
//             </span>
//           ) : (
//             <span
//               className="
//                 text-[10px]
//                 text-gray-500
//                 flex-shrink-0
//               "
//             >
//               {open ? "▲" : "▼"}
//             </span>
//           )}
//         </button>

//         {showTooltip && isActive && (
//           <div
//             className="
//               absolute
//               left-0
//               top-full
//               mt-2
//               z-[100]
//               w-max
//               max-w-[320px]
//               min-w-[180px]
//               bg-white
//               border
//               border-gray-200
//               rounded-xl
//               shadow-lg
//               px-3
//               py-2.5
//               text-sm
//               text-gray-700
//               pointer-events-none
//             "
//           >
//             <div
//               className="
//                 font-semibold
//                 text-gray-600
//                 mb-1.5
//               "
//             >
//               Selected {label}:
//             </div>

//             <div className="space-y-1">
//               {selected.map((value, index) => (
//                 <div
//                   key={`${value}-${index}`}
//                   className="
//                     flex
//                     items-start
//                     gap-1.5
//                     text-xs
//                     text-gray-600
//                   "
//                 >
//                   <span
//                     className="
//                       w-[5px]
//                       h-[5px]
//                       rounded-full
//                       bg-blue-500
//                       flex-shrink-0
//                       mt-1
//                     "
//                   />

//                   <span className="break-words">
//                     {value}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {open && (
//         <div
//           className="
//             absolute
//             z-20
//             mt-1
//             w-full
//             min-w-[190px]
//             bg-white
//             border
//             border-gray-200
//             rounded
//             shadow-lg
//             max-h-56
//             overflow-auto
//           "
//         >
//           <div
//             className="
//               p-2
//               border-b
//               border-gray-100
//               sticky
//               top-0
//               bg-white
//             "
//           >
//             <input
//               type="text"
//               autoFocus
//               placeholder={`Search ${label}...`}
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="
//                 w-full
//                 text-sm
//                 px-2
//                 py-1
//                 border
//                 border-gray-300
//                 rounded
//                 focus:outline-none
//                 focus:ring-2
//               "
//             />
//           </div>

//           {filteredOptions.length === 0 && (
//             <div className="px-2 py-1.5 text-xs text-gray-400">
//               No matches
//             </div>
//           )}

//           {filteredOptions.map((opt) => (
//             <label
//               key={opt}
//               className="
//                 flex
//                 items-center
//                 gap-2
//                 px-2
//                 py-1.5
//                 text-sm
//                 hover:bg-gray-50
//                 cursor-pointer
//               "
//             >
//               <input
//                 type="checkbox"
//                 checked={selected.includes(opt)}
//                 onChange={() => onToggle(opt)}
//               />

//               <span className="truncate">
//                 {opt}
//               </span>
//             </label>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ============================================================
// // EMPTY FILTER STATE
// // ============================================================

// const EMPTY_FILTERS = {
//   status: [],
//   customerTypeDescription: [],
//   categoryName: [],
//   assignedTo: [],
//   tripType: [],
//   leadType: [],
//   preferredDestination: [],
// };

// // ============================================================
// // MAIN COMPONENT
// // ============================================================

// export default function LeadListWithFilters({
//   users,
//   dateRange,
//   onRefresh,
// }) {
//   // ==========================================================
//   // API
//   // ==========================================================

//   const GetLeadsForEditAPI =
//     config.apiUrl + "/TempLead/GetLeadForEdit";

//   // ==========================================================
//   // SESSION / MESSAGE
//   // ==========================================================

//   const { user: sessionUser } = useGetSessionUser();

//   const { showMessage } = useMessageBox();

//   // ==========================================================
//   // VIEW MODAL STATE
//   // ==========================================================

//   const [isModalOpen, setModalOpen] = useState(false);
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [mode, setMode] = useState("create");

//   // ==========================================================
//   // LOADING
//   // ==========================================================

//   const [isLoading, setIsLoading] = useState(false);

//   // ==========================================================
//   // BULK TRANSFER
//   // ==========================================================

//   const [isBulkTransferMode, setIsBulkTransferMode] =
//     useState(false);

//   const [selectedLeadIds, setSelectedLeadIds] = useState([]);

//   const selectAllRef = React.useRef(null);

//   // ==========================================================
//   // TRANSFER MODAL
//   // ==========================================================

//   const [selectedTransferLeads, setSelectedTransferLeads] =
//     useState([]);

//   const [transferredLeadIds, setTransferredLeadIds] =
//     useState([]);

//   const [transferUsers, setTransferUsers] = useState([]);
//   const [loadingUsers, setLoadingUsers] = useState(false);

//   const [leads, setLeads] = useState([]);

//   const [showTransferModal, setShowTransferModal] =
//     useState(false);

//   // ==========================================================
//   // FRONTEND-ONLY LEAD SELECTION DICTIONARY
//   // ==========================================================

//   const leadSelectionMapRef = React.useRef(new Map());

//   const sourceLeadToSelectionKeyMapRef =
//     React.useRef(new WeakMap());

//   const leadToSelectionKeyMapRef =
//     React.useRef(new WeakMap());

//   const generateLeadSelectionKey = (lead) => {
//     const categoryName = (
//       lead?.categoryName || "LEAD"
//     )
//       .trim()
//       .replace(/[^a-zA-Z0-9]/g, "")
//       .toUpperCase();

//     const prefix = (
//       categoryName.slice(0, 3) || "LEA"
//     ).padEnd(3, "X");

//     let key;

//     do {
//       const randomNumber = Math.floor(
//         Math.random() * 100000000
//       );

//       key = `${prefix}_${randomNumber}`;
//     } while (
//       leadSelectionMapRef.current.has(key)
//     );

//     return key;
//   };

//   const getOrCreateSelectionKey = (sourceLead) => {
//     if (!sourceLead) {
//       return null;
//     }

//     const existingKey =
//       sourceLeadToSelectionKeyMapRef.current.get(
//         sourceLead
//       );

//     if (existingKey) {
//       return existingKey;
//     }

//     const newKey =
//       generateLeadSelectionKey(sourceLead);

//     sourceLeadToSelectionKeyMapRef.current.set(
//       sourceLead,
//       newKey
//     );

//     console.log(
//       "[Lead Selection Dictionary] Generated selection key:",
//       {
//         key: newKey,
//         category: sourceLead?.categoryName,
//         leadId: sourceLead?.categoryId,
//       }
//     );

//     return newKey;
//   };

//   // ==========================================================
//   // SELECTED COUNT
//   // ==========================================================

//   const selectedCount = selectedLeadIds.filter(
//     (selectionKey) =>
//       leadSelectionMapRef.current.has(selectionKey)
//   ).length;

//   // ==========================================================
//   // TRANSFER CONFIRMATION
//   // ==========================================================

//   const [
//     showTransferConfirmation,
//     setShowTransferConfirmation,
//   ] = useState(false);

//   const [
//     transferConfirmationMessage,
//     setTransferConfirmationMessage,
//   ] = useState("");

//   const [
//     pendingTransferLeads,
//     setPendingTransferLeads,
//   ] = useState([]);

//   // ==========================================================
//   // BULK REOPEN STATE
//   // ==========================================================

//   const [isBulkReopenMode, setIsBulkReopenMode] =
//     useState(false);

//   const [selectedReopenLeads, setSelectedReopenLeads] =
//     useState([]);

//   const [
//     showReopenConfirmation,
//     setShowReopenConfirmation,
//   ] = useState(false);

//   const [
//     reopenConfirmationMessage,
//     setReopenConfirmationMessage,
//   ] = useState("");

//   const [
//     pendingReopenLeads,
//     setPendingReopenLeads,
//   ] = useState([]);

//   const [showReopenModal, setShowReopenModal] =
//     useState(false);

//   // ==========================================================
//   // LOCALLY REOPENED LEADS
//   //
//   // Stores the latest lead object returned by the reopen API
//   // together with its original frontend SelectionKey.
//   //
//   // IMPORTANT:
//   // The SelectionKey remains unchanged during the entire
//   // reopen operation.
//   //
//   // Same SelectionKey = same UI row.
//   // ==========================================================

//   const [
//     reopenedLeadEntries,
//     setReopenedLeadEntries,
//   ] = useState([]);

//   // ==========================================================
//   // CONFIRM SPECIAL STATUS TRANSFER
//   // ==========================================================

//   const confirmSpecialStatusTransfer = (
//     leadsToTransfer
//   ) => {
//     const confirmedLeads =
//       leadsToTransfer.filter(
//         (lead) =>
//           (lead?.status || "")
//             .trim()
//             .toLowerCase() === "confirmed"
//       );

//     const lostLeads =
//       leadsToTransfer.filter(
//         (lead) =>
//           (lead?.status || "")
//             .trim()
//             .toLowerCase() === "lost"
//       );

//     if (
//       !confirmedLeads.length &&
//       !lostLeads.length
//     ) {
//       return false;
//     }

//     const categories = [
//       ...new Set(
//         leadsToTransfer
//           .map((lead) =>
//             (lead?.categoryName || "").trim()
//           )
//           .filter(Boolean)
//       ),
//     ];

//     const categoryText =
//       categories.length === 1
//         ? categories[0]
//         : categories.length === 2
//           ? `${categories[0]} and ${categories[1]}`
//           : categories.length > 2
//             ? `${categories
//               .slice(0, -1)
//               .join(", ")} and ${categories[categories.length - 1]
//             }`
//             : "the selected";

//     const parts = [];

//     if (confirmedLeads.length) {
//       parts.push(
//         `${confirmedLeads.length} Confirmed lead${confirmedLeads.length > 1 ? "s" : ""
//         }`
//       );
//     }

//     if (lostLeads.length) {
//       parts.push(
//         `${lostLeads.length} Lost lead${lostLeads.length > 1 ? "s" : ""
//         }`
//       );
//     }

//     const count =
//       confirmedLeads.length +
//       lostLeads.length;

//     const message = `You have selected ${categoryText} leads for transfer.

// ${parts.join(" and ")} ${count === 1 ? "is" : "are"
//       } included in the selected leads.

// Are you sure you want to continue with the transfer?`;

//     setPendingTransferLeads(leadsToTransfer);
//     setTransferConfirmationMessage(message);
//     setShowTransferConfirmation(true);

//     return true;
//   };

//   const handleTransferConfirmationYes = () => {
//     const leadsToTransfer =
//       pendingTransferLeads;

//     setShowTransferConfirmation(false);
//     setPendingTransferLeads([]);
//     setTransferConfirmationMessage("");

//     if (!leadsToTransfer.length) {
//       return;
//     }

//     setSelectedTransferLeads(
//       leadsToTransfer
//     );

//    console.log("Opening transfer modal for leads:", leadsToTransfer);

//     setShowTransferModal(true);

//     loadTransferUsers();
//   };

//   const handleTransferConfirmationNo = () => {
//     setShowTransferConfirmation(false);
//     setPendingTransferLeads([]);
//     setTransferConfirmationMessage("");
//   };

//   // ==========================================================
//   // REOPEN CONFIRMATION
//   // ==========================================================

//   const confirmBulkReopen = (
//     leadsToReopen
//   ) => {
//     const counts = {
//       closed: 0,
//       lost: 0,
//       postponed: 0,
//       confirmed: 0,
//     };

//     leadsToReopen.forEach((lead) => {
//       const status = (
//         lead?.status || ""
//       )
//         .trim()
//         .toLowerCase();

//       if (status === "closed") {
//         counts.closed++;
//       }

//       if (status === "lost") {
//         counts.lost++;
//       }

//       if (status === "postponed") {
//         counts.postponed++;
//       }

//       if (status === "confirmed") {
//         counts.confirmed++;
//       }
//     });

//     const categories = [
//       ...new Set(
//         leadsToReopen
//           .map((lead) =>
//             (lead?.categoryName || "").trim()
//           )
//           .filter(Boolean)
//       ),
//     ];

//     const categoryText =
//       categories.length === 1
//         ? categories[0]
//         : categories.length === 2
//           ? `${categories[0]} and ${categories[1]}`
//           : categories.length > 2
//             ? `${categories
//               .slice(0, -1)
//               .join(", ")} and ${categories[categories.length - 1]
//             }`
//             : "the selected";

//     const parts = [];

//     if (counts.closed) {
//       parts.push(
//         `${counts.closed} Closed lead${counts.closed > 1 ? "s" : ""
//         }`
//       );
//     }

//     if (counts.lost) {
//       parts.push(
//         `${counts.lost} Lost lead${counts.lost > 1 ? "s" : ""
//         }`
//       );
//     }

//     if (counts.postponed) {
//       parts.push(
//         `${counts.postponed} Postponed lead${counts.postponed > 1 ? "s" : ""
//         }`
//       );
//     }

//     if (counts.confirmed) {
//       parts.push(
//         `${counts.confirmed} Confirmed lead${counts.confirmed > 1 ? "s" : ""
//         }`
//       );
//     }

//     const count = leadsToReopen.length;

//     const message = `You have selected ${categoryText} leads to reopen.

// ${parts.join(", ")} ${count === 1 ? "is" : "are"
//       } included in the selected leads.

// Are you sure you want to continue with reopening these leads?`;

//     setPendingReopenLeads(
//       leadsToReopen
//     );

//     setReopenConfirmationMessage(
//       message
//     );

//     setShowReopenConfirmation(true);

//     return true;
//   };

//   // ==========================================================
//   // SINGLE REOPEN
//   // ==========================================================

//   const openReopenModal = (lead) => {
//     if (
//       !SHOW_REOPEN_OPTIONS ||
//       !isLeadReopenable(lead)
//     ) {
//       showMessage(
//         "You do not have permission to reopen this lead.",
//         MESSAGE_TYPES.WARNING
//       );

//       return;
//     }

//     setSelectedReopenLeads([lead]);

//     setShowReopenModal(true);
//   };

//   // ==========================================================
//   // REOPEN CONFIRMATION YES
//   // ==========================================================

//   const handleReopenConfirmationYes = () => {
//     const leadsToReopen =
//       pendingReopenLeads;

//     setShowReopenConfirmation(false);
//     setPendingReopenLeads([]);
//     setReopenConfirmationMessage("");

//     if (!leadsToReopen.length) {
//       return;
//     }

//     setSelectedReopenLeads(
//       leadsToReopen
//     );

//     setShowReopenModal(true);
//   };

//   // ==========================================================
//   // REOPEN CONFIRMATION NO
//   // ==========================================================

//   const handleReopenConfirmationNo = () => {
//     setShowReopenConfirmation(false);
//     setPendingReopenLeads([]);
//     setReopenConfirmationMessage("");
//   };

//   // ==========================================================
//   // BULK REOPEN CLICK
//   // ==========================================================

//   const handleBulkReopenClick = () => {
//     if (
//       !SHOW_REOPEN_OPTIONS ||
//       !selectedLeadIds.length
//     ) {
//       return;
//     }

//     const leadsToReopen =
//       selectedLeadIds
//         .map((selectionKey) =>
//           leadSelectionMapRef.current.get(
//             selectionKey
//           )
//         )
//         .filter(Boolean);

//     if (!leadsToReopen.length) {
//       return;
//     }

//     const nonReopenable =
//       leadsToReopen.filter(
//         (lead) => !isLeadReopenable(lead)
//       );

//     if (nonReopenable.length) {
//       showMessage(
//         "One or more selected leads cannot be reopened based on your current reopen permissions.",
//         MESSAGE_TYPES.WARNING
//       );

//       return;
//     }

//     if (
//       confirmBulkReopen(
//         leadsToReopen
//       )
//     ) {
//       return;
//     }
//   };

//   const exitBulkReopenMode = () => {
//     setIsBulkReopenMode(false);
//     setSelectedLeadIds([]);
//   };

//   // ==========================================================
//   // SINGLE LEAD TRANSFER
//   // ==========================================================

//   const openTransferModal = (lead) => {
//     if (!SHOW_TRANSFER_OPTIONS) {
//       return;
//     }

//     if (!isLeadTransferable(lead)) {
//       showMessage(
//         "You do not have permission to transfer this lead.",
//         MESSAGE_TYPES.WARNING
//       );

//       return;
//     }

//     const confirmationShown =
//       confirmSpecialStatusTransfer([
//         lead,
//       ]);

//     if (confirmationShown) {
//       return;
//     }

//     setSelectedTransferLeads([
//       lead,
//     ]);

//     setShowTransferModal(true);

//     loadTransferUsers();
//   };

//   // ==========================================================
//   // BULK TRANSFER
//   // ==========================================================

//   const handleBulkTransferClick = () => {
//     if (!SHOW_TRANSFER_OPTIONS) {
//       return;
//     }

//     if (!selectedLeadIds.length) {
//       return;
//     }

//     const leadsToTransfer =
//       selectedLeadIds
//         .map((selectionKey) =>
//           leadSelectionMapRef.current.get(
//             selectionKey
//           )
//         )
//         .filter(Boolean);

//     if (!leadsToTransfer.length) {
//       return;
//     }

//     const nonTransferableLeads =
//       leadsToTransfer.filter(
//         (lead) =>
//           !isLeadTransferable(lead)
//       );

//     if (
//       nonTransferableLeads.length > 0
//     ) {
//       showMessage(
//         "One or more selected leads cannot be transferred based on your current transfer permissions.",
//         MESSAGE_TYPES.WARNING
//       );

//       return;
//     }

//     const categories = [
//       ...new Set(
//         leadsToTransfer
//           .map((lead) =>
//             (lead?.categoryName || "")
//               .trim()
//           )
//           .filter(Boolean)
//       ),
//     ];

//     if (categories.length > 1) {
//       const categoryText =
//         categories.length === 2
//           ? `${categories[0]} and ${categories[1]}`
//           : `${categories
//             .slice(0, -1)
//             .join(", ")} and ${categories[
//           categories.length - 1
//           ]
//           }`;

//       showMessage(
//         `You have selected ${categoryText} leads. Bulk transfer is allowed only for leads from one category at a time. Please select leads from only one category.`,
//         MESSAGE_TYPES.WARNING
//       );

//       return;
//     }

//     const confirmationShown =
//       confirmSpecialStatusTransfer(
//         leadsToTransfer
//       );

//     if (confirmationShown) {
//       return;
//     }

//     setSelectedTransferLeads(
//       leadsToTransfer
//     );

//     setShowTransferModal(true);

//     loadTransferUsers();
//   };

//   // ==========================================================
//   // SUCCESSFUL TRANSFER
//   // ==========================================================

//   const handleTransfer = async (
//     transferResult
//   ) => {
//     if (!transferResult) {
//       return;
//     }

//     const leadIds =
//       Array.isArray(
//         transferResult.leadIds
//       )
//         ? transferResult.leadIds
//         : transferResult.leadIds
//           ? [transferResult.leadIds]
//           : [];

//     if (!leadIds.length) {
//       return;
//     }

//     const transferredSelectionKeys =
//       selectedTransferLeads
//         .map((lead) =>
//           leadToSelectionKeyMapRef.current.get(
//             lead
//           )
//         )
//         .filter(Boolean);

//     setTransferredLeadIds(
//       (prev) => [
//         ...new Set([
//           ...prev,
//           ...transferredSelectionKeys,
//         ]),
//       ]
//     );

//     setSelectedLeadIds(
//       (prev) =>
//         prev.filter(
//           (selectionKey) =>
//             !transferredSelectionKeys.includes(
//               selectionKey
//             )
//         )
//     );

//     setShowTransferModal(false);
//     setSelectedTransferLeads([]);
//   };

//   // ==========================================================
//   // LOAD TRANSFER USERS
//   // ==========================================================

//   const loadTransferUsers = async () => {
//     if (transferUsers.length > 0) {
//       return;
//     }

//     // Existing transfer-user API can remain here.
//   };

//   // ==========================================================
//   // REFRESH
//   // ==========================================================

//   const handleRefresh = async () => {
//     try {
//       leadSelectionMapRef.current.clear();

//       leadToSelectionKeyMapRef.current =
//         new WeakMap();

//       setTransferredLeadIds([]);
//       setSelectedLeadIds([]);
//       setSelectedTransferLeads([]);

//       setIsBulkTransferMode(false);
//       setIsBulkReopenMode(false);

//       setSelectedReopenLeads([]);
//       setReopenedLeadEntries([]);

//       setShowReopenModal(false);
//       setShowReopenConfirmation(false);

//       if (
//         typeof onRefresh === "function"
//       ) {
//         await onRefresh();
//       } else {
//         showMessage(
//           "Refresh is not configured for this screen.",
//           MESSAGE_TYPES.WARNING
//         );
//       }
//     } catch (error) {
//       console.error(
//         "Error refreshing lead data:",
//         error
//       );

//       showMessage(
//         "Unable to refresh lead data.",
//         MESSAGE_TYPES.ERROR
//       );
//     }
//   };

//   // ==========================================================
//   // FLATTEN LEADS
//   //
//   // IMPORTANT:
//   //
//   // selectionKey is the ONLY frontend identity of a lead.
//   //
//   // If a lead is reopened:
//   //
//   //     OLD:
//   //     HOL_12345678 -> Lost
//   //
//   //     NEW:
//   //     HOL_12345678 -> Open
//   //
//   // the NEW object replaces the OLD object in the Map.
//   //
//   // Therefore we never have two rows for the same lead.
//   // ==========================================================

//   const allLeads = useMemo(() => {
//     const leadMap = new Map();

//     (users || []).forEach((u) => {
//       const combinedLeads = [
//         ...(u.openLeads || []),
//         ...(u.confirmedLeads || []),
//         ...(u.lostLeads || []),
//         ...(u.postponedLeads || []),
//       ];

//       combinedLeads.forEach((lead) => {
//         const selectionKey = getOrCreateSelectionKey(lead);

//         if (!selectionKey) return;

//         // const displayedStatus =
//         //   lead?.status ||
//         //   (
//         //     lead?.histories?.length > 0
//         //       ? lead.histories[0].statusDescription
//         //       : lead?.statusDescription
//         //   );

//         const displayedStatus = lead?.statusDescription || "";

//         const row = {
//           ...lead,
//           assignedTo: u.firstName,
//           status: displayedStatus,
//           leadAssignedTo: u.userID,
//         };

//         leadMap.set(selectionKey, row);

//         // IMPORTANT:
//         // Keep the existing selection-key mapping.
//         leadSelectionMapRef.current.set(selectionKey, row);
//         leadToSelectionKeyMapRef.current.set(row, selectionKey);
//       });
//     });

//     // Backend returned SelectionKey + updated Lead.
//     // Replace the old object using SAME key.
//     reopenedLeadEntries.forEach((entry) => {
//       if (!entry?.selectionKey || !entry?.lead) return;

//       // const reopenedRow = {
//       //   ...entry.lead,
//       //   status:
//       //     entry.lead?.status ||
//       //     (
//       //       entry.lead?.histories?.length > 0
//       //         ? entry.lead.histories[0].statusDescription
//       //         : entry.lead?.statusDescription
//       //     ) ||
//       //     "Open",
//       // };

//       const reopenedRow = {
//         ...entry.lead,
//         status: entry.lead?.statusDescription || "",
//       };

//       leadMap.set(entry.selectionKey, reopenedRow);

//       // Replace the object for the SAME selection key.
//       leadSelectionMapRef.current.set(
//         entry.selectionKey,
//         reopenedRow
//       );

//       leadToSelectionKeyMapRef.current.set(
//         reopenedRow,
//         entry.selectionKey
//       );
//     });

//     return Array.from(leadMap.values());
//   }, [users, reopenedLeadEntries]);

//   // ==========================================================
//   // REMOVE TRANSFERRED LEADS
//   //
//   // Reopened leads are NOT separately removed here.
//   //
//   // The reopened object already replaced the old object in
//   // allLeads using the SAME SelectionKey.
//   // ==========================================================

//   const visibleAllLeads = useMemo(() => {
//     if (!transferredLeadIds.length) {
//       return allLeads;
//     }

//     return allLeads.filter((lead) => {
//       const selectionKey =
//         leadToSelectionKeyMapRef.current.get(
//           lead
//         );

//       // ------------------------------------------------------
//       // TRANSFERRED LEAD
//       // ------------------------------------------------------

//       if (
//         transferredLeadIds.includes(
//           selectionKey
//         )
//       ) {
//         return false;
//       }

//       return true;
//     });
//   }, [
//     allLeads,
//     transferredLeadIds,
//   ]);

//   // ==========================================================
//   // VIEW LEAD
//   // ==========================================================

//   const handleViewClick = async (
//     lead
//   ) => {
//     setIsLoading(true);

//     try {
//       const templead =
//         await fetchLeadDetails(
//           lead
//         );

//       setSelectedLead(
//         templead
//       );

//       setMode("view");
//       setModalOpen(true);
//     } catch {
//       showMessage(
//         "Exception thrown.",
//         MESSAGE_TYPES.ERROR
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ==========================================================
//   // FETCH LEAD DETAILS
//   // ==========================================================

//   async function fetchLeadDetails(
//     lead
//   ) {
//     try {
//       const res = await axios.post(
//         GetLeadsForEditAPI,
//         lead,
//         {
//           headers: {
//             Authorization:
//               `Bearer ${sessionUser.token}`,

//             "Content-Type":
//               "application/json",
//           },
//         }
//       );

//       if (
//         res &&
//         res.data
//       ) {
//         return res.data;
//       }

//       showMessage(
//         "Empty response from server.",
//         MESSAGE_TYPES.WARNING
//       );

//       return null;
//     } catch (error) {
//       const message =
//         error.response?.data ||
//         error.response?.statusText ||
//         error.message ||
//         "Unknown error";

//       showMessage(
//         "Error fetching Lead for edit." +
//         JSON.stringify(message),
//         MESSAGE_TYPES.ERROR
//       );

//       return null;
//     }
//   }

//   // ==========================================================
//   // FILTER STATE
//   // ==========================================================

//   const [filters, setFilters] =
//     useState(EMPTY_FILTERS);

//   const [nameSearch, setNameSearch] =
//     useState("");

//   const [sortConfig, setSortConfig] =
//     useState({
//       key: null,
//       direction: "asc",
//     });

//   const [followUpSels, setFollowUpSels] =
//     useState([]);

//   const [travelDateSels, setTravelDateSel] =
//     useState([]);

//   // ==========================================================
//   // FOLLOW-UP DATE FILTER
//   // ==========================================================

//   const inFollowUp = (lead) => {
//     if (!followUpSels.length) {
//       return true;
//     }

//     if (!lead.followUpDate) {
//       return false;
//     }

//     const d = new Date(
//       lead.followUpDate
//     )
//       .toISOString()
//       .split("T")[0];

//     return followUpSels.some(
//       (s) => {
//         if (s.type === "single") {
//           return s.date === d;
//         }

//         const [a, b] =
//           [s.from, s.to].sort();

//         return (
//           d >= a &&
//           d <= b
//         );
//       }
//     );
//   };

//   // ==========================================================
//   // TRAVEL DATE FILTER
//   // ==========================================================

//   const inTravelDate = (lead) => {
//     if (!travelDateSels.length) {
//       return true;
//     }

//     if (
//       !lead.category
//         ?.preferredTravelDate
//     ) {
//       return false;
//     }

//     const d = new Date(
//       lead.category
//         .preferredTravelDate
//     )
//       .toISOString()
//       .split("T")[0];

//     return travelDateSels.some(
//       (s) => {
//         if (s.type === "single") {
//           return s.date === d;
//         }

//         const [a, b] =
//           [s.from, s.to].sort();

//         return (
//           d >= a &&
//           d <= b
//         );
//       }
//     );
//   };

//   // ==========================================================
//   // NAME SEARCH
//   // ==========================================================

//   const matchesName = (lead) =>
//     !nameSearch ||
//     `${lead.fName || ""} ${lead.lName || ""
//       }`
//       .toLowerCase()
//       .includes(
//         nameSearch.toLowerCase()
//       );

//   // ==========================================================
//   // COMMON FILTER MATCHING
//   // ==========================================================

//   const leadMatchesFilters = (
//     lead,
//     excludeKey = null
//   ) => {
//     const active = (key) =>
//       key !== excludeKey;

//     return (
//       (
//         active("status") &&
//           filters.status.length
//           ? filters.status.includes(
//             lead.status
//           )
//           : true
//       ) &&

//       (
//         active(
//           "customerTypeDescription"
//         ) &&
//           filters.customerTypeDescription
//             .length
//           ? filters.customerTypeDescription.includes(
//             lead.customerTypeDescription
//           )
//           : true
//       ) &&

//       (
//         active("categoryName") &&
//           filters.categoryName.length
//           ? filters.categoryName.includes(
//             lead.categoryName
//           )
//           : true
//       ) &&

//       (
//         active("assignedTo") &&
//           filters.assignedTo.length
//           ? filters.assignedTo.includes(
//             lead.assignedTo
//           )
//           : true
//       ) &&

//       (
//         active("tripType") &&
//           filters.tripType.length
//           ? filters.tripType.includes(
//             getTripType(lead)
//           )
//           : true
//       ) &&

//       (
//         active("leadType") &&
//           filters.leadType.length
//           ? filters.leadType.includes(
//             getLeadType(lead)
//           )
//           : true
//       ) &&

//       (
//         active(
//           "preferredDestination"
//         ) &&
//           filters.preferredDestination
//             .length
//           ? splitDestinations(
//             getDestinations(lead)
//           ).some(
//             (d) =>
//               filters.preferredDestination.includes(
//                 d
//               )
//           )
//           : true
//       ) &&

//       (
//         active("followUpDate")
//           ? inFollowUp(lead)
//           : true
//       ) &&

//       (
//         active("travelDate")
//           ? inTravelDate(lead)
//           : true
//       )
//     );
//   };

//   // ==========================================================
//   // FILTER OPTIONS
//   // ==========================================================

//   const filterOptions = useMemo(() => {
//     const poolFor = (
//       excludeKey
//     ) =>
//       visibleAllLeads.filter(
//         (l) =>
//           leadMatchesFilters(
//             l,
//             excludeKey
//           ) &&
//           matchesName(l)
//       );

//     const getUnique = (
//       key,
//       excludeKey
//     ) =>
//       [
//         ...new Set(
//           poolFor(excludeKey)
//             .map(
//               (l) => l[key]
//             )
//             .filter(Boolean)
//         ),
//       ];

//     const getUniqueDestinations = (
//       excludeKey
//     ) => {
//       const set =
//         new Set();

//       poolFor(
//         excludeKey
//       ).forEach(
//         (l) => {
//           splitDestinations(
//             getDestinations(l)
//           ).forEach(
//             (d) =>
//               set.add(d)
//           );
//         }
//       );

//       return [
//         ...set,
//       ];
//     };

//     return {
//       categoryName:
//         getUnique(
//           "categoryName",
//           "categoryName"
//         ),

//       assignedTo:
//         getUnique(
//           "assignedTo",
//           "assignedTo"
//         ),

//       status:
//         getUnique(
//           "status",
//           "status"
//         ),

//       customerTypeDescription:
//         getUnique(
//           "customerTypeDescription",
//           "customerTypeDescription"
//         ),

//       tripType: [
//         ...new Set(
//           poolFor("tripType")
//             .map(getTripType)
//             .filter(Boolean)
//         ),
//       ],

//       leadType: [
//         ...new Set(
//           poolFor("leadType")
//             .map(getLeadType)
//             .filter(Boolean)
//         ),
//       ],

//       preferredDestination:
//         getUniqueDestinations(
//           "preferredDestination"
//         ),
//     };
//   }, [
//     visibleAllLeads,
//     filters,
//     nameSearch,
//     followUpSels,
//     travelDateSels,
//   ]);

//   // ==========================================================
//   // FILTER CHANGE
//   // ==========================================================

//   const handleFilterChange = (
//     key,
//     value
//   ) => {
//     setFilters((prev) => {
//       if (!ALLOW_MULTI_SELECT) {
//         const isSame =
//           prev[key].length === 1 &&
//           prev[key][0] === value;

//         return {
//           ...prev,
//           [key]:
//             isSame
//               ? []
//               : [value],
//         };
//       }

//       const current =
//         prev[key];

//       const exists =
//         current.includes(value);

//       return {
//         ...prev,
//         [key]: exists
//           ? current.filter(
//             (v) =>
//               v !== value
//           )
//           : [
//             ...current,
//             value,
//           ],
//       };
//     });
//   };

//   // ==========================================================
//   // CLEAR FILTERS
//   // ==========================================================

//   const clearFilters = () => {
//     setFilters(
//       EMPTY_FILTERS
//     );

//     setNameSearch("");
//     setFollowUpSels([]);
//     setTravelDateSel([]);
//   };

//   // ==========================================================
//   // SORTING
//   // ==========================================================

//   const handleSort = (key) => {
//     setSortConfig(
//       (prev) => ({
//         key,

//         direction:
//           prev.key === key &&
//             prev.direction === "asc"
//             ? "desc"
//             : "asc",
//       })
//     );
//   };

//   // ==========================================================
//   // APPLY FILTERS
//   // ==========================================================

//   const filteredLeads =
//     useMemo(() => {
//       return visibleAllLeads.filter(
//         (lead) =>
//           leadMatchesFilters(
//             lead
//           ) &&
//           matchesName(lead)
//       );
//     }, [
//       visibleAllLeads,
//       filters,
//       nameSearch,
//       followUpSels,
//       travelDateSels,
//     ]);

//   // ==========================================================
//   // APPLY SORT
//   // ==========================================================

//   const sortedLeads =
//     useMemo(() => {
//       if (!sortConfig.key) {
//         return filteredLeads;
//       }

//       const {
//         key,
//         direction,
//       } = sortConfig;

//       const dir =
//         direction === "asc"
//           ? 1
//           : -1;

//       const dateKeys = [
//         "createdAt",
//         "updatedAt",
//         "latestUpdateAt",
//         "followUpDate",
//         "travelDate",
//       ];

//       return [
//         ...filteredLeads,
//       ].sort((a, b) => {
//         let valA =
//           key ===
//             "latestUpdateAt"
//             ? getLatestUpdate(a)
//             : key ===
//               "travelDate"
//               ? a.category
//                 ?.preferredTravelDate
//               : a[key];

//         let valB =
//           key ===
//             "latestUpdateAt"
//             ? getLatestUpdate(b)
//             : key ===
//               "travelDate"
//               ? b.category
//                 ?.preferredTravelDate
//               : b[key];

//         if (
//           dateKeys.includes(key)
//         ) {
//           valA = valA
//             ? new Date(
//               valA
//             ).getTime()
//             : 0;

//           valB = valB
//             ? new Date(
//               valB
//             ).getTime()
//             : 0;

//           return (
//             valA - valB
//           ) * dir;
//         }

//         valA = (
//           valA ?? ""
//         )
//           .toString()
//           .toLowerCase();

//         valB = (
//           valB ?? ""
//         )
//           .toString()
//           .toLowerCase();

//         if (
//           valA < valB
//         ) {
//           return -1 * dir;
//         }

//         if (
//           valA > valB
//         ) {
//           return 1 * dir;
//         }

//         return 0;
//       });
//     }, [
//       filteredLeads,
//       sortConfig,
//     ]);

//   // ==========================================================
//   // BULK SELECTION
//   // ==========================================================

//   const selectableSortedLeads =
//     useMemo(() => {
//       if (isBulkReopenMode) {
//         return sortedLeads.filter(
//           isLeadReopenable
//         );
//       }

//       if (isBulkTransferMode) {
//         return sortedLeads.filter(
//           isLeadTransferable
//         );
//       }

//       return [];
//     }, [
//       sortedLeads,
//       isBulkTransferMode,
//       isBulkReopenMode,
//     ]);

//   const selectableKeys =
//     useMemo(
//       () =>
//         selectableSortedLeads
//           .map((lead) =>
//             leadToSelectionKeyMapRef.current.get(
//               lead
//             )
//           )
//           .filter(Boolean),
//       [selectableSortedLeads]
//     );

//   const allSelected =
//     selectableKeys.length > 0 &&
//     selectableKeys.every(
//       (key) =>
//         selectedLeadIds.includes(
//           key
//         )
//     );

//   const someSelected =
//     selectableKeys.some(
//       (key) =>
//         selectedLeadIds.includes(
//           key
//         )
//     ) && !allSelected;

//   React.useEffect(() => {
//     if (selectAllRef.current) {
//       selectAllRef.current.indeterminate =
//         someSelected;
//     }
//   }, [someSelected]);

//   const toggleSelectAll = () => {
//     setSelectedLeadIds(
//       (prev) => {
//         if (
//           selectableKeys.length > 0 &&
//           selectableKeys.every(
//             (key) =>
//               prev.includes(key)
//           )
//         ) {
//           return prev.filter(
//             (key) =>
//               !selectableKeys.includes(
//                 key
//               )
//           );
//         }

//         return [
//           ...new Set([
//             ...prev,
//             ...selectableKeys,
//           ]),
//         ];
//       }
//     );
//   };

//   const toggleLeadSelected = (
//     selectionKey
//   ) => {
//     setSelectedLeadIds(
//       (prev) =>
//         prev.includes(
//           selectionKey
//         )
//           ? prev.filter(
//             (key) =>
//               key !== selectionKey
//           )
//           : [
//             ...prev,
//             selectionKey,
//           ]
//     );
//   };

//   // ==========================================================
//   // EXIT BULK MODE
//   // ==========================================================

//   const exitBulkMode = () => {
//     setIsBulkTransferMode(false);
//     setIsBulkReopenMode(false);
//     setSelectedLeadIds([]);
//   };

//   // ==========================================================
//   // HOLIDAY DETECTION
//   // ==========================================================

//   const categoryFilteredLeads =
//     useMemo(
//       () =>
//         filters.categoryName.length
//           ? visibleAllLeads.filter(
//             (l) =>
//               filters.categoryName.includes(
//                 l.categoryName
//               )
//           )
//           : visibleAllLeads,
//       [
//         visibleAllLeads,
//         filters.categoryName,
//       ]
//     );

//   const isHolidayRelevant =
//     useMemo(
//       () =>
//         categoryFilteredLeads.some(
//           isHolidayLead
//         ),
//       [categoryFilteredLeads]
//     );

//   React.useEffect(() => {
//     if (!isHolidayRelevant) {
//       setFilters((prev) =>
//         prev.tripType.length ||
//           prev.leadType.length ||
//           prev.preferredDestination
//             .length
//           ? {
//             ...prev,
//             tripType: [],
//             leadType: [],
//             preferredDestination:
//               [],
//           }
//           : prev
//       );

//       setTravelDateSel(
//         (prev) =>
//           prev.length
//             ? []
//             : prev
//       );

//       setSortConfig(
//         (prev) =>
//           prev.key ===
//             "travelDate"
//             ? {
//               key: null,
//               direction: "asc",
//             }
//             : prev
//       );
//     }
//   }, [isHolidayRelevant]);

//   // ==========================================================
//   // FILTER KEYS
//   // ==========================================================

//   const visibleFilterKeys =
//     isHolidayRelevant
//       ? [
//         ...BASE_FILTER_KEYS,
//         ...HOLIDAY_FILTER_KEYS,
//       ]
//       : BASE_FILTER_KEYS;


//       // ==========================================================
// // CREATE TRANSFER ENTRIES
// //
// // IMPORTANT:
// // We send:
// // [
// //   {
// //     selectionKey: "...",
// //     lead: lead1
// //   }
// // ]
// //
// // DashboardRowDto / lead object is NOT modified.
// // ==========================================================

// const selectedTransferLeadEntries = useMemo(() => {

//   return selectedTransferLeads
//     .map((lead) => {
//       const selectionKey =
//         leadToSelectionKeyMapRef.current.get(lead);

//       if (!selectionKey) {
//         return null;
//       }

//       return {
//         selectionKey,
//         lead,
//       };
//     })
//     .filter(Boolean);


// }, [selectedTransferLeads]);
//   // ==========================================================
//   // CREATE REOPEN ENTRIES
//   //
//   // IMPORTANT:
//   //
//   // We send:
//   //
//   // [
//   //   {
//   //     selectionKey: "...",
//   //     lead: lead1
//   //   }
//   // ]
//   //
//   // The backend must return the same SelectionKey.
//   // ==========================================================

//   const selectedReopenLeadEntries = useMemo(() => {
//     return selectedReopenLeads
//       .map((lead) => {
//         const selectionKey =
//           leadToSelectionKeyMapRef.current.get(
//             lead
//           );

//         if (!selectionKey) {
//           return null;
//         }

//         return {
//           selectionKey,
//           lead,
//         };
//       })
//       .filter(Boolean);
//   }, [selectedReopenLeads]);

//   // ==========================================================
//   // HANDLE SUCCESSFUL REOPEN
//   //
//   // Backend response:
//   //
//   // {
//   //   selectionKey: "...",
//   //   lead: { ... }
//   // }
//   //
//   // The backend's SelectionKey is used directly.
//   // It is NEVER regenerated here.
//   // ==========================================================

//   const handleReopened = async ({
//     reopenedEntries,
//     reason,
//     response,
//   }) => {
//     console.log(
//       "Reopen API returned entries:",
//       reopenedEntries
//     );

//     console.log(
//       "Reopen API response:",
//       response
//     );

//     // ========================================================
//     // BASIC VALIDATION
//     // ========================================================

//     if (
//       !Array.isArray(reopenedEntries) ||
//       reopenedEntries.length === 0
//     ) {
//       console.warn(
//         "Reopen succeeded but no entries were returned."
//       );

//       return;
//     }

//     // ========================================================
//     // VALIDATE RESPONSE
//     //
//     // Backend property:
//     //
//     //     SelectionKey
//     //
//     // ASP.NET JSON camelCase:
//     //
//     //     selectionKey
//     //
//     // Lead:
//     //
//     //     lead
//     // ========================================================

//     const validEntries = reopenedEntries
//       .filter(
//         (entry) =>
//           entry?.selectionKey &&
//           entry?.lead
//       )
//       .map((entry) => ({
//         selectionKey:
//           entry.selectionKey,

//         lead:
//           entry.lead,
//       }));

//     // ========================================================
//     // NO VALID ENTRIES
//     // ========================================================

//     if (validEntries.length === 0) {
//       console.warn(
//         "Reopen succeeded but no valid SelectionKey + Lead entries were returned."
//       );

//       return;
//     }

//     // ========================================================
//     // GET RETURNED KEYS
//     // ========================================================

//     const returnedSelectionKeys =
//       validEntries.map(
//         (entry) =>
//           entry.selectionKey
//       );

//     console.log(
//       "Selection keys returned by reopen API:",
//       returnedSelectionKeys
//     );

//     // ========================================================
//     // STORE UPDATED OPEN LEADS
//     //
//     // Map is keyed by SelectionKey.
//     //
//     // If the key already exists:
//     //
//     //     OLD Lead object
//     //          ↓
//     //     NEW Lead object
//     //
//     // The NEW object replaces the OLD object.
//     // ========================================================

//     setReopenedLeadEntries((prev) => {
//       const map = new Map(
//         prev.map((entry) => [
//           entry.selectionKey,
//           entry,
//         ])
//       );

//       validEntries.forEach((entry) => {
//         map.set(
//           entry.selectionKey,
//           entry
//         );
//       });

//       return Array.from(
//         map.values()
//       );
//     });

//     // ========================================================
//     // REMOVE FROM CURRENT CHECKBOX SELECTION
//     // ========================================================

//     setSelectedLeadIds((prev) =>
//       prev.filter(
//         (key) =>
//           !returnedSelectionKeys.includes(
//             key
//           )
//       )
//     );

//     // ========================================================
//     // CLEAR REOPEN SELECTION
//     // ========================================================

//     setSelectedReopenLeads([]);

//     setShowReopenModal(false);

//     console.log(
//       "Reopened leads replaced successfully:",
//       {
//         returnedSelectionKeys,
//         validEntries,
//         reason,
//       }
//     );
//   };

//   // ==========================================================
//   // RENDER
//   // ==========================================================

//   return (
//     <div className="flex flex-col h-full">
//       <LoadingOverlay
//         visible={isLoading}
//       />

//       {/* ======================================================
//           FILTER BAR
//       ====================================================== */}

//       <div
//         className="
//           bg-gray-50
//           border
//           rounded-lg
//           flex-shrink-0
//           p-2
//         "
//       >
//         <div
//           className="
//             grid
//             grid-cols-[15fr_15fr_15fr_15fr_15fr_33fr_10fr]
//             grid-rows-[38px_38px]
//             gap-x-2
//             gap-y-2
//             items-center
//             w-full
//           "
//         >
//           <div
//             className="
//               col-start-1
//               row-start-1
//               row-span-2
//               flex
//               items-center
//               w-full
//               min-w-0
//             "
//           >
//             <input
//               type="text"
//               placeholder="Search by Name"
//               value={nameSearch}
//               onChange={(e) =>
//                 setNameSearch(
//                   e.target.value
//                 )
//               }
//               className="
//                 w-full
//                 min-w-0
//                 rounded
//                 px-2
//                 py-1.5
//                 text-sm
//                 focus:outline-none
//                 focus:ring-2
//                 bg-white
//                 border
//                 border-gray-300
//               "
//             />
//           </div>

//           {visibleFilterKeys.map(
//             (key, index) => {
//               const FilterComponent =
//                 key ===
//                   "preferredDestination"
//                   ? SearchableMultiSelectFilter
//                   : MultiSelectFilter;

//               const row =
//                 index < 4
//                   ? 1
//                   : 2;

//               const col =
//                 2 +
//                 (index % 4);

//               return (
//                 <div
//                   key={key}
//                   style={{
//                     gridColumn: col,
//                     gridRow: row,
//                   }}
//                   className="
//                     flex
//                     items-center
//                     w-full
//                     min-w-0
//                   "
//                 >
//                   <FilterComponent
//                     label={
//                       FILTER_LABELS[
//                       key
//                       ] || key
//                     }
//                     options={
//                       filterOptions[
//                       key
//                       ]
//                     }
//                     selected={
//                       filters[key]
//                     }
//                     onToggle={(
//                       value
//                     ) =>
//                       handleFilterChange(
//                         key,
//                         value
//                       )
//                     }
//                     onClear={() =>
//                       setFilters(
//                         (f) => ({
//                           ...f,
//                           [key]: [],
//                         })
//                       )
//                     }
//                   />
//                 </div>
//               );
//             }
//           )}

//           {isHolidayRelevant && (
//             <div
//               className="
//                 col-start-6
//                 row-start-1
//                 w-full
//                 min-w-0
//                 flex
//                 items-center
//               "
//             >
//               <CalendarFilter
//                 label="Preferred Travel Date"
//                 selections={
//                   travelDateSels
//                 }
//                 onApply={(sels) =>
//                   setTravelDateSel(
//                     sels
//                   )
//                 }
//                 onClear={() =>
//                   setTravelDateSel([])
//                 }
//               />
//             </div>
//           )}

//           <div
//             className="
//               col-start-6
//               row-start-2
//               w-full
//               min-w-0
//               flex
//               items-center
//             "
//           >
//             <CalendarFilter
//               label="Follow-up Date"
//               selections={
//                 followUpSels
//               }
//               onApply={(sels) =>
//                 setFollowUpSels(
//                   sels
//                 )
//               }
//               onClear={() =>
//                 setFollowUpSels([])
//               }
//             />
//           </div>

//           <div
//             className="
//               col-start-7
//               row-start-1
//               row-span-2
//               flex
//               items-center
//               justify-end
//               w-full
//               h-full
//               min-w-0
//             "
//           >
//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 onClick={
//                   clearFilters
//                 }
//                 className="
//                   px-3
//                   py-1.5
//                   text-sm
//                   bg-blue-700
//                   text-white
//                   rounded
//                   hover:bg-blue-800
//                   whitespace-nowrap
//                 "
//               >
//                 Clear Filters
//               </button>

//               <button
//                 type="button"
//                 onClick={
//                   handleRefresh
//                 }
//                 className="
//                   px-3
//                   py-1.5
//                   text-sm
//                   bg-gray-600
//                   text-white
//                   rounded
//                   hover:bg-gray-700
//                   whitespace-nowrap
//                 "
//               >
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ======================================================
//           SUMMARY + BULK ACTIONS
//       ====================================================== */}

//       <div className="flex flex-row mt-2 gap-2 items-stretch flex-shrink-0">
//         <div className="flex-1 min-w-0">
//           <LeadsSummaryBar
//             dateRange={dateRange}
//             leads={sortedLeads}
//           />
//         </div>

//         <div className="w-[30%] shrink-0">
//           {!isBulkTransferMode &&
//             !isBulkReopenMode ? (
//             <div className="w-full h-full flex gap-2">
//               {SHOW_TRANSFER_OPTIONS && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsBulkTransferMode(
//                       true
//                     );

//                     setIsBulkReopenMode(
//                       false
//                     );

//                     setSelectedLeadIds(
//                       []
//                     );
//                   }}
//                   className="
//                     flex-1
//                     h-full
//                     rounded-lg
//                     border border-blue-200
//                     bg-blue-50
//                     px-4
//                     text-sm
//                     font-semibold
//                     text-blue-700
//                     shadow-sm
//                     transition-all
//                     duration-200
//                     hover:bg-blue-100
//                     hover:border-blue-300
//                     hover:text-blue-800
//                     hover:shadow
//                     active:scale-[0.98]
//                     focus:outline-none
//                     focus:ring-2
//                     focus:ring-blue-300
//                     focus:ring-offset-1
//                   "
//                 >
//                   ⇄&nbsp; Bulk Transfer
//                 </button>
//               )}

//               {SHOW_REOPEN_OPTIONS && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsBulkReopenMode(
//                       true
//                     );

//                     setIsBulkTransferMode(
//                       false
//                     );

//                     setSelectedLeadIds(
//                       []
//                     );
//                   }}
//                   className="
//                     flex-1
//                     h-full
//                     rounded-lg
//                     border border-amber-200
//                     bg-amber-50
//                     px-4
//                     text-sm
//                     font-semibold
//                     text-amber-700
//                     shadow-sm
//                     transition-all
//                     duration-200
//                     hover:bg-amber-100
//                     hover:border-amber-300
//                     hover:text-amber-800
//                     hover:shadow
//                     active:scale-[0.98]
//                     focus:outline-none
//                     focus:ring-2
//                     focus:ring-amber-300
//                     focus:ring-offset-1
//                   "
//                 >
//                   ↻&nbsp; Bulk Reopen
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div
//               className={`
//                 w-full
//                 h-full
//                 flex
//                 items-center
//                 justify-between
//                 gap-2
//                 px-3
//                 rounded-lg
//                 border
//                 ${isBulkReopenMode
//                   ? "bg-amber-50 border-amber-100"
//                   : "bg-blue-50 border-blue-100"
//                 }
//               `}
//             >
//               <span
//                 className={`
//                   text-xs
//                   font-medium
//                   whitespace-nowrap
//                   ${isBulkReopenMode
//                     ? "text-amber-700"
//                     : "text-blue-700"
//                   }
//                 `}
//               >
//                 {selectedCount} selected
//               </span>

//               <div className="flex items-center gap-1.5">
//                 <button
//                   type="button"
//                   onClick={
//                     isBulkReopenMode
//                       ? exitBulkReopenMode
//                       : exitBulkMode
//                   }
//                   className="
//                     px-2.5
//                     py-1
//                     text-xs
//                     font-medium
//                     text-gray-600
//                     bg-white
//                     border
//                     border-gray-200
//                     rounded
//                     hover:bg-gray-50
//                     whitespace-nowrap
//                   "
//                 >
//                   Clear
//                 </button>

//                 {isBulkReopenMode ? (
//                   <button
//                     type="button"
//                     onClick={
//                       handleBulkReopenClick
//                     }
//                     disabled={
//                       selectedCount ===
//                       0
//                     }
//                     className="
//                       px-2.5
//                       py-1
//                       text-xs
//                       font-medium
//                       text-white
//                       bg-amber-600
//                       rounded
//                       hover:bg-amber-700
//                       disabled:bg-gray-300
//                       disabled:cursor-not-allowed
//                       whitespace-nowrap
//                     "
//                   >
//                     Reopen
//                   </button>
//                 ) : (
//                   <button
//                     type="button"
//                     onClick={
//                       handleBulkTransferClick
//                     }
//                     disabled={
//                       selectedCount ===
//                       0
//                     }
//                     className="
//                       px-2.5
//                       py-1
//                       text-xs
//                       font-medium
//                       text-white
//                       bg-blue-600
//                       rounded
//                       hover:bg-blue-700
//                       disabled:bg-gray-300
//                       disabled:cursor-not-allowed
//                       whitespace-nowrap
//                     "
//                   >
//                     Transfer
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ======================================================
//           TABLE
//       ====================================================== */}

//       <div
//         className="
//           overflow-auto
//           flex-1
//           border
//           rounded-lg
//           mt-2
//         "
//       >
//         <table
//           className="
//             w-full
//             text-xs
//             border-collapse
//           "
//         >
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">
//                 Sr. No.
//               </th>

//               <SortableHeader
//                 label="Lead Name"
//                 sortKey="fName"
//                 sortConfig={
//                   sortConfig
//                 }
//                 onSort={
//                   handleSort
//                 }
//               />

//               <SortableHeader
//                 label="Category"
//                 sortKey="categoryName"
//                 sortConfig={
//                   sortConfig
//                 }
//                 onSort={
//                   handleSort
//                 }
//               />

//               <SortableHeader
//                 label="Assigned To"
//                 sortKey="assignedTo"
//                 sortConfig={
//                   sortConfig
//                 }
//                 onSort={
//                   handleSort
//                 }
//               />

//               <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">
//                 Lead ID
//               </th>

//               <SortableHeader
//                 label="Status"
//                 sortKey="status"
//                 sortConfig={
//                   sortConfig
//                 }
//                 onSort={
//                   handleSort
//                 }
//               />

//               <SortableHeader
//                 label="Created Date"
//                 sortKey="createdAt"
//                 sortConfig={
//                   sortConfig
//                 }
//                 onSort={
//                   handleSort
//                 }
//               />

//               <SortableHeader
//                 label="Latest Update"
//                 sortKey="latestUpdateAt"
//                 sortConfig={
//                   sortConfig
//                 }
//                 onSort={
//                   handleSort
//                 }
//               />

//               <SortableHeader
//                 label="Customer Type"
//                 sortKey="customerTypeDescription"
//                 sortConfig={
//                   sortConfig
//                 }
//                 onSort={
//                   handleSort
//                 }
//               />

//               {isHolidayRelevant && (
//                 <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">
//                   Trip Type / Lead Type
//                 </th>
//               )}

//               {isHolidayRelevant && (
//                 <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">
//                   Destinations
//                 </th>
//               )}

//               {isHolidayRelevant && (
//                 <SortableHeader
//                   label="Preferred Travel Date"
//                   sortKey="travelDate"
//                   sortConfig={
//                     sortConfig
//                   }
//                   onSort={
//                     handleSort
//                   }
//                 />
//               )}

//               <SortableHeader
//                 label="Follow-up Date"
//                 sortKey="followUpDate"
//                 sortConfig={
//                   sortConfig
//                 }
//                 onSort={
//                   handleSort
//                 }
//               />

//               {SHOW_TRANSFER_OPTIONS && (
//                 <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">
//                   {isBulkTransferMode ? (
//                     <input
//                       ref={
//                         selectAllRef
//                       }
//                       type="checkbox"
//                       checked={
//                         allSelected
//                       }
//                       onChange={
//                         toggleSelectAll
//                       }
//                     />
//                   ) : (
//                     "TransferTo"
//                   )}
//                 </th>
//               )}

//               {SHOW_REOPEN_OPTIONS && (
//                 <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">
//                   {isBulkReopenMode ? (
//                     <input
//                       ref={
//                         selectAllRef
//                       }
//                       type="checkbox"
//                       checked={
//                         allSelected
//                       }
//                       onChange={
//                         toggleSelectAll
//                       }
//                     />
//                   ) : (
//                     "Reopen"
//                   )}
//                 </th>
//               )}

//               <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">
//                 Details
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {sortedLeads.map(
//               (lead, idx) => {
//                 const selectionKey =
//                   leadToSelectionKeyMapRef.current.get(
//                     lead
//                   );

//                 return (
//                   <tr
//                     key={
//                       selectionKey ||
//                       `row-${idx}`
//                     }
//                     className="
//                       border-b
//                       hover:bg-gray-50
//                     "
//                   >
//                     <td className="p-2">
//                       {idx + 1}
//                     </td>

//                     <td className="p-2">
//                       <div className="flex flex-col">
//                         <span className="font-medium">
//                           {lead.title?.trim()}{" "}
//                           {lead.fName}{" "}
//                           {lead.lName}
//                         </span>

//                         {lead.histories &&
//                           lead.histories
//                             .length >
//                           0 &&
//                           lead.histories[0]
//                             .notes && (
//                             <span className="text-xs text-gray-500 mt-0.5 max-w-[225px] break-words">
//                               Notes:{" "}
//                               {
//                                 lead
//                                   .histories[0]
//                                   .notes
//                               }
//                             </span>
//                           )}
//                       </div>
//                     </td>

//                     <td className="p-2">
//                       {lead.categoryName}
//                     </td>

//                     <td className="p-2 font-semibold">
//                       {lead.assignedTo}
//                     </td>

//                     <td className="p-2 text-center">
//                       {lead.categoryId}
//                     </td>

//                     <td
//                       className={`
//                         p-2
//                         font-semibold
//                         ${lead.status ===
//                           "Lost"
//                           ? "text-lostText"
//                           : lead.status ===
//                             "Confirmed"
//                             ? "text-confirmedText"
//                             : lead.status ===
//                               "Postponed"
//                               ? "text-postponedText"
//                               : "text-openText"
//                         }
//                       `}
//                     >
//                       {lead.status}
//                     </td>

//                     <td className="p-2">
//                       {new Date(
//                         lead.createdAt
//                       )
//                         .toLocaleDateString(
//                           "en-GB"
//                         )
//                         .replace(
//                           /\//g,
//                           "-"
//                         )}
//                     </td>

//                     <td className="p-2">
//                       {getLatestUpdate(
//                         lead
//                       )
//                         ? new Date(
//                           getLatestUpdate(
//                             lead
//                           )
//                         )
//                           .toLocaleDateString(
//                             "en-GB"
//                           )
//                           .replace(
//                             /\//g,
//                             "-"
//                           )
//                         : "—"}
//                     </td>

//                     <td className="p-2">
//                       {
//                         lead.customerTypeDescription
//                       }
//                     </td>

//                     {isHolidayRelevant && (
//                       <td className="p-2">
//                         {isHolidayLead(
//                           lead
//                         ) ? (
//                           <div className="flex gap-1 flex-wrap">
//                             {getTripType(
//                               lead
//                             ) && (
//                                 <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700">
//                                   {getTripType(
//                                     lead
//                                   )}
//                                 </span>
//                               )}

//                             {getLeadType(
//                               lead
//                             ) && (
//                                 <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700">
//                                   {getLeadType(
//                                     lead
//                                   )}
//                                 </span>
//                               )}
//                           </div>
//                         ) : (
//                           <span className="text-gray-400">
//                             —
//                           </span>
//                         )}
//                       </td>
//                     )}

//                     {isHolidayRelevant && (
//                       <td className="p-2 max-w-[220px]">
//                         {isHolidayLead(
//                           lead
//                         ) &&
//                           getDestinations(
//                             lead
//                           ) ? (
//                           <span className="text-[11px] text-gray-700">
//                             {getDestinations(
//                               lead
//                             )}
//                           </span>
//                         ) : (
//                           <span className="text-gray-400">
//                             —
//                           </span>
//                         )}
//                       </td>
//                     )}

//                     {isHolidayRelevant && (
//                       <td className="p-2 max-w-[220px]">
//                         {isHolidayLead(
//                           lead
//                         ) &&
//                           getTravelDate(
//                             lead
//                           ) ? (
//                           <span className="text-[11px] text-gray-700">
//                             {getTravelDate(
//                               lead
//                             )}
//                           </span>
//                         ) : (
//                           <span className="text-gray-400">
//                             —
//                           </span>
//                         )}
//                       </td>
//                     )}

//                     <td className="p-2">
//                       {lead.followUpDate
//                         ? new Date(
//                           lead.followUpDate
//                         )
//                           .toLocaleDateString(
//                             "en-GB"
//                           )
//                           .replace(
//                             /\//g,
//                             "-"
//                           )
//                         : (
//                           <span className="text-gray-400">
//                             —
//                           </span>
//                         )}
//                     </td>

//                     {/* ==================================================
//                         TRANSFER
//                     ================================================== */}

//                     {SHOW_TRANSFER_OPTIONS && (
//                       <td
//                         className={`p-2 text-center ${isBulkReopenMode
//                             ? "opacity-40"
//                             : ""
//                           }`}
//                       >
//                         {isBulkTransferMode ? (
//                           <input
//                             type="checkbox"
//                             checked={selectedLeadIds.includes(
//                               selectionKey
//                             )}
//                             disabled={
//                               !isLeadTransferable(
//                                 lead
//                               )
//                             }
//                             onChange={() =>
//                               toggleLeadSelected(
//                                 selectionKey
//                               )
//                             }
//                           />
//                         ) : (
//                           <button
//                             className={`
//                               inline-flex
//                               items-center
//                               justify-center
//                               p-1.5
//                               rounded
//                               ${!isLeadTransferable(
//                               lead
//                             ) ||
//                                 isBulkReopenMode
//                                 ? "bg-gray-300 cursor-not-allowed text-white"
//                                 : "bg-blue-600 text-white hover:bg-blue-700"
//                               }
//                             `}
//                             onClick={() =>
//                               openTransferModal(
//                                 lead
//                               )
//                             }
//                             disabled={
//                               !isLeadTransferable(
//                                 lead
//                               ) ||
//                               isBulkReopenMode
//                             }
//                           >
//                             <SwapIcon />
//                           </button>
//                         )}
//                       </td>
//                     )}

//                     {/* ==================================================
//                         REOPEN
//                     ================================================== */}

//                     {SHOW_REOPEN_OPTIONS && (
//                       <td
//                         className={`p-2 text-center ${isBulkTransferMode
//                             ? "opacity-40"
//                             : ""
//                           }`}
//                       >
//                         {isBulkReopenMode ? (
//                           <input
//                             type="checkbox"
//                             checked={selectedLeadIds.includes(
//                               selectionKey
//                             )}
//                             disabled={
//                               !isLeadReopenable(
//                                 lead
//                               )
//                             }
//                             onChange={() =>
//                               toggleLeadSelected(
//                                 selectionKey
//                               )
//                             }
//                           />
//                         ) : (
//                           <button
//                             type="button"
//                             className={`
//                               inline-flex
//                               items-center
//                               justify-center
//                               px-2
//                               py-1.5
//                               rounded
//                               text-xs
//                               font-semibold
//                               ${!isLeadReopenable(
//                               lead
//                             ) ||
//                                 isBulkTransferMode
//                                 ? "bg-gray-300 cursor-not-allowed text-white"
//                                 : "bg-amber-500 text-white hover:bg-amber-600"
//                               }
//                             `}
//                             onClick={() =>
//                               openReopenModal(
//                                 lead
//                               )
//                             }
//                             disabled={
//                               !isLeadReopenable(
//                                 lead
//                               ) ||
//                               isBulkTransferMode
//                             }
//                           >
//                             ↻
//                           </button>
//                         )}
//                       </td>
//                     )}

//                     <td className="p-2">
//                       <button
//                         className="
//                           p-1.5
//                           rounded
//                           text-blue-700
//                           hover:bg-blue-50
//                         "
//                         title="View Details"
//                         onClick={() =>
//                           handleViewClick(
//                             lead
//                           )
//                         }
//                       >
//                         <EyeIcon />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               }
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ======================================================
//           VIEW LEAD MODAL
//       ====================================================== */}

//       <UpdateLeadsModal
//         parent="Leads with filters"
//         isOpen={
//           isModalOpen
//         }
//         onClose={() =>
//           setModalOpen(
//             false
//           )
//         }
//         lead={
//           selectedLead
//         }
//         mode="view"
//       />

//       {/* ======================================================
//           TRANSFER MODAL
//       ====================================================== */}

//       <LeadTransferModal
//         isOpen={
//           showTransferModal
//         }
//         onClose={() => {
//           setShowTransferModal(
//             false
//           );

//           setSelectedTransferLeads(
//             []
//           );
//         }}
//         users={
//           transferUsers
//         }
//         onTransfer={
//           handleTransfer
//         }
//         loadingUsers={
//           loadingUsers
//         }
//        selectedLead={
//     selectedTransferLeadEntries[0] || null
//   }
//   selectedLeads={ selectedTransferLeadEntries }
//       />

//       {/* ======================================================
//           TRANSFER CONFIRMATION
//       ====================================================== */}

//       <MessageBox
//         show={
//           showTransferConfirmation
//         }
//         type={
//           MESSAGE_TYPES.QUESTION
//         }
//         message={
//           transferConfirmationMessage
//         }
//         onClose={
//           handleTransferConfirmationNo
//         }
//         onConfirm={
//           handleTransferConfirmationYes
//         }
//         confirmMode={true}
//       />

//       {/* ======================================================
//           REOPEN CONFIRMATION
//       ====================================================== */}

//       <MessageBox
//         show={
//           showReopenConfirmation
//         }
//         type={
//           MESSAGE_TYPES.QUESTION
//         }
//         message={
//           reopenConfirmationMessage
//         }
//         onClose={
//           handleReopenConfirmationNo
//         }
//         onConfirm={
//           handleReopenConfirmationYes
//         }
//         confirmMode={true}
//       />

//       {/* ======================================================
//           REOPEN MODAL

//           IMPORTANT:
//           We pass BOTH the lead and its frontend SelectionKey.
//       ====================================================== */}

//       {showReopenModal && (
//         <ReOpenLeadModal
//           isOpen={
//             showReopenModal
//           }
//           onClose={() => {
//             setShowReopenModal(
//               false
//             );

//             setSelectedReopenLeads(
//               []
//             );
//           }}
//           selectedLeadEntries={
//             selectedReopenLeadEntries
//           }
//           onReopened={
//             handleReopened
//           }
//         />
//       )}
//     </div>
//   );
// }

// import React, { useMemo, useState } from "react";
// import { CardContent } from "@mui/material";
// import { MESSAGE_TYPES } from "./Constants";
// import axios from "axios";
// import UpdateLeadsModal from "./UpdateLeadsModal";
// import { getEmptyLeadObj } from "./Model/LeadModel";
// import config from "./config";
// import { useMessageBox } from "./Notification";
// import { useGetSessionUser } from "./SessionContext";
// import LeadTransferModal from "./LeadTransferModal";

// import {
//   LoadingOverlay,
//   MultiSelectFilter,
//   SortableHeader,
//   SwapIcon,
//   EyeIcon,
//   splitDestinations,
//   isHolidayLead,
//   getTripType,
//   getLeadType,
//   getDestinations,
//   getLatestUpdate,
//   getTravelDate,
//   CalendarFilter,
//   LeadsSummaryBar,
// } from "./LeadsSharedTable";


// ============================================================
// GENERAL FILTER CONFIGURATION
// ============================================================

// Allow multiple values to be selected in the filters.
// const ALLOW_MULTI_SELECT = true;


// ============================================================
// FILTER LABELS
// ============================================================

// const FILTER_LABELS = {
//   status: "Status",
//   customerTypeDescription: "Customer Type",
//   categoryName: "Category",
//   assignedTo: "Assigned To",
//   tripType: "Domestic/International",
//   leadType: "FIT/GIT",
//   preferredDestination: "Destination",
// };


// ============================================================
// FILTER GROUPS
// ============================================================

// const BASE_FILTER_KEYS = [
//   "categoryName",
//   "assignedTo",
//   "status",
//   "customerTypeDescription",
// ];

// const HOLIDAY_FILTER_KEYS = [
//   "tripType",
//   "leadType",
//   "preferredDestination",
// ];


// ============================================================
// LEAD TRANSFER PERMISSIONS
// ============================================================

// These flags are temporary.

// Later these should come from the DB / SessionContext.

// SHOW_TRANSFER_OPTIONS
//      Master permission.
//      If FALSE -> no transfer UI will be displayed.

// CAN_TRANSFER_CONFIRMED
//      Controls transfer of Confirmed leads.

// CAN_TRANSFER_LOST
//      Controls transfer of Lost leads.

// For now all are TRUE.
// ============================================================

// const SHOW_TRANSFER_OPTIONS = true;

// const CAN_TRANSFER_CONFIRMED = true;

// const CAN_TRANSFER_LOST = true;

// ============================================================
// LEAD REOPEN PERMISSIONS
// ============================================================
// These are intentionally hard-coded for now.
// Later they can come from DB / SessionContext exactly like transfer.
// const SHOW_REOPEN_OPTIONS = true;
// const CAN_REOPEN_CONFIRMED = true;
// const CAN_REOPEN_LOST = true;
// const CAN_REOPEN_POSTPONED = true;
// const CAN_REOPEN_CLOSED = true;


// ============================================================
// CHECK WHETHER A LEAD CAN BE TRANSFERRED
// ============================================================

// This is the single place where transfer permission is checked.

// This will make it easy later to replace these hard-coded flags
// with DB-driven permissions.
// ============================================================

// const isLeadTransferable = (lead) => {

//   Master transfer permission.
//   if (!SHOW_TRANSFER_OPTIONS) {
//     return false;
//   }

//   const status = (lead?.status || "")
//     .trim()
//     .toLowerCase();


//   Confirmed lead.
//   if (status === "confirmed") {
//     return CAN_TRANSFER_CONFIRMED;
//   }


//   Lost lead.
//   if (status === "lost") {
//     return CAN_TRANSFER_LOST;
//   }


//   Open / Postponed / other statuses.
//   return true;
// };


// ============================================================
// CHECK WHETHER A LEAD CAN BE REOPENED
// ============================================================
// const isLeadReopenable = (lead) => {
//   if (!SHOW_REOPEN_OPTIONS) return false;

//   const status = (lead?.status || "").trim().toLowerCase();

//   if (status === "confirmed") return CAN_REOPEN_CONFIRMED;
//   if (status === "lost") return CAN_REOPEN_LOST;
//   if (status === "postponed") return CAN_REOPEN_POSTPONED;
//   if (status === "closed") return CAN_REOPEN_CLOSED;

//   return false;
// };


// ============================================================
// SEARCHABLE MULTI SELECT FILTER
// ============================================================

// Same basic behaviour as the existing MultiSelectFilter,
// but with a search box for long lists.
// ============================================================

// function SearchableMultiSelectFilter({
//   label,
//   options,
//   selected,
//   onToggle,
//   onClear,
// }) {

//   const [open, setOpen] = useState(false);

//   const [search, setSearch] = useState("");

//   const [showTooltip, setShowTooltip] = useState(false);

//   const wrapperRef = React.useRef(null);

//   const isActive = selected.length > 0;


//   ----------------------------------------------------------
//   Close dropdown when clicking outside.
//   ----------------------------------------------------------

//   React.useEffect(() => {

//     const handleClickOutside = (e) => {

//       if (
//         wrapperRef.current &&
//         !wrapperRef.current.contains(e.target)
//       ) {

//         setOpen(false);

//         setShowTooltip(false);
//       }
//     };


//     document.addEventListener(
//       "mousedown",
//       handleClickOutside
//     );


//     return () =>
//       document.removeEventListener(
//         "mousedown",
//         handleClickOutside
//       );

//   }, []);


//   ----------------------------------------------------------
//   Filter options based on search text.
//   ----------------------------------------------------------

//   const filteredOptions = useMemo(
//     () =>
//       options.filter((o) =>
//         o
//           .toLowerCase()
//           .includes(search.toLowerCase())
//       ),
//     [options, search]
//   );


//   return (
//     <div
//       className="relative w-full min-w-0"
//       ref={wrapperRef}
//     >

//       {/* =====================================================
//           FILTER BUTTON
//       ===================================================== */}

//       <div
//         className="relative w-full"

//         onMouseEnter={() => {

//           if (isActive && !open) {
//             setShowTooltip(true);
//           }

//         }}

//         onMouseLeave={() => {
//           setShowTooltip(false);
//         }}
//       >

//         <button
//           type="button"

//           onClick={() => {

//             setOpen((o) => !o);

//             setShowTooltip(false);

//           }}

//           className={`
//             border
//             px-2
//             py-1.5
//             rounded
//             text-sm
//             w-full
//             min-w-0
//             text-left
//             flex
//             items-center
//             gap-1.5
//             transition
//             font-medium

//             ${
//               isActive
//                 ? "bg-blue-600 border-blue-600 text-white"
//                 : "bg-white border-gray-400 text-gray-700 hover:border-gray-600"
//             }
//           `}
//         >

//           {/* Filter name / selected count */}

//           <span className="truncate flex-1 min-w-0">

//             {isActive
//               ? `${label} (${selected.length})`
//               : label}

//           </span>


//           {/* Clear filter */}

//           {isActive ? (

//             <span
//               onMouseDown={(e) => {

//                 e.stopPropagation();

//                 e.preventDefault();

//                 onClear && onClear();

//                 setOpen(false);

//                 setShowTooltip(false);

//               }}

//               title={`Clear ${label} filter`}

//               className="
//                 flex-shrink-0
//                 w-4
//                 h-4
//                 rounded-full
//                 bg-white
//                 text-red-600
//                 flex
//                 items-center
//                 justify-center
//                 text-[11px]
//                 font-black
//                 leading-none
//                 hover:bg-red-100
//                 cursor-pointer
//               "
//             >
//               ✕
//             </span>

//           ) : (

//             <span
//               className="
//                 text-[10px]
//                 text-gray-500
//                 flex-shrink-0
//               "
//             >
//               {open ? "▲" : "▼"}
//             </span>

//           )}

//         </button>


//         {/* =====================================================
//             SELECTED VALUES TOOLTIP
//         ===================================================== */}

//         {showTooltip && isActive && (

//           <div
//             className="
//               absolute
//               left-0
//               top-full
//               mt-2
//               z-[100]
//               w-max
//               max-w-[320px]
//               min-w-[180px]
//               bg-white
//               border
//               border-gray-200
//               rounded-xl
//               shadow-lg
//               px-3
//               py-2.5
//               text-sm
//               text-gray-700
//               pointer-events-none
//             "
//           >

//             <div
//               className="
//                 font-semibold
//                 text-gray-600
//                 mb-1.5
//               "
//             >
//               Selected {label}:
//             </div>


//             <div className="space-y-1">

//               {selected.map((value, index) => (

//                 <div
//                   key={`${value}-${index}`}

//                   className="
//                     flex
//                     items-start
//                     gap-1.5
//                     text-xs
//                     text-gray-600
//                   "
//                 >

//                   <span
//                     className="
//                       w-[5px]
//                       h-[5px]
//                       rounded-full
//                       bg-blue-500
//                       flex-shrink-0
//                       mt-1
//                     "
//                   />

//                   <span className="break-words">
//                     {value}
//                   </span>

//                 </div>

//               ))}

//             </div>

//           </div>

//         )}

//       </div>


//       {/* =====================================================
//           DROPDOWN
//       ===================================================== */}

//       {open && (

//         <div
//           className="
//             absolute
//             z-20
//             mt-1
//             w-full
//             min-w-[190px]
//             bg-white
//             border
//             border-gray-200
//             rounded
//             shadow-lg
//             max-h-56
//             overflow-auto
//           "
//         >

//           {/* Search box */}

//           <div
//             className="
//               p-2
//               border-b
//               border-gray-100
//               sticky
//               top-0
//               bg-white
//             "
//           >

//             <input
//               type="text"

//               autoFocus

//               placeholder={`Search ${label}...`}

//               value={search}

//               onChange={(e) =>
//                 setSearch(e.target.value)
//               }

//               className="
//                 w-full
//                 text-sm
//                 px-2
//                 py-1
//                 border
//                 border-gray-300
//                 rounded
//                 focus:outline-none
//                 focus:ring-2
//               "
//             />

//           </div>


//           {/* No matches */}

//           {filteredOptions.length === 0 && (

//             <div className="px-2 py-1.5 text-xs text-gray-400">
//               No matches
//             </div>

//           )}


//           {/* Options */}

//           {filteredOptions.map((opt) => (

//             <label
//               key={opt}

//               className="
//                 flex
//                 items-center
//                 gap-2
//                 px-2
//                 py-1.5
//                 text-sm
//                 hover:bg-gray-50
//                 cursor-pointer
//               "
//             >

//               <input
//                 type="checkbox"

//                 checked={selected.includes(opt)}

//                 onChange={() => onToggle(opt)}
//               />

//               <span className="truncate">
//                 {opt}
//               </span>

//             </label>

//           ))}

//         </div>

//       )}

//     </div>
//   );
// }


// ============================================================
// EMPTY FILTER STATE
// ============================================================

// const EMPTY_FILTERS = {

//   status: [],

//   customerTypeDescription: [],

//   categoryName: [],

//   assignedTo: [],

//   tripType: [],

//   leadType: [],

//   preferredDestination: [],
// };


// ============================================================
// MAIN COMPONENT
// ============================================================

// IMPORTANT:
// `onRefresh` must be supplied by the parent component.

// Example:

// <LeadListWithFilters
//    users={users}
//    dateRange={dateRange}
//    onRefresh={loadLeads}
// />

// We intentionally DO NOT use window.location.reload().
// That would reload the entire application and can send the user
// back through the authentication/session initialization.
// ============================================================

// export default function LeadListWithFilters({
//   users,
//   dateRange,
//   onRefresh,
// }) {

//   ==========================================================
//   API
//   ==========================================================

//   const GetLeadsForEditAPI =
//     config.apiUrl + "/TempLead/GetLeadForEdit";

//   const fetchDataWithFiltersAPI =
//     config.apiUrl +
//     "/Reporting/GetManagerAnalyticsDataWithFilters";


//   ==========================================================
//   SESSION / MESSAGE
//   ==========================================================

//   const {
//     user: sessionUser
//   } = useGetSessionUser();

//   const {
//     showMessage
//   } = useMessageBox();


//   ==========================================================
//   VIEW MODAL STATE
//   ==========================================================

//   const [isModalOpen, setModalOpen] =
//     useState(false);

//   const [selectedLead, setSelectedLead] =
//     useState(null);

//   const [mode, setMode] =
//     useState("create");


//   ==========================================================
//   LOADING STATE
//   ==========================================================

//   const [isLoading, setIsLoading] =
//     useState(false);


//   ==========================================================
//   BULK TRANSFER STATE
//   ==========================================================

//   const [isBulkTransferMode, setIsBulkTransferMode] =
//     useState(false);


//   IDs selected by checkbox.

//   const [selectedLeadIds, setSelectedLeadIds] =
//     useState([]);


//   Header "select all" checkbox.

//   const selectAllRef =
//     React.useRef(null);


//   ==========================================================
//   TRANSFER MODAL STATE
//   ==========================================================

//   IMPORTANT:
//   This is ALWAYS an array.

//   Single transfer:
//   [lead]

//   Bulk transfer:
//   [lead1, lead2, lead3]
//   ==========================================================

//   const [selectedTransferLeads, setSelectedTransferLeads] =
//     useState([]);

//   Backend returns the same SelectionKey with the updated DashboardRowDto.
//   Keep the wrapper outside DashboardRowDto.
//   const [transferredLeadEntries, setTransferredLeadEntries] =
//     useState([]);



//   ==========================================================
//   TRANSFER USERS
//   ==========================================================

//   const [transferUsers, setTransferUsers] =
//     useState([]);

//   const [loadingUsers, setLoadingUsers] =
//     useState(false);


//   Existing state.

//   const [leads, setLeads] =
//     useState([]);


//   const [showTransferModal, setShowTransferModal] =
//     useState(false);

//   ==========================================================
//   FRONTEND-ONLY LEAD SELECTION DICTIONARY
//   ==========================================================

//   IMPORTANT: DO NOT add a `key` property to the lead object.

//   We keep the identity completely outside the lead object: 

//     selectionKey -> current row object
//     sourceLeadObject -> selectionKey
//     currentRowObject -> selectionKey

//   Why do we need the second WeakMap?
//   The component creates display-row objects with `{ ...lead }`.
//   If the parent re-renders and creates those display objects again,
//   the display object reference can change even though it is the same
//   underlying lead. Therefore the generated selection key is anchored
//   to the ORIGINAL lead object coming from `users`, not to the cloned
//   display row.

//   This is what prevents a MessageBox/context re-render from making
//   the checkboxes appear unchecked while the selected count remains.

//   Example keys:
//     VIS_48217391
//     HOL_73104928
//     AIR_19382746
//     CAR_65021483
//   ==========================================================

//   selectionKey -> current display-row object
//   const leadSelectionMapRef = React.useRef(new Map());

//   ORIGINAL lead object -> stable selectionKey
//   const sourceLeadToSelectionKeyMapRef = React.useRef(new WeakMap());

//   CURRENT display-row object -> selectionKey
//   This is used by the table when rendering checkboxes/rows.
//   const leadToSelectionKeyMapRef = React.useRef(new WeakMap());

//   const generateLeadSelectionKey = (lead) => {
//     const categoryName =
//       (lead?.categoryName || "LEAD")
//         .trim()
//         .replace(/[^a-zA-Z0-9]/g, "")
//         .toUpperCase();

//     const prefix =
//       (categoryName.slice(0, 3) || "LEA")
//         .padEnd(3, "X");

//     let key;

//     do {
//       Maximum 8 digits, exactly as discussed.
//       const randomNumber = Math.floor(
//         Math.random() * 100000000
//       );

//       key = `${prefix}_${randomNumber}`;
//     } while (
//       leadSelectionMapRef.current.has(key)
//     );

//     return key;
//   };

//   const getOrCreateSelectionKey = (sourceLead) => {
//     if (!sourceLead) {
//       return null;
//     }

//     If this ORIGINAL lead object has already received a key,
//     always reuse it. This is the important stability mechanism.
//     const existingKey =
//       sourceLeadToSelectionKeyMapRef.current.get(
//         sourceLead
//       );

//     if (existingKey) {
//       return existingKey;
//     }

//     const newKey =
//       generateLeadSelectionKey(sourceLead);

//     sourceLeadToSelectionKeyMapRef.current.set(
//       sourceLead,
//       newKey
//     );

//     console.log(
//       "[Lead Selection Dictionary] Generated new selection key:",
//       {
//         key: newKey,
//         category: sourceLead?.categoryName,
//         leadId: sourceLead?.categoryId,
//       }
//     );

//     return newKey;
//   };

//   ==========================================================
//   DERIVED SELECTED COUNT
//   ==========================================================

//   Do not blindly display selectedLeadIds.length.
//   The Map is the source of truth for whether a selection key still
//   represents a lead currently present on this screen.

//   This also protects the UI from ever showing:
//     checkboxes = 0 selected
//     count       = 17 selected

//   ==========================================================
//   const selectedCount = selectedLeadIds.filter((selectionKey) =>
//     leadSelectionMapRef.current.has(selectionKey)
//   ).length;

//   Confirmed/Lost confirmation state. NO never clears the checkbox selection.
//   const [showTransferConfirmation, setShowTransferConfirmation] = useState(false);
//   const [transferConfirmationMessage, setTransferConfirmationMessage] = useState("");
//   const [pendingTransferLeads, setPendingTransferLeads] = useState([]);

//   ==========================================================
//   BULK REOPEN STATE
//   ==========================================================
//   const [isBulkReopenMode, setIsBulkReopenMode] = useState(false);
//   const [selectedReopenLeads, setSelectedReopenLeads] = useState([]);
//   const [reopenedLeadIds, setReopenedLeadIds] = useState([]);

//   Reopen confirmation + temporary reason/message modal.
//   const [showReopenConfirmation, setShowReopenConfirmation] = useState(false);
//   const [reopenConfirmationMessage, setReopenConfirmationMessage] = useState("");
//   const [pendingReopenLeads, setPendingReopenLeads] = useState([]);
//   const [showReopenModal, setShowReopenModal] = useState(false);
//   const [reopenReason, setReopenReason] = useState("");



//   ==========================================================
//   SPECIAL STATUS WARNING
//   ==========================================================

//   Confirmed and Lost leads are transferable when their
//   respective permission flags are TRUE.

//   However, before transferring them we explicitly ask the
//   user for confirmation.
//   ==========================================================

//   const confirmSpecialStatusTransfer = (leadsToTransfer) => {
//     const confirmedLeads = leadsToTransfer.filter((lead) => (lead?.status || "").trim().toLowerCase() === "confirmed");
//     const lostLeads = leadsToTransfer.filter((lead) => (lead?.status || "").trim().toLowerCase() === "lost");
//     if (!confirmedLeads.length && !lostLeads.length) return false;

//     const categories = [...new Set(leadsToTransfer.map((lead) => (lead?.categoryName || "").trim()).filter(Boolean))];
//     const categoryText = categories.length === 1 ? categories[0] : categories.length === 2 ? `${categories[0]} and ${categories[1]}` : categories.length > 2 ? `${categories.slice(0, -1).join(", ")} and ${categories[categories.length - 1]}` : "the selected";
//     const parts = [];
//     if (confirmedLeads.length) parts.push(`${confirmedLeads.length} Confirmed lead${confirmedLeads.length > 1 ? "s" : ""}`);
//     if (lostLeads.length) parts.push(`${lostLeads.length} Lost lead${lostLeads.length > 1 ? "s" : ""}`);
//     const count = confirmedLeads.length + lostLeads.length;
//     const message = `You have selected ${categoryText} leads for transfer.

// ${parts.join(" and ")} ${count === 1 ? "is" : "are"} included in the selected leads.

// Are you sure you want to continue with the transfer?`;

//     console.log("Special-status transfer confirmation required:", { categories, confirmedCount: confirmedLeads.length, lostCount: lostLeads.length, leadsToTransfer });
//     setPendingTransferLeads(leadsToTransfer);
//     setTransferConfirmationMessage(message);
//     setShowTransferConfirmation(true);
//     return true;
//   };

//   const handleTransferConfirmationYes = () => {
//     console.log("User confirmed special-status transfer:", pendingTransferLeads);
//     const leadsToTransfer = pendingTransferLeads;
//     setShowTransferConfirmation(false);
//     setPendingTransferLeads([]);
//     setTransferConfirmationMessage("");
//     if (!leadsToTransfer.length) return;
//     setSelectedTransferLeads(leadsToTransfer);
//     setShowTransferModal(true);
//     loadTransferUsers();
//   };

//   const handleTransferConfirmationNo = () => {
//     console.log("User cancelled special-status transfer. Selection preserved:", selectedLeadIds);
//     setShowTransferConfirmation(false);
//     setPendingTransferLeads([]);
//     setTransferConfirmationMessage("");
//   };


//   ==========================================================
//   REOPEN CONFIRMATION / MODAL
//   ==========================================================

//   const confirmBulkReopen = (leadsToReopen) => {
//     const counts = {
//       closed: 0,
//       lost: 0,
//       postponed: 0,
//       confirmed: 0,
//     };

//     leadsToReopen.forEach((lead) => {
//       const status = (lead?.status || "").trim().toLowerCase();
//       if (status === "closed") counts.closed++;
//       if (status === "lost") counts.lost++;
//       if (status === "postponed") counts.postponed++;
//       if (status === "confirmed") counts.confirmed++;
//     });

//     const categories = [...new Set(
//       leadsToReopen.map((lead) => (lead?.categoryName || "").trim()).filter(Boolean)
//     )];

//     const categoryText =
//       categories.length === 1 ? categories[0] :
//       categories.length === 2 ? `${categories[0]} and ${categories[1]}` :
//       categories.length > 2 ? `${categories.slice(0, -1).join(", ")} and ${categories[categories.length - 1]}` :
//       "the selected";

//     const parts = [];
//     if (counts.closed) parts.push(`${counts.closed} Closed lead${counts.closed > 1 ? "s" : ""}`);
//     if (counts.lost) parts.push(`${counts.lost} Lost lead${counts.lost > 1 ? "s" : ""}`);
//     if (counts.postponed) parts.push(`${counts.postponed} Postponed lead${counts.postponed > 1 ? "s" : ""}`);
//     if (counts.confirmed) parts.push(`${counts.confirmed} Confirmed lead${counts.confirmed > 1 ? "s" : ""}`);

//     const count = leadsToReopen.length;
//     const message = `You have selected ${categoryText} leads to reopen.\n\n${parts.join(", ")} ${count === 1 ? "is" : "are"} included in the selected leads.\n\nAre you sure you want to continue with reopening these leads?`;

//     setPendingReopenLeads(leadsToReopen);
//     setReopenConfirmationMessage(message);
//     setShowReopenConfirmation(true);
//     return true;
//   };

//   const openReopenModal = (lead) => {
//     if (!SHOW_REOPEN_OPTIONS || !isLeadReopenable(lead)) {
//       showMessage("You do not have permission to reopen this lead.", MESSAGE_TYPES.WARNING);
//       return;
//     }

//     setSelectedReopenLeads([lead]);
//     setReopenReason("");
//     setShowReopenModal(true);
//   };

//   const handleReopenConfirmationYes = () => {
//     const leadsToReopen = pendingReopenLeads;
//     setShowReopenConfirmation(false);
//     setPendingReopenLeads([]);
//     setReopenConfirmationMessage("");

//     if (!leadsToReopen.length) return;

//     setSelectedReopenLeads(leadsToReopen);
//     setReopenReason("");
//     setShowReopenModal(true);
//   };

//   const handleReopenConfirmationNo = () => {
//     setShowReopenConfirmation(false);
//     setPendingReopenLeads([]);
//     setReopenConfirmationMessage("");
//   };

//   Temporary frontend-only submit. Replace the marked section with the
//   reopen API call once the backend contract is finalized.
//   const handleReopenSubmit = async () => {
//     const reason = reopenReason.trim();

//     if (!reason) {
//       showMessage("Reason / message to reopen is mandatory.", MESSAGE_TYPES.WARNING);
//       return;
//     }

//     const leadsToReopen = selectedReopenLeads;
//     if (!leadsToReopen.length) return;

//     console.log("TEMP REOPEN REQUEST", {
//       leadIds: leadsToReopen.map((lead) => lead?.categoryId),
//       leads: leadsToReopen,
//       reason,
//     });

//     TODO: Replace this temporary section with your reopen API call.
//     Example payload to send later:
//     { leadIds: [...], reason, requestedBy_UserID: sessionUser?.user?.userId }

//     const selectionKeys = leadsToReopen
//       .map((lead) => leadToSelectionKeyMapRef.current.get(lead))
//       .filter(Boolean);

//     Keep the rows visible for now because no backend reopen API has been
//     wired yet. Once the API is added, update `reopenedLeadIds` only after
//     the API confirms success, exactly like transfer.
//     console.log("Temporary reopen request captured. Selection keys:", selectionKeys);
//     setShowReopenModal(false);
//     setSelectedReopenLeads([]);
//     setReopenReason("");

//     showMessage("Reopen request captured. Backend API is not wired yet.", MESSAGE_TYPES.WARNING);
//   };

//   const handleBulkReopenClick = () => {
//     if (!SHOW_REOPEN_OPTIONS || !selectedLeadIds.length) return;

//     const leadsToReopen = selectedLeadIds
//       .map((selectionKey) => leadSelectionMapRef.current.get(selectionKey))
//       .filter(Boolean);

//     if (!leadsToReopen.length) return;

//     const nonReopenable = leadsToReopen.filter((lead) => !isLeadReopenable(lead));
//     if (nonReopenable.length) {
//       showMessage("One or more selected leads cannot be reopened based on your current reopen permissions.", MESSAGE_TYPES.WARNING);
//       return;
//     }

//     if (confirmBulkReopen(leadsToReopen)) return;
//   };

//   const exitBulkReopenMode = () => {
//     setIsBulkReopenMode(false);
//     setSelectedLeadIds([]);
//   };


// ==========================================================
//   SINGLE LEAD TRANSFER
//   ==========================================================

//   const openTransferModal = (lead) => {

//     Master permission.

//     if (!SHOW_TRANSFER_OPTIONS) {
//       return;
//     }


//     Individual permission check.

//     if (!isLeadTransferable(lead)) {

//       showMessage(
//         "You do not have permission to transfer this lead.",
//         MESSAGE_TYPES.WARNING
//       );

//       return;
//     }


//     Confirm if this is Confirmed / Lost.

//     const confirmationShown =
//       confirmSpecialStatusTransfer([lead]);

//     `true` means the confirmation dialog has been opened.
//     IMPORTANT: do NOT open the transfer modal yet.
//     The Yes button will do that later.
//     if (confirmationShown) {
//       console.log(
//         "[Single Transfer] Special-status confirmation shown. Waiting for user response."
//       );
//       return;
//     }

//     No confirmation was necessary, so open the transfer modal directly.

//     ALWAYS array.

//     setSelectedTransferLeads([
//       lead
//     ]);


//     setShowTransferModal(true);


//     loadTransferUsers();
//   };


//   ==========================================================
//   BULK TRANSFER
//   ==========================================================

//   Validation order:

//   1. Transfer permission
//   2. Get selected leads
//   3. Validate categories
//   4. Confirm Confirmed/Lost leads
//   5. Open modal
//   ==========================================================

//   const handleBulkTransferClick = () => {

//     if (!SHOW_TRANSFER_OPTIONS) {
//       return;
//     }


//     if (!selectedLeadIds.length) {
//       return;
//     }


//     Resolve selected frontend keys to the exact lead objects.
//     Never use categoryId/leadID here because they can collide.
//     const leadsToTransfer = selectedLeadIds
//       .map((selectionKey) => leadSelectionMapRef.current.get(selectionKey))
//       .filter(Boolean);

//     console.log("Bulk transfer selection keys:", selectedLeadIds);
//     console.log("Bulk transfer resolved exact lead objects:", leadsToTransfer);


//     if (!leadsToTransfer.length) {
//       return;
//     }


//     ========================================================
//     CHECK INDIVIDUAL TRANSFER PERMISSION
//     ========================================================

//     const nonTransferableLeads =
//       leadsToTransfer.filter(
//         (lead) =>
//           !isLeadTransferable(lead)
//       );


//     if (nonTransferableLeads.length > 0) {

//       showMessage(
//         "One or more selected leads cannot be transferred based on your current transfer permissions.",
//         MESSAGE_TYPES.WARNING
//       );

//       return;
//     }


//     ========================================================
//     CHECK MULTIPLE CATEGORIES
//     ========================================================

//     Example:

//     VISA + HOLIDAY

//     -> NOT allowed.

//     VISA + VISA

//     -> allowed.
//     ========================================================

//     const categories = [
//       ...new Set(
//         leadsToTransfer
//           .map(
//             (lead) =>
//               (lead?.categoryName || "")
//                 .trim()
//           )
//           .filter(Boolean)
//       ),
//     ];


//     if (categories.length > 1) {

//       Make a readable list:

//       VISA and HOLIDAY

//       or:

//       VISA, HOLIDAY and AIR TICKETING

//       const categoryText =
//         categories.length === 2
//           ? `${categories[0]} and ${categories[1]}`
//           : `${categories
//               .slice(0, -1)
//               .join(", ")} and ${
//               categories[
//                 categories.length - 1
//               ]
//             }`;


//       showMessage(
//         `You have selected ${categoryText} leads. Bulk transfer is allowed only for leads from one category at a time. Please select leads from only one category.`,
//         MESSAGE_TYPES.WARNING
//       );


//       return;
//     }


//     ========================================================
//     CONFIRMED / LOST WARNING
//     ========================================================

//     const confirmationShown =
//       confirmSpecialStatusTransfer(
//         leadsToTransfer
//       );

//     `true` means the confirmation dialog is currently visible.
//     Stop here. The Yes button will open the transfer modal exactly once.
//     if (confirmationShown) {
//       console.log(
//         "[Bulk Transfer] Special-status confirmation shown. Waiting for user response."
//       );
//       return;
//     }

//     No Confirmed/Lost leads were selected, so open the modal directly.

//     ========================================================
//     OPEN TRANSFER MODAL
//     ========================================================

//     setSelectedTransferLeads(
//       leadsToTransfer
//     );

//     setShowTransferModal(true);

//     loadTransferUsers();
//   };


//   ==========================================================
//   SUCCESSFUL TRANSFER CALLBACK
//   ==========================================================

//   The backend returns the SAME SelectionKey that came from the UI.
//   Never use LeadID / CategoryID to identify a row here.

//   Single and bulk transfers are handled identically because the
//   response always contains TransferredLeads as an array.
//   ==========================================================

//   const handleTransfer = async (transferResult) => {
//     if (!transferResult) return;

//     const successfulTransfers =
//       Array.isArray(transferResult.transferredLeads)
//         ? transferResult.transferredLeads.filter(
//             (entry) => entry?.selectionKey && entry?.lead
//           )
//         : [];

//     const failedTransfers =
//       Array.isArray(transferResult.failedLeads)
//         ? transferResult.failedLeads
//         : [];

//     console.log("Transfer response:", transferResult);

//     Keep the backend-returned SelectionKey + updated DashboardRowDto.
//     if (successfulTransfers.length > 0) {
//       setTransferredLeadEntries((prev) => {
//         const map = new Map(
//           prev.map((entry) => [entry.selectionKey, entry])
//         );

//         successfulTransfers.forEach((entry) => {
//           map.set(entry.selectionKey, entry);
//         });

//         return Array.from(map.values());
//       });

//       const transferredSelectionKeys = successfulTransfers.map(
//         (entry) => entry.selectionKey
//       );

//       setSelectedLeadIds((prev) =>
//         prev.filter(
//           (selectionKey) =>
//             !transferredSelectionKeys.includes(selectionKey)
//         )
//       );
//     }

//     Transfer result is complete. Close the modal and clear transfer selection.
//     setShowTransferModal(false);
//     setSelectedTransferLeads([]);

//     Show any partial/full transfer failures.
//     if (failedTransfers.length > 0) {
//       const errorMessages =
//         Array.isArray(transferResult.errors)
//           ? transferResult.errors.filter(Boolean)
//           : [];

//       const message =
//         errorMessages.length > 0
//           ? errorMessages.join("\n")
//           : `${failedTransfers.length} lead${
//               failedTransfers.length > 1 ? "s" : ""
//             } could not be transferred.`;

//       showMessage(message, MESSAGE_TYPES.ERROR);
//     }
//   };


//   ==========================================================
//   LOAD TRANSFER USERS
//   ==========================================================

//   const loadTransferUsers = async () => {

//     Don't load again if already loaded.

//     if (transferUsers.length > 0) {
//       return;
//     }


//     Existing API call can be added here.

//     Keeping your current placeholder untouched.

//     setLoadingUsers(true);

//     const res = await fetch(
//       "/api/analytics/user-ids"
//     );

//     const data = await res.json();

//     setTransferUsers(data);

//     setLoadingUsers(false);
//   };


//   ==========================================================
//   REFRESH ENTIRE LEAD DATA
//   ==========================================================

//   IMPORTANT:

//   DO NOT use:

//   window.location.reload()

//   because that reloads the complete React application and
//   can send the user through login/session initialization.

//   Instead, ask the parent to fetch the lead data again.
//   ==========================================================

//   const handleRefresh = async () => {

//     try {
//       console.log("Refreshing lead data through parent callback...");

//       New users data will create new row objects, so discard the old dictionary first.
//       leadSelectionMapRef.current.clear();
//       leadToSelectionKeyMapRef.current = new WeakMap();

//       setSelectedLeadIds([]);
//       setSelectedTransferLeads([]);
//       setIsBulkTransferMode(false);
//       setIsBulkReopenMode(false);
//       setSelectedReopenLeads([]);
//       setReopenedLeadIds([]);
//       setShowReopenModal(false);
//       setShowReopenConfirmation(false);

//       if (typeof onRefresh === "function") {
//         await onRefresh();
//       } else {
//         console.warn("LeadListWithFilters: onRefresh was not supplied by the parent.");
//         showMessage("Refresh is not configured for this screen.", MESSAGE_TYPES.WARNING);
//       }


//     } catch (error) {

//       console.error(
//         "Error refreshing lead data:",
//         error
//       );


//       showMessage(
//         "Unable to refresh lead data.",
//         MESSAGE_TYPES.ERROR
//       );
//     }
//   };


//   ==========================================================
//   FLATTEN LEADS
//   ==========================================================

//   const allLeads = useMemo(() => {

//     const leadMap = new Map();

//     users.forEach((u) => {
//       const combinedLeads = [
//         ...(u.openLeads || []),
//         ...(u.confirmedLeads || []),
//         ...(u.lostLeads || []),
//         ...(u.postponedLeads || []),
//       ];

//       combinedLeads.forEach((lead) => {
//         Generate/reuse the key from the ORIGINAL lead object.
//         SelectionKey is never added to DashboardRowDto.
//         const selectionKey = getOrCreateSelectionKey(lead);

//         const row = {
//           ...lead,
//           assignedTo: u.firstName,
//           status:
//             lead?.histories?.length > 0
//               ? lead.histories[0].statusDescription
//               : lead.statusDescription,
//           leadAssignedTo: u.userID,
//         };

//         leadMap.set(selectionKey, row);
//         leadSelectionMapRef.current.set(selectionKey, row);
//         leadToSelectionKeyMapRef.current.set(row, selectionKey);
//       });
//     });

//     ==========================================================
//     REOPEN LOGIC - KEEP EXISTING BEHAVIOUR
//     ==========================================================
//     Reopen selection/filtering remains handled exactly as before.

//     ==========================================================
//     TRANSFER OVERLAY
//     ==========================================================

//     The backend returns the original SelectionKey together with
//     the updated DashboardRowDto.

//     If the new assignee exists in the current user tree, show the
//     updated lead immediately. If the assignee is not in the current
//     tree, remove that transferred lead from the current list.

//     transferredLeadEntries.forEach((entry) => {
//       if (!entry?.selectionKey || !entry?.lead) {
//         return;
//       }

//       const transferredLead = entry.lead;

//       const newAssigneeExists = users.some(
//         (u) =>
//           String(u.userID) ===
//           String(transferredLead.leadAssignedTo)
//       );

//       if (!newAssigneeExists) {
//         leadMap.delete(entry.selectionKey);
//         leadSelectionMapRef.current.delete(entry.selectionKey);
//         return;
//       }

//       const transferredRow = {
//         ...transferredLead,
//         assignedTo:
//           transferredLead.leadAssignedToName ||
//           "",
//         leadAssignedTo:
//           transferredLead.leadAssignedTo ||
//           "",
//         status:
//           transferredLead.statusDescription ||
//           "",
//       };

//       leadMap.set(entry.selectionKey, transferredRow);
//       leadSelectionMapRef.current.set(
//         entry.selectionKey,
//         transferredRow
//       );
//       leadToSelectionKeyMapRef.current.set(
//         transferredRow,
//         entry.selectionKey
//       );
//     });

//     return Array.from(leadMap.values());

//   }, [
//     users,
//     transferredLeadEntries,
//   ]);


//   ==========================================================
//   REMOVE REOPENED LEADS FROM THE CURRENT LIST
//   ==========================================================

//   Transfer visibility is handled above through transferredLeadEntries.
//   Reopen behaviour is kept separate and unchanged.
//   ==========================================================

//   const visibleAllLeads = useMemo(() => {
//     if (!reopenedLeadIds.length) {
//       return allLeads;
//     }

//     return allLeads.filter((lead) => {
//       const selectionKey =
//         leadToSelectionKeyMapRef.current.get(lead);

//       return !reopenedLeadIds.includes(selectionKey);
//     });
//   }, [
//     allLeads,
//     reopenedLeadIds,
//   ]);

//   ==========================================================
//   VIEW LEAD
//   ==========================================================

//   const handleViewClick = async (
//     lead
//   ) => {

//     setIsLoading(true);

//     try {

//       const templead =
//         await fetchLeadDetails(
//           lead
//         );


//       setSelectedLead(
//         templead
//       );

//       setMode("view");

//       setModalOpen(true);

//     } catch {

//       showMessage(
//         "Exception thrown.",
//         MESSAGE_TYPES.ERROR
//       );

//     } finally {

//       setIsLoading(false);

//     }
//   };


//   ==========================================================
//   FETCH LEAD DETAILS
//   ==========================================================

//   async function fetchLeadDetails(
//     lead
//   ) {

//     let res = null;

//     try {

//       res = await axios.post(
//         GetLeadsForEditAPI,
//         lead,
//         {
//           headers: {

//             Authorization:
//               `Bearer ${sessionUser.token}`,

//             "Content-Type":
//               "application/json",

//           },
//         }
//       );


//       if (
//         res &&
//         res.data
//       ) {

//         return res.data;

//       }


//       showMessage(
//         "Empty response from server.",
//         MESSAGE_TYPES.WARNING
//       );


//       return null;

//     } catch (error) {

//       const message =
//         error.response?.data ||
//         error.response?.statusText ||
//         error.message ||
//         "Unknown error";


//       showMessage(
//         "Error fetching Lead for edit." +
//           JSON.stringify(message),
//         MESSAGE_TYPES.ERROR
//       );


//       return null;
//     }
//   }


//   ==========================================================
//   DEBUG LOG
//   ==========================================================

//   React.useEffect(() => {

//     console.log(
//       "All leads received in LeadsWithFilters.jsx:",
//       allLeads
//     );

//   }, [allLeads]);


//   ==========================================================
//   FILTER STATE
//   ==========================================================

//   const [filters, setFilters] =
//     useState(EMPTY_FILTERS);

//   const [nameSearch, setNameSearch] =
//     useState("");

//   const [sortConfig, setSortConfig] =
//     useState({
//       key: null,
//       direction: "asc",
//     });

//   const [followUpSels, setFollowUpSels] =
//     useState([]);

//   const [travelDateSels, setTravelDateSel] =
//     useState([]);


//   ==========================================================
//   FOLLOW-UP DATE FILTER
//   ==========================================================

//   const inFollowUp = (lead) => {

//     if (!followUpSels.length) {
//       return true;
//     }


//     if (!lead.followUpDate) {
//       return false;
//     }


//     const d =
//       new Date(
//         lead.followUpDate
//       )
//         .toISOString()
//         .split("T")[0];


//     return followUpSels.some(
//       (s) => {

//         if (s.type === "single") {

//           return s.date === d;
//         }


//         const [a, b] =
//           [s.from, s.to].sort();


//         return (
//           d >= a &&
//           d <= b
//         );
//       }
//     );
//   };


//   ==========================================================
//   TRAVEL DATE FILTER
//   ==========================================================

//   const inTravelDate = (lead) => {

//     if (!travelDateSels.length) {
//       return true;
//     }


//     if (
//       !lead.category?.preferredTravelDate
//     ) {

//       return false;
//     }


//     const d =
//       new Date(
//         lead.category
//           .preferredTravelDate
//       )
//         .toISOString()
//         .split("T")[0];


//     return travelDateSels.some(
//       (s) => {

//         if (s.type === "single") {

//           return s.date === d;
//         }


//         const [a, b] =
//           [s.from, s.to].sort();


//         return (
//           d >= a &&
//           d <= b
//         );
//       }
//     );
//   };


//   ==========================================================
//   NAME SEARCH
//   ==========================================================

//   const matchesName = (lead) =>
//     !nameSearch ||
//     `${lead.fName || ""} ${
//       lead.lName || ""
//     }`
//       .toLowerCase()
//       .includes(
//         nameSearch.toLowerCase()
//       );


//   ==========================================================
//   COMMON FILTER MATCHING
//   ==========================================================

//   const leadMatchesFilters = (
//     lead,
//     excludeKey = null
//   ) => {

//     const active = (key) =>
//       key !== excludeKey;


//     return (

//       (
//         active("status") &&
//         filters.status.length
//           ? filters.status.includes(
//               lead.status
//             )
//           : true
//       ) &&


//       (
//         active(
//           "customerTypeDescription"
//         ) &&
//         filters
//           .customerTypeDescription
//           .length
//           ? filters
//               .customerTypeDescription
//               .includes(
//                 lead.customerTypeDescription
//               )
//           : true
//       ) &&


//       (
//         active("categoryName") &&
//         filters.categoryName.length
//           ? filters.categoryName.includes(
//               lead.categoryName
//             )
//           : true
//       ) &&


//       (
//         active("assignedTo") &&
//         filters.assignedTo.length
//           ? filters.assignedTo.includes(
//               lead.assignedTo
//             )
//           : true
//       ) &&


//       (
//         active("tripType") &&
//         filters.tripType.length
//           ? filters.tripType.includes(
//               getTripType(lead)
//             )
//           : true
//       ) &&


//       (
//         active("leadType") &&
//         filters.leadType.length
//           ? filters.leadType.includes(
//               getLeadType(lead)
//             )
//           : true
//       ) &&


//       (
//         active(
//           "preferredDestination"
//         ) &&
//         filters
//           .preferredDestination
//           .length
//           ? splitDestinations(
//               getDestinations(lead)
//             ).some(
//               (d) =>
//                 filters
//                   .preferredDestination
//                   .includes(d)
//             )
//           : true
//       ) &&


//       (
//         active("followUpDate")
//           ? inFollowUp(lead)
//           : true
//       ) &&


//       (
//         active("travelDate")
//           ? inTravelDate(lead)
//           : true
//       )

//     );
//   };


//   ==========================================================
//   FILTER OPTIONS
//   ==========================================================

//   const filterOptions = useMemo(() => {

//     const poolFor =
//       (excludeKey) =>
//         visibleAllLeads.filter(
//           (l) =>
//             leadMatchesFilters(
//               l,
//               excludeKey
//             ) &&
//             matchesName(l)
//         );


//     const getUnique =
//       (
//         key,
//         excludeKey
//       ) =>
//         [
//           ...new Set(
//             poolFor(excludeKey)
//               .map(
//                 (l) =>
//                   l[key]
//               )
//               .filter(Boolean)
//           ),
//         ];


//     const getUniqueDestinations =
//       (excludeKey) => {

//         const set =
//           new Set();


//         poolFor(
//           excludeKey
//         ).forEach(
//           (l) => {

//             splitDestinations(
//               getDestinations(l)
//             ).forEach(
//               (d) =>
//                 set.add(d)
//             );

//           }
//         );


//         return [
//           ...set
//         ];
//       };


//     return {

//       categoryName:
//         getUnique(
//           "categoryName",
//           "categoryName"
//         ),

//       assignedTo:
//         getUnique(
//           "assignedTo",
//           "assignedTo"
//         ),

//       status:
//         getUnique(
//           "status",
//           "status"
//         ),

//       customerTypeDescription:
//         getUnique(
//           "customerTypeDescription",
//           "customerTypeDescription"
//         ),

//       tripType:
//         [
//           ...new Set(
//             poolFor("tripType")
//               .map(getTripType)
//               .filter(Boolean)
//           ),
//         ],

//       leadType:
//         [
//           ...new Set(
//             poolFor("leadType")
//               .map(getLeadType)
//               .filter(Boolean)
//           ),
//         ],

//       preferredDestination:
//         getUniqueDestinations(
//           "preferredDestination"
//         ),

//     };

//   }, [
//     visibleAllLeads,
//     filters,
//     nameSearch,
//     followUpSels,
//     travelDateSels,
//   ]);


//   ==========================================================
//   FILTER CHANGE
//   ==========================================================

//   const handleFilterChange = (
//     key,
//     value
//   ) => {

//     setFilters((prev) => {

//       Single select mode.

//       if (!ALLOW_MULTI_SELECT) {

//         const isSame =
//           prev[key].length === 1 &&
//           prev[key][0] === value;


//         return {

//           ...prev,

//           [key]:
//             isSame
//               ? []
//               : [value],

//         };
//       }


//       Multi-select mode.

//       const current =
//         prev[key];

//       const exists =
//         current.includes(value);


//       return {

//         ...prev,

//         [key]:
//           exists
//             ? current.filter(
//                 (v) =>
//                   v !== value
//               )
//             : [
//                 ...current,
//                 value,
//               ],

//       };

//     });
//   };


//   ==========================================================
//   CLEAR FILTERS
//   ==========================================================

//   const clearFilters = () => {

//     setFilters(
//       EMPTY_FILTERS
//     );

//     setNameSearch("");

//     setFollowUpSels([]);

//     setTravelDateSel([]);
//   };


//   ==========================================================
//   SORTING
//   ==========================================================

//   const handleSort = (key) => {

//     setSortConfig(
//       (prev) => ({

//         key,

//         direction:
//           prev.key === key &&
//           prev.direction === "asc"
//             ? "desc"
//             : "asc",

//       })
//     );
//   };


//   ==========================================================
//   APPLY FILTERS
//   ==========================================================

//   const filteredLeads = useMemo(() => {

//     return visibleAllLeads.filter(
//       (lead) =>
//         leadMatchesFilters(lead) &&
//         matchesName(lead)
//     );

//   }, [
//     visibleAllLeads,
//     filters,
//     nameSearch,
//     followUpSels,
//     travelDateSels,
//   ]);


//   ==========================================================
//   APPLY SORT
//   ==========================================================

//   const sortedLeads = useMemo(() => {

//     if (!sortConfig.key) {
//       return filteredLeads;
//     }


//     const {
//       key,
//       direction,
//     } = sortConfig;


//     const dir =
//       direction === "asc"
//         ? 1
//         : -1;


//     const dateKeys = [
//       "createdAt",
//       "updatedAt",
//       "latestUpdateAt",
//       "followUpDate",
//       "travelDate",
//     ];


//     return [
//       ...filteredLeads,
//     ].sort((a, b) => {

//       let valA =
//         key === "latestUpdateAt"
//           ? getLatestUpdate(a)
//           : key === "travelDate"
//             ? a.category
//                 ?.preferredTravelDate
//             : a[key];


//       let valB =
//         key === "latestUpdateAt"
//           ? getLatestUpdate(b)
//           : key === "travelDate"
//             ? b.category
//                 ?.preferredTravelDate
//             : b[key];


//       if (
//         dateKeys.includes(key)
//       ) {

//         valA =
//           valA
//             ? new Date(
//                 valA
//               ).getTime()
//             : 0;


//         valB =
//           valB
//             ? new Date(
//                 valB
//               ).getTime()
//             : 0;


//         return (
//           valA - valB
//         ) * dir;
//       }


//       valA =
//         (valA ?? "")
//           .toString()
//           .toLowerCase();


//       valB =
//         (valB ?? "")
//           .toString()
//           .toLowerCase();


//       if (valA < valB) {
//         return -1 * dir;
//       }


//       if (valA > valB) {
//         return 1 * dir;
//       }


//       return 0;
//     });

//   }, [
//     filteredLeads,
//     sortConfig,
//   ]);


//   ==========================================================
//   BULK SELECTION
//   ==========================================================

//   Only leads that are currently transferable participate
//   in Select All.
//   ==========================================================

//   const selectableSortedLeads = useMemo(() => {
//     if (isBulkReopenMode) {
//       return sortedLeads.filter(isLeadReopenable);
//     }
//     if (isBulkTransferMode) {
//       return sortedLeads.filter(isLeadTransferable);
//     }
//     return [];
//   }, [sortedLeads, isBulkTransferMode, isBulkReopenMode]);


//   const selectableKeys = useMemo(
//     () => selectableSortedLeads
//       .map((lead) => leadToSelectionKeyMapRef.current.get(lead))
//       .filter(Boolean),
//     [selectableSortedLeads]
//   );

//   const allSelected = selectableKeys.length > 0 && selectableKeys.every((key) => selectedLeadIds.includes(key));
//   const someSelected = selectableKeys.some((key) => selectedLeadIds.includes(key)) && !allSelected;

//   React.useEffect(() => {
//     if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
//   }, [someSelected]);

//   const toggleSelectAll = () => {
//     console.log("Toggle Select All. Selectable keys:", selectableKeys);
//     setSelectedLeadIds((prev) => {
//       if (selectableKeys.length > 0 && selectableKeys.every((key) => prev.includes(key))) {
//         const next = prev.filter((key) => !selectableKeys.includes(key));
//         console.log("Select All cleared current visible selections:", next);
//         return next;
//       }
//       const next = [...new Set([...prev, ...selectableKeys])];
//       console.log("Select All added current visible selections:", next);
//       return next;
//     });
//   };

//   SELECT INDIVIDUAL LEAD
//   ==========================================================

//   const toggleLeadSelected = (selectionKey) => {
//     console.log("Toggling selection key:", selectionKey);
//     setSelectedLeadIds((prev) => {
//       const next = prev.includes(selectionKey)
//         ? prev.filter((key) => key !== selectionKey)
//         : [...prev, selectionKey];
//       console.log("Updated selected selection keys:", next);
//       return next;
//     });
//   };


//   ==========================================================
//   EXIT BULK MODE
//   ==========================================================

//   const exitBulkMode = () => {

//     setIsBulkTransferMode(false);
//     setIsBulkReopenMode(false);
//     setSelectedLeadIds([]);
//   };


//   ==========================================================
//   HOLIDAY DETECTION
//   ==========================================================

//   This depends only on the Category filter and visible leads.
//   ==========================================================

//   const categoryFilteredLeads =
//     useMemo(
//       () =>
//         filters.categoryName.length

//           ? visibleAllLeads.filter(
//               (l) =>
//                 filters.categoryName.includes(
//                   l.categoryName
//                 )
//             )

//           : visibleAllLeads,

//       [
//         visibleAllLeads,
//         filters.categoryName,
//       ]
//     );


//   const isHolidayRelevant =
//     useMemo(
//       () =>
//         categoryFilteredLeads.some(
//           isHolidayLead
//         ),

//       [categoryFilteredLeads]
//     );


//   ==========================================================
//   CLEAR HOLIDAY FILTERS WHEN HOLIDAY IS NO LONGER RELEVANT
//   ==========================================================

//   React.useEffect(() => {

//     if (!isHolidayRelevant) {

//       setFilters((prev) =>

//         prev.tripType.length ||
//         prev.leadType.length ||
//         prev.preferredDestination.length

//           ? {

//               ...prev,

//               tripType: [],

//               leadType: [],

//               preferredDestination: [],

//             }

//           : prev
//       );


//       setTravelDateSel(
//         (prev) =>
//           prev.length
//             ? []
//             : prev
//       );


//       setSortConfig(
//         (prev) =>
//           prev.key ===
//           "travelDate"

//             ? {
//                 key: null,
//                 direction: "asc",
//               }

//             : prev
//       );
//     }

//   }, [isHolidayRelevant]);


//   ==========================================================
//   FILTER KEYS TO DISPLAY
//   ==========================================================

//   const visibleFilterKeys =
//     isHolidayRelevant

//       ? [
//           ...BASE_FILTER_KEYS,
//           ...HOLIDAY_FILTER_KEYS,
//         ]

//       : BASE_FILTER_KEYS;


//   ==========================================================
//   TRANSFER API WRAPPER ITEMS
//   ==========================================================

//   Keep SelectionKey outside DashboardRowDto.
//   Single transfer also travels as an array with one item.
//   ==========================================================
//   const selectedTransferLeadEntries = useMemo(() => {
//     return selectedTransferLeads
//       .map((lead) => {
//         const selectionKey =
//           leadToSelectionKeyMapRef.current.get(lead);

//         if (!selectionKey) {
//           return null;
//         }

//         return {
//           selectionKey,
//           lead,
//         };
//       })
//       .filter(Boolean);
//   }, [selectedTransferLeads]);


//   ==========================================================
//   RENDER
//   ==========================================================

//   return (

//     <div className="flex flex-col h-full">

//       <LoadingOverlay
//         visible={isLoading}
//       />


//       {/* ======================================================
//           FILTER BAR
//       ====================================================== */}

//       <div className="
//         bg-gray-50
//         border
//         rounded-lg
//         flex-shrink-0
//         p-2
//       ">

//         <div
//           className="
//             grid
//             grid-cols-[15fr_15fr_15fr_15fr_15fr_33fr_10fr]
//             grid-rows-[38px_38px]
//             gap-x-2
//             gap-y-2
//             items-center
//             w-full
//           "
//         >

//           {/* ==================================================
//               SEARCH BY NAME
//           ================================================== */}

//           <div
//             className="
//               col-start-1
//               row-start-1
//               row-span-2
//               flex
//               items-center
//               w-full
//               min-w-0
//             "
//           >

//             <input
//               type="text"

//               placeholder="Search by Name"

//               value={nameSearch}

//               onChange={(e) =>
//                 setNameSearch(
//                   e.target.value
//                 )
//               }

//               className="
//                 w-full
//                 min-w-0
//                 rounded
//                 px-2
//                 py-1.5
//                 text-sm
//                 focus:outline-none
//                 focus:ring-2
//                 bg-white
//                 border
//                 border-gray-300
//               "
//             />

//           </div>


//           {/* ==================================================
//               NORMAL FILTERS
//           ================================================== */}

//           {visibleFilterKeys.map(
//             (key, index) => {

//               const FilterComponent =
//                 key ===
//                 "preferredDestination"

//                   ? SearchableMultiSelectFilter

//                   : MultiSelectFilter;


//               const row =
//                 index < 4
//                   ? 1
//                   : 2;


//               const col =
//                 2 +
//                 (index % 4);


//               return (

//                 <div
//                   key={key}

//                   style={{
//                     gridColumn: col,
//                     gridRow: row,
//                   }}

//                   className="
//                     flex
//                     items-center
//                     w-full
//                     min-w-0
//                   "
//                 >

//                   <FilterComponent

//                     label={
//                       FILTER_LABELS[key] ||
//                       key
//                     }

//                     options={
//                       filterOptions[key]
//                     }

//                     selected={
//                       filters[key]
//                     }

//                     onToggle={
//                       (value) =>
//                         handleFilterChange(
//                           key,
//                           value
//                         )
//                     }

//                     onClear={() =>
//                       setFilters(
//                         (f) => ({
//                           ...f,
//                           [key]: [],
//                         })
//                       )
//                     }

//                   />

//                 </div>

//               );

//             }
//           )}


//           {/* ==================================================
//               PREFERRED TRAVEL DATE
//           ================================================== */}

//           {isHolidayRelevant && (

//             <div
//               className="
//                 col-start-6
//                 row-start-1
//                 w-full
//                 min-w-0
//                 flex
//                 items-center
//               "
//             >

//               <CalendarFilter
//                 label="Preferred Travel Date"

//                 selections={
//                   travelDateSels
//                 }

//                 onApply={
//                   (sels) =>
//                     setTravelDateSel(
//                       sels
//                     )
//                 }

//                 onClear={() =>
//                   setTravelDateSel([])
//                 }
//               />

//             </div>

//           )}


//           {/* ==================================================
//               FOLLOW-UP DATE
//           ================================================== */}

//           <div
//             className="
//               col-start-6
//               row-start-2
//               w-full
//               min-w-0
//               flex
//               items-center
//             "
//           >

//             <CalendarFilter

//               label="Follow-up Date"

//               selections={
//                 followUpSels
//               }

//               onApply={
//                 (sels) =>
//                   setFollowUpSels(
//                     sels
//                   )
//               }

//               onClear={() =>
//                 setFollowUpSels([])
//               }

//             />

//           </div>


//           {/* ==================================================
//               CLEAR FILTERS + REFRESH
//           ================================================== */}

//           <div
//             className="
//               col-start-7
//               row-start-1
//               row-span-2
//               flex
//               items-center
//               justify-end
//               w-full
//               h-full
//               min-w-0
//             "
//           >

//             <div className="flex items-center gap-2">

//               {/* Clear Filters */}

//               <button
//                 type="button"

//                 onClick={
//                   clearFilters
//                 }

//                 className="
//                   px-3
//                   py-1.5
//                   text-sm
//                   bg-blue-700
//                   text-white
//                   rounded
//                   hover:bg-blue-800
//                   whitespace-nowrap
//                 "
//               >
//                 Clear Filters
//               </button>


//               {/* =================================================
//                   REFRESH

//                   IMPORTANT:
//                   This no longer calls window.location.reload().
//                   It asks the parent to reload the lead data.
//               ================================================= */}

//               <button
//                 type="button"

//                 onClick={
//                   handleRefresh
//                 }

//                 className="
//                   px-3
//                   py-1.5
//                   text-sm
//                   bg-gray-600
//                   text-white
//                   rounded
//                   hover:bg-gray-700
//                   whitespace-nowrap
//                 "

//                 title="Refresh lead data"
//               >
//                 Refresh
//               </button>

//             </div>

//           </div>

//         </div>

//       </div>


//       {/* ======================================================
//           SUMMARY BAR + BULK TRANSFER / BULK REOPEN
//       ====================================================== */}

//       <div className="flex flex-row mt-2 gap-2 items-stretch flex-shrink-0">
//         <div
//           className={
//             isBulkTransferMode || isBulkReopenMode
//               ? "w-[65%]"
//               : "w-[70%]"
//           }
//         >
//           <LeadsSummaryBar dateRange={dateRange} leads={sortedLeads} />
//         </div>

//         <div className={isBulkTransferMode || isBulkReopenMode ? "w-[35%]" : "w-[15%]"}>
//           {!isBulkTransferMode && !isBulkReopenMode ? (
//             <div className="w-full h-full flex gap-2">
//               {SHOW_TRANSFER_OPTIONS && (
//                 <button
//                   type="button"
//                   onClick={() => { setIsBulkTransferMode(true); setSelectedLeadIds([]); }}
//                   className="flex-1 h-full rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 transition-colors duration-150"
//                 >
//                   Bulk Transfer
//                 </button>
//               )}

//               {SHOW_REOPEN_OPTIONS && (
//                 <button
//                   type="button"
//                   onClick={() => { setIsBulkReopenMode(true); setSelectedLeadIds([]); }}
//                   className="flex-1 h-full rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 transition-colors duration-150"
//                 >
//                   Bulk Reopen
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className={`w-full h-full flex items-center justify-between gap-2 px-3 rounded-lg border ${isBulkReopenMode ? "bg-amber-50 border-amber-100" : "bg-blue-50 border-blue-100"}`}>
//               <span className={`text-xs font-medium whitespace-nowrap ${isBulkReopenMode ? "text-amber-700" : "text-blue-700"}`}>
//                 {selectedCount} selected
//               </span>
//               <div className="flex items-center gap-1.5">
//                 <button type="button" onClick={isBulkReopenMode ? exitBulkReopenMode : exitBulkMode} className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 whitespace-nowrap transition-colors duration-150">
//                   Clear
//                 </button>
//                 {isBulkReopenMode ? (
//                   <button type="button" onClick={handleBulkReopenClick} disabled={selectedCount === 0} className="px-2.5 py-1 text-xs font-medium text-white bg-amber-600 rounded hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap transition-colors duration-150">
//                     Reopen
//                   </button>
//                 ) : (
//                   <button type="button" onClick={handleBulkTransferClick} disabled={selectedCount === 0} className="px-2.5 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap transition-colors duration-150">
//                     Transfer
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ======================================================
//           LEAD TABLE
//       ====================================================== */}

//       <div className="
//         overflow-auto
//         flex-1
//         border
//         rounded-lg
//         mt-2
//       ">

//         <table className="
//           w-full
//           text-xs
//           border-collapse
//         ">

//           {/* ==================================================
//               TABLE HEADER
//           ================================================== */}

//           <thead className="bg-gray-100">

//             <tr>

//               <th className="
//                 p-2
//                 text-left
//                 sticky
//                 top-0
//                 z-10
//                 bg-gray-100
//               ">
//                 Sr. No.
//               </th>


//               <SortableHeader
//                 label="Lead Name"
//                 sortKey="fName"
//                 sortConfig={sortConfig}
//                 onSort={handleSort}
//               />


//               <SortableHeader
//                 label="Category"
//                 sortKey="categoryName"
//                 sortConfig={sortConfig}
//                 onSort={handleSort}
//               />


//               <SortableHeader
//                 label="Assigned To"
//                 sortKey="assignedTo"
//                 sortConfig={sortConfig}
//                 onSort={handleSort}
//               />


//               <th className="
//                 p-2
//                 text-left
//                 sticky
//                 top-0
//                 z-10
//                 bg-gray-100
//               ">
//                 Lead ID
//               </th>


//               <SortableHeader
//                 label="Status"
//                 sortKey="status"
//                 sortConfig={sortConfig}
//                 onSort={handleSort}
//               />


//               <SortableHeader
//                 label="Created Date"
//                 sortKey="createdAt"
//                 sortConfig={sortConfig}
//                 onSort={handleSort}
//               />


//               <SortableHeader
//                 label="Latest Update"
//                 sortKey="latestUpdateAt"
//                 sortConfig={sortConfig}
//                 onSort={handleSort}
//               />


//               <SortableHeader
//                 label="Customer Type"
//                 sortKey="customerTypeDescription"
//                 sortConfig={sortConfig}
//                 onSort={handleSort}
//               />


//               {/* Holiday columns */}

//               {isHolidayRelevant && (

//                 <th className="
//                   p-2
//                   text-left
//                   sticky
//                   top-0
//                   z-10
//                   bg-gray-100
//                 ">
//                   Trip Type / Lead Type
//                 </th>

//               )}


//               {isHolidayRelevant && (

//                 <th className="
//                   p-2
//                   text-left
//                   sticky
//                   top-0
//                   z-10
//                   bg-gray-100
//                 ">
//                   Destinations
//                 </th>

//               )}


//               {isHolidayRelevant && (

//                 <SortableHeader
//                   label="Preferred Travel Date"
//                   sortKey="travelDate"
//                   sortConfig={sortConfig}
//                   onSort={handleSort}
//                 />

//               )}


//               <SortableHeader
//                 label="Follow-up Date"
//                 sortKey="followUpDate"
//                 sortConfig={sortConfig}
//                 onSort={handleSort}
//               />


//               {/* Transfer column */}
//               {SHOW_TRANSFER_OPTIONS && (
//                 <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">
//                   {isBulkTransferMode ? (
//                     <input ref={selectAllRef} type="checkbox" checked={allSelected} onChange={toggleSelectAll} title="Select all transferable leads" />
//                   ) : "TransferTo"}
//                 </th>
//               )}

//               {/* Reopen column */}
//               {SHOW_REOPEN_OPTIONS && (
//                 <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">
//                   {isBulkReopenMode ? "Select" : "Reopen"}
//                 </th>
//               )}


//               <th className="
//                 p-2
//                 text-left
//                 sticky
//                 top-0
//                 z-10
//                 bg-gray-100
//               ">
//                 Details
//               </th>

//             </tr>

//           </thead>


//           {/* ==================================================
//               TABLE BODY
//           ================================================== */}

//           <tbody>

//             {sortedLeads.map(
//               (lead, idx) => {
//                 const selectionKey = leadToSelectionKeyMapRef.current.get(lead);

//                 return (
//                 <tr
//                   key={selectionKey || `row-${idx}`}
//                   className="
//                     border-b
//                     hover:bg-gray-50
//                   "
//                 >

//                   {/* Sr. No. */}

//                   <td className="p-2">
//                     {idx + 1}
//                   </td>


//                   {/* Lead Name */}

//                   <td className="p-2">

//                     <div className="
//                       flex
//                       flex-col
//                     ">

//                       <span className="font-medium">

//                         {lead.title?.trim()}{" "}
//                         {lead.fName}{" "}
//                         {lead.lName}

//                       </span>


//                       {lead.histories &&
//                         lead.histories.length >
//                           0 &&
//                         lead.histories[0]
//                           .notes && (

//                           <span className="
//                             text-xs
//                             text-gray-500
//                             mt-0.5
//                             max-w-[225px]
//                             break-words
//                           ">
//                             Notes:{" "}
//                             {
//                               lead
//                                 .histories[0]
//                                 .notes
//                             }
//                           </span>

//                         )}

//                     </div>

//                   </td>


//                   {/* Category */}

//                   <td className="p-2">
//                     {lead.categoryName}
//                   </td>


//                   {/* Assigned To */}

//                   <td className="
//                     p-2
//                     font-semibold
//                   ">
//                     {lead.assignedTo}
//                   </td>


//                   {/* Lead ID */}

//                   <td className="
//                     p-2
//                     text-center
//                   ">
//                     {lead.categoryId
// }
//                   </td>


//                   {/* Status */}

//                   <td
//                     className={`
//                       p-2
//                       font-semibold

//                       ${
//                         lead.status ===
//                         "Lost"

//                           ? "text-lostText"

//                           : lead.status ===
//                             "Confirmed"

//                             ? "text-confirmedText"

//                             : lead.status ===
//                               "Postponed"

//                               ? "text-postponedText"

//                               : "text-openText"
//                       }
//                     `}
//                   >
//                     {lead.status}
//                   </td>


//                   {/* Created Date */}

//                   <td className="p-2">

//                     {new Date(
//                       lead.createdAt
//                     )
//                       .toLocaleDateString(
//                         "en-GB"
//                       )
//                       .replace(
//                         /\//g,
//                         "-"
//                       )}

//                   </td>


//                   {/* Latest Update */}

//                   <td className="p-2">

//                     {getLatestUpdate(
//                       lead
//                     )

//                       ? new Date(
//                           getLatestUpdate(
//                             lead
//                           )
//                         )
//                           .toLocaleDateString(
//                             "en-GB"
//                           )
//                           .replace(
//                             /\//g,
//                             "-"
//                           )

//                       : "—"}

//                   </td>


//                   {/* Customer Type */}

//                   <td className="p-2">
//                     {
//                       lead.customerTypeDescription
//                     }
//                   </td>


//                   {/* Holiday Trip / Lead Type */}

//                   {isHolidayRelevant && (

//                     <td className="p-2">

//                       {isHolidayLead(
//                         lead
//                       ) ? (

//                         <div className="
//                           flex
//                           gap-1
//                           flex-wrap
//                         ">

//                           {getTripType(
//                             lead
//                           ) && (

//                             <span className="
//                               px-2
//                               py-0.5
//                               rounded-full
//                               text-[10px]
//                               bg-blue-100
//                               text-blue-700
//                             ">
//                               {
//                                 getTripType(
//                                   lead
//                                 )
//                               }
//                             </span>

//                           )}


//                           {getLeadType(
//                             lead
//                           ) && (

//                             <span className="
//                               px-2
//                               py-0.5
//                               rounded-full
//                               text-[10px]
//                               bg-purple-100
//                               text-purple-700
//                             ">
//                               {
//                                 getLeadType(
//                                   lead
//                                 )
//                               }
//                             </span>

//                           )}

//                         </div>

//                       ) : (

//                         <span className="
//                           text-gray-400
//                         ">
//                           —
//                         </span>

//                       )}

//                     </td>

//                   )}


//                   {/* Destinations */}

//                   {isHolidayRelevant && (

//                     <td className="
//                       p-2
//                       max-w-[220px]
//                     ">

//                       {isHolidayLead(
//                         lead
//                       ) &&
//                       getDestinations(
//                         lead
//                       ) ? (

//                         <span className="
//                           text-[11px]
//                           text-gray-700
//                         ">
//                           {
//                             getDestinations(
//                               lead
//                             )
//                           }
//                         </span>

//                       ) : (

//                         <span className="
//                           text-gray-400
//                         ">
//                           —
//                         </span>

//                       )}

//                     </td>

//                   )}


//                   {/* Preferred Travel Date */}

//                   {isHolidayRelevant && (

//                     <td className="
//                       p-2
//                       max-w-[220px]
//                     ">

//                       {isHolidayLead(
//                         lead
//                       ) &&
//                       getTravelDate(
//                         lead
//                       ) ? (

//                         <span className="
//                           text-[11px]
//                           text-gray-700
//                         ">
//                           {
//                             getTravelDate(
//                               lead
//                             )
//                           }
//                         </span>

//                       ) : (

//                         <span className="
//                           text-gray-400
//                         ">
//                           —
//                         </span>

//                       )}

//                     </td>

//                   )}


//                   {/* Follow-up Date */}

//                   <td className="p-2">

//                     {lead.followUpDate

//                       ? new Date(
//                           lead.followUpDate
//                         )
//                           .toLocaleDateString(
//                             "en-GB"
//                           )
//                           .replace(
//                             /\//g,
//                             "-"
//                           )

//                       : (

//                         <span className="
//                           text-gray-400
//                         ">
//                           —
//                         </span>

//                       )}

//                   </td>


//                   {/* ==================================================
//                       TRANSFER
//                   ================================================== */}

//                   {SHOW_TRANSFER_OPTIONS && (
//                     <td className={`p-2 text-center ${isBulkReopenMode ? "opacity-40" : ""}`}>
//                       {isBulkTransferMode ? (
//                         <input
//                           type="checkbox"
//                           checked={selectedLeadIds.includes(selectionKey)}
//                           disabled={!isLeadTransferable(lead)}
//                           onChange={() => toggleLeadSelected(selectionKey)}
//                           title={!isLeadTransferable(lead) ? "You do not have permission to transfer this lead" : "Select lead"}
//                         />
//                       ) : (
//                         <button
//                           className={`inline-flex items-center justify-center p-1.5 rounded ${!isLeadTransferable(lead) || isBulkReopenMode ? "bg-gray-300 cursor-not-allowed text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
//                           title={isBulkReopenMode ? "Transfer disabled while bulk reopen mode is active" : (!isLeadTransferable(lead) ? "Transfer not permitted" : "Transfer Lead")}
//                           onClick={() => openTransferModal(lead)}
//                           disabled={!isLeadTransferable(lead) || isBulkReopenMode}
//                         >
//                           <SwapIcon />
//                         </button>
//                       )}
//                     </td>
//                   )}

//                   {/* ==================================================
//                       REOPEN
//                   ================================================== */}

//                   {SHOW_REOPEN_OPTIONS && (
//                     <td className={`p-2 text-center ${isBulkTransferMode ? "opacity-40" : ""}`}>
//                       {isBulkReopenMode ? (
//                         <input
//                           type="checkbox"
//                           checked={selectedLeadIds.includes(selectionKey)}
//                           disabled={!isLeadReopenable(lead)}
//                           onChange={() => toggleLeadSelected(selectionKey)}
//                           title={!isLeadReopenable(lead) ? "This lead cannot be reopened with the current permissions" : "Select lead to reopen"}
//                         />
//                       ) : (
//                         <button
//                           type="button"
//                           className={`inline-flex items-center justify-center px-2 py-1.5 rounded text-xs font-semibold ${!isLeadReopenable(lead) || isBulkTransferMode ? "bg-gray-300 cursor-not-allowed text-white" : "bg-amber-500 text-white hover:bg-amber-600"}`}
//                           title={isBulkTransferMode ? "Reopen disabled while bulk transfer mode is active" : (!isLeadReopenable(lead) ? "Reopen not permitted" : "Reopen Lead")}
//                           onClick={() => openReopenModal(lead)}
//                           disabled={!isLeadReopenable(lead) || isBulkTransferMode}
//                         >
//                           ↻
//                         </button>
//                       )}
//                     </td>
//                   )}

//                   {/* ==================================================
//                       DETAILS
//                   ================================================== */}

//                   <td className="p-2">

//                     <button
//                       className="
//                         p-1.5
//                         rounded
//                         text-blue-700
//                         hover:bg-blue-50
//                       "

//                       title="View Details"

//                       onClick={() =>
//                         handleViewClick(
//                           lead
//                         )
//                       }
//                     >

//                       <EyeIcon />

//                     </button>

//                   </td>

//                 </tr>
//                 );
//               }
//             )}

//           </tbody>

//         </table>

//       </div>


//       {/* ======================================================
//           VIEW LEAD MODAL
//       ====================================================== */}

//       <UpdateLeadsModal

//         parent="Leads with filters"

//         isOpen={
//           isModalOpen
//         }

//         onClose={() =>
//           setModalOpen(
//             false
//           )
//         }

//         lead={
//           selectedLead
//         }

//         mode="view"

//       />


//       {/* ======================================================
//           LEAD TRANSFER MODAL
//       ======================================================

//       `selectedLeads` is ALWAYS an array.

//       Single:
//       [lead]

//       Bulk:
//       [lead1, lead2, lead3]
//       ====================================================== */}

//       <LeadTransferModal

//         isOpen={
//           showTransferModal
//         }

//         onClose={() => {

//           setShowTransferModal(
//             false
//           );

//           setSelectedTransferLeads(
//             []
//           );

//         }}

//         users={
//           transferUsers
//         }

//         onTransfer={
//           handleTransfer
//         }

//         loadingUsers={
//           loadingUsers
//         }

//         Kept for compatibility with your existing modal.
//         Single lead is the first array item.

//         selectedLead={
//           selectedTransferLeadEntries[0] ||
//           null
//         }

//         Actual transfer collection.

//         selectedLeads={
//           selectedTransferLeadEntries
//         }

//       />

//       {/* Confirmed/Lost warning. NO preserves the existing checkbox selection. */}
//       {showTransferConfirmation && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
//           <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-gray-200">
//             <div className="px-5 py-4 border-b border-gray-100">
//               <h3 className="text-base font-semibold text-gray-800">Confirm Lead Transfer</h3>
//             </div>
//             <div className="px-5 py-5">
//               <p className="whitespace-pre-line text-sm leading-6 text-gray-700">{transferConfirmationMessage}</p>
//             </div>
//             <div className="px-5 py-3 border-t border-gray-100 flex justify-end gap-2">
//               <button type="button" onClick={handleTransferConfirmationNo} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">No</button>
//               <button type="button" onClick={handleTransferConfirmationYes} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Yes, Continue</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Bulk reopen confirmation. Selection is preserved when user clicks No. */}
//       {showReopenConfirmation && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
//           <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-gray-200">
//             <div className="px-5 py-4 border-b border-gray-100">
//               <h3 className="text-base font-semibold text-gray-800">Confirm Lead Reopen</h3>
//             </div>
//             <div className="px-5 py-5">
//               <p className="whitespace-pre-line text-sm leading-6 text-gray-700">{reopenConfirmationMessage}</p>
//             </div>
//             <div className="px-5 py-3 border-t border-gray-100 flex justify-end gap-2">
//               <button type="button" onClick={handleReopenConfirmationNo} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">No</button>
//               <button type="button" onClick={handleReopenConfirmationYes} className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700">Yes, Continue</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Temporary reopen reason/message modal. Reason is mandatory. */}
//       {showReopenModal && (
//         <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4">
//           <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl border border-gray-200">
//             <div className="px-5 py-4 border-b border-gray-100">
//               <h3 className="text-base font-semibold text-gray-800">Reopen Lead{selectedReopenLeads.length > 1 ? "s" : ""}</h3>
//               <p className="mt-1 text-xs text-gray-500">Please provide a reason/message for reopening. This field is mandatory.</p>
//             </div>

//             <div className="px-5 py-5">
//               <div className="mb-3 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-600">
//                 {selectedReopenLeads.length} lead{selectedReopenLeads.length > 1 ? "s" : ""} selected
//               </div>

//               <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Reason / Message <span className="text-red-600">*</span>
//               </label>
//               <textarea
//                 value={reopenReason}
//                 onChange={(e) => setReopenReason(e.target.value)}
//                 rows={5}
//                 maxLength={1000}
//                 placeholder="Enter the reason for reopening the selected lead(s)..."
//                 className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
//                 autoFocus
//               />
//               <div className="mt-1 text-right text-[11px] text-gray-400">{reopenReason.length}/1000</div>
//             </div>

//             <div className="px-5 py-3 border-t border-gray-100 flex justify-end gap-2">
//               <button type="button" onClick={() => { setShowReopenModal(false); setSelectedReopenLeads([]); setReopenReason(""); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
//               <button type="button" onClick={handleReopenSubmit} disabled={!reopenReason.trim()} className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed">Reopen</button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

import React, { useMemo, useState } from "react";
import { CardContent } from "@mui/material";
import { MESSAGE_TYPES } from "./Constants";
import axios from "axios";
import UpdateLeadsModal from "./UpdateLeadsModal";
import { getEmptyLeadObj } from "./Model/LeadModel";
import config from "./config";
import { useMessageBox } from "./Notification";
import { useGetSessionUser } from "./SessionContext";
import LeadTransferModal from "./LeadTransferModal";
import ReOpenLeadModal from "./ReOpenLeadModal";
import MessageBox from "./MessageBox";


import {
  LoadingOverlay,
  MultiSelectFilter,
  SortableHeader,
  SwapIcon,
  EyeIcon,
  splitDestinations,
  isHolidayLead,
  getTripType,
  getLeadType,
  getDestinations,
  getLatestUpdate,
  getTravelDate,
  CalendarFilter,
  LeadsSummaryBar,
} from "./LeadsSharedTable";


// ============================================================
// GENERAL FILTER CONFIGURATION
// ============================================================

// Allow multiple values to be selected in the filters.
const ALLOW_MULTI_SELECT = true;


// ============================================================
// FILTER LABELS
// ============================================================

const FILTER_LABELS = {
  status: "Status",
  customerTypeDescription: "Customer Type",
  categoryName: "Category",
  assignedTo: "Assigned To",
  tripType: "Domestic/International",
  leadType: "FIT/GIT",
  preferredDestination: "Destination",
};


// ============================================================
// FILTER GROUPS
// ============================================================

const BASE_FILTER_KEYS = [
  "categoryName",
  "assignedTo",
  "status",
  "customerTypeDescription",
];

const HOLIDAY_FILTER_KEYS = [
  "tripType",
  "leadType",
  "preferredDestination",
];


// ============================================================
// LEAD TRANSFER PERMISSIONS
// ============================================================
//
// These flags are temporary.
//
// Later these should come from the DB / SessionContext.
//
// SHOW_TRANSFER_OPTIONS
//      Master permission.
//      If FALSE -> no transfer UI will be displayed.
//
// CAN_TRANSFER_CONFIRMED
//      Controls transfer of Confirmed leads.
//
// CAN_TRANSFER_LOST
//      Controls transfer of Lost leads.
//
// For now all are TRUE.
// ============================================================

const SHOW_TRANSFER_OPTIONS = true;

const CAN_TRANSFER_CONFIRMED = true;

const CAN_TRANSFER_LOST = true;

// ============================================================
// LEAD REOPEN PERMISSIONS
// ============================================================
// These are intentionally hard-coded for now.
// Later they can come from DB / SessionContext exactly like transfer.
const SHOW_REOPEN_OPTIONS = true;
const CAN_REOPEN_CONFIRMED = true;
const CAN_REOPEN_LOST = true;
const CAN_REOPEN_POSTPONED = true;
const CAN_REOPEN_CLOSED = true;


// ============================================================
// CHECK WHETHER A LEAD CAN BE TRANSFERRED
// ============================================================
//
// This is the single place where transfer permission is checked.
//
// This will make it easy later to replace these hard-coded flags
// with DB-driven permissions.
// ============================================================

const isLeadTransferable = (lead) => {

  // Master transfer permission.
  if (!SHOW_TRANSFER_OPTIONS) {
    return false;
  }

  const status = (lead?.status || "")
    .trim()
    .toLowerCase();


  // Confirmed lead.
  if (status === "confirmed") {
    return CAN_TRANSFER_CONFIRMED;
  }


  // Lost lead.
  if (status === "lost") {
    return CAN_TRANSFER_LOST;
  }


  // Open / Postponed / other statuses.
  return true;
};


// ============================================================
// CHECK WHETHER A LEAD CAN BE REOPENED
// ============================================================
const isLeadReopenable = (lead) => {
  if (!SHOW_REOPEN_OPTIONS) return false;

  const status = (lead?.status || "").trim().toLowerCase();

  if (status === "confirmed") return CAN_REOPEN_CONFIRMED;
  if (status === "lost") return CAN_REOPEN_LOST;
  if (status === "postponed") return CAN_REOPEN_POSTPONED;
  if (status === "closed") return CAN_REOPEN_CLOSED;

  return false;
};


// ============================================================
// SEARCHABLE MULTI SELECT FILTER
// ============================================================
//
// Same basic behaviour as the existing MultiSelectFilter,
// but with a search box for long lists.
// ============================================================

function SearchableMultiSelectFilter({
  label,
  options,
  selected,
  onToggle,
  onClear,
}) {

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [showTooltip, setShowTooltip] = useState(false);

  const wrapperRef = React.useRef(null);

  const isActive = selected.length > 0;


  // ----------------------------------------------------------
  // Close dropdown when clicking outside.
  // ----------------------------------------------------------

  React.useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {

        setOpen(false);

        setShowTooltip(false);
      }
    };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, []);


  // ----------------------------------------------------------
  // Filter options based on search text.
  // ----------------------------------------------------------

  const filteredOptions = useMemo(
    () =>
      options.filter((o) =>
        o
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [options, search]
  );


  return (
    <div
      className="relative w-full min-w-0"
      ref={wrapperRef}
    >

      {/* =====================================================
          FILTER BUTTON
      ===================================================== */}

      <div
        className="relative w-full"

        onMouseEnter={() => {

          if (isActive && !open) {
            setShowTooltip(true);
          }

        }}

        onMouseLeave={() => {
          setShowTooltip(false);
        }}
      >

        <button
          type="button"

          onClick={() => {

            setOpen((o) => !o);

            setShowTooltip(false);

          }}

          className={`
            border
            px-2
            py-1.5
            rounded
            text-sm
            w-full
            min-w-0
            text-left
            flex
            items-center
            gap-1.5
            transition
            font-medium

            ${isActive
              ? "bg-blue-600 border-blue-600 text-white"
              : "bg-white border-gray-400 text-gray-700 hover:border-gray-600"
            }
          `}
        >

          {/* Filter name / selected count */}

          <span className="truncate flex-1 min-w-0">

            {isActive
              ? `${label} (${selected.length})`
              : label}

          </span>


          {/* Clear filter */}

          {isActive ? (

            <span
              onMouseDown={(e) => {

                e.stopPropagation();

                e.preventDefault();

                onClear && onClear();

                setOpen(false);

                setShowTooltip(false);

              }}

              title={`Clear ${label} filter`}

              className="
                flex-shrink-0
                w-4
                h-4
                rounded-full
                bg-white
                text-red-600
                flex
                items-center
                justify-center
                text-[11px]
                font-black
                leading-none
                hover:bg-red-100
                cursor-pointer
              "
            >
              ✕
            </span>

          ) : (

            <span
              className="
                text-[10px]
                text-gray-500
                flex-shrink-0
              "
            >
              {open ? "▲" : "▼"}
            </span>

          )}

        </button>


        {/* =====================================================
            SELECTED VALUES TOOLTIP
        ===================================================== */}

        {showTooltip && isActive && (

          <div
            className="
              absolute
              left-0
              top-full
              mt-2
              z-[100]
              w-max
              max-w-[320px]
              min-w-[180px]
              bg-white
              border
              border-gray-200
              rounded-xl
              shadow-lg
              px-3
              py-2.5
              text-sm
              text-gray-700
              pointer-events-none
            "
          >

            <div
              className="
                font-semibold
                text-gray-600
                mb-1.5
              "
            >
              Selected {label}:
            </div>


            <div className="space-y-1">

              {selected.map((value, index) => (

                <div
                  key={`${value}-${index}`}

                  className="
                    flex
                    items-start
                    gap-1.5
                    text-xs
                    text-gray-600
                  "
                >

                  <span
                    className="
                      w-[5px]
                      h-[5px]
                      rounded-full
                      bg-blue-500
                      flex-shrink-0
                      mt-1
                    "
                  />

                  <span className="break-words">
                    {value}
                  </span>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>


      {/* =====================================================
          DROPDOWN
      ===================================================== */}

      {open && (

        <div
          className="
            absolute
            z-20
            mt-1
            w-full
            min-w-[190px]
            bg-white
            border
            border-gray-200
            rounded
            shadow-lg
            max-h-56
            overflow-auto
          "
        >

          {/* Search box */}

          <div
            className="
              p-2
              border-b
              border-gray-100
              sticky
              top-0
              bg-white
            "
          >

            <input
              type="text"

              autoFocus

              placeholder={`Search ${label}...`}

              value={search}

              onChange={(e) =>
                setSearch(e.target.value)
              }

              className="
                w-full
                text-sm
                px-2
                py-1
                border
                border-gray-300
                rounded
                focus:outline-none
                focus:ring-2
              "
            />

          </div>


          {/* No matches */}

          {filteredOptions.length === 0 && (

            <div className="px-2 py-1.5 text-xs text-gray-400">
              No matches
            </div>

          )}


          {/* Options */}

          {filteredOptions.map((opt) => (

            <label
              key={opt}

              className="
                flex
                items-center
                gap-2
                px-2
                py-1.5
                text-sm
                hover:bg-gray-50
                cursor-pointer
              "
            >

              <input
                type="checkbox"

                checked={selected.includes(opt)}

                onChange={() => onToggle(opt)}
              />

              <span className="truncate">
                {opt}
              </span>

            </label>

          ))}

        </div>

      )}

    </div>
  );
}


// ============================================================
// EMPTY FILTER STATE
// ============================================================

const EMPTY_FILTERS = {

  status: [],

  customerTypeDescription: [],

  categoryName: [],

  assignedTo: [],

  tripType: [],

  leadType: [],

  preferredDestination: [],
};


// ============================================================
// MAIN COMPONENT
// ============================================================
//
// IMPORTANT:
// `onRefresh` must be supplied by the parent component.
//
// Example:
//
// <LeadListWithFilters
//    users={users}
//    dateRange={dateRange}
//    onRefresh={loadLeads}
// />
//
// We intentionally DO NOT use window.location.reload().
// That would reload the entire application and can send the user
// back through the authentication/session initialization.
// ============================================================

export default function LeadListWithFilters({
  users,
  dateRange,
  onRefresh,
}) {

  // ==========================================================
  // API
  // ==========================================================

  const GetLeadsForEditAPI =
    config.apiUrl + "/TempLead/GetLeadForEdit";

  const fetchDataWithFiltersAPI =
    config.apiUrl +
    "/Reporting/GetManagerAnalyticsDataWithFilters";


  // ==========================================================
  // SESSION / MESSAGE
  // ==========================================================

  const {
    user: sessionUser
  } = useGetSessionUser();

  const {
    showMessage
  } = useMessageBox();


  // ==========================================================
  // VIEW MODAL STATE
  // ==========================================================

  const [isModalOpen, setModalOpen] =
    useState(false);

  const [selectedLead, setSelectedLead] =
    useState(null);

  const [mode, setMode] =
    useState("create");


  // ==========================================================
  // LOADING STATE
  // ==========================================================

  const [isLoading, setIsLoading] =
    useState(false);


  // ==========================================================
  // BULK TRANSFER STATE
  // ==========================================================

  const [isBulkTransferMode, setIsBulkTransferMode] =
    useState(false);


  // IDs selected by checkbox.

  const [selectedLeadIds, setSelectedLeadIds] =
    useState([]);


  // Header "select all" checkbox.

  const selectAllRef =
    React.useRef(null);


  // ==========================================================
  // TRANSFER MODAL STATE
  // ==========================================================
  //
  // IMPORTANT:
  // This is ALWAYS an array.
  //
  // Single transfer:
  // [lead]
  //
  // Bulk transfer:
  // [lead1, lead2, lead3]
  // ==========================================================

  const [selectedTransferLeads, setSelectedTransferLeads] =
    useState([]);

  // Backend returns the same SelectionKey with the updated DashboardRowDto.
  // Keep the wrapper outside DashboardRowDto.
  const [transferredLeadEntries, setTransferredLeadEntries] =
    useState([]);



  // ==========================================================
  // TRANSFER USERS
  // ==========================================================

  const [transferUsers, setTransferUsers] =
    useState([]);

  const [loadingUsers, setLoadingUsers] =
    useState(false);


  // Existing state.

  const [leads, setLeads] =
    useState([]);


  const [showTransferModal, setShowTransferModal] =
    useState(false);

  // ==========================================================
  // FRONTEND-ONLY LEAD SELECTION DICTIONARY
  // ==========================================================
  //
  // IMPORTANT: DO NOT add a `key` property to the lead object.
  //
  // We keep the identity completely outside the lead object: 
  //
  //   selectionKey -> current row object
  //   sourceLeadObject -> selectionKey
  //   currentRowObject -> selectionKey
  //
  // Why do we need the second WeakMap?
  // The component creates display-row objects with `{ ...lead }`.
  // If the parent re-renders and creates those display objects again,
  // the display object reference can change even though it is the same
  // underlying lead. Therefore the generated selection key is anchored
  // to the ORIGINAL lead object coming from `users`, not to the cloned
  // display row.
  //
  // This is what prevents a MessageBox/context re-render from making
  // the checkboxes appear unchecked while the selected count remains.
  //
  // Example keys:
  //   VIS_48217391
  //   HOL_73104928
  //   AIR_19382746
  //   CAR_65021483
  // ==========================================================

  // selectionKey -> current display-row object
  const leadSelectionMapRef = React.useRef(new Map());

  // ORIGINAL lead object -> stable selectionKey
  const sourceLeadToSelectionKeyMapRef = React.useRef(new WeakMap());

  // CURRENT display-row object -> selectionKey
  // This is used by the table when rendering checkboxes/rows.
  const leadToSelectionKeyMapRef = React.useRef(new WeakMap());

  const generateLeadSelectionKey = (lead) => {
    const categoryName =
      (lead?.categoryName || "LEAD")
        .trim()
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase();

    const prefix =
      (categoryName.slice(0, 3) || "LEA")
        .padEnd(3, "X");

    let key;

    do {
      // Maximum 8 digits, exactly as discussed.
      const randomNumber = Math.floor(
        Math.random() * 100000000
      );

      key = `${prefix}_${randomNumber}`;
    } while (
      leadSelectionMapRef.current.has(key)
    );

    return key;
  };

  const getOrCreateSelectionKey = (sourceLead) => {
    if (!sourceLead) {
      return null;
    }

    // If this ORIGINAL lead object has already received a key,
    // always reuse it. This is the important stability mechanism.
    const existingKey =
      sourceLeadToSelectionKeyMapRef.current.get(
        sourceLead
      );

    if (existingKey) {
      return existingKey;
    }

    const newKey =
      generateLeadSelectionKey(sourceLead);

    sourceLeadToSelectionKeyMapRef.current.set(
      sourceLead,
      newKey
    );

    console.log(
      "[Lead Selection Dictionary] Generated new selection key:",
      {
        key: newKey,
        category: sourceLead?.categoryName,
        leadId: sourceLead?.categoryId,
      }
    );

    return newKey;
  };

  // ==========================================================
  // DERIVED SELECTED COUNT
  // ==========================================================
  //
  // Do not blindly display selectedLeadIds.length.
  // The Map is the source of truth for whether a selection key still
  // represents a lead currently present on this screen.
  //
  // This also protects the UI from ever showing:
  //   checkboxes = 0 selected
  //   count       = 17 selected
  //
  // ==========================================================
  const selectedCount = selectedLeadIds.filter((selectionKey) =>
    leadSelectionMapRef.current.has(selectionKey)
  ).length;

  // Confirmed/Lost confirmation state. NO never clears the checkbox selection.
  const [showTransferConfirmation, setShowTransferConfirmation] = useState(false);
  const [transferConfirmationMessage, setTransferConfirmationMessage] = useState("");
  const [pendingTransferLeads, setPendingTransferLeads] = useState([]);

  // ==========================================================
  // BULK REOPEN STATE
  // ==========================================================
  const [isBulkReopenMode, setIsBulkReopenMode] = useState(false);
  const [selectedReopenLeads, setSelectedReopenLeads] = useState([]);
  const [reopenedLeadIds, setReopenedLeadIds] = useState([]);

  // Reopen confirmation + temporary reason/message modal.
  const [showReopenConfirmation, setShowReopenConfirmation] = useState(false);
  const [reopenConfirmationMessage, setReopenConfirmationMessage] = useState("");
  const [pendingReopenLeads, setPendingReopenLeads] = useState([]);
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [reopenReason, setReopenReason] = useState("");



  // ==========================================================
  // SPECIAL STATUS WARNING
  // ==========================================================
  //
  // Confirmed and Lost leads are transferable when their
  // respective permission flags are TRUE.
  //
  // However, before transferring them we explicitly ask the
  // user for confirmation.
  // ==========================================================

  const confirmSpecialStatusTransfer = (leadsToTransfer) => {
    const confirmedLeads = leadsToTransfer.filter((lead) => (lead?.status || "").trim().toLowerCase() === "confirmed");
    const lostLeads = leadsToTransfer.filter((lead) => (lead?.status || "").trim().toLowerCase() === "lost");
    if (!confirmedLeads.length && !lostLeads.length) return false;

    const categories = [...new Set(leadsToTransfer.map((lead) => (lead?.categoryName || "").trim()).filter(Boolean))];
    const categoryText = categories.length === 1 ? categories[0] : categories.length === 2 ? `${categories[0]} and ${categories[1]}` : categories.length > 2 ? `${categories.slice(0, -1).join(", ")} and ${categories[categories.length - 1]}` : "the selected";
    const parts = [];
    if (confirmedLeads.length) parts.push(`${confirmedLeads.length} Confirmed lead${confirmedLeads.length > 1 ? "s" : ""}`);
    if (lostLeads.length) parts.push(`${lostLeads.length} Lost lead${lostLeads.length > 1 ? "s" : ""}`);
    const count = confirmedLeads.length + lostLeads.length;
    const message = `You have selected ${categoryText} leads for transfer.

${parts.join(" and ")} ${count === 1 ? "is" : "are"} included in the selected leads.

Are you sure you want to continue with the transfer?`;

    console.log("Special-status transfer confirmation required:", { categories, confirmedCount: confirmedLeads.length, lostCount: lostLeads.length, leadsToTransfer });
    setPendingTransferLeads(leadsToTransfer);
    setTransferConfirmationMessage(message);
    setShowTransferConfirmation(true);
    return true;
  };

  const handleTransferConfirmationYes = () => {
    console.log("User confirmed special-status transfer:", pendingTransferLeads);
    const leadsToTransfer = pendingTransferLeads;
    setShowTransferConfirmation(false);
    setPendingTransferLeads([]);
    setTransferConfirmationMessage("");
    if (!leadsToTransfer.length) return;
    setSelectedTransferLeads(leadsToTransfer);
    setShowTransferModal(true);
    loadTransferUsers();
  };

  const handleTransferConfirmationNo = () => {
    console.log("User cancelled special-status transfer. Selection preserved:", selectedLeadIds);
    setShowTransferConfirmation(false);
    setPendingTransferLeads([]);
    setTransferConfirmationMessage("");
  };


  // ==========================================================
  // REOPEN CONFIRMATION / MODAL
  // ==========================================================

  const confirmBulkReopen = (leadsToReopen) => {
    const counts = {
      closed: 0,
      lost: 0,
      postponed: 0,
      confirmed: 0,
    };

    leadsToReopen.forEach((lead) => {
      const status = (lead?.status || "").trim().toLowerCase();
      if (status === "closed") counts.closed++;
      if (status === "lost") counts.lost++;
      if (status === "postponed") counts.postponed++;
      if (status === "confirmed") counts.confirmed++;
    });

    const categories = [...new Set(
      leadsToReopen.map((lead) => (lead?.categoryName || "").trim()).filter(Boolean)
    )];

    const categoryText =
      categories.length === 1 ? categories[0] :
        categories.length === 2 ? `${categories[0]} and ${categories[1]}` :
          categories.length > 2 ? `${categories.slice(0, -1).join(", ")} and ${categories[categories.length - 1]}` :
            "the selected";

    const parts = [];
    if (counts.closed) parts.push(`${counts.closed} Closed lead${counts.closed > 1 ? "s" : ""}`);
    if (counts.lost) parts.push(`${counts.lost} Lost lead${counts.lost > 1 ? "s" : ""}`);
    if (counts.postponed) parts.push(`${counts.postponed} Postponed lead${counts.postponed > 1 ? "s" : ""}`);
    if (counts.confirmed) parts.push(`${counts.confirmed} Confirmed lead${counts.confirmed > 1 ? "s" : ""}`);

    const count = leadsToReopen.length;
    const message = `You have selected ${categoryText} leads to reopen.\n\n${parts.join(", ")} ${count === 1 ? "is" : "are"} included in the selected leads.\n\nAre you sure you want to continue with reopening these leads?`;

    setPendingReopenLeads(leadsToReopen);
    setReopenConfirmationMessage(message);
    setShowReopenConfirmation(true);
    return true;
  };

  const openReopenModal = (lead) => {
    if (!SHOW_REOPEN_OPTIONS || !isLeadReopenable(lead)) {
      showMessage("You do not have permission to reopen this lead.", MESSAGE_TYPES.WARNING);
      return;
    }

    setSelectedReopenLeads([lead]);
    setReopenReason("");
    setShowReopenModal(true);
  };

  const handleReopenConfirmationYes = () => {
    const leadsToReopen = pendingReopenLeads;
    setShowReopenConfirmation(false);
    setPendingReopenLeads([]);
    setReopenConfirmationMessage("");

    if (!leadsToReopen.length) return;

    setSelectedReopenLeads(leadsToReopen);
    setReopenReason("");
    setShowReopenModal(true);
  };

  const handleReopenConfirmationNo = () => {
    setShowReopenConfirmation(false);
    setPendingReopenLeads([]);
    setReopenConfirmationMessage("");
  };

  // Temporary frontend-only submit. Replace the marked section with the
  // reopen API call once the backend contract is finalized.
  // const handleReopenSubmit = async () => {
  //   const reason = reopenReason.trim();

  //   if (!reason) {
  //     showMessage("Reason / message to reopen is mandatory.", MESSAGE_TYPES.WARNING);
  //     return;
  //   }

  //   const leadsToReopen = selectedReopenLeads;
  //   if (!leadsToReopen.length) return;

  //   console.log("TEMP REOPEN REQUEST", {
  //     leadIds: leadsToReopen.map((lead) => lead?.categoryId),
  //     leads: leadsToReopen,
  //     reason,
  //   });

  //   // TODO: Replace this temporary section with your reopen API call.
  //   // Example payload to send later:
  //   // { leadIds: [...], reason, requestedBy_UserID: sessionUser?.user?.userId }

  //   const selectionKeys = leadsToReopen
  //     .map((lead) => leadToSelectionKeyMapRef.current.get(lead))
  //     .filter(Boolean);

  //   // Keep the rows visible for now because no backend reopen API has been
  //   // wired yet. Once the API is added, update `reopenedLeadIds` only after
  //   // the API confirms success, exactly like transfer.
  //   console.log("Temporary reopen request captured. Selection keys:", selectionKeys);
  //   setShowReopenModal(false);
  //   setSelectedReopenLeads([]);
  //   setReopenReason("");

  //   showMessage("Reopen request captured. Backend API is not wired yet.", MESSAGE_TYPES.WARNING);
  // };

  // const handleReopenSubmit = async () => {
  //   const reason = reopenReason.trim();

  //   if (!reason) {
  //     showMessage("Reason / message to reopen is mandatory.", MESSAGE_TYPES.WARNING);
  //     return;
  //   }

  //   const entries = selectedReopenLeadEntries;
  //   if (!entries.length) return;

  //   // Payload for the future API (same wrapper style as transfer)
  //   const payload = {
  //     reopenLeads: entries,               // [{ selectionKey, lead }]
  //     reason,
  //     requestedBy_UserID: sessionUser?.user?.userId,
  //   };

  //   console.log("TEMP REOPEN REQUEST", payload);

  //   // TODO: call reopen API with `payload`.
  //   // On success, only for keys the backend confirms:
  //   //   setReopenedLeadIds((prev) => [...prev, ...successKeys]);

  //   setShowReopenModal(false);
  //   setSelectedReopenLeads([]);
  //   setReopenReason("");

  //   showMessage("Reopen request captured. Backend API is not wired yet.", MESSAGE_TYPES.WARNING);
  // };

  // Called by ReOpenLeadModal after the API succeeds.
  // Identify rows ONLY by selectionKey.
  const handleReopened = async ({ reopenedEntries }) => {
    const keys = (reopenedEntries || [])
      .map((entry) => entry.selectionKey)
      .filter(Boolean);

    if (keys.length > 0) {
      setReopenedLeadIds((prev) => [...new Set([...prev, ...keys])]);
    }

    setSelectedLeadIds([]);
    setSelectedReopenLeads([]);

    showMessage(
      `${keys.length} Lead${keys.length > 1 ? "s" : ""} reopened successfully.`,
      MESSAGE_TYPES.SUCCESS
    );
  };

  const handleBulkReopenClick = () => {
    if (!SHOW_REOPEN_OPTIONS || !selectedLeadIds.length) return;

    const leadsToReopen = selectedLeadIds
      .map((selectionKey) => leadSelectionMapRef.current.get(selectionKey))
      .filter(Boolean);

    if (!leadsToReopen.length) return;

    const nonReopenable = leadsToReopen.filter((lead) => !isLeadReopenable(lead));
    if (nonReopenable.length) {
      showMessage("One or more selected leads cannot be reopened based on your current reopen permissions.", MESSAGE_TYPES.WARNING);
      return;
    }

    if (confirmBulkReopen(leadsToReopen)) return;
  };

  const exitBulkReopenMode = () => {
    setIsBulkReopenMode(false);
    setSelectedLeadIds([]);
  };


  // ==========================================================
  // SINGLE LEAD TRANSFER
  // ==========================================================

  const openTransferModal = (lead) => {

    // Master permission.

    if (!SHOW_TRANSFER_OPTIONS) {
      return;
    }


    // Individual permission check.

    if (!isLeadTransferable(lead)) {

      showMessage(
        "You do not have permission to transfer this lead.",
        MESSAGE_TYPES.WARNING
      );

      return;
    }


    // Confirm if this is Confirmed / Lost.

    const confirmationShown =
      confirmSpecialStatusTransfer([lead]);

    // `true` means the confirmation dialog has been opened.
    // IMPORTANT: do NOT open the transfer modal yet.
    // The Yes button will do that later.
    if (confirmationShown) {
      console.log(
        "[Single Transfer] Special-status confirmation shown. Waiting for user response."
      );
      return;
    }

    // No confirmation was necessary, so open the transfer modal directly.

    // ALWAYS array.

    setSelectedTransferLeads([
      lead
    ]);


    setShowTransferModal(true);


    loadTransferUsers();
  };


  // ==========================================================
  // BULK TRANSFER
  // ==========================================================
  //
  // Validation order:
  //
  // 1. Transfer permission
  // 2. Get selected leads
  // 3. Validate categories
  // 4. Confirm Confirmed/Lost leads
  // 5. Open modal
  // ==========================================================

  const handleBulkTransferClick = () => {

    if (!SHOW_TRANSFER_OPTIONS) {
      return;
    }


    if (!selectedLeadIds.length) {
      return;
    }


    // Resolve selected frontend keys to the exact lead objects.
    // Never use categoryId/leadID here because they can collide.
    const leadsToTransfer = selectedLeadIds
      .map((selectionKey) => leadSelectionMapRef.current.get(selectionKey))
      .filter(Boolean);

    console.log("Bulk transfer selection keys:", selectedLeadIds);
    console.log("Bulk transfer resolved exact lead objects:", leadsToTransfer);


    if (!leadsToTransfer.length) {
      return;
    }


    // ========================================================
    // CHECK INDIVIDUAL TRANSFER PERMISSION
    // ========================================================

    const nonTransferableLeads =
      leadsToTransfer.filter(
        (lead) =>
          !isLeadTransferable(lead)
      );


    if (nonTransferableLeads.length > 0) {

      showMessage(
        "One or more selected leads cannot be transferred based on your current transfer permissions.",
        MESSAGE_TYPES.WARNING
      );

      return;
    }


    // ========================================================
    // CHECK MULTIPLE CATEGORIES
    // ========================================================
    //
    // Example:
    //
    // VISA + HOLIDAY
    //
    // -> NOT allowed.
    //
    // VISA + VISA
    //
    // -> allowed.
    // ========================================================

    const categories = [
      ...new Set(
        leadsToTransfer
          .map(
            (lead) =>
              (lead?.categoryName || "")
                .trim()
          )
          .filter(Boolean)
      ),
    ];


    if (categories.length > 1) {

      // Make a readable list:
      //
      // VISA and HOLIDAY
      //
      // or:
      //
      // VISA, HOLIDAY and AIR TICKETING

      const categoryText =
        categories.length === 2
          ? `${categories[0]} and ${categories[1]}`
          : `${categories
            .slice(0, -1)
            .join(", ")} and ${categories[
            categories.length - 1
            ]
          }`;


      showMessage(
        `You have selected ${categoryText} leads. Bulk transfer is allowed only for leads from one category at a time. Please select leads from only one category.`,
        MESSAGE_TYPES.WARNING
      );


      return;
    }


    // ========================================================
    // CONFIRMED / LOST WARNING
    // ========================================================

    const confirmationShown =
      confirmSpecialStatusTransfer(
        leadsToTransfer
      );

    // `true` means the confirmation dialog is currently visible.
    // Stop here. The Yes button will open the transfer modal exactly once.
    if (confirmationShown) {
      console.log(
        "[Bulk Transfer] Special-status confirmation shown. Waiting for user response."
      );
      return;
    }

    // No Confirmed/Lost leads were selected, so open the modal directly.

    // ========================================================
    // OPEN TRANSFER MODAL
    // ========================================================

    setSelectedTransferLeads(
      leadsToTransfer
    );

    setShowTransferModal(true);

    loadTransferUsers();
  };


  // ==========================================================
  // SUCCESSFUL TRANSFER CALLBACK
  // ==========================================================
  //
  // The backend returns the SAME SelectionKey that came from the UI.
  // Never use LeadID / CategoryID to identify a row here.
  //
  // Single and bulk transfers are handled identically because the
  // response always contains TransferredLeads as an array.
  // ==========================================================

  const handleTransfer = async (transferResult) => {
    if (!transferResult) {
      return;
    }

    /*
     * LeadTransferModal now sends response.data directly.
     *
     * This also safely supports an axios response in case
     * the modal ever passes that instead.
     */
    const result =
      transferResult?.data?.transferredLeads
        ? transferResult.data
        : transferResult;

    const successfulTransfers =
      Array.isArray(result?.transferredLeads)
        ? result.transferredLeads.filter(
          (entry) =>
            entry?.selectionKey &&
            entry?.lead
        )
        : [];

    const failedTransfers =
      Array.isArray(result?.failedLeads)
        ? result.failedLeads.filter(Boolean)
        : [];

    console.log(
      "Transfer Result:",
      result
    );

    /* =========================================================
       UPDATE SUCCESSFULLY TRANSFERRED LEADS
       ========================================================= */

    if (successfulTransfers.length > 0) {
      successfulTransfers.forEach((entry) => {
        const lead = entry.lead;

        /*
         * Keep DashboardRowDto unchanged.
         *
         * assignedTo is only the frontend display property.
         */
        const updatedRow = {
          ...lead,

          assignedTo:
            lead?.leadAssignedToName ||
            lead?.assignedTo ||
            "",

          leadAssignedTo:
            lead?.leadAssignedTo ||
            "",

          status:
            lead?.statusDescription ||
            (
              lead?.histories?.length > 0
                ? lead.histories[0]?.statusDescription
                : ""
            ),
        };

        /*
         * Update the frontend selection dictionary.
         *
         * selectionKey remains OUTSIDE DashboardRowDto.
         */
        leadSelectionMapRef.current.set(
          entry.selectionKey,
          updatedRow
        );

        leadToSelectionKeyMapRef.current.set(
          updatedRow,
          entry.selectionKey
        );
      });

      /*
       * Keep transferred leads as an overlay over the
       * existing users/openLeads/confirmedLeads/etc.
       *
       * This allows the table to immediately show the
       * new assignee without waiting for a refresh.
       */
      setTransferredLeadEntries((prev) => {
        const map = new Map(
          prev.map((entry) => [
            entry.selectionKey,
            entry,
          ])
        );

        successfulTransfers.forEach((entry) => {
          const lead = entry.lead;

          const updatedRow = {
            ...lead,

            assignedTo:
              lead?.leadAssignedToName ||
              lead?.assignedTo ||
              "",

            leadAssignedTo:
              lead?.leadAssignedTo ||
              "",

            status:
              lead?.statusDescription ||
              (
                lead?.histories?.length > 0
                  ? lead.histories[0]?.statusDescription
                  : ""
              ),
          };

          map.set(entry.selectionKey, {
            selectionKey:
              entry.selectionKey,

            lead: updatedRow,
          });
        });

        return Array.from(map.values());
      });
    }

    /* =========================================================
       CLOSE TRANSFER MODAL
       ========================================================= */

    setShowTransferModal(false);
    setSelectedTransferLeads([]);

    /*
     * IMPORTANT:
     * selectedLeadIds is the actual checkbox selection.
     *
     * Clear it regardless of success/failure so the old
     * selection does not remain highlighted.
     */
    setSelectedLeadIds([]);

    /* =========================================================
       SUCCESS MESSAGE
       ========================================================= */

    if (
      successfulTransfers.length > 0 &&
      failedTransfers.length === 0
    ) {
      const leadNames =
        successfulTransfers
          .map((entry) => {
            const lead = entry?.lead;

            return (
              lead?.customerName ||
              `${lead?.fName || ""} ${lead?.lName || ""
                }`.trim() ||
              lead?.leadName ||
              ""
            );
          })
          .filter(Boolean);

      let message =
        `${successfulTransfers.length} Lead${successfulTransfers.length > 1
          ? "s"
          : ""
        } transferred successfully.`;

      if (leadNames.length > 0) {
        message += `\n\n${leadNames.join("\n")}`;
      }

      showMessage(
        message,
        MESSAGE_TYPES.SUCCESS
      );

      return;
    }

    /* =========================================================
       FAILURE MESSAGE
       ========================================================= */

    if (
      successfulTransfers.length === 0 &&
      failedTransfers.length > 0
    ) {
      const failedLeadNames =
        failedTransfers
          .map((entry) => {
            const lead = entry?.lead;

            return (
              lead?.customerName ||
              `${lead?.fName || ""} ${lead?.lName || ""
                }`.trim() ||
              lead?.leadName ||
              ""
            );
          })
          .filter(Boolean);

      const errors =
        Array.isArray(result?.errors)
          ? result.errors.filter(Boolean)
          : [];

      let message =
        `${failedTransfers.length} Lead${failedTransfers.length > 1
          ? "s"
          : ""
        } could not be transferred.`;

      if (failedLeadNames.length > 0) {
        message += `\n\n${failedLeadNames.join("\n")}`;
      }

      if (errors.length > 0) {
        message += `\n\n${errors.join("\n")}`;
      }

      showMessage(
        message,
        MESSAGE_TYPES.ERROR
      );

      return;
    }

    /* =========================================================
       PARTIAL SUCCESS
       ========================================================= */

    if (
      successfulTransfers.length > 0 &&
      failedTransfers.length > 0
    ) {
      const successfulNames =
        successfulTransfers
          .map((entry) => {
            const lead = entry?.lead;

            return (
              lead?.customerName ||
              `${lead?.fName || ""} ${lead?.lName || ""
                }`.trim() ||
              lead?.leadName ||
              ""
            );
          })
          .filter(Boolean);

      const failedNames =
        failedTransfers
          .map((entry) => {
            const lead = entry?.lead;

            return (
              lead?.customerName ||
              `${lead?.fName || ""} ${lead?.lName || ""
                }`.trim() ||
              lead?.leadName ||
              ""
            );
          })
          .filter(Boolean);

      const errors =
        Array.isArray(result?.errors)
          ? result.errors.filter(Boolean)
          : [];

      let message =
        `${successfulTransfers.length} Lead${successfulTransfers.length > 1
          ? "s"
          : ""
        } transferred successfully.`;

      if (successfulNames.length > 0) {
        message += `\n\nTransferred:\n${successfulNames.join(
          "\n"
        )}`;
      }

      message +=
        `\n\n${failedTransfers.length} Lead${failedTransfers.length > 1
          ? "s"
          : ""
        } could not be transferred.`;

      if (failedNames.length > 0) {
        message += `\n\nFailed:\n${failedNames.join(
          "\n"
        )}`;
      }

      if (errors.length > 0) {
        message += `\n\n${errors.join("\n")}`;
      }

      showMessage(
        message,
        MESSAGE_TYPES.WARNING
      );

      return;
    }

    /* =========================================================
       FALLBACK BACKEND MESSAGE
       ========================================================= */

    if (result?.message) {
      showMessage(
        result.message,
        result?.success
          ? MESSAGE_TYPES.SUCCESS
          : MESSAGE_TYPES.ERROR
      );
    }
  };

  // ==========================================================
  // LOAD TRANSFER USERS
  // ==========================================================

  const loadTransferUsers = async () => {

    // Don't load again if already loaded.

    if (transferUsers.length > 0) {
      return;
    }


    // Existing API call can be added here.
    //
    // Keeping your current placeholder untouched.

    // setLoadingUsers(true);
    //
    // const res = await fetch(
    //   "/api/analytics/user-ids"
    // );
    //
    // const data = await res.json();
    //
    // setTransferUsers(data);
    //
    // setLoadingUsers(false);
  };


  // ==========================================================
  // REFRESH ENTIRE LEAD DATA
  // ==========================================================
  //
  // IMPORTANT:
  //
  // DO NOT use:
  //
  // window.location.reload()
  //
  // because that reloads the complete React application and
  // can send the user through login/session initialization.
  //
  // Instead, ask the parent to fetch the lead data again.
  // ==========================================================

  const handleRefresh = async () => {

    try {
      console.log("Refreshing lead data through parent callback...");

      // New users data will create new row objects, so discard the old dictionary first.
      leadSelectionMapRef.current.clear();
      leadToSelectionKeyMapRef.current = new WeakMap();

      setSelectedLeadIds([]);
      setSelectedTransferLeads([]);
      setIsBulkTransferMode(false);
      setIsBulkReopenMode(false);
      setSelectedReopenLeads([]);
      setReopenedLeadIds([]);
      setShowReopenModal(false);
      setShowReopenConfirmation(false);

      if (typeof onRefresh === "function") {
        await onRefresh();
      } else {
        console.warn("LeadListWithFilters: onRefresh was not supplied by the parent.");
        showMessage("Refresh is not configured for this screen.", MESSAGE_TYPES.WARNING);
      }


    } catch (error) {

      console.error(
        "Error refreshing lead data:",
        error
      );


      showMessage(
        "Unable to refresh lead data.",
        MESSAGE_TYPES.ERROR
      );
    }
  };


  // ==========================================================
  // FLATTEN LEADS
  // ==========================================================

  const allLeads = useMemo(() => {

    const leadMap = new Map();

    users.forEach((u) => {
      const combinedLeads = [
        ...(u.openLeads || []),
        ...(u.confirmedLeads || []),
        ...(u.lostLeads || []),
        ...(u.postponedLeads || []),
      ];

      combinedLeads.forEach((lead) => {
        // Generate/reuse the key from the ORIGINAL lead object.
        // SelectionKey is never added to DashboardRowDto.
        const selectionKey = getOrCreateSelectionKey(lead);

        const row = {
          ...lead,
          assignedTo: u.firstName,
          status:
            lead?.histories?.length > 0
              ? lead.histories[0].statusDescription
              : lead.statusDescription,
          leadAssignedTo: u.userID,
        };

        leadMap.set(selectionKey, row);
        leadSelectionMapRef.current.set(selectionKey, row);
        leadToSelectionKeyMapRef.current.set(row, selectionKey);
      });
    });

    // ==========================================================
    // REOPEN LOGIC - KEEP EXISTING BEHAVIOUR
    // ==========================================================
    // Reopen selection/filtering remains handled exactly as before.

    // ==========================================================
    // TRANSFER OVERLAY
    // ==========================================================
    //
    // The backend returns the original SelectionKey together with
    // the updated DashboardRowDto.
    //
    // If the new assignee exists in the current user tree, show the
    // updated lead immediately. If the assignee is not in the current
    // tree, remove that transferred lead from the current list.
    //
    transferredLeadEntries.forEach((entry) => {
      if (!entry?.selectionKey || !entry?.lead) {
        return;
      }

      const transferredLead = entry.lead;

      const newAssigneeExists = users.some(
        (u) =>
          String(u.userID) ===
          String(
            transferredLead.leadAssignedTo
          )
      );

      /*
       * New assignee is not part of the current
       * user tree/list.
       *
       * Therefore the lead should disappear from
       * the current table.
       */
      if (!newAssigneeExists) {
        leadMap.delete(entry.selectionKey);

        leadSelectionMapRef.current.delete(
          entry.selectionKey
        );

        return;
      }

      /*
       * New assignee exists in current users.
       *
       * Overlay the backend-returned updated lead
       * over the old row.
       */
      const transferredRow = {
        ...transferredLead,

        assignedTo:
          transferredLead.leadAssignedToName ||
          transferredLead.assignedTo ||
          "",

        leadAssignedTo:
          transferredLead.leadAssignedTo ||
          "",

        status:
          transferredLead.statusDescription ||
          (
            transferredLead.histories?.length > 0
              ? transferredLead.histories[0]
                ?.statusDescription
              : ""
          ),
      };

      leadMap.set(
        entry.selectionKey,
        transferredRow
      );

      leadSelectionMapRef.current.set(
        entry.selectionKey,
        transferredRow
      );

      leadToSelectionKeyMapRef.current.set(
        transferredRow,
        entry.selectionKey
      );
    });

    return Array.from(leadMap.values());

  }, [
    users,
    transferredLeadEntries,
  ]);


  // ==========================================================
  // REMOVE REOPENED LEADS FROM THE CURRENT LIST
  // ==========================================================
  //
  // Transfer visibility is handled above through transferredLeadEntries.
  // Reopen behaviour is kept separate and unchanged.
  // ==========================================================

  const visibleAllLeads = useMemo(() => {
    if (!reopenedLeadIds.length) {
      return allLeads;
    }

    return allLeads.filter((lead) => {
      const selectionKey =
        leadToSelectionKeyMapRef.current.get(lead);

      return !reopenedLeadIds.includes(selectionKey);
    });
  }, [
    allLeads,
    reopenedLeadIds,
  ]);

  // ==========================================================
  // VIEW LEAD
  // ==========================================================

  const handleViewClick = async (
    lead
  ) => {

    setIsLoading(true);

    try {

      const templead =
        await fetchLeadDetails(
          lead
        );


      setSelectedLead(
        templead
      );

      setMode("view");

      setModalOpen(true);

    } catch {

      showMessage(
        "Exception thrown.",
        MESSAGE_TYPES.ERROR
      );

    } finally {

      setIsLoading(false);

    }
  };


  // ==========================================================
  // FETCH LEAD DETAILS
  // ==========================================================

  async function fetchLeadDetails(
    lead
  ) {

    let res = null;

    try {

      res = await axios.post(
        GetLeadsForEditAPI,
        lead,
        {
          headers: {

            Authorization:
              `Bearer ${sessionUser.token}`,

            "Content-Type":
              "application/json",

          },
        }
      );


      if (
        res &&
        res.data
      ) {

        return res.data;

      }


      showMessage(
        "Empty response from server.",
        MESSAGE_TYPES.WARNING
      );


      return null;

    } catch (error) {

      const message =
        error.response?.data ||
        error.response?.statusText ||
        error.message ||
        "Unknown error";


      showMessage(
        "Error fetching Lead for edit." +
        JSON.stringify(message),
        MESSAGE_TYPES.ERROR
      );


      return null;
    }
  }


  // ==========================================================
  // DEBUG LOG
  // ==========================================================

  React.useEffect(() => {

    console.log(
      "All leads received in LeadsWithFilters.jsx:",
      allLeads
    );

  }, [allLeads]);


  // ==========================================================
  // FILTER STATE
  // ==========================================================

  const [filters, setFilters] =
    useState(EMPTY_FILTERS);

  const [nameSearch, setNameSearch] =
    useState("");

  const [sortConfig, setSortConfig] =
    useState({
      key: null,
      direction: "asc",
    });

  const [followUpSels, setFollowUpSels] =
    useState([]);

  const [travelDateSels, setTravelDateSel] =
    useState([]);


  // ==========================================================
  // FOLLOW-UP DATE FILTER
  // ==========================================================

  const inFollowUp = (lead) => {

    if (!followUpSels.length) {
      return true;
    }


    if (!lead.followUpDate) {
      return false;
    }


    const d =
      new Date(
        lead.followUpDate
      )
        .toISOString()
        .split("T")[0];


    return followUpSels.some(
      (s) => {

        if (s.type === "single") {

          return s.date === d;
        }


        const [a, b] =
          [s.from, s.to].sort();


        return (
          d >= a &&
          d <= b
        );
      }
    );
  };


  // ==========================================================
  // TRAVEL DATE FILTER
  // ==========================================================

  const inTravelDate = (lead) => {

    if (!travelDateSels.length) {
      return true;
    }


    if (
      !lead.category?.preferredTravelDate
    ) {

      return false;
    }


    const d =
      new Date(
        lead.category
          .preferredTravelDate
      )
        .toISOString()
        .split("T")[0];


    return travelDateSels.some(
      (s) => {

        if (s.type === "single") {

          return s.date === d;
        }


        const [a, b] =
          [s.from, s.to].sort();


        return (
          d >= a &&
          d <= b
        );
      }
    );
  };


  // ==========================================================
  // NAME SEARCH
  // ==========================================================

  const matchesName = (lead) =>
    !nameSearch ||
    `${lead.fName || ""} ${lead.lName || ""
      }`
      .toLowerCase()
      .includes(
        nameSearch.toLowerCase()
      );


  // ==========================================================
  // COMMON FILTER MATCHING
  // ==========================================================

  const leadMatchesFilters = (
    lead,
    excludeKey = null
  ) => {

    const active = (key) =>
      key !== excludeKey;


    return (

      (
        active("status") &&
          filters.status.length
          ? filters.status.includes(
            lead.status
          )
          : true
      ) &&


      (
        active(
          "customerTypeDescription"
        ) &&
          filters
            .customerTypeDescription
            .length
          ? filters
            .customerTypeDescription
            .includes(
              lead.customerTypeDescription
            )
          : true
      ) &&


      (
        active("categoryName") &&
          filters.categoryName.length
          ? filters.categoryName.includes(
            lead.categoryName
          )
          : true
      ) &&


      (
        active("assignedTo") &&
          filters.assignedTo.length
          ? filters.assignedTo.includes(
            lead.assignedTo
          )
          : true
      ) &&


      (
        active("tripType") &&
          filters.tripType.length
          ? filters.tripType.includes(
            getTripType(lead)
          )
          : true
      ) &&


      (
        active("leadType") &&
          filters.leadType.length
          ? filters.leadType.includes(
            getLeadType(lead)
          )
          : true
      ) &&


      (
        active(
          "preferredDestination"
        ) &&
          filters
            .preferredDestination
            .length
          ? splitDestinations(
            getDestinations(lead)
          ).some(
            (d) =>
              filters
                .preferredDestination
                .includes(d)
          )
          : true
      ) &&


      (
        active("followUpDate")
          ? inFollowUp(lead)
          : true
      ) &&


      (
        active("travelDate")
          ? inTravelDate(lead)
          : true
      )

    );
  };


  // ==========================================================
  // FILTER OPTIONS
  // ==========================================================

  const filterOptions = useMemo(() => {

    const poolFor =
      (excludeKey) =>
        visibleAllLeads.filter(
          (l) =>
            leadMatchesFilters(
              l,
              excludeKey
            ) &&
            matchesName(l)
        );


    const getUnique =
      (
        key,
        excludeKey
      ) =>
        [
          ...new Set(
            poolFor(excludeKey)
              .map(
                (l) =>
                  l[key]
              )
              .filter(Boolean)
          ),
        ];


    const getUniqueDestinations =
      (excludeKey) => {

        const set =
          new Set();


        poolFor(
          excludeKey
        ).forEach(
          (l) => {

            splitDestinations(
              getDestinations(l)
            ).forEach(
              (d) =>
                set.add(d)
            );

          }
        );


        return [
          ...set
        ];
      };


    return {

      categoryName:
        getUnique(
          "categoryName",
          "categoryName"
        ),

      assignedTo:
        getUnique(
          "assignedTo",
          "assignedTo"
        ),

      status:
        getUnique(
          "status",
          "status"
        ),

      customerTypeDescription:
        getUnique(
          "customerTypeDescription",
          "customerTypeDescription"
        ),

      tripType:
        [
          ...new Set(
            poolFor("tripType")
              .map(getTripType)
              .filter(Boolean)
          ),
        ],

      leadType:
        [
          ...new Set(
            poolFor("leadType")
              .map(getLeadType)
              .filter(Boolean)
          ),
        ],

      preferredDestination:
        getUniqueDestinations(
          "preferredDestination"
        ),

    };

  }, [
    visibleAllLeads,
    filters,
    nameSearch,
    followUpSels,
    travelDateSels,
  ]);


  // ==========================================================
  // FILTER CHANGE
  // ==========================================================

  const handleFilterChange = (
    key,
    value
  ) => {

    setFilters((prev) => {

      // Single select mode.

      if (!ALLOW_MULTI_SELECT) {

        const isSame =
          prev[key].length === 1 &&
          prev[key][0] === value;


        return {

          ...prev,

          [key]:
            isSame
              ? []
              : [value],

        };
      }


      // Multi-select mode.

      const current =
        prev[key];

      const exists =
        current.includes(value);


      return {

        ...prev,

        [key]:
          exists
            ? current.filter(
              (v) =>
                v !== value
            )
            : [
              ...current,
              value,
            ],

      };

    });
  };


  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearFilters = () => {

    setFilters(
      EMPTY_FILTERS
    );

    setNameSearch("");

    setFollowUpSels([]);

    setTravelDateSel([]);
  };


  // ==========================================================
  // SORTING
  // ==========================================================

  const handleSort = (key) => {

    setSortConfig(
      (prev) => ({

        key,

        direction:
          prev.key === key &&
            prev.direction === "asc"
            ? "desc"
            : "asc",

      })
    );
  };


  // ==========================================================
  // APPLY FILTERS
  // ==========================================================

  const filteredLeads = useMemo(() => {

    return visibleAllLeads.filter(
      (lead) =>
        leadMatchesFilters(lead) &&
        matchesName(lead)
    );

  }, [
    visibleAllLeads,
    filters,
    nameSearch,
    followUpSels,
    travelDateSels,
  ]);


  // ==========================================================
  // APPLY SORT
  // ==========================================================

  const sortedLeads = useMemo(() => {

    if (!sortConfig.key) {
      return filteredLeads;
    }


    const {
      key,
      direction,
    } = sortConfig;


    const dir =
      direction === "asc"
        ? 1
        : -1;


    const dateKeys = [
      "createdAt",
      "updatedAt",
      "latestUpdateAt",
      "followUpDate",
      "travelDate",
    ];


    return [
      ...filteredLeads,
    ].sort((a, b) => {

      let valA =
        key === "latestUpdateAt"
          ? getLatestUpdate(a)
          : key === "travelDate"
            ? a.category
              ?.preferredTravelDate
            : a[key];


      let valB =
        key === "latestUpdateAt"
          ? getLatestUpdate(b)
          : key === "travelDate"
            ? b.category
              ?.preferredTravelDate
            : b[key];


      if (
        dateKeys.includes(key)
      ) {

        valA =
          valA
            ? new Date(
              valA
            ).getTime()
            : 0;


        valB =
          valB
            ? new Date(
              valB
            ).getTime()
            : 0;


        return (
          valA - valB
        ) * dir;
      }


      valA =
        (valA ?? "")
          .toString()
          .toLowerCase();


      valB =
        (valB ?? "")
          .toString()
          .toLowerCase();


      if (valA < valB) {
        return -1 * dir;
      }


      if (valA > valB) {
        return 1 * dir;
      }


      return 0;
    });

  }, [
    filteredLeads,
    sortConfig,
  ]);


  // ==========================================================
  // BULK SELECTION
  // ==========================================================
  //
  // Only leads that are currently transferable participate
  // in Select All.
  // ==========================================================

  const selectableSortedLeads = useMemo(() => {
    if (isBulkReopenMode) {
      return sortedLeads.filter(isLeadReopenable);
    }
    if (isBulkTransferMode) {
      return sortedLeads.filter(isLeadTransferable);
    }
    return [];
  }, [sortedLeads, isBulkTransferMode, isBulkReopenMode]);


  const selectableKeys = useMemo(
    () => selectableSortedLeads
      .map((lead) => leadToSelectionKeyMapRef.current.get(lead))
      .filter(Boolean),
    [selectableSortedLeads]
  );

  const allSelected = selectableKeys.length > 0 && selectableKeys.every((key) => selectedLeadIds.includes(key));
  const someSelected = selectableKeys.some((key) => selectedLeadIds.includes(key)) && !allSelected;

  React.useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const toggleSelectAll = () => {
    console.log("Toggle Select All. Selectable keys:", selectableKeys);
    setSelectedLeadIds((prev) => {
      if (selectableKeys.length > 0 && selectableKeys.every((key) => prev.includes(key))) {
        const next = prev.filter((key) => !selectableKeys.includes(key));
        console.log("Select All cleared current visible selections:", next);
        return next;
      }
      const next = [...new Set([...prev, ...selectableKeys])];
      console.log("Select All added current visible selections:", next);
      return next;
    });
  };

  // SELECT INDIVIDUAL LEAD
  // ==========================================================

  const toggleLeadSelected = (selectionKey) => {
    console.log("Toggling selection key:", selectionKey);
    setSelectedLeadIds((prev) => {
      const next = prev.includes(selectionKey)
        ? prev.filter((key) => key !== selectionKey)
        : [...prev, selectionKey];
      console.log("Updated selected selection keys:", next);
      return next;
    });
  };


  // ==========================================================
  // EXIT BULK MODE
  // ==========================================================

  const exitBulkMode = () => {

    setIsBulkTransferMode(false);
    setIsBulkReopenMode(false);
    setSelectedLeadIds([]);
  };


  // ==========================================================
  // HOLIDAY DETECTION
  // ==========================================================
  //
  // This depends only on the Category filter and visible leads.
  // ==========================================================

  const categoryFilteredLeads =
    useMemo(
      () =>
        filters.categoryName.length

          ? visibleAllLeads.filter(
            (l) =>
              filters.categoryName.includes(
                l.categoryName
              )
          )

          : visibleAllLeads,

      [
        visibleAllLeads,
        filters.categoryName,
      ]
    );


  const isHolidayRelevant =
    useMemo(
      () =>
        categoryFilteredLeads.some(
          isHolidayLead
        ),

      [categoryFilteredLeads]
    );


  // ==========================================================
  // CLEAR HOLIDAY FILTERS WHEN HOLIDAY IS NO LONGER RELEVANT
  // ==========================================================

  React.useEffect(() => {

    if (!isHolidayRelevant) {

      setFilters((prev) =>

        prev.tripType.length ||
          prev.leadType.length ||
          prev.preferredDestination.length

          ? {

            ...prev,

            tripType: [],

            leadType: [],

            preferredDestination: [],

          }

          : prev
      );


      setTravelDateSel(
        (prev) =>
          prev.length
            ? []
            : prev
      );


      setSortConfig(
        (prev) =>
          prev.key ===
            "travelDate"

            ? {
              key: null,
              direction: "asc",
            }

            : prev
      );
    }

  }, [isHolidayRelevant]);


  // ==========================================================
  // FILTER KEYS TO DISPLAY
  // ==========================================================

  const visibleFilterKeys =
    isHolidayRelevant

      ? [
        ...BASE_FILTER_KEYS,
        ...HOLIDAY_FILTER_KEYS,
      ]

      : BASE_FILTER_KEYS;


  // ==========================================================
  // TRANSFER API WRAPPER ITEMS
  // ==========================================================
  //
  // Keep SelectionKey outside DashboardRowDto.
  // Single transfer also travels as an array with one item.
  // ==========================================================
  const selectedTransferLeadEntries = useMemo(() => {
    return selectedTransferLeads
      .map((lead) => {
        const selectionKey =
          leadToSelectionKeyMapRef.current.get(lead);

        if (!selectionKey) {
          return null;
        }

        return {
          selectionKey,
          lead,
        };
      })
      .filter(Boolean);
  }, [selectedTransferLeads]);

  // ==========================================================
  // REOPEN API WRAPPER ITEMS
  // ==========================================================
  // Same shape as transfer: SelectionKey stays outside DashboardRowDto.
  const selectedReopenLeadEntries = useMemo(() => {
    return selectedReopenLeads
      .map((lead) => {
        const selectionKey =
          leadToSelectionKeyMapRef.current.get(lead);

        if (!selectionKey) {
          return null;
        }

        return { selectionKey, lead };
      })
      .filter(Boolean);
  }, [selectedReopenLeads]);


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="flex flex-col h-full">

      <LoadingOverlay
        visible={isLoading}
      />


      {/* ======================================================
          FILTER BAR
      ====================================================== */}

      <div className="
        bg-gray-50
        border
        rounded-lg
        flex-shrink-0
        p-2
      ">

        <div
          className="
            grid
            grid-cols-[15fr_15fr_15fr_15fr_15fr_33fr_10fr]
            grid-rows-[38px_38px]
            gap-x-2
            gap-y-2
            items-center
            w-full
          "
        >

          {/* ==================================================
              SEARCH BY NAME
          ================================================== */}

          <div
            className="
              col-start-1
              row-start-1
              row-span-2
              flex
              items-center
              w-full
              min-w-0
            "
          >

            <input
              type="text"

              placeholder="Search by Name"

              value={nameSearch}

              onChange={(e) =>
                setNameSearch(
                  e.target.value
                )
              }

              className="
                w-full
                min-w-0
                rounded
                px-2
                py-1.5
                text-sm
                focus:outline-none
                focus:ring-2
                bg-white
                border
                border-gray-300
              "
            />

          </div>


          {/* ==================================================
              NORMAL FILTERS
          ================================================== */}

          {visibleFilterKeys.map(
            (key, index) => {

              const FilterComponent =
                key ===
                  "preferredDestination"

                  ? SearchableMultiSelectFilter

                  : MultiSelectFilter;


              const row =
                index < 4
                  ? 1
                  : 2;


              const col =
                2 +
                (index % 4);


              return (

                <div
                  key={key}

                  style={{
                    gridColumn: col,
                    gridRow: row,
                  }}

                  className="
                    flex
                    items-center
                    w-full
                    min-w-0
                  "
                >

                  <FilterComponent

                    label={
                      FILTER_LABELS[key] ||
                      key
                    }

                    options={
                      filterOptions[key]
                    }

                    selected={
                      filters[key]
                    }

                    onToggle={
                      (value) =>
                        handleFilterChange(
                          key,
                          value
                        )
                    }

                    onClear={() =>
                      setFilters(
                        (f) => ({
                          ...f,
                          [key]: [],
                        })
                      )
                    }

                  />

                </div>

              );

            }
          )}


          {/* ==================================================
              PREFERRED TRAVEL DATE
          ================================================== */}

          {isHolidayRelevant && (

            <div
              className="
                col-start-6
                row-start-1
                w-full
                min-w-0
                flex
                items-center
              "
            >

              <CalendarFilter
                label="Preferred Travel Date"

                selections={
                  travelDateSels
                }

                onApply={
                  (sels) =>
                    setTravelDateSel(
                      sels
                    )
                }

                onClear={() =>
                  setTravelDateSel([])
                }
              />

            </div>

          )}


          {/* ==================================================
              FOLLOW-UP DATE
          ================================================== */}

          <div
            className="
              col-start-6
              row-start-2
              w-full
              min-w-0
              flex
              items-center
            "
          >

            <CalendarFilter

              label="Follow-up Date"

              selections={
                followUpSels
              }

              onApply={
                (sels) =>
                  setFollowUpSels(
                    sels
                  )
              }

              onClear={() =>
                setFollowUpSels([])
              }

            />

          </div>


          {/* ==================================================
              CLEAR FILTERS + REFRESH
          ================================================== */}

          <div
            className="
              col-start-7
              row-start-1
              row-span-2
              flex
              items-center
              justify-end
              w-full
              h-full
              min-w-0
            "
          >

            <div className="flex items-center gap-2">

              {/* Clear Filters */}

              <button
                type="button"

                onClick={
                  clearFilters
                }

                className="
                  px-3
                  py-1.5
                  text-sm
                  bg-blue-700
                  text-white
                  rounded
                  hover:bg-blue-800
                  whitespace-nowrap
                "
              >
                Clear Filters
              </button>


              {/* =================================================
                  REFRESH

                  IMPORTANT:
                  This no longer calls window.location.reload().
                  It asks the parent to reload the lead data.
              ================================================= */}

              <button
                type="button"

                onClick={
                  handleRefresh
                }

                className="
                  px-3
                  py-1.5
                  text-sm
                  bg-gray-600
                  text-white
                  rounded
                  hover:bg-gray-700
                  whitespace-nowrap
                "

                title="Refresh lead data"
              >
                Refresh
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================================
          SUMMARY BAR + BULK TRANSFER / BULK REOPEN
      ====================================================== */}

      <div className="flex flex-row mt-2 gap-2 items-stretch flex-shrink-0">
        <div
          className={
            isBulkTransferMode || isBulkReopenMode
              ? "w-[70%]"
              : "w-[70%]"
          }
        >
          <LeadsSummaryBar dateRange={dateRange} leads={sortedLeads} />
        </div>

        <div className={isBulkTransferMode || isBulkReopenMode ? "w-[30%]" : "w-[30%]"}>
          {!isBulkTransferMode && !isBulkReopenMode ? (
            <div className="w-full h-full flex gap-2">
              {SHOW_TRANSFER_OPTIONS && (
                <button
                  type="button"
                  onClick={() => {
                    setIsBulkTransferMode(true);
                    setSelectedLeadIds([]);
                  }}
                  className="
        flex-1
        min-w-0
        h-full
        rounded-lg
        bg-blue-50
        border
        border-blue-200
        text-sm
        font-medium
        text-blue-700
        hover:bg-blue-100
        hover:text-blue-800
        hover:border-blue-300
        transition-colors
        duration-150
      "
                >
                  Bulk Transfer
                </button>
              )}

              {SHOW_REOPEN_OPTIONS && (
                <button
                  type="button"
                  onClick={() => {
                    setIsBulkReopenMode(true);
                    setSelectedLeadIds([]);
                  }}
                  className="
        flex-1
        min-w-0
        h-full
        rounded-lg
        bg-amber-50
        border
        border-amber-200
        text-sm
        font-medium
        text-amber-700
        hover:bg-amber-100
        hover:text-amber-800
        hover:border-amber-300
        transition-colors
        duration-150
      "
                >
                  Bulk Reopen
                </button>
              )}
            </div>
          ) : (
            <div className={`w-full h-full flex items-center justify-between gap-2 px-3 rounded-lg border ${isBulkReopenMode ? "bg-amber-50 border-amber-100" : "bg-blue-50 border-blue-100"}`}>
              <span className={`text-xs font-medium whitespace-nowrap ${isBulkReopenMode ? "text-amber-700" : "text-blue-700"}`}>
                {selectedCount} selected
              </span>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={isBulkReopenMode ? exitBulkReopenMode : exitBulkMode} className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 whitespace-nowrap transition-colors duration-150">
                  Clear
                </button>
                {isBulkReopenMode ? (
                  <button type="button" onClick={handleBulkReopenClick} disabled={selectedCount === 0} className="px-2.5 py-1 text-xs font-medium text-white bg-amber-600 rounded hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap transition-colors duration-150">
                    Reopen
                  </button>
                ) : (
                  <button type="button" onClick={handleBulkTransferClick} disabled={selectedCount === 0} className="px-2.5 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap transition-colors duration-150">
                    Transfer
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================
          LEAD TABLE
      ====================================================== */}

      <div className="
        overflow-auto
        flex-1
        border
        rounded-lg
        mt-2
      ">

        <table className="
          w-full
          text-xs
          border-collapse
        ">

          {/* ==================================================
              TABLE HEADER
          ================================================== */}

          <thead className="bg-gray-100">

            <tr>

              <th className="
                p-2
                text-left
                sticky
                top-0
                z-10
                bg-gray-100
              ">
                Sr. No.
              </th>


              <SortableHeader
                label="Lead Name"
                sortKey="fName"
                sortConfig={sortConfig}
                onSort={handleSort}
              />


              <SortableHeader
                label="Category"
                sortKey="categoryName"
                sortConfig={sortConfig}
                onSort={handleSort}
              />


              <SortableHeader
                label="Assigned To"
                sortKey="assignedTo"
                sortConfig={sortConfig}
                onSort={handleSort}
              />


              <th className="
                p-2
                text-left
                sticky
                top-0
                z-10
                bg-gray-100
              ">
                Lead ID
              </th>


              <SortableHeader
                label="Status"
                sortKey="status"
                sortConfig={sortConfig}
                onSort={handleSort}
              />


              <SortableHeader
                label="Created Date"
                sortKey="createdAt"
                sortConfig={sortConfig}
                onSort={handleSort}
              />


              <SortableHeader
                label="Latest Update"
                sortKey="latestUpdateAt"
                sortConfig={sortConfig}
                onSort={handleSort}
              />


              <SortableHeader
                label="Customer Type"
                sortKey="customerTypeDescription"
                sortConfig={sortConfig}
                onSort={handleSort}
              />


              {/* Holiday columns */}

              {isHolidayRelevant && (

                <th className="
                  p-2
                  text-left
                  sticky
                  top-0
                  z-10
                  bg-gray-100
                ">
                  Trip Type / Lead Type
                </th>

              )}


              {isHolidayRelevant && (

                <th className="
                  p-2
                  text-left
                  sticky
                  top-0
                  z-10
                  bg-gray-100
                ">
                  Destinations
                </th>

              )}


              {isHolidayRelevant && (

                <SortableHeader
                  label="Preferred Travel Date"
                  sortKey="travelDate"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />

              )}


              <SortableHeader
                label="Follow-up Date"
                sortKey="followUpDate"
                sortConfig={sortConfig}
                onSort={handleSort}
              />


              {/* Transfer column */}
              {SHOW_TRANSFER_OPTIONS && (
                <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">
                  {isBulkTransferMode ? (
                    <input ref={selectAllRef} type="checkbox" checked={allSelected} onChange={toggleSelectAll} title="Select all transferable leads" />
                  ) : "TransferTo"}
                </th>
              )}

              {/* Reopen column */}
              {SHOW_REOPEN_OPTIONS && (
                <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">
                  {/* {isBulkReopenMode ? "Select" : "Reopen"} */}
                  {isBulkReopenMode ? (
                    <input ref={selectAllRef} type="checkbox" checked={allSelected} onChange={toggleSelectAll} title="Select all Leads to Open" />
                  ) : "Open"}

                </th>
              )}


              <th className="
                p-2
                text-left
                sticky
                top-0
                z-10
                bg-gray-100
              ">
                Details
              </th>

            </tr>

          </thead>


          {/* ==================================================
              TABLE BODY
          ================================================== */}

          <tbody>

            {sortedLeads.map(
              (lead, idx) => {
                const selectionKey = leadToSelectionKeyMapRef.current.get(lead);

                return (
                  <tr
                    key={selectionKey || `row-${idx}`}
                    className="
                    border-b
                    hover:bg-gray-50
                  "
                  >

                    {/* Sr. No. */}

                    <td className="p-2">
                      {idx + 1}
                    </td>


                    {/* Lead Name */}

                    <td className="p-2">

                      <div className="
                      flex
                      flex-col
                    ">

                        <span className="font-medium">

                          {lead.title?.trim()}{" "}
                          {lead.fName}{" "}
                          {lead.lName}

                        </span>


                        {lead.histories &&
                          lead.histories.length >
                          0 &&
                          lead.histories[0]
                            .notes && (

                            <span className="
                            text-xs
                            text-gray-500
                            mt-0.5
                            max-w-[225px]
                            break-words
                          ">
                              Notes:{" "}
                              {
                                lead
                                  .histories[0]
                                  .notes
                              }
                            </span>

                          )}

                      </div>

                    </td>


                    {/* Category */}

                    <td className="p-2">
                      {lead.categoryName}
                    </td>


                    {/* Assigned To */}

                    <td className="
                    p-2
                    font-semibold
                  ">
                      {lead.leadAssignedToName}
                    </td>


                    {/* Lead ID */}

                    <td className="
                    p-2
                    text-center
                  ">
                      {lead.categoryId
                      }
                    </td>


                    {/* Status */}

                    <td
                      className={`
                      p-2
                      font-semibold

                      ${lead.status ===
                          "Lost"

                          ? "text-lostText"

                          : lead.status ===
                            "Confirmed"

                            ? "text-confirmedText"

                            : lead.status ===
                              "Postponed"

                              ? "text-postponedText"

                              : "text-openText"
                        }
                    `}
                    >
                      {lead.status}
                    </td>


                    {/* Created Date */}

                    <td className="p-2">

                      {new Date(
                        lead.createdAt
                      )
                        .toLocaleDateString(
                          "en-GB"
                        )
                        .replace(
                          /\//g,
                          "-"
                        )}

                    </td>


                    {/* Latest Update */}

                    <td className="p-2">

                      {getLatestUpdate(
                        lead
                      )

                        ? new Date(
                          getLatestUpdate(
                            lead
                          )
                        )
                          .toLocaleDateString(
                            "en-GB"
                          )
                          .replace(
                            /\//g,
                            "-"
                          )

                        : "—"}

                    </td>


                    {/* Customer Type */}

                    <td className="p-2">
                      {
                        lead.customerTypeDescription
                      }
                    </td>


                    {/* Holiday Trip / Lead Type */}

                    {isHolidayRelevant && (

                      <td className="p-2">

                        {isHolidayLead(
                          lead
                        ) ? (

                          <div className="
                          flex
                          gap-1
                          flex-wrap
                        ">

                            {getTripType(lead) && (
                              <span
                                className={`
                                            px-2
                                            py-0.5
                                            rounded-full
                                            text-[10px]
                                            ${getTripType(lead)?.trim().toLowerCase() === "international"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-blue-100 text-blue-700"
                                              }
                                          `}
                              >
                                {getTripType(lead)}
                              </span>
                            )}


                            {getLeadType(
                              lead
                            ) && (

                                <span className="
                              px-2
                              py-0.5
                              rounded-full
                              text-[10px]
                              bg-purple-100
                              text-purple-700
                            ">
                                  {
                                    getLeadType(
                                      lead
                                    )
                                  }
                                </span>

                              )}

                          </div>

                        ) : (

                          <span className="
                          text-gray-400
                        ">
                            —
                          </span>

                        )}

                      </td>

                    )}


                    {/* Destinations */}

                    {isHolidayRelevant && (

                      <td className="
                      p-2
                      max-w-[220px]
                    ">

                        {isHolidayLead(
                          lead
                        ) &&
                          getDestinations(
                            lead
                          ) ? (

                          <span className="
                          text-[11px]
                          text-gray-700
                        ">
                            {
                              getDestinations(
                                lead
                              )
                            }
                          </span>

                        ) : (

                          <span className="
                          text-gray-400
                        ">
                            —
                          </span>

                        )}

                      </td>

                    )}


                    {/* Preferred Travel Date */}

                    {isHolidayRelevant && (

                      <td className="
                      p-2
                      max-w-[220px]
                    ">

                        {isHolidayLead(
                          lead
                        ) &&
                          getTravelDate(
                            lead
                          ) ? (

                          <span className="
                          text-[11px]
                          text-gray-700
                        ">
                            {
                              getTravelDate(
                                lead
                              )
                            }
                          </span>

                        ) : (

                          <span className="
                          text-gray-400
                        ">
                            —
                          </span>

                        )}

                      </td>

                    )}


                    {/* Follow-up Date */}

                    <td className="p-2">

                      {lead.followUpDate

                        ? new Date(
                          lead.followUpDate
                        )
                          .toLocaleDateString(
                            "en-GB"
                          )
                          .replace(
                            /\//g,
                            "-"
                          )

                        : (

                          <span className="
                          text-gray-400
                        ">
                            —
                          </span>

                        )}

                    </td>


                    {/* ==================================================
                      TRANSFER
                  ================================================== */}

                    {SHOW_TRANSFER_OPTIONS && (
                      <td className={`p-2 text-center ${isBulkReopenMode ? "opacity-40" : ""}`}>
                        {isBulkTransferMode ? (
                          <input
                            type="checkbox"
                            checked={selectedLeadIds.includes(selectionKey)}
                            disabled={!isLeadTransferable(lead)}
                            onChange={() => toggleLeadSelected(selectionKey)}
                            title={!isLeadTransferable(lead) ? "You do not have permission to transfer this lead" : "Select lead"}
                          />
                        ) : (
                          <button
                            className={`inline-flex items-center justify-center p-1.5 rounded ${!isLeadTransferable(lead) || isBulkReopenMode ? "bg-gray-300 cursor-not-allowed text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                            title={isBulkReopenMode ? "Transfer disabled while bulk reopen mode is active" : (!isLeadTransferable(lead) ? "Transfer not permitted" : "Transfer Lead")}
                            onClick={() => openTransferModal(lead)}
                            disabled={!isLeadTransferable(lead) || isBulkReopenMode}
                          >
                            <SwapIcon />
                          </button>
                        )}
                      </td>
                    )}

                    {/* ==================================================
                      REOPEN
                  ================================================== */}

                    {SHOW_REOPEN_OPTIONS && (
                      <td className={`p-2 text-center ${isBulkTransferMode ? "opacity-40" : ""}`}>
                        {isBulkReopenMode ? (
                          <input
                            type="checkbox"
                            checked={selectedLeadIds.includes(selectionKey)}
                            disabled={!isLeadReopenable(lead)}
                            onChange={() => toggleLeadSelected(selectionKey)}
                            title={!isLeadReopenable(lead) ? "This lead cannot be reopened with the current permissions" : "Select lead to reopen"}
                          />
                        ) : (
                          <button
                            type="button"
                            className={`inline-flex items-center justify-center px-2 py-1.5 rounded text-xs font-semibold ${!isLeadReopenable(lead) || isBulkTransferMode ? "bg-gray-300 cursor-not-allowed text-white" : "bg-amber-500 text-white hover:bg-amber-600"}`}
                            title={isBulkTransferMode ? "Reopen disabled while bulk transfer mode is active" : (!isLeadReopenable(lead) ? "Reopen not permitted" : "Reopen Lead")}
                            onClick={() => openReopenModal(lead)}
                            disabled={!isLeadReopenable(lead) || isBulkTransferMode}
                          >
                            ↻
                          </button>
                        )}
                      </td>
                    )}

                    {/* ==================================================
                      DETAILS
                  ================================================== */}

                    <td className="p-2">

                      <button
                        className="
                        p-1.5
                        rounded
                        text-blue-700
                        hover:bg-blue-50
                      "

                        title="View Details"

                        onClick={() =>
                          handleViewClick(
                            lead
                          )
                        }
                      >

                        <EyeIcon />

                      </button>

                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>

      </div>


      {/* ======================================================
          VIEW LEAD MODAL
      ====================================================== */}

      <UpdateLeadsModal

        parent="Leads with filters"

        isOpen={
          isModalOpen
        }

        onClose={() =>
          setModalOpen(
            false
          )
        }

        lead={
          selectedLead
        }

        mode="view"

      />


      {/* ======================================================
          LEAD TRANSFER MODAL
      ======================================================
      
      `selectedLeads` is ALWAYS an array.

      Single:
      [lead]

      Bulk:
      [lead1, lead2, lead3]
      ====================================================== */}

      <LeadTransferModal

        isOpen={showTransferModal}

        onClose={() => {
          setShowTransferModal(false);

          setSelectedTransferLeads([]);

        }}

        users={transferUsers}

        onTransfer={handleTransfer}

        loadingUsers={loadingUsers}

        // Kept for compatibility with your existing modal.
        // Single lead is the first array item.

        selectedLead={selectedTransferLeadEntries[0] || null}

        // Actual transfer collection.
        // Both prop names are supplied so the existing modal
        // remains compatible without changing its internal logic.

        selectedLeadItems={selectedTransferLeadEntries}

        selectedLeads={selectedTransferLeadEntries}

      />

      {/* Confirmed/Lost warning. NO preserves the existing checkbox selection. */}
      {showTransferConfirmation && (
        <MessageBox
          show={showTransferConfirmation}
          type={MESSAGE_TYPES.QUESTION}
          message={transferConfirmationMessage}
          onClose={handleTransferConfirmationNo}
          onConfirm={handleTransferConfirmationYes}
          confirmMode={true}
        />
      )}

      {/* Bulk reopen confirmation. Selection is preserved when user clicks No. */}
      {showReopenConfirmation && (
        <MessageBox
          show={showReopenConfirmation}
          type={MESSAGE_TYPES.QUESTION}
          message={reopenConfirmationMessage}
          onClose={handleReopenConfirmationNo}
          onConfirm={handleReopenConfirmationYes}
          confirmMode={true}
        />
      )}
      {showReopenModal && (
        //       <ReOpenLeadModal
        //   isOpen={showReopenModal}
        //   onClose={() => {
        //     setShowReopenModal(false);
        //     setSelectedReopenLeads([]);
        //     setReopenReason("");
        //   }}
        //   selectedLeads={selectedReopenLeadEntries}   // was: selectedReopenLeads
        //   reopenReason={reopenReason}
        //   setReopenReason={setReopenReason}
        //   onReopen={handleReopenSubmit}
        // />

        <ReOpenLeadModal
          isOpen={showReopenModal}
          onClose={() => {
            setShowReopenModal(false);
            setSelectedReopenLeads([]);
          }}
          selectedLeadEntries={selectedReopenLeadEntries}
          onReopened={handleReopened}
        />

      )}

    </div>
  );
}