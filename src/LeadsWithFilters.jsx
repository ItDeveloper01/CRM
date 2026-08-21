import React, { useMemo, useState } from "react";
import { CardContent } from '@mui/material'; // Adjust if using different CardContent
import { MESSAGE_TYPES } from "./Constants";
import axios from "axios";
import UpdateLeadsModal from "./UpdateLeadsModal";
import { getEmptyLeadObj } from "./Model/LeadModel";
import config from "./config";
import { useMessageBox } from "./Notification";
import { useGetSessionUser } from "./SessionContext";
import LeadTransferModal from "./LeadTransferModal";
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

// Flip this one flag to switch every filter back to single-select behaviour.
// Matching logic (filters.key.includes(...)) stays the same either way.
const ALLOW_MULTI_SELECT = true;

const FILTER_LABELS = {
  status: "Status",
  customerTypeDescription: "Customer Type",
  categoryName: "Category",
  assignedTo: "Assigned To",
  tripType: "Domestic/International",
  leadType: "FIT/GIT",
  preferredDestination: "Destination",
};

// "updatedAt" filter dropdown removed per request — Latest Update column stays, just sortable now.
const BASE_FILTER_KEYS = ["categoryName", "assignedTo", "status", "customerTypeDescription"];
const HOLIDAY_FILTER_KEYS = ["tripType", "leadType", "preferredDestination"];

// Same markup/classes as the shared MultiSelectFilter (so the pill, the
// ▲/▼ arrow, and the white-circle red-✕ clear badge all look identical),
// plus a search box at the top of the dropdown for filtering a long
// option list by typing. Kept local to this file rather than editing the
// shared LeadsSharedTable component.
function SearchableMultiSelectFilter({
  label,
  options,
  selected,
  onToggle,
  onClear
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const wrapperRef = React.useRef(null);

  const isActive = selected.length > 0;

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

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const filteredOptions = useMemo(
    () =>
      options.filter((o) =>
        o.toLowerCase().includes(search.toLowerCase())
      ),
    [options, search]
  );

  return (
    <div
      className="relative w-full min-w-0"
      ref={wrapperRef}
    >
      {/* ================================================= */}
      {/* FILTER BUTTON + TOOLTIP */}
      {/* ================================================= */}

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

            ${
              isActive
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-gray-400 text-gray-700 hover:border-gray-600"
            }
          `}
        >
          {/* Filter name / count */}
          <span className="truncate flex-1 min-w-0">
            {isActive
              ? `${label} (${selected.length})`
              : label}
          </span>

          {/* ================================================= */}
          {/* ORIGINAL RED CLEAR BUTTON */}
          {/* ================================================= */}

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
            /* ================================================= */
            /* ORIGINAL ARROW */
            /* ================================================= */

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

        {/* ================================================= */}
        {/* SELECTED VALUES TOOLTIP */}
        {/* ================================================= */}

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
            {/* Tooltip heading */}
            <div
              className="
                font-semibold
                text-gray-600
                mb-1.5
              "
            >
              Selected {label}:
            </div>

            {/* Selected values */}
            <div
              className="
              
                space-y-1
              "
            >
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
                <span className="w-[5px] h-[5px] rounded-full bg-blue-500 flex-shrink-0 mt-1"></span>
                  <span className="break-words">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* DROPDOWN */}
      {/* ================================================= */}

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
          {/* Search */}
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

const EMPTY_FILTERS = {
  status: [],
  customerTypeDescription: [],
  categoryName: [],
  assignedTo: [],
  tripType: [],
  leadType: [],
  preferredDestination: [],
};

export default function LeadListWithFilters({ users, dateRange }) {
  const GetLeadsForEditAPI = config.apiUrl + "/TempLead/GetLeadForEdit";
  const { user: sessionUser } = useGetSessionUser();
  const { showMessage } = useMessageBox();

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [mode, setMode] = useState("create");
  const [isLoading, setIsLoading] = useState(false); // drives the shared wait-cursor overlay

  const fetchDataWithFiltersAPI = config.apiUrl + "/Reporting/GetManagerAnalyticsDataWithFilters";
  const [transferUsers, setTransferUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [leads, setLeads] = useState([]);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const openTransferModal = (lead) => {
    setSelectedLead(lead);
    setShowTransferModal(true);
    loadTransferUsers();
  };

  const handleTransfer = async (toUserId, leadId) => {
    if (!toUserId) return;

    setIsLoading(true);
    try {
      await fetch(fetchDataWithFiltersAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, toUserId }),
      });

      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, transferTo: toUserId } : lead))
      );
    } catch (error) {
      console.error("Lead transfer failed", error);
      alert("Unable to transfer lead. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransferUsers = async () => {
    if (transferUsers.length > 0) return;
    // setLoadingUsers(true);
    // const res = await fetch("/api/analytics/user-ids");
    // const data = await res.json();
    // setTransferUsers(data);
    // setLoadingUsers(false);
  };

  // ---------------- FLATTEN LEADS ----------------
  // Holiday-specific fields (tripType, leadType, requestedDestinations) live
  // nested under lead.category, not on the lead itself — pull them up here
  // so the rest of the component can treat them like any other lead field.
  const allLeads = useMemo(() => {
    return users.flatMap((u) => {
      const combinedLeads = [
        ...(u.openLeads || []),
        ...(u.confirmedLeads || []),
        ...(u.lostLeads || []),
        ...(u.postponedLeads || []),
      ];

      // Note: tripType/leadType/destinations/latestUpdate are deliberately
      // NOT copied here — they're read live via the helper functions above
      // wherever they're used (filtering, sorting, display) so patched-in
      // category data is never masked by a stale cached value.
      return combinedLeads.map((lead) => ({
        ...lead,
        assignedTo: u.firstName,
        status: lead?.histories?.length > 0 ? lead.histories[0].statusDescription : lead.statusDescription,
        leadAssignedTo: u.userID,
      }));
    });
  }, [users]);

  const handleViewClick = async (lead) => {
    setIsLoading(true);
    try {
      let templead = await fetchLeadDetails(lead);
      setSelectedLead(templead);
      setMode("view");
      setModalOpen(true);
    } catch {
      showMessage("Exception thrown.", MESSAGE_TYPES.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  async function fetchLeadDetails(lead) {
    let res = null;
    try {
      res = await axios.post(GetLeadsForEditAPI, lead, {
        headers: {
          Authorization: `Bearer ${sessionUser.token}`,
          "Content-Type": "application/json",
        },
      });
      if (res && res.data) {
        return res.data;
      } else {
        showMessage("Empty response from server.", MESSAGE_TYPES.WARNING);
        return null;
      }
    } catch (error) {
      const message =
        error.response?.data || error.response?.statusText || error.message || "Unknown error";
      showMessage("Error fetching Lead for edit." + JSON.stringify(message), MESSAGE_TYPES.ERROR);
      return null;
    }
  }

  React.useEffect(() => {
    console.log("All leads received in LeadsWithFilters.jsx:", allLeads);
  }, [allLeads]);

  // ---------------- FILTER STATE ----------------
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [nameSearch, setNameSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [followUpSels, setFollowUpSels] = useState([]); // CalendarFilter selections
  const [travelDateSels, setTravelDateSel] = useState([]); // CalendarFilter selections for Preferred Travel Date

  // ---------------- SHARED FILTER-MATCH LOGIC ----------------
  // One predicate, reused for (a) the final table rows and (b) each
  // dropdown's own option list. `excludeKey` lets a filter ignore its own
  // current selection when computing what to offer, so e.g. picking a Trip
  // Type narrows the Destination list, but the Destination filter doesn't
  // narrow itself out of existence. Date filters (Follow-up, Travel Date)
  // still participate as normal filters here — they can be excluded too,
  // for symmetry, even though their own control isn't a dropdown.
  const inFollowUp = (lead) => {
    if (!followUpSels.length) return true;
    if (!lead.followUpDate) return false;
    const d = new Date(lead.followUpDate).toISOString().split("T")[0];
    return followUpSels.some(s => {
      if (s.type === 'single') return s.date === d;
      const [a, b] = [s.from, s.to].sort();
      return d >= a && d <= b;
    });
  };

  const inTravelDate = (lead) => {
    if (!travelDateSels.length) return true;
    if (!lead.category?.preferredTravelDate) return false;
    const d = new Date(lead.category.preferredTravelDate).toISOString().split("T")[0];
    return travelDateSels.some(s => {
      if (s.type === 'single') return s.date === d;
      const [a, b] = [s.from, s.to].sort();
      return d >= a && d <= b;
    });
  };

  const matchesName = (lead) =>
    !nameSearch ||
    `${lead.fName || ""} ${lead.lName || ""}`.toLowerCase().includes(nameSearch.toLowerCase());

  const leadMatchesFilters = (lead, excludeKey = null) => {
    const active = (key) => key !== excludeKey;

    return (
      (active("status") && filters.status.length ? filters.status.includes(lead.status) : true) &&
      (active("customerTypeDescription") && filters.customerTypeDescription.length
        ? filters.customerTypeDescription.includes(lead.customerTypeDescription)
        : true) &&
      (active("categoryName") && filters.categoryName.length
        ? filters.categoryName.includes(lead.categoryName)
        : true) &&
      (active("assignedTo") && filters.assignedTo.length
        ? filters.assignedTo.includes(lead.assignedTo)
        : true) &&
      (active("tripType") && filters.tripType.length
        ? filters.tripType.includes(getTripType(lead))
        : true) &&
      (active("leadType") && filters.leadType.length
        ? filters.leadType.includes(getLeadType(lead))
        : true) &&
      (active("preferredDestination") && filters.preferredDestination.length
        ? splitDestinations(getDestinations(lead)).some((d) => filters.preferredDestination.includes(d))
        : true) &&
      (active("followUpDate") ? inFollowUp(lead) : true) &&
      (active("travelDate") ? inTravelDate(lead) : true)
    );
  };

  // ---------------- CASCADING FILTER OPTIONS ----------------
  // Each key's option list is built from leads matching every OTHER active
  // filter (leadMatchesFilters(lead, key) excludes that key itself) — so a
  // dropdown never offers a value that would produce zero rows given what's
  // already selected elsewhere.
  const filterOptions = useMemo(() => {
    const poolFor = (excludeKey) =>
      allLeads.filter((l) => leadMatchesFilters(l, excludeKey) && matchesName(l));

    const getUnique = (key, excludeKey) =>
      [...new Set(poolFor(excludeKey).map((l) => l[key]).filter(Boolean))];

    const getUniqueDestinations = (excludeKey) => {
      const set = new Set();
      poolFor(excludeKey).forEach((l) => splitDestinations(getDestinations(l)).forEach((d) => set.add(d)));
      return [...set];
    };

    return {
      categoryName: getUnique("categoryName", "categoryName"),
      assignedTo: getUnique("assignedTo", "assignedTo"),
      status: getUnique("status", "status"),
      customerTypeDescription: getUnique("customerTypeDescription", "customerTypeDescription"),
      tripType: [...new Set(poolFor("tripType").map(getTripType).filter(Boolean))],
      leadType: [...new Set(poolFor("leadType").map(getLeadType).filter(Boolean))],
      preferredDestination: getUniqueDestinations("preferredDestination"),
    };
  }, [allLeads, filters, nameSearch, followUpSels, travelDateSels]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      if (!ALLOW_MULTI_SELECT) {
        const isSame = prev[key].length === 1 && prev[key][0] === value;
        return { ...prev, [key]: isSame ? [] : [value] };
      }
      const current = prev[key];
      const exists = current.includes(value);
      return {
        ...prev,
        [key]: exists ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setNameSearch("");
    setFollowUpSels([]);
    setTravelDateSel([]);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // ---------------- APPLY FILTERS ----------------
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => leadMatchesFilters(lead) && matchesName(lead));
  }, [allLeads, filters, nameSearch, followUpSels, travelDateSels]);

  // ---------------- APPLY SORT ----------------
  const sortedLeads = useMemo(() => {
    if (!sortConfig.key) return filteredLeads;

    const { key, direction } = sortConfig;
    const dir = direction === "asc" ? 1 : -1;
    const dateKeys = ["createdAt", "updatedAt", "latestUpdateAt", "followUpDate", "travelDate"];

    return [...filteredLeads].sort((a, b) => {
      let valA =
        key === "latestUpdateAt" ? getLatestUpdate(a)
          : key === "travelDate" ? a.category?.preferredTravelDate
            : a[key];
      let valB =
        key === "latestUpdateAt" ? getLatestUpdate(b)
          : key === "travelDate" ? b.category?.preferredTravelDate
            : b[key];

      if (dateKeys.includes(key)) {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
        return (valA - valB) * dir;
      }

      valA = (valA ?? "").toString().toLowerCase();
      valB = (valB ?? "").toString().toLowerCase();
      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });
  }, [filteredLeads, sortConfig]);

  // Data-driven, not selection-driven, and deliberately dependent on
  // *nothing but the Category filter*: are there Holiday leads among
  // whatever categories are currently selected (or all leads, if Category
  // is untouched)? isHolidayLead already normalizes casing/variants
  // (Holiday, HOLIDAY, HOLIDAYS, Holidays, etc.). Keeping this independent
  // of every other filter — including Follow-up Date and Travel Date —
  // means no combination of filters that happens to match zero rows can
  // ever hide/reset the Holiday-specific controls.
  const categoryFilteredLeads = useMemo(
    () =>
      filters.categoryName.length
        ? allLeads.filter((l) => filters.categoryName.includes(l.categoryName))
        : allLeads,
    [allLeads, filters.categoryName]
  );

  const isHolidayRelevant = useMemo(
    () => categoryFilteredLeads.some(isHolidayLead),
    [categoryFilteredLeads]
  );

  const visibleFilterKeys = isHolidayRelevant
    ? [...BASE_FILTER_KEYS, ...HOLIDAY_FILTER_KEYS]
    : BASE_FILTER_KEYS;

  // Once no Holiday leads remain in view, clear the Holiday-only filter
  // values too — otherwise a filter set while its control was visible
  // keeps silently narrowing the list after the control disappears. Also
  // reset sort if it was on the now-hidden Preferred Travel Date column.
  React.useEffect(() => {
    if (!isHolidayRelevant) {
      setFilters((prev) =>
        prev.tripType.length || prev.leadType.length || prev.preferredDestination.length
          ? { ...prev, tripType: [], leadType: [], preferredDestination: [] }
          : prev
      );
      setTravelDateSel((prev) => (prev.length ? [] : prev));
      setSortConfig((prev) =>
        prev.key === "travelDate" ? { key: null, direction: "asc" } : prev
      );
    }
  }, [isHolidayRelevant]);

  return (
    <div className="flex flex-col h-full">
      <LoadingOverlay visible={isLoading} />


      {/* ---------------- FILTER BAR ---------------- */}
      <div className="bg-gray-50 border rounded-lg flex-shrink-0 p-2">

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

          {/* =====================================================
        SEARCH BY NAME
        COLUMN 1
        ROW SPAN 2
    ===================================================== */}

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
              onChange={(e) => setNameSearch(e.target.value)}
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


          {/* =====================================================
        NORMAL FILTERS
        4 PER ROW
    ===================================================== */}

          {visibleFilterKeys.map((key, index) => {

            const FilterComponent =
              key === "preferredDestination"
                ? SearchableMultiSelectFilter
                : MultiSelectFilter;

            const row =
              index < 4
                ? 1
                : 2;

            const col =
              2 + (index % 4);

            return (
              <div
                key={key}
                style={{
                  gridColumn: col,
                  gridRow: row
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
                    FILTER_LABELS[key] || key
                  }
                  options={
                    filterOptions[key]
                  }
                  selected={
                    filters[key]
                  }
                  onToggle={(value) =>
                    handleFilterChange(
                      key,
                      value
                    )
                  }
                  onClear={() =>
                    setFilters((f) => ({
                      ...f,
                      [key]: [],
                    }))
                  }
                />
              </div>
            );
          })}


          {/* =====================================================
        PREFERRED TRAVEL DATE
        COLUMN 6 / ROW 1
    ===================================================== */}

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
                selections={travelDateSels}
                onApply={(sels) =>
                  setTravelDateSel(sels)
                }
                onClear={() =>
                  setTravelDateSel([])
                }
              />
            </div>
          )}


          {/* =====================================================
        FOLLOW-UP DATE
        COLUMN 6 / ROW 2
    ===================================================== */}

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
              selections={followUpSels}
              onApply={(sels) =>
                setFollowUpSels(sels)
              }
              onClear={() =>
                setFollowUpSels([])
              }
            />
          </div>


          {/* =====================================================
        CLEAR FILTERS
        COLUMN 7
        ROW SPAN 2
    ===================================================== */}

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
            <button
              type="button"
              onClick={clearFilters}
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
          </div>

        </div>

      </div>

      {/* ---------------- SUMMARY BAR ---------------- */}
      <LeadsSummaryBar dateRange={dateRange} leads={sortedLeads} />

      {/* ---------------- TABLE (fills remaining height, only this scrolls) ---------------- */}
      <div className="overflow-auto flex-1 border rounded-lg mt-2">
        <table className="w-full text-xs border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">Sr. No.</th>
              <SortableHeader label="Lead Name" sortKey="fName" sortConfig={sortConfig} onSort={handleSort} />
              <SortableHeader label="Category" sortKey="categoryName" sortConfig={sortConfig} onSort={handleSort} />
              <SortableHeader label="Assigned To" sortKey="assignedTo" sortConfig={sortConfig} onSort={handleSort} />
              <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">Lead ID</th>
              <SortableHeader label="Status" sortKey="status" sortConfig={sortConfig} onSort={handleSort} />
              <SortableHeader label="Created Date" sortKey="createdAt" sortConfig={sortConfig} onSort={handleSort} />
              <SortableHeader label="Latest Update" sortKey="latestUpdateAt" sortConfig={sortConfig} onSort={handleSort} />
              <SortableHeader
                label="Customer Type"
                sortKey="customerTypeDescription"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              {isHolidayRelevant && (
                <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">Trip Type / Lead Type</th>
              )}
              {isHolidayRelevant && (
                <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">Destinations</th>
              )}
              {isHolidayRelevant && (
                <SortableHeader
                  label="Preferred Travel Date"
                  sortKey="travelDate"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
              )}
              <SortableHeader label="Follow-up Date" sortKey="followUpDate" sortConfig={sortConfig} onSort={handleSort} />
              <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">TransferTo</th>
              <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">Details</th>
            </tr>
          </thead>

          <tbody>
            {sortedLeads.map((lead, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {lead.title.trim()} {lead.fName} {lead.lName}
                    </span>

                    {lead.histories &&
                      lead.histories.length > 0 &&
                      lead.histories[0].notes && (
                        <span className="text-xs text-gray-500 mt-0.5 max-w-[225px] break-words">
                          Notes: {lead.histories[0].notes}
                        </span>
                      )}
                  </div>
                </td>
                <td className="p-2">{lead.categoryName}</td>
                <td className="p-2 font-semibold">{lead.assignedTo}</td>
                <td className="p-2 text-center">{lead.leadID}</td>

                <td
                  className={`p-2 font-semibold ${lead.status === "Lost"
                    ? "text-lostText"
                    : lead.status === "Confirmed"
                      ? "text-confirmedText"
                      : lead.status === "Postponed"
                        ? "text-postponedText"
                        : "text-openText"
                    }`}
                >
                  {lead.status}
                </td>

                <td className="p-2">
                  {new Date(lead.createdAt).toLocaleDateString("en-GB").replace(/\//g, "-")}
                </td>

                <td className="p-2">
                  {getLatestUpdate(lead)
                    ? new Date(getLatestUpdate(lead)).toLocaleDateString("en-GB").replace(/\//g, "-")
                    : "—"}
                </td>
                <td className="p-2">{lead.customerTypeDescription}</td>

                {/* Trip Type / Lead Type */}
                {isHolidayRelevant && (
                  <td className="p-2">
                    {isHolidayLead(lead) ? (
                      <div className="flex gap-1 flex-wrap">
                        {getTripType(lead) && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700">
                            {getTripType(lead)}
                          </span>
                        )}
                        {getLeadType(lead) && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-700">
                            {getLeadType(lead)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                )}

                {/* Destinations — shown in full, not truncated, since managers need it at a glance */}
                {isHolidayRelevant && (
                  <td className="p-2 max-w-[220px]">
                    {isHolidayLead(lead) && getDestinations(lead) ? (
                      <span className="text-[11px] text-gray-700">{getDestinations(lead)}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                )}
                {isHolidayRelevant && (
                  <td className="p-2 max-w-[220px]">
                    {isHolidayLead(lead) && getTravelDate(lead) ? (
                      <span className="text-[11px] text-gray-700">{getTravelDate(lead)}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                )}
                <td className="p-2">
                  {lead.followUpDate
                    ? new Date(lead.followUpDate).toLocaleDateString("en-GB").replace(/\//g, "-")
                    : <span className="text-gray-400">—</span>}
                </td>

                <td className="p-2 text-center">
                  <button
                    className={`inline-flex items-center justify-center p-1.5 rounded ${["lost", "confirmed"].includes(lead.status?.trim().toLowerCase())
                      ? "bg-gray-300 cursor-not-allowed text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    title="Transfer Lead"
                    onClick={() => openTransferModal(lead)}
                    disabled={["lost", "confirmed"].includes(lead.status?.trim().toLowerCase())}
                  >
                    <SwapIcon />
                  </button>
                </td>
                <td className="p-2">
                  <button
                    className="p-1.5 rounded text-blue-700 hover:bg-blue-50"
                    title="View Details"
                    onClick={() => handleViewClick(lead)}
                  >
                    <EyeIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <UpdateLeadsModal
        parent={"Leads with filters"}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        lead={selectedLead}
        mode={"view"}
      />
      <LeadTransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        users={transferUsers}
        onTransfer={handleTransfer}
        loadingUsers={loadingUsers}
        selectedLead={selectedLead}
      />
    </div>
  );
}
