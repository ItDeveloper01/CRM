export const MAX_EMERGENCY_CONTACTS = 3;

export const normalizePhoneDigits = (value) => {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits || null;
};

export function validatePhonePair(
  countryCode,
  phone,
  { countryCodeField = "countryCode", phoneField = "phone", allowUnchangedLegacyPhoneWithoutCode = false } = {},
) {
  const rawCountryCode = String(countryCode ?? "").trim();
  const countryDigits = normalizePhoneDigits(rawCountryCode);
  const normalizedPhone = normalizePhoneDigits(phone);
  const normalizedCountryCode = countryDigits ? `+${countryDigits}` : null;

  if (
    rawCountryCode &&
    (!countryDigits ||
      countryDigits.length > 3 ||
      !/^\+?[\d\s()-]+$/.test(rawCountryCode))
  ) {
    return {
      valid: false,
      countryCode: normalizedCountryCode,
      phone: normalizedPhone,
      field: countryCodeField,
      message: "Select a valid country code.",
    };
  }

  if (!normalizedCountryCode && !normalizedPhone) {
    return { valid: true, countryCode: null, phone: null };
  }

  if (!normalizedCountryCode) {
    if (allowUnchangedLegacyPhoneWithoutCode && normalizedPhone) {
      return { valid: true, countryCode: null, phone: normalizedPhone };
    }
    return {
      valid: false,
      countryCode: null,
      phone: normalizedPhone,
      field: countryCodeField,
      message: "Select a country code for this number.",
    };
  }

  if (!normalizedPhone) {
    return {
      valid: false,
      countryCode: normalizedCountryCode,
      phone: null,
      field: phoneField,
      message: "Enter the phone number for the selected country code.",
    };
  }

  const validLength = normalizedCountryCode === "+91"
    ? normalizedPhone.length === 10 && /^[6-9]/.test(normalizedPhone)
    : normalizedPhone.length >= 4 && normalizedPhone.length <= 14;
  if (!validLength || countryDigits.length + normalizedPhone.length > 15) {
    return {
      valid: false,
      countryCode: normalizedCountryCode,
      phone: normalizedPhone,
      field: phoneField,
      message: normalizedCountryCode === "+91"
        ? "Enter a valid Indian phone number (10 digits starting with 6-9)."
        : "Enter a valid phone number (4 to 14 digits).",
    };
  }

  return {
    valid: true,
    countryCode: normalizedCountryCode,
    phone: normalizedPhone,
  };
}

export function validateEmergencyContactRows(rows) {
  const errors = [];
  (rows || []).forEach((row, index) => {
    const countryCode = String(row.countryCode ?? "").trim();
    const phone = String(row.phone ?? "").trim();
    const relativeName = String(row.relativeName ?? "").trim();
    const relationCode = String(row.relationCode ?? "").trim();
    const profession = String(row.profession ?? "").trim();
    if (!countryCode && !phone && !relativeName && !relationCode && !profession) return;

    const codeField = `emergencyContacts[${index}].countryCode`;
    const phoneField = `emergencyContacts[${index}].phone`;
    const pair = validatePhonePair(countryCode, phone, {
      countryCodeField: codeField,
      phoneField,
    });
    if (!pair.valid) {
      errors.push({ field: pair.field, message: pair.message });
    } else if (!pair.countryCode && !pair.phone) {
      errors.push({
        field: codeField,
        message: "Select a country code for this number.",
      });
      errors.push({
        field: phoneField,
        message: "Enter the phone number for the selected country code.",
      });
    }

    if (!relativeName) {
      errors.push({
        field: `emergencyContacts[${index}].relativeName`,
        message: "Enter the relative's name.",
      });
    } else if (relativeName.length > 150) {
      errors.push({
        field: `emergencyContacts[${index}].relativeName`,
        message: "Name must be 150 characters or fewer.",
      });
    }

    if (!relationCode) {
      errors.push({
        field: `emergencyContacts[${index}].relationCode`,
        message: "Select a relationship.",
      });
    }

    if (profession.length > 100) {
      errors.push({
        field: `emergencyContacts[${index}].profession`,
        message: "Profession must be 100 characters or fewer.",
      });
    }
  });
  return errors;
}
