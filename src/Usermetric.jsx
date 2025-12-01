import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Button } from "./components/ui/button"; // adjust path if needed

const UserMetricChart = ({ users }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState([
    "openCount",
    "confirmedCount",
    "lostCount",
    "postponedCount"
  ]); // default: all selected

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleMetricSelection = (metric) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  // Compute filtered users for chart
  const filteredUsers = useMemo(() => {
    return selectedUsers.length === 0
      ? users
      : users.filter(u => selectedUsers.includes(u.key));
  }, [users, selectedUsers]);

  // Metric colors
  const metricColor = {
    openCount: "#eed779ff",
    confirmedCount: "#5ce6b8ff",
    lostCount: "#eb7b7bff",
    postponedCount: "#e69358ff",
  };

  return (
    <div className="w-full">

      {/* USER SELECTION BUTTONS */}
      <div className="flex flex-wrap gap-3 mb-4">
        {users.map(u => (
          <Button
            key={u.key}
            variant={selectedUsers.includes(u.key) ? "default" : "outline"}
            onClick={() => toggleUserSelection(u.key)}
          >
            {u.firstName}
          </Button>
        ))}
      </div>

      {/* METRIC SELECTION BUTTONS */}
      <div className="flex flex-wrap gap-3 mb-4">
        {["openCount", "confirmedCount", "lostCount", "postponedCount"].map(metric => (
          <Button
            key={metric}
            variant={selectedMetrics.includes(metric) ? "default" : "outline"}
            onClick={() => toggleMetricSelection(metric)}
          >
            {metric.replace("Count", "")}
          </Button>
        ))}
      </div>

      {/* BAR CHART */}
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={filteredUsers}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <XAxis
              dataKey="firstName"
              tick={{ fill: "#4b5563", fontWeight: 600 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />

            {selectedMetrics.map(metric => (
              <Bar
                key={metric}
                dataKey={metric}
                fill={metricColor[metric]}
              />
            ))}

          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default UserMetricChart;
