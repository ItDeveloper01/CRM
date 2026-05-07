import axios from "axios";
import config from "../config";

const BASE_URL = config.apiUrl;

export const TABLE_API_MAP = {
    1:{
        fetch : "/VISAMasterTable/GetPurposeOfTravelTable",
        save : "/VISAMasterTable/SavePurposeOfTravelDTOTable",
        title : "Purpose of Travel List"
    },
    2:{
      fetch : "/VISAMasterTable/GetVisaTypesTable",
      save : "/VISAMasterTable/SaveVisaTypesTable",
      title : "Visa Type List"
    },
    3:{
      fetch : "/VISAMasterTable/GetNoOfEntriesTable",
      save : "/VISAMasterTable/SaveNoOfVISAEntriesTable",
      title : "No of Entries List"
    
    }
};

const   SAVE_TABLE_API = (tableId) => BASE_URL + `/tables/${tableId}/save`;

// ===========Fetch Table Api=====================
export const fetchVisaTableApi = async (token) => 
{
    const tableArray=[];
    debugger;
    try 
    {
        for(const tableId of Object.keys(TABLE_API_MAP)){
           const {fetch} = TABLE_API_MAP[tableId];
           
           console.log(tableId,TABLE_API_MAP[tableId])
           if(!fetch) continue;
           const response = await axios.get(BASE_URL + fetch, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          
          const mappedTable = mapTableData(Number(tableId), response.data);
          tableArray.push(mappedTable);
          console.log(`📊 Mapped table ${tableId}:`, mappedTable);

        }
        return tableArray;
    } 
    catch (error) 
    {
        console.error("❌ Error fetching tables:", error);
        throw error;
        
    }
};

// =============Save Table========================
export const saveVisaTableApi = async (tableId, payload, token) => {
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
export const checkActiveVisaRecordsApi = async (tableId, rowId, token) => {
  try {
    debugger;
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


const mapTableData = (tableId, data) => {
  return {
    id: tableId,
    title: TABLE_API_MAP[tableId].title,
    columns: enquiryModeColumns,
    headers: enquiryModeColumns,

    rows: data.map((item) => ({
      Id: item.id,
      Name: item.propertyName,
      Active: item.isActive ? "Active" : "Inactive",
      "Created By": item.createdBy,
      "Created On": item.createdOn,

      isNew: false,
      isDirty: false,
      isEditing: false,
      canBeDeleted: item.canBeDeleted,
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