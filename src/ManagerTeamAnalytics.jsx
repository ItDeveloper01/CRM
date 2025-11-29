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
  AreaChart,
  Area,
} from 'recharts';

export default function ManagerTeamAnalytics() {
  const [activeTab, setActiveTab] = React.useState('cumulative');
  const [selectedExecs, setSelectedExecs] = React.useState([]);

  const COLORS = ['#1f6f8b', '#2f9e44', '#d64545', '#f08a24'];
  const PASTEL = ['#7fb3d5', '#f6c28b', '#ff9fb2', '#c8bfe7'];

  const execData = [
    { exec: 'Amit', open: 30, confirmed: 20, lost: 10, postponed: 5 },
    { exec: 'Sneha', open: 25, confirmed: 18, lost: 12, postponed: 7 },
    { exec: 'Rohan', open: 40, confirmed: 22, lost: 15, postponed: 9 },
    { exec: 'Neha', open: 12, confirmed: 8, lost: 3, postponed: 2 },
    { exec: 'Karan', open: 18, confirmed: 9, lost: 4, postponed: 1 },
    { exec: 'Pooja', open: 22, confirmed: 14, lost: 5, postponed: 6 },
    { exec: 'Vikas', open: 16, confirmed: 11, lost: 6, postponed: 4 },
    { exec: 'Anita', open: 20, confirmed: 10, lost: 4, postponed: 8 },
    { exec: 'Jay', open: 6, confirmed: 4, lost: 2, postponed: 1 },
    { exec: 'Meera', open: 10, confirmed: 7, lost: 3, postponed: 2 },
    { exec: 'Samir', open: 14, confirmed: 10, lost: 3, postponed: 0 },
    { exec: 'Tina', open: 18, confirmed: 12, lost: 5, postponed: 3 },
    { exec: 'Rahul', open: 9, confirmed: 6, lost: 2, postponed: 4 },
    { exec: 'Divya', open: 26, confirmed: 18, lost: 6, postponed: 3 },
    { exec: 'Harsh', open: 21, confirmed: 8, lost: 3, postponed: 10 },
  ];

  const execNames = execData.map(e => e.exec);

  const filteredExecData = React.useMemo(() => {
    if (!selectedExecs || selectedExecs.length === 0) return execData;
    return execData.filter(e => selectedExecs.includes(e.exec));
  }, [selectedExecs]);

  const buildBars = (exec) => [
    { stage: 'Open', value: exec.open || 0, color: '#4B9CD3' },
    { stage: 'Confirmed', value: exec.confirmed || 0, color: '#1E7F6B' },
    { stage: 'Lost', value: exec.lost || 0, color: '#D9534F' },
    { stage: 'Postponed', value: exec.postponed || 0, color: '#F0AD4E' },
  ];

  const cumulativeData = [
    { name: 'Open', value: 12 },
    { name: 'Confirmed', value: 20 },
    { name: 'Lost', value: 5 },
    { name: 'Postponed', value: 3 },
  ];

  const yearlyData = [
    { month: 'Jan', total: 40 }, { month: 'Feb', total: 35 }, { month: 'Mar', total: 50 },
    { month: 'Apr', total: 45 }, { month: 'May', total: 60 }, { month: 'Jun', total: 55 },
    { month: 'Jul', total: 70 }, { month: 'Aug', total: 65 }, { month: 'Sep', total: 50 },
    { month: 'Oct', total: 55 }, { month: 'Nov', total: 60 }, { month: 'Dec', total: 75 },
  ];

  const stackedData = [
    { name: 'Week 1', confirmed: 40, open: 20, lost: 10, postponed: 5 },
    { name: 'Week 2', confirmed: 30, open: 25, lost: 12, postponed: 8 },
    { name: 'Week 3', confirmed: 50, open: 28, lost: 14, postponed: 9 },
    { name: 'Week 4', confirmed: 35, open: 18, lost: 9, postponed: 4 },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl shadow grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <select className="p-2 border rounded-xl"><option>Date Range</option></select>
        <select className="p-2 border rounded-xl"><option>Status</option></select>
        <select className="p-2 border rounded-xl"><option>Destination</option></select>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4">
        <button onClick={() => setActiveTab('cumulative')} className={`px-4 py-2 rounded-xl shadow ${activeTab === 'cumulative' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>Cumulative</button>
        <button onClick={() => setActiveTab('individual')} className={`px-4 py-2 rounded-xl shadow ${activeTab === 'individual' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>Team Independent Statistics</button>
      </div>

      {activeTab === 'cumulative' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="bg-white p-6 rounded-2xl shadow space-y-6">
            <h2 className="text-xl font-semibold">Cumulative Lead Status</h2>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={cumulativeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {cumulativeData.map((_, idx) => <Cell key={idx} fill={PASTEL[idx % PASTEL.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-xl border">
                <h3 className="font-medium mb-2">Yearly Summary</h3>
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer>
                    <AreaChart data={yearlyData}>
                      <defs>
                        <linearGradient id="colorYearly" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#CDE4FF" stopOpacity={0.9}/>
                          <stop offset="95%" stopColor="#CDE4FF" stopOpacity={0}/>
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
              </div>
              <div className="bg-white p-4 rounded-xl border">
                <h3 className="font-medium mb-2">Weekly Stacked</h3>
                <div style={{ width: '100%', height: 220 }}>
                  <ResponsiveContainer>
                    <BarChart data={stackedData} barCategoryGap={12} barGap={4}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="confirmed" stackId="a" fill={COLORS[0]} />
                      <Bar dataKey="open" stackId="a" fill={COLORS[1]} />
                      <Bar dataKey="lost" stackId="a" fill={COLORS[2]} />
                      <Bar dataKey="postponed" stackId="a" fill={COLORS[3]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'individual' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="bg-white p-6 rounded-2xl shadow">
            <details open className="bg-gray-50 p-4 rounded-2xl shadow">
              <summary className="cursor-pointer font-semibold text-lg mb-4">Individual Horizontal Charts (Team Selection)</summary>

              <div className="flex flex-wrap gap-2 mb-4 mt-2">
                {execNames.map(name => (
                  <button
                    key={name}
                    onClick={() => setSelectedExecs(prev => prev.includes(name) ? prev.filter(e => e !== name) : [...prev, name])}
                    className={`px-3 py-1 rounded-full border ${selectedExecs.includes(name) ? 'bg-indigo-600 text-white' : 'bg-white'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {filteredExecData.map(e => (
                  <div key={e.exec} className="bg-white p-3 rounded-xl border shadow-sm">
                    <h4 className="font-medium mb-2 text-center">{e.exec}</h4>
                    <div style={{ width: '100%', height: 140 }}>
                      <ResponsiveContainer>
                        <BarChart data={buildBars(e)} layout="vertical" margin={{ top: 6, right: 10, left: 20, bottom: 6 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="stage" width={100} />
                          <Tooltip />
                          <Bar dataKey="value">
                            {buildBars(e).map((b, index) => <Cell key={index} fill={b.color} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </motion.div>
      )}
    </div>
  );
}
