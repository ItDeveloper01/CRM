import PhoneField from "./PhoneInput";
import { useState, useEffect } from "react";

const NewCustomerForm = () => {
  const [countries, setCountries] = useState([]);
  const [countryCode, setCountryCode] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "", // <-- added
    lastName: "",
    countryCode: "", // country code for phone number
    phone: "",
    email: "",
    nationality: "Indian",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    country: "India",
    state: "",
    city: "",
    pinCode: "",
    hasPassport: false,
    passportNumber: "",
    passportValidity: "",
    aadhaarNumber: "",
  });


  // Name validation function
  const validateNameField = (name, value) => {
    const nameRegex = /^[A-Za-z]+$/;
    let error = "";

    if (name === "firstName" || name === "lastName") {
      if (!value.trim()) {
        error = `${name === "firstName" ? "First" : "Last"} Name is required`;
      } else if (!nameRegex.test(value.trim())) {
        error = `${name === "firstName" ? "First" : "Last"} Name can only contain letters`;
      } else if (value.trim().length < 2) {
        error = `${name === "firstName" ? "First" : "Last"} Name must be at least 2 characters`;
      }
    }

    if (name === "middleName" && value.trim()) {
      if (!nameRegex.test(value.trim())) {
        error = "Middle Name can only contain letters";
      } else if (value.trim().length < 2) {
        error = "Middle Name must be at least 2 characters";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  }

const validatePhoneField = (name, value) => {
if (name === "phone") {
  let error = "";
    const phoneRegex = /^[0-9]{10}$/; // exactly 10 digits
    if (!value.trim()) {
      error = "Phone number is required";
    } else if (!phoneRegex.test(value.trim())) {
      error = "Phone number must be exactly 10 digits";
    }

 setErrors((prev) => ({ ...prev, [name]: error }));
  };
  }

  const validatePinCode=(name,value)=>{
   let error="";
   const pinCodeRegex = /^[0-9]$/;  // onlyDigits

   console.log("PinCode Validation for ..."+ value);
    if (!value.trim()) {
      error = "Pin Code is required";
    } else if (!pinCodeRegex.test(value.trim())) {
      error = "Pin code must be digits only";
    }
  }
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = type === "checkbox" ? checked : value;

    // Auto-format for name fields
    if (["firstName", "middleName", "lastName"].includes(name)) {
      newValue = newValue
        .replace(/\s+/g, " ")             // Remove extra spaces
        .trimStart()                      // Prevent leading space
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
    }

  console.log("Name in...."+ name);

    setFormData((prev) => ({ ...prev, [name]: newValue, }));

    // Validate while typing
    if (["firstName", "middleName", "lastName","phone"].includes(name)) {
      validateNameField(name, newValue);
    }

      // Remove non-digits for phone
  if (name === "phone") {
    newValue = newValue.replace(/\D/g, ""); // allow only numbers
    validatePhoneField(name,newValue);
  }

  if(name==="pincode")
  {
    validatePinCode(name,newValue);
  }

  // Email field: basic format validation
  if (name === "email") {
     const emailRegex = /^[^\s@]+@(?=.*[a-zA-Z])[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
     
    if (!newValue) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
    } else if (!emailRegex.test(newValue)) {
      setErrors((prev) => ({ ...prev, email: "Enter a valid email address" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  }

  
  };

// Fetch country code
//   useEffect(() => {

// const res =  fetch("https://restcountries.com/v3.1/all");
// console.log("Country Code For Phones:"+res);        
// const data =  res.json();


// const codes = data
//           .filter((c) => c.idd?.root && c.idd?.suffixes?.length)
//           .map((c) => ({
//             code: `${c.idd.root}${c.idd.suffixes[0]}`,
//             name: c.name.common,
//             flag: c.flag,
//           }))
//           .sort((a, b) => a.name.localeCompare(b.name));

//         setCountryCode(codes);


//     // fetch("https://countriesnow.space/api/v0.1/countries/positions")
//     //   .then((res) => res.json())
//     //   .then((data) => {
//     //     console.log("Country codes : ", data);
//     //     setCountryCode(data.data || []);
//     //   })
//     //   .catch((err) => console.error("Error fetching country code:", err));
//   }, []);

//FEtch Country Code
useEffect(() => {

  console.log("Country COde Loaded...");
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => {
        console.log("Country Code : ", data);
        setCountryCode(data.data || []);
      })
      .catch((err) => console.error("Error fetching country code:", err));
  }, []);

  // Fetch countries
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/positions")
      .then((res) => res.json())
      .then((data) => {
        console.log("Countries Data : ", data);
        setCountries(data.data || []);
      })
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!formData.country) return;
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: formData.country }),
    })
      .then((res) => res.json())
      .then((data) => {
        setStates(data.data.states || []);
        setCities([]);
        setFormData((prev) => ({ ...prev, state: "", city: "" }));
      })
      .catch((err) => console.error("Error fetching states:", err));
  }, [formData.country]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!formData.state) return;
    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country: formData.country,
        state: formData.state,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCities(data.data || []);
        setFormData((prev) => ({ ...prev, city: "" }));
      })
      .catch((err) => console.error("Error fetching cities:", err));
  }, [formData.state]);

  
  const validateForm = () => {
    let newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.nationality) newErrors.nationality = "Nationality is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.pinCode) newErrors.pinCode = "Pin Code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted", formData);
      alert("Form submitted successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">New Customer Form</h2>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
        </div>

        {/* Middle Name - optional */}
        <div>
          <input
            type="text"
            name="middleName"
            placeholder="Middle Name"
            value={formData.middleName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
        </div>

       <div className="flex gap-1">

  <div className="flex flex-col gap-1 w-full">
  {/* Row with country code + phone number */}
  <div className="flex gap-1">
    {/* <select
      name="countryCode"
      value={formData.countryCode}
      onChange={handleChange}
      className="px-2 py-2 border rounded-md"
    >


      <option value="">CountryCode</option>
{countryCode.map((countryCode) => (
              <option key={countryCode.name} value={countryCode.countryCode}>
                {countryCode.name}
              </option>
            ))}

      {/* <option value="+91">🇮🇳 +91</option>
      <option value="+1">🇺🇸 +1</option>
      <option value="+44">🇬🇧 +44</option>
      <option value="+61">🇦🇺 +61</option>
      <option value="+971">🇦🇪 +971</option>
    */}

    {/* <option value="">Select Nationality</option>
            {countries.map((country) => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
*/}
    {/* </select>  */} 
<PhoneField value={FormData.phone}/>
    {/* <input
      type="tel"
      name="phone"
      placeholder="Phone"
      value={formData.phone}
      onChange={handleChange}
      className="w-full px-4 py-2 border rounded-md"
    /> */}
  </div>

  {/* Error message below both fields */}
  {errors.phone && (
    <p className="text-red-500 text-sm">{errors.phone}</p>
  )}
</div>

</div>
        {/* Email field - single row */}
<div className="flex flex-col w-full">
  <input
    type="email"
    name="email"
    placeholder="Email"
    value={formData.email}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-md"
  />
  {errors.email && (
    <p className="text-red-500 text-sm">{errors.email}</p>
  )}
</div>

        {/* Nationality */}
        <div>
          <select
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select Nationality</option>
            {countries.map((country) => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.nationality && <p className="text-red-500 text-sm">{errors.nationality}</p>}
        </div>
      </div>

      {/* Address Section */}
      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Address</h3>
      <div className="border border-gray-300 p-4 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <input
              type="text"
              name="addressLine1"
              placeholder="Address Line 1"
              value={formData.addressLine1}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.addressLine1 && <p className="text-red-500 text-sm">{errors.addressLine1}</p>}
          </div>
          <input
            type="text"
            name="addressLine2"
            placeholder="Address Line 2"
            value={formData.addressLine2}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            name="addressLine3"
            placeholder="Address Line 3"
            value={formData.addressLine3}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />

          {/* Country */}
          <div>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select Country</option>
              {countries.map((abc) => (
                <option key={abc.iso2} value={abc.name}>
                  {abc.name}
                </option>
              ))}
            </select>
            {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
          </div>

          {/* State */}
          <div>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={!states.length}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.iso2} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
          </div>

          {/* City */}
          <div>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!cities.length}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </div>

          {/* Pin Code */}
          <div>
            <input
              type="text"
              name="pinCode"
              placeholder="Pin Code"
              value={formData.pinCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.pinCode && <p className="text-red-500 text-sm">{errors.pinCode}</p>}
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Documents</h3>
      <div className="border border-gray-300 p-4 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="hasPassport"
              checked={formData.hasPassport}
              onChange={handleChange}
            />
            <label>Hold Passport</label>
          </div>
          <input
            type="text"
            name="passportNumber"
            placeholder="Passport Number"
            value={formData.passportNumber}
            onChange={handleChange}
            disabled={!formData.hasPassport}
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="date"
            name="passportValidity"
            value={formData.passportValidity}
            onChange={handleChange}
            disabled={!formData.hasPassport}
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            name="aadhaarNumber"
            placeholder="Aadhaar Number"
            value={formData.aadhaarNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default NewCustomerForm;
