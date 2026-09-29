import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import config from "../config";
import { useGetSessionUser } from "../SessionContext";
import { useNavigate } from "react-router-dom";

const ContextContext = createContext(null);

export const ContextProvider = ({ children }) => {
  console.log("==================================================");
  console.log("🔥 [CONTEXT] ContextProvider RENDER");
  console.log("==================================================");

  const navigate = useNavigate();

  const { setMenu } = useGetSessionUser();

  // =========================================================
  // Keep latest setMenu without recreating callbacks
  // =========================================================

  const setMenuRef = useRef(setMenu);

  useEffect(() => {
    setMenuRef.current = setMenu;
  }, [setMenu]);

  // =========================================================
  // Provider lifecycle
  // =========================================================

  useEffect(() => {
    console.log("🔥 [CONTEXT] ContextProvider MOUNTED");

    return () => {
      console.log("💥 [CONTEXT] ContextProvider UNMOUNTED");
    };
  }, []);

  // =========================================================
  // STATE
  // =========================================================

  const [availableContexts, setAvailableContexts] = useState([]);
  const [currentContext, setCurrentContext] = useState(null);
  const [contextLoading, setContextLoading] = useState(false);

  // =========================================================
  // 1. LOAD USER CONTEXTS
  // =========================================================

  const loadUserContexts = useCallback(async () => {
    console.log("");
    console.log("--------------------------------------------------");
    console.log("📥 [CONTEXT-1] loadUserContexts START");
    console.log("--------------------------------------------------");

    try {
      setContextLoading(true);

      const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser") || "{}"
      );

      console.log(
        "📦 [CONTEXT-1] loggedInUser:",
        loggedInUser
      );

      const token = loggedInUser?.token;
      const userId = loggedInUser?.user?.userId;

      console.log(
        "👤 [CONTEXT-1] UserId:",
        userId
      );

      if (!userId) {
        console.error(
          "❌ [CONTEXT-1] UserId NOT FOUND in loggedInUser"
        );

        throw new Error(
          "Logged-in user ID not found."
        );
      }

      const url =
        config.apiUrl +
        "/UserContext/GetUserContextMappings";

      console.log(
        "🌐 [CONTEXT-1] Calling API:",
        url
      );

      console.log(
        "📤 [CONTEXT-1] Query Params:",
        {
          userId,
        }
      );

      const response = await axios.get(
        url,
        {
          params: {
            userId,
          },

          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      console.log(
        "📥 [CONTEXT-1] API Response:",
        response
      );

      const contexts = Array.isArray(response?.data)
        ? response.data
        : [];

      console.log(
        "📋 [CONTEXT-1] Contexts returned:",
        contexts
      );

      console.log(
        "🔢 [CONTEXT-1] Context count:",
        contexts.length
      );

      contexts.forEach((context, index) => {
        console.log(
          `   Context ${index + 1}:`,
          context
        );
      });

      setAvailableContexts(contexts);

      console.log(
        "✅ [CONTEXT-1] availableContexts UPDATED"
      );

      return contexts;

    } catch (error) {
      console.error(
        "❌ [CONTEXT-1] loadUserContexts ERROR:",
        error
      );

      console.error(
        "❌ [CONTEXT-1] Error Response:",
        error?.response?.data
      );

      setAvailableContexts([]);

      throw error;

    } finally {
      setContextLoading(false);

      console.log(
        "🏁 [CONTEXT-1] loadUserContexts FINISHED"
      );
    }
  }, []);

  // =========================================================
  // 2. LOAD MENUS FOR SELECTED CONTEXT
  // =========================================================

  const loadMenusForContext = useCallback(
    async (context) => {
      console.log("");
      console.log("--------------------------------------------------");
      console.log("📋 [CONTEXT-2] loadMenusForContext START");
      console.log("--------------------------------------------------");

      if (!context) {
        console.error(
          "❌ [CONTEXT-2] Context is NULL/undefined"
        );

        setMenuRef.current?.([]);

        localStorage.setItem(
          "menu",
          JSON.stringify([])
        );

        return [];
      }

      console.log(
        "🎯 [CONTEXT-2] Selected Context:",
        context
      );

      try {
        setContextLoading(true);

        const loggedInUser = JSON.parse(
          localStorage.getItem("loggedInUser") || "{}"
        );

        const token = loggedInUser?.token;

        // -----------------------------------------------------
        // Build API request
        // -----------------------------------------------------

        const request = {
          roleId: context.roleId,

          contextTypeId:
            context.contextTypeId,

          departmentId:
            context.departmentId ?? null,

          verticleId:
            context.verticleId ?? null,
        };

        console.log(
          "📤 [CONTEXT-2] GetMenusForContext REQUEST:",
          request
        );

        const url =
          config.apiUrl +
          "/RolePermission/GetMenusForContext";

        console.log(
          "🌐 [CONTEXT-2] Calling API:",
          url
        );

        // -----------------------------------------------------
        // API call
        // -----------------------------------------------------

        const response = await axios.post(
          url,
          request,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          }
        );

        console.log(
          "📥 [CONTEXT-2] RAW API RESPONSE:",
          response?.data
        );

        // -----------------------------------------------------
        // Normalize API response
        // -----------------------------------------------------

        const responseData = response?.data;

        let menus = [];

        if (Array.isArray(responseData)) {
          menus = responseData;

          console.log(
            "📌 [CONTEXT-2] Response format: ARRAY"
          );

        } else if (
          Array.isArray(responseData?.data)
        ) {
          menus = responseData.data;

          console.log(
            "📌 [CONTEXT-2] Response format: data[]"
          );

        } else if (
          Array.isArray(responseData?.menus)
        ) {
          menus = responseData.menus;

          console.log(
            "📌 [CONTEXT-2] Response format: menus[]"
          );

        } else if (
          Array.isArray(responseData?.menu)
        ) {
          menus = responseData.menu;

          console.log(
            "📌 [CONTEXT-2] Response format: menu[]"
          );

        } else if (
          Array.isArray(responseData?.result)
        ) {
          menus = responseData.result;

          console.log(
            "📌 [CONTEXT-2] Response format: result[]"
          );

        } else {
          console.warn(
            "⚠️ [CONTEXT-2] Unknown API response format:",
            responseData
          );
        }

        // -----------------------------------------------------
        // Keep only valid menu objects
        // -----------------------------------------------------

        menus = menus.filter(
          (menu) =>
            menu &&
            typeof menu === "object"
        );

        console.log(
          "📋 [CONTEXT-2] NORMALIZED MENUS:",
          menus
        );

        console.log(
          "🔢 [CONTEXT-2] Menu count:",
          menus.length
        );

        menus.forEach((menu, index) => {
          console.log(
            `   Menu ${index + 1}:`,
            {
              id: menu.id ?? menu.Id,
              name:
                menu.menuName ??
                menu.MenuName,
              route:
                menu.route ??
                menu.Route,
              parent:
                menu.parent_MenuID ??
                menu.Parent_MenuID,
            }
          );
        });

        // -----------------------------------------------------
        // IMPORTANT:
        // Update SessionContext menu
        // Sidebar receives menu from SessionContext
        // -----------------------------------------------------

        console.log(
          "🔄 [CONTEXT-2] Updating SessionContext menu..."
        );

        if (setMenuRef.current) {
          setMenuRef.current(menus);

          console.log(
            "✅ [CONTEXT-2] SessionContext menu UPDATED"
          );
        } else {
          console.error(
            "❌ [CONTEXT-2] setMenuRef is unavailable"
          );
        }

        // -----------------------------------------------------
        // Save menu locally
        // -----------------------------------------------------

        localStorage.setItem(
          "menu",
          JSON.stringify(menus)
        );

        console.log(
          "💾 [CONTEXT-2] Menu saved to localStorage"
        );

        console.log(
          "✅ [CONTEXT-2] loadMenusForContext COMPLETE"
        );

        return menus;

      } catch (error) {
        console.error(
          "❌ [CONTEXT-2] loadMenusForContext ERROR:",
          error
        );

        console.error(
          "❌ [CONTEXT-2] Error Response:",
          error?.response?.data
        );

        if (setMenuRef.current) {
          setMenuRef.current([]);
        }

        localStorage.setItem(
          "menu",
          JSON.stringify([])
        );

        throw error;

      } finally {
        setContextLoading(false);

        console.log(
          "🏁 [CONTEXT-2] loadMenusForContext FINISHED"
        );
      }
    },
    []
  );

  // =========================================================
  // 3. SELECT / SWITCH CONTEXT
  // =========================================================

  const selectContext = useCallback(
    async (context) => {
      console.log("");
      console.log("--------------------------------------------------");
      console.log("🔄 [CONTEXT-3] selectContext START");
      console.log("--------------------------------------------------");

      if (!context) {
        console.error(
          "❌ [CONTEXT-3] Cannot select empty context"
        );

        return [];
      }

      console.log(
        "🎯 [CONTEXT-3] Context selected:",
        context
      );

      setCurrentContext(context);

      localStorage.setItem(
        "currentContext",
        JSON.stringify(context)
      );

      console.log(
        "💾 [CONTEXT-3] currentContext saved"
      );

      const menus =
        await loadMenusForContext(context);

      console.log(
        "📋 [CONTEXT-3] Menus loaded after context switch:",
        menus
      );

      console.log(
        "✅ [CONTEXT-3] selectContext COMPLETE"
      );

      return menus;
    },
    [loadMenusForContext]
  );

  // =========================================================
  // 4. RESTORE SAVED CONTEXT
  // =========================================================

  const restoreContext = useCallback(
    (contexts) => {
      console.log("");
      console.log("--------------------------------------------------");
      console.log("🔎 [CONTEXT-4] restoreContext START");
      console.log("--------------------------------------------------");

      if (
        !Array.isArray(contexts) ||
        contexts.length === 0
      ) {
        console.warn(
          "⚠️ [CONTEXT-4] No contexts available"
        );

        setCurrentContext(null);

        return null;
      }

      console.log(
        "📋 [CONTEXT-4] Available contexts:",
        contexts
      );

      let savedContext = null;

      try {
        savedContext = JSON.parse(
          localStorage.getItem(
            "currentContext"
          ) || "null"
        );

        console.log(
          "💾 [CONTEXT-4] Saved context:",
          savedContext
        );

      } catch (error) {
        console.warn(
          "⚠️ [CONTEXT-4] Invalid saved context"
        );
      }

      // -------------------------------------------------------
      // Try saved context
      // -------------------------------------------------------

      if (savedContext) {
        const matchedContext =
          contexts.find(
            (context) =>
              context.userId ===
                savedContext.userId &&

              context.roleId ===
                savedContext.roleId &&

              context.contextTypeId ===
                savedContext.contextTypeId &&

              (context.departmentId ?? null) ===
                (savedContext.departmentId ?? null) &&

              (context.verticleId ?? null) ===
                (savedContext.verticleId ?? null)
          );

        if (matchedContext) {
          console.log(
            "✅ [CONTEXT-4] Saved context MATCHED:",
            matchedContext
          );

          setCurrentContext(
            matchedContext
          );

          return matchedContext;
        }

        console.log(
          "⚠️ [CONTEXT-4] Saved context no longer exists"
        );
      }

      // -------------------------------------------------------
      // Default context
      // -------------------------------------------------------

      const defaultContext =
        contexts.find(
          (context) =>
            context.isDefaultView === true
        ) || contexts[0];

      console.log(
        "⭐ [CONTEXT-4] Default context selected:",
        defaultContext
      );

      setCurrentContext(
        defaultContext
      );

      localStorage.setItem(
        "currentContext",
        JSON.stringify(
          defaultContext
        )
      );

      console.log(
        "💾 [CONTEXT-4] Default context saved"
      );

      return defaultContext;
    },
    []
  );

  // =========================================================
  // 5. NAVIGATE TO FIRST VALID MENU
  // =========================================================

  const navigateToValidMenu = useCallback(
    (menus) => {
      console.log("");
      console.log("--------------------------------------------------");
      console.log("🚦 [CONTEXT-5] navigateToValidMenu");
      console.log("--------------------------------------------------");

      console.log(
        "📋 [CONTEXT-5] Menus received:",
        menus
      );

      if (
        !Array.isArray(menus) ||
        menus.length === 0
      ) {
        console.warn(
          "⚠️ [CONTEXT-5] No menus available"
        );

        console.log(
          "➡️ [CONTEXT-5] Navigating to /access-denied"
        );

        navigate(
          "/access-denied",
          { replace: true }
        );

        return;
      }

      // -------------------------------------------------------
      // IMPORTANT:
      // First menu WITH a valid route wins.
      // Dashboard has NO special priority.
      // -------------------------------------------------------

      let firstValidMenu = null;

      for (const menu of menus) {
        const route =
          menu?.route ??
          menu?.Route;

        if (
          typeof route === "string" &&
          route.trim() !== ""
        ) {
          firstValidMenu = {
            menu,
            route: route.trim(),
          };

          break;
        }
      }

      console.log(
        "🎯 [CONTEXT-5] First valid menu:",
        firstValidMenu
      );

      if (firstValidMenu) {
        console.log(
          "➡️ [CONTEXT-5] Navigating to:",
          firstValidMenu.route
        );

        navigate(
          firstValidMenu.route,
          { replace: true }
        );

        return;
      }

      console.warn(
        "⚠️ [CONTEXT-5] Menus exist but none has a valid route"
      );

      console.log(
        "➡️ [CONTEXT-5] Navigating to /access-denied"
      );

      navigate(
        "/access-denied",
        { replace: true }
      );
    },
    [navigate]
  );

  // =========================================================
  // CONTEXT PROVIDER VALUE
  // =========================================================

  const value = {
    availableContexts,
    currentContext,
    contextLoading,

    loadUserContexts,
    loadMenusForContext,

    selectContext,
    restoreContext,

    navigateToValidMenu,

    setCurrentContext,
  };

  return (
    <ContextContext.Provider value={value}>
      {children}
    </ContextContext.Provider>
  );
};

// =============================================================
// HOOK
// =============================================================

export const useContextState = () => {
  const context =
    useContext(ContextContext);

  if (!context) {
    throw new Error(
      "useContextState must be used inside ContextProvider"
    );
  }

  return context;
};

export default ContextContext;