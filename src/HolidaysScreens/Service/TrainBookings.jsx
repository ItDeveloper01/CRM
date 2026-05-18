import { useState } from "react";

// ====== STYLE CONSTANTS ======
const styles = {
  container:
    "bg-white rounded-2xl shadow-md border border-gray-200 p-4 space-y-4 max-w-5xl mx-auto",
  header: "flex justify-between items-center border-b pb-2",
  input:
    "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition",
  label:
    "text-[11px] tracking-wide text-gray-500 font-semibold uppercase",
  grid4: "grid grid-cols-2 md:grid-cols-4 gap-3",
  grid2: "grid md:grid-cols-2 gap-3",
  grid3: "grid md:grid-cols-3 gap-3",
  button:
    "bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-lg text-sm shadow",
};

// ====== LABEL CONSTANTS ======
const LABELS = {
  tripType: "Trip Type",
  class: "Class",
  quota: "Quota",
  fare: "Fare Type",
  passengers: "Passengers",
  from: "From Route",
  to: "To Route",
  departure: "Departure Date",
  departureSlot: "Departure Slot",
  departureTime: "Departure Time",
  return: "Return Date",
  returnSlot: "Return Slot",
  returnTime: "Return Time",
  name: "Passenger Name",
  passport: "Passenger Passport",
  age: "Age / DOB",
  nationality: "Passenger Nationality",
};

// ====== OPTIONS CONFIG (API READY) ======
const OPTIONS = {
  tripType: [
    { label: "One Way", value: "ONE_WAY" },
    { label: "Round Trip", value: "ROUND_TRIP" },
  ],
  class: {
    Domestic: [
      { label: "Sleeper", value: "SL" },
      { label: "3AC", value: "3AC" },
      { label: "2AC", value: "2AC" },
      { label: "1AC", value: "1AC" },
    ],
    International: [
      { label: "2nd Class", value: "SECOND" },
      { label: "1st Class", value: "FIRST" },
      { label: "Business", value: "BUSINESS" },
    ],
  },
  quota: [
    { label: "General", value: "GENERAL" },
    { label: "Tatkal", value: "TATKAL" },
  ],
  fare: [
    { label: "Standard", value: "STANDARD" },
    { label: "Flexible", value: "FLEX" },
  ],
  timeSlots: [
    { label: "Morning (6–12)", value: "MORNING" },
    { label: "Afternoon (12–17)", value: "AFTERNOON" },
    { label: "Evening (17–21)", value: "EVENING" },
    { label: "Night (21–6)", value: "NIGHT" },
  ],
};

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className={styles.label}>{label}</label>
    {children}
  </div>
);

// reusable select
const Select = ({ options, value, onChange }) => (
  <select value={value} onChange={onChange} className={styles.input}>
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

export default function TrainBookingForm() {
  const [tripType, setTripType] = useState("ONE_WAY");
  const [mode, setMode] = useState("Domestic");
  const [departureSlot, setDepartureSlot] = useState("");
  const [returnSlot, setReturnSlot] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [returnTime, setReturnTime] = useState("");

  const getSlotFromTime = (time) => {
    if (!time) return "";
    const hour = parseInt(time.split(":")[0], 10);
    if (hour >= 6 && hour < 12) return "MORNING";
    if (hour >= 12 && hour < 17) return "AFTERNOON";
    if (hour >= 17 && hour < 21) return "EVENING";
    return "NIGHT";
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className="text-lg font-semibold text-gray-800">
          {mode === "Domestic"
            ? "🚆 Domestic Train Booking"
            : "🌍 🚆 International Train Booking"}
        </h2>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1 text-xs bg-white"
        >
          <option>Domestic</option>
          <option>International</option>
        </select>
      </div>

      {/* Top Row */}
      <div className={styles.grid4}>
        <Field label={LABELS.tripType}>
          <Select
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
            options={OPTIONS.tripType}
          />
        </Field>

        <Field label={LABELS.class}>
          <Select options={OPTIONS.class[mode]} />
        </Field>

        {mode === "Domestic" && (
          <Field label={LABELS.quota}>
            <Select options={OPTIONS.quota} />
          </Field>
        )}

        {mode === "International" && (
          <Field label={LABELS.fare}>
            <Select options={OPTIONS.fare} />
          </Field>
        )}

        <Field label={LABELS.passengers}>
          <input type="number" className={styles.input} />
        </Field>
      </div>

      {/* Route */}
      <div className={styles.grid2}>
        <Field label={LABELS.from}>
          <input className={styles.input} />
        </Field>

        <Field label={LABELS.to}>
          <input className={styles.input} />
        </Field>
      </div>

      {/* Dates + Time */}
      <div className={styles.grid4}>
        <Field label={LABELS.departure}>
          <input type="date" className={styles.input} />
        </Field>

        <Field label={LABELS.departureSlot}>
          <Select
            options={OPTIONS.timeSlots}
            value={departureSlot}
            onChange={(e) => {
              setDepartureSlot(e.target.value);
              setDepartureTime(""); // clear time when slot chosen
            }}
          />
        </Field>

        <Field label={LABELS.departureTime}>
          <input
            type="time"
            value={departureTime}
            onChange={(e) => {
              const val = e.target.value;
              setDepartureTime(val);
              setDepartureSlot(getSlotFromTime(val));
            }}
            className={styles.input}
          />
        </Field>

        {tripType === "ROUND_TRIP" && (
          <>
            <Field label={LABELS.return}>
              <input type="date" className={styles.input} />
            </Field>

            <Field label={LABELS.returnSlot}>
              <Select
                options={OPTIONS.timeSlots}
                value={returnSlot}
                onChange={(e) => {
                  setReturnSlot(e.target.value);
                  setReturnTime("");
                }}
              />
            </Field>

            <Field label={LABELS.returnTime}>
              <input
                type="time"
                value={returnTime}
                onChange={(e) => {
                  const val = e.target.value;
                  setReturnTime(val);
                  setReturnSlot(getSlotFromTime(val));
                }}
                className={styles.input}
              />
            </Field>
          </>
        )}
      </div>

      {/* Passenger */}
      <div className={styles.grid3}>
        <Field label={LABELS.name}>
          <input className={styles.input} />
        </Field>

        {mode === "International" && (
          <Field label={LABELS.passport}>
            <input className={styles.input} />
          </Field>
        )}

        <Field label={LABELS.age}>
          <input className={styles.input} />
        </Field>

        {mode === "International" && (
          <Field label={LABELS.nationality}>
            <input className={styles.input} />
          </Field>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-2 border-t">
        <button className={styles.button}>Save Booking</button>
      </div>
    </div>
  );
}
