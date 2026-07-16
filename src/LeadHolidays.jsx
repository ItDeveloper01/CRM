import React, {
    useEffect, useMemo, useRef, useState, forwardRef,
    useImperativeHandle,
} from "react";
import axios from "axios";
import { getEmptyPackagePreferenceObj } from "./Model/HolidayLeadObj";
import { getEmptyHolidayItineraryObj } from "./Model/HolidayLeadObj";
import { getEmptyHolidayServiceObj } from "./Model/HolidayServicesModel";

import SpecialRequirementsSection from "./HolidaysScreens/Others/SpecialRequirementSection";

import DestinationSelector from "./HolidaysScreens/Others/DestinationSelector";
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

import { getEmptyPassportDetailsObj } from "./Model/PassportDetailsModel";

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

const LeadHolidays = forwardRef(({
    holidayLeadObj,
    setHolidayLeadObj,
    histories,
    isUpdate,
    mode
}, ref) => {

    const isViewMode = mode === "view";
    const [passportDetailsObj, setPassportDetails] = useState(getEmptyPassportDetailsObj());
    const passportDetailsUpdateSource = useRef(null);
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);

    const setPassportDetailsState = (updated) => {
        passportDetailsUpdateSource.current = "local";
        setPassportDetails(updated);
    };

    const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
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

        console.log("Holiday Lead Object Updated:", holidayLeadObj);

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

        const opt = getHolidayOpt(holidayLeadObj?.leadType, holidayLeadObj?.tripType);

        setHolidayOpt(opt);

        setPassportDetails(
            holidayLeadObj?.passportDetails ??
            getEmptyPassportDetailsObj()
        );

    }, [isUpdate, holidayLeadObj?.leadType, holidayLeadObj?.tripType]);

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
        "/MasterData/GetHolidaySpecialRequirementsList";


    // const getoperationendpoint = config.operationsUrl+"/TestOperations/getTestOperations"

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

                // let str= config.operationsUrl + "/TestOperations/GetTestOperations";
                // const testData =  await axios.get(str);
                // console.log("TEST DATA =>", testData.data);


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

    const validateHoliday = () => {

        const newErrors = {};

        // Holiday Type
        if (!holidayOpt) {
            newErrors.holidayType = "Holiday Type is required.";
        }

        // Requested Destinations
        if (
            !holidayLeadObj.requestedDestinations ||
            holidayLeadObj.requestedDestinations.length === 0
        ) {
            newErrors.requestedDestinations =
                "Please type at least one destination.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

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

    useEffect(() => {

        if (
            holidayLeadObj.requestedDestinations?.length > 0
        ) {

            setErrors(prev => ({
                ...prev,
                requestedDestinations: ""
            }));
        }

        console.log("Requested Destinations Length :", holidayLeadObj.requestedDestinations.length);
        console.log("Requested Destinations String :", holidayLeadObj.requestedDestinations);

    }, [holidayLeadObj.requestedDestinations]);

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

    const travelScope =
        holidayLeadObj?.tripType ||
        selectedConfig?.values?.tripType ||
        "Holiday";

    const isGIT =
        (holidayLeadObj?.leadType ||
            selectedConfig?.values?.leadType) === "GIT";




    const [destinationInput, setDestinationInput] = useState("");

    // ======================================================
    // UI
    // ======================================================
    useImperativeHandle(ref, () => ({
        validate: validateHoliday
    }));
    return (

        <div className="space-y-3">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* ===================================== */}
                {/* HOLIDAY TYPE */}
                {/* ===================================== */}

                <div className="md:col-span-1">

                    <label className="label-style">Holiday Type
                        <span className="text-red-500 text-lg  leading-none"> *</span>
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
                            className={`border-highlight ${errors.holidayType ? 'border-red-500' : ''}`}
                            value={holidayOpt}
                            onChange={(e) => {
                                setHolidayOpt(Number(e.target.value))

                                setErrors(prev => ({
                                    ...prev,
                                    holidayType: ""
                                }));
                            }}
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

                    {errors.holidayType && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.holidayType}
                        </p>
                    )}
                </div>

                {/* ===================================== */}
                {/* PREFERRED DESTINATIONS */}
                {/* ===================================== */}

                <div className="md:col-span-2">
                    <label className="label-style">
                        Requested Destinations
                        <span className="ml-2 text-xs font-normal text-slate-400">
                            (Select multiple destinations separated by  , or ;  )
                        </span>
                        <span className="text-red-500 text-lg  leading-none"> *</span>
                    </label>

                    <DestinationSelector
                        holidayLeadObj={holidayLeadObj}
                        setHolidayLeadObj={setHolidayLeadObj}
                        isViewMode={isViewMode}
                        error={!!errors.requestedDestinations}
                        onErrorHandle={(message) =>
                            setErrors(prev => ({
                                ...prev,
                                requestedDestinations: message
                            }))}
                    />
                    {
                        errors.requestedDestinations &&
                        <p className="text-red-500 text-sm mt-1">
                            {errors.requestedDestinations}

                        </p>
                    }
                </div>
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
            {/* ADD DOMESTIC / INTERNATIONAL DETAILS */}
            {/* ===================================== */}

            {/* ===================================== */}
            {/* ADDITIONAL DETAILS */}
            {/* ===================================== */}

            <div
                onClick={() => {

                    if (isGIT) {

                        showMessage(
                            "Group Tour Details will be available in the upcoming release. You can still save the lead with the basic information.",
                            MESSAGE_TYPES.INFO
                        );

                        return;
                    }

                    setShowAdditionalDetails(prev => !prev);

                }}
                className={`overflow-hidden rounded-xl border transition-all duration-300
    ${isGIT
                        ? "cursor-not-allowed border-gray-300 bg-gray-100"
                        : "cursor-pointer border-blue-300 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg"
                    }`}
            >

                <div className="flex items-center justify-between px-4 py-2">

                    <div className="flex items-center gap-2">

                        <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center text-lg ${isGIT
                                ? "bg-gray-300"
                                : "bg-white/20"
                                }`}
                        >
                            {isGIT
                                ? "🚧"
                                : showAdditionalDetails
                                    ? "📂"
                                    : "✈️"}
                        </div>

                        <div>

                            <div
                                className={`font-semibold text-sm ${isGIT
                                    ? "text-gray-700"
                                    : "text-white"
                                    }`}
                            >
                                {isGIT
                                    ? "Group Tour Details (Coming Soon)"
                                    : showAdditionalDetails
                                        ? `Hide ${travelScope} Details`
                                        : `Add ${travelScope} Details`}
                            </div>

                            <div
                                className={`text-xs ${isGIT
                                    ? "text-gray-600"
                                    : "text-blue-100"
                                    }`}
                            >
                                {isGIT
                                    ? "You can save the lead with basic information."
                                    : showAdditionalDetails
                                        ? "Hide services, itinerary, passport, pricing & special requirements."
                                        : "Add services, itinerary, passport, pricing & special requirements."}
                            </div>

                        </div>

                    </div>

                    {!isGIT && (

                        <div
                            className={`transition-transform duration-300 text-sm select-none ${showAdditionalDetails
                                ? "rotate-180"
                                : ""
                                }`}
                        >
                            ▼
                        </div>

                    )}

                </div>

            </div>

            {/* ===================================== */}
            {/* EXPANDABLE CONTENT */}
            {/* ===================================== */}

            {showAdditionalDetails && !isGIT && (

                <>

                    {/* SERVICES */}

                    {selectedConfig?.features?.services && (

                        <ServiceAccordion
                            travelScope={
                                holidayLeadObj?.tripType ||
                                selectedConfig?.values?.tripType
                            }
                            getBookings={getBookings}
                            addBooking={addBooking}
                            removeBooking={removeBooking}
                            updateBooking={updateBooking}
                            getAIAssistant={getAIAssistant}
                        />

                    )}

                    {/* PACKAGE PREFERENCES */}

                    {selectedConfig?.features?.packagePreferences && (

                        <TravelPackage
                            holidayLeadObj={holidayLeadObj}
                            setHolidayLeadObj={setHolidayLeadObj}
                            isViewMode={isViewMode}
                            travelScope={
                                holidayLeadObj?.tripType ||
                                selectedConfig?.values?.tripType
                            }
                        />

                    )}

                    {/* ITINERARY */}

                    {selectedConfig?.features?.itinerary && (

                        <ItinerarySection
                            holidayLeadObj={holidayLeadObj}
                            setHolidayLeadObj={setHolidayLeadObj}
                            isViewMode={isViewMode}
                        />

                    )}

                    {/* PASSPORT */}

                    {selectedConfig?.features?.visa && (

                        <PassportDetails
                            passportDetailsObj={passportDetailsObj}
                            setPassportDetailsObj={setPassportDetailsState}
                            setParentObject={null}
                            showVisaStatus={true}
                            showPassportValidityDate={true}
                            showInsurance={true}
                            showPassportValidity={true}
                            isViewMode={isViewMode}
                        />

                    )}

                    {/* SPECIAL REQUIREMENTS */}

                    <SpecialRequirementsSection
                        holidayLeadObj={holidayLeadObj}
                        setHolidayLeadObj={setHolidayLeadObj}
                        isViewMode={isViewMode}
                        allRequirements={specialRequirement}
                    />

                    {/* QUOTE CALCULATOR */}

                    <QuoteCalculator
                        baseAmt={holidayLeadObj.quoteAmount || 0}
                        discountPct={holidayLeadObj.discountPercent || 0}
                        discountAmt={holidayLeadObj.discountAmount || 0}
                        finalAmt={holidayLeadObj.finalAmount || 0}
                        onBaseChange={onBaseAmountChange}
                        onDiscountChange={onDiscountAmountChange}
                        onFinalChange={onFinalAmountChange}
                        isViewMode={isViewMode}
                    />

                </>

            )}

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
});


export default LeadHolidays;