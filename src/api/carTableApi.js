import config from "../config";
import axios from "axios";




// ================= API URLs =================
const BASE_URL = config.apiUrl;

export const TABLE_API_MAP = {
  1: {
    fetch: "/CarRentalMaster/GetCityMasterListTable",
    save: "/CarRentalMaster/SaveCityMasterListTable",
    //checkActiveRecords: "/CarRentalMaster/CheckCanDeleteEnquiryMode" // ✅ NEW endpoint for delete validation
  },
  2: {
    fetch: "/CarRentalMaster/GetVehicleTypeTable",
    save: "/CarRentalMaster/SaveSaveVehicleTypeDTOTable",
    //checkActiveRecords: "/CarRentalMaster/CheckCanDeleteEnquirySource" // ✅ NEW endpoint for delete validation
  },
  3: {
    fetch: "/CarRentalMaster/GetSpecialRequirementDTOTable",
    save: "/CarRentalMaster/SaveSpecialRequirementDTOTable",
    //checkActiveRecords: "/CarRentalMaster/CheckCanDeleteCustomerType" // ✅ NEW endpoint for delete validation
  },
};

const GET_ENQUIRY_MODE_TABLE_API = BASE_URL + "/CarRentalMaster/GetEnquiryModeTable";

const SAVE_TABLE_API = (tableId) => BASE_URL + `/tables/${tableId}/save`;


// ================= FETCH TABLES =================
export const fetchCarTablesApi = async (token) => {
    debugger;
  const tableArray=[];

  try {
    const response = await axios.get(BASE_URL + TABLE_API_MAP[1].fetch, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📊 Fetched tables data:", response.data);

     const enquiryTable = mapEnquiryModeTable(response.data);
     tableArray.push(enquiryTable);

     console.log("📊 Mapped City List Master table:", enquiryTable);

    

     const enquirySourceTable = await axios.get(BASE_URL + TABLE_API_MAP[2].fetch, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

     const mappedEnquirySourceTable = mapEnquirySourceTable(enquirySourceTable.data);
     tableArray.push(mappedEnquirySourceTable);
     console.log("📊 Mapped enquiry source table:", mappedEnquirySourceTable);


      const customerTypeTable = await axios.get(BASE_URL + TABLE_API_MAP[3].fetch, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

     const mappedCustomerTypeTable = mapCustomerTypeTable(customerTypeTable.data);
     tableArray.push(mappedCustomerTypeTable);
     console.log("📊 Mapped customer type table:", mappedCustomerTypeTable);


    return tableArray; // ✅ SAME as mock format
  } catch (error) {
    console.error("❌ Error fetching tables:", error);
    throw error;
  }
};

// ================= SAVE TABLE =================
export const saveCarTableApi = async (tableId, payload, token) => {
  try {

    debugger;
    let apiStr= config.apiUrl+TABLE_API_MAP[tableId].save;
    console.log("🚀 Saving table with payload:", payload);
    console.log("📡 API endpoint:", apiStr) ;
    
    let token= payload.currentUser.token;
    console.log("🔑 Using token:", token) ;


  const transferPayload = {
  RequestedBy_UserID: payload.currentUser.user.id,
    New_Rows: payload.newRows.map(row => ({
    Id: row.Id,
    PropertyName: row.Name, 
    IsActive: row.Active === "Active" ? true : false, // Convert to boolean,
    CreatedOn:new Date().toISOString(), // ✅ CORRECT,
      CreatedBy: payload.currentUser.user.id,
      UpdatedBy: payload.currentUser.user.id,
     
    })),

    Updated_Rows: payload.updatedRows.map(row => ({
    Id: row.Id,
    PropertyName: row.Name,
    IsActive: row.Active === "Active" ? true : false, // Convert to boolean,
    CreatedOn:new Date().toISOString(), // ✅ CORRECT,
      CreatedBy: payload.currentUser.user.id,
      UpdatedBy: payload.currentUser.user.id,
     
    })),

     Deleted_Rows: payload.deletedRows.map(row => ({
    Id: row.Id,
    PropertyName: row.Name,
    IsActive: row.Active === "Active" ? true : false, // Convert to boolean,
    CreatedOn:new Date().toISOString(), // ✅ CORRECT,
      CreatedBy: payload.currentUser.user.id,
      UpdatedBy: payload.currentUser.user.id,
     
    })),

  };


  debugger;
  console.log("Payload for transferring lead to selected user:", transferPayload);
    
  const response = await axios.post(
     apiStr, transferPayload,
      
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Table saved:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Error saving table:", error);
    throw error;
  }
};

export const checkActiveCarRecordsApi = async (tableId, rowId, token) => {
  try {
    const apiStr = BASE_URL + TABLE_API_MAP[tableId].checkActiveRecords;

    const response = await axios.get(apiStr, {
      params: {
        Name: rowId.Name,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error checking active records:", error);
    throw error;
  }
};


const enquiryModeColumns = [
  { key: "Id", label: "Id", editable: false },
  { key: "Name", label: "Name", editable: true },
  { key: "Active", label: "Active", editable: true, type: "toggle" },

  { key: "Created By", label: "Created By", editable: false, hideOnNew: true },
  { key: "Created On", label: "Created On", editable: false, hideOnNew: true }
];

const mapEnquiryModeTable = (data) => {
  debugger;
  return {
    id: 1,
    title: "City Master List",
    columns: enquiryModeColumns, // 👈 instead of headers
    headers: enquiryModeColumns, // for display in table header

    rows: data.map((item) => ({
      Id: item.id,
      Name: item.propertyName,
      Active: item.isActive ? "Active" : "Inactive",
      "Created By": item.createdBy,
      "Created On": item.createdOn,

      isNew: false,
      isDirty: false,
      isEditing: false,
      canBeDeleted: item.canBeDeleted, // ✅ NEW field for delete validation
      errors: {}
    }))
  };
};


const mapEnquirySourceTable = (data) => {
  return {
    id: 2,
    title: "Vehicle Types",
    columns: enquiryModeColumns, // 👈 instead of headers
    headers: enquiryModeColumns, // for display in table header

    rows: data.map((item) => ({
      Id: item.id,
      Name: item.propertyName,
      Active: item.isActive ? "Active" : "Inactive",
      "Created By": item.createdBy,
      "Created On": item.createdOn,

      isNew: false,
      isDirty: false,
      isEditing: false,
       canBeDeleted: item.canBeDeleted, // ✅ NEW field for delete validation
      errors: {}
    }))
  };
};

const mapCustomerTypeTable = (data) => {
  return {
    id: 3,
    title: "Special Requirements",
    columns: enquiryModeColumns, // 👈 instead of headers
    headers: enquiryModeColumns, // for display in table header

    rows: data.map((item) => ({
      Id: item.id,
      Name: item.propertyName,
      Active: item.isActive ? "Active" : "Inactive",
      "Created By": item.createdBy,
      "Created On": item.createdOn,

      isNew: false,
      isDirty: false,
      isEditing: false,
      canBeDeleted: item.canBeDeleted, // ✅ NEW field for delete validation
      
      errors: {}
    }))
  };
};

const createTable = ({ id, title, headers, data, rowMapper }) => {
  return {
    id,
    title,
    headers,
    rows: data.map((item, index) => ({
      id: `${id}-${index + 1}`,
      ...rowMapper(item),
    })),
  };
};