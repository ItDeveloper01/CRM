// leadObj.js

// React Lead Object Model (default state)
export const LeadObj = {
  leadID: 0,
  title: "",            // Mr./Mrs./Ms./Dr.
  fName: "",
  mName: "",
  lName: "",
  mobileNo: "",
  emailId: "",
  pax: 1,
  gender: "",           // Male/Female
  leadStatus: "Open",
  city: "",
  area: "",
  enquiryMode: "",
  enquirySource: "",
  customerType: "",    // New/Existing
  destination: "",
  notes: "",
  birthDate: "",         // yyyy-MM-dd (string for HTML input type="date")
         // default today
  followUpDate: null,    // yyyy-MM-dd or empty
  createdAt: null,
  updatedAt: null,
  fK_LeadCategoryID :null
};

// VISA Lead Object
export const VISALeadObj = {
  Id: null,               // lowercase to keep consistent with LeadObj
  country1: "",
  country2: "",
  country3: "",
  visaType: "",
  travelDate: "",         // format: "YYYY-MM-DD"
  noOfApplicants: 0,
  purposeOfTravel: "",
  noOfEntries: "",
  travelPlanStatus: "",
  hotelBooking: "",
  overseasInsurance: "",
  passportValidity: "",
  airTicketIssuedBy: "",
  quoteGiven: "",
  notes: "",
  AssigneeTo_UserID: "",      // e.g. user ID or name
  CreatedBy_UserID: "",      // e.g. user ID or name who created the lead
  createdAt: "",      // e.g. timestamp "2025-08-25T14:48:00.000Z"
  updatedAt: ""       // e.g. timestamp "2025-08-26T10:15:00.000Z"

};


// Function to validate a lead object
export function validateLead(lead) {

  const requiredFields = [
    "fName",
    "lName",
    "mobileNo",
    "emailId",
    "pax",
    "enquiryDate",
    "leadStatus",
    "enquiryMode",
    "enquirySource",
    "destination"
  ];

  for (let field of requiredFields) {
    if (!lead[field] || lead[field].toString().trim() === "") {
      return false; // Field is missing or empty
    }
  }

  // Additional validation can be added here (e.g., email format, date format, etc.)

  return true; // All required fields are present and non-empty
}


// Function to return a fresh empty lead object
export function getEmptyLeadObj() {
  // This ensures you always get a new copy
  return { ...LeadObj };
}