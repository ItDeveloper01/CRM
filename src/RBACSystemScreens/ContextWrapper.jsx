import React, {
  useEffect,
  useState,
} from "react";

import {
  useContextState,
} from "./ContextContext";

const ContextWrapper = () => {

  console.log(
    "🟢 [WRAPPER] ContextWrapper RENDER"
  );

  const {
    loadUserContexts,
    restoreContext,
    loadMenusForContext,
    navigateToValidMenu,
  } = useContextState();

  const [
    initializing,
    setInitializing,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // =========================================================
  // CONTEXT INITIALIZATION
  // =========================================================

  useEffect(() => {

    let isMounted = true;

    const initializeContext = async () => {

      console.log("");
      console.log(
        "=================================================="
      );
      console.log(
        "🚀 [WRAPPER] CONTEXT INITIALIZATION STARTED"
      );
      console.log(
        "=================================================="
      );

      try {

        setError("");

        // =====================================================
        // STEP 1
        // LOAD USER CONTEXTS
        // =====================================================

        console.log("");
        console.log(
          "1️⃣ [WRAPPER] CHECKING USER CONTEXTS"
        );

        console.log(
          "➡️ [WRAPPER] Calling loadUserContexts()..."
        );

        const contexts =
          await loadUserContexts();

        console.log(
          "✅ [WRAPPER] loadUserContexts() returned:",
          contexts
        );

        if (!isMounted) {
          console.log(
            "⛔ [WRAPPER] Component no longer mounted after context API"
          );

          return;
        }

        console.log(
          "🔢 [WRAPPER] Context count:",
          Array.isArray(contexts)
            ? contexts.length
            : 0
        );

        // =====================================================
        // NO CONTEXT
        // =====================================================

        if (
          !Array.isArray(contexts) ||
          contexts.length === 0
        ) {

          console.error(
            "❌ [WRAPPER] USER HAS NO CONTEXT"
          );

          setError(
            "No business context has been assigned to your account."
          );

          return;
        }

        // =====================================================
        // STEP 2
        // RESTORE / SELECT CONTEXT
        // =====================================================

        console.log("");
        console.log(
          "2️⃣ [WRAPPER] RESTORING CONTEXT"
        );

        const context =
          restoreContext(contexts);

        console.log(
          "🎯 [WRAPPER] Context selected:",
          context
        );

        if (!context) {

          console.error(
            "❌ [WRAPPER] Unable to determine context"
          );

          setError(
            "Unable to determine your business context."
          );

          return;
        }

        // =====================================================
        // STEP 3
        // LOAD MENUS FOR CONTEXT
        // =====================================================

        console.log("");
        console.log(
          "3️⃣ [WRAPPER] LOADING MENUS FOR CONTEXT"
        );

        console.log(
          "📤 [WRAPPER] Context sent to menu API:",
          context
        );

        const menus =
          await loadMenusForContext(
            context
          );

        console.log(
          "✅ [WRAPPER] Menu API returned:",
          menus
        );

        if (!isMounted) {

          console.log(
            "⛔ [WRAPPER] Component no longer mounted after menu API"
          );

          return;
        }

        // =====================================================
        // STEP 4
        // NAVIGATE TO FIRST MENU THAT HAS A REGISTERED PAGE
        // =====================================================

        navigateToValidMenu(menus);

      } catch (err) {

        console.error("");
        console.error(
          "=================================================="
        );
        console.error(
          "🔥 [WRAPPER] CONTEXT INITIALIZATION ERROR"
        );
        console.error(
          "=================================================="
        );

        console.error(
          "Error:",
          err
        );

        console.error(
          "Response:",
          err?.response?.data
        );

        console.error(
          "Status:",
          err?.response?.status
        );

        if (isMounted) {

          setError(
            "Unable to load your business context. Please try again."
          );
        }

      } finally {

        if (isMounted) {
          setInitializing(false);
        }

        console.log("");
        console.log(
          "🏁 [WRAPPER] CONTEXT INITIALIZATION FINISHED"
        );
      }
    };

    initializeContext();

    return () => {

      console.log(
        "🧹 [WRAPPER] ContextWrapper EFFECT CLEANUP"
      );

      isMounted = false;
    };

    // IMPORTANT:
    // This effect runs only when ContextWrapper starts.
    // Context switching is handled explicitly by ContextSelector.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================================================
  // ERROR SCREEN
  // =========================================================

  if (error) {

    return (
      <div className="flex min-h-screen items-center justify-center">

        <div className="text-center">

          <div className="mb-4 font-semibold text-red-600">
            {error}
          </div>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="
              rounded
              bg-blue-600
              px-4
              py-2
              text-white
              hover:bg-blue-700
            "
          >
            Retry
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (initializing) {

    return (
      <div className="flex min-h-screen items-center justify-center">

        <div className="text-gray-600">

          Loading your workspace...

        </div>

      </div>
    );
  }

  return null;
};

export default ContextWrapper;
