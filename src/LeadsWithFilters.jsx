import React, { useMemo, useState } from "react";
import { CardContent } from '@mui/material'; // Adjust if using different CardContent
import { MESSAGE_TYPES } from "./Constants";
import axios from "axios";
import UpdateLeadsModal from "./UpdateLeadsModal";
import { getEmptyLeadObj } from "./Model/LeadModel";
import config from "./config";
import { useMessageBox } from "./Notification";
import { useGetSessionUser } from "./SessionContext";

export default function LeadListWithFilters({ users }) {
  // Flatten all leads

  //  const [modalOpen, setModalOpen ] = useState(false);
  // const [selectedLead, setSelectedLead] = useState(getEmptyLeadObj());
  const GetLeadsForEditAPI = config.apiUrl + "/TempLead/GetLeadForEdit";
  const { user: sessionUser } = useGetSessionUser();
  const { showMessage } = useMessageBox();
  // const [readOnly, setReadOnly] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [mode, setMode] = useState("create"); //  ADD THIS



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
        // status: lead.histories[0].statusDescription, // or "Confirmed"/"Lost"/"Postponed" if you want to set manually
        // status: lead?.histories?.[0]?.statusDescription || "Unknown",
        status: lead?.histories?.length > 0 ? lead.histories[0].statusDescription : lead.statusDescription,
      }));
    });
  }, [users]);

  const handleViewClick = async (lead) => {
    console.log("Viewing lead.....:", lead);
    //API call  to lead details. 

    debugger;
    try {

      let templead = await fetchLeadDetails(lead);
      setSelectedLead(templead);
      setMode("view");
      setModalOpen(true);
    } catch {
      showMessage("Exception thrown.", MESSAGE_TYPES.ERROR);
    }
  };

  // async function fetchLeadDetails(lead) {
  //   let res = null;
  //   try {
  //   //   const payload = {
  //   //   leadID: lead.leadID,
  //   //   categoryName: lead.categoryName,
  //   //   categoryId: lead.categoryId, // make sure this exists in table data
  //   // };
  //     debugger;
  //     console.log("GetLeadsForEditAPI:", GetLeadsForEditAPI);
  //     console.log("LEad data to be passed to API", lead);
  //     res = await axios.post(GetLeadsForEditAPI, lead, {
  //       headers: {
  //         Authorization: `Bearer ${sessionUser.token}`,// ✅ JWT token
  //         "Content-Type": "application/json"

  //       },
  //       // params: {
  //       //   lead: lead,
  //       // }
  //     });
  //     debugger;
  //     if (res && res.data) {
  //       console.log("Leads details fetched:"+ res.data);
  //       return res.data;
  //     } else {
  //       showMessage("Empty response from server.", MESSAGE_TYPES.WARNING);
  //       return null;
  //     }

  //   } catch (error) {
  //     debugger;
  //     console.log("Error fetching Lead for edit...", error);

  //     const message =
  //       error.response?.data ||
  //       error.response?.statusText ||
  //       error.message ||
  //       "Unknown error";

  //     showMessage("Error fetching Lead for edit." + JSON.stringify(message), MESSAGE_TYPES.ERROR);
  //     return null;

  //   }

  // }
  async function fetchLeadDetails(lead) {
    let res = null;
    try {
      debugger;
      console.log("GetLeadsForEditAPI:", GetLeadsForEditAPI);
      console.log("LEad data to be passed to API", lead);
      res = await axios.post(GetLeadsForEditAPI, lead, {
        headers: {
          Authorization: `Bearer ${sessionUser.token}`,// ✅ JWT token
          "Content-Type": "application/json"

        },
        // params: {
        //   lead: lead,
        // }
      });
      debugger;
      if (res && res.data) {
        console.log("Leads details fetched:" + res.data);
        return res.data;
      } else {
        showMessage("Empty response from server.", MESSAGE_TYPES.WARNING);
        return null;
      }

    } catch (error) {
      debugger;
      console.log("Error fetching Lead for edit...", error);

      const message =
        error.response?.data ||
        error.response?.statusText ||
        error.message ||
        "Unknown error";

      showMessage("Error fetching Lead for edit." + JSON.stringify(message), MESSAGE_TYPES.ERROR);
      return null;

    }

  }






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
    const getUniqueDates = () =>
      [
        ...new Set(
          allLeads
            .map((l) => {
              if (!l.updatedAt) return null;
              const d = new Date(l.updatedAt);
              return isNaN(d) ? null : d.toISOString().slice(0, 10); // ← DATE ONLY
            })
            .filter(Boolean)
        ),
      ];

    return {
      categoryName: getUnique("categoryName"),
      assignedTo: getUnique("assignedTo"),
      status: getUnique("status"),
      updatedAt: getUniqueDates(),
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
        // (filters.updatedAt ? lead.updatedAt === filters.updatedAt : true);
        (filters.updatedAt
          ? new Date(lead.updatedAt).toISOString().split('T')[0] ===
          new Date(filters.updatedAt).toISOString().split('T')[0]
          : true
        )
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
            // className="border rounded px-2 py-1 text-sm w-40"
            className='rounded px-2 py-1.5 focus:outline-none focus:ring-2 bg-white border border-gray-300'
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
          //className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          className="px-3 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-700"
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
        <table className="w-full text-xs border-collapse">
          {/* <table className="w-full table-fixed border-collapses"> */}
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Sr. No.</th>
              <th className="p-2 text-left">Lead Name</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Assigned To</th>
              <th className="p-2 text-left">Lead ID</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Created Date</th>
              <th className="p-2 text-left">Latest Update</th>
              <th className="p-2 text-left">Customer Type</th>
              <th className="p-2 text-left">Mobile No</th>
              <th className="p-2 text-left">Details</th>
            </tr>
          </thead>


          <tbody>
            {filteredLeads.map((lead, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">{lead.fName} {lead.lName}</td>
                <td className="p-2">{lead.categoryName}</td>
                <td className="p-2 font-semibold">{lead.assignedTo}</td>
                <td className="p-2 text-center">{lead.leadID}</td>

                <td className={`p-2 font-semibold ${lead.status === "Lost"
                  ? "text-lostText"
                  : lead.status === "Confirmed"
                    ? "text-confirmedText"
                    : lead.status === "Postponed"
                      ? "text-postponedText"
                      // : "text-yellow-500"
                      : "text-openText"
                  }`}>
                  {lead.status}
                </td>

                <td className="p-2">{new Date(lead.createdAt).toLocaleDateString("en-GB").replace(/\//g, "-")}</td>
                {/* <td className="p-2"> {new Date(lead.histories[0].createdAt).toLocaleDateString("en-GB").replace(/\//g, "-")}</td> */}
                {/* <td className="p-2">{lead.histories?.[0]?.createdAt? new Date(lead.histories[0].createdAt).toLocaleDateString("en-GB").replace(/\//g, "-"): "—"}</td> */}

                <td className="p-2">{lead.histories?.[0]?.createdAt || lead.updatedAt ? new Date(lead.histories?.[0]?.createdAt || lead.updatedAt).toLocaleDateString("en-GB").replace(/\//g, "-") : "—"}</td>
                <td className="p-2">{lead.customerTypeDescription}</td>
                <td className="p-2">{lead.mobileNo}</td>
                <td className="p-2">
                  <button
                    className="text-blue-700 text-500 underline"
                    onClick={() => handleViewClick(lead)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      <UpdateLeadsModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        lead={selectedLead}
        // readOnly={readOnly}
        mode={"view"}              // you can write {mode} alson at view place 
      />
    </div>

  );
}

// // -------------------- LEAD LIST TAB --------------------
// {activeTab === "Lead List" && (
//   <CardContent>
//     <LeadListWithFilters users={users} />
//   </CardContent>
// )  
