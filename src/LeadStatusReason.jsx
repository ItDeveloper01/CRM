import React from "react";

const LeadStatusReason = ({ isOpen, onClose, onSave }) => {
  const [reason, setReason] = React.useState("");

  if (!isOpen) return null; // don’t render if not open

  const handleSave = () => {
    if (reason.trim() === "") return;
    onSave(reason);
    setReason("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96 animate-fadeIn">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Please provide a reason
        </h2>

        <input
          type="text"
          placeholder="Enter reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border-2 border-gray-300 rounded-lg w-full px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none mb-4"
        />

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
