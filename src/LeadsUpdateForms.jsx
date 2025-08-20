// src/LeadsUpdateForm.jsx
import { useNavigate, useParams } from "react-router-dom";

export default function LeadsUpdateForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        {/* Back Button */}
        <button
          className="absolute top-3 left-3 text-gray-600 hover:text-gray-900"
          onClick={() => navigate(-1)}
        >
          ⬅ Back
        </button>

        <h2 className="text-xl font-bold text-center mb-6">
          Update Lead #{id}
        </h2>

        {/* Temporary Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Lead Name</label>
            <input
              type="text"
              className="mt-1 w-full border rounded-md p-2"
              placeholder="Enter lead name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select className="mt-1 w-full border rounded-md p-2">
              <option>Open</option>
              <option>Confirmed</option>
              <option>Lost</option>
              <option>Postponed</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => navigate(-1)}
            >
              Save & Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
