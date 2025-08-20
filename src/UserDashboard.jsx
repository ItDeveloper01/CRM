import React, { useMemo, useState } from "react";

/* ---------- Helpers ---------- */
const categories = [
  "AirTicketing",
  "Holiday",
  "CarRental",
  "National GIT",
  "National FIT",
  "International GIT",
  "International FIT",
];

const statuses = ["Confirmed", "Postponed", "Lost", "Confirmed"]; // rotate helper

function genActiveLeads(n = 25) {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    firstName: `ActiveFirst${i + 1}`,
    lastName: `ActiveLast${i + 1}`,
    phone: `90000000${String(i).padStart(2, "0")}`,
    email: `active${i + 1}@example.com`,
    enquiryDate: `2025-08-${String(((i % 28) + 1)).padStart(2, "0")}`,
    category: categories[i % categories.length],
    status: statuses[i % statuses.length],
  }));
}

function genFollowUpLeads(n = 25) {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 101,
    firstName: `FollowFirst${i + 1}`,
    lastName: `FollowLast${i + 1}`,
    phone: `80000000${String(i).padStart(2, "0")}`,
    email: `follow${i + 1}@example.com`,
    followUpDate: `2025-08-${String(((i % 28) + 1)).padStart(2, "0")}`,
    enquiryDate: `2025-08-${String(((i % 28) + 1)).padStart(2, "0")}`,
    category: categories[i % categories.length],
    status: statuses[i % statuses.length],
  }));
}

const ALL_ACTIVE = genActiveLeads(25);
const ALL_FOLLOW = genFollowUpLeads(25);

function isWithinInterval(dateStr, interval) {
  if (!interval) return true;
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const td = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffMs = td - dd;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (interval === "today") return diffDays === 0;
  if (interval === "lastWeek") return diffDays >= 0 && diffDays < 7;
  if (interval === "lastMonth") return diffDays >= 0 && diffDays < 30;
  return true;
}

function sortArray(data, sort) {
  if (!sort || !sort.column) return data;
  const { column, dir } = sort;
  return [...data].sort((a, b) => {
    const A = a[column] ?? "";
    const B = b[column] ?? "";
    if (column.toLowerCase().includes("date")) {
      const da = new Date(A + "T00:00:00").getTime();
      const db = new Date(B + "T00:00:00").getTime();
      return dir === "asc" ? da - db : db - da;
    }
    const sa = String(A).toLowerCase();
    const sb = String(B).toLowerCase();
    if (sa < sb) return dir === "asc" ? -1 : 1;
    if (sa > sb) return dir === "asc" ? 1 : -1;
    return 0;
  });
}

function arrayToCSV(rows, columns) {
  const header = columns.map((c) => c.label).join(",");
  const lines = rows.map((r) =>
    columns
      .map((c) => {
        const v = r[c.key] ?? "";
        const s = String(v).replace(/"/g, '""');
        if (s.includes(",") || s.includes("\n") || s.includes('"')) return `"${s}"`;
        return s;
      })
      .join(",")
  );
  return [header, ...lines].join("\n");
}

function downloadCSV(filename, csvString) {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ---------- Component ---------- */
export default function UserDashboard() {
  const [progressInterval, setProgressInterval] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeDate, setActiveDate] = useState("");
  const [followCategory, setFollowCategory] = useState("");
  const [followDate, setFollowDate] = useState("");
  const [showFollowUp, setShowFollowUp] = useState(true);

  const PAGE_SIZE = 5;
  const [activePage, setActivePage] = useState(1);
  const [followPage, setFollowPage] = useState(1);

  const [activeSort, setActiveSort] = useState({ column: "id", dir: "asc" });
  const [followSort, setFollowSort] = useState({ column: "id", dir: "asc" });

  function handleIntervalChange(val) {
    setProgressInterval(val);
    setSelectedStatus("All");
    setActivePage(1);
    setFollowPage(1);
  }

  const activeByInterval = useMemo(
    () => ALL_ACTIVE.filter((l) => isWithinInterval(l.enquiryDate, progressInterval)),
    [progressInterval]
  );
  const followByInterval = useMemo(
    () => ALL_FOLLOW.filter((l) => isWithinInterval(l.followUpDate, progressInterval)),
    [progressInterval]
  );

  const tileCounts = useMemo(() => {
    const combined = [...activeByInterval, ...followByInterval];
    return {
      total: combined.length,
      postponed: combined.filter((l) => l.status === "Postponed").length,
      lost: combined.filter((l) => l.status === "Lost").length,
      confirmed: combined.filter((l) => l.status === "Confirmed").length,
    };
  }, [activeByInterval, followByInterval]);

  const filteredActive = useMemo(() => {
    const out = activeByInterval.filter((l) => {
      if (selectedStatus === "Active") return true; // Active Leads tile
      if (selectedStatus !== "All" && l.status !== selectedStatus) return false;
      if (activeCategory && l.category !== activeCategory) return false;
      if (activeDate && l.enquiryDate !== activeDate) return false;
      return true;
    });
    const pages = Math.max(1, Math.ceil(out.length / PAGE_SIZE));
    if (activePage > pages) setActivePage(1);
    return out;
  }, [activeByInterval, selectedStatus, activeCategory, activeDate, activePage]);

  const filteredFollow = useMemo(() => {
    const out = followByInterval.filter((l) => {
      if (followCategory && l.category !== followCategory) return false;
      if (followDate && l.followUpDate !== followDate) return false;
      return true;
    });
    const pages = Math.max(1, Math.ceil(out.length / PAGE_SIZE));
    if (followPage > pages) setFollowPage(1);
    return out;
  }, [followByInterval, followCategory, followDate, followPage]);

  const activeSorted = useMemo(() => sortArray(filteredActive, activeSort), [filteredActive, activeSort]);
  const followSorted = useMemo(() => sortArray(filteredFollow, followSort), [filteredFollow, followSort]);

  const activeVisible = useMemo(
    () => activeSorted.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE),
    [activeSorted, activePage]
  );

  const followVisible = useMemo(
    () => followSorted.slice((followPage - 1) * PAGE_SIZE, followPage * PAGE_SIZE),
    [followSorted, followPage]
  );

  function toggleSort(table, column) {
    if (table === "active") {
      setActiveSort((s) => (s.column === column ? { column, dir: s.dir === "asc" ? "desc" : "asc" } : { column, dir: "asc" }));
      setActivePage(1);
    } else {
      setFollowSort((s) => (s.column === column ? { column, dir: s.dir === "asc" ? "desc" : "asc" } : { column, dir: "asc" }));
      setFollowPage(1);
    }
  }

  const activeColumns = [
    { key: "id", label: "Lead ID" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "enquiryDate", label: "Enquiry Date" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
  ];

  const followColumns = [
    { key: "id", label: "Lead ID" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "followUpDate", label: "Follow-Up Date" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
  ];

  function exportActiveCSV() {
    const csv = arrayToCSV(activeVisible, activeColumns);
    downloadCSV(`active_leads_page${activePage}.csv`, csv);
  }
  function exportFollowCSV() {
    const csv = arrayToCSV(followVisible, followColumns);
    downloadCSV(`followup_leads_page${followPage}.csv`, csv);
  }

  const tiles = [
    {
      key: "Active",
      title: "Active Leads",
      value: activeByInterval.length,
      border: "border-purple-200",
      bg: "from-purple-100 to-purple-200",
      textColor: "text-purple-900",
      valueColor: "text-purple-800",
    },
    {
      key: "All",
      title: "Total Leads",
      value: tileCounts.total,
      border: "border-blue-200",
      bg: "from-blue-100 to-blue-200",
      textColor: "text-blue-900",
      valueColor: "text-blue-800",
    },
    {
      key: "Postponed",
      title: "Postponed Leads",
      value: tileCounts.postponed,
      border: "border-amber-200",
      bg: "from-amber-100 to-amber-200",
      textColor: "text-amber-900",
      valueColor: "text-amber-800",
    },
    {
      key: "Lost",
      title: "Lost Leads",
      value: tileCounts.lost,
      border: "border-red-200",
      bg: "from-red-100 to-red-200",
      textColor: "text-red-900",
      valueColor: "text-red-800",
    },
    {
      key: "Confirmed",
      title: "Confirmed Leads",
      value: tileCounts.confirmed,
      border: "border-green-200",
      bg: "from-green-100 to-green-200",
      textColor: "text-green-900",
      valueColor: "text-green-800",
    },
  ];

  const Pager = ({ totalItems, page, setPage }) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    return (
      <div className="flex items-center gap-2 justify-end mt-3">
        <button className="px-2 py-1 border rounded disabled:opacity-50" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-blue-500 text-white" : "bg-white"}`}>{i + 1}</button>
        ))}
        <button className="px-2 py-1 border rounded disabled:opacity-50" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-semibold">Lead Progress</h2>
        <select value={progressInterval} onChange={(e) => handleIntervalChange(e.target.value)} className="border border-gray-300 rounded px-3 py-1 text-sm">
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="lastWeek">Last Week</option>
          <option value="lastMonth">Last Month</option>
        </select>
        <div className="ml-auto text-sm text-gray-500">Selected Tile: <span className="font-medium">{selectedStatus}</span></div>
      </div>

      {/* Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {tiles.map((t) => {
          const selected = selectedStatus === t.key;
          return (
            <div key={t.key}
              onClick={() => { setSelectedStatus(t.key); setActivePage(1); }}
              className={`cursor-pointer h-36 rounded-lg border-2 ${t.border} shadow-sm flex flex-col items-center justify-center p-2 bg-gradient-to-br ${t.bg} ${selected ? "ring-2 ring-offset-2 ring-indigo-300" : "hover:shadow-md"}`}
              title={`Filter Active Leads by ${t.title}`}
            >
              <div className={`text-sm font-medium ${t.textColor} text-center break-words`}>{t.title}</div>
              <div className={`mt-2 text-3xl font-bold ${t.valueColor}`}>{t.value}</div>
            </div>
          );
        })}
      </div>

      {/* Active Leads table & filters */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-medium">Active Leads</h3>

          <select value={activeCategory} onChange={(e) => { setActiveCategory(e.target.value); setActivePage(1); }} className="border border-gray-300 rounded px-3 py-1 text-sm">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <input type="date" value={activeDate} onChange={(e) => { setActiveDate(e.target.value); setActivePage(1); }} className="border border-gray-300 rounded px-3 py-1 text-sm" />

          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => { setSelectedStatus("All"); setActivePage(1); }} className="px-3 py-1 border rounded text-sm bg-white hover:bg-gray-50">Clear Tile Filter</button>
            <button onClick={exportActiveCSV} className="px-3 py-1 border rounded bg-green-50 text-sm hover:bg-green-100">Export CSV</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-2 text-left">Lead ID</th>
                <th onClick={() => toggleSort("active", "firstName")} className="border px-2 py-2 text-left cursor-pointer">First Name {activeSort.column === "firstName" ? (activeSort.dir === "asc" ? "▲" : "▼") : ""}</th>
                <th onClick={() => toggleSort("active", "lastName")} className="border px-2 py-2 text-left cursor-pointer">Last Name {activeSort.column === "lastName" ? (activeSort.dir === "asc" ? "▲" : "▼") : ""}</th>
                <th className="border px-2 py-2 text-left">Phone</th>
                <th className="border px-2 py-2 text-left">Email</th>
                <th onClick={() => toggleSort("active", "enquiryDate")} className="border px-2 py-2 text-left cursor-pointer">Enquiry Date {activeSort.column === "enquiryDate" ? (activeSort.dir === "asc" ? "▲" : "▼") : ""}</th>
                <th className="border px-2 py-2 text-left">Category</th>
                <th className="border px-2 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {activeVisible.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="border px-2 py-2">{lead.id}</td>
                  <td className="border px-2 py-2">{lead.firstName}</td>
                  <td className="border px-2 py-2">{lead.lastName}</td>
                  <td className="border px-2 py-2">{lead.phone}</td>
                  <td className="border px-2 py-2">{lead.email}</td>
                  <td className="border px-2 py-2">{lead.enquiryDate}</td>
                  <td className="border px-2 py-2">{lead.category}</td>
                  <td className="border px-2 py-2">{lead.status}</td>
                </tr>
              ))}
              {activeVisible.length === 0 && <tr><td colSpan={8} className="text-center py-2">No records found.</td></tr>}
            </tbody>
          </table>
        </div>
        <Pager totalItems={filteredActive.length} page={activePage} setPage={setActivePage} />
      </div>

      {/* Follow-up leads */}
      {showFollowUp && (
        <div className="space-y-2 mt-6 border-t pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-medium">Follow-Up Leads</h3>
            <select value={followCategory} onChange={(e) => { setFollowCategory(e.target.value); setFollowPage(1); }} className="border border-gray-300 rounded px-3 py-1 text-sm">
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={followDate} onChange={(e) => { setFollowDate(e.target.value); setFollowPage(1); }} className="border border-gray-300 rounded px-3 py-1 text-sm" />
            <div className="ml-auto flex items-center gap-2">
              <button onClick={exportFollowCSV} className="px-3 py-1 border rounded bg-green-50 text-sm hover:bg-green-100">Export CSV</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-2 text-left">Lead ID</th>
                  <th onClick={() => toggleSort("follow", "firstName")} className="border px-2 py-2 text-left cursor-pointer">First Name {followSort.column === "firstName" ? (followSort.dir === "asc" ? "▲" : "▼") : ""}</th>
                  <th onClick={() => toggleSort("follow", "lastName")} className="border px-2 py-2 text-left cursor-pointer">Last Name {followSort.column === "lastName" ? (followSort.dir === "asc" ? "▲" : "▼") : ""}</th>
                  <th className="border px-2 py-2 text-left">Phone</th>
                  <th className="border px-2 py-2 text-left">Email</th>
                  <th onClick={() => toggleSort("follow", "followUpDate")} className="border px-2 py-2 text-left cursor-pointer">Follow-Up Date {followSort.column === "followUpDate" ? (followSort.dir === "asc" ? "▲" : "▼") : ""}</th>
                  <th className="border px-2 py-2 text-left">Category</th>
                  <th className="border px-2 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {followVisible.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-2">{lead.id}</td>
                    <td className="border px-2 py-2">{lead.firstName}</td>
                    <td className="border px-2 py-2">{lead.lastName}</td>
                    <td className="border px-2 py-2">{lead.phone}</td>
                    <td className="border px-2 py-2">{lead.email}</td>
                    <td className="border px-2 py-2">{lead.followUpDate}</td>
                    <td className="border px-2 py-2">{lead.category}</td>
                    <td className="border px-2 py-2">{lead.status}</td>
                  </tr>
                ))}
                {followVisible.length === 0 && <tr><td colSpan={8} className="text-center py-2">No records found.</td></tr>}
              </tbody>
            </table>
          </div>
          <Pager totalItems={filteredFollow.length} page={followPage} setPage={setFollowPage} />
        </div>
      )}
    </div>
  );
}
