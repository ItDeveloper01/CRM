import React from "react";
import { useState } from 'react';


const LeadCarRental = ({ cities = [], formData = {}, handleChange }) => {
// const LeadCarRental = ({ cities = [], loading = false, formData = {}, handleChange }) => {  ........if loading is usedin cities
    
    //Requirment for car rental
    const [requirementType, setRequirementType] = useState("");
    
   

    return(
        
        <div>
            <div className="flex gap-3 flex-wrap">
                <div className="flex-1">
                    <label className="label-style">No of Travelers</label>
                    <input
                        name="numTravelers"
                        type="number"
                        min="1"
                        onChange={handleChange}
                        className={`border-highlight`}
                    />
                </div>
                <div className="flex-1 flex-col">
                    <label className="label-style">Type of Vehicle</label>
                    <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        className={`border-highlight`}
                    >
                        <option value="">Select Vehicle</option>
                        <option value="maruti">Maruti</option>
                    </select>
                </div>
                <div className="flex-1 flex-col">
                    <label className="label-style">Type of Duty</label>
                    <div>
                        <select
                            name="duty"
                            className={`border-highlight`}
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
                        value={formData.cities}
                        onChange={handleChange}
                        className="border-highlight"
                    >
                        {/* debugger;
                        {loading ? (
                            <option>Loading...</option>
                        ) : (
                            <> */}
                                <option value="">Select City</option>
                                {cities.map((city, index) => (
                                    <option key={index} value={city}>
                                        {city}
                                    </option>
                                ))}
                            {/* </>
                        )} */}
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
                        min="1"
                        onChange={handleChange}
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
                        value={requirementType}
                        onChange={(e) => setRequirementType(e.target.value)}
                        className="border-highlight"
                    >
                        <option value="">Select Requirement</option>
                        <option value="personal">Personal Requirement</option>
                        <option value="corporate">Corporate Requirement</option>
                    </select>
                </div>

                {/* Show only if corporate selected */}
                {requirementType === "corporate" && (
                    <div className="flex gap-3 flex-wrap">
                        {/* Company Name */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="label-style">Company Name</label>
                            <input
                                type="text"
                                name="companyName"
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
                                name="telephone"
                                onChange={handleChange}
                                placeholder="Enter Telephone No"
                                className="border-highlight"
                            />
                        </div>
                    </div>

                )}
            </div>

            {/* Rental Type */}
            <div className="flex-1 min-w-[250px]">
                <label className="label-style">Rental Type</label>
                <div className="flex-1 min-w-[250px]">
                    <select
                        name="rentalType"
                        className="border-highlight"
                    >
                        <option value="">Select Rental Type</option>
                        <option value="events">Events</option>
                        <option value="individual">Individual</option>
                        <option value="inbond">InBound</option>
                        <option value="group">Group</option>
                    </select>
                </div>
            </div>

            <div>
                {/* Quote Given */}
                <label className="label-style">Quote Given</label>
                <input
                    type="text"
                    placeholder="Enter quote"
                    className={`border-highlight`}
                />
            </div>

            {/* Special Requirement */}
            <div>
                <label className="label-style">Special Requirement</label>
                <input
                    type="text"
                    placeholder="Special requirement "
                    className={`border-highlight`}
                />
            </div>
        </div>
    );
};

export default LeadCarRental;


