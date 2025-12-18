import React, { useMemo, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Printer } from "lucide-react";

const LeadStatusColors = {
  Open: "text-yellow-600",
  Confirmed: "text-green-600",
  Lost: "text-red-600",
  Postponed: "text-purple-600",
};

export default function LeadStatsTable({ leads }) {
  const printRef = useRef();

//   const { userRows, travelCategoryRows, travelTotals } = useMemo(() => {
//     const travelMap = {};
//     const userRows = [];

//     leads.forEach((u) => {
//       const open = u.openLeads?.length || 0;
//       const confirmed = u.confirmedLeads?.length || 0;
//       const lost = u.lostLeads?.length || 0;
//       const postponed = u.postponedLeads?.length || 0;
//       const created = u.createdLeads?.length || 0;
     
//       debugger;

//       userRows.push({
//         user: `${u.firstName} ${u.lastName}`,
//         open,
//         confirmed,
//         lost,
//         postponed,
//         created,
//         // total: open + confirmed + lost + postponed 
//       });

//       const allLeads = [
//         ...(u.openLeads || []),
//         ...(u.confirmedLeads || []),
//         ...(u.lostLeads || []),
//         ...(u.postponedLeads || []),
//       ];

//      allLeads.forEach((lead) => {
//       debugger;
//   const cat = lead.categoryName || "Orphan";
//   // const cat = lead.categoryName && lead.categoryName.trim() !== "" 
//   //   ? lead.categoryName 
//   //   : "Uncategorized";

//   if (!travelMap[cat]) {
//     travelMap[cat] = { open: 0, confirmed: 0, lost: 0, postponed: 0, orphan: 0,created:0, total: 0 };
//   }

//  // travelMap[cat].created++;
//   // If no histories → orphan lead
//   if (!lead.histories || lead.histories.length === 0) {
//     travelMap[cat].orphan++;
//     const status = lead.statusDescription?.toString().toLowerCase() || "";
//     if (status === "0" || status === "open") travelMap[cat].open++;
//     else if (status === "1" || status === "confirmed") travelMap[cat].confirmed++;
//     else if (status === "2" || status === "lost") travelMap[cat].lost++;
//     else if (status === "3" || status === "postponed") travelMap[cat].postponed++;
    
//   } else {
//     const status = lead.histories[0].statusDescription?.toString().toLowerCase() || "";
  
//     if (status === "0" || status === "open") travelMap[cat].open++;
//     else if (status === "1" || status === "confirmed") travelMap[cat].confirmed++;
//     else if (status === "2" || status === "lost") travelMap[cat].lost++;
//     else if (status === "3" || status === "postponed") travelMap[cat].postponed++;
//   }

//   travelMap[cat].total =
//     travelMap[cat].open +
//     travelMap[cat].confirmed +
//     travelMap[cat].lost +
//     travelMap[cat].postponed ;
   

//     // +travelMap[cat].orphan;
// });
//     });

//     const travelCategoryRows = Object.keys(travelMap).map((cat) => ({
//   category: cat,
//   ...travelMap[cat],
// }));

//    const travelTotals = {
    
//   category: "TOTAL",
//   open: travelCategoryRows.reduce((sum, r) => sum + r.open, 0),
//   confirmed: travelCategoryRows.reduce((sum, r) => sum + r.confirmed, 0),
//   lost: travelCategoryRows.reduce((sum, r) => sum + r.lost, 0),
//   postponed: travelCategoryRows.reduce((sum, r) => sum + r.postponed, 0),
//   orphan: travelCategoryRows.reduce((sum, r) => sum + r.orphan, 0),
//   created: travelCategoryRows.reduce((sum, r) => sum + r.created, 0),
//   total: travelCategoryRows.reduce((sum, r) => sum + r.total, 0),
// };

//     console.log("User Rows:", userRows);
//     console.log("Travel Category Rows:", travelCategoryRows);
//     console.log("Travel Totals:", travelTotals);

//     return { userRows, travelCategoryRows, travelTotals };
//   }, [leads]);

const {
  userRows,
  userTotals,
  travelCategoryRows,
  travelTotals
} = useMemo(() => {
  const travelMap = {};
  const userRows = [];

  leads.forEach((u) => {
    // ---------- USER LEVEL COUNTS ----------
    const open = u.openLeads?.length || 0;
    const confirmed = u.confirmedLeads?.length || 0;
    const lost = u.lostLeads?.length || 0;
    const postponed = u.postponedLeads?.length || 0;
    const created = u.createdLeads?.length || 0;

    userRows.push({
      user: `${u.firstName} ${u.lastName}`,
      open,
      confirmed,
      lost,
      postponed,
      created,
    });

    // ---------- STATUS LEADS ----------
    const allLeads = [
      ...(u.openLeads || []),
      ...(u.confirmedLeads || []),
      ...(u.lostLeads || []),
      ...(u.postponedLeads || []),
    ];

    allLeads.forEach((lead) => {
      const cat =
        lead.categoryName?.trim().toLowerCase() || "uncategorized";

      if (!travelMap[cat]) {
        travelMap[cat] = {
          open: 0,
          confirmed: 0,
          lost: 0,
          postponed: 0,
          orphan: 0,
          created: 0,
          total: 0,
        };
      }

      if (!lead.histories || lead.histories.length === 0) {
        travelMap[cat].orphan++;
      }

      const status =
        lead.histories?.[0]?.statusDescription ??
        lead.statusDescription;

      const normalizedStatus = status?.toString().toLowerCase() || "";

      if (normalizedStatus === "0" || normalizedStatus === "open")
        travelMap[cat].open++;
      else if (normalizedStatus === "1" || normalizedStatus === "confirmed")
        travelMap[cat].confirmed++;
      else if (normalizedStatus === "2" || normalizedStatus === "lost")
        travelMap[cat].lost++;
      else if (normalizedStatus === "3" || normalizedStatus === "postponed")
        travelMap[cat].postponed++;

      travelMap[cat].total =
        travelMap[cat].open +
        travelMap[cat].confirmed +
        travelMap[cat].lost +
        travelMap[cat].postponed;
    });

    // ---------- CREATED LEADS ----------
    (u.createdLeads || []).forEach((lead) => {
      const cat =
        lead.categoryName?.trim().toLowerCase() || "uncategorized";

      if (!travelMap[cat]) {
        travelMap[cat] = {
          open: 0,
          confirmed: 0,
          lost: 0,
          postponed: 0,
          orphan: 0,
          created: 0,
          total: 0,
        };
      }

      travelMap[cat].created++;
    });
  });

  // ---------- CATEGORY ROWS ----------
  const travelCategoryRows = Object.keys(travelMap).map((cat) => ({
    category: cat.charAt(0).toUpperCase() + cat.slice(1),
    ...travelMap[cat],
  }));

  // ---------- CATEGORY TOTAL ----------
  const travelTotals = {
    category: "TOTAL",
    open: travelCategoryRows.reduce((s, r) => s + r.open, 0),
    confirmed: travelCategoryRows.reduce((s, r) => s + r.confirmed, 0),
    lost: travelCategoryRows.reduce((s, r) => s + r.lost, 0),
    postponed: travelCategoryRows.reduce((s, r) => s + r.postponed, 0),
    orphan: travelCategoryRows.reduce((s, r) => s + r.orphan, 0),
    created: travelCategoryRows.reduce((s, r) => s + r.created, 0),
    total: travelCategoryRows.reduce((s, r) => s + r.total, 0),
  };

  // ---------- USER TOTAL ----------
  const userTotals = {
    user: "TOTAL",
    open: userRows.reduce((s, r) => s + r.open, 0),
    confirmed: userRows.reduce((s, r) => s + r.confirmed, 0),
    lost: userRows.reduce((s, r) => s + r.lost, 0),
    postponed: userRows.reduce((s, r) => s + r.postponed, 0),
    created: userRows.reduce((s, r) => s + r.created, 0),
  };

  return {
    userRows,
    userTotals,
    travelCategoryRows,
    travelTotals,
  };
}, [leads]);



  const printSection = (ref) => {
    const content = ref.current;
    const pri = window.open("", "PRINT", "height=800,width=1000");
    pri.document.write("<html><head><title>Print</title></head><body>");
    pri.document.write(content.innerHTML);
    pri.document.write("</body></html>");
    pri.document.close();
    pri.focus();
    pri.print();
  };

  const SectionCard = ({ title, children }) => (
    <Card className="shadow-md border rounded-xl p-3">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <Button
          size="sm"
          variant="outline"
          className="p-2"
          onClick={() => printSection({ current: { innerHTML: children.props.printBody } })}
        >
          <Printer className="w-4 h-4 text-blue-600" />
        </Button>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 p-4" ref={printRef}>
      <div className="flex justify-end items-center">
        <Button
          size="sm"
          onClick={() => printSection(printRef)}
          className="flex items-center gap-1"
        >
          <Printer className="w-4 h-4" /> Full Page
        </Button>
      </div>

      {/* Travel Category + Overall Status */}
      <SectionCard title="Travel Category & Overall Status Summary">
        <div printBody="">
          {/* <table className="min-w-full border rounded-lg text-sm"> */}
          {/* <table className="min-w-full table-auto border border-gray-300 border-collapse text-sm"> */}
          <table className="w-full min-w-full table-auto border border-gray-300 border-collapse text-sm">

            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="p-2 border border-gray-300 w-[10%]">Sr.No.</th>
                <th className="p-2 border border-gray-300 w-[30%]">Category</th>
                <th className="p-2 border border-gray-300">Open</th>
                <th className="p-2 border border-gray-300">Confirmed</th>
                <th className="p-2 border border-gray-300">Lost</th>
                <th className="p-2 border border-gray-300">Postponed</th>
                <th className="p-2 border border-gray-300">Created</th>
                {/* <th className="p-2 border border-gray-300">Total</th> */}
              </tr>
            </thead>
            <tbody>
              {travelCategoryRows.map((r, i) => (
                <tr key={i} className="text-center border border-gray-300">
                  <td className="p-2 border border-gray-300">{i + 1}</td>  
                  <td className="p-2 ps-4 font-medium text-left border border-gray-300">{r.category}</td>
                  <td className="p-2 border border-gray-300">{r.open}</td>
                  <td className="p-2 border border-gray-300">{r.confirmed}</td>
                  <td className="p-2 border border-gray-300">{r.lost}</td>
                  <td className="p-2 border border-gray-300">{r.postponed}</td>
                  <td className="p-2 border border-gray-300">{r.created}</td>
                  {/* <td className="p-2 font-bold border border-gray-300">{r.total}</td> */}
                </tr>
              ))}
              <tr className="text-center border border-gray-300 font-bold bg-gray-50">
                <td></td>
                <td className="p-2 border border-gray-300">TOTAL</td>
                <td className={`p-2 border border-gray-300 ${LeadStatusColors["Open"]}`}>{travelTotals.open}</td>
                <td className={`p-2 border border-gray-300 ${LeadStatusColors["Confirmed"]}`}>{travelTotals.confirmed}</td>
                <td className={`p-2 border border-gray-300 ${LeadStatusColors["Lost"]}`}>{travelTotals.lost}</td>
                <td className={`p-2 border border-gray-300 ${LeadStatusColors["Postponed"]}`}>{travelTotals.postponed}</td>
                <td className={`p-2 border border-gray-300 ${LeadStatusColors["Created"]}`}>{travelTotals.created}</td>
                {/* <td className="p-2 border border-gray-300">{travelTotals.total}</td> */}
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* User-wise Summary */}
    <SectionCard title="User-wise Summary">
  <div printBody="">
    <div className="max-h-[360px] overflow-y-auto border border-gray-100 ">
      <table className="w-full min-w-full table-auto border-collapse text-sm">

        <thead className="sticky top-0 bg-gray-100 z-10">
          <tr className="text-center">
            <th className="p-2 border border-gray-300 w-[10%]">Sr.No</th>
            <th className="p-2 border border-gray-300 w-[30%]">User</th>
            <th className="p-2 border border-gray-300">Open</th>
            <th className="p-2 border border-gray-300">Confirmed</th>
            <th className="p-2 border border-gray-300">Lost</th>
            <th className="p-2 border border-gray-300">Postponed</th>
            <th className="p-2 border border-gray-300">Created</th>
          </tr>
        </thead>

        <tbody>
          {userRows.map((r, i) => (
            <tr key={i} className="text-center border border-gray-300">
              <td className="p-2 border border-gray-300">{i + 1}</td>
              <td className="p-2 ps-4 font-medium text-left border border-gray-300">
                {r.user}
              </td>
              <td className="p-2 border border-gray-300">{r.open}</td>
              <td className="p-2 border border-gray-300">{r.confirmed}</td>
              <td className="p-2 border border-gray-300">{r.lost}</td>
              <td className="p-2 border border-gray-300">{r.postponed}</td>
              <td className="p-2 border border-gray-300">{r.created}</td>
            </tr>
          ))}

          {/* TOTAL ROW */}
          <tr className="text-center font-bold bg-gray-50 border border-gray-300">
            <td></td>
            <td className="p-2 border border-gray-300">TOTAL</td>
            <td className="p-2 border border-gray-300">{userTotals.open}</td>
            <td className="p-2 border border-gray-300">{userTotals.confirmed}</td>
            <td className="p-2 border border-gray-300">{userTotals.lost}</td>
            <td className="p-2 border border-gray-300">{userTotals.postponed}</td>
            <td className="p-2 border border-gray-300">{userTotals.created}</td>
          </tr>
        </tbody>

      </table>
    </div>
  </div>
</SectionCard>

    </div>
  );
}
