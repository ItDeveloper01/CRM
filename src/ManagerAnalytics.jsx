import React from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts';

export default function ManagerAnalytics() {
  const [activeTab, setActiveTab] = React.useState('cumulative');
  const [selectedExec, setSelectedExec] = React.useState(null);
  const [selectedExecs, setSelectedExecs] = React.useState([]); // multiselect

  // Darker pastel palette (stronger than previous)
  const COLORS = ['#1f6f8b', '#2f9e44', '#d64545', '#f08a24', '#6a4fb0', '#0b6b5f'];
  const PASTEL = ['#7fb3d5', '#f6c28b', '#ff9fb2', '#c8bfe7', '#a3d1ff', '#b7e4c7'];

  // Basic cumulative data
  const data = [
    { name: 'Open', value: 12 },
    { name: 'Confirmed', value: 20 },
    { name: 'Lost', value: 5 },
    { name: 'Postponed', value: 3 },
  ];

  // 20 executives example data
  const execData = [
    { exec: 'Amit', open: 4, confirmed: 6, lost: 1, postponed: 1 },
    { exec: 'Sneha', open: 3, confirmed: 8, lost: 2, postponed: 0 },
    { exec: 'Rohan', open: 5, confirmed: 6, lost: 2, postponed: 2 },
    { exec: 'Neha', open: 2, confirmed: 4, lost: 1, postponed: 1 },
    { exec: 'Karan', open: 6, confirmed: 3, lost: 2, postponed: 0 },
    { exec: 'Pooja', open: 3, confirmed: 7, lost: 1, postponed: 2 },
    { exec: 'Vikas', open: 4, confirmed: 5, lost: 3, postponed: 1 },
    { exec: 'Anita', open: 5, confirmed: 4, lost: 1, postponed: 3 },
    { exec: 'Jay', open: 1, confirmed: 2, lost: 1, postponed: 0 },
    { exec: 'Meera', open: 2, confirmed: 3, lost: 2, postponed: 1 },
    { exec: 'Samir', open: 3, confirmed: 5, lost: 1, postponed: 0 },
    { exec: 'Tina', open: 4, confirmed: 6, lost: 2, postponed: 1 },
    { exec: 'Rahul', open: 2, confirmed: 3, lost: 1, postponed: 2 },
    { exec: 'Divya', open: 6, confirmed: 4, lost: 2, postponed: 1 },
    { exec: 'Harsh', open: 5, confirmed: 2, lost: 1, postponed: 3 },
    { exec: 'Isha', open: 3, confirmed: 4, lost: 2, postponed: 0 },
    { exec: 'Kabir', open: 4, confirmed: 3, lost: 1, postponed: 2 },
    { exec: 'Leena', open: 2, confirmed: 5, lost: 3, postponed: 1 },
    { exec: 'Omkar', open: 1, confirmed: 2, lost: 2, postponed: 1 },
    { exec: 'Zara', open: 3, confirmed: 6, lost: 1, postponed: 1 },
  ];

  // helper lists
  const execNames = execData.map((e) => e.exec);

  // filtered exec data based on multiselect (if empty -> all)
  const filteredExecData = React.useMemo(() => {
    if (!selectedExecs || selectedExecs.length === 0) return execData;
    return execData.filter((e) => selectedExecs.includes(e.exec));
  }, [selectedExecs]);

  // Yearly summary dummy data
  const yearlyData = [
    { month: 'Jan', total: 40 },
    { month: 'Feb', total: 35 },
    { month: 'Mar', total: 50 },
    { month: 'Apr', total: 45 },
    { month: 'May', total: 60 },
    { month: 'Jun', total: 55 },
    { month: 'Jul', total: 70 },
    { month: 'Aug', total: 65 },
    { month: 'Sep', total: 50 },
    { month: 'Oct', total: 55 },
    { month: 'Nov', total: 60 },
    { month: 'Dec', total: 75 },
  ];

  // stacked and destination data
  const destinationData = [
    { destination: 'Goa', confirmed: 20, open: 12, lost: 5, postponed: 3 },
    { destination: 'Dubai', confirmed: 30, open: 10, lost: 8, postponed: 6 },
    { destination: 'Thailand', confirmed: 25, open: 15, lost: 12, postponed: 4 },
    { destination: 'Singapore', confirmed: 18, open: 14, lost: 6, postponed: 2 },
  ];

  const stackedData = [
    { name: 'Week 1', confirmed: 40, open: 20, lost: 10, postponed: 5 },
    { name: 'Week 2', confirmed: 30, open: 25, lost: 12, postponed: 8 },
    { name: 'Week 3', confirmed: 50, open: 28, lost: 14, postponed: 9 },
    { name: 'Week 4', confirmed: 35, open: 18, lost: 9, postponed: 4 },
  ];

  // calendar data
  const calendarData = Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, followups: Math.floor(Math.random() * 10) }));

  // drillDetails example data (to avoid undefined reference)
  const drillDetails = {
    Amit: [
      { day: 'Mon', value: 2 },
      { day: 'Tue', value: 3 },
      { day: 'Wed', value: 4 },
      { day: 'Thu', value: 2 },
      { day: 'Fri', value: 1 },
    ],
    Sneha: [
      { day: 'Mon', value: 1 },
      { day: 'Tue', value: 4 },
      { day: 'Wed', value: 3 },
      { day: 'Thu', value: 3 },
      { day: 'Fri', value: 2 },
    ],
    Rohan: [
      { day: 'Mon', value: 3 },
      { day: 'Tue', value: 3 },
      { day: 'Wed', value: 5 },
      { day: 'Thu', value: 2 },
      { day: 'Fri', value: 2 },
    ],
    Neha: [
      { day: 'Mon', value: 1 },
      { day: 'Tue', value: 1 },
      { day: 'Wed', value: 2 },
      { day: 'Thu', value: 2 },
      { day: 'Fri', value: 1 },
    ],
  };

  // build funnel data for an exec from execData
  function buildFunnel(exec) {
    // derive stages reasonably from available fields
    const sum = exec.open + exec.confirmed + exec.lost + exec.postponed;
    const leads = Math.max(10, Math.floor(sum * 8));
    const contacted = Math.max(5, Math.floor(sum * 6));
    const qualified = Math.max(3, exec.open + exec.confirmed);
    const proposal = Math.max(2, exec.confirmed + Math.floor(exec.open / 2));
    const confirmed = Math.max(1, exec.confirmed);
    return [
      { stage: 'Leads', value: leads },
      { stage: 'Contacted', value: contacted },
      { stage: 'Qualified', value: qualified },
      { stage: 'Proposal', value: proposal },
      { stage: 'Confirmed', value: confirmed },
    ];
  }

  // drill handler
  function handleDrillClick(e) {
    if (!e || !e.activeLabel) return;
    setSelectedExec(e.activeLabel);
  }

  // multiselect handler
  function handleMultiSelectChange(e) {
    const options = Array.from(e.target.selectedOptions).map((o) => o.value);
    setSelectedExecs(options);
  }

  // toggle exec selection for funnels
  function toggleExecutive(name) {
    setSelectedExecs((prev) => (prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name]));
  }

  // default selected for funnels: first 3
  const funnelSelected = selectedExecs.length > 0 ? selectedExecs : execNames.slice(0, 3);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Controls row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="bg-white p-4 rounded-2xl shadow grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <select className="p-2 border rounded-xl">
            <option>Date Range</option>
            <option>Today</option>
            <option>Yesterday</option>
            <option>This Month</option>
          </select>

          <select multiple className="p-2 border rounded-xl" onChange={handleMultiSelectChange} value={selectedExecs}>
            {execNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <select className="p-2 border rounded-xl">
            <option>Status</option>
            <option>Open</option>
            <option>Confirmed</option>
            <option>Lost</option>
            <option>Postponed</option>
          </select>

          <select className="p-2 border rounded-xl">
            <option>Destination</option>
            <option>Dubai</option>
            <option>Thailand</option>
            <option>Europe</option>
          </select>
        </div>

        {/* Executive tabs (small) */}
        <div className="flex gap-2 overflow-x-auto mt-2 md:mt-0">
          <button
            onClick={() => setSelectedExec(null)}
            className={`px-3 py-1 rounded-full border ${selectedExec === null ? 'bg-indigo-100' : 'bg-white'}`}
          >
            All
          </button>
          {execNames.map((name) => (
            <button
              key={name}
              onClick={() => setSelectedExec(name)}
              className={`px-3 py-1 rounded-full border ${selectedExec === name ? 'bg-indigo-100' : 'bg-white'}`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab('cumulative')}
          className={`px-4 py-2 rounded-xl shadow ${
            activeTab === 'cumulative' ? 'bg-indigo-600 text-white' : 'bg-white'
          }`}
        >
          Cumulative
        </button>
        <button
          onClick={() => setActiveTab('individual')}
          className={`px-4 py-2 rounded-xl shadow ${
            activeTab === 'individual' ? 'bg-indigo-600 text-white' : 'bg-white'
          }`}
        >
          Individual
        </button>
      </div>

      {/* Content */}
      {activeTab === 'cumulative' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Cumulative Lead Status</h2>

            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {data.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PASTEL[index % PASTEL.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Yearly Summary */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="bg-white p-4 rounded-xl border">
                <h3 className="font-medium mb-2">Yearly Summary</h3>
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer>
                    <AreaChart data={yearlyData}>
                      <defs>
                        <linearGradient id="colorYearly" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#CDE4FF" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#CDE4FF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="total" stroke="#8892BF" fillOpacity={1} fill="url(#colorYearly)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Stacked bar (small) */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white p-4 rounded-xl border">
                <h3 className="font-medium mb-2">Weekly Stacked</h3>
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer>
                    <BarChart data={stackedData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="confirmed" stackId="a" fill="#1f6f8b" />
                      <Bar dataKey="open" stackId="a" fill="#2f9e44" />
                      <Bar dataKey="lost" stackId="a" fill="#d64545" />
                      <Bar dataKey="postponed" stackId="a" fill="#f08a24" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Multi-person Funnel Section */}
            <div className="mt-8">
              <h3 className="font-medium mb-3">Multi-person Funnels (compare multiple executives)</h3>

              {/* quick toggles */}
              <div className="flex flex-wrap gap-2 mb-4">
                {execNames.slice(0, 8).map((name) => (
                  <button
                    key={name}
                    onClick={() => toggleExecutive(name)}
                    className={`px-3 py-1 rounded-full border ${selectedExecs.includes(name) ? 'bg-indigo-700 text-white' : 'bg-white'}`}
                  >
                    {name}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedExecs(execNames.slice(0, 6))}
                  className="px-3 py-1 rounded-full border bg-gray-100"
                >
                  Select Top 6
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {funnelSelected.map((name, idx) => {
                  const exec = execData.find((e) => e.exec === name);
                  const funnel = exec ? buildFunnel(exec) : [];
                  return (
                    <motion.div key={name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 + idx * 0.05 }} className="bg-white p-4 rounded-2xl shadow">
                      <h4 className="text-lg font-semibold mb-2">{name}</h4>
                      <div style={{ width: '100%', height: 220 }}>
                        <ResponsiveContainer>
                          <FunnelChart>
                            <Tooltip />
                            <Legend />
                            <Funnel data={funnel} dataKey="value" isAnimationActive>
                              <LabelList dataKey="stage" position="right" />
                            </Funnel>
                          </FunnelChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* end cumulative card */}
          </div>
        </motion.div>
      )}

      {activeTab === 'individual' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="space-y-8">
            {/* Executive Bar Chart (drillable) */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">Executive-wise Breakdown (click bar to drill)</h2>
              <div style={{ width: '100%', height: 360 }}>
                <ResponsiveContainer>
                  <BarChart data={selectedExec ? execData.filter((e) => e.exec === selectedExec) : filteredExecData} onClick={handleDrillClick} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="exec" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="open" fill="#CDE4FF" name="Open" />
                    <Bar dataKey="confirmed" fill="#A8DADC" name="Confirmed" />
                    <Bar dataKey="lost" fill="#FFD6E0" name="Lost" />
                    <Bar dataKey="postponed" fill="#E6E6FA" name="Postponed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Drill details (if selected) */}
              {selectedExec && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-6 bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Details for {selectedExec}</h3>
                  <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                      <LineChart data={(drillDetails && drillDetails[selectedExec]) || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8892BF" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Additional Chart Gallery (stacked vertically) */}
            <div className="bg-white p-6 rounded-2xl shadow space-y-12">
              <h2 className="text-xl font-semibold mb-4">Additional Chart Types</h2>

              {/* Line Chart */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#1f6f8b" />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Area Chart */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }} style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1f6f8b" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#1f6f8b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#1f6f8b" fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Radial Bar Chart */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.34 }} style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <RadialBarChart innerRadius="20%" outerRadius="90%" data={data} startAngle={180} endAngle={0}>
                    <RadialBar minAngle={15} label={{ fill: '#666', position: 'insideStart' }} background clockWise dataKey="value" />
                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Destination-wise Composed Chart */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36 }} style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <ComposedChart data={destinationData}>
                    <XAxis dataKey="destination" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="confirmed" fill="#d64545" />
                    <Line dataKey="open" stroke="#1f6f8b" />
                  </ComposedChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Stacked Bar (large) */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }} style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={stackedData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="confirmed" stackId="a" fill="#1f6f8b" />
                    <Bar dataKey="open" stackId="a" fill="#2f9e44" />
                    <Bar dataKey="lost" stackId="a" fill="#d64545" />
                    <Bar dataKey="postponed" stackId="a" fill="#f08a24" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Calendar Heatmap */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h3 className="font-medium mb-2">Calendar Heatmap (Follow-ups)</h3>
                <div className="grid grid-cols-10 gap-2">
                  {calendarData.map((d, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-md flex items-center justify-center text-xs"
                      style={{
                        backgroundColor: `rgba(31, 111, 139, ${d.followups / 10})`,
                      }}
                    >
                      {d.followups}
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}