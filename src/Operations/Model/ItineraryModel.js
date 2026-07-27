
// =================variant Object=======================
export const variantObj = {


    id: null,
    variantsName: "",
    // status: "",
    status: null,
    startLocation: "",
    endLocation: "",
    TargetAudienceId: null,

    startDate: null,
    endDate: null,

    perPaxBaseAmount: 0,
    discountPercent: 0,
    guideId: null,


    totalSeats: 0,
    occupiedSeats: 0,

     createdAt: null,
  updatedAt: null,
  createdBy_UserID:'',
  UpdatedBy_UserID :'',
    pickupPoints: [],

}

export const getEmptyVariantObj = () => {
    return structuredClone(variantObj);
}

export const pickupPointObj = {
    id: null,
    pickupPoint: "",
    pickupCity: "",
    ratePerPax: 0,
    // total: 0,
    // occupied: 0
     createdAt: null,
  updatedAt: null,
  createdBy_UserID:'',
  UpdatedBy_UserID :'',
}

export const getEmptyPickupPointObj = () => {
    return structuredClone(pickupPointObj);
}


// ===============DayObject====================

export const dayObj = {
    id: null,
    dayTitle: "",

    activities: [],
  createdAt: null,
  updatedAt: null,
  createdBy_UserID:'',
  UpdatedBy_UserID :'',

}

export const getEmptyItinerarydayObj = () => {
    return structuredClone(dayObj);
}

export const activityObj = {
    id: null,
    activityTime: "",
    activityTitle: "",
    activityNotes: "",
    createdAt: null,
    updatedAt: null,
    createdBy_UserID:'',
    UpdatedBy_UserID :'',
}

export const getEmptyActivityObj = () => {
    return structuredClone(activityObj);
}



// ======================= itinerary Object(main object)=========================
export const ItineraryObject = {
    Id: null,

    // ===============================
    // BASIC DETAILS
    // ===============================

    itineraryBasicDetails: {
        tourCode:"",
        itName: "",
        description: "",
        numDays: 0,
        travelScope :null
    },

    // ==================================
    // Variant Details
    // ==================================

    variantsDetails: [],

    // ====================================
    // Days Details
    // ====================================

    days: [],

  createdAt: null,
  updatedAt: null,
  createdBy_UserID:'',
  UpdatedBy_UserID :'',

}

export const getEmptyItineraryObj = () => {

    return structuredClone(ItineraryObject);
};


