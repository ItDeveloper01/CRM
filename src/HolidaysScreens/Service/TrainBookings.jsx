import { TrainBookingModel } from "../../Model/FIT Services/TrainBookingModel";

// ======================================================
// STYLES
// ======================================================
const styles = {
  container: `
    bg-white rounded-2xl shadow-md border border-gray-200
    p-4 space-y-4 max-w-5xl mx-auto
  `,

  header: `
    flex justify-between items-center border-b pb-2
  `,

  input: `
    w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
    bg-white shadow-sm focus:outline-none focus:ring-2
    focus:ring-orange-400 focus:border-orange-400
    hover:border-gray-400 transition
  `,

  label: `
    text-[11px] tracking-wide text-gray-500 font-semibold uppercase
  `,

  grid4: "grid grid-cols-2 md:grid-cols-4 gap-3",
  grid3: "grid md:grid-cols-3 gap-3",
  grid2: "grid md:grid-cols-2 gap-3"
};

// ======================================================
// FIELD WRAPPER
// ======================================================
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className={styles.label}>{label}</label>
    {children}
  </div>
);

// ======================================================
// OPTIONS
// ======================================================
const OPTIONS = {
  quota: [
    { label: "General", value: "GENERAL" },
    { label: "Tatkal", value: "TATKAL" }
  ],
  fareType: [
    { label: "Standard", value: "STANDARD" },
    { label: "Flexible", value: "FLEX" }
  ]
};

// ======================================================
// COMPONENT
// ======================================================
export default function TrainBookingForm({ data, onChange, travelScope }) {
  const form = {
    ...TrainBookingModel,
    ...data,
    mode: travelScope || "Domestic",
    route: {
      from: "",
      to: "",
      ...(data?.route || {})
    },
    passenger: {
      name: "",
      passport: "",
      age: "",
      ...(data?.passenger || {})
    }
  };

  const set = (updated) => onChange(updated);

  return (
    <div className={styles.container}>

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}
  <div className={styles.header}>
  
  {/* Title */}
  <h2 className="text-lg font-semibold text-gray-800 whitespace-nowrap">
    {form.mode === "Domestic"
      ? "🚆 Domestic Train Booking"
      : "🌍 🚆 International Train Booking"}
  </h2>

</div>

      {/* ====================================================== */}
      {/* TOP ROW */}
      {/* ====================================================== */}
      <div className={styles.grid4}>

        {/* TRIP TYPE */}
        <Field label="Trip Type">
          <select
            className={styles.input}
            value={form.tripType || "ONE_WAY"}
            onChange={(e) =>
              set({ ...form, tripType: e.target.value })
            }
          >
            <option value="ONE_WAY">One Way</option>
            <option value="ROUND_TRIP">Round Trip</option>
          </select>
        </Field>

        {/* CLASS */}
        <Field label="Class">
          <select
            className={styles.input}
            value={form.classType || ""}
            onChange={(e) =>
              set({ ...form, classType: e.target.value })
            }
          >
            {(form.mode === "Domestic"
              ? [
                  { label: "Sleeper", value: "SL" },
                  { label: "3AC", value: "3AC" },
                  { label: "2AC", value: "2AC" },
                  { label: "1AC", value: "1AC" }
                ]
              : [
                  { label: "2nd Class", value: "SECOND" },
                  { label: "1st Class", value: "FIRST" },
                  { label: "Business", value: "BUSINESS" }
                ]
            ).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        {/* QUOTA */}
        <Field label="Quota">
          <select
            className={styles.input}
            value={form.quota || ""}
            onChange={(e) =>
              set({ ...form, quota: e.target.value })
            }
          >
            {OPTIONS.quota.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        {/* FARE TYPE */}
        <Field label="Fare Type">
          <select
            className={styles.input}
            value={form.fareType || ""}
            onChange={(e) =>
              set({ ...form, fareType: e.target.value })
            }
          >
            {OPTIONS.fareType.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

      </div>

      {/* ====================================================== */}
      {/* ROUTE */}
      {/* ====================================================== */}
      <div className={styles.grid2}>

        <Field label="From">
          <input
            className={styles.input}
            value={form.route?.from || ""}
            onChange={(e) =>
              set({
                ...form,
                route: {
                  ...form.route,
                  from: e.target.value
                }
              })
            }
          />
        </Field>

        <Field label="To">
          <input
            className={styles.input}
            value={form.route?.to || ""}
            onChange={(e) =>
              set({
                ...form,
                route: {
                  ...form.route,
                  to: e.target.value
                }
              })
            }
          />
        </Field>

      </div>

      {/* ====================================================== */}
      {/* PASSENGER */}
      {/* ====================================================== */}
      <div className={styles.grid3}>

        <Field label="Name">
          <input
            className={styles.input}
            value={form.passenger?.name || ""}
            onChange={(e) =>
              set({
                ...form,
                passenger: {
                  ...form.passenger,
                  name: e.target.value
                }
              })
            }
          />
        </Field>

        {form.mode === "International" && (
          <Field label="Passport">
            <input
              className={styles.input}
              value={form.passenger?.passport || ""}
              onChange={(e) =>
                set({
                  ...form,
                  passenger: {
                    ...form.passenger,
                    passport: e.target.value
                  }
                })
              }
            />
          </Field>
        )}

        <Field label="Age">
          <input
            className={styles.input}
            value={form.passenger?.age || ""}
            onChange={(e) =>
              set({
                ...form,
                passenger: {
                  ...form.passenger,
                  age: e.target.value
                }
              })
            }
          />
        </Field>

      </div>

    </div>
  );
}