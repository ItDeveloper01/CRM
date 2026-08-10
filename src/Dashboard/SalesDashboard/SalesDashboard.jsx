import React, { useEffect, useState,useMemo } from "react";
import DashboardStats from "../DashboardCommonComponents/DashboardStats";
import DashboardTimeline from "../DashboardCommonComponents/DashboardTimeline";
import MiniCharts from "../DashboardCommonComponents/MiniCharts";
import DashboardKPIStrip from "../DashboardCommonComponents/DashboardKPIStrip";
import LeadDetailsModal from "../DashboardCommonComponents/LeadDetailsModal";
import TeamPerformanceSidebar from "../DashboardCommonComponents/TeamPerformanceSidebar";
import DashboardToast from "../DashboardCommonComponents/DashboardToast";
import DashboardSearchFiltersABC from "../DashboardCommonComponents/DashboardSearchFiltersABC";
import DashboardViewToggle from "../DashboardCommonComponents/DashboardViewToggle";
import config from "../../config";
import DashboardTeamSelector from "../DashboardCommonComponents/DashboardTeamSelector";

const SalesDashboard = ({ department, currentUser, viewMode, canViewTeam, onViewChange }) => {

    // ----------------------------
    // State
    // ----------------------------

    const [leads, setLeads] = useState([]);

    const [selectedExecutive, setSelectedExecutive] = useState("");

    const [timeline, setTimeline] = useState([]);

    const [summaryCards, setSummaryCards] = useState([]);

    const [statusChart, setStatusChart] = useState([]);

    const [conversionChart, setConversionChart] = useState([]);

    const [conversionRate, setConversionRate] = useState(0);

    const [kpis, setKpis] = useState([]);

    const [activeNoteId, setActiveNoteId] = useState(null);
    const [activeRescheduleId, setActiveRescheduleId] = useState(null);
    const [openLead, setOpenLead] = useState(null);
    const [toast, setToast] = useState("");

    const [searchText, setSearchText] = useState("");
    const [destination, setDestination] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [category, setCategory] = useState("");
    const [selectedTeamMember, setSelectedTeamMember] = useState(null);

    //const teamMembers = department?.teamMembers ?? [];

    /**
     API CALLS PLACEHOLDER
     */
    const LEADAPIURL1 = config.apiUrl + '/TempLead/';
    const GetFollowUpLeads = LEADAPIURL1 + 'GetFollowUpLeads';
    const GetTodaysLeads = LEADAPIURL1 + 'GetTodaysLeads';
    const GetLeadsDashboardCounts = LEADAPIURL1 + 'GetLeadsDashboardCounts';

    // ----------------------------
    // Static filter option lists
    // ----------------------------

    const destinations = ["Japan", "Dubai", "Bali", "Singapore"];
    const statuses = ["Open", "Follow-up", "Quote Sent", "Confirmed", "Lost"];
    const priorities = ["High", "Medium", "Low"];
    const categories = ["FIT", "GIT", "Corporate", "Honeymoon"];

    const clearFilters = () => {
        setSearchText("");
        setDestination("");
        setStatus("");
        setPriority("");
        setCategory("");
    };


  

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(""), 2200);
    };

    const handleCall = (lead) => console.log("Call", lead);

    const handleNote = (lead) => {
        setActiveRescheduleId(null);
        setActiveNoteId(activeNoteId === lead.id ? null : lead.id);
    };

    const handleReschedule = (lead) => {
        setActiveNoteId(null);
        setActiveRescheduleId(activeRescheduleId === lead.id ? null : lead.id);
    };

    const handleSaveNote = (lead, note) => {
        console.log("Save Note", lead, note);
        setActiveNoteId(null);
    };

    const handleSaveReschedule = (lead, date) => {
        console.log("Reschedule", lead, date);
        setActiveRescheduleId(null);
    };

    // ----------------------------
    // API Placeholders
    // ----------------------------

    const loadKPIs = async () => {
        setKpis([
            { id: 1, icon: "phone", title: "Calls Today", value: 27 },
            { id: 2, icon: "file", title: "Pending Quotes", value: 14 },
            { id: 3, icon: "check", title: "Completed", value: 19 },
            { id: 4, icon: "clock", title: "Avg Response", value: "18 min" }
        ]);
    };

const buildDeduplicatedTeamMembers = (department) => {

    if (!department?.verticles)
        return [];

    const memberMap = new Map();

    department.verticles.forEach(vertical => {

        vertical.teamMembers?.forEach(member => {

            if (!memberMap.has(member.userId)) {

                memberMap.set(member.userId, {
                    userId: member.userId,
                    userName: member.userName,
                    roleName: member.roleName,
                    verticles: []
                });

            }

            memberMap.get(member.userId).verticles.push({
                verticleId: vertical.verticleId,
                verticleName: vertical.verticleName
            });

        });

    });

    return Array.from(memberMap.values());

};



    const loadDashboardSummary = async (executive) => {

        const allRecords = [
            { executive: "Rahul", status: "Open" },
            { executive: "Rahul", status: "Open" },
            { executive: "Rahul", status: "Overdue" },
            { executive: "Sneha", status: "Confirmed" },
            { executive: "Sneha", status: "Lost" },
            { executive: "Kunal", status: "Closed" },
            { executive: "Priya", status: "Open" },
            { executive: "Priya", status: "Overdue" },
            { executive: "Priya", status: "Overdue" },
            { executive: "Gayatri", status: "Overdue" },
            { executive: "Gayatri", status: "Open" },
        ];

        const CARD_DEFS = [
            { id: 1, key: "Open", title: "Open", color: "blue" },
            { id: 2, key: "Overdue", title: "Overdue", color: "red" },
            { id: 3, key: "Confirmed", title: "Confirmed", color: "green" },
            { id: 4, key: "Lost", title: "Lost", color: "gray" },
            { id: 5, key: "Closed", title: "Closed", color: "purple" }
        ];

        const scoped = executive
            ? allRecords.filter(r => r.executive === executive)
            : allRecords;

        setSummaryCards(CARD_DEFS.map(def => ({
            id: def.id,
            title: def.title,
            color: def.color,
            value: scoped.filter(r => r.status === def.key).length
        })));
    };

    const loadTimeline = async (executive) => {

        const allTimeline = {
            overdue: [
                { id: 1, customerName: "John Smith", days: "5 days overdue", executive: "Rahul" },
                { id: 2, customerName: "ABC Travels", days: "Yesterday", executive: "Sneha" }
            ],
            today: [
                { id: 3, customerName: "Amit Shah", days: "10:00 AM", executive: "Kunal" },
                { id: 4, customerName: "Rahul Patel", days: "2:30 PM", executive: "Priya" }
            ],
            tomorrow: [
                { id: 5, customerName: "XYZ Holidays", days: "Tomorrow", executive: "Rahul" }
            ]
        };

        const filterFn = (arr) =>
            executive ? arr.filter(item => item.executive === executive) : arr;

        setTimeline({
            overdue: filterFn(allTimeline.overdue),
            today: filterFn(allTimeline.today),
            tomorrow: filterFn(allTimeline.tomorrow)
        });
    };

    const loadLeads = async (executive) => {

        const allLeads = [
            { id: 1, customerName: "John Smith", notes: "Passport pending", followUpDate: "Today", status: "Open", priority: "High", executive: "Rahul" },
            { id: 2, customerName: "ABC Travels", notes: "Waiting for payment", followUpDate: "Tomorrow", status: "Postponed", priority: "Medium", executive: "Sneha" }
        ];

        setLeads(executive ? allLeads.filter(l => l.executive === executive) : allLeads);
    };

    const loadMiniCharts = async (executive) => {

        setStatusChart([
            { status: "Follow-up", count: 18, color: "#3b82f6" },
            { status: "Open", count: 12, color: "#f59e0b" },
            { status: "Quote Sent", count: 9, color: "#9333ea" },
            { status: "Confirmed", count: 6, color: "#10b981" },
            { status: "Lost", count: 2, color: "#ef4444" }
        ]);

        setConversionChart([
            { name: "Confirmed", value: 20, color: "#10b981" },
            { name: "In Progress", value: 60, color: "#3b82f6" },
            { name: "Lost", value: 20, color: "#ef4444" }
        ]);

        setConversionRate(20);
    };

    // ----------------------------
    // Effects
    // ----------------------------

    useEffect(() => {
        loadKPIs();
    }, []);

    useEffect(() => {

        // "mine" always means the logged-in user's own data, regardless of dropdown selection
        const effectiveExecutive = viewMode === "mine"
            ? currentUser?.userName
            : selectedExecutive;

        loadDashboardSummary(effectiveExecutive);
        loadLeads(effectiveExecutive);
        loadTimeline(effectiveExecutive);
        loadMiniCharts(effectiveExecutive);

    }, [viewMode, selectedExecutive, currentUser]);

 const teamMembers = useMemo(
    () => buildDeduplicatedTeamMembers(department),
    [department]
);
    
    // ----------------------------
    // UI
    // ----------------------------

    return (

        
        <div className="flex-1 min-h-0">

            <div className="mx-auto p-1 space-y-2">

                {/* View toggle + Team member dropdown — same row */}
                {canViewTeam && (

                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl shadow-sm p-3">

                        <DashboardViewToggle
                            canViewTeamDashboard={canViewTeam}
                            viewMode={viewMode}
                            setViewMode={onViewChange}
                        />
                        {viewMode === "team" && (
                            <div className="relative">
                                <DashboardTeamSelector
                                    teamMembers={teamMembers}
                                    selectedTeamMember={selectedTeamMember}
                                    onTeamMemberChange={setSelectedTeamMember}
                                />
                            </div>
                        )}

                    </div>

                )}


                <DashboardStats cards={summaryCards} />

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-1">
                    <DashboardKPIStrip kpis={kpis} />
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
                        category={category}
                        setCategory={setCategory}
                        categories={categories}
                        onClear={clearFilters}
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-4">

                    <div className="flex-1 min-w-0 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <DashboardTimeline
                            timeline={timeline}
                            onCall={handleCall}
                            onNote={handleNote}
                            onReschedule={handleReschedule}
                            onOpen={setOpenLead}
                            noteOpen={activeNoteId}
                            rescheduleOpen={activeRescheduleId}
                            onSaveNote={handleSaveNote}
                            onSaveReschedule={handleSaveReschedule}
                            onCancelInline={() => {
                                setActiveNoteId(null);
                                setActiveRescheduleId(null);
                            }}
                        />
                    </div>

                    <div className="w-full lg:w-80 flex flex-col gap-4">

                        {viewMode === "team" && (

                            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                                <TeamPerformanceSidebar
                                    executives={teamMembers}
                                    selectedExecutive={selectedExecutive}
                                    setSelectedExecutive={setSelectedExecutive}
                                />
                            </div>

                        )}

                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                            <MiniCharts leads={leads} />
                        </div>

                    </div>

                </div>

            </div>

            <LeadDetailsModal
                lead={openLead}
                onClose={() => setOpenLead(null)}
            />
            <DashboardToast message={toast} />

        </div>
    );
};

export default SalesDashboard;