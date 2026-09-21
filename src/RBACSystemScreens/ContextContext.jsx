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

const KNOWN_APP_ROUTES = new Set(
  [
    "/dashboard",
    "/leads",
    "/newcustomer",
    "/leadsgeneration",
    "/leadsanalytics",
    "/teamstatistics/leadsanalytics",
    "/appreciation",
    "/teamstatistics/manageranalytics",
    "/teamstatistics/managerindividualanalytics",
    "/teamstatistics/manageranalyticboard",
    "/businessanalysis",
    "/mastersettings",
    "/operations/itinerarymanager",
    "/dashboardv2",
    "/rbac/rolemenumappings",
    "/users",
    "/smtpsettings",
    "/users/create",
    "/profiledisplay",
  ]
);

const normalizeRoute = (route) => {
  if (
    typeof route !== "string" ||
    !route.trim()
  ) {
    return null;
  }

  const trimmed = route.trim();
  const withSlash = trimmed.startsWith("/")
    ? trimmed
    : `/${trimmed}`;

  return withSlash.length > 1
    ? withSlash.replace(/\/+$/, "")
    : withSlash;
};

const normalizeNullableId = (value) => {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) &&
    numberValue > 0
    ? numberValue
    : null;
};

const isKnownRoute = (route) => {
  const normalizedRoute =
    normalizeRoute(route);

  return (
    !!normalizedRoute &&
    KNOWN_APP_ROUTES.has(
      normalizedRoute.toLowerCase()
    )
  );
};

export const ContextProvider = ({ children }) => {
  console.log("🔥 ContextProvider RENDER");

  const navigate = useNavigate();

  const { setMenu, user } = useGetSessionUser();

  const sessionUserId =
    user?.user?.userId ??
    user?.user?.id ??
    null;

  // =========================================================
  // Keep latest setMenu without making callbacks unstable
  // =========================================================

  const setMenuRef = useRef(setMenu);

  useEffect(() => {
    setMenuRef.current = setMenu;
  }, [setMenu]);

  // =========================================================
  // Provider lifecycle debugging
  // =========================================================

  useEffect(() => {
    console.log("🔥 ContextProvider MOUNTED");

    return () => {
      console.log("💥 ContextProvider UNMOUNTED");
    };
  }, []);

  // =========================================================
  // State
  // =========================================================

  const [availableContexts, setAvailableContexts] = useState([]);
  const [currentContext, setCurrentContext] = useState(null);
  const [contextLoading, setContextLoading] = useState(false);

  useEffect(() => {
    setAvailableContexts([]);
    setCurrentContext(null);

    if (!sessionUserId) {
      localStorage.removeItem("currentContext");
    }
  }, [sessionUserId]);

  // =========================================================
  // Load all contexts available to logged-in user
  // =========================================================

  const loadUserContexts = useCallback(async () => {
    console.log("📥 loadUserContexts START");

    try {
      setContextLoading(true);

      const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser") || "{}"
      );

      console.log("loggedInUser:", loggedInUser);

      const token = loggedInUser?.token;
      const userId =
        loggedInUser?.user?.userId ??
        loggedInUser?.user?.UserId;

      console.log("UserId:", userId);

      const response = await axios.get(
        config.apiUrl + "/UserContext/GetUserContextMappings",
        {
          params: {
            userId: userId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contexts = response.data || [];

      console.log("User Contexts:", contexts);

      setAvailableContexts(contexts);

      console.log(
        "📥 loadUserContexts COMPLETE"
      );

      return contexts;
    } catch (error) {
      console.error(
        "Error loading user contexts:",
        error
      );

      setAvailableContexts([]);

      throw error;
    } finally {
      setContextLoading(false);

      console.log(
        "📥 loadUserContexts FINALLY"
      );
    }
  }, []);

  // =========================================================
  // Load menus for a specific context
  // =========================================================

  const loadMenusForContext = useCallback(
    async (context) => {
      if (!context) {
        console.warn(
          "loadMenusForContext called without context."
        );

        localStorage.setItem(
          "menu",
          JSON.stringify([])
        );

        return [];
      }

      console.log(
        "📋 loadMenusForContext START:",
        context
      );

      try {
        setContextLoading(true);

        const loggedInUser = JSON.parse(
          localStorage.getItem("loggedInUser") || "{}"
        );

        const token = loggedInUser?.token;

        const request = {
          roleId: context.roleId,
          contextTypeId: context.contextTypeId,
          departmentId:
            normalizeNullableId(
              context.departmentId
            ),
          verticleId:
            normalizeNullableId(
              context.verticleId
            ),
        };

        console.log(
          "Loading menus for context:",
          request
        );

        const response = await axios.post(
          config.apiUrl +
            "/RolePermission/GetMenusForContext",
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
          "📋 GetMenusForContext RESPONSE:",
          response?.data
        );

        // =====================================================
        // Normalize response
        // =====================================================

        const responseData = response?.data;

        let menus = [];

        if (Array.isArray(responseData)) {
          menus = responseData;
        } else if (
          Array.isArray(responseData?.data)
        ) {
          menus = responseData.data;
        } else if (
          Array.isArray(responseData?.menus)
        ) {
          menus = responseData.menus;
        } else if (
          Array.isArray(responseData?.menu)
        ) {
          menus = responseData.menu;
        } else if (
          Array.isArray(responseData?.result)
        ) {
          menus = responseData.result;
        } else {
          console.warn(
            "Unexpected menu API response shape:",
            responseData
          );
        }

        // =====================================================
        // Keep valid menu objects
        // =====================================================

        menus = menus.filter(
          (menu) =>
            menu &&
            typeof menu === "object"
        );

        console.log(
          "Normalized context menus:",
          menus
        );

        // =====================================================
        // Update global menu
        //
        // IMPORTANT:
        // Use ref so changing SessionContext.setMenu
        // identity does not recreate this callback.
        // =====================================================

        if (setMenuRef.current) {
          setMenuRef.current(menus);
        }

        localStorage.setItem(
          "menu",
          JSON.stringify(menus)
        );

        console.log(
          "📋 loadMenusForContext COMPLETE"
        );

        return menus;
      } catch (error) {
        console.error(
          "Error loading menus for context:",
          error
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
          "📋 loadMenusForContext FINALLY"
        );
      }
    },
    []
  );

  // =========================================================
  // Select context
  // =========================================================

  const selectContext = useCallback(
    async (context) => {
      if (!context) {
        return [];
      }

      console.log(
        "Selecting context:",
        context
      );

      setCurrentContext(context);

      localStorage.setItem(
        "currentContext",
        JSON.stringify(context)
      );

      const menus =
        await loadMenusForContext(context);

      return menus;
    },
    [loadMenusForContext]
  );

  // =========================================================
  // Restore previously selected context
  // =========================================================

  const restoreContext = useCallback(
    (contexts) => {
      if (
        !contexts ||
        contexts.length === 0
      ) {
        setCurrentContext(null);
        return null;
      }

      let savedContext = null;

      try {
        savedContext = JSON.parse(
          localStorage.getItem(
            "currentContext"
          ) || "null"
        );
      } catch (error) {
        console.warn(
          "Invalid saved currentContext."
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
              context.userId ===
                sessionUserId &&
              context.roleId ===
                savedContext.roleId &&
              context.contextTypeId ===
                savedContext.contextTypeId &&
              normalizeNullableId(context.departmentId) ===
                normalizeNullableId(savedContext.departmentId) &&
              normalizeNullableId(context.verticleId) ===
                normalizeNullableId(savedContext.verticleId)
          );

        if (matchedContext) {
          console.log(
            "Restored saved context:",
            matchedContext
          );

          setCurrentContext(
            matchedContext
          );

          return matchedContext;
        }
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
        "Selected default context:",
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

      return defaultContext;
    },
    [sessionUserId]
  );

  // =========================================================
  // Navigate to valid menu
  // =========================================================

  const navigateToValidMenu = useCallback(
    (menus) => {
      console.log(
        "🚦 navigateToValidMenu:",
        menus
      );

      if (
        !Array.isArray(menus) ||
        menus.length === 0
      ) {
        navigate(
          "/access-denied",
          {
            replace: true,
          }
        );

        return;
      }

      const getRoute = (menu) => {
        const route =
          menu?.route ??
          menu?.Route;

        return normalizeRoute(route);
      };

      // -------------------------------------------------------
      // First menu route
      // -------------------------------------------------------

      const firstRoute = menus
        .map(getRoute)
        .find(Boolean);

      if (
        firstRoute &&
        isKnownRoute(firstRoute)
      ) {
        console.log(
          "🚦 Navigating to:",
          firstRoute
        );

        navigate(
          firstRoute,
          {
            replace: true,
          }
        );

        return;
      }

      // -------------------------------------------------------
      // Nothing valid / page is not registered in React
      // -------------------------------------------------------

      navigate(
        "/access-denied",
        {
          replace: true,
        }
      );
    },
    [navigate]
  );

  // =========================================================
  // Context value
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
    <ContextContext.Provider
      value={value}
    >
      {children}
    </ContextContext.Provider>
  );
};

// =============================================================
// Hook
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
