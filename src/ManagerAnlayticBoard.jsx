import React, { use, useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import { useGetSessionUser } from "./SessionContext";
import config from './config';
import axios from 'axios';
import Select from 'react-select';
import DateRangeSelector, { CRMColorPalette } from './DatePicker';
import ManagerAnalytics from './ManagerAnalytics';
import { useMemo } from 'react';  
import UserTree from './UserTree';
import UserTreePane from './UserTreePane';
import { ChevronLeft, ChevronRight } from "lucide-react";
//import { de } from 'intl-tel-input/i18n';
import LeadsAndStats from './LeadsAndStats';
import { useRef } from 'react';
import { useMessageBox } from "./Notification";
import { MESSAGE_TYPES } from './Constants';



// const arrowIcons = [
//   'ChevronUp', 'ChevronDown', 'ChevronLeft', 'ChevronRight',
//   'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
//   'ArrowUpRight', 'ArrowUpLeft', 'ArrowDownRight', 'ArrowDownLeft',
//   'CornerUpRight', 'CornerUpLeft', 'CornerDownRight', 'CornerDownLeft',
//   'CaretUp', 'CaretDown', 'CaretLeft', 'CaretRight',
//   'SkipForward', 'SkipBack', 'FastForward', 'Rewind'
// ];



export default function ManagerAnalyticBoard() {
  const { user: sessionUser } = useGetSessionUser();
  const fetchSubordinateRolesAPI = config.apiUrl + "/Reporting/GetSubordinateList"
  const fetchSubordinateRoleListAPI = config.apiUrl + "/Reporting/GetSubordinateranksByUserId"
  const fetchUserVerticlesListAPI = config.apiUrl + "/Reporting/GetDepartmentsBySlectedUserId"
  const fetchDataWithFiltersAPI = config.apiUrl + "/Reporting/GetManagerAnalyticsDataWithFilters"
  const [selectedRanks, setSelectedRanks] = useState([]);
  const [selectedVerticles, setSelectedVerticles] = useState([]);
  const [listOfSubordinateRanks, setListOfSubordinateRanks] = useState([]);
  const[listOFVerticles,setListOfVerticles]=useState([]);
  const [hierarchyData, setHierarchyData] = useState({}); // State to hold the hierarchy data
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [usersDict, setUsersDict] = useState({}); // key: userID, value: Userdata object});
   const [selectedUserIds, setSelectedUserIds] = useState([]);
    const { showMessage } = useMessageBox();


   const customStyles = {
      container: (base) => ({
        ...base,
        width: "250px", // total width
      }),
      valueContainer: (base) => ({
        ...base,
        display: "flex",
        flexWrap: "nowrap",   // ❌ no wrapping to next line
        overflowX: "hidden",    // ✅ disable horizontal scroll
        scrollbarWidth: "thin",
        msOverflowStyle: "none",
        "::-webkit-scrollbar": {
          height: "6px",      // optional thin scrollbar
        },
        gap: "4px",           // small space between chips
      }),
      multiValue: (base) => ({
        ...base,
        flex: "0 0 auto",     // chips don't shrink
        backgroundColor: "#e6f3ff",
      }),
      control: (base) => ({
        ...base,
        minHeight: "36px",
      }),
   };

   const didMount = useRef(false);

// useEffect(() => {
//   debugger;
//   if (didMount.current) {
    
//     //console.log("Selected Date Range Updated:", selectedDateRange);
//     onDateChange(selectedDateRange);
  
//   } else {
//     didMount.current = true; // skip the first run
//   }
// }, [selectedDateRange]);

const [selectedDateRange, setSelectedDateRange] = useState({ from: "", to: "" });
// ==========================
// CRM COLOR CONSTANTS
// ==========================
 const CRM_COLORS = {
  primary: '#0056D2',        // main blue
  primaryLight: '#E6F0FF',   // light blue background
  border: '#C5D9FF',         // border blue
  hoverText: '#0041A8',      // hover text blue
  greyText: '#6B7280',
  white: '#FFFFFF',
};

const [treeWidth, setTreeWidth] = useState(400); // initial full width
const [isDragging, setIsDragging] = useState(false);


const startDragging = () => setIsDragging(true);
const stopDragging = () => setIsDragging(false);

const handleDragging = (e) => {
  if (!isDragging) return;
  let newWidth = e.clientX;

  // minimum width = 200, maximum = 600
  if (newWidth < 200) newWidth = 200;
  if (newWidth > 600) newWidth = 600;

  setTreeWidth(newWidth);
};

useEffect(() => {
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newWidth = Math.min(Math.max(e.clientX, 200), 600); // safe range
    setTreeWidth(newWidth);
  };


  const stopDragging = () => setIsDragging(false);

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", stopDragging);

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", stopDragging);
  };
}, [isDragging]);


 const handleDateRangeChange = (range) => {
  debugger;
    const obj = { from: (range.from), to: (range.to) };
    setSelectedDateRange(obj);  // store the selected date range
    console.log("Selected Range in Parent:", selectedDateRange);
  };

  useEffect(() => {
    debugger;
    console.log("Selected Date Range Updated:", selectedDateRange);
    onDateChange();
    //didMount.current =true;
  }, [selectedDateRange]);

useEffect(() => {
  debugger;
   if (!didMount.current && sessionUser?.user?.id) {
    didMount.current = true;
    fetchUserHierarchy();
  }
}, []);



const fetchUserHierarchy=async()=>{
  // Implement data fetching logic based on selected filters
  console.log("Fetching hierarchy with  UserID:" , sessionUser.user.id);

try {
    debugger;
    const response = await axios.post(
        fetchDataWithFiltersAPI,
        {
          userID: sessionUser.user.id,
          selectedVerticles: [],   // can be List<DTO> or List<int>
          selectedRoles: [] ,           // can be List<DTO> or List<int>
          //dateRange : {from: selectedDateRange.from , to:selectedDateRange.to
          //}
        },
        {
          headers: {
            Authorization: `Bearer ${sessionUser.token}`,
            "Content-Type": "application/json"
          }
        }
      );

    //setListOfVerticles(response.data);
    setHierarchyData(response.data);
    debugger;
    console.log(response.data);
    // setSubordinates(response.data);
  } catch (error) {
    console.error(error);
  }
};

const onDateChange=()=>{
  debugger;
  if (didMount.current==true){
  console.log("Filters Applied:");
  console.log("Selected Date Range:", selectedDateRange);
  if(selectedDateRange.from=="" || selectedDateRange.to=="" ){
    //alert("Please select date range before applying filters.");
   // showmessage("Please select date range before applying filters.");
      showMessage("Please select date range before applying filters.", MESSAGE_TYPES.INFO);
    return;
  }
  else if(selectedUserIds.length==0)
  {
    //alert("Please select Users before applying filters.");
    showMessage("Please select Users before applying filters.", MESSAGE_TYPES.INFO);
    return;
  }
   fetchUserData(selectedUserIds); //1. Fetch data for selected users with new date range
}
};

const handleUserClick = async (selectedIds) => {
  debugger;

  console.log("Selected User IDs:", selectedIds);
  console.log("Previous Selected User IDs:", selectedUserIds);
  console.log("Current usersDict:", usersDict);

  // 1️⃣ Detect removed/deselected user IDs
  const removedIds = selectedUserIds.filter(id => !selectedIds.includes(id));
  console.log("Removed/Deselected IDs:", removedIds);

  // 2️⃣ Update selectedUserIds state
  setSelectedUserIds(selectedIds);

  // 3️⃣ Find IDs that need fresh fetch
  const idsToFetch = selectedIds.filter(id => !(id in usersDict));
  console.log("Need to fetch:", idsToFetch);

  // If nothing new to fetch
  if (idsToFetch.length === 0) {
    console.log("No new users to fetch.");
  } else {
    try {
      await fetchUserData(idsToFetch);
      debugger;
     // alert("Fetched and added users: " + idsToFetch.join(", "));
     console.log("Fetched and added users: ", idsToFetch);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }

  // 4️⃣ Optionally, remove old user data from dictionary
  //    ONLY if you want to clean memory
  removedIds.forEach(id => {
    delete usersDict[id];
  });

  console.log("Cleaned usersDict:", usersDict);
};
const fetchUserData = async (userIdList) => {
        debugger;
          if(selectedDateRange.from=="" || selectedDateRange.to=="" ){
            //alert("Please select date range.");
            showMessage("Please select date range before applying filters.", MESSAGE_TYPES.INFO);
            return;
          }
          else if(userIdList.length==0)
          {
            //alert("Please select Role before selecting user");
            showMessage("Please select Users to fetch data.", MESSAGE_TYPES.INFO);
            return;
          } 
          debugger;
          const response = await axios.post(config.apiUrl +
          "/Reporting/GetRequestedAnalyticsForSubordinates",
          {
            requestedByUserId: sessionUser.user.id,     // string
            listOfUserIds: userIdList,       // List<string>
            dateTimeRange: {                      // DateRangeDTO
              from: selectedDateRange.from,
              to: selectedDateRange.to
            }
          },
          {
            headers: {
              Authorization: `Bearer ${sessionUser.token}`,
                    "Content-Type": "application/json"
            }
          }
          );

          console.log("Fetched User Data:", response.data);


          // Suppose fetchedUsers is your array
        const fetchedUsers = response.data;

        setUsersDict(prev => {
          const newDict = { ...prev }; // copy previous state

          fetchedUsers.forEach(user => {
            newDict[user.userID] = { Userdata: user };
          });
          return newDict;
          
        });

        console.log("Updated usersDict:", usersDict);
      }



return (
          <div className="w-full overflow-x-hidden">   {/* <<< prevents page-wide horizontal scroll */}
            
            {/* ---------- FILTER BAR (unchanged) ---------- */}
            {/* <div
              className="w-full p-4 rounded-2xl shadow-md flex items-start gap-1 flex-wrap"
              style={{ backgroundColor: CRM_COLORS.primaryLight }}
            >
             */}

              {/* Apply */}
              {/* <div>
                <button
                  className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  onClick={applyFiltersClick}
                >
                  Apply Filters
                </button>
              </div> */}
              {/* Role Select */}
              {/* <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-1 text-gray-700">Choose Role To View</label>
                <Select
                  isMulti
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={{
                    ...customStyles,
                    menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                    menu: (base) => ({ ...base, zIndex: 99999 }),
                  }}
                  options={rankOptions}
                  value={selectedRanks}
                  onChange={handleChange}
                  placeholder="--Select Role--"
                />
              </div> */}

              {/* Vertical Select */}
              {/* <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-1 text-gray-700">Choose Verticle To View</label>
                <Select
                  isMulti
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={{
                    ...customStyles,
                    menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                    menu: (base) => ({ ...base, zIndex: 99999 }),
                  }}
                  options={verticleOptions}
                  value={selectedVerticles}
                  onChange={handleChangeVerticleChange}
                  placeholder="--Select Verticles--"
                />
              </div> */}

            
            {/* </div> */}

            {/* ---------- MAIN SPLIT PANEL ---------- */}
        <div className="w-full mt-4">
          <div className="flex w-full rounded-xl shadow bg-white overflow-hidden" >

            {/* ------- LEFT TREE PANEL (Collapsible) ------- */}
            <div
              className={`
                bg-gray-50 border-r transition-all duration-300 flex-shrink-0 text-center 
                ${isCollapsed ? "w-[50px]" : "w-[450px]"}
              `}
              style={{ overflow: "hidden" }}
            >

              {/* Collapse Button */}
              <button
                className="w-full flex items-center justify-center py-2 bg-gray-200 hover:bg-gray-300"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>
                {/* Date Range Selector */}
    {/* <div className="flex-1 min-w-[200px]">
  {!isCollapsed && (
    <div style={{ padding: '10px' }}>
      <DateRangeSelector onRangeChange={handleDateRangeChange} />
    </div>
  )}
</div> */}<div
  style={{
    padding: '10px',
    display: isCollapsed ? 'none' : 'block', // hide instead of unmount
  }}
>
  <DateRangeSelector onRangeChange={handleDateRangeChange} />
</div>
            {/* Vertical Label placed immediately below button */}
            {isCollapsed && (
  <div className="flex flex-col h-[calc(100%-40px)] items-center justify-center mt-2 relative">
    <span
      className="
        text-gray-600 text-xs font-bold tracking-wider
        whitespace-nowrap transform -rotate-90
      "
    >
      MY HIERARCHY
    </span>
  </div>
)} 
<div  
  className="p-3 overflow-auto h-[calc(100vh-350px)]"
  style={{ display: isCollapsed ? 'none' : 'block' }}
>
  <UserTree data={hierarchyData} onSelectionChange={handleUserClick} />
</div>

              {/* Tree Container (scrollable) */}
              {/* {!isCollapsed && (
                <div className="p-3 overflow-auto h-[calc(100vh-350px)]">
                  <UserTree data={hierarchyData} onSelectionChange={handleUserClick}   />
                </div>
              )} */}
            </div>

            {/* ------- RIGHT ANALYTICS PANEL ------- */}
            <div className="flex-1 p-3 ">
             {/* // <ManagerAnalytics /> */}
             <LeadsAndStats data={usersDict} />
            </div>

          </div>
        </div>
          </div>
);  

};



