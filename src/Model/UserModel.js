export const UserObject = {
  userId: null,          // Unique user ID
  empId: null,           // Employee ID
  firstName: "",         
  middleName: "",        
  lastName: "",
  birthDate: null,       // ISO date string "YYYY-MM-DD"
  mobileNo: "",
  emailId: "",
  gender: "",            // "Male"/"Female"/"Other"
  
  role: 0 ,              // e.g., "Admin", "User"
  department: 0,    // Department ID
  branch: 0,
  designation: "",
  reportingManager: "",
  reportingManagerList:[], // list of possible managers based on dept/role

  password: "",          // hashed/encrypted password
  createdBy: "",         // ID of creator
  createdAt: new Date().toISOString(),  // ISO datetime
  updatedAt: new Date().toISOString(),
  joiningDate: null   ,   // ISO date string "YYYY-MM-DD"
  status :"Active",
  // Optional UI/API-only fields (NotMapped)
  notes: "",             // any internal notes
  isActive: true,         // toggle user active/inactive
  photo:null,
  photoBase64:"",      // base64 string for photo upload
  
  
  
  isUpdatepasword:false, // to check password update or not
  selectedDepartmentList:[],  // to store department list
};

// Function to return a fresh empty lead object
export function getEmptyUserObj() {
  // This ensures you always get a new copy
  return { ...UserObject};
}