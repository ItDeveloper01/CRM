import React from "react";
import { MESSAGE_TYPES } from "./Constants";
import { MESSAGE_TYPES_DETAILS } from "./Constants";

const MessageBox = ({
  show,
  type,
  message,
  onClose,
  onConfirm,
  confirmMode = false,
}) => {
  const {
    icon,
    label,
    color,
    yesButtonColor,
    noButtonColor,
  } =
    MESSAGE_TYPES_DETAILS[type] ||
    MESSAGE_TYPES_DETAILS[
      MESSAGE_TYPES.INFO
    ];

  if (!show) return null;

  return (
    <div
      className="
        fixed
        inset-0
        flex
        items-center
        justify-center
        bg-black
        bg-opacity-50
        z-50
      "
    >
      <div
        className="
          bg-white
          p-6
          rounded-lg
          shadow-lg
          text-center
          max-w-md
          w-full
          mx-4
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <h3
          className="
            flex
            items-center
            justify-center
            gap-2
            text-lg
            font-semibold
            mb-4
          "
        >
          <span className="text-3xl">
            {icon}
          </span>

          <span>
            {label}
          </span>
        </h3>

        {/* ==================================================
            MESSAGE
        ================================================== */}

        <p
          className="
            mb-6
            whitespace-pre-line
            text-gray-700
          "
        >
          {message}
        </p>

        {/* ==================================================
            CONFIRMATION MODE
        ================================================== */}

        {confirmMode ? (
          <div
            className="
              flex
              justify-center
              gap-3
            "
          >
            {/* NO */}

            <button
              type="button"
              onClick={onClose}
              className={`
               ${noButtonColor}
                px-5
                py-2
                rounded
                bg-gray-500
                text-white
                hover:bg-gray-600
                transition
              `}
            >
              No
            </button>

            {/* YES */}

            <button
              type="button"
              onClick={onConfirm}
              className={`
                ${yesButtonColor}
                text-white
                px-5
                py-2
                rounded
                hover:opacity-90
                transition
              `}
            >
              Yes
            </button>
          </div>
        ) : (
          /* ==================================================
             NORMAL MESSAGE MODE
          ================================================== */

          <button
            type="button"
            onClick={onClose}
            className={`
              ${color}
              text-white
              px-5
              py-2
              rounded
              hover:opacity-90
              transition
            `}
          >
            OK
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageBox;