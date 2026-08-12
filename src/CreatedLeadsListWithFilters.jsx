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
  getTravelDate,
  getLatestUpdate,
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
  createdBy: "Created By",
  createdAt: "Created Date",
  tripType: "Domestic/International",
  leadType: "FIT/GIT",
  preferredDestination: "Destination",
};

// Base filters ordered to match the table's column sequence:
// Category, Created By, Status, Created Date, Customer Type.
const BASE_FILTER_KEYS = ["categoryName", "createdBy", "status", "createdAt", "customerTypeDescription"];
const HOLIDAY_FILTER_KEYS = ["tripType", "leadType", "preferredDestination"];

// Same markup/classes as the shared MultiSelectFilter (so the pill, the
// ▲/▼ arrow, and the white-circle red-✕ clear badge all look identical),
// plus a search box at the top of the dropdown for filtering a long
// option list by typing. Kept local to this file rather than editing the
// shared LeadsSharedTable component.
function SearchableMultiSelectFilter({ label, options, selected, onToggle, onClear }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = React.useRef(null);
  const isActive = selected.length > 0;

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`border px-2 py-1.5 rounded text-sm min-w-[110px] text-left flex items-center gap-1.5 transition font-medium
          ${isActive
            ? "bg-blue-600 border-blue-600 text-white"
            : "bg-white border-gray-400 text-gray-700 hover:border-gray-600"}`}
      >
        <span className="truncate flex-1">
          {isActive ? `${label} (${selected.length})` : label}
        </span>
        {isActive ? (
          <span
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClear && onClear();
              setOpen(false);
            }}
            title={`Clear ${label} filter`}
            className="flex-shrink-0 w-4 h-4 rounded-full bg-white text-red-600 flex items-center justify-center text-[11px] font-black leading-none hover:bg-red-100 cursor-pointer"
          >✕</span>
        ) : (
          <span className="text-[10px] text-gray-500 flex-shrink-0">{open ? "▲" : "▼"}</span>
        )}
      </button>

      {open && (
        <div className="absolute z-20 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-56 overflow-auto min-w-[190px]">
          <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
            <input
              type="text"
              autoFocus
              placeholder={`Search ${label}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2"
            />
          </div>

          {filteredOptions.length === 0 && (
            <div className="px-2 py-1.5 text-xs text-gray-400">No matches</div>
          )}
          {filteredOptions.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => onToggle(opt)}
              />
              <span className="truncate">{opt}</span>
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
  createdBy: [],
  createdAt: [],
  tripType: [],
  leadType: [],
  preferredDestination: [],
};

export default function CreatedLeadsListWithFilters({ users, dateRange }) {
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

  // ---------------- FLATTEN LEADS (created-by-me view) ----------------
  const allLeads = useMemo(() => {
    return users.flatMap((u) => {
      return (u.createdLeads || []).map((lead) => ({
        ...lead,
        createdBy: lead.leadCreatedByName,
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
    console.log("All created leads received:", allLeads);
  }, [allLeads]);

  // ---------------- FILTER STATE ----------------
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [nameSearch, setNameSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [followUpSels, setFollowUpSels] = useState([]);
  const [travelDateSels, setTravelDateSel] = useState([]); // CalendarFilter selections for Preferred Travel Date

  // ---------------- UNIQUE FILTER OPTIONS FROM DATA ----------------
  const filterOptions = useMemo(() => {
    const getUnique = (key) => [...new Set(allLeads.map((l) => l[key]).filter(Boolean))];

    const getUniqueDates = () =>
      [
        ...new Set(
          allLeads
            .map((l) => {
              if (!l.createdAt) return null;
              const d = new Date(l.createdAt);
              return isNaN(d) ? null : d.toISOString().slice(0, 10);
            })
            .filter(Boolean)
        ),
      ];

    const getUniqueDestinations = () => {
      const set = new Set();
      allLeads.forEach((l) => splitDestinations(getDestinations(l)).forEach((d) => set.add(d)));
      return [...set];
    };

    return {
      categoryName: getUnique("categoryName"),
      createdBy: getUnique("createdBy"),
      status: getUnique("status"),
      createdAt: getUniqueDates(),
      customerTypeDescription: getUnique("customerTypeDescription"),
      tripType: [...new Set(allLeads.map(getTripType).filter(Boolean))],
      leadType: [...new Set(allLeads.map(getLeadType).filter(Boolean))],
      preferredDestination: getUniqueDestinations(),
    };
  }, [allLeads]);

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

  // Leads matching only the *base* filters (Status, Customer Type,
  // Category, Created By, Created Date, name search, Follow-up Date) —
  // deliberately excludes the Holiday-specific filters (Trip Type, Lead
  // Type, Destination) and Travel Date. Used solely to decide whether the
  // Holiday filters/columns should be visible. If this instead used the
  // fully-filtered result, picking a Destination or Travel Date that
  // matches nothing would make Holiday leads "disappear" from that result
  // and the reset effect below would wipe out the very filters just set.
  const baseFilteredLeads = useMemo(() => {
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

    return allLeads.filter((lead) => {
      const matchesFilters =
        (filters.status.length ? filters.status.includes(lead.status) : true) &&
        (filters.customerTypeDescription.length
          ? filters.customerTypeDescription.includes(lead.customerTypeDescription)
          : true) &&
        (filters.categoryName.length ? filters.categoryName.includes(lead.categoryName) : true) &&
        (filters.createdBy.length ? filters.createdBy.includes(lead.createdBy) : true) &&
        (filters.createdAt.length
          ? filters.createdAt.includes(new Date(lead.createdAt).toISOString().split("T")[0])
          : true) &&
        inFollowUp(lead);

      const matchesName = !nameSearch ||
        `${lead.fName || ""} ${lead.lName || ""}`.toLowerCase().includes(nameSearch.toLowerCase());

      return matchesFilters && matchesName;
    });
  }, [
    allLeads,
    filters.status,
    filters.customerTypeDescription,
    filters.categoryName,
    filters.createdBy,
    filters.createdAt,
    nameSearch,
    followUpSels,
  ]);

  // ---------------- APPLY FILTERS ----------------
  const filteredLeads = useMemo(() => {
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

    // Preferred Travel Date lives under lead.category, same nesting as the
    // other Holiday-specific fields — mirrors inFollowUp's shape/behaviour.
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

    return allLeads.filter((lead) => {
      const matchesFilters =
        (filters.status.length ? filters.status.includes(lead.status) : true) &&
        (filters.customerTypeDescription.length
          ? filters.customerTypeDescription.includes(lead.customerTypeDescription)
          : true) &&
        (filters.categoryName.length ? filters.categoryName.includes(lead.categoryName) : true) &&
        (filters.createdBy.length ? filters.createdBy.includes(lead.createdBy) : true) &&
        (filters.tripType.length ? filters.tripType.includes(getTripType(lead)) : true) &&
        (filters.leadType.length ? filters.leadType.includes(getLeadType(lead)) : true) &&
        (filters.preferredDestination.length
          ? splitDestinations(getDestinations(lead)).some((d) =>
            filters.preferredDestination.includes(d)
          )
          : true) &&
        (filters.createdAt.length
          ? filters.createdAt.includes(new Date(lead.createdAt).toISOString().split("T")[0])
          : true) &&
        inFollowUp(lead) &&
        inTravelDate(lead);

      const matchesName = !nameSearch ||
        `${lead.fName || ""} ${lead.lName || ""}`.toLowerCase().includes(nameSearch.toLowerCase());

      return matchesFilters && matchesName;
    });
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

  // Data-driven, not selection-driven: are there any Holiday leads matching
  // the *base* filters (see baseFilteredLeads above)? isHolidayLead already
  // normalizes casing/variants (Holiday, HOLIDAY, HOLIDAYS, Holidays, etc.),
  // so we reuse it here instead of re-matching category text ourselves.
  // Deliberately independent of the Holiday-specific filters themselves
  // (Trip Type, Lead Type, Destination, Travel Date) so picking a value
  // there that matches nothing doesn't hide/reset those same filters.
  const isHolidayRelevant = useMemo(
    () => baseFilteredLeads.some(isHolidayLead),
    [baseFilteredLeads]
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

      {/* ---------------- FILTER BAR (never scrolls) ---------------- */}
      <div className="bg-gray-50 border rounded-lg flex-shrink-0 p-2">

        <div className="flex items-start gap-3">

          {/* Left: Search + all filters + Follow-up Date */}
          <div className="flex-1 flex flex-wrap items-center gap-2">

            <input
              type="text"
              placeholder="Search by Name"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 bg-white border border-gray-300 min-w-[160px]"
            />

            {visibleFilterKeys.map((key) => {
              const FilterComponent =
                key === "preferredDestination" ? SearchableMultiSelectFilter : MultiSelectFilter;
              return (
                <FilterComponent
                  key={key}
                  label={FILTER_LABELS[key] || key}
                  options={filterOptions[key]}
                  selected={filters[key]}
                  onToggle={(value) => handleFilterChange(key, value)}
                  onClear={() =>
                    setFilters((f) => ({
                      ...f,
                      [key]: [],
                    }))
                  }
                />
              );
            })}

            {isHolidayRelevant && (
              <CalendarFilter
                label="Preferred Travel Date"
                selections={travelDateSels}
                onApply={(sels) => setTravelDateSel(sels)}
                onClear={() => setTravelDateSel([])}
              />
            )}

            <CalendarFilter
              label="Follow-up Date"
              selections={followUpSels}
              onApply={(sels) => setFollowUpSels(sels)}
              onClear={() => setFollowUpSels([])}
            />

          </div>

          {/* Right: Clear Filters (always fixed) */}
          <div className="flex-shrink-0">
            <button
              className="px-3 py-1.5 text-sm bg-blue-700 text-white rounded hover:bg-blue-800 whitespace-nowrap"
              onClick={clearFilters}
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
              <SortableHeader label="Created By" sortKey="createdBy" sortConfig={sortConfig} onSort={handleSort} />
              <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">Current Assignee</th>
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
                <td className="p-2 font-semibold">{lead.leadCreatedByName}</td>
                <td className="p-2 font-semibold">{lead.leadAssignedToName}</td>
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
