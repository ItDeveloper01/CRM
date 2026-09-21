// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import {
//   ChevronDown,
//   ChevronRight,
//   Search,
//   Save,
//   RotateCcw,
//   Shield,
//   Check,
//   Minus,
//   Info,
// } from "lucide-react";
// import config from "../config";
// import { useGetSessionUser } from "../SessionContext";

// const API_BASE_URL = config.apiUrl;

// const NO_DEPARTMENT_ID = 0;
// const NO_VERTICAL_ID = 0;

// const loadContextTypesEndPoint = `${API_BASE_URL}/MasterData/GetContextTypeList`;
// const loadDepartmentsEndPoint = `${API_BASE_URL}/MasterData/GetDepartmentMasterList`;
// const loadRolesEndPoint = `${API_BASE_URL}/Users/GetRolesList`;
// const loadVerticlesEndPoint = `${API_BASE_URL}/MasterData/GetLeadCategoryMasterList`;
// const loadMenuStructureEndPoint = `${API_BASE_URL}/RolePermission/GetMenuStructure`;
// const loadRoleMenuMappingEndPoint = `${API_BASE_URL}/RolePermission/GetMapping`;
// const saveRoleMenuMappingEndPoint = `${API_BASE_URL}/RolePermission/SaveMapping`;

// const RoleMenuMapping = () => {
//   const { user: sessionUser } = useGetSessionUser();

//   const authHeaders = useMemo(() => {
//     if (!sessionUser?.token) return {};

//     return {
//       Authorization: `Bearer ${sessionUser.token}`,
//     };
//   }, [sessionUser]);

//   // =========================================================
//   // MASTER DATA
//   // =========================================================

//   const [contextTypes, setContextTypes] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [verticles, setVerticles] = useState([]);

//   const [selectedContextTypeId, setSelectedContextTypeId] = useState("");
//   const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
//   const [selectedRoleId, setSelectedRoleId] = useState("");
//   const [selectedVerticalId, setSelectedVerticalId] = useState(0);

//   // =========================================================
//   // LOADING
//   // =========================================================

//   const [loadingContextTypes, setLoadingContextTypes] = useState(false);
//   const [loadingDepartments, setLoadingDepartments] = useState(false);
//   const [loadingRoles, setLoadingRoles] = useState(false);
//   const [loadingVerticles, setLoadingVerticles] = useState(false);
//   const [loadingMenuStructure, setLoadingMenuStructure] = useState(false);
//   const [loadingMapping, setLoadingMapping] = useState(false);
//   const [saving, setSaving] = useState(false);

//   // =========================================================
//   // MENU
//   // =========================================================

//   const [menuStructure, setMenuStructure] = useState([]);
//   const [expandedMenus, setExpandedMenus] = useState(new Set());
//   const [permissionMap, setPermissionMap] = useState({});
//   const [searchText, setSearchText] = useState("");

//   // =========================================================
//   // MAPPING RESPONSE
//   // =========================================================

//   const [roleMenuMappings, setRoleMenuMappings] = useState([]);

//   // =========================================================
//   // CONTEXT HELPERS
//   // =========================================================

//   const selectedContext = useMemo(() => {
//     return contextTypes.find(
//       (x) => Number(x.id) === Number(selectedContextTypeId)
//     );
//   }, [contextTypes, selectedContextTypeId]);

//   /*
//    * Executive / Functional / Administrative
//    *
//    * Functional -> Department required
//    * Administrative / Executive -> Department not required
//    */
//   const hasDepartments = useMemo(() => {
//     if (!selectedContext) return false;

//     const name = String(
//       selectedContext.contextTypeName ||
//         selectedContext.contextName ||
//         selectedContext.name ||
//         ""
//     ).toLowerCase();

//     if (
//       name.includes("executive") ||
//       name.includes("administrative")
//     ) {
//       return false;
//     }

//     return Number(selectedContextTypeId) === 2;
//   }, [selectedContext, selectedContextTypeId]);

//   // =========================================================
//   // LOAD CONTEXT TYPES
//   // =========================================================

//   useEffect(() => {
//     const fetchContextTypes = async () => {
//       try {
//         setLoadingContextTypes(true);

//         const response = await axios.get(
//           loadContextTypesEndPoint,
//           {
//             headers: authHeaders,
//           }
//         );

//         const data = Array.isArray(response.data)
//           ? response.data
//           : [];

//         setContextTypes(data);

//         if (data.length > 0) {
//           setSelectedContextTypeId(Number(data[0].id));
//         }
//       } catch (error) {
//         console.error(
//           "Error loading context types:",
//           error
//         );
//       } finally {
//         setLoadingContextTypes(false);
//       }
//     };

//     if (sessionUser?.token) {
//       fetchContextTypes();
//     }
//   }, [sessionUser?.token, authHeaders]);

//   // =========================================================
//   // LOAD DEPARTMENTS
//   // =========================================================

//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         setLoadingDepartments(true);

//         const response = await axios.get(
//           loadDepartmentsEndPoint,
//           {
//             headers: authHeaders,
//           }
//         );

//         setDepartments(
//           Array.isArray(response.data)
//             ? response.data
//             : []
//         );
//       } catch (error) {
//         console.error(
//           "Error loading departments:",
//           error
//         );
//         setDepartments([]);
//       } finally {
//         setLoadingDepartments(false);
//       }
//     };

//     if (sessionUser?.token) {
//       fetchDepartments();
//     }
//   }, [sessionUser?.token, authHeaders]);

//   // =========================================================
//   // LOAD ROLES
//   // =========================================================

//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         setLoadingRoles(true);

//         const response = await axios.get(
//           loadRolesEndPoint,
//           {
//             headers: authHeaders,
//           }
//         );

//         setRoles(
//           Array.isArray(response.data)
//             ? response.data
//             : []
//         );
//       } catch (error) {
//         console.error(
//           "Error loading roles:",
//           error
//         );
//         setRoles([]);
//       } finally {
//         setLoadingRoles(false);
//       }
//     };

//     if (sessionUser?.token) {
//       fetchRoles();
//     }
//   }, [sessionUser?.token, authHeaders]);

//   // =========================================================
//   // LOAD VERTICALS
//   // =========================================================

//   useEffect(() => {
//     const fetchVerticles = async () => {
//       try {
//         setLoadingVerticles(true);

//         const response = await axios.get(
//           loadVerticlesEndPoint,
//           {
//             headers: authHeaders,
//           }
//         );

//         setVerticles(
//           Array.isArray(response.data)
//             ? response.data
//             : []
//         );
//       } catch (error) {
//         console.error(
//           "Error loading verticals:",
//           error
//         );
//         setVerticles([]);
//       } finally {
//         setLoadingVerticles(false);
//       }
//     };

//     if (sessionUser?.token) {
//       fetchVerticles();
//     }
//   }, [sessionUser?.token, authHeaders]);

//   // =========================================================
//   // FILTERED ROLES
//   // =========================================================

//   const filteredRoles = useMemo(() => {
//     if (!selectedContextTypeId) return [];

//     if (hasDepartments) {
//       if (!selectedDepartmentId) return [];

//       return roles.filter(
//         (role) =>
//           Number(role.contextTypeId) ===
//             Number(selectedContextTypeId) &&
//           Number(role.departmentId) ===
//             Number(selectedDepartmentId)
//       );
//     }

//     return roles.filter(
//       (role) =>
//         Number(role.contextTypeId) ===
//         Number(selectedContextTypeId)
//     );
//   }, [
//     roles,
//     selectedContextTypeId,
//     selectedDepartmentId,
//     hasDepartments,
//   ]);

//   // =========================================================
//   // SELECT FIRST ROLE
//   // =========================================================

//   useEffect(() => {
//     if (!selectedContextTypeId) {
//       setSelectedRoleId("");
//       return;
//     }

//     if (hasDepartments && !selectedDepartmentId) {
//       setSelectedRoleId("");
//       return;
//     }

//     const availableRoles = hasDepartments
//       ? roles.filter(
//           (role) =>
//             Number(role.contextTypeId) ===
//               Number(selectedContextTypeId) &&
//             Number(role.departmentId) ===
//               Number(selectedDepartmentId)
//         )
//       : roles.filter(
//           (role) =>
//             Number(role.contextTypeId) ===
//             Number(selectedContextTypeId)
//         );

//     if (availableRoles.length > 0) {
//       const currentRoleExists =
//         availableRoles.some(
//           (role) =>
//             Number(role.id) ===
//             Number(selectedRoleId)
//         );

//       if (!currentRoleExists) {
//         setSelectedRoleId(
//           Number(availableRoles[0].id)
//         );
//       }
//     } else {
//       setSelectedRoleId("");
//     }
//   }, [
//     selectedDepartmentId,
//     selectedContextTypeId,
//     hasDepartments,
//     roles,
//     selectedRoleId,
//   ]);

//   // =========================================================
//   // FILTERED VERTICALS
//   // =========================================================

//   const filteredVerticles = useMemo(() => {
//     if (!hasDepartments || !selectedDepartmentId) {
//       return [];
//     }

//     return verticles.filter(
//       (verticle) =>
//         Number(verticle.departmentId) ===
//         Number(selectedDepartmentId)
//     );
//   }, [
//     verticles,
//     selectedDepartmentId,
//     hasDepartments,
//   ]);

//   // =========================================================
//   // SELECT FIRST VERTICAL
//   // =========================================================

//   useEffect(() => {
//     if (!hasDepartments || !selectedDepartmentId) {
//       setSelectedVerticalId(0);
//       return;
//     }

//     if (filteredVerticles.length === 0) {
//       setSelectedVerticalId(0);
//       return;
//     }

//     const currentVerticalExists =
//       filteredVerticles.some(
//         (vertical) =>
//           Number(vertical.id) ===
//           Number(selectedVerticalId)
//       );

//     if (!currentVerticalExists) {
//       setSelectedVerticalId(
//         Number(filteredVerticles[0].id)
//       );
//     }
//   }, [
//     filteredVerticles,
//     selectedDepartmentId,
//     hasDepartments,
//     selectedVerticalId,
//   ]);

//   // =========================================================
//   // LOAD MENU STRUCTURE
//   // =========================================================

//   useEffect(() => {
//     const loadMenus = async () => {
//       if (!selectedContextTypeId) {
//         setMenuStructure([]);
//         return;
//       }

//       if (hasDepartments && !selectedDepartmentId) {
//         setMenuStructure([]);
//         return;
//       }

//       try {
//         setLoadingMenuStructure(true);

//         const response = await axios.get(
//           loadMenuStructureEndPoint,
//           {
//             params: {
//               contextTypeId:
//                 Number(selectedContextTypeId),

//               departmentId: hasDepartments
//                 ? Number(selectedDepartmentId)
//                 : NO_DEPARTMENT_ID,
//             },
//             headers: authHeaders,
//           }
//         );

//         const data = Array.isArray(response.data)
//           ? response.data
//           : [];

//         setMenuStructure(data);
//       } catch (error) {
//         console.error(
//           "Error loading menu structure:",
//           error
//         );

//         console.error(
//           "Backend response:",
//           error.response?.data
//         );

//         setMenuStructure([]);
//       } finally {
//         setLoadingMenuStructure(false);
//       }
//     };

//     loadMenus();
//   }, [
//     selectedContextTypeId,
//     selectedDepartmentId,
//     hasDepartments,
//     authHeaders,
//   ]);

//   // =========================================================
//   // LOAD ROLE MENU MAPPING
//   // =========================================================

//   const loadRoleMapping = async () => {
//     if (
//       !selectedRoleId ||
//       !selectedContextTypeId
//     ) {
//       setPermissionMap({});
//       setRoleMenuMappings([]);
//       return;
//     }

//     if (
//       hasDepartments &&
//       !selectedDepartmentId
//     ) {
//       setPermissionMap({});
//       setRoleMenuMappings([]);
//       return;
//     }

//     if (
//       hasDepartments &&
//       !selectedVerticalId
//     ) {
//       setPermissionMap({});
//       setRoleMenuMappings([]);
//       return;
//     }

//     try {
//       setLoadingMapping(true);

//       const response = await axios.get(
//         loadRoleMenuMappingEndPoint,
//         {
//           params: {
//             roleId: Number(selectedRoleId),

//             contextTypeId:
//               Number(selectedContextTypeId),

//             departmentId: hasDepartments
//               ? Number(selectedDepartmentId)
//               : NO_DEPARTMENT_ID,

//             verticalId: hasDepartments
//               ? Number(selectedVerticalId)
//               : NO_VERTICAL_ID,
//           },

//           headers: authHeaders,
//         }
//       );

//       const mappings = Array.isArray(response.data)
//         ? response.data
//         : [];

//       setRoleMenuMappings(mappings);

//       const newPermissionMap = {};

//       mappings.forEach((mapping) => {
//         if (mapping.menuId != null) {
//           newPermissionMap[
//             Number(mapping.menuId)
//           ] = "ALLOW";
//         }
//       });

//       setPermissionMap(newPermissionMap);
//     } catch (error) {
//       console.error(
//         "Error loading role menu mapping:",
//         error
//       );

//       console.error(
//         "Backend response:",
//         error.response?.data
//       );

//       setRoleMenuMappings([]);
//       setPermissionMap({});
//     } finally {
//       setLoadingMapping(false);
//     }
//   };

//   useEffect(() => {
//     loadRoleMapping();
//   }, [
//     selectedRoleId,
//     selectedContextTypeId,
//     selectedDepartmentId,
//     selectedVerticalId,
//     hasDepartments,
//   ]);

//   // =========================================================
//   // MENU HELPERS
//   // =========================================================

//   const getMenuId = (menu) => {
//     return Number(
//       menu.id ??
//         menu.menuId ??
//         menu.Id
//     );
//   };

//   const getMenuName = (menu) => {
//     return (
//       menu.name ??
//       menu.menuName ??
//       menu.MenuName ??
//       ""
//     );
//   };

//   const getParentMenuId = (menu) => {
//     const value =
//       menu.parentMenuId ??
//       menu.parent_MenuID ??
//       menu.parentMenuID ??
//       menu.Parent_MenuID;

//     if (
//       value === null ||
//       value === undefined ||
//       value === ""
//     ) {
//       return null;
//     }

//     return Number(value);
//   };

//   const normalizedMenus = useMemo(() => {
//     if (!Array.isArray(menuStructure)) {
//       return [];
//     }

//     return menuStructure.map((menu) => ({
//       ...menu,
//       id: getMenuId(menu),
//       name: getMenuName(menu),
//       parentMenuId: getParentMenuId(menu),
//     }));
//   }, [menuStructure]);

//   const rootMenus = useMemo(() => {
//     return normalizedMenus.filter(
//       (menu) =>
//         menu.parentMenuId === null ||
//         menu.parentMenuId === 0
//     );
//   }, [normalizedMenus]);

//   const getChildren = (menuId) => {
//     return normalizedMenus.filter(
//       (menu) =>
//         Number(menu.parentMenuId) ===
//         Number(menuId)
//     );
//   };

//   // =========================================================
//   // SEARCH
//   // =========================================================

//   const menuMatchesSearch = (menu) => {
//     if (!searchText.trim()) {
//       return true;
//     }

//     return String(menu.name)
//       .toLowerCase()
//       .includes(searchText.toLowerCase());
//   };

//   const menuOrChildrenMatch = (menu) => {
//     if (menuMatchesSearch(menu)) {
//       return true;
//     }

//     const children = getChildren(menu.id);

//     return children.some((child) =>
//       menuOrChildrenMatch(child)
//     );
//   };

//   const visibleRootMenus = useMemo(() => {
//     if (!searchText.trim()) {
//       return rootMenus;
//     }

//     return rootMenus.filter((menu) =>
//       menuOrChildrenMatch(menu)
//     );
//   }, [
//     rootMenus,
//     searchText,
//     normalizedMenus,
//   ]);

//   // =========================================================
//   // PERMISSION
//   // =========================================================

//   const setMenuPermission = (
//     menuId,
//     permission
//   ) => {
//     setPermissionMap((prev) => ({
//       ...prev,
//       [menuId]: permission,
//     }));
//   };

//   const getMenuPermission = (menuId) => {
//     return (
//       permissionMap[menuId] || "DENY"
//     );
//   };

//   // =========================================================
//   // EXPAND / COLLAPSE
//   // =========================================================

//   const toggleMenu = (menuId) => {
//     setExpandedMenus((prev) => {
//       const next = new Set(prev);

//       if (next.has(menuId)) {
//         next.delete(menuId);
//       } else {
//         next.add(menuId);
//       }

//       return next;
//     });
//   };

//   const expandAll = () => {
//     const ids = normalizedMenus
//       .filter(
//         (menu) =>
//           getChildren(menu.id).length > 0
//       )
//       .map((menu) => menu.id);

//     setExpandedMenus(new Set(ids));
//   };

//   const collapseAll = () => {
//     setExpandedMenus(new Set());
//   };

//   // =========================================================
//   // ALLOW / DENY ALL
//   // =========================================================

//   const allowAll = () => {
//     const newMap = {};

//     normalizedMenus.forEach((menu) => {
//       newMap[menu.id] = "ALLOW";
//     });

//     setPermissionMap(newMap);
//   };

//   const denyAll = () => {
//     const newMap = {};

//     normalizedMenus.forEach((menu) => {
//       newMap[menu.id] = "DENY";
//     });

//     setPermissionMap(newMap);
//   };

//   // =========================================================
//   // RESET
//   // =========================================================

//   const handleReset = () => {
//     loadRoleMapping();
//   };

//   // =========================================================
//   // SAVE
//   // =========================================================

//   const handleSave = async () => {
//     if (!selectedRoleId) {
//       alert("Please select a role.");
//       return;
//     }

//     if (
//       hasDepartments &&
//       !selectedDepartmentId
//     ) {
//       alert("Please select a department.");
//       return;
//     }

//     if (
//       hasDepartments &&
//       !selectedVerticalId
//     ) {
//       alert("Please select a vertical.");
//       return;
//     }

//     try {
//       setSaving(true);

//       const allowedMenuIds = Object.entries(
//         permissionMap
//       )
//         .filter(
//           ([_, access]) =>
//             access === "ALLOW"
//         )
//         .map(([menuId]) =>
//           Number(menuId)
//         );

//       const payload = {
//         roleId: Number(selectedRoleId),

//         contextTypeId:
//           Number(selectedContextTypeId),

//         departmentId: hasDepartments
//           ? Number(selectedDepartmentId)
//           : null,

//         verticleId:
//           Number(selectedVerticalId),

//         menuIds: allowedMenuIds,
//       };

//       await axios.post(
//         saveRoleMenuMappingEndPoint,
//         payload,
//         {
//           headers: {
//             ...authHeaders,
//             "Content-Type":
//               "application/json",
//           },
//         }
//       );

//       alert(
//         "Role menu mapping saved successfully."
//       );

//       await loadRoleMapping();
//     } catch (error) {
//       console.error(
//         "Error saving role menu mapping:",
//         error
//       );

//       console.error(
//         "Backend response:",
//         error.response?.data
//       );

//       alert(
//         error.response?.data?.message ||
//           "Error while saving role menu mapping."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // =========================================================
//   // SELECTED INFORMATION
//   // =========================================================

//   const selectedRole = useMemo(() => {
//     return roles.find(
//       (role) =>
//         Number(role.id) ===
//         Number(selectedRoleId)
//     );
//   }, [roles, selectedRoleId]);

//   const selectedDepartment = useMemo(() => {
//     return departments.find(
//       (department) =>
//         Number(department.id) ===
//         Number(selectedDepartmentId)
//     );
//   }, [
//     departments,
//     selectedDepartmentId,
//   ]);

//   const selectedVertical = useMemo(() => {
//     return verticles.find(
//       (vertical) =>
//         Number(vertical.id) ===
//         Number(selectedVerticalId)
//     );
//   }, [
//     verticles,
//     selectedVerticalId,
//   ]);

//   // =========================================================
//   // RENDER MENU ROW
//   // =========================================================

//   const renderMenu = (
//     menu,
//     level = 0
//   ) => {
//     const children = getChildren(menu.id);

//     const hasChildren =
//       children.length > 0;

//     const expanded =
//       expandedMenus.has(menu.id);

//     const shouldShow =
//       !searchText.trim() ||
//       menuMatchesSearch(menu) ||
//       children.some((child) =>
//         menuOrChildrenMatch(child)
//       );

//     if (!shouldShow) {
//       return null;
//     }

//     const permission =
//       getMenuPermission(menu.id);

//     return (
//       <React.Fragment key={menu.id}>
//         <div
//           className={`flex items-center border-b border-gray-100 hover:bg-gray-50 ${
//             level > 0
//               ? "bg-gray-50/40"
//               : "bg-white"
//           }`}
//         >
//           {/* MENU NAME */}

//           <div
//             className="flex-1 min-w-0 flex items-center py-1.5"
//             style={{
//               paddingLeft: `${12 + level * 22}px`,
//             }}
//           >
//             {hasChildren ? (
//               <button
//                 type="button"
//                 onClick={() =>
//                   toggleMenu(menu.id)
//                 }
//                 className="mr-1 p-0.5 rounded hover:bg-gray-200"
//               >
//                 {expanded ? (
//                   <ChevronDown
//                     size={14}
//                   />
//                 ) : (
//                   <ChevronRight
//                     size={14}
//                   />
//                 )}
//               </button>
//             ) : (
//               <span className="w-[20px]" />
//             )}

//             <span
//               className={`text-[13px] truncate ${
//                 level === 0
//                   ? "font-medium text-gray-800"
//                   : "text-gray-600"
//               }`}
//             >
//               {menu.name}
//             </span>
//           </div>

//           {/* ALLOW */}

//           <div className="w-[90px] flex justify-center">
//             <label className="cursor-pointer">
//               <input
//                 type="radio"
//                 name={`permission-${menu.id}`}
//                 checked={
//                   permission === "ALLOW"
//                 }
//                 onChange={() =>
//                   setMenuPermission(
//                     menu.id,
//                     "ALLOW"
//                   )
//                 }
//                 className="sr-only"
//               />

//               <span
//                 className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
//                   permission === "ALLOW"
//                     ? "border-green-500 bg-green-50 text-green-600"
//                     : "border-gray-300 text-transparent"
//                 }`}
//               >
//                 <Check size={14} />
//               </span>
//             </label>
//           </div>

//           {/* DENY */}

//           <div className="w-[90px] flex justify-center">
//             <label className="cursor-pointer">
//               <input
//                 type="radio"
//                 name={`permission-${menu.id}`}
//                 checked={
//                   permission === "DENY"
//                 }
//                 onChange={() =>
//                   setMenuPermission(
//                     menu.id,
//                     "DENY"
//                   )
//                 }
//                 className="sr-only"
//               />

//               <span
//                 className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
//                   permission === "DENY"
//                     ? "border-red-400 bg-red-50 text-red-500"
//                     : "border-gray-300 text-transparent"
//                 }`}
//               >
//                 <Minus size={14} />
//               </span>
//             </label>
//           </div>
//         </div>

//         {hasChildren && expanded && (
//           <div>
//             {children.map((child) =>
//               renderMenu(
//                 child,
//                 level + 1
//               )
//             )}
//           </div>
//         )}
//       </React.Fragment>
//     );
//   };

//   // =========================================================
//   // UI
//   // =========================================================

//   return (
//     <div className="w-full h-full bg-gray-50 p-3">
//       {/* =====================================================
//           HEADER
//       ===================================================== */}

//       <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 mb-3 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-md bg-indigo-50 flex items-center justify-center">
//             <Shield
//               size={17}
//               className="text-indigo-600"
//             />
//           </div>

//           <div>
//             <h1 className="text-lg font-semibold text-gray-800 leading-5">
//               Role Menu Mapping
//             </h1>

//             <p className="text-[11px] text-gray-500">
//               Configure default menu access for each role
//             </p>
//           </div>
//         </div>

//         {selectedRole && (
//           <div className="flex items-center gap-2 text-xs">
//             <span className="text-gray-400">
//               Selected:
//             </span>

//             <span className="font-medium text-gray-700">
//               {selectedRole.roleName}
//             </span>
//           </div>
//         )}
//       </div>

//       {/* =====================================================
//           MAIN 2 COLUMN LAYOUT
//       ===================================================== */}

//       <div className="grid grid-cols-12 gap-3">
//         {/* ===================================================
//             LEFT PANEL
//         =================================================== */}

//         <div className="col-span-4">
//           <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//             {/* PANEL HEADER */}

//             <div className="px-3 py-2 border-b border-gray-200 flex items-center gap-2">
//               <Shield
//                 size={15}
//                 className="text-indigo-600"
//               />

//               <span className="text-sm font-semibold text-gray-700">
//                 Role & Scope
//               </span>
//             </div>

//             <div className="p-3 space-y-3">
//               {/* CONTEXT */}

//               <div>
//                 <label className="block text-[11px] font-medium text-gray-600 mb-1">
//                   Context
//                 </label>

//                 <select
//                   value={
//                     selectedContextTypeId
//                   }
//                   onChange={(e) => {
//                     setSelectedContextTypeId(
//                       e.target.value
//                     );
//                     setSelectedDepartmentId(
//                       ""
//                     );
//                     setSelectedRoleId("");
//                     setSelectedVerticalId(
//                       0
//                     );
//                     setPermissionMap({});
//                   }}
//                   disabled={
//                     loadingContextTypes
//                   }
//                   className="w-full h-8 px-2 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                 >
//                   <option value="">
//                     Select Context
//                   </option>

//                   {contextTypes.map(
//                     (context) => (
//                       <option
//                         key={context.id}
//                         value={context.id}
//                       >
//                         {context.contextTypeName ||
//                           context.contextName ||
//                           context.name}
//                       </option>
//                     )
//                   )}
//                 </select>
//               </div>

//               {/* DEPARTMENT */}

//               <div>
//                 <label className="block text-[11px] font-medium text-gray-600 mb-1">
//                   Department
//                 </label>

//                 <select
//                   value={
//                     selectedDepartmentId
//                   }
//                   onChange={(e) => {
//                     setSelectedDepartmentId(
//                       e.target.value
//                     );
//                     setSelectedVerticalId(
//                       0
//                     );
//                   }}
//                   disabled={
//                     !hasDepartments ||
//                     loadingDepartments
//                   }
//                   className={`w-full h-8 px-2 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
//                     !hasDepartments
//                       ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
//                       : "bg-white border-gray-300"
//                   }`}
//                 >
//                   <option value="">
//                     {hasDepartments
//                       ? "Select Department"
//                       : "Not Applicable"}
//                   </option>

//                   {departments.map(
//                     (department) => (
//                       <option
//                         key={department.id}
//                         value={department.id}
//                       >
//                         {
//                           department.departmentName
//                         }
//                       </option>
//                     )
//                   )}
//                 </select>
//               </div>

//               {/* ROLE */}

//               <div>
//                 <label className="block text-[11px] font-medium text-gray-600 mb-1">
//                   Role
//                 </label>

//                 <select
//                   value={
//                     selectedRoleId
//                   }
//                   onChange={(e) =>
//                     setSelectedRoleId(
//                       e.target.value
//                     )
//                   }
//                   disabled={
//                     loadingRoles ||
//                     !selectedContextTypeId ||
//                     (hasDepartments &&
//                       !selectedDepartmentId)
//                   }
//                   className="w-full h-8 px-2 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                 >
//                   <option value="">
//                     Select Role
//                   </option>

//                   {filteredRoles.map(
//                     (role) => (
//                       <option
//                         key={role.id}
//                         value={role.id}
//                       >
//                         {role.roleName}
//                       </option>
//                     )
//                   )}
//                 </select>

//                 {selectedContextTypeId &&
//                   filteredRoles.length ===
//                     0 && (
//                     <p className="mt-1 text-[10px] text-gray-400">
//                       No roles available
//                       for this selection.
//                     </p>
//                   )}
//               </div>

//               {/* VERTICAL */}

//               <div>
//                 <label className="block text-[11px] font-medium text-gray-600 mb-1">
//                   Vertical
//                 </label>

//                 <select
//                   value={
//                     selectedVerticalId
//                   }
//                   onChange={(e) =>
//                     setSelectedVerticalId(
//                       Number(
//                         e.target.value
//                       )
//                     )
//                   }
//                   disabled={
//                     !hasDepartments ||
//                     !selectedDepartmentId ||
//                     loadingVerticles
//                   }
//                   className={`w-full h-8 px-2 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
//                     !hasDepartments
//                       ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
//                       : "bg-white border-gray-300"
//                   }`}
//                 >
//                   <option value={0}>
//                     {hasDepartments
//                       ? "Select Vertical"
//                       : "Not Applicable"}
//                   </option>

//                   {filteredVerticles.map(
//                     (vertical) => (
//                       <option
//                         key={vertical.id}
//                         value={vertical.id}
//                       >
//                         {vertical.category}
//                       </option>
//                     )
//                   )}
//                 </select>
//               </div>

//               {/* SCOPE INFO */}

//               <div className="border-t border-gray-100 pt-2.5">
//                 <div className="flex items-center gap-1.5 mb-1.5">
//                   <Info
//                     size={13}
//                     className="text-gray-400"
//                   />

//                   <span className="text-[11px] font-medium text-gray-500">
//                     Mapping Scope
//                   </span>
//                 </div>

//                 <div className="flex flex-wrap gap-1">
//                   {selectedContextTypeId && (
//                     <span className="px-1.5 py-0.5 text-[10px] rounded bg-indigo-50 text-indigo-600">
//                       Context
//                     </span>
//                   )}

//                   {hasDepartments &&
//                     selectedDepartmentId && (
//                       <span className="px-1.5 py-0.5 text-[10px] rounded bg-blue-50 text-blue-600">
//                         Department
//                       </span>
//                     )}

//                   {hasDepartments &&
//                     selectedVerticalId && (
//                       <span className="px-1.5 py-0.5 text-[10px] rounded bg-purple-50 text-purple-600">
//                         Vertical
//                       </span>
//                     )}

//                   <span className="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 text-gray-600">
//                     Role
//                   </span>
//                 </div>
//               </div>

//               {/* SELECTED SUMMARY */}

//               {selectedRole && (
//                 <div className="bg-gray-50 border border-gray-200 rounded-md p-2">
//                   <div className="text-[10px] text-gray-400 mb-0.5">
//                     Selected Role
//                   </div>

//                   <div className="text-xs font-medium text-gray-700">
//                     {selectedRole.roleName}
//                   </div>

//                   {selectedDepartment && (
//                     <div className="text-[10px] text-gray-500 mt-0.5">
//                       {
//                         selectedDepartment.departmentName
//                       }
//                     </div>
//                   )}

//                   {selectedVertical && (
//                     <div className="text-[10px] text-gray-500">
//                       {
//                         selectedVertical.category
//                       }
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ===================================================
//             RIGHT PANEL
//         =================================================== */}

//         <div className="col-span-8">
//           <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//             {/* MENU HEADER */}

//             <div className="px-3 py-2 border-b border-gray-200">
//               <div className="flex items-center justify-between gap-2">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-semibold text-gray-700">
//                     Menu Access
//                   </span>

//                   {loadingMapping && (
//                     <span className="text-[10px] text-gray-400">
//                       Loading...
//                     </span>
//                   )}
//                 </div>

//                 {/* SEARCH */}

//                 <div className="relative w-52">
//                   <Search
//                     size={14}
//                     className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
//                   />

//                   <input
//                     type="text"
//                     value={searchText}
//                     onChange={(e) =>
//                       setSearchText(
//                         e.target.value
//                       )
//                     }
//                     placeholder="Search menu..."
//                     className="w-full h-7 pl-7 pr-2 text-[11px] border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                   />
//                 </div>
//               </div>

//               {/* TOOLBAR */}

//               <div className="flex items-center justify-between mt-2">
//                 <div className="flex items-center gap-1">
//                   <button
//                     type="button"
//                     onClick={expandAll}
//                     className="px-2 py-1 text-[10px] text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
//                   >
//                     Expand All
//                   </button>

//                   <button
//                     type="button"
//                     onClick={collapseAll}
//                     className="px-2 py-1 text-[10px] text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
//                   >
//                     Collapse All
//                   </button>
//                 </div>

//                 <div className="flex items-center gap-1">
//                   <button
//                     type="button"
//                     onClick={allowAll}
//                     className="px-2 py-1 text-[10px] text-green-600 border border-green-200 rounded hover:bg-green-50"
//                   >
//                     Allow All
//                   </button>

//                   <button
//                     type="button"
//                     onClick={denyAll}
//                     className="px-2 py-1 text-[10px] text-red-500 border border-red-200 rounded hover:bg-red-50"
//                   >
//                     Deny All
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* COLUMN HEADER */}

//             <div className="flex items-center bg-gray-50 border-b border-gray-200 h-8">
//               <div className="flex-1 pl-3 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
//                 Menu
//               </div>

//               <div className="w-[90px] text-center text-[10px] font-semibold uppercase tracking-wide text-green-600">
//                 Allow
//               </div>

//               <div className="w-[90px] text-center text-[10px] font-semibold uppercase tracking-wide text-red-500">
//                 Deny
//               </div>
//             </div>

//             {/* MENU LIST */}

//             <div className="max-h-[calc(100vh-270px)] overflow-y-auto">
//               {loadingMenuStructure ? (
//                 <div className="py-8 text-center text-xs text-gray-400">
//                   Loading menu structure...
//                 </div>
//               ) : visibleRootMenus.length ===
//                 0 ? (
//                 <div className="py-8 text-center text-xs text-gray-400">
//                   {!selectedContextTypeId
//                     ? "Select a context."
//                     : hasDepartments &&
//                       !selectedDepartmentId
//                     ? "Select a department."
//                     : "No menus available."}
//                 </div>
//               ) : (
//                 visibleRootMenus.map(
//                   (menu) =>
//                     renderMenu(menu)
//                 )
//               )}
//             </div>

//             {/* FOOTER */}

//             <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
//               <div className="text-[10px] text-gray-400">
//                 {normalizedMenus.length} menu
//                 {normalizedMenus.length !==
//                 1
//                   ? "s"
//                   : ""}{" "}
//                 available
//               </div>

//               <div className="flex items-center gap-1.5">
//                 <button
//                   type="button"
//                   onClick={handleReset}
//                   disabled={
//                     saving ||
//                     loadingMapping
//                   }
//                   className="h-7 px-2.5 flex items-center gap-1 text-[11px] text-gray-600 border border-gray-300 bg-white rounded-md hover:bg-gray-50 disabled:opacity-50"
//                 >
//                   <RotateCcw
//                     size={12}
//                   />

//                   Reset
//                 </button>

//                 <button
//                   type="button"
//                   onClick={handleSave}
//                   disabled={
//                     saving ||
//                     !selectedRoleId ||
//                     loadingMapping
//                   }
//                   className="h-7 px-3 flex items-center gap-1 text-[11px] text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
//                 >
//                   <Save size={12} />

//                   {saving
//                     ? "Saving..."
//                     : "Save Mapping"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoleMenuMapping;


import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  ChevronDown,
  ChevronRight,
  Search,
  Save,
  RotateCcw,
  Shield,
  Info,
  ArrowRight,
  ArrowLeft,
  GripVertical,
  FolderTree,
  FolderCheck,
  Layers3,
  Check,
  X,
} from "lucide-react";

import config from "../config";
import { useGetSessionUser } from "../SessionContext";

// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL = config.apiUrl;

const NO_DEPARTMENT_ID = 0;
const NO_VERTICAL_ID = 0;

const loadContextTypesEndPoint =
  `${API_BASE_URL}/MasterData/GetContextTypeList`;

const loadDepartmentsEndPoint =
  `${API_BASE_URL}/MasterData/GetDepartmentMasterList`;

const loadRolesEndPoint =
  `${API_BASE_URL}/Users/GetRolesList`;

const loadVerticlesEndPoint =
  `${API_BASE_URL}/MasterData/GetLeadCategoryMasterList`;

const loadMenuStructureEndPoint =
  `${API_BASE_URL}/RolePermission/GetMenuStructure`;

const loadRoleMenuMappingEndPoint =
  `${API_BASE_URL}/RolePermission/GetMapping`;

const saveRoleMenuMappingEndPoint =
  `${API_BASE_URL}/RolePermission/SaveMapping`;

// ============================================================
// STYLE CONSTANTS
// ============================================================

const styles = {
  page:
    "h-screen flex flex-col overflow-hidden bg-slate-50 text-slate-800",

  header:
    "px-6 pt-3 pb-2 shrink-0",

  headerTitle:
    "text-lg font-semibold text-slate-900 tracking-tight",

  breadcrumbRow:
    "flex items-center gap-1.5 mt-1 text-xs",

  breadcrumbMuted:
    "text-slate-400",

  breadcrumbSeparator:
    "text-slate-300",

  breadcrumbActive:
    "font-medium text-slate-700",

  contentWrapper:
    "px-6 pb-5 flex-1 min-h-0 flex flex-col",

  card:
    "grid grid-cols-[235px_minmax(0,1fr)] rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 flex-1 min-h-0 overflow-hidden",

  leftPanel:
    "border-r border-slate-200 bg-white p-3 overflow-y-auto",

  leftPanelHeaderRow:
    "flex items-center gap-2.5 mb-3.5",

  leftPanelIconWrap:
    "flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600",

  leftPanelTitle:
    "text-sm font-semibold text-slate-900 leading-tight",

  leftPanelSubtitle:
    "text-[10px] text-slate-400 mt-0.5",

  fieldGroup:
    "mb-3",

  fieldGroupLast:
    "mb-3.5",

  fieldLabel:
    "block mb-1.5 text-[11px] font-semibold text-slate-600",

  fieldHint:
    "mt-1 text-[10px] text-slate-400",

  selectWrap:
    "relative",

  select: `
    w-full appearance-none rounded-md border border-slate-300 bg-white
    px-2.5 py-1.5 pr-8 text-[11px] text-slate-700 outline-none
    transition
    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
    disabled:bg-slate-50 disabled:text-slate-400
  `,

  selectChevron:
    "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400",

  mappingSection:
    "border-t border-slate-200 pt-3",

  mappingSectionLabel:
    "text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2",

  mappingBox:
    "rounded-lg border border-slate-200 bg-slate-50/70 p-2",

  mappingRow:
    "flex justify-between items-center mb-1.5",

  mappingRowLast:
    "flex justify-between items-center",

  mappingRowLabel:
    "text-[11px] text-slate-500",

  mappingAllowedValue:
    "text-[11px] font-bold text-emerald-600",

  mappingDeniedValue:
    "text-[11px] font-bold text-rose-500",

  mappingTotalRow:
    "border-t border-slate-200 mt-1.5 pt-1.5 flex justify-between items-center",

  mappingTotalLabel:
    "text-[11px] font-semibold text-slate-600",

  mappingTotalValue:
    "text-[11px] font-bold text-slate-800",

  selectedBox:
    "rounded-lg border border-indigo-100 bg-indigo-50/50 p-2.5 mt-3",

  selectedBoxLabel:
    "text-[9px] uppercase tracking-wide font-semibold text-indigo-400",

  selectedBoxValue:
    "text-[11px] font-semibold text-slate-700 mt-0.5",

  selectedBoxSub:
    "text-[10px] text-slate-500 mt-0.5",

  mainArea:
    "min-w-0 flex flex-col h-full min-h-0",

  toolbar:
    "flex items-center justify-between px-3.5 py-2 bg-white border-b border-slate-200 shrink-0 gap-3",

  searchInputWrap:
    "relative w-60 shrink-0",

  searchIcon:
    "absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400",

  searchInput: `
    w-full rounded-md border border-slate-300 bg-slate-50
    py-1.5 pl-8 pr-3 text-[11px] outline-none
    transition
    focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
  `,

  toolbarActions:
    "flex items-center gap-1.5",

  toolbarButton: `
    flex items-center gap-1.5
    rounded-md border border-slate-300 bg-white
    px-2.5 py-1.5
    text-[10px] font-medium text-slate-600
    hover:bg-slate-50 hover:border-slate-400
    transition
    disabled:opacity-40 disabled:cursor-not-allowed
  `,

  splitRow:
    "flex flex-1 min-h-0 bg-slate-50/30",

  treePanel:
    "flex-1 min-w-0 flex flex-col",

  treePanelDivider:
    "border-r border-slate-200",

  treePanelHeader:
    "flex items-center justify-between px-3.5 py-2 border-b border-slate-200 bg-white shrink-0",

  treePanelHeaderLeft:
    "flex items-center gap-2",

  treePanelTitle:
    "text-[11px] font-semibold text-slate-700",

  treePanelCount:
    "text-[9px] font-semibold rounded-full min-w-[20px] text-center px-1.5 py-0.5 bg-slate-100 text-slate-500",

  treePanelBody:
    "flex-1 min-h-0 overflow-y-auto p-2.5 transition-all",

  treePanelBodyDragOver:
    "bg-indigo-50/60 ring-1 ring-inset ring-indigo-300",

  emptyState:
    "flex flex-col items-center justify-center h-full min-h-[160px] px-3 text-center text-[11px] text-slate-400",

  nodeRow:
    "group flex items-center gap-1.5 min-h-[34px] py-1.5 rounded-lg pr-2 transition border border-transparent",

  nodeRowActive:
    "bg-white/85 hover:bg-white hover:border-slate-200 hover:shadow-sm cursor-grab active:cursor-grabbing",

  nodeRowPath:
    "bg-slate-50/60 border-slate-100",

  nodeRowGhost:
    "opacity-40",

  expandButton:
    "flex h-5 w-5 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 shrink-0 transition",

  expandSpacer:
    "w-5 shrink-0",

  gripIcon:
    "text-slate-300 shrink-0 group-hover:text-slate-400",

  gripSpacer:
    "w-3.5 shrink-0",

  parentIcon:
    "text-indigo-500 shrink-0",

  childIcon:
    "text-slate-400 shrink-0",

  nodeNameActive:
    "text-[11.5px] font-medium text-slate-700 truncate",

  nodeNamePath:
    "text-[11px] text-slate-400 truncate",

  submenuBadge:
    "text-[8px] font-semibold text-indigo-500 bg-indigo-50 rounded-full px-1.5 py-0.5 shrink-0",

  moveButton:
    "ml-auto flex h-6 w-6 items-center justify-center rounded-md text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 shrink-0 transition",

  childBranch:
    "ml-3 border-l border-slate-200 pl-2 space-y-1",

  childBranchActive:
    "border-indigo-100",

  legendRow:
    "flex items-center gap-2 px-3.5 py-1.5 border-t border-slate-200 bg-white text-[9px] text-slate-400 shrink-0",

  footer:
    "flex items-center justify-between border-t border-slate-200 bg-white px-3.5 py-2 shrink-0",

  resetButton: `
    flex items-center gap-1.5 rounded-md border border-slate-300 bg-white
    px-3 py-1.5 text-[10px] font-medium text-slate-600
    hover:bg-slate-50 disabled:opacity-40
  `,

  footerRightActions:
    "flex items-center gap-2",

  saveButton: `
    flex items-center gap-1.5 rounded-md bg-indigo-600
    px-3.5 py-1.5 text-[10px] font-semibold text-white
    hover:bg-indigo-700 transition
    disabled:opacity-60 disabled:cursor-not-allowed
  `,
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const RoleMenuMapping = () => {
  const { user: sessionUser } = useGetSessionUser();

  // =========================================================
  // AUTH
  // =========================================================

  const authHeaders = useMemo(() => {
    if (!sessionUser?.token) return {};

    return {
      Authorization: `Bearer ${sessionUser.token}`,
    };
  }, [sessionUser]);

  // =========================================================
  // MASTER DATA
  // =========================================================

  const [contextTypes, setContextTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [verticles, setVerticles] = useState([]);

  const [selectedContextTypeId, setSelectedContextTypeId] =
    useState("");

  const [selectedDepartmentId, setSelectedDepartmentId] =
    useState("");

  const [selectedRoleId, setSelectedRoleId] =
    useState("");

  /*
   * IMPORTANT:
   * Blank = no vertical selected.
   *
   * We do NOT automatically select the first vertical.
   */
  const [selectedVerticalId, setSelectedVerticalId] =
    useState(0);

  // =========================================================
  // LOADING
  // =========================================================

  const [loadingContextTypes, setLoadingContextTypes] =
    useState(false);

  const [loadingDepartments, setLoadingDepartments] =
    useState(false);

  const [loadingRoles, setLoadingRoles] =
    useState(false);

  const [loadingVerticles, setLoadingVerticles] =
    useState(false);

  const [loadingMenuStructure, setLoadingMenuStructure] =
    useState(false);

  const [loadingMapping, setLoadingMapping] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  // =========================================================
  // MENU
  // =========================================================

  const [menuStructure, setMenuStructure] =
    useState([]);

  const [expandedMenus, setExpandedMenus] =
    useState(new Set());

  const [permissionMap, setPermissionMap] =
    useState({});

  const [searchText, setSearchText] =
    useState("");

  // =========================================================
  // DRAG / DROP
  // =========================================================

  const [draggingId, setDraggingId] =
    useState(null);

  const [dragOverSide, setDragOverSide] =
    useState(null);

  // =========================================================
  // CONTEXT HELPERS
  // =========================================================

  const selectedContext = useMemo(() => {
    return contextTypes.find(
      (x) =>
        Number(x.id) ===
        Number(selectedContextTypeId)
    );
  }, [
    contextTypes,
    selectedContextTypeId,
  ]);

  const selectedContextName = useMemo(() => {
    return String(
      selectedContext?.contextTypeName ||
      selectedContext?.contextName ||
      selectedContext?.name ||
      ""
    ).toLowerCase();
  }, [selectedContext]);

  // =========================================================
  // CONTEXT-SPECIFIC DEPARTMENTS
  // =========================================================
  /*
   * IMPORTANT CHANGE:
   *
   * Do NOT assume:
   *
   * Executive = no department
   * Administrative = no department
   * Functional = department
   *
   * DepartmentMaster itself now contains ContextTypeId.
   *
   * Therefore:
   *
   * Executive
   *   -> Executive Operations
   *
   * Functional
   *   -> Sales
   *   -> Operations
   *   -> InfoCell
   *
   * Administrative
   *   -> Adminisrative Operations
   *
   * are all handled from DB data.
   */

  const contextDepartments = useMemo(() => {
    if (!selectedContextTypeId) {
      return [];
    }

    return departments.filter(
      (department) => {
        const departmentContextTypeId =
          department.contextTypeId ??
          department.ContextTypeId ??
          department.contextTypeID ??
          department.ContextTypeID;

        /*
         * If ContextTypeId is present,
         * use it.
         */
        if (
          departmentContextTypeId !==
            undefined &&
          departmentContextTypeId !== null
        ) {
          return (
            Number(departmentContextTypeId) ===
            Number(selectedContextTypeId)
          );
        }

        /*
         * If backend somehow returns an older DTO
         * without ContextTypeId, don't break the UI.
         *
         * Only the old Functional behavior remains
         * as a fallback.
         */
        return (
          Number(selectedContextTypeId) === 2
        );
      }
    );
  }, [
    departments,
    selectedContextTypeId,
  ]);

  /*
   * A context HAS departments if the DB returned
   * departments for that context.
   */
  const hasDepartments =
    contextDepartments.length > 0;

  // =========================================================
  // LOAD CONTEXT TYPES
  // =========================================================

  useEffect(() => {
    const fetchContextTypes = async () => {
      try {
        setLoadingContextTypes(true);

        const response = await axios.get(
          loadContextTypesEndPoint,
          {
            headers: authHeaders,
          }
        );

        const data = Array.isArray(
          response.data
        )
          ? response.data
          : [];

        setContextTypes(data);

        if (data.length > 0) {
          setSelectedContextTypeId(
            Number(data[0].id)
          );
        }
      } catch (error) {
        console.error(
          "Error loading context types:",
          error
        );
      } finally {
        setLoadingContextTypes(false);
      }
    };

    if (sessionUser?.token) {
      fetchContextTypes();
    }
  }, [
    sessionUser?.token,
    authHeaders,
  ]);

  // =========================================================
  // LOAD DEPARTMENTS
  // =========================================================

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);

        const response = await axios.get(
          loadDepartmentsEndPoint,
          {
            headers: authHeaders,
          }
        );

        setDepartments(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "Error loading departments:",
          error
        );

        setDepartments([]);
      } finally {
        setLoadingDepartments(false);
      }
    };

    if (sessionUser?.token) {
      fetchDepartments();
    }
  }, [
    sessionUser?.token,
    authHeaders,
  ]);

  // =========================================================
  // FILTERED DEPARTMENTS
  // =========================================================

  const filteredDepartments =
    contextDepartments;

  // =========================================================
  // LOAD ROLES
  // =========================================================

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);

        const response = await axios.get(
          loadRolesEndPoint,
          {
            headers: authHeaders,
          }
        );

        setRoles(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "Error loading roles:",
          error
        );

        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    };

    if (sessionUser?.token) {
      fetchRoles();
    }
  }, [
    sessionUser?.token,
    authHeaders,
  ]);

  // =========================================================
  // LOAD VERTICALS
  // =========================================================

  useEffect(() => {
    const fetchVerticles = async () => {
      try {
        setLoadingVerticles(true);

        const response = await axios.get(
          loadVerticlesEndPoint,
          {
            headers: authHeaders,
          }
        );

        setVerticles(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "Error loading verticals:",
          error
        );

        setVerticles([]);
      } finally {
        setLoadingVerticles(false);
      }
    };

    if (sessionUser?.token) {
      fetchVerticles();
    }
  }, [
    sessionUser?.token,
    authHeaders,
  ]);

  // =========================================================
  // FILTERED ROLES
  // =========================================================

  const filteredRoles = useMemo(() => {
    if (!selectedContextTypeId) {
      return [];
    }

    /*
     * If this context has departments,
     * role must belong to selected department.
     */
    if (hasDepartments) {
      if (!selectedDepartmentId) {
        return [];
      }

      return roles.filter(
        (role) =>
          Number(role.contextTypeId) ===
            Number(
              selectedContextTypeId
            ) &&
          Number(role.departmentId) ===
            Number(selectedDepartmentId)
      );
    }

    /*
     * Context has no departments.
     */
    return roles.filter(
      (role) =>
        Number(role.contextTypeId) ===
        Number(selectedContextTypeId)
    );
  }, [
    roles,
    selectedContextTypeId,
    selectedDepartmentId,
    hasDepartments,
  ]);

  // =========================================================
  // SELECT FIRST ROLE
  // =========================================================

  useEffect(() => {
    if (!selectedContextTypeId) {
      setSelectedRoleId("");
      return;
    }

    if (
      hasDepartments &&
      !selectedDepartmentId
    ) {
      setSelectedRoleId("");
      return;
    }

    const availableRoles =
      hasDepartments
        ? roles.filter(
            (role) =>
              Number(
                role.contextTypeId
              ) ===
                Number(
                  selectedContextTypeId
                ) &&
              Number(
                role.departmentId
              ) ===
                Number(
                  selectedDepartmentId
                )
          )
        : roles.filter(
            (role) =>
              Number(
                role.contextTypeId
              ) ===
              Number(
                selectedContextTypeId
              )
          );

    if (availableRoles.length > 0) {
      const currentRoleExists =
        availableRoles.some(
          (role) =>
            Number(role.id) ===
            Number(selectedRoleId)
        );

      if (!currentRoleExists) {
        setSelectedRoleId(
          Number(
            availableRoles[0].id
          )
        );
      }
    } else {
      setSelectedRoleId("");
    }
  }, [
    selectedDepartmentId,
    selectedContextTypeId,
    hasDepartments,
    roles,
    selectedRoleId,
  ]);

  // =========================================================
  // FILTERED VERTICALS
  // =========================================================

  const filteredVerticles = useMemo(() => {
    if (!selectedDepartmentId) {
      return [];
    }

    return verticles.filter(
      (verticle) =>
        Number(
          verticle.departmentId
        ) ===
        Number(
          selectedDepartmentId
        )
    );
  }, [
    verticles,
    selectedDepartmentId,
  ]);

  /*
   * IMPORTANT:
   *
   * We deliberately DO NOT auto-select the first vertical.
   *
   * If verticals exist:
   *   selectedVerticalId = 0
   *   user must select one.
   *
   * If no verticals exist:
   *   selectedVerticalId = 0
   *   save sends null.
   */

  useEffect(() => {
    setSelectedVerticalId(0);
  }, [
    selectedDepartmentId,
  ]);

  // =========================================================
  // LOAD MENU STRUCTURE
  // =========================================================

  useEffect(() => {
    const loadMenus = async () => {
      if (!selectedContextTypeId) {
        setMenuStructure([]);
        return;
      }

      if (
        hasDepartments &&
        !selectedDepartmentId
      ) {
        setMenuStructure([]);
        return;
      }

      try {
        setLoadingMenuStructure(true);

        const response = await axios.get(
          loadMenuStructureEndPoint,
          {
            params: {
              contextTypeId:
                Number(
                  selectedContextTypeId
                ),

              departmentId:
                hasDepartments
                  ? Number(
                      selectedDepartmentId
                    )
                  : NO_DEPARTMENT_ID,
            },

            headers: authHeaders,
          }
        );

        const data = Array.isArray(
          response.data
        )
          ? response.data
          : [];

        setMenuStructure(data);
      } catch (error) {
        console.error(
          "Error loading menu structure:",
          error
        );

        console.error(
          "Backend response:",
          error.response?.data
        );

        setMenuStructure([]);
      } finally {
        setLoadingMenuStructure(false);
      }
    };

    loadMenus();
  }, [
    selectedContextTypeId,
    selectedDepartmentId,
    hasDepartments,
    authHeaders,
  ]);

  // =========================================================
  // LOAD ROLE MENU MAPPING
  // =========================================================

  const loadRoleMapping = async () => {
    if (
      !selectedRoleId ||
      !selectedContextTypeId
    ) {
      setPermissionMap({});
      return;
    }

    if (
      hasDepartments &&
      !selectedDepartmentId
    ) {
      setPermissionMap({});
      return;
    }

    /*
     * IMPORTANT:
     *
     * Only require vertical when the selected
     * department actually has verticals.
     */
    if (
      filteredVerticles.length > 0 &&
      !selectedVerticalId
    ) {
      setPermissionMap({});
      return;
    }

    try {
      setLoadingMapping(true);

      const response = await axios.get(
        loadRoleMenuMappingEndPoint,
        {
          params: {
            roleId:
              Number(selectedRoleId),

            contextTypeId:
              Number(
                selectedContextTypeId
              ),

            departmentId:
              hasDepartments
                ? Number(
                    selectedDepartmentId
                  )
                : NO_DEPARTMENT_ID,

            verticalId:
              filteredVerticles.length > 0
                ? Number(
                    selectedVerticalId
                  )
                : NO_VERTICAL_ID,
          },

          headers: authHeaders,
        }
      );

      const mappings =
        Array.isArray(response.data)
          ? response.data
          : [];

      const newPermissionMap = {};

      mappings.forEach(
        (mapping) => {
          if (
            mapping.menuId != null
          ) {
            newPermissionMap[
              Number(
                mapping.menuId
              )
            ] = "ALLOW";
          }
        }
      );

      setPermissionMap(
        newPermissionMap
      );
    } catch (error) {
      console.error(
        "Error loading role menu mapping:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      setPermissionMap({});
    } finally {
      setLoadingMapping(false);
    }
  };

  useEffect(() => {
    loadRoleMapping();
  }, [
    selectedRoleId,
    selectedContextTypeId,
    selectedDepartmentId,
    selectedVerticalId,
    hasDepartments,
    filteredVerticles.length,
  ]);

  // =========================================================
  // MENU NORMALIZATION
  // =========================================================

  const getMenuId = (menu) =>
    Number(
      menu.id ??
        menu.menuId ??
        menu.menuID ??
        menu.MenuId ??
        menu.MenuID ??
        menu.Id
    );

  const getMenuName = (menu) =>
    menu.name ??
    menu.menuName ??
    menu.MenuName ??
    "";

  const getParentMenuId = (menu) => {
    const value =
      menu.parentMenuId ??
      menu.parent_MenuID ??
      menu.parentMenuID ??
      menu.Parent_MenuID ??
      menu.parentMenuId ??
      menu.ParentMenuID ??
      menu.ParentMenuId;

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return null;
    }

    const numberValue =
      Number(value);

    return Number.isNaN(
      numberValue
    )
      ? null
      : numberValue;
  };

  const getNestedMenus = (menu) => {
    const nested =
      menu.children ??
      menu.subMenus ??
      menu.subMenu ??
      menu.submenus ??
      menu.childMenus ??
      menu.childMenu ??
      menu.menuItems ??
      menu.items ??
      menu.Children ??
      menu.SubMenus ??
      menu.SubMenu ??
      menu.ChildMenus ??
      menu.ChildMenu ??
      menu.MenuItems ??
      menu.Items ??
      [];

    return Array.isArray(nested)
      ? nested
      : [];
  };

  const normalizedMenus = useMemo(() => {
    if (
      !Array.isArray(
        menuStructure
      )
    ) {
      return [];
    }

    const normalized = [];

    const walk = (
      menus,
      inheritedParentId = null
    ) => {
      menus.forEach((menu) => {
        const id = getMenuId(menu);

        if (!Number.isFinite(id)) {
          return;
        }

        const explicitParentId =
          getParentMenuId(menu);

        const nestedMenus =
          getNestedMenus(menu);

        normalized.push({
          ...menu,

          id,

          name: getMenuName(menu),

          parentMenuId:
            explicitParentId ??
            inheritedParentId,
        });

        if (nestedMenus.length > 0) {
          walk(nestedMenus, id);
        }
      });
    };

    walk(menuStructure);

    return normalized;
  }, [menuStructure]);

  // =========================================================
  // BUILD REAL HIERARCHICAL TREE
  // =========================================================

  const menuTree = useMemo(() => {
    const menuMap = new Map();

    normalizedMenus.forEach(
      (menu) => {
        menuMap.set(
          menu.id,
          {
            ...menu,
            children: [],
          }
        );
      }
    );

    const roots = [];

    normalizedMenus.forEach(
      (menu) => {
        const current =
          menuMap.get(
            menu.id
          );

        if (
          menu.parentMenuId ===
            null ||
          menu.parentMenuId ===
            0 ||
          !menuMap.has(
            menu.parentMenuId
          )
        ) {
          roots.push(
            current
          );
        } else {
          const parent =
            menuMap.get(
              menu.parentMenuId
            );

          parent.children.push(
            current
          );
        }
      }
    );

    return roots;
  }, [normalizedMenus]);

  // =========================================================
  // EXPAND ALL WHEN NEW MENU TREE LOADS
  // =========================================================

  useEffect(() => {
    if (!menuTree.length) {
      setExpandedMenus(
        new Set()
      );
      return;
    }

    const ids = [];

    const collect = (nodes) => {
      nodes.forEach(
        (node) => {
          if (
            node.children &&
            node.children.length > 0
          ) {
            ids.push(node.id);
            collect(
              node.children
            );
          }
        }
      );
    };

    collect(menuTree);

    setExpandedMenus(
      new Set(ids)
    );
  }, [menuTree]);

  // =========================================================
  // PERMISSION
  // =========================================================

  const getMenuPermission = (
    menuId
  ) =>
    permissionMap[menuId] ||
    "DENY";

  // =========================================================
  // DESCENDANTS
  // =========================================================

  const getDescendantIdsFromNode = (
    node
  ) => {
    const result = [
      node.id,
    ];

    (
      node.children || []
    ).forEach(
      (child) => {
        result.push(
          ...getDescendantIdsFromNode(
            child
          )
        );
      }
    );

    return result;
  };

  const getDescendantIds = (
    menuId
  ) => {
    const findNode = (
      nodes
    ) => {
      for (
        const node of nodes
      ) {
        if (
          node.id ===
          menuId
        ) {
          return node;
        }

        const found =
          findNode(
            node.children ||
              []
          );

        if (found)
          return found;
      }

      return null;
    };

    const node =
      findNode(menuTree);

    return node
      ? getDescendantIdsFromNode(
          node
        )
      : [menuId];
  };

  // =========================================================
  // MOVE MENU
  // =========================================================

  const moveToSide = (
    menuId,
    targetPermission
  ) => {
    const ids =
      getDescendantIds(
        menuId
      );

    setPermissionMap(
      (prev) => {
        const next = {
          ...prev,
        };

        ids.forEach(
          (id) => {
            next[id] =
              targetPermission;
          }
        );

        return next;
      }
    );
  };

  // =========================================================
  // EXPAND / COLLAPSE
  // =========================================================

  const toggleMenu = (
    menuId
  ) => {
    setExpandedMenus(
      (prev) => {
        const next =
          new Set(prev);

        if (
          next.has(menuId)
        ) {
          next.delete(
            menuId
          );
        } else {
          next.add(
            menuId
          );
        }

        return next;
      }
    );
  };

  const expandAll = () => {
    const ids = [];

    const collect = (
      nodes
    ) => {
      nodes.forEach(
        (node) => {
          if (
            node.children &&
            node.children.length >
              0
          ) {
            ids.push(
              node.id
            );

            collect(
              node.children
            );
          }
        }
      );
    };

    collect(menuTree);

    setExpandedMenus(
      new Set(ids)
    );
  };

  const collapseAll = () => {
    setExpandedMenus(
      new Set()
    );
  };

  // =========================================================
  // ASSIGN ALL / UNASSIGN ALL
  // =========================================================

  const assignAll = () => {
    const newMap = {};

    normalizedMenus.forEach(
      (menu) => {
        newMap[
          menu.id
        ] = "ALLOW";
      }
    );

    setPermissionMap(
      newMap
    );
  };

  const unassignAll = () => {
    const newMap = {};

    normalizedMenus.forEach(
      (menu) => {
        newMap[
          menu.id
        ] = "DENY";
      }
    );

    setPermissionMap(
      newMap
    );
  };

  // =========================================================
  // RESET
  // =========================================================

  const handleReset = () => {
    loadRoleMapping();
  };

  // =========================================================
  // SAVE
  // =========================================================

  const handleSave = async () => {
    if (!selectedRoleId) {
      alert(
        "Please select a role."
      );
      return;
    }

    if (
      hasDepartments &&
      !selectedDepartmentId
    ) {
      alert(
        "Please select a department."
      );
      return;
    }

    /*
     * Vertical is mandatory only when
     * verticals actually exist.
     */
    if (
      filteredVerticles.length >
        0 &&
      !selectedVerticalId
    ) {
      alert(
        "Please select a vertical."
      );
      return;
    }

    try {
      setSaving(true);

      const allowedMenuIds =
        Object.entries(
          permissionMap
        )
          .filter(
            ([, access]) =>
              access ===
              "ALLOW"
          )
          .map(
            ([menuId]) =>
              Number(menuId)
          );

      const payload = {
        roleId:
          Number(
            selectedRoleId
          ),

        contextTypeId:
          Number(
            selectedContextTypeId
          ),

        /*
         * If no department exists,
         * save NULL.
         */
        departmentId:
          hasDepartments
            ? Number(
                selectedDepartmentId
              )
            : null,

        /*
         * If no vertical exists,
         * save NULL.
         */
        verticleId:
          selectedVerticalId
            ? Number(
                selectedVerticalId
              )
            : null,

        menuIds:
          allowedMenuIds,
      };

      console.log(
        "Role Menu Mapping Payload:",
        payload
      );

      await axios.post(
        saveRoleMenuMappingEndPoint,
        payload,
        {
          headers: {
            ...authHeaders,
            "Content-Type":
              "application/json",
          },
        }
      );

      alert(
        "Role menu mapping saved successfully."
      );

      await loadRoleMapping();
    } catch (error) {
      console.error(
        "Error saving role menu mapping:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Error while saving role menu mapping."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // SELECTED INFORMATION
  // =========================================================

  const selectedRole = useMemo(() => {
    return roles.find(
      (role) =>
        Number(role.id) ===
        Number(
          selectedRoleId
        )
    );
  }, [
    roles,
    selectedRoleId,
  ]);

  const selectedDepartment =
    useMemo(() => {
      return departments.find(
        (department) =>
          Number(
            department.id
          ) ===
          Number(
            selectedDepartmentId
          )
      );
    }, [
      departments,
      selectedDepartmentId,
    ]);

  const selectedVertical =
    useMemo(() => {
      return verticles.find(
        (vertical) =>
          Number(
            vertical.id
          ) ===
          Number(
            selectedVerticalId
          )
      );
    }, [
      verticles,
      selectedVerticalId,
    ]);

  const allowedCount =
    normalizedMenus.filter(
      (menu) =>
        permissionMap[
          menu.id
        ] === "ALLOW"
    ).length;

  const deniedCount =
    normalizedMenus.length -
    allowedCount;

  // =========================================================
  // FILTER TREE BY PERMISSION
  // =========================================================

  const filterTreeByPermission = (
    nodes,
    targetPermission
  ) => {
    const markTree = (
      node
    ) => {
      const children =
        (node.children || []).map(
          markTree
        );

      const selfMatches =
        getMenuPermission(
          node.id
        ) ===
        targetPermission;

      const hasMatchingChild =
        children.some(
          (child) =>
            child.selfMatches ||
            child.hasMatchingDescendant
        );

      return {
        ...node,
        children,
        selfMatches,
        hasMatchingDescendant:
          hasMatchingChild,
      };
    };

    return nodes
      .map(markTree)
      .filter(
        (node) =>
          node.selfMatches ||
          node.hasMatchingDescendant
      )
      .filter(Boolean);
  };

  // =========================================================
  // SEARCH TREE
  // =========================================================

  const filterTreeBySearch = (
    nodes
  ) => {
    const query =
      searchText
        .trim()
        .toLowerCase();

    if (!query) {
      return nodes;
    }

    const walk = (
      node
    ) => {
      const children =
        (
          node.children ||
          []
        )
          .map(walk)
          .filter(Boolean);

      const nameMatches =
        String(
          node.name
        )
          .toLowerCase()
          .includes(query);

      if (
        !nameMatches &&
        children.length ===
          0
      ) {
        return null;
      }

      return {
        ...node,
        children,
      };
    };

    return nodes
      .map(walk)
      .filter(Boolean);
  };

  // =========================================================
  // PANEL TREES
  // =========================================================

  const availableTree = useMemo(() => {
    return filterTreeBySearch(
      filterTreeByPermission(
        menuTree,
        "DENY"
      )
    );
  }, [
    menuTree,
    permissionMap,
    searchText,
  ]);

  const assignedTree = useMemo(() => {
    return filterTreeBySearch(
      filterTreeByPermission(
        menuTree,
        "ALLOW"
      )
    );
  }, [
    menuTree,
    permissionMap,
    searchText,
  ]);

  // =========================================================
  // DRAG & DROP
  // =========================================================

  const handleDragStart = (
    e,
    menuId
  ) => {
    e.dataTransfer.setData(
      "text/plain",
      String(menuId)
    );

    e.dataTransfer.effectAllowed =
      "move";

    setDraggingId(menuId);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverSide(null);
  };

  const handleDragOverPanel = (
    e,
    side
  ) => {
    e.preventDefault();

    e.dataTransfer.dropEffect =
      "move";

    if (
      dragOverSide !==
      side
    ) {
      setDragOverSide(
        side
      );
    }
  };

  const handleDragLeavePanel = (
    side
  ) => {
    setDragOverSide(
      (prev) =>
        prev === side
          ? null
          : prev
    );
  };

  const handleDropOnPanel = (
    e,
    side
  ) => {
    e.preventDefault();

    const id =
      Number(
        e.dataTransfer.getData(
          "text/plain"
        )
      );

    if (id) {
      moveToSide(
        id,
        side === "right"
          ? "ALLOW"
          : "DENY"
      );
    }

    setDraggingId(null);
    setDragOverSide(null);
  };

  // =========================================================
  // RENDER TREE NODE
  // =========================================================
  /*
   * IMPORTANT UI FIX:
   *
   * Previously children were rendered directly:
   *
   * node
   * child
   * child
   *
   * even though the data was hierarchical.
   *
   * Now every child level is rendered inside a nested
   * border/indent container.
   *
   * This does NOT change the overall screen arrangement.
   */

  const renderTreeNode = (
    node,
    level,
    side
  ) => {
    const hasChildren =
      node.children &&
      node.children.length >
        0;

    const expanded =
      expandedMenus.has(
        node.id
      );

    const isParent =
      hasChildren;

    return (
      <React.Fragment
        key={node.id}
      >
        <div
          className={`
            ${styles.nodeRow}
            ${
              node.selfMatches
                ? styles.nodeRowActive
                : styles.nodeRowPath
            }
            ${
              draggingId ===
              node.id
                ? styles.nodeRowGhost
                : ""
            }
          `}
          style={{
            paddingLeft:
              `${5 + level * 20}px`,
          }}
          draggable={
            node.selfMatches
          }
          onDragStart={
            node.selfMatches
              ? (e) =>
                  handleDragStart(
                    e,
                    node.id
                  )
              : undefined
          }
          onDragEnd={
            node.selfMatches
              ? handleDragEnd
              : undefined
          }
        >
          {/* EXPAND */}
          {hasChildren ? (
            <button
              type="button"
              onClick={() =>
                toggleMenu(
                  node.id
                )
              }
              className={
                styles.expandButton
              }
            >
              {expanded ? (
                <ChevronDown
                  size={12}
                />
              ) : (
                <ChevronRight
                  size={12}
                />
              )}
            </button>
          ) : (
            <span
              className={
                styles.expandSpacer
              }
            />
          )}

          {/* DRAG HANDLE / ICON */}
          {node.selfMatches ? (
            <GripVertical
              size={12}
              className={
                styles.gripIcon
              }
            />
          ) : (
            <span
              className={
                styles.gripSpacer
              }
            />
          )}

          {/* MENU ICON */}
          {isParent ? (
            <Layers3
              size={12}
              className={
                node.selfMatches
                  ? styles.parentIcon
                  : styles.childIcon
              }
            />
          ) : (
            <span className="w-3 shrink-0" />
          )}

          {/* MENU NAME */}
          <span
            className={
              node.selfMatches
                ? styles.nodeNameActive
                : styles.nodeNamePath
            }
            title={node.name}
          >
            {node.name}
          </span>

          {/* SUBMENU BADGE */}
          {level > 0 &&
            node.selfMatches && (
              <span
                className={
                  styles.submenuBadge
                }
              >
                Submenu
              </span>
            )}

          {/* MOVE BUTTON */}
          {node.selfMatches && (
            <button
              type="button"
              title={
                side === "left"
                  ? "Assign menu"
                  : "Unassign menu"
              }
              onClick={() =>
                moveToSide(
                  node.id,
                  side === "left"
                    ? "ALLOW"
                    : "DENY"
                )
              }
              className={
                styles.moveButton
              }
            >
              {side === "left" ? (
                <ArrowRight
                  size={13}
                />
              ) : (
                <ArrowLeft
                  size={13}
                />
              )}
            </button>
          )}
        </div>

        {/* =================================================
            CHILDREN

            This wrapper is the important hierarchy fix.
            ================================================= */}

        {hasChildren &&
          expanded && (
            <div
              className={`
                ${styles.childBranch}
                ${
                  node.selfMatches
                    ? styles.childBranchActive
                    : ""
                }
              `}
            >
              {node.children.map(
                (child) =>
                  renderTreeNode(
                    child,
                    level + 1,
                    side
                  )
              )}
            </div>
          )}
      </React.Fragment>
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className={styles.page}>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className={styles.header}>
        <h1
          className={
            styles.headerTitle
          }
        >
          Role Menu Mapping
        </h1>

        <div
          className={
            styles.breadcrumbRow
          }
        >
          <span
            className={
              styles.breadcrumbMuted
            }
          >
            Home
          </span>

          <ChevronRight
            size={11}
            className={
              styles.breadcrumbSeparator
            }
          />

          <span
            className={
              styles.breadcrumbMuted
            }
          >
            Access Control
          </span>

          <ChevronRight
            size={11}
            className={
              styles.breadcrumbSeparator
            }
          />

          <span
            className={
              styles.breadcrumbActive
            }
          >
            Role Menu Mapping
          </span>
        </div>
      </div>

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div
        className={
          styles.contentWrapper
        }
      >
        <div
          className={
            styles.card
          }
        >

          {/* =================================================
              LEFT SIDEBAR
          ================================================= */}

          <div
            className={
              styles.leftPanel
            }
          >

            {/* HEADER */}
            <div
              className={
                styles.leftPanelHeaderRow
              }
            >
              <div
                className={
                  styles.leftPanelIconWrap
                }
              >
                <Shield
                  size={15}
                />
              </div>

              <div>
                <h2
                  className={
                    styles.leftPanelTitle
                  }
                >
                  Role & Scope
                </h2>

                <p
                  className={
                    styles.leftPanelSubtitle
                  }
                >
                  Select mapping scope
                </p>
              </div>
            </div>

            {/* CONTEXT */}
            <div
              className={
                styles.fieldGroup
              }
            >
              <label
                className={
                  styles.fieldLabel
                }
              >
                Context
              </label>

              <div
                className={
                  styles.selectWrap
                }
              >
                <select
                  value={
                    selectedContextTypeId
                  }
                  onChange={(e) => {
                    setSelectedContextTypeId(
                      e.target.value
                    );

                    setSelectedDepartmentId(
                      ""
                    );

                    setSelectedRoleId(
                      ""
                    );

                    setSelectedVerticalId(
                      0
                    );

                    setPermissionMap(
                      {}
                    );

                    setMenuStructure(
                      []
                    );
                  }}
                  disabled={
                    loadingContextTypes
                  }
                  className={
                    styles.select
                  }
                >
                  <option value="">
                    Select Context
                  </option>

                  {contextTypes.map(
                    (context) => (
                      <option
                        key={
                          context.id
                        }
                        value={
                          context.id
                        }
                      >
                        {
                          context.contextTypeName ||
                          context.contextName ||
                          context.name
                        }
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={13}
                  className={
                    styles.selectChevron
                  }
                />
              </div>
            </div>

            {/* DEPARTMENT */}
            <div
              className={
                styles.fieldGroup
              }
            >
              <label
                className={
                  styles.fieldLabel
                }
              >
                Department
              </label>

              <div
                className={
                  styles.selectWrap
                }
              >
                <select
                  value={
                    selectedDepartmentId
                  }
                  onChange={(e) => {
                    setSelectedDepartmentId(
                      e.target.value
                    );

                    setSelectedVerticalId(
                      0
                    );

                    setPermissionMap(
                      {}
                    );
                  }}
                  disabled={
                    !hasDepartments ||
                    loadingDepartments
                  }
                  className={
                    styles.select
                  }
                >
                  <option value="">
                    {hasDepartments
                      ? "Select Department"
                      : "Not Applicable"}
                  </option>

                  {filteredDepartments.map(
                    (department) => (
                      <option
                        key={
                          department.id
                        }
                        value={
                          department.id
                        }
                      >
                        {
                          department.departmentName
                        }
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={13}
                  className={
                    styles.selectChevron
                  }
                />
              </div>

              {!loadingDepartments &&
                selectedContextTypeId &&
                !hasDepartments && (
                  <p
                    className={
                      styles.fieldHint
                    }
                  >
                    Not applicable for this
                    context type
                  </p>
                )}

              {hasDepartments &&
                selectedContextTypeId &&
                filteredDepartments.length ===
                  0 &&
                !loadingDepartments && (
                  <p
                    className={
                      styles.fieldHint
                    }
                  >
                    No departments available
                    for this context.
                  </p>
                )}
            </div>

            {/* ROLE */}
            <div
              className={
                styles.fieldGroup
              }
            >
              <label
                className={
                  styles.fieldLabel
                }
              >
                Role
              </label>

              <div
                className={
                  styles.selectWrap
                }
              >
                <select
                  value={
                    selectedRoleId
                  }
                  onChange={(e) =>
                    setSelectedRoleId(
                      e.target.value
                    )
                  }
                  disabled={
                    loadingRoles ||
                    !selectedContextTypeId ||
                    (
                      hasDepartments &&
                      !selectedDepartmentId
                    )
                  }
                  className={
                    styles.select
                  }
                >
                  <option value="">
                    Select Role
                  </option>

                  {filteredRoles.map(
                    (role) => (
                      <option
                        key={
                          role.id
                        }
                        value={
                          role.id
                        }
                      >
                        {
                          role.roleName
                        }
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={13}
                  className={
                    styles.selectChevron
                  }
                />
              </div>

              {selectedContextTypeId &&
                filteredRoles.length ===
                  0 && (
                  <p
                    className={
                      styles.fieldHint
                    }
                  >
                    No roles available for
                    this selection.
                  </p>
                )}
            </div>

            {/* VERTICAL */}
            <div
              className={
                styles.fieldGroupLast
              }
            >
              <label
                className={
                  styles.fieldLabel
                }
              >
                Vertical

                {filteredVerticles.length >
                  0 && (
                  <span className="text-rose-500 ml-1">
                    *
                  </span>
                )}
              </label>

              <div
                className={
                  styles.selectWrap
                }
              >
                <select
                  value={
                    selectedVerticalId
                  }
                  onChange={(e) =>
                    setSelectedVerticalId(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  disabled={
                    !hasDepartments ||
                    !selectedDepartmentId ||
                    filteredVerticles.length ===
                      0 ||
                    loadingVerticles
                  }
                  className={
                    styles.select
                  }
                >
                  <option value={0}>
                    {!hasDepartments ||
                    !selectedDepartmentId
                      ? "Not Applicable"
                      : filteredVerticles.length >
                        0
                      ? "Select Vertical"
                      : "Not Applicable"}
                  </option>

                  {filteredVerticles.map(
                    (vertical) => (
                      <option
                        key={
                          vertical.id
                        }
                        value={
                          vertical.id
                        }
                      >
                        {
                          vertical.category
                        }
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={13}
                  className={
                    styles.selectChevron
                  }
                />
              </div>

              {!loadingVerticles &&
                hasDepartments &&
                selectedDepartmentId &&
                filteredVerticles.length >
                  0 &&
                !selectedVerticalId && (
                  <p className="mt-1 text-[10px] text-amber-600">
                    Please select a vertical.
                  </p>
                )}

              {!loadingVerticles &&
                selectedDepartmentId &&
                filteredVerticles.length ===
                  0 && (
                  <p
                    className={
                      styles.fieldHint
                    }
                  >
                    No vertical is configured
                    for this department.
                  </p>
                )}

              {!loadingVerticles &&
                !hasDepartments && (
                  <p
                    className={
                      styles.fieldHint
                    }
                  >
                    Not applicable for this
                    context type
                  </p>
                )}
            </div>

            {/* CURRENT MAPPING */}
            <div
              className={
                styles.mappingSection
              }
            >
              <p
                className={
                  styles.mappingSectionLabel
                }
              >
                Current Mapping
              </p>

              <div
                className={
                  styles.mappingBox
                }
              >
                <div
                  className={
                    styles.mappingRow
                  }
                >
                  <span
                    className={
                      styles.mappingRowLabel
                    }
                  >
                    Allowed
                  </span>

                  <span
                    className={
                      styles.mappingAllowedValue
                    }
                  >
                    {allowedCount}
                  </span>
                </div>

                <div
                  className={
                    styles.mappingRowLast
                  }
                >
                  <span
                    className={
                      styles.mappingRowLabel
                    }
                  >
                    Denied
                  </span>

                  <span
                    className={
                      styles.mappingDeniedValue
                    }
                  >
                    {deniedCount}
                  </span>
                </div>

                <div
                  className={
                    styles.mappingTotalRow
                  }
                >
                  <span
                    className={
                      styles.mappingTotalLabel
                    }
                  >
                    Total
                  </span>

                  <span
                    className={
                      styles.mappingTotalValue
                    }
                  >
                    {
                      normalizedMenus.length
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* SELECTED ROLE */}
            {selectedRole && (
              <div
                className={
                  styles.selectedBox
                }
              >
                <div
                  className={
                    styles.selectedBoxLabel
                  }
                >
                  Selected Role
                </div>

                <div
                  className={
                    styles.selectedBoxValue
                  }
                >
                  {
                    selectedRole.roleName
                  }
                </div>

                {selectedDepartment && (
                  <div
                    className={
                      styles.selectedBoxSub
                    }
                  >
                    {
                      selectedDepartment.departmentName
                    }
                  </div>
                )}

                {selectedVertical && (
                  <div
                    className={
                      styles.selectedBoxSub
                    }
                  >
                    {
                      selectedVertical.category
                    }
                  </div>
                )}
              </div>
            )}
          </div>

          {/* =================================================
              MAIN AREA
          ================================================= */}

          <div
            className={
              styles.mainArea
            }
          >

            {/* TOOLBAR */}
            <div
              className={
                styles.toolbar
              }
            >
              <div
                className={
                  styles.searchInputWrap
                }
              >
                <Search
                  size={13}
                  className={
                    styles.searchIcon
                  }
                />

                <input
                  type="text"
                  value={
                    searchText
                  }
                  onChange={(e) =>
                    setSearchText(
                      e.target.value
                    )
                  }
                  placeholder="Search menus..."
                  className={
                    styles.searchInput
                  }
                />
              </div>

              <div
                className={
                  styles.toolbarActions
                }
              >
                <button
                  type="button"
                  onClick={
                    expandAll
                  }
                  disabled={
                    normalizedMenus.length ===
                    0
                  }
                  className={
                    styles.toolbarButton
                  }
                >
                  <ChevronDown
                    size={11}
                  />
                  Expand
                </button>

                <button
                  type="button"
                  onClick={
                    collapseAll
                  }
                  disabled={
                    normalizedMenus.length ===
                    0
                  }
                  className={
                    styles.toolbarButton
                  }
                >
                  <ChevronRight
                    size={11}
                  />
                  Collapse
                </button>

                <button
                  type="button"
                  onClick={
                    assignAll
                  }
                  disabled={
                    !selectedRoleId ||
                    normalizedMenus.length ===
                      0
                  }
                  className={
                    styles.toolbarButton
                  }
                >
                  <Check
                    size={11}
                  />
                  Assign All
                </button>

                <button
                  type="button"
                  onClick={
                    unassignAll
                  }
                  disabled={
                    !selectedRoleId ||
                    normalizedMenus.length ===
                      0
                  }
                  className={
                    styles.toolbarButton
                  }
                >
                  <X
                    size={11}
                  />
                  Unassign All
                </button>
              </div>
            </div>

            {/* SPLIT PANELS */}
            <div
              className={
                styles.splitRow
              }
            >

              {/* ===========================================
                  AVAILABLE
              =========================================== */}

              <div
                className={`
                  ${styles.treePanel}
                  ${styles.treePanelDivider}
                `}
              >
                <div
                  className={
                    styles.treePanelHeader
                  }
                >
                  <div
                    className={
                      styles.treePanelHeaderLeft
                    }
                  >
                    <FolderTree
                      size={14}
                      className="text-slate-400"
                    />

                    <span
                      className={
                        styles.treePanelTitle
                      }
                    >
                      Available Menus
                    </span>
                  </div>

                  <span
                    className={
                      styles.treePanelCount
                    }
                  >
                    {deniedCount}
                  </span>
                </div>

                <div
                  className={`
                    ${styles.treePanelBody}
                    ${
                      dragOverSide ===
                      "left"
                        ? styles.treePanelBodyDragOver
                        : ""
                    }
                  `}
                  onDragOver={(e) =>
                    handleDragOverPanel(
                      e,
                      "left"
                    )
                  }
                  onDragLeave={() =>
                    handleDragLeavePanel(
                      "left"
                    )
                  }
                  onDrop={(e) =>
                    handleDropOnPanel(
                      e,
                      "left"
                    )
                  }
                >
                  {loadingMenuStructure ? (
                    <div
                      className={
                        styles.emptyState
                      }
                    >
                      Loading menu structure...
                    </div>
                  ) : !selectedContextTypeId ? (
                    <div
                      className={
                        styles.emptyState
                      }
                    >
                      Select a context.
                    </div>
                  ) : (
                    hasDepartments &&
                    !selectedDepartmentId ? (
                      <div
                        className={
                          styles.emptyState
                        }
                      >
                        Select a department.
                      </div>
                    ) : availableTree.length ===
                      0 ? (
                      <div
                        className={
                          styles.emptyState
                        }
                      >
                        <Check
                          size={20}
                          className="mb-2 text-emerald-400"
                        />

                        Nothing left to
                        assign.
                      </div>
                    ) : (
                      availableTree.map(
                        (node) =>
                          renderTreeNode(
                            node,
                            0,
                            "left"
                          )
                      )
                    )
                  )}
                </div>
              </div>

              {/* ===========================================
                  ASSIGNED
              =========================================== */}

              <div
                className={
                  styles.treePanel
                }
              >
                <div
                  className={
                    styles.treePanelHeader
                  }
                >
                  <div
                    className={
                      styles.treePanelHeaderLeft
                    }
                  >
                    <FolderCheck
                      size={14}
                      className="text-emerald-500"
                    />

                    <span
                      className={
                        styles.treePanelTitle
                      }
                    >
                      Assigned Menus
                    </span>
                  </div>

                  <span
                    className={`
                      ${styles.treePanelCount}
                      bg-emerald-50 text-emerald-600
                    `}
                  >
                    {allowedCount}
                  </span>
                </div>

                <div
                  className={`
                    ${styles.treePanelBody}
                    ${
                      dragOverSide ===
                      "right"
                        ? styles.treePanelBodyDragOver
                        : ""
                    }
                  `}
                  onDragOver={(e) =>
                    handleDragOverPanel(
                      e,
                      "right"
                    )
                  }
                  onDragLeave={() =>
                    handleDragLeavePanel(
                      "right"
                    )
                  }
                  onDrop={(e) =>
                    handleDropOnPanel(
                      e,
                      "right"
                    )
                  }
                >
                  {loadingMapping ? (
                    <div
                      className={
                        styles.emptyState
                      }
                    >
                      Loading saved permissions...
                    </div>
                  ) : !selectedRoleId ? (
                    <div
                      className={
                        styles.emptyState
                      }
                    >
                      Select a role to
                      configure access.
                    </div>
                  ) : assignedTree.length ===
                    0 ? (
                    <div
                      className={
                        styles.emptyState
                      }
                    >
                      <FolderCheck
                        size={20}
                        className="mb-2 text-slate-300"
                      />

                      Drag menus here, or
                      use the arrow on a
                      menu row.
                    </div>
                  ) : (
                    assignedTree.map(
                      (node) =>
                        renderTreeNode(
                          node,
                          0,
                          "right"
                        )
                    )
                  )}
                </div>
              </div>
            </div>

            {/* LEGEND */}
            <div
              className={
                styles.legendRow
              }
            >
              <Info
                size={11}
                className="text-slate-400"
              />

              <span>
                Drag a menu across or use
                the arrow. Moving a parent
                also moves all its submenus.
              </span>
            </div>

            {/* FOOTER */}
            <div
              className={
                styles.footer
              }
            >
              <div className="text-[9px] text-slate-400">
                {normalizedMenus.length} menu
                {normalizedMenus.length !==
                1
                  ? "s"
                  : ""}{" "}
                available
              </div>

              <div
                className={
                  styles.footerRightActions
                }
              >
                <button
                  type="button"
                  onClick={
                    handleReset
                  }
                  disabled={
                    saving ||
                    loadingMapping
                  }
                  className={
                    styles.resetButton
                  }
                >
                  <RotateCcw
                    size={12}
                  />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={
                    handleSave
                  }
                  disabled={
                    saving ||
                    !selectedRoleId ||
                    loadingMapping
                  }
                  className={
                    styles.saveButton
                  }
                >
                  <Save
                    size={12}
                  />

                  {saving
                    ? "Saving..."
                    : "Save Mapping"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleMenuMapping;

