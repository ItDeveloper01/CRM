import config from "../config";
import axios from "axios";




// ================= API URLs =================
const BASE_URL = config.apiUrl;

export const TABLE_API_MAP = {
  1: {
    fetch: "/MasterTables/GetEnquiryModeTable",
    save: "/MasterTables/SaveEnquiryModeTable",
    checkActiveRecords: "/MasterTables/CheckCanDeleteEnquiryMode" // ✅ NEW endpoint for delete validation
  },
  2: {
    fetch: "/MasterTables/GetEnquirySourceTable",
    save: "/MasterTables/SaveEnquirySourceTable",
    checkActiveRecords: "/MasterTables/CheckCanDeleteEnquirySource" // ✅ NEW endpoint for delete validation
  },
  3: {
    fetch: "/MasterTables/GetCustomerTypeTable",
    save: "/MasterTables/SaveCustomerTypeTable",
    checkActiveRecords: "/MasterTables/CheckCanDeleteCustomerType" // ✅ NEW endpoint for delete validation
  },
};

const GET_ENQUIRY_MODE_TABLE_API = BASE_URL + "/MasterTables/GetEnquiryModeTable";

const SAVE_TABLE_API = (tableId) => BASE_URL + `/tables/${tableId}/save`;


// ================= FETCH TABLES =================
export const fetchTablesApi = async (token) => {
    debugger;
  const tableArray=[];

  try {
    const response = await axios.get(GET_ENQUIRY_MODE_TABLE_API, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📊 Fetched tables data:", response.data);

     const enquiryTable = mapEnquiryModeTable(response.data);
     tableArray.push(enquiryTable);

    

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
export const saveTableApi = async (tableId, payload, token) => {
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
debugger;
export const checkActiveRecordsApi = async (tableId, rowId, token) => {
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

// ================= MOCK DATA (OPTIONAL) =================
export const fetchTablesMockApi = async () => {
  return [
    {
      id: 1,
      title: "Table 1",
      headers: ["Name", "Count", "Active"],
      rows: [
        { id: "1-1", Name: "Item A", Count: 3, Active: "Active" },
        { id: "1-2", Name: "Item B", Count: 5, Active: "Active" },
        { id: "1-3", Name: "Item C", Count: 2, Active: "Active" },
      ],
    },
    {
      id: 2,
      title: "Products",
      headers: ["Product", "Qty", "Active"],
      rows: [
        { id: "2-1", Product: "Prod X", Qty: 10, Active: "Active" },
        { id: "2-2", Product: "Prod Y", Qty: 0, Active: "Active" },
      ],
    },
    {
      id: 3,
      title: "Users",
      headers: ["User", "Score", "Active"],
      rows: [
        { id: "3-1", User: "Alice", Score: 42, Active: "Active" },
        { id: "3-2", User: "Bob", Score: 37, Active: "Active" },
      ],
    },
  ];
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
    title: "Enquiry Modes",
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
    title: "Enquiry Sources",
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
    title: "Customer Types",
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