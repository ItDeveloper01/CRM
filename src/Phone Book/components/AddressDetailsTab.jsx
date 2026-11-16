import React from "react";
import { Field, SelectInput, SectionTitle, TextInput } from "./PhoneBookFields";

export default function AddressDetailsTab(props) {
  const {
    form, setAddressItem, addAddress, removeAddress,
  } = props;

  return (
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
  );
}
