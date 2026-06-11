import { useEffect, useMemo, useState } from "react";
import { TrainBookingModel } from "../../Model/FIT Services/TrainBookingModel";
import { fetchCountries } from "../../api/commonApi";

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
  const form = useMemo(() => {
    return {
      ...TrainBookingModel,
      ...data,
      mode: travelScope || "Domestic",
      country: data?.country || "",
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
  }, [data, travelScope]);

  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(false);

  useEffect(() => {
    if (form.mode !== "International") return;

    let mounted = true;
    setCountriesLoading(true);

    fetchCountries()
      .then((list) => {
        if (!mounted) return;
        setCountries(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Failed to load countries:", err);
        if (!mounted) return;
        setCountries([]);
      })
      .finally(() => {
        if (!mounted) return;
        setCountriesLoading(false);
      });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.mode]);

  const SLOTS = [
    { label: "Morning (06:00-12:00)", value: "MORNING" },
    { label: "Afternoon (12:00-18:00)", value: "AFTERNOON" },
    { label: "Evening (18:00-23:00)", value: "EVENING" },
    { label: "Night (23:00-06:00)", value: "NIGHT" }
  ];

  const set = (updated) => onChange(updated);

  return (
    <div className={styles.container}>
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}
      <div className={styles.header}>
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
            onChange={(e) => set({ ...form, tripType: e.target.value })}
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
            onChange={(e) => set({ ...form, classType: e.target.value })}
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
            onChange={(e) => set({ ...form, quota: e.target.value })}
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
            onChange={(e) => set({ ...form, fareType: e.target.value })}
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
      <div className={styles.grid3}>
           {form.mode === "International" && (
          <Field label="Country">
            <select
              className={styles.input}
              value={form.country || ""}
              onChange={(e) => set({ ...form, country: e.target.value })}
              disabled={countriesLoading}
            >
              <option value="">{countriesLoading ? "Loading..." : "Select Country"}</option>
              {countries.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        )}
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
      {/* SCHEDULE (DEPARTURE / RETURN) */}
      {/* ====================================================== */}
      <div className={styles.grid4}>
        <Field label="Departure Date">
          <input
            type="date"
            className={styles.input}
            value={form.departure?.date || ""}
            onChange={(e) =>
              set({
                ...form,
                departure: {
                  ...form.departure,
                  date: e.target.value
                }
              })
            }
          />
        </Field>

        <Field label="Departure Slot">
          <select
            className={styles.input}
            value={form.departure?.slot || ""}
            onChange={(e) =>
              set({
                ...form,
                departure: {
                  ...form.departure,
                  slot: e.target.value
                }
              })
            }
          >
            <option value="">Select Slot</option>
            {SLOTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Departure Time">
          <input
            type="time"
            className={styles.input}
            value={form.departure?.time || ""}
            onChange={(e) =>
              set({
                ...form,
                departure: {
                  ...form.departure,
                  time: e.target.value
                }
              })
            }
          />
        </Field>

        <div className="hidden md:block" />
      </div>

      {form.tripType === "ROUND_TRIP" && (
        <div className={styles.grid4}>
          <Field label="Return Date">
            <input
              type="date"
              className={styles.input}
              value={form.return?.date || ""}
              onChange={(e) =>
                set({
                  ...form,
                  return: {
                    ...form.return,
                    date: e.target.value
                  }
                })
              }
            />
          </Field>

          <Field label="Return Slot">
            <select
              className={styles.input}
              value={form.return?.slot || ""}
              onChange={(e) =>
                set({
                  ...form,
                  return: {
                    ...form.return,
                    slot: e.target.value
                  }
                })
              }
            >
              <option value="">Select Slot</option>
              {SLOTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Return Time">
            <input
              type="time"
              className={styles.input}
              value={form.return?.time || ""}
              onChange={(e) =>
                set({
                  ...form,
                  return: {
                    ...form.return,
                    time: e.target.value
                  }
                })
              }
            />
          </Field>

          <div className="hidden md:block" />
        </div>
      )}

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

        <Field label="Nationality">
          <input
            className={styles.input}
            value={form.passenger?.nationality || ""}
            onChange={(e) =>
              set({
                ...form,
                passenger: {
                  ...form.passenger,
                  nationality: e.target.value
                }
              })
            }
          />
        </Field>

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

