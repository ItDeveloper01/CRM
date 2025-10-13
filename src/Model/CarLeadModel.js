
import dayjs from "dayjs";
export const CarLeadObject= {
    id: null,

    noOfTravelers: 0,
    vehicleType: "",
    dutyType: "",
    tripDescription: "",
    servingcity: "",
    travelDate: null,
    noOfDays: 0,
    requirementType: "",
    companyName:"",
    telephoneNo: null,
    specialRequirements: "",
    createdBy_UserID: "", // default user
    createdAt: new Date().toISOString(),   // ISO datetime "YYYY-MM-DDTHH:mm:ssZ"
    updatedAt: new Date().toISOString(),
    carCode: null,
    status: "Open",// Open/In Process/Closed


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