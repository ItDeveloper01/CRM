import React, { useState } from "react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

const HistoryCollapse = ({ histories = [] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Toggle Button with Logo */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-xl bg-blue-600 flex items-center justify-center">
            <ClipboardDocumentListIcon className="w-5 h-5 text-white" />
            <svg
              className={`w-3 h-3 absolute bottom-2 transition-transform duration-200 ${
                open ? "rotate-180" : "rotate-0"
              }`}
              viewBox="0 0 20 20"
              fill="white"
            >
              <path d="M5 7l5 5 5-5H5z" />
            </svg>
          </div>
        </div>

        <span className="text-sm font-medium text-gray-700">
          {open ? "Hide History" : "Show History"}
        </span>
      </button>

      {/* Collapsible Content */}
      {open && (
        <div className="mt-2 flex-1 w-full bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden flex flex-col">
          {histories.length > 0 ? (
            <div className="flex-1 overflow-auto">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-sm border-collapse table-fixed">
                  <thead className="sticky top-0 z-10 bg-gray-100">
                    <tr>
                      <th
                        colSpan={4}
                        className="border px-2 py-2 text-center bg-blue-50 text-blue-700 font-semibold"
                      >
                        History Details
                      </th>
                    </tr>
                    <tr>
                      {/* Auto-distributed columns */}
                      <th className="border px-2 py-1 text-left">Date</th>
                      <th className="border px-2 py-1 text-left">User</th>
                      <th className="border px-2 py-1 text-left">Quote</th>
                      <th className="border px-2 py-1 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {histories.map((h) => (
                      <tr key={h.id} className="hover:bg-gray-50">
                        <td className="border px-2 py-1 whitespace-nowrap">
                          {new Date(h.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>
                        <td className="border px-2 py-1">{h.assigneeTo_UserID || "-"}</td>
                        <td className="border px-2 py-1">{h.quoteGiven || "-"}</td>
                        <td className="border px-2 py-1">{h.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">
              No history available
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryCollapse;
