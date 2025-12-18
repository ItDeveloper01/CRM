import React, { useState, useMemo } from "react";
import CONSTANTS from "./Constants";
import { COLORS } from "./Constants.js"; // <-- import your color constants
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Button } from "./components/ui/button";
import { lightBlue } from "@mui/material/colors";
import { Loader2 } from "lucide-react";

// ------------------------------------
// UNIFIED COLOR PALETTE
// ------------------------------------
// const THEME_CLR = {
//   border: "#d3dce6",
//   textPrimary: "#1a5fae",
//   textHover: "#0d4b91",
//   hoverBg: "#e7f3ff",
//   selectedBg: "#329ce7ff",
//   metric: {
//     openCount: "#fbbf24",
//     confirmedCount: "#3aed70ff",
//     lostCount: "#eb7b7b",
//     postponedCount: "#e69358",
//   }
// };

// const THEME_CLR = {
//   border: COLORS.grayborder,
//   textPrimary: COLORS.bluetext,
//   textHover: COLORS.primarylightblue,
//   hoverBg: COLORS.bluebg,
//   selectedBg: COLORS.primarylightblue,
//   metric: {
//     openCount: COLORS.yellowbg,
//     confirmedCount: COLORS.greenBg,
//     lostCount: COLORS.redbg,
//     postponedCount: COLORS.purplebg,
//   }
// };

const THEME_CLR = {
  border: COLORS.grayborder,           // Button & panel borders
  textPrimary: COLORS.bluetext,       // Default button text
  // textHover: COLORS.primarylightblue, // Button hover text
  hoverBg: COLORS.bluebg,             // Button hover background
  selectedBg: "#DBEAFE", // Selected button background

  metric: {
    createdCount: COLORS.chartCreated,
    openCount: COLORS.chartopen,
    confirmedCount: COLORS.chartconfirmed,
    lostCount: COLORS.chartlost,
    postponedCount: COLORS.chartpostponed,


    bg: {
      createdCount: COLORS.bluebg,
      openCount: COLORS.yellowbg,
      confirmedCount: COLORS.greenbg,
      lostCount: COLORS.redbg,
      postponedCount: COLORS.purplebg,

    },
    text: {
      createdCount: COLORS.createdtext,
      openCount: COLORS.opentext,
      confirmedCount: COLORS.confirmedtext,
      lostCount: COLORS.losttext,
      postponedCount: COLORS.postponedtext,
    },
    statusborder: {
      createdCount: COLORS.blueborder,
      openCount: COLORS.yellowborder,
      confirmedCount: COLORS.greenborder,
      lostCount: COLORS.redborder,
      postponedCount: COLORS.purpleborder,

    }
  }

};

// Friendly labels
const METRIC_LABELS = {
  createdCount: "Created",
  openCount: "Open",
  confirmedCount: "Confirmed",
  lostCount: "Lost",
  postponedCount: "Postponed",

};

const UserMetricChart = ({ users }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState(Object.keys(METRIC_LABELS));

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleMetricSelection = (metric) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  const allSelected = selectedUsers.length === users.length;
  const [viewMode, setViewMode] = useState("individual"); // "cumulative" or "individual"
  const [loading, setLoading] = useState(false);
  // Only show selected users in chart
  const filteredUsers = useMemo(() => {
    return users.filter(u => selectedUsers.includes(u.key));
  }, [users, selectedUsers]);

  // show total of leads of selected users in chart
  const cumulativeUsers = useMemo(() => {
  if (!filteredUsers?.length) return [];

  const total = {};

  selectedMetrics.forEach((m) => (total[m] = 0));

  filteredUsers.forEach((u) => {
    selectedMetrics.forEach((m) => {
      total[m] += Number(u[m] || 0);
    });
  });

  return [
    {
      firstName: "Total",
      ...total,
    },
  ];
}, [filteredUsers, selectedMetrics]);


  // Scrollable height for user panel if more than 22 users
  const userPanelHeight = users.length > 22 ? 300 : "auto";

  return (
    <div className="w-full p-4">

      {/* USERS SECTION */}
      <div className="mb-4 p-3 border rounded-2xl" style={{ borderColor: THEME_CLR.border }}>
        <div className="font-semibold mb-2 text-gray-700">Users</div>

        <div
          className="flex flex-wrap gap-2 overflow-y-auto"
          style={{ maxHeight: userPanelHeight }}
        >
          {/* ALL BUTTON */}
          <Button
            variant="outline"
            onClick={() =>
              allSelected
                ? setSelectedUsers([]) // Deselect all → empty chart
                : setSelectedUsers(users.map((u) => u.key)) // Select all
            }
            className={`
              px-4 py-1.5 text-sm rounded-full border transition-all
              ${allSelected
                ? "text-black"
                : `text-[${THEME_CLR.textPrimary}] hover:bg-[${THEME_CLR.hoverBg}] hover:text-[${THEME_CLR.textHover}]`
              }
            `}
            style={{
              borderColor: THEME_CLR.border,
              backgroundColor: allSelected ? THEME_CLR.selectedBg : "white",
            }}
          >
            All
          </Button>

          {/* USER BUTTONS */}
          {users.map((u) => {
            const isSel = selectedUsers.includes(u.key);
            return (
              <Button
                key={u.key}
                variant="outline"
                onClick={() => toggleUserSelection(u.key)}
                className={`
                  px-4 py-1.5 text-sm rounded-full border transition-all
                  ${isSel
                    ? "text-black"
                    : `text-[${THEME_CLR.textPrimary}] hover:bg-[${THEME_CLR.hoverBg}] hover:text-[${THEME_CLR.textHover}]`
                  }
                `}
                style={{
                  borderColor: THEME_CLR.border,
                  backgroundColor: isSel ? THEME_CLR.selectedBg : "white",
                }}
              >
                {u.firstName}
              </Button>
            );
          })}
        </div>
      </div>

      {/* CHART SECTION */}
      
      <div
        className="border rounded-2xl p-4"
        style={{ width: "100%", height: 420, borderColor: THEME_CLR.border }}
      >
        <div className="flex justify-end">
        <select
          className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
        >
          <option value="individual">Individual</option>
          <option value="cumulative">Cumulative</option>
        </select>
        </div>

        <div className="h-[calc(100%-2rem)]">
                    {loading ? (
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                      </div>
                    ) : viewMode === "individual" ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredUsers}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <XAxis dataKey="firstName" tick={{ fill: "#4b5563", fontWeight: 600, fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />

            {selectedMetrics.map((metric) => (
              <Bar
                key={metric}
                dataKey={metric}
                fill={THEME_CLR.metric[metric]}
                name={METRIC_LABELS[metric]}
                radius={[0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
        ) : (

            <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={cumulativeUsers}
      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
    >
      <XAxis
        dataKey="firstName"
        tick={{ fill: "#4b5563", fontWeight: 600, fontSize: 12 }}
      />
      <YAxis />
      <Tooltip />
      <Legend />

      {selectedMetrics.map((metric) => (
        <Bar
          key={metric}
          dataKey={metric}
          fill={THEME_CLR.metric[metric]}
          name={METRIC_LABELS[metric]}
          radius={[0, 0, 0, 0]}
        />
      ))}
    </BarChart>
  </ResponsiveContainer>
        )}
        </div>
      </div>

      {/* METRIC BUTTONS AT BOTTOM */}
      <div className="mt-4 p-3 border rounded-2xl" style={{ borderColor: THEME_CLR.border }}>
        <div className="font-semibold mb-2 text-gray-700">Metrics</div>

        <div className="flex flex-wrap gap-2">
          {Object.keys(METRIC_LABELS).map((metric) => {
            const isSel = selectedMetrics.includes(metric);
            return (
              <Button
                key={metric}
                variant="outline"
                onClick={() => toggleMetricSelection(metric)}
                className={`
                  px-4 py-1.5 text-sm rounded-full border transition-all
                  ${isSel
                    ? "text-black"
                    : `text-[${THEME_CLR.textPrimary}] hover:bg-[${THEME_CLR.hoverBg}] hover:text-[${THEME_CLR.textHover}]`
                  }
                `}
                style={{
                  // borderColor: THEME_CLR.border,
                  // backgroundColor: isSel ? THEME_CLR.selectedBg : "white",
                  borderColor: isSel ? THEME_CLR.metric.statusborder[metric] : THEME_CLR.border,
                  backgroundColor: isSel ? THEME_CLR.metric.bg[metric] : "white",
                  color: isSel ? THEME_CLR.metric.text[metric] : THEME_CLR.textPrimary,
                }}
              >
                {METRIC_LABELS[metric]}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserMetricChart;
