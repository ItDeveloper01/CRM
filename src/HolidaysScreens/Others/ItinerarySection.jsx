// import React, { useEffect, useState } from "react";
// import { getEmptyHolidayScheduleObj } from "../../Model/HolidayLeadObj";

// export default function ItinerarySection({
//     holidayLeadObj = {},
//     setHolidayLeadObj,
//     isViewMode = false
// }) {

//     // ======================================================
//     // STATE
//     // ======================================================

//     const [itineraries, setItineraries] = useState([]);
//     const [tabs, setTabs] = useState([]);
//     const [activeTab, setActiveTab] = useState(0);

//     const [showDiscount, setShowDiscount] = useState(true);

//     // ======================================================
//     // DUMMY DATA
//     // ======================================================

//    const dummyItineraries = [

//     {
//         itineraryID: 101,

//         itineraryName: "Kashmir Delight Tour",

//         startCity: "Srinagar",

//         endCity: "Srinagar",

//         duration: "6D/5N",

//         startDate: "2026-09-12",

//         endDate: "2026-09-17",

//         totalDays: 6,

//         totalNights: 5,

//         packageType: "Domestic",

//         status: "Active",

//         notes: "Houseboat stay included",

//         budgetPerPax: 30000,

//         maxDiscount: 10,

//         availableSeats:22,

//         schedule: [
//             {
//                 day: 1,
//                 title: "Arrival at Srinagar",
//                 details: "Airport pickup + Dal Lake shikara ride"
//             },
//             {
//                 day: 2,
//                 title: "Srinagar Local Sightseeing",
//                 details: "Mughal Gardens + Tulip Garden"
//             },
//             {
//                 day: 3,
//                 title: "Excursion to Gulmarg",
//                 details: "Gondola ride + snow activities"
//             },
//             {
//                 day: 4,
//                 title: "Pahalgam Visit",
//                 details: "Betaab Valley + Aru Valley"
//             },
//             {
//                 day: 5,
//                 title: "Sonmarg Day Trip",
//                 details: "Thajiwas Glacier sightseeing"
//             },
//             {
//                 day: 6,
//                 title: "Departure",
//                 details: "Drop at Srinagar Airport"
//             }
//         ]
//     },

//     {
//         itineraryID: 102,

//         itineraryName: "Goa Beach Escape",

//         startCity: "Goa",

//         endCity: "Goa",

//         duration: "4D/3N",

//         startDate: "2026-11-05",

//         endDate: "2026-11-08",

//         totalDays: 4,

//         totalNights: 3,

//         packageType: "Domestic",

//         status: "Active",

//         notes: "Beachside resort package",

//         availableSeats:22,

//         budgetPerPax: 30000,

//         maxDiscount: 10,

//         schedule: [
//             {
//                 day: 1,
//                 title: "Arrival in Goa",
//                 details: "Hotel check-in + evening beach walk"
//             },
//             {
//                 day: 2,
//                 title: "North Goa Tour",
//                 details: "Baga Beach + Fort Aguada + Calangute"
//             },
//             {
//                 day: 3,
//                 title: "South Goa Tour",
//                 details: "Colva Beach + Basilica of Bom Jesus"
//             },
//             {
//                 day: 4,
//                 title: "Departure",
//                 details: "Airport / Railway station drop"
//             }
//         ]
//     },

//     {
//         itineraryID: 103,

//         itineraryName: "Thailand Fun Holiday",

//         startCity: "Bangkok",

//         endCity: "Phuket",

//         duration: "7D/6N",

//         startDate: "2026-12-15",

//         endDate: "2026-12-21",

//         totalDays: 7,

//         totalNights: 6,

//         packageType: "International",

//         status: "Draft",

//         notes: "Visa assistance included",

//         availableSeats:22,
//         budgetPerPax: 30000,

//         maxDiscount: 10,

//         schedule: [
//             {
//                 day: 1,
//                 title: "Arrival at Bangkok",
//                 details: "Hotel transfer + leisure time"
//             },
//             {
//                 day: 2,
//                 title: "Bangkok City Tour",
//                 details: "Temple tour + shopping"
//             },
//             {
//                 day: 3,
//                 title: "Safari World Visit",
//                 details: "Marine Park + live shows"
//             },
//             {
//                 day: 4,
//                 title: "Transfer to Phuket",
//                 details: "Flight + hotel check-in"
//             },
//             {
//                 day: 5,
//                 title: "Phi Phi Island Tour",
//                 details: "Island hopping + lunch"
//             },
//             {
//                 day: 6,
//                 title: "Phuket Leisure Day",
//                 details: "Optional water sports"
//             },
//             {
//                 day: 7,
//                 title: "Departure",
//                 details: "Airport transfer"
//             }
//         ]
//     },

//     {
//         itineraryID: 104,

//         itineraryName: "Dubai Luxury Escape",

//         startCity: "Dubai",

//         endCity: "Dubai",

//         duration: "5D/4N",

//         startDate: "2026-10-02",

//         endDate: "2026-10-06",

//         totalDays: 5,

//         totalNights: 4,

//         packageType: "International",

//         status: "Active",

//         notes: "Desert safari included",

//         availableSeats:22,
//         budgetPerPax: 30000,

//         maxDiscount: 10,

//         schedule: [
//             {
//                 day: 1,
//                 title: "Arrival in Dubai",
//                 details: "Hotel transfer + Marina visit"
//             },
//             {
//                 day: 2,
//                 title: "Dubai City Tour",
//                 details: "Burj Khalifa + Dubai Mall"
//             },
//             {
//                 day: 3,
//                 title: "Desert Safari",
//                 details: "Dune bashing + BBQ dinner"
//             },
//             {
//                 day: 4,
//                 title: "Abu Dhabi Excursion",
//                 details: "Sheikh Zayed Mosque visit"
//             },
//             {
//                 day: 5,
//                 title: "Departure",
//                 details: "Airport drop"
//             }
//         ]
//     },

//     {
//         itineraryID: 105,

//         itineraryName: "Kerala Backwater Retreat",

//         startCity: "Cochin",

//         endCity: "Trivandrum",

//         duration: "5D/4N",

//         startDate: "2026-08-18",

//         endDate: "2026-08-22",

//         totalDays: 5,

//         totalNights: 4,

//         packageType: "Domestic",

//         status: "Completed",

//         notes: "Houseboat overnight stay",

//         availableSeats:22,
//         budgetPerPax: 30000,

//         maxDiscount: 10,

//         schedule: [
//             {
//                 day: 1,
//                 title: "Arrival at Cochin",
//                 details: "Local sightseeing + hotel stay"
//             },
//             {
//                 day: 2,
//                 title: "Munnar Transfer",
//                 details: "Tea gardens + waterfalls"
//             },
//             {
//                 day: 3,
//                 title: "Alleppey Houseboat",
//                 details: "Backwater cruise experience"
//             },
//             {
//                 day: 4,
//                 title: "Kovalam Visit",
//                 details: "Beach leisure + sunset"
//             },
//             {
//                 day: 5,
//                 title: "Departure from Trivandrum",
//                 details: "Airport transfer"
//             }
//         ]
//     },

//      {
//         itineraryID: 106,

//         itineraryName: "Kerala Backwater Retreat",

//         startCity: "Cochin",

//         endCity: "Trivandrum",

//         duration: "5D/4N",

//         startDate: "2026-08-18",

//         endDate: "2026-08-22",

//         totalDays: 5,

//         totalNights: 4,

//         packageType: "Domestic",

//         status: "Completed",

//         notes: "Houseboat overnight stay",

//         availableSeats:22,
//         budgetPerPax: 30000,

//         maxDiscount: 10,

//         schedule: [ getEmptyHolidayScheduleObj()    ]
        
//         // schedule: [
//         //     {
//         //         day: 1,
//         //         title: "Arrival at Cochin",
//         //         details: "Local sightseeing + hotel stay"
//         //     },
//         //     {
//         //         day: 2,
//         //         title: "Munnar Transfer",
//         //         details: "Tea gardens + waterfalls"
//         //     },
//         //     {
//         //         day: 3,
//         //         title: "Alleppey Houseboat",
//         //         details: "Backwater cruise experience"
//         //     },
//         //     {
//         //         day: 4,
//         //         title: "Kovalam Visit",
//         //         details: "Beach leisure + sunset"
//         //     },
//         //     {
//         //         day: 5,
//         //         title: "Departure from Trivandrum",
//         //         details: "Airport transfer"
//         //     }
//         // ]
//     }

// ];

//     // ======================================================
//     // INIT
//     // ======================================================

//     useEffect(() => {
//         setItineraries(dummyItineraries);

//         // default 1 tab
//         setTabs([
//             {
//                 tabId: 1,
//                 selectedItinerary: null
//             }
//         ]);
//     }, []);

//     // ======================================================
//     // ADD TAB
//     // ======================================================

//     const addTab = () => {
//         setTabs(prev => [
//             ...prev,
//             {
//                 tabId: Date.now(),
//                 selectedItinerary: null
//             }
//         ]);

//         setActiveTab(tabs.length);
//     };

//     // ======================================================
//     // REMOVE TAB
//     // ======================================================

//     const removeTab = (index) => {
//         const updated = tabs.filter((_, i) => i !== index);

//         setTabs(updated);

//         if (activeTab >= updated.length) {
//             setActiveTab(Math.max(0, updated.length - 1));
//         }
//     };

//     // ======================================================
//     // SELECT ITINERARY INSIDE TAB
//     // ======================================================

//     const handleSelectItinerary = (itineraryID) => {

//         const selected = itineraries.find(
//             x => x.itineraryID === Number(itineraryID)
//         );

//         if (!selected) return;

//         const updatedTabs = [...tabs];
//         updatedTabs[activeTab].selectedItinerary = selected;

//         setTabs(updatedTabs);
//     };

//     // ======================================================
//     // GET ACTIVE TAB DATA
//     // ======================================================

//     const currentTab = tabs[activeTab];
//     const current = currentTab?.selectedItinerary;

//     // ======================================================
//     // GET USED IDS (NO DUPLICATES ACROSS TABS)
//     // ======================================================

//     const usedIds = tabs
//         .map(t => t.selectedItinerary?.itineraryID)
//         .filter(Boolean);

//     // ======================================================
//     // UI
//     // ======================================================

//     return (
//         <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

//             {/* HEADER */}
//             <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b">
//                 <div className="font-semibold text-lg">
//                     Itinerary Planner
//                 </div>
//                 <div className="text-xs text-gray-500">
//                     Multiple itineraries in separate tabs
//                 </div>
//             </div>

//             {/* ======================================================
//                 TABS BAR
//             ====================================================== */}

//             <div className="flex gap-2 border-b px-4 pt-3 bg-gray-50 overflow-x-auto">

//                 {tabs.map((tab, index) => {

//                     const isActive = index === activeTab;

//                     return (
//                         <button
//                             key={tab.tabId}
//                             onClick={() => setActiveTab(index)}
//                             className={`
//                                 px-4 py-2 rounded-t-lg border whitespace-nowrap
//                                 ${isActive
//                                     ? "bg-white border-gray-300 border-b-white text-blue-600 font-semibold"
//                                     : "bg-gray-100 text-gray-600"
//                                 }
//                             `}
//                         >
//                             Tab {index + 1}

//                             <span
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     removeTab(index);
//                                 }}
//                                 className="ml-2 text-red-400"
//                             >
//                                 ✕
//                             </span>
//                         </button>
//                     );
//                 })}

//                 <button
//                     onClick={addTab}
//                     className="px-3 py-2 bg-blue-600 text-white rounded-t-lg"
//                 >
//                     +
//                 </button>

//             </div>

//             {/* ======================================================
//                 BODY
//             ====================================================== */}

//             <div className="p-6 space-y-6">

//                 {/* =========================
//                     DROPDOWN (PER TAB)
//                 ========================= */}

//                 <select
//                     className="border rounded-lg px-3 py-2 w-full"
//                     value={current?.itineraryID || ""}
//                     onChange={(e) => handleSelectItinerary(e.target.value)}
//                 >
//                     <option value="">
//                         Select Itinerary
//                     </option>

//                     {itineraries
//                         .filter(it =>
//                             !usedIds.includes(it.itineraryID) ||
//                             it.itineraryID === current?.itineraryID
//                         )
//                         .map(it => (
//                             <option key={it.itineraryID} value={it.itineraryID}>
//                                 {it.itineraryName}
//                             </option>
//                         ))}
//                 </select>

//                 {/* =========================
//                     DETAILS
//                 ========================= */}

//                 {current && (

//                     <>
//                         {/* CARDS */}
//                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

//                             <Card title="Budget" value={`₹ ${current.budgetPerPax}`} icon="💰" />

//                             {showDiscount && (
//                                 <Card title="Discount" value={`${current.maxDiscount}%`} icon="🎁" />
//                             )}

//                             <Card title="Seats" value={current.availableSeats} icon="🪑" />

//                             <Card title="Status" value={current.status} icon="📌" />

//                         </div>

//                         {/* DATES (YOU ASKED THIS 👇) */}
//                         <div className="grid grid-cols-2 gap-4">

//                             <Field label="Start Date" value={current.startDate} />
//                             <Field label="End Date" value={current.endDate} />

//                         </div>

//                         {/* CITY + DURATION */}
//                         <div className="grid grid-cols-3 gap-4">

//                             <Field label="Start City" value={current.startCity} />
//                             <Field label="End City" value={current.endCity} />
//                             <Field label="Duration" value={current.duration} />

//                         </div>

//                         {/* SCHEDULE */}
//                         <div className="border rounded-xl overflow-hidden">

//                             <table className="w-full text-sm">

//                                 <thead className="bg-gray-100">
//                                     <tr>
//                                         <th className="p-3">Day</th>
//                                         <th className="p-3">Title</th>
//                                         <th className="p-3">Details</th>
//                                     </tr>
//                                 </thead>

//                                 <tbody>
//                                     {current.schedule?.map((d, i) => (
//                                         <tr key={i} className="border-t">
//                                             <td className="p-3 text-center">{d.day}</td>
//                                             <td className="p-3">{d.title}</td>
//                                             <td className="p-3">{d.details}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>

//                             </table>

//                         </div>
//                     </>
//                 )}

//             </div>
//         </div>
//     );
// }

// // ======================================================
// // CARD
// // ======================================================

// function Card({ title, value, icon }) {
//     return (
//         <div className="bg-white border rounded-2xl p-4 shadow-sm">
//             <div className="flex justify-between">
//                 <div>
//                     <p className="text-xs text-gray-500">{title}</p>
//                     <h3 className="text-xl font-semibold">{value}</h3>
//                 </div>
//                 <div>{icon}</div>
//             </div>
//         </div>
//     );
// }

// // ======================================================
// // FIELD
// // ======================================================

// function Field({ label, value }) {
//     return (
//         <div>
//             <label className="text-xs text-gray-500">{label}</label>
//             <div className="bg-gray-50 border rounded-lg p-2">
//                 {value || "-"}
//             </div>
//         </div>
//     );
// }

import React, { useEffect, useState } from "react";

export default function ItinerarySection({
    holidayLeadObj = {},
    setHolidayLeadObj,
    isViewMode = false
}) {

    const [itineraries, setItineraries] = useState([]);
    const [tabs, setTabs] = useState([{ id: 1 }]);
    const [activeTab, setActiveTab] = useState(0);

    const [tabState, setTabState] = useState({}); 
    // tabState[tabId] = { itinerary, variant, pickup, showDiscount }

    // ======================================================
    // DUMMY DATA (same as yours)
    // ======================================================

const dummyItineraries = [
  {
    itineraryID: 101,
    name: "Kashmir Delight Tour",

    variants: [
      {
        variantID: 1,
        label: "Classic Loop",
        route: "Srinagar → Gulmarg → Pahalgam → Srinagar",

        startCity: "Srinagar",
        endCity: "Srinagar",

        baseStartDate: "2026-09-12",
        baseEndDate: "2026-09-17",

        basePrice: 30000,
        discount: 10,

        seats: 12,
        bookedSeats: 8,

        schedule: [
          { day: 1, title: "Arrival Srinagar", details: "Dal Lake stay" },
          { day: 2, title: "Gulmarg", details: "Cable car ride" },
          { day: 3, title: "Pahalgam", details: "Valley exploration" }
        ],

        pickupOptions: [
          {
            city: "Delhi",
            cost: 5000,
            pickupDate: "2026-09-11",
            adjustedStartDate: "2026-09-12"
          },
          {
            city: "Mumbai",
            cost: 6500,
            pickupDate: "2026-09-10",
            adjustedStartDate: "2026-09-12"
          }
        ]
      },

      {
        variantID: 2,
        label: "Luxury Escape",
        route: "Srinagar → Sonmarg → Gulmarg → Srinagar",

        startCity: "Srinagar",
        endCity: "Srinagar",

        baseStartDate: "2026-10-02",
        baseEndDate: "2026-10-07",

        basePrice: 52000,
        discount: 15,

        seats: 10,
        bookedSeats: 5,

        schedule: [
          { day: 1, title: "Arrival", details: "Luxury houseboat stay" },
          { day: 2, title: "Sonmarg", details: "Snow point visit" },
          { day: 3, title: "Gulmarg", details: "Premium gondola ride" }
        ],

        pickupOptions: [
          {
            city: "Delhi",
            cost: 8000,
            pickupDate: "2026-10-01",
            adjustedStartDate: "2026-10-02"
          },
          {
            city: "Hyderabad",
            cost: 9500,
            pickupDate: "2026-10-01",
            adjustedStartDate: "2026-10-02"
          }
        ]
      },

      {
        variantID: 3,
        label: "Budget Backpacker",
        route: "Srinagar → Gulmarg → Srinagar",

        startCity: "Srinagar",
        endCity: "Srinagar",

        baseStartDate: "2026-11-05",
        baseEndDate: "2026-11-09",

        basePrice: 18000,
        discount: 5,

        seats: 18,
        bookedSeats: 12,

        schedule: [
          { day: 1, title: "Arrival", details: "Hostel check-in" },
          { day: 2, title: "Gulmarg", details: "Sightseeing" },
          { day: 3, title: "Local Srinagar", details: "Market visit" }
        ],

        pickupOptions: [
          {
            city: "Delhi",
            cost: 4000,
            pickupDate: "2026-11-04",
            adjustedStartDate: "2026-11-05"
          }
        ]
      }
    ]
  },

  {
    itineraryID: 102,
    name: "Spiti Valley Expedition",

    variants: [
      {
        variantID: 4,
        label: "Backpacking Circuit",
        route: "Delhi → Manali → Kaza → Chandratal → Delhi",

        startCity: "Delhi",
        endCity: "Delhi",

        baseStartDate: "2026-06-15",
        baseEndDate: "2026-06-22",

        basePrice: 22000,
        discount: 5,

        seats: 20,
        bookedSeats: 15,

        schedule: [
          { day: 1, title: "Delhi to Manali", details: "Volvo journey" },
          { day: 2, title: "Manali", details: "Acclimatization" },
          { day: 3, title: "Kaza", details: "Mountain drive" }
        ],

        pickupOptions: [
          {
            city: "Delhi",
            cost: 0,
            pickupDate: "2026-06-14",
            adjustedStartDate: "2026-06-15"
          }
        ]
      },

      {
        variantID: 5,
        label: "Adventure Riders",
        route: "Chandigarh → Manali → Kaza → Pin Valley → Chandigarh",

        startCity: "Chandigarh",
        endCity: "Chandigarh",

        baseStartDate: "2026-07-10",
        baseEndDate: "2026-07-18",

        basePrice: 35000,
        discount: 8,

        seats: 15,
        bookedSeats: 9,

        schedule: [
          { day: 1, title: "Ride Begins", details: "Bike allocation" },
          { day: 2, title: "Manali", details: "Mountain briefing" },
          { day: 3, title: "Kaza", details: "High altitude ride" }
        ],

        pickupOptions: [
          {
            city: "Chandigarh",
            cost: 1500,
            pickupDate: "2026-07-09",
            adjustedStartDate: "2026-07-10"
          },
          {
            city: "Delhi",
            cost: 3500,
            pickupDate: "2026-07-09",
            adjustedStartDate: "2026-07-10"
          }
        ]
      },

      {
        variantID: 6,
        label: "Premium SUV Expedition",
        route: "Delhi → Shimla → Kaza → Manali → Delhi",

        startCity: "Delhi",
        endCity: "Delhi",

        baseStartDate: "2026-08-05",
        baseEndDate: "2026-08-13",

        basePrice: 48000,
        discount: 12,

        seats: 12,
        bookedSeats: 7,

        schedule: [
          { day: 1, title: "Departure", details: "Luxury SUV transfer" },
          { day: 2, title: "Shimla", details: "Mall road visit" },
          { day: 3, title: "Kaza", details: "Camping experience" }
        ],

        pickupOptions: [
          {
            city: "Delhi",
            cost: 0,
            pickupDate: "2026-08-04",
            adjustedStartDate: "2026-08-05"
          }
        ]
      }
    ]
  },

  {
    itineraryID: 103,
    name: "Goa Beach Party Retreat",

    variants: [
      {
        variantID: 7,
        label: "Weekend Party Edition",
        route: "North Goa → South Goa",

        startCity: "Goa",
        endCity: "Goa",

        baseStartDate: "2026-12-18",
        baseEndDate: "2026-12-21",

        basePrice: 18000,
        discount: 12,

        seats: 25,
        bookedSeats: 19,

        schedule: [
          { day: 1, title: "Arrival", details: "Beach party" },
          { day: 2, title: "North Goa", details: "Club hopping" },
          { day: 3, title: "South Goa", details: "Water sports" }
        ],

        pickupOptions: [
          {
            city: "Mumbai",
            cost: 4000,
            pickupDate: "2026-12-17",
            adjustedStartDate: "2026-12-18"
          }
        ]
      },

      {
        variantID: 8,
        label: "Luxury Beach Escape",
        route: "Candolim → Morjim → Palolem",

        startCity: "Goa",
        endCity: "Goa",

        baseStartDate: "2027-01-10",
        baseEndDate: "2027-01-15",

        basePrice: 42000,
        discount: 18,

        seats: 14,
        bookedSeats: 6,

        schedule: [
          { day: 1, title: "Resort Check-in", details: "Welcome drinks" },
          { day: 2, title: "Private Cruise", details: "Sunset yacht party" },
          { day: 3, title: "Beach Leisure", details: "Spa and cafe tour" }
        ],

        pickupOptions: [
          {
            city: "Bangalore",
            cost: 7000,
            pickupDate: "2027-01-09",
            adjustedStartDate: "2027-01-10"
          },
          {
            city: "Delhi",
            cost: 9500,
            pickupDate: "2027-01-09",
            adjustedStartDate: "2027-01-10"
          }
        ]
      }
    ]
  },

  {
    itineraryID: 104,
    name: "Leh Ladakh Adventure",

    variants: [
      {
        variantID: 9,
        label: "Bike Expedition",
        route: "Leh → Nubra → Pangong → Leh",

        startCity: "Leh",
        endCity: "Leh",

        baseStartDate: "2026-07-01",
        baseEndDate: "2026-07-08",

        basePrice: 38000,
        discount: 10,

        seats: 16,
        bookedSeats: 10,

        schedule: [
          { day: 1, title: "Arrival Leh", details: "Rest and acclimatize" },
          { day: 2, title: "Nubra Valley", details: "Camel safari" },
          { day: 3, title: "Pangong Lake", details: "Lakeside camping" }
        ],

        pickupOptions: [
          {
            city: "Delhi",
            cost: 8500,
            pickupDate: "2026-06-30",
            adjustedStartDate: "2026-07-01"
          }
        ]
      },

      {
        variantID: 10,
        label: "SUV Explorer",
        route: "Leh → Khardung La → Pangong → Tso Moriri",

        startCity: "Leh",
        endCity: "Leh",

        baseStartDate: "2026-08-12",
        baseEndDate: "2026-08-20",

        basePrice: 55000,
        discount: 14,

        seats: 12,
        bookedSeats: 4,

        schedule: [
          { day: 1, title: "Leh Arrival", details: "Hotel check-in" },
          { day: 2, title: "Khardung La", details: "Highest motorable road" },
          { day: 3, title: "Pangong", details: "Photography tour" }
        ],

        pickupOptions: [
          {
            city: "Mumbai",
            cost: 12000,
            pickupDate: "2026-08-11",
            adjustedStartDate: "2026-08-12"
          },
          {
            city: "Delhi",
            cost: 10000,
            pickupDate: "2026-08-11",
            adjustedStartDate: "2026-08-12"
          }
        ]
      }
    ]
  },

  {
    itineraryID: 105,
    name: "Kerala Backwaters Retreat",

    variants: [
      {
        variantID: 11,
        label: "Houseboat Experience",
        route: "Kochi → Alleppey → Munnar",

        startCity: "Kochi",
        endCity: "Kochi",

        baseStartDate: "2026-09-20",
        baseEndDate: "2026-09-25",

        basePrice: 26000,
        discount: 7,

        seats: 20,
        bookedSeats: 13,

        schedule: [
          { day: 1, title: "Kochi Arrival", details: "Fort Kochi tour" },
          { day: 2, title: "Alleppey", details: "Houseboat cruise" },
          { day: 3, title: "Munnar", details: "Tea plantation visit" }
        ],

        pickupOptions: [
          {
            city: "Chennai",
            cost: 3500,
            pickupDate: "2026-09-19",
            adjustedStartDate: "2026-09-20"
          },
          {
            city: "Bangalore",
            cost: 3000,
            pickupDate: "2026-09-19",
            adjustedStartDate: "2026-09-20"
          }
        ]
      },

      {
        variantID: 12,
        label: "Luxury Ayurveda Retreat",
        route: "Kochi → Kumarakom → Kovalam",

        startCity: "Kochi",
        endCity: "Trivandrum",

        baseStartDate: "2026-11-10",
        baseEndDate: "2026-11-16",

        basePrice: 60000,
        discount: 20,

        seats: 10,
        bookedSeats: 3,

        schedule: [
          { day: 1, title: "Arrival", details: "Luxury wellness resort" },
          { day: 2, title: "Ayurveda Therapy", details: "Spa sessions" },
          { day: 3, title: "Beach Leisure", details: "Sunset relaxation" }
        ],

        pickupOptions: [
          {
            city: "Mumbai",
            cost: 6500,
            pickupDate: "2026-11-09",
            adjustedStartDate: "2026-11-10"
          }
        ]
      }
    ]
  }
];
    // ======================================================
    useEffect(() => {
        setItineraries(dummyItineraries);
    }, []);

    // ======================================================
    // TAB HANDLERS
    // ======================================================

    const addTab = () => {
        const newTab = { id: Date.now() };
        setTabs(prev => [...prev, newTab]);
        setActiveTab(tabs.length);
    };

    const removeTab = (index) => {
        const newTabs = tabs.filter((_, i) => i !== index);
        setTabs(newTabs);
        setActiveTab(Math.max(0, index - 1));
    };

    const getPickupShift = (variant, pickup) =>
    pickup?.dateShiftDays || 0;

// const getFinalPrice = (variant, pickup) => {
//     const base = variant.basePrice;
//     const discount = (base * variant.discount) / 100;
//     const pickupCost = pickup?.cost || 0;

//     return base + pickupCost - discount;
// };
    // ======================================================
    // TAB STATE HANDLING
    // ======================================================

    const updateTabState = (tabIndex, data) => {
        setTabState(prev => ({
            ...prev,
            [tabIndex]: {
                ...prev[tabIndex],
                ...data
            }
        }));
    };

    const current = tabState[activeTab] || {
        itinerary: null,
        variant: null,
        pickup: null,
        showDiscount: true
    };

    // ======================================================
    // HELPERS
    // ======================================================

    const getFinalPrice = () => {
        if (!current.variant) return 0;

        const pickupCost = current.pickup?.cost || 0;
        const discount =
            (current.variant.basePrice * current.variant.discount) / 100;

        return current.variant.basePrice + pickupCost - discount;
    };

    // ======================================================
    // UI
    // ======================================================

    return (
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

            {/* ================= TABS ================= */}
            <div className="flex gap-2 border-b bg-gray-50 px-3 pt-3 overflow-x-auto">

                {tabs.map((t, i) => {
                    const state = tabState[i];

                    return (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(i)}
                            className={`px-4 py-2 rounded-t-lg text-sm border flex items-center gap-2 whitespace-nowrap
                                ${activeTab === i
                                    ? "bg-white border-b-white font-semibold"
                                    : "bg-gray-100"
                                }`}
                        >

                            {/* green dot */}
                            {state?.itinerary && (
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            )}

                            Itinerary {i + 1}

                            {tabs.length > 1 && (
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeTab(i);
                                    }}
                                    className="text-xs ml-1 text-gray-400 hover:text-red-500"
                                >
                                    ✕
                                </span>
                            )}
                        </button>
                    );
                })}

                <button
                    onClick={addTab}
                    className="px-3 py-2 text-blue-600 font-bold"
                >
                    +
                </button>
            </div>

            {/* ================= BODY ================= */}
<div className="p-6 space-y-6">

    {/* ================= ITINERARY ================= */}
    <select
        className="border p-2 w-full rounded"
        value={current.itinerary?.itineraryID || ""}
        onChange={(e) => {
            const it = itineraries.find(
                x => x.itineraryID === Number(e.target.value)
            );

            updateTabState(activeTab, {
                itinerary: it,
                variant: null,
                pickup: null
            });
        }}
    >
        <option value="">Select Itinerary</option>
        {itineraries.map(it => (
            <option key={it.itineraryID} value={it.itineraryID}>
                {it.name}
            </option>
        ))}
    </select>

    {/* ================= VARIANTS ================= */}
    {current.itinerary && (
        <div className="flex gap-2 flex-wrap">
            {current.itinerary.variants.map(v => (
                <button
                    key={v.variantID}
                    onClick={() =>
                        updateTabState(activeTab, {
                            variant: v,
                            pickup: null
                        })
                    }
                    className={`px-3 py-1 rounded-full text-xs border flex gap-2 items-center
                        ${current.variant?.variantID === v.variantID
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100"
                        }`}
                >
                    <span>{v.label}</span>

                    {/* 🧭 TOUR DATES */}
                    <span className="text-[10px] opacity-70">
                        Tour: {v.baseStartDate} → {v.baseEndDate}
                    </span>
                </button>
            ))}
        </div>
    )}

    {/* ================= PICKUP SECTION ================= */}
    {current.variant && (
        <div className="border rounded-xl p-4 bg-gray-50 space-y-3">

            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">
                    📍 Pickup Selection
                </h3>
            </div>

            {/* DROPDOWN */}
            <select
                className="border p-2 text-sm rounded w-full"
                onChange={(e) => {
                    const p = current.variant.pickupOptions.find(
                        x => x.city === e.target.value
                    );

                    updateTabState(activeTab, { pickup: p });
                }}
            >
                <option value="">Select Pickup City</option>

                {current.variant.pickupOptions.map((p, i) => (
                    <option key={i} value={p.city}>
                        {p.city} — Pickup {p.pickupDate} (+₹{p.cost})
                    </option>
                ))}
            </select>

            {/* 📍 PICKUP DETAILS */}
            {current.pickup && (
                <div className="bg-white border rounded-lg p-3 grid grid-cols-3 gap-3 text-xs">

                    <div>
                        <p className="text-gray-500">Pickup City</p>
                        <p className="font-semibold">{current.pickup.city}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Pickup Date</p>
                        <p className="font-semibold text-blue-600">
                            {current.pickup.pickupDate}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Cost Impact</p>
                        <p className="font-semibold text-green-600">
                            +₹{current.pickup.cost}
                        </p>
                    </div>

                </div>
            )}
        </div>
    )}

 
{/* ================= CARDS ================= */}
{current.variant && (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ======================================================
            1. TOUR TIMELINE CARD
        ====================================================== */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* TOP ACCENT */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600" />

            <div className="flex items-start justify-between">

                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">
                        Tour Timeline
                    </p>

                    <div className="mt-5 space-y-4">

                        {/* START */}
                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sm">
                                📍
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-800">
                                    {current.variant.startCity}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    {current.variant.baseStartDate}
                                </p>
                            </div>
                        </div>

                        {/* END */}
                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-sm">
                                🏁
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-800">
                                    {current.variant.endCity}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    {current.variant.baseEndDate}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 text-xl shadow-inner">
                    🧭
                </div>

            </div>
        </div>

        {/* ======================================================
            2. PRICING CARD
        ====================================================== */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">

            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600" />

            {/* TOGGLE */}
            <button
                onClick={() =>
                    updateTabState(activeTab, {
                        showDiscount: !current.showDiscount
                    })
                }
                className="absolute right-4 top-4 rounded-lg px-2 py-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
                ⋯
            </button>

            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Pricing Breakdown
            </p>

            <div className="mt-5 space-y-4">

                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                        Base Package
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                        ₹{current.variant.basePrice}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                        Pickup Charges
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                        ₹{current.pickup?.cost || 0}
                    </span>
                </div>

                {current.showDiscount && (
                    <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2">
                        <span className="text-sm font-medium text-emerald-700">
                            Discount ({current.variant.discount}%)
                        </span>

                        <span className="text-sm font-bold text-emerald-700">
                            -₹
                            {Math.round(
                                (current.variant.basePrice *
                                    current.variant.discount) /
                                    100
                            )}
                        </span>
                    </div>
                )}

                <div className="border-t border-dashed border-slate-200 pt-4">

                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-400">
                                Total Payable
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                ₹
                                {current.variant.basePrice +
                                    (current.pickup?.cost || 0) -
                                    (current.showDiscount
                                        ? Math.round(
                                              (current.variant.basePrice *
                                                  current.variant.discount) /
                                                  100
                                          )
                                        : 0)}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                            Inclusive
                        </div>
                    </div>

                </div>
            </div>
        </div>

        {/* ======================================================
            3. SEAT AVAILABILITY CARD
        ====================================================== */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">

            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />

            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-600">
                Seat Availability
            </p>

            <div className="mt-5">

                {/* STATS */}
                <div className="grid grid-cols-3 gap-3">

                    <div className="rounded-2xl bg-slate-50 p-3 text-center">
                        <p className="text-xs text-slate-500">
                            Total
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-800">
                            {current.variant.seats}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-red-50 p-3 text-center">
                        <p className="text-xs text-red-500">
                            Booked
                        </p>

                        <p className="mt-1 text-lg font-bold text-red-600">
                            {current.variant.bookedSeats}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-emerald-50 p-3 text-center">
                        <p className="text-xs text-emerald-600">
                            Available
                        </p>

                        <p className="mt-1 text-lg font-bold text-emerald-700">
                            {current.variant.seats -
                                current.variant.bookedSeats}
                        </p>
                    </div>

                </div>

                {/* PROGRESS */}
                <div className="mt-6">

                    <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                        <span>Booking Progress</span>

                        <span>
                            {Math.round(
                                (current.variant.bookedSeats /
                                    current.variant.seats) *
                                    100
                            )}
                            %
                        </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                            style={{
                                width: `${
                                    (current.variant.bookedSeats /
                                        current.variant.seats) *
                                    100
                                }%`
                            }}
                        />
                    </div>

                </div>

                {/* FOOTER */}
                <div className="mt-5 flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">

                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>

                        <span className="text-xs font-medium text-slate-600">
                            Seats updating live
                        </span>
                    </div>

                    <span className="text-xs font-semibold text-amber-700">
                        Fast Filling
                    </span>

                </div>

            </div>
        </div>

    </div>
)}
                    {/* ================= SCHEDULE ================= */}
                    {current.variant && (
                        <table className="w-full text-sm border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 border">Day</th>
                                    <th className="p-2 border">Title</th>
                                    <th className="p-2 border">Details</th>
                                </tr>
                            </thead>

                            <tbody>
                                {current.variant.schedule.map((s, i) => (
                                    <tr key={i}>
                                        <td className="border p-2 text-center">
                                            Day {s.day}
                                        </td>
                                        <td className="border p-2">{s.title}</td>
                                        <td className="border p-2">{s.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

             </div>
        </div>
    );
}

// CARD
function Card({ title, value }) {
    return (
        <div className="border rounded-xl p-3">
            <p className="text-xs text-gray-500">{title}</p>
            <h3 className="text-lg font-semibold">{value}</h3>
        </div>
    );
}