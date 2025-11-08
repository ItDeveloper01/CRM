
import dayjs from "dayjs";
import { PassportDetailsObject } from "./PassportDetailsModel";

export const AirTicketingLeadObject = {

    id: null,

    airTicketType: "",
    onwardDate: null,
    returnDate: null,
    sector: "",
    noOfTravelers: 0,
    travelClass: "",
    ticketType: "",
    airTicketStatus: "",
    visaStatus: "",
    passportValidityDate: null,
    overseasInsurance: "",
   
   // ...PassportDetailsObject,
    airportTransport: "",

    createdBy_UserID: "", // default user
    createdAt: new Date().toISOString(),   // ISO datetime "YYYY-MM-DDTHH:mm:ssZ"
    updatedAt: new Date().toISOString(),

    airTicketCode: null,
    // status:"",
    status: 1,// Open/In Process/Closed
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

