import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { getEmptyPackagePreferenceObj } from "./Model/HolidayLeadObj";
import { getEmptyHolidayItineraryObj } from "./Model/HolidayLeadObj";
import { getEmptyHolidayServiceObj } from "./Model/HolidayServicesModel";

import SpecialRequirementsSection from "./HolidaysScreens/Others/SpecialRequirementSection";
// Instead of one big destructure, try explicit imports:
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";




import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";


import config from "./config";

import HistoryHover from "./HIstoryHover";
import QuoteCalculator from "./paymentComponents/QuoteComponent";

import PassportDetails from "./PassportDetails";

import { getEmptyPassportDetailsObj } from  "./Model/PassportDetailsModel";

import { getEmptyPaxDetailsObj } from "./Model/HolidayLeadObj";

import { PaxDetails } from "./HolidaysScreens/Others/PaxDetails";
import TravelPackage from "./HolidaysScreens/Others/Travelpackage";
import ServiceAccordion from "./HolidaysScreens/Others/ServiceAccordian";
import ItinerarySection from "./HolidaysScreens/Others/ItinerarySection";

import TrainBookingForm from "./HolidaysScreens/Service/TrainBookings";
import CarRentalBookingForm from "./HolidaysScreens/Service/CarRentalBookings";
import AirportTransferForm from "./HolidaysScreens/Service/AirportTransferForm";
import SightseeingForm from "./HolidaysScreens/Service/SightSeeingForm";

import { MESSAGE_TYPES } from "./Constants";
import { useMessageBox } from "./Notification";

import {
    ViewField
} from "./ConstantComponent/ViewComponents";

import {
    FormControl,
    Select,
    MenuItem,
    Checkbox,
    ListItemText
} from "@mui/material";

import {
    Train,
    Car,
    Plane,
    Shield,
    Map
} from "lucide-react";
import { fa } from "intl-tel-input/i18n";
import { getEmptyItineraryDayObj } from "./Model/HolidayLeadObj";



// ======================================================
// MAIN COMPONENT
// ======================================================

const LeadHolidays = ({
    holidayLeadObj,
    setHolidayLeadObj,
    histories,
    isUpdate,
    mode
}) => {

    const isViewMode = mode === "view";
     const [passportDetailsObj, setPassportDetails] = useState(getEmptyPassportDetailsObj()); 
     const passportDetailsUpdateSource = useRef(null);

  const [showModal, setShowModal] = useState(false);

  const setPassportDetailsState = (updated) => {
       passportDetailsUpdateSource.current = "local";
       setPassportDetails(updated);
     };

     const masterRequirements = [
  { id: 1, name: "Visa Assistance" },
  { id: 2, name: "Travel Insurance" },
  { id: 3, name: "Forex Assistance" },
  { id: 4, name: "Vegetarian Meals" },
  { id: 5, name: "Jain Meals" },
  { id: 6, name: "Wheelchair Assistance" },
  { id: 7, name: "Senior Citizen Assistance" },
  { id: 8, name: "Private Vehicle" },
  { id: 9, name: "Early Check-In" },
  { id: 10, name: "Late Check-Out" }
];


    const memoHistories = useMemo(
        () => histories || [],
        [histories]
    );

    const { showMessage } = useMessageBox();
    
const getHolidayOpt = (leadType, tripType) => {

    if (leadType === "FIT" &&
        tripType === "International")
        return 1;

    if (leadType === "FIT" &&
        tripType === "Domestic")
        return 2;

    if (leadType === "GIT" &&
        tripType === "International")
        return 3;

    if (leadType === "GIT" &&
        tripType === "Domestic")
        return 4;

    return "";
};
    // ======================================================
    // HOLIDAY TYPE
    // ======================================================

  const [holidayOpt, setHolidayOpt] = useState(
    holidayLeadObj?.holidayOpt ?? ""
);

    

    const holidayOptions = [

        {
            id: 1,
            name: "FIT International"
        },

        {
            id: 2,
            name: "FIT Domestic"
        },

        {
            id: 3,
            name: "GIT International"
        },

        {
            id: 4,
            name: "GIT Domestic"
        }
    ];

    // ======================================================
    // CONFIG
    // ======================================================

    const holidayConfigs = {

        1: {

            key: "FIT_INTERNATIONAL",

            values: {
                leadType: "FIT",
                tripType: "International"
            },

            features: {
                visa: true,
                itinerary: false,
                packagePreferences: true,
                services: true
            },

            services: [
                "train",
                "car",
                "transfer",
                "sightseeing",
                "insurance",
                "visa"
            ]
        },

        2: {

            key: "FIT_DOMESTIC",

            values: {
                leadType: "FIT",
                tripType: "Domestic"
            },

            features: {
                visa: false,
                itinerary: false,
                packagePreferences: true,
                services: true
            },

            services: [
                "train",
                "car",
                "transfer",
                "sightseeing"
            ]
        },

        3: {

            key: "GIT_INTERNATIONAL",

            values: {
                leadType: "GIT",
                tripType: "International"
            },

            features: {
                visa: true,
                itinerary: true,
                packagePreferences: false,
                services: false
            },

            services: [
                "train",
                "transfer",
                "visa"
            ]
        },

        4: {

            key: "GIT_DOMESTIC",

            values: {
                leadType: "GIT",
                tripType: "Domestic"
            },

            features: {
                visa: false,
                itinerary: true,
                packagePreferences: false,
                services: false
            },

            services: [
                "train",
                "transfer"
            ]
        }
    };

    const selectedConfig =
        holidayConfigs[holidayOpt];

        useEffect(() => {

    if (!holidayLeadObj) return;

    if (isUpdate) {

        setHolidayOpt(
            holidayLeadObj.holidayOpt ?? ""
        );

        setPassportDetails(
            holidayLeadObj.passportDetails ??
            getEmptyPassportDetailsObj()
        );
    }

}, [holidayLeadObj?.holidayLeadID]);

// usefffect(() => {

//     debugger;
//         if (selectedConfig) {

//             switch (selectedConfig.values) {
//                 case "GIT_INTERNATIONAL":
//                 case "GIT_DOMESTIC":    
                                
//             }
           
//         }   
//     }, [holidayOpt]);
    // ======================================================
    // AUTO APPLY VALUES
    // ======================================================

useEffect(() => {

    if (!isUpdate) return;

    const opt = getHolidayOpt( holidayLeadObj?.leadType,holidayLeadObj?.tripType);

    setHolidayOpt(opt);

    setPassportDetails(
        holidayLeadObj?.passportDetails ??
        getEmptyPassportDetailsObj()
    );

}, [isUpdate,  holidayLeadObj?.leadType, holidayLeadObj?.tripType]);

    useEffect(() => {

    if (!selectedConfig) return;

    setHolidayLeadObj(prev => {

        const updated = {

            ...prev,

            holidayOpt,

            ...selectedConfig.values
        };

        // Only initialize defaults for NEW leads
        if (!isUpdate) {

            if (
                selectedConfig.features.itinerary &&
                (!prev.itineraries ||
                    prev.itineraries.length === 0)
            ) {
                updated.itineraries = [
                    getEmptyHolidayItineraryObj()
                ];
            }

            if (
                selectedConfig.features.packagePreferences &&
                (!prev.packages ||
                    prev.packages.length === 0)
            ) {
                updated.packages = [
                    getEmptyPackagePreferenceObj()
                ];
            }

            if (
                selectedConfig.features.services &&
                !prev.services
            ) {
                updated.services =
                    getEmptyHolidayServiceObj();
            }

            if (
                selectedConfig.features.visa &&
                !prev.passportDetails
            ) {
                updated.passportDetails =
                    getEmptyPassportDetailsObj();
            }
        }

        return updated;
    });

}, [holidayOpt, isUpdate]);

    // ======================================================
    // SPECIAL REQUIREMENTS
    // ======================================================

    const [specialRequirement, setSpecialRequirements]
        = useState([]);

    const getSpecialRequirementsListEndPoint =
        config.apiUrl +
        "/MasterData/GetSpecialRequirementsList";


useEffect(() => {
  if (!holidayLeadObj?.passportDetails) return;
  if (passportDetailsUpdateSource.current === "local") {
    passportDetailsUpdateSource.current = "remote";
    return;
  }

  passportDetailsUpdateSource.current = "remote";
  setPassportDetails(holidayLeadObj.passportDetails);
}, [holidayLeadObj?.passportDetails]);

useEffect(() => {
  if (!passportDetailsObj) return;
  if (passportDetailsUpdateSource.current === "remote") {
    passportDetailsUpdateSource.current = null;
    return;
  }

  try {
    passportDetailsUpdateSource.current = "local";
    setHolidayLeadObj(prev => ({
      ...prev,
      passportDetails: passportDetailsObj
    }));
  } catch (error) {
    console.error(error);
    showMessage({
      type: MESSAGE_TYPES.ERROR,
      message: "Error setting Passport Details."
    });
  }
}, [passportDetailsObj, setHolidayLeadObj, showMessage]);


    useEffect(() => {
    
        debugger;

    

        const fetchData = async () => {

            try {

                debugger;

                let str= config.operationsUrl + "/TestOperations/TestingPhase";
                const testData =  await axios.get(str);
                console.log("TEST DATA =>", testData.data);

                const res = await axios.get(
                    getSpecialRequirementsListEndPoint
                );

                setSpecialRequirements(
                    res.data || []
                );

            } catch (error) {

                console.error(error);

                showMessage({
                    type: MESSAGE_TYPES.ERROR,
                    message:
                        "Error fetching special requirements."
                });
            }
        };

        fetchData();

    }, []);

   

    // ======================================================
    // SERVICE DATA
    // ======================================================

    const getBookings = (key) =>
        holidayLeadObj?.services?.[key] || [];

    const addBooking = (key, model) => {


         console.log("KEY =>", key);
         console.log("MODEL =>", model);
          setHolidayLeadObj(prev => ({

            ...prev,

            services: {

                ...prev.services,

                [key]: [
                    ...(prev.services?.[key] || []),
                     structuredClone(model) // 🔥 important
                ]
            }
        }));
    };

    const removeBooking = (key, index) => {

        setHolidayLeadObj(prev => {

            const updated = [
                ...(prev.services?.[key] || [])
            ];

            updated.splice(index, 1);

            return {

                ...prev,

                services: {
                    ...prev.services,
                    [key]: updated
                }
            };
        });
    };

    const updateBooking = (
        key,
        index,
        value
    ) => {

        setHolidayLeadObj(prev => {

            const updated = [
                ...(prev.services?.[key] || [])
            ];

            updated[index] = value;

            return {

                ...prev,

                services: {
                    ...prev.services,
                    [key]: updated
                }
            };
        });
    };

    // ======================================================
    // AI ASSISTANT
    // ======================================================

    const getAIAssistant = (serviceKey) => {

        if (serviceKey === "train") {

            return [
                "🚆 Prefer early morning trains",
                "💺 Window seats recommended"
            ];
        }

        if (serviceKey === "car") {

            return [
                "🚗 Verify pickup point",
                "⛽ Check fuel policy"
            ];
        }

        return [
            "📌 Verify details",
            "🕒 Keep buffer time"
        ];
    };

    // ======================================================
    // COMMON CHANGE
    // ======================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setHolidayLeadObj(prev => ({

            ...prev,

            [name]: value
        }));
    };

    // ======================================================
    // QUOTE CALCULATOR EVENTS
    // ======================================================

    const onBaseAmountChange = (value) => {

        setHolidayLeadObj(prev => ({

            ...prev,

            quoteAmount: value
        }));
    };

    const onFinalAmountChange = (value) => {

        setHolidayLeadObj(prev => ({

            ...prev,

            finalAmount: value
        }));
    };

    const onDiscountAmountChange = (
        discPerc,
        discAmtValue
    ) => {

        setHolidayLeadObj(prev => ({

            ...prev,

            discountAmount: discAmtValue
        }));
    };

    // ======================================================
    // UI
    // ======================================================

    return (

        <div className="space-y-6">

            {/* ===================================== */}
            {/* HOLIDAY TYPE */}
            {/* ===================================== */}

            <div>

                <label className="label-style">
                    Holiday Type
                </label>

                {isViewMode ? (

                    <ViewField
                        value={
                            holidayOptions.find(
                                x => x.id === holidayOpt
                            )?.name || "-"
                        }
                    />

                ) : (

                    <select
                        className="border-highlight"
                        value={holidayOpt}
                        onChange={(e) =>
                            setHolidayOpt(
                                Number(e.target.value)
                            )
                        }
                    >

                        <option value="">
                            Select Holiday Type
                        </option>

                        {holidayOptions.map(option => (

                            <option
                                key={option.id}
                                value={option.id}
                            >
                                {option.name}
                            </option>
                        ))}

                    </select>
                )}
            </div>

            {/* ===================================== */}
            {/* PAX */}
            {/* ===================================== */}

            <PaxDetails
                holidayLeadObj={holidayLeadObj}
                setHolidayLeadObj={setHolidayLeadObj}
                isViewMode={isViewMode}
            />

            {/* ===================================== */}
            {/* SERVICES */}
            {/* ===================================== */}

            {selectedConfig?.features?.services && (

                <ServiceAccordion
                    travelScope={holidayLeadObj?.tripType || selectedConfig?.values?.tripType}
                    getBookings={getBookings}
                    addBooking={addBooking}
                    removeBooking={removeBooking}
                    updateBooking={updateBooking}
                    getAIAssistant={getAIAssistant}
                />
            )}

            {/* ===================================== */}
            {/* PACKAGE PREFERENCES */}
            {/* ===================================== */}

            {selectedConfig?.features
                ?.packagePreferences && (

                <TravelPackage
                    holidayLeadObj={holidayLeadObj}
                    setHolidayLeadObj={setHolidayLeadObj}
                    isViewMode={isViewMode}
                    travelScope={holidayLeadObj?.tripType || selectedConfig?.values?.tripType}
                />
            )}

            {/* ===================================== */}
            {/* ITINERARY */}
            {/* ===================================== */}

            {selectedConfig?.features?.itinerary
                 && (

                <ItinerarySection
                    holidayLeadObj={holidayLeadObj}
                    setHolidayLeadObj={setHolidayLeadObj}
                    isViewMode={isViewMode}
                />
            )}

            {/* ===================================== */}
            {/* PASSPORT / VISA */}
            {/* ===================================== */}

            {selectedConfig?.features
                ?.visa && (

                <PassportDetails
                    // setParentObject={
                    //     setHolidayLeadObj
                    // }
                    // showVisaStatus={true}
                    // showPassportValidityDate={true}
                    // showInsurance={true}
                    // isViewMode={isViewMode}


                     passportDetailsObj={passportDetailsObj}
          setPassportDetailsObj={setPassportDetailsState}
          setParentObject= {null}
          showVisaStatus= {true}
          showPassportValidityDate= {true}
          showInsurance= {true}
           showPassportValidity = {true}
          isViewMode={isViewMode}
                />
            )}

            {/* ===================================== */}
            {/* SPECIAL REQUIREMENTS */}
            {/* ===================================== */}

            {/* <div>

                <label className="label-style">
                    Special Requirements
                </label>

                <div className="flex items-center flex-wrap gap-2 mt-2">
                  {Array.isArray(holidayLeadObj?.specialRequirement) &&
                    holidayLeadObj.specialRequirement.length > 0 ? (
                      holidayLeadObj.specialRequirement
                        .map((id) => {
                          const req = specialRequirement.find((r) => r.id === id);
                          return req?.specialRequirements;
                        })
                        .filter(Boolean)
                        .map((name) => (
                          <Chip key={name} label={name} size="small" />
                        ))
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}

                  {!isViewMode && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setShowModal(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}

                  {isViewMode && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setShowModal(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </div>

                <Dialog
                  open={showModal}
                  onClose={() => setShowModal(false)}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle>
                    Select Special Requirements
                  </DialogTitle>
                  <DialogContent>
                    <HolidaySpecialRequirements
                      requirements={specialRequirement}
                      selectedIds={holidayLeadObj?.specialRequirement || []}
                      onClose={() => setShowModal(false)}
                      onSave={(selectedIds) => {
                        setHolidayLeadObj((prev) => ({
                          ...prev,
                          specialRequirement: selectedIds,
                        }));
                        setShowModal(false);
                      }}
                    />
                  </DialogContent>
                </Dialog>
            </div> */}


<SpecialRequirementsSection
  holidayLeadObj={holidayLeadObj}
  setHolidayLeadObj={setHolidayLeadObj}
  isViewMode={isViewMode}
   allRequirements={specialRequirement}  
/>


            {/* ===================================== */}
            {/* QUOTE COMMENTS */}
            {/* ===================================== */}

            <div>

                <label className="label-style">
                    Quote Comments
                </label>

                <input
                    type="text"
                    name="quoteGiven"
                    value={
                        holidayLeadObj.quoteGiven || ""
                    }
                    onChange={handleChange}
                    className="border-highlight"
                />

            </div>

            {/* ===================================== */}
            {/* QUOTE CALCULATOR */}
            {/* ===================================== */}

            <QuoteCalculator
                baseAmt={
                    holidayLeadObj.quoteAmount || 0
                }
                discountPct={
                    holidayLeadObj.discountPercent || 0
                }
                discountAmt={
                    holidayLeadObj.discountAmount || 0
                }
                finalAmt={
                    holidayLeadObj.finalAmount || 0
                }
                onBaseChange={onBaseAmountChange}
                onDiscountChange={
                    onDiscountAmountChange
                }
                onFinalChange={onFinalAmountChange}
                isViewMode={isViewMode}
            />

            {/* ===================================== */}
            {/* REMARKS */}
            {/* ===================================== */}

            <div>

                <label className="label-style">
                    Remarks
                </label>

                <input
                    type="text"
                    name="notes"
                    value={
                        holidayLeadObj.notes || ""
                    }
                    onChange={handleChange}
                    className="border-highlight"
                />

            </div>

            {/* ===================================== */}
            {/* HISTORY */}
            {/* ===================================== */}

            {isUpdate && (

                <HistoryHover
                    histories={memoHistories}
                />
            )}

        </div>
    );
};

export default LeadHolidays;