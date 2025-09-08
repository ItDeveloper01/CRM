
import PhoneField from './PhoneInput';
import { useEffect, useState } from 'react';
import LeadVisa from './LeadVisa';
import LeadAirTicketing from './LeadAirTicketing';
import axios from "axios";
import React from 'react';
import { getEmptyLeadObj } from "./Model/LeadModel";
import config from './config';
import { validMobileNoLive, validNameLive, validateBeforeSubmit, validEmailLive } from './validations';
import { VISALeadObject } from './Model/VisaLeadModel';
import { getEmptyVisaObj } from "./Model/VisaLeadModel";

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
  const updateLeadApi = APIURL + "UpdateLead";

  const cityAreas = {
    Pune: ["Kothrud", "Karvenagar", "Nigdi", "Bhosari", "Deccan"],
    Mumbai: ["Andheri", "Borivali", "Dadar", "Bandra", "Kurla"],
    Aurangabad: ["Cidco", "Nirala Bazar", "Garkheda", "Waluj"],
    Kolhapur: ["Shahupuri", "Laxmipuri", "Rajaram Puri"],
    Ahemdabad: ["Maninagar", "Navrangpura", "Satellite", "Bopal"],
  };


  // Initialize leadObj on prop change
  useEffect(() => {

    debugger;

    if (lead && Object.keys(lead).length > 0) {
      setLeadObj(lead);
      setIsUpdateMode(true);
      setSubmitBtnTxt("Update Lead");
      setFormHeader("Update Lead Form");
    } else {

      debugger;
      setLeadObj(getEmptyLeadObj());
      setLeadObj(prev => ({ ...prev, categoryData: null })); // reset category data
      setIsUpdateMode(false);
      setSubmitBtnTxt("Generate Lead");
      setFormHeader("Lead Generation Form");
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
    // if (!leadObj.followUpDate) {
    //   errs.followUpDate = "Follow Up Date is required";
    // } else {
    //   const today = new Date();
    //   const selectedDate = new Date(leadObj.followUpDate);
    //   today.setHours(0, 0, 0, 0);
    //   selectedDate.setHours(0, 0, 0, 0);

    //   if (selectedDate <= today) {
    //     errs.followUpDate = "Follow Up Date cannot be in the past";
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
    // }

  };

  const renderCategoryFields = () => {
    debugger;
    switch (selectedLeadName) {
      case 'Visa':
        return <LeadVisa visadObj={visadObj} countries={countries} setVisaLeadObj={setVisaObj} />;
      case 'Air Ticketing':
        return <LeadAirTicketing formData={formData} handleChange={handleChange} />;
      case 'Car Rentals':
        return (
          <>
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1">
                <label className="label-style">No of Travelers</label>
                <input
                  name="numTravelers"
                  type="number"
                  min="1"
                  onChange={handleChange}
                  className={`border-highlight`}
                />
              </div>
              <div className="flex-1 flex-col">
                <label className="label-style">Type of Vehicle</label>
                <select
                  name="vehicle"
                  value={formData.vehicleType}
                  className={`border-highlight`}
                >
                  <option value="">Select Vehicle</option>
                  <option value="maruti">Maruti</option>
                </select>
              </div>
              <div className="flex-1 flex-col">
                <label className="label-style">Type of Duty</label>
                <div>
                  <select
                    name="duty"
                    className={`border-highlight`}
                  >
                    <option value="">Select Duty Type</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Local">Local</option>
                    <option value="Outstation">Outstation</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              {/* Trip Description */}
              <div className="flex-1 min-w-[250px]">
                <label className="label-style">Trip Description</label>
                <input
                  name="tripDescription"
                  placeholder="Trip Description"
                  onChange={handleChange}
                  className="border-highlight"
                />
              </div>

              {/* Serving City */}
              <div className="flex-1 min-w-[250px]">
                <label className="label-style">Serving City</label>
                <select
                  name="servingCity"
                  onChange={handleChange}
                  className="border-highlight"
                >
                  {loading ? (
                    <option>Loading...</option>
                  ) : (
                    <>
                      <option value="">Select City</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              {/* Travel Date */}
              <div className="flex-1 min-w-[250px]">
                <label className="label-style">Travel Date</label>
                <input
                  type="date"
                  name="travelDate"
                  onChange={handleChange}
                  className="border-highlight"
                />
              </div>

              {/* No of Days */}
              <div className="flex-1 min-w-[250px]">
                <label className="label-style">No of Days</label>
                <input
                  type="number"
                  name="noOfDays"
                  min="1"
                  onChange={handleChange}
                  className="border-highlight"
                />
              </div>
            </div>

            <div>
              {/* Requirement Type Dropdown */}
              <div className="flex-1 min-w-[250px]">
                <label className="label-style">Requirement Type</label>
                <select
                  name="requirementType"
                  value={requirementType}
                  onChange={(e) => setRequirementType(e.target.value)}
                  className="border-highlight"
                >
                  <option value="">Select Requirement</option>
                  <option value="personal">Personal Requirement</option>
                  <option value="corporate">Corporate Requirement</option>
                </select>
              </div>

              {/* Show only if corporate selected */}
              {requirementType === "corporate" && (
                <div className="flex gap-3 flex-wrap">
                  {/* Company Name */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="label-style">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      onChange={handleChange}
                      placeholder="Enter Company Name"
                      className="border-highlight"
                    />
                  </div>

                  {/* Telephone No */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="label-style">Telephone No</label>
                    <input
                      type="tel"
                      name="telephone"
                      onChange={handleChange}
                      placeholder="Enter Telephone No"
                      className="border-highlight"
                    />
                  </div>
                </div>

              )}
            </div>

            {/* Rental Type */}
            <div className="flex-1 min-w-[250px]">
              <label className="label-style">Rental Type</label>
              <div className="flex-1 min-w-[250px]">
                <select
                  name="rentalType"
                  className="border-highlight"
                >
                  <option value="">Select Rental Type</option>
                  <option value="events">Events</option>
                  <option value="individual">Individual</option>
                  <option value="inbond">InBound</option>
                  <option value="group">Group</option>
                </select>
              </div>
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

            {/* Special Requirement */}
            <div>
              <label className="label-style">Special Requirement</label>
              <input
                type="text"
                placeholder="Special requirement "
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
    }catch(error){
      console.error("Validation Failed",error);
    }
    //   if (!leadObj.fName || !leadObj.emailId || !leadObj.mobileNo) {
    //   setShowPopup(true);
    //   return;
    // }
    // Example: check followUpDate + dynamic fields
    // if (!leadObj.followUpDate || Object.values(leadObj).some(val => val === "")) {
    //   setShowPopup(true); // show popup modal
    //   return; // stop submission
    // }

    // Remove empty errors (fields without error)
    Object.keys(errs).forEach((key) => {
      if (!errs[key]) delete errs[key];
    });
    setErrors(errs);

    // Final check: Only submit if no errors
    if (Object.keys(errs).length === 0) {
      console.log("Form Submitted:", leadObj);
    }

    if (Object.keys(errs).length === 0) {
      try {
        if (isUpdateMode) {
          await axios.put(`${updateLeadApi}/${leadObj.leadID}`, leadObj, { headers: { "Content-Type": "application/json" } });
          alert("Lead updated successfully!");
        } else {

          debugger;
          await axios.post(generateLEadAPI, leadObj, { headers: { "Content-Type": "application/json" } });
          alert("Lead saved successfully!");
        }
      } catch (error) {
        console.error("Error saving lead:", error);
        alert("Error while saving lead.");
      }
    } else {
      console.warn("validation errors:", errs);
    }

    debugger;
    switch (selectedLeadName) {

      case "Visa":
        setLeadObj(prev => ({ ...prev, categoryData: visadObj }));
        break;
      // case "Hotel":
      //   setLeadObj(prev => ({ ...prev, categoryData: hotelObj }));
      //   break;
      // case "Flight":
      //   setLeadObj(prev => ({ ...prev, categoryData: flightObj }));
      //   break;
      default:
        setLeadObj(prev => ({ ...prev, categoryData: null }));
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
            <input name='mobileNo' maxLength={10} onChange={handleChange} value={leadObj.mobileNo || ''}
              className={`border-highlight ${errors.mobileNo ? "border-red-500" : ""}`}
            />
            {errors.mobileNo && <p className="text-red-500 text-sm">{errors.mobileNo}</p>}
          </div>
          <div className='flex flex-col flex-1'>
            <label className='label-style'>Email</label>
            <input name='emailId' type='email' maxLength={50} onChange={handleChange} value={leadObj.emailId || ''} className={`border-highlight ${errors.emailId ? "border-red-500" : ""}`} />
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
          <select name="category" value={leadObj.fK_LeadCategoryID || ''} onChange={handleChangeForCategory} className='border-highlight'>
            <option value=''>Select Category</option>
            {Object.entries(leadCategoryList).map(([key, val]) => (
              <option key={key} value={Number(key)}>{val}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Render dynamic fields */}
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
      </div>


      {/* Footer */}
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
           onChange={handleChange} 
           className={`border-highlight`} 
          />
        </div>
      </div> */}
      {/* Popup / Modal */}
      {showPopup && (
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
      )}
    </div>

  );

}
