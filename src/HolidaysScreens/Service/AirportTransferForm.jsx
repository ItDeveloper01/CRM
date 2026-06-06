import { useState, useEffect } from "react";

// ======================================================
// STYLES (ONE PLACE CONTROL)
// ======================================================

const styles = {

  card: `
    bg-white
    rounded-2xl
    shadow-md
    border
    border-gray-200
    p-4
    space-y-5
    max-w-5xl
    mx-auto
  `,

  section: `
    rounded-xl
    border
    border-gray-200
    bg-gray-50/60
    p-3
    space-y-3
  `,

  input: `
    w-full
    rounded-xl
    border
    border-gray-300
    bg-white
    px-3
    py-2
    text-sm
    shadow-sm
    transition
    focus:border-orange-400
    focus:ring-2
    focus:ring-orange-100
    focus:outline-none
    hover:border-gray-400
  `,

  select: `
    w-full
    rounded-xl
    border
    border-gray-300
    bg-white
    px-3
    py-2
    text-sm
    shadow-sm
    transition
    focus:border-orange-400
    focus:ring-2
    focus:ring-orange-100
    focus:outline-none
    hover:border-gray-400
  `,

  button: `
    bg-gradient-to-r
    from-orange-500
    to-orange-600
    hover:from-orange-600
    hover:to-orange-700
    text-white
    px-5
    py-2
    rounded-lg
    text-sm
    font-medium
    shadow
    transition
  `,

  toggle: (active) => `
    px-3
    py-1
    rounded-full
    text-xs
    font-semibold
    transition
    shadow-sm
    ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}
  `
};

// ======================================================
// FIELD COMPONENT
// ======================================================

const Field = ({ label, children, error }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] tracking-wide text-gray-500 font-semibold uppercase">
      {label}
    </label>

    {children}

    {error && (
      <p className="text-xs text-red-500">
        {error}
      </p>
    )}
  </div>
);

// ======================================================
// SECTION COMPONENT
// ======================================================

const Section = ({ icon, title, children }) => (
  <div className={styles.section}>
    <div className="flex items-center gap-2 text-gray-700">
      <span className="text-orange-500 text-sm">{icon}</span>
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function AirportTransferForm({
  data,
  onChange,
  travelScope
}) {

  const form = data || {};
  const [errors, setErrors] = useState({});
  const scopeLabel = travelScope ? ` (${travelScope})` : "";

  // ======================================================
  // AUTO ARRIVAL TIME
  // ======================================================

  useEffect(() => {

    if (
      form.autoFillTiming &&
      form.arrival?.flightTime
    ) {

      const date = new Date(
        `1970-01-01T${form.arrival.flightTime}`
      );

      date.setMinutes(date.getMinutes() + 45);

      const pickupTime =
        date.toTimeString().slice(0, 5);

      onChange({
        ...form,
        arrival: {
          ...form.arrival,
          pickupTime
        }
      });
    }

  }, [
    form.arrival?.flightTime,
    form.autoFillTiming
  ]);

  // ======================================================
  // AUTO DEPARTURE TIME
  // ======================================================

  useEffect(() => {

    if (
      form.autoFillTiming &&
      form.departure?.flightTime
    ) {

      const date = new Date(
        `1970-01-01T${form.departure.flightTime}`
      );

      date.setHours(date.getHours() - 2);

      const pickupTime =
        date.toTimeString().slice(0, 5);

      onChange({
        ...form,
        departure: {
          ...form.departure,
          pickupTime
        }
      });
    }

  }, [
    form.departure?.flightTime,
    form.autoFillTiming
  ]);

  // ======================================================
  // VALIDATION
  // ======================================================

  const validate = () => {

    let err = {};

    if (
      !form.arrival?.flightTime &&
      (form.transferType === "Arrival" || form.transferType === "Both")
    ) {
      err.arrivalFlightTime = "Required";
    }

    if (
      !form.departure?.flightTime &&
      (form.transferType === "Departure" || form.transferType === "Both")
    ) {
      err.departureFlightTime = "Required";
    }

    setErrors(err);
  };

  return (

    <div className={styles.card}>

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex justify-between items-center border-b pb-2">

        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          ✈️ Airport Transfer{scopeLabel}
        </h2>

        <button
          onClick={() =>
            onChange({
              ...form,
              autoFillTiming: !form.autoFillTiming
            })
          }
          className={styles.toggle(form.autoFillTiming)}
        >
          {form.autoFillTiming ? "Auto Timing" : "Manual"}
        </button>

      </div>

      {/* ====================================================== */}
      {/* TRANSFER SETUP */}
      {/* ====================================================== */}

      <Section icon="🧭" title="Transfer Setup">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          <Field label="Transfer Type">
            <select
              className={styles.select}
              value={form.transferType || ""}
              onChange={(e) =>
                onChange({
                  ...form,
                  transferType: e.target.value
                })
              }
            >
              <option>Arrival</option>
              <option>Departure</option>
              <option>Both</option>
            </select>
          </Field>

          <Field label="Trip Type">
            <select
              className={styles.select}
              value={form.tripType || ""}
              onChange={(e) =>
                onChange({
                  ...form,
                  tripType: e.target.value
                })
              }
            >
              <option>One Way</option>
              <option>Round Trip</option>
            </select>
          </Field>

          <Field label="City">
            <input
              className={styles.input}
              value={form.city || ""}
              onChange={(e) =>
                onChange({
                  ...form,
                  city: e.target.value
                })
              }
            />
          </Field>

          <Field label="Terminal">
            <input
              className={styles.input}
              value={form.terminal || ""}
              onChange={(e) =>
                onChange({
                  ...form,
                  terminal: e.target.value
                })
              }
            />
          </Field>

        </div>

      </Section>

      {/* ====================================================== */}
      {/* LOCATIONS */}
      {/* ====================================================== */}

      <Section icon="📍" title="Locations">

        <div className="grid md:grid-cols-2 gap-3">

          <Field label="Pickup Location">
            <input
              className={styles.input}
              value={form.pickupLocation || ""}
              onChange={(e) =>
                onChange({
                  ...form,
                  pickupLocation: e.target.value
                })
              }
            />
          </Field>

          <Field label="Drop Location">
            <input
              className={styles.input}
              value={form.dropLocation || ""}
              onChange={(e) =>
                onChange({
                  ...form,
                  dropLocation: e.target.value
                })
              }
            />
          </Field>

        </div>

      </Section>

      {/* ====================================================== */}
      {/* ARRIVAL */}
      {/* ====================================================== */}

      {(form.transferType === "Arrival" || form.transferType === "Both") && (

        <Section icon="🛬" title="Arrival Details">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            <Field label="Airline">
              <input
                className={styles.input}
                value={form.arrival?.airline || ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    arrival: {
                      ...form.arrival,
                      airline: e.target.value
                    }
                  })
                }
              />
            </Field>

            <Field label="Flight No.">
              <input
                className={styles.input}
                value={form.arrival?.flightNo || ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    arrival: {
                      ...form.arrival,
                      flightNo: e.target.value
                    }
                  })
                }
              />
            </Field>

            <Field label="Arrival Time" error={errors.arrivalFlightTime}>
              <input
                type="time"
                className={styles.input}
                value={form.arrival?.flightTime || ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    arrival: {
                      ...form.arrival,
                      flightTime: e.target.value
                    }
                  })
                }
              />
            </Field>

            <Field label="Pickup Time">
              <input
                type="time"
                className={styles.input}
                value={form.arrival?.pickupTime || ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    arrival: {
                      ...form.arrival,
                      pickupTime: e.target.value
                    }
                  })
                }
                disabled={form.autoFillTiming}
              />
            </Field>

          </div>

        </Section>
      )}

      {/* ====================================================== */}
      {/* DEPARTURE */}
      {/* ====================================================== */}

      {(form.transferType === "Departure" || form.transferType === "Both") && (

        <Section icon="🛫" title="Departure Details">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            <Field label="Airline">
              <input
                className={styles.input}
                value={form.departure?.airline || ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    departure: {
                      ...form.departure,
                      airline: e.target.value
                    }
                  })
                }
              />
            </Field>

            <Field label="Flight No.">
              <input
                className={styles.input}
                value={form.departure?.flightNo || ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    departure: {
                      ...form.departure,
                      flightNo: e.target.value
                    }
                  })
                }
              />
            </Field>

            <Field label="Departure Time" error={errors.departureFlightTime}>
              <input
                type="time"
                className={styles.input}
                value={form.departure?.flightTime || ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    departure: {
                      ...form.departure,
                      flightTime: e.target.value
                    }
                  })
                }
              />
            </Field>

            <Field label="Pickup Time">
              <input
                type="time"
                className={styles.input}
                value={form.departure?.pickupTime || ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    departure: {
                      ...form.departure,
                      pickupTime: e.target.value
                    }
                  })
                }
                disabled={form.autoFillTiming}
              />
            </Field>

          </div>

        </Section>
      )}

      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}

      <div className="flex justify-end pt-2 border-t">
        <button
          onClick={validate}
          className={styles.button}
        >
          Validate & Save
        </button>
      </div>

    </div>
  );
}