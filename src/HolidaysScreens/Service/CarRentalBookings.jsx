
// import { useState } from "react";

// const Field = ({ label, children }) => (
//   <div className="flex flex-col gap-1">
//     <label className="text-[11px] tracking-wide text-gray-500 font-semibold uppercase">
//       {label}
//     </label>
//     {children}
//   </div>
// );

// export default function CarRentalBookingForm() {
//   const [tripType, setTripType] = useState("Local");

//   const inputClass =
//     "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition";

//   return (
//     <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 space-y-5 max-w-5xl mx-auto">
//       {/* Header */}
//       <div className="border-b pb-2">
//         <h2 className="text-lg font-semibold text-gray-800">
//           🚗 Car Rental
//         </h2>
//       </div>

//       {/* Trip Setup */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//         <Field label="Trip Type">
//           <select
//             value={tripType}
//             onChange={(e) => setTripType(e.target.value)}
//             className={inputClass}
//           >
//             <option>Local</option>
//             <option>Outstation</option>
//             <option>Airport</option>
//           </select>
//         </Field>

//         <Field label="Vehicle Type">
//           <select className={inputClass}>
//             <option>Sedan</option>
//             <option>SUV</option>
//             <option>Luxury</option>
//             <option>Tempo Traveller</option>
//           </select>
//         </Field>

//         <Field label="No. of Vehicles">
//           <input type="number" className={inputClass} />
//         </Field>

//         <Field label="Driver">
//           <select className={inputClass}>
//             <option>With Driver</option>
//             <option>Self Drive</option>
//           </select>
//         </Field>
//       </div>

//       {/* Locations */}
//       <div className="grid md:grid-cols-2 gap-3">
//         <Field label="Pickup Location">
//           <input className={inputClass} />
//         </Field>

//         {tripType !== "Local" && (
//           <Field label="Drop Location">
//             <input className={inputClass} />
//           </Field>
//         )}
//       </div>

//       {/* Schedule */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//         <Field label="Pickup Date">
//           <input type="date" className={inputClass} />
//         </Field>

//         <Field label="Pickup Time">
//           <input type="time" className={inputClass} />
//         </Field>

//         <Field label="Drop Date">
//           <input type="date" className={inputClass} />
//         </Field>

//         <Field label="Drop Time">
//           <input type="time" className={inputClass} />
//         </Field>
//       </div>

//       {/* Extras */}
//       <div className="grid md:grid-cols-3 gap-3">
//         <Field label="Luggage">
//           <input type="number" className={inputClass} />
//         </Field>

//         <Field label="Special Request">
//           <input className={inputClass} />
//         </Field>

//         <Field label="Notes">
//           <input className={inputClass} />
//         </Field>
//       </div>

//       {/* Footer */}
//       <div className="flex justify-end border-t pt-2">
//         <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm shadow">
//           Save Booking
//         </button>
//       </div>
//     </div>
//   );
// }


import { CarRentalModel  } from "../../Model/FIT Services/CarRentalModel";

const styles = {
  container:
    "bg-white rounded-2xl shadow-md border border-gray-200 p-4 space-y-5 max-w-5xl mx-auto",

  header: "border-b pb-2",

  grid4: "grid grid-cols-2 md:grid-cols-4 gap-3",
  grid2: "grid md:grid-cols-2 gap-3",
  grid3: "grid md:grid-cols-3 gap-3",

  label:
    "text-[11px] tracking-wide text-gray-500 font-semibold uppercase",

  input:
    "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
};

// ✅ reusable field component (MUST be defined)
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className={styles.label}>{label}</label>
    {children}
  </div>
);

// // optional fallback model (avoid crashes)
// const CarRentalModel = {
//   tripType: "Local",
//   vehicleType: "Sedan",
//   noOfVehicles: 1,
//   driverType: "With Driver",
//   route: {},
//   pickupDate: "",
//   pickupTime: "",
//   dropDate: "",
//   dropTime: "",
//   luggage: 0,
//   specialRequest: "",
//   notes: ""
// };

export default function CarRentalBookingForm({ data, onChange }) {
  const form = {
    ...CarRentalModel,
    ...(data || {}),
    pickupLocation: data?.pickupLocation ?? data?.route?.pickup ?? "",
    dropLocation: data?.dropLocation ?? data?.route?.drop ?? ""
  };

  const set = (updated) => onChange(updated);

  return (
    <div className={styles.container}>

      {/* HEADER */}
      <div className={styles.header}>
        <h2 className="text-lg font-semibold text-gray-800">
          🚗 Car Rental Booking
        </h2>
      </div>

      {/* TRIP SETUP */}
      <div className={styles.grid4}>

        <Field label="Trip Type">
          <select
            value={form.tripType}
            onChange={(e) => set({ ...form, tripType: e.target.value })}
            className={styles.input}
          >
            <option>Local</option>
            <option>Outstation</option>
            <option>Airport</option>
          </select>
        </Field>

        <Field label="Vehicle Type">
          <select
            value={form.vehicleType}
            onChange={(e) => set({ ...form, vehicleType: e.target.value })}
            className={styles.input}
          >
            <option>Sedan</option>
            <option>SUV</option>
            <option>Luxury</option>
            <option>Tempo Traveller</option>
          </select>
        </Field>

        <Field label="No. of Vehicles">
          <input
            type="number"
            value={form.noOfVehicles}
            onChange={(e) => set({ ...form, noOfVehicles:Number( e.target.value )})}
            className={styles.input}
          />
        </Field>

        <Field label="Driver Type">
          <select
            value={form.driverType}
            onChange={(e) => set({ ...form, driverType: e.target.value })}
            className={styles.input}
          >
            <option>With Driver</option>
            <option>Self Drive</option>
          </select>
        </Field>

      </div>

      {/* ROUTE */}
      <div className={styles.grid2}>

        <Field label="Pickup Location">
          <input
            value={form.pickupLocation || ""}
            onChange={(e) =>
              set({
                ...form,
                pickupLocation: e.target.value
              })
            }
            className={styles.input}
          />
        </Field>

        {form.tripType !== "Local" && (
          <Field label="Drop Location">
            <input
              value={form.dropLocation || ""}
              onChange={(e) =>
                set({
                  ...form,
                  dropLocation: e.target.value
                })
              }
              className={styles.input}
            />
          </Field>
        )}

      </div>

      {/* SCHEDULE */}
      <div className={styles.grid4}>

        <Field label="Pickup Date">
          <input
            type="date"
            value={form.pickupDate}
            onChange={(e) => set({ ...form, pickupDate: e.target.value })}
            className={styles.input}
          />
        </Field>

        <Field label="Pickup Time">
          <input
            type="time"
            value={form.pickupTime}
            onChange={(e) => set({ ...form, pickupTime: e.target.value })}
            className={styles.input}
          />
        </Field>

        <Field label="Drop Date">
          <input
            type="date"
            value={form.dropDate}
            onChange={(e) => set({ ...form, dropDate: e.target.value })}
            className={styles.input}
          />
        </Field>

        <Field label="Drop Time">
          <input
            type="time"
            value={form.dropTime}
            onChange={(e) => set({ ...form, dropTime: e.target.value })}
            className={styles.input}
          />
        </Field>

      </div>

    </div>
  );
}
