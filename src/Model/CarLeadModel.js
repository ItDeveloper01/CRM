
import dayjs from "dayjs";
export const CarLeadObject= {
    id: null,

    noOfTravelers: 0,
    vehicleType: null,
    dutyType: "",
    tripDescription: "",
    servingCity: null,
    travelDate: null,
    noOfDays: 0,
    requirementType: "",
    companyName:null,
    telephoneNo: null,
    specialRequirement: [],
    createdBy_UserID: "", // default user
    createdAt: new Date().toISOString(),   // ISO datetime "YYYY-MM-DDTHH:mm:ssZ"
    updatedAt: new Date().toISOString(),
    carCode: null,
    status: 1,// Open/In Process/Closed


    quoteGiven: "",
    notes: "",
    assigneeTo_UserID: "",

}

export const getEmptyCarLeadObj = () => {
    return { ...CarLeadObject,
                        createdAt: dayjs().toISOString(),
                        updatedAt: dayjs().toISOString()
    };
}