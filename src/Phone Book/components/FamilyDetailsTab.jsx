import React from "react";
import { Field, SelectInput, SectionTitle, TextInput } from "./PhoneBookFields";

export default function FamilyDetailsTab(props) {
  const {
    form, setValue, setFamilyMemberEmergency, setArrayItem, addArrayItem,
    removeArrayItem, addTagValue, familyTagInput, setFamilyTagInput,
    interestInput, setInterestInput, inputClass,
  } = props;

  return (
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
                                onChange={() => setFamilyMemberEmergency(i)}
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
  );
}
