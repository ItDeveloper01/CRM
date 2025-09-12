import React, { useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import LeadDetailsModal from "./UpdateLeadsModal"; // Tailwind modal
import LeadsGeneration from "./LeadsGeneration"; // Import the lead generation component
import UpdateLeadsModal from "./UpdateLeadsModal";
import { LeadObj } from "./Model/LeadModel";  
import { getEmptyLeadObj } from "./Model/LeadModel";


/* ---------- CSV Export Function ---------- */
const exportToCSV = (data, filename) => {
  if (!data || !data.length) return;
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));
  data.forEach((row) => {
    const values = headers.map((header) => {
      const escaped = ("" + row[header]).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  });

  const csvData = csvRows.join("\n");
  const blob = new Blob([csvData], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};


// Pure JavaScript date formatting function
export function formatDate(dateInput) {
  if (!dateInput) return "";

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) return ""; // invalid date check

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const year = String(date.getFullYear());

  return `${day}-${month}-${year}`;
}

/* ---------- Pagination Renderer ---------- */
const renderPagination = (totalRows, currentPage, setPage) => {
  const rowsPerPage = 5;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  if (totalPages <= 1) return null;
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = start + maxVisible - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages = [];
  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("...");
  }
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex justify-end mt-3 space-x-1 text-sm">
      <button
        className={`px-2 py-1 rounded border ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-200"
        }`}
        disabled={currentPage === 1}
        onClick={() => setPage(1)}
      >
        ⏮
      </button>
      <button
        className={`px-2 py-1 rounded border ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-200"
        }`}
        disabled={currentPage === 1}
        onClick={() => setPage(currentPage - 1)}
      >
        ◀
      </button>
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={idx} className="px-2 py-1 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={p}
            className={`px-2 py-1 rounded border ${
              currentPage === p
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        )
      )}
      <button
        className={`px-2 py-1 rounded border ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-200"
        }`}
        disabled={currentPage === totalPages}
        onClick={() => setPage(currentPage + 1)}
      >
        ▶
      </button>
      <button
        className={`px-2 py-1 rounded border ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-200"
        }`}
        disabled={currentPage === totalPages}
        onClick={() => setPage(totalPages)}
      >
        ⏭
      </button>
    </div>
  );
};

/* ---------- Main Component ---------- */
const LeadsTable = ({ activeLeads, followLeads, showFollowUp, toggleSort }) => {
  const rowsPerPage = 5;
  const [activePage, setActivePage] = useState(1);
  const [followPage, setFollowPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
 const [selectedLead, setSelectedLead] = useState(getEmptyLeadObj());

  const activeVisible = activeLeads.slice(
    (activePage - 1) * rowsPerPage,
    activePage * rowsPerPage
  );
  const followVisible = followLeads.slice(
    (followPage - 1) * rowsPerPage,
    followPage * rowsPerPage
  );

  const handleViewClick = (lead) => {
  console.log("Viewing lead.....:", lead);    
   setSelectedLead(lead);
    setModalOpen(true);
  };

  return (
    <>
      {/* Active Leads Table */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">Today's Leads</h3>
          <button
            className="p-2 rounded bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 relative group"
            onClick={() => exportToCSV(activeLeads, "ActiveLeads.csv")}
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-gray-800 text-white px-2 py-1 rounded">
              Export data to Excel
            </span>
          </button>
        </div>
        <table className="w-full border-4 border-blue-300 rounded-xl overflow-hidden border-separate border-spacing-0">
          <thead className="bg-blue-100 border-b-4">
            <tr>
              <th
                className="cursor-pointer text-left px-3 py-2"
                onClick={() => toggleSort("active", "id")}
              >
                ID
              </th>
              <th className="text-left px-3 py-2">Title</th>
              <th
                className="cursor-pointer text-left px-3 py-2"
                onClick={() => toggleSort("active", "name")}
              >
                First Name
              </th>
              <th className="text-left px-3 py-2">Last Name</th>
              <th className="text-left px-3 py-2">Mobile No</th>
              <th className="text-left px-3 py-2">Category</th>
                <th className="text-left px-3 py-2">FollowUpDate</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Enquiry Date</th>
              <th className="text-left px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {activeVisible.map((lead) => (
              <tr key={lead.leadID} className="hover:bg-gray-100 transition">
                <td className="px-3 py-2">{lead.leadID}</td>
                 <td className="px-3 py-2">{lead.title}</td>
                <td className="px-3 py-2">{lead.fName}</td>
                <td className="px-3 py-2">{lead.lName}</td>
                <td className="px-3 py-2">{lead.mobileNo}</td>
                <td className="px-3 py-2">{lead.categoryName}</td>
                  <td className="px-3 py-2">{formatDate(lead.followUpDate)}</td>
                <td className="px-3 py-2">{lead.categoryStatus}</td>
                <td className="px-3 py-2">  {formatDate(lead.enquiryDate)} </td>
                <td className="px-3 py-2">
                  <button
                    className="text-blue-500 underline"
                    onClick={() => handleViewClick(lead)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {renderPagination(activeLeads.length, activePage, setActivePage)}
      </div>

      {/* Follow Up Leads Table */}
      {showFollowUp && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold">Follow Up Leads</h3>
            <button
              className="p-2 rounded bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 relative group"
              onClick={() => exportToCSV(followLeads, "FollowUpLeads.csv")}
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-gray-800 text-white px-2 py-1 rounded">
                Export data to Excel
              </span>
            </button>
          </div>
          <table className="w-full border-4 border-blue-300 rounded-xl overflow-hidden border-separate border-spacing-0">
            <thead className="bg-blue-100 border-b-4">
              <tr>
                <th className="text-left px-3 py-2">ID</th>
                <th className="text-left px-3 py-2">Title</th>
                <th className="text-left px-3 py-2">First Name</th>
                <th className="text-left px-3 py-2">Last Name</th>
                <th className="text-left px-3 py-2">Mobile No</th>
                <th className="text-left px-3 py-2">Category</th>
                <th className="text-left px-3 py-2">FollowUpDate</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Enquiry Date</th>
                <th className="text-left px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {followVisible.map((lead) => (
                <tr key={lead.leadID} className="hover:bg-gray-100 transition">
                  <td className="px-3 py-2">{lead.leadID}</td>
                   <td className="px-3 py-2">{lead.title}</td>
                  <td className="px-3 py-2">{lead.fName}</td>
                  <td className="px-3 py-2">{lead.lName}</td>
                  <td className="px-3 py-2">{lead.mobileNo}</td>
                  <td className="px-3 py-2">{lead.categoryName}</td>
                  <td className="px-3 py-2">{formatDate(lead.followUpDate)}</td>
                  <td className="px-3 py-2">{lead.categoryStatus}</td>
                  <td className="px-3 py-2">{formatDate(lead.enquiryDate)}</td>
                  <td className="px-3 py-2">
                    <button
                      className="text-blue-500 underline"
                     onClick={() => handleViewClick(lead)}
                                        >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination(followLeads.length, followPage, setFollowPage)}
        </div>
      )}

   {/* Modal */}
      <UpdateLeadsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        lead={selectedLead}
      />
    </>
  );
};

export default LeadsTable;
