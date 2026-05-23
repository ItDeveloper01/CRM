// ======================================================
// AIRPORT TRANSFER MODEL
// ======================================================

export const AirportTransferModel = {

  // Basic Info
  transferID: null,

  transferType: "Arrival", // Arrival | Departure | Both
  tripType: "One Way",     // One Way | Round Trip

  city: "",
  terminal: "",

  pickupLocation: "",
  dropLocation: "",

  // UI Preference
  autoFillTiming: true,

  // ======================================================
  // ARRIVAL DETAILS
  // ======================================================

  arrival: {
    airline: "",
    flightNo: "",
    flightTime: "",
    pickupTime: "",
  },

  // ======================================================
  // DEPARTURE DETAILS
  // ======================================================

  departure: {
    airline: "",
    flightNo: "",
    flightTime: "",
    pickupTime: "",
  },

  // ======================================================
  // AUDIT
  // ======================================================

  status: "Active",

  createdAt: "",
  updatedAt: "",

  createdBy_UserID: null,
  updatedBy_UserID: null,
};