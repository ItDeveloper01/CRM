import React, { useEffect } from "react";
import { useState } from 'react';
import { AirTicketingLeadObject } from "./Model/AirTicketLeadModel";
import { useMemo } from "react";
import HistoryHover from "./HIstoryHover";


const LeadAirTicketing = ({ airTicketingdObj, setAirTicketingLeadObj, histories, isUpdate }) => {

  // Memoize the histories array so reference doesn't change unnecessarily
  const memoHistories = useMemo(() => histories || [], [histories]);
  const memoIsUpdate = useMemo(() => isUpdate || false, [isUpdate]);

  const handleChange = (e) => {

    console.log("**********************IN AIR TICKETING OBJECT   /**************************");
    console.log("Handle Change Called for Air Ticekting Obj  ");
    console.log("Air Ticketing Obj before change.....:", airTicketingdObj);
    console.log("Histories received....", histories);
    console.log("isUpdate flag....", isUpdate);


    debugger;
    const { name, value } = e.target;
    console.log("printing name and value : ", name, value);
    setAirTicketingLeadObj(prev => ({
      ...prev,
      [name]: value
    }));

    console.log("Air Ticketing Obj.....:", airTicketingdObj);
  };

  useEffect(() => {
    console.log("Visa Obj in useEffect.....:", airTicketingdObj);
    console.log("Histories in useEffect.....:", histories);
    console.log("isUpdate flag....", isUpdate);
  }, [setAirTicketingLeadObj, airTicketingdObj, histories]);



  // const [airTicketType, setAirTicketType] = useState([]);
  return (
    <div>
      <label className="label-style">Air Ticket Type</label>
      <div className="rounded-lg flex justify-between gap-3">
        {["Domestic", "International"].map((airstatus) => (
          <label
            key={airstatus}
            className={`flex items-center gap-2 flex-1 cursor-pointer rounded-md px-0.5 py-2 
            ${airTicketingdObj?.airTicketType?.trim()?.toLowerCase() === airstatus.toLowerCase()
                ? "bg-blue-100 border border-blue-500"
                : "bg-white border border-transparent"}`}
          >
            <input
              type="radio"
              name="airTicketType"
              value={airstatus}
              checked={airTicketingdObj?.airTicketType?.trim()?.toLowerCase() === airstatus.toLowerCase()}
              onChange={handleChange}
              // onChange={(e) => setAirTicketingLeadObj("domestic")}
              className="accent-blue-600 cursor-pointer"
            />
            {airstatus}
          </label>
        ))}
      </div>


      {/* Common fields in Air Ticketing*/}
      {/* Onword Date */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1">
          <label className="label-style">Onword Date</label>
          <input
            type="date"
            name="onwordDate"
            value={airTicketingdObj.onwordDate || ""}
            onChange={handleChange}
            className={`border-highlight`}

          />

          {/* Return Date */}
        </div>
        <div className="flex-1">
          <label className="label-style">Return Date</label>
          <input
            type="date"
            name="returnDate"
            value={airTicketingdObj.returnDate || ""}
            onChange={handleChange}
            className={`border-highlight`}

          />
        </div>
      </div>

      {/* Sector */}
      <div className="flex-1">
        <label className="label-style">Sector</label>
        <input
          type="text"
          name="Sector"
          placeholder="Sector"
          value={airTicketingdObj.Sector || ""}
          onChange={handleChange}
          className={`border-highlight`}
        />
      </div>
      {/* No of travelers and travel class */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1">
          <label className="label-style">No of Travelers</label>
          <input
            name="noOfTravelers"
            type="number"
            value={Number(airTicketingdObj.noOfTravelers) || ""}
            min="1"
            onChange={(e) => {
              const value = e.target.value;
              // Update as number if not empty, else empty string
              setAirTicketingLeadObj(prev => ({
                ...prev,
                noOfTravelers: value === "" ? "" : Number(value)
              }));
            }}
            className={`border-highlight`}
          />
        </div>
        {/* Travel Class Dropdown */}
        <div className="flex-1">
          <label className="label-style">Travel Class</label>
          <select
            name="travelClass"
            value={airTicketingdObj.travelClass || ""}
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
            value={airTicketingdObj.ticketType || ""}
            onChange={handleChange}
            className={`border-highlight`}
          >
            <option value="">Select Ticket Type</option>
            <option value="individual">Individual</option>
            <option value="group">Group</option>
          </select>
        </div>

        {/* Show extra fields depending on trip type */}
        {airTicketingdObj?.airTicketType?.trim()?.toLowerCase() === "international" && (
          <div>
            {/* Visa Status & Passport Validity Date */}
            <div className="flex gap-3 flex-wrap items-stretch">

              {/* Visa Status */}
              <div className="flex-1 min-w-[200px] flex flex-col">
                <label className="label-style mb-1">Visa Status</label>
                <div className="border border-gray-300 rounded-lg p-2 flex justify-between flex-1 h-full">
                  {["Valid", "In Process", "Not Applied"].map((visastatus) => (
                    <label
                      key={visastatus}
                      className={`flex items-center gap-2 flex-1 cursor-pointer rounded-md px-1
                      ${airTicketingdObj.visaStatus === visastatus
                          ? "bg-blue-100 border border-blue-500"
                          : "bg-white border border-transparent"
                        }`}
                    >
                      <input
                        type="radio"
                        name="visaStatus"
                        value={visastatus}
                        checked={airTicketingdObj.visaStatus === visastatus}
                        onChange={handleChange}
                      />
                      {visastatus}
                    </label>
                  ))}
                </div>
              </div>

              {/* Passport Validity Date */}
              <div className="flex-1 min-w-[200px] flex flex-col">
                <label className="label-style mb-1">Passport Validity</label>
                <div className="border border-gray-300 rounded-lg flex-1 h-full flex items-center px-2 
                focus-within:border-blue-300 focus-within:ring-1 focus-within:ring-blue-300">
                  <input
                    type="date"
                    name="passportValidityDate"
                    value={airTicketingdObj.passportValidityDate || ""}
                    onChange={handleChange}
                    className="w-full h-full outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Overseas Insurance */}
            <div className="flex-1 min-w-[200px] flex flex-col">
              <label className="label-style mb-1">Overseas Insurance</label>
              <div className="border border-gray-300 rounded-lg p-2 flex justify-between flex-1 h-full">
                {["Issued", "Not Issued"].map((insuranceStatus) => (
                  <label
                    key={insuranceStatus}
                    className={`option-highlight
                      ${airTicketingdObj.overseasInsurance === insuranceStatus
                    ? "option-highlight-active"
                    : "option-highlight-inactive"
                  }`}
                  >
                    <input
                      type="radio"
                      name="overseasInsurance"
                      value={insuranceStatus}
                      checked={airTicketingdObj.overseasInsurance === insuranceStatus}
                      onChange={handleChange}
                    />
                    {insuranceStatus}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}


        <div className="flex-1 min-w-[200px] flex flex-col">
          <label className="label-style">Airport Transport</label>
          <div className="border border-gray-300 rounded-lg p-2 flex justify-between flex-1 h-full">
            {["Self", "Not Decided", "Book Through Girikand"].map((airTransport) => (
              <label
                key={airTransport}
                className={`option-highlight
                      ${airTicketingdObj.airportTransport === airTransport
                    ? "option-highlight-active"
                    : "option-highlight-inactive"
                  }`}
              >
                <input
                  type="radio"
                  name="airportTransport"
                  value={airTransport}
                  checked={airTicketingdObj.airportTransport === airTransport}
                  onChange={handleChange}
                />
                {airTransport}
              </label>
            ))}

          </div>
        </div>

        {/* Quote Given */}
        <label className="label-style">Quote Given</label>
        <input
          type="text"
          name="quoteGiven"
          placeholder="Enter quote"
          value={airTicketingdObj.quoteGiven || ""}
          className={`border-highlight`}
          onChange={handleChange}
        />
      </div>
      {/* Remark */}
      <div>
        <label className="label-style">Remark</label>
        <input
          type="text"
          name="notes"
          placeholder="Remark"
          value={airTicketingdObj.notes || ""}
          className={`border-highlight`}
          onChange={handleChange}
        />
        {/* History hover component */}
        {memoIsUpdate && (
          <HistoryHover histories={memoHistories} />)
        }
      </div>

      {/* <AirTicketingScreen></AirTicketingScreen> */}
    </div >
  );

};
export default LeadAirTicketing;