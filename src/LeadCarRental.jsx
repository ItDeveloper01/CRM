import React, { useEffect } from "react";
import { useState } from 'react';
import config from "./config";
import axios from "axios";
import { CarLeadObject } from "./Model/CarLeadModel";
import { useMemo } from "react";
import HistoryHover from "./HIstoryHover";
import { MESSAGE_TYPES } from "./Constants";
import { useMessageBox } from "./Notification";
import { validateFromDate } from "./validations";
import { ViewField, ViewSelect, DateViewField } from "./ConstantComponent/ViewComponents";
import QuoteCalculator from "./paymentComponents/QuoteComponent";
import { getLabelById } from "./utils/selectUtils";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput
} from "@mui/material";



// const LeadCarRental = ({ cities = [], carLeaddObj, setCarLeadObj, histories, isUpdate,readOnly }) => {
const LeadCarRental = ({ cities = [], carLeaddObj, setCarLeadObj, histories, isUpdate, mode }) => {
    // const LeadCarRental = ({ cities = [], loading = false, formData = {}, handleChange }) => {  ........if loading is usedin cities

    // Memoize the histories array so reference doesn't change unnecessarily
    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isCreateMode = mode === "create";



    const memoHistories = useMemo(() => histories || [], [histories]);
    const memoIsUpdate = useMemo(() => isUpdate || false, [isUpdate]);
    const [errors, setErrors] = useState({});
    //Requirment for car rental
    // const [requirementType, setRequirementType] = useState("");
    const [specialRequirement, setSpecialRequirements] = useState([]);
    const selectedSpecialRequirement =
        specialRequirement?.find(r => r.id === carLeaddObj.specialRequirement)?.specialRequirements || "-";
    const [vehicleType, setVehicleType] = useState([]);
    // const selectedVehicleType = vehicleType?.find(
    // v => v.vehicleTypeID === carLeaddObj.vehicleType);
    const { showMessage } = useMessageBox();
    const [dutyType, setDutyType] = useState([]);
    const [requirementType,setRequirementType] = useState([]);
    const selectedRequirementType = requirementType.find(rt => rt.id == carLeaddObj?.requirementType);



    const getSpecialRequirementsListEndPoint = config.apiUrl + '/MasterData/GetSpecialRequirementsList';
    const getVehicleTypeListEndPoint = config.apiUrl + '/MasterData/GetVehicleModelList';
    const getDutyTypeListEndPoint = config.apiUrl + '/MasterData/GetDutyTypeList';
    const getRequirementTypeListEndPoint = config.apiUrl + '/MasterData/GetRequirementTypeList';



    const handleChange = (e) => {

        console.log("**********************IN CAR LEAD OBJECT   /**************************");
        console.log("Handle Change Called for Car Lead Obj  ");
        console.log("Car Lead Obj before change.....:", carLeaddObj);
        console.log("Histories received....", histories);
        console.log("isUpdate flag....", memoIsUpdate);


        debugger;
        const { name, value } = e.target;
        console.log("printing name and value : ", name, value);
        setCarLeadObj(prev => ({
            ...prev,
            [name]: value
        }));

        // Live validation logic for Telephone no 
        let errMsg = "";
        if (name === "telephoneNo") {
            if (!/^[0-9]*$/.test(value)) {
                errMsg = "Only numbers are allowed";
            } else if (value && value.length < 7) {
                errMsg = "Enter a valid telephone number";
            } else {
                errMsg = "";
            }
        }

        // Update errors state
        setErrors(prev => ({
            ...prev,
            [name]: errMsg
        }));

    }
    // To fetch special requirements API  
    useEffect(() => {
        const fetchSpecialRequirements = async () => {
            try {
                const specialReq = await axios.get(getSpecialRequirementsListEndPoint, {
                    // headers: {
                    //     Authorization: `Bearer ${sessionUser.token}`,
                    // }
                });
                setSpecialRequirements(specialReq.data || []);
            } catch (error) {
                console.error("Error fetching special requirements:", error);
                showMessage({
                    type: MESSAGE_TYPES.ERROR,
                    message: "Error fetching special requirements data.",
                });
            }
        };
        fetchSpecialRequirements();


        const fetchVehicleTypes = async () => {
            try {
                const vehType = await axios.get(getVehicleTypeListEndPoint, {
                    // headers: {
                    //     Authorization: `Bearer ${sessionUser.token}`,
                    // }
                });
                setVehicleType(vehType.data || []);
            } catch (error) {
                console.error("Error fetching vehicle types:", error);
                showMessage({
                    type: MESSAGE_TYPES.ERROR,
                    message: "Error fetching vehicle types data.",
                });
            }
        };
        fetchVehicleTypes();

        const fetchDutyTypes = async () => {
            try {
                const dutyType = await axios.get(getDutyTypeListEndPoint, {
                    
                });
                setDutyType(dutyType.data || []);
            } catch (error) {
                console.error("Error fetching duty types:", error);
                showMessage({
                    type: MESSAGE_TYPES.ERROR,
                    message: "Error fetching duty types data.",
                });
            }
        };
        fetchDutyTypes();


        const fetchRequirementTypes = async () => {
            try {
                const requirementType = await axios.get(getRequirementTypeListEndPoint, {
                });
                setRequirementType(requirementType.data || []);
            } catch (error) {
                console("Error fetching duty type.",error);
                showMessage({
                    type: MESSAGE_TYPES.ERROR,
                    message: "Error fetching requirement types data.",
                });
            }
        };
        fetchRequirementTypes();
    

    }, []);

    useEffect(() => {
        debugger;
        console.log("****.....In Lead Air Ticketing Useffect..............**");
        if (memoIsUpdate) {
            console.log("In LeadCarRental . Its an exisitng lead. Updating the passport details. ");

        }
        console.log("Car Lead Obj in useEffect.....:", carLeaddObj);
        console.log("Histories in useEffect.....:", memoHistories);
        console.log("isUpdate flag....", memoIsUpdate);
    }, [memoIsUpdate]);


    const handleFromDateBlur = (travelDate) => {
        const errorMsg = validateFromDate(carLeaddObj.travelDate);

        //  const value = carLeaddObj.travelDate; // or airTicketObj

        // const errorMsg = validateFromDate(value);

        if (errorMsg) {
            setCarLeadObj(prev => ({
                ...prev,
                travelDate: ""   // clear the date field 
            }));
        }

        setErrors(prev => ({
            ...prev,
            travelDate: errorMsg
        }));
    };

      const onBaseAmountChange = (value) => {
        setCarLeadObj(prev => ({ ...prev, quoteAmount: value }));
    };

    const onFinalAmountChange = (value) => {
        debugger;
        setCarLeadObj(prev => ({ ...prev, finalAmount: value }));
    };

    const onDiscountAmountChange = (discPerc,discAmtValue) => {
        debugger;
        setCarLeadObj(prev => ({ ...prev, discountAmount: discAmtValue }));
    };

    return (

        <div>
            {/* <fieldset disabled={readOnly}> */}
            <div className="flex gap-3 flex-wrap">
                <div className="flex-1">
                    <label className="label-style">No of Travelers</label>
                    {isViewMode ? (
                        <ViewField value={carLeaddObj.noOfTravelers} />
                    ) : (

                        <input
                            type="number"
                            value={Number(carLeaddObj.noOfTravelers) || ""}
                            name="noOfTravelers"
                            min="1"
                            // onChange={handleChange}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Update as number if not empty, else empty string
                                setCarLeadObj(prev => ({
                                    ...prev,
                                    noOfTravelers: value === "" ? "" : Number(value)
                                }));
                            }}
                            className={`border-highlight`}
                        />
                    )}
                </div>
                <div className="flex-1 flex-col">
                    <label className="label-style">Type of Vehicle</label>
                    {/* {isViewMode ? (
    <ViewSelect value={selectedVehicleType?.vehicleType || ""} />
  ) : ( */}
                    {isViewMode ? (
                        <ViewSelect
                            value={getLabelById(
                                vehicleType,
                                carLeaddObj.vehicleType,
                                "vehicleTypeID",
                                "vehicleType"
                            )}
                        />) : (
                        <select
                            name="vehicleType"
                            value={carLeaddObj.vehicleType || ""}
                            onChange={(e) => {
                                const value = e.target.value === "" ? null : Number(e.target.value);
                                setCarLeadObj((prev) => ({
                                    ...prev,
                                    [e.target.name]: value,
                                }));
                            }}
                            className={`border-highlight`}
                        >
                            <option value="">Select Vehicle Type</option>
                            {vehicleType.map((vehType) => (
                                <option key={vehType.vehicleTypeID} value={(vehType.vehicleTypeID)}>
                                    {vehType.vehicleType}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <div className="flex-1 flex-col">
                    <label className="label-style">Type of Duty</label>
                    <div>
                        {isViewMode ? (
                            <ViewSelect value={getLabelById(
                                dutyType,
                                carLeaddObj.dutyType,
                                "id",
                                "dutyTypeName"
                            )}
                        />
                        ) : (
                            <select
                                name="dutyType"
                                value={carLeaddObj.dutyType || ""}
                                className={`border-highlight`}
                                // onChange={handleChange}
                                onChange={(e) => {
                                const value = e.target.value === "" ? null : Number(e.target.value);
                                setCarLeadObj((prev) => ({
                                    ...prev,
                                    [e.target.name]: value,
                                }));
                            }}
                            >
                                <option value="">Select Duty Type</option>
                                {dutyType.map((dutyType)=> (
                                    <option key={dutyType.id} value={dutyType.id}>
                                        {dutyType.dutyTypeName}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex gap-3 flex-wrap">
                {/* Trip Description */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Trip Description</label>
                    {isViewMode ? (
                        <ViewField value={carLeaddObj.tripDescription} />
                    ) : (
                        <input
                            name="tripDescription"
                            value={carLeaddObj.tripDescription || ""}
                            placeholder="Trip Description"
                            onChange={handleChange}
                            className="border-highlight"
                        />
                    )}
                </div>

                {/* Serving City */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Serving City</label>
                    {isViewMode ? (
                        // <ViewField value={carLeaddObj.servingCity} />            //.....value is same as inside select or input
                        <ViewField value={getLabelById(cities, carLeaddObj.servingCity, "id", "cityName")}/>
                    ) : (
                        <select
                            name="servingCity"
                            value={carLeaddObj.servingCity}
                            // onChange={handleChange}
                            onChange={(e) => {
                                const value = e.target.value === "" ? null : Number(e.target.value);
                                setCarLeadObj((prev) => ({
                                    ...prev,
                                    [e.target.name]: value,
                                }));
                            }}
                            className="border-highlight"
                        >
                            {/* debugger;
                        {loading ? (
                            <option>Loading...</option>
                        ) : (
                            <> */}
                            <option value="">Select City</option>
                            {/* {carLeaddObj.cities.map((city, index) => ( ...........to set in car lead but not working check latwer */}
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.cityName}
                                </option>
                            ))}

                            {/* Old formate  */}
                            {/* {cities.map((city, index) => (
                            <option key={index} value={city}>
                                {city}
                            </option>
                        ))} */}

                        </select>
                    )}
                </div>
            </div>

            <div className="flex gap-3 flex-wrap">
                {/* Travel Date */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Travel Date</label>
                    {isViewMode ? (
                        <DateViewField value={carLeaddObj.travelDate} />
                    ) : (
                        <input
                            type="date"
                            name="travelDate"
                            value={carLeaddObj.travelDate || ""}
                            min={new Date().toISOString().split("T")[0]} // onward >= today
                            // onChange={handleChange}
                            onChange={(e) =>
                                setCarLeadObj({
                                    ...carLeaddObj,
                                    travelDate: e.target.value || null

                                })}
                            onBlur={handleFromDateBlur}
                            className="border-highlight"
                        />
                    )}
                    {errors.travelDate && !isViewMode && (<p className="text-red-500 text-sm mt-1">{errors.travelDate}</p>)}
                </div>


                {/* No of Days */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">No of Days</label>
                    {isViewMode ? (
                        <ViewField value={carLeaddObj.noOfDays} />
                    ) : (

                        <input
                            type="number"
                            name="noOfDays"
                            value={Number(carLeaddObj.noOfDays) || ""}
                            min="1"
                            // onChange={handleChange}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Update as number if not empty, else empty string
                                setCarLeadObj(prev => ({
                                    ...prev,
                                    noOfDays: value === "" ? "" : Number(value)
                                }));
                            }}
                            className="border-highlight"
                        />
                    )}
                </div>
            </div>

            <div>

                {/* Requirement Type Dropdown */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Requirement Type</label>
                    {isViewMode ? (
                        <ViewSelect 
                        // value={carLeaddObj.requirementType ? `${carLeaddObj.requirementType} Requirement` : "-"} 
                        value={getLabelById(
                                requirementType,
                                carLeaddObj.requirementType,
                                "id",
                                "requirementTypeName"
                            )}
                        />
                    ) : (
                        <select
                            name="requirementType"
                            value={carLeaddObj.requirementType}
                            onChange={(e) => {
                                const value = e.target.value === "" ? null : Number(e.target.value);
                                setCarLeadObj((prev) => ({
                                    ...prev,
                                    [e.target.name]: value,
                                }));
                            }}
                            // onChange={handleChange}
                            className="border-highlight"
                        >
                            <option value="">Select Requirement</option>
                            {/* {["Individual", "Corporate", "Event", "Inbound"].map((type) => (
                                <option key={type} value={type}> */}
                                    {/* {type.charAt(0).toUpperCase() + type.slice(1)} Requirement     */}
                                    {/* {type} Requirement
                                </option>
                            ))} */}

                            {requirementType.map((requirementType) =>(
                                <option key={requirementType.id} value={requirementType.id}>
                                    {requirementType.requirementTypeName}
                                </option>
                            ))}

                             </select>
                    )}
                </div>


                {/* Show only if corporate selected */}
                {/* {carLeaddObj?.requirementType?.trim()?.toLowerCase() === "corporate" && ( */}
                {selectedRequirementType?.requirementTypeName?.toLowerCase() === "corporate" && (
                    <div className="flex gap-3 flex-wrap">
                        {/* Company Name */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="label-style">Company Name</label>
                            {isViewMode ? (
                                <ViewField value={carLeaddObj.companyName} />
                            ) : (
                                <input
                                    type="text"
                                    name="companyName"
                                    value={carLeaddObj.companyName || ""}
                                    onChange={handleChange}
                                    placeholder="Enter Company Name"
                                    className="border-highlight"
                                />
                            )}
                        </div>

                        {/* Telephone No */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="label-style">Telephone No</label>
                            {isViewMode ? (
                                <ViewField value={carLeaddObj.telephoneNo} />
                            ) : (

                                <input
                                    type="tel"
                                    name="telephoneNo"
                                    value={carLeaddObj.telephoneNo || ""}
                                    onChange={handleChange}
                                    placeholder="Enter Telephone No"
                                    // className="border-highlight"
                                    className={`border-highlight ${errors.telephoneNo ? "border-red-500" : ""}`}
                                    maxLength={11}
                                />
                            )}
                            {errors.telephoneNo && !isViewMode && (<p className="text-red-500 text-sm mt-1">{errors.telephoneNo}</p>)}
                        </div>
                    </div>

                )}
            </div>

        {/* <div>
    <label className="label-style">Special Requirements</label>

    {isViewMode ? (
        <div className="view-field">
            {specialRequirement
                .filter(sr => carLeaddObj.specialRequirement?.includes(sr.id))
                .map(sr => sr.specialRequirements)
                .join(", ") || "-"}
        </div>
    ) : (
        <select
            name="specialRequirement"
            multiple
            value={carLeaddObj.specialRequirement || []}
            onChange={(e) => {
                const values = Array.from(
                    e.target.selectedOptions,
                    option => Number(option.value)
                );

                setCarLeadObj(prev => ({
                    ...prev,
                    specialRequirement: values
                }));
            }}
            className="border-highlight multi-select-box"
        >
            {specialRequirement.map((item) => (
                <option key={item.id} value={item.id}>
                    {item.specialRequirements}
                </option>
            ))}
        </select>
    )}
</div> */}
 <div>
  <label className="label-style">Special Requirements</label>

  {isViewMode ? (
    <div
    className="view-field"
  style={{
    minHeight: "10px",
    border: "1px solid #dfe2e4f7",
    borderRadius: "0.5rem",
    backgroundColor: "#f3f4f6",
    padding: "8px 10px",
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    fontWeight: "400",
    color: carLeaddObj.specialRequirement?.length ? "#0a0a0a" : "#9ca3af"
  }}
>
      {specialRequirement
        .filter(sr => carLeaddObj.specialRequirement?.includes(sr.id))
        .map(sr => sr.specialRequirements)
        .join(", ") || "-"}
    </div>
  ) : (
    // comment on 21.03.2026 for styling
//    <FormControl fullWidth size="small">
//   <Select
//     multiple
//     displayEmpty
//     className="border-highlight"
//     value={carLeaddObj.specialRequirement || []}
//     onChange={(e) => {
//       const value = e.target.value;
//       setCarLeadObj(prev => ({
//         ...prev,
//         // ensure selected IDs are numbers
//         specialRequirement: Array.isArray(value) ? value.map(v => Number(v)) : []
//       }));
      
//     }}
//       sx={{
//     "& .MuiSelect-select": {
//       padding: "0 !important"   // 👈 padding remove
//     }
//    }}
//     renderValue={(selected) => {
//       if (!selected || selected.length === 0) {
//         return <span style={{ color: "#999" }}>Select Requirement</span>;
//       }
//       return specialRequirement
//         .filter(sr => selected.includes(sr.id))
//         .map(sr => sr.specialRequirements) // plural property
//         .join(", ");
//     }}
//     MenuProps={{
//       PaperProps: {
//         style: { maxHeight: 200 }
//       }
//     }}
//   >
//     {specialRequirement.map(item => (
//       <MenuItem key={item.id} value={item.id}>
//         <Checkbox checked={carLeaddObj.specialRequirement?.includes(item.id) || false} />
//         <ListItemText primary={item.specialRequirements} />
//       </MenuItem>
//     ))}
//   </Select>
//  </FormControl>
<FormControl fullWidth size="small">
  <Select
    multiple
    displayEmpty
    variant="standard"   // 🔥 IMPORTANT (same as normal select)
    disableUnderline          // 🔥 REMOVE default line
    className="border-highlight"
    value={carLeaddObj.specialRequirement || []}
    onChange={(e) => {
      const value = e.target.value;
      setCarLeadObj(prev => ({
        ...prev,
        specialRequirement: Array.isArray(value)
          ? value.map(v => Number(v))
          : []
      }));
    }}
    sx={{
      height: "40px",

      // inner content spacing
      "& .MuiSelect-select": {
        padding: "0px 0px 0px 5px",
        display: "block",
        // 🔥 FONT MATCH
        fontSize: "16px",
        fontWeight: "400",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#0a0a0a",   // gray-900 (same as normal text)
      },

       //  MAIN FIX — focus pe blue border
        "&.Mui-focused": {
            // border: "2px solid #afcaf5",
            // boxShadow: "0 0 3px rgba(169, 195, 237, 0.5)",
            border: "1px solid #d1d5db",  // normal gray border
            boxShadow: "0 0 0 2px rgba(49, 123, 243, 0.36)"  ,// 🔥 blue ring
            borderRadius: "0.5rem",
        },
       
      
     
    }}
    renderValue={(selected) => {
      if (!selected || selected.length === 0) {
        return <span className="text-black-700">Select Requirement</span>;
      }
      return specialRequirement
        .filter(sr => selected.includes(sr.id))
        .map(sr => sr.specialRequirements)
        .join(", ");
    }}
    MenuProps={{
      PaperProps: {
        style: { maxHeight: 200 }
      }
    }}
  >
    {specialRequirement.map(item => (
      <MenuItem key={item.id} value={item.id}>
        <Checkbox
          checked={carLeaddObj.specialRequirement?.includes(item.id) || false}
        />
        <ListItemText primary={item.specialRequirements} />
      </MenuItem>
    ))}
  </Select>
</FormControl>
  )}
</div>

            <div>
                {/* Quote Given */}
                <label className="label-style">Quote Comments</label>
                {isViewMode ? (
                    <ViewField value={carLeaddObj.quoteGiven} />
                ) : (
                    <input
                        type="text"
                        placeholder="Enter quote"
                        name="quoteGiven"
                        value={carLeaddObj.quoteGiven || ""}
                        className={`border-highlight`}
                        onChange={handleChange}
                    />
                )}
            </div>
              <div className="flex-1 min-w-[200px]">
                            <label className="label-style">Quote Amount</label>
                            {isViewMode ? (
                                <ViewSelect value={carLeaddObj.finalAmount || "-"} />
                            ):(
                            <QuoteCalculator
                                baseAmt={carLeaddObj.quoteAmount || 0}
                                discountPct={carLeaddObj.discountPercent || 0}
                                discountAmt={carLeaddObj.discountAmount || 0}
                                finalAmt={carLeaddObj.finalAmount || 0}
                                onBaseChange={onBaseAmountChange} // {(value) => setCarLeadObj(prev => ({ ...prev, quoteAmount: value }))}
                                onDiscountChange={onDiscountAmountChange} //{(value) => setCarLeadObj(prev => ({ ...prev, discountAmount: value }))}
                                onFinalChange={onFinalAmountChange} //{(value) => setCarLeadObj(prev => ({ ...prev, finalAmount: value }))}
                                isViewMode={isViewMode}
                            />
                            )}
                        </div>

            {/* Remark */}
            <div>
                <label className="label-style">Remark</label>
                {isViewMode ? (
                    <ViewField value={carLeaddObj.notes} />
                ) : (
                    <input
                        type="text"
                        name="notes"
                        value={carLeaddObj.notes || ""}
                        placeholder="Remark "
                        className={`border-highlight`}
                        onChange={handleChange}
                    />
                )}

            </div>
            {/* </fieldset> */}
            {/* History hover component */}
            {memoIsUpdate && (
                <HistoryHover histories={memoHistories} />)
            }
        </div>

    );
};

export default LeadCarRental;
