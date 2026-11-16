import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SectionTitle, TextInput } from "./PhoneBookFields";
import EmergencyContactsGrid from "./EmergencyContactsGrid";
import { validatePhonePair } from "../phoneValidation";

export default function ContactMethodsTab(props) {
  const {
    form, setValue, countries = [], countryLoadError, phoneMatches,
    updatePhoneValue, checkPhoneMatches,
    getFieldError = () => "", emergencyRelations = [], emergencyRelationsError = "",
    updateEmergencyContactValue = () => {}, addEmergencyContact = () => {},
    removeEmergencyContact = () => {}, allowUnchangedLegacyPrimaryPhone = false,
  } = props;
  const [countryQueries, setCountryQueries] = useState({});
  const [countryOpen, setCountryOpen] = useState({});
  const [countryPositions, setCountryPositions] = useState({});
  const [phoneBlurErrors, setPhoneBlurErrors] = useState({});
  useEffect(() => {
    setCountryQueries({});
    setCountryOpen({});
    setCountryPositions({});
    setPhoneBlurErrors({});
  }, [form.id]);
  useEffect(() => {
    const closeCountryOptions = () => setCountryOpen({});
    window.addEventListener("scroll", closeCountryOptions, true);
    window.addEventListener("resize", closeCountryOptions);
    return () => {
      window.removeEventListener("scroll", closeCountryOptions, true);
      window.removeEventListener("resize", closeCountryOptions);
    };
  }, []);

  const openCountryOptions = (type, input) => {
    const bounds = input.getBoundingClientRect();
    const width = Math.min(280, window.innerWidth - 16);
    const left = Math.max(8, Math.min(bounds.left, window.innerWidth - width - 8));
    const menuHeight = Math.min(240, window.innerHeight - 16);
    const top = bounds.bottom + menuHeight > window.innerHeight - 8
      ? Math.max(8, bounds.top - menuHeight - 4)
      : bounds.bottom + 4;
    setCountryPositions((current) => ({
      ...current,
      [type]: { top, left, width },
    }));
    setCountryOpen((current) => ({ ...current, [type]: true }));
  };

  const filterCountries = (query) => {
    const availableCountries = countries || [];
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return availableCountries.slice(0, 20);

    if (/^[+\d\s()-]+$/.test(trimmedQuery)) {
      const digits = trimmedQuery.replace(/\D/g, "");
      const exactMatches = availableCountries.filter(
        (country) => (country.mobileCode || "").replace(/\D/g, "") === digits,
      );
      const matches = exactMatches.length
        ? exactMatches
        : availableCountries.filter((country) =>
          (country.mobileCode || "").replace(/\D/g, "").startsWith(digits),
        );
      return matches
        .sort((a, b) => {
          const aIsUS = /united states|usa/i.test(a.countryName || "");
          const bIsUS = /united states|usa/i.test(b.countryName || "");
          return Number(bIsUS) - Number(aIsUS) ||
            (a.countryName || "").localeCompare(b.countryName || "");
        })
        .slice(0, 20);
    }

    const normalizedQuery = trimmedQuery.toLowerCase();
    return availableCountries
      .filter((country) =>
        country.countryName?.toLowerCase().includes(normalizedQuery) ||
        country.countryCode?.toLowerCase().includes(normalizedQuery) ||
        country.mobileCode?.toLowerCase().includes(normalizedQuery),
      )
      .slice(0, 20);
  };

  const rows = [
    { type: "Primary", code: "PRIMARY" },
    { type: "Secondary", code: "SECONDARY" },
    { type: "Work", code: "WORK" },
    { type: "Office", code: "OFFICE" },
    { type: "Other", code: "OTHER" },
  ];

  const updateValue = (collection, type, field, value) => {
    const items = form[collection] || [];
    const current = items.find((item) => item.type === type) || { type };
    setValue(collection, [
      ...items.filter((item) => item.type !== type),
      { ...current, [field]: value },
    ]);
  };

  const validatePhone = (type) => {
    const phone = form.phones?.find((item) => item.type === type) || {};
    const countryCodeField = type === "Primary"
      ? "primaryCountryCode"
      : `phoneCountryCode-${type}`;
    const phoneField = type === "Primary"
      ? "primaryPhone"
      : `phoneNumber-${type}`;
    const result = validatePhonePair(phone.countryCode, phone.number, {
      countryCodeField,
      phoneField,
      allowUnchangedLegacyPhoneWithoutCode:
        type === "Primary" && allowUnchangedLegacyPrimaryPhone,
    });
    setPhoneBlurErrors((current) => ({
      ...current,
      [type]: result.valid ? {} : { [result.field]: result.message },
    }));
  };

  return (
    <section>
      <SectionTitle hint="Enter both a country code and phone number, or leave both empty.">
        Phone numbers and email addresses
      </SectionTitle>
      <div className="phonebook-contact-grid-wrap">
        <table className="phonebook-contact-grid">
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Dialing code</th>
              <th scope="col">Phone</th>
              <th scope="col">WhatsApp</th>
              <th scope="col">Email</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ type, code }) => {
              const phone = form.phones?.find((item) => item.type === type) || {};
              const email = form.emails?.find((item) => item.type === type) || {};
              const selectedCountry = countries.find(
                (country) => country.mobileCode === phone.countryCode,
              );
              const matches = phoneMatches?.[type] || [];
              const filteredCountries = filterCountries(countryQueries[type] || "");
              const countryOptionsId = `phonebook-country-options-${code.toLowerCase()}`;
              const countryCodeField = type === "Primary"
                ? "primaryCountryCode"
                : `phoneCountryCode-${type}`;
              const phoneField = type === "Primary"
                ? "primaryPhone"
                : `phoneNumber-${type}`;
              const countryCodeError = getFieldError(countryCodeField) ||
                phoneBlurErrors[type]?.[countryCodeField];
              const phoneError = getFieldError(phoneField) ||
                phoneBlurErrors[type]?.[phoneField];

              return (
                <tr key={code}>
                  <th scope="row">{type}</th>
                  <td>
                    <div className="phonebook-country-cell">
                      <div className="phonebook-country-picker">
                        <input
                          type="text"
                          role="combobox"
                          aria-autocomplete="list"
                          aria-controls={countryOptionsId}
                          aria-expanded={!!countryOpen[type]}
                          aria-label={`${type} dialing code (search by country or code)`}
                          aria-invalid={Boolean(countryCodeError)}
                          className={`phonebook-contact-country-select ${
                            countryCodeError ? "phonebook-input-invalid" : ""
                          }`}
                          placeholder="Code"
                          value={countryQueries[type] ?? phone.countryCode ?? ""}
                          onFocus={(event) => {
                            setCountryQueries((current) => ({
                              ...current,
                              [type]: current[type] ?? phone.countryCode ?? "",
                            }));
                            openCountryOptions(type, event.currentTarget);
                          }}
                          onChange={(event) => {
                            setCountryQueries((current) => ({
                              ...current,
                              [type]: event.target.value,
                            }));
                            setCountryOpen((current) => ({ ...current, [type]: true }));
                          }}
                          onBlur={() => {
                            setCountryOpen((current) => ({ ...current, [type]: false }));
                            setCountryQueries((current) => ({
                              ...current,
                              [type]: phone.countryCode || "",
                            }));
                            validatePhone(type);
                          }}
                        />
                        {phone.countryCode && (
                          <button
                            type="button"
                            className="phonebook-country-clear"
                            aria-label={`Clear ${type} dialing code`}
                            title="Clear country code"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => {
                              updatePhoneValue(type, "countryCode", null);
                              setCountryQueries((current) => ({ ...current, [type]: "" }));
                              setCountryOpen((current) => ({ ...current, [type]: false }));
                              setPhoneBlurErrors((current) => ({
                                ...current,
                                [type]: {},
                              }));
                            }}
                          >
                            ×
                          </button>
                        )}
                        {countryOpen[type] && countryPositions[type] && createPortal(
                          <div
                            className="phonebook-country-options"
                            id={countryOptionsId}
                            role="listbox"
                            style={{
                              top: countryPositions[type].top,
                              left: countryPositions[type].left,
                              width: countryPositions[type].width,
                            }}
                          >
                            {filteredCountries.map((country) => (
                              <button
                                key={`${country.countryName}-${country.mobileCode}-${country.countryCode}`}
                                type="button"
                                role="option"
                                aria-selected={phone.countryCode === country.mobileCode}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => {
                                  updatePhoneValue(type, "countryCode", country.mobileCode);
                                  setPhoneBlurErrors((current) => ({
                                    ...current,
                                    [type]: {},
                                  }));
                                  setCountryQueries((current) => ({
                                    ...current,
                                    [type]: country.mobileCode,
                                  }));
                                  setCountryOpen((current) => ({
                                    ...current,
                                    [type]: false,
                                  }));
                                }}
                              >
                                <span>{country.countryName}</span>
                                <span>{country.mobileCode}</span>
                              </button>
                            ))}
                            {filteredCountries.length === 0 && (
                              <span className="phonebook-country-no-results">
                                No matching countries
                              </span>
                            )}
                          </div>,
                          document.body,
                        )}
                      </div>
                      {selectedCountry && (
                        <span className="phonebook-country-name">
                          {selectedCountry.countryName}
                        </span>
                      )}
                      {countryCodeError && (
                        <span className="phonebook-contact-inline-error" role="alert">
                          {countryCodeError}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <TextInput
                      type="tel"
                      aria-label={`${type} phone number`}
                      aria-invalid={Boolean(phoneError)}
                      className={phoneError ? "phonebook-input-invalid" : ""}
                      value={phone.number || ""}
                      onChange={(event) =>
                        updatePhoneValue(type, "number", event.target.value)
                      }
                      onBlur={() => {
                        validatePhone(type);
                        checkPhoneMatches(type);
                      }}
                      maxLength={20}
                    />
                    {phoneError && (
                      <span className="phonebook-contact-inline-error" role="alert">
                        {phoneError}
                      </span>
                    )}
                    {matches.length > 0 && (
                      <ul className="phonebook-phone-match-warning">
                        {matches.map((match) => (
                          <li key={`${match.leadId}-${match.matchedOn}`}>
                            This number is also used by {match.fullName}
                            {match.matchedOn ? ` (${match.matchedOn})` : ""}.
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td>
                    <label className="phonebook-contact-grid-checkbox">
                      <input
                        type="checkbox"
                        aria-label={`${type} phone is WhatsApp`}
                        checked={Boolean(phone.whatsapp)}
                        onChange={(event) =>
                          updatePhoneValue(type, "whatsapp", event.target.checked)
                        }
                      />
                    </label>
                  </td>
                  <td>
                    <TextInput
                      type="email"
                      aria-label={`${type} email address`}
                      value={email.email || ""}
                      onChange={(event) =>
                        updateValue("emails", type, "email", event.target.value)
                      }
                      maxLength={200}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {countryLoadError && (
        <p className="phonebook-field-error" role="alert">{countryLoadError}</p>
      )}
      {getFieldError("phoneNumbers") && (
        <p className="phonebook-field-error" role="alert">
          {getFieldError("phoneNumbers")}
        </p>
      )}
      <EmergencyContactsGrid
        rows={form.emergencyContacts || []}
        countries={countries}
        relations={emergencyRelations}
        relationsError={emergencyRelationsError}
        updateValue={updateEmergencyContactValue}
        addRow={addEmergencyContact}
        removeRow={removeEmergencyContact}
        getFieldError={getFieldError}
      />
    </section>
  );
}
