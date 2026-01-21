import React, { useEffect, useState } from "react";
import { Loader2, Users, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import config from "./config";
import axios from "axios";
import { useGetSessionUser } from "./SessionContext"; // ✅ import
import { MESSAGE_TYPES, TIME_OPTIONS } from "./Constants";
import { MONTHS } from "./Constants";
import { QUARTERS } from "./Constants";
import Select from "react-select";
import { Quarter_WISE_Months } from "./Constants";
import { useMessageBox } from "./Notification";
import { useMemo } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { getEmptyLeadObj } from "./Model/LeadModel";


import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Legend,
} from "recharts";
import MessageBox from "./MessageBox";
import { de } from "intl-tel-input/i18n";
import UpdateLeadsModal from "./UpdateLeadsModal";

// Pie chart colors
const PIE_COLORS = ["#4CAF50", "#FF5252", "#8884d8", "#FFC107"];

const fetchLeadAnalytics = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalLeads: 150,
        convertedLeadsCount: 90,
        lostLeadsCount: 30,
        postponedLeadsCount: 10, // dummy value
        leadsOverTime: [
          { month: "Jan", total: 45, converted: 20 },
          { month: "Feb", total: 50, converted: 25 },
          { month: "Mar", total: 40, converted: 15 },
          { month: "Apr", total: 55, converted: 30 },
        ],
        lostLeadsReasons: [
          { reason: "High Price", count: 12 },
          { reason: "Competitor", count: 8 },
          { reason: "No Response", count: 5 },
          { reason: "Budget Issues", count: 5 },
        ],
        lostLeadsList: [
          { id: 101, name: "John Doe", reason: "High Price", date: "2025-09-01" },
          { id: 102, name: "Jane Smith", reason: "Competitor", date: "2025-09-03" },
        ],
        confirmedLeadsList: [
          { id: 201, name: "Alice Brown", date: "2025-09-02" },
          { id: 202, name: "Bob Johnson", date: "2025-09-04" },
        ],
      });
    }, 1000);
  });

const LeadAnalytics = () => {


  //const sessionUser = JSON.parse(sessionStorage.getItem("sessionUser"));
  //const GetLostLeads = config.apiUrl + "/Analytics/GetLostLeads";
  //const GetConfirmedLeads = config.apiUrl + "/Analytics/GetConfirmedLeads";
  const { user: sessionUser } = useGetSessionUser();

  const [selectedPeriodForLostCounts, setSelectedPeriodForLostCounts] = useState("");
  const { showMessage } = useMessageBox();
  const [isMUltiSelectedDisabled, setIsMultiSelectedDisabled] = useState(false);
  const [monthsToCalculateData, setMonthsToCalculateData] = useState([]);
  const [yearsToCalculateData, setYearsToCalculateData] = useState([]);
  const [quartersToCalculateData, setQuartersToCalculateData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [secondDropdownOptions, setSecondDropdownOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics");
  const [searchText, setSearchText] = useState("");
  const [dynamicYearOptions, setDynamicYearOptions] = useState([]);
  const [multiplePieData, setMultiplePieData] = useState([]);

  // to view details of lead 
  // const [selectedLead, setSelectedLead] = useState(getEmptyLeadObj());
  // const [modalOpen, setModalOpen] = useState(false);
  const GetLeadsForEditAPI = config.apiUrl + "/TempLead/GetLeadForEdit";
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [mode, setMode] = useState("create"); //  ADD THIS


  const [periodOptions, setPeriodOptions] = useState({
    [TIME_OPTIONS.Monthly]: MONTHS,
    [TIME_OPTIONS.Quarterly]: QUARTERS,
    [TIME_OPTIONS.Yearly]: dynamicYearOptions
  });
  const [viewMode, setViewMode] = useState("cumulative"); // "cumulative" or "individual"
  const [placeHolderText, setPlaceholderText] = useState("Select months");
  const [initialLoad, setInitialLoad] = useState(false);
  const [data, setData] = useState({
    totalLeads: 0,

    convertedLeadsCount: 0,

    TotalCount: 0,

    ConfirmedCount: 0,

    LostCount: 0,

    OpenCount: 0,

    PostponedCount: 0,

    LostLeads: [],

    ConfirmedLeads: [],

    PostponedLeads: [],

    OpenLeads: [],

    leadsOverTime: [],
  });

  const [lineChartData, setLineChartData] = useState([
    { selectedPeriod: "", totalCount: 0, confirmedCount: 0, lostCount: 0, openCount: 0, postponedCount: 0 },
  ]);


  const [lostLeadsChartData, setLostLeadsChartData] = useState([
    {
      Name: "Q1",
      data: [
        { reason: "High Price", count: 12 },
        { reason: "Competitor", count: 8 },
        { reason: "No Response", count: 5 },
        { reason: "Budget Issues", count: 5 }
      ]
    },
    {
      Name: "Q2",
      data: [
        { reason: "High Price", count: 10 },
        { reason: "Competitor", count: 6 },
        { reason: "No Response", count: 4 },
        { reason: "Budget Issues", count: 4 }
      ]
    }
  ]);

  const fetchYearlyLeadsData = async () => {
    setLoading(true);

    try {
      // Simulate API call delay
      debugger;
      let string = config.apiUrl + "/Analytics/GetLeadsStatisticsPerYear";
      const res = await axios.post(string, {
        userId: sessionUser.user.userId,
        months: monthsToCalculateData,
        selectedYear: selectedYear,
        quarter: quartersToCalculateData,
        years: yearsToCalculateData
      },
        {
          headers: {
            Authorization: `Bearer ${sessionUser.token}`,
          },
        });
      debugger;

      console.log("Yearly Stats Data: ", res.data.yearlyStats);
      consolidatedMonthlyData(res.data.yearlyStats);

    } catch (error) {
      showMessage({
        type: MESSAGE_TYPES.ERROR,
        message: "Error fetching yearly leads data.",
      });
      console.error("Error fetching yearly leads data: ", error);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  };


  const fetchQuarterlyLeadsData = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      debugger;
      let string = config.apiUrl + "/Analytics/GetLeadsStatisticsPerQuarter";
      const res = await axios.post(string, {
        userId: sessionUser.user.userId,
        months: monthsToCalculateData,
        selectedYear: selectedYear,
        quarter: quartersToCalculateData,
        years: []
      },
        {
          headers: {
            Authorization: `Bearer ${sessionUser.token}`,
          },
        });
      debugger;

      console.log("Quarterly Stats Data: ", res.data.quarterlyStats);
      consolidatedMonthlyData(res.data.quarterlyStats);

    } catch (error) {
      showMessage({
        type: MESSAGE_TYPES.ERROR,
        message: "Error fetching quarterly leads data.",
      });
      console.error("Error fetching quarterly leads data: ", error);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchMonthlyLeadsData = async () => {

    debugger;
    setLoading(true);
    try {
      // Simulate API call delay
      //const res = await fetchLeadAnalytics();
      let string = config.apiUrl + "/Analytics/GetMonthlyLeadAnalytics";
      const res = await axios.post(string, {
        userId: sessionUser.user.userId,
        months: monthsToCalculateData,
        selectedYear: selectedYear,
        quarter: quartersToCalculateData,
        years: []
      },
        {
          headers: {
            Authorization: `Bearer ${sessionUser.token}`,
          },

        }

      );
      debugger;

      // setData(res.data.monthlyStats);
      console.log("Monthly Stats Data: ", res.data.monthlyStats);
      consolidatedMonthlyData(res.data.monthlyStats);
      // console.log("Monthly Leads Data Fetched: ", data);
    } catch (error) {
      showMessage({
        type: MESSAGE_TYPES.ERROR,
        message: "Error fetching monthly leads data.",
      });
      console.error("Error fetching monthly leads data: ", error);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  };

  // Fetch lead category list from Api 
  

  

  // When user logs in or changes, generate year list dynamically
  useEffect(() => {
    if (sessionUser.user) {

      debugger;
      const dynamicYears = getYearOptions(sessionUser.user.userObj);

      setDynamicYearOptions(dynamicYears);
      setPeriodOptions((prevOptions) => ({
        ...prevOptions,
        [TIME_OPTIONS.Yearly]: dynamicYears,
      }));
      console.log("Period Options:", periodOptions);



      // Set default selections on first load
      let currentMonth = new Date().getMonth();
      setSelectedYear(new Date().getFullYear().toString());
      setSelectedPeriod(TIME_OPTIONS.Monthly);
      setSecondDropdownOptions(MONTHS);
      setSelectedValue([{ value: MONTHS[currentMonth], label: MONTHS[currentMonth] }]);
      setMonthsToCalculateData([MONTHS[currentMonth]]);
      console.log("Current Month:", MONTHS[currentMonth]);
      setSelectedPeriodForLostCounts(TIME_OPTIONS.Monthly);
      setInitialLoad(true);
      // Fetch initial data :End

    }
  }, []);


  useEffect(() => {
    if (initialLoad) {
      console.log("Initial load - fetching monthly leads data");
      fetchMonthlyLeadsData();
    }
  }, [initialLoad]);

  const getYearOptions = (user) => {
    const currentYear = new Date().getFullYear();
    const d = new Date(user.createdAt);
    //console.log(d.getFullYear()); // 2025
    const years = [];
    debugger;
    // For example, use user's join year or data start year
    const startYear = d.getFullYear() || currentYear; // fallback
    const endYear = currentYear; // fallback

    for (let y = startYear; y <= endYear; y++) {
      years.push(y.toString());
    }
    return years;
  };

  useEffect(() => {
    // Get dropdown options dynamically
    //const abc = periodOptions[selectedPeriod] || [];
    //setSecondDropdownOptions(abc);
    // fetchLostLeadsData();
  }, [selectedPeriod]);

  const openLeadsCount = data.OpenCount || 0;

  const conversionRate =
    openLeadsCount + data.ConfirmedCount > 0
      ? Math.round(
        (data.ConfirmedCount / (openLeadsCount + data.ConfirmedCount)) * 100
      )
      : 0;

  const [pieData, setPieData] = useState([
    { name: "Confirmed", value: data.ConfirmedCount },
    { name: "Lost", value: data.LostCount },
    { name: "Open", value: data.OpenCount },
    { name: "Postponed", value: data.PostponedCount },
  ]);

  // Handle dropdown change
  const handlePeriodChangeForLostCounts = (e) => {
    setSelectedPeriodForLostCounts(e.target.value);
  };

  // Compute chart data for the selected period
  const selectedData = useMemo(() => {
    if (!Array.isArray(lostLeadsChartData) || lostLeadsChartData.length === 0)
      return [];

    // Handle both `.data` and `.lostDataCount` structures
    const found =
      lostLeadsChartData.find(
        (p) => p.selectedPeriod === selectedPeriodForLostCounts
      ) || lostLeadsChartData[0]; // fallback to first period if not selected yet

    return found.lostDataCount || found.data || [];
  }, [lostLeadsChartData, selectedPeriodForLostCounts]);

  const onYearChange = (e) => {
    let year = e.target.value;
    setSelectedYear(year);

    setSelectedPeriod(TIME_OPTIONS.Monthly);
    setSecondDropdownOptions(MONTHS);
    setPlaceholderText("Select months");
    setIsMultiSelectedDisabled(false);
    setMonthsToCalculateData([]);
    setQuartersToCalculateData([]);
    // Clear selected value which is displayed in 2nd dropdown
    setSelectedValue([]);
  }

  ///Called when period changes [Monthly/Quarterly/Yearly]
  const onPeriodChange = (e) => {

    let period = e.target.value;
    setSelectedPeriod(period);
    const abc = periodOptions[period] || [];
    setSecondDropdownOptions(abc);
    debugger;
    switch (period) {

      case TIME_OPTIONS.Monthly:
        setPlaceholderText("Select months");
        setIsMultiSelectedDisabled(false);

        // For Monthly, clear selected months
        setMonthsToCalculateData([]);

        // For Monthly, clear selected quarters
        setQuartersToCalculateData([]);

        // Clear selected value which is displayed in 2nd dropdown
        setSelectedValue([]);
        break;

      case TIME_OPTIONS.Quarterly:
        setPlaceholderText("Select quarters");
        setIsMultiSelectedDisabled(false);

        // For Quarterly, clear selected months
        setMonthsToCalculateData([]);
        // Clear selected value which is displayed in 2nd dropdown
        setSelectedValue([]);

        break;

      case TIME_OPTIONS.Yearly:
        debugger;
        setPlaceholderText("Select years");
        setIsMultiSelectedDisabled(true);

        // For Yearly, select all months by default

        setQuartersToCalculateData([]);
        setMonthsToCalculateData([]);

        // For Yearly, set selected year
        setYearsToCalculateData([selectedYear]);


        // Clear selected value which is displayed in 2nd dropdown
        setSelectedValue([]);

        break;
      default:
        setPlaceholderText("Select");
    }
  }

  const onMonthChange = (e) => {

    debugger;
    let gh = e.map(item => item.value);
    console.log("Selected Months:", gh);

    switch (selectedPeriod) {
      case TIME_OPTIONS.Monthly:

        setMonthsToCalculateData(gh);
        console.log("Months to Calculate Data (Monthly):", monthsToCalculateData);
        break;
      case TIME_OPTIONS.Quarterly:

        const selectedQuarters = e.map(item => item.value);

        setQuartersToCalculateData(selectedQuarters);

        console.log("Quarters to Calculate Data :", selectedQuarters);
        break;
      case TIME_OPTIONS.Yearly:

        // setMonthsToCalculateData(MONTHS);
        console.log("Years to Calculate Data (Yearly):", selectedYear);
        break;
      default:
        setPlaceholderText("Select");
    }


    //setSelectedValue(gh);
    const month = e.value;
    setSelectedValue(month);
  }

  const onGenerateStatisticksClicked = () => {
    console.log("Generating statistics for: ",
      " Year: ", selectedYear,
      " Period: ", selectedPeriod,
      " Months: ", monthsToCalculateData
    );
    debugger;
    switch (selectedPeriod) {

      case TIME_OPTIONS.Monthly:

        //fetchLostLeadsDataMonthly();

        fetchMonthlyLeadsData();


        break;

      case TIME_OPTIONS.Quarterly:

        fetchQuarterlyLeadsData();

        break;

      case TIME_OPTIONS.Yearly:

        fetchYearlyLeadsData();

        break;
      default:
        setPlaceholderText("Select");

    }
  };

  const calculatePercentage = (data) => {

    debugger;
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return data.map(item => ({ ...item, value: 0 }));

    return data.map(item => ({
      name: item.name,
      value: ((item.value / total) * 100),
    }));
  }

  const consolidatedMonthlyData = (monthlyStats) => {
    // Process and consolidate monthly stats data
    debugger;
    let totalLeadsCount = 0;
    let convertedLeadsCount = 0;
    let lostLeadsCount = 0;
    let postponedLeadsCount = 0;
    let lostLeads = [];
    let confirmedLeads = [];
    let openLeads = [];
    let openLeadsCount = 0;
    let postponedLeads = [];


    const tempLineChartData = [];
    const tempLostLeadsChartData = [];

    let tempPiedataList = [];

    monthlyStats.forEach((monthData) => {
      totalLeadsCount += monthData.totalCount;
      convertedLeadsCount += monthData.confirmedCount;
      lostLeadsCount += monthData.lostCount;
      postponedLeadsCount += monthData.postponedCount;
      openLeadsCount += monthData.openCount;

      openLeads.push(...monthData.openLeads);
      lostLeads.push(...monthData.lostLeads);
      confirmedLeads.push(...monthData.confirmedLeads);
      postponedLeads.push(...monthData.postponedLeads);


      let tempPieData = [{
        name: "Confirmed", value: monthData.confirmedCount
      }, {
        name: "Lost", value: monthData.lostCount
      }, {
        name: "Open", value: monthData.openCount
      }, {
        name: "Postponed", value: monthData.postponedCount
      }];

      const entry = {};

      entry.totalCount = monthData.totalCount;
      entry.confirmedCount = monthData.confirmedCount;
      entry.lostCount = monthData.lostCount;
      entry.openCount = monthData.openCount;
      entry.postponedCount = monthData.postponedCount;



      switch (selectedPeriod) {
        case TIME_OPTIONS.Monthly: {
          entry.selectedPeriod = monthData.selectedMonth;
        }
          break;
        case TIME_OPTIONS.Quarterly:
          {
            entry.selectedPeriod = monthData.selectedQuarter;
          }
          break;
        case TIME_OPTIONS.Yearly:
          {
            entry.selectedPeriod = monthData.selectedYear;
          }
          break;
        default:
          setPlaceholderText("Select");
      };


      let entryForLostCount = {};
      entryForLostCount.lostDataCount = monthData.lostLeadsReasonsCount;

      switch (selectedPeriod) {

        case TIME_OPTIONS.Monthly: {
          entryForLostCount.selectedPeriod = monthData.selectedMonth;

        } break;
        case TIME_OPTIONS.Quarterly: {
          entryForLostCount.selectedPeriod = monthData.selectedQuarter;
        } break;
        case TIME_OPTIONS.Yearly: {
          entryForLostCount.selectedPeriod = monthData.selectedYear;
        } break;
        default: {
          entryForLostCount.selectedPeriod = "Unknown";
          entryForLostCount.lostDataCount = 0;
        }
      };

      //    const pieData = [
      //   { name: "Confirmed", value: data.ConfirmedCount },
      //   { name: "Lost", value: data.LostCount },
      //   { name: "Open", value: data.OpenCount },
      //   { name: "Postponed", value: data.PostponedCount },
      // ];

      let calculatedPieData = calculatePercentage(tempPieData);

      tempPiedataList.push({
        label: entryForLostCount.selectedPeriod,
        data: calculatedPieData,
      });





      tempLostLeadsChartData.push(entryForLostCount);
      tempLineChartData.push(entry);
    });


    // ✅ Update state once — after loop completes
    console.log("Line Chart Data: ", tempLineChartData);
    debugger;
    setMultiplePieData(tempPiedataList);
    setLineChartData(tempLineChartData);
    setLostLeadsChartData(tempLostLeadsChartData);
    console.log("Lost Leads Chart Data: ", tempLostLeadsChartData);
    console.log("Multiple Pie Data: ", tempPiedataList);

    let leadsOverTime = monthlyStats;



    setData({
      TotalCount: totalLeadsCount,
      ConvertedCount: convertedLeadsCount,
      // Consolidated data
      LostCount: lostLeadsCount,
      PostponedCount: postponedLeadsCount,
      OpenCount: openLeadsCount,
      ConfirmedCount: convertedLeadsCount,


      LostLeads: lostLeads,
      ConfirmedLeads: confirmedLeads,
      PostponedLeads: postponedLeads,
      OpenLeads: openLeads,


    });
    let tempPie = ([{ name: "Confirmed", value: convertedLeadsCount },
    { name: "Lost", value: lostLeadsCount },
    { name: "Open", value: openLeadsCount },
    { name: "Postponed", value: postponedLeadsCount },
    ]);

    debugger;
    let abc = calculatePercentage(tempPie);
    setPieData(abc);
    console.log("Cumulative Pie Data: ", abc);
  };

  // Filtered tables
  const filteredLostLeads = data.LostLeads.filter(
    (lead) =>
      lead.fName.toLowerCase().includes(searchText.toLowerCase()) ||
      lead.leadID.toString().includes(searchText)
  );
  const filteredConfirmedLeads = data.ConfirmedLeads.filter(
    (lead) =>
      lead.fName.toLowerCase().includes(searchText.toLowerCase()) ||
      lead.leadID.toString().includes(searchText)
  );
  const filteredpostponedLeads = data.PostponedLeads.filter(

    (lead) =>
      lead.fName.toLowerCase().includes(searchText.toLowerCase()) ||
      lead.leadID.toString().includes(searchText)

  );
  console.log("Postponed Leads: ", filteredpostponedLeads);
  console.log("Lost Leads: ", filteredLostLeads);
  console.log("Confirmed Leads: ", filteredConfirmedLeads);


  const customStyles = {
    container: (base) => ({
      ...base,
      width: "250px", // total width
    }),
    valueContainer: (base) => ({
      ...base,
      display: "flex",
      flexWrap: "nowrap",   // ❌ no wrapping to next line
      overflowX: "auto",    // ✅ enable horizontal scroll
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

  //  const handleViewClick = async (lead) => {
  //     console.log("Viewing lead.....:", lead);
  //     //API call  to lead details. 

  //     debugger;
  //     try {

  //       let  templead = await fetchLeadDetails(lead);
  //       setSelectedLead(templead);
  //       setModalOpen(true);
  //     } catch {
  //       showMessage("Exception thrown.", MESSAGE_TYPES.ERROR);
  //     }
  //   };

  const handleViewClick = async (lead) => {
    try {
      const templead = await fetchLeadDetails(lead);

      setSelectedLead(templead);
      setMode("view");            //  IMPORTANT here for mode 
      setModalOpen(true);

    } catch {
      showMessage("Exception thrown.", MESSAGE_TYPES.ERROR);
    }
  };

  async function fetchLeadDetails(lead) {
    let res = null;
    try {
      debugger;
      console.log("GetLeadsForEditAPI:", GetLeadsForEditAPI);
      console.log("LEad data to be passed to API", lead);
      res = await axios.post(GetLeadsForEditAPI, lead, {
        headers: {
          Authorization: `Bearer ${sessionUser.token}`,//  JWT token
          "Content-Type": "application/json"

        },
        // params: {
        //   lead: lead,
        // }
      });
      debugger;
      if (res && res.data) {
        console.log("Leads details fetched:" + res.data);
        return res.data;
      } else {
        showMessage("Empty response from server.", MESSAGE_TYPES.WARNING);
        return null;
      }

    } catch (error) {
      debugger;
      console.log("Error fetching Lead for edit...", error);

      const message =
        error.response?.data ||
        error.response?.statusText ||
        error.message ||
        "Unknown error";

      showMessage("Error fetching Lead for edit." + JSON.stringify(message), MESSAGE_TYPES.ERROR);
      return null;

    }

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Leads */}
        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between border border-gray-200">
          <div>
            <p className="text-gray-500 text-sm">Total Leads</p>
            <p className="text-lg font-semibold">{data.TotalCount}</p>
          </div>
          <Users className="text-blue-500 w-6 h-6" />
        </div>

        {/* Confirmed */}
        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between border border-gray-200">
          <div>
            <p className="text-gray-500 text-sm">Confirmed</p>
            <p className="text-lg font-semibold">{data.ConfirmedCount}</p>
          </div>
          <CheckCircle className="text-green-500 w-6 h-6" />
        </div>

        {/* Lost */}
        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between border border-gray-200">
          <div>
            <p className="text-gray-500 text-sm">Lost</p>
            <p className="text-lg font-semibold">{data.LostCount}</p>
          </div>
          <XCircle className="text-red-500 w-6 h-6" />
        </div>

        {/* Open */}
        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between border border-gray-200">
          <div>
            <p className="text-gray-500 text-sm">Open</p>
            <p className="text-lg font-semibold">{data.OpenCount}</p>
          </div>
          <Clock className="text-purple-500 w-6 h-6" />
        </div>

        {/* Postponed */}
        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between border border-gray-200">
          <div>
            <p className="text-gray-500 text-sm">Postponed</p>
            <p className="text-lg font-semibold">{data.PostponedCount}</p>
          </div>
          <Clock className="text-orange-500 w-6 h-6" />
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between border border-gray-200">
          <div>
            <p className="text-gray-500 text-sm">Conversion Rate</p>
            <p className="text-lg font-semibold">{conversionRate}%</p>
          </div>
          <CheckCircle className="text-yellow-500 w-6 h-6" />
        </div>
      </div>


      {/* Filters */}
      <div className="flex flex-wrap gap-2 md:gap-4 items-center">
        {/* Year    */}
        <select

          value={selectedYear}
          onChange={(e) => onYearChange(e)}
          className="custom-select"
        // className="border border-gray-300 rounded px-2 py-1 text-sm bg-white shadow-sm"
        >
          <option value="">Select</option>
          {dynamicYearOptions.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}

          {/* <option value="monthly">Monthly</option> */}
          {/* <option value={TIME_OPTIONS.Monthly}>{TIME_OPTIONS.Monthly}</option>
          <option value={TIME_OPTIONS.Quarterly}>{TIME_OPTIONS.Quarterly}</option>
          <option value={TIME_OPTIONS.Yearly}>{TIME_OPTIONS.Yearly}</option> */}
        </select>

        {/* <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white shadow-sm"
        >
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
        </select> */}

        <select

          value={selectedPeriod}
          onChange={(e) => onPeriodChange(e)}
          className="custom-select"
        >
          {/* <option value="">Select</option>
        {periodOptions.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))} */}

          {/* <option value="monthly">Monthly</option> */}
          <option value={TIME_OPTIONS.Monthly}>{TIME_OPTIONS.Monthly}</option>
          <option value={TIME_OPTIONS.Quarterly}>{TIME_OPTIONS.Quarterly}</option>
          <option value={TIME_OPTIONS.Yearly}>{TIME_OPTIONS.Yearly}</option>
        </select>
        {/* Second Dropdown */}
        {/* <select
         styles={customStyles}
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white shadow-sm"
        >
          <option value="">Select</option>
          {secondDropdownOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select> */}
        <Select
          isMulti
          styles={customStyles}
          options={secondDropdownOptions.map((opt) => ({ value: opt, label: opt }))}
          value={selectedValue}
          onChange={onMonthChange}
          placeholder={placeHolderText}
          isDisabled={isMUltiSelectedDisabled}
        />
        <button
          onClick={onGenerateStatisticksClicked}
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          Generate Statistics
        </button>
        <input
          type="text"
          placeholder="Search Lead ID or Name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white shadow-sm flex-1 min-w-[200px]"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {["analytics", "lost", "confirmed", "postponed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-semibold text-sm transition-colors ${activeTab === tab
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab === "analytics"
              ? "Analytics"
              : tab === "lost"
                ? "Lost Leads"
                : tab === "confirmed"
                  ? "Confirmed Leads"
                  // : tab === "postponed"
                  //   ? "Postponed Leads"
                  : "Postponed Leads"}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* Analytics Charts */}
        {activeTab === "analytics" && (
          <div className="space-y-4">
            {/* Analytics Charts */}
            {activeTab === "analytics" && (
              <div className="grid grid-cols-2 gap-4"> {/* Always 2 columns */}

                {/* ---------- Leads Over Time ---------- */}
                <div
                  className="resize overflow-auto border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
                  style={{
                    width: "100%",
                    height: "350px",
                    minWidth: "300px",
                    minHeight: "250px",
                    maxWidth: "100%",
                    maxHeight: "800px",
                  }}
                >
                  <h2 className="text-md font-semibold mb-2">Leads Over Time</h2>
                  <div className="h-[calc(100%-2rem)]">
                    {loading ? (
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineChartData}>
                          <XAxis dataKey="selectedPeriod" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="openCount" name="Open" stroke="#8884d8" />
                          <Line type="monotone" dataKey="lostCount" name="Lost" stroke="#FF5252" />
                          <Line type="monotone" dataKey="confirmedCount" name="Confirmed" stroke="#4CAF50" />
                          <Line type="monotone" dataKey="postponedCount" name="Postponed" stroke="#FFC107" />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* ---------- Leads Status (Pie) ---------- */}
                <div
                  className="resize overflow-auto border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
                  style={{
                    width: "100%",
                    height: "350px",
                    minWidth: "300px",
                    minHeight: "250px",
                    maxWidth: "100%",
                    maxHeight: "800px",
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-md font-semibold">Leads Status</h2>
                    <select
                      className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      value={viewMode}
                      onChange={(e) => setViewMode(e.target.value)}
                    >
                      <option value="cumulative">Cumulative</option>
                      <option value="individual">Individual</option>
                    </select>
                  </div>

                  <div className="h-[calc(100%-2rem)]">
                    {loading ? (
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                      </div>
                    ) : viewMode === "cumulative" ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={125}
                            dataKey="value"
                            label={({ name, value }) => `${name} (${value.toFixed(2)}%)`}// format label
                          >
                            {pieData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={PIE_COLORS[index % PIE_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          {/* Tooltip with 2 decimals and % sign */}
                          <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto h-full p-2">
                        {multiplePieData?.map((dataItem, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center border rounded-lg p-2 shadow-sm"
                          >
                            {/* Title */}
                            <h3 className="text-xs font-medium mb-1 text-center">{dataItem.label}</h3>

                            {Array.isArray(dataItem.data) && dataItem.data.some((d) => d.value > 0) ? (
                              <>
                                {/* Chart area */}
                                <div className="w-full h-32 flex items-center justify-center">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                      <Pie
                                        data={dataItem.data}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={50}
                                        dataKey="value"
                                        labelLine={false}
                                      >
                                        {dataItem.data.map((entry, index) => (
                                          <Cell
                                            key={`cell-${index}`}
                                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                                          />
                                        ))}
                                      </Pie>
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>

                                {/* Legend area (auto grows) */}
                                <div className="mt-2 flex flex-col items-start text-xs w-full">
                                  {dataItem.data.map((d, idx) => (
                                    <span key={idx} className="flex items-center gap-1">
                                      <span
                                        className="w-3 h-3 inline-block rounded-sm"
                                        style={{
                                          backgroundColor: PIE_COLORS[idx % PIE_COLORS.length],
                                        }}
                                      ></span>
                                      {d.name} ({d.value.toFixed(2)}%)
                                    </span>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <p className="text-gray-400 text-xs text-center h-40 flex items-center justify-center">
                                No Data
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                    )}
                  </div>
                </div>
              </div>
              //  <div className="flex gap-4 w-full">
              // {/* ---------- Leads Over Time ---------- */}
              // <ResizableBox
              //   width={600}       // initial width
              //   height={350}      // initial height
              //   minConstraints={[300, 250]} // min width & height
              //   maxConstraints={[1000, 800]} // max width & height
              //   resizeHandles={["e", "s", "se"]} // allow horizontal, vertical, and corner resize
              //   className="border border-gray-300 rounded-lg bg-white p-4 shadow-sm"
              // >
              //   <h2 className="text-md font-semibold mb-2">Leads Over Time</h2>
              //   <div className="h-[calc(100%-2rem)]">
              //     {loading ? (
              //       <div className="flex justify-center items-center h-full">
              //         <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              //       </div>
              //     ) : (
              //       <ResponsiveContainer width="100%" height="100%">
              //         <LineChart data={lineChartData}>
              //           <XAxis dataKey="selectedPeriod" />
              //           <YAxis />
              //           <Tooltip />
              //           <Legend />
              //           <Line type="monotone" dataKey="openCount" name="Open" stroke="#8884d8" />
              //           <Line type="monotone" dataKey="lostCount" name="Lost" stroke="#FF5252" />
              //           <Line type="monotone" dataKey="confirmedCount" name="Confirmed" stroke="#4CAF50" />
              //           <Line type="monotone" dataKey="postponedCount" name="Postponed" stroke="#FFC107" />
              //         </LineChart>
              //       </ResponsiveContainer>
              //     )}
              //   </div>
              // </ResizableBox>

              // {/* ---------- Leads Status Pie Chart ---------- */}
              // <ResizableBox
              //   width={600}
              //   height={350}
              //   minConstraints={[300, 250]}
              //   maxConstraints={[1000, 800]}
              //   resizeHandles={["w", "s", "sw"]}
              //   className="border border-gray-300 rounded-lg bg-white p-4 shadow-sm"
              // >
              //   <div className="flex justify-between items-center mb-2">
              //     <h2 className="text-md font-semibold">Leads Status</h2>
              //     <select
              //       className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
              //       value={viewMode}
              //       onChange={(e) => setViewMode(e.target.value)}
              //     >
              //       <option value="cumulative">Cumulative</option>
              //       <option value="individual">Individual</option>
              //     </select>
              //   </div>

              //   <div className="h-[calc(100%-2rem)]">
              //     {loading ? (
              //       <div className="flex justify-center items-center h-full">
              //         <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              //       </div>
              //     ) : viewMode === "cumulative" ? (
              //       <ResponsiveContainer width="100%" height="100%">
              //         <PieChart>
              //           <Pie
              //             data={pieData}
              //             cx="50%"
              //             cy="50%"
              //             outerRadius={125}
              //             dataKey="value"
              //             label={({ name, value }) => `${name} (${value.toFixed(2)}%)`}
              //           >
              //             {pieData.map((entry, index) => (
              //               <Cell
              //                 key={`cell-${index}`}
              //                 fill={PIE_COLORS[index % PIE_COLORS.length]}
              //               />
              //             ))}
              //           </Pie>
              //           <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
              //           <Legend />
              //         </PieChart>
              //       </ResponsiveContainer>
              //     ) : (
              //       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto h-full p-2">
              //         {multiplePieData?.map((dataItem, idx) => (
              //           <div
              //             key={idx}
              //             className="flex flex-col items-center border rounded-lg p-2 shadow-sm"
              //           >
              //             <h3 className="text-xs font-medium mb-1">{dataItem.label}</h3>
              //             <div className="w-full h-40 flex flex-col items-center">
              //               <ResponsiveContainer width="100%" height="70%">
              //                 <PieChart>
              //                   <Pie
              //                     data={dataItem.data}
              //                     cx="50%"
              //                     cy="50%"
              //                     outerRadius={60}
              //                     dataKey="value"
              //                     label={false}
              //                   >
              //                     {dataItem.data.map((entry, index) => (
              //                       <Cell
              //                         key={`cell-${index}`}
              //                         fill={PIE_COLORS[index % PIE_COLORS.length]}
              //                       />
              //                     ))}
              //                   </Pie>
              //                 </PieChart>
              //               </ResponsiveContainer>
              //               {/* Stacked labels below the pie */}
              //               <div className="mt-2 flex flex-col items-start text-xs">
              //                 {dataItem.data.map((d, idx) => (
              //                   <span key={idx} className="flex items-center gap-1">
              //                     <span
              //                       className="w-3 h-3 inline-block"
              //                       style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
              //                     ></span>
              //                     {d.name} ({d.value.toFixed(2)}%)
              //                   </span>
              //                 ))}
              //               </div>
              //             </div>
              //           </div>
              //         ))}
              //       </div>
              //     )}
              //   </div>
              // </ResizableBox>
              // </div>
            )}

            {/* ---------- Lost Leads Reasons ---------- */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 lg:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-md font-semibold">Lost Leads - Reasons</h2>
                <select
                  value={selectedPeriodForLostCounts}
                  onChange={handlePeriodChangeForLostCounts}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none"
                >
                  {lostLeadsChartData.map((p) => (
                    <option key={p.selectedPeriod} value={p.selectedPeriod}>
                      {p.selectedPeriod}
                    </option>
                  ))}
                </select>
              </div>

              <div className="h-64">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  </div>
                ) : selectedData.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    No data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={selectedData}>
                      <XAxis dataKey="reason" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#eb4c30ff" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* ---------- Bar Chart ---------- */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 lg:col-span-2">
              <h2 className="text-md font-semibold mb-2">Bar Chart</h2>
              <div className="h-64">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={lineChartData}>
                      <XAxis dataKey="selectedPeriod" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="confirmedCount" name="Confirmed" fill="#4CAF50" />
                      <Bar dataKey="lostCount" name="Lost" fill="#eb4c30ff" />
                      <Bar dataKey="openCount" name="Open" fill="#8884d8" />
                      <Bar dataKey="postponedCount" name="Postponed" fill="#FFC107" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

        )}

        {/* Lost Leads Table */}
        {activeTab === "lost" && (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 overflow-x-auto">
            <h2 className="text-md font-semibold mb-2">Lost Leads</h2>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : (
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className='p-2 text-left'>ID</th>
                    <th className='p-2 text-left'>Name</th>
                    <th className='p-2 text-left'>Place</th>
                    <th className='p-2 text-left'>Mobile No</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-left">Reason</th>
                    <th className="p-2 text-left">Customer Type</th>
                    <th className="p-2 text-left">Updated Date</th>
                    <th className="p-3 text-left">Actions</th>

                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredLostLeads.map((lead) => (
                    <tr key={lead.leadID}>
                      <td className="p-2">{lead.leadID}</td>
                      <td className="p-2">{lead.fName} {lead.mName} {lead.lName}</td>
                      <td className="p-2">{lead.city}</td>
                      <td className="p-2">{lead.mobileNo}</td>
                      <td className="p-2">{lead.emailId}</td>
                      <td className="p-2">{lead.categoryName}</td>
                      <td className="p-2">{lead.histories?.[lead.histories.length - 1]?.reasonDescription ?? ""}</td>
                      <td className="p-2">{lead.customerTypeDescription ?? ""}</td>
                      <td className="p-2"> {new Date(lead.updatedAt).toLocaleDateString("en-GB").replace(/\//g, "-")}</td>
                      <td className="text-center align-middle">
                        <button
                          className="text-blue-500 underline"
                          onClick={() => handleViewClick(lead)}
                        >
                          View Details

                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Confirmed Leads Table */}
        {activeTab === "confirmed" && (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 overflow-x-auto">
            <h2 className="text-md font-semibold mb-2">Confirmed Leads</h2>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : (
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Place</th>
                    <th className="p-2 text-left">Mobile No</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-left">Customer Type</th>
                    <th className="p-2 text-left"> Updated Date</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredConfirmedLeads.map((lead) => (
                    <tr key={lead.leadID}>
                      <td className="p-2">{lead.leadID}</td>
                      <td className="p-2">{lead.fName} {lead.lName}</td>
                      <td className="p-2">{lead.city}</td>
                      <td className="p-2">{lead.mobileNo}</td>
                      <td className="p-2">{lead.emailId}</td>
                      <td className="p-2">{lead.categoryName}</td>
                      <td className="p-2">{lead.customerTypeDescription ?? ""}</td>
                      <td className="p-2">{new Date(lead.updatedAt).toLocaleDateString("en-GB").replace(/\//g, "-")}</td>
                      <td className="text-center align-middle">
                        <button
                          className="text-blue-500 underline"
                          onClick={() => handleViewClick(lead)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>
        )}

        {activeTab === "postponed" && (
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 overflow-x-auto">
            <h2 className="text-md font-semibold mb-2">Postponed Leads</h2>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : (
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Place</th>
                    <th className="p-2 text-left">Mobile No</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-left">Reason</th>
                    <th className="p-2 text-left">Customer Type</th>
                    <th className="p-2 text-left">Updated Date</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredpostponedLeads.map((lead) => (
                    <tr key={lead.leadID}>
                      <td className="p-2">{lead.leadID}</td>
                      <td className="p-2">{lead.fName} {lead.lName}</td>
                      <td className="p-2">{lead.city}</td>
                      <td className="p-2">{lead.mobileNo}</td>
                      <td className="p-2">{lead.emailId}</td>
                      <td className="p-2">{lead.categoryName}</td>
                      <td className="p-2">{lead.histories?.[lead.histories.length - 1]?.reasonDescription ?? ""}</td>
                      <td className="p-2">{lead.customerTypeDescription ?? ""}</td>
                      <td className="p-2">{new Date(lead.updatedAt).toLocaleDateString("en-GB").replace(/\//g, "-")}</td>
                      <button
                        className="text-blue-500 underline"
                        onClick={() => handleViewClick(lead)}
                      >
                        View Details
                      </button>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      {/* Modal  This is use for view details of lead */}
      <UpdateLeadsModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        lead={selectedLead}
        // readOnly={true}
        mode={mode}
      />
    </div>
  );
};

export default LeadAnalytics;
