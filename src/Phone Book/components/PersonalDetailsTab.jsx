import React from "react";
import { Field, SelectInput, SectionTitle, TextInput } from "./PhoneBookFields";

export default function PersonalDetailsTab(props) {
  const {
    form, setValue, setCompanyDetail, handlePhotoUpload, inputClass,
    branches = [], branchLoadError = "", cityAreas = {},
    getFieldError = () => "",
  } = props;

  const fieldErrorProps = (field) => {
    const message = getFieldError(field);
    return {
      "aria-invalid": Boolean(message),
      "aria-describedby": message ? `${field}-error` : undefined,
      className: message ? "phonebook-personal-field-invalid" : "",
    };
  };
  const renderFieldError = (field) => {
    const message = getFieldError(field);
    return message ? (
      <span id={`${field}-error`} role="alert" className="phonebook-personal-field-error">
        {message}
      </span>
    ) : null;
  };

  return (
                <>
                  <section>
                    <SectionTitle>
                      Personal details <span className="text-red-500">*</span>
                    </SectionTitle>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                      <Field label="Prefix *" className="xl:col-span-1">
                        <SelectInput
                          aria-required="true"
                          {...fieldErrorProps("prefix")}
                          value={form.prefix || ""}
                          onChange={(e) => setValue("prefix", e.target.value)}
                        >
                          <option value="">Select prefix</option>
                          {form.prefix && !["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."].includes(form.prefix) && (
                            <option value={form.prefix}>{form.prefix}</option>
                          )}
                          {[
                            "Mr.",
                            "Mrs.",
                            "Ms.",
                            "Dr.",
                            "Prof.",
                          ].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </SelectInput>
                        {renderFieldError("prefix")}
                      </Field>
                      <Field label="First name *">
                        <TextInput
                          aria-required="true"
                          {...fieldErrorProps("firstName")}
                          value={form.firstName}
                          onChange={(e) =>
                            setValue("firstName", e.target.value)
                          }
                          placeholder="e.g. Anita"
                          autoFocus
                        />
                        {renderFieldError("firstName")}
                      </Field>
                      <Field label="Middle name">
                        <TextInput
                          aria-required="true"
                          value={form.middleName || ""}
                          onChange={(e) =>
                            setValue("middleName", e.target.value)
                          }
                          placeholder="e.g. Kumar"
                        />
                      </Field>
                      <Field label="Last name *">
                        <TextInput
                          aria-required="true"
                          {...fieldErrorProps("lastName")}
                          value={form.lastName}
                          onChange={(e) => setValue("lastName", e.target.value)}
                          placeholder="e.g. Patil"
                        />
                        {renderFieldError("lastName")}
                      </Field>
                      <Field label="Gender *">
                        <SelectInput
                          aria-required="true"
                          {...fieldErrorProps("gender")}
                          value={form.gender || ""}
                          onChange={(e) => setValue("gender", e.target.value)}
                        >
                          <option value="">Select gender</option>
                          {[
                            "Female",
                            "Male",
                          ].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </SelectInput>
                        {renderFieldError("gender")}
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
                      <Field label="Customer home branch *">
                        <SelectInput
                          aria-required="true"
                          {...fieldErrorProps("homeBranchId")}
                          value={form.homeBranchId ?? ""}
                          onChange={(e) =>
                            setValue("homeBranchId", e.target.value)
                          }
                        >
                          <option value="">
                            {branches.length ? "Select branch" : "Loading branches…"}
                          </option>
                          {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.branch}
                            </option>
                          ))}
                        </SelectInput>
                        {branchLoadError && (
                          <span role="alert" className="mt-1 block text-xs text-red-600">
                            {branchLoadError}
                          </span>
                        )}
                        {renderFieldError("homeBranchId")}
                      </Field>
                      <Field label="City">
                        <SelectInput
                          value={form.city || ""}
                          onChange={(e) => {
                            setValue("city", e.target.value);
                            setValue("area", "");
                          }}
                        >
                          <option value="">Select city</option>
                          {form.city && !cityAreas[form.city] && (
                            <option value={form.city}>{form.city}</option>
                          )}
                          {Object.keys(cityAreas).map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </SelectInput>
                      </Field>
                      <Field label="Area">
                        <SelectInput
                          value={form.area || ""}
                          disabled={!form.city}
                          onChange={(e) => setValue("area", e.target.value)}
                        >
                          <option value="">Select area</option>
                          {form.area && !cityAreas[form.city]?.includes(form.area) && (
                            <option value={form.area}>{form.area}</option>
                          )}
                          {(cityAreas[form.city] || []).map((area) => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </SelectInput>
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
                      <Field label="Source">
                        <TextInput
                          value={form.source || ""}
                          onChange={(e) => setValue("source", e.target.value)}
                          placeholder="e.g. Referral"
                        />
                      </Field>
                      {/* <Field label="Assigned agent">
                        <TextInput
                          value={form.assignedAgent || ""}
                          onChange={(e) =>
                            setValue("assignedAgent", e.target.value)
                          }
                          placeholder="Agent name"
                        />
                      </Field> */}
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
                      {/* <Field label="Priority">
                        <SelectInput
                          value={form.priority}
                          onChange={(e) => setValue("priority", e.target.value)}
                        >
                          {["Low", "Normal", "High", "Urgent"].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </SelectInput>
                      </Field> */}
                    </div>
                    {/* <div className="mt-4 rounded-xl border border-slate-200 p-4">
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
                    </div> */}
                  </section>
                  {/* <section>
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
                  </section> */}
                </>
  );
}
