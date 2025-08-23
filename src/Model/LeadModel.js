export const LeadObj = {
  fName: "",
  lName: "",
  mobileNo: "",
  destination: "",
  leadStatus: "",
  enquiryDate: "",
  email: "",
  middleName: "", 
  birthdate: "",
  address: "",      
};

// Function to return a fresh empty lead object
export function getEmptyLeadObj() {
  // This ensures you always get a new copy
  return { ...LeadObj };
}