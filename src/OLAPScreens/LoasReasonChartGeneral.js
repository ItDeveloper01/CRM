// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from "recharts";

// const LostLeadsByReasonChart = () => {
//   const [data, setData] = useState([]);
//   const [moduleType, setModuleType] = useState("ALL");
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState({
//       fromDate: "2025-01-01",
//       toDate: "2025-12-31",
//       module: null,
//       statusKey: 1,
//       BranchKey: 1
//     });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//     const [m] = await Promise.all([
//    getReasonTrentGeneral(filter)
//     ]);
//       setData(m.data);
//     } catch (error) {
//       console.error("Error fetching lost leads data", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredData =
//     moduleType === "ALL"
//       ? data
//       : data.filter(d => d.moduleType === moduleType);

//   const moduleTypes = ["ALL", ...new Set(data.map(d => d.moduleType))];

//   if (loading) return <p>Loading chart...</p>;

//   return (
//     <div style={{ width: "100%", height: 400 }}>
//       <h3>Lost Leads by Reason</h3>

//       {/* Module Filter */}
//       <select
//         value={moduleType}
//         onChange={e => setModuleType(e.target.value)}
//         style={{ marginBottom: 12 }}
//       >
//         {moduleTypes.map(m => (
//           <option key={m} value={m}>
//             {m}
//           </option>
//         ))}
//       </select>

//       <ResponsiveContainer>
//         <BarChart data={filteredData}>
//           <XAxis dataKey="reasonName" />
//           <YAxis allowDecimals={false} />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="lostLeadCount" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default LostLeadsByReasonChart;
