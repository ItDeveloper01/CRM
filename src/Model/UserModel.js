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
  
  role: "",              // e.g., "Admin", "User"
  department: "",
  branch: "",
  designation: "",
  reportingManager: "",

  password: "",          // hashed/encrypted password
  createdBy: "",         // ID of creator
  createdAt: new Date().toISOString(),  // ISO datetime
  updatedAt: new Date().toISOString(),
  joiningDate: null   ,   // ISO date string "YYYY-MM-DD"

  // Optional UI/API-only fields (NotMapped)
  notes: "",             // any internal notes
  isActive: true         // toggle user active/inactive
};

// Function to return a fresh empty lead object
export function getEmptyUserObj() {
  // This ensures you always get a new copy
  return { ...UserObject};
}