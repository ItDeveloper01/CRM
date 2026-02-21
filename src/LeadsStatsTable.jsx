import React, { useMemo, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";

export default function LeadStatsTable({ leads }) {
  const fullPrintRef = useRef(null);
  const travelPrintRef = useRef(null);
  const userPrintRef = useRef(null);

  const [selectedUsers, setSelectedUsers] = useState([]);

  /* ---------------- GET ALL USER NAMES ---------------- */
  const allUsers = useMemo(() => {
    return leads.map((u) => `${u.firstName} ${u.lastName}`);
  }, [leads]);

  /* ---------------- PRINT FUNCTION ---------------- */
  const handlePrint = (ref) => {
    const printContents = ref.current.innerHTML;
    const printWindow = window.open("", "", "width=1200,height=800");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: Arial; padding:20px; }
            table { width:100%; border-collapse: collapse; }
            th, td { border:1px solid #ccc; padding:6px; text-align:center; }
            th { background:#f3f4f6; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  /* ---------------- DATA CALCULATION ---------------- */
  const {
    userRows,
    userTotals,
    travelCategoryRows,
    travelTotals
  } = useMemo(() => {
    const travelMap = {};
    const allUserRows = [];

    leads.forEach((u) => {
      const open = u.openLeads?.length || 0;
      const confirmed = u.confirmedLeads?.length || 0;
      const lost = u.lostLeads?.length || 0;
      const postponed = u.postponedLeads?.length || 0;
      const created = u.createdLeads?.length || 0;

      const fullName = `${u.firstName} ${u.lastName}`;

      allUserRows.push({
        user: fullName,
        open,
        confirmed,
        lost,
        postponed,
        created,
      });

      const allLeads = [
        ...(u.openLeads || []),
        ...(u.confirmedLeads || []),
        ...(u.lostLeads || []),
        ...(u.postponedLeads || []),
      ];

      allLeads.forEach((lead) => {
        const cat = lead.categoryName?.trim().toLowerCase() || "uncategorized";

        if (!travelMap[cat]) {
          travelMap[cat] = { open: 0, confirmed: 0, lost: 0, postponed: 0, created: 0 };
        }

        const status =
          lead.histories?.[0]?.statusDescription ?? lead.statusDescription;

        const normalizedStatus = status?.toString().toLowerCase() || "";

        if (normalizedStatus === "0" || normalizedStatus === "open")
          travelMap[cat].open++;
        else if (normalizedStatus === "1" || normalizedStatus === "confirmed")
          travelMap[cat].confirmed++;
        else if (normalizedStatus === "2" || normalizedStatus === "lost")
          travelMap[cat].lost++;
        else if (normalizedStatus === "3" || normalizedStatus === "postponed")
          travelMap[cat].postponed++;
      });

      (u.createdLeads || []).forEach((lead) => {
        const cat = lead.categoryName?.trim().toLowerCase() || "uncategorized";

        if (!travelMap[cat]) {
          travelMap[cat] = { open: 0, confirmed: 0, lost: 0, postponed: 0, created: 0 };
        }

        travelMap[cat].created++;
      });
    });

    const filteredUserRows =
      selectedUsers.length === 0
        ? allUserRows
        : allUserRows.filter((u) => selectedUsers.includes(u.user));

    const userTotals = {
      open: filteredUserRows.reduce((s, r) => s + r.open, 0),
      confirmed: filteredUserRows.reduce((s, r) => s + r.confirmed, 0),
      lost: filteredUserRows.reduce((s, r) => s + r.lost, 0),
      postponed: filteredUserRows.reduce((s, r) => s + r.postponed, 0),
      created: filteredUserRows.reduce((s, r) => s + r.created, 0),
    };

    const travelCategoryRows = Object.keys(travelMap).map((cat) => ({
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      ...travelMap[cat],
    }));

    const travelTotals = {
      open: travelCategoryRows.reduce((s, r) => s + r.open, 0),
      confirmed: travelCategoryRows.reduce((s, r) => s + r.confirmed, 0),
      lost: travelCategoryRows.reduce((s, r) => s + r.lost, 0),
      postponed: travelCategoryRows.reduce((s, r) => s + r.postponed, 0),
      created: travelCategoryRows.reduce((s, r) => s + r.created, 0),
    };

    return { userRows: filteredUserRows, userTotals, travelCategoryRows, travelTotals };
  }, [leads, selectedUsers]);

  const toggleUser = (user) => {
    setSelectedUsers((prev) =>
      prev.includes(user)
        ? prev.filter((u) => u !== user)
        : [...prev, user]
    );
  };

  const toggleAll = () => {
    if (selectedUsers.length === allUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(allUsers);
    }
  };

  return (
    <div className="space-y-8 p-4" ref={fullPrintRef}>

      {/* PRINT ENTIRE */}
      <div className="flex justify-end">
        <button
          onClick={() => handlePrint(fullPrintRef)}
          className="text-xs px-2 py-1 border rounded-md hover:bg-gray-100"
        >
          🖨
        </button>
      </div>

      {/* ---------------- TRAVEL CATEGORY ---------------- */}
      <Card className="rounded-xl shadow-md p-4" ref={travelPrintRef}>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-lg font-bold">
            Travel Category & Overall Status Summary
          </CardTitle>
          <button
            onClick={() => handlePrint(travelPrintRef)}
            className="text-xs px-2 py-1 border rounded-md hover:bg-gray-100"
          >
            🖨
          </button>
        </div>

        <div className="max-h-[420px] overflow-y-auto overflow-x-hidden border rounded">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="border p-2">Sr.No</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Open</th>
                <th className="border p-2">Confirmed</th>
                <th className="border p-2">Lost</th>
                <th className="border p-2">Postponed</th>
                <th className="border p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {travelCategoryRows.map((r, i) => (
                <tr key={i}>
                  <td className="border p-2 text-center">{i + 1}</td>
                  <td className="border p-2">{r.category}</td>
                  <td className="border p-2 text-center">{r.open}</td>
                  <td className="border p-2 text-center">{r.confirmed}</td>
                  <td className="border p-2 text-center">{r.lost}</td>
                  <td className="border p-2 text-center">{r.postponed}</td>
                  <td className="border p-2 text-center">{r.created}</td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-100">
                <td></td>
                <td className="border p-2">TOTAL</td>
                <td className="border p-2 text-center">{travelTotals.open}</td>
                <td className="border p-2 text-center">{travelTotals.confirmed}</td>
                <td className="border p-2 text-center">{travelTotals.lost}</td>
                <td className="border p-2 text-center">{travelTotals.postponed}</td>
                <td className="border p-2 text-center">{travelTotals.created}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* ---------------- USER SUMMARY ---------------- */}
      <Card className="rounded-xl shadow-md p-4" ref={userPrintRef}>
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-lg font-bold">User-wise Summary</CardTitle>
          <button
            onClick={() => handlePrint(userPrintRef)}
            className="text-xs px-2 py-1 border rounded-md hover:bg-gray-100"
          >
            🖨
          </button>
        </div>

        {/* FILTER */}
        <div className="mb-4 border rounded-xl p-3 bg-white shadow-sm">
          <div
            className="overflow-y-auto overflow-x-hidden"
            style={{ height: "70px" }}
          >
            <div className="flex flex-wrap gap-2">
              <button
                onClick={toggleAll}
                className={`px-2 py-1 text-xs rounded-md border transition
                  ${
                    selectedUsers.length === allUsers.length &&
                    allUsers.length > 0
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-500"
                  }
                `}
              >
                All
              </button>

              {allUsers.map((user, index) => {
                const isSelected = selectedUsers.includes(user);

                return (
                  <button
                    key={index}
                    onClick={() => toggleUser(user)}
                    className={`px-2 py-1 text-xs rounded-md border transition
                      ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-500"
                      }
                    `}
                  >
                    {user}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* USER TABLE */}
        <div className="max-h-[420px] overflow-y-auto overflow-x-hidden border rounded">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="border p-2">Sr.No</th>
                <th className="border p-2">User</th>
                <th className="border p-2">Open</th>
                <th className="border p-2">Confirmed</th>
                <th className="border p-2">Lost</th>
                <th className="border p-2">Postponed</th>
                <th className="border p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {userRows.map((r, i) => (
                <tr key={i}>
                  <td className="border p-2 text-center">{i + 1}</td>
                  <td className="border p-2">{r.user}</td>
                  <td className="border p-2 text-center">{r.open}</td>
                  <td className="border p-2 text-center">{r.confirmed}</td>
                  <td className="border p-2 text-center">{r.lost}</td>
                  <td className="border p-2 text-center">{r.postponed}</td>
                  <td className="border p-2 text-center">{r.created}</td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-100">
                <td></td>
                <td className="border p-2">TOTAL</td>
                <td className="border p-2 text-center">{userTotals.open}</td>
                <td className="border p-2 text-center">{userTotals.confirmed}</td>
                <td className="border p-2 text-center">{userTotals.lost}</td>
                <td className="border p-2 text-center">{userTotals.postponed}</td>
                <td className="border p-2 text-center">{userTotals.created}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}