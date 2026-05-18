import { useState, useEffect } from "react";

const Field = ({ label, children, error }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] tracking-wide text-gray-500 font-semibold uppercase">
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const Section = ({ icon, title, children }) => (
  <div className="rounded-xl border bg-gray-50/60 p-3 space-y-3">
    <div className="flex items-center gap-2 text-gray-700">
      <span className="text-orange-500 text-sm">{icon}</span>
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);

export default function AirportTransferForm() {
  const [autoFill, setAutoFill] = useState(true);
  const [transferType, setTransferType] = useState("Arrival");

  const [arrivalFlightTime, setArrivalFlightTime] = useState("");
  const [arrivalPickupTime, setArrivalPickupTime] = useState("");

  const [departureFlightTime, setDepartureFlightTime] = useState("");
  const [departurePickupTime, setDeparturePickupTime] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (autoFill && arrivalFlightTime) {
      const date = new Date(`1970-01-01T${arrivalFlightTime}`);
      date.setMinutes(date.getMinutes() + 45);
      setArrivalPickupTime(date.toTimeString().slice(0, 5));
    }
  }, [arrivalFlightTime, autoFill]);

  useEffect(() => {
    if (autoFill && departureFlightTime) {
      const date = new Date(`1970-01-01T${departureFlightTime}`);
      date.setHours(date.getHours() - 2);
      setDeparturePickupTime(date.toTimeString().slice(0, 5));
    }
  }, [departureFlightTime, autoFill]);

  const validate = () => {
    let newErrors = {};
    if (!arrivalFlightTime && (transferType === "Arrival" || transferType === "Both")) {
      newErrors.arrivalFlightTime = "Required";
    }
    if (!departureFlightTime && (transferType === "Departure" || transferType === "Both")) {
      newErrors.departureFlightTime = "Required";
    }
    setErrors(newErrors);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 space-y-5 max-w-5xl mx-auto">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          ✈️ Airport Transfer
        </h2>
        <button
          onClick={() => setAutoFill(!autoFill)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition shadow-sm ${
            autoFill
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {autoFill ? "Auto Timing" : "Manual"}
        </button>
      </div>

      <Section icon="🧭" title="Transfer Setup">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="Transfer Type">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition"
              value={transferType}
              onChange={(e) => setTransferType(e.target.value)}
            >
              <option>Arrival</option>
              <option>Departure</option>
              <option>Both</option>
            </select>
          </Field>

          <Field label="Trip Type">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition">
              <option>One Way</option>
              <option>Round Trip</option>
            </select>
          </Field>

          <Field label="City">
            <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition" />
          </Field>

          <Field label="Terminal">
            <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition" />
          </Field>
        </div>
      </Section>

      <Section icon="📍" title="Locations">
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Pickup Location">
            <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition" />
          </Field>
          <Field label="Drop Location">
            <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition" />
          </Field>
        </div>
      </Section>

      {(transferType === "Arrival" || transferType === "Both") && (
        <Section icon="🛬" title="Arrival Details">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Field label="Airline">
              <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition" />
            </Field>

            <Field label="Flight No.">
              <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition" />
            </Field>

            <Field label="Arrival Time" error={errors.arrivalFlightTime}>
              <input
                type="time"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition"
                value={arrivalFlightTime}
                onChange={(e) => setArrivalFlightTime(e.target.value)}
              />
            </Field>

            <Field label="Pickup Time">
              <input
                type="time"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition"
                value={arrivalPickupTime}
                onChange={(e) => setArrivalPickupTime(e.target.value)}
                disabled={autoFill}
              />
            </Field>
          </div>
        </Section>
      )}

      {(transferType === "Departure" || transferType === "Both") && (
        <Section icon="🛫" title="Departure Details">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Field label="Airline">
              <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition" />
            </Field>

            <Field label="Flight No.">
              <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition" />
            </Field>

            <Field label="Departure Time" error={errors.departureFlightTime}>
              <input
                type="time"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition"
                value={departureFlightTime}
                onChange={(e) => setDepartureFlightTime(e.target.value)}
              />
            </Field>

            <Field label="Pickup Time">
              <input
                type="time"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition"
                value={departurePickupTime}
                onChange={(e) => setDeparturePickupTime(e.target.value)}
                disabled={autoFill}
              />
            </Field>
          </div>
        </Section>
      )}

      <div className="flex justify-end pt-2 border-t">
        <button
          onClick={validate}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow"
        >
          Validate & Save
        </button>
      </div>
    </div>
  );
}

/*
Tailwind helper (add this in your global CSS, NOT inside this file)

.input {
  @apply border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white
  shadow-sm
  focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
  hover:border-gray-400 transition;
}
*/
