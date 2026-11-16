import {
  MAX_EMERGENCY_CONTACTS,
  normalizePhoneDigits,
  validateEmergencyContactRows,
  validatePhonePair,
} from "./phoneValidation";

describe("phone country-code validation", () => {
  test.each([
    [null, null, true],
    ["+91", null, false],
    [null, "98765 43210", false],
    ["+91", "98765 43210", true],
    [null, null, true],
  ])("validates the code/number pair (%s, %s)", (countryCode, phone, valid) => {
    expect(validatePhonePair(countryCode, phone).valid).toBe(valid);
  });

  test("normalizes digits and allows a cleared code when the number is also cleared", () => {
    expect(normalizePhoneDigits(" (987)-65 43210 ")).toBe("9876543210");
    expect(validatePhonePair(null, null)).toMatchObject({
      valid: true,
      countryCode: null,
      phone: null,
    });
  });

  test("applies the India and international number rules", () => {
    expect(validatePhonePair("+91", "5876543210").valid).toBe(false);
    expect(validatePhonePair("+91", "6876543210").valid).toBe(true);
    expect(validatePhonePair("+1", "1234").valid).toBe(true);
    expect(validatePhonePair("+1", "12345678901234").valid).toBe(true);
    expect(validatePhonePair("+91", "12345678901234").valid).toBe(false);
  });

  test("allows an unchanged legacy primary phone without a country code", () => {
    expect(validatePhonePair(null, "123456789", {
      allowUnchangedLegacyPhoneWithoutCode: true,
    }).valid).toBe(true);
  });
});

describe("emergency contact validation", () => {
  test("drops an entirely blank row and rejects a partly filled row", () => {
    expect(validateEmergencyContactRows([{}])).toEqual([]);
    expect(validateEmergencyContactRows([{ relativeName: "A" }])).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "emergencyContacts[0].countryCode" }),
        expect.objectContaining({ field: "emergencyContacts[0].phone" }),
        expect.objectContaining({ field: "emergencyContacts[0].relationCode" }),
      ]),
    );
  });

  test("exposes the compact grid maximum", () => {
    expect(MAX_EMERGENCY_CONTACTS).toBe(3);
  });
});
