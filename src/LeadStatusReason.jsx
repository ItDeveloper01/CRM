import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import config from "./config";
import axios from "axios";
import { LeadObj } from "./Model/LeadModel";
import { useGetSessionUser } from "./SessionContext";
import { ChartNoAxesColumnDecreasing } from "lucide-react";
import { validateBeforeSubmit } from "./validations";


const LeadStatusReason = ({ isOpen, onClose, onSave, handleChange, handleLostPosteponedRemarkChange, leadCategory, statusId }) => {
  const [leadStatusReason, setLeadStatusReason] = useState([]);
  // const[selectedReason,setSelectedReason] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedRemarks, setSelectedRemarks] = useState("");
  const { user: sessionUser } = useGetSessionUser();
  const getReasonListEndPoint = config.apiUrl + '/MasterData/GetReasonList';
  const [errors, setErrors] = useState({});
  const [followUpDate, setFollowUpDate] = useState("");

  //Commented on 20.03.2026
  // useEffect(() => {
  //   if (!isOpen || !statusId) return;
  //   const fetchReasonList = async () => {
  //     try {
  //       const reason = await axios.get(getReasonListEndPoint, {
  //         params: {
  //           StatusType: statusId, //  pass status id 3 or 4
  //         },
  //         headers: {
  //           Authorization: `Bearer ${sessionUser.token}`,
  //         },
  //       });
  //       debugger;
  //       console.log("Reason fetch Successfully", reason);
  //       debugger;
  //       setLeadStatusReason(reason.data || []);
  //     } catch (error) {
  //       console.error("Error fetching special requirements:", error);
  //     }
  //     console.log(" status type ", LeadObj.leadStatus);
  //   };



  //   fetchReasonList();
  // }, [isOpen, statusId]);

  useEffect(() => {
    if (!isOpen || !statusId) return;

    const fetchReasonList = async () => {
      try {
        const reason = await axios.get(getReasonListEndPoint, {
          params: {
            StatusType: statusId,
          },
          headers: {
            Authorization: `Bearer ${sessionUser.token}`,
          },
        });

        console.log("Reason fetch Successfully", reason);

        setLeadStatusReason(reason.data || []);
      } catch (error) {
        console.error("Error fetching special requirements:", error);
      }
    };

    fetchReasonList();

    // FOLLOW-UP AUTO SET (ONLY POSTPONED)
    if (statusId == 3) { // Postponed
      const today = new Date();
      today.setMonth(today.getMonth() + 1);

      const formattedDate = today.toISOString().split("T")[0];
      setFollowUpDate(formattedDate);
    } else {
      //  reset if not postponed
      setFollowUpDate("");
    }

  }, [isOpen, statusId]);

  console.log("STATUS ID RECEIVED:", statusId);


  // comment on 18.03.2026
  // const handleSave = () => {
  //   debugger;

  //   //  Validate selectedReason directly
  // const reasonError = validateBeforeSubmit(selectedReason, "Reason");

  // if (reasonError) {
  //   setErrors({ reason: reasonError });
  //   return; // STOP — don't continue
  // }

  // // Clear errors
  // setErrors({});


  //   handleChange({ target: { name: "leadStatusReason", value: selectedReason } });
  //   //  handleChange({ target: { name: "notes", value: selectedRemarks } });
  //   handleLostPosteponedRemarkChange(
  //     { target: { name: "notes", value: selectedRemarks } }
  //     // leadCategory
  //   );


  //   onClose();

  // };


  //Commented on 20.03.2026
  //   const handleSave = () => {
  //   const reasonError = validateBeforeSubmit(selectedReason, "Reason");

  //   if (reasonError) {
  //     setErrors({ reason: reasonError });
  //     return;
  //   }

  //   setErrors({});

  //   //  parent ko data bhejo
  //   onSave({
  //     reason: selectedReason,
  //     remark: selectedRemarks,
  //   });

  //   //  reset modal state
  //   setSelectedReason("");
  //   setSelectedRemarks("");
  // };

  const handleSave = () => {
    const reasonError = validateBeforeSubmit(selectedReason, "Reason");

    if (reasonError) {
      setErrors({ reason: reasonError });
      return;
    }

    //ONLY for Postponed
    if (statusId == 3) {
      if (!followUpDate) {
        setErrors({ followUpDate: "Follow-up date is required" });
        return;
      }

      const selected = new Date(followUpDate);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (selected < tomorrow) {
        setErrors({ followUpDate: "Date must be tomorrow or later" });
        return;
      }
    }
    setErrors({});

    onSave({
      reason: selectedReason,
      remark: selectedRemarks,
      followUpDate: followUpDate,
    });

    // reset
    setSelectedReason("");
    setSelectedRemarks("");
    setFollowUpDate("");
  };

  const reasonCHange = (e) => {
    const selectedId = e.target.value;
    let tempReason = leadStatusReason.find(s => s.id == selectedId) || null;
    setSelectedReason(selectedId);
    console.log("Category Changed...", selectedReason);
    // const selectedRemarks = e.target.value;
    // setSelectedRemarks(selectedRemarks);
    // console.log("Category Changed...", selectedRemarks);


  };

  // handlchange for notes in lead model 
  const handleRemarkChange = (e) => {
    const selectedRemarks = e.target.value;
    setSelectedRemarks(selectedRemarks);
    console.log("Category Changed...", selectedRemarks);

  };

  const handleCancel = () => {
    setSelectedReason("");
    setSelectedRemarks("");
    setErrors({});

    onClose(); // parent ko bol do close kare
  };
  // console.log("Reason:", selectedReason);
  if (!isOpen) return null; // don’t render if not open


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96 animate-fadeIn">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Please provide a reason
          <span className="text-red-500 text-lg leading-none"> *</span>
        </h2>

        <select name="leadStatusReason"

          value={selectedReason}

          onChange={reasonCHange}

          className="w-full rounded-lg p-2 h-10 focus:outline-none focus:ring-2 bg-white border border-gray-300 mb-2">

          {/* //  className='border-highlight'> */}
          <option value="">Select Reason</option>
          {leadStatusReason.map((reason) => (
            <option key={reason.id} value={(reason.id)}>
              {reason.reasonName}
            </option>
          ))}
        </select>
        {errors.reason && <p className="text-red-500 text-sm">{errors.reason}</p>}

        <label className="label-style">Remark</label>
        <input
          type="text"
          name="notes"
          value={selectedRemarks}
          placeholder="Remark "
          className="w-full rounded-lg p-2 h-10 focus:outline-none focus:ring-2 bg-white border border-gray-300 mb-2"
          onChange={handleRemarkChange}
        />

        {statusId == 3 && (
          <>
            <label className="label-style">
              Follow up Date <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)} //  editable
              min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} //  tomorrow onward
              className="w-full rounded-lg p-2 h-10 focus:outline-none focus:ring-2 bg-white border border-gray-300 mb-2"
            />

            {errors.followUpDate && (
              <p className="text-red-500 text-sm mb-2">
                {errors.followUpDate}
              </p>
            )}
          </>
        )}
        <div className="flex justify-end gap-2">
          <button
            // onClick={onClose}
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadStatusReason;
