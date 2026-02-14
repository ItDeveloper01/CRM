// import React, { useState } from "react";
// import CloseIcon from "@mui/icons-material/Close";

// import {
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   Grid,
//   Divider,
//   Box,
//   Typography,
//   Alert,
//   Snackbar,
//   Autocomplete,
//   IconButton
// } from "@mui/material";

// export default function LeadTransferModal() {
//   const [open, setOpen] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [branch, setBranch] = useState("");
//   const [designation, setDesignation] = useState("");
//   const [user, setUser] = useState(null);
//   const selectedUserDesignation = user?.label?.match(/\(([^)]+)\)/)?.[1] || "";
//   const [reason, setReason] = useState("");

//   const branches = ["Mumbai", "Pune", "Nagpur"];
//   const designations = ["Manager", "Senior Executive", "Executive"];
//   const users = [
//     { label: "Amit Patil (Manager)", id: 1 },
//     { label: "Sneha Kulkarni (Executive)", id: 2 },
//     { label: "Rohit Deshmukh (Senior Executive)", id: 3 }
//   ];

//   const isSubmitDisabled = !branch || !designation || !user;

//   const fetchDesignationsByBranch = async (branchValue: string) => {
//     console.log("API CALL → fetchDesignationsByBranch", branchValue);
//   };

//   const fetchUsersByBranchAndDesignation = async (branchValue: string, designationValue: string) => {
//     console.log("API CALL → fetchUsersByBranchAndDesignation", branchValue, designationValue);
//   };

//   const submitLeadTransfer = async () => {
//     const payload = {
//       leadId: "LD-10234",
//       toBranch: branch,
//       toDesignation: designation,
//       toUserId: user?.id,
//       reason
//     };
//     console.log("API CALL → submitLeadTransfer", payload);
//   };

//   const handleSubmit = async () => {
//     await submitLeadTransfer();
//     setOpen(false);
//     setShowSuccess(true);
//   };

//   return (
//     <>
//       <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
//         Transfer Lead
//       </Button>

//       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
//         <DialogTitle sx={{ fontSize: "1.1rem", fontWeight: 600, color: "#1f2937", borderBottom: "1px solid #e5e7eb", backgroundColor: "#ffffff", pr: 5 }}>
//           Please provide transfer details
//           <IconButton aria-label="close" onClick={() => setOpen(false)} sx={{ position: "absolute", right: 8, top: 8, color: "#6b7280" }}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent sx={{ mt: 2, pt: 2 }}>
//           <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
//             Please ensure correct branch, designation and user before submitting.
//           </Alert>

//           {/* Lead Details */}
//           <Box sx={{ backgroundColor: "#f9fafb", p: 2, borderRadius: 2, mb: 3, border: "1px solid #e5e7eb" }}>
//             <Typography variant="subtitle2" color="text.secondary">Lead Details</Typography>
//             <Typography><strong>Lead ID:</strong> LD-10234</Typography>
//             <Typography><strong>Customer:</strong> Ramesh Kulkarni</Typography>
//             <Typography><strong>Current Owner:</strong> Anjali Patil</Typography>
//           </Box>

//           {/* Transfer Form */}
//           <Typography variant="subtitle2" color="text.secondary" gutterBottom>Transfer To</Typography>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 select
//                 fullWidth
//                 size="small"
//                 label="Branch"
//                 SelectProps={{ MenuProps: { PaperProps: { sx: { minWidth: 240 } } } }}
//                 value={branch}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   setBranch(value);
//                   setDesignation("");
//                   setUser(null);
//                   fetchDesignationsByBranch(value);
//                 }}
//               >
//                 {branches.map((b) => (<MenuItem key={b} value={b}>{b}</MenuItem>))}
//               </TextField>
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 select
//                 fullWidth
//                 size="small"
//                 label="Designation"
//                 disabled={!branch}
//                 SelectProps={{ MenuProps: { PaperProps: { sx: { minWidth: 240 } } } }}
//                 value={designation}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   setDesignation(value);
//                   setUser(null);
//                   fetchUsersByBranchAndDesignation(branch, value);
//                 }}
//               >
//                 {designations.map((d) => (<MenuItem key={d} value={d}>{d}</MenuItem>))}
//               </TextField>
//             </Grid>

//             <Grid item xs={12}>
//               <Autocomplete
//                 disabled={!branch || !designation}
//                 options={users}
//                 value={user}
//                 onChange={(e, val) => setUser(val)}
//                 renderInput={(params) => (
//                   <TextField {...params} label="Assign To User" size="small" fullWidth />
//                 )}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 label="Transfer Reason"
//                 size="small"
//                 placeholder="Enter reason for transferring this lead"
//                 multiline
//                 minRows={3}
//                 fullWidth
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//               />
//             </Grid>

//             {/* Selected User Details after Transfer Reason */}
//             <Grid item xs={12}>
//               <Box sx={{ backgroundColor: "#f1f5f9", border: "1px solid #e5e7eb", borderRadius: 2, p: 2, minHeight: 96, mt: 2 }}>
//                 <Typography variant="subtitle2" color="text.secondary" gutterBottom>Selected User Details</Typography>
//                 <Grid container spacing={1}>
//                   <Grid item xs={12}>
//                     <Typography variant="body2" color="text.secondary">Branch</Typography>
//                     <Typography fontWeight={600}>{branch || "—"}</Typography>
//                   </Grid>
//                   <Grid item xs={12}>
//                     <Typography variant="body2" color="text.secondary">Designation</Typography>
//                     <Typography fontWeight={600}>{selectedUserDesignation || "—"}</Typography>
//                   </Grid>
//                   <Grid item xs={12}>
//                     <Typography variant="body2" color="text.secondary">User</Typography>
//                     <Typography fontWeight={600}>{user?.label || "—"}</Typography>
//                   </Grid>
//                 </Grid>
//               </Box>
//             </Grid>
//           </Grid>
//         </DialogContent>

//         <Divider />
//         <DialogActions sx={{ p: 2, borderTop: "1px solid #e5e7eb" }}>
//           <Button onClick={() => setOpen(false)} sx={{ textTransform: "none" }}>Cancel</Button>
//           <Button
//             variant="contained"
//             sx={{ backgroundColor: "#2563eb", color: "#ffffff", textTransform: "none", "&:hover": { backgroundColor: "#1d4ed8" } }}
//             onClick={handleSubmit}
//             disabled={isSubmitDisabled}
//           >
//             Submit for Approval
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar open={showSuccess} autoHideDuration={3000} onClose={() => setShowSuccess(false)}>
//         <Alert severity="success" variant="filled">Lead transfer request submitted successfully!</Alert>
//       </Snackbar>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Divider,
  Box,
  Typography,
  Alert,
  Snackbar,
  Autocomplete,
  IconButton,
  Button
} from "@mui/material";
import { useGetSessionUser } from "./SessionContext";
import config from "./config";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";

export default function LeadTransferModal({
  isOpen,
  onClose,
  users = [],
  onTransfer,
  loadingUsers,
  selectedLead
}) {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [reason, setReason] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedLeadObject, setSelectedLeadObject ] = useState(null);
  const [branchesList, setBranchesList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [userList, setUserList] = useState([]);
  const fetchBranchDesignationApiURl = config.apiUrl + "/Reporting/GetBranchesDesignationsForLeadTransfer";
  const trasnferLeadApiUrl = config.apiUrl + "/TempLead/TransferLeadToSelectedUser";
  const { user: sessionUser } = useGetSessionUser();

  const selectedUserDesignation =
    selectedUser?.label?.match(/\(([^)]+)\)/)?.[1] || "";

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedBranch("");
      setSelectedDesignation("");
      setSelectedUser(null);
      setReason("");

      console.log("Selectd Lead in Modal:", selectedLead);

      setSelectedLeadObject(selectedLead);

      fetchBranchesandDesignations();


    }
  }, [isOpen]);

  const isSubmitDisabled = !selectedBranch || !selectedDesignation || !selectedUser;

const fetchBranchesandDesignations = async () => {
  // Simulate API calls to fetch branches and designations
  try
{

  console.log("API CALL → fetchBranches and Designations");

  const response = await axios.post(fetchBranchDesignationApiURl,
          {
          },
          {
            headers: {
              Authorization: `Bearer ${sessionUser.token}`,
                    "Content-Type": "application/json"
            }
          }
          );

          console.log("API RESPONSE → fetchBranches and Designations.", response.data);
          setBranchesList(response.data.branches);
          setDesignationList(response.data.roles);

        }catch(error){
          console.error("Error fetching branches and designations:", error);
        }
      };


      const selectedBranchChanged = (e) => {
        const value = e.target.value;
        setSelectedBranch(value);
        setSelectedUser(null);
      }

      const selectedDesignationChanged = (e) => {
        const value = e.target.value;
        setSelectedDesignation(value);
        setSelectedUser(null);
      }

const fetchUsersList = async (branchValue, designationValue) => {
  try {
    debugger;
    const payload = {
  branchId: selectedBranch,
  roleId: selectedDesignation,
  userId: sessionUser.user.Id,
  verticleName: selectedLeadObject?.categoryName || null
};
    console.log("API CALL → fetchUsersList", branchValue, designationValue);
    const response = await axios.post(config.apiUrl + "/Reporting/GetUsersForLeadTransfer",
      payload,
      {
        headers: {
          Authorization: `Bearer ${sessionUser.token}`,
          "Content-Type": "application/json"
        }
      }
    );  
    console.log("API RESPONSE → fetchUsersList", response.data);
    setUserList(response.data);
  } catch (error) {
    console.error("Error fetching users list:", error);
  }
};

useEffect(() => {
  if (selectedBranch && selectedDesignation) {
    fetchUsersList(selectedBranch, selectedDesignation);
  } else {
    setUserList([]);
  }
}, [selectedBranch, selectedDesignation]);


  const handleSubmit = async () => {
    await onTransfer({
      SelectedLead: selectedLeadObject,
      NewAssignedUserID:selectedUser?.userId || null,
      ReasonForTransfer: reason,
      RequestedBy_UserID: sessionUser.user.Id
    });

    trasnferLedToSelectedUser();
    debugger;
    onClose();
    setShowSuccess(true);
  };


  const trasnferLedToSelectedUser = async () => {
  // Simulate API calls to fetch branches and designations
  try
{
  debugger;

  console.log("API CALL → fTrasnfer LEad to selected user");
  
const transferPayload = {
  SelectedLead: selectedLeadObject,
  NewAssignedUserId: selectedUser?.userId || null,
  ReasonForTransfer: reason,
  RequestedBy_UserID: sessionUser.user.id
};

console.log("Payload for transferring lead to selected user:", transferPayload);

  const response = await axios.post(trasnferLeadApiUrl,
          transferPayload,
          {
            headers: {
              Authorization: `Bearer ${sessionUser.token}`,
                    "Content-Type": "application/json"
            }
          }
        );
          console.log("API RESPONSE → Lead  transferred to selected user completed. ", response.data);
          setBranchesList(response.data.branches);
          setDesignationList(response.data.roles);

      


        }catch(error){
          console.error("Error transferring lead to selected user:", error);
        }
      };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ pr: 5 }}>
          Please provide transfer details
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Please ensure correct details before submitting.
          </Alert>

          {/* Lead Details */}
          <Box sx={{ mb: 3, p: 2, border: "1px solid #e5e7eb", borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Lead Details
            </Typography>
            <Typography>
              <strong>Lead ID:</strong> {selectedLeadObject?.leadID || "—"}
            </Typography>
            <Typography>
              <strong>Customer:</strong> {selectedLeadObject?.fName + " " + selectedLeadObject?.lName || "—"}
            </Typography>
            <Typography>
              <strong>Current Owner:</strong>{" "}
              {selectedLeadObject?.assignedTo || "—"}
            </Typography>
            <Typography>
              <strong>Category:</strong>{" "}
              {selectedLeadObject?.categoryName || "—"}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                size="small"
                label="Branch"
                value={selectedBranch.id}
                onChange={selectedBranchChanged}
              >
                {branchesList.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.branchName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                size="small"
                label="Designation"
                disabled={!selectedBranch}
                value={selectedDesignation}
                onChange={selectedDesignationChanged}
              >
                {designationList.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.roleName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* <Grid item xs={12}>
              <Autocomplete
                loading={loadingUsers}
                disabled={!selectedBranch || !selectedDesignation}
                options={userList}
                value={selectedUser}
                onChange={(e, val) => setSelectedUser(val)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign To User"
                    size="small"
                  />
                )}
              />
            </Grid> */}
            <Grid item xs={12}>
  <Autocomplete
    loading={loadingUsers}
    disabled={!selectedBranch || !selectedDesignation}
    options={userList}
    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`} // display full name
    value={selectedUser}
    onChange={(e, val) => setSelectedUser(val)}
    isOptionEqualToValue={(option, value) => option.userId === value.userId} // important for selection
    renderInput={(params) => (
      <TextField
        {...params}
        label="Assign To User"
        size="small"
      />
    )}
  />
</Grid>

            <Grid item xs={12}>
              <TextField
                label="Transfer Reason"
                multiline
                minRows={3}
                fullWidth
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Grid>

            {/* Selected User Details */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  border: "1px solid #e5e7eb",
                  borderRadius: 2
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Selected User Details
                </Typography>
                <Typography>
                  <strong>Branch:</strong> {selectedBranch || "—"}
                </Typography>
                <Typography>
                  <strong>Designation:</strong>{" "}
                  {selectedDesignation || "—"}
                </Typography>
                <Typography>
                  <strong>User:</strong> {selectedUser?.firstName || "—"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            Submit for Approval
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" variant="filled">
          Lead transfer request submitted successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
