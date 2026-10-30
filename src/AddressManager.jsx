
import React, { useState } from "react";
import {
  MapPin,
  Pencil,
  Trash2,
  Plus,
  Check,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| ADDRESS COMPONENT STYLES
|--------------------------------------------------------------------------
*/

const FONT = {
  title: "text-[15px] font-semibold",
  label: "text-[12px] font-medium",
  value: "text-[13px]",
  small: "text-[11px]",
  button: "text-[12px] font-medium",
};

const EMPTY_ADDRESS = {
  title: "",
  addressLine1: "",
  addressLine2: "",
  street: "",
  landmark: "",
  city: "",
  country: "India",
  pincode: "",
};

const INITIAL_ADDRESSES = [];

/*
|--------------------------------------------------------------------------
| ADDRESS MANAGER
|--------------------------------------------------------------------------
*/

const AddressManager = ({
  initialAddresses = INITIAL_ADDRESSES,
  onChange,
}) => {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_ADDRESS);

  /*
  |--------------------------------------------------------------------------
  | FORM HANDLERS
  |--------------------------------------------------------------------------
  */

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(EMPTY_ADDRESS);
    setIsAdding(false);
    setEditingId(null);
  };

  /*
  |--------------------------------------------------------------------------
  | ADD ADDRESS
  |--------------------------------------------------------------------------
  */

  const handleAdd = () => {
    if (!formData.addressLine1.trim()) {
      return;
    }

    if (!formData.city.trim()) {
      return;
    }

    if (!formData.country.trim()) {
      return;
    }

    if (!formData.pincode.trim()) {
      return;
    }

    const newAddress = {
      ...formData,
      id: Date.now(),
      isPrimary: addresses.length === 0,
    };

    const updatedAddresses = [
      ...addresses,
      newAddress,
    ];

    setAddresses(updatedAddresses);

    if (onChange) {
      onChange(updatedAddresses);
    }

    resetForm();
  };

  /*
  |--------------------------------------------------------------------------
  | EDIT ADDRESS
  |--------------------------------------------------------------------------
  */

  const handleEdit = (address) => {
    setEditingId(address.id);

    setFormData({
      title: address.title || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      street: address.street || "",
      landmark: address.landmark || "",
      city: address.city || "",
      country: address.country || "India",
      pincode: address.pincode || "",
    });

    setIsAdding(false);
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE ADDRESS
  |--------------------------------------------------------------------------
  */

  const handleUpdate = () => {
    if (!formData.addressLine1.trim()) {
      return;
    }

    if (!formData.city.trim()) {
      return;
    }

    if (!formData.country.trim()) {
      return;
    }

    if (!formData.pincode.trim()) {
      return;
    }

    const updatedAddresses = addresses.map(
      (address) =>
        address.id === editingId
          ? {
              ...address,
              ...formData,
            }
          : address
    );

    setAddresses(updatedAddresses);

    if (onChange) {
      onChange(updatedAddresses);
    }

    resetForm();
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE ADDRESS
  |--------------------------------------------------------------------------
  */

  const handleRemove = (id) => {
    const addressToRemove = addresses.find(
      (address) => address.id === id
    );

    if (!addressToRemove) {
      return;
    }

    let updatedAddresses = addresses.filter(
      (address) => address.id !== id
    );

    /*
    |--------------------------------------------------------------------------
    | If primary address is removed,
    | make the first remaining address primary.
    |--------------------------------------------------------------------------
    */

    if (
      addressToRemove.isPrimary &&
      updatedAddresses.length > 0
    ) {
      updatedAddresses = updatedAddresses.map(
        (address, index) => ({
          ...address,
          isPrimary: index === 0,
        })
      );
    }

    setAddresses(updatedAddresses);

    if (onChange) {
      onChange(updatedAddresses);
    }

    if (editingId === id) {
      resetForm();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SET PRIMARY ADDRESS
  |--------------------------------------------------------------------------
  */

  const handleSetPrimary = (id) => {
    const updatedAddresses = addresses.map(
      (address) => ({
        ...address,
        isPrimary: address.id === id,
      })
    );

    setAddresses(updatedAddresses);

    if (onChange) {
      onChange(updatedAddresses);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | ADDRESS FORM
  |--------------------------------------------------------------------------
  */

  const renderAddressForm = () => {
    const isEditMode = editingId !== null;

    return (
      <div
        className="
          mt-4
          rounded-lg
          border
          border-slate-200
          bg-slate-50/60
          p-4
        "
      >
        {/* Form Header */}

        <div className="mb-4">
          <div className="text-[14px] font-semibold text-slate-800">
            {isEditMode
              ? "Edit Address"
              : "Add New Address"}
          </div>

          <div className="mt-0.5 text-[11px] text-slate-500">
            Enter the complete address details
          </div>
        </div>

        {/* Address Title */}

        <div className="mb-3">
          <label
            className={`${FONT.label} text-slate-600`}
          >
            Address Title
          </label>

          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              handleChange(
                "title",
                e.target.value
              )
            }
            placeholder="Home, Office, Parent's House"
            className="
              mt-1
              w-full
              rounded-md
              border
              border-slate-300
              bg-white
              px-3
              py-2
              text-[13px]
              text-slate-700
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-blue-500
              focus:ring-1
              focus:ring-blue-100
            "
          />
        </div>

        {/* Address Fields */}

        <div
          className="
            grid
            grid-cols-1
            gap-3
            md:grid-cols-2
            lg:grid-cols-4
          "
        >
          {/* Address Line 1 */}

          <div className="lg:col-span-2">
            <label
              className={`${FONT.label} text-slate-600`}
            >
              Address Line 1 *
            </label>

            <input
              type="text"
              value={formData.addressLine1}
              onChange={(e) =>
                handleChange(
                  "addressLine1",
                  e.target.value
                )
              }
              placeholder="House / Flat / Building"
              className="
                mt-1
                w-full
                rounded-md
                border
                border-slate-300
                bg-white
                px-3
                py-2
                text-[13px]
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:ring-1
                focus:ring-blue-100
              "
            />
          </div>

          {/* Address Line 2 */}

          <div className="lg:col-span-2">
            <label
              className={`${FONT.label} text-slate-600`}
            >
              Address Line 2
            </label>

            <input
              type="text"
              value={formData.addressLine2}
              onChange={(e) =>
                handleChange(
                  "addressLine2",
                  e.target.value
                )
              }
              placeholder="Area / Locality"
              className="
                mt-1
                w-full
                rounded-md
                border
                border-slate-300
                bg-white
                px-3
                py-2
                text-[13px]
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:ring-1
                focus:ring-blue-100
              "
            />
          </div>

          {/* Street */}

          <div>
            <label
              className={`${FONT.label} text-slate-600`}
            >
              Street
            </label>

            <input
              type="text"
              value={formData.street}
              onChange={(e) =>
                handleChange(
                  "street",
                  e.target.value
                )
              }
              placeholder="Street / Road"
              className="
                mt-1
                w-full
                rounded-md
                border
                border-slate-300
                bg-white
                px-3
                py-2
                text-[13px]
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:ring-1
                focus:ring-blue-100
              "
            />
          </div>

          {/* Landmark */}

          <div>
            <label
              className={`${FONT.label} text-slate-600`}
            >
              Landmark
            </label>

            <input
              type="text"
              value={formData.landmark}
              onChange={(e) =>
                handleChange(
                  "landmark",
                  e.target.value
                )
              }
              placeholder="Near / Opposite"
              className="
                mt-1
                w-full
                rounded-md
                border
                border-slate-300
                bg-white
                px-3
                py-2
                text-[13px]
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:ring-1
                focus:ring-blue-100
              "
            />
          </div>

          {/* City */}

          <div>
            <label
              className={`${FONT.label} text-slate-600`}
            >
              City *
            </label>

            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                handleChange(
                  "city",
                  e.target.value
                )
              }
              placeholder="City"
              className="
                mt-1
                w-full
                rounded-md
                border
                border-slate-300
                bg-white
                px-3
                py-2
                text-[13px]
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:ring-1
                focus:ring-blue-100
              "
            />
          </div>

          {/* Country */}

          <div>
            <label
              className={`${FONT.label} text-slate-600`}
            >
              Country *
            </label>

            <input
              type="text"
              value={formData.country}
              onChange={(e) =>
                handleChange(
                  "country",
                  e.target.value
                )
              }
              placeholder="Country"
              className="
                mt-1
                w-full
                rounded-md
                border
                border-slate-300
                bg-white
                px-3
                py-2
                text-[13px]
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:ring-1
                focus:ring-blue-100
              "
            />
          </div>

          {/* Pincode */}

          <div>
            <label
              className={`${FONT.label} text-slate-600`}
            >
              Pincode *
            </label>

            <input
              type="text"
              value={formData.pincode}
              onChange={(e) =>
                handleChange(
                  "pincode",
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10)
                )
              }
              placeholder="Pincode"
              className="
                mt-1
                w-full
                rounded-md
                border
                border-slate-300
                bg-white
                px-3
                py-2
                text-[13px]
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:ring-1
                focus:ring-blue-100
              "
            />
          </div>
        </div>

        {/* Cancel / Save */}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={resetForm}
            className="
              rounded-md
              border
              border-slate-300
              bg-white
              px-4
              py-1.5
              text-[12px]
              font-medium
              text-slate-600
              transition
              hover:bg-slate-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              isEditMode
                ? handleUpdate
                : handleAdd
            }
            className="
              rounded-md
              bg-blue-600
              px-4
              py-1.5
              text-[12px]
              font-medium
              text-white
              shadow-sm
              transition
              hover:bg-blue-700
            "
          >
            {isEditMode
              ? "Save"
              : "Save"}
          </button>
        </div>
      </div>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | ADDRESS CARD
  |--------------------------------------------------------------------------
  */

  const renderAddressCard = (address) => {
    return (
      <div
        key={address.id}
        className={`
          min-h-[145px]
          rounded-lg
          border
          bg-white
          px-4
          py-3
          transition
          ${
            address.isPrimary
              ? "border-blue-300 ring-1 ring-blue-100"
              : "border-slate-200 hover:border-slate-300"
          }
        `}
      >
        {/* Card Header */}

        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2">
            {/* Primary Radio */}

            <div className="pt-0.5">
              <input
                type="radio"
                name="primaryAddress"
                checked={address.isPrimary}
                onChange={() =>
                  handleSetPrimary(
                    address.id
                  )
                }
                className="
                  h-4
                  w-4
                  cursor-pointer
                  accent-blue-600
                "
                title="Set as primary address"
              />
            </div>

            {/* Icon */}

            <span
              className="
                flex
                h-6
                w-6
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-blue-50
                text-blue-600
              "
            >
              <MapPin size={14} />
            </span>

            {/* Title */}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="truncate text-[14px] font-semibold text-slate-800">
                  {address.title ||
                    "Address"}
                </span>

                {address.isPrimary && (
                  <span
                    className="
                      rounded-full
                      bg-blue-50
                      px-2
                      py-0.5
                      text-[9px]
                      font-semibold
                      text-blue-600
                    "
                  >
                    PRIMARY
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() =>
                handleEdit(address)
              }
              className="
                rounded-md
                p-1.5
                text-slate-400
                transition
                hover:bg-blue-50
                hover:text-blue-600
              "
              title="Edit"
            >
              <Pencil size={14} />
            </button>

            <button
              type="button"
              onClick={() =>
                handleRemove(address.id)
              }
              className="
                rounded-md
                p-1.5
                text-slate-400
                transition
                hover:bg-red-50
                hover:text-red-600
              "
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Address Details */}

        <div className="ml-[34px] mt-3">
          <div className="text-[12px] leading-5 text-slate-700">
            {address.addressLine1}

            {address.addressLine2 && (
              <>
                {", "}
                {address.addressLine2}
              </>
            )}

            {address.street && (
              <>
                {", "}
                {address.street}
              </>
            )}
          </div>

          <div className="text-[12px] leading-5 text-slate-600">
            {address.landmark && (
              <>
                {address.landmark}
                {" · "}
              </>
            )}

            {address.city},{" "}
            {address.country} -{" "}
            <span className="font-medium text-slate-700">
              {address.pincode}
            </span>
          </div>
        </div>

        {/* Primary Text */}

        {address.isPrimary && (
          <div
            className="
              ml-[34px]
              mt-2
              flex
              items-center
              gap-1
              text-[10px]
              font-medium
              text-blue-600
            "
          >
            <Check size={11} />
            Primary address
          </div>
        )}
      </div>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | MAIN UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="w-full">
      {/* Component Header */}

      <div
        className="
          mb-4
          flex
          min-h-[52px]
          items-center
          justify-between
          rounded-lg
          border
          border-slate-200
          bg-white
          px-4
          py-2.5
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-md
              bg-blue-50
              text-blue-600
            "
          >
            <MapPin size={17} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold text-slate-800">
                Customer Addresses
              </h3>

              {addresses.length > 0 && (
                <span
                  className="
                    rounded-full
                    bg-slate-100
                    px-2
                    py-0.5
                    text-[10px]
                    font-medium
                    text-slate-500
                  "
                >
                  {addresses.length}
                </span>
              )}
            </div>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Manage saved addresses for this customer
            </p>
          </div>
        </div>

        {/* Add Address */}

        <button
          type="button"
          onClick={() => {
            setFormData(EMPTY_ADDRESS);
            setEditingId(null);
            setIsAdding(true);
          }}
          className="
            flex
            shrink-0
            items-center
            gap-1.5
            rounded-md
            border
            border-blue-200
            bg-blue-50
            px-3
            py-1.5
            text-[12px]
            font-medium
            text-blue-600
            transition
            hover:bg-blue-100
          "
        >
          <Plus size={14} />
          Add Address
        </button>
      </div>

      {/* 
      |--------------------------------------------------------------------------
      | Saved Addresses
      |--------------------------------------------------------------------------
      | 3 cards per row on large screens.
      |--------------------------------------------------------------------------
      */}

      {addresses.length > 0 && (
        <div
          className="
            grid
            grid-cols-1
            gap-3
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {addresses.map(renderAddressCard)}
        </div>
      )}

      {/* Empty State */}

      {addresses.length === 0 &&
        !isAdding &&
        editingId === null && (
          <div
            className="
              rounded-lg
              border
              border-dashed
              border-slate-300
              bg-slate-50/50
              px-4
              py-6
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-blue-50
                text-blue-500
              "
            >
              <MapPin size={18} />
            </div>

            <div className="mt-2 text-[13px] font-medium text-slate-700">
              No addresses added
            </div>

            <div className="mt-0.5 text-[11px] text-slate-500">
              Add an address to keep customer details organized.
            </div>

            <button
              type="button"
              onClick={() => {
                setFormData(EMPTY_ADDRESS);
                setEditingId(null);
                setIsAdding(true);
              }}
              className="
                mt-3
                inline-flex
                items-center
                gap-1.5
                rounded-md
                bg-blue-600
                px-3
                py-1.5
                text-[12px]
                font-medium
                text-white
                transition
                hover:bg-blue-700
              "
            >
              <Plus size={14} />
              Add Address
            </button>
          </div>
        )}

      {/* Add / Edit Form */}

      {(isAdding || editingId !== null) && (
        <div className="mt-4">
          {renderAddressForm()}
        </div>
      )}
    </div>
  );
};

export default AddressManager;

