import React from "react";
import { render, screen } from "@testing-library/react";
import PersonalDetailsTab from "./PersonalDetailsTab";

describe("PersonalDetailsTab required-field errors", () => {
  test("shows each required field error below its red-bordered input", () => {
    const errors = {
      prefix: "Prefix is required.",
      firstName: "First name is required.",
      lastName: "Last name is required.",
      gender: "Gender is required.",
      homeBranchId: "Customer home branch is required.",
    };

    render(
      <PersonalDetailsTab
        form={{
          prefix: "",
          firstName: "",
          middleName: "",
          lastName: "",
          gender: "",
          dateOfBirth: "",
          homeBranchId: "",
          customerType: "",
          city: "",
          area: "",
          maritalStatus: "",
          company: "",
          designation: "",
          industry: "",
          department: "",
          customerSince: "",
          source: "",
          assignedAgent: "",
          userId: "",
          priority: "",
          notes: "",
        }}
        setValue={() => {}}
        getFieldError={(field) => errors[field] || ""}
      />,
    );

    Object.entries(errors).forEach(([field, message]) => {
      const errorMessage = screen.getByText(message);
      const fieldContainer = errorMessage.closest("label");
      const control = fieldContainer.querySelector("input, select");

      expect(control).toHaveAttribute("aria-invalid", "true");
      expect(control).toHaveClass("phonebook-personal-field-invalid");
      expect(control).toHaveAttribute("aria-describedby", `${field}-error`);
      expect(errorMessage).toHaveAttribute("role", "alert");
    });
  });
});
