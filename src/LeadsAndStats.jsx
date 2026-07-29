import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import LeadListWithFilters from "./LeadsWithFilters";
import UserStatsCard from "./UserStatsCard";
import UserMetricChart from "./Usermetric";
import LeadStatsTable from "./LeadsStatsTable";
import ReasonStatsCard from "./ReasonStatsCard";
import CreatedLeadsListWithFilters from "./CreatedLeadsListWithFilters";

// Dummy CustomComponents to avoid import errors
const Card = ({ children, className }) => <div className={`border rounded-xl shadow p-3 bg-white mb-3 ${className || ''}`}>{children}</div>;
const CardHeader = ({ children, className }) => <div className={`text-lg font-semibold mb-2 text-grey-700 ${className || ''}`}>{children}</div>;
const CardContent = ({ children }) => <div className="mt-2">{children}</div>;

const Tabs = ({ tabs = [], active, onChange }) => (
  <div className="flex gap-2 border-b pb-2 mb-4">
    {tabs.map(t => (
      <button
        key={t}
        className={`px-3 py-1 rounded-t font-semibold ${active === t ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}
        onClick={() => onChange(t)}>
        {t}
      </button>
    ))}
  </div>
);

const sampleData = {
  gpatil: { Userdata: { firstName: "Super Admin", openCount: 2, confirmedCount: 0, lostCount: 0, postponedCount: 0, openLeads: [
    { leadID: 1, fName: "Dhawnit", lName: "Jadhav", categoryName: "VISA", customerType: 2, mobileNo: "9529860694", updatedAt: "2025-11-25T17:16:27.003", status: null },
    { leadID: 8, fName: "Devyani", lName: "Joshi", categoryName: "VISA", customerType: 1, mobileNo: "0000000000", updatedAt: "2025-11-25T10:12:27.003", status: null }
  ]}},
};

export default function LeadsAndStats(dataProp) {
  const [selectedMetric, setSelectedMetric] = useState("openCount");
  const [activeTab, setActiveTab] = useState("Lead List");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [data, setData] = useState(dataProp.data || []);
  const [users, setUSers] = useState([]);

  React.useEffect(() => {
    console.log("Data prop changed:", dataProp.data);
    // Use sampleData only when data prop is null/undefined (initial load before any fetch)
    // An empty object {} means all users were deselected — show empty state, not sample data
    const newData = (dataProp.data !== null && dataProp.data !== undefined)
      ? dataProp.data
      : sampleData;
    setData(newData);

    if (newData && typeof newData === 'object') {
      const usersArray = Object.entries(newData).map(([key, value]) => ({
        key,
        ...value.Userdata
      }));
      setUSers(usersArray);
    } else if (Array.isArray(newData)) {
      setUSers(newData);
    }
  }, [dataProp]);

  const tabs = ["Lead List", "Individual Statistics", "Team Overview", "Stats Table", "Reason Stats", "Created Leads"];

  React.useEffect(() => {
    console.log("Users data:", users);
  }, [users]);

  const filteredUsers = users; // selectedUsers filtering removed for brevity

  return (
    <div className="w-full flex flex-col" style={{ height: "100%" }}>
      {/* Header + tabs — never scrolls */}
      <div className="px-4 pt-3 border-b bg-white flex-shrink-0">
        <div className="text-lg font-semibold mb-2 text-gray-700">Leads & Statistics</div>
        <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab content — fills remaining height; Lead List / Created Leads manage their own internal scroll */}
      <div className="flex-1 overflow-hidden min-h-0 p-3 flex flex-col">

        {users.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select users from the left panel to load their lead data.
          </div>
        ) : (
          <>
            {activeTab === "Lead List" && (
              <div className="flex flex-col flex-1 min-h-0">
                <LeadListWithFilters users={users} />
              </div>
            )}

            {activeTab === "Individual Statistics" && (
              <div className="overflow-auto flex-1"><UserStatsCard users={users} /></div>
            )}

            {activeTab === "Team Overview" && (
              <div className="overflow-auto flex-1"><UserMetricChart users={users} /></div>
            )}

            {activeTab === "Stats Table" && (
              <div className="overflow-auto flex-1"><LeadStatsTable leads={users} /></div>
            )}

            {activeTab === "Reason Stats" && (
              <div className="overflow-auto flex-1"><ReasonStatsCard data={users} /></div>
            )}

            {activeTab === "Created Leads" && (
              <div className="flex flex-col flex-1 min-h-0">
                <CreatedLeadsListWithFilters users={users} />
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
