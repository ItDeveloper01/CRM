
// import { AirTicketingLeadObject } from "./Model/AirTicketLeadModel"
// const LeadPassportDetails ={(AirTicketingdObj,handChange )} => {


// }
import React from "react";
import { getRadioValue } from "./utils/selectUtils";
import { DateViewField } from "./ConstantComponent/ViewComponents";


// const LeadPassportDetails = ({ passportDetailsObj, setObject }) => {
//   const handleChange = (e) => {

//     console.log("**********************IN AIR TICKETING OBJECT   /**************************");
//     console.log("Passport Details Object before change.....:", passportDetailsObj);


//     debugger;
//     const { name, value } = e.target;
//     console.log("printing name and value : ", name, value);
//     setObject(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     console.log("Air Ticketing Obj.....:", airTicketingdObj);
//   };
//   return (
//     <div>
//             {/* Visa Status & Passport Validity Date */}
//             <div className="flex gap-3 flex-wrap items-stretch">

//               {/* Visa Status */}
//               <div className="flex-1 min-w-[200px] flex flex-col">
//                 <label className="label-style mb-1">Visa Status</label>
//                 <div className="border border-gray-300 rounded-lg p-2 flex justify-between flex-1 h-full">
//                   {["Valid", "In Process", "Not Applied"].map((visastatus) => (
//                     <label
//                       key={visastatus}
//                       className={`flex items-center gap-2 flex-1 cursor-pointer rounded-md px-1
//                       ${passportDetailsObj.visaStatus === visastatus
//                           ? "bg-blue-100 border border-blue-500"
//                           : "bg-white border border-transparent"
//                         }`}
//                     >
//                       <input
//                         type="radio"
//                         name="visaStatus"
//                         value={visastatus}
//                         checked={passportDetailsObj.visaStatus === visastatus}
//                         onChange={handleChange}
//                       />
//                       {visastatus}
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Passport Validity Date */}
//               <div className="flex-1 min-w-[200px] flex flex-col">
//                 <label className="label-style mb-1">Passport Validity</label>
//                 <div className="border border-gray-300 rounded-lg flex-1 h-full flex items-center px-2 
//                 focus-within:border-blue-300 focus-within:ring-1 focus-within:ring-blue-300">
//                   <input
//                     type="date"
//                     name="passportValidityDate"
//                     value={passportDetailsObj.passportValidityDate || ""}
//                     onChange={handleChange}
//                     className="w-full h-full outline-none bg-white"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Overseas Insurance */}
//             <div className="flex-1 min-w-[200px] flex flex-col">
//               <label className="label-style mb-1">Overseas Insurance</label>
//               <div className="border border-gray-300 rounded-lg p-2 flex justify-between flex-1 h-full">
//                 {["Issued", "Not Issued"].map((insuranceStatus) => (
//                   <label
//                     key={insuranceStatus}
//                     className={`option-highlight
//                       ${passportDetailsObj.overseasInsurance === insuranceStatus
//                         ? "option-highlight-active"
//                         : "option-highlight-inactive"
//                       }`}
//                   >
//                     <input
//                       type="radio"
//                       name="overseasInsurance"
//                       value={insuranceStatus}
//                       checked={passportDetailsObj.overseasInsurance === insuranceStatus}
//                       onChange={handleChange}
//                     />
//                     {insuranceStatus}
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//   );
// };

// export default LeadPassportDetails;





// ********* if you want to use specific element from it then declare like this and check in air ticket comments for visa status *********



const PassportDetails = ({
  passportDetailsObj,
  setPassportDetailsObj,
  setParentObject,
  showVisaStatus = true,
  showPassportValidityDate = true,
  showInsurance = true,
  showPassportValidity = true,
  isViewMode = false, // for View mode 
}) => {
  const handleChange = (e) => {

    console.log("**********************IN Lead passport details  OBJECT   /**************************");
    console.log("Passport Details Object before change.....:", passportDetailsObj);


    debugger;
    const { name, value } = e.target;
    console.log("printing name and value : ", name, value);
    setParentObject(prev => ({
      ...prev,
      [name]: value
    }));

    //  setParentObject(prev => ({
    //   ...prev,
    //   [name]: value
    // }));

    setPassportDetailsObj(prev => ({
      ...prev,
      [name]: value
    }));

    console.log("Passport Details Obj.....:", passportDetailsObj);
  };
  return (
    <div>
      <div className="flex gap-3 flex-wrap items-stretch">
        {/* Visa Status */}
        {showVisaStatus && (
          <div className="flex-1 min-w-[200px] flex flex-col">
            <label className="label-style mb-1">Visa Status</label>
            {/* <div className="border border-gray-300 rounded-lg p-2 flex justify-between flex-1 h-full">
              {["Valid", "In Process", "Not Applied"].map((visastatus) => (
                <label
                  key={visastatus}
                  className={`flex items-center gap-2 flex-1 cursor-pointer rounded-md px-1
                    ${passportDetailsObj.visaStatus === visastatus
                      ? "bg-blue-100 border border-blue-500"
                      : "bg-white border border-transparent"
                    }`}
                >
                  <input
                    type="radio"
                    name="visaStatus"
                    value={visastatus}
                    checked={passportDetailsObj.visaStatus === visastatus}
                    onChange={handleChange}
                  />
                  {visastatus}
                </label>
              ))}
            </div> */}
            <div className="border border-gray-300 rounded-lg p-2 flex justify-between flex-1 h-full">
              {["Valid", "In Process", "Not Applied"].map((visastatus) => {
                const isChecked = passportDetailsObj.visaStatus === visastatus;

                return (
                  <label
                    key={visastatus}
                    className={`flex items-center gap-2 flex-1 rounded-md px-1
                ${isChecked
                        ? isViewMode
                          ? "bg-gray-100 border border-gray-300"
                          : "bg-blue-100 border border-blue-500"
                        : "bg-white border border-transparent"
                      }
               ${isViewMode ? "cursor-not-allowed" : "cursor-pointer"}
                `}
                  >
                    <input
                      type="radio"
                      name="visaStatus"
                      value={visastatus}
                      checked={isChecked}
                      onChange={handleChange}
                      disabled={isViewMode}
                    />

                    {/* force readable text */}
                    <span className="text-black">{visastatus}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {showPassportValidity && (
          <div className="flex-1 min-w-[200px]">
            <label className="label-style">Passport Validity</label>
            <div className="border border-gray-300 rounded-lg p-2 flex justify-between">
              {["Checked", "Not Checked", "Not Sure"].map((pValidity) => (
                <label key={pValidity}
                  className={`option-highlight
                    ${getRadioValue({
                    selectedValue: passportDetailsObj.passportValidity,
                    optionValue: pValidity,
                    isViewMode,
                  })}`}

                //                     ${passportDetailsObj.passportValidity === pValidity
                //   ? "option-highlight-active"
                //   : "option-highlight-inactive"
                // }`}
                >
                  <input type="radio"
                    name="passportValidity"
                    value={pValidity}
                    checked={passportDetailsObj.passportValidity === pValidity}
                    onChange={handleChange}
                    disabled={isViewMode}
                  />
                  {pValidity}
                </label>
              ))}
            </div>
          </div>
        )}

      </div>


      {/* div for Overseas Insurance and Passport Validity date  */}
      <div className="flex gap-3 flex-wrap items-stretch">
        {/* Overseas Insurance */}
        {showInsurance && (
          <div className="flex-1 min-w-[200px] flex flex-col">
            <label className="label-style mb-1">Overseas Insurance</label>
            <div className="border border-gray-300 rounded-lg p-2 flex justify-between flex-1 h-full">
              {["Issued", "Not Issued"].map((insuranceStatus) => (
                <label
                  key={insuranceStatus}
                  className={`option-highlight
                  ${getRadioValue({
                    selectedValue: passportDetailsObj.overseasInsurance,
                    optionValue: insuranceStatus,
                    isViewMode,
                  })}`}

                // ${passportDetailsObj.overseasInsurance === insuranceStatus
                //         ? "option-highlight-active"
                //         : "option-highlight-inactive"
                //       }`}
                >
                  <input
                    type="radio"
                    name="overseasInsurance"
                    value={insuranceStatus}
                    checked={passportDetailsObj.overseasInsurance === insuranceStatus}
                    onChange={handleChange}
                    disabled={isViewMode}
                  />
                  {insuranceStatus}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Passport Validity Date */}
        {showPassportValidityDate && (
          <div className="flex-1 min-w-[200px] flex flex-col">
            <label className="label-style mb-1">Passport Validity Date</label>
             {isViewMode ? (
              // <div className="border border-gray-300 rounded-lg flex items-center px-2 flex-1 h-full ">
                <DateViewField value={passportDetailsObj.passportValidityDate} />
                //  </div>
              ) : (
            <div className="border border-gray-300 rounded-lg flex items-center px-2 flex-1 h-full">
             
                <input
                  type="date"
                  name="passportValidityDate"
                  value={passportDetailsObj.passportValidityDate || ""}
                  onChange={handleChange}
                  className="w-full h-full outline-none bg-white "
                />
             
            </div>
             )}

          </div>
        )}
      </div>

    </div>
  );
};

export default PassportDetails;

