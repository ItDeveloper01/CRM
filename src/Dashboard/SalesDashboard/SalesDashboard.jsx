// import React, {
//     useEffect,
//     useMemo,
//     useState
// } from "react";
// import axios from "axios";
// import { useGetSessionUser } from "../../SessionContext"

// import DashboardStats from "../DashboardCommonComponents/DashboardStats";
// import DashboardTimeline from "../DashboardCommonComponents/DashboardTimeline";
// import MiniCharts from "../DashboardCommonComponents/MiniCharts";
// import DashboardKPIStrip from "../DashboardCommonComponents/DashboardKPIStrip";
// import LeadDetailsModal from "../DashboardCommonComponents/LeadDetailsModal";
// import TeamPerformanceSidebar from "../DashboardCommonComponents/TeamPerformanceSidebar";
// import DashboardToast from "../DashboardCommonComponents/DashboardToast";
// import DashboardSearchFiltersABC from "../DashboardCommonComponents/DashboardSearchFiltersABC";
// import DashboardViewToggle from "../DashboardCommonComponents/DashboardViewToggle";
// import DashboardTeamSelector from "../DashboardCommonComponents/DashboardTeamSelector";

// import config from "../../config";


// const SalesDashboard = ({
//     department,
//     category,
//     currentUser
// }) => {

//     // =========================================================
//     // VIEW MODE
//     // =========================================================

//     const [viewMode, setViewMode] = useState("mine");

//     const [selectedTeamMember, setSelectedTeamMember] = useState(null);
//     const [selectedMemberPhoto, setSelectedMemberPhoto] = useState(null);
//     const [loadingMemberPhoto, setLoadingMemberPhoto] = useState(false);
//     const { user: sessionUser } = useGetSessionUser();

//     // =========================================================
//     // DASHBOARD DATA
//     // =========================================================

//     const [leads, setLeads] = useState([]);

//     const [timeline, setTimeline] = useState({
//         overdue: [],
//         today: [],
//         created: [],
//         next7: []
//     });

//     const [summaryCards, setSummaryCards] = useState([]);

//     const [statusChart, setStatusChart] = useState([]);

//     const [conversionChart, setConversionChart] = useState([]);

//     const [conversionRate, setConversionRate] = useState(0);

//     const [kpis, setKpis] = useState([]);


//     // =========================================================
//     // UI STATE
//     // =========================================================

//     const [activeNoteId, setActiveNoteId] = useState(null);

//     const [activeRescheduleId, setActiveRescheduleId] = useState(null);

//     const [openLead, setOpenLead] = useState(null);

//     const [toast, setToast] = useState("");


//     // =========================================================
//     // FILTERS
//     // =========================================================

//     const [searchText, setSearchText] = useState("");

//     const [destination, setDestination] = useState("");

//     const [status, setStatus] = useState("");

//     const [priority, setPriority] = useState("");

//     const [filterCategory, setFilterCategory] = useState("");


//     // =========================================================
//     // API
//     // =========================================================

//     const LEADAPIURL1 =
//         config.apiUrl + "/SalesDashboard/";

//     const GetFollowUpLeads =
//         LEADAPIURL1 + "GetFollowUpLeads";

//     const GetTodaysLeads =
//         LEADAPIURL1 + "GetTodaysLeads";

//     const GetLeadsDashboardCounts =
//         LEADAPIURL1 + "GetLeadsDashboardCounts";

//     const USERAPIURL = config.apiUrl + "/Users/";
//     const GetUserPhoto = USERAPIURL + "GetPhotoForUserID";
//     const GetSalesDashboard = LEADAPIURL1 + "GetSalesDashboard";


//     // =========================================================
//     // SELECTED CATEGORY / VERTICAL
//     // =========================================================

//     /*
//         category is the selected vertical/category from the
//         DashboardContext.

//         Example:

//         {
//             verticalId: 3,
//             verticalName: "Holiday",
//             roleId: 4,
//             roleName: "Manager",
//             canViewTeamDashboard: true,
//             teamMembers: [...]
//         }
//     */

//     const canViewTeam =
//         category?.canViewTeamDashboard ?? false;


//     // =========================================================
//     // TEAM MEMBERS
//     // =========================================================

//     const teamMembers = useMemo(() => {

//         return category?.teamMembers ?? [];

//     }, [category]);


//     // =========================================================
//     // RESET TEAM SELECTION WHEN CATEGORY CHANGES
//     // =========================================================

//     useEffect(() => {

//         setViewMode("mine");

//         setSelectedTeamMember(null);

//     }, [category?.verticalId]);


//     // =========================================================
//     // STATIC FILTER OPTIONS
//     // =========================================================

//     const destinations = [
//         "Japan",
//         "Dubai",
//         "Bali",
//         "Singapore"
//     ];

//     const statuses = [
//         "Open",
//         "Follow-up",
//         "Quote Sent",
//         "Confirmed",
//         "Lost"
//     ];

//     const priorities = [
//         "High",
//         "Medium",
//         "Low"
//     ];

//     const categories = [
//         "FIT",
//         "GIT",
//         "Corporate",
//         "Honeymoon"
//     ];


//     // =========================================================
//     // CLEAR FILTERS
//     // =========================================================

//     const clearFilters = () => {

//         setSearchText("");

//         setDestination("");

//         setStatus("");

//         setPriority("");

//         setFilterCategory("");

//     };


//     // =========================================================
//     // TOAST
//     // =========================================================

//     const showToast = (message) => {

//         setToast(message);

//         setTimeout(() => {

//             setToast("");

//         }, 2200);

//     };


//     // =========================================================
//     // ACTIONS
//     // =========================================================

//     const handleCall = (lead) => {

//         console.log("Call", lead);

//     };


//     const handleNote = (lead) => {

//         setActiveRescheduleId(null);

//         setActiveNoteId(
//             activeNoteId === lead.id
//                 ? null
//                 : lead.id
//         );

//     };


//     const handleReschedule = (lead) => {

//         setActiveNoteId(null);

//         setActiveRescheduleId(
//             activeRescheduleId === lead.id
//                 ? null
//                 : lead.id
//         );

//     };


//     const handleSaveNote = (lead, note) => {

//         console.log(
//             "Save Note",
//             lead,
//             note
//         );

//         setActiveNoteId(null);

//     };


//     const handleSaveReschedule = (lead, date) => {

//         console.log(
//             "Reschedule",
//             lead,
//             date
//         );

//         setActiveRescheduleId(null);

//     };


//     // =========================================================
//     // KPIs
//     // =========================================================

//     const loadKPIs = async () => {

//         setKpis([

//             {
//                 id: 1,
//                 icon: "phone",
//                 title: "Calls Today",
//                 value: 27
//             },

//             {
//                 id: 2,
//                 icon: "file",
//                 title: "Pending Quotes",
//                 value: 14
//             },

//             {
//                 id: 3,
//                 icon: "check",
//                 title: "Completed",
//                 value: 19
//             },

//             {
//                 id: 4,
//                 icon: "clock",
//                 title: "Avg Response",
//                 value: "18 min"
//             }

//         ]);

//     };



//     // =========================================================
//     // SUMMARY CARDS
//     // =========================================================

//     const loadDashboardSummary = async (timeLine) => {

//         const todaysCreated =
//             timeLine?.todaysCreatedLeads || [];

//         const overdue =
//             timeLine?.overdueLeads || [];

//         const todaysFollowup =
//             timeLine?.todaysLeads || [];

//         const next7Days =
//             timeLine?.next7DaysLeads || [];


//         const CARD_DEFS = [

//             {
//                 id: 1,
//                 key: "Created",
//                 title: "Today's Created",
//                 color: "blue",
//                 value: todaysCreated.length
//             },

//             {
//                 id: 2,
//                 key: "Overdue",
//                 title: "Overdue Followup",
//                 color: "red",
//                 value: overdue.length
//             },

//             {
//                 id: 3,
//                 key: "Today",
//                 title: "Today's Due Followup",
//                 color: "green",
//                 value: todaysFollowup.length
//             },

//             {
//                 id: 4,
//                 key: "Next7",
//                 title: "Next 7 Days Followup",
//                 color: "gray",
//                 value: next7Days.length
//             }

//         ];

//         setSummaryCards(CARD_DEFS);

//     };


//     // =========================================================
//     // TIMELINE
//     // =========================================================

//     const loadTimeline = async (
//         data
//     ) => {

//         console.log(
//             "Timeline user:",
//             data
//         );


//         // const allTimeline = {

//         //     overdue: [

//         //         {
//         //             id: 1,
//         //             customerName: "John Smith",
//         //             days: "5 days overdue",
//         //             executive: "Rahul"
//         //         },

//         //         {
//         //             id: 2,
//         //             customerName: "ABC Travels",
//         //             days: "Yesterday",
//         //             executive: "Sneha"
//         //         }

//         //     ],

//         //     today: [

//         //         {
//         //             id: 3,
//         //             customerName: "Amit Shah",
//         //             days: "10:00 AM",
//         //             executive: "Kunal"
//         //         },

//         //         {
//         //             id: 4,
//         //             customerName: "Rahul Patel",
//         //             days: "2:30 PM",
//         //             executive: "Priya"
//         //         }

//         //     ],

//         //     tomorrow: [

//         //         {
//         //             id: 5,
//         //             customerName: "XYZ Holidays",
//         //             days: "Tomorrow",
//         //             executive: "Rahul"
//         //         }

//         //     ]

//         // };


//         const timeline = {
//             overdue: data.overdueLeads || [],
//             today: data.todaysLeads || [],
//             next7: data.next7DaysLeads || [],
//             created: data.todaysCreatedLeads || []
//         };
//         setTimeline(timeline);

//     };


//     // =========================================================
//     // LEADS
//     // =========================================================

//     const loadLeads = async (
//         dashboardUserId
//     ) => {

//         console.log(
//             "Leads user:",
//             dashboardUserId
//         );


//         const allLeads = [

//             {
//                 id: 1,
//                 customerName: "John Smith",
//                 notes: "Passport pending",
//                 followUpDate: "Today",
//                 status: "Open",
//                 priority: "High",
//                 executive: "Rahul"
//             },

//             {
//                 id: 2,
//                 customerName: "ABC Travels",
//                 notes: "Waiting for payment",
//                 followUpDate: "Tomorrow",
//                 status: "Postponed",
//                 priority: "Medium",
//                 executive: "Sneha"
//             }

//         ];


//         setLeads(allLeads);

//     };


//     // =========================================================
//     // MINI CHARTS
//     // =========================================================

//     const loadMiniCharts = async (
//         dashboardUserId
//     ) => {

//         console.log(
//             "Charts user:",
//             dashboardUserId
//         );


//         setStatusChart([

//             {
//                 status: "Follow-up",
//                 count: 18,
//                 color: "#3b82f6"
//             },

//             {
//                 status: "Open",
//                 count: 12,
//                 color: "#f59e0b"
//             },

//             {
//                 status: "Quote Sent",
//                 count: 9,
//                 color: "#9333ea"
//             },

//             {
//                 status: "Confirmed",
//                 count: 6,
//                 color: "#10b981"
//             },

//             {
//                 status: "Lost",
//                 count: 2,
//                 color: "#ef4444"
//             }

//         ]);


//         setConversionChart([

//             {
//                 name: "Confirmed",
//                 value: 20,
//                 color: "#10b981"
//             },

//             {
//                 name: "In Progress",
//                 value: 60,
//                 color: "#3b82f6"
//             },

//             {
//                 name: "Lost",
//                 value: 20,
//                 color: "#ef4444"
//             }

//         ]);


//         setConversionRate(20);

//     };


//     // =========================================================
//     // LOAD INITIAL KPIs
//     // =========================================================

//     useEffect(() => {

//         loadKPIs();

//     }, []);


//     // =========================================================
//     // LOAD DASHBOARD DATA
//     // =========================================================
//     //
//     // userIds will ALWAYS be an array:
//     //
//     // My Dashboard:
//     //      ["loggedInUserId"]
//     //
//     // All Team:
//     //      ["userId1", "userId2", "userId3"]
//     //
//     // Single Team Member:
//     //      ["userId2"]
//     // =========================================================

//     const loadDashboardData = async (dashboardUserIds) => {

//         console.log(
//             "Loading Sales Dashboard for User IDs:",
//             dashboardUserIds
//         );

//         // -------------------------------------------------
//         // DEMO API CALL
//         // -------------------------------------------------

//         try {

//             const request = {
//                 userIds: dashboardUserIds,
//                 departmentId: department?.departmentId,
//                 verticalId: category?.verticalId
//             };

//             console.log(
//                 "Sales Dashboard Request:",
//                 request
//             );

//             const response = await axios.post(
//                 GetSalesDashboard,
//                 request,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${currentUser?.token}`
//                     }
//                 }
//             );

//             console.log("Sales Dshboard Data : ", response);

//             const data = response.data;

//             // setSummaryCards(data.summaryCards || []);
//             // setLeads(data.leads || []);
//             // setTimeline(data.timeline || []);
//             // setStatusChart(data.statusChart || []);
//             // setConversionChart(data.conversionChart || []);
//             // setConversionRate(data.conversionRate || 0);
//             // setKpis(data.kpis || []);

//             // -------------------------------------------------
//             // DEMO DATA FOR NOW
//             // -------------------------------------------------



//             await loadLeads(dashboardUserIds);

//             await loadTimeline(data);

//             await loadDashboardSummary(data);

//             await loadMiniCharts(dashboardUserIds);

//             // ⭐ KEEP KPI CARDS
//             await loadKPIs();

//         }
//         catch (error) {

//             console.error(
//                 "Error loading Sales Dashboard:",
//                 error
//             );

//         }

//     };

//     // =========================================================
//     // DETERMINE DASHBOARD USER
//     // =========================================================

//     // =========================================================
//     // DASHBOARD USER IDS
//     //
//     // My Dashboard
//     //      -> [loggedInUserId]
//     //
//     // Team Dashboard + All Team
//     //      -> [all team member ids]
//     //
//     // Team Dashboard + selected member
//     //      -> [selected member id]
//     // =========================================================

//     const dashboardUserIds = useMemo(() => {

//         // -----------------------------------------------------
//         // MY DASHBOARD
//         // -----------------------------------------------------

//         if (viewMode === "mine") {

//             return currentUser?.userId
//                 ? [currentUser.userId]
//                 : [];

//         }

//         // -----------------------------------------------------
//         // TEAM DASHBOARD
//         // -----------------------------------------------------

//         if (viewMode === "team") {

//             // One selected team member
//             if (selectedTeamMember?.userId) {

//                 return [
//                     selectedTeamMember.userId
//                 ];

//             }

//             // All Team
//             return teamMembers
//                 .map(member => member.userId)
//                 .filter(Boolean);

//         }

//         return [];

//     }, [
//         viewMode,
//         selectedTeamMember,
//         teamMembers,
//         currentUser?.userId
//     ]);

//     // =========================================================
//     // LOAD DASHBOARD WHEN USER / CATEGORY CHANGES
//     // =========================================================

//     useEffect(() => {

//         if (dashboardUserIds.length === 0) {
//             return;
//         }

//         console.log("================================");
//         console.log("Dashboard User IDs:", dashboardUserIds);
//         console.log("Selected Category:", category?.verticalName);
//         console.log("Category ID:", category?.verticalId);
//         console.log("Role:", category?.roleName);
//         console.log("View Mode:", viewMode);
//         console.log("================================");

//         console.log(
//             "🚨 DASHBOARD API EFFECT FIRED",
//             {
//                 dashboardUserIds,
//                 verticalId: category?.verticalId,
//                 departmentId: department?.departmentId
//             }
//         );

//         if (dashboardUserIds.length === 0) {
//             return;
//         }

//         loadDashboardData(
//             dashboardUserIds
//         );

//     }, [
//         dashboardUserIds,
//         category?.verticalId,
//         department?.departmentId
//     ]);


//     // =========================================================
//     // TEAM MEMBER CHANGE
//     // =========================================================

//     const handleTeamMemberChange = (
//         member
//     ) => {

//         setSelectedTeamMember(member);

//     };


//     // =========================================================
//     // VIEW CHANGE
//     // =========================================================

//     const handleViewChange = (
//         mode
//     ) => {

//         setViewMode(mode);

//         /*
//             Whenever switching back to My Dashboard,
//             clear selected team member.
//         */

//         if (mode === "mine") {

//             setSelectedTeamMember(null);

//         }

//     };

//     //---------------------------------------------------
//     // Fetch selected team member photo
//     //---------------------------------------------------

//     useEffect(() => {

//         // All Team selected
//         if (!selectedTeamMember?.userId) {

//             setSelectedMemberPhoto(null);
//             return;

//         }

//         const fetchMemberPhoto = async () => {

//             try {

//                 setLoadingMemberPhoto(true);

//                 const response = await axios.get(
//                     GetUserPhoto,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${sessionUser.token}`, // ✅ JWT token
//                             "Content-Type": "application/json"
//                         },
//                         params: {
//                             userId: selectedTeamMember.userId
//                         }
//                     }
//                 );

//                 const photo =
//                     response.data?.photoBase64 ||
//                     response.data?.photo ||
//                     null;

//                 setSelectedMemberPhoto(photo);

//             }
//             catch (error) {

//                 console.error(
//                     "Error fetching team member photo:",
//                     error
//                 );

//                 // If photo is unavailable,
//                 // simply show the empty placeholder.
//                 setSelectedMemberPhoto(null);

//             }
//             finally {

//                 setLoadingMemberPhoto(false);

//             }

//         };

//         fetchMemberPhoto();

//     }, [selectedTeamMember]);


//     const handleRescheduleSuccess = (lead, newDate) => {

//         console.log("In side Rebucketing Logic.");
//         const leadId = Number(
//             lead?.LeadID ?? lead?.leadID
//         );

//         if (!leadId || !newDate) {
//             console.log("Re-bucket failed - missing LeadID/date", {
//                 lead,
//                 newDate
//             });
//             return;
//         }

//         console.log("RE-BUCKETING LEAD:", {
//             leadId,
//             newDate
//         });

//         // =====================================================
//         // DETERMINE NEW BUCKET
//         // =====================================================

//         const getBucket = (followUpDate) => {

//             if (!followUpDate) {
//                 return null;
//             }

//             const date = new Date(followUpDate);
//             date.setHours(0, 0, 0, 0);

//             const today = new Date();
//             today.setHours(0, 0, 0, 0);

//             const next7 = new Date(today);
//             next7.setDate(today.getDate() + 7);

//             console.log("Bucket calculation:", {
//                 followUpDate,
//                 date,
//                 today,
//                 next7
//             });

//             if (date < today) {
//                 return "overdue";
//             }

//             if (date.getTime() === today.getTime()) {
//                 return "today";
//             }

//             if (date <= next7) {
//                 return "next7";
//             }

//             return null;
//         };


//         const newBucket = getBucket(newDate);

//         console.log(
//             "NEW BUCKET:",
//             newBucket
//         );


//         // =====================================================
//         // UPDATED LEAD OBJECT
//         // =====================================================

//         const updatedLead = {
//             ...lead,

//             // Keep both because your API objects have
//             // different casing in different places.
//             LeadID: leadId,
//             leadID: leadId,

//             FollowUpDate: newDate,
//             followUpDate: newDate
//         };


//         // =====================================================
//         // UPDATE TIMELINE
//         // =====================================================

//         setTimeline(currentTimeline => {

//             console.log(
//                 "OLD TIMELINE:",
//                 currentTimeline
//             );

//             const newTimeline = {
//                 overdue: [...(currentTimeline.overdue || [])],
//                 today: [...(currentTimeline.today || [])],
//                 created: [...(currentTimeline.created || [])],
//                 next7: [...(currentTimeline.next7 || [])]
//             };


//             // -------------------------------------------------
//             // REMOVE LEAD FROM ALL FOLLOW-UP BUCKETS
//             // -------------------------------------------------

//             ["overdue", "today", "next7"].forEach(bucket => {

//                 newTimeline[bucket] =
//                     newTimeline[bucket].filter(item => {

//                         const itemId = Number(
//                             item?.LeadID ??
//                             item?.leadID
//                         );

//                         return itemId !== leadId;

//                     });

//             });


//             // -------------------------------------------------
//             // ADD TO NEW BUCKET
//             // -------------------------------------------------

//             if (newBucket) {

//                 newTimeline[newBucket].push(
//                     updatedLead
//                 );

//             }


//             // -------------------------------------------------
//             // CREATED BUCKET
//             // -------------------------------------------------
//             // Don't move/remove it from Created.
//             // If the lead was created today, it should
//             // remain in Today's Created as well.

//             newTimeline.created =
//                 newTimeline.created.map(item => {

//                     const itemId = Number(
//                         item?.LeadID ??
//                         item?.leadID
//                     );

//                     if (itemId === leadId) {

//                         return {
//                             ...item,
//                             LeadID: leadId,
//                             leadID: leadId,
//                             FollowUpDate: newDate,
//                             followUpDate: newDate
//                         };

//                     }

//                     return item;

//                 });


//             console.log(
//                 "UPDATED TIMELINE:",
//                 newTimeline
//             );

//             return newTimeline;

//         });

//         console.log("Load Timeline dasboard:" , timeline)
//         loadDashboardSummary(timeline);

//     };

//     // =========================================================
//     // UI
//     // =========================================================

//     return (

//         <div className="flex-1 min-h-0">

//             <div className="mx-auto p-1 space-y-2">


//                 {/* =================================================
//                     VIEW TOGGLE + TEAM SELECTOR
//                 ================================================= */}

//                 {canViewTeam && (

//                     <div className="
//                         flex
//                         items-center
//                         gap-3
//                         bg-white
//                         border
//                         border-slate-200
//                         rounded-xl
//                         shadow-sm
//                         p-3
//                     ">

//                         <DashboardViewToggle
//                             canViewTeamDashboard={
//                                 canViewTeam
//                             }
//                             viewMode={
//                                 viewMode
//                             }
//                             setViewMode={
//                                 handleViewChange
//                             }
//                         />


//                         {viewMode === "team" && (

//                             <div className="flex items-center gap-3">

//                                 <DashboardTeamSelector
//                                     teamMembers={teamMembers}
//                                     selectedTeamMember={selectedTeamMember}
//                                     onTeamMemberChange={setSelectedTeamMember}
//                                 />

//                                 {selectedTeamMember && (

//                                     <div className="flex items-center gap-2">

//                                         {/* Photo */}

//                                         {selectedMemberPhoto ? (

//                                             <img
//                                                 src={
//                                                     selectedMemberPhoto.startsWith("data:")
//                                                         ? selectedMemberPhoto
//                                                         : `data:image/jpeg;base64,${selectedMemberPhoto}`
//                                                 }
//                                                 alt={selectedTeamMember.userName}
//                                                 className="
//                             h-9
//                             w-9
//                             rounded-full
//                             border
//                             border-slate-200
//                             object-cover
//                         "
//                                             />

//                                         ) : (

//                                             <div
//                                                 className="
//                             h-9
//                             w-9
//                             rounded-full
//                             border
//                             border-slate-200
//                             bg-slate-100
//                         "
//                                             />

//                                         )}

//                                         {/* Name + Role */}

//                                         <div className="leading-tight">

//                                             <div className="text-sm font-medium text-slate-700">
//                                                 {selectedTeamMember.userName}
//                                             </div>

//                                             <div className="text-xs text-slate-400">
//                                                 {selectedTeamMember.roleName}
//                                             </div>

//                                         </div>

//                                     </div>

//                                 )}

//                             </div>

//                         )}

//                     </div>

//                 )}


//                 {/* =================================================
//                     SUMMARY
//                 ================================================= */}

//                 <DashboardStats
//                     cards={summaryCards}
//                 />


//                 {/* =================================================
//                     KPI + FILTERS
//                 ================================================= */}

//                 <div className="
//                     bg-white
//                     border
//                     border-slate-200
//                     rounded-xl
//                     shadow-sm
//                     p-1
//                 ">
//                     {/* 
//                     <DashboardKPIStrip
//                         kpis={kpis}
//                     /> */}


//                     <DashboardSearchFiltersABC

//                         searchText={
//                             searchText
//                         }

//                         setSearchText={
//                             setSearchText
//                         }

//                         destination={
//                             destination
//                         }

//                         setDestination={
//                             setDestination
//                         }

//                         destinations={
//                             destinations
//                         }

//                         status={
//                             status
//                         }

//                         setStatus={
//                             setStatus
//                         }

//                         statuses={
//                             statuses
//                         }

//                         priority={
//                             priority
//                         }

//                         setPriority={
//                             setPriority
//                         }

//                         priorities={
//                             priorities
//                         }

//                         category={
//                             filterCategory
//                         }

//                         setCategory={
//                             setFilterCategory
//                         }

//                         categories={
//                             categories
//                         }

//                         onClear={
//                             clearFilters
//                         }

//                     />

//                 </div>


//                 {/* =================================================
//                     TIMELINE + SIDEBAR
//                 ================================================= */}

//                 <div className="
//                     flex
//                     flex-col
//                     lg:flex-row
//                     gap-4
//                 ">


//                     {/* TIMELINE */}

//                     <div className="
//                         flex-1
//                         min-w-0
//                         bg-white
//                         border
//                         border-slate-200
//                         rounded-xl
//                         shadow-sm
//                     ">

//                         <DashboardTimeline

//                             timeline={timeline}

//                             onCall={handleCall}

//                             onNote={handleNote}

//                             onReschedule={handleReschedule}

//                             onOpen={setOpenLead}

//                             noteOpen={activeNoteId}

//                             rescheduleOpen={activeRescheduleId}

//                             onSaveNote={handleSaveNote}

//                             onSaveReschedule={handleSaveReschedule}

//                             onRescheduleSuccess={handleRescheduleSuccess}

//                             onCancelInline={() => {

//                                 setActiveNoteId(null);

//                                 setActiveRescheduleId(null);

//                             }}

//                         />

//                     </div>


//                     {/* SIDEBAR */}

//                     {/* <div className="
//                         w-full
//                         lg:w-80
//                         flex
//                         flex-col
//                         gap-4
//                     ">


//                         {viewMode === "team" && (

//                             <div className="
//                                 bg-white
//                                 border
//                                 border-slate-200
//                                 rounded-xl
//                                 shadow-sm
//                                 p-4
//                             ">

//                                 <TeamPerformanceSidebar

//                                     executives={
//                                         teamMembers
//                                     }

//                                     selectedExecutive={
//                                         selectedTeamMember?.userId
//                                     }

//                                     setSelectedExecutive={
//                                         (userId) => {

//                                             const member =
//                                                 teamMembers.find(
//                                                     x =>
//                                                         x.userId === userId
//                                                 );

//                                             setSelectedTeamMember(
//                                                 member || null
//                                             );

//                                         }
//                                     }

//                                 />

//                             </div>

//                         )}


//                         <div className="
//                             bg-white
//                             border
//                             border-slate-200
//                             rounded-xl
//                             shadow-sm
//                             p-4
//                         ">

//                             <MiniCharts
//                                 leads={
//                                     leads
//                                 }
//                             />

//                         </div>

//                     </div> */}

//                 </div>

//             </div>


//             {/* =================================================
//                 MODAL
//             ================================================= */}

//             <LeadDetailsModal

//                 lead={
//                     openLead
//                 }

//                 onClose={() =>
//                     setOpenLead(null)
//                 }

//             />


//             {/* =================================================
//                 TOAST
//             ================================================= */}

//             <DashboardToast
//                 message={
//                     toast
//                 }
//             />

//         </div>

//     );

// };


// export default SalesDashboard;

import React, {
    useEffect,
    useMemo,
    useState
} from "react";
import axios from "axios";
import { useGetSessionUser } from "../../SessionContext";

import DashboardStats from "../DashboardCommonComponents/DashboardStats";
import DashboardTimeline from "../DashboardCommonComponents/DashboardTimeline";
import MiniCharts from "../DashboardCommonComponents/MiniCharts";
import DashboardKPIStrip from "../DashboardCommonComponents/DashboardKPIStrip";
import LeadDetailsModal from "../DashboardCommonComponents/LeadDetailsModal";
import TeamPerformanceSidebar from "../DashboardCommonComponents/TeamPerformanceSidebar";
import DashboardToast from "../DashboardCommonComponents/DashboardToast";
import DashboardSearchFiltersABC from "../DashboardCommonComponents/DashboardSearchFiltersABC";
import DashboardViewToggle from "../DashboardCommonComponents/DashboardViewToggle";
import DashboardTeamSelector from "../DashboardCommonComponents/DashboardTeamSelector";
import pointerImg from "../../Images/POINTING_RIGHT.gif"; // adjust relative path to your file structure

import config from "../../config";


const SalesDashboard = ({
    department,
    category,
    currentUser,
    setGlobalDashboardLoading
}) => {

    // =========================================================
    // VIEW MODE
    // =========================================================

    const [viewMode, setViewMode] = useState("mine");

    const [selectedTeamMember, setSelectedTeamMember] = useState(null);
    const [selectedMemberPhoto, setSelectedMemberPhoto] = useState(null);
    const [loadingMemberPhoto, setLoadingMemberPhoto] = useState(false);

    const { user: sessionUser } = useGetSessionUser();


    // =========================================================
    // DASHBOARD DATA
    // =========================================================

    const [leads, setLeads] = useState([]);

    // SINGLE SOURCE OF TRUTH FOR FOLLOW-UP BUCKETS
    const [timeline, setTimeline] = useState({
        overdue: [],
        today: [],
        created: [],
        upcoming: []
    });

    const [summaryCards, setSummaryCards] = useState([]);

    const [statusChart, setStatusChart] = useState([]);

    const [conversionChart, setConversionChart] = useState([]);

    const [conversionRate, setConversionRate] = useState(0);

    const [kpis, setKpis] = useState([]);


    // =========================================================
    // UI STATE
    // =========================================================

    const [activeNoteId, setActiveNoteId] = useState(null);

    const [activeRescheduleId, setActiveRescheduleId] = useState(null);

    const [openLead, setOpenLead] = useState(null);

    const [toast, setToast] = useState("");

    //const [dashboardLoading, setDashboardLoading] = useState(false);


    // =========================================================
    // FILTERS
    // =========================================================

    const [searchText, setSearchText] = useState("");

    const [destination, setDestination] = useState("");

    const [status, setStatus] = useState("");

    const [priority, setPriority] = useState("");

    const [filterCategory, setFilterCategory] = useState("");


    // =========================================================
    // API
    // =========================================================

    const LEADAPIURL1 =
        config.apiUrl + "/SalesDashboard/";

    const GetFollowUpLeads =
        LEADAPIURL1 + "GetFollowUpLeads";

    const GetTodaysLeads =
        LEADAPIURL1 + "GetTodaysLeads";

    const GetLeadsDashboardCounts =
        LEADAPIURL1 + "GetLeadsDashboardCounts";

    const USERAPIURL =
        config.apiUrl + "/Users/";

    const GetUserPhoto =
        USERAPIURL + "GetPhotoForUserID";

    const GetSalesDashboard =
        LEADAPIURL1 + "GetSalesDashboard";


    // =========================================================
    // SELECTED CATEGORY / VERTICAL
    // =========================================================

    const canViewTeam =
        category?.canViewTeamDashboard ?? false;


    // =========================================================
    // TEAM MEMBERS
    // =========================================================

    const teamMembers = useMemo(() => {

        return category?.teamMembers ?? [];

    }, [category]);


    // =========================================================
    // RESET TEAM SELECTION WHEN CATEGORY CHANGES
    // =========================================================

    useEffect(() => {

        setViewMode("mine");

        setSelectedTeamMember(null);

    }, [category?.verticalId]);


    // =========================================================
    // STATIC FILTER OPTIONS
    // =========================================================

    const destinations = [
        "Japan",
        "Dubai",
        "Bali",
        "Singapore"
    ];

    const statuses = [
        "Open",
        "Follow-up",
        "Quote Sent",
        "Confirmed",
        "Lost"
    ];

    const priorities = [
        "High",
        "Medium",
        "Low"
    ];

    const categories = [
        "FIT",
        "GIT",
        "Corporate",
        "Honeymoon"
    ];


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    const clearFilters = () => {

        setSearchText("");

        setDestination("");

        setStatus("");

        setPriority("");

        setFilterCategory("");

    };


    // =========================================================
    // TOAST
    // =========================================================

    const showToast = (message) => {

        setToast(message);

        setTimeout(() => {

            setToast("");

        }, 2200);

    };


    // =========================================================
    // ACTIONS
    // =========================================================

    const handleCall = (lead) => {

        console.log("Call", lead);

    };


    const handleNote = (lead) => {

        setActiveRescheduleId(null);

        setActiveNoteId(
            activeNoteId === lead.id
                ? null
                : lead.id
        );

    };


    const handleReschedule = (lead) => {

        setActiveNoteId(null);

        setActiveRescheduleId(
            activeRescheduleId === lead.id
                ? null
                : lead.id
        );

    };


    const handleSaveNote = (lead, note) => {

        console.log(
            "Save Note",
            lead,
            note
        );

        setActiveNoteId(null);

    };


    const handleSaveReschedule = (lead, date) => {

        console.log(
            "Reschedule",
            lead,
            date
        );

        setActiveRescheduleId(null);

    };


    // =========================================================
    // KPIs
    // =========================================================

    const loadKPIs = () => {

        setKpis([

            {
                id: 1,
                icon: "phone",
                title: "Calls Today",
                value: 27
            },

            {
                id: 2,
                icon: "file",
                title: "Pending Quotes",
                value: 14
            },

            {
                id: 3,
                icon: "check",
                title: "Completed",
                value: 19
            },

            {
                id: 4,
                icon: "clock",
                title: "Avg Response",
                value: "18 min"
            }

        ]);

    };


    // =========================================================
    // SUMMARY CARDS
    //
    // IMPORTANT:
    // Cards use the SAME timeline buckets.
    // No separate bucket logic.
    // =========================================================

    const loadDashboardSummary = (timeLine) => {

        const CARD_DEFS = [

            {
                id: 1,
                key: "Created",
                title: "Today's Created",
                color: "blue",
                value: (timeLine?.created || []).length
            },

            {
                id: 2,
                key: "Overdue",
                title: "Overdue Followup",
                color: "red",
                value: (timeLine?.overdue || []).length
            },

            {
                id: 3,
                key: "Today",
                title: "Today's Due Followup",
                color: "green",
                value: (timeLine?.today || []).length
            },

            {
                id: 4,
                key: "Upcoming",
                title: "Upcoming Followup",
                color: "gray",
                value: (timeLine?.upcoming || []).length
            }

        ];

        setSummaryCards(CARD_DEFS);

    };


    // =========================================================
    // TIMELINE
    // =========================================================

    const loadTimeline = (data) => {

        console.log(
            "Timeline API data:",
            data
        );


        const newTimeline = {

            overdue:
                data?.overdueLeads || [],

            today:
                data?.todaysLeads || [],

            upcoming:
                data?.upcomingLeads || [],

            created:
                data?.todaysCreatedLeads || []

        };


        console.log(
            "INITIAL TIMELINE:",
            newTimeline
        );


        // Update timeline
        setTimeline(newTimeline);


        // Cards use EXACT SAME buckets
        loadDashboardSummary(newTimeline);

    };


    // =========================================================
    // LEADS
    // =========================================================

    const loadLeads = (
        dashboardUserId
    ) => {

        console.log(
            "Leads user:",
            dashboardUserId
        );


        const allLeads = [

            {
                id: 1,
                customerName: "John Smith",
                notes: "Passport pending",
                followUpDate: "Today",
                status: "Open",
                priority: "High",
                executive: "Rahul"
            },

            {
                id: 2,
                customerName: "ABC Travels",
                notes: "Waiting for payment",
                followUpDate: "Tomorrow",
                status: "Postponed",
                priority: "Medium",
                executive: "Sneha"
            }

        ];


        setLeads(allLeads);

    };


    // =========================================================
    // MINI CHARTS
    // =========================================================

    const loadMiniCharts = (
        dashboardUserId
    ) => {

        console.log(
            "Charts user:",
            dashboardUserId
        );


        setStatusChart([

            {
                status: "Follow-up",
                count: 18,
                color: "#3b82f6"
            },

            {
                status: "Open",
                count: 12,
                color: "#f59e0b"
            },

            {
                status: "Quote Sent",
                count: 9,
                color: "#9333ea"
            },

            {
                status: "Confirmed",
                count: 6,
                color: "#10b981"
            },

            {
                status: "Lost",
                count: 2,
                color: "#ef4444"
            }

        ]);


        setConversionChart([

            {
                name: "Confirmed",
                value: 20,
                color: "#10b981"
            },

            {
                name: "In Progress",
                value: 60,
                color: "#3b82f6"
            },

            {
                name: "Lost",
                value: 20,
                color: "#ef4444"
            }

        ]);


        setConversionRate(20);

    };


    // =========================================================
    // LOAD INITIAL KPIs
    // =========================================================

    useEffect(() => {

        loadKPIs();

    }, []);


    // =========================================================
    // LOAD DASHBOARD DATA
    // =========================================================

    const loadDashboardData = async (
        dashboardUserIds
    ) => {

        console.log(
            "Loading Sales Dashboard for User IDs:",
            dashboardUserIds
        );

        setGlobalDashboardLoading(true);

        try {

            const request = {

                userIds:
                    dashboardUserIds,

                departmentId:
                    department?.departmentId,

                verticalId:
                    category?.verticalId

            };


            console.log(
                "Sales Dashboard Request:",
                request
            );


            const response = await axios.post(
                GetSalesDashboard,
                request,
                {
                    headers: {
                        Authorization:
                            `Bearer ${currentUser?.token}`
                    }
                }
            );


            console.log(
                "Sales Dashboard Data:",
                response
            );


            const data =
                response.data;


            // -------------------------------------------------
            // LOAD DATA
            // -------------------------------------------------

            await loadLeads(
                dashboardUserIds
            );

            // IMPORTANT:
            // loadTimeline creates the buckets
            // and also updates the cards.
            await loadTimeline(
                data
            );

            await loadMiniCharts(
                dashboardUserIds
            );

            await loadKPIs();

        }
        catch (error) {

            console.error(
                "Error loading Sales Dashboard:",
                error
            );

        }
        finally {

            setGlobalDashboardLoading(false);

        }

    };


    // =========================================================
    // DASHBOARD USER IDS
    // =========================================================

    const dashboardUserIds = useMemo(() => {

        // -----------------------------------------------------
        // MY DASHBOARD
        // -----------------------------------------------------

        if (viewMode === "mine") {

            return currentUser?.userId
                ? [currentUser.userId]
                : [];

        }


        // -----------------------------------------------------
        // TEAM DASHBOARD
        // -----------------------------------------------------

        if (viewMode === "team") {

            // Selected team member
            if (
                selectedTeamMember?.userId
            ) {

                return [
                    selectedTeamMember.userId
                ];

            }


            // All Team
            return teamMembers

                .map(
                    member =>
                        member.userId
                )

                .filter(Boolean);

        }


        return [];

    }, [

        viewMode,

        selectedTeamMember,

        teamMembers,

        currentUser?.userId

    ]);


    // =========================================================
    // LOAD DASHBOARD WHEN USER / CATEGORY CHANGES
    // =========================================================

    useEffect(() => {

        if (
            dashboardUserIds.length === 0
        ) {

            return;

        }


        console.log(
            "================================"
        );

        console.log(
            "Dashboard User IDs:",
            dashboardUserIds
        );

        console.log(
            "Selected Category:",
            category?.verticalName
        );

        console.log(
            "Category ID:",
            category?.verticalId
        );

        console.log(
            "Role:",
            category?.roleName
        );

        console.log(
            "View Mode:",
            viewMode
        );

        console.log(
            "================================"
        );


        console.log(
            "🚨 DASHBOARD API EFFECT FIRED",
            {
                dashboardUserIds,

                verticalId:
                    category?.verticalId,

                departmentId:
                    department?.departmentId
            }
        );


        loadDashboardData(
            dashboardUserIds
        );

    }, [

        dashboardUserIds,

        category?.verticalId,

        department?.departmentId

    ]);


    // =========================================================
    // TEAM MEMBER CHANGE
    // =========================================================

    const handleTeamMemberChange = (
        member
    ) => {

        setSelectedTeamMember(
            member
        );

    };


    // =========================================================
    // VIEW CHANGE
    // =========================================================

    const handleViewChange = (
        mode
    ) => {

        setViewMode(mode);


        if (
            mode === "mine"
        ) {

            setSelectedTeamMember(
                null
            );

        }

    };


    // =========================================================
    // FETCH SELECTED TEAM MEMBER PHOTO
    // =========================================================

    useEffect(() => {

        if (
            !selectedTeamMember?.userId
        ) {

            setSelectedMemberPhoto(
                null
            );

            return;

        }


        const fetchMemberPhoto =
            async () => {

                try {

                    setLoadingMemberPhoto(
                        true
                    );


                    const response =
                        await axios.get(
                            GetUserPhoto,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${sessionUser.token}`,
                                    "Content-Type":
                                        "application/json"
                                },

                                params: {
                                    userId:
                                        selectedTeamMember.userId
                                }
                            }
                        );


                    const photo =
                        response.data?.photoBase64 ||
                        response.data?.photo ||
                        null;


                    setSelectedMemberPhoto(
                        photo
                    );

                }
                catch (error) {

                    console.error(
                        "Error fetching team member photo:",
                        error
                    );


                    setSelectedMemberPhoto(
                        null
                    );

                }
                finally {

                    setLoadingMemberPhoto(
                        false
                    );

                }

            };


        fetchMemberPhoto();

    }, [
        selectedTeamMember
    ]);


    // =========================================================
    // RESCHEDULE SUCCESS
    // =========================================================

    const handleRescheduleSuccess = (lead, newDate) => {

        console.log("=================================");
        console.log("RESCHEDULE SUCCESS");
        console.log("Lead:", lead);
        console.log("New Date:", newDate);
        console.log("=================================");


        const leadId = Number(
            lead?.LeadID ??
            lead?.leadID
        );


        if (!leadId || !newDate) {

            console.log(
                "Re-bucket failed - missing LeadID/date",
                {
                    lead,
                    newDate
                }
            );

            return;

        }


        // =====================================================
        // DETERMINE NEW BUCKET
        // =====================================================

        const getBucket = (followUpDate) => {

            if (!followUpDate) {
                return null;
            }

            const date = new Date(followUpDate);
            date.setHours(0, 0, 0, 0);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // OVERDUE
            if (date < today) {
                return "overdue";
            }

            // TODAY
            if (date.getTime() === today.getTime()) {
                return "today";
            }

            // UPCOMING - TOMORROW ONWARDS
            if (date > today) {
                return "upcoming";
            }

            return null;
        };


        const newBucket =
            getBucket(newDate);


        console.log(
            "NEW BUCKET:",
            newBucket
        );


        // =====================================================
        // UPDATED LEAD
        // =====================================================

        const updatedLead = {

            ...lead,

            LeadID: leadId,
            leadID: leadId,

            FollowUpDate: newDate,
            followUpDate: newDate

        };


        // =====================================================
        // UPDATE TIMELINE + CARDS TOGETHER
        // =====================================================

        setTimeline(currentTimeline => {


            console.log(
                "OLD TIMELINE:",
                currentTimeline
            );


            // -------------------------------------------------
            // COPY CURRENT TIMELINE
            // -------------------------------------------------

            const newTimeline = {

                overdue: [
                    ...(currentTimeline?.overdue || [])
                ],

                today: [
                    ...(currentTimeline?.today || [])
                ],

                created: [
                    ...(currentTimeline?.created || [])
                ],

                upcoming: [
                    ...(currentTimeline?.upcoming || [])
                ]

            };


            // =================================================
            // REMOVE LEAD FROM ALL FOLLOW-UP BUCKETS
            // =================================================

            [
                "overdue",
                "today",
                "upcoming"
            ].forEach(bucket => {

                newTimeline[bucket] =
                    newTimeline[bucket].filter(item => {

                        const itemId = Number(
                            item?.LeadID ??
                            item?.leadID
                        );


                        return itemId !== leadId;

                    });

            });


            // =================================================
            // ADD LEAD TO NEW BUCKET
            // =================================================

            if (newBucket) {

                newTimeline[newBucket].push(
                    updatedLead
                );

            }


            // =================================================
            // CREATED BUCKET
            // =================================================
            //
            // IMPORTANT:
            // If this lead was created today,
            // it must remain in Created.
            //
            // Rescheduling does NOT affect Created count.
            //

            newTimeline.created =
                newTimeline.created.map(item => {

                    const itemId = Number(
                        item?.LeadID ??
                        item?.leadID
                    );


                    if (itemId === leadId) {

                        return {

                            ...item,

                            LeadID: leadId,
                            leadID: leadId,

                            FollowUpDate: newDate,
                            followUpDate: newDate

                        };

                    }


                    return item;

                });


            console.log(
                "NEW TIMELINE:",
                newTimeline
            );


            // =================================================
            // UPDATE SUMMARY CARDS DIRECTLY
            // =================================================

            const newCards = [

                {
                    id: 1,
                    key: "Created",
                    title: "Today's Created",
                    color: "blue",
                    value:
                        newTimeline.created.length
                },

                {
                    id: 2,
                    key: "Overdue",
                    title: "Overdue Followup",
                    color: "red",
                    value:
                        newTimeline.overdue.length
                },

                {
                    id: 3,
                    key: "Today",
                    title: "Today's Due Followup",
                    color: "green",
                    value:
                        newTimeline.today.length
                },

                {
                    id: 4,
                    key: "Upcoming",
                    title: "Upcoming Followup",
                    color: "gray",
                    value:
                        newTimeline.upcoming.length
                }

            ];


            console.log(
                "UPDATING SUMMARY CARDS:",
                newCards
            );


            setSummaryCards(newCards);


            // -------------------------------------------------
            // RETURN NEW TIMELINE
            // -------------------------------------------------

            return newTimeline;

        });


        // =====================================================
        // CLOSE RESCHEDULE UI
        // =====================================================

        setActiveRescheduleId(null);


        console.log(
            "Reschedule UI closed."
        );

    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="flex-1 min-h-0">

            <div className=" p-1 space-y-2">


                {/* =================================================
                    VIEW TOGGLE + TEAM SELECTOR
                ================================================= */}

                {canViewTeam && (

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            bg-white
                            border
                            border-slate-200
                            rounded-xl
                            shadow-sm
                            p-3
                        "
                    >

                        <DashboardViewToggle

                            canViewTeamDashboard={
                                canViewTeam
                            }

                            viewMode={
                                viewMode
                            }

                            setViewMode={
                                handleViewChange
                            }

                        />


                        {viewMode === "team" && (

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <DashboardTeamSelector

                                    teamMembers={
                                        teamMembers
                                    }

                                    selectedTeamMember={
                                        selectedTeamMember
                                    }

                                    onTeamMemberChange={
                                        setSelectedTeamMember
                                    }

                                />


                                {selectedTeamMember && (

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        {/* Photo */}

                                        {selectedMemberPhoto ? (

                                            <img

                                                src={
                                                    selectedMemberPhoto.startsWith(
                                                        "data:"
                                                    )
                                                        ? selectedMemberPhoto
                                                        : `data:image/jpeg;base64,${selectedMemberPhoto}`
                                                }

                                                alt={
                                                    selectedTeamMember.userName
                                                }

                                                className="
                                                    h-9
                                                    w-9
                                                    rounded-full
                                                    border
                                                    border-slate-200
                                                    object-cover
                                                "

                                            />

                                        ) : (

                                            <div
                                                className="
                                                    h-9
                                                    w-9
                                                    rounded-full
                                                    border
                                                    border-slate-200
                                                    bg-slate-100
                                                "
                                            />

                                        )}


                                        {/* Name + Role */}

                                        <div
                                            className="
                                                leading-tight
                                            "
                                        >

                                            <div
                                                className="
                                                    text-sm
                                                    font-medium
                                                    text-slate-700
                                                "
                                            >
                                                {
                                                    selectedTeamMember.userName
                                                }
                                            </div>


                                            <div
                                                className="
                                                    text-xs
                                                    text-slate-400
                                                "
                                            >
                                                {
                                                    selectedTeamMember.roleName
                                                }
                                            </div>

                                        </div>

                                    </div>

                                )}

                            </div>

                        )}

                    </div>

                )}


                {/* =================================================
                    SUMMARY
                ================================================= */}
                {/* 
                <DashboardStats
                    cards={
                        summaryCards
                    }
                /> */}


                {/* =================================================
                                    KPI + FILTERS
                                ================================================= */}

                {/* <div
                                    className="
                                        bg-white
                                        border
                                        border-slate-200
                                        rounded-xl
                                        shadow-sm
                                        p-1
                                    "
                                > */}

                {/* 
                                    <DashboardKPIStrip
                                        kpis={
                                            kpis
                                        }
                                    />
                                    */}

                {/* 
                    <DashboardSearchFiltersABC

                        searchText={
                            searchText
                        }

                        setSearchText={
                            setSearchText
                        }

                        destination={
                            destination
                        }

                        setDestination={
                            setDestination
                        }

                        destinations={
                            destinations
                        }

                        status={
                            status
                        }

                        setStatus={
                            setStatus
                        }

                        statuses={
                            statuses
                        }

                        priority={
                            priority
                        }

                        setPriority={
                            setPriority
                        }

                        priorities={
                            priorities
                        }

                        category={
                            filterCategory
                        }

                        setCategory={
                            setFilterCategory
                        }

                        categories={
                            categories
                        }

                        onClear={
                            clearFilters
                        }

                    /> */}


      <div className="flex w-full items-center justify-start gap-2">

    {/* SUMMARY */}
    <div className="flex-shrink-0">
        <DashboardStats
            cards={summaryCards}
        />
    </div>

    {/* FILTERS */}
    <div className="flex-shrink-0">
        <DashboardSearchFiltersABC
            searchText={searchText}
            setSearchText={setSearchText}
            destination={destination}
            setDestination={setDestination}
            destinations={destinations}
            status={status}
            setStatus={setStatus}
            statuses={statuses}
            priority={priority}
            setPriority={setPriority}
            priorities={priorities}
            category={filterCategory}
            setCategory={setFilterCategory}
            categories={categories}
            onClear={clearFilters}
        />
    </div>

    {/* POINTER */}
    <img
        src={pointerImg}
        alt=""
        className="h-11 w-11 flex-shrink-0 -scale-x-100"
    />
</div>

                {/* =================================================
                    TIMELINE + SIDEBAR
                ================================================= */}

                <div
                    className="
                        flex
                        flex-col
                        lg:flex-row
                        gap-4
                    "
                >

                    {/* TIMELINE */}

                    <div
                        className="
                            flex-1
                            min-w-0
                            bg-white
                            border
                            border-slate-200
                            rounded-xl
                            shadow-sm
                        "
                    >

                        <DashboardTimeline

                            timeline={
                                timeline
                            }

                            onCall={
                                handleCall
                            }

                            onNote={
                                handleNote
                            }

                            onReschedule={
                                handleReschedule
                            }

                            onOpen={
                                setOpenLead
                            }

                            noteOpen={
                                activeNoteId
                            }

                            rescheduleOpen={
                                activeRescheduleId
                            }

                            onSaveNote={
                                handleSaveNote
                            }

                            onSaveReschedule={
                                handleSaveReschedule
                            }

                            onRescheduleSuccess={
                                handleRescheduleSuccess
                            }

                            onCancelInline={() => {

                                setActiveNoteId(
                                    null
                                );

                                setActiveRescheduleId(
                                    null
                                );

                            }}

                        />

                    </div>


                    {/* SIDEBAR */}

                    {/* 
                    <div
                        className="
                            w-full
                            lg:w-80
                            flex
                            flex-col
                            gap-4
                        "
                    >

                        {viewMode === "team" && (

                            <div
                                className="
                                    bg-white
                                    border
                                    border-slate-200
                                    rounded-xl
                                    shadow-sm
                                    p-4
                                "
                            >

                                <TeamPerformanceSidebar

                                    executives={
                                        teamMembers
                                    }

                                    selectedExecutive={
                                        selectedTeamMember?.userId
                                    }

                                    setSelectedExecutive={
                                        (userId) => {

                                            const member =
                                                teamMembers.find(
                                                    x =>
                                                        x.userId === userId
                                                );

                                            setSelectedTeamMember(
                                                member || null
                                            );

                                        }
                                    }

                                />

                            </div>

                        )}


                        <div
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-xl
                                shadow-sm
                                p-4
                            "
                        >

                            <MiniCharts
                                leads={
                                    leads
                                }
                            />

                        </div>

                    </div>
                    */}

                </div>

            </div>


            {/* =================================================
                MODAL
            ================================================= */}

            <LeadDetailsModal

                lead={
                    openLead
                }

                onClose={() =>
                    setOpenLead(
                        null
                    )
                }

            />


            {/* =================================================
                TOAST
            ================================================= */}

            <DashboardToast
                message={
                    toast
                }
            />

        </div>

    );

};


export default SalesDashboard;