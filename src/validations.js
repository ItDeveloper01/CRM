// Lead Generation Validation

// CHANGES FOR AIR TICKET VALIDATION IN FILE VALIDATIONS.22.09.2025 INSIDE CRM FOLDER 

//  ********************All Live Validations*********************
// Live Validation for First Name & Last Name 
export const validNameLive = (value, fieldName = "Name") => {
  try{
  if (value.trim() !== "") {
    if (!/^[A-Za-z]*$/.test(value)) {
      return `Numbers not allowed`;  //Here we use feild name bcoze if we pass value "first name " in handle change the field name will call 
      // } else if (value.length > 20) {
      //       return `Max 20 characters allowed`;
      // return `${fieldName} Max 20 characters allowed`;
    } else {
      return ""; // clear error if valid while typing
    }
  }
  return "";
}catch(error){
  console("Validation error for Name", error);
  return "Validation Error for Name";
  }
}

//Live Validation for Mobile No
export const validMobileNoLive = (value, fieldName = "Name") => {
  try {
    if (value.trim() !== "") {
      // Only digits allowed
      if (/[^0-9]/.test(value)) {
        return "Only numbers are allowed";
      }

      // Length check: must be exactly 10
      if (value.length < 10) {
        return "Enter a valid 10-digit mobile number";
      }

      if (value.length > 10) {
        return "Enter a valid 10-digit mobile number";
      }

      return ""; //  valid
    }
    return "";
  } catch (error) {
    console.error("Validation error for Mobile No", error);
    return "Mobile Number Validation error";
  }
}

// Live Validation for Email
export const validEmailLive = (value, fieldName = "Name") => {
  try{
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/i;
  // const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|rediff\.com)$/i;

  if (!value.trim()) {
    return "";
  } else if (!emailRegex.test(value)) {
    return "Enter a valid email address";             //only gmail.com / rediff.com allowed
  }

  return ""; // clear error if valid
}catch(error)
{
  console.error("Validation Error for Email", error);
  return "Email Validation error";
}
};

//  ********************All Submit Time Validations*********************
// Submit Time Validation  
export const validateBeforeSubmit = (value = "", fieldLabel = "Name") => {
  try {
    if (!value || !value.trim()) {
      if (fieldLabel === "Title") {
        return "Please select a title";
      } if (fieldLabel === "Gender") {
        return "Please select a Gender";
      }
      return `${fieldLabel} is required`;
    }
    return "";
  }catch(error)
  {
    console.error("Validation error while Submiting", error);
    return "Validation Error"
  }
  };



export const validateFromDate = (dateValue) => {
    const today = new Date().toISOString().split("T")[0];

    if (dateValue && dateValue < today) {
        return "Date must be today or later";
    }

    return "";
};

