import React, { useEffect } from "react";
import { useState } from 'react';
import { AirTicketingLeadObject } from "./Model/AirTicketLeadModel";
import { useMemo } from "react";
import HistoryHover from "./HIstoryHover";
import PassportDetails from "./PassportDetails"
import { PassportDetailsObject } from "./Model/PassportDetailsModel";
import { getEmptyPassportDetailsObj } from "./Model/PassportDetailsModel";
import { validateFromDate } from "./validations";
import { getLabelById, getRadioValue } from "./utils/selectUtils";
import { DateViewField, ViewField } from "./ConstantComponent/ViewComponents";




const LeadAirTicketing = ({ airTicketingdObj, setAirTicketingLeadObj, histories, isUpdate, mode }) => {

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";


  // Memoize the histories array so reference doesn't change unnecessarily
  const memoHistories = useMemo(() => histories || [], [histories]);
  const memoIsUpdate = useMemo(() => isUpdate || false, [isUpdate]);
  const [errors, setErrors] = useState({});
  const [passportDetailsObj, setPassportDetails] = useState(getEmptyPassportDetailsObj());


  const travelClassOptions = [
    { value: "economy", label: "Economy" },
    { value: "premium-economy", label: "Premium Economy" },
    { value: "business class", label: "Business Class" },
    { value: "first class", label: "First Class" },
  ];

  const ticketTypeOptions = [
    { value: "individual", label: "Individual" },
    { value: "group", label: "Group" },
  ];



  const handleChange = (e) => {

    console.log("**********************IN AIR TICKETING OBJECT   /**************************");
    console.log("Handle Change Called for Air Ticekting Obj  ");
    console.log("Air Ticketing Obj before change.....:", airTicketingdObj);
    console.log("Histories received....", histories);
    console.log("isUpdate flag....", memoIsUpdate);


    debugger;
    const { name, value } = e.target;
    console.log("printing name and value : ", name, value);
    // setAirTicketingLeadObj(prev => ({
    //   ...prev,
    //   [name]: value,

    // }));
    setAirTicketingLeadObj(prev => {
      let updatedState = {
        ...prev,
        [name]: value
      };

      // when ticket type changes to INTERNATIONAL
      if (
        name === "airTicketType" &&
        value === "International" &&
        prev.onwardDate &&
        prev.returnDate
      ) {
        const onwardTime = new Date(prev.onwardDate).getTime();
        const returnTime = new Date(prev.returnDate).getTime();

        // invalid date for international → clear return date
        if (returnTime <= onwardTime) {
          updatedState.returnDate = "";
        }
      }

      return updatedState;
    });

    console.log("Air Ticketing Obj.....:", airTicketingdObj);
  };

  useEffect(() => {
    debugger;
    console.log("****.....In Lead Air Ticketing Useffect..............**");
    if (memoIsUpdate) {
      console.log("In LeadAirTicketing . Its an exisitng lead. Updating the passport details. ");


      setPassportDetails(prev => ({
        ...prev, // keep all other fields unchanged
        overseasInsurance: airTicketingdObj.overseasInsurance,
        visaStatus: airTicketingdObj.visaStatus,
        passportValidityDate: airTicketingdObj.passportValidityDate
      }));
      


      console.log("Updated Passport Details objects:", passportDetailsObj);
    }
    console.log("Airticketing Obj in useEffect.....:", airTicketingdObj);
    console.log("Histories in useEffect.....:", histories);
    console.log("isUpdate flag....", memoIsUpdate);
  }, [memoIsUpdate]);

  const handleFromDateBlur = (FieldName) => {
    const dateValue = airTicketingdObj[FieldName];   //............. we pass feild name here so we can reuse it just passing the name of element inside this component 
    let errorMsg = validateFromDate(dateValue);

    //  Extra rule ONLY for return date
    if (
      FieldName === "returnDate" &&
      airTicketingdObj.airTicketType === "International" &&
      airTicketingdObj.onwardDate &&
      dateValue
    ) {
      const returnTime = new Date(dateValue).getTime();
      const onwardTime = new Date(airTicketingdObj.onwardDate).getTime();

      if (returnTime <= onwardTime) {
        errorMsg = "Return date must be after onward date";
      }
    }

    if (errorMsg) {
      setAirTicketingLeadObj(prev => ({
        ...prev,
        [FieldName]: ""   // clear the date field 
      }));
    }
    setErrors(prev => ({
      ...prev,
      [FieldName]: errorMsg
    }));
    console.log("Ticket type : " + airTicketingdObj.airTicketType);
  }

  // const [airTicketType, setAirTicketType] = useState([]);
  return (
    <div>
      <label className="label-style">Air Ticket Type</label>
      <div className="rounded-lg flex justify-between gap-3">

        {["Domestic", "International"].map((airstatus) => {
          const isChecked =
            airTicketingdObj?.airTicketType?.trim()?.toLowerCase() ===
            airstatus.toLowerCase();

          return (
            <label
              key={airstatus}
              className={`flex items-center gap-2 flex-1 rounded-md px-0.5 py-2 border
          ${isChecked
                  ? isViewMode
                    ? "bg-gray-100 border"   // selected + view mode
                    : "bg-blue-100 border-blue-500"  // selected + edit mode
                  : "bg-white border-transparent"
                }
          ${isViewMode ? "cursor-not-allowed " : "cursor-pointer "}
        `}
            >
              <input
                type="radio"
                name="airTicketType"
                value={airstatus}
                checked={isChecked}
                onChange={handleChange}
                disabled={isViewMode}
                className={`accent-blue-600 ${isViewMode ? "cursor-not-allowed " : "cursor-pointer "
                  }`}
              />
              <span className="text-black">
                {airstatus}
              </span>
            </label>
          );
        })}
        {/* {["Domestic", "International"].map((airstatus) => (
          <label
            key={airstatus}
            className={`flex items-center gap-2 flex-1 cursor-pointer rounded-md px-0.5 py-2 
              ${getRadioValue({
              selectedValue: airTicketingdObj?.airTicketType?.trim()?.toLowerCase(),
              optionValue: airstatus.toLowerCase,
              isViewMode,
            })}
          ${isViewMode ? "cursor-not-allowed" : "cursor-pointer"}
        `}
          // ${airTicketingdObj?.airTicketType?.trim()?.toLowerCase() === airstatus.toLowerCase()
          //     ? "bg-blue-100 border border-blue-500"
          //     : "bg-white border border-transparent"}`}
          >
            <input
              type="radio"
              name="airTicketType"
              value={airstatus}
              checked={airTicketingdObj?.airTicketType?.trim()?.toLowerCase() === airstatus.toLowerCase()}
              onChange={handleChange}
              disabled={isViewMode}
              // onChange={(e) => setAirTicketingLeadObj("domestic")}
              // className="accent-blue-600 cursor-pointer"
              className={`accent-blue-600 ${isViewMode ? "cursor-not-allowed" : "cursor-pointer"}`}
            />
            {airstatus}
          </label>
        ))} */}
      </div>


      {/* Common fields in Air Ticketing*/}
      {/* Onword Date */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1">
          <label className="label-style">Onward Date</label>
          {isViewMode ? (
            <DateViewField value={airTicketingdObj.onwardDate} />
          ) : (
            <input
              type="date"
              name="onwardDate"
              min={new Date().toISOString().split("T")[0]} // onward >= today
              value={airTicketingdObj.onwardDate || ""}
              onChange={handleChange}
              onBlur={() => handleFromDateBlur("onwardDate")}
              className={`border-highlight`}
            />
          )}

          {errors.onwardDate && (<p className="text-red-500 text-sm mt-1">{errors.onwardDate}</p>)}

          {/* Return Date */}
        </div>
        <div className="flex-1">
          <label className="label-style">Return Date</label>
          {isViewMode ? (
            <DateViewField value={airTicketingdObj.returnDate} />
          ) : (
            <input
              type="date"
              name="returnDate"
              min={
                airTicketingdObj.airTicketType === "International" && airTicketingdObj.onwardDate
                  ? new Date(
                    new Date(airTicketingdObj.onwardDate).setDate(
                      new Date(airTicketingdObj.onwardDate).getDate() + 1
                    )
                  ).toISOString().split("T")[0]
                  : new Date().toISOString().split("T")[0]
              }
              value={airTicketingdObj.returnDate || ""}
              onChange={handleChange}
              onBlur={() => handleFromDateBlur("returnDate")}
              disabled={!airTicketingdObj.onwardDate}
              className={`border-highlight`}
            />
          )}
          {errors.returnDate && (<p className="text-red-500 text-sm mt-1">{errors.returnDate}</p>)}
        </div>
      </div>

      {/* Sector */}

      <div className="flex-1">
        <label className="label-style">Sector</label>
        {isViewMode ? (
          <ViewField value={airTicketingdObj.sector} />
        ) : (
          <input
            type="text"
            name="sector"
            placeholder="Sector"
            value={airTicketingdObj.sector || ""}
            onChange={handleChange}
            className={`border-highlight`}
          />
        )}
      </div>
      {/* No of travelers and travel class */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1">
          <label className="label-style">No of Travelers</label>
          {isViewMode ? (
            <ViewField value={airTicketingdObj.noOfTravelers} />
          ) : (
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
          )}
        </div>
        {/* Travel Class Dropdown */}
        <div className="flex-1">
          <label className="label-style">Travel Class</label>
          {isViewMode ? (
            <ViewField
              value={getLabelById(
                travelClassOptions,
                airTicketingdObj.travelClass,
                "value",
                "label"
              )}
            />
          ) : (
            <select
              name="travelClass"
              value={airTicketingdObj.travelClass || ""}
              onChange={handleChange}
              className={`border-highlight`}
            >
              {/* <option value="">Select Class</option>
            <option value="economy">Economy</option>
            <option value="premium-economy">Premium Economy</option>
            <option value="business class">Business Class</option>
            <option value="first class">First Class</option> */}
              <option value="">Select Class</option>
              {travelClassOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div>
        {/* Ticket Type Dropdown */}
        <div className="flex-1">
          <label className="label-style">Ticket Type</label>
          {isViewMode ? (
            <ViewField
              value={getLabelById(
                ticketTypeOptions,
                airTicketingdObj.ticketType,
                "value",
                "label"
              )}
            />
          ) : (
            <select
              name="ticketType"
              value={airTicketingdObj.ticketType || ""}
              onChange={handleChange}
              className={`border-highlight`}
            >
              {/* <option value="">Select Ticket Type</option>
              <option value="individual">Individual</option>
              <option value="group">Group</option> */}
              <option value="">Select Ticket Type</option>
              {ticketTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Show extra fields depending on trip type */}
        {airTicketingdObj?.airTicketType?.trim()?.toLowerCase() === "international" && (

          // *********** if want to show some specific feilds make true or false according to need************

          <PassportDetails
            passportDetailsObj={passportDetailsObj}
            setPassportDetailsObj={setPassportDetails}
            setParentObject={setAirTicketingLeadObj}
            showVisaStatus={true}
            showPassportValidity={false}
            showPassportValidityDate={true}
            showInsurance={true}   //  hide insurance here change condition according to requirement 
            isViewMode={isViewMode}
          />
        )}


        <div className="flex-1 min-w-[200px] flex flex-col">
          <label className="label-style">Airport Transport</label>
          <div className="border border-gray-300 rounded-lg p-2 flex justify-between flex-1 h-full">
            {["Self Arrange", "Not Decided", "Book Through Girikand"].map((airTransport) => (
              <label
                key={airTransport}
                // className={`option-highlight
                //       ${airTicketingdObj.airportTransport === airTransport
                //     ? "option-highlight-active"
                //     : "option-highlight-inactive"
                //   }`}
                className={`option-highlight
          ${getRadioValue({
                  selectedValue: airTicketingdObj.airportTransport,
                  optionValue: airTransport,
                  isViewMode,
                  activeClass: "option-highlight-active",
                  inactiveClass: "option-highlight-inactive",
                  viewActiveClass: "bg-gray-100 text-gray-800 border",
                })}
          ${isViewMode ? "cursor-not-allowed" : "cursor-pointer"}
        `}
              >
                <input
                  type="radio"
                  name="airportTransport"
                  value={airTransport}
                  checked={airTicketingdObj.airportTransport === airTransport}
                  onChange={handleChange}
                  disabled={isViewMode}
                />
                 <span className="text-black">
                {airTransport}
                </span>
              </label>
            ))}

          </div>
        </div>

        {/* Quote Given */}
        <label className="label-style">Quote Given</label>
        {isViewMode ? (
          <ViewField value={airTicketingdObj.quoteGiven} />
        ) : (
        <input
          type="text"
          name="quoteGiven"
          placeholder="Enter quote"
          value={airTicketingdObj.quoteGiven || ""}
          className={`border-highlight`}
          onChange={handleChange}
        />
        )}
      </div>
      {/* Remark */}
      <div>
        <label className="label-style">Remark</label>
        {isViewMode ? (
          <ViewField value={airTicketingdObj.notes} />
        ) : (
        <input
          type="text"
          name="notes"
          placeholder="Remark"
          value={airTicketingdObj.notes || ""}
          className={`border-highlight`}
          onChange={handleChange}
        />
        )}
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