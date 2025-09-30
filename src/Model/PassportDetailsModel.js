
export const PassportDetailsObject ={
    visaStatus: "",
    passportValidityDate: null,
    overseasInsurance: "",
};

export function getEmptyPassportDetailsObj(){

    return{...PassportDetailsObject
    }
}
