// import { useState } from "react";
// import axios from "axios";
// import config from "../../config";
// import { useGetSessionUser } from "../../SessionContext";
// // ── Base URL — change this to match your API ──────────────────────────────
// const BASE_URL = config.operationsUrl; // ← edit this

// // // ── Payload mapper ────────────────────────────────────────────────────────
// // // Maps the shape coming out of ManageItineraryForm.onSave → your API body.
// // // Edit field names here if your backend uses different keys.
// // function toApiPayload(data) {
// //   debugger;
// //   console.log("Payload details of itinerary:",toApiPayload.data );
// //   return {
// //     title:       data.itName,
// //     description: data.description,
// //     num_days:    data.numDays,
// //     travelscope : data.travelScope,
// //     days: data.days.map((day, index) => ({
// //       id:          day.id,
// //       day_number:  index + 1,
// //       title:       day.title,
// //       description: day.desc,
// //       activities:  day.activities.map((act) => ({
// //         time:  act.time,
// //         title: act.title,
// //         notes: act.notes,
// //       })),
// //     })),
// //     variants: data.variants.map((v) => ({
// //       id:               v.id,
// //       name:             v.name,
// //       status:           v.status,
// //       start_location:   v.startLocation,
// //       end_location:     v.endLocation,
// //       targetAudience_id: v.targetAudience_id,
// //       start_date:       v.startDate,
// //       end_date:         v.endDate,
// //       total_seats:      v.totalSeats,
// //       occupied_seats:   v.occupiedSeats,
// //       guide_id:         v.guideId,
// //       base_amount:      v.baseAmount,
// //       discount_percent: v.discountPercent,
// //       pickup_points: (v.pickupPoints || []).map((p) => ({
// //         id:       p.id,
// //         pickup_point:    p.pickupPoint,
// //         pickup_location: p.pickupLocation,
// //         rateperpax:     p.ratePerPax,
// //       })),
// //     })),
// //   };
// // }

// //===============Here we added all api logic for create and update =========

// // ── Hook ──────────────────────────────────────────────────────────────────
// export function useItinerary() {

//     const { user: sessionUser } = useGetSessionUser();
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // ── CREATE ──────────────────────────────────────────────────────────────
//     const createItinerary = async (request) => {
//         debugger;
//         console.log("Create API called");
//         request = {

//             ...request,

//             createdBy_UserID: sessionUser.user.userId,

//             updatedBy_UserID: sessionUser.user.userId,
//         };
//         setLoading(true);
//         setError(null);

//         try {
//             debugger;

//             const response = await axios.post(

//                 `${config.operationsUrl}/Itinerary/CreateItinerary`,
//                 request,
//                 {
//                     headers: {
//                         "Content-Type": "application/json"
//                     }
//                 }
//             );

//             // console.log("Create itninerary API Response : ", response.data);
//             return response.data;

//             console.log("Create itninerary Data is  : ", response);

//             debugger;

//         } catch (err) {
//             console.log("Error While Creating itinerary: ",err);
//             setError(
//                 err.response?.data?.message ||
//                 err.message ||
//                 "Create Failed"
//             );

//             throw err;

//         } finally {

//             setLoading(false);

//         }
//     };

//     //------------Update Itinerary------------
//     const updateItinerary = async (request) => {

//         request = {
//             ...request,

//             // Existing value preserve karo
//             createdBy_UserID: request.createdBy_UserID,

//             // Current login user
//             updatedBy_UserID: sessionUser.user.userId,
//         };

//         setLoading(true);
//         setError(null);

//         try {

//             const response = await axios.put(
//                 `${config.operationsUrl}/Itinerary/UpdateItinerary`,
//                 request,
//                 {
//                     headers: {
//                         "Content-Type": "application/json"
//                     }
//                 }
//             );

//             return response.data;

//         } catch (err) {

//             setError(
//                 err.response?.data?.message ||
//                 err.message ||
//                 "Update Failed"
//             );

//             throw err;

//         } finally {

//             setLoading(false);

//         }
//     };

//     return {

//         createItinerary,
//         updateItinerary,
//         loading,
//         error

//     };
// }

import { useState, useRef } from "react";
import axios from "axios";
import config from "../../config";
import { useGetSessionUser } from "../../SessionContext";

import { getCacheKey } from "../Constant";
import { ro } from "intl-tel-input/i18n";

//===============Here we added all api logic for create and update =========

// Module-level cache: re-render ke beech zinda rehta hai, page refresh pe nahi.
// useState ki jagah module variable isliye rakha hai taaki ek card update
// karne par pura object/array recreate na ho — KanbanBoard isi cheez pe
// depend karta hai fast-scroll ke waqt sasta re-render karne ke liye.
let dashboardMemory = {};
const fetchedMonthsCache = new Set(); // jo months already successfully fetch ho chuke
const inFlightRequests = new Map(); // cacheKey -> chal rahi Promise

// ── Hook ──────────────────────────────────────────────────────────────────
export function useItinerary() {
  const { user: sessionUser } = useGetSessionUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [statuses, setStatuses] = useState([]);
  const [, forceRender] = useState({});
  const fetchedKeysRef = useRef(new Set());

  const getStatusListEndPoint =
    config.operationsUrl + "/SharedMaster/ItineraryStatusList";
  const getTourGuideListEndPoint =
    config.operationsUrl + "/SharedMaster/TourGuideList";
  const getTargetAudienceListEndPoint =
    config.operationsUrl + "/SharedMaster/TargetAudienceList";
  const getSectorTypeListEndPoint =config.operationsUrl+'/SharedMaster/SectorTypeList';

  // ── CREATE ──────────────────────────────────────────────────────────────
  const createItinerary = async (request) => {
    debugger;
    console.log("Create API called");
    request = {
      ...request,

      createdBy_UserID: sessionUser.user.userId,
      updatedBy_UserID: sessionUser.user.userId,
    };
    setLoading(true);
    setError(null);
    try {
      debugger;
      const response = await axios.post(
        `${config.operationsUrl}/Itinerary/CreateItinerary`,
        request,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // console.log("Create itninerary API Response : ", response.data);
      return response.data;

      console.log("Create itninerary Data is  : ", response);
      debugger;
    } catch (err) {
      console.log("Error While Creating itinerary: ", err);
      setError(err.response?.data?.message || err.message || "Create Failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  //------------Update Itinerary------------
  const updateItinerary = async (request) => {
    request = {
      ...request,
      // Existing value preserve karo
      createdBy_UserID: request.createdBy_UserID,
      // Current login user
      updatedBy_UserID: sessionUser.user.userId,
    };
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${config.operationsUrl}/Itinerary/UpdateItinerary`,
        request,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (err) {
      console.log("Error while updating Itinerary: ", err);
      setError(err.response?.data?.message || err.message || "Update Failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  //------------Delete Itinerary------------
  // API abhi ready nahi hai — jab ban jaye, neeche wala block uncomment
  // karke endpoint daal dena. Baaki poora flow (KanbanCard -> onDelete ->
  // handleDelete -> deleteCard -> yahan) already wired hai, kuch aur
  // change nahi karna padega.
  const deleteItinerary = async (variantId) => {
    setLoading(true);
    setError(null);
    try {
      // const response = await axios.delete(
      //     `${config.operationsUrl}/Itinerary/DeleteItinerary`,
      //     { params: { variantId } }
      // );
      // return response.data;

      // Abhi API ready nahi — isliye sirf resolve kar rahe hain.
      // Upar wala block uncomment karte hi ye line hata dena.
      return Promise.resolve();
    } catch (err) {
      console.log("Error While Deleting itinerary: ", err);
      setError(err.response?.data?.message || err.message || "Delete Failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  //===============Dashboard (month-wise Kanban data) =========

  const fetchMonth = (year, month, status, forceRefresh = false) => {
    const cacheKey = getCacheKey(year, status, month);
    debugger;
    // if (!forceRefresh) {
    //   if (fetchedMonthsCache.has(cacheKey)) return Promise.resolve();
    //   if (inFlightRequests.has(cacheKey)) return inFlightRequests.get(cacheKey);
    // }

    //Used to refresh after Create,Update,Delete
    if (!forceRefresh) {
      // Remembers which year-status-month combinations have already been successfully fetched.
      if (fetchedMonthsCache.has(cacheKey)) {
        console.log(`[SKIP - already done] ${cacheKey}`);
        return Promise.resolve(); //Do not call api for already fetch Data
      }
      //Prevents multiple simultaneous requests for the same year-status-month.
      if (inFlightRequests.has(cacheKey)) {
        console.log(`[SKIP - in flight] ${cacheKey}`);
        return inFlightRequests.get(cacheKey); //to prevent two api call for same month
      }
    }

    // console.log(`[REQUEST SENT] month=${month} key=${cacheKey} at ${Date.now()}`);
    console.log("Request Send :", cacheKey);

    const requestPromise = axios
      .get(`${config.operationsUrl}/ItineraryDashboard/GetItineraryDashboard`, {
        params: { Year: year, Month: month, Status: status },
      })
      .then((response) => {
        const rows = response.data.data || [];
        // console.log("Response from api for dashboard fetch:",rows);

        // ── FUTURE: guide / status / targetAudience API se resolve karna ──
        // Jab in teeno ke liye lookup APIs ready ho jayein, yahan rows ko
        // enrich karke rakho — baaki poora app (KanbanBoard, ItineraryCard)
        // bina kisi change ke chalta rahega, kyunki wo sirf already-resolved
        // string fields (guideName, statusName, targetAudienceName) padhte hain.
        //
        // const enrichedRows = rows.map((row) => ({
        //   ...row,
        //   guideName: guideLookup[row.guideId] ?? row.guideName,
        //   targetAudienceName: targetAudienceLookup[row.targetAudienceId] ?? row.targetAudienceName,
        // }));
        // dashboardMemory[cacheKey] = enrichedRows;

        fetchedMonthsCache.add(cacheKey);
        dashboardMemory[cacheKey] = rows;
        console.log("Dahsboard Memory: ", dashboardMemory);
        forceRender({});
        return rows;
      })
      .catch((err) => {
        console.error(`[ERROR] month=${month} key=${cacheKey}`, err);
        fetchedMonthsCache.delete(cacheKey);
      })
      .finally(() => {
        inFlightRequests.delete(cacheKey);
      });

    inFlightRequests.set(cacheKey, requestPromise);
    return requestPromise;
  };

  // Create/Update response ke variants ko sahi month/status bucket mein
  // daalta hai — poora dashboard refetch nahi karna padta.
  const mergeVariantsIntoDashboard = (variants) => {
    if (!variants?.length) return;

    debugger;
    variants.forEach((variant) => {
      const newCacheKey = getCacheKey(
        variant.year,
        variant.statusId,
        variant.month,
      );

      Object.keys(dashboardMemory).forEach((key) => {
        dashboardMemory[key] = dashboardMemory[key].filter(
          (item) => item.variantId !== variant.variantId,
        );
      });

      if (!dashboardMemory[newCacheKey]) return; // wo month abhi loaded nahi
      dashboardMemory[newCacheKey].unshift(variant);
    });

    forceRender({});
  };

  // Cache se card hatana — sirf successful delete ke baad call hota hai
  const removeCardFromCache = (cacheKey, variantId) => {
    if (!dashboardMemory[cacheKey]) return;
    dashboardMemory[cacheKey] = dashboardMemory[cacheKey].filter(
      (c) => c.variantId !== variantId,
    );
    forceRender({});
  };

  // Ye wahi function hai jo KanbanCard ka delete button call karta hai.
  // Abhi API no-op hai isliye card turant hat jaata hai (jaisa pehle tha).
  // Jab real Delete API aa jayegi, agar wo fail hui to card UI se hatega
  // hi nahi — error already `error` state mein set ho jayega.
  const deleteCard = async (cacheKey, variantId) => {
    try {
      await deleteItinerary(variantId);
      removeCardFromCache(cacheKey, variantId);
    } catch (err) {
      console.error("Delete failed, card not removed:", err);
    }
  };

  const resetForFilterChange = () => {
    fetchedKeysRef.current = new Set();
  };

  const clearDashboard = () => {
    dashboardMemory = {};
    fetchedMonthsCache.clear();
    inFlightRequests.clear();
    fetchedKeysRef.current.clear();
  };

  // ── FUTURE APIs (abhi ready nahi — jab ban jayein, yahan fill karna) ──

  //Tour Guide API
  const getGuidesList = async () => {
    try {
      debugger;
      const response = await axios.get(getTourGuideListEndPoint, {
        headers: {
          Authorization: `Bearer ${sessionUser.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Guides list:", error);
    }
  };

  // useCallback
  //Variant Status
  const fetchStatuses = async () => {
    debugger;
    try {
      const res = await axios.get(getStatusListEndPoint, {
        headers: {
          Authorization: `Bearer ${sessionUser.token}`,
        },
      });

      debugger;
      return res.data;
      console.log("Status API Response:", res.data);
    } catch (error) {
      console.error("Error fetching statuses:", error);
      throw error;
    }
  };

  //Target Audience Api
  const getTargetAudienceList = async () => {
    debugger;
    try {
      var response = await axios.get(getTargetAudienceListEndPoint, {
        headers: {
          Authorization: `Bearer ${sessionUser.token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching Target Audience list :", error);
    }
  };

  const getSectorTypeList =async ()=> {
    debugger;
    try 
    {
      var response = await axios.get(getSectorTypeListEndPoint,{
        headers: {
          Authorization:`Bearer ${sessionUser.token}`,
        },
      });

      return response.data;
      console.log("Sector type list: ",response);

    }
    catch(error)
    {
      console.log("Error fetching Sector Type list:",error);
    }
  }

  return {
    createItinerary,
    updateItinerary,
    deleteItinerary,
    loading,
    error,
    dashboardData: dashboardMemory,
    fetchMonth,
    mergeVariantsIntoDashboard,
    deleteCard,
    resetForFilterChange,
    clearDashboard,
    fetchStatuses,
    getGuidesList,
    getTargetAudienceList,
    getSectorTypeList,
    // fetchGuides, fetchStatuses, fetchTargetAudiences, // uncomment jab API ready ho
  };
}
