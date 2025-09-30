
// import PhoneField from './PhoneInput';
import cloneDeep from 'lodash/cloneDeep';
import { useEffect, useState } from 'react';
import LeadVisa from './LeadVisa';
import LeadAirTicketing from './LeadAirTicketing';
import axios from "axios";
import React from 'react';
import { getEmptyLeadObj, LeadObj } from "../src/Model/LeadModel";
import config from './config';
import { VISALeadObject } from './Model/VisaLeadModel';
import { getEmptyVisaObj } from "./Model/VisaLeadModel";
import { getEmptyAirTicketObj } from './Model/AirTicketLeadModel';
import { validMobileNoLive, validNameLive, validateBeforeSubmit, validEmailLive } from './validations';
import LeadCarRental from './LeadCarRental';

import { mapObject } from './Model/MappingObjectFunction';
import { useGetSessionUser } from "./SessionContext"
//import { ErrorMessages } from './Constants';
//import { LeadStatusOptions } from './Constants';
import * as Constants from './Constants';
import LeadsTableForExistingPhone from './LeadsTableForExistingPhone';



export default function LeadsGeneration({ lead }) {
  const [leadObj, setLeadObj] = useState(getEmptyLeadObj());
  const [visadObj, setVisaObj] = useState(getEmptyVisaObj());

  const [airTicketingdObj, setAirTicketingLeadObj] = useState({
    ...getEmptyAirTicketObj(),
    airTicketType: "Domestic"   // default selected
  });
  // const [airTicketingdObj, setAirTicketingLeadObj] = useState(getEmptyAirTicketObj(), );

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
  const [currentUser, setCurrentUser] = useState(null);
  const { user: sessionUser } = useGetSessionUser();
  const [isLeadsForPhoneVisible, setISLeadsForPhoneVisible] = useState(false);
  const [leadsForPhoneNumber, setLeadsForPhoneNumber] = useState([]);


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
  const checkDuplicateMobileAPI = config.apiUrl + "/TempLead/CheckDuplicateMobile/";


  // const prepareAirTicketPayload = (obj) => {
  //   if (obj.airTicketType?.toLowerCase() === "domestic") {
  //     // Strip international-only fields
  //     const { visaStatus, passportValidityDate, overseasInsurance, ...domesticObj } = obj;
  //     return domesticObj;
  //   }
  //   return obj; // International → keep everything
  // };


  //Indian city api 
  useEffect(() => {


    //**************************  Fecth Current User    *********************///////////////

    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser)); // if stored as object
      console.log("Loggend IN user in Lead generation..", loggedInUser);
    }

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
        console.error(Constants.ErrorMessages.ERROR_FETCHING_CITIES, err);
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
    debugger;
    newVisa.assigneeTo_UserID = incomingVisa.assigneeTo_UserID || currentUser?.user?.userId;
    newVisa.createdBy_UserID = incomingVisa.createdBy_UserID || currentUser?.user?.userId;
    newVisa.createdAt = incomingVisa.createdAt || new Date().toISOString();
    newVisa.updatedAt = incomingVisa.updatedAt || new Date().toISOString();
    newVisa.status = incomingVisa.status || 'Open';


    debugger;
    console.log("Mapped Visa Obj....:", newVisa);
    return newVisa;
  };


  const mapIncomingAirTicketToModel = (incomingAirTicketing) => {
    const newAirTicketing = { ...getEmptyAirTicketObj() }; // start with default model

    debugger;
    if (!incomingAirTicketing) return newAirTicketing;


    debugger
    // Map main properties
    newAirTicketing.id = incomingAirTicketing.id || null;
    newAirTicketing.airTicketType = incomingAirTicketing.airTicketType?.trim() || '';
    newAirTicketing.travelDate = incomingAirTicketing.travelDate || null;
    newAirTicketing.Sector = incomingAirTicketing.Sector?.trim() || '';
    newAirTicketing.noOfTravelers = incomingAirTicketing.noOfTravelers || null;
    newAirTicketing.travelClass = incomingAirTicketing?.travelClass || '';
    newAirTicketing.ticketType = incomingAirTicketing?.ticketType || '';
    newAirTicketing.airTicketStatus = incomingAirTicketing?.airTicketStatus || '';
    newAirTicketing.visaStatus = incomingAirTicketing?.visaStatus || '';
    newAirTicketing.passportValidity = incomingAirTicketing.passportValidity || null;
    newAirTicketing.quoteGiven = incomingAirTicketing.quoteGiven?.trim() || '';
    newAirTicketing.notes = incomingAirTicketing.notes || '';
    newAirTicketing.airTicketCode = incomingAirTicketing.airTicketCode || null;
    debugger;
    newAirTicketing.assigneeTo_UserID = incomingAirTicketing.assigneeTo_UserID || currentUser?.user?.userId;
    newAirTicketing.createdBy_UserID = incomingAirTicketing.createdBy_UserID || currentUser?.user?.userId;
    newAirTicketing.createdAt = incomingAirTicketing.createdAt || new Date().toISOString();
    newAirTicketing.updatedAt = incomingAirTicketing.updatedAt || new Date().toISOString();
    newAirTicketing.status = incomingAirTicketing.status || Constants.LeadStatusOptions.OPEN;


    debugger;
    console.log("Mapped Air Ticketing Obj....:", newAirTicketing) ;
    return newAirTicketing;
  };

  const mapIncomingLeadToModel = (incomingLead) => {
    //const newLead = { ...getEmptyLeadObj() }; // start with default model

    // debugger;
    // // Map main properties
    // newLead.leadID = incomingLead.leadID || null;
    // newLead.title = incomingLead.title?.trim() || '';
    // newLead.fName = incomingLead.fName || '';
    // newLead.mName = incomingLead.mName || '';
    // newLead.lName = incomingLead.lName || '';
    // newLead.mobileNo = incomingLead.mobileNo || '';
    // newLead.emailId = incomingLead.emailId || '';
    // newLead.gender = incomingLead.gender?.trim() || '';
    // newLead.birthDate = incomingLead.birthDate || '';
    // newLead.city = incomingLead.city || '';
    // newLead.area = incomingLead.area || '';
    // newLead.enquiryMode = incomingLead.enquiryMode || '';
    // newLead.enquirySource = incomingLead.enquirySource || '';
    // newLead.customerType = incomingLead.customerType || '';
    // newLead.fK_LeadCategoryID = incomingLead.fK_LeadCategoryID || null;
    // newLead.followUpDate = incomingLead.followUpDate || '';
    // newLead.histories = incomingLead.histories || [];
    // newLead.leadStatus = incomingLead.leadStatus || 'Open';
    // newLead.createdAt = incomingLead.createdAt || null;
    // newLead.updatedAt = incomingLead.updatedAt || null;
    // newLead.enquiryDate = incomingLead.enquiryDate || null;
    // newLead.assignee_UserID=incomingLead.assigneeTo_UserID;

    const newLead = mapObject(lead, getEmptyLeadObj())

    if (incomingLead.category) {
      switch (incomingLead.category.$type?.toLowerCase()) {
        case "visa": {
          const mappedVisa = mapObject(incomingLead.category, getEmptyVisaObj());
          newLead.category = mappedVisa;
          setVisaObj(mappedVisa);
          setSelectedLeadName(incomingLead.category.categoryName || "Visa");
          break;
        }

        case "air ticketing": {
          const mappedAirTicketing = mapObject(incomingLead.category, getEmptyAirTicketObj());
          newLead.category = mappedAirTicketing;
          setAirTicketingLeadObj(mappedAirTicketing);
          setSelectedLeadName(incomingLead.category.categoryName || "Air Ticketing");
          break;
        }

        // default: {
        //   // If category type is unknown → reset
        //   newLead.category = null;
        //   setSelectedLeadName("Unknown Category");
        // }
      }

    } else {
      // No category → decide default (Visa example here)
      // const visadObj = getEmptyVisaObj();
      // visadObj.createdBy_UserID = currentUser?.user?.userId;
      // visadObj.assigneeTo_UserID = currentUser?.user?.userId;
      // newLead.category = visadObj;
      // setVisaObj(visadObj);
      newLead.category = null;
      setVisaObj(getEmptyVisaObj());
      visadObj.createdBy_UserID = currentUser?.user?.userId;
      visadObj.assigneeTo_UserID = currentUser?.user?.userId;
      newLead.category = visadObj;
    }

    return newLead;




    // Map Visa category if exists  *********written by gayrti 
    // if (incomingLead.category && incomingLead.category.$type === "VISA") {
    //   const mappedVisa = mapObject(incomingLead.category, getEmptyVisaObj())  //mapIncomingVisaToModel(incomingLead.category);
    //   newLead.category = mappedVisa;   // assign directly
    //   setVisaObj(mappedVisa);          // update state
    //   setSelectedLeadName(incomingLead.category.categoryName || "Visa");
    // } else {
    //   newLead.category = null;
    //   setVisaObj(getEmptyVisaObj());
    //   visadObj.createdBy_UserID = currentUser?.user?.userId;
    //   visadObj.assigneeTo_UserID = currentUser?.user?.userId;
    //   newLead.category = visadObj;
    // }
    // return newLead;


  };

  const onMobileChangeFocus = async (value) => {
    debugger;
    setISLeadsForPhoneVisible(false);
    //CheckDuplicateMobile
    const str = validMobileNoLive(leadObj.mobileNo, "Mobile No");
    if (str)
      return; // if invalid mobile no then return
    else if (!sessionUser?.token) return; // if no token then return
    else if (!sessionUser?.user?.userId) return; // if no user id then return
    else if (!leadObj?.mobileNo) return; // if no mobile no then return
    else //if(leadObj?.mobileNo !== value) return; // if mobile no not match then return
    {
      const res = await axios.get(checkDuplicateMobileAPI, {
        headers: {
          Authorization: `Bearer ${sessionUser.token}`, // ✅ JWT token
          "Content-Type": "application/json"
        },
        params: {
          assigneeUserID: sessionUser.user.userId,
          mobile: leadObj.mobileNo
        }
      });

      console.log("Duplicate mobile check response:", res.data);

      if (res.data && res.data.length > 0) {
        alert("Duplicate mobile number found. Please check the existing leads.");
        setISLeadsForPhoneVisible(true);
        setLeadsForPhoneNumber(res.data);
      }
      else
        setISLeadsForPhoneVisible(false);

    }
  }


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


  const handleChangeForCategory = (e) => {
    debugger;
    console.log("In handle change for category changed...", e.target.value);
    const val = Number(e.target.value);
    setLeadObj(prev => ({ ...prev, fK_LeadCategoryID: val }));

    setSelectedLeadName(leadCategoryList[val] || "");
    debugger;

    switch (leadCategoryList[val]) {
      case 'Visa':
        debugger;
        setLeadObj(prev => ({ ...prev, category: getEmptyVisaObj() }));
        break;
      case 'Air Ticketing':
        setLeadObj(prev => ({ ...prev, category: getEmptyAirTicketObj() }));
        break;

      default:
        return null;
    }
  };


  React.useEffect(() => {

    debugger;


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
    console.log("In renderCategoryFields AirTicketingObj....:", airTicketingdObj);

    switch (selectedLeadName.toLowerCase()) {

      case 'visa':
        // return <LeadVisa visadObj={visadObj} countries={countries} setVisaLeadObj={setVisaObj}  histories={leadObj.histories} />;
        return (
          <>
            {(

              console.log("Histories to pass to HistoryHover:", leadObj.histories),
              <LeadVisa
                visadObj={visadObj}
                countries={countries}
                setVisaLeadObj={setVisaObj}
                histories={leadObj.histories || []}
                isUpdate={isUpdateMode} // fallback to empty array
              />

            )}
          </>
        );
      case 'air ticketing':
        // return<LeadAirTicketing airTicketingdObj={airTicketingdObj} setAirTicketingLeadObj={setAirTicketingLeadObj} histories={leadObj.histories}>
        // return <LeadAirTicketing formData={formData} handleChange={handleChange} />;
        return (
          <>
            {(
              console.log("History to pass to HistoryHover:", LeadObj.histories),

              <LeadAirTicketing
                airTicketingdObj={airTicketingdObj}
                setAirTicketingLeadObj={setAirTicketingLeadObj}
                histories={leadObj.histories || []}
                isUpdate={isUpdateMode} // fallback to empty array
              />
            )}
          </>

        );

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

    //    const returnDateError = validateBeforeSubmit(
    //   airTicketingdObj.returnDate,
    //   "Return Date",
    //   {
    //     airTicketType: airTicketingdObj.airTicketType,
    //     returnDate: airTicketingdObj.returnDate,
    //     onwardDate: airTicketingdObj.onwardDate,
    //   }
    // );


    const errs = validate();
    if (fNameError) errs.fName = fNameError;
    if (lNameError) errs.lName = lNameError;
    if (mobileNoError) errs.mobileNo = mobileNoError;
    if (emailIdError) errs.emailId = emailIdError;
    if (titleError) errs.title = titleError;
    if (genderError) errs.gender = genderError;
    if (followUpDateError) errs.followUpDate = followUpDateError;
    // if (returnDateError) errs.returnDate = returnDateError;



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


    //  **********This logic for update AirTicket type ************
    //   try {
    //   const payload = prepareAirTicketPayload(airTicketingdObj);

    //   const { data } = await axios.put(config.apiUrl + "/TempLead/UpdateLead", payload);

    //   console.log("Air ticket saved successfully:", data);

    // } catch (error) {
    //   console.error("Error saving air ticket:", error);
    //   setErrors({ save: "Failed to save air ticket" });
    // }


    try {
      // written by Priyanka
      if (isUpdateMode) {

        if (!leadObj.createdBy_UserID) {
          leadObj.createdBy_UserID = currentUser?.user?.userId;
        }

        if (!leadObj.assigneeTo_UserID) {
          leadObj.assigneeTo_UserID = currentUser?.user?.userId;
        }

        const deepLeadCopy = cloneDeep(leadObj);

        switch (selectedLeadName.toLowerCase()) {
          case "visa":
            debugger;
            if (!visadObj.createdBy_UserID) {
              visadObj.createdBy_UserID = currentUser?.user?.userId;
            }

            if (!visadObj.assigneeTo_UserID) {
              visadObj.assigneeTo_UserID = currentUser?.user?.userId;
            }
            debugger;
            const deepVisaCopy = cloneDeep(visadObj);
            deepLeadCopy.category = { ...deepVisaCopy }; //  attach visa data
            break;

          case "air ticketing":
            debugger;
            if (!airTicketingdObj.createdBy_UserID) {
              airTicketingdObj.createdBy_UserID = currentUser?.user?.userId;
            }

            if (!airTicketingdObj.assigneeTo_UserID) {
              airTicketingdObj.assigneeTo_UserID = currentUser?.user?.userId;
            }

            const deepAirTicketingCopy = cloneDeep(airTicketingdObj);
            deepLeadCopy.category = { ...deepAirTicketingCopy };;
            break;

          default:
            debugger;
            deepLeadCopy.category = { ...getEmptyLeadObj() };
            console.warn("Unknown lead type:", selectedLeadName);
            break;

        }

        debugger;
        console.log("Final Lead Obj to Update:", deepLeadCopy);
        console.log("upate api...", `${updateLeadApi}/${deepLeadCopy.leadID}`);

        debugger;
        const response = await axios.put(updateLeadApi, deepLeadCopy, { headers: { "Content-Type": "application/json" } });


        console.log("Updated lead:", response.data);


        alert("Lead updated successfully!");


        // *************** old update lead system before switch condition and its working fine for single lead type ************
        // if (isUpdateMode) {


        //   // old component for air ticket and visa its working proper for each visa or air ticketing 
        //   if (!visadObj.createdBy_UserID) {
        //     visadObj.createdBy_UserID = currentUser?.user?.userId;
        //   }

        //   if (!visadObj.assigneeTo_UserID) {
        //     visadObj.assigneeTo_UserID = currentUser?.user?.userId;
        //   }

        //   // For Air Ticketing 
        //   if (!airTicketingdObj.createdBy_UserID) {
        //     airTicketingdObj.createdBy_UserID = currentUser?.user?.userId;
        //   }

        //   if (!airTicketingdObj.assigneeTo_UserID) {
        //     airTicketingdObj.assigneeTo_UserID = currentUser?.user?.userId;
        //   }


        //   if (!leadObj.createdBy_UserID) {
        //     leadObj.createdBy_UserID = currentUser?.user?.userId;
        //   }

        //   if (!leadObj.assigneeTo_UserID) {
        //     leadObj.assigneeTo_UserID = currentUser?.user?.userId;
        //   }

        //   const deepLeadCopy = cloneDeep(leadObj);
        //   const deepVisaCopy = cloneDeep(visadObj);
        //   const deepAirTicketingCopy = cloneDeep(airTicketingdObj);



        //   deepLeadCopy.category = { ...deepVisaCopy }; //  attach visa data
        //   deepLeadCopy.category = { ...deepAirTicketingCopy }; //  attach Air Ticketing  data
        //   debugger;

        //   console.log("Final Lead Obj to Update:", deepLeadCopy);
        //   console.log("upate api...", `${updateLeadApi}/${deepLeadCopy.leadID}`);

        //   debugger;
        //   const response = await axios.put(updateLeadApi, deepLeadCopy, { headers: { "Content-Type": "application/json" } });


        //   console.log("Updated lead:", response.data);


        //   alert("Lead updated successfully!");
        // ******************************************************************************************************


      } else {

        debugger;




        leadObj.createdBy_UserID ||= currentUser?.user?.userId;
        leadObj.assigneeTo_UserID ||= currentUser?.user?.userId;

        // deep copies
        const deepCopy = cloneDeep(leadObj);



        // switch for category
        switch (selectedLeadName.toLowerCase()) {
          case "visa":
            // assign user IDs
            visadObj.createdBy_UserID ||= currentUser?.user?.userId;
            visadObj.assigneeTo_UserID ||= currentUser?.user?.userId;
            const deepVisaCopy = cloneDeep(visadObj);
            deepCopy.category = { ...deepVisaCopy };
            break;

          case "air ticketing": // lowercase because of .toLowerCase()
            airTicketingdObj.createdBy_UserID ||= currentUser?.user?.userId;
            airTicketingdObj.assigneeTo_UserID ||= currentUser?.user?.userId;
            const deepAirTicketingCopy = cloneDeep(airTicketingdObj);
            deepCopy.category = { ...deepAirTicketingCopy };
            break;

          default:
            debugger;
            deepCopy.category = { ...getEmptyLeadObj() };
            console.warn("Unknown lead type:", selectedLeadName);
            break;
        }

        debugger;
        console.log("New Lead Obj...", deepCopy);
        console.log("Payload being sent:", JSON.stringify(deepCopy, null, 2));

        debugger;
        await axios.post(generateLEadAPI, deepCopy, {
          headers: { "Content-Type": "application/json" }
        });

        alert("Lead saved successfully!");


        // debugger;
        // if (!visadObj.createdBy_UserID) {
        //   visadObj.createdBy_UserID = currentUser?.user?.userId;
        // }

        // if (!visadObj.assigneeTo_UserID) {
        //   visadObj.assigneeTo_UserID = currentUser?.user?.userId;
        // }

        // if (!airTicketingdObj.createdBy_UserID) {
        //   airTicketingdObj.createdBy_UserID = currentUser?.user?.userId;
        // }

        // if (!airTicketingdObj.assigneeTo_UserID) {
        //   airTicketingdObj.assigneeTo_UserID = currentUser?.user?.userId;
        // }


        // if (!leadObj.createdBy_UserID) {
        //   leadObj.createdBy_UserID = currentUser?.user?.userId;
        // }

        // if (!leadObj.assigneeTo_UserID) {
        //   leadObj.assigneeTo_UserID = currentUser?.user?.userId;
        // }

        // const deepCopy = cloneDeep(leadObj);
        // const deepVisaCopy = cloneDeep(visadObj);
        // deepCopy.category = { ...deepVisaCopy }; // attach visa data
        // debugger;
        // const deepAirTicketingCopy = cloneDeep(airTicketingdObj);
        // deepCopy.category = { ...deepAirTicketingCopy }; // attach air ticketing data


        // console.log("New Lead Obj...", deepCopy);
        // console.log("Payload being sent:", JSON.stringify(deepCopy, null, 2));
        // await axios.post(generateLEadAPI, deepCopy, { headers: { "Content-Type": "application/json" } });
        // alert("Lead saved successfully!");
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
        {/* <div className="flex items-center justify-between mb-4 border-b pb-2"> */}
        <h3 className='text-lg font-semibold text-gray-800 mb-4 border-b pb-2'>Customer Details</h3>
         {/* <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Status:</label>
          <select
            name="leadStatus"
            value={leadObj.leadStatus}
            onChange={handleChange}
            // onChange={(e) => setLeadStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="open">Open</option>
            <option value="lost">Lost</option>
            <option value="confirmed">Confirmed</option>
            <option value="postponed">Postponed</option>
          </select>
        </div>
        </div> */}
        <div className='flex gap-4 mb-4'>
          <div className='flex flex-col flex-1'>
            <label className='label-style'>Mobile Number</label>
            <input name='mobileNo' placeholder='Mobile Number' onBlur={onMobileChangeFocus} onChange={handleChange} value={leadObj.mobileNo || ''} maxLength={10}
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
      {/* Render Table for exisitng leads with the matching phone no. */}
      {isLeadsForPhoneVisible &&(
      <div>
        <div>
        <LeadsTableForExistingPhone
          followLeads={leadsForPhoneNumber}
        ></LeadsTableForExistingPhone>
        </div>
        <div className='text-center my-4'>
          <button
            onClick={() => setISLeadsForPhoneVisible(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Continue with New Lead
          </button>
        </div>
      </div>
      )}
      {/* Lead Details */}
      {!isLeadsForPhoneVisible &&(
      <div>
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
            <option value="General">General</option>
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

        {errors.FollowUpDate && (<p className="text-red-500 text-sm mt-1 justify-right">{errors.FollowUpDate}</p>)}

      </div>

      {/* Footer */}

      {/* Popup / Modal */}
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
      )}
    </div>

  );
}
