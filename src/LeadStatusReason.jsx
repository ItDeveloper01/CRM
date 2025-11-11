import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import config from "./config";
import axios from "axios";
import { LeadObj } from "./Model/LeadModel";
import { useGetSessionUser } from "./SessionContext";


const LeadStatusReason = ({ isOpen, onClose, onSave,handleChange }) => {
  const [leadStatusReason, setLeadStatusReason] = useState([]);
  const[selectedReason,setSelectedReason] = useState([]);
  const { user: sessionUser } = useGetSessionUser();
  const getReasonListEndPoint = config.apiUrl + '/MasterData/GetReasonList';

  useEffect(() => {
    const fetchReasonList = async () => {
      try {
        const reason = await axios.get(getReasonListEndPoint, {
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
    };

    fetchReasonList();
  }, []);

  const handleSave = () => {
    debugger;
    handleChange({ target: { name: "leadStatusReason", value: selectedReason } });
    //handleChange({ target: { name: "notes", value: selectedRemarsk} });

    onClose();  

  };

  const  reasonCHange = (e) => {
    const selectedId = e.target.value;
    let tempReason = leadStatusReason.find(s => s.id == selectedId) || null;
    setSelectedReason(selectedId);
    console.log("Category Changed...", selectedReason);
  };


  if (!isOpen) return null; // don’t render if not open


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96 animate-fadeIn">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Please provide a reason
        </h2>

        <select name="leadStatusReason" 
         
         value={selectedReason}
          
          onChange={reasonCHange}

          className="border-2 border-gray-300 rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none mb-4">

          {/* //  className='border-highlight'> */}
          <option value="">Select Reason</option>
          {leadStatusReason.map((reason) => (
            <option key={reason.id} value={(reason.id)}>
              {reason.reasonName}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
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
