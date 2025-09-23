import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import LeadsTable from "./LeadsTable";
import LeadTiles from "./DashboardTiles";
import config from "./config";
import {useGetSessionUser} from  "./SessionContext"
    

/* ---------- Helpers ---------- */


  // const [activeLeads, setActiveLeads] = useState([]);
  // const [followLeads, setFollowLeads] = useState([]);
  // const [categories, setCategories] = useState([]);
  //const [tileCounts, setTileCounts] = useState({ total: 0, active: 0, lost: 0,  confirmed: 0,  });

function isWithinInterval(dateStr, interval) {
  if (!interval) return true;
  const d = new Date(dateStr);
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
      const da = new Date(A).getTime();
      const db = new Date(B).getTime();
      return dir === "asc" ? da - db : db - da;
    }
    const sa = String(A).toLowerCase();
    const sb = String(B).toLowerCase();
    if (sa < sb) return dir === "asc" ? -1 : 1;
    if (sa > sb) return dir === "asc" ? 1 : -1;
    return 0;
  });
}

/* ---------- Component ---------- */
export default function UserDashboardTemp() {
  const [activeLeads, setActiveLeads] = useState([]);
  const [followLeads, setFollowLeads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [data , setData]=useState("");

  const [tileCounts, setTileCounts] = useState({ TotalCount: 0, ActiveCount: 0, LostCount: 0,  ConfirmedCount: 0, OpenCount:0 ,PostponedCount:0});

  const [progressInterval, setProgressInterval] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeDate, setActiveDate] = useState("");
  const [followCategory, setFollowCategory] = useState("");
  const [followDate, setFollowDate] = useState("");
  const [showFollowUp, setShowFollowUp] = useState(true);

  const PAGE_SIZE = 5;
  const [activeSort, setActiveSort] = useState({ column: "id", dir: "asc" });
  const [followSort, setFollowSort] = useState({ column: "id", dir: "asc" });
  const [activePage, setActivePage] = useState(1);
  const [followPage, setFollowPage] = useState(1);
  const rowsPerPage = 5;
  const { user: sessionUser } = useGetSessionUser();


  const LEADAPIURL = config.apiUrl + '/Leads/';
  const GetLeadsDashboardCounts = LEADAPIURL + 'GetLeadsDashboardCounts';
  //const GetActiveLeads = LEADAPIURL + 'GetActiveLeads';
  //const GetFollowUpLeads = LEADAPIURL + 'GetFollowUpLead';
  //const GetTodaysLeads = LEADAPIURL + 'GetTodaysLead';

  const LEADAPIURL1 = config.apiUrl + '/TempLead/';
  const GetFollowUpLeads = LEADAPIURL1 + 'GetFollowUpLeads';
  const GetTodaysLeads = LEADAPIURL1 + 'GetTodaysLeads';


/* ---------- Fetch Data from API ---------- */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(GetLeadsDashboardCounts);

        debugger;
       
        // Set tile counts directly from API
         setTileCounts({ TotalCount: res.data.totalLeads || 0,  LostCount: res.data.lostLeads || 0, ConfirmedCount: res.data.confirmedLeads || 0, OpenCount:res.data.openleads||0,
          PostponedCount:res.data.postponedLeads||0    });

        // Set categories if provided
        if (res.data.categories) 
             setCategories(res.data.categories);
      
         console.log("Tile Counts...:", res.data);
       
      } catch (err) {
        console.error("Error fetching leadscounts:", err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {


debugger;

const storedUser = localStorage.getItem("loggedInUser");

if (storedUser) {
  const userObj = JSON.parse(storedUser); // convert string -> object
  console.log(userObj.name); // "Alice"
  console.log(userObj.role); // "Admin"
}


  /**************************************************************** */
console.log("Session User.....",sessionUser);

  debugger;

  console.log("Final request URL:", GetTodaysLeads);
//         const activeRes = await axios.get(GetTodaysLeads, {
//   params: {
//     userID: sessionUser.user.userId
   
//   }
// });

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
//const token='';
if (loggedInUser && loggedInUser.token) {
   //token = sessionUser.token;
  console.log("Token:", sessionUser.token);
}
//const token = localStorage.getItem("token");
const activeRes=axios
  .get(GetTodaysLeads, {
    params: {
      userID: sessionUser.user.userId, // ✅ sends ?userID=123 in query string
    },
    headers: {
      Authorization: `Bearer ${sessionUser.token}`, // ✅ JWT auth header
    },
  })
  .then((res) => {
    // ✅ Success response
    debugger;
    setData(res.data.message);
     setActiveLeads(res.data || []);
  })
  .catch((err) => {
    console.error(err); // ✅ log the full error object for debugging
    debugger;
    if (err.response) {
      // ✅ Server responded but with an error status
      console.log("Status:", err.response.status);
      console.log("Data:", err.response.data);

      if (err.response.status === 401) {
        setData("Unauthorized - please login.  Session Expired.");
      } else if (err.response.status === 403) {
        setData("Forbidden - you don’t have access");
      } else {
        setData(
          `Error ${err.response.status}: ${
            err.response.data.title || "Something went wrong"
          }`
        );
      }
    } else {
      // ✅ Network error (server down, no internet, CORS, etc.)
      console.log("Error",err);
      setData("Network error - server unreachable");
    }
  });

       

debugger;
const followRes=axios
  .get(GetFollowUpLeads, {
    params: {
      userID: sessionUser.user.userId, // ✅ sends ?userID=123 in query string
    },
    headers: {
      Authorization: `Bearer ${sessionUser.token}`, // ✅ JWT auth header
    },
  })
  .then((res) => {
    // ✅ Success response
    debugger;
    setData(res.data.message);
     setFollowLeads(res.data || []);
    
  })
  .catch((err) => {
    console.error(err); // ✅ log the full error object for debugging
    debugger;
    if (err.response) {
      // ✅ Server responded but with an error status
      console.log("Status:", err.response.status);
      console.log("Data:", err.response.data);

      if (err.response.status === 401) {
        setData("Unauthorized - please login. Session Expired.");
      } else if (err.response.status === 403) {
        setData("Forbidden - you don’t have access");
      } else {
        setData(
          `Error ${err.response.status}: ${
            err.response.data.title || "Something went wrong"
          }`
        );
      }
    } else {
      // ✅ Network error (server down, no internet, CORS, etc.)
      console.log("Error",err);
      setData("Network error - server unreachable");
    }
  });


         console.log("DTO  Active Leads...:", activeRes.data);
      
        console.log("DTO Follow Up Leads...:", followRes.data);
      


  /***************************************************************** */

      
      } catch (err) {

        debugger;
        console.error("Error fetching Active and Follow Up leads...:", err);
      }
    }

    fetchData();

  }, []);

  const activeByInterval = useMemo(
    () => activeLeads.filter((l) => isWithinInterval(l.enquiryDate, progressInterval)),
    [activeLeads, progressInterval]
  );

  const followByInterval = useMemo(
    () => followLeads.filter((l) => isWithinInterval(l.followUpDate, progressInterval)),
    [followLeads, progressInterval]
  );

  const filteredActive = useMemo(() => {
    const out = activeByInterval.filter((l) => {
      if (selectedStatus === "Active") return true;
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
      setActiveSort((s) =>
        s.column === column ? { column, dir: s.dir === "asc" ? "desc" : "asc" } : { column, dir: "asc" }
      );
      setActivePage(1);
    } else {
      setFollowSort((s) =>
        s.column === column ? { column, dir: s.dir === "asc" ? "desc" : "asc" } : { column, dir: "asc" }
      );
      setFollowPage(1);
    }
  }

  function handleIntervalChange(val) {
    setProgressInterval(val);
    setSelectedStatus("All");
    setActivePage(1);
    setFollowPage(1);
  }

  /* ---------- UI Rendering ---------- */
  return (
    <div className="p-4 space-y-6">
      {/* Tiles Section */}
        <LeadTiles tileCounts={tileCounts} />

      {/* Active Leads Table */}
      <LeadsTable
        activeLeads={activeLeads}
        followLeads={followLeads}
        showFollowUp={showFollowUp}
        toggleSort={toggleSort}
      />
       {data && <div style={{ color: "red" }}>{data}</div>}
    </div>
  );
}
