// import React from "react";
// import { MESSAGE_TYPES } from "./Constants";

// const MessageBox = ({ show, type = "INFO", message, onClose }) => {
//   if (!show) return null;

//   const { title, color } = MESSAGE_TYPES[type] || MESSAGE_TYPES.INFO;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
//         <h3 className="text-lg font-semibold mb-4">{title}</h3>
//         <p className="mb-4">{message}</p>
//         <button
//           onClick={onClose}
//           className={`${color} text-white px-4 py-2 rounded`}
//         >
//           OK
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MessageBox;

import React from "react";
import { MESSAGE_TYPES } from "./Constants";

const MessageBox = ({ show, type = "INFO", message, onClose }) => {
  if (!show) return null;

  const { icon, label, color } = MESSAGE_TYPES[type] || MESSAGE_TYPES.INFO;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
        <h3 className="flex items-center justify-center gap-2 text-lg font-semibold mb-4">
          <span className="text-3xl">{icon}</span> {/* bigger icon */}
          <span>{label}</span> {/* normal text */}
        </h3>
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className={`${color} text-white px-4 py-2 rounded`}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default MessageBox;


