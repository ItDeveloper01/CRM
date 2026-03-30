import React, { useMemo, useState } from "react";
import { CardContent } from '@mui/material';
import axios from "axios";
import UpdateLeadsModal from "./UpdateLeadsModal";
import config from "./config";
import { useMessageBox } from "./Notification";
import { useGetSessionUser } from "./SessionContext";
import LeadTransferModal from "./LeadTransferModal";

export default function LeadListCreated({ users }) {

  const GetLeadsForEditAPI = config.apiUrl + "/TempLead/GetLeadForEdit";
  const { user: sessionUser } = useGetSessionUser();
  const { showMessage } = useMessageBox();

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // ✅ ONLY CREATED LEADS
  const allLeads = useMemo(() => {
    return users.flatMap((u) => {
      return (u.createdLeads || []).map((lead) => ({
        ...lead,
        assignedTo: u.firstName,
        status: lead?.histories?.length > 0
          ? lead.histories[0].statusDescription
          : lead.statusDescription,
        leadAssignedTo: u.userID,
      }));
    });
  }, [users]);

  // ---------------- FILTER STATE ----------------
  const [filters, setFilters] = useState({
    status: "",
    customerTypeDescription: "",
    categoryName: "",
    assignedTo: "",
    createdAt: "", // ✅ CHANGED
  });

  const [nameSearch, setNameSearch] = useState("");

  // ---------------- FILTER OPTIONS ----------------
  const filterOptions = useMemo(() => {
    const getUnique = (key) =>
      [...new Set(allLeads.map((l) => l[key]).filter(Boolean))];

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

    return {
      categoryName: getUnique("categoryName"),
      assignedTo: getUnique("assignedTo"),
      status: getUnique("status"),
      createdAt: getUniqueDates(), // ✅ CHANGED
      customerTypeDescription: getUnique("customerTypeDescription"),
    };
  }, [allLeads]);

  // ---------------- APPLY FILTERS ----------------
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {

      const matchesFilters =
        (filters.status ? lead.status === filters.status : true) &&
        (filters.customerTypeDescription ? lead.customerTypeDescription === filters.customerTypeDescription : true) &&
        (filters.categoryName ? lead.categoryName === filters.categoryName : true) &&
        (filters.assignedTo ? lead.assignedTo === filters.assignedTo : true) &&
        (filters.createdAt
          ? new Date(lead.createdAt).toISOString().split('T')[0] ===
            new Date(filters.createdAt).toISOString().split('T')[0]
          : true
        );

      const matchesName =
        !nameSearch || lead.fName.toLowerCase().includes(nameSearch.toLowerCase());

      return matchesFilters && matchesName;
    });
  }, [allLeads, filters, nameSearch]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ---------------- VIEW DETAILS ----------------
  const handleViewClick = async (lead) => {
    try {
      const res = await axios.post(GetLeadsForEditAPI, lead, {
        headers: {
          Authorization: `Bearer ${sessionUser.token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.data) {
        setSelectedLead(res.data);
        setModalOpen(true);
      }
    } catch (error) {
      showMessage("Error fetching Lead details", "error");
    }
  };

  return (
    <div className="w-full">

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 p-3 bg-gray-50 border rounded-lg">

        <input
          type="text"
          placeholder="Search by Name"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          className='rounded px-2 py-1.5 border'
        />

        {Object.keys(filterOptions).map((key) => (
          <select
            key={key}
            className="border p-2 rounded text-sm"
            value={filters[key]}
            onChange={(e) => handleFilterChange(key, e.target.value)}
          >
            <option value="">Filter by {key}</option>
            {filterOptions[key].map((op) => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
        ))}

        <button
          className="px-3 py-2 bg-blue-700 text-white rounded"
          onClick={() => {
            setFilters({
              status: "",
              customerTypeDescription: "",
              categoryName: "",
              assignedTo: "",
              createdAt: "",
            });
            setNameSearch("");
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-auto max-h-[500px] border rounded-lg mt-4">
        <table className="w-full text-xs border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th>Sr.</th>
              <th>Name</th>
              <th>Category</th>
              <th>Assigned</th>
              <th>Lead ID</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Latest Update</th>
              <th>Customer</th>
              <th>Mobile</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{lead.fName} {lead.lName}</td>
                <td>{lead.categoryName}</td>
                <td>{lead.assignedTo}</td>
                <td>{lead.leadID}</td>
                <td>{lead.status}</td>

                {/* ✅ Created Date */}
                <td>
                  {lead.createdAt
                    ? new Date(lead.createdAt).toLocaleDateString("en-GB")
                    : "—"}
                </td>

                {/* Latest Update */}
                <td>
                  {lead.updatedAt
                    ? new Date(lead.updatedAt).toLocaleDateString("en-GB")
                    : "—"}
                </td>

                <td>{lead.customerTypeDescription}</td>
                <td>{lead.mobileNo}</td>

                <td>
                  <button
                    className="text-blue-600 underline"
                    onClick={() => handleViewClick(lead)}
                  >
                    View
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <UpdateLeadsModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        lead={selectedLead}
        mode={"view"}
      />

    </div>
  );
}