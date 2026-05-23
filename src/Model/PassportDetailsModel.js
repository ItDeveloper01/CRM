
export const PassportDetailsObject ={

     visaStatus: "",              // "Valid" | "In Process" | "Not Applied"
    passportValidity: "",        // "Checked" | "Not Checked" | "Not Sure"
    overseasInsurance: "",       // "Issued" | "Not Issued"
    passportValidityDate: null,    // YYYY-MM-DD

    
};

export function getEmptyPassportDetailsObj(){

    return{...PassportDetailsObject
    }
}
