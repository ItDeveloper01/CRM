
import dayjs from "dayjs";

export const AirTicketingLeadObject = {

    id: null,

    airTicketType: "",
    onwardDate: null,
    returnDate: null,
    Sector: "",
    noOfTravelers: 0,
    travelClass: "",
    ticketType: "",
    airTicketStatus: "",
    visaStatus: null,
    passportValidityDate: null,
    overseasInsurance: "",
    airportTransport: "",

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

