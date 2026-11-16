import React, { useEffect, useMemo, useState } from "react";
import PersonalDetailsTab from "./components/PersonalDetailsTab";
import ContactMethodsTab from "./components/ContactMethodsTab";
import FamilyDetailsTab from "./components/FamilyDetailsTab";
import TravelDetailsTab from "./components/TravelDetailsTab";
import AddressDetailsTab from "./components/AddressDetailsTab";
import { useGetSessionUser } from "../SessionContext";
import { useMessageBox } from "../Notification";
import { MESSAGE_TYPES } from "../Constants";
import {
  createPhoneBookContact,
  getPhoneBookBranches,
  getPhoneBookContactGrid,
  getPhoneBookContacts,
  getPhoneBookCountries,
  getPhoneBookEmergencyContactRelations,
  getPhoneBookEmergencyContacts,
  getPhoneBookCustomerTypes,
  findPhoneBookMatches,
  savePhoneBookContactGrid,
  savePhoneBookEmergencyContacts,
} from "../api/phoneBookApi";
import {
  MAX_EMERGENCY_CONTACTS,
  normalizePhoneDigits,
  validateEmergencyContactRows,
  validatePhonePair,
} from "./phoneValidation";
import {
  buildPhoneBookFailureWorkbook,
  buildPhoneBookWorkbook,
  createPhoneBookLookups,
  mapPhoneBookWorkbookValues,
  parsePhoneBookWorkbook,
  PHONEBOOK_TYPES,
} from "./phoneBookWorkbook";
import "./PhoneBookRevamp.css";

const STORAGE_KEY = "phonebook_contacts_v1";
const readCachedPhoneBookContacts = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed)
      ? parsed.filter((contact) => /^\d+$/.test(String(contact.id)))
      : [];
  } catch (error) {
    console.error("Unable to read cached phonebook details.", error);
    return [];
  }
};

export const DEFAULT_PHONEBOOK_TAB_VISIBILITY = Object.freeze({
  details: true,
  contact: true,
  family: true,
  address: true,
  travel: true,
});

export const DEFAULT_PHONEBOOK_PERMISSIONS = Object.freeze({
  canViewPhonebook: true,
  canViewContact: true,
  canAddContact: true,
  canEditContact: true,
  canDeleteContact: true,
  canImportContacts: true,
  canExportContacts: true,
  tabs: Object.freeze({
    details: Object.freeze({ visible: true, canEdit: true }),
    contact: Object.freeze({ visible: true, canEdit: true }),
    family: Object.freeze({ visible: true, canEdit: true }),
    address: Object.freeze({ visible: true, canEdit: true }),
    travel: Object.freeze({ visible: true, canEdit: true }),
  }),
});

const PHONEBOOK_TAB_DEFINITIONS = [
  { key: "details", label: "Personal details" },
  { key: "contact", label: "Phones & emails" },
  { key: "family", label: "Family & relations" },
  { key: "address", label: "Addresses" },
  { key: "travel", label: "Passport & travel" },
];

const phoneBookCityAreas = {
  Pune: ["Kothrud", "Karvenagar", "Deccan", "Viman Nagar", "Phursungi", "Katraj", "Warje", "Bavdhan", "Baner", "Camp", "Deccan Gymkhana", "Peth Area", "Hadapsar", "Sinhagad Road", "Kondva", "Hinjewadi"],
  PCMC: ["Sangvi", "Dehu", "Nigdi", "Bhosari", "Chakan", "Rajguru Nagar", "VisrantWadi", "Khadki", "Alandi", "Pimpri-Chinchwad"],
  Mumbai: ["Andheri", "Borivali", "Dadar", "Bandra", "Kurla"],
  Aurangabad: ["Cidco", "Nirala Bazar", "Garkheda", "Waluj"],
  Kolhapur: ["Shahupuri", "Laxmipuri", "Rajaram Puri"],
  Ahemdabad: ["Maninagar", "Navrangpura", "Satellite", "Bopal"],
  Other: ["Other"],
};

const createBlankEmergencyContact = () => ({
  countryCode: "",
  phone: "",
  relativeName: "",
  relationCode: "",
  relationName: null,
  profession: "",
});

const emptyContact = {
  id: "",
  prefix: "",
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  homeBranchId: "",
  city: "",
  area: "",
  maritalStatus: "",
  company: "",
  designation: "",
  industry: "",
  department: "",
  customerSince: "",
  userId: "",
  source: "",
  assignedAgent: "",
  lastContactedAt: "",
  nextFollowUp: "",
  linkedEnquiries: [],
  timeline: [],
  followUps: [],
  documents: [],
  photo: "",
  isOwnCompany: false,
  companyDetails: {
    legalName: "",
    gstNumber: "",
    panNumber: "",
    companyEmail: "",
    companyPhone: "",
    website: "",
    companyType: "",
  },
  passport: {
    passportNumber: "",
    nationality: "Indian",
    issueDate: "",
    expiryDate: "",
    placeOfIssue: "",
  },
  visas: [],
  travelHistory: [],
  interests: [],
  familyTags: [],
  emergencyContact: { name: "", relation: "", phone: "", email: "" },
  emergencyContacts: [createBlankEmergencyContact()],
  customerType: "",
  priority: "Normal",
  phones: [{ type: "Primary", number: "", whatsapp: false }],
  emails: [{ type: "Primary", email: "" }],
  familyName: "",
  relation: "",
  familyDetails: "",
  familyMembers: [],
  addresses: [
    {
      id: "address_1",
      addressType: "Home",
      isPrimary: true,
      lane: "",
      plotNo: "",
      area: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
    },
  ],
  primaryAddress: {
    addressType: "Home",
    lane: "",
    plotNo: "",
    area: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
  },
  officeAddress: {
    addressType: "Office",
    lane: "",
    plotNo: "",
    area: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
  },
  notes: "",
};

const getFullName = (contact) =>
  `${contact.prefix ? `${contact.prefix} ` : ""}${contact.firstName || ""} ${contact.lastName || ""}`.trim();
const getInitials = (contact) =>
  `${contact.firstName?.[0] || ""}${contact.lastName?.[0] || ""}`.toUpperCase() ||
  "?";
const firstPhone = (contact) => {
  const phone = firstPhoneDetails(contact);
  return phone
    ? `${phone.countryCode ? `${phone.countryCode} ` : ""}${phone.number}`
    : "—";
};
const firstPhoneDetails = (contact) =>
  contact.phones?.find((item) => item.type === "Primary" && item.number) ||
  contact.phones?.find((item) => item.number) ||
  null;
const dialableNumber = (phone) =>
  `${phone?.countryCode || ""}${phone?.number || ""}`.replace(/[^\d+]/g, "");
const primaryEmail = (contact) =>
  contact.emails?.find((e) => e.type === "Primary" && e.email)?.email ||
  contact.emails?.find((e) => e.email)?.email ||
  "—";
const contactTypeNames = {
  PRIMARY: "Primary",
  SECONDARY: "Secondary",
  WORK: "Work",
  OFFICE: "Office",
  OTHER: "Other",
};
const mapLeadToContact = (lead, cachedContacts = []) => {
  const cached = cachedContacts.find(
    (contact) => String(contact.id) === String(lead.leadId),
  );
  const address = {
    ...blankAddress("Home"),
    ...(cached?.primaryAddress || {}),
    city: lead.city || "",
  };
  return {
    ...emptyContact,
    ...cached,
    id: String(lead.leadId),
    prefix: lead.title || "",
    firstName: lead.firstName || "",
    middleName: lead.middleName || "",
    lastName: lead.lastName || "",
    gender: lead.gender || "",
    dateOfBirth: lead.birthDate || cached?.dateOfBirth || "",
    homeBranchId: lead.homeBranchId ?? cached?.homeBranchId ?? "",
    customerType: lead.customerType ?? "",
    company: lead.companyName || "",
    designation: lead.designation || "",
    industry: lead.industry || "",
    department: lead.department || "",
    customerSince: lead.customerSince || "",
    city: lead.city || cached?.city || "",
    area: lead.area || cached?.area || "",
    phones: [{
      type: "Primary",
      number: lead.phone || "",
      countryCode: lead.countryCode || "",
      whatsapp: !!lead.isWhatsApp,
    }],
    emails: [{ type: "Primary", email: lead.email || "" }],
    primaryAddress: address,
    addresses: cached?.addresses?.length
      ? cached.addresses
      : [{ id: `address_${lead.leadId}`, ...address, isPrimary: true }],
  };
};
const mapGridRowsToMethods = (rows) => {
  const phones = [];
  const emails = [];
  rows.forEach((row) => {
    const type = contactTypeNames[row.typeCode] || row.typeName;
    if (row.phone || row.isPrimary) {
      phones.push({
        type,
        number: row.phone || "",
        countryCode: row.countryCode || "",
        whatsapp: !!row.isWhatsApp,
      });
    }
    if (row.email || row.isPrimary) {
      emails.push({ type, email: row.email || "" });
    }
  });
  return {
    phones: phones.length ? phones : [{ type: "Primary", number: "", countryCode: "", whatsapp: false }],
    emails: emails.length ? emails : [{ type: "Primary", email: "" }],
  };
};
const mapFormToGridRows = (form) => {
  const typeCodes = {
    Primary: "PRIMARY",
    Secondary: "SECONDARY",
    Work: "WORK",
    Office: "OFFICE",
    Other: "OTHER",
  };
  return Object.entries(typeCodes).map(([type, typeCode]) => {
    const phone = form.phones?.find((item) => item.type === type) || {};
    const email = form.emails?.find((item) => item.type === type) || {};
    return {
      typeCode,
      phone: phone.number?.trim() || null,
      countryCode: phone.countryCode?.trim() || null,
      email: email.email?.trim() || null,
      isWhatsApp: !!phone.whatsapp,
    };
  });
};
const formatLastContacted = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
  if (days === 0) return "Today";
  if (days < 7) return `${days}d ago`;
  if (days < 28) return `${Math.floor(days / 7)}w ago`;
  return date.toLocaleDateString();
};
const blankAddress = (type) => ({
  addressType: type,
  lane: "",
  plotNo: "",
  area: "",
  city: "",
  state: "",
  pinCode: "",
  country: "India",
});

const phoneBookWorkbookRow = (
  contact,
  gridRows,
  emergencyRows,
  branches,
  customerTypes,
  relationships,
) => {
  const branch = branches.find(
    (item) => String(item.id ?? item.Id) === String(contact.homeBranchId),
  );
  const customerType = customerTypes.find(
    (item) => String(item.id ?? item.Id) === String(contact.customerType),
  );
  const row = {
    Prefix: contact.prefix || "",
    "First name": contact.firstName || "",
    "Middle name": contact.middleName || "",
    "Last name": contact.lastName || "",
    Gender: contact.gender || "",
    "Date of birth": contact.dateOfBirth || "",
    "Home branch": branch?.branch || branch?.branchName || branch?.BranchName || "",
    "Customer type":
      customerType?.customerType || customerType?.CustomerType || "",
    Company: contact.company || "",
    Designation: contact.designation || "",
    Industry: contact.industry || "",
    Department: contact.department || "",
    "Customer since": contact.customerSince || "",
    City: contact.city || "",
    Area: contact.area || "",
    "Marital status": contact.maritalStatus || "",
    Source: contact.source || "",
    "Customer ID": contact.userId || "",
    Category: contact.category || "",
  };
  const methods = mapGridRowsToMethods(gridRows);
  PHONEBOOK_TYPES.forEach((type) => {
    const phone = methods.phones.find((item) => item.type === type) || {};
    const email = methods.emails.find((item) => item.type === type) || {};
    row[`${type} country code`] = phone.countryCode || "";
    row[`${type} phone`] = phone.number || "";
    row[`${type} WhatsApp`] = phone.whatsapp ? "Yes" : "No";
    row[`${type} email`] = email.email || "";
  });
  emergencyRows.slice(0, MAX_EMERGENCY_CONTACTS).forEach((item, index) => {
    const slot = index + 1;
    const relationship = relationships.find(
      (relation) => relation.code === item.relationCode,
    );
    row[`Emergency ${slot} country code`] = item.countryCode || "";
    row[`Emergency ${slot} phone`] = item.phone || "";
    row[`Emergency ${slot} relative name`] = item.relativeName || "";
    row[`Emergency ${slot} relationship`] =
      item.relationName || relationship?.name || "";
    row[`Emergency ${slot} profession`] = item.profession || "";
  });
  return row;
};

const downloadWorkbook = (buffer, filename) => {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const loadFreshPhoneBookLookups = async (token) => {
  const [branches, countries, relationships, customerTypes] = await Promise.all([
    getPhoneBookBranches(token),
    getPhoneBookCountries(),
    getPhoneBookEmergencyContactRelations(token),
    getPhoneBookCustomerTypes(token),
  ]);
  if (!Array.isArray(branches) || !branches.length) {
    throw new Error("No home branches were returned from the database.");
  }
  if (!Array.isArray(countries) || !countries.length) {
    throw new Error("No country dialing codes were returned from the database.");
  }
  if (!Array.isArray(relationships) || !relationships.length) {
    throw new Error("No emergency-contact relationships were returned from the database.");
  }
  if (!Array.isArray(customerTypes)) {
    throw new Error("Customer types could not be loaded from the database.");
  }
  return { branches, countries, relationships, customerTypes };
};

const createContactForm = (contact) => {
  const legacyAddresses = contact.addresses?.some(
    (address) => address.city || address.lane || address.plotNo || address.area,
  )
    ? contact.addresses
    : [
      {
        id: "legacy_home",
        ...blankAddress("Home"),
        ...(contact.primaryAddress || {}),
        isPrimary: true,
      },
      ...(contact.officeAddress &&
      Object.values(contact.officeAddress).some(
        (value) => value && !["Office", "India"].includes(value),
      )
        ? [
          {
            id: "legacy_office",
            ...blankAddress("Office"),
            ...contact.officeAddress,
            isPrimary: false,
          },
        ]
        : []),
    ];

  return {
    ...emptyContact,
    ...contact,
    phones: contact.phones?.length
      ? contact.phones.map((item) => ({ ...item }))
      : [{ type: "Primary", number: "", whatsapp: false }],
    emails: contact.emails?.length
      ? contact.emails.map((item) => ({ ...item }))
      : [{ type: "Primary", email: "" }],
    companyDetails: {
      ...emptyContact.companyDetails,
      ...(contact.companyDetails || {}),
    },
    passport: { ...emptyContact.passport, ...(contact.passport || {}) },
    emergencyContact: {
      ...emptyContact.emergencyContact,
      ...(contact.emergencyContact || {}),
    },
    emergencyContacts: contact.emergencyContacts?.length
      ? contact.emergencyContacts.map((item) => ({ ...item }))
      : [createBlankEmergencyContact()],
    visas: (contact.visas || []).map((item) => ({ ...item })),
    travelHistory: (contact.travelHistory || []).map((item) => ({ ...item })),
    interests: contact.interests || [],
    familyTags: contact.familyTags || [],
    familyMembers: (contact.familyMembers || []).map((item) => ({ ...item })),
    addresses: legacyAddresses,
  };
};

const validateContact = (contact, originalContact, editableTabs) => {
  const errors = [];
  const requiredFields = [
    ["prefix", contact.prefix, "Prefix"],
    ["firstName", contact.firstName, "First name"],
    ["lastName", contact.lastName, "Last name"],
    ["gender", contact.gender, "Gender"],
    ["homeBranchId", contact.homeBranchId, "Customer home branch"],
  ];
  if (editableTabs.has("details")) {
    requiredFields.forEach(([field, value, label]) => {
      if (!value?.toString().trim()) {
        errors.push({ tab: "details", field, message: `${label} is required.` });
      }
    });
  }

  if (editableTabs.has("contact")) contact.phones.forEach((phone) => {
    const type = phone.type || "Other";
    const originalPhone = originalContact?.phones?.find(
      (original) => original.type === type,
    );
    const allowUnchangedLegacyPhoneWithoutCode =
      type === "Primary" &&
      !originalPhone?.countryCode &&
      normalizePhoneDigits(originalPhone?.number) === normalizePhoneDigits(phone.number);
    const result = validatePhonePair(phone.countryCode, phone.number, {
      countryCodeField: type === "Primary"
        ? "primaryCountryCode"
        : `phoneCountryCode-${type}`,
      phoneField: type === "Primary"
        ? "primaryPhone"
        : `phoneNumber-${type}`,
      allowUnchangedLegacyPhoneWithoutCode,
    });
    if (!result.valid) {
      errors.push({
      tab: "contact",
        section: "phones",
        field: result.field,
        message: result.message,
      });
    }
  });

  if (editableTabs.has("contact")) {
    const emergencyRows = contact.emergencyContacts || [];
    const filledEmergencyRows = emergencyRows.filter((row) =>
      [row.countryCode, row.phone, row.relativeName, row.relationCode, row.profession]
        .some((value) => String(value || "").trim()),
    );
    if (filledEmergencyRows.length > MAX_EMERGENCY_CONTACTS) {
      errors.push({
        tab: "contact",
        section: "emergency",
        field: "emergencyContacts",
        message: `No more than ${MAX_EMERGENCY_CONTACTS} emergency contacts are allowed.`,
      });
    }
    validateEmergencyContactRows(emergencyRows).forEach((error) => {
      errors.push({
        tab: "contact",
        section: "emergency",
        ...error,
      });
    });
  }

  if (editableTabs.has("contact")) contact.emails.forEach(({ email }) => {
    const value = (email || "").trim();
    const unchanged = originalContact?.emails?.some(
      (original) => original.email === email,
    );
    if (value && !unchanged && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.push({
        tab: "contact",
        message: `Enter a valid email address: ${value}`,
      });
    }
  });

  if (
    editableTabs.has("details") &&
    contact.dateOfBirth &&
    new Date(contact.dateOfBirth).getTime() > Date.now()
  ) {
    errors.push({
      tab: "details",
      message: "Date of birth cannot be in the future.",
    });
  }

  if (
    editableTabs.has("travel") &&
    contact.passport?.issueDate &&
    contact.passport?.expiryDate &&
    contact.passport.expiryDate <= contact.passport.issueDate
  ) {
    errors.push({
      tab: "travel",
      message: "Passport expiry date must be after its issue date.",
    });
  }

  return errors;
};

const getApiValidationErrors = (error) => {
  const personalFieldNames = {
    title: "prefix",
    prefix: "prefix",
    firstname: "firstName",
    middlename: "middleName",
    lastname: "lastName",
    gender: "gender",
    homebranchid: "homeBranchId",
    birthdate: "dateOfBirth",
  };

  return Object.entries(error.errors || {}).flatMap(([apiField, messages]) => {
    const normalizedField = apiField.toLowerCase().replace(/[^a-z0-9]/g, "");
    const personalField = personalFieldNames[normalizedField];
    const isEmergencyContact = normalizedField.startsWith("emergencycontacts");
    const tab = personalField
      ? "details"
      : normalizedField.includes("passport") ||
          normalizedField.includes("travel") ||
          normalizedField.includes("visa")
        ? "travel"
        : normalizedField.includes("address")
          ? "address"
          : normalizedField.includes("family")
            ? "family"
              : "contact";

    return (Array.isArray(messages) ? messages : [messages])
      .filter(Boolean)
      .map((message) => ({
        tab,
        section: isEmergencyContact
          ? "emergency"
          : personalField
            ? "personal"
            : "phones",
        field: personalField || apiField,
        message,
      }));
  });
};

export default function PhoneBookRevamp({
  tabVisibility = DEFAULT_PHONEBOOK_TAB_VISIBILITY,
  permissions = DEFAULT_PHONEBOOK_PERMISSIONS,
} = {}) {
  const { user: sessionUser } = useGetSessionUser();
  const { showMessage } = useMessageBox();
  const [contacts, setContacts] = useState(() => {
    return readCachedPhoneBookContacts();
  });
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [totalContacts, setTotalContacts] = useState(0);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [contactsError, setContactsError] = useState("");
  const [branches, setBranches] = useState([]);
  const [branchLoadError, setBranchLoadError] = useState("");
  const [countries, setCountries] = useState([]);
  const [countryLoadError, setCountryLoadError] = useState("");
  const [emergencyRelations, setEmergencyRelations] = useState([]);
  const [emergencyRelationsError, setEmergencyRelationsError] = useState("");
  const [emergencyContactsLoadedId, setEmergencyContactsLoadedId] = useState("");
  const [emergencyContactsLoadError, setEmergencyContactsLoadError] = useState("");
  const [customerTypes, setCustomerTypes] = useState([]);
  const [customerTypeLoadError, setCustomerTypeLoadError] = useState("");
  const [phoneMatches, setPhoneMatches] = useState({});
  const [hasLoadedContacts, setHasLoadedContacts] = useState(false);
  const [cityFilter, setCityFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyContact);
  const [activeTab, setActiveTab] = useState("details");
  const [toast, setToast] = useState("");
  const [formErrors, setFormErrors] = useState([]);
  const [tagFilter, setTagFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [familyTagInput, setFamilyTagInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const resolvedPermissions = useMemo(
    () => ({
      ...DEFAULT_PHONEBOOK_PERMISSIONS,
      ...permissions,
      tabs: Object.fromEntries(
        PHONEBOOK_TAB_DEFINITIONS.map(({ key }) => [
          key,
          {
            ...DEFAULT_PHONEBOOK_PERMISSIONS.tabs[key],
            ...(permissions?.tabs?.[key] || {}),
          },
        ]),
      ),
    }),
    [permissions],
  );
  const visibleTabs = useMemo(
    () =>
      PHONEBOOK_TAB_DEFINITIONS.filter(
        ({ key }) =>
          tabVisibility[key] !== false &&
          resolvedPermissions.tabs[key].visible !== false,
      ),
    [resolvedPermissions.tabs, tabVisibility],
  );
  const canViewContactSection =
    tabVisibility.contact !== false &&
    resolvedPermissions.tabs.contact.visible !== false;
  const canCreateContact =
    resolvedPermissions.canAddContact &&
    visibleTabs.some(
      ({ key }) => key === "details" && resolvedPermissions.tabs[key].canEdit,
    );
  const canEditContactRecord =
    resolvedPermissions.canEditContact &&
    visibleTabs.some(({ key }) => resolvedPermissions.tabs[key].canEdit);
  useEffect(() => {
    if (visibleTabs.length && !visibleTabs.some(({ key }) => key === activeTab)) {
      setActiveTab(visibleTabs[0].key);
    }
  }, [activeTab, visibleTabs]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoadingContacts(true);
      setContactsError("");
      try {
        const pageSize = 200;
        const firstPage = await getPhoneBookContacts(
          { search, letter: selectedLetter, page: 1, pageSize },
          controller.signal,
        );
        if (!active) return;

        const cachedContacts = readCachedPhoneBookContacts();
        let leads = firstPage.items;
        setContacts(leads.map((lead) => mapLeadToContact(lead, cachedContacts)));
        setTotalContacts(firstPage.totalCount);

        const pageCount = Math.ceil(firstPage.totalCount / pageSize);
        for (let currentPage = 2; currentPage <= pageCount; currentPage += 1) {
          const nextPage = await getPhoneBookContacts(
            { search, letter: selectedLetter, page: currentPage, pageSize },
            controller.signal,
          );
          if (!active) return;
          if (nextPage.items.length === 0) break;

          leads = [...leads, ...nextPage.items];
          setContacts(leads.map((lead) => mapLeadToContact(lead, cachedContacts)));
        }
        setHasLoadedContacts(true);
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setContactsError(error.message || "Unable to load contacts from the CRM.");
        }
      } finally {
        if (active) setIsLoadingContacts(false);
      }
    }, search.trim() ? 250 : 0);

    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [search, selectedLetter]);

  useEffect(() => {
    if (!sessionUser?.token) return undefined;
    const controller = new AbortController();
    let active = true;

    getPhoneBookBranches(sessionUser.token, controller.signal)
      .then((result) => {
        if (active) {
          setBranches(result);
          setBranchLoadError("");
        }
      })
      .catch((error) => {
        if (active && error.name !== "AbortError") {
          setBranchLoadError(error.message || "Unable to load branches.");
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [sessionUser?.token]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    getPhoneBookCountries(controller.signal)
      .then((result) => {
        if (active) {
          const availableCountries =
            Array.isArray(result)
              ? result.filter((country) => country.mobileCode)
              : [];
          setCountries(availableCountries);
          setCountryLoadError(
            availableCountries.length
              ? ""
              : "No country dialing codes are available.",
          );
        }
      })
      .catch((error) => {
        if (active && error.name !== "AbortError") {
          setCountryLoadError(error.message || "Unable to load countries.");
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!sessionUser?.token) {
      setEmergencyRelationsError("User authentication is required to load relationships.");
      return undefined;
    }

    const controller = new AbortController();
    let active = true;
    getPhoneBookEmergencyContactRelations(sessionUser.token, controller.signal)
      .then((result) => {
        if (active) {
          setEmergencyRelations(Array.isArray(result) ? result : []);
          setEmergencyRelationsError("");
        }
      })
      .catch((error) => {
        if (active && error.name !== "AbortError") {
          setEmergencyRelationsError(error.message || "Unable to load relationships.");
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [sessionUser?.token]);

  useEffect(() => {
    if (!sessionUser?.token) return undefined;
    const controller = new AbortController();
    let active = true;

    getPhoneBookCustomerTypes(sessionUser.token, controller.signal)
      .then((result) => {
        if (active) {
          setCustomerTypes(Array.isArray(result) ? result : []);
          setCustomerTypeLoadError("");
        }
      })
      .catch((error) => {
        if (active && error.name !== "AbortError") {
          setCustomerTypeLoadError(
            error.message || "Unable to load customer types.",
          );
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [sessionUser?.token]);

  useEffect(() => {
    if (!hasLoadedContacts) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch (error) {
      console.error("Unable to cache phonebook profile details.", error);
      setToast("CRM contacts are saved, but profile details could not be cached in this browser.");
    }
  }, [contacts, hasLoadedContacts]);

  const cities = useMemo(
    () => [
      "All",
      ...new Set(
        contacts
          .map(
            (c) =>
              (
                c.addresses?.find((a) => a.isPrimary && a.city) ||
                c.primaryAddress
              )?.city,
          )
          .filter(Boolean)
          .sort(),
      ),
    ],
    [contacts],
  );
  const tags = useMemo(
    () =>
      [...new Set(contacts.flatMap((contact) => [
        ...(contact.familyTags || []),
        ...(contact.interests || []),
      ]))].sort(),
    [contacts],
  );
  const sources = useMemo(
    () => [...new Set(contacts.map((contact) => contact.source).filter(Boolean))].sort(),
    [contacts],
  );
  const filteredContacts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts
      .filter((c) => {
        const haystack = [
          getFullName(c),
          c.company,
          c.familyName,
          (c.addresses?.find((a) => a.isPrimary && a.city) || c.primaryAddress)
            ?.city,
          c.source,
          c.assignedAgent,
          c.companyDetails?.gstNumber,
          c.phones?.map((p) => p.number).join(" "),
          c.phones?.map((p) => p.countryCode).join(" "),
          c.emails?.map((e) => e.email).join(" "),
        ]
          .join(" ")
          .toLowerCase();
        return (
          (!q || haystack.includes(q)) &&
          (cityFilter === "All" ||
            (
              c.addresses?.find((a) => a.isPrimary && a.city) ||
              c.primaryAddress
            )?.city === cityFilter) &&
          (sourceFilter === "All" || c.source === sourceFilter) &&
          (tagFilter === "All" ||
            [...(c.familyTags || []), ...(c.interests || [])].includes(tagFilter))
        );
      })
      .sort((a, b) => {
        if (sortOrder === "recent") {
          return (
            new Date(b.lastContactedAt || 0).getTime() -
            new Date(a.lastContactedAt || 0).getTime()
          );
        }
        return sortOrder === "A-Z"
          ? getFullName(a).localeCompare(getFullName(b))
          : getFullName(b).localeCompare(getFullName(a));
      });
  }, [contacts, search, cityFilter, sortOrder, sourceFilter, tagFilter]);

  const selectedContact =
    isAdding
      ? null
      : contacts.find((contact) => contact.id === selectedContactId) ||
        filteredContacts[0] ||
        null;
  const selectedPhone =
    form.phones?.find((phone) => phone.type === "Primary" && phone.number) ||
    form.phones?.find((phone) => phone.number) ||
    null;
  const selectedEmail =
    form.emails?.find((email) => email.type === "Primary" && email.email) ||
    form.emails?.find((email) => email.email) ||
    null;

  useEffect(() => {
    if (selectedContact?.id && selectedContact.id !== selectedContactId) {
      setSelectedContactId(selectedContact.id);
    }
  }, [selectedContact, selectedContactId]);
  useEffect(() => {
    if (
      !isAdding &&
      selectedContact &&
      selectedContact.id !== editingId
    ) {
      setEditingId(selectedContact.id);
      setForm(createContactForm(selectedContact));
      setFormErrors([]);
      setPhoneMatches({});
    }
  }, [editingId, isAdding, selectedContact, selectedContactId]);

  const selectedContactIdForGrid = selectedContact?.id;
  useEffect(() => {
    if (isAdding || !selectedContactIdForGrid || !/^\d+$/.test(selectedContactIdForGrid)) return undefined;
    let active = true;
    const controller = new AbortController();
    const leadId = selectedContactIdForGrid;

    setEmergencyContactsLoadedId("");
    setEmergencyContactsLoadError("");
    getPhoneBookContactGrid(leadId, controller.signal)
      .then((rows) => {
        if (!active) return;
        const methods = mapGridRowsToMethods(rows);
        setForm((current) => ({
          ...current,
          id: leadId,
          ...methods,
        }));
        setContacts((current) =>
          current.map((contact) =>
            contact.id === leadId ? { ...contact, ...methods } : contact,
          ),
        );
      })
      .catch((error) => {
        if (active && error.name !== "AbortError") {
          setToast(error.message || "Unable to load phone and email details.");
        }
      });

    if (!sessionUser?.token) {
      setEmergencyContactsLoadError("User authentication is required to load emergency contacts.");
    } else {
      getPhoneBookEmergencyContacts(leadId, sessionUser.token, controller.signal)
        .then((rows) => {
          if (!active) return;
          setForm((current) => ({
            ...current,
            emergencyContacts: rows?.length
              ? rows.map((row) => ({ ...row }))
              : [createBlankEmergencyContact()],
          }));
          setEmergencyContactsLoadedId(leadId);
          setEmergencyContactsLoadError("");
        })
        .catch((error) => {
          if (active && error.name !== "AbortError") {
            setEmergencyContactsLoadError(
              error.message || "Unable to load emergency contacts.",
            );
          }
        });
    }

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedContactIdForGrid, isAdding, sessionUser?.token]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };
  const openAdd = () => {
    const firstEditableTab = visibleTabs.find(
      ({ key }) => resolvedPermissions.tabs[key].canEdit,
    );
    if (
      !canCreateContact
    ) return;
    setIsAdding(true);
    setSelectedContactId(null);
    setEditingId(null);
    setFormErrors([]);
    setPhoneMatches({});
    setEmergencyContactsLoadedId("");
    setEmergencyContactsLoadError("");
    setActiveTab(firstEditableTab?.key || "details");
    setForm({
      ...emptyContact,
      id: "",
      phones: [{ type: "Primary", number: "", whatsapp: false }],
      emails: [{ type: "Primary", email: "" }],
      emergencyContacts: [createBlankEmergencyContact()],
      familyMembers: [],
      addresses: [
        {
          id: `address_${Date.now()}`,
          ...blankAddress("Home"),
          isPrimary: true,
        },
      ],
      companyDetails: { ...emptyContact.companyDetails },
      passport: { ...emptyContact.passport },
      visas: [],
      travelHistory: [],
      interests: [],
      familyTags: [],
      emergencyContact: { ...emptyContact.emergencyContact },
      primaryAddress: blankAddress("Home"),
      officeAddress: blankAddress("Office"),
    });
    setFamilyTagInput("");
    setInterestInput("");
    setActiveTab(firstEditableTab?.key || "details");
  };
  const openEdit = (contact) => {
    setIsAdding(false);
    setSelectedContactId(contact.id);
    setEditingId(contact.id);
    setForm(createContactForm(contact));
    setFamilyTagInput("");
    setInterestInput("");
    setFormErrors([]);
    setPhoneMatches({});
    setEmergencyContactsLoadError("");
    setActiveTab(visibleTabs[0]?.key || "details");
  };
  const cancelEditing = () => {
    setFormErrors([]);
    if (isAdding) {
      setIsAdding(false);
      setEditingId(null);
      setSelectedContactId(contacts[0]?.id || null);
      if (contacts[0]) openEdit(contacts[0]);
      return;
    }
    if (selectedContact) openEdit(selectedContact);
  };
  const setValue = (key, value) => {
    setFormErrors((current) =>
      current.filter((error) => error.field !== key),
    );
    updateForm((current) => ({ ...current, [key]: value }));
  };
  const hasFieldError = (field) =>
    formErrors.some((error) => error.field === field);
  const getFieldError = (field) =>
    formErrors.find((error) => error.field === field)?.message || "";
  const updateForm = (updater) => {
    setForm(updater);
  };
  const setCompanyDetail = (field, value) =>
    updateForm((current) => ({
      ...current,
      companyDetails: { ...current.companyDetails, [field]: value },
    }));
  const setPassportDetail = (field, value) =>
    updateForm((current) => ({
      ...current,
      passport: { ...current.passport, [field]: value },
    }));
  const setEmergencyDetail = (field, value) =>
    updateForm((current) => ({
      ...current,
      emergencyContact: { ...current.emergencyContact, [field]: value },
    }));
  const setFamilyMemberEmergency = (memberIndex) =>
    updateForm((current) => ({
      ...current,
      familyMembers: current.familyMembers.map((member, index) => ({
        ...member,
        emergency: index === memberIndex,
      })),
    }));
  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify("Please select an image file.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setValue("photo", String(reader.result || ""));
    reader.readAsDataURL(file);
  };
  const checkPhoneMatches = async (type) => {
    const phone = form.phones?.find((item) => item.type === type);
    if (!phone?.number?.trim() || !phone.countryCode?.trim()) {
      setPhoneMatches((current) => ({ ...current, [type]: [] }));
      return;
    }

    try {
      const matches = await findPhoneBookMatches(
        phone.number.trim(),
        phone.countryCode.trim(),
        editingId ? Number(editingId) : undefined,
      );
      setPhoneMatches((current) => ({ ...current, [type]: matches || [] }));
    } catch (error) {
      notify(error.message || "Unable to check for duplicate phone numbers.");
    }
  };
  const updatePhoneValue = (type, field, value) => {
    setPhoneMatches((current) => ({ ...current, [type]: [] }));
    const errorField = field === "number"
      ? type === "Primary" ? "primaryPhone" : `phoneNumber-${type}`
      : field === "countryCode"
        ? type === "Primary"
          ? "primaryCountryCode"
          : `phoneCountryCode-${type}`
        : null;
    if (errorField) {
      setFormErrors((current) =>
        current.filter((error) => error.field !== errorField),
      );
    }
    const items = form.phones || [];
    const current = items.find((item) => item.type === type) || { type };
    updateForm((formValue) => ({
      ...formValue,
      phones: [
        ...items.filter((item) => item.type !== type),
        { ...current, [field]: value },
      ],
    }));
  };
  const addTagValue = (field, value, clearInput) => {
    const cleanValue = value.trim();
    if (!cleanValue) return;
    updateForm((current) => ({
      ...current,
      [field]: [...new Set([...(current[field] || []), cleanValue])],
    }));
    clearInput("");
  };
  const setAddressItem = (index, field, value) =>
    updateForm((current) => ({
      ...current,
      addresses: current.addresses.map((a, i) =>
        i === index
          ? {
            ...a,
            [field]: value,
            ...(field === "isPrimary" && value ? {} : {}),
          }
          : field === "isPrimary" && value
            ? { ...a, isPrimary: false }
            : a,
      ),
    }));
  const addAddress = () =>
    updateForm((current) => ({
      ...current,
      addresses: [
        ...current.addresses,
        {
          id: `address_${Date.now()}`,
          ...blankAddress("Other"),
          isPrimary: current.addresses.length === 0,
        },
      ],
    }));
  const removeAddress = (index) =>
    updateForm((current) => {
      const addresses = current.addresses.filter((_, i) => i !== index);
      if (addresses.length && !addresses.some((a) => a.isPrimary))
        addresses[0].isPrimary = true;
      return { ...current, addresses };
    });
  const setArrayItem = (key, index, field, value) =>
    updateForm((current) => ({
      ...current,
      [key]: current[key].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  const addArrayItem = (key, item) =>
    updateForm((current) => ({ ...current, [key]: [...current[key], item] }));
  const removeArrayItem = (key, index) =>
    updateForm((current) => ({
      ...current,
      [key]: current[key].filter((_, i) => i !== index),
    }));
  const updateEmergencyContactValue = (index, field, value) => {
    const errorField = `emergencyContacts[${index}].${field}`;
    setFormErrors((current) =>
      current.filter((error) =>
        error.field !== errorField &&
        error.field !== "emergencyContacts",
      ),
    );
    setArrayItem("emergencyContacts", index, field, value);
  };
  const addEmergencyContact = () => {
    updateForm((current) => ({
      ...current,
      emergencyContacts: [
        ...(current.emergencyContacts || []),
        createBlankEmergencyContact(),
      ],
    }));
    setFormErrors((current) =>
      current.filter((error) => error.section !== "emergency"),
    );
  };
  const removeEmergencyContact = (index) => {
    updateForm((current) => ({
      ...current,
      emergencyContacts: (current.emergencyContacts || []).filter(
        (_, rowIndex) => rowIndex !== index,
      ),
    }));
    setFormErrors((current) =>
      current.filter((error) => error.section !== "emergency"),
    );
  };
  const saveContact = async (event) => {
    event.preventDefault();
    const hasEditableSection =
      visibleTabs.some(({ key }) => resolvedPermissions.tabs[key].canEdit) ||
      (canViewContactSection && resolvedPermissions.tabs.contact.canEdit);
    if (
      (editingId && !canEditContactRecord) ||
      (!editingId && !canCreateContact) ||
      !hasEditableSection
    ) {
      return;
    }
    const originalContact = editingId
      ? contacts.find((contact) => contact.id === editingId)
      : null;
    const editableTabs = new Set(
      visibleTabs
        .filter(({ key }) => resolvedPermissions.tabs[key].canEdit)
        .map(({ key }) => key),
    );
    const errors = validateContact(form, originalContact, editableTabs);
    if (errors.length) {
      setFormErrors(errors);
      const firstVisibleError = errors.find(({ tab }) =>
        visibleTabs.some((visibleTab) => visibleTab.key === tab),
      );
      if (firstVisibleError) setActiveTab(firstVisibleError.tab);
      showMessage(
        errors.map((error) => error.message).join("\n"),
        MESSAGE_TYPES.WARNING,
      );
      return;
    }
    if (editingId && emergencyContactsLoadedId !== editingId) {
      const message = emergencyContactsLoadError ||
        "Emergency contacts are still loading. Try saving again shortly.";
      setFormErrors([{
        tab: canViewContactSection ? "contact" : "details",
        section: "emergency",
        field: "emergencyContacts",
        message,
      }]);
      setActiveTab(canViewContactSection ? "contact" : "details");
      showMessage(message, MESSAGE_TYPES.WARNING);
      return;
    }
    const addresses = form.addresses.map((a) => ({ ...a }));
    if (addresses.length && !addresses.some((a) => a.isPrimary))
      addresses[0].isPrimary = true;
    const primaryAddress =
      addresses.find((a) => a.isPrimary) || blankAddress("Home");
    const officeAddress =
      addresses.find((a) => a.addressType === "Office") ||
      blankAddress("Office");
    let cleaned = {
      ...form,
      id: editingId || `contact_${Date.now()}`,
      firstName: form.firstName.trim(),
      middleName: (form.middleName || "").trim(),
      lastName: form.lastName.trim(),
      phones: form.phones
        .map((phone) => ({ ...phone, number: (phone.number || "").trim() }))
        .filter((phone) => phone.number),
      emails: form.emails
        .map((email) => ({ ...email, email: (email.email || "").trim() }))
        .filter((email) => email.email),
      addresses,
      primaryAddress,
      officeAddress,
    };
    try {
      if (isAdding) {
        const primaryPhone = cleaned.phones.find((phone) => phone.type === "Primary");
        const primaryEmailValue =
          cleaned.emails.find((email) => email.type === "Primary")?.email || "";
        const created = await createPhoneBookContact({
          firstName: cleaned.firstName,
          middleName: cleaned.middleName,
          lastName: cleaned.lastName,
          title: cleaned.prefix,
          phone: primaryPhone?.number || null,
          countryCode: primaryPhone?.countryCode || null,
          email: primaryEmailValue,
          gender: cleaned.gender || "Not Specified",
          birthDate: cleaned.dateOfBirth || null,
          homeBranchId: cleaned.homeBranchId ? Number(cleaned.homeBranchId) : null,
          customerType: cleaned.customerType ? Number(cleaned.customerType) : null,
          companyName: cleaned.company || "",
          designation: cleaned.designation || "",
          industry: cleaned.industry || "",
          department: cleaned.department || "",
          customerSince: cleaned.customerSince || null,
          city: cleaned.city || "",
          area: cleaned.area || "",
          contactRows: mapFormToGridRows(cleaned),
        });
        cleaned = {
          ...cleaned,
          id: String(created.leadId),
          prefix: created.title || "",
          firstName: created.firstName,
          middleName: created.middleName || "",
          lastName: created.lastName,
          gender: created.gender || "",
          dateOfBirth: created.birthDate || "",
          homeBranchId: created.homeBranchId ?? "",
          customerType: created.customerType ?? "",
          company: created.companyName || "",
          designation: created.designation || "",
          industry: created.industry || "",
          department: created.department || "",
          customerSince: created.customerSince || "",
          city: created.city || "",
          area: created.area || "",
          phones: [{
            type: "Primary",
            number: created.phone || "",
            countryCode: created.countryCode || "",
            whatsapp: !!created.isWhatsApp,
          }],
          emails: [{ type: "Primary", email: created.email || "" }],
        };
        setTotalContacts((count) => count + 1);
      } else {
        const savedRows = await savePhoneBookContactGrid(
          Number(editingId),
          {
            firstName: cleaned.firstName,
            middleName: cleaned.middleName,
            lastName: cleaned.lastName,
            title: cleaned.prefix,
            gender: cleaned.gender,
            birthDate: cleaned.dateOfBirth || null,
            homeBranchId: cleaned.homeBranchId ? Number(cleaned.homeBranchId) : null,
            customerType: cleaned.customerType ? Number(cleaned.customerType) : null,
            companyName: cleaned.company || "",
            designation: cleaned.designation || "",
            industry: cleaned.industry || "",
            department: cleaned.department || "",
            customerSince: cleaned.customerSince || null,
            city: cleaned.city || "",
            area: cleaned.area || "",
            rows: mapFormToGridRows(cleaned),
          },
        );
        cleaned = { ...cleaned, ...mapGridRowsToMethods(savedRows) };
      }

    const savedEmergencyContacts = await savePhoneBookEmergencyContacts(
      Number(cleaned.id),
      cleaned.emergencyContacts || [],
      sessionUser?.token,
    );
    cleaned = {
      ...cleaned,
      emergencyContacts: savedEmergencyContacts?.length
        ? savedEmergencyContacts.map((row) => ({ ...row }))
        : [createBlankEmergencyContact()],
    };

    setContacts((current) =>
      editingId
        ? current.map((c) => (c.id === editingId ? cleaned : c))
        : [...current, cleaned],
    );
    setIsAdding(false);
    setEditingId(cleaned.id);
    setSelectedContactId(cleaned.id);
    setFormErrors([]);
    notify(
      editingId
        ? "Contact updated successfully."
        : "Contact added successfully.",
    );
    } catch (error) {
      const validationErrors = getApiValidationErrors(error);
      if (validationErrors.length) {
        setFormErrors(validationErrors);
        const firstVisibleError = validationErrors.find(({ tab }) =>
          visibleTabs.some((visibleTab) => visibleTab.key === tab),
        );
        if (firstVisibleError) setActiveTab(firstVisibleError.tab);
      }
      showMessage(
        validationErrors.length
          ? validationErrors.map((validationError) => validationError.message).join("\n")
          : error.message || "Unable to save this contact.",
        validationErrors.length ? MESSAGE_TYPES.WARNING : MESSAGE_TYPES.ERROR,
      );
    }
  };
  const exportContacts = async () => {
    if (!resolvedPermissions.canExportContacts) return;
    try {
      const freshLookups = await loadFreshPhoneBookLookups(sessionUser?.token);
      let totalCount = 0;
      const allLeads = [];
      const pageSize = 200;
      let page = 1;
      do {
        const result = await getPhoneBookContacts({ page, pageSize });
        if (page === 1) totalCount = result.totalCount;
        if (!result.items?.length) break;
        allLeads.push(...result.items);
        page += 1;
      } while (allLeads.length < totalCount);
      if (allLeads.length < totalCount) 
        {
        throw new Error("The CRM returned fewer contacts than expected; no partial workbook was exported.");
      }

      const cachedContacts = readCachedPhoneBookContacts();
      const allContacts = allLeads.map((lead) => mapLeadToContact(lead, cachedContacts));
      const rows = [];
      for (let start = 0; start < allContacts.length; start += 10) {
        const batch = allContacts.slice(start, start + 10);
        const batchRows = await Promise.all(batch.map(async (contact) => {
          const [gridRows, emergencyRows] = await Promise.all([
            getPhoneBookContactGrid(Number(contact.id)),
            getPhoneBookEmergencyContacts(Number(contact.id), sessionUser?.token),
          ]);
          return phoneBookWorkbookRow(
            contact,
            Array.isArray(gridRows) ? gridRows : [],
            Array.isArray(emergencyRows) ? emergencyRows : [],
            freshLookups.branches,
            freshLookups.customerTypes,
            freshLookups.relationships,
          );
        }));
        rows.push(...batchRows);
      }
      const workbook = await buildPhoneBookWorkbook(
        rows,
        createPhoneBookLookups({
          countries: freshLookups.countries,
          branches: freshLookups.branches,
          customerTypes: freshLookups.customerTypes,
          relationships: freshLookups.relationships,
          cityAreas: phoneBookCityAreas,
        }),
      );
      downloadWorkbook(workbook, "girikand-phonebook-contacts.xlsx");
      notify("Phonebook exported to Excel.");
    } catch (error) {
      showMessage(
        error.message || "Unable to export the complete phonebook.",
        MESSAGE_TYPES.ERROR,
      );
    }
  };
  const downloadImportTemplate = async () => {
    if (!resolvedPermissions.canImportContacts) return;
    try {
      const freshLookups = await loadFreshPhoneBookLookups(sessionUser?.token);
      const workbook = await buildPhoneBookWorkbook(
        [],
        createPhoneBookLookups({
          countries: freshLookups.countries,
          branches: freshLookups.branches,
          customerTypes: freshLookups.customerTypes,
          relationships: freshLookups.relationships,
          cityAreas: phoneBookCityAreas,
        }),
      );
      downloadWorkbook(workbook, "girikand-phonebook-import-template.xlsx");
    } catch (error) {
      showMessage(
        error.message || "Unable to create the phonebook import template.",
        MESSAGE_TYPES.ERROR,
      );
    }
  };
  const importContacts = async (event) => {
    if (!resolvedPermissions.canImportContacts) return;
    const file = event.target.files?.[0];
    if (!file) return;
    const fileInput = event.target;
    try {
      const freshLookups = await loadFreshPhoneBookLookups(sessionUser?.token);
      const records = await parsePhoneBookWorkbook(await file.arrayBuffer());
      if (!records.length) throw new Error("The workbook has no contact rows to import.");

      const importedContacts = [];
      const failures = [];
      let createdCount = 0;
      const branchById = new Map(freshLookups.branches.map((branch) => [
        String(branch.id ?? branch.Id),
        branch,
      ]));
      const makePayload = (contact) => ({
        firstName: contact.firstName.trim(),
        middleName: contact.middleName.trim(),
        lastName: contact.lastName.trim(),
        title: contact.prefix,
        gender: contact.gender,
        birthDate: contact.dateOfBirth || null,
        homeBranchId: Number(contact.homeBranchId),
        customerType: contact.customerType == null ? null : Number(contact.customerType),
        companyName: contact.company || "",
        designation: contact.designation || "",
        industry: contact.industry || "",
        department: contact.department || "",
        customerSince: contact.customerSince || null,
        city: contact.city || "",
        area: contact.area || "",
      });

      for (const { sourceRow, values } of records) {
        let contact;
        let savedLead = null;
        let leadId = null;
        let wasCreated = false;
        let emergencyContactsBeforeImport = [];
        try {
          contact = mapPhoneBookWorkbookValues(values, {
            branches: freshLookups.branches,
            countries: freshLookups.countries,
            customerTypes: freshLookups.customerTypes,
            relationships: freshLookups.relationships,
          });
          contact.homeBranchId = branchById.get(String(contact.homeBranchId))?.id ??
            branchById.get(String(contact.homeBranchId))?.Id;
          if (!contact.homeBranchId) throw new Error("The selected home branch is no longer available.");

          const primary = contact.phones.find((phone) => phone.type === "Primary");
          const matches = await findPhoneBookMatches(primary.number, primary.countryCode);
          const primaryMatches = (Array.isArray(matches) ? matches : []).filter(
            (match) => String(match.matchedOn || match.MatchedOn || "").toUpperCase() === "PRIMARY",
          );
          if (primaryMatches.length > 1) {
            throw new Error("More than one existing lead has this primary phone; the row was not imported.");
          }

          let savedRows;
          if (primaryMatches.length === 1) {
            const match = primaryMatches[0];
            leadId = match.leadId ?? match.LeadId ?? match.leadID ?? match.LeadID ?? match.id;
            if (leadId == null) throw new Error("Duplicate lookup returned no lead ID; the row was not imported.");
            const existingName = [
              match.title || match.Title,
              match.firstName || match.FirstName,
              match.lastName || match.LastName,
            ].filter(Boolean).join(" ");
            const overwrite = window.confirm(
              `Primary phone ${primary.countryCode} ${primary.number} already belongs to ${existingName || `lead ${leadId}`}.\n\nOverwrite this lead with the workbook row?\nChoose Cancel to skip it.`,
            );
            if (!overwrite) {
              failures.push({
                sourceRow,
                name: `${contact.firstName} ${contact.lastName}`,
                phone: `${primary.countryCode} ${primary.number}`,
                result: "Skipped — duplicate primary phone",
                message: "Existing lead was left unchanged at the user's request.",
              });
              continue;
            }
            emergencyContactsBeforeImport = await getPhoneBookEmergencyContacts(
              Number(leadId),
              sessionUser?.token,
            );
            savedRows = await savePhoneBookContactGrid(Number(leadId), {
              ...makePayload(contact),
              rows: mapFormToGridRows(contact),
            });
            savedLead = match;
          } else {
            savedLead = await createPhoneBookContact({
              ...makePayload(contact),
              phone: primary.number,
              countryCode: primary.countryCode,
              email: contact.emails.find((email) => email.type === "Primary")?.email || "",
              isWhatsApp: primary.whatsapp,
              customerType: contact.customerType,
              contactRows: mapFormToGridRows(contact),
            });
            leadId = savedLead.leadId ?? savedLead.LeadId ?? savedLead.leadID ?? savedLead.LeadID ?? savedLead.id;
            wasCreated = true;
            if (leadId == null) throw new Error("The create response did not include the new lead ID.");
            savedRows = await getPhoneBookContactGrid(Number(leadId));
          }

          const savedEmergencyContacts = await savePhoneBookEmergencyContacts(
            Number(leadId),
            contact.emergencyContacts,
            sessionUser?.token,
          );
          const leadForContact = {
            ...savedLead,
            leadId,
            title: contact.prefix,
            firstName: contact.firstName,
            middleName: contact.middleName,
            lastName: contact.lastName,
            gender: contact.gender,
            birthDate: contact.dateOfBirth || null,
            homeBranchId: contact.homeBranchId,
            companyName: contact.company,
            designation: contact.designation,
            industry: contact.industry,
            department: contact.department,
            customerSince: contact.customerSince,
            city: contact.city,
            area: contact.area,
          };
          const importedContact = {
            ...mapLeadToContact(leadForContact, contacts),
            ...contact,
            id: String(leadId),
            phones: Array.isArray(savedRows) && savedRows.length
              ? mapGridRowsToMethods(savedRows).phones
              : contact.phones,
            emails: Array.isArray(savedRows) && savedRows.length
              ? mapGridRowsToMethods(savedRows).emails
              : contact.emails,
            emergencyContacts: savedEmergencyContacts?.length
              ? savedEmergencyContacts.map((row) => ({ ...row }))
              : Array.isArray(savedEmergencyContacts) || !contact.emergencyContacts.length
                ? [createBlankEmergencyContact()]
                : contact.emergencyContacts,
          };
          importedContacts.push({ contact: importedContact, wasCreated });
          if (wasCreated) createdCount += 1;
        } catch (error) {
          if (savedLead && leadId != null) {
            importedContacts.push({
              contact: {
                ...mapLeadToContact(
                  { ...savedLead, leadId },
                  contacts,
                ),
                ...(contact || {}),
                id: String(leadId),
                emergencyContacts: wasCreated
                  ? [createBlankEmergencyContact()]
                  : emergencyContactsBeforeImport,
              },
              wasCreated,
            });
            if (wasCreated) createdCount += 1;
          }
          failures.push({
            sourceRow,
            name: contact ? `${contact.firstName} ${contact.lastName}` : "",
            phone: contact?.phones?.find((phone) => phone.type === "Primary")
              ? `${contact.phones.find((phone) => phone.type === "Primary").countryCode} ${contact.phones.find((phone) => phone.type === "Primary").number}`
              : "",
            result: savedLead ? "Partial" : "Failed",
            message: savedLead
              ? `Lead ${wasCreated ? "was created" : "was updated"}, but the import could not fully complete: ${error.message}`
              : error.message || "Unable to import this row.",
          });
        }
      }

      if (importedContacts.length) {
        setContacts((current) => {
          const byId = new Map(current.map((contact) => [String(contact.id), contact]));
          importedContacts.forEach(({ contact }) => byId.set(String(contact.id), contact));
          return Array.from(byId.values());
        });
        if (createdCount) setTotalContacts((count) => count + createdCount);
      }
      if (failures.length) {
        const report = await buildPhoneBookFailureWorkbook(failures);
        downloadWorkbook(report, "girikand-phonebook-import-results.xlsx");
        const details = failures
          .slice(0, 20)
          .map((failure) => `Row ${failure.sourceRow}: ${failure.name || "Contact"} — ${failure.result}: ${failure.message}`)
          .join("\n");
        showMessage(
          `${createdCount} new leads created; ${importedContacts.length - createdCount} existing leads updated; ${failures.length} rows skipped or unsuccessful. A full row-by-row report was downloaded.\n\n${details}`,
          MESSAGE_TYPES.WARNING,
        );
      } else {
        showMessage(
          `${createdCount} new leads created; ${importedContacts.length - createdCount} existing leads updated. All workbook rows were imported.`,
          MESSAGE_TYPES.INFO,
        );
      }
    } catch (error) {
      showMessage(
        error.message || "Unable to import the workbook.",
        MESSAGE_TYPES.ERROR,
      );
    } finally {
      fileInput.value = "";
    }
  };
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100";
  const originalPhonebookContact = editingId
    ? contacts.find((contact) => contact.id === editingId)
    : null;
  const originalPrimaryPhone = originalPhonebookContact?.phones?.find(
    (phone) => phone.type === "Primary",
  );
  const currentPrimaryPhone = form.phones?.find(
    (phone) => phone.type === "Primary",
  );
  const allowUnchangedLegacyPrimaryPhone =
    Boolean(currentPrimaryPhone?.number) &&
    !originalPrimaryPhone?.countryCode &&
    normalizePhoneDigits(currentPrimaryPhone?.number) ===
      normalizePhoneDigits(originalPrimaryPhone?.number);
  const tabProps = {
    form, setValue, setCompanyDetail, setEmergencyDetail, setPassportDetail,
    branches, branchLoadError, cityAreas: phoneBookCityAreas,
    countries, countryLoadError, phoneMatches,
    customerTypes, customerTypeLoadError,
    hasFieldError, getFieldError,
    updatePhoneValue, checkPhoneMatches,
    emergencyRelations,
    emergencyRelationsError: emergencyRelationsError || emergencyContactsLoadError,
    updateEmergencyContactValue,
    addEmergencyContact,
    removeEmergencyContact,
    allowUnchangedLegacyPrimaryPhone,
    setFamilyMemberEmergency,
    setArrayItem, addArrayItem, removeArrayItem, setAddressItem, addAddress,
    removeAddress, addTagValue, familyTagInput, setFamilyTagInput,
    interestInput, setInterestInput, handlePhotoUpload, inputClass,
  };

  if (!resolvedPermissions.canViewPhonebook) {
    return (
      <div className="phonebook-revamp phonebook-access-denied">
        <p>You do not have permission to view the phonebook.</p>
      </div>
    );
  }

  return (
    <div className="phonebook-revamp">
      <div className="phonebook-shell">
        <header className="phonebook-header">
          <div className="phonebook-heading">
            <span className="phonebook-brand-icon" aria-hidden="true">P</span>
            <div>
              <h1>Phonebook</h1>
              <p>{totalContacts.toLocaleString()} contacts</p>
            </div>
          </div>
          <div className="phonebook-header-actions">
            {resolvedPermissions.canImportContacts && (
              <button
                type="button"
                onClick={downloadImportTemplate}
                className="phonebook-button phonebook-button-secondary"
              >
                Excel template
              </button>
            )}
            {resolvedPermissions.canImportContacts && (
              <label className="phonebook-button phonebook-button-secondary">
                <span aria-hidden="true">↑</span> Import
                <input
                  type="file"
                  accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={importContacts}
                  aria-label="Import contacts from Excel workbook"
                  className="phonebook-file-input"
                />
              </label>
            )}
            {resolvedPermissions.canExportContacts && (
              <button
                type="button"
                onClick={exportContacts}
                className="phonebook-button phonebook-button-secondary"
              >
                <span aria-hidden="true">↓</span> Export
              </button>
            )}
            {canCreateContact && (
              <button
                type="button"
                onClick={openAdd}
                className="phonebook-button phonebook-button-primary"
              >
                <span aria-hidden="true">＋</span> Add contact
              </button>
            )}
          </div>
        </header>

        <main className="phonebook-workspace">
          <aside className="phonebook-sidebar" aria-label="Contact list">
            <div className="phonebook-sidebar-tools">
              <label className="phonebook-search">
                <span aria-hidden="true">⌕</span>
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                  }}
                  placeholder="Search name, phone, email"
                  aria-label="Search contacts"
                />
              </label>
              <div className="phonebook-quick-filters">
                <button
                  type="button"
                  className="phonebook-filter-chip is-active"
                  onClick={() => {
                    setCityFilter("All");
                    setTagFilter("All");
                    setSourceFilter("All");
                  }}
                >
                  My contacts
                </button>
                <label className="phonebook-filter-select">
                  <span className="sr-only">Filter by tag</span>
                  <select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)}>
                    <option value="All">Tag</option>
                    {tags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
                  </select>
                </label>
                <label className="phonebook-filter-select">
                  <span className="sr-only">Filter by source</span>
                  <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
                    <option value="All">Source</option>
                    {sources.map((source) => <option key={source} value={source}>{source}</option>)}
                  </select>
                </label>
                <button
                  type="button"
                  className={`phonebook-filter-chip ${sortOrder === "recent" ? "is-active" : ""}`}
                  onClick={() => setSortOrder((current) => current === "recent" ? "A-Z" : "recent")}
                >
                  Last contacted
                </button>
              </div>
              <div className="phonebook-list-filters">
                <label>
                  <span className="sr-only">City</span>
                  <select value={cityFilter} onChange={(event) => setCityFilter(event.target.value)}>
                    {cities.map((city) => <option key={city} value={city}>{city === "All" ? "All cities" : city}</option>)}
                  </select>
                </label>
              </div>
            </div>

            {contactsError && (
              <div role="alert" className="phonebook-list-error">
                {contactsError}
              </div>
            )}

            {isLoadingContacts && contacts.length === 0 && (
              <div className="phonebook-list-status">Loading CRM contacts…</div>
            )}

            <div className="phonebook-list-body">
              <div className="phonebook-contact-list">
                {filteredContacts.map((contact) => {
                  const isSelected = selectedContact?.id === contact.id;
                  const primaryPhone = firstPhone(contact);
                  return (
                    <div
                      className={`phonebook-contact-row ${isSelected ? "is-selected" : ""}`}
                      key={contact.id}
                    >
                      <button
                        type="button"
                        className="phonebook-contact-select"
                        onClick={() => openEdit(contact)}
                        aria-current={isSelected ? "true" : undefined}
                      >
                        {contact.photo ? (
                          <img src={contact.photo} alt="" className="phonebook-avatar" />
                        ) : (
                          <span className={`phonebook-avatar phonebook-avatar-initials ${isSelected ? "is-selected" : ""}`}>
                            {getInitials(contact)}
                          </span>
                        )}
                        <span className="phonebook-contact-copy">
                          <strong>{getFullName(contact)}</strong>
                          <span>{resolvedPermissions.canViewContact ? primaryPhone : "Contact"}</span>
                        </span>
                        <span className="phonebook-contact-meta">
                          <span>{formatLastContacted(contact.lastContactedAt)}</span>
                        </span>
                      </button>
                    </div>
                  );
                })}
                {!isLoadingContacts && filteredContacts.length === 0 && (
                  <div className="phonebook-empty-state">
                    <strong>No contacts found</strong>
                    <span>Try a different search or filter.</span>
                    {canCreateContact && (
                      <button type="button" onClick={openAdd} className="phonebook-button phonebook-button-primary">
                        Add contact
                      </button>
                    )}
                  </div>
                )}
              </div>

              <nav className="phonebook-alphabet" aria-label="Jump to contact by first name">
                <button
                  type="button"
                  aria-pressed={!selectedLetter}
                  className={!selectedLetter ? "is-active" : ""}
                  onClick={() => {
                    setSelectedLetter("");
                  }}
                  title="Show all contacts"
                >
                  All
                </button>
                {Array.from({ length: 26 }, (_, index) =>
                  String.fromCharCode(65 + index),
                ).map((letter) => (
                  <button
                    type="button"
                    key={letter}
                    aria-label={`Show contacts beginning with ${letter}`}
                    aria-pressed={selectedLetter === letter}
                    className={selectedLetter === letter ? "is-active" : ""}
                    onClick={() => {
                      setSelectedLetter(letter);
                    }}
                  >
                    {letter}
                  </button>
                ))}
              </nav>
            </div>
            <footer className="phonebook-sidebar-footer">
              <span>Showing {filteredContacts.length} of {totalContacts} contacts</span>
            </footer>
          </aside>

          <section className="phonebook-profile" aria-label="Contact details">
            {!resolvedPermissions.canViewContact && !isAdding ? (
              <div className="phonebook-profile-empty">You do not have permission to view contact details.</div>
            ) : selectedContact || isAdding ? (
              <form onSubmit={saveContact} className="phonebook-editor-form">
                <header className="phonebook-profile-header">
                  {(form.photo || selectedContact?.photo) ? (
                    <img src={form.photo || selectedContact.photo} alt="" className="phonebook-profile-avatar" />
                  ) : (
                    <span className="phonebook-profile-avatar phonebook-avatar-initials">
                      {getInitials(form)}
                    </span>
                  )}
                  <div className="phonebook-profile-identity">
                    <h2>{isAdding ? "Add contact" : getFullName(form)}</h2>
                    <p>
                      {firstPhone(form)}
                      {primaryEmail(form) !== "—" ? ` · ${primaryEmail(form)}` : ""}
                    </p>
                  </div>
                </header>

                <div className="phonebook-communication-actions" aria-label="Contact actions">
                  {selectedPhone ? (
                    <a className="phonebook-button phonebook-button-secondary" href={`tel:${dialableNumber(selectedPhone)}`}>Call</a>
                  ) : (
                    <button type="button" className="phonebook-button phonebook-button-secondary is-disabled" disabled>Call</button>
                  )}
                  {selectedPhone?.whatsapp ? (
                    <a className="phonebook-button phonebook-button-secondary" href={`https://wa.me/${dialableNumber(selectedPhone).replace(/\D/g, "")}`} target="_blank" rel="noreferrer">WhatsApp</a>
                  ) : (
                    <button type="button" className="phonebook-button phonebook-button-secondary is-disabled" disabled>WhatsApp</button>
                  )}
                  {selectedPhone ? (
                    <a className="phonebook-button phonebook-button-secondary" href={`sms:${dialableNumber(selectedPhone)}`}>SMS</a>
                  ) : (
                    <button type="button" className="phonebook-button phonebook-button-secondary is-disabled" disabled>SMS</button>
                  )}
                  {selectedEmail ? (
                    <a className="phonebook-button phonebook-button-secondary" href={`mailto:${selectedEmail.email}`}>Email</a>
                  ) : (
                    <button type="button" className="phonebook-button phonebook-button-secondary is-disabled" disabled>Email</button>
                  )}
                </div>

                {visibleTabs.length > 0 ? (
                  <>
                    <div role="tablist" aria-label="Contact sections" className="phonebook-profile-tabs">
                      {visibleTabs.map(({ key, label }) => (
                        <button
                          type="button"
                          role="tab"
                          aria-selected={activeTab === key}
                          className={`phonebook-profile-tab ${activeTab === key ? "is-active" : ""}`}
                          key={key}
                          onClick={() => setActiveTab(key)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="phonebook-profile-content">
                      {formErrors.length > 0 && (
                        <div role="alert" className="phonebook-validation-summary">
                          <strong>Please correct these fields before saving:</strong>
                          <ul>
                            {formErrors.map((error, index) => (
                              <li key={`${error.tab}-${index}`}>{error.message}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div hidden={activeTab !== "details"}>
                        <fieldset
                          disabled={
                            !(isAdding ? canCreateContact : resolvedPermissions.canEditContact) ||
                            !resolvedPermissions.tabs.details?.canEdit
                          }
                          className="phonebook-tab-fieldset"
                        >
                          <PersonalDetailsTab {...tabProps} />
                        </fieldset>
                      </div>
                      {canViewContactSection && (
                        <div hidden={activeTab !== "contact"}>
                          <fieldset
                            disabled={
                              !(isAdding ? canCreateContact : resolvedPermissions.canEditContact) ||
                              !resolvedPermissions.tabs.contact?.canEdit
                            }
                            className="phonebook-tab-fieldset"
                          >
                            <ContactMethodsTab {...tabProps} />
                          </fieldset>
                        </div>
                      )}
                      <div hidden={activeTab !== "family"}>
                        <fieldset
                          disabled={
                            !(isAdding ? canCreateContact : resolvedPermissions.canEditContact) ||
                            !resolvedPermissions.tabs.family?.canEdit
                          }
                          className="phonebook-tab-fieldset"
                        >
                          <FamilyDetailsTab {...tabProps} />
                        </fieldset>
                      </div>
                      <div hidden={activeTab !== "travel"}>
                        <fieldset
                          disabled={
                            !(isAdding ? canCreateContact : resolvedPermissions.canEditContact) ||
                            !resolvedPermissions.tabs.travel?.canEdit
                          }
                          className="phonebook-tab-fieldset"
                        >
                          <TravelDetailsTab {...tabProps} />
                        </fieldset>
                      </div>
                      <div hidden={activeTab !== "address"}>
                        <fieldset
                          disabled={
                            !(isAdding ? canCreateContact : resolvedPermissions.canEditContact) ||
                            !resolvedPermissions.tabs.address?.canEdit
                          }
                          className="phonebook-tab-fieldset"
                        >
                          <AddressDetailsTab {...tabProps} />
                        </fieldset>
                      </div>
                    </div>
                    <footer className="phonebook-editor-footer">
                      <span>
                        {isAdding || canEditContactRecord
                          ? "Lead details and phone/email are saved to the CRM. Extended profile sections remain in this browser."
                          : "View-only access"}
                      </span>
                      {(isAdding ? canCreateContact : canEditContactRecord) && (
                        <div>
                          <button type="button" className="phonebook-button phonebook-button-secondary" onClick={cancelEditing}>
                            Cancel
                          </button>
                          <button type="submit" className="phonebook-button phonebook-button-primary">
                            {isAdding ? "Save contact" : "Save changes"}
                          </button>
                        </div>
                      )}
                    </footer>
                  </>
                ) : (
                  <div className="phonebook-profile-empty">No contact sections are currently available.</div>
                )}
              </form>
            ) : (
              <div className="phonebook-profile-empty">Select a contact to view their details.</div>
            )}
          </section>
        </main>
      </div>
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-xl"
        >
          {toast}
        </div>
      )}

    </div>
  );
}
