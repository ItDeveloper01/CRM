
// =================variant Object=======================
export const variantObj = {


    id: null,
    name: "",
    guideId: null,

    baseAmount: 0,
    discountPercent: 0,

    startDate: null,
    endDate: null,

    startLocation: "",
    endLocation: "",

    totalSeats: 0,
    occupiedSeats: 0,

    status: "",
    pickupPoints: [],

}

export const getEmptyVariantObj = () => {
    return structuredClone(variantObj);
}

export const pickupPointObj = {
    id: null,
    point: "",
    location: "",
    rate: 0,
    total: 0,
    occupied: 0
}

export const getEmptyPickupPointObj = () => {
    return structuredClone(pickupPointObj);
}


// ===============DayObject====================

export const dayObj = {
    id: null,
    title: "",

    activities: []

}

export const getEmptyItinerarydayObj = () => {
    return structuredClone(dayObj);
}

export const activityObj = {
    id: null,
    time: "",
    title: "",
    notes: ""
}

export const getEmptyActivityObj = () => {
    return structuredClone(activityObj);
}



// ======================= itinerary Object(main object)=========================
export const ItineraryObject = {
    itineraryId: null,

    // ===============================
    // BASIC DETAILS
    // ===============================

    itineraryBasicDetails: {
        itName: "",
        description: "",
        numDays: 0,
    },

    // ==================================
    // Variant Details
    // ==================================

    variantsDetails: [],

    // ====================================
    // Days Details
    // ====================================

    days: [],

}

export const getEmptyItineraryObj = () => {

    return structuredClone(ItineraryObject);
};


