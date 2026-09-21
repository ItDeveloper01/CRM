
import React, { useState } from "react";
import { ChevronDown, Check, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContextState } from "./ContextContext";

const ContextSelector = () => {
 // const navigate = useNavigate();

const {
  availableContexts,
  currentContext,
  selectContext,
  navigateToValidMenu,
  contextLoading,
} = useContextState();

  const [isOpen, setIsOpen] = useState(false);

  // =========================================================
  // CONTEXT DISPLAY
  // =========================================================

  const getContextLabel = (context) => {
    if (!context) return "Select Context";

    const contextName =
      context.contextTypeName ||
      context.contextName ||
      "Context";

    const departmentName =
      context.departmentName || "";

    const verticalName =
      context.verticleName ||
      context.verticalName ||
      "";

    const parts = [
      contextName,
      departmentName,
      verticalName,
    ].filter(Boolean);

    return parts.join(" / ");
  };

  // =========================================================
  // SELECT CONTEXT
  // =========================================================

const handleContextChange = async (context) => {
  if (!context) return;

  try {
    setIsOpen(false);

    const menus = await selectContext(context);

    navigateToValidMenu(menus);

  } catch (error) {
    console.error(
      "Error switching context:",
      error
    );
  }
};
  // =========================================================
  // NO CONTEXT
  // =========================================================

  if (
    !availableContexts ||
    availableContexts.length === 0
  ) {
    return null;
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="relative px-2 pb-2">

      {/* -----------------------------------------------------
          Current Context
      ----------------------------------------------------- */}

      <button
        type="button"
        disabled={contextLoading}
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          flex w-full items-center
          rounded-md border border-gray-200
          bg-gray-50 px-2.5 py-2
          text-left
          transition
          hover:bg-gray-100
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >

        <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-gray-600 shadow-sm">
          <Briefcase size={15} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Workspace
          </div>

          <div className="truncate text-xs font-semibold text-gray-700">
            {contextLoading
              ? "Loading..."
              : getContextLabel(currentContext)}
          </div>
        </div>

        <ChevronDown
          size={15}
          className={`ml-1 shrink-0 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* -----------------------------------------------------
          Context Dropdown
      ----------------------------------------------------- */}

      {isOpen && (
        <div
          className="
            absolute left-2 right-2 top-full z-50
            mt-1 overflow-hidden
            rounded-md border border-gray-200
            bg-white shadow-lg
          "
        >

          <div className="border-b border-gray-100 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Switch Workspace
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto py-1">

            {availableContexts.map((context, index) => {

              const isSelected =
                currentContext &&
                currentContext.roleId ===
                  context.roleId &&
                currentContext.contextTypeId ===
                  context.contextTypeId &&
                (currentContext.departmentId ?? null) ===
                  (context.departmentId ?? null) &&
                (currentContext.verticleId ?? null) ===
                  (context.verticleId ?? null);

              return (
                <button
                  type="button"
                  key={
                    context.id ??
                    `${context.roleId}-${context.contextTypeId}-${context.departmentId}-${context.verticleId}-${index}`
                  }
                  onClick={() =>
                    handleContextChange(context)
                  }
                  className={`
                    flex w-full items-center
                    px-3 py-2
                    text-left
                    transition
                    ${
                      isSelected
                        ? "bg-gray-50"
                        : "hover:bg-gray-50"
                    }
                  `}
                >

                  <div className="min-w-0 flex-1">

                    <div
                      className={`
                        truncate text-xs font-medium
                        ${
                          isSelected
                            ? "text-gray-900"
                            : "text-gray-700"
                        }
                      `}
                    >
                      {context.contextTypeName ||
                        context.contextName ||
                        "Context"}
                    </div>

                    <div className="mt-0.5 truncate text-[11px] text-gray-400">
                      {[
                        context.departmentName,
                        context.verticleName ||
                          context.verticalName,
                      ]
                        .filter(Boolean)
                        .join(" / ") ||
                        "General Access"}
                    </div>

                  </div>

                  {isSelected && (
                    <Check
                      size={15}
                      className="ml-2 shrink-0 text-gray-600"
                    />
                  )}

                </button>
              );
            })}

          </div>
        </div>
      )}

    </div>
  );
};

export default ContextSelector;
