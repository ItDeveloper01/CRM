// import React, { useState, useEffect } from "react";
// import { ViewField } from "../../ConstantComponent/ViewComponents";
// import { getLabelById } from "../../utils/selectUtils";

// const CalendarIcon = ({ size = 14, color = "#2563eb" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke={color}
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <rect x="3" y="4" width="18" height="18" rx="2" />
//     <line x1="16" y1="2" x2="16" y2="6" />
//     <line x1="8" y1="2" x2="8" y2="6" />
//     <line x1="3" y1="10" x2="21" y2="10" />
//   </svg>
// );

// export default function TravelPackage(
//   carLeaddObj = {},
//   setCarLeadObj,
//   cities = [],
//   isViewMode = false
// ) {
//   const [isOpen, setIsOpen] = useState(false); // collapsed by default
//   const [flexible, setFlexible] = useState(true);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [duration, setDuration] = useState("-");

//   // 🔹 Duration calc
//   useEffect(() => {
//     if (fromDate && toDate) {
//       const start = new Date(fromDate);
//       const end = new Date(toDate);
//       const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

//       if (diff >= 0) {
//         setDuration(`${diff}N/${diff + 1}D`);
//       } else {
//         setDuration("Invalid");
//       }
//     } else {
//       setDuration("-");
//     }
//   }, [fromDate, toDate]);

//   // 🔹 Indicator logic
//   const hasData =
//     fromDate || toDate || carLeaddObj?.servingCity || carLeaddObj?.destinations;

//   return (
//     <div className="w-full mt-4">
//       <div className="w-full border rounded-lg bg-white">

//         {/* 🔥 HEADER */}
//         <div
//           onClick={() => setIsOpen(prev => !prev)}
//           className="flex justify-between items-center w-full p-3 bg-gray-100 cursor-pointer"
//         >
//           <div className="flex items-center gap-2">
//             <span className="font-semibold text-gray-700">
//               Package Preference
//             </span>

//             {/* Summary when collapsed */}
//             {!isOpen && hasData && (
//               <span className="text-xs text-gray-500">
//                 {fromDate && toDate
//                   ? `${fromDate} → ${toDate} | ${duration}`
//                   : "Details added"}
//               </span>
//             )}
//           </div>

//           <div className="flex items-center gap-2">
//             {/* Pulse indicator */}
//             {hasData && !isOpen && (
//               <span className="w-3.5 h-3.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.9)]"></span>
//             )}
//             <span>{isOpen ? "▲" : "▼"}</span>
//           </div>
//         </div>

//         {/* 🔥 BODY */}
//         {isOpen && (
//           <div className="p-3">

//             <div className="border border-gray-300 rounded-lg bg-white px-3 py-3 relative">

//               {/* ROW 1 */}
//               <div className="flex flex-nowrap items-end gap-2 w-full overflow-hidden">

//                 <div className="flex-[1_1_0] min-w-0">
//                   <label className="text-[11px] flex items-center gap-1 mb-0.5 text-gray-600">
//                     <CalendarIcon color="#2563eb" /> From
//                   </label>
//                   <input
//                     type="date"
//                     value={fromDate}
//                     onChange={(e) => setFromDate(e.target.value)}
//                     className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
//                   />
//                 </div>

//                 <div className="flex-[1_1_0] min-w-0">
//                   <label className="text-[11px] flex items-center gap-1 mb-0.5 text-gray-600">
//                     <CalendarIcon color="#16a34a" /> To
//                   </label>
//                   <input
//                     type="date"
//                     value={toDate}
//                     onChange={(e) => setToDate(e.target.value)}
//                     className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
//                   />
//                 </div>

//                 <div className="flex-[0_0_90px]">
//                   <label className="text-[11px] mb-0.5 block text-gray-600">Dur</label>
//                   <input
//                     type="text"
//                     disabled
//                     value={duration}
//                     className="w-full border border-gray-200 rounded px-2 py-1 text-xs bg-gray-100"
//                   />
//                 </div>

//                 {/* FLEXIBLE */}
//                 <div className="flex items-end gap-2">
//                   <div className="flex items-center gap-1 mb-0.5">
//                     <span className="text-[11px] text-gray-600">Flex</span>
//                     <button
//                       onClick={() => setFlexible(!flexible)}
//                       className={`w-9 h-4 flex items-center rounded-full p-0.5 ${
//                         flexible ? "bg-blue-500" : "bg-gray-300"
//                       }`}
//                     >
//                       <div
//                         className={`bg-white w-3 h-3 rounded-full shadow transform ${
//                           flexible ? "translate-x-5" : ""
//                         }`}
//                       />
//                     </button>
//                   </div>

//                   {flexible && (
//                     <div className="flex-[0_0_70px]">
//                       <label className="text-[11px] mb-0.5 block text-gray-600">
//                         ±Days
//                       </label>
//                       <input
//                         type="number"
//                         className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* ROW 2 */}
//               <div className="flex flex-nowrap items-end gap-2 w-full mt-3">

//                 <div className="flex-[1_1_0] min-w-0">
//                   <label className="text-[11px] mb-0.5 block text-gray-600">₹ Budget</label>
//                   <input
//                     type="number"
//                     className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
//                   />
//                 </div>

//                 <div className="flex-[1_1_0] min-w-0">
//                   <label className="text-[11px] mb-0.5 block text-gray-600">Hotel</label>
//                   <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs">
//                     <option>Select</option>
//                     <option>3 Star</option>
//                     <option>4 Star</option>
//                     <option>5 Star</option>
//                   </select>
//                 </div>

//                 <div className="flex-[1_1_0] min-w-0">
//                   <label className="text-[11px] mb-0.5 block text-gray-600">Meal</label>
//                   <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs">
//                     <option>Select</option>
//                     <option>Breakfast</option>
//                     <option>Half Board</option>
//                     <option>Full Board</option>
//                     <option>All Inclusive</option>
//                   </select>
//                 </div>

//               </div>

//               {/* EXTRA FIELDS */}
//               <div className="flex gap-3 flex-wrap mt-3">

//                 <div className="flex-1 min-w-[250px]">
//                   <label className="label-style">Trip Description</label>
//                   {isViewMode ? (
//                     <ViewField value={""} />
//                   ) : (
//                     <input
//                       name="tripDescription"
//                       placeholder="Trip Description"
//                       className="border-highlight"
//                     />
//                   )}
//                 </div>

//                 <div className="flex-1 min-w-[250px]">
//                   <label className="label-style">Departure City</label>
//                   {isViewMode ? (
//                     <ViewField
//                       value={getLabelById(
//                         cities,
//                         carLeaddObj.servingCity,
//                         "id",
//                         "cityName"
//                       )}
//                     />
//                   ) : (
//                     <select
//                       name="servingCity"
//                       value={carLeaddObj.servingCity || ""}
//                       onChange={(e) => {
//                         const value =
//                           e.target.value === ""
//                             ? null
//                             : Number(e.target.value);
//                         setCarLeadObj(prev => ({
//                           ...prev,
//                           servingCity: value
//                         }));
//                       }}
//                       className="border-highlight"
//                     >
//                       <option value="">Select City</option>
//                       {cities.map(city => (
//                         <option key={city.id} value={city.id}>
//                           {city.cityName}
//                         </option>
//                       ))}
//                     </select>
//                   )}
//                 </div>
//               </div>

//               {/* DESTINATIONS */}
//               <div className="mt-3">
//                 <label className="label-style">Destination(s)</label>
//                 {isViewMode ? (
//                   <ViewField value={carLeaddObj?.destinations?.join(", ") || ""} />
//                 ) : (
//                   <input
//                     name="destinations"
//                     placeholder="e.g. Paris, Rome, Zurich"
//                     className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400"
//                   />
//                 )}
//               </div>

//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { getEmptyPackagePreferenceObj } from "./../../Model/HolidayLeadObj";

const CalendarIcon = ({ size = 14, color = "#2563eb" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

export default function TravelPackage({
    holidayLeadObj = {},
    setHolidayLeadObj,
    cities = [],
    isViewMode = false
}) {

    const [isOpen, setIsOpen] = useState(true);

    const [activeTab, setActiveTab] = useState(0);

    // 🔥 INIT
    useEffect(() => {

        if (!holidayLeadObj.packages) {

            setHolidayLeadObj(prev => ({
                ...prev,
                packages: [getEmptyPackagePreferenceObj()]
            }));
        }

    }, []);

    const packagesArray =
        holidayLeadObj.packages || [];

    // 🔥 HAS DATA
    const hasPackageData = (pkg) => {

        return !!(
            pkg?.fromDate ||
            pkg?.toDate ||
            pkg?.budget ||
            pkg?.tripDescription ||
            pkg?.destinations ||
            pkg?.departureCity
        );
    };

    // 🔥 ACTIVE COUNT
    const activePackageCount =
        packagesArray.filter(hasPackageData).length;

    // 🔥 UPDATE
    const updatePackage = (index, field, value) => {

        const updated = [...packagesArray];

        updated[index] = {
            ...updated[index],
            [field]: value
        };

        // AUTO DURATION
        if (
            field === "fromDate" ||
            field === "toDate"
        ) {

            const fromDate =
                field === "fromDate"
                    ? value
                    : updated[index].fromDate;

            const toDate =
                field === "toDate"
                    ? value
                    : updated[index].toDate;

            if (fromDate && toDate) {

                const start = new Date(fromDate);

                const end = new Date(toDate);

                const diff = Math.ceil(
                    (end - start) / (1000 * 60 * 60 * 24)
                );

                updated[index].duration =
                    diff >= 0
                        ? `${diff}N/${diff + 1}D`
                        : "Invalid";
            }
        }

        setHolidayLeadObj(prev => ({
            ...prev,
            packages: updated
        }));
    };

    // 🔥 ADD
    const addPackagePreference = () => {

        setHolidayLeadObj(prev => ({
            ...prev,
            packages: [
                ...(prev.packages || []),
                getEmptyPackagePreferenceObj()
            ]
        }));
    };

    // 🔥 REMOVE
    const removePackagePreference = (index) => {

        const updated = [...packagesArray];

        updated.splice(index, 1);

        setHolidayLeadObj(prev => ({
            ...prev,
            packages:
                updated.length > 0
                    ? updated
                    : [getEmptyPackagePreferenceObj()]
        }));
    };

    return (
        <div className="w-full mt-4">

            <div className="border rounded-xl bg-white overflow-hidden shadow-sm">

                {/* 🔥 HEADER */}
                <div
                    onClick={() => setIsOpen(prev => !prev)}
                    className="flex justify-between items-center p-3 bg-gray-100 cursor-pointer border-b"
                >

                    <div className="flex items-center gap-2">

                        <span className="font-semibold text-gray-700">
                            Package Preferences
                        </span>

                        {/* ACTIVE COUNT */}
                        {activePackageCount > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                                {activePackageCount} Active
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">

                        {/* GREEN PULSE */}
                        {activePackageCount > 0 && (
                            <span className="w-3.5 h-3.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.9)]"></span>
                        )}

                        <span>
                            {isOpen ? "▲" : "▼"}
                        </span>
                    </div>
                </div>

                {/* 🔥 BODY */}
                {isOpen && (

                    <div>

                        {/* 🔥 TABS */}
                        <div className="flex gap-2 border-b overflow-x-auto px-4 pt-3 bg-gray-50">

                            {packagesArray.map((pkg, index) => {

                                const hasData =
                                    hasPackageData(pkg);

                                const isActive =
                                    activeTab === index;

                                return (

                                    <button
                                        key={pkg.packagePreferenceID || index}
                                        onClick={() => setActiveTab(index)}
                                        className={`

                                            relative px-5 py-2.5 flex items-center gap-2 rounded-t-lg border transition-all duration-200 whitespace-nowrap

                                            ${isActive
                                                ? "bg-white border-gray-300 border-b-white text-blue-600 font-semibold shadow-sm"
                                                : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200 hover:text-gray-800"
                                            }
                                        `}
                                    >

                                        {/* ACTIVE TOP BAR */}
                                        {isActive && (
                                            <span className="absolute top-0 left-0 w-full h-[3px] bg-blue-500 rounded-t-lg"></span>
                                        )}

                                        {/* GREEN DOT */}
                                        {hasData && (
                                            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                                        )}

                                        {/* LABEL */}
                                        <span>
                                            Package {index + 1}
                                        </span>

                                        {/* DURATION */}
                                        {pkg.duration && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full
                                                ${isActive
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-gray-200 text-gray-600"
                                                }`}
                                            >
                                                {pkg.duration}
                                            </span>
                                        )}

                                        {/* REMOVE */}
                                        {!isViewMode &&
                                            packagesArray.length > 1 && (

                                                <span
                                                    onClick={(e) => {

                                                        e.stopPropagation();

                                                        removePackagePreference(index);

                                                        if (
                                                            activeTab >=
                                                            packagesArray.length - 1
                                                        ) {

                                                            setActiveTab(
                                                                Math.max(
                                                                    0,
                                                                    activeTab - 1
                                                                )
                                                            );
                                                        }
                                                    }}
                                                    className={`
                                                        ml-1 text-xs w-5 h-5 rounded-full flex items-center justify-center

                                                        ${isActive
                                                            ? "hover:bg-blue-100"
                                                            : "hover:bg-red-100"
                                                        }
                                                    `}
                                                >
                                                    ✕
                                                </span>
                                            )}
                                    </button>
                                );
                            })}

                            {/* 🔥 ADD BUTTON */}
                            {!isViewMode && (

                                <button
                                    type="button"
                                    onClick={() => {

                                        addPackagePreference();

                                        setTimeout(() => {
                                            setActiveTab(packagesArray.length);
                                        }, 0);
                                    }}
                                    className="h-10 min-w-[40px] rounded-t-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center text-xl shadow-sm"
                                >
                                    +
                                </button>
                            )}
                        </div>

                        {/* 🔥 ACTIVE PACKAGE */}
                        <div className="p-4">

                            {packagesArray[activeTab] && (() => {

                                const pkg =
                                    packagesArray[activeTab];

                                const index =
                                    activeTab;

                                return (

                                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">

                                        {/* ROW 1 */}
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">

                                            <div>
                                                <label className="label-style flex items-center gap-1">
                                                    <CalendarIcon />
                                                    From
                                                </label>

                                                <input
                                                    type="date"
                                                    value={pkg.fromDate || ""}
                                                    onChange={(e) =>
                                                        updatePackage(
                                                            index,
                                                            "fromDate",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border-highlight"
                                                />
                                            </div>

                                            <div>
                                                <label className="label-style flex items-center gap-1">
                                                    <CalendarIcon color="#16a34a" />
                                                    To
                                                </label>

                                                <input
                                                    type="date"
                                                    value={pkg.toDate || ""}
                                                    onChange={(e) =>
                                                        updatePackage(
                                                            index,
                                                            "toDate",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border-highlight"
                                                />
                                            </div>

                                            <div>
                                                <label className="label-style">
                                                    Duration
                                                </label>

                                                <input
                                                    type="text"
                                                    disabled
                                                    value={pkg.duration || ""}
                                                    className="border-highlight bg-gray-100"
                                                />
                                            </div>

                                            <div>
                                                <label className="label-style">
                                                    Flexible Dates
                                                </label>

                                                <select
                                                    value={
                                                        pkg.isFlexibleDates
                                                            ? "yes"
                                                            : "no"
                                                    }
                                                    onChange={(e) =>
                                                        updatePackage(
                                                            index,
                                                            "isFlexibleDates",
                                                            e.target.value === "yes"
                                                        )
                                                    }
                                                    className="border-highlight"
                                                >
                                                    <option value="no">
                                                        No
                                                    </option>

                                                    <option value="yes">
                                                        Yes
                                                    </option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="label-style">
                                                    ± Days
                                                </label>

                                                <input
                                                    type="number"
                                                    value={pkg.flexibleDays || 0}
                                                    onChange={(e) =>
                                                        updatePackage(
                                                            index,
                                                            "flexibleDays",
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    className="border-highlight"
                                                />
                                            </div>
                                        </div>

                                        {/* ROW 2 */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">

                                            <div>
                                                <label className="label-style">
                                                    Budget
                                                </label>

                                                <input
                                                    type="number"
                                                    value={pkg.budget || ""}
                                                    onChange={(e) =>
                                                        updatePackage(
                                                            index,
                                                            "budget",
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    className="border-highlight"
                                                />
                                            </div>

                                            <div>
                                                <label className="label-style">
                                                    Currency
                                                </label>

                                                <select
                                                    value={pkg.currency || "INR"}
                                                    onChange={(e) =>
                                                        updatePackage(
                                                            index,
                                                            "currency",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border-highlight"
                                                >
                                                    <option value="INR">
                                                        INR
                                                    </option>

                                                    <option value="USD">
                                                        USD
                                                    </option>

                                                    <option value="EUR">
                                                        EUR
                                                    </option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="label-style">
                                                    Hotel
                                                </label>

                                                <select
                                                    value={pkg.hotelCategory || ""}
                                                    onChange={(e) =>
                                                        updatePackage(
                                                            index,
                                                            "hotelCategory",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border-highlight"
                                                >
                                                    <option value="">
                                                        Select
                                                    </option>

                                                    <option value="3 Star">
                                                        3 Star
                                                    </option>

                                                    <option value="4 Star">
                                                        4 Star
                                                    </option>

                                                    <option value="5 Star">
                                                        5 Star
                                                    </option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="label-style">
                                                    Meal Plan
                                                </label>

                                                <select
                                                    value={pkg.mealPlan || ""}
                                                    onChange={(e) =>
                                                        updatePackage(
                                                            index,
                                                            "mealPlan",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border-highlight"
                                                >
                                                    <option value="">
                                                        Select
                                                    </option>

                                                    <option value="Breakfast">
                                                        Breakfast
                                                    </option>

                                                    <option value="Half Board">
                                                        Half Board
                                                    </option>

                                                    <option value="Full Board">
                                                        Full Board
                                                    </option>

                                                    <option value="All Inclusive">
                                                        All Inclusive
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* ROW 3 */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">

                                            <div>
                                                <label className="label-style">
                                                    Trip Description
                                                </label>

                                                <input
                                                    type="text"
                                                    value={pkg.tripDescription || ""}
                                                    onChange={(e) =>
                                                        updatePackage(
                                                            index,
                                                            "tripDescription",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border-highlight"
                                                />
                                            </div>

                                            <div>
                                                <label className="label-style">
                                                    Departure City
                                                </label>

                                                <select
                                                    value={pkg.departureCity || ""}
                                                    onChange={(e) =>
                                                        updatePackage(
                                                            index,
                                                            "departureCity",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border-highlight"
                                                >
                                                    <option value="">
                                                        Select City
                                                    </option>

                                                    {cities.map(city => (
                                                        <option
                                                            key={city.id}
                                                            value={city.id}
                                                        >
                                                            {city.cityName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* DESTINATIONS */}
                                        <div className="mt-3">

                                            <label className="label-style">
                                                Destinations
                                            </label>

                                            <input
                                                type="text"
                                                value={pkg.destinations || ""}
                                                onChange={(e) =>
                                                    updatePackage(
                                                        index,
                                                        "destinations",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g. Paris, Rome, Zurich"
                                                className="border-highlight"
                                            />
                                        </div>

                                        {/* NOTES */}
                                        <div className="mt-3">

                                            <label className="label-style">
                                                Notes
                                            </label>

                                            <textarea
                                                rows={3}
                                                value={pkg.notes || ""}
                                                onChange={(e) =>
                                                    updatePackage(
                                                        index,
                                                        "notes",
                                                        e.target.value
                                                    )
                                                }
                                                className="border-highlight"
                                            />
                                        </div>

                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}