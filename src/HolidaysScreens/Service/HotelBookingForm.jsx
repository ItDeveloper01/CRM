import React, { useMemo, useState } from "react";
import { fetchCountries } from "../../api/commonApi";

export const HotelBookingModel = {
  hotelName: null,
  country: null,
  city: null,
  preferredArea: null,
  checkInDate: null,
  checkOutDate: null,
  checkInTime: null,
  checkOutTime: null,
  roomView: "No Preference", // Sea, City, Garden, No Preference
  mealPreference: "Veg", // Veg, Non-Veg, Fish, Other
  foodAllergies: null,
  breakfastIncluded: false,
  specialRequests: null,
};

const inputBase =
  "border border-gray-300 rounded px-3 py-2 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-orange-400";

// Strips a full ISO datetime ("2026-07-10T00:00:00") down to "YYYY-MM-DD"
// for <input type="date">. Keeps null/undefined as null — do NOT coerce to
// "" here, or an untouched date field gets sent back to the backend as ""
// instead of null, which a nullable DateTime? will reject.
const toDateInputValue = (value) => {
  if (!value) return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.substring(0, 10);
  }
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().substring(0, 10);
};

// Normalizes a hotel-booking entry coming from the backend (edit/view mode).
// Text fields are safe to coalesce to "" permanently. Date fields stay
// null when empty — they're only coalesced to "" at render time (see the
// `value={form.checkInDate || ""}` inputs below), same pattern as
// TrainBookingForm's departure/return dates.
export const normalizeHotelEntry = (entry = {}) => {
  return {
    ...HotelBookingModel,
    ...entry,
    hotelName: entry.hotelName ?? "",
    country: entry.country ?? "",
    city: entry.city ?? "",
    preferredArea: entry.preferredArea ?? "",
    checkInDate: toDateInputValue(entry.checkInDate),
    checkOutDate: toDateInputValue(entry.checkOutDate),
    checkInTime: entry.checkInTime ?? null,
    checkOutTime: entry.checkOutTime ?? null,
    roomView: entry.roomView || "No Preference",
    mealPreference: entry.mealPreference || "Veg",
    foodAllergies: entry.foodAllergies ?? "",
    breakfastIncluded: !!entry.breakfastIncluded,
    specialRequests: entry.specialRequests ?? "",
  };
};

export default function HotelBookingForm({ data = {}, onChange, travelScope = "", isViewMode = false }) {
  const form = useMemo(() => normalizeHotelEntry(data), [data]);
  const [countries, setCountries] = useState([]);

  // Fetch countries list (common API helper)
  // useEffect(() => {
  //   fetchCountries()
  //     .then(setCountries)
  //     .catch((err) => console.error("Error fetching countries:", err));
  // }, []);

  const set = (updated) => {
    onChange?.(updated);
  };

  return (
    <div className="bg-white rounded-lg p-4 border">

      <h3 className="text-lg font-semibold mb-3">🏨 Hotel Booking {travelScope ? `(${travelScope})` : ""}</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* ROW 1: LOCATION */}
        <div>
          <label className="label-style">Hotel Name / Place</label>
          <input
            type="text"
            className={inputBase}
            value={form.hotelName}
            disabled={isViewMode}
            onChange={(e) => set({ ...form, hotelName: e.target.value })}
            placeholder="e.g. The Taj Mahal Hotel"
          />
        </div>

        {travelScope === "International" && (
          <div>
            <label className="label-style">Country</label>
            <input
              type="text"
              className={inputBase}
              value={form.country}
              disabled={isViewMode}
              onChange={(e) => set({ ...form, country: e.target.value })}
              placeholder="Enter Country"
            />
          </div>
        )}

        <div>
          <label className="label-style">City</label>
          <input
            type="text"
            className={inputBase}
            value={form.city}
            disabled={isViewMode}
            onChange={(e) => set({ ...form, city: e.target.value })}
            placeholder="e.g. Delhi, Paris"
          />
        </div>

        <div>
          <label className="label-style">Preferred Area</label>
          <input
            type="text"
            className={inputBase}
            value={form.preferredArea}
            disabled={isViewMode}
            onChange={(e) => set({ ...form, preferredArea: e.target.value })}
            placeholder="e.g. Near Beach, Downtown"
          />
        </div>

        {/* ROW 2: DATES */}
        <div>
          <label className="label-style">Check-in Date</label>
          <input
            type="date"
            className={inputBase}
            value={form.checkInDate || ""}
            disabled={isViewMode}
            onChange={(e) => set({ ...form, checkInDate: e.target.value || null })}
          />
        </div>

        <div>
          <label className="label-style">Check-in Time</label>
          <input
            type="time"
            className={inputBase}
            value={form.checkInTime || ""}
            disabled={isViewMode}
            onChange={(e) => set({ ...form, checkInTime: e.target.value || null })}
          />
        </div>

        <div>
          <label className="label-style">Check-out Date</label>
          <input
            type="date"
            className={inputBase}
            value={form.checkOutDate || ""}
            disabled={isViewMode}
            onChange={(e) => set({ ...form, checkOutDate: e.target.value || null })}
          />
        </div>

        <div>
          <label className="label-style">Check-out Time</label>
          <input
            type="time"
            className={inputBase}
            value={form.checkOutTime || ""}
            disabled={isViewMode}
            onChange={(e) => set({ ...form, checkOutTime: e.target.value || null })}
          />
        </div>

        <div>
          <label className="label-style">Room View</label>
          <select
            className={inputBase}
            value={form.roomView}
            disabled={isViewMode}
            onChange={(e) => set({ ...form, roomView: e.target.value })}
          >
            <option>No Preference</option>
            <option>Sea View</option>
            <option>City View</option>
            <option>Garden View</option>
          </select>
        </div>

        <div>
          <label className="label-style">Meal Preference</label>
          <select
            className={inputBase}
            value={form.mealPreference}
            disabled={isViewMode}
            onChange={(e) => set({ ...form, mealPreference: e.target.value })}
          >
            <option>Veg</option>
            <option>Non-Veg</option>
            <option>Fish</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="label-style">Food Allergies</label>
          <input
            type="text"
            className={inputBase}
            value={form.foodAllergies}
            disabled={isViewMode}
            onChange={(e) => set({ ...form, foodAllergies: e.target.value })}
            placeholder="e.g. Peanuts, Shellfish"
          />
        </div>

        <div className="flex items-center gap-2">
          <div>
            <label className="label-style">Breakfast Included</label>
            <div className="mt-1">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!form.breakfastIncluded}
                  disabled={isViewMode}
                  onChange={(e) => set({ ...form, breakfastIncluded: e.target.checked })}
                />
                <span className="text-sm">Include Breakfast</span>
              </label>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <label className="label-style">Special Requests</label>
          <textarea
            className="border border-gray-300 rounded p-2 w-full text-sm"
            rows={3}
            value={form.specialRequests}
            disabled={isViewMode}
            onChange={(e) => set({ ...form, specialRequests: e.target.value })}
          />
        </div>
      </div>

    </div>
  );
}
