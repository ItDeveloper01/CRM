
import dayjs from "dayjs";

export const AirTicketingLeadObject = {

    id: null,

    airTicketType: "",
    onwordDate: "",
    returnDate: "",
    Sector: "",
    noOfTravelers: 0,
    travelClass: "",
    ticketType: "",
    airTicketStatus: "",
    visaStatus: "",
    passportValidityDate: "",
    overseasInsurance: "",

    createdBy_UserID: "", // default user
    createdAt: new Date().toISOString(),   // ISO datetime "YYYY-MM-DDTHH:mm:ssZ"
    updatedAt: new Date().toISOString(),

    airTicketCode: null,
    status: "Open",// Open/In Process/Closed
    // NotMapped properties (UI/API only)

    quoteGiven: "",
    notes: "",
    assigneeTo_UserID: ""

};

export function getEmptyAirTicketObj(){

    return{...AirTicketingLeadObject,
                        createdAt: dayjs().toISOString(),
                        updatedAt: dayjs().toISOString()

    }
}

