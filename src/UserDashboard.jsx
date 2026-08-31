import React, { useState, useMemo } from "react";
import {
  Phone,
  MessageSquarePlus,
  CalendarClock,
  Eye,
  Search,
  X,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  ListChecks,
  PhoneCall,
  MapPin,
  RotateCcw,
  ChevronDown,
  MessageSquare,
  FileText,
  Award,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

/* ------------------------------------------------------------------ */
/* Reference "today" for this demo dataset                             */
/* ------------------------------------------------------------------ */
const TODAY = new Date(2026, 6, 29); // 29 Jul 2026

const TEAM_MEMBERS = [
  { id: "gayatri", name: "Gayatri Nair", pending: 14 },
  { id: "sneha", name: "Sneha Kulkarni", pending: 9 },
  { id: "kunal", name: "Kunal Verma", pending: 11 },
  { id: "priya", name: "Priya Deshmukh", pending: 6 },
];
const TEAM_IDS = TEAM_MEMBERS.map((e) => e.id);
const ALL_PEOPLE = [...TEAM_MEMBERS, { id: "rajesh", name: "Rajesh Kumar", pending: 2 }];
const nameOf = (id) => ALL_PEOPLE.find((e) => e.id === id)?.name ?? id;
const initialsOf = (id) =>
  nameOf(id)
    .split(" ")
    .map((s) => s[0])
    .join("");

const USERS = {
  exec: { id: "gayatri", name: "Gayatri Nair", title: "Sales Executive", hasTeam: false },
  lead: { id: "rajesh", name: "Rajesh Kumar", title: "Team Lead", hasTeam: true },
};

function addDays(base, n) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}
function fmtDate(d) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/* ------------------------------------------------------------------ */
/* Dummy lead data                                                     */
/* ------------------------------------------------------------------ */
const RAW_LEADS = [
  { customer: "Rahul Sharma", phone: "+91 98200 11234", destination: "Japan", category: "Honeymoon", status: "Follow-up", priority: "High", executiveId: "gayatri", offset: 0, time: "10:30 AM", comment: "Wants to travel in December. Waiting for wife's passport renewal before confirming final dates.", commentTime: "Today, 9:12 AM", isNewToday: false },
  { customer: "Meera Iyer", phone: "+91 99870 22341", destination: "Bali", category: "Honeymoon", status: "Quote Sent", priority: "Medium", executiveId: "gayatri", offset: -2, time: "11:00 AM", comment: "Sent revised quote with resort upgrade. Husband still comparing with another agency's package.", commentTime: "2 days ago, 4:20 PM", isNewToday: false },
  { customer: "Arjun Mehta", phone: "+91 98110 45632", destination: "Switzerland", category: "Family", status: "Open", priority: "High", executiveId: "sneha", offset: -1, time: "3:00 PM", comment: "Family of 5, needs child-friendly itinerary. Asked for Interlaken hotel options with a mountain view.", commentTime: "Yesterday, 1:05 PM", isNewToday: false },
  { customer: "Kavita Rao", phone: "+91 90040 87651", destination: "Dubai", category: "Corporate", status: "Follow-up", priority: "Medium", executiveId: "kunal", offset: 0, time: "1:00 PM", comment: "Company retreat for 12 pax. Finance team approving budget by Friday, needs updated quote.", commentTime: "Today, 8:45 AM", isNewToday: false },
  { customer: "Suresh Pillai", phone: "+91 98450 33221", destination: "Kerala Backwaters", category: "Senior Citizen", status: "Confirmed", priority: "Low", executiveId: "priya", offset: 3, time: "", comment: "Booking confirmed — houseboat + Ayurveda package. Following up only for the final payment reminder.", commentTime: "3 days ago", isNewToday: false },
  { customer: "Nisha Kapoor", phone: "+91 97690 12098", destination: "Thailand (Phuket)", category: "Solo", status: "New Lead", priority: "High", executiveId: "gayatri", offset: 0, time: "4:30 PM", comment: "First-time solo traveler, budget conscious. Interested in a small-group tour rather than solo package.", commentTime: "Today, 11:30 AM", isNewToday: true },
  { customer: "Vikram Singh", phone: "+91 98330 76543", destination: "Maldives", category: "Honeymoon", status: "Quote Sent", priority: "High", executiveId: "sneha", offset: -3, time: "10:00 AM", comment: "Overwater villa quote shared twice. Not responding to calls — tried WhatsApp yesterday, no reply yet.", commentTime: "3 days ago, 5:15 PM", isNewToday: false },
  { customer: "Anjali Desai", phone: "+91 90210 55432", destination: "Singapore", category: "Family", status: "Follow-up", priority: "Medium", executiveId: "kunal", offset: 1, time: "9:30 AM", comment: "Kids on winter break, wants a Universal Studios add-on. Confirming a hotel near Marina Bay.", commentTime: "Today, 2:00 PM", isNewToday: false },
  { customer: "Rohit Bansal", phone: "+91 99880 44112", destination: "Vietnam", category: "Group (GIT)", status: "Open", priority: "Low", executiveId: "priya", offset: 4, time: "", comment: "Corporate group of 18, requested a Halong Bay cruise option added to the itinerary.", commentTime: "Yesterday, 10:00 AM", isNewToday: false },
  { customer: "Pooja Nair", phone: "+91 98220 90876", destination: "Andaman", category: "Honeymoon", status: "Follow-up", priority: "High", executiveId: "gayatri", offset: 1, time: "12:00 PM", comment: "Loved the itinerary draft. Waiting on leave approval from husband's office before booking.", commentTime: "Today, 3:40 PM", isNewToday: false },
  { customer: "Deepak Joshi", phone: "+91 97020 33456", destination: "Kashmir", category: "Family", status: "Lost", priority: "Low", executiveId: "sneha", offset: 5, time: "", comment: "Chose a competitor's package due to lower pricing. Marked lost — may revisit next season.", commentTime: "4 days ago", isNewToday: false },
  { customer: "Ritu Chawla", phone: "+91 98730 67890", destination: "Sri Lanka", category: "Honeymoon", status: "Quote Sent", priority: "Medium", executiveId: "kunal", offset: 2, time: "5:00 PM", comment: "Comparing a Colombo vs Kandy stay split. Requested one more night in Ella for the tea estates.", commentTime: "Today, 12:15 PM", isNewToday: false },
  { customer: "Manoj Tiwari", phone: "+91 90360 12345", destination: "Mauritius", category: "Honeymoon", status: "Follow-up", priority: "High", executiveId: "priya", offset: 0, time: "6:00 PM", comment: "Ready to book — just confirming visa processing time for Indian passport holders first.", commentTime: "Today, 9:50 AM", isNewToday: false },
  { customer: "Sanjana Rao", phone: "+91 99230 45678", destination: "New Zealand", category: "Family", status: "Open", priority: "Medium", executiveId: "gayatri", offset: 6, time: "", comment: "Long-haul first-timer, nervous about long flights with a toddler. Needs a reassurance call.", commentTime: "2 days ago, 11:00 AM", isNewToday: false },
  { customer: "Amit Khanna", phone: "+91 98120 65478", destination: "USA (West Coast)", category: "Group (GIT)", status: "Quote Sent", priority: "Low", executiveId: "sneha", offset: 7, time: "", comment: "College friends group of 8, splitting costs. One member yet to confirm participation.", commentTime: "5 days ago", isNewToday: false },
  { customer: "Farida Sheikh", phone: "+91 97410 23987", destination: "Turkey", category: "Honeymoon", status: "Follow-up", priority: "High", executiveId: "kunal", offset: -1, time: "2:00 PM", comment: "Asked for a Cappadocia hot-air-balloon add-on price. Husband loved the Istanbul plan overall.", commentTime: "Yesterday, 6:40 PM", isNewToday: false },
  { customer: "Gaurav Malhotra", phone: "+91 98670 78123", destination: "Egypt", category: "Solo", status: "Open", priority: "Medium", executiveId: "priya", offset: 0, time: "5:30 PM", comment: "History enthusiast, wants a Nile cruise + pyramids combo. Requested a detailed day-wise plan.", commentTime: "Today, 10:05 AM", isNewToday: false },
  { customer: "Simran Kaur", phone: "+91 90540 34567", destination: "Bhutan", category: "Family", status: "Confirmed", priority: "Low", executiveId: "gayatri", offset: 5, time: "", comment: "Full payment received, itinerary locked. Following up only for pre-departure documents.", commentTime: "Today, 7:30 AM", isNewToday: false },
  { customer: "Harish Nambiar", phone: "+91 98980 56789", destination: "Europe (Paris-Swiss)", category: "Honeymoon", status: "Follow-up", priority: "High", executiveId: "sneha", offset: 0, time: "11:45 AM", comment: "Excited about the Eiffel Tower dinner add-on. Needs help booking a Schengen visa appointment slot.", commentTime: "Today, 8:00 AM", isNewToday: false },
  { customer: "Neha Agarwal", phone: "+91 99450 12876", destination: "Bali", category: "Family", status: "New Lead", priority: "Medium", executiveId: "kunal", offset: 1, time: "10:15 AM", comment: "Enquired via an Instagram ad. Wants a villa with a private pool for a family of four.", commentTime: "Today, 4:15 PM", isNewToday: true },
  { customer: "Tarun Bhatia", phone: "+91 98760 34521", destination: "Australia", category: "Corporate", status: "Open", priority: "High", executiveId: "priya", offset: -2, time: "1:30 PM", comment: "Incentive trip for top performers, 20 pax. Awaiting the confirmed headcount from HR.", commentTime: "2 days ago, 9:00 AM", isNewToday: false },
  { customer: "Ishita Sharma", phone: "+91 97120 65409", destination: "Dubai", category: "Solo", status: "Quote Sent", priority: "Low", executiveId: "gayatri", offset: 2, time: "", comment: "Weekend getaway, wants a budget hotel option. Comparing against a flight-only booking.", commentTime: "Yesterday, 3:20 PM", isNewToday: false },
  { customer: "Vishal Rana", phone: "+91 98330 90123", destination: "Thailand (Bangkok-Pattaya)", category: "Group (GIT)", status: "Follow-up", priority: "Medium", executiveId: "sneha", offset: 0, time: "3:30 PM", comment: "College reunion trip, 10 pax confirmed, 2 pending. Chasing the final headcount today.", commentTime: "Today, 1:10 PM", isNewToday: false },
  { customer: "Aarti Bhosale", phone: "+91 90280 43219", destination: "Japan", category: "Family", status: "Open", priority: "High", executiveId: "kunal", offset: -1, time: "10:00 AM", comment: "Cherry-blossom-season enquiry. Needs pricing for an early April travel window.", commentTime: "Yesterday, 4:50 PM", isNewToday: false },
  { customer: "Ambika Rathore", phone: "+91 98100 22110", destination: "Bali", category: "Corporate", status: "Follow-up", priority: "High", executiveId: "rajesh", offset: 0, time: "2:30 PM", comment: "VIP corporate client — CEO leadership retreat for 6. Handling personally given the relationship.", commentTime: "Today, 10:20 AM", isNewToday: false },
  { customer: "Devendra Oswal", phone: "+91 99200 65321", destination: "Switzerland", category: "Honeymoon", status: "Quote Sent", priority: "Medium", executiveId: "rajesh", offset: -1, time: "", comment: "Long-time client referral. Sent the premium quote, awaiting a confirmation call back.", commentTime: "Yesterday, 5:00 PM", isNewToday: false },
];

const LEADS = RAW_LEADS.map((l, i) => ({
  id: i + 1,
  ...l,
  followUpDate: addDays(TODAY, l.offset),
}));

function getBucket(offset) {
  if (offset < 0) return "overdue";
  if (offset === 0) return "today";
  if (offset === 1) return "tomorrow";
  return "next7";
}

const BUCKET_META = {
  overdue: { label: "Overdue", dot: "bg-red-500", header: "bg-red-50 text-red-700", ring: "ring-red-100", bar: "bg-red-400" },
  today: { label: "Today", dot: "bg-emerald-500", header: "bg-emerald-50 text-emerald-700", ring: "ring-emerald-100", bar: "bg-emerald-400" },
  tomorrow: { label: "Tomorrow", dot: "bg-blue-500", header: "bg-blue-50 text-blue-700", ring: "ring-blue-100", bar: "bg-blue-400" },
  next7: { label: "Upcoming", dot: "bg-slate-400", header: "bg-slate-100 text-slate-600", ring: "ring-slate-100", bar: "bg-slate-300" },
};
const BUCKET_ORDER = ["overdue", "today", "tomorrow", "upcoming"];

const STATUS_STYLE = {
  Confirmed: "bg-emerald-100 text-emerald-700",
  Lost: "bg-red-100 text-red-700",
  Open: "bg-amber-100 text-amber-700",
  "Quote Sent": "bg-purple-100 text-purple-700",
  "Follow-up": "bg-blue-100 text-blue-700",
  "New Lead": "bg-slate-200 text-slate-700",
};
const PRIORITY_DOT = { High: "bg-red-500", Medium: "bg-orange-400", Low: "bg-slate-300" };
const STATUS_CHART_COLOR = {
  Confirmed: "#10b981",
  Lost: "#ef4444",
  Open: "#f59e0b",
  "Quote Sent": "#a855f7",
  "Follow-up": "#3b82f6",
  "New Lead": "#94a3b8",
};

const DESTINATIONS = [...new Set(LEADS.map((l) => l.destination))].sort();
const CATEGORIES = [...new Set(LEADS.map((l) => l.category))].sort();
const STATUSES = ["Follow-up", "Open", "Quote Sent", "Confirmed", "Lost", "New Lead"];
const PRIORITIES = ["High", "Medium", "Low"];

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */
function SummaryCard({ icon: Icon, label, value, tone }) {
  const tones = {
    red: "bg-red-50 text-red-600",
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    slate: "bg-slate-100 text-slate-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-2.5 py-2 shadow-sm">
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${tones[tone]}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <div className="text-base font-bold leading-tight text-slate-900">{value}</div>
        <div className="truncate text-[10.5px] leading-tight text-slate-500">{label}</div>
      </div>
    </div>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-2.5 pr-6 text-xs font-medium text-slate-600 focus:border-blue-400 focus:outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function ActionIcon({ icon: Icon, title, onClick, tone }) {
  const tones = {
    emerald: "hover:bg-emerald-50 hover:text-emerald-600",
    blue: "hover:bg-blue-50 hover:text-blue-600",
    purple: "hover:bg-purple-50 hover:text-purple-600",
    slate: "hover:bg-slate-100 hover:text-slate-700",
  };
  return (
    <button
      title={title}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`flex h-6 w-6 items-center justify-center rounded-full text-slate-300 transition-colors ${tones[tone]}`}
    >
      <Icon className="h-3 w-3" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Compact lead row                                                    */
/* ------------------------------------------------------------------ */
function LeadRow({ lead, bucket, showOwner, onCall, onNote, onReschedule, onOpen, noteOpen, rescheduleOpen, onSaveNote, onSaveReschedule, onCancelInline }) {
  const [noteText, setNoteText] = useState("");
  const [newDate, setNewDate] = useState("");

  const timeLabel =
    bucket === "overdue"
      ? `${fmtDate(lead.followUpDate)}${lead.time ? " " + lead.time : ""}`
      : bucket === "today" || bucket === "tomorrow"
      ? lead.time || "—"
      : `${fmtDate(lead.followUpDate)}${lead.time ? " " + lead.time : ""}`;

  return (
    <div className="rounded-lg border border-transparent hover:border-slate-100 hover:bg-slate-50">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${PRIORITY_DOT[lead.priority]}`} title={`${lead.priority} priority`} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[13px] font-bold text-slate-900">{lead.customer}</span>
            <span className="shrink-0 text-[11px] text-slate-400">· {lead.destination}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            {showOwner && (
              <span className="flex items-center gap-0.5 font-medium text-slate-500">
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-100 text-[8px] font-bold text-blue-700">
                  {initialsOf(lead.executiveId)}
                </span>
              </span>
            )}
            <span className={bucket === "overdue" ? "font-semibold text-red-500" : ""}>{timeLabel}</span>
            <span className="text-slate-300">·</span>
            <span className="group relative min-w-0 flex-1 truncate">
              {lead.comment}
              <span className="pointer-events-none absolute left-0 top-full z-30 mt-1 hidden w-72 max-w-[85vw] rounded-lg border border-slate-200 bg-white p-2.5 text-[11px] leading-relaxed text-slate-700 shadow-lg group-hover:block">
                {lead.comment}
                <span className="mt-1 block text-[10px] text-slate-400">{lead.commentTime}</span>
              </span>
            </span>
          </div>
        </div>

        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[lead.status]}`}>{lead.status}</span>

        <div className="flex shrink-0 items-center gap-0.5">
          <ActionIcon icon={Phone} title="Call" tone="emerald" onClick={() => onCall(lead)} />
          <ActionIcon icon={MessageSquarePlus} title="Add note" tone="blue" onClick={() => onNote(lead)} />
          <ActionIcon icon={CalendarClock} title="Reschedule" tone="purple" onClick={() => onReschedule(lead)} />
          <ActionIcon icon={Eye} title="Open lead" tone="slate" onClick={() => onOpen(lead)} />
        </div>
      </div>

      {noteOpen && (
        <div className="mx-2 mb-1.5 flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 p-1.5">
          <input
            autoFocus
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Type a quick note…"
            className="flex-1 rounded-md border border-blue-200 bg-white px-2 py-1 text-[11px] focus:outline-none"
          />
          <button
            onClick={() => {
              onSaveNote(lead, noteText);
              setNoteText("");
            }}
            className="rounded-md bg-blue-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-blue-700"
          >
            Save
          </button>
          <button onClick={onCancelInline} className="text-slate-400 hover:text-slate-600">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {rescheduleOpen && (
        <div className="mx-2 mb-1.5 flex items-center gap-1.5 rounded-lg border border-purple-100 bg-purple-50 p-1.5">
          <input
            type="date"
            autoFocus
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="rounded-md border border-purple-200 bg-white px-2 py-1 text-[11px] focus:outline-none"
          />
          <button
            onClick={() => {
              onSaveReschedule(lead, newDate);
              setNewDate("");
            }}
            className="rounded-md bg-purple-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-purple-700"
          >
            Reschedule
          </button>
          <button onClick={onCancelInline} className="text-slate-400 hover:text-slate-600">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bucket quadrant card                                                */
/* ------------------------------------------------------------------ */
function BucketCard({ bucket, leads, showOwner, expanded, onToggleExpand, rowProps }) {
  const meta = BUCKET_META[bucket];
  return (
    <div className={`flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm ${expanded ? "md:col-span-2" : ""}`}>
      <div className={`flex items-center gap-2 rounded-t-xl px-3 py-2 text-xs font-bold uppercase tracking-wide ${meta.header}`}>
        <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
        {meta.label}
        <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">{leads.length}</span>
        <button onClick={onToggleExpand} className="ml-auto flex h-5 w-5 items-center justify-center rounded-md bg-white text-slate-400 hover:text-slate-700">
          {expanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
        </button>
      </div>
      <div className={`space-y-0.5 overflow-y-auto p-1.5 ${expanded ? "max-h-[30rem]" : "max-h-64"}`}>
        {leads.length === 0 && <p className="px-2 py-4 text-center text-xs text-slate-300">No leads in this bucket.</p>}
        {leads.map((lead) => (
          <LeadRow key={lead.id} lead={lead} bucket={bucket} showOwner={showOwner} {...rowProps(lead)} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mini analytics                                                      */
/* ------------------------------------------------------------------ */
function MiniCharts({ leads }) {
  const statusData = STATUSES.map((s) => ({ status: s, count: leads.filter((l) => l.status === s).length })).filter((d) => d.count > 0);
  const won = leads.filter((l) => l.status === "Confirmed").length;
  const lost = leads.filter((l) => l.status === "Lost").length;
  const open = leads.length - won - lost;
  const pieData = [
    { name: "Confirmed", value: won, color: "#10b981" },
    { name: "In progress", value: open, color: "#3b82f6" },
    { name: "Lost", value: lost, color: "#ef4444" },
  ].filter((d) => d.value > 0);
  const conversion = leads.length ? Math.round((won / leads.length) * 100) : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
        <TrendingUp className="h-3.5 w-3.5" /> Pipeline by Status
      </div>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={statusData} layout="vertical" margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="status" type="category" width={70} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
              {statusData.map((d) => (
                <Cell key={d.status} fill={STATUS_CHART_COLOR[d.status]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-1 flex items-center gap-3 border-t border-slate-100 pt-3">
        <div className="h-20 w-20 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={24} outerRadius={38} paddingAngle={2}>
                {pieData.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1 text-[11px]">
          <p className="text-2xl font-black leading-none text-slate-900">
            {conversion}
            <span className="text-sm font-bold text-slate-400">%</span>
          </p>
          <p className="mb-1 text-slate-400">Conversion rate</p>
          {pieData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-slate-500">
                {d.name} ({d.value})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main App                                                             */
/* ------------------------------------------------------------------ */
export default function App() {
  const [persona, setPersona] = useState("lead"); // 'exec' | 'lead'
  const [view, setView] = useState("team"); // 'mine' | 'team'
  const [teamFilter, setTeamFilter] = useState(""); // executive id, '' = all team

  const user = USERS[persona];
  const effectiveView = user.hasTeam ? view : "mine";

  const [filters, setFilters] = useState({ search: "", destination: "", status: "", priority: "", category: "" });
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [activeRescheduleId, setActiveRescheduleId] = useState(null);
  const [openLead, setOpenLead] = useState(null);
  const [expandedBucket, setExpandedBucket] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };
  const clearFilters = () => setFilters({ search: "", destination: "", status: "", priority: "", category: "" });
  const anyFilterActive = Object.values(filters).some(Boolean);

  /* Leads visible for the current persona + tab + teammate dropdown */
  const viewScoped = useMemo(() => {
    if (effectiveView === "mine") return LEADS.filter((l) => l.executiveId === user.id);
    return LEADS.filter((l) => TEAM_IDS.includes(l.executiveId) && (!teamFilter || l.executiveId === teamFilter));
  }, [effectiveView, user.id, teamFilter]);

  const filtered = useMemo(() => {
    return viewScoped.filter((l) => {
      if (filters.search && !l.customer.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.destination && l.destination !== filters.destination) return false;
      if (filters.status && l.status !== filters.status) return false;
      if (filters.priority && l.priority !== filters.priority) return false;
      if (filters.category && l.category !== filters.category) return false;
      return true;
    });
  }, [viewScoped, filters]);

  const grouped = useMemo(() => {
    const g = { overdue: [], today: [], tomorrow: [], next7: [] };
    filtered.forEach((l) => g[getBucket(l.offset)].push(l));
    Object.values(g).forEach((arr) => arr.sort((a, b) => a.offset - b.offset));
    return g;
  }, [filtered]);

  const summary = useMemo(() => {
    const overdue = viewScoped.filter((l) => l.offset < 0).length;
    const today = viewScoped.filter((l) => l.offset === 0).length;
    const tomorrow = viewScoped.filter((l) => l.offset === 1).length;
    const pending = viewScoped.filter((l) => l.status !== "Confirmed" && l.status !== "Lost").length;
    const newToday = viewScoped.filter((l) => l.isNewToday).length;
    const quotePending = viewScoped.filter((l) => l.status === "Quote Sent").length;
    return { overdue, today, tomorrow, pending, newToday, quotePending };
  }, [viewScoped]);

  const maxPending = Math.max(...TEAM_MEMBERS.map((e) => e.pending));

  const handleCall = (lead) => showToast(`Calling ${lead.customer} · ${lead.phone}`);
  const handleNote = (lead) => {
    setActiveRescheduleId(null);
    setActiveNoteId((id) => (id === lead.id ? null : lead.id));
  };
  const handleReschedule = (lead) => {
    setActiveNoteId(null);
    setActiveRescheduleId((id) => (id === lead.id ? null : lead.id));
  };
  const handleSaveNote = (lead, text) => {
    setActiveNoteId(null);
    showToast(text ? `Note added for ${lead.customer}` : "No note entered");
  };
  const handleSaveReschedule = (lead, date) => {
    setActiveRescheduleId(null);
    showToast(date ? `${lead.customer} rescheduled to ${date}` : "Pick a date to reschedule");
  };
  const rowProps = (lead) => ({
    onCall: handleCall,
    onNote: handleNote,
    onReschedule: handleReschedule,
    onOpen: setOpenLead,
    noteOpen: activeNoteId === lead.id,
    rescheduleOpen: activeRescheduleId === lead.id,
    onSaveNote: handleSaveNote,
    onSaveReschedule: handleSaveReschedule,
    onCancelInline: () => {
      setActiveNoteId(null);
      setActiveRescheduleId(null);
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-2.5 sm:px-6">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-black text-white">GY</div>
            <div>
              <p className="text-sm font-bold leading-tight text-slate-900">Girikand Yatra CRM</p>
              <p className="text-[11px] leading-tight text-slate-400">Holiday Sales Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-slate-700">{user.name}</p>
              <p className="text-[11px] text-slate-400">{user.title}</p>
            </div>
            <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
              <button onClick={() => setPersona("exec")} className={`rounded-md px-2.5 py-1.5 transition-colors ${persona === "exec" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>
                Login as Executive
              </button>
              <button onClick={() => setPersona("lead")} className={`rounded-md px-2.5 py-1.5 transition-colors ${persona === "lead" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}>
                Login as Team Lead
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6">
        {/* Dashboard / Team tabs + teammate dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-semibold shadow-sm">
            <button
              onClick={() => setView("mine")}
              className={`rounded-md px-3 py-1.5 transition-colors ${effectiveView === "mine" ? "bg-blue-600 text-white" : "text-slate-500"}`}
            >
              My Dashboard
            </button>
            {user.hasTeam && (
              <button
                onClick={() => setView("team")}
                className={`rounded-md px-3 py-1.5 transition-colors ${effectiveView === "team" ? "bg-blue-600 text-white" : "text-slate-500"}`}
              >
                My Team
              </button>
            )}
          </div>
          {effectiveView === "team" && (
            <Select
              value={teamFilter ? nameOf(teamFilter) : ""}
              onChange={(v) => setTeamFilter(TEAM_MEMBERS.find((m) => m.name === v)?.id ?? "")}
              options={TEAM_MEMBERS.map((m) => m.name)}
              placeholder="All Team Members"
            />
          )}
        </div>

        {/* Summary cards */}
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          <SummaryCard icon={CalendarClock} label="Today's Follow-ups" value={summary.today} tone="emerald" />
          <SummaryCard icon={AlertTriangle} label="Overdue Follow-ups" value={summary.overdue} tone="red" />
          <SummaryCard icon={Clock} label="Tomorrow's Follow-ups" value={summary.tomorrow} tone="blue" />
          <SummaryCard icon={ListChecks} label="Total Pending" value={summary.pending} tone="slate" />
          <SummaryCard icon={UserPlus} label="New Leads Today" value={summary.newToday} tone="purple" />
        </div>

        {/* KPI strip */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[
            [PhoneCall, "Calls today", "27"],
            [FileText, "Pending quotes", summary.quotePending],
            [CheckCircle2, "Completed", "19"],
            [Clock, "Avg. response", "18 min"],
          ].map(([Icon, label, value]) => (
            <div key={label} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 shadow-sm">
              <Icon className="h-3 w-3 text-blue-500" />
              <span className="text-xs font-bold text-slate-800">{value}</span>
              <span className="text-[10.5px] text-slate-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="sticky top-0 z-20 mt-3 flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="relative min-w-[150px] flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search customer…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs focus:border-blue-400 focus:bg-white focus:outline-none"
            />
          </div>
          <Select value={filters.destination} onChange={(v) => setFilters((f) => ({ ...f, destination: v }))} options={DESTINATIONS} placeholder="Destination" />
          <Select value={filters.status} onChange={(v) => setFilters((f) => ({ ...f, status: v }))} options={STATUSES} placeholder="Status" />
          <Select value={filters.priority} onChange={(v) => setFilters((f) => ({ ...f, priority: v }))} options={PRIORITIES} placeholder="Priority" />
          <Select value={filters.category} onChange={(v) => setFilters((f) => ({ ...f, category: v }))} options={CATEGORIES} placeholder="Category" />
          <button
            onClick={clearFilters}
            disabled={!anyFilterActive}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              anyFilterActive ? "border-red-200 text-red-500 hover:bg-red-50" : "border-slate-100 text-slate-300"
            }`}
          >
            <RotateCcw className="h-3 w-3" /> Clear
          </button>
        </div>

        {/* Body: 4 quadrant cards + sidebar */}
        <div className="mt-3 flex flex-col gap-3 lg:flex-row">
          <div className={`grid flex-1 grid-cols-1 gap-3 ${expandedBucket ? "" : "md:grid-cols-2"}`}>
            {BUCKET_ORDER.filter((b) => !expandedBucket || expandedBucket === b).map((bucket) => (
              <BucketCard
                key={bucket}
                bucket={bucket}
                leads={grouped[bucket]}
                showOwner={effectiveView === "team"}
                expanded={expandedBucket === bucket}
                onToggleExpand={() => setExpandedBucket((b) => (b === bucket ? null : bucket))}
                rowProps={rowProps}
              />
            ))}
          </div>

          {/* Sidebar */}
          <div className="w-full shrink-0 space-y-3 lg:w-64">
            {effectiveView === "team" && (
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <Award className="h-3.5 w-3.5" /> Team Performance
                </div>
                <p className="mb-2 mt-0.5 text-[10.5px] text-slate-400">Pending follow-ups by executive</p>
                <div className="space-y-2">
                  {TEAM_MEMBERS.slice()
                    .sort((a, b) => b.pending - a.pending)
                    .map((e) => {
                      const active = teamFilter === e.id;
                      return (
                        <button
                          key={e.id}
                          onClick={() => setTeamFilter((f) => (f === e.id ? "" : e.id))}
                          className={`block w-full rounded-lg p-1 text-left transition-colors ${active ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-slate-50"}`}
                        >
                          <div className="mb-0.5 flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-700">{e.name}</span>
                            <span className="font-bold text-slate-500">{e.pending}</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div className={`h-full rounded-full ${e.pending === maxPending ? "bg-red-400" : "bg-blue-400"}`} style={{ width: `${(e.pending / maxPending) * 100}%` }} />
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
            <MiniCharts leads={viewScoped} />
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-lg">{toast}</div>
      )}

      {openLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-40 p-4" onClick={() => setOpenLead(null)}>
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-base font-bold text-slate-900">{openLead.customer}</p>
                <p className="text-xs text-slate-400">{openLead.phone}</p>
              </div>
              <button onClick={() => setOpenLead(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="text-slate-400">Destination</p>
                <p className="font-semibold text-slate-700">{openLead.destination}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="text-slate-400">Category</p>
                <p className="font-semibold text-slate-700">{openLead.category}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="text-slate-400">Status</p>
                <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[openLead.status]}`}>{openLead.status}</span>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="text-slate-400">Priority</p>
                <p className="font-semibold text-slate-700">{openLead.priority}</p>
              </div>
              <div className="col-span-2 rounded-lg bg-slate-50 p-2">
                <p className="text-slate-400">Assigned executive</p>
                <p className="font-semibold text-slate-700">{nameOf(openLead.executiveId)}</p>
              </div>
              <div className="col-span-2 rounded-lg bg-slate-50 p-2">
                <p className="text-slate-400">Latest comment</p>
                <p className="mt-0.5 text-slate-600">{openLead.comment}</p>
                <p className="mt-1 text-[11px] text-slate-400">{openLead.commentTime}</p>
              </div>
            </div>
            <button onClick={() => setOpenLead(null)} className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
