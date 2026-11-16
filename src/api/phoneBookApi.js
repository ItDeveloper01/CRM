import config from "../config";

const PHONEBOOK_URL = `${config.apiUrl}/PhoneBook`;

async function request(path, options = {}, baseUrl = PHONEBOOK_URL) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const responseText = await response.text();
    let responseBody;
    try {
      responseBody = responseText ? JSON.parse(responseText) : null;
    } catch {
      responseBody = null;
    }
    const errors = responseBody?.errors;
    const fieldMessages = errors
      ? Object.values(errors).flat().filter(Boolean)
      : [];
    const message = fieldMessages.join("\n") ||
      responseBody?.detail ||
      responseBody?.message ||
      responseText ||
      `Phonebook request failed (${response.status}).`;
    const error = new Error(message);
    error.errors = errors || null;
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
}

const authenticatedHeaders = (token) => {
  if (!token) throw new Error("User authentication is required.");
  return { Authorization: `Bearer ${token}` };
};

export function getPhoneBookContacts({ search, letter, page = 1, pageSize = 100 }, signal) {
  const query = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (search?.trim()) query.set("search", search.trim());
  if (letter) query.set("letter", letter);
  return request(`?${query}`, { signal });
}

export function getPhoneBookContactGrid(leadId, signal) {
  return request(`/${encodeURIComponent(leadId)}/contacts`, { signal });
}

export function createPhoneBookContact(contact) {
  return request("", {
    method: "POST",
    body: JSON.stringify(contact),
  });
}

export function savePhoneBookContactGrid(leadId, contact) {
  return request(`/${encodeURIComponent(leadId)}/contacts`, {
    method: "PUT",
    body: JSON.stringify(contact),
  });
}

export function getPhoneBookEmergencyContacts(leadId, token, signal) {
  return request(
    `/${encodeURIComponent(leadId)}/emergency-contacts`,
    { signal, headers: authenticatedHeaders(token) },
    `${config.apiUrl}/leads`,
  );
}

export function savePhoneBookEmergencyContacts(leadId, contacts, token) {
  return request(
    `/${encodeURIComponent(leadId)}/emergency-contacts`,
    {
      method: "PUT",
      body: JSON.stringify(contacts),
      headers: authenticatedHeaders(token),
    },
    `${config.apiUrl}/leads`,
  );
}

export function getPhoneBookEmergencyContactRelations(token, signal) {
  return request(
    "/emergency-contact-relationships",
    { signal, headers: authenticatedHeaders(token) },
    `${config.apiUrl}/leads`,
  );
}

export async function getPhoneBookBranches(token, signal) {
  if (!token) throw new Error("User authentication is required to load branches.");

  const response = await fetch(`${config.apiUrl}/Users/GetBranchList`, {
    signal,
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Unable to load branches (${response.status}).`);
  }

  return response.json();
}

export async function getPhoneBookCountries(signal) {
  const query = new URLSearchParams({
    fields: "id,countryName,countryCode,mobileCode",
  });
  const response = await fetch(
    `${config.apiUrl}/MasterData/GetCountryList?${query}`,
    { signal },
  );
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Unable to load countries (${response.status}).`);
  }

  return response.json();
}

export async function getPhoneBookCustomerTypes(token, signal) {
  if (!token) throw new Error("User authentication is required to load customer types.");

  const response = await fetch(
    `${config.apiUrl}/MasterData/GetCustomerTypeList`,
    {
      signal,
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Unable to load customer types (${response.status}).`);
  }

  return response.json();
}

export function findPhoneBookMatches(phone, countryCode, excludeLeadId) {
  const query = new URLSearchParams({ phone, countryCode });
  if (excludeLeadId) query.set("excludeLeadId", String(excludeLeadId));
  return request(`/phone-matches?${query}`);
}
