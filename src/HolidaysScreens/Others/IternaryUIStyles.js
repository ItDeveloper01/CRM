const UI = {

    // ===========================
    // Cards
    // ===========================

    pageCard:
        "bg-white rounded-2xl border border-gray-200 shadow-md p-5",

    sectionCard:
        "bg-white rounded-xl border border-gray-200 shadow-sm p-4",

    sectionTitle:
        "flex items-center gap-2 text-base font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4",

    // ===========================
    // Labels
    // ===========================

    label:
        "text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1 block",

    // ===========================
    // Inputs
    // ===========================

    inputContainer:
        "border border-gray-300 rounded-lg bg-white px-3 py-2 hover:border-blue-400 transition",

    input:
        "h-9 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none",

    select:
        "h-9 w-full rounded-lg border border-gray-300 px-3 text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none",

    // ===========================
    // Buttons
    // ===========================

    primaryButton:
        "h-9 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition shadow-sm",

    secondaryButton:
        "h-9 px-5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 font-medium transition",

    darkButton:
        "h-9 px-5 rounded-lg bg-gray-700 hover:bg-gray-800 text-white font-medium transition shadow-sm",

    // ===========================
    // Destination Chips
    // ===========================

    chipContainer:
        "mt-2 rounded-lg border border-blue-100 bg-blue-50 px-2 py-2",

    chipRow:
        "flex gap-2 overflow-x-auto whitespace-nowrap",

    chip:
        "flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs text-blue-700 shadow-sm",

    // ===========================
    // OR Badge
    // ===========================

    orBadge:
        "flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 border border-gray-300 text-xs font-bold text-gray-600 shadow",

    container: "border rounded-xl p-5 bg-white shadow-sm relative",

    trigger:
        "border rounded-lg h-11 px-3 w-full flex justify-between items-center hover:bg-gray-50",

    dropdown:
        "absolute z-50 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto",

    itemBase:
        "px-3 py-2 cursor-pointer text-sm rounded-md transition-colors flex flex-wrap gap-3",

    itemSelected: "bg-blue-100 font-medium",

    itemNormal: "bg-gray-50 hover:bg-gray-100",

    emptyState:
    "border rounded-xl p-8 text-center text-gray-500 h-[350px]",

  // ONE tourPanel only — fixed height, same for all 3 sections
  tourPanel:
    "border rounded-xl bg-white shadow-sm flex flex-col  h-[350px]",

  tourHeader:
    "px-3 py-2 border-b font-semibold text-sm bg-slate-50 flex-shrink-0",

  tourList:
    "flex-1 overflow-y-auto min-h-0 p-2 space-y-1.5",

  // Compact card — smaller padding so more fit in the same 420px
  tourCard:
    "w-full text-left rounded-lg border px-3 py-2 transition-all duration-200",

  tourCardNormal:
    "border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300",

  tourCardSelected:
    "border-blue-500 bg-blue-50 border-l-4 shadow-sm",
     /*==========================================================
        COMMON PANELS
    ==========================================================*/

    panel:
        "border rounded-xl bg-white shadow-sm h-[600px] flex flex-col",

    panelHeader:
        "px-5 py-4 border-b bg-gray-50 rounded-t-xl font-semibold text-gray-800",

    panelBody:
        "flex-1 overflow-y-auto p-4",


    /*==========================================================
        COMMON SELECTION CARDS
    ==========================================================*/

    selectionCard:
        "w-full text-left rounded-xl border p-4 transition-all duration-200",

    selectionCardNormal:
        "border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-300",

    selectionCardSelected:
        "border-blue-500 bg-blue-50 shadow",


    /*==========================================================
        COMMON CAPSULES / PILLS
    ==========================================================*/

    selectionPill:
        "px-4 h-10 rounded-lg border text-sm transition-all",

    selectionPillNormal:
        "bg-white hover:bg-gray-50",

    selectionPillSelected:
        "bg-blue-600 text-white border-blue-600",


};

const AUDIENCE_COLORS = [
    {
        selected: "bg-blue-600 border-blue-600 text-white",
        light: "bg-blue-50 border-blue-200 text-blue-700"
    },
    {
        selected: "bg-emerald-600 border-emerald-600 text-white",
        light: "bg-emerald-50 border-emerald-200 text-emerald-700"
    },
    {
        selected: "bg-orange-500 border-orange-500 text-white",
        light: "bg-orange-50 border-orange-200 text-orange-700"
    },
    {
        selected: "bg-purple-600 border-purple-600 text-white",
        light: "bg-purple-50 border-purple-200 text-purple-700"
    },
    {
        selected: "bg-pink-600 border-pink-600 text-white",
        light: "bg-pink-50 border-pink-200 text-pink-700"
    },
    {
        selected: "bg-cyan-600 border-cyan-600 text-white",
        light: "bg-cyan-50 border-cyan-200 text-cyan-700"
    }
];
export default UI;

export { AUDIENCE_COLORS };