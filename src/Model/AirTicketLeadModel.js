
import dayjs from "dayjs";
import { PassportDetailsObject } from "./PassportDetailsModel";

export const AirTicketingLeadObject = {

    id: null,

    airTicketType: "",
    onwardDate: null,
    returnDate: null,
    sector: "",
    noOfTravelers: 0,
    travelClass: null,
    ticketType: null,
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
    assigneeTo_UserID: "",
    updatedBy_UserID: "",

    quoteAmount :0,
  discountAmount: 0,
  finalAmount: 0,

};

export function getEmptyAirTicketObj(){

    return{...AirTicketingLeadObject,
                        createdAt: dayjs().toISOString(),
                        updatedAt: dayjs().toISOString()

    }
}

