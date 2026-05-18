// import { Train } from "lucide-react";
// import { useState } from "react";

// export default function CarRentalBookingForm({ onSubmit }) {
//   const [formData, setFormData] = useState({
//     fromDestination: "",
//     toDestination: "",
//     fromDate: "",
//     toDate: "",
//     timeSlot: ""
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (onSubmit) {
//       onSubmit(formData);
//     } else {
//       console.log("Booking submitted:", formData);
//     }
//   };

//   return (
//     <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="bg-indigo-600 p-3 rounded-lg">
//           <Train className="w-6 h-6 text-white" />
//         </div>
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Car Rental Booking</h1>
//           <p className="text-sm text-gray-600">CRM Travel Services</p>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Destinations */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="fromDestination" className="block text-sm font-medium text-gray-700 mb-2">
//               From Destination
//             </label>
//             <input
//               type="text"
//               id="fromDestination"
//               name="fromDestination"
//               value={formData.fromDestination}
//               onChange={handleChange}
//               placeholder="Enter departure station"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="toDestination" className="block text-sm font-medium text-gray-700 mb-2">
//               To Destination
//             </label>
//             <input
//               type="text"
//               id="toDestination"
//               name="toDestination"
//               value={formData.toDestination}
//               onChange={handleChange}
//               placeholder="Enter arrival station"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
//               required
//             />
//           </div>
//         </div>

//         {/* Dates */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-2">
//               Departure Date
//             </label>
//             <input
//               type="date"
//               id="fromDate"
//               name="fromDate"
//               value={formData.fromDate}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-2">
//               Return Date
//             </label>
//             <input
//               type="date"
//               id="toDate"
//               name="toDate"
//               value={formData.toDate}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
//             />
//           </div>
//         </div>

//         {/* Time Slot */}
//         <div>
//           <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-2">
//             Preferred Time Slot
//           </label>
//           <select
//             id="timeSlot"
//             name="timeSlot"
//             value={formData.timeSlot}
//             onChange={handleChange}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white"
//             required
//           >
//             <option value="">Select time slot</option>
//             <option value="early-morning">Early Morning (05:00 - 08:00)</option>
//             <option value="morning">Morning (08:00 - 12:00)</option>
//             <option value="afternoon">Afternoon (12:00 - 17:00)</option>
//             <option value="evening">Evening (17:00 - 21:00)</option>
//             <option value="night">Night (21:00 - 05:00)</option>
//           </select>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
//         >
//           Search Trains
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] tracking-wide text-gray-500 font-semibold uppercase">
      {label}
    </label>
    {children}
  </div>
);

export default function CarRentalBookingForm() {
  const [tripType, setTripType] = useState("Local");

  const inputClass =
    "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition";

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b pb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          🚗 Car Rental
        </h2>
      </div>

      {/* Trip Setup */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Field label="Trip Type">
          <select
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
            className={inputClass}
          >
            <option>Local</option>
            <option>Outstation</option>
            <option>Airport</option>
          </select>
        </Field>

        <Field label="Vehicle Type">
          <select className={inputClass}>
            <option>Sedan</option>
            <option>SUV</option>
            <option>Luxury</option>
            <option>Tempo Traveller</option>
          </select>
        </Field>

        <Field label="No. of Vehicles">
          <input type="number" className={inputClass} />
        </Field>

        <Field label="Driver">
          <select className={inputClass}>
            <option>With Driver</option>
            <option>Self Drive</option>
          </select>
        </Field>
      </div>

      {/* Locations */}
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Pickup Location">
          <input className={inputClass} />
        </Field>

        {tripType !== "Local" && (
          <Field label="Drop Location">
            <input className={inputClass} />
          </Field>
        )}
      </div>

      {/* Schedule */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Field label="Pickup Date">
          <input type="date" className={inputClass} />
        </Field>

        <Field label="Pickup Time">
          <input type="time" className={inputClass} />
        </Field>

        <Field label="Drop Date">
          <input type="date" className={inputClass} />
        </Field>

        <Field label="Drop Time">
          <input type="time" className={inputClass} />
        </Field>
      </div>

      {/* Extras */}
      <div className="grid md:grid-cols-3 gap-3">
        <Field label="Luggage">
          <input type="number" className={inputClass} />
        </Field>

        <Field label="Special Request">
          <input className={inputClass} />
        </Field>

        <Field label="Notes">
          <input className={inputClass} />
        </Field>
      </div>

      {/* Footer */}
      <div className="flex justify-end border-t pt-2">
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm shadow">
          Save Booking
        </button>
      </div>
    </div>
  );
}
