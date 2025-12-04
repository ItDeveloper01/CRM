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

  const { userRows, travelCategoryRows, travelTotals } = useMemo(() => {
    const travelMap = {};
    const userRows = [];

    leads.forEach((u) => {
      const open = u.openLeads?.length || 0;
      const confirmed = u.confirmedLeads?.length || 0;
      const lost = u.lostLeads?.length || 0;
      const postponed = u.postponedLeads?.length || 0;
     

      userRows.push({
        user: `${u.firstName} ${u.lastName}`,
        open,
        confirmed,
        lost,
        postponed,
        total: open + confirmed + lost + postponed 
      });

      const allLeads = [
        ...(u.openLeads || []),
        ...(u.confirmedLeads || []),
        ...(u.lostLeads || []),
        ...(u.postponedLeads || []),

      ];

     allLeads.forEach((lead) => {
  const cat = lead.categoryName || "Unknown";

  if (!travelMap[cat]) {
    travelMap[cat] = { open: 0, confirmed: 0, lost: 0, postponed: 0, orphan: 0, total: 0 };
  }

  // If no histories → orphan lead
  if (!lead.histories || lead.histories.length === 0) {
    travelMap[cat].orphan++;
  } else {
    const status = lead.histories[0].statusDescription?.toString().toLowerCase() || "";

    if (status === "0" || status === "open") travelMap[cat].open++;
    else if (status === "1" || status === "confirmed") travelMap[cat].confirmed++;
    else if (status === "2" || status === "lost") travelMap[cat].lost++;
    else if (status === "3" || status === "postponed") travelMap[cat].postponed++;
  }

  travelMap[cat].total =
    travelMap[cat].open +
    travelMap[cat].confirmed +
    travelMap[cat].lost +
    travelMap[cat].postponed +
    travelMap[cat].orphan;
});
    });

    const travelCategoryRows = Object.keys(travelMap).map((cat) => ({
  category: cat,
  ...travelMap[cat],
}));

   const travelTotals = {
  category: "TOTAL",
  open: travelCategoryRows.reduce((sum, r) => sum + r.open, 0),
  confirmed: travelCategoryRows.reduce((sum, r) => sum + r.confirmed, 0),
  lost: travelCategoryRows.reduce((sum, r) => sum + r.lost, 0),
  postponed: travelCategoryRows.reduce((sum, r) => sum + r.postponed, 0),
  orphan: travelCategoryRows.reduce((sum, r) => sum + r.orphan, 0),
  total: travelCategoryRows.reduce((sum, r) => sum + r.total, 0),
};

    console.log("User Rows:", userRows);
    console.log("Travel Category Rows:", travelCategoryRows);
    console.log("Travel Totals:", travelTotals);

    return { userRows, travelCategoryRows, travelTotals };
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
      <div className="flex justify-end mb-2">
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
          <table className="min-w-full border rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Open</th>
                <th className="p-2 border">Confirmed</th>
                <th className="p-2 border">Lost</th>
                <th className="p-2 border">Postponed</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {travelCategoryRows.map((r, i) => (
                <tr key={i} className="text-center border">
                  <td className="p-2 font-medium">{r.category}</td>
                  <td className="p-2">{r.open}</td>
                  <td className="p-2">{r.confirmed}</td>
                  <td className="p-2">{r.lost}</td>
                  <td className="p-2">{r.postponed}</td>
                  <td className="p-2 font-bold">{r.total}</td>
                </tr>
              ))}
              <tr className="text-center border font-bold bg-gray-50">
                <td className="p-2">TOTAL</td>
                <td className={`p-2 ${LeadStatusColors["Open"]}`}>{travelTotals.open}</td>
                <td className={`p-2 ${LeadStatusColors["Confirmed"]}`}>{travelTotals.confirmed}</td>
                <td className={`p-2 ${LeadStatusColors["Lost"]}`}>{travelTotals.lost}</td>
                <td className={`p-2 ${LeadStatusColors["Postponed"]}`}>{travelTotals.postponed}</td>
                <td className="p-2">{travelTotals.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* User-wise Summary */}
      <SectionCard title="User-wise Summary">
        <div printBody="">
          <table className="min-w-full border rounded-lg text-sm">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="p-2 border">S.No</th>
                <th className="p-2 border">User</th>
                <th className="p-2 border">Open</th>
                <th className="p-2 border">Confirmed</th>
                <th className="p-2 border">Lost</th>
                <th className="p-2 border">Postponed</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {userRows.map((r, i) => (
                <tr key={i} className="text-center border">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2 font-medium">{r.user}</td>
                  <td className="p-2">{r.open}</td>
                  <td className="p-2">{r.confirmed}</td>
                  <td className="p-2">{r.lost}</td>
                  <td className="p-2">{r.postponed}</td>
                  <td className="p-2 font-bold">{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
