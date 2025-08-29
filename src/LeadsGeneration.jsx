// import AirTicketingScreen from './AirTicketing';
import PhoneField from './PhoneInput';
import { useEffect, useState } from 'react';
import LeadVisa from './LeadVisa';

import axios from "axios";
import React from 'react';
import { LeadObj } from "../src/Model/LeadModel";
import { getEmptyLeadObj } from "../src/Model/LeadModel"; // adjust path if folder is deeper
import config from './config';

import LeadAirTicketing from './LeadAirTicketing';
import { Form } from 'react-router-dom';
import { validMobileNoLive, validNameLive, validateBeforeSubmit, validEmailLive } from './validations';



export default function LeadsGeneration({ lead }) {
  // initialize form state with empty LeadObj

  const [leadObj, setLeadObj] = useState({ lead });


  const [category, setCategory] = useState('');
  const [selectedLeadName, setSelectedLeadName] = useState("");
  const [enquirySource, setEnquirySource] = useState('');
  const [enquiryMode, setEnquiryMode] = useState('');
  const [holidayType, setHolidayType] = useState('');
  const [holidayCategory, setHolidayCategory] = useState('');
  const [formData, setFormData] = useState({ selectedCategory: "" });
  //Requirment for car rental
  const [requirementType, setRequirementType] = useState("");




  const [countries, setCountries] = useState([]);
  const [countrycode, setCountryCode] = useState([]);

  //for Indian City Dropdown through API
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);


  // const [tripType, setTripType] = useState("domestic");
  const APIURL = config.apiUrl + '/Leads/';
  const LeadCategoryAPI = APIURL + "GetLeadCategoryList";


  const [errors, setErrors] = useState({});
  const [leadcategory, setleadcategory] = useState({});


  useEffect(() => {
    if (lead && Object.keys(lead).length > 0) {
      console.log("Editing lead......:", lead);
      setLeadObj(lead);
    } else {
      console.log("Creating new lead......:");
      setLeadObj(getEmptyLeadObj());
    }
  }, [lead]);

  const enquirySources = [
    'Referred by client',
    'Repeat Guest',
    'Paper Advt',
    'Paper Advt-Sakal',
    'Paper Advt-Maharashtra Times',
    'Paper Advt-Loksatta',
    'Paper Advt-Lokmat',
    'Paper Advt-TOI',
    'Paper Advt-Others',
    'Corporate',
    'Other',
    'Website',
    'Social Media',
  ];
  const enquiryModes = ['WalkIn', 'Telephonic', 'Email', 'Social Media'];
  /* ---------- Fetch Data from API ---------- */
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(LeadCategoryAPI);

        debugger;

        // Set tile counts directly from API
        //  setTileCounts({ TotalCount: res.data.totalLeads || 0,  LostCount: res.data.lostLeads || 0, ConfirmedCount: res.data.confirmedLeads || 0, OpenCount:res.data.openleads||0,
        //   PostponedCount:res.data.postponedLeads||0    });

        // Set categories if provided
        if (res.data)
          setleadcategory(res.data);

        debugger;
        console.log("Lead Category...:", res.data);

      } catch (err) {
        console.error("Error fetching Leads Category:", err);
      }
    }

    fetchData();
  }, []);

  //FEtch Country Code
  useEffect(() => {

    console.log("Country COde Loaded...");
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => {
        console.log("Country Code : ", data);
        setCountryCode(data.data || []);
      })
      .catch((err) => console.error("Error fetching country code:", err));
  }, []);
  // Fetch countries
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/positions")
      .then((res) => res.json())
      .then((data) => {
        console.log("Countries Data : ", data);
        setCountries(data.data || []);
      })
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

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

  // City → Area mapping
  const cityAreas = {
    Pune: ["Kothrud", "Karvenagar", "Nigdi", "Bhosari", "Deccan"],
    Mumbai: ["Andheri", "Borivali", "Dadar", "Bandra", "Kurla"],
    Aurangabad: ["Cidco", "Nirala Bazar", "Garkheda", "Waluj"],
    Kolhapur: ["Shahupuri", "Laxmipuri", "Rajaram Puri"],
    Ahemdabad: ["Maninagar", "Navrangpura", "Satellite", "Bopal"],
  };


  const handleChangeForCategory = (e) => {


    console.log("Category Changed...", formData);

    debugger;
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));


    if (name === "category") {
      const var1 = leadcategory[value];
      setSelectedLeadName(var1);
      setCategory(value); //  store the key here
    }
  };



  const handleChange = (e) => {

    // This handlechange for LeadObj
    const { name, value } = e.target;
    setLeadObj((prev) => ({
      ...prev,
      [name]: value
    }));
    // This handlechange for formData
    debugger;
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log("Category Changed...", formData);

    // Live validation only first,middle,last name , mobileno andd email 
    let errMsg = "";   //common for all 
    if (name === "fName") errMsg = validNameLive(value, "First Name");
    if (name === "mName") errMsg = validNameLive(value, "Middle Name");
    if (name === "lName") errMsg = validNameLive(value, "Last Name");
    if (name === "mobileNo") errMsg = validMobileNoLive(value, "Mobile No");
    if (name === "email") errMsg = validEmailLive(value, "Email No");


    setErrors((prev) => ({ ...prev, [name]: errMsg })); // common for all 

    // Live validation for Follow Up Date
    // if (name === "followupDate") {
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
    // //   setErrors((prev) => ({ ...prev, followupDate: errMsg }));
    // }

  };


  const validate = () => {

    let errs = {};

    // Follow Up Date
    // if (!leadObj.followupDate) {
    //   errs.followupDate = "Follow Up Date is required";
      // } else {
      //   const today = new Date();
      //   const selectedDate = new Date(leadObj.followupDate);
      //   today.setHours(0, 0, 0, 0);
      //   selectedDate.setHours(0, 0, 0, 0);

      //   if (selectedDate <= today) {
      //     errs.followupDate = "Follow Up Date cannot be in the past";
      //   }
    // }

    return errs;
  }

  const renderCategoryFields = () => {
    if (selectedLeadName === 'Holiday') {
      if (holidayType === 'GIT') {
        return (
          <>
            <label className='font-medium text-gray-700 mb-1 block'>Destination</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='destination'
              placeholder='Destination'
              onChange={handleChange}
            />

            <label className='font-medium text-gray-700 mb-1 block'>Travel Dates</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='travelDates'
              type='date'
              onChange={handleChange}
            />
          </>
        );
      } else if (holidayType === 'FIT') {
        return (
          <>
            <label className='font-medium text-gray-700 mb-1 block'>Destinations</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='destinations'
              placeholder='Destinations'
              onChange={handleChange}
            />

            <label className='font-medium text-gray-700 mb-1 block'>Budget</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='budget'
              placeholder='Budget'
              onChange={handleChange}
            />

            <label className='font-medium text-gray-700 mb-1 block'>Preferences</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='preferences'
              placeholder='Preferences'
              onChange={handleChange}
            />
          </>
        );
      }
    }

    switch (selectedLeadName) {
      case 'Holiday':
        return (
          <>
            <div className='flex gap-4'>
              {/* Travel Date */}
              <div className='flex flex-col flex-1'>
                <label className='font-medium text-gray-700 mb-1'>Travel Date</label>
                <input
                  className={`border-highlight`}
                  name='travelDate'
                  type='date'
                  placeholder='Travel Date'
                  onChange={handleChange}
                />
              </div>

              {/* Destination */}
              <div className='flex flex-col flex-1'>
                <label className='font-medium text-gray-700 mb-1'>Destination</label>
                <input
                  className={`border-highlight`}
                  name='destinations'
                  placeholder='Destinations'
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='flex gap-4 mt-4'>
              {/* No of Adults */}
              <div className='flex flex-col flex-1'>
                <label className='font-medium text-gray-700 mb-1'>No of Adults</label>
                <input
                  type='number'
                  className={`border-highlight`}
                  name='noOfAdults'
                  placeholder='Adults'
                  onChange={handleChange}
                />
              </div>

              {/* No of Children */}
              <div className='flex flex-col flex-1'>
                <label className='font-medium text-gray-700 mb-1'>No of Children</label>
                <input
                  type='number'
                  className={`border-highlight`}
                  name='noOfChildren'
                  placeholder='Children'
                  onChange={handleChange}
                />
              </div>

              {/* No of Infants */}
              <div className='flex flex-col flex-1'>
                <label className='font-medium text-gray-700 mb-1'>No of Infants</label>
                <input
                  type='number'
                  className={`border-highlight`}
                  name='noOfInfants'
                  placeholder='Infants'
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='flex gap-4 mt-4'>
              <label className='font-medium text-gray-700 mb-1 block'>Notes</label>
              <input
                className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
                name='notes'
                placeholder='Notes'
                onChange={handleChange}
              />
            </div>
          </>
        );
      case 'Visa':
        return (

          <LeadVisa formData={formData}
            countries={countries}
            handleChange={handleChange}
          />


        );
      case 'MICE':
        return (
          <>
            {/* <label className='font-medium text-gray-700 mb-1 block'>Destination</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='destination'
              placeholder='Destination'
              onChange={handleChange}
            /> */}

            <label className='font-medium text-gray-700 mb-1 block'>No. of Participants</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='participants'
              type='number'
              placeholder='No. of Participants'
              onChange={handleChange}
            />

            <label className='font-medium text-gray-700 mb-1 block'>Event Type</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='eventType'
              placeholder='Event Type'
              onChange={handleChange}
            />

            <label className='font-medium text-gray-700 mb-1 block'>Event Date</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='eventDate'
              type='date'
              onChange={handleChange}
            />
          </>
        );
      case 'Air Ticketing':
        return (
          <>
            <LeadAirTicketing formData={formData}
              handleChange={handleChange}
            />
          </>
        );
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

  const handleSubmit = (e) => {
    console.log('Lead Data:', { category, holidayType, ...formData });

    e.preventDefault();

    const fNameError = validateBeforeSubmit(leadObj.fName, "First Name");
    const lNameError = validateBeforeSubmit(leadObj.lName, "Last Name");
    const mobileNoError = validateBeforeSubmit(leadObj.mobileNo, "Mobile Number");
    const emailError = validateBeforeSubmit(leadObj.email, "Email Address");
    const titleError = validateBeforeSubmit(leadObj.title, "Title");
    const genderError = validateBeforeSubmit(leadObj.gender, "Gender");
    const followupDateError = validateBeforeSubmit(leadObj.followupDate, "Follow up Date");


    const errs = validate();
    if (fNameError) errs.fName = fNameError;
    if (lNameError) errs.lName = lNameError;
    if (mobileNoError) errs.mobileNo = mobileNoError;
    if (emailError) errs.email = emailError;
    if (titleError) errs.title = titleError;
    if (genderError) errs.gender = genderError;
    if (followupDateError) errs.followupDate = followupDateError;

    // Remove empty errors (fields without error)
    Object.keys(errs).forEach((key) => {
      if (!errs[key]) delete errs[key];
    });
    setErrors(errs);

    // Final check: Only submit if no errors
    if (Object.keys(errs).length === 0) {
      console.log("Form Submitted:", leadObj);
    }

  };

  return (
    <div className='max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl'>
      <h2 className='text-2xl font-bold mb-6 text-center text-blue-600'>Lead Generation Form</h2>
      {/* Customer Details Section */}
      <div className='border border-gray-300 bg-gray-50 rounded-lg p-4 mb-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4 border-b pb-2'>Customer Details</h3>

        <div className='flex gap-4 mb-4'>
          {/* Mobile Number */}
          <div className="flex flex-col flex-1">
            <label className="label-style">Mobile Number</label>
            <input
              className={`border-highlight ${errors.mobileNo ? "border-red-500" : ""}`}
              name="mobileNo"
              placeholder="Mobile Number"
              value={leadObj.mobileNo || ""}
              onChange={handleChange}
              maxLength={10}
            />
            {errors.mobileNo && <p className="text-red-500 text-sm">{errors.mobileNo}</p>}
          </div>


          {/* Email */}
          <div className='flex flex-col flex-1'>
            <label className='label-style'>Email</label>
            <input
              className={`border-highlight ${errors.email ? "border-red-500" : ""}`}
              name='email'
              type='email'
              placeholder='Email Address'
              onChange={handleChange}
              value={leadObj.email || ""}
              maxLength={50}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
        </div>

        {/* Title + Name Fields in One Row */}
        <div className='flex gap-4 mb-4'>
          {/* Title */}
          <div className='flex flex-col w-28'>
            <label className='label-style'>Title</label>
            <select
              className={`border-highlight ${errors.title ? "border-red-500" : ""}`}
              name='title'
              value={leadObj.title || ""}
              onChange={handleChange}>
              <option value=''>Title</option>
              <option value='Mr.'>Mr.</option>
              <option value='Mrs.'>Mrs.</option>
              <option value='Ms.'>Ms.</option>
              <option value='Dr.'>Dr.</option>
              <option value='Prof.'>Prof.</option>
            </select>
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>


          {/* First Name */}
          <div className='flex flex-col flex-1'>
            <label className='label-style'>First Name</label>
            {/*for here label style = font-abmedium text-gray-700 mb-1 */}
            <input
              name='fName'
              placeholder='First Name'
              onChange={handleChange}
              value={leadObj.fName || ""}
              maxLength={30}
              className={`border-highlight ${errors.fName ? 'border-red-500' : ''}`}
            />
            {errors.fName && <p className="text-red-500 text-sm">{errors.fName}</p>}
          </div>

          {/* Middle Name */}
          <div className='flex flex-col flex-1'>
            <label className='label-style'>Middle Name</label>
            <input
              // className={`border-highlight`}
              name='mName'
              placeholder='Middle Name'
              onChange={handleChange}
              value={leadObj.mName}
              maxLength={30}
              className={`border-highlight ${errors.mName ? 'border-red-500' : ''}`}
            />
            {errors.mName && <p className="text-red-500 text-sm">{errors.mName}</p>}
          </div>

          {/* Last Name */}
          <div className='flex flex-col flex-1'>
            <label className='label-style'>Last Name</label>
            <input
              name='lName'
              placeholder='Last Name'
              onChange={handleChange}
              value={leadObj.lName || ""}
              maxLength={30}
              className={`border-highlight ${errors.lName ? 'border-red-500' : ''}`}
            />
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
              name='birthdate'
              onChange={handleChange}
              value={leadObj.birthdate}
            />
          </div>

          {/* Gender */}
          <div className='flex flex-col flex-1'>
            <label className='label-style'>Gender</label>
            <select
              // className={`border-highlight`}
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
              value={formData.city}
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
              value={formData.area}
              onChange={handleChange}
              disabled={!formData.city} // disable until city selected
            >
              <option value="">Select Area</option>
              {formData.city &&
                cityAreas[formData.city].map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
            </select>
          </div>

          {/* City */}
          {/* <div className='flex flex-col flex-1'>
            <label className='label-style'>City</label>
            <select
             className={`border-highlight`}
              name='city'
              onChange={handleChange}>
              <option value=''>Select City</option>
              <option value='Pune'>Pune</option>
              <option value='Mumbai'>Mumbai</option>
              <option value='Aurangabad'>Aurangabad</option>
              <option value='Kolhapur'>Kolhapur</option>
              <option value='Ahmdabad'>Ahemdabad</option>
            </select>
          </div> */}

          {/* Area */}
          {/* <div className='flex flex-col flex-1'>
            <label className='font-medium text-gray-700 mb-1'>Area</label>
            <select
             className={`border-highlight`}
              name='area'
              onChange={handleChange}>
              <option value=''>Select Area</option>
             
            </select>
          </div> */}
        </div>
      </div>

      <h3 className='text-lg font-semibold text-gray-800 mb-4 border-b pb-2'>Leads Details</h3>
      <div className="flex gap-4">
        {/* Enquiry Mode */}
        <div className="flex-1">
          <label className='label-style'>Enquiry mode</label>
          <select
            className={`border-highlight`}
            value={enquiryMode}
            onChange={(e) => {
              setEnquiryMode(e.target.value);
              setHolidayType('');
            }}>
            <option value=''>Select Mode</option>
            {enquiryModes.map((cat) => (
              <option
                key={cat}
                value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Enquiry Source */}
        <div className="flex-1">
          <label className='label-style'>Enquiry Source</label>
          <select
            className={`border-highlight`}
            value={enquirySource}
            onChange={(e) => {
              setEnquirySource(e.target.value);
              setHolidayType('');
            }}>
            <option value=''>Select Source</option>
            {enquirySources.map((cat) => (
              <option
                key={cat}
                value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Customer Type */}
        <div className="flex-1">
          <label className="font-medium text-gray-600 mb-1 block">Customer Type</label>
          <select
            className={`border-highlight`}
            // className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="purpose"
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

      <div className='flex gap-4'>
        {/* Category */}
        <div className='flex flex-col flex-1'>
          {/* <select
            className={`border-highlight`}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setHolidayType('');
            }}>
           
            <option value=''>Select Category</option>
            {categories.map((cat) => (
              <option
                key={cat}
                value={cat}>
                {cat}
              </option>
            ))}
          </select> */}

          <div>
            <label className="label-style">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChangeForCategory}
              className={`border-highlight`}
            >
              <option value="">Select Category</option>
              {/* Loop over dictionary entries */}
              {Object.entries(leadcategory).map(([key, val]) => (
                <option key={key} value={key}>
                  {val}
                </option>
              ))}
            </select>

            {/* <p className="mt-2 text-sm text-gray-600">
              Selected Key: {formData.category || "None"}
              <br />
              Selected Value:{" "}
              {formData.category ? leadcategory[formData.category] : "None"}
            </p> */}
          </div>

        </div>

        {/* Enquiry Mode */}
        {/* <div className='flex flex-col flex-1'>
          <label className='font-medium text-gray-700 mb-1'>Enquiry mode</label>
          <select
           className={`border-highlight`}
            value={enquiryMode}
            onChange={(e) => {
              setEnquiryMode(e.target.value);
              setHolidayType('');
            }}>
            <option value=''>Select Mode</option>
            {enquiryModes.map((cat) => (
              <option
                key={cat}
                value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div> */}

        {/* Enquiry Source */}
        {/* <div className='flex flex-col flex-1'>
          <label className='font-medium text-gray-700 mb-1'>Enquiry Source</label>
          <select
           className={`border-highlight`}
            value={enquirySource}
            onChange={(e) => {
              setEnquirySource(e.target.value);
              setHolidayType('');
            }}>
            <option value=''>Select Source</option>
            {enquirySources.map((cat) => (
              <option
                key={cat}
                value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div> */}
      </div>

      {/* Conditional fields */}
      {selectedLeadName === 'Holiday' && (
        <>
          <label className='font-medium text-gray-700 mb-1'>Holiday Type</label>
          <select
            className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
            value={holidayType}
            onChange={(e) => setHolidayType(e.target.value)}>
            <option value=''>Select Holiday Type</option>

            <option value='INT-FIT'>International FIT</option>
            <option value='DOM-FIT'>Domestic FIT</option>
            <option value='INT-GIT'>International GIT</option>
            <option value='DOM-GIT'>Domestic GIT</option>
          </select>

          <label className='font-medium text-gray-700 mb-1'>Holiday Category</label>
          <select
            className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
            value={holidayCategory}
            onChange={(e) => setHolidayCategory(e.target.value)}>
            <option value=''>Select Holiday Category</option>
            <option value='INT'>International</option>
            <option value='DOM'>Domestic</option>
          </select>
        </>
      )}

      {/* {selectedLeadName === 'Car Rentals' && (
        <>
          <label className='font-medium text-gray-700 mb-1'>Vehicle Category</label>
          <select
            className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
            value={holidayType}
            onChange={(e) => setHolidayType(e.target.value)}>
            <option value=''>Select Vehicle Category</option>
            <option value='Car'>Car</option>
            <option value='Coaches'>Coaches</option>
          </select>

          <label className='font-medium text-gray-700 mb-1'>Vehicle Model</label>
          <select
            className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
            value={holidayCategory}
            onChange={(e) => setHolidayCategory(e.target.value)}>
            <option value=''>Select Vehicle Model</option>
            <option value='INT'>Volvo 45 Seater</option>
            <option value='DOM'>Domestic</option>
          </select>
        </>
      )} */}

      {renderCategoryFields()}


      <div className="flex justify-between items-center mt-6 gap-4">
        {/* Generate Lead Button */}
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Generate Lead
        </button>

        {/* Follow Up Date Inline */}
        <div className="flex items-center gap-2">
          <label htmlFor="followupDate" className="font-medium text-gray-600 whitespace-nowrap">
            Follow Up Date :
          </label>
          <div className="flex flex-col  justify-start leading-none">
            <input
              type="date"
              id="followupDate"
              name="followupDate"
              value={leadObj.followupDate || ""}
              onChange={handleChange}
              min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} //  only tomorrow onward date is allowed 
              // min={new Date().toISOString().split("T")[0]} //  disables past dates
              className={`border-highlight ${errors.followupDate ? "border-red-500" : " "}`}
              required
            />
          </div>
        </div>
      </div>
      <div className='text-right'>
        {errors.followupDate && (<p className="text-red-500 text-sm mt-1 justify-right">{errors.followupDate}</p>)}
      </div>


      {/* <label
            htmlFor="followupDate"
            className="font-medium text-gray-600 mb-1"
          >
            Follow Up Date :
          </label>
          <input
            type="date"
            id="followupDate"
            name="followupDate"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div> */}

      {/* Generate Lead Button  */}
      {/* <button
        onClick={handleSubmit}
        className='justify-between items-center mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition'>
        Generate Lead
      </button> */}
    </div>
  );
}
