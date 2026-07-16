
// import dayjs from "dayjs";
// import { getEmptyHolidayServiceObj } from "./HolidayServicesModel";







// // ======================================================
// // HOLIDAY ITINERARY MODEL
// // ======================================================

// export const HolidayItineraryModel = {

//     itineraryID: null,

//     itineraryName: "",

//     startCity: "",

//     endCity: "",

//     duration: "",

//     startDate: "",

//     endDate: "",

//     totalDays: 0,

//     totalNights: 0,

//     packageType: "",

//     status: "",

//     notes: "",

//     // 🔥 ARRAY OF ITINERARY DAY MODEL
//     schedule: [
//         getEmptyItineraryDayObj()
//     ]
// };

// export const getEmptyHolidayItineraryObj = () => {

//     return structuredClone(HolidayItineraryModel);
// };

// // ======================================================
// // ITINERARY DAY MODEL
// // ======================================================

// export const ItineraryDayModel = {

//     day: 1,

//     title: "",

//     details: "",

//     city: "",

//     hotelName: "",

//     mealsIncluded: [],

//     activities: [],

//     transportMode: "",

//     sightseeingIncluded: false
// };

// export const getEmptyItineraryDayObj = () => {

//     return structuredClone(ItineraryDayModel);
// };

// // ======================================================
// // PACKAGE PREFERENCE MODEL
// // ======================================================

// export const PackagePreferenceModel = {

//     packagePreferenceID: null,

//     // ==========================================
//     // TRAVEL DATES
//     // ==========================================

//     fromDate: "",

//     toDate: "",

//     duration: "",

//     isFlexibleDates: false,

//     flexibleDays: 0,

//     // ==========================================
//     // BUDGET
//     // ==========================================

//     budget: 0,

//     currency: "INR",

//     // ==========================================
//     // HOTEL & MEAL
//     // ==========================================

//     hotelCategory: "",

//     mealPlan: "",

//     // ==========================================
//     // TRIP INFO
//     // ==========================================

//     tripDescription: "",

//     departureCity: "",

//     destinations: "",

//     // ==========================================
//     // EXTRA
//     // ==========================================

//     notes: ""
// };

// export const getEmptyPackagePreferenceObj = () => {

//     return structuredClone(PackagePreferenceModel);
// };


// export const HolidayLeadObject = {

//     // =====================================================
//     // BASIC
//     // =====================================================

//     holidayLeadID: null,

//     leadType: "",          // FIT / GIT
//     tripType: "",          // Domestic / International
//     status: "",

//     // =====================================================
//     // PAX
//     // =====================================================

    

//         NoOfAdults: 4,
//         NoOfChildren: 0,
//         NoOfInfants: 2,

//         IsSeniorCitizen: false,

//         IsDifferentAbled: false,

//         DisabilitySelected: null,

//     // =====================================================
//     // SERVICES
//     // =====================================================

//     services: [ getEmptyHolidayServiceObj() ],


//     // =====================================================
//     // ITINERARIES
//     // =====================================================

//     itineraries: [
//        getEmptyHolidayItineraryObj()
//     ],

//     // =====================================================
//     // PACKAGE PREFERENCES
//     // =====================================================

//     packages: [
//         getEmptyPackagePreferenceObj()
//     ],

//     // =====================================================
//     // PASSPORT / VISA
//     // =====================================================

//     passportDetails: {

//         passportNo: "",
//         passportExpiry: "",

//         visaRequired: false,
//         visaStatus: "",

//         insuranceRequired: false
//     },

//     // =====================================================
//     // SPECIAL REQUIREMENTS
//     // =====================================================

//     specialRequirements: [],

//     // =====================================================
//     // PRICING
//     // =====================================================

    

//         quoteAmount: 10000,

//         discountAmount: 2198,

//         finalAmount: 7802,
    

//     // =====================================================
//     // REMARKS
//     // =====================================================

//     quoteGiven: "",

//     notes: "",

//     // =====================================================
//     // AUDIT
//     // =====================================================

//     createdBy_UserID: null,
//     assignee_UserID: null,
//     updatedBy_UserID: null,

//     createdAt: null,
//     updatedAt: null
// };

// // =====================================================
// // EMPTY OBJECT
// // =====================================================

// export const getEmptyHolidayLeadObj = () => {

//     return {

//         ...structuredClone(HolidayLeadObject),

//         createdAt: dayjs().toISOString(),

//         updatedAt: dayjs().toISOString()
//     };
// };

import dayjs from "dayjs";
import { getEmptyHolidayServiceObj } from "./HolidayServicesModel";
import {getEmptyPassportDetailsObj} from "./PassportDetailsModel";
import { PaxDetails } from "../HolidaysScreens/Others/PaxDetails";


export const getEmptyPaxDetailsObj = () => {
  return {
    noOfAdults: 0,
    noOfExtraAdults: 0,

    noOfChildrenWithBed: 0,
    noOfChildrenWithoutBed: 0,

    infants: 0,

    noOfRooms: 1,

    RoomType: 0,
    HotelType: 0,

    isSeniorCitizen : false,

   isDifferentAbled : false,

    DisabilityType: 0,

    totalPax: 0
  };
};
// ======================================================
// ITINERARY DAY MODEL
// ======================================================

export const ItineraryDayModel = {

    day: 1,

    title: "",

    details: "",

    city: "",

    hotelName: "",

    mealsIncluded: [],

    activities: [],

    transportMode: "",

    sightseeingIncluded: false
};

export const getEmptyItineraryDayObj = () => {

    return structuredClone(ItineraryDayModel);
};

// ======================================================
// HOLIDAY ITINERARY MODEL
// ======================================================


export const HolidayScheduleModel = {

    day: 0,

    title: "",

    details: ""

};


export const HolidayItineraryModel = {

    itineraryID: null,

    itineraryName: "",

    startCity: "",

    endCity: "",

    duration: "",

    startDate: "",

    endDate: "",

    totalDays: 0,

    totalNights: 0,

    packageType: "",

    status: "",

    notes: "",

    // 🔥 MULTIPLE DAY SCHEDULES
    schedule: []
};


export const getEmptyHolidayScheduleObj = () => {
    
     return structuredClone(HolidayScheduleModel);

};

export const getEmptyHolidayItineraryObj = () => {

    return structuredClone(HolidayItineraryModel);
};

// ======================================================
// PACKAGE PREFERENCE MODEL
// ======================================================

export const PackagePreferenceModel = {

    packagePreferenceID: null,

    // ==========================================
    // TRAVEL DATES
    // ==========================================

    fromDate: "",

    toDate: "",

    duration: "",

    isFlexibleDates: false,

    flexibleDays: 0,

    // ==========================================
    // BUDGET
    // ==========================================

    budget: 0,

    currency: "INR",

    // ==========================================
    // HOTEL & MEAL
    // ==========================================

    hotelCategory: "",

    mealPlan: "",

    // ==========================================
    // TRIP INFO
    // ==========================================

    tripDescription: "",

    departureCity: "",

    destinations: "",

    // ==========================================
    // EXTRA
    // ==========================================

    notes: ""
};

export const getEmptyPackagePreferenceObj = () => {

    return structuredClone(PackagePreferenceModel);
};

// ======================================================
// PASSPORT / VISA MODEL
// ======================================================


// ======================================================
// HOLIDAY LEAD MODEL
// ======================================================

export const HolidayLeadObject = {

    // =====================================================
    // BASIC
    // =====================================================

    holidayLeadID: null,

    leadType: "",          // FIT / GIT

    tripType: "",          // Domestic / International

    status: "",

    requestedDestinations: "", // New field for preferred destinations

    // =====================================================
    // PAX
    // =====================================================

    paxDetails: getEmptyPaxDetailsObj(),

    // =====================================================
    // SERVICES
    // =====================================================

    services: null,

    // =====================================================
    // ITINERARIES
    // =====================================================

    itineraries: [],

    selectedGITItinerariesForEdit:null,

    // =====================================================
    // PACKAGE PREFERENCES
    // =====================================================

    packages: [],

    // =====================================================
    // PASSPORT / VISA
    // =====================================================

    passportDetails: getEmptyPassportDetailsObj(),

    // =====================================================
    // SPECIAL REQUIREMENTS
    // =====================================================

    specialRequirements: [],

    // =====================================================
    // PRICING
    // =====================================================

    quoteAmount: 0,

    discountAmount: 0,

    finalAmount: 0,

    // =====================================================
    // REMARKS
    // =====================================================

    quoteGiven: "",

    notes: "",

    // =====================================================
    // AUDIT
    // =====================================================

    createdBy_UserID: null,

    assignee_UserID: null,

    updatedBy_UserID: null,

    createdAt: null,

    updatedAt: null
};

// =====================================================
// EMPTY OBJECT
// =====================================================

export const getEmptyHolidayLeadObj = () => {

    return {

        ...structuredClone(HolidayLeadObject),

        createdAt: dayjs().toISOString(),

        updatedAt: dayjs().toISOString()
    };
};