import React, { useMemo, useState } from "react";
import UpdateLeadsModal from "./UpdateLeadsModal";
import { getEmptyLeadObj } from "./Model/LeadModel";

/*---------------------------------------------------
    CONSTANTS
----------------------------------------------------*/

const CATEGORY_ICON_RULES = [
  { test: (n) => n.includes("holiday"), icon: "🏖️" },
  { test: (n) => n.includes("visa"), icon: "🌍" },
  { test: (n) => n.includes("air") || n.includes("ticket"), icon: "✈️" },
  { test: (n) => n.includes("car") || n.includes("rental"), icon: "🚗" },
  { test: (n) => n.includes("forex"), icon: "💱" },
  { test: (n) => n.includes("cruise"), icon: "🛳️" },
  { test: (n) => n.includes("insurance"), icon: "🛡️" }
];

function getCategoryIcon(categoryName) {
  const normalized = (categoryName || "").trim().toLowerCase();
  const rule = CATEGORY_ICON_RULES.find((r) => r.test(normalized));
  return rule ? rule.icon : "📁";
}

const STATUS_CLASSES = {
  Open: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-green-100 text-green-800",
  Lost: "bg-red-100 text-red-700",
  Cancelled: "bg-red-100 text-red-700",
  FollowUp: "bg-blue-100 text-blue-700",
  "Follow Up": "bg-blue-100 text-blue-700",
  Postponed: "bg-purple-100 text-purple-700"
};

// Only an Open lead can be edited; every other status opens read-only.
const EDITABLE_STATUS = "Open";

const TRIP_TYPE_CLASSES = {
  domestic: "bg-teal-100 text-teal-700",
  international: "bg-indigo-100 text-indigo-700"
};

const LEAD_TYPE_CLASSES = {
  git: "bg-amber-100 text-amber-700",
  fit: "bg-pink-100 text-pink-700"
};

function getTripTypeClass(tripType) {
  const key = (tripType || "").trim().toLowerCase();
  return TRIP_TYPE_CLASSES[key] || "bg-gray-100 text-gray-600";
}

function getLeadTypeClass(leadType) {
  const key = (leadType || "").trim().toLowerCase();
  return LEAD_TYPE_CLASSES[key] || "bg-gray-100 text-gray-600";
}

const COL_MAX_HEIGHT = "max-h-72";

// fr-based (not fixed px + one greedy 1fr) so columns grow proportionally
// together and the row fills full width cleanly whether it's in the
// split two-list layout or expanded to a single full-width list.
const GRID_TEMPLATE =
  "grid-cols-[28px_1.3fr_1fr_0.8fr_0.9fr_1.2fr_60px]";

const S = {
  colHeader:
    "flex items-center justify-between px-2.5 py-1.5 bg-gray-50 border-b border-gray-200",

  colTitle:
    "text-[11px] font-bold text-gray-700 uppercase tracking-wide",

  colCount:
    "text-[10px] font-semibold text-gray-500 bg-white rounded-full px-1.5 py-0.5 border border-gray-200",

  scrollBody: `${COL_MAX_HEIGHT} overflow-y-auto`,

  tableHeader:
    `sticky top-0 z-10 grid ${GRID_TEMPLATE} items-center gap-1.5 px-2.5 py-1 bg-gray-100 border-b border-gray-300 text-[10px] font-bold uppercase tracking-wide text-gray-600`,

  rowMain:
    `grid ${GRID_TEMPLATE} items-center gap-1.5 px-2.5 py-1.5 text-[11px]`,

  rowWrapper:
    "border-b border-gray-100 hover:bg-blue-50 transition",

  status:
    "px-1.5 py-0.5 rounded text-[9px] font-semibold whitespace-nowrap inline-flex justify-center",

  viewBtn:
    "text-blue-600 hover:text-blue-800 font-semibold text-[11px]",

  locked:
    "text-gray-400 text-base leading-none",

  capsule:
    "inline-flex items-center rounded-full px-1.5 py-[1px] text-[8px] font-semibold uppercase tracking-wide w-fit whitespace-nowrap"
};

/*---------------------------------------------------
    HELPERS
----------------------------------------------------*/

function getStatusClass(status) {
  return STATUS_CLASSES[status] ?? "bg-gray-100 text-gray-700";
}

function isEditableStatus(status) {
  return status === EDITABLE_STATUS;
}

export function formatDate(dateInput) {
  if (!dateInput) return "-";

  const date =
    typeof dateInput === "string"
      ? new Date(dateInput)
      : dateInput;

  if (isNaN(date.getTime()))
    return "-";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function clean(str) {
  return typeof str === "string"
    ? str.trim()
    : str;
}

/*---------------------------------------------------
    STATIC TABLE HEADER
----------------------------------------------------*/

const TableHeader = () => (
  <div className={S.tableHeader}>
    <div></div>
    <div>Category</div>
    <div>Type</div>
    <div>Status</div>
    <div>Enquiry</div>
    <div>Assigned To</div>
    <div className="text-right">Action</div>
  </div>
);

/*---------------------------------------------------
    LEAD ROW
----------------------------------------------------*/

const LeadRow = ({
  lead,
  icon,
  category,
  status,
  enquiryDate,
  assignedToName,
  assignedToUserId,
  hasAccess,
  onView,
  expanded
}) => {

  const isHoliday =
    category === "HOLIDAY" ||
    category === "Holiday";

  const tripType = lead.category?.tripType;
  const leadType = lead.category?.leadType;
  const destinations = lead.category?.requestedDestinations;

  const showDestinationsInline = expanded && isHoliday && destinations;

  return (
    <div className={S.rowWrapper}>

      <div className={S.rowMain}>

        <div className="text-base">
          {icon}
        </div>

        {/* Category — just the name (+ destinations tooltip/inline), no capsules here anymore */}
        <div className="flex flex-col gap-0.5 min-w-0">

          <span
            className={`font-medium text-gray-800 truncate ${isHoliday && !expanded ? "cursor-help" : ""}`}
            title={isHoliday && !expanded ? (destinations || undefined) : undefined}
          >
            {category}
          </span>

          {showDestinationsInline && (
            <div
              className="text-[10px] text-gray-500 truncate"
              title={destinations}
            >
              📍 {destinations}
            </div>
          )}

        </div>

        {/* Type — dedicated column, trip type on top, lead type below.
            Always the same width/position regardless of category text length,
            so capsules line up across every row. */}
        <div className="flex flex-col gap-1">
          {isHoliday && tripType && (
            <span className={`${S.capsule} ${getTripTypeClass(tripType)}`}>
              {tripType}
            </span>
          )}
          {isHoliday && leadType && (
            <span className={`${S.capsule} ${getLeadTypeClass(leadType)}`}>
              {leadType}
            </span>
          )}
        </div>

        <div>
          <span className={`${S.status} ${getStatusClass(status)}`}>
            {status || "-"}
          </span>
        </div>

        <div className="text-gray-600">
          {enquiryDate}
        </div>

        <div
          className="truncate text-gray-700"
          title={assignedToUserId}
        >
          {assignedToName || "-"}
        </div>

        <div className="text-right">

          {hasAccess ? (
            <button
              onClick={onView}
              className={S.viewBtn}
            >
              View
            </button>
          ) : (
            <span
              className={S.locked}
              title="You don't have permission"
            >
              🔒
            </span>
          )}

        </div>

      </div>

    </div>
  );
};
/*---------------------------------------------------
    COMPONENT
----------------------------------------------------*/

const LeadsTableForExistingPhone = ({ followLeads = [] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedLead, setSelectedLead] = useState(getEmptyLeadObj());

  const { customer, myLeads, otherDepartmentLeads } = useMemo(() => {
    const allVerticleLeads = followLeads.flatMap(
      (entry) => entry?.verticleLeads || []
    );

    const mine = allVerticleLeads.filter((x) => x.hasAccess);
    const others = allVerticleLeads.filter((x) => !x.hasAccess);

    const firstMain = followLeads[0]?.mainLead;

    const cust = firstMain
      ? {
          title: clean(firstMain.title),
          firstName: clean(firstMain.fName),
          lastName: clean(firstMain.lName),
          mobile: firstMain.mobileNo
        }
      : null;

    return {
      customer: cust,
      myLeads: mine,
      otherDepartmentLeads: others
    };
  }, [followLeads]);

  const handleViewClick = (lead, status) => {
    setSelectedLead(lead);
    setModalMode(isEditableStatus(status) ? "edit" : "view");
    setModalOpen(true);
  };

  const hasMine = myLeads.length > 0;
  const hasOthers = otherDepartmentLeads.length > 0;
  const showBothColumns = hasMine && hasOthers;
  const expanded = !showBothColumns;

  const renderLeadRow = (item) => {
    const lead = item.lead;
    const status = lead.statusDescription;

    return (
      <LeadRow
        key={`${lead.categoryId}-${lead.leadID}`}
        lead={lead}
        icon={getCategoryIcon(lead.categoryName)}
        category={lead.categoryName}
        status={status}
        enquiryDate={formatDate(
          lead.category?.createdAt || lead.createdAt
        )}
        assignedToName={lead.leadAssignedToName}
        assignedToUserId={
          lead.assignedToUserId ?? lead.leadAssignedTo
        }
        hasAccess={item.hasAccess}
        expanded={expanded}
        onView={
          item.hasAccess
            ? () => handleViewClick(lead, status)
            : undefined
        }
      />
    );
  };

  const gridClass = showBothColumns
    ? "grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200"
    : "grid grid-cols-1";

  return (
    <>
      <div className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">

        {customer && (
          <div className="flex items-center gap-2.5 px-3 py-2 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">

            <div className="text-2xl">
              👤
            </div>

            <div>

              <div className="text-[9px] uppercase tracking-wider text-blue-600 font-bold">
                Existing Customer Found
              </div>

              <div className="text-sm font-bold text-gray-800">
                {customer.title}{" "}
                {customer.firstName}{" "}
                {customer.lastName}
              {/* </div>
 <div className="text-xs text-gray-500"> */}
              <span className="text-xs text-gray-500">    📞 {customer.mobile}</span>
              </div>
             

            </div>

          </div>
        )}

        <div className={gridClass}>

          {hasMine && (

            <div>

              <div className={S.colHeader}>

                <span className={S.colTitle}>
                  🟢 My Leads
                </span>

                <span className={S.colCount}>
                  {myLeads.length}
                </span>

              </div>

              <div className={S.scrollBody}>

                <TableHeader />

                {myLeads.map(renderLeadRow)}

              </div>

            </div>

          )}

          {hasOthers && (

            <div>

              <div className={S.colHeader}>

                <span className={S.colTitle}>
                  🔒 Other Department
                </span>

                <span className={S.colCount}>
                  {otherDepartmentLeads.length}
                </span>

              </div>

              <div className={S.scrollBody}>

                <TableHeader />

                {otherDepartmentLeads.map(renderLeadRow)}

              </div>

            </div>

          )}

        </div>

      </div>

      <UpdateLeadsModal
        parent="Lead Table for existing Phone no"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        lead={selectedLead}
        mode={modalMode}
        viewAllLeads={false}
      />
    </>
  );
};

export default LeadsTableForExistingPhone;