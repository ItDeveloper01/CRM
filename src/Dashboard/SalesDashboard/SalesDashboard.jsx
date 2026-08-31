import React, {
    useEffect,
    useMemo,
    useState
} from "react";
import axios from "axios";
import { useGetSessionUser } from "../../SessionContext";
import { RefreshCw } from "lucide-react";

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
    const [activeBranch, setActiveBranch] = useState(null);
    const [activeBranchMembers, setActiveBranchMembers] = useState(null); // null = no branch selected


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

    // Separate loading flag for the manual refresh button,
    // so it can spin independently of the global page loader.
    const [isRefreshing, setIsRefreshing] = useState(false);

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

    const leadsToShow = useMemo(() => {

        if (selectedTeamMember) {
            return leads.filter(l => l.assignedTo === selectedTeamMember.userId);
        }

        if (activeBranch) {
            // Branch selected, no specific member chosen.
            // Empty activeBranchMembers correctly yields an empty result
            // instead of silently falling back to all leads.
            const memberIds = activeBranchMembers.map(m => m.userId);
            return leads.filter(l => memberIds.includes(l.assignedTo));
        }

        // No branch selected at all → show everything.
        return leads;

    }, [leads, selectedTeamMember, activeBranch, activeBranchMembers]);

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
        debugger;
        console.log(
            "Timeline API data:",
            data
        );

        debugger;
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
        debugger;
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
            debugger;



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

            showToast("Failed to load dashboard data");

            // Re-throw so refreshDashboard (or any other caller)
            // knows the load failed and can react accordingly.
            throw error;

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

            // -------------------------------------------------
            // Specific team member selected
            // -------------------------------------------------

            if (selectedTeamMember?.userId) {

                return [
                    selectedTeamMember.userId
                ];

            }


            // -------------------------------------------------
            // Branch selected
            // -------------------------------------------------

            if (activeBranch) {

                return (activeBranchMembers || [])
                    .map(member => member.userId)
                    .filter(Boolean);

            }


            // -------------------------------------------------
            // No branch selected
            // → All Team
            // -------------------------------------------------

            return teamMembers
                .map(member => member.userId)
                .filter(Boolean);

        }


        return [];

    }, [
        viewMode,
        selectedTeamMember,
        teamMembers,
        currentUser?.userId,
        activeBranch,
        activeBranchMembers
    ]);

        const clearDashboard = () => {
            setLeads([]);

            setTimeline({
                overdue: [],
                today: [],
                created: [],
                upcoming: []
            });

            setSummaryCards([]);

            setStatusChart([]);
            setConversionChart([]);
            setConversionRate(0);

            setKpis([]);

            setActiveNoteId(null);
            setActiveRescheduleId(null);
            setOpenLead(null);
        };



    // =========================================================
    // FETCH SELECTED TEAM MEMBER PHOTO
    // (extracted so both the effect and manual refresh can call it)
    // =========================================================

    const fetchMemberPhoto = async (member) => {

        if (!member?.userId) {

            setSelectedMemberPhoto(null);

            return;

        }

        try {

            setLoadingMemberPhoto(true);

            const response = await axios.get(
                GetUserPhoto,
                {
                    headers: {
                        Authorization:
                            `Bearer ${sessionUser.token}`,
                        "Content-Type":
                            "application/json"
                    },

                    params: {
                        userId: member.userId
                    }
                }
            );

            const photo =
                response.data?.photoBase64 ||
                response.data?.photo ||
                null;

            setSelectedMemberPhoto(photo);

        }
        catch (error) {

            console.error(
                "Error fetching team member photo:",
                error
            );

            setSelectedMemberPhoto(null);

        }
        finally {

            setLoadingMemberPhoto(false);

        }

    };


    // =========================================================
    // LOAD DASHBOARD WHEN USER / CATEGORY CHANGES
    // =========================================================

    useEffect(() => {

        // =====================================================
        // TEAM + BRANCH SELECTED + NO MEMBERS
        // =====================================================

        if (
            viewMode === "team" &&
            activeBranch &&
            (!activeBranchMembers ||
                activeBranchMembers.length === 0)
        ) {

            clearDashboard();

            return;
        }


        // =====================================================
        // NO USERS AVAILABLE
        // =====================================================

        if (
            dashboardUserIds.length === 0
        ) {

            clearDashboard();

            return;
        }


        // =====================================================
        // LOAD DASHBOARD
        // =====================================================

        console.log(
            "================================"
        );

        console.log(
            "Dashboard User IDs:",
            dashboardUserIds
        );

        console.log(
            "Selected Branch:",
            activeBranch
        );

        console.log(
            "Branch Members:",
            activeBranchMembers
        );

        console.log(
            "================================"
        );


        loadDashboardData(
            dashboardUserIds
        ).catch(() => {
            // Error already handled
            // inside loadDashboardData
        });


    }, [
        dashboardUserIds,
        category?.verticalId,
        department?.departmentId,
        viewMode,
        activeBranch,
        activeBranchMembers
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
    // FETCH PHOTO WHEN SELECTED TEAM MEMBER CHANGES
    // =========================================================

    useEffect(() => {

        fetchMemberPhoto(selectedTeamMember);

    }, [
        selectedTeamMember
    ]);


    // =========================================================
    // MANUAL REFRESH
    //
    // Re-fetches everything the dashboard currently shows:
    // leads, timeline/cards, mini charts, KPIs, and the
    // selected team member's photo (if any).
    // =========================================================

    const refreshDashboard = async () => {

        if (dashboardUserIds.length === 0) {
            return;
        }

        setIsRefreshing(true);

        try {

            await loadDashboardData(dashboardUserIds);

            await fetchMemberPhoto(selectedTeamMember);

            showToast("Dashboard refreshed");

        }
        catch (error) {

            // loadDashboardData already logs + toasts the failure

        }
        finally {

            setIsRefreshing(false);

        }

    };


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

                                    onBranchChange={(branch, members) => {

                                        setActiveBranch(branch);

                                        setActiveBranchMembers(
                                            branch ? members : null
                                        );

                                        // Branch selected but no members
                                        if (
                                            branch &&
                                            (!members || members.length === 0)
                                        ) {

                                            clearDashboard();

                                        }

                                    }}

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
    SUMMARY + FILTERS + REFRESH
================================================= */}

                <div className="flex w-full items-center justify-between gap-2">

                    <div className="flex items-center gap-2">

                        {/* SUMMARY */}
                        <div className="flex-shrink-0">
                            <DashboardStats
                                cards={summaryCards}
                            />
                        </div>

                        {/* FILTERS - disabled for now */}
                        {/*
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
        */}

                        {/* POINTER */}
                        {/* <img
                            src={pointerImg}
                            alt=""
                            className="h-11 w-11 flex-shrink-0 -scale-x-100"
                        /> */}

                    </div>

                    {/* REFRESH - pushed to extreme right */}
                    <button
                        onClick={refreshDashboard}
                        disabled={isRefreshing}
                        title="Refresh dashboard"
                        className="
                        flex-shrink-0
                        flex items-center gap-1.5
                        h-9 px-3
                        text-sm font-medium text-slate-600
                        bg-blue-600 border border-slate-200
                        rounded-lg shadow-sm
                        hover:bg-blue-700
                        text-white
                        disabled:opacity-50 disabled:cursor-not-allowed
                    "
                    >
                        {/* <svg
                            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg> */}
                        <svg
                            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                            />
                        </svg>
                        {isRefreshing ? "Refreshing..." : "Refresh"}
                    </button>


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