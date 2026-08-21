import { useState, useEffect } from "react";
import axios from "axios";
import ManageItineraryForm from "./ItineraryForm";
import { useItinerary } from "./UseItinerary";
import { useGetSessionUser } from "../../SessionContext";
import config from "../../config";

import { DASHBOARDSTYLES } from "../itineraryStyles";
// import {   MONTH_NAMES,STATUS_FILTERS, STATUS_MAPPING } from "../Constant";

import {   MONTH_NAMES,buildStatusFilters, buildStatusMapping } from "../Constant";
import { KanbanBoard } from "./KanbenBoard";
import { TimelineModal } from "./DashboardTimelineModal";
//mport { buildStatusMapping } from "c:/Users/priya/Downloads/itineraryConstants";




// function FilterPill({ label, active, onClick }) {
//   return (
//     <button onClick={onClick} className={`${DASHBOARDSTYLES.pill} ${active ? DASHBOARDSTYLES.pillActive : ""}`}>
//       {label}
//     </button>
//   );
// }

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${DASHBOARDSTYLES.pill} ${
        active
          ? DASHBOARDSTYLES.pillActive
          : DASHBOARDSTYLES.pillInactive
      }`}
    >
      {label}
    </button>
  );
}

export default function TravelAgencyItineraryManager() {
  const {
    loading,
    error,
    createItinerary,
    updateItinerary,
    dashboardData,
    fetchMonth,
    mergeVariantsIntoDashboard,
    deleteCard,
    resetForFilterChange,
    clearDashboard,
    fetchStatuses,
  } = useItinerary();

  const { user: sessionUser } = useGetSessionUser();

  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const [timelineMonth, setTimelineMonth] = useState(null);
  const [years, setYears] = useState([]);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthNum = currentDate.getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  // const [activeFilter, setActiveFilter] = useState("Active");
   // ── Status: no hardcoded fallback, real loading/error states ──────────
  const [statusFilters, setStatusFilters] = useState([]);
  const [statusMapping, setStatusMapping] = useState({});
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null); // set once statuses arrive

   // Status ab API se aata hai. Jab tak response nahi aata, fallback dikhao
    // taaki filter pills/board blank na dikhein.
    // const [statusFilters, setStatusFilters] = useState(FALLBACK_STATUS_FILTERS);
    // const [statusMapping, setStatusMapping] = useState(FALLBACK_STATUS_MAPPING);
  const getMonthLabel = (month) => `${MONTH_NAMES[month - 1]} ${selectedYear}`;

  const fetchYears = async () => {
    try {
      const res = await axios.get(
        `${config.operationsUrl}/ItineraryDashboard/GetVariantYearsList`,
        {
           headers:{
             Authorization: `Bearer ${sessionUser.token}` 
            } 
        }
      );
      setYears(res.data);
    } catch (err) {
      console.log("Error fetching Years list: ", err);
    }
  };

   const loadStatuses = async () => {
    setStatusLoading(true);
    setStatusError(null);
    try {
      debugger;
      const apiStatuses = await fetchStatuses();
      console.log("Status Api response :",apiStatuses);
      const filters = buildStatusFilters(apiStatuses);
      if (apiStatuses.length > 0 && filters.length === 0) {
      console.error(
        "Status API returned data but nothing matched isActive/statusName. Sample row:",
        apiStatuses[0]
      );
      throw new Error("Unexpected status API response shape");
    }

      setStatusFilters(filters);
      setStatusMapping(buildStatusMapping(apiStatuses));
      // default to first status only on first successful load
      setActiveFilter((prev) => prev ?? filters[0]?.name ?? null);
    } catch (err) {
      console.log("Error fetching statuses:", err);
      setStatusError("Couldn't load statuses. Please retry.");
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
    loadStatuses();
  }, []);

  //  useEffect(() => {
  //     const loadStatuses = async () => {
  //       try {
  //         const apiStatuses = await fetchStatuses();
  //         setStatusFilters(buildStatusFilters(apiStatuses));
  //         setStatusMapping(buildStatusMapping(apiStatuses));
  //       } catch (err) {
  //         console.log("Error fetching statuses, using fallback:", err);
  //         // fallback state already set — koi crash nahi hoga
  //       }
  //     };
  //     loadStatuses();
  //   }, []);

  useEffect(() => {
    if (!activeFilter) return; // don't reset board until we actually have a filter
    resetForFilterChange();
  }, [selectedYear, activeFilter]);

  useEffect(() => {
    return () => clearDashboard();
  }, []);

  // KanbanColumn se `month` label (e.g. "Mar 2026") aata hai — usse
  // numeric month nikal ke cache key banate hain.
  const handleDelete = async (month, variantId) => {
    // const statusId = STATUS_MAPPING[activeFilter];
    const statusId = statusMapping[activeFilter];
    const monthNum = MONTH_NAMES.indexOf(month.split(" ")[0]) + 1;
    await deleteCard(`${selectedYear}-${statusId}-${monthNum}`, variantId);
  };

  const handleAddClick = (month) => {
    setEditingItinerary(null);
    setShowItineraryModal(true);
  };

  const handleEditCard = (card) => {
    setEditingItinerary(card);
    setShowItineraryModal(true);
  };

  const handleNewBtn = () => {
    handleAddClick(getMonthLabel(Math.max(1, currentMonthNum - 1)));
  };

  const handleSave = async (request) => {
    try {
      const response = request.id
        ? await updateItinerary(request)        //Update Itinerary Api 
        : await createItinerary(request);       //Create Itginerary Api 

      
      mergeVariantsIntoDashboard(response);
      console.log("Itinerary variant to merge in year and available status:",response);
      await fetchYears();
      setShowItineraryModal(false);
      setEditingItinerary(null);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const tlCards = timelineMonth
    ? Object.values(dashboardData)
        .flat()
        .filter(
          (c) =>
            `${MONTH_NAMES[new Date(c.startDate).getMonth()]} ${selectedYear}` === timelineMonth
        )
    : [];

  return (
    <div className={`h-screen flex flex-col ${DASHBOARDSTYLES.pageBg} ${DASHBOARDSTYLES.pagePadding}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg text-blue-700">📍</span>
          <h1 className="text-base font-semibold text-gray-800">Itinerary Manager</h1>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded-lg px-3 py-2"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button className={DASHBOARDSTYLES.filterBtn}>⊞ Filter</button>
          <button className={DASHBOARDSTYLES.newBtn} onClick={handleNewBtn}>＋ New itinerary</button>
        </div>
      </div>

      {/* Filter pills */}
      {/* <div className="flex gap-2 mb-2">
        {STATUS_FILTERS.map((status) => (
          <FilterPill
            key={status.id}
            label={status.name}
            active={activeFilter === status.name}
            onClick={() => setActiveFilter(status.name)}
          />
        ))}
      </div> */}

       {/* Filter pills */}
      {statusLoading && (
        <div className="flex gap-2 mb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-100 rounded-full animate-pulse" />
          ))}
        </div>
      )}

      {statusError && (
        <div className="text-sm text-red-600 mb-2 flex items-center gap-2">
          {statusError}
          <button onClick={loadStatuses} className="underline">Retry</button>
        </div>
      )}

      {!statusLoading && !statusError && (
        <div className="flex gap-2 mb-2">
          {statusFilters.map((status) => (
            <FilterPill
              key={status.id}
              label={status.name}
              active={activeFilter === status.name}
              onClick={() => setActiveFilter(status.name)}
            />
          ))}
        </div>
      )}

      {/* Kanban board */}
      {/* Kanban board — only render once we have a real status mapping */}
      {!statusLoading && !statusError && activeFilter && (
      <KanbanBoard
        data={dashboardData ?? {}}
        selectedYear={selectedYear}
        activeFilter={activeFilter}
        // statusMapping={statusMapping}
         statusMapping={statusMapping}   // 👈 MUST be here
        getMonthLabel={getMonthLabel}
        fetchMonth={fetchMonth}
        onDelete={handleDelete}
        onAddClick={handleAddClick}
        onHeaderClick={setTimelineMonth}
        onEdit={handleEditCard}
      />
      )}

      {/* Time Line Modal click month and year  */}
      {timelineMonth && (
        <TimelineModal month={timelineMonth} cards={tlCards} onClose={() => setTimelineMonth(null)} />
      )}

      <ManageItineraryForm
        open={showItineraryModal}
        onClose={() => setShowItineraryModal(false)}
        initialData={editingItinerary}
        onSave={handleSave}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p style={{ color: "gray" }}>Saving…</p>}
    </div>
  );
}
