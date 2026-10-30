import React, { useState } from "react";
import { X, UserRound, Save } from "lucide-react";
import AddressManager from "./AddressManager";

const inputClass = `
  mt-1
  w-full
  h-[38px]
  rounded-md
  border
  border-slate-300
  bg-white
  px-3
  text-[13px]
  text-slate-700
  outline-none
  placeholder:text-slate-400
  focus:border-blue-500
  focus:ring-1
  focus:ring-blue-100
`;

const CustomerDetails = ({
  leadObj,
  addresses,
  onAddressChange,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    secondaryMobileNumber:
      leadObj?.secondaryMobileNumber || "",

    preferredContactMethod:
      leadObj?.preferredContactMethod || "",

    preferredContactTime:
      leadObj?.preferredContactTime || "",

    secondaryEmail:
      leadObj?.secondaryEmail || "",

    companyName:
      leadObj?.companyName || "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    /*
    |----------------------------------------------------------------------
    | If you want to save these fields into leadObj,
    | handle it from LeadGeneration parent.
    |----------------------------------------------------------------------
    */

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">

      <div
        className="
          relative
          w-full
          max-w-6xl
          max-h-[90vh]
          overflow-y-auto
          rounded-lg
          bg-slate-50
          shadow-xl
        "
      >

        {/* ================================================================
            HEADER
        ================================================================= */}

        <div
          className="
            sticky
            top-0
            z-10
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            bg-white
            px-5
            py-3
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-md
                bg-blue-50
                text-blue-600
              "
            >
              <UserRound size={17} />
            </div>

            <div>
              <h2 className="text-[15px] font-semibold text-slate-800">
                Customer Details
              </h2>

              <p className="text-[11px] text-slate-500">
                Manage additional customer information and addresses
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-md
              p-1.5
              text-slate-400
              hover:bg-slate-100
              hover:text-slate-600
            "
          >
            <X size={18} />
          </button>

        </div>

        {/* ================================================================
            CUSTOMER DETAILS
        ================================================================= */}

        <div className="p-5">

          <div
            className="
              rounded-lg
              border
              border-slate-200
              bg-white
              p-4
            "
          >

            <div className="mb-4">

              <h3 className="text-[14px] font-semibold text-slate-800">
                Contact Information
              </h3>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Enter additional contact details
              </p>

            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-3
                md:grid-cols-2
                lg:grid-cols-3
              "
            >

              {/* Secondary Mobile */}

              <div className="flex flex-col">

                <label className="text-[12px] font-medium text-slate-600">
                  Secondary Mobile Number
                </label>

                <input
                  type="text"
                  value={formData.secondaryMobileNumber}
                  onChange={(e) =>
                    handleChange(
                      "secondaryMobileNumber",
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 15)
                    )
                  }
                  placeholder="Secondary mobile number"
                  className={inputClass}
                />

              </div>

              {/* Preferred Contact Method */}

              <div className="flex flex-col">

                <label className="text-[12px] font-medium text-slate-600">
                  Preferred Contact Method
                </label>

                <select
                  value={formData.preferredContactMethod}
                  onChange={(e) =>
                    handleChange(
                      "preferredContactMethod",
                      e.target.value
                    )
                  }
                  className={inputClass}
                >

                  <option value="">
                    Select Contact Method
                  </option>

                  <option value="Phone">
                    Phone
                  </option>

                  <option value="Email">
                    Email
                  </option>

                  <option value="WhatsApp">
                    WhatsApp
                  </option>

                  <option value="SMS">
                    SMS
                  </option>

                </select>

              </div>

              {/* Preferred Contact Time */}

              <div className="flex flex-col">

                <label className="text-[12px] font-medium text-slate-600">
                  Preferred Contact Time
                </label>

                <select
                  value={formData.preferredContactTime}
                  onChange={(e) =>
                    handleChange(
                      "preferredContactTime",
                      e.target.value
                    )
                  }
                  className={inputClass}
                >

                  <option value="">
                    Select Preferred Time
                  </option>

                  <option value="Morning">
                    Morning
                  </option>

                  <option value="Afternoon">
                    Afternoon
                  </option>

                  <option value="Evening">
                    Evening
                  </option>

                  <option value="Anytime">
                    Anytime
                  </option>

                </select>

              </div>

              {/* Secondary Email */}

              <div className="flex flex-col">

                <label className="text-[12px] font-medium text-slate-600">
                  Secondary Email
                </label>

                <input
                  type="email"
                  value={formData.secondaryEmail}
                  onChange={(e) =>
                    handleChange(
                      "secondaryEmail",
                      e.target.value
                    )
                  }
                  placeholder="Secondary email"
                  className={inputClass}
                />

              </div>

              {/* Company Name */}

              <div className="flex flex-col">

                <label className="text-[12px] font-medium text-slate-600">
                  Company Name
                </label>

                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    handleChange(
                      "companyName",
                      e.target.value
                    )
                  }
                  placeholder="Company name"
                  className={inputClass}
                />

              </div>

            </div>

          </div>

          {/* ==============================================================
              ADDRESS SECTION
          ============================================================== */}

          <div className="mt-4">

            <AddressManager
              initialAddresses={addresses}
              onChange={onAddressChange}
            />

          </div>

        </div>

        {/* ================================================================
            FOOTER
        ================================================================= */}

        <div
          className="
            sticky
            bottom-0
            flex
            justify-end
            gap-3
            border-t
            border-slate-200
            bg-white
            px-5
            py-3
          "
        >

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-md
              border
              border-slate-300
              bg-white
              px-5
              py-2
              text-[12px]
              font-medium
              text-slate-600
              hover:bg-slate-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="
              flex
              items-center
              gap-1.5
              rounded-md
              bg-blue-600
              px-5
              py-2
              text-[12px]
              font-medium
              text-white
              hover:bg-blue-700
            "
          >
            <Save size={14} />
            Save
          </button>

        </div>

      </div>

    </div>
  );
};

export default CustomerDetails;