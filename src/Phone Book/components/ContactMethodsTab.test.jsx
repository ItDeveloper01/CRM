import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ContactMethodsTab from "./ContactMethodsTab";

describe("ContactMethodsTab", () => {
  const props = {
    form: {
      id: "1",
      phones: [
        { type: "Primary", countryCode: "+91", number: "9876543210", whatsapp: true },
      ],
      emails: [{ type: "Primary", email: "person@example.com" }],
      emergencyContacts: [],
    },
    countries: [
      { countryName: "India", countryCode: "IN", mobileCode: "+91" },
    ],
    setValue: jest.fn(),
    updatePhoneValue: jest.fn(),
    checkPhoneMatches: jest.fn(),
    updateEmergencyContactValue: jest.fn(),
    addEmergencyContact: jest.fn(),
    removeEmergencyContact: jest.fn(),
    getFieldError: () => "",
  };

  test("renders all phone and email rows and the emergency contacts grid", () => {
    render(<ContactMethodsTab {...props} />);

    expect(screen.getByText("Phone numbers and email addresses")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Dialing code" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Secondary" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Work" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Office" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Other" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("person@example.com")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Emergency contacts" })).toBeInTheDocument();
  });

  test("keeps country codes clearable and updates the phone number field", () => {
    render(<ContactMethodsTab {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Clear Primary dialing code" }));
    expect(props.updatePhoneValue).toHaveBeenCalledWith("Primary", "countryCode", null);

    fireEvent.change(screen.getByRole("textbox", { name: "Primary phone number" }), {
      target: { value: "9876500000" },
    });
    expect(props.updatePhoneValue).toHaveBeenCalledWith("Primary", "number", "9876500000");
  });
});
