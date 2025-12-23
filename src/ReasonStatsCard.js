// import React, { useMemo, useState, useEffect, useRef } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Legend
// } from "recharts";

// // 🎨 GIRIKAND UI COLORS
// const UI_COLORS = {
//   buttonSelectedBg: "#90caf9",
//   buttonUnselectedBg: "#ffffff",
//   buttonSelectedText: "#000000",
//   buttonUnselectedText: "#000000",
//   buttonSelectedBorder: "#90caf9",
//   buttonUnselectedBorder: "#d1d5db",
//   lostBar: "#e53935",
//   postponedBar: "#8e24aa"
// };

// // SAMPLE DATA
// const sampleDashboardData = [
//   {
//     key: "gpatil",
//     firstName: "Super Admin",
//     lostLeadsReasonsCount: [
//       { reason: "High Price", count: 1 },
//       { reason: "Competitor", count: 0 },
//       { reason: "No Response", count: 0 },
//       { reason: "Budget Issues", count: 0 },
//       { reason: "Not Specified", count: 0 }
//     ],
//     postponedLeadsReasonsCount: [
//       { reason: "Next date", count: 1 },
//       { reason: "Visa/Passport Issue", count: 0 },
//       { reason: "Only Enquiry", count: 0 },
//       { reason: "Not Specified", count: 0 }
//     ]
//   }
// ];

// /* ================= WIDTH HOOK ================= */

// const useChartWidth = () => {
//   const ref = useRef(null);
//   const [width, setWidth] = useState(0);

//   useEffect(() => {
//     if (!ref.current) return;

//     const observer = new ResizeObserver(entries => {
//       setWidth(entries[0].contentRect.width);
//     });

//     observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, []);

//   return [ref, width];
// };

// /* ================= COMPONENT ================= */

// const ReasonStatsCard = ({ data }) => {
//   const dashboardData =
//     Array.isArray(data) && data.length > 0 ? data : sampleDashboardData;

//   const [selectedUsers, setSelectedUsers] = useState([]);

//   useEffect(() => {
//     setSelectedUsers(dashboardData.map(u => u.key));
//   }, [dashboardData]);

//   const users = useMemo(
//     () => dashboardData.map(u => ({ key: u.key, name: u.firstName })),
//     [dashboardData]
//   );

//   const toggleUser = (key) => {
//     setSelectedUsers(prev =>
//       prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
//     );
//   };

//   const toggleAll = () => {
//     setSelectedUsers(prev =>
//       prev.length === users.length ? [] : users.map(u => u.key)
//     );
//   };

//   const isAllSelected =
//     selectedUsers.length === users.length && users.length > 0;

//   const filteredData = dashboardData.filter(d =>
//     selectedUsers.includes(d.key)
//   );

//   const aggregateReasons = (field) => {
//     const map = {};
//     filteredData.forEach(user => {
//       user[field]?.forEach(item => {
//         map[item.reason] = (map[item.reason] || 0) + item.count;
//       });
//     });
//     return Object.keys(map).map(reason => ({
//       reason,
//       count: map[reason]
//     }));
//   };

//   const lostReasons = useMemo(
//     () => aggregateReasons("lostLeadsReasonsCount"),
//     [filteredData]
//   );

//   const postponedReasons = useMemo(
//     () => aggregateReasons("postponedLeadsReasonsCount"),
//     [filteredData]
//   );

//   /* ========== PER-CHART WIDTHS ========== */

//   const [lostChartRef, lostChartWidth] = useChartWidth();
//   const [postponedChartRef, postponedChartWidth] = useChartWidth();

//   /* ========== SMART X-AXIS LOGIC ========== */

//   const getXAxisAngle = (count, width) => {
//     if (!width || count === 0) return 0;
//     const space = width / count;

//     if (space > 150) return 0;
//     if (space > 130) return -10;
//     if (space > 110) return -15;
//     if (space > 80) return -30;
//     return -45;
//   };

//   const getXAxisHeight = (count, width) => {
//     const angle = getXAxisAngle(count, width);
//     if (angle === 0) return 55;
//     if (angle === -10) return 60;
//     if (angle === -15) return 65;
//     if (angle === -30) return 80;
//     return 95;
//   };

//   const getXAxisFontSize = (count, width) => {
//     const space = width / count;
//     if (space > 120) return 14;
//     if (space > 90) return 13;
//     if (space > 70) return 12;
//     return 10;
//   };

//   /* ===================================== */

//   return (
//     <div className="p-4">
//       {/* USER FILTER BUTTONS */}
//       <div className="mb-4 flex flex-wrap gap-2">
//         <button
//           onClick={toggleAll}
//           className="px-5 py-2 rounded-full border font-semibold"
//           style={{
//             backgroundColor: isAllSelected
//               ? UI_COLORS.buttonSelectedBg
//               : UI_COLORS.buttonUnselectedBg,
//             borderColor: isAllSelected
//               ? UI_COLORS.buttonSelectedBorder
//               : UI_COLORS.buttonUnselectedBorder,
//             color: UI_COLORS.buttonSelectedText
//           }}
//         >
//           All Users
//         </button>

//         {users.map(user => (
//           <button
//             key={user.key}
//             onClick={() => toggleUser(user.key)}
//             className="px-5 py-2 rounded-full border"
//             style={{
//               backgroundColor: selectedUsers.includes(user.key)
//                 ? UI_COLORS.buttonSelectedBg
//                 : UI_COLORS.buttonUnselectedBg,
//               borderColor: selectedUsers.includes(user.key)
//                 ? UI_COLORS.buttonSelectedBorder
//                 : UI_COLORS.buttonUnselectedBorder,
//               color: UI_COLORS.buttonSelectedText
//             }}
//           >
//             {user.name}
//           </button>
//         ))}
//       </div>

//       {/* CHARTS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* LOST */}
//         <div ref={lostChartRef}>
//           <h3 className="font-semibold mb-2 text-red-600">
//             Lost Leads – Reasons
//           </h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={lostReasons}>
//               <XAxis
//                 dataKey="reason"
//                 interval={0}
//                 angle={getXAxisAngle(lostReasons.length, lostChartWidth)}
//                 textAnchor={
//                   getXAxisAngle(lostReasons.length, lostChartWidth) === 0
//                     ? "middle"
//                     : "end"
//                 }
//                 height={getXAxisHeight(
//                   lostReasons.length,
//                   lostChartWidth
//                 )}
//                 tick={{
//                   fontSize: getXAxisFontSize(
//                     lostReasons.length,
//                     lostChartWidth
//                   ),
//                   fill: "#374151",
//                   fontWeight: 500
//                 }}
//               />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="count" fill={UI_COLORS.lostBar} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* POSTPONED */}
//         <div ref={postponedChartRef}>
//           <h3 className="font-semibold mb-2 text-purple-600">
//             Postponed Leads – Reasons
//           </h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={postponedReasons}>
//               <XAxis
//                 dataKey="reason"
//                 interval={0}
//                 angle={getXAxisAngle(
//                   postponedReasons.length,
//                   postponedChartWidth
//                 )}
//                 textAnchor={
//                   getXAxisAngle(
//                     postponedReasons.length,
//                     postponedChartWidth
//                   ) === 0
//                     ? "middle"
//                     : "end"
//                 }
//                 height={getXAxisHeight(
//                   postponedReasons.length,
//                   postponedChartWidth
//                 )}
//                 tick={{
//                   fontSize: getXAxisFontSize(
//                     postponedReasons.length,
//                     postponedChartWidth
//                   ),
//                   fill: "#374151",
//                   fontWeight: 500
//                 }}
//               />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar
//                 dataKey="count"
//                 fill={UI_COLORS.postponedBar}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReasonStatsCard;

import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

/* 🎨 COLORS */
const UI_COLORS = {
  buttonSelectedBg: "#90caf9",
  buttonUnselectedBg: "#ffffff",
  buttonSelectedText: "#000000",
  buttonUnselectedText: "#000000",
  buttonSelectedBorder: "#90caf9",
  buttonUnselectedBorder: "#d1d5db",
  lostBar: "#e53935",
  postponedBar: "#8e24aa"
};

/* SAMPLE DATA (fallback) */
const sampleDashboardData = [
  {
    key: "gpatil",
    firstName: "Super Admin",
    lostLeadsReasonsCount: [
      { reason: "High Price", count: 1 },
      { reason: "Competitor", count: 0 },
      { reason: "No Response", count: 0 },
      { reason: "Budget Issues", count: 0 },
      { reason: "Not Specified", count: 0 }
    ],
    postponedLeadsReasonsCount: [
      { reason: "Next date", count: 1 },
      { reason: "Visa/Passport Issue", count: 0 },
      { reason: "Only Enquiry", count: 0 },
      { reason: "Not Specified", count: 0 }
    ]
  },
  {
    key: "qwerty",
    firstName: "Jackie Chan",
    lostLeadsReasonsCount: [
      { reason: "High Price", count: 0 },
      { reason: "Competitor", count: 0 },
      { reason: "No Response", count: 0 },
      { reason: "Budget Issues", count: 0 },
      { reason: "Not Specified", count: 0 }
    ],
    postponedLeadsReasonsCount: [
      { reason: "Next date", count: 0 },
      { reason: "Visa/Passport Issue", count: 0 },
      { reason: "Only Enquiry", count: 0 },
      { reason: "Not Specified", count: 0 }
    ]
  }
];

/* ================= WRAPPED TICK ================= */
const WrappedTick = ({ x, y, payload }) => {
  const words = payload.value.split(" ");
  return (
    <g transform={`translate(${x},${y + 12})`}>
      <text textAnchor="middle" fontSize={12} fill="#374151" fontWeight={500}>
        {words.map((word, idx) => (
          <tspan key={idx} x={0} dy={idx === 0 ? 0 : 14}>
            {word}
          </tspan>
        ))}
      </text>
    </g>
  );
};

/* ================= AXIS CONFIG ================= */
const getXAxisConfig = (width, count) => {
  if (!width || !count) return { angle: 0, height: 55, wrap: false };
  const space = width / count;
  if (space > 140) return { angle: 0, height: 55, wrap: false };
  if (space > 90) return { angle: 0, height: 80, wrap: true };
  return { angle: -35, height: 95, wrap: false };
};

/* ================= SINGLE SMART CHART ================= */
const SmartBarChart = ({ title, data, barColor }) => {
  const chartRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!chartRef.current) return;
    const observer = new ResizeObserver(entries =>
      setWidth(entries[0].contentRect.width)
    );
    observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  const xAxis = getXAxisConfig(width, data.length);

  return (
    <div ref={chartRef}>
      <h3 className="font-semibold mb-2" style={{ color: barColor }}>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <XAxis
            dataKey="reason"
            interval={0}
            angle={xAxis.angle}
            height={xAxis.height}
            textAnchor={xAxis.angle === 0 ? "middle" : "end"}
            tick={xAxis.wrap ? <WrappedTick /> : { fontSize: 12, fill: "#374151", fontWeight: 500 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill={barColor} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
const ReasonStatsCard = ({ data }) => {
  const dashboardData = Array.isArray(data) && data.length > 0 ? data : sampleDashboardData;

  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    setSelectedUsers(dashboardData.map(u => u.key));
  }, [dashboardData]);

  const toggleUser = (key) => {
    setSelectedUsers(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const toggleAll = () => {
    setSelectedUsers(prev =>
      prev.length === dashboardData.length ? [] : dashboardData.map(u => u.key)
    );
  };

  const isAllSelected = selectedUsers.length === dashboardData.length && dashboardData.length > 0;

  const filteredData = useMemo(
    () => dashboardData.filter(d => selectedUsers.includes(d.key)),
    [dashboardData, selectedUsers]
  );

  const aggregateReasons = (field) => {
    const map = {};
    filteredData.forEach(user => {
      user[field]?.forEach(item => {
        map[item.reason] = (map[item.reason] || 0) + item.count;
      });
    });
    return Object.keys(map).map(reason => ({ reason, count: map[reason] }));
  };

  const lostReasons = useMemo(() => aggregateReasons("lostLeadsReasonsCount"), [filteredData]);
  const postponedReasons = useMemo(() => aggregateReasons("postponedLeadsReasonsCount"), [filteredData]);

  /* ================= RENDER ================= */
  return (
    <div className="p-4">
      {/* USER FILTER BUTTONS */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={toggleAll}
          className="px-5 py-2 rounded-full border font-semibold"
          style={{
            backgroundColor: isAllSelected ? UI_COLORS.buttonSelectedBg : UI_COLORS.buttonUnselectedBg,
            borderColor: isAllSelected ? UI_COLORS.buttonSelectedBorder : UI_COLORS.buttonUnselectedBorder,
            color: UI_COLORS.buttonSelectedText
          }}
        >
          All Users
        </button>
        {dashboardData.map(user => (
          <button
            key={user.key}
            onClick={() => toggleUser(user.key)}
            className="px-5 py-2 rounded-full border"
            style={{
              backgroundColor: selectedUsers.includes(user.key)
                ? UI_COLORS.buttonSelectedBg
                : UI_COLORS.buttonUnselectedBg,
              borderColor: selectedUsers.includes(user.key)
                ? UI_COLORS.buttonSelectedBorder
                : UI_COLORS.buttonUnselectedBorder,
              color: UI_COLORS.buttonSelectedText
            }}
          >
            {user.firstName}
          </button>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SmartBarChart
          title="Lost Leads – Reasons"
          data={lostReasons}
          barColor={UI_COLORS.lostBar}
        />
        <SmartBarChart
          title="Postponed Leads – Reasons"
          data={postponedReasons}
          barColor={UI_COLORS.postponedBar}
        />
      </div>
    </div>
  );
};

export default ReasonStatsCard;




