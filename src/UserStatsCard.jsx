import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "./components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { COLORS } from "./Constants";

const STAGE_FIELDS = [
  { key: "createdCount", stage: "Created", color: COLORS.chartCreated },
  { key: "openCount", stage: "Open", color: COLORS.chartopen },
  { key: "confirmedCount", stage: "Confirmed", color: COLORS.chartconfirmed },
  { key: "lostCount", stage: "Lost", color: COLORS.chartlost },
  { key: "postponedCount", stage: "Postponed", color: COLORS.chartpostponed },
];

const buildStageData = (user) =>
  STAGE_FIELDS.map(({ key, stage, color }) => ({
    stage,
    value: user[key] || 0,
    color,
  }));

const buildCumulativeData = (users) =>
  STAGE_FIELDS.map(({ key, stage, color }) => ({
    stage,
    value: users.reduce((sum, u) => sum + (u[key] || 0), 0),
    color,
  }));

// Tooltip showing both the percentage share and the raw count on hover
const PieTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  const total = item.payload.total;
  const pct = total ? ((item.value / total) * 100).toFixed(1) : "0.0";
  return (
    <div className="bg-white shadow-md rounded-md px-3 py-2 text-sm border border-gray-100">
      <p className="font-medium text-gray-700">{item.name}</p>
      <p className="text-gray-500">
        {item.value} ({pct}%)
      </p>
    </div>
  );
};

// On-slice label: percentage, connected to its slice by a leader line
const renderPercentLabel = ({ percent }) =>
  percent > 0 ? `${(percent * 100).toFixed(0)}%` : "";

// Stage / Count / Percentage table, one row per stage, always visible
const StatsTable = ({ data, total }) => (
  <table className="w-full mt-3 text-xs text-gray-600">
    <thead>
      <tr className="text-left text-gray-400 border-b border-gray-100">
        <th className="py-1 font-medium">Stage</th>
        <th className="py-1 font-medium text-right">Count</th>
        <th className="py-1 font-medium text-right">Percent</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item, index) => {
        const pct = total ? ((item.value / total) * 100).toFixed(1) : "0.0";
        return (
          <tr key={index} className="border-b border-gray-50 last:border-0">
            <td className="py-1">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                {item.stage}
              </div>
            </td>
            <td className="py-1 text-right">{item.value}</td>
            <td className="py-1 text-right">{pct}%</td>
          </tr>
        );
      })}
    </tbody>
  </table>
);
// Formats a { from, to } date range (Date objects or date strings) for display
const formatDateRange = (dateRange) => {

  console.log("DateRange :" , dateRange);
  if (!dateRange || (!dateRange.from && !dateRange.to)) return null;
  const fmt = (d) => {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    return isNaN(date) ? String(d) : date.toLocaleDateString();
  };
  return `${fmt(dateRange.from)} - ${fmt(dateRange.to)}`;
};

const PieStatCard = ({ title, data, radius = 100, chartHeight = 260 }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const dataWithTotal = data.map((d) => ({ ...d, total }));

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="text-blue-600">{title}</CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: chartHeight }}>
          <ResponsiveContainer>
            <PieChart margin={{ top: 24, right: 24, bottom: 8, left: 24 }}>
              <Pie
                data={dataWithTotal}
                dataKey="value"
                nameKey="stage"
                cx="50%"
                cy="48%"
                outerRadius={radius}
                label={renderPercentLabel}
                labelLine
              >
                {dataWithTotal.map((item, index) => (
                  <Cell key={index} fill={item.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <StatsTable data={dataWithTotal} total={total} />
      </CardContent>
    </Card>
  );
};

const BarStatCard = ({ title, data }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="text-blue-600">{title}</CardHeader>
    <CardContent>
      <div style={{ width: "100%", height: 160 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
            <XAxis type="category" dataKey="stage" width={100} />
            <YAxis type="number" />
            <Tooltip />
            <Bar dataKey="value">
              {data.map((item, index) => (
                <Cell key={index} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

// --- Demo data so this renders standalone; pass your own `users` prop to override ---
const DEMO_USERS = [
  { id: 1, firstName: "Aarav", createdCount: 40, openCount: 22, confirmedCount: 30, lostCount: 6, postponedCount: 4 },
  { id: 2, firstName: "Priya", createdCount: 28, openCount: 15, confirmedCount: 18, lostCount: 3, postponedCount: 9 },
  { id: 3, firstName: "Rohan", createdCount: 52, openCount: 10, confirmedCount: 40, lostCount: 8, postponedCount: 2 },
];

const UserStatsCard = ({ users = DEMO_USERS , dateRange }) => {
  const [chartType, setChartType] = useState("pie"); // "pie" | "bar"
  const [pieMode, setPieMode] = useState("individual"); // "individual" | "cumulative"
  const formattedRange = formatDateRange(dateRange);
  if (!users || users.length === 0) return null;

  return (
    <div >
      {/* Sticky control strip so it stays visible while the grid below scrolls */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 pb-2  flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer select-none">
          <input
            type="radio"
            name="chartType"
            value="pie"
            checked={chartType === "pie"}
            onChange={() => setChartType("pie")}
            className="accent-blue-600"
          />
          Pie Chart
        </label>

        <label className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer select-none">
          <input
            type="radio"
            name="chartType"
            value="bar"
            checked={chartType === "bar"}
            onChange={() => setChartType("bar")}
            className="accent-blue-600"
          />
          Bar Chart
        </label>

        {/* Kept in the DOM at all times (just dimmed/disabled for Bar) so the
            strip's width never shifts when switching chart types. */}
        <label
          className={`flex items-center gap-1.5 text-sm select-none transition-opacity ${
            chartType === "pie" ? "text-gray-700 opacity-100" : "text-gray-400 opacity-50 pointer-events-none"
          }`}
        >
          View:
          <select
            value={pieMode}
            onChange={(e) => setPieMode(e.target.value)}
            disabled={chartType !== "pie"}
            className="ml-1 text-sm border border-gray-200 rounded-md px-2 py-1 bg-white cursor-pointer disabled:cursor-not-allowed"
          >
            <option value="individual">Individual</option>
            <option value="cumulative">Cumulative</option>
          </select>
        </label>

           {formattedRange && (
          <span className="ml-auto text-sm text-gray-500 whitespace-nowrap">
            Selected dates: <span className="text-gray-700 font-medium">{formattedRange}</span>
          </span>
        )}
      </div>

      {chartType === "bar" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <BarStatCard
              key={user.key || user.id}
              title={user.firstName +" "+ user.lastName || user.key}
              data={buildStageData(user)}
            />
          ))}
        </div>
      )}

      {chartType === "pie" && pieMode === "individual" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <PieStatCard
              key={user.key || user.id}
              title={user.firstName+" "+user.lastName || user.key}
              data={buildStageData(user)}
            />
          ))}
        </div>
      )}

      {chartType === "pie" && pieMode === "cumulative" && (
        <div className="max-w-xl mx-auto">
          <PieStatCard
            title="All Users (Cumulative)"
            data={buildCumulativeData(users)}
            radius={140}
            chartHeight={420}
          />
        </div>
      )}

      
    </div>
  );
};

export default UserStatsCard;
