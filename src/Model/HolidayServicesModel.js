// ======================================================
// 🚆 DOMESTIC TRAIN BOOKING MODEL
// ======================================================

export const DomesticTrainBookingModel = {

    bookingID: null,

    tripType: "One Way",

    travelType: "Domestic",

    classType: "Sleeper",

    quota: "General",

    passengers: [],

    fromRoute: "",

    toRoute: "",

    departureDate: "",

    departureSlot: "",

    departureTime: "",

    notes: ""
};

export const getEmptyDomesticTrainBookingObj = () => {

    return structuredClone(DomesticTrainBookingModel);
};
// ======================================================
// 🚆 TRAIN PASSENGER MODEL
// ======================================================

export const TrainPassengerModel = {

    passengerName: "",

    age: null,

    dob: "",

    gender: "",

    berthPreference: "",

    seniorCitizen: false
};

export const getEmptyTrainPassengerObj = () => {

    return structuredClone(TrainPassengerModel);
};
// ======================================================
// 🚗 CAR RENTAL MODEL
// ======================================================

export const CarRentalBookingModel = {

    bookingID: null,

    tripType: "Local",

    vehicleType: "Sedan",

    noOfVehicles: 1,

    driverType: "With Driver",

    pickupLocation: "",

    pickupDate: "",

    pickupTime: "",

    dropDate: "",

    dropTime: "",

    luggage: "",

    specialRequest: "",

    notes: ""
};

export const getEmptyCarRentalBookingObj = () => {

    return structuredClone(CarRentalBookingModel);
};
// ======================================================
// 🧭 AIRPORT TRANSFER MODEL
// ======================================================

export const TransferBookingModel = {

    bookingID: null,

    transferType: "Arrival",

    tripType: "One Way",

    city: "",

    terminal: "",

    pickupLocation: "",

    dropLocation: "",

    airline: "",

    flightNo: "",

    arrivalTime: "",

    pickupTime: "",

    noOfPassengers: 1,

    vehicleType: "",

    luggageCount: 0,

    notes: ""
};

export const getEmptyTransferBookingObj = () => {

    return structuredClone(TransferBookingModel);
};



// ======================================================
// 🗺️ SIGHTSEEING / ATTRACTIONS MODEL
// ======================================================

export const SightseeingBookingModel = {

    bookingID: null,

    // UI
    icon: "",

    serviceType: "sightseeing",

    serviceName: "Sightseeing / Attractions",

    // Basic Info
    city: "",

    activity: "",

    activityType: "",

    activityCategory: "",

    // Schedule
    activityDate: null,

    timeSlot: "",

    // Passenger Info
    noOfPassengers: 1,

    passengerList: [],

    // Pickup / Drop
    pickupRequired: false,

    pickupLocation: "",

    dropRequired: false,

    dropLocation: "",

    // Guide
    guideRequired: false,

    guideType: "",

    // Extra Options
    entryTicketsIncluded: false,

    privateTour: false,

    durationHours: null,

    vehicleType: "",

    // Notes
    notes: "",

    specialInstructions: "",

    // Status
    status: "Pending"
};

export const getEmptySightseeingBookingObj = () => {

    return structuredClone(SightseeingBookingModel);
};

const servicesObj = {

    // ==================================================
    // 🚆 TRAIN SERVICES
    // ==================================================

    trainTicketBookingServices: [

        // {
        //     serviceID: 1,

        //     serviceType: "train",

        //     serviceName: "Domestic Train Booking",

        //     category: "Transport",

        //     status: "Pending",

        //     estimatedCost: 5000,

        //     finalCost: 4500,

        //     bookings: [

        //         {
        //             bookingID: 101,

        //             tripType: "One Way",

        //             travelType: "Domestic",

        //             classType: "Sleeper",

        //             quota: "General",

        //             fromRoute: "Mumbai",

        //             toRoute: "Delhi",

        //             departureDate: "2026-06-10",

        //             departureSlot: "Morning",

        //             departureTime: "08:30",

        //             passengers: []
        //         }
        //     ]
        // }
    ],

    // ==================================================
    // ✈️ FLIGHT SERVICES
    // ==================================================

    flightServices: [

        // {
        //     serviceID: 2,

        //     serviceType: "flight",

        //     serviceName: "Flight Booking",

        //     bookings: []
        // }
    ],

    // ==================================================
    // 🏨 HOTEL SERVICES
    // ==================================================

    hotelBookingServices: [

        // {
        //     serviceID: 3,

        //     serviceType: "hotel",

        //     serviceName: "Hotel Booking",

        //     bookings: []
        // }
    ],

    // ==================================================
    // 🚗 CAR RENTAL SERVICES
    // ==================================================

    carRentalServices: [

        // {
        //     serviceID: 4,

        //     serviceType: "car",

        //     serviceName: "Car Rental",

        //     bookings: [ getEmptyCarRentalBookingObj()    ]
        // }
    ],

    // ==================================================
    // 🧭 TRANSFER SERVICES
    // ==================================================

    transferServices: [

        // {
        //     serviceID: 5,

        //     serviceType: "transfer",

        //     serviceName: "Airport Transfer",

        //     bookings: [ getEmptyTransferBookingObj() ]
        // }
    ],

    // ==================================================
    // 🌍 SIGHTSEEING SERVICES
    // ==================================================

    sightseeingServices: [

        // {
        //     serviceID: 6,

        //     serviceType: "sightseeing",

        //     serviceName: "Sightseeing",

        //     bookings: [ getEmptySightseeingBookingObj() ]
        // }
    ],

    // ==================================================
    // 🎫 EVENT SERVICES
    // ==================================================

    eventServices: [

        {
            serviceID: 7,

            serviceType: "event",

            serviceName: "Event Booking",

            bookings: []
        }
    ],

};


export const getEmptyHolidayServiceObj = () => {

    return structuredClone(servicesObj);
};