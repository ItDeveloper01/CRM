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
const BASE_FILTER_KEYS = ["status", "customerTypeDescription", "categoryName", "assignedTo"];
const HOLIDAY_FILTER_KEYS = ["tripType", "leadType", "preferredDestination"];

const EMPTY_FILTERS = {
  status: [],
  customerTypeDescription: [],
  categoryName: [],
  assignedTo: [],
  tripType: [],
  leadType: [],
  preferredDestination: [],
};

export default function LeadListWithFilters({ users }) {
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

  // ---------------- UNIQUE FILTER OPTIONS FROM DATA ----------------
  const filterOptions = useMemo(() => {
    const getUnique = (key) => [...new Set(allLeads.map((l) => l[key]).filter(Boolean))];

    const getUniqueDestinations = () => {
      const set = new Set();
      allLeads.forEach((l) => splitDestinations(getDestinations(l)).forEach((d) => set.add(d)));
      return [...set];
    };

    return {
      categoryName: getUnique("categoryName"),
      assignedTo: getUnique("assignedTo"),
      status: getUnique("status"),
      customerTypeDescription: getUnique("customerTypeDescription"),
      tripType: [...new Set(allLeads.map(getTripType).filter(Boolean))],
      leadType: [...new Set(allLeads.map(getLeadType).filter(Boolean))],
      preferredDestination: getUniqueDestinations(),
    };
  }, [allLeads]);

  // Only surface the Holiday-specific filters when the Category filter is
  // empty (i.e. "All") or explicitly includes Holiday. Otherwise hide them.
  const isHolidayRelevant =
    filters.categoryName.length === 0 ||
    filters.categoryName.some((c) => c.toUpperCase() === "HOLIDAY");

  const visibleFilterKeys = isHolidayRelevant
    ? [...BASE_FILTER_KEYS, ...HOLIDAY_FILTER_KEYS]
    : BASE_FILTER_KEYS;

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
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // ---------------- APPLY FILTERS ----------------
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      const matchesFilters =
        (filters.status.length ? filters.status.includes(lead.status) : true) &&
        (filters.customerTypeDescription.length
          ? filters.customerTypeDescription.includes(lead.customerTypeDescription)
          : true) &&
        (filters.categoryName.length ? filters.categoryName.includes(lead.categoryName) : true) &&
        (filters.assignedTo.length ? filters.assignedTo.includes(lead.assignedTo) : true) &&
        (filters.tripType.length ? filters.tripType.includes(getTripType(lead)) : true) &&
        (filters.leadType.length ? filters.leadType.includes(getLeadType(lead)) : true) &&
        (filters.preferredDestination.length
          ? splitDestinations(getDestinations(lead)).some((d) =>
              filters.preferredDestination.includes(d)
            )
          : true);

      const matchesName = !nameSearch || lead.fName.toLowerCase().includes(nameSearch.toLowerCase());

      return matchesFilters && matchesName;
    });
  }, [allLeads, filters, nameSearch]);

  // ---------------- APPLY SORT ----------------
  const sortedLeads = useMemo(() => {
    if (!sortConfig.key) return filteredLeads;

    const { key, direction } = sortConfig;
    const dir = direction === "asc" ? 1 : -1;
    const dateKeys = ["createdAt", "updatedAt", "latestUpdateAt"];

    return [...filteredLeads].sort((a, b) => {
      let valA = key === "latestUpdateAt" ? getLatestUpdate(a) : a[key];
      let valB = key === "latestUpdateAt" ? getLatestUpdate(b) : b[key];

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

  return (
    <div className="w-full">
      <LoadingOverlay visible={isLoading} />

      {/* ---------------- FILTER BAR ---------------- */}
      <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 border rounded-lg">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Name search */}
          <input
            type="text"
            placeholder="Search by Name"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            className="rounded px-2 py-1.5 focus:outline-none focus:ring-2 bg-white border border-gray-300"
          />

          {visibleFilterKeys.map((key) => (
            <MultiSelectFilter
              key={key}
              label={FILTER_LABELS[key] || key}
              options={filterOptions[key]}
              selected={filters[key]}
              onToggle={(value) => handleFilterChange(key, value)}
            />
          ))}
        </div>

        {/* CLEAR FILTER BUTTON */}
        <button
          className="px-3 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-700"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>

      {/* ---------------- TABLE ---------------- */}
      <div className="overflow-auto max-h-[500px] border rounded-lg mt-4">
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
              <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">Trip Type / Lead Type</th>
              <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">Destinations</th>
              <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">TransferTo</th>
              <th className="p-2 text-left sticky top-0 z-10 bg-gray-100">Details</th>
            </tr>
          </thead>

          <tbody>
            {sortedLeads.map((lead, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">
                  {lead.fName} {lead.lName}
                </td>
                <td className="p-2">{lead.categoryName}</td>
                <td className="p-2 font-semibold">{lead.assignedTo}</td>
                <td className="p-2 text-center">{lead.leadID}</td>

                <td
                  className={`p-2 font-semibold ${
                    lead.status === "Lost"
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

                {/* Destinations — shown in full, not truncated, since managers need it at a glance */}
                <td className="p-2 max-w-[220px]">
                  {isHolidayLead(lead) && getDestinations(lead) ? (
                    <span className="text-[11px] text-gray-700">{getDestinations(lead)}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                <td className="p-2 text-center">
                  <button
                    className={`inline-flex items-center justify-center p-1.5 rounded ${
                      ["lost", "confirmed"].includes(lead.status?.trim().toLowerCase())
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
