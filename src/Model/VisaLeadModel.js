// src/Model/VisaLeadModel.js
import dayjs from "dayjs";

export const VISALeadObject = {
  id: null,

  country1: "",
  country2: "",
  country3: "",

  visaType: "",
  travelDate: null, // ISO date string "YYYY-MM-DD"

  noOfApplicants: null,
  purposeOfTravel: "",
  noOfEntries: "",
  travelPlanStatus: "",
  hotelBooking: "",
  overseasInsurance: "",
  passportValidity: "",
  airTicketIssuedBy: "",

  createdBy_UserID: "gpatil", // default user
  createdAt: new Date().toISOString(),   // ISO datetime "YYYY-MM-DDTHH:mm:ssZ"
  updatedAt: new Date().toISOString(),

  visaCode: null, // usually read-only
  status: "Open",  // Open/In Process/Closed
  // NotMapped properties (UI/API only)
  quoteGiven: "",
  notes: "",
  assigneeTo_UserID: ""
};

// Function to return a fresh empty lead object
export function getEmptyVisaObj() {
  // This ensures you always get a new copy
  return { ... VISALeadObject ,
                        createdAt: dayjs().toISOString(),
                        updatedAt: dayjs().toISOString()
                        
                       
 
}
}
