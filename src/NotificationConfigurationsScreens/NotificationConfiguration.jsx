
import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Mail,
  Bell,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import config from "../config";

const NotificationConfiguration = () => {
  // ============================================================
  // MASTER DATA
  // Replace these with API calls later if required
  // ============================================================

  const verticals = [
    { id: 1, name: "FIT International" },
    { id: 2, name: "FIT Domestic" },
    { id: 3, name: "GIT International" },
    { id: 4, name: "GIT Domestic" },
  ];

  const eventTypes = [
    { id: 1, name: "New Enquiry Generated" },
    { id: 2, name: "Enquiry Assigned" },
    { id: 3, name: "Enquiry Transferred" },
    { id: 4, name: "Booking Confirmed" },
    { id: 5, name: "Payment Received" },
  ];

  // ============================================================
  // STATE
  // ============================================================

  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ============================================================
  // DUMMY DATA
  // ============================================================

  const dummyData = [
    {
      id: 1,
      verticalId: 1,
      eventTypeId: 1,
      recipientName: "FIT International Head",
      email: "fitinternational@company.com",
      cc: "",
      bcc: "",
      isActive: true,
    },
    {
      id: 2,
      verticalId: 2,
      eventTypeId: 1,
      recipientName: "FIT Domestic Head",
      email: "fitdomestic@company.com",
      cc: "",
      bcc: "",
      isActive: true,
    },
    {
      id: 3,
      verticalId: 3,
      eventTypeId: 1,
      recipientName: "GIT International Head",
      email: "gitinternational@company.com",
      cc: "",
      bcc: "",
      isActive: false,
    },
    {
      id: 4,
      verticalId: 4,
      eventTypeId: 1,
      recipientName: "GIT Domestic Head",
      email: "gitdomestic@company.com",
      cc: "",
      bcc: "",
      isActive: true,
    },
  ];

  // ============================================================
  // LOAD / OPEN CONFIGURATION
  // ============================================================

  const loadConfigurations = async () => {
    setLoading(true);

    try {
      /*
       * ========================================================
       * API CALL - OPEN / LOAD
       * ========================================================
       *
       * Replace endpoint when backend is ready.
       *
       * Example:
       *
       * const response = await axios.get(
       *   config.apiUrl +
       *   "/NotificationConfiguration/GetConfigurations"
       * );
       *
       * setRows(response.data);
       *
       * ========================================================
       */

      // --------------------------------------------------------
      // TEMPORARY DUMMY DATA
      // Remove this when API is ready
      // --------------------------------------------------------

      setRows(dummyData);

    } catch (error) {
      console.error(
        "Error loading notification configurations:",
        error
      );

      alert(
        "Unable to load notification configuration."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadConfigurations();
  }, []);

  // ============================================================
  // UPDATE ROW
  // ============================================================

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  };

  // ============================================================
  // ADD ROW
  // ============================================================

  const addRow = () => {
    const newId =
      rows.length > 0
        ? Math.max(...rows.map((x) => x.id)) + 1
        : 1;

    setRows((prev) => [
      ...prev,
      {
        id: newId,
        verticalId: 1,
        eventTypeId: 1,
        recipientName: "",
        email: "",
        cc: "",
        bcc: "",
        isActive: true,
        isNew: true,
      },
    ]);
  };

  // ============================================================
  // REMOVE ROW
  // ============================================================

  const removeRow = (id) => {
    setRows((prev) =>
      prev.filter((row) => row.id !== id)
    );
  };

  // ============================================================
  // SAVE CONFIGURATION
  // ============================================================

  const handleSave = async () => {
    // ----------------------------------------------------------
    // Basic validation
    // ----------------------------------------------------------

    for (const row of rows) {
      if (!row.recipientName?.trim()) {
        alert("Please enter Recipient Name.");
        return;
      }

      if (!row.email?.trim()) {
        alert("Please enter Email Address.");
        return;
      }
    }

    setSaving(true);

    try {
      /*
       * ========================================================
       * API CALL - SAVE
       * ========================================================
       *
       * Replace endpoint when backend is ready.
       *
       * Example:
       *
       * const response = await axios.post(
       *   config.apiUrl +
       *   "/NotificationConfiguration/SaveConfigurations",
       *   rows
       * );
       *
       * ========================================================
       */

      console.log(
        "Notification configuration payload:",
        rows
      );

      // --------------------------------------------------------
      // TEMPORARY
      // --------------------------------------------------------

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      alert(
        "Notification configuration saved successfully."
      );

    } catch (error) {
      console.error(
        "Error saving notification configurations:",
        error
      );

      alert(
        "Unable to save notification configuration."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="w-full h-full bg-gray-50 p-4">

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">

          <div className="flex items-center gap-2">

            <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
              <Bell
                size={17}
                className="text-blue-600"
              />
            </div>

            <div>

              <h2 className="text-sm font-semibold text-gray-800">
                Notification Configuration
              </h2>

              <p className="text-xs text-gray-500">
                Configure automated email notifications
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2">

            {/* REFRESH / OPEN */}

            <button
              type="button"
              onClick={loadConfigurations}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5
                         text-xs font-medium text-gray-600
                         bg-white border border-gray-300
                         rounded-md hover:bg-gray-50
                         disabled:opacity-50"
            >

              <RefreshCw
                size={14}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              {loading ? "Loading..." : "Refresh"}

            </button>

            {/* ADD */}

            <button
              type="button"
              onClick={addRow}
              className="flex items-center gap-1.5 px-3 py-1.5
                         text-xs font-medium text-blue-600
                         bg-blue-50 border border-blue-200
                         rounded-md hover:bg-blue-100"
            >

              <Plus size={14} />

              Add Row

            </button>

            {/* SAVE */}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5
                         text-xs font-medium text-white
                         bg-blue-600 rounded-md
                         hover:bg-blue-700
                         disabled:opacity-50"
            >

              <Save size={14} />

              {saving
                ? "Saving..."
                : "Save Changes"}

            </button>

          </div>

        </div>

        {/* ======================================================
            INFORMATION BAR
        ====================================================== */}

        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">

          <div className="flex items-center gap-2 text-xs text-gray-500">

            <Mail size={13} />

            <span>
              Configure the recipient, email address and
              notification event for each vertical.
            </span>

          </div>

        </div>

        {/* ======================================================
            TABLE
        ====================================================== */}

        <div className="overflow-x-auto">

          <table className="w-full text-xs">

            <thead>

              <tr className="bg-gray-100 border-b border-gray-200">

                <th className="px-3 py-2 text-left font-semibold text-gray-600">
                  #
                </th>

                <th className="px-3 py-2 text-left font-semibold text-gray-600">
                  Vertical
                </th>

                <th className="px-3 py-2 text-left font-semibold text-gray-600">
                  Event Type
                </th>

                <th className="px-3 py-2 text-left font-semibold text-gray-600">
                  Recipient Name
                </th>

                <th className="px-3 py-2 text-left font-semibold text-gray-600">
                  Email Address
                </th>

                <th className="px-3 py-2 text-left font-semibold text-gray-600">
                  CC
                </th>

                <th className="px-3 py-2 text-left font-semibold text-gray-600">
                  BCC
                </th>

                <th className="px-3 py-2 text-center font-semibold text-gray-600">
                  Status
                </th>

                <th className="px-3 py-2 text-center font-semibold text-gray-600">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {rows.length === 0 ? (

                <tr>

                  <td
                    colSpan="9"
                    className="text-center py-10 text-gray-400"
                  >
                    No notification configurations found.
                  </td>

                </tr>

              ) : (

                rows.map((row, index) => (

                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >

                    {/* NUMBER */}

                    <td className="px-3 py-2 text-gray-400">
                      {index + 1}
                    </td>

                    {/* VERTICAL */}

                    <td className="px-2 py-1.5 min-w-[150px]">

                      <select
                        value={row.verticalId}
                        onChange={(e) =>
                          updateRow(
                            row.id,
                            "verticalId",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1.5
                                   border border-gray-300
                                   rounded-md bg-white
                                   text-xs text-gray-700
                                   focus:outline-none
                                   focus:ring-1
                                   focus:ring-blue-500"
                      >

                        {verticals.map(
                          (vertical) => (

                            <option
                              key={vertical.id}
                              value={vertical.id}
                            >
                              {vertical.name}
                            </option>

                          )
                        )}

                      </select>

                    </td>

                    {/* EVENT */}

                    <td className="px-2 py-1.5 min-w-[190px]">

                      <select
                        value={row.eventTypeId}
                        onChange={(e) =>
                          updateRow(
                            row.id,
                            "eventTypeId",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1.5
                                   border border-gray-300
                                   rounded-md bg-white
                                   text-xs text-gray-700
                                   focus:outline-none
                                   focus:ring-1
                                   focus:ring-blue-500"
                      >

                        {eventTypes.map(
                          (event) => (

                            <option
                              key={event.id}
                              value={event.id}
                            >
                              {event.name}
                            </option>

                          )
                        )}

                      </select>

                    </td>

                    {/* RECIPIENT NAME */}

                    <td className="px-2 py-1.5 min-w-[180px]">

                      <input
                        type="text"
                        value={row.recipientName}
                        onChange={(e) =>
                          updateRow(
                            row.id,
                            "recipientName",
                            e.target.value
                          )
                        }
                        placeholder="Name used in email greeting"
                        title="This name will be used when addressing the recipient in the email."
                        className="w-full px-2 py-1.5
                                   border border-gray-300
                                   rounded-md text-xs
                                   focus:outline-none
                                   focus:ring-1
                                   focus:ring-blue-500"
                      />

                    </td>

                    {/* EMAIL */}

                    <td className="px-2 py-1.5 min-w-[220px]">

                      <input
                        type="email"
                        value={row.email}
                        onChange={(e) =>
                          updateRow(
                            row.id,
                            "email",
                            e.target.value
                          )
                        }
                        placeholder="email@company.com"
                        className="w-full px-2 py-1.5
                                   border border-gray-300
                                   rounded-md text-xs
                                   focus:outline-none
                                   focus:ring-1
                                   focus:ring-blue-500"
                      />

                    </td>

                    {/* CC */}

                    <td className="px-2 py-1.5 min-w-[180px]">

                      <input
                        type="text"
                        value={row.cc}
                        onChange={(e) =>
                          updateRow(
                            row.id,
                            "cc",
                            e.target.value
                          )
                        }
                        placeholder="CC"
                        className="w-full px-2 py-1.5
                                   border border-gray-300
                                   rounded-md text-xs
                                   focus:outline-none
                                   focus:ring-1
                                   focus:ring-blue-500"
                      />

                    </td>

                    {/* BCC */}

                    <td className="px-2 py-1.5 min-w-[180px]">

                      <input
                        type="text"
                        value={row.bcc}
                        onChange={(e) =>
                          updateRow(
                            row.id,
                            "bcc",
                            e.target.value
                          )
                        }
                        placeholder="BCC"
                        className="w-full px-2 py-1.5
                                   border border-gray-300
                                   rounded-md text-xs
                                   focus:outline-none
                                   focus:ring-1
                                   focus:ring-blue-500"
                      />

                    </td>

                    {/* STATUS */}

                    <td className="px-3 py-2 text-center">

                      <button
                        type="button"
                        onClick={() =>
                          updateRow(
                            row.id,
                            "isActive",
                            !row.isActive
                          )
                        }
                        className={`relative inline-flex
                          h-5 w-9 items-center
                          rounded-full transition-colors
                          ${
                            row.isActive
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                      >

                        <span
                          className={`inline-block
                            h-3.5 w-3.5
                            transform rounded-full
                            bg-white transition-transform
                            ${
                              row.isActive
                                ? "translate-x-4"
                                : "translate-x-1"
                            }`}
                        />

                      </button>

                      <div
                        className={`mt-0.5 text-[10px]
                          ${
                            row.isActive
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                      >
                        {row.isActive
                          ? "Active"
                          : "Inactive"}
                      </div>

                    </td>

                    {/* DELETE */}

                    <td className="px-3 py-2 text-center">

                      <button
                        type="button"
                        onClick={() =>
                          removeRow(row.id)
                        }
                        className="p-1.5 text-red-500
                                   hover:bg-red-50
                                   rounded-md transition"
                        title="Remove row"
                      >

                        <Trash2 size={15} />

                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* ======================================================
            FOOTER
        ====================================================== */}

        <div className="flex items-center justify-between
                        px-4 py-2.5 bg-gray-50">

          <span className="text-[11px] text-gray-500">

            {rows.length} notification configuration
            {rows.length !== 1 ? "s" : ""}

          </span>

          <div className="flex items-center gap-4 text-[11px]">

            <div className="flex items-center gap-1.5">

              <span className="w-2 h-2 rounded-full bg-green-500" />

              <span className="text-gray-500">
                Active
              </span>

            </div>

            <div className="flex items-center gap-1.5">

              <span className="w-2 h-2 rounded-full bg-gray-300" />

              <span className="text-gray-500">
                Inactive
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default NotificationConfiguration;

