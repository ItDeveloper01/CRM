
import React, { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  TextField,
  Autocomplete,
  Button,
  CircularProgress,
} from "@mui/material";

import {
  ArrowRight,
  CheckCircle2,
  Users,
  UserRound,
  MessageSquareText,
  X,
  Send,
} from "lucide-react";

import axios from "axios";

import { useGetSessionUser } from "./SessionContext";
import config from "./config";

/* =========================================================
   FIELD STYLE
   ========================================================= */

const compactFieldSx = {
  width: "100%",

  "& .MuiInputBase-root": {
    fontSize: "13px",
    minHeight: "42px",
    borderRadius: "9px",
    backgroundColor: "#ffffff",
  },

  "& .MuiInputBase-input": {
    fontSize: "13px",
    padding: "8px 12px !important",
    minWidth: "0 !important",
    width: "100% !important",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  "& .MuiInputLabel-root": {
    fontSize: "13px",
  },

  "& .MuiInputLabel-shrink": {
    fontSize: "12px",
  },

  "& .MuiFormHelperText-root": {
    fontSize: "11px",
  },

  "& .MuiAutocomplete-inputRoot": {
    padding: "3px 38px 3px 9px !important",
    minHeight: "42px",
    width: "100%",
    boxSizing: "border-box",
  },

  "& .MuiAutocomplete-input": {
    minWidth: "0 !important",
    width: "100% !important",
    padding: "5px 4px !important",
  },

  "& .MuiAutocomplete-endAdornment": {
    right: "7px",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#cbd5e1",
  },

  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#94a3b8",
  },

  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#2563eb",
    borderWidth: "1.5px",
  },
};

/* =========================================================
   SECTION TITLE
   ========================================================= */

const SectionTitle = ({ icon: Icon, title, count }) => (
  <div className="mb-2 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Icon size={15} strokeWidth={2} />
      </div>

      <span className="text-[13px] font-semibold text-slate-700">
        {title}
      </span>
    </div>

    {count !== undefined && (
      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
        {count}
      </span>
    )}
  </div>
);

/* =========================================================
   SUMMARY LINE
   ========================================================= */

const SummaryLine = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-1.5 last:border-0">
    <span className="text-[11px] text-slate-500">{label}</span>

    <span
      className="max-w-[65%] truncate text-right text-[12px] font-semibold text-slate-700"
      title={value || ""}
    >
      {value || "-"}
    </span>
  </div>
);

/* =========================================================
   LEAD DETAIL
   ========================================================= */

const CompactLeadDetail = ({ label, value }) => (
  <div className="min-w-0">
    <div className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
      {label}
    </div>

    <div
      className="truncate text-[12px] font-semibold text-slate-700"
      title={value || ""}
    >
      {value || "-"}
    </div>
  </div>
);

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function LeadTransferModal({
  isOpen,
  onClose,
  users = [],
  onTransfer,
  loadingUsers,
  selectedLeads = [],
}) {
  /*
   * useGetSessionUser() returns:
   * {
   *   user: {...}
   * }
   */

  const { user: sessionUser } = useGetSessionUser();

  /* =======================================================
     STATE
     ======================================================= */

  const [branches, setBranches] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [reason, setReason] = useState("");

  const [userList, setUserList] = useState([]);

  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingDesignations, setLoadingDesignations] =
    useState(false);

  const [submitting, setSubmitting] = useState(false);

  /* =======================================================
     NORMALIZE SELECTED LEADS
     ======================================================= */

  /*
   * Transfer ALWAYS works with an array.
   *
   * Single lead:
   *
   * [
   *   {
   *     selectionKey: "HOL_12345678",
   *     lead: { ...DashboardRowDto }
   *   }
   * ]
   *
   * Bulk:
   *
   * [
   *   {
   *     selectionKey: "HOL_12345678",
   *     lead: { ...DashboardRowDto }
   *   },
   *   {
   *     selectionKey: "VIS_87654321",
   *     lead: { ...DashboardRowDto }
   *   }
   * ]
   *
   * IMPORTANT:
   * selectionKey remains outside DashboardRowDto.
   */

  const normalizedSelectedLeadEntries = useMemo(() => {
    if (!Array.isArray(selectedLeads)) {
      return [];
    }

    return selectedLeads.filter(
      (entry) =>
        entry?.selectionKey &&
        entry?.lead
    );
  }, [selectedLeads]);

  /* =======================================================
     ACTUAL LEAD OBJECTS
     ======================================================= */

  /*
   * Existing UI works with the actual DashboardRowDto objects.
   *
   * selectionKey is NOT added to these objects.
   */

  const normalizedSelectedLeads = useMemo(() => {
    return normalizedSelectedLeadEntries.map(
      (entry) => entry.lead
    );
  }, [normalizedSelectedLeadEntries]);

  /* =======================================================
     TRANSFER MODE
     ======================================================= */

  const isBulkTransfer =
    normalizedSelectedLeads.length > 1;

  /* =======================================================
     BRANCH / DESIGNATION HELPERS
     ======================================================= */

  const getBranchLabel = (option) =>
    option?.branchName ??
    option?.BranchName ??
    option?.branch ??
    option?.Branch ??
    option?.name ??
    option?.Name ??
    "";

  const getBranchId = (option) =>
    option?.branchId ??
    option?.BranchId ??
    option?.id ??
    option?.Id ??
    0;

  const getDesignationLabel = (option) =>
    option?.designationName ||
    option?.DesignationName ||
    option?.roleName ||
    option?.RoleName ||
    option?.designation ||
    option?.Designation ||
    option?.name ||
    option?.Name ||
    "";

  const getDesignationId = (option) =>
    option?.designationId ||
    option?.DesignationId ||
    option?.roleId ||
    option?.RoleId ||
    option?.id ||
    option?.Id ||
    0;

  const getUserLabel = (option) =>
    `${option?.firstName || ""} ${option?.lastName || ""
      }`.trim();

  /* =======================================================
     LEAD HELPERS
     ======================================================= */

  const getLeadName = (lead) => {
    if (!lead) return "-";

    const fName = lead?.fName || "";
    const lName = lead?.lName || "";

    const fullNameFromFNameLName =
      `${fName} ${lName}`.trim();

    const fullNameFromFirstLast =
      `${lead?.firstName || ""} ${lead?.lastName || ""
        }`.trim();

    return (
      lead?.leadName ||
      lead?.name ||
      lead?.customerName ||
      fullNameFromFNameLName ||
      fullNameFromFirstLast ||
      "-"
    );
  };

  const getCategoryName = (lead) =>
    lead?.categoryName ||
    lead?.category ||
    lead?.verticalName ||
    "-";

  const getAssignedUser = (lead) =>
    lead?.leadAssignedToName ||
    lead?.assignedUserName ||
    lead?.assignedTo ||
    lead?.leadAssignedTo ||
    "-";

  const getLeadId = (lead) =>
    lead?.categoryId
 ||
    lead?.leadId ||
    lead?.id ||
    "-";

  /* =======================================================
     FETCH BRANCHES + DESIGNATIONS
     ======================================================= */

  const fetchBranchesandDesignations = async () => {
    try {
      setLoadingBranches(true);
      setLoadingDesignations(true);

      const url =
        config.apiUrl +
        "/Reporting/GetBranchesDesignationsForLeadTransfer";

      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionUser.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setBranches(response.data?.branches || []);
      setDesignations(response.data?.roles || []);
    } catch (error) {
      console.error(
        "Error fetching branches and designations:",
        error
      );

      console.error(
        "API response:",
        error?.response?.data
      );

      setBranches([]);
      setDesignations([]);
    } finally {
      setLoadingBranches(false);
      setLoadingDesignations(false);
    }
  };

  /* =======================================================
     LOAD MASTER DATA WHEN MODAL OPENS
     ======================================================= */

  useEffect(() => {
    if (!isOpen || !sessionUser?.token) {
      return;
    }

    setSelectedBranch(null);
    setSelectedDesignation(null);
    setSelectedUser(null);

    setUserList([]);
    setReason("");
    setSubmitting(false);

    fetchBranchesandDesignations();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, sessionUser?.token]);

  /* =======================================================
     FETCH USERS FOR TRANSFER
     ======================================================= */

  /*
   * Backend contract:
   *
   * POST /Reporting/GetUsersForLeadTransfer
   *
   * {
   *   branchId,
   *   roleId,
   *   userId,
   *   verticleName,
   *   currentLeadOwnerUserId
   * }
   *
   * For multiple selected leads, the existing backend contract
   * uses the first lead only for determining the available
   * transfer users.
   *
   * IMPORTANT:
   * This does NOT affect the actual transfer payload.
   * Actual transfer still sends ALL selected leads.
   */

  const fetchUsersList = async (
    branchId,
    designationId
  ) => {
    if (!sessionUser?.token) return;

    if (!branchId || !designationId) {
      setUserList([]);
      return;
    }

    /*
     * Since transfer is always an array, use the first
     * selected lead only for the user lookup criteria.
     *
     * This is NOT a firstSelectedLead state/value.
     * It is simply the first element of the array for
     * the existing GetUsersForLeadTransfer API contract.
     */

    const leadForUserLookup =
      normalizedSelectedLeads[0] || null;

    try {
      const payload = {
        branchId: branchId,
        roleId: designationId,

        userId:
          sessionUser?.user?.Id || 0,

        verticleName:
          leadForUserLookup?.categoryName || null,

        currentLeadOwnerUserId:
          leadForUserLookup?.leadAssignedTo || null,
      };

      const response = await axios.post(
        config.apiUrl +
        "/Reporting/GetUsersForLeadTransfer",
        payload,
        {
          headers: {
            Authorization: `Bearer ${sessionUser.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUserList(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Error loading users for transfer:",
        error
      );

      console.error(
        "User API response:",
        error?.response?.data
      );

      setUserList([]);
    }
  };

  /* =======================================================
     BRANCH CHANGE
     ======================================================= */

  const handleBranchChange = (
    event,
    newValue
  ) => {
    setSelectedBranch(newValue);
    setSelectedDesignation(null);
    setSelectedUser(null);
    setUserList([]);
  };

  /* =======================================================
     DESIGNATION CHANGE
     ======================================================= */

  const handleDesignationChange = async (
    event,
    newValue
  ) => {
    setSelectedDesignation(newValue);
    setSelectedUser(null);
    setUserList([]);

    const branchId =
      getBranchId(selectedBranch);

    const designationId =
      getDesignationId(newValue);

    if (branchId && designationId) {
      await fetchUsersList(
        branchId,
        designationId
      );
    }
  };

  /* =======================================================
     TRANSFER
     ======================================================= */

  const handleTransfer = async () => {
    if (submitting) return;

    if (!selectedUser?.userId) {
      return;
    }

    if (
      normalizedSelectedLeadEntries.length === 0
    ) {
      return;
    }

    if (!sessionUser?.token) {
      return;
    }

    try {
      setSubmitting(true);

      /*
       * IMPORTANT:
       *
       * SelectedLeads is ALWAYS an array.
       *
       * Single lead:
       * [
       *   { selectionKey, lead }
       * ]
       *
       * Bulk:
       * [
       *   { selectionKey, lead },
       *   { selectionKey, lead }
       * ]
       */

      const payload = {
        SelectedLeads:
          normalizedSelectedLeadEntries,

        SelectedLead: null,

        NewAssignedUserID:
          selectedUser.userId,

        ReasonForTransfer:
          reason,

        RequestedBy_UserID:
          sessionUser?.user?.userId,

        OldAssignedUserID: "",
        NotificationType: "",
        Message: "",
        LeadId: 0,
      };

      console.log(
        "TRANSFER PAYLOAD:",
        payload
      );

      const response = await axios.post(
        config.apiUrl +
        "/TempLead/TransferLeadToSelectedUserService",
        payload,
        {
          headers: {
            Authorization: `Bearer ${sessionUser.token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      /* =====================================================
         RETURN SUCCESS TO PARENT
         ===================================================== */

      const transferredLeadIds =
        normalizedSelectedLeads
          .map(
            (lead) =>
              lead?.leadID ||
              lead?.leadId ||
              lead?.id
          )
          .filter(Boolean);


      console.log("Tranfer Result:", response);

      // if (onTransfer) {
      //   await onTransfer({
      //     leadIds:
      //       transferredLeadIds,

      //     response:
      //       response.data,
      //   });
      // }

      if (onTransfer) {
        await onTransfer(response.data);
      }

      onClose();
    } catch (error) {
      console.error(
        "Lead transfer failed:",
        error
      );

      console.error(
        "Transfer API response:",
        error?.response?.data
      );

      /*
       * Do NOT close modal on failure.
       * User can retry.
       */
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     CAN TRANSFER
     ======================================================= */

  const canTransfer =
    !submitting &&
    normalizedSelectedLeads.length > 0 &&
    !!selectedUser;

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <Dialog
      open={isOpen}
      onClose={
        submitting
          ? undefined
          : onClose
      }
      fullWidth
      maxWidth="lg"
      scroll="paper"
      PaperProps={{
        sx: {
          width: "100%",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow:
            "0 24px 70px rgba(15, 23, 42, 0.18)",

          margin: {
            xs: "8px",
            sm: "16px",
          },

          maxHeight:
            "calc(100vh - 32px)",

          "@media (max-height: 700px)": {
            maxHeight:
              "calc(100vh - 16px)",
          },

          "@media (max-width: 600px)": {
            maxHeight:
              "calc(100vh - 16px)",
            margin: "8px",
          },
        },
      }}
    >
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="shrink-0 border-b border-blue-100 bg-white px-5 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Send
                size={18}
                strokeWidth={2}
              />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-[16px] font-bold text-slate-800">
                Transfer Lead
                {isBulkTransfer
                  ? "s"
                  : ""}
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-500">
                {isBulkTransfer
                  ? `Transfer ${normalizedSelectedLeads.length} selected leads`
                  : "Transfer the selected lead to another user"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <DialogContent
        sx={{
          padding:
            "16px 20px !important",

          backgroundColor:
            "#f8fafc",

          overflowY: "auto",
          overflowX: "hidden",

          scrollbarWidth: "thin",

          "&::-webkit-scrollbar": {
            width: "6px",
          },

          "&::-webkit-scrollbar-thumb": {
            backgroundColor:
              "#cbd5e1",
            borderRadius: "10px",
          },

          "&::-webkit-scrollbar-track": {
            backgroundColor:
              "transparent",
          },

          "@media (max-width: 600px)": {
            padding:
              "12px !important",
          },
        }}
      >
        {/* ===================================================
            SELECTED LEADS
            =================================================== */}

        <div className="mb-3 rounded-xl border border-slate-200 bg-white p-3">
          <SectionTitle
            icon={Users}
            title={
              isBulkTransfer
                ? "Selected Leads"
                : "Selected Lead"
            }
            count={
              normalizedSelectedLeads.length
            }
          />

          {normalizedSelectedLeads.length ===
            0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-center text-[12px] text-slate-500">
              No lead selected.
            </div>
          ) : isBulkTransfer ? (
            <div
              className="max-h-[175px] overflow-y-auto overflow-x-hidden pr-1 scrollbar-thin"
              style={{
                scrollbarWidth: "thin",
              }}
            >
              <div className="flex flex-wrap gap-2">
                {normalizedSelectedLeads.map(
                  (lead, index) => (
                    <div
                      key={
                        normalizedSelectedLeadEntries[
                          index
                        ]?.selectionKey ||
                        `lead-${index}`
                      }
                      className="min-w-[230px] max-w-[320px] flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span
                          className="truncate text-[12px] font-bold text-slate-800"
                          title={getLeadName(
                            lead
                          )}
                        >
                          {getLeadName(
                            lead
                          )}
                        </span>

                        <span className="shrink-0 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                          #{getLeadId(lead)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-3">
                        <CompactLeadDetail
                          label="Category"
                          value={getCategoryName(
                            lead
                          )}
                        />

                        <CompactLeadDetail
                          label="Assigned To"
                          value={getAssignedUser(
                            lead
                          )}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 md:grid-cols-4">
              <CompactLeadDetail
                label="Lead"
                value={getLeadName(
                  normalizedSelectedLeads[0]
                )}
              />

              <CompactLeadDetail
                label="Lead ID"
                value={getLeadId(
                  normalizedSelectedLeads[0]
                )}
              />

              <CompactLeadDetail
                label="Category"
                value={getCategoryName(
                  normalizedSelectedLeads[0]
                )}
              />

              <CompactLeadDetail
                label="Assigned To"
                value={getAssignedUser(
                  normalizedSelectedLeads[0]
                )}
              />
            </div>
          )}
        </div>

        {/* ===================================================
            TRANSFER TO
            =================================================== */}

        <div className="mb-3 rounded-xl border border-slate-200 bg-white p-3">
          <SectionTitle
            icon={UserRound}
            title="Transfer To"
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {/* =================================================
                BRANCH
                ================================================= */}

            <div className="min-w-0">
              <Autocomplete
                fullWidth
                size="small"
                options={branches}
                value={selectedBranch}
                loading={loadingBranches}
                onChange={
                  handleBranchChange
                }
                getOptionLabel={
                  getBranchLabel
                }
                isOptionEqualToValue={(
                  option,
                  value
                ) =>
                  getBranchId(option) ===
                  getBranchId(value)
                }
                ListboxProps={{
                  style: {
                    maxHeight: 260,
                  },
                }}
                renderOption={(
                  props,
                  option
                ) => (
                  <li
                    {...props}
                    style={{
                      fontSize: "13px",
                      padding:
                        "9px 12px",
                      whiteSpace:
                        "normal",
                      lineHeight: 1.35,
                    }}
                  >
                    {getBranchLabel(
                      option
                    )}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Branch"
                    placeholder="Select branch"
                    sx={compactFieldSx}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingBranches && (
                            <CircularProgress
                              size={16}
                              sx={{
                                color:
                                  "#2563eb",
                              }}
                            />
                          )}

                          {
                            params
                              .InputProps
                              .endAdornment
                          }
                        </>
                      ),
                    }}
                  />
                )}
              />
            </div>

            {/* =================================================
                DESIGNATION
                ================================================= */}

            <div className="min-w-0">
              <Autocomplete
                fullWidth
                size="small"
                options={
                  designations
                }
                value={
                  selectedDesignation
                }
                loading={
                  loadingDesignations
                }
                disabled={
                  !selectedBranch
                }
                onChange={
                  handleDesignationChange
                }
                getOptionLabel={
                  getDesignationLabel
                }
                isOptionEqualToValue={(
                  option,
                  value
                ) =>
                  getDesignationId(
                    option
                  ) ===
                  getDesignationId(
                    value
                  )
                }
                ListboxProps={{
                  style: {
                    maxHeight: 260,
                  },
                }}
                renderOption={(
                  props,
                  option
                ) => (
                  <li
                    {...props}
                    style={{
                      fontSize: "13px",
                      padding:
                        "9px 12px",
                      whiteSpace:
                        "normal",
                      lineHeight: 1.35,
                    }}
                  >
                    {getDesignationLabel(
                      option
                    )}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Designation"
                    placeholder="Select designation"
                    sx={compactFieldSx}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingDesignations && (
                            <CircularProgress
                              size={16}
                              sx={{
                                color:
                                  "#2563eb",
                              }}
                            />
                          )}

                          {
                            params
                              .InputProps
                              .endAdornment
                          }
                        </>
                      ),
                    }}
                  />
                )}
              />
            </div>

            {/* =================================================
                USER
                ================================================= */}

            <div className="min-w-0">
              <Autocomplete
                fullWidth
                size="small"
                options={
                  userList || []
                }
                value={selectedUser}
                loading={
                  loadingUsers
                }
                disabled={
                  !selectedBranch ||
                  !selectedDesignation ||
                  loadingUsers
                }
                onChange={(
                  event,
                  newValue
                ) =>
                  setSelectedUser(
                    newValue
                  )
                }
                getOptionLabel={
                  getUserLabel
                }
                isOptionEqualToValue={(
                  option,
                  value
                ) =>
                  option?.userId ===
                  value?.userId
                }
                ListboxProps={{
                  style: {
                    maxHeight: 280,
                  },
                }}
                renderOption={(
                  props,
                  option
                ) => (
                  <li
                    {...props}
                    style={{
                      padding:
                        "8px 12px",
                      whiteSpace:
                        "normal",
                    }}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-semibold text-slate-700">
                        {getUserLabel(
                          option
                        )}
                      </div>

                      {(
                        option?.designationName ||
                        option?.branchName
                      ) && (
                          <div className="mt-0.5 truncate text-[11px] text-slate-400">
                            {[
                              option?.designationName,
                              option?.branchName,
                            ]
                              .filter(Boolean)
                              .join(
                                " • "
                              )}
                          </div>
                        )}
                    </div>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign To User"
                    placeholder="Select user"
                    sx={compactFieldSx}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingUsers && (
                            <CircularProgress
                              size={16}
                              sx={{
                                color:
                                  "#2563eb",
                              }}
                            />
                          )}

                          {
                            params
                              .InputProps
                              .endAdornment
                          }
                        </>
                      ),
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            REASON + SUMMARY
            =================================================== */}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
          <div className="rounded-xl border border-slate-200 bg-white p-3 md:col-span-4">
            <SectionTitle
              icon={MessageSquareText}
              title="Transfer Reason"
            />

            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={3}
              value={reason}
              onChange={(e) =>
                setReason(
                  e.target.value
                )
              }
              placeholder="Enter reason for transferring this lead..."
              sx={{
                ...compactFieldSx,

                "& .MuiInputBase-root":
                {
                  fontSize:
                    "13px",
                  borderRadius:
                    "9px",
                  alignItems:
                    "flex-start",
                },

                "& .MuiInputBase-input":
                {
                  lineHeight:
                    1.45,
                },
              }}
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 md:col-span-3">
            <SectionTitle
              icon={ArrowRight}
              title="Transfer Summary"
            />

            <SummaryLine
              label="Leads"
              value={`${normalizedSelectedLeads.length} selected`}
            />

            <SummaryLine
              label="Category"
              value={
                isBulkTransfer
                  ? "Multiple categories possible"
                  : getCategoryName(
                    normalizedSelectedLeads[0]
                  )
              }
            />

            <SummaryLine
              label="New Assignee"
              value={
                selectedUser
                  ? getUserLabel(
                    selectedUser
                  )
                  : "Not selected"
              }
            />
          </div>
        </div>
      </DialogContent>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <div className="shrink-0 flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-3">
        <div className="hidden min-w-0 items-center gap-2 sm:flex">
          {selectedUser ? (
            <>
              <CheckCircle2
                size={15}
                className="shrink-0 text-blue-500"
              />

              <span className="truncate text-[11px] text-slate-500">
                Ready to transfer to{" "}
                <span className="font-semibold text-slate-700">
                  {getUserLabel(
                    selectedUser
                  )}
                </span>
              </span>
            </>
          ) : (
            <>
              <Users
                size={15}
                className="shrink-0 text-slate-400"
              />

              <span className="text-[11px] text-slate-400">
                Select a user to continue
              </span>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* CANCEL */}

          <Button
            variant="outlined"
            onClick={onClose}
            disabled={submitting}
            startIcon={
              <X size={15} />
            }
            sx={{
              textTransform:
                "none",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              minHeight: "36px",
              px: 2,
              borderColor:
                "#cbd5e1",
              color: "#475569",

              "&:hover": {
                borderColor:
                  "#93c5fd",
                backgroundColor:
                  "#eff6ff",
              },
            }}
          >
            Cancel
          </Button>

          {/* TRANSFER */}

          <Button
            variant="contained"
            onClick={
              handleTransfer
            }
            disabled={
              !canTransfer
            }
            startIcon={
              submitting ? (
                <CircularProgress
                  size={15}
                  color="inherit"
                />
              ) : (
                <Send size={15} />
              )
            }
            sx={{
              textTransform:
                "none",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 700,
              minHeight: "36px",
              px: 2.2,
              backgroundColor:
                "#2563eb",

              "&:hover": {
                backgroundColor:
                  "#1d4ed8",
              },

              "&.Mui-disabled": {
                backgroundColor:
                  "#e2e8f0",
                color:
                  "#94a3b8",
              },
            }}
          >
            {submitting
              ? "Transferring..."
              : isBulkTransfer
                ? `Transfer ${normalizedSelectedLeads.length} Leads`
                : "Transfer Lead"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
