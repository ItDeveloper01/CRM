import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getEmptyPackagePreferenceObj } from "./Model/HolidayLeadObj";
import { getEmptyHolidayItineraryObj } from "./Model/HolidayLeadObj";
import { getEmptyHolidayServiceObj } from "./Model/HolidayServicesModel";
import config from "./config";

import HistoryHover from "./HIstoryHover";
import QuoteCalculator from "./paymentComponents/QuoteComponent";

import PassportDetails from "./PassportDetails";

import { getEmptyPassportDetailsObj } from "./Model/PassportDetailsModel";

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

    const memoHistories = useMemo(
        () => histories || [],
        [histories]
    );

    const { showMessage } = useMessageBox();

    // ======================================================
    // HOLIDAY TYPE
    // ======================================================

    const [holidayOpt, setHolidayOpt] = useState(
        holidayLeadObj?.holidayOpt || ""
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

        debugger;
        if (!selectedConfig) return;


        
          if(selectedConfig.features.itinerary ==true) 
          {
              const iti =  getEmptyHolidayItineraryObj();
                setHolidayLeadObj(prev => ({
                    ...prev,

                    itineraries: [iti]
                }));
          }

          if(selectedConfig.features.packagePreferences ==true) 
          {
                const  pack= getEmptyPackagePreferenceObj();
                    setHolidayLeadObj(prev => ({
                        ...prev,
                        packages: [pack]
                    }));
          }

          if(selectedConfig.features.services ==true) 
          {
            const serv= getEmptyHolidayServiceObj();
                setHolidayLeadObj(prev => ({
                    ...prev,
                    services: serv
                }));
          }
          if(selectedConfig.features.visa ==true)
          {

          }

        setHolidayLeadObj(prev => ({

            ...prev,

            holidayOpt,

            ...selectedConfig.values

        }));

    }, [holidayOpt]);

    // ======================================================
    // SPECIAL REQUIREMENTS
    // ======================================================

    const [specialRequirement, setSpecialRequirements]
        = useState([]);

    const getSpecialRequirementsListEndPoint =
        config.apiUrl +
        "/MasterData/GetSpecialRequirementsList";

    useEffect(() => {

        const fetchData = async () => {

            try {

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

    const addBooking = (key) => {

        setHolidayLeadObj(prev => ({

            ...prev,

            services: {

                ...prev.services,

                [key]: [
                    ...(prev.services?.[key] || []),
                    {}
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
          setPassportDetailsObj={setPassportDetails}
          setParentObject={setHolidayLeadObj}
          showVisaStatus
          showPassportValidityDate
          showInsurance
          isViewMode={isViewMode}
                />
            )}

            {/* ===================================== */}
            {/* SPECIAL REQUIREMENTS */}
            {/* ===================================== */}

            <div>

                <label className="label-style">
                    Special Requirements
                </label>

                {isViewMode ? (

                    <ViewField
                        value={
                            specialRequirement
                                .filter(sr =>
                                    holidayLeadObj
                                        ?.specialRequirement
                                        ?.includes(sr.id)
                                )
                                .map(sr =>
                                    sr.specialRequirements
                                )
                                .join(", ")
                            || "-"
                        }
                    />

                ) : (

                    <FormControl
                        fullWidth
                        size="small"
                    >

                        <Select
                            multiple
                            className="border-highlight"
                            value={
                                holidayLeadObj
                                    ?.specialRequirement
                                || []
                            }
                            onChange={(e) => {

                                const value =
                                    e.target.value;

                                setHolidayLeadObj(
                                    prev => ({

                                        ...prev,

                                        specialRequirement:
                                            value
                                    })
                                );
                            }}
                        >

                            {specialRequirement.map(
                                item => (

                                <MenuItem
                                    key={item.id}
                                    value={item.id}
                                >

                                    <Checkbox
                                        checked={
                                            holidayLeadObj
                                                ?.specialRequirement
                                                ?.includes(item.id)
                                            || false
                                        }
                                    />

                                    <ListItemText
                                        primary={
                                            item.specialRequirements
                                        }
                                    />

                                </MenuItem>
                            ))}

                        </Select>

                    </FormControl>
                )}
            </div>

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