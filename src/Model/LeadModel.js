export const LeadObj = {
  fName: "",
  mName:"",
  lName: "",
  mobileNo: "",
  destination: "",
  leadStatus: "",
  enquiryDate: "",
  email: "",
  title : "",
  middleName: "", 
  birthdate: "",
  gender:"",
  address: "", 
  followupDate: "",

};

// Function to return a fresh empty lead object
export function getEmptyLeadObj() {
  // This ensures you always get a new copy
  return { ...LeadObj };
}