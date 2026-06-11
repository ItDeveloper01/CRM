import React, { useEffect, useState } from "react";
import { fetchCountries } from "../../api/commonApi";

export const HotelBookingModel = {
  hotelName: "",
  country: "",
  city: "",
  preferredArea: "",
  checkInDate: "",
  checkOutDate: "",
  checkInTime: "",
  checkOutTime: "",
  roomView: "No Preference", // Sea, City, Garden, No Preference
  mealPreference: "Veg", // Veg, Non-Veg, Fish, Other
  foodAllergies: "",
  breakfastIncluded: false,
  specialRequests: "",
};

const inputBase =
  "border border-gray-300 rounded px-3 py-2 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-orange-400";

export default function HotelBookingForm({ data = {}, onChange, travelScope = "" }) {
  const [form, setForm] = useState({ ...HotelBookingModel, ...(data || {}) });
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    setForm({ ...HotelBookingModel, ...(data || {}) });
  }, [data]);

  // Fetch countries list (common API helper)
  useEffect(() => {
    fetchCountries()
      .then(setCountries)
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  const set = (updated) => {
    setForm(updated);
    onChange?.(updated);
  };

  return (
    <div className="bg-white rounded-lg p-4 border">

      <h3 className="text-lg font-semibold mb-3">🏨 Hotel Booking {travelScope ? `(${travelScope})` : ""}</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* ROW 1: LOCATION */}
        <div>
          <label className="label-style">Hotel Name / Place</label>
          <input type="text" className={inputBase} value={form.hotelName || ""} onChange={(e)=> set({...form, hotelName: e.target.value})} placeholder="e.g. The Taj Mahal Hotel" />
        </div>

        {travelScope === "International" && (
          <div>
            <label className="label-style">Country</label>
            <select className={inputBase} value={form.country || ""} onChange={(e)=> set({...form, country: e.target.value})}>
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.value} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="label-style">City</label>
          <input type="text" className={inputBase} value={form.city || ""} onChange={(e)=> set({...form, city: e.target.value})} placeholder="e.g. Delhi, Paris" />
        </div>

        <div>
          <label className="label-style">Preferred Area</label>
          <input type="text" className={inputBase} value={form.preferredArea || ""} onChange={(e)=> set({...form, preferredArea: e.target.value})} placeholder="e.g. Near Beach, Downtown" />
        </div>

        {/* ROW 2: DATES */}
        <div>
          <label className="label-style">Check-in Date</label>
          <input type="date" className={inputBase} value={form.checkInDate || ""} onChange={(e)=> set({...form, checkInDate: e.target.value})} />
        </div>

        <div>
          <label className="label-style">Check-out Date</label>
          <input type="date" className={inputBase} value={form.checkOutDate || ""} onChange={(e)=> set({...form, checkOutDate: e.target.value})} />
        </div>

        <div>
          <label className="label-style">Room View</label>
          <select className={inputBase} value={form.roomView} onChange={(e)=> set({...form, roomView: e.target.value})}>
            <option>No Preference</option>
            <option>Sea View</option>
            <option>City View</option>
            <option>Garden View</option>
          </select>
        </div>

        <div>
          <label className="label-style">Meal Preference</label>
          <select className={inputBase} value={form.mealPreference} onChange={(e)=> set({...form, mealPreference: e.target.value})}>
            <option>Veg</option>
            <option>Non-Veg</option>
            <option>Fish</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="label-style">Food Allergies</label>
          <input type="text" className={inputBase} value={form.foodAllergies || ""} onChange={(e)=> set({...form, foodAllergies: e.target.value})} placeholder="e.g. Peanuts, Shellfish" />
        </div>

        <div className="flex items-center gap-2">
          <div>
            <label className="label-style">Breakfast Included</label>
            <div className="mt-1">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={!!form.breakfastIncluded} onChange={(e)=> set({...form, breakfastIncluded: e.target.checked})} />
                <span className="text-sm">Include Breakfast</span>
              </label>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <label className="label-style">Special Requests</label>
          <textarea className="border border-gray-300 rounded p-2 w-full text-sm" rows={3} value={form.specialRequests || ""} onChange={(e)=> set({...form, specialRequests: e.target.value})} />
        </div>
      </div>

    </div>
  );
}
