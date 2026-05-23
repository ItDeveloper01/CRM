// TrainBookingModel.js

export const TrainBookingModel = {
  tripType: "ONE_WAY",
  classType: "",
  mode: "Domestic",

  quota: "",
  fareType: "",

  passengers: 1,

  route: {
    from: "",
    to: ""
  },

  departure: {
    date: "",
    slot: "",
    time: ""
  },

  return: {
    date: "",
    slot: "",
    time: ""
  },

  passenger: {
    name: "",
    passport: "",
    age: "",
    nationality: ""
  }
};