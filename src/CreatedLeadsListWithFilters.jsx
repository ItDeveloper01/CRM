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



export default function CreatedLeadsListWithFilters({ users }) {
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



 const fetchSubordinateRoleListAPI = config.apiUrl + "/Reporting/GetSubordinateranksByUserId"
 const fetchDataWithFiltersAPI = config.apiUrl + "/Reporting/GetManagerAnalyticsDataWithFilters"
 const [hierarchyData, setHierarchyData] = useState({}); // State to hold the hierarchy data
 const [transferUsers, setTransferUsers] = useState([]);
const [loadingUsers, setLoadingUsers] = useState(false);
const [leads, setLeads] = useState([]);
const [showTransferModal, setShowTransferModal] = useState(false);
const [selectedUser, setSelectedUser] = useState("");




const openTransferModal = (lead) => {
  debugger;
  setSelectedLead(lead);
  setShowTransferModal(true);
  loadTransferUsers(); // existing API call
};
const handleTransfer = async (toUserId, leadId) => {
  if (!toUserId) return;

  try {
    await fetch( fetchDataWithFiltersAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leadId,
        toUserId,
      }),
    });

    // optional: update UI immediately
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? { ...lead, transferTo: toUserId }
          : lead
      )
    );
  } catch (error) {
    console.error("Lead transfer failed", error);
    alert("Unable to transfer lead. Please try again.");
  }
};



//  try {
//     debugger;
//     const response = await axios.post(
//         fetchDataWithFiltersAPI,
//         {
//           userID: sessionUser.user.id,
//           selectedVerticles: [],   // can be List<DTO> or List<int>
//           selectedRoles: [] ,           // can be List<DTO> or List<int>
//           //dateRange : {from: selectedDateRange.from , to:selectedDateRange.to
//           //}
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${sessionUser.token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//     //setListOfVerticles(response.data);
//     setHierarchyData(response.data);
//     debugger;
//     console.log(response.data);
//     // setSubordinates(response.data);
//   } catch (error) {
//     console.error(error);
//   }
// };



   // ✅ ONLY CREATED LEADS
  const allLeads = useMemo(() => {
    debugger;
    return users.flatMap((u) => {
      return (u.createdLeads || []).map((lead) => ({
        ...lead,
        // leadCreatedByName: u.firstName,
        // assignedTo:lead.leadCreatedByName,
        // createdBy: u.firstName,// ✅ ADD THIS
        status: lead?.histories?.length > 0
          ? lead.histories[0].statusDescription
          : lead.statusDescription,
        leadAssignedTo: u.userID,
      }));
    });
  }, [users]);
 console.log("all leads : ",allLeads);
    // ---------------- VIEW DETAILS ----------------
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
//   async function fetchLeadDetails(lead) {
//   try {
//     debugger;

//     const cleanedLead = {
//       ...lead,

//       // ✅ remove null createdAt from histories
//       histories: (lead.histories || []).map(h => {
//         const { createdAt, ...rest } = h;
//         return {
//           ...rest,
//           createdAt: createdAt ?? new Date().toISOString()
//         };
//       })
//     };

//     const res = await axios.post(
//       GetLeadsForEditAPI,
//       cleanedLead,
//       {
//         headers: {
//           Authorization: `Bearer ${sessionUser.token}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     return res.data;

//   } catch (error) {
//     const message =
//       error.response?.data ||
//       error.response?.statusText ||
//       error.message;

//     showMessage(
//       "Error fetching Lead for edit: " + JSON.stringify(message),
//       MESSAGE_TYPES.ERROR
//     );

//     return null;
//   }
// }

  React.useEffect(() => {
    console.log("All leads received in LeadsWithFilters.jsx:", allLeads);
  }, [allLeads]);

  // ---------------- FILTER STATE ----------------
  const [filters, setFilters] = useState({
    status: "",
    customerTypeDescription: "",
    categoryName: "",
    assignedTo: "",
    createdAt: "", // ✅ CHANGED
  });

  const [nameSearch, setNameSearch] = useState("");

  // ---------------- UNIQUE FILTER OPTIONS FROM DATA ----------------
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


  const loadTransferUsers = async () => {
  if (transferUsers.length > 0) return;

  // setLoadingUsers(true);
  // const res = await fetch("/api/analytics/user-ids");
  // const data = await res.json();

  // setTransferUsers(data);
  // setLoadingUsers(false);
};
   // ---------------- APPLY FILTERS ----------------
  const filteredLeads = useMemo(() => {

    debugger;
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
              createdAt: "",
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
              <th className="p-2 text-left">Created By</th>
              <th className="p-2 text-left">Current Assignee</th>
              <th className="p-2 text-left">Lead ID</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Created Date</th>
              <th className="p-2 text-left">Latest Update</th>
              <th className="p-2 text-left">Customer Type</th>
              <th className="p-2 text-left">Mobile No</th>
              <th className="p-2 text-left">TransferTo</th>
              <th className="p-2 text-left">Details</th>
            </tr>
          </thead>


          <tbody>
            {filteredLeads.map((lead, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">{lead.fName} {lead.lName}</td>
                <td className="p-2">{lead.categoryName}</td>
                <td className="p-2 font-semibold">{lead.leadCreatedByName}</td>
                <td className="p-2 font-semibold">{lead.leadAssignedToName}</td>
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
                <td className="p-2">{lead.histories?.[0]?.createdAt || lead.updatedAt ? new Date(lead.histories?.[0]?.createdAt || lead.updatedAt).toLocaleDateString("en-GB").replace(/\//g, "-") : "—"}</td>
                <td className="p-2">{lead.customerTypeDescription}</td>
                <td className="p-2">{lead.mobileNo}</td>
                <td className="p-2">
                                  <button
                                    className={`px-3 py-1 rounded ${
                                      ["lost","confirmed"].includes(
                                      lead.status?.trim().toLowerCase()
                                    )? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-blue-600 text-white'
                                    }`}
                                    onClick={() => openTransferModal(lead)}
                                      disabled={["lost","confirmed"].includes(
                                      lead.status?.trim().toLowerCase() )}>
                                    Transfer To
                                  </button>
                </td>
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
        parent={"Leads with filters"}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        lead={selectedLead}
        // readOnly={readOnly}
        mode={"view"}              // you can write {mode} alson at view place 
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

// // -------------------- LEAD LIST TAB --------------------
// {activeTab === "Lead List" && (
//   <CardContent>
//     <LeadListWithFilters users={users} />
//   </CardContent>
// )  
