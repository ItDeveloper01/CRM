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
import { LoadingOverlay } from './LeadsSharedTable';

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
  const [usersDict, setUsersDict] = useState({});
  const usersDictRef = useRef({});  // always mirrors usersDict synchronously
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const selectedUserIdsRef = useRef([]); // always mirrors selectedUserIds synchronously

  // Keep refs in sync whenever state changes
  useEffect(() => { usersDictRef.current = usersDict; }, [usersDict]);
  useEffect(() => { selectedUserIdsRef.current = selectedUserIds; }, [selectedUserIds]);
    const { showMessage } = useMessageBox();
    const [isLoading, setIsLoading] = useState(false); // drives the shared wait-cursor overlay


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
    const obj = { from: (range.from), to: (range.to) };
    setSelectedDateRange(obj);  // store the selected date range
    console.log("Selected Range in Parent:", selectedDateRange);
  };

  useEffect(() => {
    console.log("Selected Date Range Updated:", selectedDateRange);
    onDateChange();
    //didMount.current =true;
  }, [selectedDateRange]);

useEffect(() => {
   if (!didMount.current && sessionUser?.user?.id) {
    didMount.current = true;
    fetchUserHierarchy();
  }
}, []);



const fetchUserHierarchy=async()=>{
  // Implement data fetching logic based on selected filters
  console.log("Fetching hierarchy with  UserID:" , sessionUser.user.id);

  setIsLoading(true);
  try {
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
    console.log(response.data);
    // setSubordinates(response.data);
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

const onDateChange = () => {
  if (didMount.current === true) {
    console.log("Selected Date Range:", selectedDateRange);
    if (!selectedDateRange.from || !selectedDateRange.to) {
      showMessage("Please select date range before applying filters.", MESSAGE_TYPES.INFO);
      return;
    }
    // Use ref to get latest selectedUserIds — avoids stale closure
    const currentSelectedIds = selectedUserIdsRef.current;
    if (currentSelectedIds.length === 0) {
      showMessage("Please select Users before applying filters.", MESSAGE_TYPES.INFO);
      return;
    }
    // Re-fetch ALL currently selected users with the new date range
    // (date changed so existing cached data is stale — wipe and re-fetch)
    setUsersDict({});
    usersDictRef.current = {};
    fetchUserData(currentSelectedIds);
  }
};

const handleUserClick = async (newSelectedIds) => {
  console.log("Selected User IDs:", newSelectedIds);

  const prevIds = selectedUserIdsRef.current;
  const removedIds = prevIds.filter(id => !newSelectedIds.includes(id));

  // Update selection state + ref synchronously
  setSelectedUserIds(newSelectedIds);
  selectedUserIdsRef.current = newSelectedIds;

  // Nothing selected — wipe dict and bail
  if (newSelectedIds.length === 0) {
    setUsersDict({});
    usersDictRef.current = {};
    return;
  }

  // Build the new dict synchronously (remove deselected, keep rest)
  // Update ref immediately so idsToFetch check below sees the right state
  let currentDict = { ...usersDictRef.current };
  if (removedIds.length > 0) {
    removedIds.forEach(id => delete currentDict[id]);
    usersDictRef.current = currentDict;
    setUsersDict(currentDict);
  }

  // No date range — show selection visually but don't fetch
  if (!selectedDateRange.from || !selectedDateRange.to) {
    showMessage("Please select a date range to load lead data.", MESSAGE_TYPES.INFO);
    return;
  }

  // Fetch only IDs not already in the (now up-to-date) dict
  const idsToFetch = newSelectedIds.filter(id => !(id in currentDict));
  console.log("Need to fetch:", idsToFetch);

  if (idsToFetch.length > 0) {
    try {
      await fetchUserData(idsToFetch);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }
};
const fetchUserData = async (userIdList) => {
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

          setIsLoading(true);
          try {
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

            // Build new dict eagerly and update ref synchronously
            const newDict = { ...usersDictRef.current };
            fetchedUsers.forEach(user => {
              newDict[user.userID] = { Userdata: user };
            });
            usersDictRef.current = newDict;
            setUsersDict(newDict);

            console.log("Updated usersDict:", usersDict);
          } catch (error) {
            console.error("Error fetching user data:", error);
            showMessage("Error fetching user data.", MESSAGE_TYPES.ERROR);
          } finally {
            setIsLoading(false);
          }
      }



return (
  <div className="w-full flex flex-col" style={{ height: "100%" }}>

    <LoadingOverlay visible={isLoading} />

    <div className="flex w-full flex-1 bg-white overflow-hidden">

            {/* ------- LEFT TREE PANEL (Collapsible) ------- */}
            <div
              className={`bg-gray-50 border-r transition-all duration-300 flex-shrink-0 flex flex-col ${isCollapsed ? "w-[50px]" : "w-[450px]"}`}
            >
              {/* Collapse Button */}
              <button
                className="w-full flex items-center justify-center py-2 bg-gray-200 hover:bg-gray-300 flex-shrink-0"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>

              {/* Vertical label when collapsed */}
              {isCollapsed && (
                <div className="flex flex-col flex-1 items-center justify-center">
                  <span className="text-gray-600 text-xs font-bold tracking-wider whitespace-nowrap transform -rotate-90">
                    MY HIERARCHY
                  </span>
                </div>
              )}

              {!isCollapsed && (
                <>
                  {/* Date Range Selector */}
                  <div className="px-2 pt-2 pb-1 flex-shrink-0 w-full flex justify-center">
                    <div className="w-72">
                      <DateRangeSelector onRangeChange={handleDateRangeChange} />
                    </div>
                  </div>

                  {/* Tree — fills all remaining height after date picker */}
                  <div className="flex-1 overflow-hidden">
                    <UserTree
                      data={hierarchyData}
                      onSelectionChange={handleUserClick}
                      isLoading={isLoading}
                      selectedIds={selectedUserIds}
                    />
                  </div>
                </>
              )}
            </div>

            {/* ------- RIGHT ANALYTICS PANEL ------- */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <LeadsAndStats data={usersDict} dateRange={selectedDateRange} />
            </div>

          </div>
  </div>
);  

};
