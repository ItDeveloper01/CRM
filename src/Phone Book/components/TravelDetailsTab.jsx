import React from "react";
import { Field, SelectInput, SectionTitle, TextInput } from "./PhoneBookFields";

export default function TravelDetailsTab(props) {
  const {
    form, setPassportDetail, setArrayItem, addArrayItem, removeArrayItem,
  } = props;

  return (
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
  );
}
