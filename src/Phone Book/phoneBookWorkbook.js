import ExcelJS from "exceljs";
import { validatePhonePair } from "./phoneValidation";

export const PHONEBOOK_TYPES = ["Primary", "Secondary", "Work", "Office", "Other"];
export const EMERGENCY_CONTACT_SLOTS = [1, 2, 3];

export const PHONEBOOK_WORKBOOK_HEADERS = [
  "Prefix",
  "First name",
  "Middle name",
  "Last name",
  "Gender",
  "Date of birth",
  "Home branch",
  "Home branch ID",
  "Customer type",
  "Customer type ID",
  "Company",
  "Designation",
  "Industry",
  "Department",
  "Customer since",
  "City",
  "Area",
  "Marital status",
  "Source",
  "Customer ID",
  "Category",
  ...PHONEBOOK_TYPES.flatMap((type) => [
    `${type} country code`,
    `${type} phone`,
    `${type} WhatsApp`,
    `${type} email`,
  ]),
  ...EMERGENCY_CONTACT_SLOTS.flatMap((slot) => [
    `Emergency ${slot} country code`,
    `Emergency ${slot} phone`,
    `Emergency ${slot} relative name`,
    `Emergency ${slot} relationship`,
    `Emergency ${slot} profession`,
  ]),
];

const REQUIRED_HEADERS = [
  "Prefix",
  "First name",
  "Last name",
  "Gender",
  "Home branch",
  "Primary country code",
  "Primary phone",
];

const LOOKUP_COLUMNS = [
  { key: "prefixes", name: "PhonebookPrefixes", title: "Prefix", column: 1 },
  { key: "genders", name: "PhonebookGenders", title: "Gender", column: 2 },
  { key: "branches", name: "PhonebookBranches", title: "Home Branch", column: 3 },
  { key: "branchIds", title: "Home Branch ID", column: 4 },
  { key: "customerTypes", name: "PhonebookCustomerTypes", title: "Customer Type", column: 5 },
  { key: "customerTypeIds", title: "Customer Type ID", column: 6 },
  { key: "countries", title: "Country", column: 7 },
  { key: "countryIds", title: "Country ID", column: 8 },
  { key: "countryCodes", name: "PhonebookCountryCodes", title: "Country Code", column: 9 },
  { key: "relationships", name: "PhonebookRelationships", title: "Relationship", column: 10 },
  { key: "relationshipCodes", title: "Relationship Code", column: 11 },
  { key: "cities", name: "PhonebookCities", title: "City", column: 12 },
  { key: "areas", name: "PhonebookAreas", title: "Area", column: 13 },
  { key: "maritalStatuses", name: "PhonebookMaritalStatuses", title: "Marital Status", column: 14 },
  { key: "categories", name: "PhonebookCategories", title: "Category", column: 15 },
  { key: "yesNo", name: "PhonebookYesNo", title: "WhatsApp", column: 16 },
];

const normalize = (value) => String(value ?? "").trim().toLowerCase();
const digits = (value) => String(value ?? "").replace(/\D/g, "");
const branchName = (branch) => branch.branch ?? branch.branchName ?? branch.BranchName;
const getCustomerTypeName = (type) =>
  type.customerType ?? type.CustomerType ?? type.name ?? type.Name;
const countryName = (country) => country.countryName ?? country.CountryName;
const countryId = (country) => country.id ?? country.Id;
const countryMobileCode = (country) => country.mobileCode ?? country.MobileCode;
const relationName = (relation) => relation.name ?? relation.Name;
const relationCode = (relation) => relation.code ?? relation.Code;
const cellText = (value, header = "") => {
  if (value == null) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (
    typeof value === "number" &&
    /date/i.test(header) &&
    value > 0
  ) {
    return new Date(Date.UTC(1899, 11, 30) + value * 86400000)
      .toISOString()
      .slice(0, 10);
  }
  if (typeof value === "object") {
    if ("formula" in value) {
      return value.result == null ? "" : cellText(value.result, header);
    }
    if ("text" in value) return String(value.text ?? "");
    if ("result" in value) return cellText(value.result);
    if (Array.isArray(value.richText)) {
      return value.richText.map((item) => item.text || "").join("");
    }
  }
  return String(value).trim();
};

const listValues = (values) => {
  const seen = new Set();
  return (values || []).filter((value) => {
    const text = String(value ?? "").trim();
    if (!text || seen.has(text)) return false;
    seen.add(text);
    return true;
  });
};
const columnName = (index) => {
  let number = index;
  let name = "";
  while (number > 0) {
    const remainder = (number - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    number = Math.floor((number - 1) / 26);
  }
  return name;
};

export const createPhoneBookLookups = ({
  countries = [],
  branches = [],
  customerTypes = [],
  relationships = [],
  cityAreas = {},
} = {}) => ({
  prefixes: ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."],
  genders: ["Female", "Male"],
  branches: branches.map(branchName).filter(Boolean),
  customerTypes: customerTypes.map(getCustomerTypeName).filter(Boolean),
  branchIds: branches.map((branch) => branch.id ?? branch.Id).filter((id) => id != null),
  customerTypeIds: customerTypes
    .map((type) => type.id ?? type.Id)
    .filter((id) => id != null),
  countries: countries.map(countryName).filter(Boolean),
  countryIds: countries.map(countryId).filter((id) => id != null),
  countryCodes: countries.map(countryMobileCode).filter(Boolean),
  relationshipCodes: relationships.map(relationCode).filter(Boolean),
  cities: Object.keys(cityAreas),
  areas: [...new Set(Object.values(cityAreas).flat())],
  yesNo: ["Yes", "No"],
  maritalStatuses: [
    "Single",
    "Married",
    "Divorced",
    "Widowed",
    "Separated",
    "Prefer not to say",
  ],
  categories: [
    "Customer",
    "VIP",
    "VVIP",
    "Holiday",
    "Visa",
    "Air ticket",
    "Corporate",
    "Supplier",
    "Other",
  ],
  relationships: relationships.map(relationName).filter(Boolean),
});

export async function buildPhoneBookWorkbook(rows, lookupData) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Girikand CRM";
  workbook.subject = "Phonebook import and export";
  workbook.title = "Phonebook contacts";

  const sheet = workbook.addWorksheet("Phonebook", {
    views: [{ state: "frozen", ySplit: 3 }],
  });
  const endColumn = columnName(PHONEBOOK_WORKBOOK_HEADERS.length);
  sheet.mergeCells(`A1:${endColumn}1`);
  sheet.getCell("A1").value = "Girikand CRM — Phonebook contacts";
  sheet.getCell("A1").font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
  sheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A8A" } };
  sheet.getCell("A1").alignment = { vertical: "middle" };
  sheet.getRow(1).height = 28;
  sheet.mergeCells(`A2:${endColumn}2`);
  sheet.getCell("A2").value =
    "Use the dropdowns where provided. Keep phone country code and number together. Add up to three emergency contacts.";
  sheet.getCell("A2").font = { italic: true, color: { argb: "FF475569" } };

  const headerRow = sheet.getRow(3);
  headerRow.values = PHONEBOOK_WORKBOOK_HEADERS;
  headerRow.height = 32;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } };
    cell.alignment = { vertical: "middle", wrapText: true };
  });
  sheet.autoFilter = `A3:${endColumn}${Math.max(3, rows.length + 3)}`;
  sheet.columns = PHONEBOOK_WORKBOOK_HEADERS.map((header) => ({
    key: header,
    width: header.includes("relative name") || header === "First name" || header === "Last name"
      ? 22
      : header.includes("country code") || header === "Gender" || header === "Prefix"
        ? 14
        : 18,
  }));
  PHONEBOOK_WORKBOOK_HEADERS.forEach((header, index) => {
    if (/date/i.test(header)) sheet.getColumn(index + 1).numFmt = "yyyy-mm-dd";
    if (/phone|country code/i.test(header)) sheet.getColumn(index + 1).numFmt = "@";
  });
  headerRow.values = PHONEBOOK_WORKBOOK_HEADERS;
  rows.forEach((row) => {
    const values = PHONEBOOK_WORKBOOK_HEADERS.map((header) => row[header] ?? null);
    sheet.addRow(values);
  });

  const lookupSheet = workbook.addWorksheet("Reference values", {
    views: [{ state: "frozen", ySplit: 2 }],
  });
  lookupSheet.mergeCells("A1:P1");
  lookupSheet.getCell("A1").value = "Reference values — use these exact values in the Phonebook sheet";
  lookupSheet.getCell("A1").font = { bold: true, size: 15, color: { argb: "FFFFFFFF" } };
  lookupSheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A8A" } };
  lookupSheet.getRow(1).height = 26;
  LOOKUP_COLUMNS.forEach(({ key, name, title, column }) => {
    const values = listValues(lookupData?.[key]);
    const header = lookupSheet.getCell(2, column);
    header.value = title;
    header.font = { bold: true, color: { argb: "FFFFFFFF" } };
    header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } };
    header.alignment = { vertical: "middle", wrapText: true };
    values.forEach((value, index) => {
      lookupSheet.getCell(index + 3, column).value = value;
    });
    if (name) {
      const endRow = Math.max(3, values.length + 2);
      workbook.definedNames.add(
        `'Reference values'!$${columnName(column)}$3:$${columnName(column)}$${endRow}`,
        name,
      );
    }
    lookupSheet.getColumn(column).width = title.includes("ID") ? 16 : 24;
  });
  const referenceEndRow = Math.max(
    2,
    ...LOOKUP_COLUMNS.map(({ key }) => (lookupData?.[key] || []).length + 2),
  );
  lookupSheet.autoFilter = `A2:P${referenceEndRow}`;
  LOOKUP_COLUMNS.forEach(({ key, name }) => {
    if (!name) return;
    PHONEBOOK_WORKBOOK_HEADERS.forEach((header, headerIndex) => {
      const needsValidation =
        (key === "prefixes" && header === "Prefix") ||
        (key === "genders" && header === "Gender") ||
        (key === "branches" && header === "Home branch") ||
        (key === "customerTypes" && header === "Customer type") ||
        (key === "countryCodes" && header.endsWith("country code")) ||
        (key === "cities" && header === "City") ||
        (key === "areas" && header === "Area") ||
        (key === "yesNo" && header.endsWith("WhatsApp")) ||
        (key === "maritalStatuses" && header === "Marital status") ||
        (key === "categories" && header === "Category") ||
        (key === "relationships" && header.endsWith("relationship"));
      if (needsValidation) {
        const excelColumn = columnName(headerIndex + 1);
        const lastRow = Math.max(1003, rows.length + 3);
        for (let rowNumber = 4; rowNumber <= lastRow; rowNumber += 1) {
          sheet.getCell(`${excelColumn}${rowNumber}`).dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: [`=${name}`],
            showErrorMessage: true,
            errorTitle: "Choose a listed value",
            error: "Select a value from the dropdown list.",
          };
        }
      }
    });
  });
  const branchNameColumn = columnName(PHONEBOOK_WORKBOOK_HEADERS.indexOf("Home branch") + 1);
  const branchIdColumn = columnName(PHONEBOOK_WORKBOOK_HEADERS.indexOf("Home branch ID") + 1);
  const customerTypeNameColumn =
    columnName(PHONEBOOK_WORKBOOK_HEADERS.indexOf("Customer type") + 1);
  const customerTypeIdColumn =
    columnName(PHONEBOOK_WORKBOOK_HEADERS.indexOf("Customer type ID") + 1);
  const branchLookupEnd = Math.max(3, lookupData.branches.length + 2);
  const customerTypeLookupEnd = Math.max(3, lookupData.customerTypes.length + 2);
  const lastEntryRow = Math.max(1003, rows.length + 3);
  for (let rowNumber = 4; rowNumber <= lastEntryRow; rowNumber += 1) {
    sheet.getCell(`${branchIdColumn}${rowNumber}`).value = {
      formula: `IFERROR(VLOOKUP(${branchNameColumn}${rowNumber},'Reference values'!$C$3:$D$${branchLookupEnd},2,FALSE),"")`,
    };
    sheet.getCell(`${customerTypeIdColumn}${rowNumber}`).value = {
      formula: `IFERROR(VLOOKUP(${customerTypeNameColumn}${rowNumber},'Reference values'!$E$3:$F$${customerTypeLookupEnd},2,FALSE),"")`,
    };
  }

  return workbook.xlsx.writeBuffer();
}

export async function parsePhoneBookWorkbook(buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const sheet = workbook.getWorksheet("Phonebook") || workbook.worksheets[0];
  if (!sheet) throw new Error("The workbook does not contain a Phonebook worksheet.");

  let headerRowNumber = 0;
  let headerColumns = new Map();
  for (let rowNumber = 1; rowNumber <= Math.min(sheet.rowCount, 10); rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const candidateColumns = new Map();
    row.eachCell((cell, columnNumber) => {
      const header = cellText(cell.value);
      if (header) candidateColumns.set(normalize(header), { header, columnNumber });
    });
    if (REQUIRED_HEADERS.every((header) => candidateColumns.has(normalize(header)))) {
      headerRowNumber = rowNumber;
      headerColumns = candidateColumns;
      break;
    }
  }
  if (!headerRowNumber) {
    throw new Error("The workbook is missing the required Phonebook column headers.");
  }

  const records = [];
  for (let rowNumber = headerRowNumber + 1; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    const values = {};
    for (const { header, columnNumber } of headerColumns.values()) {
      values[header] = cellText(row.getCell(columnNumber).value, header);
    }
    if (Object.values(values).some((value) => value.trim())) {
      records.push({ sourceRow: rowNumber, values });
    }
  }
  return records;
}

export function mapPhoneBookWorkbookValues(values, {
  branches = [],
  customerTypes = [],
  countries = [],
  relationships = [],
} = {}) {
  const get = (header) => {
    const key = Object.keys(values).find((candidate) => normalize(candidate) === normalize(header));
    return String(values[key] ?? "").trim();
  };
  const required = [
    ["Prefix", "Prefix is required."],
    ["First name", "First name is required."],
    ["Last name", "Last name is required."],
    ["Gender", "Gender is required."],
    ["Home branch", "Home branch is required."],
  ];
  for (const [field, message] of required) {
    if (!get(field)) throw new Error(message);
  }

  const prefixOptions = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."];
  if (!prefixOptions.some((value) => normalize(value) === normalize(get("Prefix")))) {
    throw new Error("Choose a valid prefix from the workbook dropdown.");
  }
  if (!["female", "male"].includes(normalize(get("Gender")))) {
    throw new Error("Choose a valid gender from the workbook dropdown.");
  }
  const branch = branches.find((item) =>
    normalize(branchName(item)) === normalize(get("Home branch")),
  );
  if (!branch) throw new Error("Choose a valid home branch from the workbook dropdown.");
  const customerTypeLabel = get("Customer type");
  const customerType = customerTypeLabel
    ? customerTypes.find((item) =>
      normalize(getCustomerTypeName(item)) === normalize(customerTypeLabel),
    )
    : null;
  if (customerTypeLabel && !customerType) {
    throw new Error("Choose a valid customer type from the workbook dropdown.");
  }

  const countryCodes = new Set(countries.map(countryMobileCode).map(digits).filter(Boolean));
  const phoneRows = PHONEBOOK_TYPES.map((type) => {
    const countryCode = get(`${type} country code`);
    const number = get(`${type} phone`);
    if (number && !/^[\d\s()+-]+$/.test(number)) {
      throw new Error(`${type} phone: use digits, spaces, dashes, or brackets only.`);
    }
    const result = validatePhonePair(countryCode, number);
    if (!result.valid) throw new Error(`${type} phone: ${result.message}`);
    if (result.countryCode && !countryCodes.has(digits(result.countryCode))) {
      throw new Error(`${type} phone: choose a country code from the workbook dropdown.`);
    }
    const whatsapp = get(`${type} WhatsApp`);
    if (whatsapp && !["yes", "no", "true", "false", "1", "0"].includes(normalize(whatsapp))) {
      throw new Error(`${type} WhatsApp: choose Yes or No from the workbook dropdown.`);
    }
    return {
      type,
      number: result.phone || "",
      countryCode: result.countryCode || "",
      whatsapp: ["yes", "true", "1"].includes(normalize(whatsapp)),
      email: get(`${type} email`),
    };
  });
  const primary = phoneRows[0];
  if (!primary.countryCode || !primary.number) {
    throw new Error("Primary phone country code and phone number are required.");
  }
  for (const row of phoneRows) {
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      throw new Error(`Enter a valid ${row.type.toLowerCase()} email address.`);
    }
  }

  const emergencyContacts = [];
  for (const slot of EMERGENCY_CONTACT_SLOTS) {
    const countryCode = get(`Emergency ${slot} country code`);
    const phone = get(`Emergency ${slot} phone`);
    const relativeName = get(`Emergency ${slot} relative name`);
    const relationship = get(`Emergency ${slot} relationship`);
    const profession = get(`Emergency ${slot} profession`);
    if (![countryCode, phone, relativeName, relationship, profession].some(Boolean)) continue;

    if (phone && !/^[\d\s()+-]+$/.test(phone)) {
      throw new Error(`Emergency contact ${slot}: use digits, spaces, dashes, or brackets only.`);
    }
    const result = validatePhonePair(countryCode, phone);
    if (!result.valid) throw new Error(`Emergency contact ${slot}: ${result.message}`);
    if (!result.countryCode || !result.phone) {
      throw new Error(`Emergency contact ${slot}: country code and phone are required.`);
    }
    if (!countryCodes.has(digits(result.countryCode))) {
      throw new Error(`Emergency contact ${slot}: choose a country code from the workbook dropdown.`);
    }
    if (!relativeName) throw new Error(`Emergency contact ${slot}: relative name is required.`);
    if (relativeName.length > 150) throw new Error(`Emergency contact ${slot}: name must be 150 characters or fewer.`);
    const relation = relationships.find((item) =>
      normalize(relationName(item)) === normalize(relationship) ||
        normalize(relationCode(item)) === normalize(relationship),
    );
    if (!relation) throw new Error(`Emergency contact ${slot}: choose a valid relationship from the workbook dropdown.`);
    if (profession.length > 100) throw new Error(`Emergency contact ${slot}: profession must be 100 characters or fewer.`);
    emergencyContacts.push({
      countryCode: result.countryCode,
      phone: result.phone,
      relativeName,
      relationCode: relationCode(relation),
      relationName: relationName(relation),
      profession,
    });
  }

  const maritalStatus = get("Marital status");
  const allowedMaritalStatuses = [
    "Single", "Married", "Divorced", "Widowed", "Separated", "Prefer not to say",
  ];
  if (maritalStatus && !allowedMaritalStatuses.some((value) => normalize(value) === normalize(maritalStatus))) {
    throw new Error("Choose a valid marital status from the workbook dropdown.");
  }
  const category = get("Category");
  const allowedCategories = [
    "Customer", "VIP", "VVIP", "Holiday", "Visa", "Air ticket", "Corporate", "Supplier", "Other",
  ];
  if (category && !allowedCategories.some((value) => normalize(value) === normalize(category))) {
    throw new Error("Choose a valid category from the workbook dropdown.");
  }
  const dateOfBirth = get("Date of birth");
  if (dateOfBirth) {
    const parsedDate = new Date(`${dateOfBirth}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) throw new Error("Enter date of birth as a valid date.");
    if (parsedDate.getTime() > Date.now()) throw new Error("Date of birth cannot be in the future.");
  }

  return {
    prefix: get("Prefix"),
    firstName: get("First name"),
    middleName: get("Middle name"),
    lastName: get("Last name"),
    gender: get("Gender"),
    dateOfBirth,
    homeBranchId: branch.id ?? branch.Id,
    customerType: customerType
      ? customerType.id ?? customerType.Id
      : null,
    company: get("Company"),
    designation: get("Designation"),
    industry: get("Industry"),
    department: get("Department"),
    customerSince: get("Customer since") || "",
    city: get("City"),
    area: get("Area"),
    maritalStatus,
    source: get("Source"),
    userId: get("Customer ID"),
    category,
    phones: phoneRows.map(({ type, number, countryCode, whatsapp }) => ({
      type,
      number,
      countryCode,
      whatsapp,
    })),
    emails: phoneRows.map(({ type, email }) => ({ type, email })),
    emergencyContacts,
  };
}

export async function buildPhoneBookFailureWorkbook(failures) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Import results");
  sheet.addRow(["Row", "Contact", "Primary phone", "Result", "Details"]);
  failures.forEach((failure) => {
    sheet.addRow([
      failure.sourceRow,
      failure.name || "",
      failure.phone || "",
      failure.result || "Failed",
      failure.message || "",
    ]);
  });
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFB91C1C" } };
  sheet.columns = [
    { width: 10 },
    { width: 28 },
    { width: 22 },
    { width: 14 },
    { width: 70 },
  ];
  return workbook.xlsx.writeBuffer();
}
