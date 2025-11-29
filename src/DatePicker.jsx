import React, { useState } from "react";

// Centralized CRM Color Constants
export const CRM_COLORS = {
  primaryBlue: "#1f6f8b",
  hoverBlue: "#145268",
  lightBlue: "#e8f4fa",
  blueBorder: "#60A5FA",
  blueBG: "#DBEAFE",
  bgSoft: "#F5FAFD",
  borderSoft: "#c7e3ef"
};

// OPTION B — FULLY INTERACTIVE DROPDOWN WITH CUSTOM DATE PICKER INSIDE
// Clean, compact, CRM‑friendly theme

export default function DateRangeSelector({ onRangeChange }) {
  const [open, setOpen] = useState(false);        // dropdown open/close
  const [mode, setMode] = useState("quick");      // quick | custom
  const [range, setRange] = useState({ from: "", to: "" });

  const today = new Date();
  const yesterday = new Date(today.getTime() - 86400000);
  const last7 = new Date(today.getTime() - 86400000 * 7);
  const last30 = new Date(today.getTime() - 86400000 * 30);
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const format = (d) => d.toISOString().slice(0, 10);

  const applyQuick = (from, to) => {
    const obj = { from: format(from), to: format(to) };
    setRange(obj);
    setMode("quick");
    if (onRangeChange) onRangeChange(obj);
    setOpen(false);
  };

  const applyCustom = () => {
    if (!range.from || !range.to) return;
    if (onRangeChange) onRangeChange(range);
    setOpen(false);
    console.log("Custom Range Applied:", range);
    debugger;
  };

  return (
    <div className="relative inline-block w-72 ml-auto text-gray-700 bg-\[#F5FAFD\] p-2 rounded-xl border border-\[#c7e3ef\]">
      {/* Dropdown trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-2 border rounded-lg shadow-sm bg-[#F5FAFD] text-left focus:ring-2 focus:ring-[#1f6f8b]"
      >
        {range.from && range.to
          ? `${range.from} → ${range.to}`
          : "Select Date Range"}
      </button>

      {open && (
        <div className="absolute mt-2 w-72 right-0 bg-[#F5FAFD] border border-\[\#1f6f8b33\] shadow-xl rounded-xl z-20 p-3 animate-fade-in">
          <div className="text-xs font-semibold text-gray-500 mb-2">Quick Ranges</div>

          {/* Quick selections */}
          <div className="flex flex-col gap-2 mb-3">
            <button onClick={() => applyQuick(today, today)} className="dropdown-item">Today</button>
            <button onClick={() => applyQuick(yesterday, yesterday)} className="dropdown-item">Yesterday</button>
            <button onClick={() => applyQuick(last7, today)} className="dropdown-item">Last 7 Days</button>
            <button onClick={() => applyQuick(last30, today)} className="dropdown-item">Last 30 Days</button>
            <button onClick={() => applyQuick(firstOfMonth, today)} className="dropdown-item">This Month</button>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 my-2"></div>

          <div className="text-xs font-semibold text-gray-500 mb-2">Custom Range</div>

          {/* Custom range inputs inside dropdown */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between gap-2">
              <input
                type="date"
                value={range.from}
                onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
                className="border border-[#c7e3ef] px-2 py-2 rounded-lg bg-white w-1/2 text-sm focus:ring-2 focus:ring-[#1f6f8b]"
              />
              <input
                type="date"
                value={range.to}
                onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
                className="border border-[#c7e3ef] px-2 py-2 rounded-lg bg-white w-1/2 text-sm focus:ring-2 focus:ring-[#1f6f8b]"
              />
            </div>

            <button
              onClick={applyCustom}
              className="px-4 py-2 bg-[#1f6f8b] text-white rounded-lg shadow text-sm hover:bg-[#145268]"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Tailwind helper styles */}
      <style>{`
        .dropdown-item {
          padding: 6px 10px;
          text-align: left;
          border-radius: 8px;
          transition: 0.15s;
          font-size: 14px;
        }
        .dropdown-item:hover {
          background: #DBEAFE;
          color: #60A5FA;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}

// --- Color Palette Preview (for visualization) ---
export function CRMColorPalette() {
  const colors = [
    { name: "Primary Blue", value: "#1f6f8b" },
    { name: "Hover Blue", value: "#145268" },
    { name: "Light Blue", value: "#e8f4fa" }
  ];

  return (
    <div className="flex gap-4 mt-6 p-4 border rounded-xl bg-[#F5FAFD] shadow">
      {colors.map((c) => (
        <div key={c.value} className="flex flex-col items-center text-sm">
          <div
            className="w-12 h-12 rounded-lg border"
            style={{ background: c.value }}
          ></div>
          <div className="mt-1 text-gray-700">{c.name}</div>
          <div className="text-[10px] text-gray-500">{c.value}</div>
        </div>
      ))}
    </div>
  );
}

// Demo wrapper to display the selector + color palette
export function DateRangeDemo() {
  return (
    <div className="p-4 space-y-6">
      <DateRangeSelector />
      <CRMColorPalette />
    </div>
  );
}


// --- Demo Preview Mount (Appended) ---
export function DateRangeDemoPreview() {
  return (
    <div className="p-4 space-y-6 bg-\[\#e8f4fa\] rounded-xl border mt-6">
      <h2 className="text-lg font-semibold text-gray-700">Date Range Selector Demo</h2>
      <DateRangeSelector />
      <CRMColorPalette />
    </div>
  );
}
