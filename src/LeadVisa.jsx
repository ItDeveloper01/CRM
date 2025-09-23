import React, { useEffect } from "react";
import "./LeadStyle.css";
import config from './config';
import { VISALeadObject } from "./Model/VisaLeadModel";
import HistoryHover from "./HIstoryHover";
import { set } from "lodash";
import { useMemo } from "react";


const LeadVisa = ({ visadObj, countries, setVisaLeadObj, histories, isUpdate }) => {


    // Memoize the histories array so reference doesn't change unnecessarily
    const memoHistories = useMemo(() => histories || [], [histories]);
    const memoIsUpdate = useMemo(() => isUpdate || false, [isUpdate]);
    const handleChange = (e) => {

        console.log("**********************IN VISA OBJECT   /**************************");
        console.log("Handle Change Called for Visa Obj  ");
        console.log("Visa Obj before change.....:", visadObj);
        console.log("Histories received....", histories);
        console.log("isUpdate flag....", isUpdate);


        debugger;
        const { name, value } = e.target;
        setVisaLeadObj(prev => ({
            ...prev,
            [name]: value
        }));

        console.log("Visa Obj.....:", visadObj);
    };

    useEffect(() => {
        console.log("Visa Obj in useEffect.....:", visadObj);
        console.log("Histories in useEffect.....:", histories);
        console.log("isUpdate flag....", isUpdate);
    }, [setVisaLeadObj, visadObj, histories]);

    return (
   
        <div>
            <div className="flex gap-3 flex-wrap">
                {/* Country1 Dropdown */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Country 1</label>
                    <select
                        className={`border-highlight ${visadObj.country1 ? "selected" : ""}`}
                        name="country1"
                        value={visadObj?.country1 || ""}
                        onChange={handleChange}
                    >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                            <option key={country.name} value={country.name}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>


                {/* Country2 Dropdown */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Country 2</label>
                    <select
                        className={`border-highlight ${visadObj.country2 ? "selected" : ""}`}
                        name="country2"
                        value={visadObj?.country2 || ""}
                        onChange={handleChange}
                    >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                            <option key={country.name} value={country.name}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Country3 Dropdown */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Country 3</label>
                    <select
                        className={`border-highlight ${visadObj.country3 ? "selected" : ""}`}
                        name="country3"
                        value={visadObj?.country3 || ""}
                        onChange={handleChange}
                    >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                            <option key={country.name} value={country.name}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Travel Date, Applicants, Purpose */}
            <div className="flex gap-3 flex-wrap"> {/* reduced gap */}

                <div className="flex-1">
                    <label className="label-style">Travel Date</label>
                    <input
                        type="date"
                        name="travelDate"
                        value={visadObj.travelDate || ""}
                        onChange={handleChange}
                        className={`border-highlight ${visadObj.travelDate ? "selected" : ""}`}
                    //  This code is for more information of highlight concept
                    //  className={`w-full rounded-lg p-2 focus:outline-none focus:ring-2 
                    //         ${visadObj.travelDates
                    //         ? "bg-blue-100 border border-blue-500"   // highlight when date is selected
                    //         : "bg-white border border-gray-300"      // default gray border
                    //     }`}
                    />
                </div>
                {/* <div className="flex-1">
                    <label className="label-style">Travel Date</label>
                    <input
                        // className={`border-highlight`}
                        className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 
                                ${visadObj.country1
                                ? "bg-blue-100 border border-blue-500"   // highlight for Travel Date
                                : "bg-white border border-transparent"
                            }`}

                        name="travelDates"
                        type="date"
                        onChange={handleChange}
                    />
                </div> */}

                <div className="flex-1">
                    <label className="label-style">No. of Applicants</label>
                    <input
                        className={`border-highlight`}
                        name="noOfApplicants"
                        value={Number(visadObj.noOfApplicants) || ""}
                        type="number"
                        min="1"
                        onChange={(e) => {
                            const value = e.target.value;
                            // Update as number if not empty, else empty string
                            setVisaLeadObj(prev => ({
                                ...prev,
                                noOfApplicants: value === "" ? "" : Number(value)
                            }));
                        }}
                    />
                </div>

                <div className="flex-1">
                    <label className="label-style">Purpose of Travel</label>
                    <select
                        className={`border-highlight`}
                        name="purposeOfTravel"
                        value={visadObj.purposeOfTravel}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="Business">Business</option>
                        <option value="Tourism">Tourism</option>
                        <option value="Attending an Exhibition">Attending an Exhibition</option>
                        <option value="Event-Conference">Event-Conference</option>
                        <option value="Visiting Friends and Relatives">Visiting Friends and Relatives</option>
                        <option value="Transit">Transit</option>
                    </select>
                </div>
            </div>

            {/* Visa Type & Entries */}
            <div className="flex gap-3 flex-wrap"> {/* reduced gap */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Visa Type</label>
                    <select
                        className={`border-highlight`}
                        name="visaType"
                        value={visadObj.visaType}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="Business">Business</option>
                        <option value="Tourist">Tourist</option>
                        <option value="Transit">Transit</option>
                        <option value="Dependent">Dependent</option>
                        <option value="Student">Student</option>
                    </select>
                </div>

                <div className="flex-1">
                    <label className="label-style">No Of Entries</label>
                    <select
                        className={`border-highlight`}
                        name="noOfEntries"
                        value={visadObj.noOfEntries}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Multiple">Multiple</option>
                    </select>
                </div>
            </div>

            {/* Travel Plan Status & Hotel */}
            {/* <div className="flex gap-3 flex-wrap">  */} {/* reduced gap */}
            <div className="flex gap-3 flex-wrap">
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Travel Plan Status</label>
                    <div className="border border-gray-300 rounded-lg px-1 py-2 flex justify-between">
                        {["Confirmed", "Tentative"].map((status1) => (
                            <label
                                key={status1}
                                className={`option-highlight
                                ${visadObj.travelPlanStatus === status1
                                        ? "option-highlight-active"
                                        : "option-highlight-inactive"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="travelPlanStatus"
                                    value={status1}
                                    checked={visadObj.travelPlanStatus === status1}
                                    onChange={handleChange}
                                />
                                {status1}
                            </label>
                        ))}
                    </div>
                </div>

                {/* <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Travel Plan Status</label>
                    <div className="border border-gray-300 rounded-lg p-2 flex justify-between">
                        {["Confirmed", "Tentative"].map((status) => (
                            <label key={status} className="flex items-center gap-2 flex-1 cursor-pointer">
                                <input type="radio" name="travelplanstatus" value={status} onChange={handleChange} />
                                {status}
                            </label>
                        ))}
                    </div>
                </div> */}

                {/* Hotel */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Hotel</label>
                    <div className="border border-gray-300 rounded-lg p-2 flex justify-between">
                        {["Booked", "Not Booked"].map((status) => (
                            <label key={status} className="flex items-center gap-2 flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="hotelBooking"
                                    value={status}
                                    checked={visadObj.hotelBooking === status}
                                    onChange={handleChange}
                                />
                                {status}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Overseas Insurance & Passport Validity */}
            <div className="flex gap-3 flex-wrap"> {/* reduced gap */}
                <div className="flex-1 min-w-[200px]">
                    <label className="label-style">Overseas Insurance</label>
                    <div className="border border-gray-300 rounded-lg p-2 flex justify-between">
                        {["Issued", "Not Issued"].map((insuranceStatus) => (
                            <label key={insuranceStatus} className="flex items-center gap-2 flex-1 cursor-pointer">
                                <input type="radio"
                                    name="overseasInsurance"
                                    value={insuranceStatus}
                                    checked={visadObj.overseasInsurance === insuranceStatus}
                                    onChange={handleChange} />
                                {insuranceStatus}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex-1 min-w-[200px]">
                    <label className="label-style">Passport Validity</label>
                    <div className="border border-gray-300 rounded-lg p-2 flex justify-between">
                        {["Checked", "Not Checked", "Not Sure"].map((pValidity) => (
                            <label key={pValidity} className="flex items-center gap-2 flex-1 cursor-pointer">
                                <input type="radio"
                                    name="passportValidity"
                                    value={pValidity}
                                    checked={visadObj.passportValidity === pValidity}
                                    onChange={handleChange} />
                                {pValidity}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Airticket */}
            <div className="flex-1">
                <label className="label-style">Airticket</label>
                <div className="border border-gray-300 rounded-lg p-2 grid grid-cols-4">
                    {["Issued by Girikand", "Issued from other agency", "Blocked", "Not Issued", "Issued Online"].map((airTckIssuedBy) => (
                        <label key={airTckIssuedBy} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio"
                                name="airTicketIssuedBy"
                                value={airTckIssuedBy}
                                checked={visadObj.airTicketIssuedBy === airTckIssuedBy}
                                onChange={handleChange} />
                            {airTckIssuedBy}
                        </label>
                    ))}
                </div>
            </div>

            {/* Quote Given */}
            <div className="flex-1 min-w-[200px]">
                <label className="label-style">Quote Given</label>
                <input
                    type="text"
                    className={`border-highlight`}
                    name="quoteGiven"
                    value={visadObj.quoteGiven || ""}
                    placeholder="Enter quote"
                    onChange={handleChange}
                />
            </div>

            {/* Remark */}
            <div className="flex-1 min-w-[200px]">
                <label className="label-style">Remark</label>
                <textarea
                    className={`border-highlight`}
                    name="notes"
                    value={visadObj.notes || ""}
                    placeholder="Remark"
                    onChange={handleChange}
                />
                {/* History hover component */}
                {memoIsUpdate && (
                    <HistoryHover histories={memoHistories} />)
                }
            </div>
        </div>
    );
};

export default React.memo(LeadVisa);
