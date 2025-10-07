import React, { useEffect, useState } from "react";
import { Loader2, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Legend,
} from "recharts";

// Pie chart colors
const PIE_COLORS = ["#4CAF50", "#FF5252", "#8884d8", "#FFC107"];

const fetchLeadAnalytics = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalLeads: 150,
        convertedLeadsCount: 90,
        lostLeadsCount: 30,
        postponedLeadsCount: 10, // dummy value
        leadsOverTime: [
          { month: "Jan", total: 45, converted: 20 },
          { month: "Feb", total: 50, converted: 25 },
          { month: "Mar", total: 40, converted: 15 },
          { month: "Apr", total: 55, converted: 30 },
        ],
        lostLeadsReasons: [
          { reason: "High Price", count: 12 },
          { reason: "Competitor", count: 8 },
          { reason: "No Response", count: 5 },
          { reason: "Budget Issues", count: 5 },
        ],
        lostLeadsList: [
          { id: 101, name: "John Doe", reason: "High Price", date: "2025-09-01" },
          { id: 102, name: "Jane Smith", reason: "Competitor", date: "2025-09-03" },
        ],
        confirmedLeadsList: [
          { id: 201, name: "Alice Brown", date: "2025-09-02" },
          { id: 202, name: "Bob Johnson", date: "2025-09-04" },
        ],
      });
    }, 1000);
  });

const LeadAnalytics = () => {
  const [selectedMonth, setSelectedMonth] = useState("Jan");
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics");
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState({
    totalLeads: 0,
    convertedLeadsCount: 0,
    lostLeadsCount: 0,
    postponedLeadsCount: 0,
    leadsOverTime: [],
    lostLeadsReasons: [],
    lostLeadsList: [],
    confirmedLeadsList: [],
  });

  useEffect(() => {
    setLoading(true);
    fetchLeadAnalytics().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [selectedMonth, selectedPeriod]);

  const openLeadsCount =
    data.totalLeads -
    (data.convertedLeadsCount + data.lostLeadsCount + data.postponedLeadsCount);

  const conversionRate =
    openLeadsCount + data.convertedLeadsCount > 0
      ? Math.round(
          (data.convertedLeadsCount / (openLeadsCount + data.convertedLeadsCount)) * 100
        )
      : 0;

  const pieData = [
    { name: "Confirmed", value: data.convertedLeadsCount },
    { name: "Lost", value: data.lostLeadsCount },
    { name: "Open", value: openLeadsCount },
    { name: "Postponed", value: data.postponedLeadsCount },
  ];

  // Filtered tables
  const filteredLostLeads = data.lostLeadsList.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchText.toLowerCase()) ||
      lead.id.toString().includes(searchText)
  );
  const filteredConfirmedLeads = data.confirmedLeadsList.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchText.toLowerCase()) ||
      lead.id.toString().includes(searchText)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between border border-gray-200">
          <div>
            <p className="text-gray-500 text-sm">Total Leads</p>
            <p className="text-lg font-semibold">{data.totalLeads}</p>
          </div>
          <Users className="text-blue-500 w-6 h-6" />
        </div>

        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between border border-gray-200">
          <div>
            <p className="text-gray-500 text-sm">Confirmed</p>
            <p className="text-lg font-semibold">{data.convertedLeadsCount}</p>
          </div>
          <CheckCircle className="text-green-500 w-6 h-6" />
        </div>

        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between border border-gray-200">
          <div>
            <p className="text-gray-500 text-sm">Lost</p>
            <p className="text-lg font-semibold">{data.lostLeadsCount}</p>
          </div>
          <XCircle className="text-red-500 w-6 h-6" />
        </div>

        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between border border-gray-200">
          <div>
            <p className="text-gray-500 text-sm">Open</p>
            <p className="text-lg font-semibold">{openLeadsCount}</p>
          </div>
          <Clock className="text-purple-500 w-6 h-6" />
        </div>

        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between border border-gray-200">
          <div>
            <p className="text-gray-500 text-sm">Conversion Rate</p>
            <p className="text-lg font-semibold">{conversionRate}%</p>
          </div>
          <CheckCircle className="text-yellow-500 w-6 h-6" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 md:gap-4 items-center">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white shadow-sm"
        >
          <option value="Jan">January</option>
          <option value="Feb">February</option>
          <option value="Mar">March</option>
          <option value="Apr">April</option>
        </select>

        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white shadow-sm"
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>

        <input
          type="text"
          placeholder="Search Lead ID or Name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white shadow-sm flex-1 min-w-[200px]"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {["analytics", "lost", "confirmed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-semibold text-sm transition-colors ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "analytics"
              ? "Analytics"
              : tab === "lost"
              ? "Lost Leads"
              : "Confirmed Leads"}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* Analytics Charts */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Leads Over Time */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-md font-semibold mb-2">Leads Over Time</h2>
              <div className="h-64">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.leadsOverTime}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="total" stroke="#8884d8" />
                      <Line type="monotone" dataKey="converted" stroke="#4CAF50" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Leads Status Pie Chart */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-md font-semibold mb-2">Leads Status</h2>
              <div className="h-64">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Lost Leads Reasons */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 lg:col-span-2">
              <h2 className="text-md font-semibold mb-2">Lost Leads - Reasons</h2>
              <div className="h-64">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  </div>
                ) : (
  
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.lostLeadsReasons}>
                      <XAxis dataKey="reason" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#eb4c30ff" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Lost Leads Table */}
        {activeTab === "lost" && (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 overflow-x-auto">
            <h2 className="text-md font-semibold mb-2">Lost Leads</h2>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : (
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-1 text-left">ID</th>
                    <th className="px-3 py-1 text-left">Name</th>
                    <th className="px-3 py-1 text-left">Reason</th>
                    <th className="px-3 py-1 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredLostLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="px-3 py-1">{lead.id}</td>
                      <td className="px-3 py-1">{lead.name}</td>
                      <td className="px-3 py-1">{lead.reason}</td>
                      <td className="px-3 py-1">{lead.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Confirmed Leads Table */}
        {activeTab === "confirmed" && (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 overflow-x-auto">
            <h2 className="text-md font-semibold mb-2">Confirmed Leads</h2>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : (
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-1 text-left">ID</th>
                    <th className="px-3 py-1 text-left">Name</th>
                    <th className="px-3 py-1 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredConfirmedLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="px-3 py-1">{lead.id}</td>
                      <td className="px-3 py-1">{lead.name}</td>
                      <td className="px-3 py-1">{lead.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadAnalytics;
