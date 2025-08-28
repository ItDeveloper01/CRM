import PhoneField from './PhoneInput';
import { useEffect, useState } from 'react';
import LeadVisa from './LeadVisa';
import LeadAirTicketing from './LeadAirTicketing';
import axios from "axios";
import React from 'react';
import { getEmptyLeadObj } from "../src/Model/LeadModel"; 
import config from './config';

export default function LeadsGeneration({ lead }) {
  const [leadObj, setLeadObj] = useState(getEmptyLeadObj());
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

  const enquirySources = [
    'Referred by client','Repeat Guest','Paper Advt','Paper Advt-Sakal','Paper Advt-Maharashtra Times',
    'Paper Advt-Loksatta','Paper Advt-Lokmat','Paper Advt-TOI','Paper Advt-Others','Corporate',
    'Other','Website','Social Media'
  ];
  const enquiryModes = ['WalkIn', 'Telephonic', 'Email', 'Social Media'];

  const APIURL = config.apiUrl + '/Leads/';
  const LeadCategoryAPI = APIURL + "GetLeadCategoryList";
  const generateLEadAPI = APIURL + "GenerateLead";
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
      setLeadObj(getEmptyLeadObj());
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

  const handleChangeForCategory = (e) => {
    const val = Number(e.target.value);
    setLeadObj(prev => ({ ...prev, fK_LeadCategoryID: val }));
    setSelectedLeadName(leadCategoryList[val] || "");
  };

  const handleChange = (e) => {

debugger;

    const { name, value } = e.target;
    setLeadObj(prev => ({ ...prev, [name]: value }));
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderCategoryFields = () => {
    switch (selectedLeadName) {
      case 'Visa':
        return <LeadVisa formData={formData} countries={countries} handleChange={handleChange} />;
      case 'Air Ticketing':
        return <LeadAirTicketing formData={formData} handleChange={handleChange} />;
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {

debugger;

    e.preventDefault();
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
            <input name='mobileNo' onChange={handleChange} value={leadObj.mobileNo || ''} className='border-highlight' />
          </div>
          <div className='flex flex-col flex-1'>
            <label className='label-style'>Email</label>
            <input name='emailId' type='email' onChange={handleChange} value={leadObj.emailId || ''} className='border-highlight' />
          </div>
        </div>
        <div className='flex gap-4 mb-4'>
          <div className='flex flex-col w-28'>
            <label className='label-style'>Title</label>
            <select name='title' value={leadObj.title?.trim() || ""} onChange={handleChange} className='border-highlight'>
              <option value=''>Title</option>
              <option value='Mr.'>Mr.</option>
              <option value='Mrs.'>Mrs.</option>
              <option value='Ms.'>Ms.</option>
              <option value='Dr.'>Dr.</option>
              <option value='Prof.'>Prof.</option>
            </select>
          </div>
          <div className='flex flex-col flex-1'>
            <label className='label-style'>First Name</label>
            <input name='fName' placeholder='First Name' value={leadObj.fName || ''} onChange={handleChange} className='border-highlight' />
          </div>
          <div className='flex flex-col flex-1'>
            <label className='label-style'>Middle Name</label>
            <input name='mName' placeholder='Middle Name' value={leadObj.mName || ''} onChange={handleChange} className='border-highlight' />
          </div>
          <div className='flex flex-col flex-1'>
            <label className='label-style'>Last Name</label>
            <input name='lName' placeholder='Last Name' value={leadObj.lName || ''} onChange={handleChange} className='border-highlight' />
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
              className={`border-highlight`}
              name='gender'
              onChange={handleChange}
            >
              <option value=''>Select Gender</option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>

            </select>
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
          <select  name="enquiryMode" value={leadObj.enquiryMode?.trim()||""} onChange={handleChange} className='border-highlight'>
            <option value="">Select Mode</option>
            {enquiryModes.map(boy => <option key={boy} value={boy}>
                
                {boy}


            </option>)}
          </select>
        </div>
        <div className='flex flex-col flex-1'>
          <label className='label-style'>Enquiry Source</label>
          <select name="enquirySource" value={leadObj.enquirySource?.trim()||""} onChange={handleChange} className='border-highlight'>
            <option value= "">Select Source</option>
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

      {/* Footer */}
      <div className="flex justify-between items-center mt-6 gap-4">
        <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
          {submitBtnTxt}
        </button>
        <div className="flex items-center gap-2">
          <label htmlFor="followupDate" className="font-medium text-gray-600 whitespace-nowrap">Follow Up Date :</label>
          <input type="date" id="followupDate" name="followUpDate" value={leadObj.followUpDate || ''} onChange={handleChange} className={`border-highlight`} />
        </div>
      </div>
    </div>
  );
}
