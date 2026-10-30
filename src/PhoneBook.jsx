import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "phonebook_contacts_v1";

const emptyContact = {
  id: "",
  prefix: "",
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  maritalStatus: "",
  company: "",
  designation: "",
  industry: "",
  department: "",
  customerSince: "",
  userId: "",
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
  category: "Customer",
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

const sampleContacts = [
  {
    ...emptyContact,
    id: "c1",
    firstName: "Anita",
    lastName: "Patil",
    company: "Infosys",
    category: "Visa",
    priority: "High",
    phones: [
      { type: "Primary", number: "+91 99xxx 67890", whatsapp: true },
      { type: "Secondary", number: "+91 98xxx 67890", whatsapp: false },
    ],
    emails: [
      { type: "Primary", email: "anita.patil@example.com" },
      { type: "Secondary", email: "anita.work@example.com" },
    ],
    familyName: "Patil",
    relation: "Self",
    primaryAddress: {
      addressType: "Home",
      lane: "Lane 4",
      plotNo: "12",
      area: "Kothrud",
      city: "Pune",
      state: "Maharashtra",
      pinCode: "411038",
      country: "India",
    },
  },
  {
    ...emptyContact,
    id: "c2",
    firstName: "Aarav",
    lastName: "Sharma",
    category: "Holiday",
    priority: "Normal",
    phones: [{ type: "Primary", number: "+91 98xxx 11111", whatsapp: true }],
    emails: [{ type: "Primary", email: "aarav.sharma@example.com" }],
    familyName: "Sharma",
    relation: "Son",
    primaryAddress: {
      addressType: "Home",
      lane: "Lane 2",
      plotNo: "8",
      area: "Baner",
      city: "Pune",
      state: "Maharashtra",
      pinCode: "411045",
      country: "India",
    },
  },
  {
    ...emptyContact,
    id: "c3",
    firstName: "Mahesh",
    lastName: "Kulkarni",
    company: "Tata Motors",
    category: "Air ticket",
    priority: "Low",
    phones: [{ type: "Primary", number: "+91 97xxx 24680", whatsapp: false }],
    emails: [{ type: "Primary", email: "mahesh.k@example.com" }],
    primaryAddress: {
      addressType: "Home",
      lane: "Main Road",
      plotNo: "44",
      area: "Andheri",
      city: "Mumbai",
      state: "Maharashtra",
      pinCode: "400053",
      country: "India",
    },
  },
  {
    ...emptyContact,
    id: "c4",
    firstName: "Meena",
    lastName: "Sharma",
    category: "Customer",
    priority: "Normal",
    phones: [{ type: "Primary", number: "+91 98xxx 77777", whatsapp: true }],
    emails: [{ type: "Primary", email: "meena.sharma@example.com" }],
    familyName: "Sharma",
    relation: "Spouse",
    primaryAddress: {
      addressType: "Home",
      lane: "Lane 2",
      plotNo: "8",
      area: "Baner",
      city: "Pune",
      state: "Maharashtra",
      pinCode: "411045",
      country: "India",
    },
  },
  {
    ...emptyContact,
    id: "c5",
    firstName: "Rohit",
    lastName: "Sharma",
    company: "Acme Technologies",
    category: "Holiday",
    priority: "High",
    phones: [{ type: "Primary", number: "+91 98xxx 12345", whatsapp: true }],
    emails: [{ type: "Primary", email: "rohit.sharma@example.com" }],
    familyName: "Sharma",
    relation: "Self",
    primaryAddress: {
      addressType: "Home",
      lane: "Lane 2",
      plotNo: "8",
      area: "Baner",
      city: "Pune",
      state: "Maharashtra",
      pinCode: "411045",
      country: "India",
    },
  },
  {
    ...emptyContact,
    id: "c6",
    firstName: "Ritu",
    lastName: "Deshmukh",
    category: "Holiday",
    priority: "Normal",
    phones: [{ type: "Primary", number: "+91 96xxx 13579", whatsapp: false }],
    emails: [{ type: "Primary", email: "ritu.d@example.com" }],
    primaryAddress: {
      addressType: "Home",
      lane: "College Road",
      plotNo: "17",
      area: "Gangapur Road",
      city: "Nashik",
      state: "Maharashtra",
      pinCode: "422005",
      country: "India",
    },
  },
];

const categoryColors = {
  Holiday: "bg-green-100 text-green-800",
  Visa: "bg-amber-100 text-amber-800",
  "Air ticket": "bg-blue-100 text-blue-800",
  Customer: "bg-slate-100 text-slate-700",
  VIP: "bg-amber-100 text-amber-800",
  VVIP: "bg-rose-100 text-rose-800",
  Corporate: "bg-purple-100 text-purple-800",
  Supplier: "bg-orange-100 text-orange-800",
  Other: "bg-gray-100 text-gray-700",
};

const getFullName = (contact) =>
  `${contact.prefix ? `${contact.prefix} ` : ""}${contact.firstName || ""} ${contact.lastName || ""}`.trim();
const getInitials = (contact) =>
  `${contact.firstName?.[0] || ""}${contact.lastName?.[0] || ""}`.toUpperCase() ||
  "?";
const firstPhone = (contact) =>
  contact.phones?.find((p) => p.type === "Primary" && p.number)?.number ||
  contact.phones?.find((p) => p.number)?.number ||
  "—";
const primaryEmail = (contact) =>
  contact.emails?.find((e) => e.type === "Primary" && e.email)?.email ||
  contact.emails?.find((e) => e.email)?.email ||
  "—";
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

function Field({ label, children, className = "" }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="mb-1 block text-xs font-medium text-slate-600 sm:text-[13px]">
        {label}
      </span>
      {children}
    </label>
  );
}
function TextInput({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 ${className}`}
    />
  );
}
function SelectInput({ children, className = "", ...props }) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 ${className}`}
    >
      {children}
    </select>
  );
}
function SectionTitle({ children, hint }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="font-semibold text-slate-900">{children}</h3>
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
  );
}

export default function PhoneBook() {
  const [contacts, setContacts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : sampleContacts;
    } catch {
      return sampleContacts;
    }
  });
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeLetter, setActiveLetter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewContact, setViewContact] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyContact);
  const [activeTab, setActiveTab] = useState("details");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState("");
  const [familyTagInput, setFamilyTagInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch { }
  }, [contacts]);

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
  const filteredContacts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts
      .filter((c) => {
        const haystack = [
          getFullName(c),
          c.company,
          c.category,
          c.familyName,
          (c.addresses?.find((a) => a.isPrimary && a.city) || c.primaryAddress)
            ?.city,
          c.companyDetails?.gstNumber,
          c.phones?.map((p) => p.number).join(" "),
          c.emails?.map((e) => e.email).join(" "),
        ]
          .join(" ")
          .toLowerCase();
        return (
          (!q || haystack.includes(q)) &&
          (categoryFilter === "All" || c.category === categoryFilter) &&
          (cityFilter === "All" ||
            (
              c.addresses?.find((a) => a.isPrimary && a.city) ||
              c.primaryAddress
            )?.city === cityFilter) &&
          (!activeLetter ||
            getFullName(c).toUpperCase().startsWith(activeLetter))
        );
      })
      .sort((a, b) =>
        sortOrder === "A-Z"
          ? getFullName(a).localeCompare(getFullName(b))
          : getFullName(b).localeCompare(getFullName(a)),
      );
  }, [contacts, search, categoryFilter, cityFilter, sortOrder, activeLetter]);

  const groupedContacts = useMemo(
    () =>
      filteredContacts.reduce((groups, contact) => {
        const letter = getFullName(contact).charAt(0).toUpperCase() || "#";
        (groups[letter] ||= []).push(contact);
        return groups;
      }, {}),
    [filteredContacts],
  );

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };
  const openAdd = () => {
    setEditingId(null);
    setForm({
      ...emptyContact,
      id: "",
      phones: [{ type: "Primary", number: "", whatsapp: false }],
      emails: [{ type: "Primary", email: "" }],
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
    setActiveTab("details");
    setModalOpen(true);
  };
  const openEdit = (contact) => {
    setEditingId(contact.id);
    const legacyAddresses = contact.addresses?.some(
      (a) => a.city || a.lane || a.plotNo || a.area,
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
            (v) => v && !["Office", "India"].includes(v),
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
    setForm({
      ...emptyContact,
      ...contact,
      phones: contact.phones?.length
        ? contact.phones.map((x) => ({ ...x }))
        : [{ type: "Primary", number: "", whatsapp: false }],
      emails: contact.emails?.length
        ? contact.emails.map((x) => ({ ...x }))
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
      visas: (contact.visas || []).map((x) => ({ ...x })),
      travelHistory: (contact.travelHistory || []).map((x) => ({ ...x })),
      interests: contact.interests || [],
      familyTags: contact.familyTags || [],
      familyMembers: (contact.familyMembers || []).map((x) => ({ ...x })),
      addresses: legacyAddresses,
    });
    setFamilyTagInput("");
    setInterestInput("");
    setViewContact(null);
    setActiveTab("details");
    setModalOpen(true);
  };
  const setValue = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));
  const setAddress = (key, field, value) =>
    setForm((current) => ({
      ...current,
      [key]: { ...current[key], [field]: value },
    }));
  const setCompanyDetail = (field, value) =>
    setForm((current) => ({
      ...current,
      companyDetails: { ...current.companyDetails, [field]: value },
    }));
  const setPassportDetail = (field, value) =>
    setForm((current) => ({
      ...current,
      passport: { ...current.passport, [field]: value },
    }));
  const setEmergencyDetail = (field, value) =>
    setForm((current) => ({
      ...current,
      emergencyContact: { ...current.emergencyContact, [field]: value },
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
  const addTagValue = (field, value, clearInput) => {
    const cleanValue = value.trim();
    if (!cleanValue) return;
    setForm((current) => ({
      ...current,
      [field]: [...new Set([...(current[field] || []), cleanValue])],
    }));
    clearInput("");
  };
  const setAddressItem = (index, field, value) =>
    setForm((current) => ({
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
    setForm((current) => ({
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
    setForm((current) => {
      const addresses = current.addresses.filter((_, i) => i !== index);
      if (addresses.length && !addresses.some((a) => a.isPrimary))
        addresses[0].isPrimary = true;
      return { ...current, addresses };
    });
  const setArrayItem = (key, index, field, value) =>
    setForm((current) => ({
      ...current,
      [key]: current[key].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  const addArrayItem = (key, item) =>
    setForm((current) => ({ ...current, [key]: [...current[key], item] }));
  const removeArrayItem = (key, index) =>
    setForm((current) => ({
      ...current,
      [key]: current[key].filter((_, i) => i !== index),
    }));
  const saveContact = (event) => {
    event.preventDefault();
    if (!form.firstName.trim()) {
      setActiveTab("details");
      notify("First name is required.");
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
    const cleaned = {
      ...form,
      id: editingId || `contact_${Date.now()}`,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phones: form.phones.filter((p) => p.number.trim()),
      emails: form.emails.filter((e) => e.email.trim()),
      addresses,
      primaryAddress,
      officeAddress,
    };
    setContacts((current) =>
      editingId
        ? current.map((c) => (c.id === editingId ? cleaned : c))
        : [...current, cleaned],
    );
    setSelectedIds((current) => current.filter((id) => id !== editingId));
    setModalOpen(false);
    notify(
      editingId
        ? "Contact updated successfully."
        : "Contact added successfully.",
    );
  };
  const deleteContact = (id) => {
    setContacts((current) => current.filter((c) => c.id !== id));
    setSelectedIds((current) => current.filter((x) => x !== id));
    setConfirmDelete(null);
    setViewContact(null);
    notify("Contact deleted.");
  };
  const toggleSelected = (id) =>
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  const toggleAll = () =>
    setSelectedIds((current) => {
      const visibleIds = filteredContacts.map((c) => c.id);
      const allVisibleSelected =
        visibleIds.length > 0 && visibleIds.every((id) => current.includes(id));
      return allVisibleSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : [...new Set([...current, ...visibleIds])];
    });
  const csvColumns = [
    "prefix",
    "firstName",
    "lastName",
    "gender",
    "dateOfBirth",
    "maritalStatus",
    "company",
    "designation",
    "industry",
    "department",
    "customerSince",
    "userId",
    "category",
    "priority",
    "familyName",
    "relation",
    "phone",
    "email",
    "city",
    "state",
    "pinCode",
    "country",
    "interests",
    "notes",
  ];
  const csvEscape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const exportContacts = () => {
    const rows = contacts.map((c) => {
      const address =
        c.addresses?.find((a) => a.isPrimary) || c.primaryAddress || {};
      return csvColumns
        .map((key) => {
          let value = c[key];
          if (key === "phone")
            value = firstPhone(c) === "—" ? "" : firstPhone(c);
          if (key === "email")
            value = primaryEmail(c) === "—" ? "" : primaryEmail(c);
          if (
            key === "city" ||
            key === "state" ||
            key === "pinCode" ||
            key === "country"
          )
            value = address[key];
          if (key === "interests") value = (c.interests || []).join("; ");
          return csvEscape(value);
        })
        .join(",");
    });
    const csv = [csvColumns.map(csvEscape).join(","), ...rows].join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "phonebook-contacts.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Contacts exported as CSV.");
  };
  const parseCSV = (text) => {
    const rows = [];
    let row = [],
      value = "",
      quoted = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === '"' && quoted && text[i + 1] === '"') {
        value += '"';
        i++;
      } else if (ch === '"') quoted = !quoted;
      else if (ch === "," && !quoted) {
        row.push(value);
        value = "";
      } else if ((ch === "\n" || ch === "\r") && !quoted) {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(value);
        if (row.some((cell) => cell.trim())) rows.push(row);
        row = [];
        value = "";
      } else value += ch;
    }
    if (value.length || row.length) {
      row.push(value);
      rows.push(row);
    }
    return rows;
  };
  const importContacts = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const rows = parseCSV(
          String(reader.result || "").replace(/^\uFEFF/, ""),
        );
        if (rows.length < 2) throw new Error("CSV has no contact rows");
        const headers = rows[0].map((x) => x.trim());
        const imported = rows
          .slice(1)
          .map((cells, i) => {
            const item = Object.fromEntries(
              headers.map((header, j) => [header, cells[j] || ""]),
            );
            const address = {
              ...blankAddress("Home"),
              city: item.city || "",
              state: item.state || "",
              pinCode: item.pinCode || "",
              country: item.country || "India",
            };
            return {
              ...emptyContact,
              ...item,
              id: `import_${Date.now()}_${i}`,
              interests: item.interests
                ? item.interests
                  .split(";")
                  .map((x) => x.trim())
                  .filter(Boolean)
                : [],
              phones: item.phone
                ? [{ type: "Primary", number: item.phone, whatsapp: false }]
                : [],
              emails: item.email
                ? [{ type: "Primary", email: item.email }]
                : [],
              addresses: [
                {
                  id: `address_import_${Date.now()}_${i}`,
                  ...address,
                  isPrimary: true,
                },
              ],
              primaryAddress: address,
              officeAddress: blankAddress("Office"),
            };
          })
          .filter((c) => c.firstName || c.lastName || c.phone || c.email);
        if (!imported.length) throw new Error("No valid contacts found");
        setContacts((current) => [...current, ...imported]);
        notify(`${imported.length} contacts imported from CSV.`);
      } catch {
        notify(
          "Import failed. Please select a valid PhoneBook CSV file exported from this app.",
        );
      }
      event.target.value = "";
    };
    reader.readAsText(file);
  };
  const deleteSelectedContacts = () => {
    if (!selectedIds.length) return;
    const count = selectedIds.length;
    setContacts((current) =>
      current.filter((contact) => !selectedIds.includes(contact.id)),
    );
    setSelectedIds([]);
    notify(`${count} contacts deleted.`);
  };

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100";
  const modalTitle = editingId ? "Edit contact" : "Add new contact";

  return (
    <div className="min-h-screen bg-slate-50 p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-[1600px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="5" y="2.5" width="14" height="19" rx="2" />
                <path d="M9 6h6M9 10h6M9 14h3M10 18h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Phonebook
              </h1>
              <p className="text-sm text-slate-500">
                {contacts.length.toLocaleString()} contacts{" "}
                <span className="mx-1">·</span> Contact management
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50">
              <span>↑</span> Import
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={importContacts}
                className="hidden"
              />
            </label>
            <button
              onClick={exportContacts}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
            >
              <span>↓</span> Export
            </button>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <span className="text-lg leading-none">＋</span> Add contact
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:px-7">
          <div className="relative min-w-0 flex-1">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, email, company..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <SelectInput
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="!w-auto min-w-[140px]"
            >
              <option value="All">All categories</option>
              {[
                "Customer",
                "VIP",
                "VVIP",
                "Holiday",
                "Visa",
                "Air ticket",
                "Corporate",
                "Supplier",
                "Other",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </SelectInput>
            <SelectInput
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="!w-auto min-w-[120px]"
            >
              {cities.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </SelectInput>
            <SelectInput
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="!w-auto min-w-[110px]"
            >
              <option>A-Z</option>
              <option>Z-A</option>
            </SelectInput>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 border-b border-blue-100 bg-blue-50 px-6 py-3 text-sm text-blue-800">
            <strong>{selectedIds.length} selected</strong>
            <span className="text-blue-700">
              Selected contacts can be deleted together.
            </span>
            <button
              onClick={deleteSelectedContacts}
              className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700"
            >
              Delete selected
            </button>
            <button
              onClick={() => {
                setSelectedIds([]);
                notify("Selection cleared.");
              }}
              className="ml-auto font-semibold underline"
            >
              Clear selection
            </button>
          </div>
        )}

        <div className="flex min-h-[420px]">
          <div className="min-w-0 flex-1">
            <div className="hidden grid-cols-[minmax(220px,1.5fr)_minmax(150px,1fr)_minmax(170px,1fr)_minmax(120px,0.8fr)_90px] gap-4 bg-slate-50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 md:grid">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  aria-label="Select all visible contacts"
                  checked={
                    filteredContacts.length > 0 &&
                    filteredContacts.every((c) => selectedIds.includes(c.id))
                  }
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Contact
              </span>
              <span>Phone / WhatsApp</span>
              <span>Category / Family</span>
              <span>Company</span>
              <span className="text-right">Actions</span>
            </div>
            {Object.keys(groupedContacts)
              .sort()
              .map((letter) => (
                <section key={letter}>
                  <div className="border-y border-slate-100 bg-slate-50/80 px-6 py-2 text-sm font-semibold text-slate-600">
                    {letter}
                  </div>
                  {groupedContacts[letter].map((contact) => (
                    <div
                      key={contact.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setViewContact(contact)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setViewContact(contact);
                        }
                      }}
                      className={`group cursor-pointer grid grid-cols-1 gap-3 border-b border-slate-100 px-4 py-4 transition hover:bg-blue-50/60 sm:px-6 md:grid-cols-[minmax(220px,1.5fr)_minmax(150px,1fr)_minmax(170px,1fr)_minmax(120px,0.8fr)_90px] md:items-center md:gap-4 ${selectedIds.includes(contact.id) ? "bg-blue-50" : ""}`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <input
                          type="checkbox"
                          aria-label={`Select ${getFullName(contact)}`}
                          onClick={(e) => e.stopPropagation()}
                          checked={selectedIds.includes(contact.id)}
                          onChange={() => toggleSelected(contact.id)}
                          className="h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewContact(contact);
                          }}
                          className="flex min-w-0 items-center gap-3 text-left"
                        >
                          {contact.photo ? (
                            <img
                              src={contact.photo}
                              alt={getFullName(contact)}
                              className="h-11 w-11 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <span
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${selectedIds.includes(contact.id) ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}
                            >
                              {getInitials(contact)}
                            </span>
                          )}
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-slate-900 hover:text-blue-700">
                              {getFullName(contact)}
                            </span>
                            <span className="block truncate text-sm text-slate-500">
                              {contact.primaryAddress?.city || "No city added"}
                              {contact.designation
                                ? ` · ${contact.designation}`
                                : ""}
                            </span>
                          </span>
                        </button>
                      </div>
                      <div className="pl-7 text-sm md:pl-0">
                        <span className="mb-1 block text-xs text-slate-400 md:hidden">
                          Phone / WhatsApp
                        </span>
                        <span className="font-medium text-slate-700">
                          {firstPhone(contact)}
                        </span>
                        {contact.phones?.some((p) => p.whatsapp) && (
                          <span className="ml-2 inline-flex rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                            WhatsApp
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 pl-7 md:pl-0">
                        <span className="mr-1 w-full text-xs text-slate-400 md:hidden">
                          Category / Family
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${categoryColors[contact.category] || categoryColors.Other}`}
                        >
                          {contact.category || "Other"}
                        </span>
                        {contact.familyName && (
                          <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700">
                            Family: {contact.familyName}
                          </span>
                        )}
                      </div>
                      <div className="hidden truncate text-sm text-slate-500 md:block">
                        {contact.company || "—"}
                      </div>
                      <div className="flex gap-2 pl-7 md:justify-end md:pl-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(contact);
                          }}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(contact);
                          }}
                          className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </section>
              ))}
            {filteredContacts.length === 0 && (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  ⌕
                </div>
                <p className="font-semibold text-slate-800">
                  No contacts found
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Try another search or add a new contact.
                </p>
                <button
                  onClick={openAdd}
                  className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Add contact
                </button>
              </div>
            )}
          </div>
          <aside className="hidden w-12 shrink-0 flex-col items-center border-l border-slate-200 py-3 text-xs text-slate-500 lg:flex">
            {letters.map((letter) => (
              <button
                key={letter}
                onClick={() => {
                  setActiveLetter(letter === "#" ? "#" : letter);
                }}
                className={`flex h-5 w-7 items-center justify-center rounded-md hover:bg-blue-100 hover:text-blue-700 ${activeLetter === letter ? "bg-blue-100 font-bold text-blue-700" : ""}`}
              >
                {letter}
              </button>
            ))}
            <button
              onClick={() => setActiveLetter("")}
              className="mt-2 text-[10px] text-blue-600"
            >
              All
            </button>
          </aside>
        </div>
        <footer className="flex flex-col gap-2 border-t border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <span>
            {selectedIds.length
              ? `${selectedIds.length} selected`
              : "Your contacts, organized in one place"}
          </span>
          <span>
            Showing {filteredContacts.length ? 1 : 0}–{filteredContacts.length}{" "}
            of {contacts.length.toLocaleString()} contacts
          </span>
        </footer>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-xl"
        >
          {toast}
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950/50 p-2  sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <form
            onSubmit={saveContact}
            className="flex h-[96vh] max-h-[980px] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="z-10 shrink-0 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                    {modalTitle}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                    Keep personal, family and business details together.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="shrink-0 rounded-lg p-2 text-xl text-slate-400 hover:bg-slate-100"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="flex flex-wrap gap-1 px-3 pt-1 sm:px-6">
                {[
                  ["details", "Personal details"],
                  ["contact", "Phones & emails"],
                  ["family", "Family & relations"],
                  ["address", "Addresses"],
                  ["travel", "Passport & travel"],
                ].map(([key, label]) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`whitespace-nowrap rounded-t-lg px-2.5 py-2 text-xs font-medium sm:px-3 sm:text-sm ${activeTab === key ? "border-b-2 border-blue-600 bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              {activeTab === "details" && (
                <>
                  <section>
                    <SectionTitle>
                      Personal details <span className="text-red-500">*</span>
                    </SectionTitle>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                      <Field label="Prefix" className="xl:col-span-1">
                        <SelectInput
                          value={form.prefix || ""}
                          onChange={(e) => setValue("prefix", e.target.value)}
                        >
                          <option value="">Select prefix</option>
                          {[
                            "Mr.",
                            "Mrs.",
                            "Ms.",
                            "Miss",
                            "Dr.",
                            "Prof.",
                            "Mx.",
                          ].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </SelectInput>
                      </Field>
                      <Field label="First name *">
                        <TextInput
                          required
                          value={form.firstName}
                          onChange={(e) =>
                            setValue("firstName", e.target.value)
                          }
                          placeholder="e.g. Anita"
                          autoFocus
                        />
                      </Field>
                      <Field label="Last name">
                        <TextInput
                          value={form.lastName}
                          onChange={(e) => setValue("lastName", e.target.value)}
                          placeholder="e.g. Patil"
                        />
                      </Field>
                      <Field label="Gender">
                        <SelectInput
                          value={form.gender || ""}
                          onChange={(e) => setValue("gender", e.target.value)}
                        >
                          <option value="">Select gender</option>
                          {[
                            "Female",
                            "Male",
                            "Non-binary",
                            "Prefer not to say",
                            "Other",
                          ].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </SelectInput>
                      </Field>
                      <Field label="Date of birth">
                        <TextInput
                          type="date"
                          value={form.dateOfBirth || ""}
                          onChange={(e) =>
                            setValue("dateOfBirth", e.target.value)
                          }
                          max={new Date().toISOString().slice(0, 10)}
                        />
                      </Field>
                      <Field label="Marital status">
                        <SelectInput
                          value={form.maritalStatus || ""}
                          onChange={(e) =>
                            setValue("maritalStatus", e.target.value)
                          }
                        >
                          <option value="">Select status</option>
                          {[
                            "Single",
                            "Married",
                            "Divorced",
                            "Widowed",
                            "Separated",
                            "Prefer not to say",
                          ].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </SelectInput>
                      </Field>
                      <Field label="Company">
                        <TextInput
                          value={form.company}
                          onChange={(e) => setValue("company", e.target.value)}
                          placeholder="Company name"
                        />
                      </Field>
                      <Field label="Job title / Designation">
                        <TextInput
                          value={form.designation}
                          onChange={(e) =>
                            setValue("designation", e.target.value)
                          }
                          placeholder="e.g. Sales Manager"
                        />
                      </Field>
                      <Field label="Industry">
                        <TextInput
                          value={form.industry || ""}
                          onChange={(e) => setValue("industry", e.target.value)}
                          placeholder="e.g. IT, Travel, Manufacturing"
                        />
                      </Field>
                      <Field label="Department">
                        <TextInput
                          value={form.department || ""}
                          onChange={(e) =>
                            setValue("department", e.target.value)
                          }
                          placeholder="e.g. HR, Sales, Operations"
                        />
                      </Field>
                      <Field label="Customer since">
                        <TextInput
                          type="date"
                          value={form.customerSince || ""}
                          onChange={(e) =>
                            setValue("customerSince", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="User / Customer ID">
                        <TextInput
                          value={form.userId || ""}
                          onChange={(e) => setValue("userId", e.target.value)}
                          placeholder="Internal customer ID"
                        />
                      </Field>
                      <Field label="Customer category">
                        <SelectInput
                          value={form.category}
                          onChange={(e) => setValue("category", e.target.value)}
                        >
                          {[
                            "Customer",
                            "VIP",
                            "VVIP",
                            "Holiday",
                            "Visa",
                            "Air ticket",
                            "Corporate",
                            "Supplier",
                            "Other",
                          ].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </SelectInput>
                      </Field>
                      <Field label="Priority">
                        <SelectInput
                          value={form.priority}
                          onChange={(e) => setValue("priority", e.target.value)}
                        >
                          {["Low", "Normal", "High", "Urgent"].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </SelectInput>
                      </Field>
                    </div>
                    <div className="mt-4 rounded-xl border border-slate-200 p-4">
                      <label className="flex items-start gap-3 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={!!form.isOwnCompany}
                          onChange={(e) =>
                            setValue("isOwnCompany", e.target.checked)
                          }
                          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>
                          <strong>Own company</strong>
                          <span className="mt-0.5 block text-xs text-slate-500">
                            Select if this contact owns or represents their own
                            business.
                          </span>
                        </span>
                      </label>
                    </div>
                  </section>
                  <section>
                    <SectionTitle>
                      Company details{" "}
                      <span className="font-normal text-slate-400">
                        (optional)
                      </span>
                    </SectionTitle>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <Field label="Company name">
                        <TextInput
                          value={
                            form.companyDetails?.legalName || form.company || ""
                          }
                          onChange={(e) => {
                            setCompanyDetail("legalName", e.target.value);
                            setValue("company", e.target.value);
                          }}
                          placeholder="Company / registered name"
                        />
                      </Field>
                      <Field label="Legal / registered company name">
                        <TextInput
                          value={form.companyDetails?.legalName || ""}
                          onChange={(e) =>
                            setCompanyDetail("legalName", e.target.value)
                          }
                          placeholder="Registered legal name"
                        />
                      </Field>
                      <Field label="GST number">
                        <TextInput
                          value={form.companyDetails?.gstNumber || ""}
                          onChange={(e) =>
                            setCompanyDetail(
                              "gstNumber",
                              e.target.value.toUpperCase(),
                            )
                          }
                          placeholder="15-character GSTIN"
                          maxLength={15}
                        />
                      </Field>
                      <Field label="PAN number">
                        <TextInput
                          value={form.companyDetails?.panNumber || ""}
                          onChange={(e) =>
                            setCompanyDetail(
                              "panNumber",
                              e.target.value.toUpperCase(),
                            )
                          }
                          placeholder="PAN number"
                          maxLength={10}
                        />
                      </Field>
                      <Field label="Company type">
                        <SelectInput
                          value={form.companyDetails?.companyType || ""}
                          onChange={(e) =>
                            setCompanyDetail("companyType", e.target.value)
                          }
                        >
                          <option value="">Select company type</option>
                          {[
                            "Proprietorship",
                            "Partnership",
                            "LLP",
                            "Private Limited",
                            "Public Limited",
                            "Trust / Society",
                            "Other",
                          ].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </SelectInput>
                      </Field>
                      <Field label="Company email">
                        <TextInput
                          type="email"
                          value={form.companyDetails?.companyEmail || ""}
                          onChange={(e) =>
                            setCompanyDetail("companyEmail", e.target.value)
                          }
                          placeholder="accounts@company.com"
                        />
                      </Field>
                      <Field label="Company phone">
                        <TextInput
                          value={form.companyDetails?.companyPhone || ""}
                          onChange={(e) =>
                            setCompanyDetail("companyPhone", e.target.value)
                          }
                          placeholder="Company contact number"
                        />
                      </Field>
                      <Field label="Website">
                        <TextInput
                          value={form.companyDetails?.website || ""}
                          onChange={(e) =>
                            setCompanyDetail("website", e.target.value)
                          }
                          placeholder="https://example.com"
                        />
                      </Field>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                      <div>
                        <span className="mb-1.5 block text-sm font-medium text-slate-600">
                          Profile photo
                        </span>
                        <div className="flex items-center gap-4">
                          {form.photo ? (
                            <img
                              src={form.photo}
                              alt="Contact profile"
                              className="h-16 w-16 rounded-full border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
                              ＋
                            </div>
                          )}
                          <div className="min-w-0">
                            <TextInput
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="text-xs"
                            />
                            <p className="mt-1 text-xs text-slate-400">
                              Image is stored in this browser with the contact.
                            </p>
                            {form.photo && (
                              <button
                                type="button"
                                onClick={() => setValue("photo", "")}
                                className="mt-1 text-xs font-medium text-red-600"
                              >
                                Remove photo
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section>
                    <SectionTitle>Notes</SectionTitle>
                    <Field label="Additional notes">
                      <textarea
                        rows={3}
                        value={form.notes}
                        onChange={(e) => setValue("notes", e.target.value)}
                        placeholder="Preferences, reminders or other useful details..."
                        className={inputClass}
                      />
                    </Field>
                  </section>
                </>
              )}
              {activeTab === "contact" && (
                <>
                  <section>
                    <SectionTitle hint="Add more than one number">
                      Phone numbers
                    </SectionTitle>
                    <div className="space-y-3">
                      {form.phones.map((phone, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-[140px_1fr_auto_auto] sm:items-end"
                        >
                          <Field label="Phone type">
                            <SelectInput
                              value={phone.type}
                              onChange={(e) =>
                                setArrayItem(
                                  "phones",
                                  i,
                                  "type",
                                  e.target.value,
                                )
                              }
                            >
                              {[
                                "Primary",
                                "Secondary",
                                "Work",
                                "Home",
                                "Other",
                              ].map((x) => (
                                <option key={x}>{x}</option>
                              ))}
                            </SelectInput>
                          </Field>
                          <Field label="Phone number">
                            <TextInput
                              value={phone.number}
                              onChange={(e) =>
                                setArrayItem(
                                  "phones",
                                  i,
                                  "number",
                                  e.target.value,
                                )
                              }
                              placeholder="+91 98765 43210"
                            />
                          </Field>
                          <label className="flex items-center gap-2 pb-2.5 text-sm text-slate-600">
                            <input
                              type="checkbox"
                              checked={!!phone.whatsapp}
                              onChange={(e) =>
                                setArrayItem(
                                  "phones",
                                  i,
                                  "whatsapp",
                                  e.target.checked,
                                )
                              }
                              className="rounded border-slate-300 text-green-600 focus:ring-green-500"
                            />{" "}
                            WhatsApp
                          </label>
                          <button
                            type="button"
                            disabled={form.phones.length === 1}
                            onClick={() => removeArrayItem("phones", i)}
                            className="pb-2.5 text-sm font-medium text-red-600 disabled:opacity-30"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("phones", {
                          type: "Secondary",
                          number: "",
                          whatsapp: false,
                        })
                      }
                      className="mt-3 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      ＋ Add phone number
                    </button>
                  </section>
                  <section>
                    <SectionTitle hint="Primary and secondary email">
                      Email addresses
                    </SectionTitle>
                    <div className="space-y-3">
                      {form.emails.map((email, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr_auto] sm:items-end"
                        >
                          <Field label="Email type">
                            <SelectInput
                              value={email.type}
                              onChange={(e) =>
                                setArrayItem(
                                  "emails",
                                  i,
                                  "type",
                                  e.target.value,
                                )
                              }
                            >
                              {["Primary", "Secondary", "Work", "Other"].map(
                                (x) => (
                                  <option key={x}>{x}</option>
                                ),
                              )}
                            </SelectInput>
                          </Field>
                          <Field label="Email address">
                            <TextInput
                              type="email"
                              value={email.email}
                              onChange={(e) =>
                                setArrayItem(
                                  "emails",
                                  i,
                                  "email",
                                  e.target.value,
                                )
                              }
                              placeholder="name@example.com"
                            />
                          </Field>
                          <button
                            type="button"
                            disabled={form.emails.length === 1}
                            onClick={() => removeArrayItem("emails", i)}
                            className="pb-2.5 text-sm font-medium text-red-600 disabled:opacity-30"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("emails", { type: "Secondary", email: "" })
                      }
                      className="mt-3 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      ＋ Add email address
                    </button>
                  </section>
                </>
              )}
              {activeTab === "family" && (
                <>
                  <section>
                    <SectionTitle>Family group</SectionTitle>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Family name / group">
                        <TextInput
                          value={form.familyName}
                          onChange={(e) =>
                            setValue("familyName", e.target.value)
                          }
                          placeholder="e.g. Sharma Family"
                        />
                      </Field>
                      <Field label="This contact's relation">
                        <SelectInput
                          value={form.relation}
                          onChange={(e) => setValue("relation", e.target.value)}
                        >
                          <option value="">Select relation</option>
                          {[
                            "Self",
                            "Spouse",
                            "Father",
                            "Mother",
                            "Son",
                            "Daughter",
                            "Brother",
                            "Sister",
                            "Grandfather",
                            "Grandmother",
                            "Relative",
                            "Other",
                          ].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </SelectInput>
                      </Field>
                    </div>
                  </section>

                  <section>
                    <SectionTitle hint="Add family members and their relationship to this contact">
                      Family members & relationships
                    </SectionTitle>

                    <div className="space-y-3">
                      {(form.familyMembers || []).map((member, i) => (
                        <div
                          key={member.id || i}
                          className="grid grid-cols-1 items-end gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-2 lg:grid-cols-[minmax(200px,1.5fr)_minmax(150px,1fr)_minmax(160px,1fr)_auto_auto]"
                        >
                          {/* Member name */}
                          <Field label="Member name">
                            <TextInput
                              value={member.name || ""}
                              onChange={(e) =>
                                setArrayItem(
                                  "familyMembers",
                                  i,
                                  "name",
                                  e.target.value,
                                )
                              }
                              placeholder="Full name"
                            />
                          </Field>

                          {/* Relationship */}
                          <Field label="Relationship">
                            <SelectInput
                              value={member.relation || ""}
                              onChange={(e) =>
                                setArrayItem(
                                  "familyMembers",
                                  i,
                                  "relation",
                                  e.target.value,
                                )
                              }
                            >
                              <option value="">Select relation</option>
                              {[
                                "Spouse",
                                "Father",
                                "Mother",
                                "Son",
                                "Daughter",
                                "Brother",
                                "Sister",
                                "Grandfather",
                                "Grandmother",
                                "Relative",
                                "Other",
                              ].map((x) => (
                                <option key={x}>{x}</option>
                              ))}
                            </SelectInput>
                          </Field>

                          {/* Phone number */}
                          <Field label="Phone number">
                            <TextInput
                              value={member.phone || ""}
                              onChange={(e) =>
                                setArrayItem(
                                  "familyMembers",
                                  i,
                                  "phone",
                                  e.target.value,
                                )
                              }
                              placeholder="Phone number"
                            />
                          </Field>

                          {/* Emergency */}
                          <div className="flex items-center pb-2">
                            <label className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-slate-600">
                              <input
                                type="radio"
                                name="emergencyFamilyMember"
                                checked={!!member.emergency}
                                onChange={() =>
                                  setForm((current) => ({
                                    ...current,
                                    familyMembers: current.familyMembers.map(
                                      (item, index) => ({
                                        ...item,
                                        emergency: index === i,
                                      }),
                                    ),
                                  }))
                                }
                                className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                              Emergency
                            </label>
                          </div>

                          {/* Remove */}
                          <div className="flex items-center pb-1">
                            <button
                              type="button"
                              onClick={() => removeArrayItem("familyMembers", i)}
                              className="shrink-0 rounded-md px-1.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("familyMembers", {
                          id: `family_${Date.now()}`,
                          name: "",
                          relation: "",
                          phone: "",
                          emergency: false,
                        })
                      }
                      className="mt-3 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      ＋ Add family member
                    </button>
                  </section>

                  <section>
                    <SectionTitle>Family tags</SectionTitle>
                    <div className="flex flex-wrap gap-2">
                      {(form.familyTags || []).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-medium text-violet-700"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() =>
                              setValue(
                                "familyTags",
                                form.familyTags.filter((x) => x !== tag),
                              )
                            }
                            aria-label={`Remove ${tag}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <TextInput
                        value={familyTagInput}
                        onChange={(e) => setFamilyTagInput(e.target.value)}
                        placeholder="e.g. Sharma Family, Frequent Traveller"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTagValue(
                              "familyTags",
                              familyTagInput,
                              setFamilyTagInput,
                            );
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          addTagValue(
                            "familyTags",
                            familyTagInput,
                            setFamilyTagInput,
                          )
                        }
                        className="shrink-0 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700"
                      >
                        ＋ Add tag
                      </button>
                    </div>
                  </section>
                  <section>
                    <SectionTitle>Interests</SectionTitle>
                    <div className="flex flex-wrap gap-2">
                      {(form.interests || []).map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800"
                        >
                          {interest}
                          <button
                            type="button"
                            onClick={() =>
                              setValue(
                                "interests",
                                form.interests.filter((x) => x !== interest),
                              )
                            }
                            aria-label={`Remove ${interest}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <SelectInput
                        value={interestInput}
                        onChange={(e) => setInterestInput(e.target.value)}
                      >
                        <option value="">Select an interest</option>
                        {["Young Adults", "Adventure", "Corporate"].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </SelectInput>
                      <button
                        type="button"
                        onClick={() =>
                          addTagValue(
                            "interests",
                            interestInput,
                            setInterestInput,
                          )
                        }
                        className="shrink-0 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700"
                      >
                        ＋ Add interest
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      You can select more than one interest.
                    </p>
                  </section>
                  <section>
                    <SectionTitle>Relationship notes</SectionTitle>
                    <Field label="Additional family / relationship details">
                      <textarea
                        rows={3}
                        value={form.familyDetails}
                        onChange={(e) =>
                          setValue("familyDetails", e.target.value)
                        }
                        placeholder="Family head or other relationship notes..."
                        className={inputClass}
                      />
                    </Field>
                  </section>
                </>
              )}
              {activeTab === "travel" && (
                <>
                  <section>
                    <SectionTitle>Passport details</SectionTitle>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <Field label="Passport number">
                        <TextInput
                          value={form.passport?.passportNumber || ""}
                          onChange={(e) =>
                            setPassportDetail(
                              "passportNumber",
                              e.target.value.toUpperCase(),
                            )
                          }
                          placeholder="Passport number"
                        />
                      </Field>
                      <Field label="Nationality">
                        <TextInput
                          value={form.passport?.nationality || ""}
                          onChange={(e) =>
                            setPassportDetail("nationality", e.target.value)
                          }
                          placeholder="Nationality"
                        />
                      </Field>
                      <Field label="Place of issue">
                        <TextInput
                          value={form.passport?.placeOfIssue || ""}
                          onChange={(e) =>
                            setPassportDetail("placeOfIssue", e.target.value)
                          }
                          placeholder="Place of issue"
                        />
                      </Field>
                      <Field label="Issue date">
                        <TextInput
                          type="date"
                          value={form.passport?.issueDate || ""}
                          onChange={(e) =>
                            setPassportDetail("issueDate", e.target.value)
                          }
                        />
                      </Field>
                      <Field label="Expiry date">
                        <TextInput
                          type="date"
                          value={form.passport?.expiryDate || ""}
                          onChange={(e) =>
                            setPassportDetail("expiryDate", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                  </section>
                  <section>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <SectionTitle>Visa validity details</SectionTitle>
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("visas", {
                            id: `visa_${Date.now()}`,
                            country: "",
                            visaType: "",
                            visaNumber: "",
                            issueDate: "",
                            expiryDate: "",
                            notes: "",
                          })
                        }
                        className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                      >
                        ＋ Add visa
                      </button>
                    </div>
                    {(form.visas || []).length === 0 && (
                      <p className="mb-3 text-sm text-slate-400">
                        No visa details added yet.
                      </p>
                    )}
                    <div className="space-y-4">
                      {(form.visas || []).map((visa, i) => (
                        <div
                          key={visa.id || i}
                          className="rounded-xl border border-slate-200 p-4"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <h4 className="font-semibold text-slate-800">
                              Visa {i + 1}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeArrayItem("visas", i)}
                              className="text-sm font-medium text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <Field label="Country">
                              <TextInput
                                value={visa.country || ""}
                                onChange={(e) =>
                                  setArrayItem(
                                    "visas",
                                    i,
                                    "country",
                                    e.target.value,
                                  )
                                }
                                placeholder="Country"
                              />
                            </Field>
                            <Field label="Visa type">
                              <TextInput
                                value={visa.visaType || ""}
                                onChange={(e) =>
                                  setArrayItem(
                                    "visas",
                                    i,
                                    "visaType",
                                    e.target.value,
                                  )
                                }
                                placeholder="Tourist / Business / Work"
                              />
                            </Field>
                            <Field label="Visa number">
                              <TextInput
                                value={visa.visaNumber || ""}
                                onChange={(e) =>
                                  setArrayItem(
                                    "visas",
                                    i,
                                    "visaNumber",
                                    e.target.value,
                                  )
                                }
                                placeholder="Visa number"
                              />
                            </Field>
                            <Field label="Issue date">
                              <TextInput
                                type="date"
                                value={visa.issueDate || ""}
                                onChange={(e) =>
                                  setArrayItem(
                                    "visas",
                                    i,
                                    "issueDate",
                                    e.target.value,
                                  )
                                }
                              />
                            </Field>
                            <Field label="Expiry / validity date">
                              <TextInput
                                type="date"
                                value={visa.expiryDate || ""}
                                onChange={(e) =>
                                  setArrayItem(
                                    "visas",
                                    i,
                                    "expiryDate",
                                    e.target.value,
                                  )
                                }
                              />
                            </Field>
                            <Field label="Notes">
                              <TextInput
                                value={visa.notes || ""}
                                onChange={(e) =>
                                  setArrayItem(
                                    "visas",
                                    i,
                                    "notes",
                                    e.target.value,
                                  )
                                }
                                placeholder="Entry type or remarks"
                              />
                            </Field>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <SectionTitle>Travel history</SectionTitle>
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("travelHistory", {
                            id: `trip_${Date.now()}`,
                            destination: "",
                            purpose: "",
                            departureDate: "",
                            returnDate: "",
                            notes: "",
                          })
                        }
                        className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                      >
                        ＋ Add trip
                      </button>
                    </div>
                    {(form.travelHistory || []).length === 0 && (
                      <p className="mb-3 text-sm text-slate-400">
                        No travel history added yet.
                      </p>
                    )}
                    <div className="space-y-4">
                      {(form.travelHistory || []).map((trip, i) => (
                        <div
                          key={trip.id || i}
                          className="rounded-xl border border-slate-200 p-4"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <h4 className="font-semibold text-slate-800">
                              Trip {i + 1}
                            </h4>
                            <button
                              type="button"
                              onClick={() =>
                                removeArrayItem("travelHistory", i)
                              }
                              className="text-sm font-medium text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <Field label="Destination / country">
                              <TextInput
                                value={trip.destination || ""}
                                onChange={(e) =>
                                  setArrayItem(
                                    "travelHistory",
                                    i,
                                    "destination",
                                    e.target.value,
                                  )
                                }
                                placeholder="e.g. Singapore"
                              />
                            </Field>
                            <Field label="Purpose">
                              <SelectInput
                                value={trip.purpose || ""}
                                onChange={(e) =>
                                  setArrayItem(
                                    "travelHistory",
                                    i,
                                    "purpose",
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="">Select purpose</option>
                                {[
                                  "Holiday",
                                  "Business",
                                  "Family visit",
                                  "Study",
                                  "Other",
                                ].map((x) => (
                                  <option key={x}>{x}</option>
                                ))}
                              </SelectInput>
                            </Field>
                            <Field label="Departure date">
                              <TextInput
                                type="date"
                                value={trip.departureDate || ""}
                                onChange={(e) =>
                                  setArrayItem(
                                    "travelHistory",
                                    i,
                                    "departureDate",
                                    e.target.value,
                                  )
                                }
                              />
                            </Field>
                            <Field label="Return date">
                              <TextInput
                                type="date"
                                value={trip.returnDate || ""}
                                onChange={(e) =>
                                  setArrayItem(
                                    "travelHistory",
                                    i,
                                    "returnDate",
                                    e.target.value,
                                  )
                                }
                              />
                            </Field>
                            <Field label="Notes">
                              <TextInput
                                value={trip.notes || ""}
                                onChange={(e) =>
                                  setArrayItem(
                                    "travelHistory",
                                    i,
                                    "notes",
                                    e.target.value,
                                  )
                                }
                                placeholder="Airline, hotel or other details"
                              />
                            </Field>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
              {activeTab === "address" && (
                <section>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <SectionTitle>Contact addresses</SectionTitle>
                      <p className="text-sm text-slate-500">
                        Add as many home, office, billing or other addresses as
                        needed. Choose one primary address.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addAddress}
                      className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      ＋ Add address
                    </button>
                  </div>
                  <div className="space-y-5">
                    {(form.addresses || []).map((address, i) => (
                      <section
                        key={address.id || i}
                        className={`rounded-2xl border p-4 ${address.isPrimary ? "border-blue-300 bg-blue-50/40" : "border-slate-200"}`}
                      >
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-semibold text-slate-600 shadow-sm">
                              {i + 1}
                            </span>
                            <div>
                              <h4 className="font-semibold text-slate-900">
                                Address {i + 1}
                              </h4>
                              {address.isPrimary && (
                                <span className="text-xs font-semibold text-blue-700">
                                  Primary address
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                              <input
                                type="radio"
                                name="primaryAddress"
                                checked={!!address.isPrimary}
                                onChange={() =>
                                  setAddressItem(i, "isPrimary", true)
                                }
                                className="text-blue-600 focus:ring-blue-500"
                              />{" "}
                              Set as primary
                            </label>
                            <button
                              type="button"
                              disabled={form.addresses.length === 1}
                              onClick={() => removeAddress(i)}
                              className="text-sm font-medium text-red-600 disabled:opacity-30"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <Field label="Address type">
                            <SelectInput
                              value={address.addressType || "Other"}
                              onChange={(e) =>
                                setAddressItem(i, "addressType", e.target.value)
                              }
                            >
                              {[
                                "Home",
                                "Office",
                                "Billing",
                                "Shipping",
                                "Holiday home",
                                "Other",
                              ].map((x) => (
                                <option key={x}>{x}</option>
                              ))}
                            </SelectInput>
                          </Field>
                          <Field label="Lane / Street no.">
                            <TextInput
                              value={address.lane || ""}
                              onChange={(e) =>
                                setAddressItem(i, "lane", e.target.value)
                              }
                              placeholder="Lane / street"
                            />
                          </Field>
                          <Field label="Plot / Flat no.">
                            <TextInput
                              value={address.plotNo || ""}
                              onChange={(e) =>
                                setAddressItem(i, "plotNo", e.target.value)
                              }
                              placeholder="Plot / flat number"
                            />
                          </Field>
                          <Field label="Area / Locality">
                            <TextInput
                              value={address.area || ""}
                              onChange={(e) =>
                                setAddressItem(i, "area", e.target.value)
                              }
                              placeholder="Area / locality"
                            />
                          </Field>
                          <Field label="City">
                            <TextInput
                              value={address.city || ""}
                              onChange={(e) =>
                                setAddressItem(i, "city", e.target.value)
                              }
                              placeholder="City"
                            />
                          </Field>
                          <Field label="State">
                            <TextInput
                              value={address.state || ""}
                              onChange={(e) =>
                                setAddressItem(i, "state", e.target.value)
                              }
                              placeholder="State"
                            />
                          </Field>
                          <Field label="PIN code">
                            <TextInput
                              inputMode="numeric"
                              value={address.pinCode || ""}
                              onChange={(e) =>
                                setAddressItem(i, "pinCode", e.target.value)
                              }
                              placeholder="PIN code"
                            />
                          </Field>
                          <Field label="Country">
                            <TextInput
                              value={address.country || ""}
                              onChange={(e) =>
                                setAddressItem(i, "country", e.target.value)
                              }
                              placeholder="Country"
                            />
                          </Field>
                        </div>
                      </section>
                    ))}
                  </div>
                </section>
              )}
            </div>
            <div className="sticky bottom-0 z-10 flex shrink-0 flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <p className="text-xs text-slate-400">
                Saved in this browser using localStorage.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  {editingId ? "Save changes" : "Save contact"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {viewContact && (
        <div
          className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-3 sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setViewContact(null);
          }}
        >
          <div className="my-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start gap-4 border-b border-slate-200 p-6">
              {viewContact.photo ? (
                <img
                  src={viewContact.photo}
                  alt={getFullName(viewContact)}
                  className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-blue-700">
                  {getInitials(viewContact)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-slate-900">
                  {getFullName(viewContact)}
                </h2>
                <p className="text-sm text-slate-500">
                  {[viewContact.designation, viewContact.company]
                    .filter(Boolean)
                    .join(" · ") || "Contact details"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${categoryColors[viewContact.category] || categoryColors.Other}`}
                  >
                    {viewContact.category}
                  </span>
                  {viewContact.priority && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                      {viewContact.priority} priority
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
                  {viewContact.gender && (
                    <span>Gender: {viewContact.gender}</span>
                  )}
                  {viewContact.dateOfBirth && (
                    <span>DOB: {viewContact.dateOfBirth}</span>
                  )}
                  {viewContact.maritalStatus && (
                    <span>Marital status: {viewContact.maritalStatus}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setViewContact(null)}
                className="rounded-lg p-2 text-xl text-slate-400 hover:bg-slate-100"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
              <section>
                <SectionTitle>Phone numbers</SectionTitle>
                {(viewContact.phones || [])
                  .filter((p) => p.number)
                  .map((p, i) => (
                    <div key={i} className="mb-3">
                      <p className="text-xs text-slate-400">
                        {p.type}
                        {p.whatsapp ? " · WhatsApp" : ""}
                      </p>
                      <p className="text-sm font-medium">{p.number}</p>
                    </div>
                  ))}
                <div className="mt-5">
                  <SectionTitle>Email addresses</SectionTitle>
                  {(viewContact.emails || [])
                    .filter((e) => e.email)
                    .map((e, i) => (
                      <div key={i} className="mb-3">
                        <p className="text-xs text-slate-400">{e.type}</p>
                        <p className="break-all text-sm font-medium">
                          {e.email}
                        </p>
                      </div>
                    ))}
                </div>
              </section>
              <section>
                <SectionTitle>Family details</SectionTitle>
                <p className="text-sm">
                  <span className="text-slate-400">Family:</span>{" "}
                  {viewContact.familyName || "—"}
                </p>
                <p className="mt-2 text-sm">
                  <span className="text-slate-400">Relation:</span>{" "}
                  {viewContact.relation || "—"}
                </p>
                {(viewContact.familyMembers || []).map((m, i) => (
                  <p key={m.id || i} className="mt-2 text-sm text-slate-600">
                    {m.name} · {m.relation}
                    {m.phone ? ` · ${m.phone}` : ""}
                  </p>
                ))}
                {viewContact.familyDetails && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                    {viewContact.familyDetails}
                  </p>
                )}
                <div className="mt-5">
                  <SectionTitle>Primary address</SectionTitle>
                  <p className="text-sm leading-6 text-slate-600">
                    {[
                      viewContact.primaryAddress?.plotNo &&
                      `Plot/Flat ${viewContact.primaryAddress.plotNo}`,
                      viewContact.primaryAddress?.lane,
                      viewContact.primaryAddress?.area,
                      viewContact.primaryAddress?.city,
                      viewContact.primaryAddress?.state,
                      viewContact.primaryAddress?.pinCode,
                      viewContact.primaryAddress?.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "No address added"}
                  </p>
                </div>
                {viewContact.officeAddress &&
                  Object.values(viewContact.officeAddress).some(
                    (v) => v && !["Office", "India"].includes(v),
                  ) && (
                    <div className="mt-5">
                      <SectionTitle>Office address</SectionTitle>
                      <p className="text-sm leading-6 text-slate-600">
                        {[
                          viewContact.officeAddress.plotNo &&
                          `Plot/Office ${viewContact.officeAddress.plotNo}`,
                          viewContact.officeAddress.lane,
                          viewContact.officeAddress.area,
                          viewContact.officeAddress.city,
                          viewContact.officeAddress.state,
                          viewContact.officeAddress.pinCode,
                          viewContact.officeAddress.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}
              </section>
              {viewContact.companyDetails?.gstNumber && (
                <section className="sm:col-span-2">
                  <SectionTitle>Company & tax details</SectionTitle>
                  <p className="text-sm text-slate-600">
                    GSTIN:{" "}
                    <strong>{viewContact.companyDetails.gstNumber}</strong>
                    {viewContact.companyDetails.panNumber
                      ? ` · PAN: ${viewContact.companyDetails.panNumber}`
                      : ""}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {viewContact.companyDetails.legalName ||
                      viewContact.company}
                  </p>
                </section>
              )}
              {(viewContact.familyTags || []).length > 0 && (
                <section>
                  <SectionTitle>Family tags</SectionTitle>
                  <div className="flex flex-wrap gap-2">
                    {viewContact.familyTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-violet-100 px-2.5 py-1 text-xs text-violet-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}
              {(viewContact.interests || []).length > 0 && (
                <section>
                  <SectionTitle>Interests</SectionTitle>
                  <div className="flex flex-wrap gap-2">
                    {viewContact.interests.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-green-100 px-2.5 py-1 text-xs text-green-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}
              {(viewContact.passport?.passportNumber ||
                (viewContact.visas || []).length > 0) && (
                  <section className="sm:col-span-2">
                    <SectionTitle>Passport & visa</SectionTitle>
                    {viewContact.passport?.passportNumber && (
                      <p className="text-sm text-slate-600">
                        Passport:{" "}
                        <strong>{viewContact.passport.passportNumber}</strong> ·
                        Expires: {viewContact.passport.expiryDate || "—"}
                      </p>
                    )}
                    {(viewContact.visas || []).map((visa, i) => (
                      <p
                        key={visa.id || i}
                        className="mt-1 text-sm text-slate-600"
                      >
                        {visa.country || "Country not set"} ·{" "}
                        {visa.visaType || "Visa"} · Valid until{" "}
                        {visa.expiryDate || "—"}
                      </p>
                    ))}
                  </section>
                )}
              {(viewContact.travelHistory || []).length > 0 && (
                <section className="sm:col-span-2">
                  <SectionTitle>Travel history</SectionTitle>
                  {viewContact.travelHistory.map((trip, i) => (
                    <p
                      key={trip.id || i}
                      className="mt-1 text-sm text-slate-600"
                    >
                      {trip.destination || "Destination not set"} ·{" "}
                      {trip.purpose || "Purpose not set"} ·{" "}
                      {trip.departureDate || "—"} to {trip.returnDate || "—"}
                    </p>
                  ))}
                </section>
              )}
              {viewContact.notes && (
                <section className="sm:col-span-2">
                  <SectionTitle>Notes</SectionTitle>
                  <p className="whitespace-pre-wrap text-sm text-slate-600">
                    {viewContact.notes}
                  </p>
                </section>
              )}
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 p-4">
              <button
                onClick={() => setConfirmDelete(viewContact)}
                className="mr-auto rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
              <button
                onClick={() => openEdit(viewContact)}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Edit contact
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">
              !
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Delete contact?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <strong className="text-slate-700">
                {getFullName(confirmDelete)}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteContact(confirmDelete.id)}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
