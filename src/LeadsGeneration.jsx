
import PhoneField from './PhoneInput';
import cloneDeep from 'lodash/cloneDeep';
import { useEffect, useState } from 'react';
import LeadVisa from './LeadVisa';
import LeadAirTicketing from './LeadAirTicketing';
import axios from "axios";
import React from 'react';
import { getEmptyLeadObj } from "../src/Model/LeadModel";
import config from './config';
import { VISALeadObject } from './Model/VisaLeadModel';
import { getEmptyVisaObj } from "./Model/VisaLeadModel";
import { validMobileNoLive, validNameLive, validateBeforeSubmit, validEmailLive } from './validations';
import LeadCarRental from './LeadCarRental';

export default function LeadsGeneration({ lead }) {
  const [leadObj, setLeadObj] = useState(getEmptyLeadObj());
  const [visadObj, setVisaObj] = useState(getEmptyVisaObj());
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [leadCategoryList, setLeadCategoryList] = useState({});
  const [selectedLeadName, setSelectedLeadName] = useState("");
  const [enquirySource, setEnquirySource] = useState('');
  const [enquiryMode, setEnquiryMode] = useState('');
  const [formData, setFormData] = useState({});
  const [submitBtnTxt, setSubmitBtnTxt] = useState('Generate Lead');
  const [formHeader, setFormHeader] = useState('Lead Generation Form');
  const [countries, setCountries] = useState([]);
  const [countryCode, setCountryCode] = useState([]);


  const [showPopup, setShowPopup] = useState(false);
  //Requirment for car rental
  const [requirementType, setRequirementType] = useState("");


  //for Indian City Dropdown through API
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [leadcategory, setleadcategory] = useState({});

  const enquirySources = [
    'Referred by client', 'Repeat Guest', 'Paper Advt', 'Paper Advt-Sakal', 'Paper Advt-Maharashtra Times',
    'Paper Advt-Loksatta', 'Paper Advt-Lokmat', 'Paper Advt-TOI', 'Paper Advt-Others', 'Corporate',
    'Other', 'Website', 'Social Media'
  ];
  const enquiryModes = ['WalkIn', 'Telephonic', 'Email', 'Social Media'];

  const APIURL = config.apiUrl + '/Leads/';
  const LeadCategoryAPI = APIURL + "GetLeadCategoryList";
  const generateLEadAPI = config.apiUrl + "/TempLead/CreateLead";
  const updateLeadApi = config.apiUrl + "/TempLead/UpdateLead";

  //Indian city api 
  useEffect(() => {
    // Example API that provides Indian cities
    fetch("https://countriesnow.space/api/v0.1/countries/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: "India" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          setCities(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cities:", err);
        setLoading(false);
      });
  }, []);

  const cityAreas = {
    Pune: ["Kothrud", "Karvenagar", "Nigdi", "Bhosari", "Deccan"],
    Mumbai: ["Andheri", "Borivali", "Dadar", "Bandra", "Kurla"],
    Aurangabad: ["Cidco", "Nirala Bazar", "Garkheda", "Waluj"],
    Kolhapur: ["Shahupuri", "Laxmipuri", "Rajaram Puri"],
    Ahemdabad: ["Maninagar", "Navrangpura", "Satellite", "Bopal"],
  };

  const mapIncomingVisaToModel = (incomingVisa) => {
    const newVisa = { ...getEmptyVisaObj() }; // start with default model

    debugger;
    if (!incomingVisa) return newVisa;


    debugger
    // Map main properties
    newVisa.id = incomingVisa.id || null;
    newVisa.country1 = incomingVisa.country1?.trim() || '';
    newVisa.country2 = incomingVisa.country2?.trim() || '';
    newVisa.country3 = incomingVisa.country3?.trim() || '';
    newVisa.visaType = incomingVisa.visaType?.trim() || '';
    newVisa.travelDate = incomingVisa.travelDate || null;
    newVisa.noOfApplicants = incomingVisa.noOfApplicants || null;
    newVisa.purposeOfTravel = incomingVisa.purposeOfTravel?.trim() || '';
    newVisa.noOfEntries = incomingVisa.noOfEntries?.trim() || '';
    newVisa.travelPlanStatus = incomingVisa.travelPlanStatus?.trim() || '';
    newVisa.hotelBooking = incomingVisa.hotelBooking?.trim() || '';
    newVisa.overseasInsurance = incomingVisa.overseasInsurance?.trim() || '';
    newVisa.passportValidity = incomingVisa.passportValidity?.trim() || '';
    newVisa.airTicketIssuedBy = incomingVisa.airTicketIssuedBy?.trim() || '';
    newVisa.quoteGiven = incomingVisa.quoteGiven?.trim() || '';
    newVisa.notes = incomingVisa.notes || '';
    newVisa.visaCode = incomingVisa.visaCode || null;
    newVisa.assigneeTo_UserID = incomingVisa.assigneeTo_UserID || '';
    newVisa.createdBy_UserID = incomingVisa.createdBy_UserID || 'gpatil';
    newVisa.createdAt = incomingVisa.createdAt || new Date().toISOString();
    newVisa.updatedAt = incomingVisa.updatedAt || new Date().toISOString();


    debugger; console.log("Mapped Visa Obj....:", newVisa);
    return newVisa;
  };

  const mapIncomingLeadToModel = (incomingLead) => {
    const newLead = { ...getEmptyLeadObj() }; // start with default model

    debugger;
    // Map main properties
    newLead.leadID = incomingLead.leadID || null;
    newLead.title = incomingLead.title?.trim() || '';
    newLead.fName = incomingLead.fName || '';
    newLead.mName = incomingLead.mName || '';
    newLead.lName = incomingLead.lName || '';
    newLead.mobileNo = incomingLead.mobileNo || '';
    newLead.emailId = incomingLead.emailId || '';
    newLead.gender = incomingLead.gender?.trim() || '';
    newLead.birthDate = incomingLead.birthDate || '';
    newLead.city = incomingLead.city || '';
    newLead.area = incomingLead.area || '';
    newLead.enquiryMode = incomingLead.enquiryMode || '';
    newLead.enquirySource = incomingLead.enquirySource || '';
    newLead.customerType = incomingLead.customerType || '';
    newLead.fK_LeadCategoryID = incomingLead.fK_LeadCategoryID || null;
    newLead.followUpDate = incomingLead.followUpDate || '';
    newLead.histories = incomingLead.histories || [];
    newLead.leadStatus = incomingLead.leadStatus || 'Open';
    newLead.createdAt = incomingLead.createdAt || null;
    newLead.updatedAt = incomingLead.updatedAt || null;
    newLead.enquiryDate = incomingLead.enquiryDate || null;


    // setVisaObj(newLead.category);

    // Map Visa category if exists
    if (incomingLead.category && incomingLead.category.$type === "VISA") {
      const mappedVisa = mapIncomingVisaToModel(incomingLead.category);
      newLead.category = mappedVisa;   // assign directly
      setVisaObj(mappedVisa);          // update state
      setSelectedLeadName(incomingLead.category.categoryName || "Visa");
    } else {
      newLead.category = null;
      setVisaObj(getEmptyVisaObj());
    }

    return newLead;
  };

  // Initialize leadObj on prop change
  useEffect(() => {

    debugger;

    if (lead && Object.keys(lead).length > 0) {

      debugger;


      const mappedLead = mapIncomingLeadToModel(lead);

      setLeadObj(mappedLead);
      setIsUpdateMode(true);
      setSubmitBtnTxt("Update Lead");
      setFormHeader("Update Lead Form");
    } else {
      //***************************************    New Lead Generation    **********************************************///
      setLeadObj(getEmptyLeadObj());
      setLeadObj(prev => ({ ...prev, category: null })); // reset category data
      setIsUpdateMode(false);
      setSubmitBtnTxt("Generate Lead");
      setFormHeader("Lead Generation Form");

      /****************************************************************************************************************** */
    }
  }, [lead]);

  // Fetch Lead Categories
  useEffect(() => {
    const fetchLeadCategories = async () => {
      try {
        const res = await axios.get(LeadCategoryAPI);
        if (res.data) setLeadCategoryList(res.data);
      } catch (err) {
        console.error("Error fetching Lead Categories:", err);
      }
    };
    fetchLeadCategories();
  }, []);

  // Set selected lead name whenever leadObj.fK_LeadCategoryID or categories update
  useEffect(() => {
    if (leadObj.fK_LeadCategoryID && leadCategoryList) {
      const name = leadCategoryList[leadObj.fK_LeadCategoryID];
      setSelectedLeadName(name || "");
    }
  }, [leadObj.fK_LeadCategoryID, leadCategoryList]);

  // Fetch countries and country codes
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then(res => res.json())
      .then(data => setCountryCode(data || []))
      .catch(err => console.error(err));

    fetch("https://countriesnow.space/api/v0.1/countries/positions")
      .then(res => res.json())
      .then(data => setCountries(data.data || []))
      .catch(err => console.error(err));
  }, []);

  const handleVisaChange = (e) => {
    const { name, value } = e.target;
    setVisaObj(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeForCategory = (e) => {
    debugger;
    console.log("In handle change for category changed...", e.target.value);
    const val = Number(e.target.value);
    setLeadObj(prev => ({ ...prev, fK_LeadCategoryID: val }));
    setSelectedLeadName(leadCategoryList[val] || "");
    debugger;

    switch (leadCategoryList[val]) {
      case 'Visa':
        setLeadObj(prev => ({ ...prev, categoryData: getEmptyVisaObj() }));
        break;
      //   case 'Air Ticketing':
      default:
        return null;
    }
  };


  React.useEffect(() => {

    debugger;

    // switch (selectedLeadName) {

    //   case "Visa":
    //     setLeadObj(prev => ({ ...prev, categoryData:visadObj }));
    //     break;
    //   // case "Hotel":
    //   //   setLeadObj(prev => ({ ...prev, categoryData: hotelObj }));
    //   //   break;
    //   // case "Flight":
    //   //   setLeadObj(prev => ({ ...prev, categoryData: flightObj }));
    //   //   break;
    //   default:
    //     setLeadObj(prev => ({ ...prev, categoryData: null }));
    // }
  }, [selectedLeadName, visadObj]);


  const validate = () => {

    let errs = {};

    // Follow Up Date
    // if (!leadObj.FollowUpDate) {
    //   errs.FollowUpDate = "Follow Up Date is required";
    // } else {
    //   const today = new Date();
    //   const selectedDate = new Date(leadObj.FollowUpDate);
    //   today.setHours(0, 0, 0, 0);
    //   selectedDate.setHours(0, 0, 0, 0);

    //   if (selectedDate <= today) {
    //     errs.FollowUpDate = "Follow Up Date cannot be in the past";
    //   }
    // }

    return errs;
  }


  const handleChange = (e) => {

    debugger;

    const { name, value } = e.target;
    setLeadObj(prev => ({ ...prev, [name]: value }));
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log("Category Changed...", formData);

    // Live validation only first,middle,last name , mobileno andd email 
    let errMsg = "";   //common for all 
    if (name === "fName") errMsg = validNameLive(value, "First Name");
    if (name === "mName") errMsg = validNameLive(value, "Middle Name");
    if (name === "lName") errMsg = validNameLive(value, "Last Name");
    if (name === "mobileNo") errMsg = validMobileNoLive(value, "Mobile No");
    if (name === "emailId") errMsg = validEmailLive(value, "Email No");


    setErrors((prev) => ({ ...prev, [name]: errMsg })); // common for all 

    // Live validation for Follow Up Date

    // if (name === "followUpDate") {

    // if (name === "FollowUpDate") {

    //   let errMsg = "";
    //   if (!value) {
    //     errMsg = "Follow Up Date is required";
    // } else {
    //   const today = new Date();
    //   const selectedDate = new Date(value);
    //   today.setHours(0, 0, 0, 0);
    //   selectedDate.setHours(0, 0, 0, 0);

    // if (selectedDate <= today) {
    //   errMsg = "Follow Up Date cannot be in the past";
    // }
    //   }

    // //   setErrors((prev) => ({ ...prev, followUpDate: errMsg }));

    // //   setErrors((prev) => ({ ...prev, FollowUpDate: errMsg }));

    // }

  };

  const renderCategoryFields = () => {
    debugger;

    console.log("In renderCategoryFields Lead Object....:", leadObj);
    console.log("In renderCategoryFields VisaObj....:", visadObj);

    switch (selectedLeadName.toLowerCase()) {
      case 'visa':
        return <LeadVisa visadObj={visadObj} countries={countries} setVisaLeadObj={setVisaObj} />;
      case 'air ticketing':
        return <LeadAirTicketing formData={formData} handleChange={handleChange} />;
      case 'car rentals':
        return <LeadCarRental cities={cities} loading={loading} handleChange={handleChange} />
      case 'holiday':
        return (
          <>
            <div className="flex-1">
              <label htmlFor="holidayType" className="label-style">Holiday Type</label>
              <select
                id="holidayType"
                name="holidayType"
                className="border-highlight"
                onChange={handleChange}
              >
                <option value="">Select Holiday Type</option>
                <option value="INT-FIT">International FIT</option>
                <option value="DOM-FIT">Domestic FIT</option>
                <option value="INT-GIT">International GIT</option>
                <option value="DOM-GIT">Domestic GIT</option>
              </select>
            </div>
            <div>
              <label className="label-style">No of Passenger</label>
              <input
                className={`border-highlight`}
                name="numPassenger"
                type="number"
                min="1"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label-style">Special Requirement</label>
              <input
                name="requirement"
                placeholder="Special Requirement"
                onChange={handleChange}
                className={`border-highlight`}
              />

            </div>
            <div>
              {/* Quote Given */}
              <label className="label-style">Quote Given</label>
              <input
                type="text"
                placeholder="Enter quote"
                className={`border-highlight`}

              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {

    debugger;

    e.preventDefault();




    const fNameError = validateBeforeSubmit(leadObj.fName, "First Name");
    const lNameError = validateBeforeSubmit(leadObj.lName, "Last Name");
    const mobileNoError = validateBeforeSubmit(leadObj.mobileNo, "Mobile Number");
    const emailIdError = validateBeforeSubmit(leadObj.emailId, "Email Address");
    const titleError = validateBeforeSubmit(leadObj.title, "Title");
    const genderError = validateBeforeSubmit(leadObj.gender, "Gender");
    const followUpDateError = validateBeforeSubmit(leadObj.followUpDate, "Follow up Date");


    const errs = validate();
    if (fNameError) errs.fName = fNameError;
    if (lNameError) errs.lName = lNameError;
    if (mobileNoError) errs.mobileNo = mobileNoError;
    if (emailIdError) errs.emailId = emailIdError;
    if (titleError) errs.title = titleError;
    if (genderError) errs.gender = genderError;
    if (followUpDateError) errs.followUpDate = followUpDateError;

    try {
      if (Object.keys(errs).length > 0) {
        setErrors(errs);        // highlight specific fields
        setShowPopup(true);     // also show the popup
        return;
      }
    } catch (error) {
      console.error("Validation Failed", error);
    }

    // Remove empty errors (fields without error)
    Object.keys(errs).forEach((key) => {
      if (!errs[key]) delete errs[key];
    });
    setErrors(errs);

    // Final check: Only submit if no errors
    if (Object.keys(errs).length === 0) {
      console.log("Form Submitted:", leadObj);
    }

    try {
      if (isUpdateMode) {

        const deepLeadCopy = cloneDeep(leadObj);
        const deepVisaCopy = cloneDeep(visadObj);
        deepLeadCopy.category = { ...deepVisaCopy }; // ✅ attach visa data
        debugger;

        console.log("Final Lead Obj to Update:", deepLeadCopy);
        console.log("upate api...", `${updateLeadApi}/${deepLeadCopy.leadID}`);

        const response = await axios.put(updateLeadApi, deepLeadCopy, { headers: { "Content-Type": "application/json" } });


        console.log("Updated lead:", response.data);


        alert("Lead updated successfully!");
      } else {

        debugger;


        const deepCopy = cloneDeep(leadObj);
        const deepVisaCopy = cloneDeep(visadObj);
        deepCopy.category = { ...deepVisaCopy }; // ✅ attach visa data


        console.log("New Lead Obj...", deepCopy);
        await axios.post(generateLEadAPI, deepCopy, { headers: { "Content-Type": "application/json" } });
        alert("Lead saved successfully!");
      }
    } catch (error) {
      debugger;
      console.error("Error saving lead:", error);
      alert("Error while saving lead.");
    }
  };
  return (
    <div className='max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl'>
      <h2 className='text-2xl font-bold mb-6 text-center text-blue-600'>{formHeader}</h2>
      {/* Customer Details */}
      <div className='border border-gray-300 bg-gray-50 rounded-lg p-4 mb-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4 border-b pb-2'>Customer Details</h3>
        <div className='flex gap-4 mb-4'>
          <div className='flex flex-col flex-1'>
            <label className='label-style'>Mobile Number</label>
            <input name='mobileNo' placeholder='Mobile Number' onChange={handleChange} value={leadObj.mobileNo || ''} maxLength={10}
              className={`border-highlight ${errors.mobileNo ? "border-red-500" : ""}`}
            />
            {errors.mobileNo && <p className="text-red-500 text-sm">{errors.mobileNo}</p>}
          </div>
          <div className='flex flex-col flex-1'>
            <label className='label-style'>Email</label>
            <input name='emailId' placeholder='Email Address' type='email' onChange={handleChange} value={leadObj.emailId || ''} className={`border-highlight ${errors.emailId ? "border-red-500" : ""}`} />
            {errors.emailId && <p className="text-red-500 text-sm">{errors.emailId}</p>}
          </div>
        </div>
        <div className='flex gap-4 mb-4'>
          <div className='flex flex-col w-28'>
            <label className='label-style'>Title</label>
            <select name='title' value={leadObj.title?.trim() || ""} onChange={handleChange} className={`border-highlight ${errors.title ? "border-red-500" : ""}`}>
              <option value=''>Title</option>
              <option value='Mr.'>Mr.</option>
              <option value='Mrs.'>Mrs.</option>
              <option value='Ms.'>Ms.</option>
              <option value='Dr.'>Dr.</option>
              <option value='Prof.'>Prof.</option>
            </select>
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>
          <div className='flex flex-col flex-1'>
            <label className='label-style'>First Name</label>
            <input name='fName' placeholder='First Name' value={leadObj.fName || ''} onChange={handleChange} maxLength={30}
              className={`border-highlight ${errors.fName ? 'border-red-500' : ''}`} />
            {errors.fName && <p className="text-red-500 text-sm">{errors.fName}</p>}
          </div>
          <div className='flex flex-col flex-1'>
            <label className='label-style'>Middle Name</label>
            <input name='mName' placeholder='Middle Name' value={leadObj.mName || ''} onChange={handleChange} maxLength={30}
              className={`border-highlight ${errors.mName ? 'border-red-500' : ''}`} />
            {errors.mName && <p className="text-red-500 text-sm">{errors.mName}</p>}
          </div>
          <div className='flex flex-col flex-1'>
            <label className='label-style'>Last Name</label>
            <input name='lName' placeholder='Last Name' value={leadObj.lName || ''} onChange={handleChange} maxLength={30}
              className={`border-highlight ${errors.lName ? 'border-red-500' : ''}`} />
            {errors.lName && <p className="text-red-500 text-sm">{errors.lName}</p>}
          </div>
        </div>

        {/* Birthdate + Gender + City + Area */}
        <div className='flex gap-4 mb-4'>
          {/* Birthdate */}
          <div className='flex flex-col flex-1'>
            <label className='label-style'>Birthdate</label>
            <input
              type='date'
              className={`border-highlight`}
              name='birthDate'
              onChange={handleChange}
              value={leadObj.birthDate}
            />
          </div>

          {/* Gender */}
          <div className='flex flex-col flex-1'>
            <label className='label-style'>Gender</label>
            <select
              value={leadObj.gender?.trim() || ""}
              className={`border-highlight ${errors.gender ? "border-red-500" : ""}`}
              name='gender'
              onChange={handleChange}
            >
              <option value=''>Select Gender</option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>


            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
          </div>
          {/* City */}
          <div className="flex flex-col flex-1">
            <label className="label-style">City</label>
            <select
              className={`border-highlight`}
              // className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="city"
              value={leadObj.city?.trim() || ""}
              onChange={handleChange}
            >
              <option value="">Select City</option>
              {Object.keys(cityAreas).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

               {/* Area */}
          <div className="flex flex-col flex-1">
            <label className="label-style">Area</label>
            <select
              className={`border-highlight`}
              // className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              name="area"
              value={leadObj.area?.trim() || ""}
              onChange={handleChange}
              disabled={!leadObj.city} // disable until city selected
            >
              <option value="">Select Area</option>
              {leadObj.city &&
                cityAreas[leadObj.city || []].map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lead Details */}
      <h3 className='text-lg font-semibold text-gray-800 mb-4 border-b pb-2'>Leads Details</h3>
      <div className='flex gap-4'>
        <div className='flex flex-col flex-1'>
          <label className='label-style'>Enquiry Mode</label>
          <select name="enquiryMode" value={leadObj.enquiryMode?.trim() || ""} onChange={handleChange} className='border-highlight'>
            <option value="">Select Mode</option>
            {enquiryModes.map(boy => <option key={boy} value={boy}>

              {boy}


            </option>)}
          </select>
        </div>
        <div className='flex flex-col flex-1'>
          <label className='label-style'>Enquiry Source</label>
          <select name="enquirySource" value={leadObj.enquirySource?.trim() || ""} onChange={handleChange} className='border-highlight'>
            <option value="">Select Source</option>
            {enquirySources.map(cat => <option key={cat} value={cat}>


              {cat}

            </option>)}
          </select>
        </div>
        {/* Customer Type */}
        <div className='flex flex-col flex-1'>
          <label className="font-medium text-gray-600 mb-1 block">Customer Type</label>
          <select
            className={`border-highlight`}
            // className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="customerType"
            value={leadObj.customerType?.trim() || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="VVIP">VVIP</option>
            <option value="VIP">VIP</option>
            <option value="Miser">Miser</option>
            <option value="Friends">Friends</option>
            <option value="Family">Family</option>
          </select>
        </div>
      </div>

      <div className='flex gap-4 mt-4'>
        <div className='flex flex-col flex-1'>
          <label className='label-style'>Category</label>
          <select
           name="category" 
           value={leadObj.fK_LeadCategoryID || ''} 
           onChange={handleChangeForCategory} 
           className='border-highlight'>
            <option value=''>Select Category</option>
            {Object.entries(leadCategoryList).map(([key, val]) => (
              <option key={key} value={Number(key)}>{val}</option>
            ))}
          </select>
        </div>
      </div>

  {/* Render dynamic fields */ }
        <div className='mt-4'>{renderCategoryFields()}</div>

        <div className="flex justify-between items-center mt-6 gap-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
            {submitBtnTxt}
          </button>
          <div className="flex items-center gap-2">
            <label htmlFor="followUpDate" className="font-medium text-gray-600 whitespace-nowrap">
              Follow Up Date :
            </label>
            <div className="flex flex-col  justify-start leading-none">
              <input
                type="date"
                id="followUpDate"
                name="followUpDate"
                value={leadObj.followUpDate || ''}
                onChange={handleChange}
                min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} //  only tomorrow onward date is allowed 
                // min={new Date().toISOString().split("T")[0]} //  disables past dates
                className={`border-highlight ${errors.followUpDate ? "border-red-500" : " "}`}
                required
              />
            </div>
          </div>
        </div>
        <div className='text-right'>

          {errors.followUpDate && (<p className="text-red-500 text-sm mt-1 justify-right">{errors.followUpDate}</p>)}

          {errors.FollowUpDate && (<p className="text-red-500 text-sm mt-1 justify-right">{errors.FollowUpDate}</p>)}

        </div>


  {/* Footer */ }
  {/* <div className="flex justify-between items-center mt-6 gap-4">
        <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
          {submitBtnTxt}
        </button>
        <div className="flex items-center gap-2">

          <label htmlFor="followUpDate" className="font-medium text-gray-600 whitespace-nowrap">Follow Up Date :</label>
          <input 
          type="date" 
          id="followUpDate" 
          name="followUpDate" 
          value={leadObj.followUpDate || ''}

          <label htmlFor="FollowUpDate" className="font-medium text-gray-600 whitespace-nowrap">Follow Up Date :</label>
          <input 
          type="date" 
          id="FollowUpDate" 
          name="FollowUpDate" 
          value={leadObj.FollowUpDate || ''}

           onChange={handleChange} 
           className={`border-highlight`} 
          />
        </div>
      </div> */}

  {/* Popup / Modal */ }
  {
    showPopup && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-lg font-semibold mb-4">⚠️ Required Fields Missing</h3>
          <p className="mb-4">Please fill all required details before submitting.</p>
          <button
            onClick={() => setShowPopup(false)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            OK
          </button>
        </div>
      </div>
    )
  }
      </div >

      );
}
