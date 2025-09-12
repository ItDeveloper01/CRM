import React, { useState } from "react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

// Memoized to prevent unnecessary re-renders
const HistoryHover = React.memo(({ histories = [] }) => {
  const [show, setShow] = useState(false );
  

  return (
    <div
  className="relative flex items-center"
  onMouseEnter={() => setShow(true)}
  onMouseLeave={() => setTimeout(() => setShow(false), 150)}
>
  {/* History Icon */}
  <ClipboardDocumentListIcon
    className="w-6 h-6 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors duration-200"
  />

  {/* Hover Popup */}
  {show && (
    <div 
       className="
        absolute 
        bottom-full 
        mb-0 
        left-0 
        bg-white 
        border 
        border-highlight-NewHoverComponent
        shadow-lg 
        rounded-lg 
        z-50 
         max-w-[90vw]     /* maximum width: 90% of viewport */
    max-h-96        /* maximum height */
        overflow-y-auto
    overflow-x-auto
        p-2
      "
    >
      {histories.length > 0 ? (
        <div>
          
        <table className="w-auto text-sm border-collapse ">
          <thead>
               {/* Extra row for title */}
            <tr className="bg-gray-100 sticky top-0">
              <th   colSpan={4}  className="border px-2 py-2 text-center bg-blue-50 text-blue-700 font-semibold"  >
                History Details
              </th>
            </tr>
            <tr className="bg-gray-100 sticky top-8">
              <th className="border px-2 py-1 text-left">Date</th>
              <th className="border px-2 py-1 text-left">User</th>
              <th className="border px-2 py-1 text-left">Quote</th>
              <th className="border px-2 py-1 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {histories.map((h) => (
              <tr key={h.id} className="hover:bg-gray-50">
                 <td className="border px-2 py-1">
                                  {new Date(h.createdAt).toLocaleString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
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
      ) : (
        <p className="text-gray-500 text-sm text-center py-4">
          No history available
        </p>
      )}
    </div>
  )}
</div>
////////////******************************************************* */
  );
});

export default HistoryHover;
