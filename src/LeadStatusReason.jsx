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

  useEffect(() => {
    if (!isOpen || !statusId) return;
    const fetchReasonList = async () => {
      try {
        const reason = await axios.get(getReasonListEndPoint, {
          params: {
            StatusType: statusId, //  pass status id 3 or 4
          },
          headers: {
            Authorization: `Bearer ${sessionUser.token}`,
          },
        });
        debugger;
        console.log("Reason fetch Successfully", reason);
        debugger;
        setLeadStatusReason(reason.data || []);
      } catch (error) {
        console.error("Error fetching special requirements:", error);
      }
      console.log(" status type ", LeadObj.leadStatus);
    };



    fetchReasonList();
  }, [isOpen, statusId]);

  console.log("STATUS ID RECEIVED:", statusId);

  const handleSave = () => {
    debugger;

    //  Validate selectedReason directly
  const reasonError = validateBeforeSubmit(selectedReason, "Reason");

  if (reasonError) {
    setErrors({ reason: reasonError });
    return; // STOP — don't continue
  }

  // Clear errors
  setErrors({});
    

    handleChange({ target: { name: "leadStatusReason", value: selectedReason } });
    //  handleChange({ target: { name: "notes", value: selectedRemarks } });
    handleLostPosteponedRemarkChange(
      { target: { name: "notes", value: selectedRemarks } }
      // leadCategory
    );

   
    onClose();

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

          className="border-2 border-gray-300 rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none mb-1">

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
          className="border-2 border-gray-300 rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none mb-4"
          onChange={handleRemarkChange}
        />


        <div className="flex justify-end gap-2">
          {/* <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button> */}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadStatusReason;
