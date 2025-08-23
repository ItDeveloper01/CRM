import { useState } from "react";
import DemoLeadForm from "./demoLeadGeneration";

export default function LeadModal() {
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Save handler
  const handleSave = (leadData) => {
    console.log("Saved Lead:", leadData);
    // call API here if needed
    setOpen(false); // close modal after save
  };

  return (
    <div className="p-6">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        {selectedLead ? "Edit Lead" : "New Lead"}
      </button>

      {/* Modal (Dialog) */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* Modal Box */}
          <div className="bg-white rounded-xl shadow-lg max-w-5xl w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              {selectedLead ? "Edit Lead" : "New Lead"}
            </h2>

            {/* Lead Form inside Modal */}
            <DemoLeadForm
              lead={selectedLead || {}}
              onSubmit={handleSave}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
