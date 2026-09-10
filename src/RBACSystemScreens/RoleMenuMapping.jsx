import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  ChevronDown,
  ChevronRight,
  Search,
  Save,
  RotateCcw,
  Shield,
  Check,
  Minus,
  Info,
} from "lucide-react";

import config from "../config";
import { useGetSessionUser } from "../SessionContext";

// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL = config.apiUrl;

// ============================================================
// STYLE CONSTANTS
// All Tailwind class strings live here so markup stays readable
// and classes can be tweaked in one place.
// ============================================================

const styles = {
  // ---- Page shell ----
  // h-screen + overflow-hidden on the root means the PAGE never
  // scrolls; only the table body (below) scrolls internally.
  page: "h-screen flex flex-col overflow-hidden bg-slate-50 text-slate-800",

  header: "px-6 pt-3 pb-2 shrink-0",
  headerTitle: "text-lg font-semibold text-slate-900",
  breadcrumbRow: "flex items-center gap-1.5 mt-1 text-xs",
  breadcrumbMuted: "text-slate-500",
  breadcrumbSeparator: "text-slate-400",
  breadcrumbActive: "font-medium text-slate-800",

  // Wrapper that grows to fill remaining height below the header.
  contentWrapper: "px-6 pb-6 flex-1 min-h-0 flex flex-col",

  // ---- Main card / grid shell ----
  card: "grid grid-cols-[240px_minmax(0,1fr)] rounded-xl border border-slate-200 bg-white shadow-sm flex-1 min-h-0 overflow-hidden",

  // ---- Left panel ----
  leftPanel: "border-r border-slate-200 bg-white p-3.5 overflow-y-auto",
  leftPanelHeaderRow: "flex items-center gap-2.5 mb-4",
  leftPanelIconWrap: "flex items-center justify-center h-8 w-8 rounded-lg bg-green-50 text-green-600",
  leftPanelTitle: "text-sm font-semibold text-slate-900",
  leftPanelSubtitle: "text-[11px] text-slate-500",

  fieldGroup: "mb-3.5",
  fieldGroupLast: "mb-4",
  fieldLabel: "block mb-1.5 text-xs font-medium text-slate-700",
  selectWrap: "relative",
  select: `
    w-full appearance-none rounded-md border border-slate-300 bg-white
    px-2.5 py-1.5 pr-8 text-xs text-slate-700 outline-none
    focus:border-green-500 focus:ring-2 focus:ring-green-100
    disabled:bg-slate-50 disabled:text-slate-400
  `,
  selectChevron: "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500",

  mappingSection: "border-t border-slate-200 pt-3.5",
  mappingSectionLabel: "text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2",
  mappingBox: "rounded-lg bg-slate-50 p-2.5",
  mappingRow: "flex justify-between items-center mb-1.5",
  mappingRowLast: "flex justify-between items-center",
  mappingRowLabel: "text-xs text-slate-600",
  mappingAllowedValue: "text-xs font-semibold text-green-600",
  mappingDeniedValue: "text-xs font-semibold text-red-500",
  mappingTotalRow: "border-t border-slate-200 mt-2 pt-2 flex justify-between items-center",
  mappingTotalLabel: "text-xs font-medium text-slate-700",
  mappingTotalValue: "text-xs font-semibold text-slate-900",

  // ---- Right panel ----
  rightPanel: "min-w-0 flex flex-col h-full min-h-0",

  rightHeader: "flex items-center justify-between px-4 py-2.5 border-b border-slate-200 shrink-0",
  rightHeaderTitle: "text-sm font-semibold text-slate-900",
  rightHeaderSubtitle: "text-xs text-slate-500",
  rightHeaderSubtitleRole: "font-medium text-slate-700",
  rightHeaderLoadingHint: "text-[11px] text-slate-400 mt-0.5",
  rightHeaderActions: "flex items-center gap-1.5",

  allowAllButton: `
    flex items-center gap-1 rounded-md border border-green-200 bg-green-50
    px-2.5 py-1.5 text-xs font-medium text-green-700
    hover:bg-green-100 disabled:opacity-50
  `,
  denyAllButton: `
    flex items-center gap-1 rounded-md border border-red-200 bg-red-50
    px-2.5 py-1.5 text-xs font-medium text-red-600
    hover:bg-red-100 disabled:opacity-50
  `,

  searchBar: "flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200 shrink-0",
  searchInputWrap: "relative w-72",
  searchIcon: "absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400",
  searchInput: `
    w-full rounded-md border border-slate-300 bg-white
    py-1.5 pl-8 pr-3 text-xs outline-none
    focus:border-green-500 focus:ring-2 focus:ring-green-100
  `,
  searchActions: "flex items-center gap-1.5",
  expandCollapseButton: `
    rounded-md border border-slate-300 bg-white px-2.5 py-1.5
    text-xs font-medium text-slate-700 hover:bg-slate-50
    disabled:opacity-50
  `,

  legendRow: "flex items-center gap-4 px-4 py-1.5 border-b border-slate-200 text-[11px] text-slate-500 shrink-0",
  legendItem: "flex items-center gap-1.5",
  legendDotAllow: "w-2 h-2 rounded-full bg-green-600",
  legendItemDeny: "flex items-center gap-1.5 text-red-600",
  legendDotDeny: "w-2 h-2 rounded-full bg-red-500",
  legendHint: "flex items-center gap-1 ml-auto",

  // The single scroll container for the table. flex-1 + min-h-0 makes
  // it consume all remaining vertical space in the right panel, so it
  // only scrolls once content actually exceeds the available area.
  tableScroll: "overflow-x-auto overflow-y-auto flex-1 min-h-0",
  table: "w-full border-collapse",
  tableHead: "sticky top-0 z-10",
  tableHeadRow: "bg-slate-50 border-b border-slate-200",
  tableHeadCellName: "px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500",
  tableHeadCellAllow: "w-24 border-l border-slate-200 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-green-600",
  tableHeadCellDeny: "w-24 border-l border-slate-200 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-red-500",

  emptyStateCell: "px-4 py-8 text-center text-xs text-slate-500",

  parentRow: "border-b border-slate-200 bg-white hover:bg-slate-50",
  parentNameCell: "px-4 py-1.5",
  parentNameRow: "flex items-center gap-2",
  expandButton: "flex h-5 w-5 items-center justify-center rounded hover:bg-slate-200",
  expandSpacer: "w-5",
  parentIconWrap: "flex items-center justify-center h-6 w-6 rounded-md bg-slate-100 text-slate-600",
  parentName: "text-[13px] font-semibold text-slate-800",
  childCountBadge: "rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500",

  accessCell: "border-l border-slate-200 text-center",
  mixedButton: "flex items-center justify-center w-full h-full",
  mixedDot: "flex items-center justify-center w-4 h-4 rounded-full border-2 border-green-400 bg-green-50",
  mixedDash: "w-1.5 h-0.5 rounded bg-green-500",

  childRow: "border-b border-slate-100 bg-white hover:bg-slate-50",
  childNameCell: "px-4 py-1",
  childNameRow: "flex items-center ml-9",
  childConnector: "w-4 h-4 border-l border-b border-slate-300 rounded-bl-md",
  childName: "ml-2.5 text-[13px] text-slate-700",

  // ---- Footer ----
  footer: "flex items-center justify-between border-t border-slate-200 bg-white px-4 py-2.5 shrink-0",
  resetButton: `
    flex items-center gap-1.5 rounded-md border border-slate-300 bg-white
    px-3 py-1.5 text-xs font-medium text-slate-700
    hover:bg-slate-50 disabled:opacity-50
  `,
  footerRightActions: "flex items-center gap-2.5",
  cancelButton: `
    rounded-md border border-slate-300 bg-white px-4 py-1.5
    text-xs font-medium text-slate-700 hover:bg-slate-50
  `,
  saveButton: `
    flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-1.5
    text-xs font-semibold text-white hover:bg-blue-700
    disabled:opacity-60 disabled:cursor-not-allowed
  `,

  // ---- Access radio ----
  radioButton: "flex items-center justify-center w-full h-full",
  radioOuter: "flex items-center justify-center w-4 h-4 rounded-full border-2 transition-all",
  radioOuterCheckedDeny: "border-red-500",
  radioOuterCheckedAllow: "border-green-600",
  radioOuterUnchecked: "border-slate-300",
  radioInnerDeny: "w-2 h-2 rounded-full bg-red-500",
  radioInnerAllow: "w-2 h-2 rounded-full bg-green-600",
};

// ============================================================
// HELPERS
// ============================================================

const getAllMenuIds = (menus) => {
  const ids = [];
  menus.forEach((menu) => {
    ids.push(menu.id);
    if (menu.children?.length) {
      menu.children.forEach((child) => ids.push(child.id));
    }
  });
  return ids;
};

// Normalizes whatever shape the mapping endpoint returns into a
// flat { [menuId]: "ALLOW" | "DENY" } object. Handles:
//   - an array of { menuId, access } (the shape we also POST on save)
//   - a wrapper object like { mappings: [ ... ] }
//   - a plain object already keyed by menu id, e.g. { "12": "ALLOW" }
const parseMappingResponse = (data) => {
  if (!data) return {};

  const list = Array.isArray(data) ? data : data.mappings;

  if (Array.isArray(list)) {
    const map = {};
    list.forEach((item) => {
      const id = Number(item.menuId ?? item.id);
      if (!Number.isNaN(id) && item.access) {
        map[id] = item.access;
      }
    });
    return map;
  }

  // Fallback: already a { menuId: access } style object.
  const map = {};
  Object.entries(data).forEach(([menuId, access]) => {
    const id = Number(menuId);
    if (!Number.isNaN(id)) {
      map[id] = access;
    }
  });
  return map;
};

// ============================================================
// RADIO COMPONENT (compact)
// ============================================================

const AccessRadio = ({ checked, type, onClick }) => {
  const isDeny = type === "DENY";

  return (
    <button type="button" onClick={onClick} className={styles.radioButton}>
      <span
        className={`
          ${styles.radioOuter}
          ${checked
            ? (isDeny ? styles.radioOuterCheckedDeny : styles.radioOuterCheckedAllow)
            : styles.radioOuterUnchecked}
        `}
      >
        {checked && (
          <span className={isDeny ? styles.radioInnerDeny : styles.radioInnerAllow} />
        )}
      </span>
    </button>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function RoleMenuMapping() {
  // ==========================================================
  // SESSION
  // ==========================================================

  const { user: sessionUser } = useGetSessionUser();

  // ==========================================================
  // DEPARTMENT / ROLE / VERTICAL STATE
  // ==========================================================

  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [verticles, setVerticles] = useState([]);

  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedVerticalId, setSelectedVerticalId] = useState(0);

  // ==========================================================
  // LOADING STATES
  // ==========================================================

  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingVerticles, setLoadingVerticles] = useState(false);
  const [loadingMenuStructure, setLoadingMenuStructure] = useState(false);
  const [loadingMapping, setLoadingMapping] = useState(false);
  const [saving, setSaving] = useState(false);

  // ==========================================================
  // MENU STATE
  // ==========================================================

  // IMPORTANT: this must ALWAYS remain an array.
  const [menuStructure, setMenuStructure] = useState([]);

  // IMPORTANT: this must ALWAYS be a Set.
  const [expandedMenus, setExpandedMenus] = useState(new Set());

  const [permissionMap, setPermissionMap] = useState({});

  // ==========================================================
  // UI STATE
  // ==========================================================

  const [searchText, setSearchText] = useState("");

  // ==========================================================
  // API ENDPOINTS
  // ==========================================================

  const loadDepartmentsEndPoint = `${API_BASE_URL}/MasterData/GetDepartmentMasterList`;
  const loadRolesEndPoint = `${API_BASE_URL}/Users/GetRolesList`;
  const loadVerticlesEndPoint = `${API_BASE_URL}/MasterData/GetLeadCategoryMasterList`;
  const loadMenuStructureEndPoint = `${API_BASE_URL}/RolePermission/GetMenuStructure`;
  const loadRoleMenuMappingEndPoint = `${API_BASE_URL}/RoleMenuMapping/GetMapping`;
  const saveRoleMenuMappingEndPoint = `${API_BASE_URL}/RoleMenuMapping/SaveMapping`;

  // ==========================================================
  // AUTH HEADER
  // ==========================================================

  const authHeaders = useMemo(() => {
    if (!sessionUser?.token) return {};
    return { Authorization: `Bearer ${sessionUser.token}` };
  }, [sessionUser]);

  // ==========================================================
  // LOAD DEPARTMENTS
  // ==========================================================

  const loadDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const response = await axios.get(loadDepartmentsEndPoint, { headers: authHeaders });
      const departmentList = response.data || [];
      setDepartments(departmentList);

      if (departmentList.length > 0) {
        setSelectedDepartmentId(Number(departmentList[0].id));
      }
    } catch (error) {
      console.error("Error loading departments:", error);
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  // ==========================================================
  // LOAD ROLES
  // ==========================================================

  const loadRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await axios.get(loadRolesEndPoint, { headers: authHeaders });
      setRoles(response.data || []);
    } catch (error) {
      console.error("Error loading roles:", error);
      setRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  // ==========================================================
  // LOAD VERTICALS
  // ==========================================================

  const loadVerticles = async () => {
    try {
      setLoadingVerticles(true);
      const response = await axios.get(loadVerticlesEndPoint, { headers: authHeaders });
      setVerticles(response.data || []);
    } catch (error) {
      console.error("Error loading verticals:", error);
      setVerticles([]);
    } finally {
      setLoadingVerticles(false);
    }
  };

  // ==========================================================
  // LOAD MENU STRUCTURE
  // ==========================================================

  const loadMenuStructure = async () => {
    // Do not call API without department
    if (!selectedDepartmentId) {
      setMenuStructure([]);
      setExpandedMenus(new Set());
      return;
    }

    try {
      setLoadingMenuStructure(true);

      const response = await axios.get(loadMenuStructureEndPoint, {
        params: { departmentId: Number(selectedDepartmentId) },
        headers: authHeaders,
      });

      const menus = Array.isArray(response.data) ? response.data : [];
      setMenuStructure(menus);

      // AUTOMATICALLY EXPAND PARENT MENUS
      const parentIds = menus
        .filter((menu) => menu.children?.length > 0)
        .map((menu) => menu.id);

      setExpandedMenus(new Set(parentIds));
    } catch (error) {
      console.error("Error loading menu structure:", error);
      console.error("Backend response:", error.response?.data);

      // IMPORTANT: NEVER do setExpandedMenus([]) — expandedMenus must remain a Set.
      setMenuStructure([]);
      setExpandedMenus(new Set());
    } finally {
      setLoadingMenuStructure(false);
    }
  };

  // ==========================================================
  // LOAD SAVED ROLE MENU MAPPING (real API — fetches and maps
  // the existing ALLOW/DENY selections for this role/department/
  // vertical combination when opening an existing mapping)
  // ==========================================================

  const loadRoleMapping = async () => {
    if (!selectedRoleId || !selectedDepartmentId) {
      setPermissionMap({});
      return;
    }

    try {
      setLoadingMapping(true);

      const response = await axios.get(loadRoleMenuMappingEndPoint, {
        params: {
          roleId: Number(selectedRoleId),
          departmentId: Number(selectedDepartmentId),
          verticalId: Number(selectedVerticalId),
        },
        headers: authHeaders,
      });

      setPermissionMap(parseMappingResponse(response.data));
    } catch (error) {
      console.error("Error loading role menu mapping:", error);
      console.error("Backend response:", error.response?.data);
      setPermissionMap({});
    } finally {
      setLoadingMapping(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadDepartments();
    loadRoles();
    loadVerticles();
  }, []);

  // ==========================================================
  // LOAD MENU WHEN DEPARTMENT CHANGES
  // ==========================================================

  useEffect(() => {
    if (!selectedDepartmentId) return;
    loadMenuStructure();
  }, [selectedDepartmentId]);

  // ==========================================================
  // FILTER ROLES BY DEPARTMENT
  // ==========================================================

  const filteredRoles = useMemo(() => {
    if (!selectedDepartmentId) return [];
    return roles.filter(
      (role) => Number(role.departmentId) === Number(selectedDepartmentId)
    );
  }, [roles, selectedDepartmentId]);

  // ==========================================================
  // FILTER VERTICALS BY DEPARTMENT
  // ==========================================================

  const filteredVerticles = useMemo(() => {
    if (!selectedDepartmentId) return [];
    return verticles.filter(
      (verticle) => Number(verticle.departmentId) === Number(selectedDepartmentId)
    );
  }, [verticles, selectedDepartmentId]);

  // ==========================================================
  // SELECT FIRST ROLE WHEN DEPARTMENT CHANGES
  // ==========================================================

  useEffect(() => {
    if (!selectedDepartmentId) {
      setSelectedRoleId("");
      return;
    }

    const departmentRoles = roles.filter(
      (role) => Number(role.departmentId) === Number(selectedDepartmentId)
    );

    if (departmentRoles.length > 0) {
      setSelectedRoleId(Number(departmentRoles[0].id));
    } else {
      setSelectedRoleId("");
    }
  }, [selectedDepartmentId, roles]);

  // ==========================================================
  // FETCH + MAP EXISTING MAPPING WHENEVER ROLE / DEPARTMENT /
  // VERTICAL CHANGES — this is what makes "opening an existing
  // mapping" show its real saved ALLOW/DENY state.
  // ==========================================================

  useEffect(() => {
    loadRoleMapping();
  }, [selectedRoleId, selectedDepartmentId, selectedVerticalId]);

  // ==========================================================
  // EXPAND / COLLAPSE
  // ==========================================================

  const toggleExpand = (menuId) => {
    setExpandedMenus((previous) => {
      const next = new Set(previous);
      if (next.has(menuId)) {
        next.delete(menuId);
      } else {
        next.add(menuId);
      }
      return next;
    });
  };

  const expandAll = () => {
    const parentIds = menuStructure
      .filter((menu) => menu.children?.length > 0)
      .map((menu) => menu.id);
    setExpandedMenus(new Set(parentIds));
  };

  const collapseAll = () => {
    setExpandedMenus(new Set());
  };

  // ==========================================================
  // SET ACCESS
  // ==========================================================

  const setAccess = (menuId, access) => {
    setPermissionMap((previous) => ({ ...previous, [menuId]: access }));
  };

  const setParentAccess = (menu, access) => {
    setPermissionMap((previous) => {
      const next = { ...previous, [menu.id]: access };
      if (menu.children?.length) {
        menu.children.forEach((child) => {
          next[child.id] = access;
        });
      }
      return next;
    });
  };

  // ==========================================================
  // PARENT STATE
  // ==========================================================

  const getParentState = (menu) => {
    if (!menu.children?.length) {
      return {
        access: permissionMap[menu.id] || "DENY",
        mixed: false,
      };
    }

    const children = menu.children;
    const accesses = children.map((child) => permissionMap[child.id] || "DENY");

    const allAllow = accesses.every((access) => access === "ALLOW");
    const allDeny = accesses.every((access) => access === "DENY");

    if (allAllow) return { access: "ALLOW", mixed: false };
    if (allDeny) return { access: "DENY", mixed: false };

    return { access: "MIXED", mixed: true };
  };

  // ==========================================================
  // SEARCH
  // ==========================================================

  const filteredMenus = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) return menuStructure;

    return menuStructure
      .map((menu) => {
        const parentMatch = menu.name?.toLowerCase().includes(search);

        if (!menu.children?.length) {
          return parentMatch ? menu : null;
        }

        const matchingChildren = menu.children.filter((child) =>
          child.name?.toLowerCase().includes(search)
        );

        if (parentMatch || matchingChildren.length) {
          return {
            ...menu,
            children: parentMatch ? menu.children : matchingChildren,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [searchText, menuStructure]);

  // ==========================================================
  // SELECT ALL
  // ==========================================================

  const setAllAccess = (access) => {
    const allIds = getAllMenuIds(menuStructure);
    const next = {};
    allIds.forEach((id) => {
      next[id] = access;
    });
    setPermissionMap(next);
  };

  // ==========================================================
  // RESET — discards unsaved local changes by re-fetching the
  // last saved mapping from the server (source of truth), rather
  // than a hardcoded dummy state.
  // ==========================================================

  const handleReset = () => {
    loadRoleMapping();
  };

  // ==========================================================
  // SAVE — real API call
  // ==========================================================

  const handleSave = async () => {
    if (!selectedRoleId || !selectedDepartmentId) {
      alert("Please select a department and role.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        roleId: Number(selectedRoleId),
        departmentId: Number(selectedDepartmentId),
        verticalId: Number(selectedVerticalId),
        mappings: Object.entries(permissionMap).map(([menuId, access]) => ({
          menuId: Number(menuId),
          access,
        })),
      };

      await axios.post(saveRoleMenuMappingEndPoint, payload, {
        headers: authHeaders,
      });

      alert("Role menu mapping saved successfully.");
    } catch (error) {
      console.error("Error saving role menu mapping:", error);
      console.error("Backend response:", error.response?.data);
      alert("Unable to save role menu mapping.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // COUNTS
  // ==========================================================

  const allMenuIds = useMemo(() => getAllMenuIds(menuStructure), [menuStructure]);

  const allowedCount = allMenuIds.filter((id) => permissionMap[id] === "ALLOW").length;
  const deniedCount = allMenuIds.filter((id) => permissionMap[id] === "DENY").length;

  // ==========================================================
  // SELECTED ROLE
  // ==========================================================

  const selectedRole = roles.find(
    (role) => Number(role.id) === Number(selectedRoleId)
  );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className={styles.page}>
      {/* ====================================================
          PAGE HEADER (compact)
      ===================================================== */}

      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Role Menu Mapping</h1>

        <div className={styles.breadcrumbRow}>
          <span className={styles.breadcrumbMuted}>Home</span>
          <ChevronRight size={12} className={styles.breadcrumbSeparator} />
          <span className={styles.breadcrumbMuted}>Access Control</span>
          <ChevronRight size={12} className={styles.breadcrumbSeparator} />
          <span className={styles.breadcrumbActive}>Role Menu Mapping</span>
        </div>
      </div>

      {/* ====================================================
          MAIN CARD
      ===================================================== */}

      <div className={styles.contentWrapper}>
        <div className={styles.card}>
          {/* ==================================================
              LEFT PANEL (compact)
          =================================================== */}

          <div className={styles.leftPanel}>
            <div className={styles.leftPanelHeaderRow}>
              <div className={styles.leftPanelIconWrap}>
                <Shield size={16} />
              </div>

              <div>
                <h2 className={styles.leftPanelTitle}>Role & Scope</h2>
                <p className={styles.leftPanelSubtitle}>Select mapping scope</p>
              </div>
            </div>

            {/* DEPARTMENT */}

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Department</label>

              <div className={styles.selectWrap}>
                <select
                  value={selectedDepartmentId}
                  onChange={(e) => setSelectedDepartmentId(Number(e.target.value))}
                  disabled={loadingDepartments}
                  className={styles.select}
                >
                  {loadingDepartments ? (
                    <option value="">Loading departments...</option>
                  ) : departments.length === 0 ? (
                    <option value="">No departments found</option>
                  ) : (
                    departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.departmentName}
                      </option>
                    ))
                  )}
                </select>

                <ChevronDown size={14} className={styles.selectChevron} />
              </div>
            </div>

            {/* ROLE */}

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Select Role</label>

              <div className={styles.selectWrap}>
                <select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                  disabled={
                    !selectedDepartmentId || loadingRoles || filteredRoles.length === 0
                  }
                  className={styles.select}
                >
                  {loadingRoles ? (
                    <option value="">Loading roles...</option>
                  ) : filteredRoles.length === 0 ? (
                    <option value="">No roles available</option>
                  ) : (
                    filteredRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.roleName}
                      </option>
                    ))
                  )}
                </select>

                <ChevronDown size={14} className={styles.selectChevron} />
              </div>
            </div>

            {/* VERTICAL */}

            <div className={styles.fieldGroupLast}>
              <label className={styles.fieldLabel}>Vertical</label>

              <div className={styles.selectWrap}>
                <select
                  value={selectedVerticalId}
                  onChange={(e) => setSelectedVerticalId(Number(e.target.value))}
                  disabled={
                    !selectedRoleId ||
                    loadingVerticles ||
                    filteredVerticles.length === 0
                  }
                  className={styles.select}
                >
                  {loadingVerticles ? (
                    <option value="">Loading verticals...</option>
                  ) : filteredVerticles.length === 0 ? (
                    <option value="">No verticals available</option>
                  ) : (
                    filteredVerticles.map((vertical) => (
                      <option key={vertical.id} value={vertical.id}>
                        {vertical.category}
                      </option>
                    ))
                  )}
                </select>

                <ChevronDown size={14} className={styles.selectChevron} />
              </div>
            </div>

            {/* CURRENT MAPPING */}

            <div className={styles.mappingSection}>
              <p className={styles.mappingSectionLabel}>Current Mapping</p>

              <div className={styles.mappingBox}>
                <div className={styles.mappingRow}>
                  <span className={styles.mappingRowLabel}>Allowed</span>
                  <span className={styles.mappingAllowedValue}>{allowedCount}</span>
                </div>

                <div className={styles.mappingRowLast}>
                  <span className={styles.mappingRowLabel}>Denied</span>
                  <span className={styles.mappingDeniedValue}>{deniedCount}</span>
                </div>

                <div className={styles.mappingTotalRow}>
                  <span className={styles.mappingTotalLabel}>Total</span>
                  <span className={styles.mappingTotalValue}>{allMenuIds.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              RIGHT PANEL (compact)
          =================================================== */}

          <div className={styles.rightPanel}>
            {/* HEADER */}

            <div className={styles.rightHeader}>
              <div>
                <h2 className={styles.rightHeaderTitle}>Menu Access</h2>
                <p className={styles.rightHeaderSubtitle}>
                  Configure menu and submenu access for{" "}
                  <span className={styles.rightHeaderSubtitleRole}>
                    {selectedRole?.roleName || "selected role"}
                  </span>
                </p>
                {loadingMapping && (
                  <p className={styles.rightHeaderLoadingHint}>Loading saved permissions...</p>
                )}
              </div>

              <div className={styles.rightHeaderActions}>
                <button
                  type="button"
                  onClick={() => setAllAccess("ALLOW")}
                  disabled={!selectedRoleId || menuStructure.length === 0}
                  className={styles.allowAllButton}
                >
                  <Check size={12} />
                  Allow All
                </button>

                <button
                  type="button"
                  onClick={() => setAllAccess("DENY")}
                  disabled={!selectedRoleId || menuStructure.length === 0}
                  className={styles.denyAllButton}
                >
                  <Minus size={12} />
                  Deny All
                </button>
              </div>
            </div>

            {/* SEARCH */}

            <div className={styles.searchBar}>
              <div className={styles.searchInputWrap}>
                <Search size={14} className={styles.searchIcon} />

                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search menu or submenu..."
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.searchActions}>
                <button
                  type="button"
                  onClick={expandAll}
                  disabled={menuStructure.length === 0}
                  className={styles.expandCollapseButton}
                >
                  Expand All
                </button>

                <button
                  type="button"
                  onClick={collapseAll}
                  disabled={menuStructure.length === 0}
                  className={styles.expandCollapseButton}
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* LEGEND */}

            <div className={styles.legendRow}>
              <span className={styles.legendItem}>
                <span className={styles.legendDotAllow} />
                Allowed
              </span>

              <span className={styles.legendItemDeny}>
                <span className={styles.legendDotDeny} />
                Denied
              </span>

              <span className={styles.legendHint}>
                <Info size={11} />
                Denied items are highlighted in red
              </span>
            </div>

            {/* ==================================================
                TABLE (fills remaining space; scrolls internally
                only when content actually overflows)
            =================================================== */}

            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead className={styles.tableHead}>
                  <tr className={styles.tableHeadRow}>
                    <th className={styles.tableHeadCellName}>Menu / Submenu</th>
                    <th className={styles.tableHeadCellAllow}>Allow</th>
                    <th className={styles.tableHeadCellDeny}>Deny</th>
                  </tr>
                </thead>

                <tbody>
                  {loadingMenuStructure ? (
                    <tr>
                      <td colSpan="3" className={styles.emptyStateCell}>
                        Loading menu structure...
                      </td>
                    </tr>
                  ) : !selectedDepartmentId ? (
                    <tr>
                      <td colSpan="3" className={styles.emptyStateCell}>
                        Select a department to load menus.
                      </td>
                    </tr>
                  ) : !selectedRoleId ? (
                    <tr>
                      <td colSpan="3" className={styles.emptyStateCell}>
                        Select a role to configure menu access.
                      </td>
                    </tr>
                  ) : filteredMenus.length === 0 ? (
                    <tr>
                      <td colSpan="3" className={styles.emptyStateCell}>
                        No menus found.
                      </td>
                    </tr>
                  ) : (
                    filteredMenus.map((menu) => {
                      const state = getParentState(menu);
                      const hasChildren = menu.children?.length > 0;
                      // IMPORTANT: expandedMenus is always a Set
                      const expanded = expandedMenus.has(menu.id);

                      return (
                        <React.Fragment key={menu.id}>
                          {/* PARENT MENU */}

                          <tr className={styles.parentRow}>
                            <td className={styles.parentNameCell}>
                              <div className={styles.parentNameRow}>
                                {hasChildren ? (
                                  <button
                                    type="button"
                                    onClick={() => toggleExpand(menu.id)}
                                    className={styles.expandButton}
                                  >
                                    {expanded ? (
                                      <ChevronDown size={14} />
                                    ) : (
                                      <ChevronRight size={14} />
                                    )}
                                  </button>
                                ) : (
                                  <div className={styles.expandSpacer} />
                                )}

                                <span className={styles.parentIconWrap}>
                                  <Shield size={13} />
                                </span>

                                <span className={styles.parentName}>{menu.name}</span>

                                {hasChildren && (
                                  <span className={styles.childCountBadge}>
                                    {menu.children.length}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* PARENT ALLOW */}

                            <td className={styles.accessCell}>
                              {state.mixed ? (
                                <button
                                  type="button"
                                  onClick={() => setParentAccess(menu, "ALLOW")}
                                  className={styles.mixedButton}
                                >
                                  <span className={styles.mixedDot}>
                                    <span className={styles.mixedDash} />
                                  </span>
                                </button>
                              ) : (
                                <AccessRadio
                                  checked={state.access === "ALLOW"}
                                  type="ALLOW"
                                  onClick={() => setParentAccess(menu, "ALLOW")}
                                />
                              )}
                            </td>

                            {/* PARENT DENY */}

                            <td className={styles.accessCell}>
                              <AccessRadio
                                checked={state.access === "DENY"}
                                type="DENY"
                                onClick={() => setParentAccess(menu, "DENY")}
                              />
                            </td>
                          </tr>

                          {/* CHILDREN — guarded with > 0, never renders a bare 0 */}

                          {hasChildren &&
                            expanded &&
                            menu.children.map((child) => {
                              const access = permissionMap[child.id] || "DENY";

                              return (
                                <tr key={child.id} className={styles.childRow}>
                                  <td className={styles.childNameCell}>
                                    <div className={styles.childNameRow}>
                                      <div className={styles.childConnector} />
                                      <span className={styles.childName}>{child.name}</span>
                                    </div>
                                  </td>

                                  {/* CHILD ALLOW */}

                                  <td className={styles.accessCell}>
                                    <AccessRadio
                                      checked={access === "ALLOW"}
                                      type="ALLOW"
                                      onClick={() => setAccess(child.id, "ALLOW")}
                                    />
                                  </td>

                                  {/* CHILD DENY */}

                                  <td className={styles.accessCell}>
                                    <AccessRadio
                                      checked={access === "DENY"}
                                      type="DENY"
                                      onClick={() => setAccess(child.id, "DENY")}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ==================================================
                FOOTER (compact)
            =================================================== */}

            <div className={styles.footer}>
              <button
                type="button"
                onClick={handleReset}
                disabled={!selectedRoleId || loadingMapping}
                className={styles.resetButton}
              >
                <RotateCcw size={14} />
                Reset
              </button>

              <div className={styles.footerRightActions}>
                <button type="button" onClick={handleReset} className={styles.cancelButton}>
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !selectedRoleId || !selectedDepartmentId}
                  className={styles.saveButton}
                >
                  <Save size={14} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}