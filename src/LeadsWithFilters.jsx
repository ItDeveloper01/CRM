import React, { useMemo, useState } from "react";
import { CardContent } from '@mui/material'; // Adjust if using different CardContent

export default function LeadListWithFilters({ users }) {
  // Flatten all leads
 
 const allLeads = useMemo(() => {
  return users.flatMap((u) => {
    // Combine all leads into one array
    const combinedLeads = [
      ...(u.openLeads || []),
      ...(u.confirmedLeads || []),
      ...(u.lostLeads || []),
      ...(u.postponedLeads || [])
    ];

    // Map them with assignedTo and ensure status
    return combinedLeads.map((lead) => ({
      ...lead,
      assignedTo: u.firstName,
      status: lead.histories[0].statusDescription , // or "Confirmed"/"Lost"/"Postponed" if you want to set manually
    }));
  });
}, [users]);


  React.useEffect(() => {
    console.log("All leads received in LeadsWithFilters.jsx:", allLeads);
  }, [allLeads]);

  // ---------------- FILTER STATE ----------------
  const [filters, setFilters] = useState({
    status: "",
    customerTypeDescription: "",
    categoryName: "",
    assignedTo: "",
    updatedAt: "",
  });

  const [nameSearch, setNameSearch] = useState("");

  // ---------------- UNIQUE FILTER OPTIONS FROM DATA ----------------
  const filterOptions = useMemo(() => {
    const getUnique = (key) =>
      [...new Set(allLeads.map((l) => l[key]).filter(Boolean))];

    return {
      status: getUnique("status"),
      customerTypeDescription: getUnique("customerTypeDescription"),
      categoryName: getUnique("categoryName"),
      assignedTo: getUnique("assignedTo"),
      updatedAt: getUnique("updatedAt"),
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
        (filters.updatedAt ? lead.updatedAt === filters.updatedAt : true);

      const matchesName = !nameSearch || lead.fName.toLowerCase().includes(nameSearch.toLowerCase());

      return matchesFilters && matchesName;
    });
  }, [allLeads, filters, nameSearch]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full">
      {/* ---------------- FILTER BAR ---------------- */}
      <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 border rounded-lg">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Name search */}
          <input
            type="text"
            placeholder="Search by Name"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-40"
          />

          {Object.keys(filterOptions).map((key) => (
            <select
              key={key}
              className="border p-2 rounded text-sm flex-1 min-w-[120px]"
              value={filters[key]}
              onChange={(e) => handleFilterChange(key, e.target.value)}
            >
              <option value="">Filter by {key}</option>
              {filterOptions[key].map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          ))}
        </div>

        {/* CLEAR FILTER BUTTON */}
        <button
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => {
            setFilters({
              status: "",
              customerTypeDescription: "",
              categoryName: "",
              assignedTo: "",
              updatedAt: "",
            });
            setNameSearch("");
          }}
        >
          Clear Filters
        </button>
      </div>
      
      {/* ---------------- TABLE ---------------- */}
      <div className="overflow-auto max-h-[500px] border rounded-lg mt-4">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">First Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Assigned To</th>
              <th className="p-2">Status</th>
              <th className="p-2">Updated Date</th>
              <th className="p-2">Lead ID</th>
              <th className="p-2">Customer Type</th>
              <th className="p-2">Mobile No</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium text-indigo-700">{lead.fName}</td>
                <td className="p-2">{lead.categoryName}</td>
                <td className="p-2 font-semibold">{lead.assignedTo}</td>

                <td className={`p-2 font-semibold ${
                  lead.status === "Lost"
                    ? "text-red-600"
                    : lead.status === "Confirmed"
                    ? "text-green-600"
                    : lead.status === "Postponed"
                    ? "text-orange-500"
                    : "text-yellow-500"
                }`}>
                  {lead.status}
                </td>

                <td className="p-2 text-gray-600">{lead.updatedAt}</td>
                <td className="p-2">{lead.leadID}</td>
                <td className="p-2">{lead.customerTypeDescription}</td>
                <td className="p-2">{lead.mobileNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// // -------------------- LEAD LIST TAB --------------------
// {activeTab === "Lead List" && (
//   <CardContent>
//     <LeadListWithFilters users={users} />
//   </CardContent>
// )
