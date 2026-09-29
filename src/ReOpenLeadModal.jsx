// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";

// import { useGetSessionUser } from "./SessionContext";
// import config from "./config";

// /* =========================================================
//    REOPEN LEAD MODAL
//    =========================================================

//    Props:
//    - isOpen: boolean — controls visibility
//    - onClose: () => void — called on Cancel / backdrop-safe close
//    - selectedLead: single lead object (optional, single-reopen case)
//    - selectedLeads: array of lead objects (optional, bulk-reopen case)
//    - onReopened: async ({ leadIds, reason, response }) => void
//        Called AFTER the API call succeeds, so the parent screen
//        can remove/update the reopened leads in its own list.

//    Mirrors LeadTransferModal's normalization pattern:
//    pass either selectedLead OR selectedLeads — this component
//    always works from one combined array internally.
//    ========================================================= */

// export default function ReOpenLeadModal({
//   isOpen,
//   onClose,
//   selectedLead,
//   selectedLeads = [],
//   onReopened,
// }) {
//   const { user: sessionUser } = useGetSessionUser();

//   const [reopenReason, setReopenReason] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   /* =======================================================
//      NORMALIZE SELECTED LEADS
//      ======================================================= */

//   const selectedReopenLeads = useMemo(() => {
//     if (Array.isArray(selectedLeads) && selectedLeads.length > 0) {
//       return selectedLeads.filter(Boolean);
//     }
//     return selectedLead ? [selectedLead] : [];
//   }, [selectedLead, selectedLeads]);

//   /* =======================================================
//      RESET ON OPEN
//      ======================================================= */

//   useEffect(() => {
//     if (isOpen) {
//       setReopenReason("");
//       setErrorMessage("");
//       setSubmitting(false);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   /* =======================================================
//      SUBMIT
//      ======================================================= */

//   /*
//    * Endpoint name below is a placeholder — swap it for
//    * whatever your backend actually exposes for reopening
//    * leads (e.g. something alongside
//    * /TempLead/TransferLeadToSelectedUserService).
//    */

//   const handleReopenSubmit = async () => {
//     if (submitting) return;
//     if (!reopenReason.trim()) return;
//     if (selectedReopenLeads.length === 0) return;
//     if (!sessionUser?.token) return;

//     try {
//       setSubmitting(true);
//       setErrorMessage("");

//       const payload = {
//         LeadsToOpen: selectedReopenLeads,
//         Reason: reopenReason.trim(),
//         RequestedByUserId: sessionUser?.user?.userId,
//       };

//       console.log("Reopen payload:", payload);

//       const response = await axios.post( config.apiUrl + "/TempLead/ReopenLeads",
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${sessionUser.token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (onReopened) {
//         await onReopened({
//            selectedReopenLeads,
//           reason: reopenReason.trim(),
//           response: response.data,
//         });
//       }
   
//   console.log("Reopen API response:", response.data);

//       onClose();
//     } catch (error) {
//       console.error("Reopen failed:", error);
//       console.error("Reopen API response:", error?.response?.data);

//       setErrorMessage(
//         "Something went wrong while reopening. Please try again."
//       );
//       // Keep the modal open with the reason intact so the user can retry.
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     if (submitting) return;
//     onClose();
//     setReopenReason("");
//     setErrorMessage("");
//   };

//   /* =======================================================
//      RENDER
//      ======================================================= */

//   return (
//     <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4">
//       <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl border border-gray-200">
//         <div className="px-5 py-4 border-b border-gray-100">
//           <h3 className="text-base font-semibold text-gray-800">
//             Reopen Lead{selectedReopenLeads.length > 1 ? "s" : ""}
//           </h3>
//           <p className="mt-1 text-xs text-gray-500">
//             Please provide a reason/message for reopening. This field is
//             mandatory.
//           </p>
//         </div>

//         <div className="px-5 py-5">
//           <div className="mb-3 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-600">
//             {selectedReopenLeads.length} lead
//             {selectedReopenLeads.length > 1 ? "s" : ""} selected
//           </div>

//           <label className="block text-sm font-medium text-gray-700 mb-1.5">
//             Reason / Message <span className="text-red-600">*</span>
//           </label>
//           <textarea
//             value={reopenReason}
//             onChange={(e) => setReopenReason(e.target.value)}
//             rows={5}
//             maxLength={1000}
//             placeholder="Enter the reason for reopening the selected lead(s)..."
//             disabled={submitting}
//             className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 disabled:bg-gray-50 disabled:text-gray-400"
//             autoFocus
//           />
//           <div className="mt-1 text-right text-[11px] text-gray-400">
//             {reopenReason.length}/1000
//           </div>

//           {errorMessage && (
//             <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">
//               {errorMessage}
//             </div>
//           )}
//         </div>

//         <div className="px-5 py-3 border-t border-gray-100 flex justify-end gap-2">
//           <button
//             type="button"
//             onClick={handleCancel}
//             disabled={submitting}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={handleReopenSubmit}
//             disabled={!reopenReason.trim() || submitting}
//             className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
//           >
//             {submitting ? "Reopening..." : "Reopen"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  useGetSessionUser,
} from "./SessionContext";

import config from "./config";

/* =========================================================
   REOPEN LEAD MODAL

   IMPORTANT IDENTITY RULE
   ---------------------------------------------------------

   Every lead is passed together with its frontend-only
   selection key.

   Example:

   {
       selectionKey: "HOL_12345678",
       lead: { ...lead object }
   }

   The selection key is NOT added to the lead object.

   The key travels:

       UI
        ↓
       ReOpenLeadModal
        ↓
       API
        ↓
       ReOpenLeadModal
        ↓
       Parent

   Therefore the parent never has to identify a returned
   lead using LeadId / CategoryId / object reference.

   This is especially important because the same lead may
   move between:

       Postponed
       Confirmed
       Lost
       Closed
       Open

   and LeadId / CategoryId are not globally unique.

   ========================================================= */

export default function ReOpenLeadModal({
  isOpen,

  onClose,

  /*
   * Preferred prop.
   *
   * Example:
   *
   * [
   *   {
   *      selectionKey: "HOL_12345678",
   *      lead: {...}
   *   }
   * ]
   */
  selectedLeadEntries = [],

  /*
   * Backward compatibility.
   *
   * These are optional.
   */
  selectedLead,
  selectedLeads = [],

  onReopened,
}) {
  const {
    user: sessionUser,
  } = useGetSessionUser();

  const [
    reopenReason,
    setReopenReason,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  /* =======================================================
     NORMALIZE SELECTED LEAD ENTRIES
     =======================================================

     Preferred source:

         selectedLeadEntries

     Legacy fallback:

         selectedLeads
         selectedLead

     ======================================================= */

  const normalizedEntries =
    useMemo(() => {
      /*
       * Preferred path.
       *
       * These already contain the selection key.
       * 
       */

console.log("Selection Entries for reopen:" , selectedLeadEntries);
console.log("Selected LEads for reopen:",selectedLeads);

      if (
        Array.isArray(
          selectedLeadEntries
        ) &&
        selectedLeadEntries.length >
          0
      ) {
        return selectedLeadEntries
          .filter(
            (entry) =>
              entry &&
              entry.lead &&
              entry.selectionKey
          )
          .map(
            (entry) => ({
              selectionKey:
                entry.selectionKey,

              lead:
                entry.lead,
            })
          );
      }

      /*
       * Legacy fallback.
       *
       * This path is retained only so the modal does not
       * immediately break if another screen still calls it
       * with selectedLeads / selectedLead.
       *
       * However, the main LeadListWithFilters now uses
       * selectedLeadEntries.
       */
      if (
        Array.isArray(
          selectedLeads
        ) &&
        selectedLeads.length > 0
      ) {
        return selectedLeads
          .filter(Boolean)
          .map(
            (lead) => ({
              selectionKey:
                null,

              lead,
            })
          );
      }

      if (selectedLead) {
        return [
          {
            selectionKey: null,
            lead: selectedLead,
          },
        ];
      }

      return [];
    }, [
      selectedLeadEntries,
      selectedLeads,
      selectedLead,
    ]);

  /* =======================================================
     RESET ON OPEN
     ======================================================= */

  useEffect(() => {
    if (isOpen) {
      setReopenReason("");
      setErrorMessage("");
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  /* =======================================================
     SUBMIT REOPEN
     ======================================================= */

  const handleReopenSubmit =

  
    async () => {
      if (submitting) {
        return;
      }

      const reason =
        reopenReason.trim();

      if (!reason) {
        setErrorMessage(
          "Reason / Message is mandatory."
        );

        return;
      }

      if (
        normalizedEntries.length ===
        0
      ) {
        setErrorMessage(
          "No leads were selected for reopening."
        );

        return;
      }

      if (
        !sessionUser?.token
      ) {
        setErrorMessage(
          "User session has expired. Please login again."
        );

        return;
      }

      /*
       * Make sure every entry has a key.
       *
       * The new LeadListWithFilters path will always
       * provide keys.
       */

console.log("Entries for reopen:" ,normalizedEntries);

      const entriesWithoutKeys =
        normalizedEntries.filter(
          (entry) =>
            !entry.selectionKey
        );

      if (
        entriesWithoutKeys.length >
        0
      ) {
        console.error(
          "Reopen entries missing selection keys:",
          entriesWithoutKeys
        );

        setErrorMessage(
          "Unable to identify one or more selected leads. Please close and select them again."
        );

        return;
      }

      try {
        setSubmitting(true);
        setErrorMessage("");

        /* =================================================
           IMPORTANT PAYLOAD

           The selection key is kept OUTSIDE the lead object.

           We send:

           LeadsToOpen: [
             {
               SelectionKey: "...",
               Lead: { ... }
             }
           ]

           ================================================= */

        const leadsToOpen =
          normalizedEntries.map(
            (entry) => ({
              SelectionKey:
                entry.selectionKey,

              Lead:
                entry.lead,
            })
          );

        const payload = {
          LeadsToOpen:
            leadsToOpen,

          Reason:
            reason,

          RequestedByUserId:
            sessionUser?.user
              ?.userId,
        };

        console.log(
          "========================================"
        );

        console.log(
          "REOPEN REQUEST"
        );

        console.log(
          "LeadsToOpen:",
          leadsToOpen
        );

        console.log(
          "Selection Keys:",
          leadsToOpen.map(
            (x) =>
              x.SelectionKey
          )
        );

        console.log(
          "Payload:",
          payload
        );

        console.log(
          "========================================"
        );

        const response =
          await axios.post(
            config.apiUrl +
              "/TempLead/ReopenLeads",

            payload,

            {
              headers: {
                Authorization:
                  `Bearer ${sessionUser.token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );

        console.log(
          "========================================"
        );

        console.log(
          "REOPEN API RESPONSE"
        );

        console.log(
          response.data
        );

        console.log(
          "========================================"
        );

        /*
         * =================================================
         * EXTRACT RETURNED LEADS
         * =================================================
         *
         * Expected backend response:
         *
         * {
         *    success: true,
         *
         *    leadsToOpen: [
         *       {
         *          selectionKey: "...",
         *          lead: {...}
         *       }
         *    ]
         * }
         *
         * We also support LeadsToOpen casing because the
         * backend may serialize the property differently.
         */

        const responseData =
          response.data;

        let returnedEntries =
          null;

        if (
          Array.isArray(
            responseData
          )
        ) {
          /*
           * In case backend directly returns:
           *
           * [
           *   {
           *      selectionKey,
           *      lead
           *   }
           * ]
           */
          returnedEntries =
            responseData;
        } else if (
          Array.isArray(
            responseData?.leadsToOpen
          )
        ) {
          returnedEntries =
            responseData.leadsToOpen;
        } else if (
          Array.isArray(
            responseData?.LeadsToOpen
          )
        ) {
          returnedEntries =
            responseData.LeadsToOpen;
        } else if (
          Array.isArray(
            responseData?.reopenedLeads
          )
        ) {
          returnedEntries =
            responseData.reopenedLeads;
        } else if (
          Array.isArray(
            responseData?.ReopenedLeads
          )
        ) {
          returnedEntries =
            responseData.ReopenedLeads;
        }

        /*
         * If the backend doesn't return the collection
         * explicitly but reports success, we can safely
         * use the exact entries that were sent because
         * the API call itself succeeded.
         *
         * However, if your backend WILL return the same
         * entries, that returned collection is preferred.
         */

        if (
          !Array.isArray(
            returnedEntries
          ) ||
          returnedEntries.length ===
            0
        ) {
          console.warn(
            "Backend did not return LeadsToOpen explicitly. Using submitted entries after successful API response."
          );

          returnedEntries =
            leadsToOpen.map(
              (entry) => ({
                selectionKey:
                  entry.SelectionKey,

                lead:
                  entry.Lead,
              })
            );
        }

        /*
         * Normalize backend casing.
         *
         * Supports:
         *
         * selectionKey
         * SelectionKey
         *
         * lead
         * Lead
         */

        const normalizedReturnedEntries =
          returnedEntries
            .map((entry) => {
              const selectionKey =
                entry?.selectionKey ??
                entry?.SelectionKey ??
                null;

              const lead =
                entry?.lead ??
                entry?.Lead ??
                null;

              if (
                !selectionKey ||
                !lead
              ) {
                return null;
              }

              return {
                selectionKey,
                lead,
              };
            })
            .filter(Boolean);

        /*
         * =================================================
         * VERIFY THAT THE KEYS CAME BACK
         * =================================================
         */

        console.log(
          "Returned reopen entries:",
          normalizedReturnedEntries
        );

        console.log(
          "Returned selection keys:",
          normalizedReturnedEntries.map(
            (entry) =>
              entry.selectionKey
          )
        );

        /*
         * Pass the returned key + lead back to parent.
         *
         * Parent will use ONLY selectionKey to update
         * its state.
         */

        if (
          onReopened
        ) {
          await onReopened({
            reopenedEntries:
              normalizedReturnedEntries,

            reason,

            response:
              responseData,
          });
        }

        /*
         * Close only after the parent has processed
         * the successful response.
         */

        onClose();
      } catch (error) {
        console.error(
          "Reopen failed:",
          error
        );

        console.error(
          "Reopen API response:",
          error?.response?.data
        );

        const apiMessage =
          error?.response?.data
            ?.message ||
          error?.response?.data
            ?.Message ||
          error?.response
            ?.statusText;

        setErrorMessage(
          apiMessage ||
            "Something went wrong while reopening. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    };

  /* =======================================================
     CANCEL
     ======================================================= */

  const handleCancel = () => {
    if (submitting) {
      return;
    }

    onClose();

    setReopenReason("");
    setErrorMessage("");
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div
      className="
        fixed
        inset-0
        z-[110]
        flex
        items-center
        justify-center
        bg-black/40
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-lg
          rounded-xl
          bg-white
          shadow-2xl
          border
          border-gray-200
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            px-5
            py-4
            border-b
            border-gray-100
          "
        >
          <h3
            className="
              text-base
              font-semibold
              text-gray-800
            "
          >
            Reopen Lead
            {normalizedEntries.length >
            1
              ? "s"
              : ""}
          </h3>

          <p
            className="
              mt-1
              text-xs
              text-gray-500
            "
          >
            Please provide a
            reason/message for
            reopening. This field
            is mandatory.
          </p>
        </div>

        {/* =================================================
            BODY
        ================================================= */}

        <div
          className="
            px-5
            py-5
          "
        >
          <div
            className="
              mb-3
              rounded-lg
              bg-gray-50
              border
              border-gray-200
              px-3
              py-2
              text-xs
              text-gray-600
            "
          >
            {normalizedEntries.length}{" "}
            lead
            {normalizedEntries.length >
            1
              ? "s"
              : ""}{" "}
            selected
          </div>

          {/* Optional debug/identity information */}
          <div
            className="
              mb-3
              rounded-lg
              bg-amber-50
              border
              border-amber-100
              px-3
              py-2
              text-[11px]
              text-amber-700
            "
          >
            Selection identity is
            preserved while
            reopening.
          </div>

          <label
            className="
              block
              text-sm
              font-medium
              text-gray-700
              mb-1.5
            "
          >
            Reason / Message{" "}
            <span className="text-red-600">
              *
            </span>
          </label>

          <textarea
            value={
              reopenReason
            }
            onChange={(e) =>
              setReopenReason(
                e.target.value
              )
            }
            rows={5}
            maxLength={1000}
            placeholder="Enter the reason for reopening the selected lead(s)..."
            disabled={
              submitting
            }
            className="
              w-full
              rounded-lg
              border
              border-gray-300
              px-3
              py-2
              text-sm
              resize-none
              focus:outline-none
              focus:ring-2
              focus:ring-amber-400
              focus:border-amber-400
              disabled:bg-gray-50
              disabled:text-gray-400
            "
            autoFocus
          />

          <div
            className="
              mt-1
              text-right
              text-[11px]
              text-gray-400
            "
          >
            {reopenReason.length}
            /1000
          </div>

          {errorMessage && (
            <div
              className="
                mt-3
                rounded-lg
                bg-red-50
                border
                border-red-200
                px-3
                py-2
                text-xs
                text-red-600
              "
            >
              {errorMessage}
            </div>
          )}
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          className="
            px-5
            py-3
            border-t
            border-gray-100
            flex
            justify-end
            gap-2
          "
        >
          <button
            type="button"
            onClick={
              handleCancel
            }
            disabled={
              submitting
            }
            className="
              px-4
              py-2
              text-sm
              font-medium
              text-gray-700
              bg-white
              border
              border-gray-300
              rounded-lg
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              handleReopenSubmit
            }
            disabled={
              !reopenReason.trim() ||
              submitting
            }
            className="
              px-4
              py-2
              text-sm
              font-medium
              text-white
              bg-amber-600
              rounded-lg
              hover:bg-amber-700
              disabled:bg-gray-300
              disabled:cursor-not-allowed
            "
          >
            {submitting
              ? "Reopening..."
              : "Reopen"}
          </button>
        </div>
      </div>
    </div>
  );
}