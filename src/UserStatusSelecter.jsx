import { useState, useEffect } from "react";
import { AiOutlineWarning } from 'react-icons/ai';

export default function UserStatusSelector({ initialStatus = "Active", onChange, onUpdate, isUpdate = true }) {
  const [status, setStatus] = useState(initialStatus);
  const [confirmText, setConfirmText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [randomText, setRandomText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [alertMsg, setAlertMsg] = useState("Status change alert");
  const statuses = ["Active", "Inactive", "Suspended"];

  const pastelColors = {
    Active: "#66CC88",
    Inactive: "#FF8B94",
    Suspended: "#FFD54F"
  };

  const [successColor, setSuccessColor] = useState("");

  useEffect(() => {
    if (showConfirm) {
      const random = Math.random().toString(36).substring(2, 8);
      setRandomText(random);
      setErrorMsg("");
      setSuccessMsg("");
      setAlertMsg("Status change alert");
    }
  }, [showConfirm]);

  const handleChange = (e) => {
    setPendingStatus(e.target.value);
    setShowConfirm(true);
    setConfirmText("");
    setErrorMsg("");
    setSuccessMsg("");
    setAlertMsg("Status change alert");
  };

  const handleConfirm = () => {
    if (confirmText.trim() !== randomText) {
      setErrorMsg(`Incorrect text entered. Please try again.`);
      setAlertMsg(`Status change alert: Incorrect confirmation text.`);
      return;
    }

    const prevStatus = status;
    const newStatus = pendingStatus || status;
    setStatus(newStatus);
    if (onUpdate) onUpdate(newStatus);

    setConfirmText("");
    setPendingStatus(null);
    setErrorMsg("");
    setSuccessMsg(`Status changed from '${prevStatus}' to '${newStatus}'.`);
    setSuccessColor(pastelColors[newStatus]);
    setAlertMsg(`Status change alert: Status changed from '${prevStatus}' to '${newStatus}'.`);

    setTimeout(() => {
      setShowConfirm(false);
      setAlertMsg("");
    }, 1500);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPendingStatus(null);
    setConfirmText("");
    setErrorMsg("");
    setAlertMsg(`Status change alert: Status change cancelled.`);
  };

  const dotStyles = {
    boxShadow: '0 1px 2px rgba(0,0,0,0.2), inset 0 0.5px 1px rgba(255,255,255,0.4)'
  };

  return (
    <div className="flex flex-col space-y-2 relative">
      <div className="flex items-center space-x-2">
        <div className="relative w-48">
          {isUpdate ? (
            <select
              value={pendingStatus || status}
              onChange={handleChange}
              className="border rounded-lg pl-8 pr-3 py-2 bg-white focus:ring-2 focus:outline-none"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          ) : (
            <div className="border rounded-lg pl-8 pr-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed">
              {status}
            </div>
          )}

          <span
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{ backgroundColor: pastelColors[pendingStatus || status], ...dotStyles }}
          ></span>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 relative">
            {alertMsg && (
              <div className="flex items-center mb-4">
                <AiOutlineWarning className="text-yellow-500 w-8 h-8 mr-3" />
                <span className="text-black font-bold text-lg">{alertMsg}</span>
              </div>
            )}

            <p className="text-sm mb-2">Are you sure you want to change the status? Type the text below to confirm you are human:</p>
            <p className="font-mono bg-gray-200 px-2 py-1 rounded mb-2">{randomText}</p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="border rounded px-2 py-1 w-full mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleConfirm}
                className={`px-3 py-1 text-white rounded hover:brightness-90`} 
                style={{ backgroundColor: pastelColors[pendingStatus || status] }}
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}