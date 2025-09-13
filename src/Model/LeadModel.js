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
  enquiryDate: "",
  destination: "",
  notes: "",
  birthDate: "",         // yyyy-MM-dd (string for HTML input type="date")
         // default today
  followUpDate: null,    // yyyy-MM-dd or empty
  createdAt: null,
  updatedAt: null,
  fK_LeadCategoryID :null,
                  
    createdBy_UserID:'',

    assignee_UserID :'',
   // 🔹 Flexible slot for category-specific data
  category: {} ,
  histories: []  // Array to hold history records
};



// Function to validate a lead object
export function validateLead(lead) {

  const requiredFields = [
    "title",
    "fName",
    "lName",
    "mobileNo",
    "emailId",
    "pax",
    "gender",
    "enquiryDate",
    "leadStatus",
    "enquiryMode",
    "enquirySource",
    "destination",
    "followUpDate"    // yyyy-MM-dd or empty
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