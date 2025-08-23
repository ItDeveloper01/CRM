import React  from "react";
import {useState} from 'react';

const LeadAirTicketing = ({ formData,handleChange})=> {
      const [tripType, setTripType] = useState([]);
    return(
    <div>
        <label className="label-style">Air Ticket Type</label>
            <div className="rounded-lg flex justify-between gap-3">
              {/* Domestic Option */}
              <label
                className={`flex items-center  gap-2 flex-1 cursor-pointer rounded-md px-0.5 py-2 
                                ${tripType === "domestic"
                    ? "bg-blue-100 border border-blue-500"
                    : "bg-white border border-transparent"}`}
              >
                <input
                  type="radio"
                  name="tripType"
                  value="domestic"
                  checked={tripType === "domestic"}
                  onChange={() => setTripType("domestic")}
                  className="accent-blue-600 cursor-pointer"
                />
                Domestic
              </label>

              {/* International Option */}
              <label
                className={`flex items-center gap-2 flex-1 cursor-pointer rounded-md px-0.5 py-2 
                                ${tripType === "international"
                    ? "bg-blue-100 border border-blue-500"
                    : "bg-white border border-transparent"}`}
              // className={`flex items-center gap-2 flex-1 cursor-pointer rounded-md px-3 py-2 border transition
              //     ${tripType === "international"
              //     ? "bg-blue-600 text-white border-blue-600 shadow-md"
              //     : "bg-gray-100 text-gray-700 border-gray-300"}`}
              >
                <input
                  type="radio"
                  name="tripType"
                  value="international"
                  checked={tripType === "international"}
                  onChange={() => setTripType("international")}
                  className="accent-blue-600 cursor-pointer"
                />
                International
              </label>
            </div>

            {/* <div>
              <label className="flex items-center gap-2 mb-1"> Domestic </label>
              <input
                type="radio"
                value="domestic"
                checked={tripType === "domestic"}
                onChange={() => setTripType("domestic")}
              />

              <label className="flex items-center gap-2">International </label>
              <input
                type="radio"
                value="international"
                checked={tripType === "international"}
                onChange={() => setTripType("international")}
              />
            </div> */}

            {/* Common fields in Air Ticketing*/}
            {/* Travel date and Sectors */}
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1">
                <label className="label-style">Travel Date</label>
                <input
                  type="date"
                  name="travelDates"
                  value={formData.travelDates}
                  onChange={handleChange}
                  className={`border-highlight`}
                />
              </div>
              <div className="flex-1">
                <label className="label-style">Sector</label>
                <input
                  type="text"
                  placeholder="Sector"
                  className={`border-highlight`}
                />
              </div>
            </div>
            {/* No of travelers and travel class */}
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1">
                <label className="label-style">No of Travelers</label>
                <input
                  name="numApplicants"
                  type="number"
                  min="1"
                  onChange={handleChange}
                  className={`border-highlight`}
                />
              </div>
              {/* Travel Class Dropdown */}
              <div className="flex-1">
                <label className="label-style">Travel Class</label>
                <select
                  name="travelClass"
                  value={formData.travelClass}
                  onChange={handleChange}
                  className={`border-highlight`}
                >
                  <option value="">Select Class</option>
                  <option value="economy">Economy</option>
                  <option value="premium-economy">Premium Economy</option>
                  <option value="business">Business Class</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>
            <div>
              {/* Ticket Type Dropdown */}
              <div className="flex-1">
                <label className="label-style">Ticket Type</label>
                <select
                  name="ticketType"
                  value={formData.ticketType || ""}
                  onChange={handleChange}
                  className={`border-highlight`}
                >
                  <option value="">Select Ticket Type</option>
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                </select>
              </div>

              {/* Show extra fields depending on trip type */}
              {tripType === "international" && (
                <div className="flex gap-3 flex-wrap">
                  {/* Visa Status */}
                  <div className="flex-1">
                    <label className="label-style">Visa Status</label>
                    <input
                      type="text"
                      name="visaStatus"
                      value={formData.visaStatus}
                      onChange={handleChange}
                      placeholder="Enter Visa Status"
                      className={`border-highlight`}
                    />
                  </div>

                  {/* Passport Validity Date */}
                  <div className="flex-1">
                    <label className="label-style">Passport Validity</label>
                    <input
                      type="date"
                      name="passportValidity"
                      value={formData.passportValidity}
                      onChange={handleChange}
                      className={`border-highlight`}
                    />
                  </div>
                </div>
              )}

              {/* Quote Given */}
              <label className="label-style">Quote Given</label>
              <input
                type="text"
                placeholder="Enter quote"
                className={`border-highlight`}
              />
            </div>
            {/* Remark */}
            <div>
              <label className="label-style">Remark</label>
              <input
                type="text"
                placeholder="Remark"
                className={`border-highlight`}
              />
            </div>

            {/* <AirTicketingScreen></AirTicketingScreen> */}
        </div>
    );

};
export default LeadAirTicketing;