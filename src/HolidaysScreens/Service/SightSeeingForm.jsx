import { useState } from "react";
import { SightseeingModel } from "../../Model/FIT Services/SighSeeingModel";


// ====== STYLE CONSTANTS ======
const styles = {
  container:
    "bg-white rounded-2xl shadow-md border border-gray-200 p-4 space-y-3 max-w-5xl mx-auto",

  header: "flex justify-between items-center border-b pb-2",

  input:
    "border border-gray-300 rounded-lg px-3 py-2 text-sm w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-gray-400 transition",

  label:
    "text-[11px] tracking-wide text-gray-500 font-semibold uppercase",

  grid4: "grid grid-cols-2 md:grid-cols-4 gap-3",
  grid3: "grid md:grid-cols-3 gap-3",
  grid2: "grid md:grid-cols-2 gap-3",

  button:
    "bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-lg text-sm shadow",
};

// ====== LABELS ======
const LABELS = {
  city: "City",
  activity: "Activity",
  date: "Date",
  slot: "Time Slot",
  pax: "Passengers",
  pickup: "Pickup",
  drop: "Drop",
  guide: "Guide",
  language: "Language",
  notes: "Notes",
};

// ====== OPTIONS ======
const OPTIONS = {
  timeSlots: [
    { label: "Morning", value: "MORNING" },
    { label: "Afternoon", value: "AFTERNOON" },
    { label: "Evening", value: "EVENING" },
    { label: "Night", value: "NIGHT" },
  ],
  guide: [
    { label: "Yes", value: "YES" },
    { label: "No", value: "NO" },
  ],
  languages: [
    { label: "English", value: "EN" },
    { label: "Hindi", value: "HI" },
    { label: "French", value: "FR" },
    { label: "Spanish", value: "ES" },
  ],
};

// ====== FIELD ======
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className={styles.label}>{label}</label>
    {children}
  </div>
);

// ====== SELECT ======
const Select = ({ options, value, onChange }) => (
  <select value={value} onChange={onChange} className={styles.input}>
    <option value="">Select</option>
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

// ====== MAIN COMPONENT ======
export default function SightseeingForm({ data, onChange, travelScope }) {
  // 🔥 merge model like TrainBookingForm pattern
  const form = {
    ...SightseeingModel,
    ...data,
  };

  const scopeLabel = travelScope ? ` (${travelScope})` : "";

  const updateField = (key, value) => {
    onChange?.({
      ...form,
      [key]: value,
    });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className="text-lg font-semibold text-gray-800">
          🗺️ Sightseeing / Attractions{scopeLabel}
        </h2>
      </div>

      {/* Top Row */}
      <div className={styles.grid4}>
        <Field label={LABELS.city}>
          <input
            className={styles.input}
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
          />
        </Field>

        <Field label={LABELS.activity}>
          <input
            className={styles.input}
            value={form.activity}
            onChange={(e) => updateField("activity", e.target.value)}
          />
        </Field>

        <Field label={LABELS.date}>
          <input
            type="date"
            className={styles.input}
            value={form.date}
            onChange={(e) => updateField("date", e.target.value)}
          />
        </Field>

        <Field label={LABELS.slot}>
          <Select
            options={OPTIONS.timeSlots}
            value={form.slot}
            onChange={(e) => updateField("slot", e.target.value)}
          />
        </Field>
      </div>

      {/* Pax + Locations */}
      <div className={styles.grid3}>
        <Field label={LABELS.pax}>
          <input
            type="number"
            className={styles.input}
            value={form.pax}
            onChange={(e) => updateField("pax", e.target.value)}
          />
        </Field>

        <Field label={LABELS.pickup}>
          <input
            className={styles.input}
            value={form.pickup}
            onChange={(e) => updateField("pickup", e.target.value)}
          />
        </Field>

        <Field label={LABELS.drop}>
          <input
            className={styles.input}
            value={form.drop}
            onChange={(e) => updateField("drop", e.target.value)}
          />
        </Field>
      </div>

      {/* Guide */}
      <div className={styles.grid3}>
        <Field label={LABELS.guide}>
          <Select
            options={OPTIONS.guide}
            value={form.guide}
            onChange={(e) => updateField("guide", e.target.value)}
          />
        </Field>

        {form.guide === "YES" && (
          <Field label={LABELS.language}>
            <Select
              options={OPTIONS.languages}
              value={form.language}
              onChange={(e) => updateField("language", e.target.value)}
            />
          </Field>
        )}
      </div>

      {/* Notes */}
      <div className={styles.grid2}>
        <Field label={LABELS.notes}>
          <textarea
            className={styles.input}
            rows={2}
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
          />
        </Field>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-2 border-t">
        <button className={styles.button}>
          Save Sightseeing
        </button>
      </div>
    </div>
  );
}