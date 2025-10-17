import React, { useEffect } from "react";
import { useState } from 'react';
import config from "./config";
import axios from "axios";
import { CarLeadObject } from "./Model/CarLeadModel";
import { useMemo } from "react";
import HistoryHover from "./HIstoryHover";


const LeadCarRental = ({ cities = [], carLeaddObj, setCarLeadObj, histories, isUpdate }) => {
    // const LeadCarRental = ({ cities = [], loading = false, formData = {}, handleChange }) => {  ........if loading is usedin cities

    // Memoize the histories array so reference doesn't change unnecessarily
    const memoHistories = useMemo(() => histories || [], [histories]);
    const memoIsUpdate = useMemo(() => isUpdate || false, [isUpdate]);
    const [errors, setErrors] = useState({});
    //Requirment for car rental
    const [requirementType, setRequirementType] = useState("");
    const [specialRequirement, setSpecialRequirements] = useState([]);
    const [vehicleType, setVehicleType] = useState([]);


    const getSpecialRequirementsListEndPoint = config.apiUrl + '/MasterData/GetSpecialRequirementsList';
    const getVehicleTypeListEndPoint = config.apiUrl + '/MasterData/GetVehicleModelList';
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
                console.error("Error fetching special requirements:", error);
            }
        };
        fetchVehicleTypes();
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


    return (

        <div>
            <div className="flex gap-3 flex-wrap">
                <div className="flex-1">
                    <label className="label-style">No of Travelers</label>
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
                </div>
                <div className="flex-1 flex-col">
                    <label className="label-style">Type of Vehicle</label>
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
                </div>
                <div className="flex-1 flex-col">
                    <label className="label-style">Type of Duty</label>
                    <div>
                        <select
                            name="dutyType"
                            value={carLeaddObj.dutyType || ""}
                            className={`border-highlight`}
                            onChange={handleChange}
                        >
                            <option value="">Select Duty Type</option>
                            <option value="Transfer">Transfer</option>
                            <option value="Local">Local</option>
                            <option value="Outstation">Outstation</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 flex-wrap">
                {/* Trip Description */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Trip Description</label>
                    <input
                        name="tripDescription"
                        value={carLeaddObj.tripDescription || ""}
                        placeholder="Trip Description"
                        onChange={handleChange}
                        className="border-highlight"
                    />
                </div>

                {/* Serving City */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Serving City</label>
                    <select
                        name="servingCity"
                        value={carLeaddObj.servingCity}
                        onChange={handleChange}
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
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}

                        {/* Old formate  */}
                        {/* {cities.map((city, index) => (
                            <option key={index} value={city}>
                                {city}
                            </option>
                        ))} */}

                    </select>
                </div>
            </div>

            <div className="flex gap-3 flex-wrap">
                {/* Travel Date */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Travel Date</label>
                    <input
                        type="date"
                        name="travelDate"
                        value={carLeaddObj.travelDate || ""}
                        onChange={handleChange}
                        className="border-highlight"
                    />
                </div>

                {/* No of Days */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">No of Days</label>
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
                </div>
            </div>

            <div>

                {/* Requirement Type Dropdown */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Requirement Type</label>
                    <select
                        name="requirementType"
                        value={carLeaddObj.requirementType}
                        onChange={handleChange}
                        className="border-highlight"
                    >
                        <option value="">Select Requirement</option>
                        {["Individual", "Corporate", "Event", "Inbound"].map((type) => (
                            <option key={type} value={type}>
                                {/* {type.charAt(0).toUpperCase() + type.slice(1)} Requirement     */}
                                {type} Requirement
                            </option>
                        ))}
                    </select>
                </div>


                {/* Show only if corporate selected */}
                {carLeaddObj?.requirementType?.trim()?.toLowerCase() === "corporate" && (
                    <div className="flex gap-3 flex-wrap">
                        {/* Company Name */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="label-style">Company Name</label>
                            <input
                                type="text"
                                name="companyName"
                                value={carLeaddObj.companyName || ""}
                                onChange={handleChange}
                                placeholder="Enter Company Name"
                                className="border-highlight"
                            />
                        </div>

                        {/* Telephone No */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="label-style">Telephone No</label>
                            <input
                                type="tel"
                                name="telephoneNo"
                                value={carLeaddObj.telephoneNo || ""}
                                onChange={handleChange}
                                placeholder="Enter Telephone No"
                                className="border-highlight"
                            />
                        </div>
                    </div>

                )}
            </div>

            <div>
                {/* Special Requirements Dropdown */}
                <label className="label-style">Special Requirements</label>
                <select name="specialRequirement" value={carLeaddObj.specialRequirement || ""}
                    // onChange={(e) =>
                    //     setCarLeadObj((prev) => ({
                    //         ...prev,
                    //         [e.target.name]: e.target.value === "" ? null : e.target.value,
                    //     }))
                    // }

                    onChange={(e) => {
                        const value = e.target.value === "" ? null : Number(e.target.value);
                        setCarLeadObj((prev) => ({
                            ...prev,
                            [e.target.name]: value,
                        }));
                    }}

                    className='border-highlight'>
                    <option value="">Select Requirement</option>
                    {specialRequirement.map((specialReq) => (
                        <option key={specialReq.id} value={(specialReq.id)}>
                            {specialReq.specialRequirements}
                        </option>
                    ))}
                </select>
            </div>


            <div>
                {/* Quote Given */}
                <label className="label-style">Quote Given</label>
                <input
                    type="text"
                    placeholder="Enter quote"
                    name="quoteGiven"
                    value={carLeaddObj.quoteGiven || ""}
                    className={`border-highlight`}
                    onChange={handleChange}
                />
            </div>

            {/* Remark */}
            <div>
                <label className="label-style">Remark</label>
                <input
                    type="text"
                    name="notes"
                    value={carLeaddObj.notes || ""}
                    placeholder="Remark "
                    className={`border-highlight`}
                    onChange={handleChange}
                />

                {/* History hover component */}
                {memoIsUpdate && (
                    <HistoryHover histories={memoHistories} />)
                }
            </div>
        </div>
    );
};

export default LeadCarRental;
