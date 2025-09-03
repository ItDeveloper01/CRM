import React from "react";
import "./LeadStyle.css";



const LeadVisa = ({ formData, countries, handleChange }) => {
    return (
        <div>
            <div className="flex gap-3 flex-wrap">
                {/* Country1 Dropdown */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Country 1</label>
                    <select
                        className={`border-highlight ${formData.country1 ? "selected" : ""}`}
                        name="country1"
                        value={formData.country1}
                        onChange={handleChange}
                    >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                            <option key={country.name} value={country.name}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>


                {/* Country2 Dropdown */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Country 2</label>
                    <select
                        className={`border-highlight ${formData.country2 ? "selected" : ""}`}
                        name="country2"
                        value={formData.country2}
                        onChange={handleChange}
                    >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                            <option key={country.name} value={country.name}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Country3 Dropdown */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Country 3</label>
                    <select
                        className={`border-highlight ${formData.country3 ? "selected" : ""}`}
                        name="country3"
                        value={formData.country3}
                        onChange={handleChange}
                    >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                            <option key={country.name} value={country.name}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* <div className="flex-1 min-w-[250px]">
            <label className="label-style">Country</label>
            <select
            className={`border-highlight`}
            name="country"
            value={formData.country}
            onChange={(e) => {
                handleChange(e);
                e.target.size = 1;
                e.target.blur();
            }}
            onFocus={(e) => (e.target.size = 6)}
            onBlur={(e) => (e.target.size = 1)}
            >
            <option value="">Select Country</option>
            {countries.map((country) => (
                <option key={country.name} value={country.name}>
                {country.name}
                </option>
            ))}
            </select>
        </div> */}

            {/* Travel Date, Applicants, Purpose */}
            <div className="flex gap-3 flex-wrap"> {/* reduced gap */}

                <div className="flex-1">
                    <label className="label-style">Travel Date</label>
                    <input
                        type="date"
                        name="travelDates"
                        value={formData.travelDates}
                        onChange={handleChange}
                        className={`border-highlight ${formData.travelDates ? "selected" : ""}`}
                        //  This code is for more information of highlight concept
                        //  className={`w-full rounded-lg p-2 focus:outline-none focus:ring-2 
                        //         ${formData.travelDates
                        //         ? "bg-blue-100 border border-blue-500"   // highlight when date is selected
                        //         : "bg-white border border-gray-300"      // default gray border
                        //     }`}
                    />
                </div>
                {/* <div className="flex-1">
                    <label className="label-style">Travel Date</label>
                    <input
                        // className={`border-highlight`}
                        className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 
                                ${formData.country1
                                ? "bg-blue-100 border border-blue-500"   // highlight for Travel Date
                                : "bg-white border border-transparent"
                            }`}

                        name="travelDates"
                        type="date"
                        onChange={handleChange}
                    />
                </div> */}

                <div className="flex-1">
                    <label className="label-style">No. of Applicants</label>
                    <input
                        className={`border-highlight`}
                        name="numApplicants"
                        type="number"
                        min="1"
                        onChange={handleChange}
                    />
                </div>

                <div className="flex-1">
                    <label className="label-style">Purpose of Travel</label>
                    <select
                        className={`border-highlight`}
                        name="purpose"
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="Business">Business</option>
                        <option value="Tourism">Tourism</option>
                        <option value="Attending an Exhibition">Attending an Exhibition</option>
                        <option value="Event-Conference">Event-Conference</option>
                        <option value="Visiting Friends and Relatives">Visiting Friends and Relatives</option>
                        <option value="Transit">Transit</option>
                    </select>
                </div>
            </div>

            {/* Visa Type & Entries */}
            <div className="flex gap-3 flex-wrap"> {/* reduced gap */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Visa Type</label>
                    <select
                        className={`border-highlight`}
                        name="visatype"
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="Business">Business</option>
                        <option value="Tourist">Tourist</option>
                        <option value="Transit">Transit</option>
                        <option value="Dependent">Dependent</option>
                        <option value="Student">Student</option>
                    </select>
                </div>

                <div className="flex-1">
                    <label className="label-style">No Of Entries</label>
                    <select
                        className={`border-highlight`}
                        name="entrequired"
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Multiple">Multiple</option>
                    </select>
                </div>
            </div>

            {/* Travel Plan Status & Hotel */}
            {/* <div className="flex gap-3 flex-wrap">  */} {/* reduced gap */}
            <div className="flex gap-3 flex-wrap">
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Travel Plan Status</label>
                    <div className="border border-gray-300 rounded-lg px-1 py-2 flex justify-between">
                        {["Confirmed", "Tentative"].map((status) => (
                            <label
                                key={status}
                                className={`flex items-center gap-2 flex-1 cursor-pointer rounded-md px-1
                                ${formData.travelplanstatus === status
                                        ? "bg-blue-100 border border-blue-500"
                                        : "bg-white border border-transparent"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="travelplanstatus"
                                    value={status}
                                    checked={formData.travelplanstatus === status}
                                    onChange={handleChange}
                                />
                                {status}
                            </label>
                        ))}
                    </div>
                </div>

                {/* <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Travel Plan Status</label>
                    <div className="border border-gray-300 rounded-lg p-2 flex justify-between">
                        {["Confirmed", "Tentative"].map((status) => (
                            <label key={status} className="flex items-center gap-2 flex-1 cursor-pointer">
                                <input type="radio" name="travelplanstatus" value={status} onChange={handleChange} />
                                {status}
                            </label>
                        ))}
                    </div>
                </div> */}

                {/* Hotel */}
                <div className="flex-1 min-w-[250px]">
                    <label className="label-style">Hotel</label>
                    <div className="border border-gray-300 rounded-lg p-2 flex justify-between">
                        {["Booked", "Not Booked"].map((status) => (
                            <label key={status} className="flex items-center gap-2 flex-1 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="hotel" 
                                    value={status} o
                                    onChange={handleChange}
                                 />
                                {status}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Overseas Insurance & Passport Validity */}
            <div className="flex gap-3 flex-wrap"> {/* reduced gap */}
                <div className="flex-1 min-w-[200px]">
                    <label className="label-style">Overseas Insurance</label>
                    <div className="border border-gray-300 rounded-lg p-2 flex justify-between">
                        {["Issued", "Not Issued"].map((status) => (
                            <label key={status} className="flex items-center gap-2 flex-1 cursor-pointer">
                                <input type="radio" name="overseasinsurance" value={status} onChange={handleChange} />
                                {status}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex-1 min-w-[200px]">
                    <label className="label-style">Passport Validity</label>
                    <div className="border border-gray-300 rounded-lg p-2 flex justify-between">
                        {["Checked", "Not Checked", "Not Sure"].map((status) => (
                            <label key={status} className="flex items-center gap-2 flex-1 cursor-pointer">
                                <input type="radio" name="passportvalidity" value={status} onChange={handleChange} />
                                {status}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Airticket */}
            <div className="flex-1">
                <label className="label-style">Airticket</label>
                <div className="border border-gray-300 rounded-lg p-2 grid grid-cols-4">
                    {["Issued by Girikand", "Issued from other agency", "Blocked", "Not Issued"].map((status) => (
                        <label key={status} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="airticket" value={status} onChange={handleChange} />
                            {status}
                        </label>
                    ))}
                </div>
            </div>

            {/* Quote Given */}
            <div className="flex-1 min-w-[200px]">
                <label className="label-style">Quote Given</label>
                <input
                    type="text"
                    className={`border-highlight`}
                    name="quotegiven"
                    placeholder="Enter quote"
                    onChange={handleChange}
                />
            </div>

            {/* Remark */}
            <div className="flex-1 min-w-[200px]">
                <label className="label-style">Remark</label>
                <textarea
                    className={`border-highlight`}
                    name="remark"
                    placeholder="Remark"
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

export default LeadVisa;
