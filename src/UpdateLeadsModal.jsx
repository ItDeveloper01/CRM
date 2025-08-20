import React from "react";

const LeadDetailsModal = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Lead Details</h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid gap-2">
          <p><strong>ID:</strong> {lead.leadID}</p>
          <p><strong>First Name:</strong> {lead.fName}</p>
          <p><strong>Last Name:</strong> {lead.lName}</p>
          <p><strong>Mobile:</strong> {lead.mobileNo}</p>
          <p><strong>Destination:</strong> {lead.destination}</p>
          <p><strong>Status:</strong> {lead.leadStatus}</p>
          <p><strong>Enquiry Date:</strong> {lead.enquiryDate}</p>
          {/* Add more fields as needed */}
        </div>

        {/* Modal Footer */}
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsModal;
