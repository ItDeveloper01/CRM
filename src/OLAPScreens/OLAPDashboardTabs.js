import { useState,useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { CheckCircle, XCircle, PauseCircle, Clock, BarChart2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import {
  getLeadsByBranch,
  getLeadsByModule,
  getLeadsByStatus,
  getMonthlyTrend,
  getReasonTrendGeneral,
} from "../api/olapApi";
/* ================= DATA ================= */
const carRentalData = [
  { date: "2025-01-05", requirement: "Corporate", vehicle: "SUV", quote: 22000, status: "Lost", customerType: "VIP", enquirySource: "Website", city: "Mumbai" },
  { date: "2025-01-06", requirement: "Corporate", vehicle: "SUV", quote: 21000, status: "Postponed", customerType: "VIP", enquirySource: "Agent", city: "Mumbai" },
  { date: "2025-01-08", requirement: "Corporate", vehicle: "Sedan", quote: 15000, status: "Lost", customerType: "General", enquirySource: "Call", city: "Pune" },
  { date: "2025-01-09", requirement: "Corporate", vehicle: "Sedan", quote: 14000, status: "Confirmed", customerType: "VIP", enquirySource: "Website", city: "Pune" },
  { date: "2025-01-10", requirement: "Individual", vehicle: "Hatchback", quote: 6000, status: "Confirmed", customerType: "General", enquirySource: "Website", city: "Bangalore" },
  { date: "2025-01-11", requirement: "Individual", vehicle: "Hatchback", quote: 5500, status: "Open", customerType: "General", enquirySource: "Call", city: "Bangalore" },
  { date: "2025-01-12", requirement: "Event", vehicle: "SUV", quote: 18000, status: "Lost", customerType: "Friends", enquirySource: "Agent", city: "Hyderabad" },
  { date: "2025-01-15", requirement: "Event", vehicle: "Tempo Traveller", quote: 25000, status: "Lost", customerType: "General", enquirySource: "Website", city: "Chennai" }
];
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

/* ================= MAIN ================= */
export default function OLAPDashboardTabs() {
  const [activeTab, setActiveTab] = useState("Car Rental");

  const [status, setStatus] = useState("All");
  const [customerType, setCustomerType] = useState("All");
  const [enquirySource, setEnquirySource] = useState("All");
  const [filter] = useState({
    fromDate: "2025-01-01",
    toDate: new Date().toISOString().slice(0, 10),
    module: null,
    statusKey: 1,
    BranchKey: 1
  });
    const COLORS = ["#7DD3FC", "#A7F3D0", "#FDE68A", "#FCA5A5"];
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
    <div className="space-y-4">

      {/* ================= GLOBAL FILTERS ================= */}
      <Card>
        <CardContent className="p-4 bg-gray-50 flex flex-wrap gap-3 text-sm">
          <select className="border rounded px-2 py-1" onChange={e => setStatus(e.target.value)}>
            <option value="All">Status</option>
            <option>Confirmed</option>
            <option>Open</option>
            <option>Lost</option>
            <option>Postponed</option>
          </select>

          <select className="border rounded px-2 py-1" onChange={e => setCustomerType(e.target.value)}>
            <option value="All">Customer</option>
            <option>VIP</option>
            <option>General</option>
            <option>Friends</option>
          </select>

          <select className="border rounded px-2 py-1" onChange={e => setEnquirySource(e.target.value)}>
            <option value="All">Source</option>
            <option>Website</option>
            <option>Call</option>
            <option>Agent</option>
          </select>
        </CardContent>
      </Card>

      {/* ================= MODULE TABS ================= */}
      <div className="flex gap-2">
        {["Overview","Car Rental", "Visa", "Holiday"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm rounded border
              ${activeTab === tab
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-300"}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= TAB CONTENT ================= */}
       {activeTab === "Overview" && (
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
      {activeTab === "Car Rental" && (
        <CarRentalOLAP
          data={carRentalData}
          status={status}
          customerType={customerType}
          enquirySource={enquirySource}
        />
      )}

      {activeTab !== "Car Rental" && (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            {activeTab} dashboard coming soon
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ================= CAR RENTAL OLAP ================= */
function CarRentalOLAP({ data, status, customerType, enquirySource }) {
  const [vehicle, setVehicle] = useState("All");
  const [requirement, setRequirement] = useState("All");

  const filtered = data.filter(r =>
    (status === "All" || r.status === status) &&
    (customerType === "All" || r.customerType === customerType) &&
    (enquirySource === "All" || r.enquirySource === enquirySource) &&
    (vehicle === "All" || r.vehicle === vehicle) &&
    (requirement === "All" || r.requirement === requirement)
  );

  const total = filtered.length;
  const confirmed = filtered.filter(r => r.status === "Confirmed").length;
  const open = filtered.filter(r => r.status === "Open").length;
  const lost = filtered.filter(r => r.status === "Lost").length;

  const quoteVsLeads = [
    { range: "< ₹10k", count: filtered.filter(r => r.quote < 10000).length },
    { range: "₹10k–₹20k", count: filtered.filter(r => r.quote >= 10000 && r.quote <= 20000).length },
    { range: "> ₹20k", count: filtered.filter(r => r.quote > 20000).length },
  ];

  const leadsByCity = Object.values(
    filtered.reduce((a, r) => {
      a[r.city] = a[r.city] || { city: r.city, leads: 0 };
      a[r.city].leads++;
      return a;
    }, {})
  );

  const lostByVehicle = Object.values(
    filtered.filter(r => r.status === "Lost").reduce((a, r) => {
      a[r.vehicle] = a[r.vehicle] || { name: r.vehicle, lost: 0 };
      a[r.vehicle].lost++;
      return a;
    }, {})
  );

  const statusPie = [
    { name: "Confirmed", value: confirmed },
    { name: "Open", value: open },
    { name: "Lost", value: lost },
  ];

  const PIE_COLORS = ["#86EFAC", "#93C5FD", "#FCA5A5"];

  return (
    <div className="space-y-4">

      {/* ================= CAR FILTERS ================= */}
      <Card>
        <CardContent className="p-4 bg-blue-50 flex gap-3 text-sm">
          <select className="border rounded px-2 py-1" onChange={e => setRequirement(e.target.value)}>
            <option value="All">Requirement</option>
            <option>Corporate</option>
            <option>Individual</option>
            <option>Event</option>
          </select>

          <select className="border rounded px-2 py-1" onChange={e => setVehicle(e.target.value)}>
            <option value="All">Vehicle</option>
            <option>SUV</option>
            <option>Sedan</option>
            <option>Hatchback</option>
            <option>Tempo Traveller</option>
          </select>
        </CardContent>
      </Card>

     {/* ================= KPI CARDS ================= */}
<div className="grid grid-cols-5 gap-3">

  {/* Total Leads */}
  <Card className="bg-indigo-50 border-indigo-200">
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <div className="text-xs text-indigo-700">Total Leads</div>
        <div className="text-2xl font-semibold text-indigo-900">{total}</div>
      </div>
      <BarChart2 className="text-indigo-500 w-6 h-6" />
    </CardContent>
  </Card>

  {/* Confirmed */}
  <Card className="bg-green-50 border-green-200">
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <div className="text-xs text-green-700">Confirmed</div>
        <div className="text-2xl font-semibold text-green-900">{confirmed}</div>
      </div>
      <CheckCircle className="text-green-500 w-6 h-6" />
    </CardContent>
  </Card>

  {/* Open */}
  <Card className="bg-blue-50 border-blue-200">
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <div className="text-xs text-blue-700">Open</div>
        <div className="text-2xl font-semibold text-blue-900">{open}</div>
      </div>
      <Clock className="text-blue-500 w-6 h-6" />
    </CardContent>
  </Card>

  {/* Lost */}
  <Card className="bg-red-50 border-red-200">
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <div className="text-xs text-red-700">Lost</div>
        <div className="text-2xl font-semibold text-red-900">{lost}</div>
      </div>
      <XCircle className="text-red-500 w-6 h-6" />
    </CardContent>
  </Card>

  {/* Postponed */}
  <Card className="bg-amber-50 border-amber-200">
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <div className="text-xs text-amber-700">Postponed</div>
        <div className="text-2xl font-semibold text-amber-900">
          {filtered.filter(r => r.status === "Postponed").length}
        </div>
      </div>
      <PauseCircle className="text-amber-500 w-6 h-6" />
    </CardContent>
  </Card>

</div>
      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-4 gap-4">

        {/* Quote Range vs Leads */}
        <Card>
          <CardContent className="p-3 h-56">
            <h3 className="text-sm font-medium mb-1">Quote Range vs Leads</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quoteVsLeads}>
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#C4B5FD" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardContent className="p-3 h-56">
            <h3 className="text-sm font-medium mb-1">Lead Status Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusPie} dataKey="value" nameKey="name">
                  {statusPie.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lost by Vehicle */}
        <Card>
          <CardContent className="p-3 h-56">
            <h3 className="text-sm font-medium mb-1">Lost Leads by Vehicle</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lostByVehicle}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="lost" fill="#FCA5A5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* City Map + City Leads */}
        <Card className="col-span-2">
          <CardContent className="p-3 h-56">
            <h3 className="text-sm font-medium mb-2">Serving Cities</h3>

            <div className="grid grid-cols-2 gap-3 h-full">
              {/* Map */}
              <div className="border rounded flex items-center justify-center">
                <svg viewBox="0 0 200 240" className="w-full h-40">
                  <path d="M60 10 L140 10 L160 60 L150 120 L120 200 L80 200 L50 140 L40 80 Z"
                        fill="#EEF2FF" stroke="#94A3B8" />
                  <circle cx="90" cy="90" r="4" fill="#60A5FA" />
                  <circle cx="105" cy="85" r="4" fill="#60A5FA" />
                  <circle cx="130" cy="120" r="4" fill="#60A5FA" />
                  <circle cx="120" cy="100" r="4" fill="#60A5FA" />
                  <circle cx="145" cy="115" r="4" fill="#60A5FA" />
                </svg>
              </div>

              {/* City Bar */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadsByCity}>
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#93C5FD" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 h-full">
          <CardContent className="p-3 h-40 overflow-y-auto text-xs space-y-2">
            <h3 className="text-sm font-medium mb-2">Leads</h3>
            {filtered.map((l, i) => (
              <div key={i} className="border-b pb-1">
                <div>{l.date} | ₹{l.quote} | {l.status}</div>
                <div className="text-gray-500">{l.vehicle} • {l.requirement} • {l.customerType} • {l.enquirySource} • {l.city}</div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
