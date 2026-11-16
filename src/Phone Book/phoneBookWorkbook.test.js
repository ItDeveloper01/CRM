import ExcelJS from "exceljs";
import {
  buildPhoneBookWorkbook,
  buildPhoneBookFailureWorkbook,
  createPhoneBookLookups,
  mapPhoneBookWorkbookValues,
  parsePhoneBookWorkbook,
  PHONEBOOK_WORKBOOK_HEADERS,
} from "./phoneBookWorkbook";

const lookups = {
  countries: [{ id: 91, countryName: "India", mobileCode: "+91" }],
  branches: [{ id: 7, branch: "Pune" }],
  customerTypes: [{ id: 4, customerType: "Holiday Maker" }],
  relationships: [{ code: "SPOUSE", name: "Spouse" }],
  cityAreas: { Pune: ["Kothrud", "Baner"] },
};

const validValues = {
  Prefix: "Ms.",
  "First name": "Anita",
  "Middle name": "",
  "Last name": "Patil",
  Gender: "Female",
  "Date of birth": "1990-01-02",
  "Home branch": "Pune",
  "Customer type": "Holiday Maker",
  "Primary country code": "+91",
  "Primary phone": "9876543210",
  "Primary WhatsApp": "No",
  "Primary email": "anita@example.com",
  "Emergency 1 country code": "+91",
  "Emergency 1 phone": "9876543211",
  "Emergency 1 relative name": "Ravi Patil",
  "Emergency 1 relationship": "Spouse",
};

test("workbook provides titled headers, lookup dropdowns, and parses all rows", async () => {
  const buffer = await buildPhoneBookWorkbook(
    [validValues],
    createPhoneBookLookups(lookups),
  );
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const sheet = workbook.getWorksheet("Phonebook");
  expect(sheet.getCell("A1").value).toContain("Phonebook contacts");
  expect(sheet.getRow(3).values.slice(1)).toEqual(PHONEBOOK_WORKBOOK_HEADERS);
  expect(workbook.definedNames.getRanges("PhonebookCountryCodes").ranges).not.toHaveLength(0);
  const referenceSheet = workbook.getWorksheet("Reference values");
  expect(referenceSheet.state).toBe("visible");
  expect(referenceSheet.getCell("C3").value).toBe("Pune");
  expect(referenceSheet.getCell("D3").value).toBe(7);
  expect(referenceSheet.getCell("E3").value).toBe("Holiday Maker");
  expect(referenceSheet.getCell("F3").value).toBe(4);
  expect(referenceSheet.getCell("G3").value).toBe("India");
  expect(referenceSheet.getCell("H3").value).toBe(91);
  expect(referenceSheet.getCell("I3").value).toBe("+91");
  expect(referenceSheet.getCell("L3").value).toBe("Pune");
  expect(referenceSheet.getCell("M3").value).toBe("Kothrud");

  const countryColumn = PHONEBOOK_WORKBOOK_HEADERS.indexOf("Primary country code") + 1;
  expect(sheet.getCell(4, countryColumn).dataValidation).toMatchObject({
    type: "list",
    allowBlank: true,
    formulae: ["=PhonebookCountryCodes"],
  });
  const branchColumn = PHONEBOOK_WORKBOOK_HEADERS.indexOf("Home branch") + 1;
  expect(sheet.getCell(4, branchColumn).dataValidation.formulae).toEqual([
    "=PhonebookBranches",
  ]);
  expect(
    workbook.definedNames.getRanges("PhonebookBranches").ranges,
  ).toContain("'Reference values'!$C$3");
  expect(sheet.getCell(
    4,
    PHONEBOOK_WORKBOOK_HEADERS.indexOf("Home branch ID") + 1,
  ).value.formula).toContain("VLOOKUP(G4,'Reference values'!$C$3:$D$3");
  expect(sheet.getCell(
    4,
    PHONEBOOK_WORKBOOK_HEADERS.indexOf("Customer type ID") + 1,
  ).value.formula).toContain("VLOOKUP(I4,'Reference values'!$E$3:$F$3");
  expect(sheet.getCell(
    4,
    PHONEBOOK_WORKBOOK_HEADERS.indexOf("City") + 1,
  ).dataValidation.formulae).toEqual(["=PhonebookCities"]);
  expect(sheet.getCell(
    4,
    PHONEBOOK_WORKBOOK_HEADERS.indexOf("Area") + 1,
  ).dataValidation.formulae).toEqual(["=PhonebookAreas"]);

  const records = await parsePhoneBookWorkbook(buffer);
  expect(records).toHaveLength(1);
  expect(records[0].values["Emergency 1 relative name"]).toBe("Ravi Patil");
});

test("maps the complete phone and emergency-contact row into API shapes", () => {
  const contact = mapPhoneBookWorkbookValues(validValues, lookups);
  expect(contact.homeBranchId).toBe(7);
  expect(contact.customerType).toBe(4);
  expect(contact.phones).toHaveLength(5);
  expect(contact.phones[0]).toMatchObject({
    type: "Primary",
    countryCode: "+91",
    number: "9876543210",
  });

  expect(contact.emergencyContacts).toEqual([
    expect.objectContaining({
      countryCode: "+91",
      phone: "9876543211",
      relativeName: "Ravi Patil",
      relationCode: "SPOUSE",
    }),
  ]);
});

test("resolves current master labels to numeric database ids", () => {
  const contact = mapPhoneBookWorkbookValues({
    ...validValues,
    "Home branch": "New branch",
    "Customer type": "New customer type",
  }, {
    ...lookups,
    branches: [{ Id: 31, BranchName: "New branch" }],
    customerTypes: [{ Id: 15, CustomerType: "New customer type" }],
  });
  expect(contact).toMatchObject({ homeBranchId: 31, customerType: 15 });
});

test("reference sheet and dropdowns use updated master values on each workbook build", async () => {
  const buffer = await buildPhoneBookWorkbook([], createPhoneBookLookups({
    countries: [{ Id: 1, CountryName: "India", MobileCode: "+91" }],
    branches: [{ Id: 42, BranchName: "Recently Added Branch" }],
    customerTypes: [{ Id: 9, CustomerType: "Recently Added Type" }],
    relationships: [{ Code: "NEW", Name: "Recently Added Relation" }],
    cityAreas: { "Recently Added City": ["Recently Added Area"] },
  }));
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const referenceSheet = workbook.getWorksheet("Reference values");
  expect(referenceSheet.getCell("C3").value).toBe("Recently Added Branch");
  expect(referenceSheet.getCell("D3").value).toBe(42);
  expect(referenceSheet.getCell("E3").value).toBe("Recently Added Type");
  expect(referenceSheet.getCell("F3").value).toBe(9);
  expect(referenceSheet.getCell("J3").value).toBe("Recently Added Relation");
  expect(referenceSheet.getCell("K3").value).toBe("NEW");
  expect(referenceSheet.getCell("L3").value).toBe("Recently Added City");
  expect(referenceSheet.getCell("M3").value).toBe("Recently Added Area");
  expect(workbook.definedNames.getRanges("PhonebookBranches").ranges).toContain(
    "'Reference values'!$C$3",
  );
});

test.each([
  [{ ...validValues, "Secondary country code": "+91" }, "Secondary phone"],
  [{ ...validValues, "Secondary phone": "9876543210" }, "Select a country code"],
  [{ ...validValues, "Primary phone": "" }, "Enter the phone number"],
])("rejects incomplete phone pairs before an API call", (values, message) => {
  expect(() => mapPhoneBookWorkbookValues(values, lookups)).toThrow(message);
});

test("drops blank emergency slots and rejects partly filled slots", () => {
  const contact = mapPhoneBookWorkbookValues(validValues, lookups);
  expect(contact.emergencyContacts).toHaveLength(1);
  expect(() =>
    mapPhoneBookWorkbookValues({
      ...validValues,
      "Emergency 2 relative name": "Partly filled",
    }, lookups),
  ).toThrow("Emergency contact 2: country code and phone are required.");
});

test("rejects non-phone characters and creates a row-level failure report", async () => {
  expect(() =>
    mapPhoneBookWorkbookValues({
      ...validValues,
      "Primary phone": "98765CALL10",
    }, lookups),
  ).toThrow("use digits, spaces, dashes, or brackets only");

  const buffer = await buildPhoneBookFailureWorkbook([
    {
      sourceRow: 8,
      name: "Anita Patil",
      phone: "+91 9876543210",
      result: "Failed",
      message: "Invalid home branch",
    },
  ]);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  expect(workbook.getWorksheet("Import results").getRow(2).values.slice(1)).toEqual([
    8,
    "Anita Patil",
    "+91 9876543210",
    "Failed",
    "Invalid home branch",
  ]);
});
