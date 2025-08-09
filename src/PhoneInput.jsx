import React, { useEffect, useRef , useState } from 'react';
//import React, { useRef, useState } from "react";
// import intlTelInput from 'intl-tel-input';
// import 'intl-tel-input/build/css/intlTelInput.css';
// import React, { useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";



// export default function PhoneInput() {
//   const inputRef = useRef(null);

//   useEffect(() => {
//     if (inputRef.current) {
//       intlTelInput(inputRef.current, {
//         initialCountry: 'in', // default India 🇮🇳
//         preferredCountries: ['in', 'us', 'gb'],
//         separateDialCode: true,
//         utilsScript:
//           'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js', // for formatting/validation
//       });
//     }
//   }, []);

//   return (
//     <div>
//       <input
//         id='phone'
//         ref={inputRef}
//         type='tel'
//         className='border p-2 rounded w-full margin-left50px'
//       />
//     </div>
//   );
// }


export default function PhoneField() {
  const inputRef = useRef();

  const [phone, setPhone] = useState("");
console.log("Country Code...", + phone);
  return (
   <div className="flex gap-2 items-center">
      <PhoneInput
        country={"in"} // Default to India
        value={phone}
        onChange={(value) => setPhone(value)}
        enableSearch={true}
        countryCodeEditable={false} // lock country code
        inputProps={{
          name: "phone",
          required: true,
        }}
        containerClass="!flex !items-center"
    buttonClass="!bg-white !border"
    inputClass="!border !rounded-r-md"
      />
    </div>
  );
}