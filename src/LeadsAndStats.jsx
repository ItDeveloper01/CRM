import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import LeadListWithFilters from "./LeadsWithFilters";
import { data } from "autoprefixer";
import UserStatsCard from "./UserStatsCard";
import UserMetricChart from "./Usermetric";
import LeadStatsTable from "./LeadsStatsTable";


// Dummy CustomComponents to avoid import errors
const Card = ({ children, className }) => <div className={`border rounded-xl shadow p-3 bg-white mb-3 ${className || ''}`}>{children}</div>;
const CardHeader = ({ children, className }) => <div className={`text-lg font-semibold mb-2 text-indigo-700 ${className || ''}`}>{children}</div>;
const CardContent = ({ children }) => <div className="mt-2">{children}</div>;
const Button = ({ children, onClick, active }) => (
  <button 
    onClick={onClick} 
    className={`px-3 py-1 rounded-full font-medium transition 
      ${active ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-indigo-500 hover:text-white'}`}>
    {children}
  </button>
);
const Tabs = ({ tabs = [], active, onChange }) => (
  <div className="flex gap-2 border-b pb-2 mb-4">
    {tabs.map(t => (
      <button 
        key={t} 
        className={`px-3 py-1 rounded-t font-semibold ${active === t ? 'bg-indigo-500 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`} 
        onClick={() => onChange(t)}>
        {t}
      </button>
    ))}
  </div>
);

// Dummy data dictionary
const sampleData = {
  gpatil: { Userdata: { firstName: "Super Admin", openCount: 2, confirmedCount: 0, lostCount: 0, postponedCount: 0, openLeads: [
    { leadID: 1, fName: "Dhawnit", lName: "Jadhav", categoryName: "VISA", customerType: 2, mobileNo: "9529860694", updatedAt: "2025-11-25T17:16:27.003", status: null },
    { leadID: 8, fName: "Devyani", lName: "Joshi", categoryName: "VISA", customerType: 1, mobileNo: "0000000000", updatedAt: "2025-11-25T10:12:27.003", status: null }
  ]}},
  jaya: { Userdata: { firstName: "Jaya", openCount: 1, confirmedCount: 2, lostCount: 0, postponedCount: 1, openLeads: [] } },
  joyo: { Userdata: { firstName: "Joyo", openCount: 2, confirmedCount: 1, lostCount: 1, postponedCount: 0, openLeads: [] } },
  kra: { Userdata: { firstName: "Kra", openCount: 0, confirmedCount: 1, lostCount: 0, postponedCount: 0, openLeads: [] } },
  shiv: { Userdata: { firstName: "Shiv", openCount: 1, confirmedCount: 0, lostCount: 2, postponedCount: 1, openLeads: [] } }
};

export default function LeadsAndStats(dataProp) {
 // const data = dataProp || sampleData; // Use passed data or sample data
  const [selectedMetric, setSelectedMetric] = useState("openCount");
  const [activeTab, setActiveTab] = useState("Lead List");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [data ,setData]=useState(dataProp.data || []);
  const  [users,setUSers] = useState([]);//Object.entries(data).map(([key, value]) => ({ key, ...value.Userdata }));
 
   // -------- FILTER STATE --------
  const [filters, setFilters] = React.useState({
    status: "",
    customerType: "",
    categoryName: "",
    assignedTo: "",
    updatedAt: ""
  });

  // React.useEffect(() => {
  //   debugger;
  //   console.log("Data prop changed:", dataProp.data);
  //   setData(dataProp.data || sampleData);
  //  // setUsersDict(dataProp || sampleData);
  //   setUSers(Object.entries(data).map(([key, value]) => ({ key, ...value.Userdata })));
  //   console.log("Updated users:", users);
  // }, [dataProp]);

   
React.useEffect(() => {
  const newData = dataProp.data || sampleData; // always object
  setData(newData);

  if (newData && typeof newData === 'object') {
    const usersArray = Object.entries(newData).map(([key, value]) => ({
      key,
      ...value.Userdata
    }));
    setUSers(usersArray);
    console.log("Data is an object, converted to array of users:", usersArray);
  } else if (Array.isArray(newData)) {
    // fallback if dataProp.data is array of users
    setUSers(newData);

    console.log("Data is already an array of users:", newData);
  }
}, [dataProp]);

  const tabs = ["Lead List", "Individual Statistics", "Team Overview","Stats Table"];

  React.useEffect(() => {
    console.log("Users data:", users);
  }, [users]);

  const toggleUserSelection = (key) => {
    setSelectedUsers(prev => prev.includes(key) ? prev.filter(u => u !== key) : [...prev, key]);
  };

  const filteredUsers = selectedUsers.length > 0 ? users.filter(u => selectedUsers.includes(u.key)) : users;

  return (
    <div className="p-4">
      <Card>
        <CardHeader>Leads & Statistics</CardHeader>
        <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

        {/* -------------------- LEAD LIST -------------------- */}
         {activeTab === "Lead List" && (
          <CardContent>
            <LeadListWithFilters users={users} />
          </CardContent>
        )
        }

        {/* -------------------- INDIVIDUAL STATISTICS -------------------- */}
        {activeTab === "Individual Statistics" && (
          <CardContent>
            <UserStatsCard users={users} />
          </CardContent>
        )}

        {/* -------------------- TEAM OVERVIEW -------------------- */}
        {activeTab === "Team Overview" && (
          <CardContent>
            <UserMetricChart users={users} />
          </CardContent>
        )}

          {/* -------------------- TEAM OVERVIEW -------------------- */}
        {activeTab === "Stats Table" && (
          <CardContent>
            <LeadStatsTable leads={users} />
          </CardContent>
        )}

      </Card>
    </div>
  );
}
