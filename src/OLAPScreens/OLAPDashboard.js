// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { Database } from "lucide-react";
// import { motion } from "framer-motion";
// import config from "./config";

// // Pastel color palette (can be moved to constants)
// const pastelColors = {
//   blue: "bg-blue-100",
//   green: "bg-green-100",
//   pink: "bg-pink-100",
//   purple: "bg-purple-100",
// };

// export default function OlapTestDashboard() {
//   const [kpiData, setKpiData] = useState([]);
//   const [salesByRegion, setSalesByRegion] = useState([]);

//   // Axios call to API Gateway (health / text response only)
//   useEffect(() => {
//     debugger;
//     axios
//       .get(config.olapUrl+"/OLAPDashboard/TestGateway") // gateway returns plain text
//       .then((res) => {
//         console.log("Gateway response:", res.data); // just verify gateway is up
//       })
//       .catch((err) => {
//         console.warn("Gateway not reachable", err);
//       });

//     // Dummy OLAP data for UI testing
//     setKpiData([
//       { label: "Total Sales", value: "₹12.4M" },
//       { label: "Total Orders", value: "18,240" },
//       { label: "Avg Order Value", value: "₹680" },
//       { label: "Active Regions", value: "12" },
//     ]);

//     setSalesByRegion([
//       { region: "North", sales: 3200 },
//       { region: "South", sales: 2800 },
//       { region: "West", sales: 4100 },
//       { region: "East", sales: 2300 },
//     ]);
//   }, []);

//   return (
//     <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex items-center gap-2"
//       >
//         <Database className="w-6 h-6 text-blue-500" />
//         <h1 className="text-2xl font-semibold text-slate-700">
//           OLAP Dashboard (Test Component)
//         </h1>
//       </motion.div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {kpiData.map((kpi, index) => {
//           const colorClasses = Object.values(pastelColors);
//           return (
//             <Card
//               key={kpi.label}
//               className={`rounded-2xl shadow-sm ${colorClasses[index % colorClasses.length]}`}
//             >
//               <CardContent className="p-4">
//                 <p className="text-sm text-slate-600">{kpi.label}</p>
//                 <p className="text-xl font-bold mt-1 text-slate-800">
//                   {kpi.value}
//                 </p>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* OLAP Aggregation Chart */}
//       <Card className="rounded-2xl shadow-sm bg-white">
//         <CardContent className="p-4">
//           <h2 className="text-lg font-medium mb-4 text-slate-700">
//             Sales by Region (Aggregated)
//           </h2>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={salesByRegion}>
//                 <XAxis dataKey="region" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="sales" fill="#93c5fd" radius={[8, 8, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
// import React, { useEffect, useState } from "react";
// import {
//   BarChart, Bar, PieChart, Pie, Cell,
//   LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
// } from "recharts";

// import {getLeadsByBranch, getLeadsByModule, getLeadsByStatus, getMonthlyTrend} from "../api/olapApi";

// const COLORS = ["#7DD3FC", "#A7F3D0", "#FDE68A", "#FCA5A5"];

// const OlapTestDashboard = () => {
//   const [filter, setFilter] = useState({
//     fromDate: "2025-01-01",
//     toDate: "2025-12-31",
//     module: null,
//     statusKey: 1,
//     BranchKey: 1
//   });

//   const [moduleData, setModuleData] = useState([]);
//   const [statusData, setStatusData] = useState([]);
//   const [branchData, setBranchData] = useState([]);
//   const [trendData, setTrendData] = useState([]);

//   const loadDashboard = async () => {
//     const [m, s, b, t] = await Promise.all([
//       getLeadsByModule(filter),
//       getLeadsByStatus(filter),
//       getLeadsByBranch(filter),
//       getMonthlyTrend(filter)
//     ]);

//     setModuleData(m.data);
//     setStatusData(s.data);
//     setBranchData(b.data);
//     setTrendData(t.data);
//   };

//   useEffect(() => {
//     loadDashboard();
//   }, []);

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>📊 OLAP Business Insights</h2>

//       {/* ----------- Charts Grid ----------- */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

//         {/* Leads by Module */}
//         <ChartCard title="Leads by Module">
//           <ResponsiveContainer height={300}>
//             <BarChart data={moduleData}>
//               <XAxis dataKey="label" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="leadCount" fill="#7DD3FC" />
//             </BarChart>
//           </ResponsiveContainer>
//         </ChartCard>

//         {/* Leads by Status */}
//         <ChartCard title="Leads by Status">
//           <ResponsiveContainer height={300}>
//             <PieChart>
//               <Pie
//                 data={statusData}
//                 dataKey="leadCount"
//                 nameKey="label"
//                 outerRadius={100}
//               >
//                 {statusData.map((_, i) => (
//                   <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </ChartCard>

//         {/* Leads by Branch */}
//         <ChartCard title="Leads by Branch">
//           <ResponsiveContainer height={300}>
//             <BarChart data={branchData} layout="vertical">
//               <XAxis type="number" />
//               <YAxis type="category" dataKey="label" />
//               <Tooltip />
//               <Bar dataKey="leadCount" fill="#A7F3D0" />
//             </BarChart>
//           </ResponsiveContainer>
//         </ChartCard>

//         {/* Monthly Trend */}
//         <ChartCard title="Monthly Lead Trend">
//           <ResponsiveContainer height={300}>
//             <LineChart data={trendData}>
//               <XAxis dataKey="monthName" />
//               <YAxis />
//               <Tooltip />
//               <Line dataKey="leadCount" stroke="#6366F1" />
//             </LineChart>
//           </ResponsiveContainer>
//         </ChartCard>

//       </div>
//     </div>
//   );
// };

// const ChartCard = ({ title, children }) => (
//   <div style={{
//     background: "#fff",
//     borderRadius: 12,
//     padding: 16,
//     boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
//   }}>
//     <h4>{title}</h4>
//     {children}
//   </div>
// );

// export default OlapTestDashboard;

import React, { useEffect, useState } from "react";
import OLAPDashboardTabs from "./OLAPDashboardTabs";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
 
import {
  getLeadsByBranch,
  getLeadsByModule,
  getLeadsByStatus,
  getMonthlyTrend,
  getReasonTrendGeneral,
} from "../api/olapApi";
// import OLAPDashboardTabs from "./OLAPDashboardTabs";


const COLORS = ["#7DD3FC", "#A7F3D0", "#FDE68A", "#FCA5A5"];

const OlapTestDashboard = () => {
  const [activeTab, setActiveTab] = useState("OVERVIEW");

  const [filter] = useState({
    fromDate: "2025-01-01",
    toDate: new Date().toISOString().slice(0, 10),
    module: null,
    statusKey: 1,
    BranchKey: 1
  });

  const [moduleData, setModuleData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [lostReasonData, setLostReasonData] = useState([]);

  const loadDashboard = async () => {
    const [m, s, b, t, l] = await Promise.all([
      getLeadsByModule(filter),
      getLeadsByStatus(filter),
      getLeadsByBranch(filter),
      getMonthlyTrend(filter),
      getReasonTrendGeneral(filter)
    ]);

    setModuleData(m.data);
    setStatusData(s.data);
    setBranchData(b.data);
    setTrendData(t.data);
    console.log("Lost Reason Data:", l.data);

    setLostReasonData(l.data);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 OLAP Business Insights</h2>

      {/* ---------------- Tabs ---------------- */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {["OVERVIEW", "MODULE", "STATUS", "BRANCH", "LOST"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              background: activeTab === tab ? "#6366F1" : "#E5E7EB",
              color: activeTab === tab ? "#fff" : "#111"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= OVERVIEW (BASE BOARD) ================= */}
      {activeTab === "OVERVIEW" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          <ChartCard title="Leads by Module">
            <ResponsiveContainer height={300}>
              <BarChart data={moduleData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leadCount" fill="#7DD3FC" />
              </BarChart>
              {/* <OLAPDashboardTabs /> */}
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Leads by Status">
            <ResponsiveContainer height={300}>
              <PieChart>
                <Pie data={statusData} dataKey="leadCount" nameKey="label">
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Lost Leads by Reason">
            <ResponsiveContainer height={300}>
              <BarChart data={lostReasonData}>
                <XAxis dataKey="reasonName" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="lostLeadCount" fill="#FCA5A5" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Monthly Lead Trend">
            <ResponsiveContainer height={300}>
              <LineChart data={trendData}>
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip />
                <Line dataKey="leadCount" stroke="#6366F1" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>
      )}

      {/* ================= MODULE TAB ================= */}
      {activeTab === "MODULE" && (
        <ChartCard title="Module-wise Lead Analysis">
          {/* <ResponsiveContainer height={400}> */}
            {/* <BarChart data={moduleData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="leadCount" fill="#7DD3FC" />
            </BarChart> */}
                 {/* <OLAPDashboardTabs /> */}
          {/* </ResponsiveContainer> */}
            <div className="w-full">
      <OLAPDashboardTabs />
    </div>
        </ChartCard>
      )}

      {/* ================= STATUS TAB ================= */}
      {activeTab === "STATUS" && (
        <ChartCard title="Status-wise Lead Distribution">
          <ResponsiveContainer height={400}>
            <PieChart>
              <Pie data={statusData} dataKey="leadCount" nameKey="label">
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* ================= BRANCH TAB ================= */}
      {activeTab === "BRANCH" && (
        <ChartCard title="Branch-wise Lead Analysis">
          <ResponsiveContainer height={400}>
            <BarChart data={branchData} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="label" />
              <Tooltip />
              <Bar dataKey="leadCount" fill="#A7F3D0" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* ================= LOST TAB ================= */}
      {activeTab === "LOST" && (
        <ChartCard title="Lost Leads – Detailed Analysis">
          <ResponsiveContainer height={400}>
            <BarChart data={lostReasonData}>
              <XAxis dataKey="reasonName" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="lostLeadCount" fill="#FCA5A5" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

    </div>
  );
};

const ChartCard = ({ title, children }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 12,
      padding: 16,
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
    }}
  >
    <h4>{title}</h4>
    {children}
  </div>
);

export default OlapTestDashboard;
