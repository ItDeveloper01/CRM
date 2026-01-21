import React from "react";
import { X } from "lucide-react";
import Leadgeneration from "./LeadsGeneration"; // your existing form component

export default function UpdateLeadsModal({ isOpen, onClose, lead, mode }) {
  if (!isOpen || !lead) return null;
  // if (!isOpen || (mode !== "create" && !lead)) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-11/12 md:w-5/6 lg:w-3/4 xl:w-2/3 rounded-2xl shadow-lg relative max-h-[90vh] flex flex-col">
        {/* Header */}
        {/* <div className="flex justify-between items-center border-b px-4 py-2 flex-shrink-0"> */}
        <div className="flex items-center border-b px-4 py-2 flex-shrink-0 relative">
          {/* <h2 className="font-semibold"> */}
           <h2 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-blue-600">
            {mode === "view"
              ? "View Lead Form"
              : mode === "edit"
              ? "Update Lead Form"
              : "Lead Generation Form"}
          </h2>
          <button
            onClick={onClose}
            className=" ml-auto p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (Lead Generation Form) */}
        <div className="p-4 overflow-y-auto flex-1 max-h-[calc(90vh-60px)]">
          <Leadgeneration lead={lead}  onClose={onClose}  mode={mode}       />
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">

  //     <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 rounded-2xl shadow-lg relative">
  //       {/* Header */}
  //       <div className="flex justify-between items-center border-b px-4 py-2">
  //         <button
  //           onClick={onClose}
  //           className="p-2 hover:bg-gray-100 rounded-full"
  //         >
  //           <X size={20} />
  //         </button>
  //       </div>

  //       {/* Body (Lead Generation Form) */}
  //       <div className="p-4 max-h-[80vh] overflow-y-auto">
  //         <Leadgeneration lead={lead} />
  //       </div>
  //     </div>
  //   </div>
  // );
}
