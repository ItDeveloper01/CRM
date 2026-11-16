import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../EmergencyContactsGrid.css"; // CSS file is one folder up; change the name if yours differs
import {
  MAX_EMERGENCY_CONTACTS,
  validatePhonePair,
} from "../phoneValidation";

const fieldOrder = ["countryCode", "phone", "relativeName", "relationCode", "profession"];

const digitsOf = (value) => String(value ?? "").replace(/\D/g, "");

/**
 * Searchable, clearable country code picker. Same behaviour and CSS classes as the
 * picker used in the phone/email grid, so both look and work the same.
 * Each instance keeps its own query / open / position state, so rows do not interfere.
 */
function CountryCodePicker({
  optionsId,
  label,
  value,
  countries,
  disabled = false,
  invalid = false,
  onSelect,
  onClear,
  onBlurValidate,
}) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState(null); // null = not editing, show the saved value
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);

  const dialable = useMemo(
    () => countries.filter((country) => country.mobileCode),
    [countries],
  );
  const selected = useMemo(
    () => dialable.find((country) => country.mobileCode === value),
    [dialable, value],
  );

  const filtered = useMemo(() => {
    const q = (query ?? "").trim().toLowerCase();
    // empty search, or the box still shows the saved code: list everything
    if (!q || q === String(value ?? "").toLowerCase()) return dialable;
    const digits = digitsOf(q);
    return dialable.filter(
      (country) =>
        String(country.countryName ?? "").toLowerCase().includes(q) ||
        String(country.countryCode ?? "").toLowerCase() === q ||
        (digits && digitsOf(country.mobileCode).startsWith(digits)),
    );
  }, [dialable, query, value]);

  // keep the dropdown (rendered in document.body) attached to its input
  useEffect(() => {
    if (!open) return undefined;
    const updatePosition = () => {
      const el = inputRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 2,
        left: rect.left,
        width: Math.max(rect.width, 220),
      });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  const choose = (country) => {
    onSelect(country.mobileCode);
    setQuery(null);
    setOpen(false);
  };

  return (
    <div className="phonebook-country-cell">
      <div className="phonebook-country-picker">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-controls={optionsId}
          aria-expanded={open}
          aria-label={label}
          aria-invalid={invalid}
          autoComplete="off"
          placeholder="Code"
          disabled={disabled}
          className={`phonebook-contact-country-select ${
            invalid ? "phonebook-input-invalid" : ""
          }`}
          value={query ?? value ?? ""}
          onFocus={(event) => {
            setQuery(value ?? "");
            setOpen(true);
            event.currentTarget.select(); // typing replaces the old code
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onBlur={() => {
            setOpen(false);
            setQuery(null);
            onBlurValidate();
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
            } else if (event.key === "ArrowDown") {
              setOpen(true);
            } else if (event.key === "Enter" && open && filtered.length === 1) {
              event.preventDefault();
              choose(filtered[0]);
            }
          }}
        />
        {value && !disabled && (
          <button
            type="button"
            className="phonebook-country-clear"
            aria-label={`Clear ${label}`}
            title="Clear country code"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onClear();
              setQuery(null);
              setOpen(false);
            }}
          >
            ×
          </button>
        )}
        {open &&
          position &&
          createPortal(
            <div
              className="phonebook-country-options"
              id={optionsId}
              role="listbox"
              style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                width: position.width,
              }}
            >
              {filtered.map((country) => (
                <button
                  key={`${country.countryName}-${country.mobileCode}-${country.countryCode}`}
                  type="button"
                  role="option"
                  aria-selected={value === country.mobileCode}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(country)}
                >
                  <span>{country.countryName}</span>
                  <span>{country.mobileCode}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <span className="phonebook-country-no-results">No matching countries</span>
              )}
            </div>,
            document.body,
          )}
      </div>
      {selected && (
        <span className="phonebook-country-name" title={selected.countryName}>
          {selected.countryName}
        </span>
      )}
    </div>
  );
}

export default function EmergencyContactsGrid({
  rows = [],
  countries = [],
  relations = [],
  updateValue,
  addRow,
  removeRow,
  getFieldError = () => "",
  relationsError = "",
  disabled = false,
}) {
  const [blurErrors, setBlurErrors] = useState({});

  const fieldError = (index, field) => {
    const key = `emergencyContacts[${index}].${field}`;
    return getFieldError(key) || blurErrors[index]?.[key] || "";
  };

  const validatePhone = (index) => {
    const row = rows[index] || {};
    const prefix = `emergencyContacts[${index}]`;
    const result = validatePhonePair(row.countryCode, row.phone, {
      countryCodeField: `${prefix}.countryCode`,
      phoneField: `${prefix}.phone`,
    });
    setBlurErrors((current) => ({
      ...current,
      [index]: result.valid ? {} : { [result.field]: result.message },
    }));
  };

  const handleRemove = (index) => {
    setBlurErrors({}); // row numbers shift after a delete, so drop old blur errors
    removeRow(index);
  };

  return (
    <section className="phonebook-emergency-section" aria-label="Emergency contacts">
      <h3 className="phonebook-emergency-title">Emergency contacts</h3>
      {getFieldError("emergencyContacts") && (
        <p className="phonebook-emergency-row-error" role="alert">
          {getFieldError("emergencyContacts")}
        </p>
      )}
      <div className="phonebook-emergency-grid">
        {rows.length > 0 && (
          <div className="phonebook-emergency-header" aria-hidden="true">
            <span>Country code</span>
            <span>Phone</span>
            <span>Relative name</span>
            <span>Relationship</span>
            <span>Profession</span>
            <span />
          </div>
        )}
        {rows.map((row, index) => {
          const rowError = [
            ...new Set(fieldOrder.map((field) => fieldError(index, field)).filter(Boolean)),
          ].join(" ");
          return (
            <div className="phonebook-emergency-row-wrap" key={`emergency-${index}`}>
              <div className="phonebook-emergency-row">
                <CountryCodePicker
                  optionsId={`phonebook-emergency-country-options-${index}`}
                  label={`Emergency contact ${index + 1} country code`}
                  value={row.countryCode || ""}
                  countries={countries}
                  disabled={disabled}
                  invalid={Boolean(fieldError(index, "countryCode"))}
                  onSelect={(code) => {
                    updateValue(index, "countryCode", code);
                    setBlurErrors((current) => ({ ...current, [index]: {} }));
                  }}
                  onClear={() => {
                    updateValue(index, "countryCode", null);
                    setBlurErrors((current) => ({ ...current, [index]: {} }));
                  }}
                  onBlurValidate={() => validatePhone(index)}
                />
                <input
                  type="tel"
                  aria-label={`Emergency contact ${index + 1} phone`}
                  aria-invalid={Boolean(fieldError(index, "phone"))}
                  className={fieldError(index, "phone") ? "phonebook-input-invalid" : ""}
                  placeholder="Phone"
                  value={row.phone || ""}
                  disabled={disabled}
                  maxLength={20}
                  onChange={(event) => updateValue(index, "phone", event.target.value)}
                  onBlur={() => validatePhone(index)}
                />
                <input
                  aria-label={`Emergency contact ${index + 1} relative name`}
                  aria-invalid={Boolean(fieldError(index, "relativeName"))}
                  className={fieldError(index, "relativeName") ? "phonebook-input-invalid" : ""}
                  placeholder="Relative name"
                  value={row.relativeName || ""}
                  disabled={disabled}
                  maxLength={150}
                  onChange={(event) => updateValue(index, "relativeName", event.target.value)}
                />
                <select
                  aria-label={`Emergency contact ${index + 1} relationship`}
                  aria-invalid={Boolean(fieldError(index, "relationCode"))}
                  className={fieldError(index, "relationCode") ? "phonebook-input-invalid" : ""}
                  value={row.relationCode || ""}
                  disabled={disabled}
                  onChange={(event) =>
                    updateValue(index, "relationCode", event.target.value || null)
                  }
                >
                  <option value="">Relationship</option>
                  {relations.map((relation) => (
                    <option key={relation.code} value={relation.code}>
                      {relation.name}
                    </option>
                  ))}
                </select>
                <input
                  aria-label={`Emergency contact ${index + 1} profession`}
                  aria-invalid={Boolean(fieldError(index, "profession"))}
                  className={fieldError(index, "profession") ? "phonebook-input-invalid" : ""}
                  placeholder="Profession"
                  value={row.profession || ""}
                  disabled={disabled}
                  maxLength={100}
                  onChange={(event) => updateValue(index, "profession", event.target.value)}
                />
                <button
                  type="button"
                  className="phonebook-emergency-delete"
                  aria-label={`Delete emergency contact ${index + 1}`}
                  title="Delete"
                  disabled={disabled}
                  onClick={() => handleRemove(index)}
                >
                  ×
                </button>
              </div>
              {rowError && (
                <p className="phonebook-emergency-row-error" role="alert">
                  {rowError}
                </p>
              )}
            </div>
          );
        })}
      </div>
      {relationsError && (
        <p className="phonebook-emergency-row-error" role="alert">
          {relationsError}
        </p>
      )}
      {!disabled && rows.length < MAX_EMERGENCY_CONTACTS && (
        <button type="button" className="phonebook-emergency-add" onClick={addRow}>
          + Add emergency contact
        </button>
      )}
    </section>
  );
}
