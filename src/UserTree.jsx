// import React, { useState } from "react";
// import { Check, Users, ChevronDown, ChevronRight } from "lucide-react";

// const ROLE_BADGE = {
//     1: {
//         text: "Super Admin",
//         bg: "bg-blue-100",
//         textColor: "text-blue-700",
//     },
//     2: {
//         text: "Admin",
//         bg: "bg-indigo-100",
//         textColor: "text-indigo-700",
//     },
//     3: {
//         text: "HOD",
//         bg: "bg-emerald-100",
//         textColor: "text-emerald-700",
//     },
//     4: {
//         text: "Manager",
//         bg: "bg-amber-100",
//         textColor: "text-amber-700",
//     },
//     5: {
//         text: "User",
//         bg: "bg-gray-100",
//         textColor: "text-gray-700",
//     },
// };


// // ============================================================
// // HELPERS
// // ============================================================

// function getUserName(user) {
//     return user?.userName || "Unknown User";
// }


// function getStatus(user) {
//     return (user?.status || "").trim().toLowerCase();
// }


// function getRole(user) {
//     return (
//         ROLE_BADGE[user?.roleId] || {
//             text: user?.roleName || "Unknown",
//             bg: "bg-gray-100",
//             textColor: "text-gray-700",
//         }
//     );
// }


// // Count all descendants recursively
// function countAllChildren(node) {
//     if (!node?.children?.length) {
//         return 0;
//     }

//     return node.children.reduce(
//         (total, child) =>
//             total + 1 + countAllChildren(child),
//         0
//     );
// }


// // Get every descendant ID
// function getAllChildIds(node) {
//     if (!node?.children?.length) {
//         return [];
//     }

//     let ids = [];

//     node.children.forEach(child => {
//         ids.push(child.userId);
//         ids = ids.concat(getAllChildIds(child));
//     });

//     return ids;
// }


// // Flatten one category tree for table view
// function flattenCategoryTree(
//     node,
//     reportsTo = "—",
//     depth = 0
// ) {
//     if (!node) {
//         return [];
//     }

//     const row = {
//         userId: node.userId,
//         userName: node.userName,
//         roleId: node.roleId,
//         roleName: node.roleName,
//         managerId: node.managerId,
//         managerName: node.managerName,
//         status: node.status,
//         reportsTo,
//         teamSize: countAllChildren(node),
//         depth,
//     };

//     const children =
//         (node.children || []).flatMap(child =>
//             flattenCategoryTree(
//                 child,
//                 node.userName,
//                 depth + 1
//             )
//         );

//     return [row, ...children];
// }


// // ============================================================
// // USER NODE
// // ============================================================

// function UserNode({
//     node,
//     selectedIds,
//     onSelectionChange,
//     expandedMap,
//     onToggleExpand,
//     showTooltip,
//     isLoading,
// }) {
//     const role = getRole(node);

//     const children = node.children || [];

//     const hasChildren = children.length > 0;

//     const expanded =
//         expandedMap[node.userId] ?? true;

//     const isSelected =
//         selectedIds.includes(node.userId);

//     const allChildIds =
//         getAllChildIds(node);

//     const allChildrenSelected =
//         allChildIds.length > 0 &&
//         allChildIds.every(id =>
//             selectedIds.includes(id)
//         );

//     const status = getStatus(node);

//     const isInactive =
//         status !== "active";

//     const toggleUser = () => {
//         if (isLoading) return;

//         if (isSelected) {
//             onSelectionChange(
//                 selectedIds.filter(
//                     id => id !== node.userId
//                 )
//             );
//         } else {
//             onSelectionChange([
//                 ...selectedIds,
//                 node.userId,
//             ]);
//         }
//     };


//     const toggleChildren = e => {
//         e.stopPropagation();

//         if (isLoading) return;

//         let updated = [...selectedIds];

//         if (allChildrenSelected) {

//             updated =
//                 updated.filter(
//                     id =>
//                         !allChildIds.includes(id)
//                 );

//         } else {

//             allChildIds.forEach(id => {

//                 if (!updated.includes(id)) {
//                     updated.push(id);
//                 }

//             });

//         }

//         onSelectionChange(updated);
//     };


//     return (
//         <div className="relative">

//             {/* USER ROW */}

//             <div
//                 className="flex items-center gap-2 mb-1"
//             >

//                 {/* Expand */}

//                 {hasChildren ? (

//                     <button
//                         type="button"
//                         onClick={e => {
//                             e.stopPropagation();

//                             onToggleExpand(
//                                 node.userId
//                             );
//                         }}
//                         className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500 flex-shrink-0"
//                     >
//                         {expanded ? (
//                             <ChevronDown
//                                 size={15}
//                             />
//                         ) : (
//                             <ChevronRight
//                                 size={15}
//                             />
//                         )}
//                     </button>

//                 ) : (

//                     <span className="w-6 h-6 flex-shrink-0" />

//                 )}


//                 {/* USER BUTTON */}

//                 <button
//                     type="button"
//                     onClick={toggleUser}
//                     disabled={isLoading}
//                     className={`
//                         px-2.5
//                         py-1
//                         border
//                         rounded-md
//                         text-sm
//                         shadow-sm
//                         transition
//                         whitespace-nowrap
//                         ${
//                             isSelected
//                                 ? "bg-blue-100 border-blue-500 text-blue-800"
//                                 : isInactive
//                                     ? "bg-red-50 border-red-300 text-red-700"
//                                     : "bg-white border-gray-300 text-gray-800 hover:border-blue-400"
//                         }
//                         ${
//                             isLoading
//                                 ? "opacity-50 cursor-wait"
//                                 : ""
//                         }
//                     `}
//                 >
//                     {getUserName(node)}
//                 </button>


//                 {/* ROLE */}

//                 <span
//                     className={`
//                         text-[10px]
//                         px-2
//                         py-[2px]
//                         rounded-full
//                         ${role.bg}
//                         ${role.textColor}
//                         whitespace-nowrap
//                     `}
//                 >
//                     {role.text}
//                 </span>


//                 {/* CHILD COUNT */}

//                 {hasChildren && (
//                     <span
//                         className="
//                             text-[10px]
//                             bg-gray-600
//                             text-white
//                             px-2
//                             py-[2px]
//                             rounded-full
//                         "
//                     >
//                         {children.length}
//                     </span>
//                 )}


//                 {/* SELECT TEAM */}

//                 {hasChildren && (
//                     <button
//                         type="button"
//                         onClick={toggleChildren}
//                         disabled={isLoading}
//                         className="
//                             flex
//                             items-center
//                             gap-1
//                             text-xs
//                             text-gray-500
//                             hover:text-gray-900
//                         "
//                         title={
//                             allChildrenSelected
//                                 ? "Deselect team"
//                                 : "Select team"
//                         }
//                     >
//                         <Users size={13} />

//                         {allChildrenSelected && (
//                             <Check
//                                 size={11}
//                                 className="text-green-600"
//                             />
//                         )}
//                     </button>
//                 )}


//                 {/* TOOLTIP */}

//                 {showTooltip && (
//                     <div
//                         className="
//                             hidden
//                             group-hover:block
//                             absolute
//                             left-20
//                             top-8
//                             z-50
//                             bg-white
//                             border
//                             rounded-lg
//                             shadow-lg
//                             p-3
//                             w-64
//                             text-xs
//                         "
//                     >
//                         <div className="font-semibold mb-2">
//                             {getUserName(node)}
//                         </div>

//                         <div className="space-y-1 text-gray-600">

//                             <div>
//                                 <b>Role:</b>{" "}
//                                 {node.roleName}
//                             </div>

//                             <div>
//                                 <b>Reports To:</b>{" "}
//                                 {node.managerName || "—"}
//                             </div>

//                             <div>
//                                 <b>Team Size:</b>{" "}
//                                 {countAllChildren(node)}
//                             </div>

//                             <div>
//                                 <b>Status:</b>{" "}
//                                 {node.status?.trim() || "Unknown"}
//                             </div>

//                         </div>
//                     </div>
//                 )}

//             </div>


//             {/* CHILDREN */}

//             {expanded && hasChildren && (

//                 <div
//                     className="
//                         ml-5
//                         pl-4
//                         border-l
//                         border-gray-200
//                     "
//                 >

//                     {children.map(
//                         (child, index) => (

//                             <UserNode
//                                 key={
//                                     child.userId +
//                                     "-" +
//                                     index
//                                 }
//                                 node={child}
//                                 selectedIds={
//                                     selectedIds
//                                 }
//                                 onSelectionChange={
//                                     onSelectionChange
//                                 }
//                                 expandedMap={
//                                     expandedMap
//                                 }
//                                 onToggleExpand={
//                                     onToggleExpand
//                                 }
//                                 showTooltip={
//                                     showTooltip
//                                 }
//                                 isLoading={
//                                     isLoading
//                                 }
//                             />

//                         )
//                     )}

//                 </div>

//             )}

//         </div>
//     );
// }


// // ============================================================
// // CATEGORY TREE
// // ============================================================

// function CategoryTree({
//     category,
//     selectedIds,
//     onSelectionChange,
//     expandedMap,
//     onToggleExpand,
//     showTooltip,
//     isLoading,
// }) {
//     const [categoryExpanded, setCategoryExpanded] =
//         useState(true);

//     const users = category.users || [];

//     if (!users.length) {
//         return null;
//     }


//     return (
//         <div className="mb-4">

//             {/* CATEGORY HEADER */}

//             <button
//                 type="button"
//                 onClick={() =>
//                     setCategoryExpanded(
//                         value => !value
//                     )
//                 }
//                 className="
//                     flex
//                     items-center
//                     gap-2
//                     w-full
//                     text-left
//                     px-3
//                     py-2
//                     bg-gray-50
//                     border
//                     border-gray-200
//                     rounded-lg
//                     hover:bg-gray-100
//                     transition
//                     mb-2
//                 "
//             >

//                 {categoryExpanded ? (
//                     <ChevronDown
//                         size={16}
//                         className="text-gray-500"
//                     />
//                 ) : (
//                     <ChevronRight
//                         size={16}
//                         className="text-gray-500"
//                     />
//                 )}

//                 <span className="font-semibold text-sm text-gray-700">
//                     {category.categoryName}
//                 </span>

//                 <span
//                     className="
//                         text-[10px]
//                         bg-blue-100
//                         text-blue-700
//                         px-2
//                         py-[2px]
//                         rounded-full
//                     "
//                 >
//                     {users.length} root
//                 </span>

//             </button>


//             {/* CATEGORY USERS */}

//             {categoryExpanded && (

//                 <div className="pl-2">

//                     {users.map(
//                         (user, index) => (

//                             <UserNode
//                                 key={
//                                     user.userId +
//                                     "-" +
//                                     index
//                                 }
//                                 node={user}
//                                 selectedIds={
//                                     selectedIds
//                                 }
//                                 onSelectionChange={
//                                     onSelectionChange
//                                 }
//                                 expandedMap={
//                                     expandedMap
//                                 }
//                                 onToggleExpand={
//                                     onToggleExpand
//                                 }
//                                 showTooltip={
//                                     showTooltip
//                                 }
//                                 isLoading={
//                                     isLoading
//                                 }
//                             />

//                         )
//                     )}

//                 </div>

//             )}

//         </div>
//     );
// }


// // ============================================================
// // TABLE VIEW
// // ============================================================

// function TableView({
//     departments,
//     selectedIds,
//     onSelectionChange,
//     isLoading,
// }) {
//     const [search, setSearch] = useState("");

//     let rows = [];

//     departments.forEach(department => {

//         (department.categories || []).forEach(
//             category => {

//                 (category.users || []).forEach(
//                     user => {

//                         rows.push(
//                             ...flattenCategoryTree(
//                                 user,
//                                 "—",
//                                 0
//                             ).map(row => ({
//                                 ...row,
//                                 departmentName:
//                                     department.departmentName,
//                                 categoryName:
//                                     category.categoryName,
//                             }))
//                         );

//                     }
//                 );

//             }
//         );

//     });


//     if (search.trim()) {

//         const searchText =
//             search.toLowerCase();

//         rows = rows.filter(row =>
//             row.userName
//                 ?.toLowerCase()
//                 .includes(searchText)
//         );

//     }


//     return (
//         <div className="flex flex-col h-full">

//             <div className="p-2 border-b">

//                 <input
//                     type="text"
//                     value={search}
//                     onChange={e =>
//                         setSearch(e.target.value)
//                     }
//                     placeholder="Search by name..."
//                     className="
//                         w-full
//                         text-sm
//                         px-2
//                         py-1.5
//                         border
//                         rounded
//                         focus:outline-none
//                         focus:ring-1
//                         focus:ring-blue-400
//                     "
//                 />

//             </div>


//             <div className="flex-1 overflow-auto">

//                 <table className="w-full text-sm">

//                     <thead className="sticky top-0 bg-gray-50 z-10">

//                         <tr className="border-b">

//                             <th className="p-2 text-left">
//                                 Name
//                             </th>

//                             <th className="p-2 text-left">
//                                 Department
//                             </th>

//                             <th className="p-2 text-left">
//                                 Category
//                             </th>

//                             <th className="p-2 text-left">
//                                 Role
//                             </th>

//                             <th className="p-2 text-center">
//                                 Select
//                             </th>

//                         </tr>

//                     </thead>


//                     <tbody>

//                         {rows.map(
//                             (row, index) => {

//                                 const selected =
//                                     selectedIds.includes(
//                                         row.userId
//                                     );

//                                 const role =
//                                     getRole(row);

//                                 return (
//                                     <tr
//                                         key={
//                                             row.userId +
//                                             "-" +
//                                             index
//                                         }
//                                         className="
//                                             border-b
//                                             hover:bg-gray-50
//                                         "
//                                     >

//                                         <td
//                                             className="p-2 font-medium"
//                                             style={{
//                                                 paddingLeft:
//                                                     `${8 + row.depth * 16}px`,
//                                             }}
//                                         >
//                                             {row.userName}
//                                         </td>

//                                         <td className="p-2">
//                                             {
//                                                 row.departmentName
//                                             }
//                                         </td>

//                                         <td className="p-2">
//                                             {
//                                                 row.categoryName
//                                             }
//                                         </td>

//                                         <td className="p-2">

//                                             <span
//                                                 className={`
//                                                     text-xs
//                                                     px-2
//                                                     py-1
//                                                     rounded-full
//                                                     ${role.bg}
//                                                     ${role.textColor}
//                                                 `}
//                                             >
//                                                 {
//                                                     row.roleName
//                                                 }
//                                             </span>

//                                         </td>

//                                         <td className="p-2 text-center">

//                                             <input
//                                                 type="checkbox"
//                                                 checked={
//                                                     selected
//                                                 }
//                                                 disabled={
//                                                     isLoading
//                                                 }
//                                                 onChange={() => {

//                                                     if (
//                                                         selected
//                                                     ) {

//                                                         onSelectionChange(
//                                                             selectedIds.filter(
//                                                                 id =>
//                                                                     id !==
//                                                                     row.userId
//                                                             )
//                                                         );

//                                                     } else {

//                                                         onSelectionChange(
//                                                             [
//                                                                 ...selectedIds,
//                                                                 row.userId,
//                                                             ]
//                                                         );

//                                                     }

//                                                 }}
//                                                 className="accent-blue-600"
//                                             />

//                                         </td>

//                                     </tr>
//                                 );

//                             }
//                         )}

//                     </tbody>

//                 </table>

//             </div>


//             <div
//                 className="
//                     border-t
//                     bg-gray-50
//                     px-3
//                     py-1.5
//                     text-xs
//                     text-gray-500
//                 "
//             >
//                 {selectedIds.length} selected
//             </div>

//         </div>
//     );
// }


// // ============================================================
// // MAIN USER TREE
// // ============================================================

// export default function UserTree({
//     data,
//     onSelectionChange,
//     isLoading = false,
//     selectedIds = [],
// }) {

//     const [expandedMap, setExpandedMap] =
//         useState({});

//     const [showTooltip, setShowTooltip] =
//         useState(false);

//     const [viewActiveOnly, setViewActiveOnly] =
//         useState(false);

//     const [viewMode, setViewMode] =
//         useState("tree");


//     // --------------------------------------------------------
//     // IMPORTANT:
//     // New API structure is:
//     //
//     // data.departments[]
//     //      categories[]
//     //          users[]
//     //              children[]
//     // --------------------------------------------------------

//     const departments =
//         data?.departments || [];


//     // --------------------------------------------------------
//     // Expand / collapse user
//     // --------------------------------------------------------

//     const toggleExpand = userId => {

//         setExpandedMap(prev => ({
//             ...prev,
//             [userId]:
//                 !prev[userId],
//         }));

//     };


//     // --------------------------------------------------------
//     // Filter active users
//     // --------------------------------------------------------

//     const filterActiveUser = user => {

//         if (!viewActiveOnly) {
//             return user;
//         }

//         const active =
//             getStatus(user) === "active";

//         const children =
//             (user.children || [])
//                 .map(filterActiveUser)
//                 .filter(Boolean);

//         if (
//             active ||
//             children.length > 0
//         ) {

//             return {
//                 ...user,
//                 children,
//             };

//         }

//         return null;
//     };


//     // --------------------------------------------------------
//     // Render department
//     // --------------------------------------------------------

//     const renderDepartment = department => {

//         const categories =
//             department.categories || [];


//         const filteredCategories =
//             categories
//                 .map(category => {

//                     const filteredUsers =
//                         (category.users || [])
//                             .map(filterActiveUser)
//                             .filter(Boolean);

//                     return {
//                         ...category,
//                         users: filteredUsers,
//                     };

//                 })
//                 .filter(
//                     category =>
//                         category.users.length > 0
//                 );


//         if (
//             filteredCategories.length === 0
//         ) {
//             return null;
//         }


//         return (
//             <div
//                 key={department.departmentId}
//                 className="mb-5"
//             >

//                 {/* DEPARTMENT HEADER */}

//                 <div
//                     className="
//                         flex
//                         items-center
//                         gap-2
//                         px-3
//                         py-2
//                         mb-2
//                         bg-blue-50
//                         border
//                         border-blue-200
//                         rounded-lg
//                     "
//                 >

//                     <div
//                         className="
//                             w-2
//                             h-2
//                             rounded-full
//                             bg-blue-500
//                         "
//                     />

//                     <span
//                         className="
//                             font-semibold
//                             text-sm
//                             text-blue-800
//                         "
//                     >
//                         {department.departmentName}
//                     </span>

//                     <span
//                         className="
//                             text-[10px]
//                             bg-blue-100
//                             text-blue-700
//                             px-2
//                             py-[2px]
//                             rounded-full
//                         "
//                     >
//                         {filteredCategories.length} categories
//                     </span>

//                 </div>


//                 {/* CATEGORIES */}

//                 <div className="pl-3">

//                     {filteredCategories.map(
//                         category => (

//                             <CategoryTree
//                                 key={
//                                     category.categoryId
//                                 }
//                                 category={
//                                     category
//                                 }
//                                 selectedIds={
//                                     selectedIds
//                                 }
//                                 onSelectionChange={
//                                     onSelectionChange
//                                 }
//                                 expandedMap={
//                                     expandedMap
//                                 }
//                                 onToggleExpand={
//                                     toggleExpand
//                                 }
//                                 showTooltip={
//                                     showTooltip
//                                 }
//                                 isLoading={
//                                     isLoading
//                                 }
//                             />

//                         )
//                     )}

//                 </div>

//             </div>
//         );

//     };


//     // --------------------------------------------------------
//     // EMPTY STATE
//     // --------------------------------------------------------

//     if (!data || departments.length === 0) {

//         return (
//             <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
//                 No analytics hierarchy found.
//             </div>
//         );

//     }


//     // --------------------------------------------------------
//     // MAIN UI
//     // --------------------------------------------------------

//     return (

//         <div className="flex flex-col h-full min-h-0">

//             {/* ==================================================
//                 TOP BAR
//             ================================================== */}

//             <div
//                 className="
//                     flex
//                     items-center
//                     gap-2
//                     px-2
//                     py-1.5
//                     border-b
//                     bg-white
//                     flex-shrink-0
//                 "
//             >

//                 {/* TREE */}

//                 <button
//                     type="button"
//                     onClick={() =>
//                         setViewMode("tree")
//                     }
//                     className={`
//                         px-2.5
//                         py-1
//                         rounded
//                         text-xs
//                         border
//                         ${
//                             viewMode === "tree"
//                                 ? "bg-blue-600 text-white border-blue-600"
//                                 : "bg-white text-gray-600 border-gray-300"
//                         }
//                     `}
//                 >
//                     Tree
//                 </button>


//                 {/* TABLE */}

//                 <button
//                     type="button"
//                     onClick={() =>
//                         setViewMode("table")
//                     }
//                     className={`
//                         px-2.5
//                         py-1
//                         rounded
//                         text-xs
//                         border
//                         ${
//                             viewMode === "table"
//                                 ? "bg-blue-600 text-white border-blue-600"
//                                 : "bg-white text-gray-600 border-gray-300"
//                         }
//                     `}
//                 >
//                     Table
//                 </button>


//                 {viewMode === "tree" && (

//                     <>
//                         <div className="w-px h-4 bg-gray-200 mx-1" />

//                         {/* TIPS */}

//                         <label
//                             className="
//                                 flex
//                                 items-center
//                                 gap-1
//                                 text-xs
//                                 text-gray-600
//                                 cursor-pointer
//                             "
//                         >

//                             <input
//                                 type="checkbox"
//                                 checked={
//                                     showTooltip
//                                 }
//                                 onChange={() =>
//                                     setShowTooltip(
//                                         value =>
//                                             !value
//                                     )
//                                 }
//                                 className="accent-blue-600"
//                             />

//                             Tips

//                         </label>


//                         {/* ACTIVE ONLY */}

//                         <label
//                             className="
//                                 flex
//                                 items-center
//                                 gap-1
//                                 text-xs
//                                 text-gray-600
//                                 cursor-pointer
//                             "
//                         >

//                             <input
//                                 type="checkbox"
//                                 checked={
//                                     viewActiveOnly
//                                 }
//                                 onChange={() =>
//                                     setViewActiveOnly(
//                                         value =>
//                                             !value
//                                     )
//                                 }
//                                 className="accent-blue-600"
//                             />

//                             Active

//                         </label>

//                     </>

//                 )}

//             </div>


//             {/* ==================================================
//                 LOADING
//             ================================================== */}

//             {isLoading && (

//                 <div
//                     className="
//                         px-3
//                         py-1.5
//                         text-xs
//                         text-blue-700
//                         bg-blue-50
//                         border-b
//                         border-blue-200
//                     "
//                 >
//                     Fetching analytics hierarchy...
//                 </div>

//             )}


//             {/* ==================================================
//                 CONTENT
//             ================================================== */}

//             <div
//                 className="
//                     flex-1
//                     overflow-auto
//                     min-h-0
//                     p-2
//                 "
//             >

//                 {viewMode === "tree" ? (

//                     departments.map(
//                         renderDepartment
//                     )

//                 ) : (

//                     <TableView
//                         departments={
//                             departments
//                         }
//                         selectedIds={
//                             selectedIds
//                         }
//                         onSelectionChange={
//                             onSelectionChange
//                         }
//                         isLoading={
//                             isLoading
//                         }
//                     />

//                 )}

//             </div>


//             {/* ==================================================
//                 FOOTER
//             ================================================== */}

//             <div
//                 className="
//                     flex
//                     items-center
//                     justify-between
//                     px-3
//                     py-1.5
//                     border-t
//                     bg-gray-50
//                     text-xs
//                     text-gray-500
//                     flex-shrink-0
//                 "
//             >

//                 <span>
//                     {selectedIds.length} selected
//                 </span>

//                 <span>
//                     {departments.length} department
//                     {departments.length !== 1
//                         ? "s"
//                         : ""}
//                 </span>

//             </div>

//         </div>

//     );
// }



import React, {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import {
    Check,
    ChevronDown,
    ChevronRight,
    Users,
    X,
    Search,
    List,
    GitBranch,
    RotateCcw,
    UserRound,
    ArrowLeft
} from "lucide-react";

import { createPortal } from "react-dom";


// ============================================================
// THEME
//
// Single source of truth for the accent color used across
// this component (buttons, active states, badges, tooltip
// accents, "Selected" pills, etc).
//
// - `PRIMARY` controls every Tailwind class below
//   (bg-{PRIMARY}-500, border-{PRIMARY}-300, ...). Swap it
//   for another Tailwind color family (e.g. "indigo",
//   "emerald") to re-theme the whole component.
// - `HEX` controls the few places that need a raw color
//   value instead of a Tailwind class (inline styles like
//   the Super Admin role badge and the tooltip header).
//
// Keep PRIMARY and HEX in sync with each other — they should
// look like the same color.
// ============================================================

const PRIMARY = "blue";

const HEX = {
    bg: "#dbeafe",   // ~ blue-100, used for badge backgrounds
    text: "#1d4ed8"  // ~ blue-700, used for badge text
};

const THEME = {

    // Backgrounds
    bg50: `bg-${PRIMARY}-50`,
    bg100: `bg-${PRIMARY}-100`,
    bg400: `bg-${PRIMARY}-400`,
    bg500: `bg-${PRIMARY}-500`,
    hoverBg50: `hover:bg-${PRIMARY}-50`,
    hoverBg100: `hover:bg-${PRIMARY}-100`,

    // Text
    text600: `text-${PRIMARY}-600`,
    text700: `text-${PRIMARY}-700`,
    text800: `text-${PRIMARY}-800`,
    hoverText600: `hover:text-${PRIMARY}-600`,
    hoverText700: `hover:text-${PRIMARY}-700`,
    hoverText800: `hover:text-${PRIMARY}-800`,

    // Borders
    border100: `border-${PRIMARY}-100`,
    border300: `border-${PRIMARY}-300`,
    border400: `border-${PRIMARY}-400`,
    border500: `border-${PRIMARY}-500`,
    hoverBorder300: `hover:border-${PRIMARY}-300`,
    hoverBorder400: `hover:border-${PRIMARY}-400`,

    // Misc
    ring300: `ring-${PRIMARY}-300`,
    accent: `accent-${PRIMARY}-500`,
    gradientFrom: `from-${PRIMARY}-50`

};


// ============================================================
// ROLE BADGES
// ============================================================

const ROLE_BADGE = {
    1: {
        text: "Super Admin",
        bg: HEX.bg,
        color: HEX.text
    },
    2: {
        text: "Admin",
        bg: "#ede9fe",
        color: "#6d28d9"
    },
    3: {
        text: "HOD",
        bg: "#dcfce7",
        color: "#15803d"
    },
    4: {
        text: "Manager",
        bg: "#fef3c7",
        color: "#b45309"
    },
    5: {
        text: "User",
        bg: "#f1f5f9",
        color: "#475569"
    }
};


// ============================================================
// HELPERS
// ============================================================

function getFullName(user) {

    if (!user) {
        return "";
    }

    if (user.userName) {
        return user.userName.trim();
    }

    return `${user.fName || ""} ${user.lName || ""}`.trim();
}


function getRole(user) {

    return (
        ROLE_BADGE[user?.roleId] || {
            text: user?.roleName || "Unknown",
            bg: "#f1f5f9",
            color: "#475569"
        }
    );
}


function getStatusColor(status) {

    const value =
        (status || "")
            .trim()
            .toLowerCase();

    if (value === "active") {
        return "#16a34a";
    }

    if (value === "inactive") {
        return "#dc2626";
    }

    return "#94a3b8";
}


function getAllDescendantIds(node) {

    if (!node?.children?.length) {
        return [];
    }

    let ids = [];

    node.children.forEach(child => {

        ids.push(child.userId);

        ids = ids.concat(
            getAllDescendantIds(child)
        );

    });

    return ids;
}


function countDescendants(node) {

    return getAllDescendantIds(node).length;
}


// ============================================================
// FLATTEN CATEGORY
// ============================================================

function flattenCategoryUsers(
    users,
    categoryName,
    categoryId,
    rows = [],
    parentName = "—",
    depth = 0
) {

    if (!users) {
        return rows;
    }

    users.forEach(user => {

        rows.push({

            ...user,

            categoryId,
            categoryName,

            parentName,

            depth,

            teamSize:
                countDescendants(user)

        });


        flattenCategoryUsers(
            user.children || [],
            categoryName,
            categoryId,
            rows,
            getFullName(user),
            depth + 1
        );

    });

    return rows;
}


// ============================================================
// TOOLTIP
// ============================================================

function UserTooltip({
    user,
    categoryName,
    position
}) {

    if (!user || !position) {
        return null;
    }

    const role = getRole(user);

    const tooltip = (

        <div
            className="
                fixed
                z-[999999]
                w-64
                rounded-xl
                border
                border-blue-100
                bg-white
                shadow-2xl
                overflow-hidden
                pointer-events-none
            "
            style={{
                left: position.left,
                top: position.top
            }}
        >

            {/* HEADER */}

            <div
                className="
                    px-3
                    py-2.5
                    bg-gradient-to-r
                    from-blue-50
                    via-white
                    to-indigo-50
                    border-b
                    border-blue-100
                "
            >

                <div className="
                    flex
                    items-start
                    justify-between
                    gap-2
                ">

                    <div className="min-w-0">

                        <div className="
                            text-xs
                            font-semibold
                            text-slate-800
                            truncate
                        ">
                            {getFullName(user)}
                        </div>

                        <div className="
                            text-[9px]
                            text-slate-400
                            mt-0.5
                        ">
                            ID: {user.userId}
                        </div>

                    </div>


                    <span
                        className="
                            text-[9px]
                            px-2
                            py-0.5
                            rounded-full
                            whitespace-nowrap
                            font-medium
                        "
                        style={{
                            background: role.bg,
                            color: role.color
                        }}
                    >
                        {user.roleName || role.text}
                    </span>

                </div>

            </div>


            {/* DETAILS */}

            <div className="
                px-3
                py-2.5
                space-y-2
            ">

                <TooltipRow
                    label="Category"
                    value={categoryName}
                />

                <TooltipRow
                    label="Reports to"
                    value={
                        user.managerName || "—"
                    }
                />

                <TooltipRow
                    label="Status"
                    value={
                        (user.status || "Unknown").trim()
                    }
                    valueColor={
                        getStatusColor(
                            user.status
                        )
                    }
                />

                <TooltipRow
                    label="Team members"
                    value={countDescendants(user)}
                />

                <TooltipRow
                    label="Hierarchy level"
                    value={
                        `Level ${(user.depth ?? 0) + 1}`
                    }
                />

            </div>

        </div>
    );


    return createPortal(
        tooltip,
        document.body
    );
}


function TooltipRow({
    label,
    value,
    valueColor
}) {

    return (

        <div className="
            flex
            items-center
            justify-between
            gap-3
        ">

            <span className="
                text-[9px]
                text-slate-400
            ">
                {label}
            </span>

            <span
                className="
                    text-[10px]
                    font-medium
                    text-right
                    max-w-[150px]
                    truncate
                "
                style={{
                    color:
                        valueColor ||
                        "#334155"
                }}
            >
                {value}
            </span>

        </div>
    );
}


// ============================================================
// TREE NODE
// ============================================================

function TreeNode({
    node,
    category,
    selectedIds,
    onToggleUser,
    onSelectTeam,
    expandedMap,
    onToggleExpand,
    showTooltip,
    isLoading
}) {

    const [hover, setHover] =
        useState(false);

    const [tooltipPosition, setTooltipPosition] =
        useState(null);

    const nodeRef =
        useRef(null);


    const children =
        node?.children || [];

    const hasChildren =
        children.length > 0;


    /*
     * Category + User ID
     *
     * prevents:
     *
     * Visa / user
     *
     * affecting:
     *
     * Air Ticket / same user
     */

    const expansionKey =
        `${category.categoryId}:${node.userId}`;


    const expanded =
        expandedMap[expansionKey] ?? true;


    const selected =
        selectedIds.includes(
            node.userId
        );


    const role =
        getRole(node);


    // --------------------------------------------------------
    // TOOLTIP
    // --------------------------------------------------------

    const showUserTooltip = () => {

        setHover(true);

        if (!nodeRef.current) {
            return;
        }

        const rect =
            nodeRef.current.getBoundingClientRect();

        const tooltipWidth = 256;
        const tooltipHeight = 210;
        const gap = 10;

        let left =
            rect.left -
            tooltipWidth -
            gap;


        /*
         * Prefer left side.
         *
         * If not enough room,
         * use right side.
         */

        if (left < 10) {

            left =
                rect.right +
                gap;

        }


        /*
         * Keep inside viewport.
         */

        if (
            left +
            tooltipWidth >
            window.innerWidth - 10
        ) {

            left =
                window.innerWidth -
                tooltipWidth -
                10;

        }


        let top =
            rect.top;


        if (
            top +
            tooltipHeight >
            window.innerHeight - 10
        ) {

            top =
                window.innerHeight -
                tooltipHeight -
                10;

        }


        if (top < 10) {
            top = 10;
        }


        setTooltipPosition({
            left,
            top
        });

    };


    const hideUserTooltip = () => {

        setHover(false);

        setTooltipPosition(null);

    };


    // --------------------------------------------------------
    // TEAM SELECTION
    // --------------------------------------------------------

    const allChildIds =
        getAllDescendantIds(node);


    const allChildrenSelected =
        allChildIds.length > 0 &&
        allChildIds.every(id =>
            selectedIds.includes(id)
        );


    const handleTeamSelect = e => {

        e.stopPropagation();

        if (isLoading) {
            return;
        }

        onSelectTeam(
            allChildIds,
            !allChildrenSelected
        );

    };


    return (

        <div className="relative">


            {/* NODE */}

            <div
                ref={nodeRef}
                className="
                    flex
                    items-center
                    gap-1.5
                    mb-1
                    relative
                    min-w-max
                "
                onMouseEnter={
                    showUserTooltip
                }
                onMouseLeave={
                    hideUserTooltip
                }
            >


                {/* EXPAND */}

                {hasChildren ? (

                    <button
                        onClick={e => {

                            e.stopPropagation();

                            onToggleExpand(
                                expansionKey
                            );

                        }}
                        className="
                            w-5
                            h-5
                            flex
                            items-center
                            justify-center
                            rounded
                            hover:bg-slate-100
                            text-slate-500
                            flex-shrink-0
                        "
                        title={
                            expanded
                                ? "Collapse"
                                : "Expand"
                        }
                    >

                        {expanded ? (

                            <ChevronDown
                                className="w-3.5 h-3.5"
                            />

                        ) : (

                            <ChevronRight
                                className="w-3.5 h-3.5"
                            />

                        )}

                    </button>

                ) : (

                    <span
                        className="
                            w-5
                            flex-shrink-0
                        "
                    />

                )}


                {/* USER PILL */}

                <button
                    onClick={() => {

                        if (!isLoading) {

                            onToggleUser(
                                node.userId
                            );

                        }

                    }}
                    disabled={isLoading}
                    className={`
                        min-w-[145px]
                        max-w-[230px]
                        px-3
                        py-1.5
                        rounded-lg
                        border
                        text-xs
                        font-medium
                        shadow-sm
                        transition
                        text-left
                        whitespace-nowrap
                        overflow-hidden
                        text-ellipsis
                        flex-shrink-0

                        ${
                            selected
                                ? `
                                    ${THEME.bg100}
                                    ${THEME.border400}
                                    ${THEME.text800}
                                    shadow-sm
                                  `
                                : `
                                    bg-white
                                    border-slate-200
                                    text-slate-700
                                    ${THEME.hoverBorder300}
                                    ${THEME.hoverBg50}
                                  `
                        }

                        ${
                            isLoading
                                ? "opacity-50 cursor-wait"
                                : ""
                        }
                    `}
                >

                    {getFullName(node)}

                </button>


                {/* ROLE */}

                <span
                    className="
                        text-[9px]
                        px-1.5
                        py-0.5
                        rounded-full
                        whitespace-nowrap
                        flex-shrink-0
                    "
                    style={{
                        background: role.bg,
                        color: role.color
                    }}
                >
                    {node.roleName ||
                        role.text}
                </span>


                {/* CHILD COUNT */}

                {hasChildren && (

                    <span
                        className="
                            text-[9px]
                            bg-blue-500
                            text-white
                            px-1.5
                            py-0.5
                            rounded-full
                            flex-shrink-0
                        "
                    >
                        {children.length}
                    </span>

                )}


                {/* TEAM SELECT */}

                {hasChildren && (

                    <button
                        onClick={
                            handleTeamSelect
                        }
                        disabled={isLoading}
                        className="
                            flex
                            items-center
                            gap-0.5
                            text-slate-400
                            hover:text-blue-600
                            text-[10px]
                            flex-shrink-0
                        "
                        title={
                            allChildrenSelected
                                ? "Deselect team"
                                : "Select entire team"
                        }
                    >

                        <Users
                            className="w-3 h-3"
                        />

                        {allChildrenSelected && (

                            <Check
                                className="
                                    w-2.5
                                    h-2.5
                                    text-emerald-600
                                "
                            />

                        )}

                    </button>

                )}


                {/* SELECTED */}

                {selected && (

                    <span
                        className="
                            text-[9px]
                            text-blue-600
                            bg-blue-50
                            border
                            border-blue-100
                            px-1.5
                            py-0.5
                            rounded
                            whitespace-nowrap
                        "
                    >
                        Selected
                    </span>

                )}

            </div>


            {/* TOOLTIP */}

            {hover &&
                showTooltip &&
                tooltipPosition && (

                    <UserTooltip
                        user={node}
                        categoryName={
                            category.categoryName
                        }
                        position={
                            tooltipPosition
                        }
                    />

                )}


            {/* CHILDREN */}

            {expanded &&
                hasChildren && (

                    <div
                        className="
                            ml-5
                            pl-3
                            border-l
                            border-slate-200
                        "
                    >

                        {children.map(child => (

                            <TreeNode
                                key={`
                                    ${category.categoryId}-
                                    ${child.userId}
                                `}
                                node={child}
                                category={category}
                                selectedIds={
                                    selectedIds
                                }
                                onToggleUser={
                                    onToggleUser
                                }
                                onSelectTeam={
                                    onSelectTeam
                                }
                                expandedMap={
                                    expandedMap
                                }
                                onToggleExpand={
                                    onToggleExpand
                                }
                                showTooltip={
                                    showTooltip
                                }
                                isLoading={
                                    isLoading
                                }
                            />

                        ))}

                    </div>

                )}

        </div>
    );
}


// ============================================================
// TABLE VIEW
// ============================================================

function TableView({
    categories,
    selectedIds,
    onToggleUser,
    isLoading
}) {

    const [search, setSearch] =
        useState("");

    const [searchMode, setSearchMode] =
        useState("employee");

    const [viewingManager, setViewingManager] =
        useState(null);


    // ========================================================
    // FLATTEN
    // ========================================================

    const allRows = useMemo(() => {

        let rows = [];

        (categories || []).forEach(category => {

            flattenCategoryUsers(
                category.users || [],
                category.categoryName,
                category.categoryId,
                rows
            );

        });

        return rows;

    }, [categories]);


    // ========================================================
    // TABLE ROWS
    //
    // IMPORTANT:
    //
    // NO USER DEDUPLICATION.
    //
    // Every category / role / manager context
    // gets its own row.
    // ========================================================

    const tableRows = useMemo(() => {

        return allRows.map(row => ({

            ...row,

            rowKey:
                `${row.userId}-
                 ${row.categoryId}-
                 ${row.roleId}-
                 ${row.managerId || "none"}`

        }));

    }, [allRows]);


    // ========================================================
    // MANAGER LIST
    // ========================================================

    const managers = useMemo(() => {

        const map = new Map();

        tableRows.forEach(row => {

            if (!row.managerId) {
                return;
            }

            if (!map.has(row.managerId)) {

                map.set(
                    row.managerId,
                    {
                        managerId:
                            row.managerId,

                        managerName:
                            row.managerName || "Unknown"
                    }
                );

            }

        });

        return Array.from(
            map.values()
        ).sort(
            (a, b) =>
                a.managerName.localeCompare(
                    b.managerName
                )
        );

    }, [tableRows]);


    // ========================================================
    // SEARCH / TEAM FILTER
    // ========================================================

    const filteredRows = useMemo(() => {

        let rows = [...tableRows];


        // ----------------------------------------------------
        // VIEWING MANAGER TEAM
        // ----------------------------------------------------

        if (viewingManager) {

            rows =
                rows.filter(row =>
                    row.managerId ===
                    viewingManager.managerId
                );

        }


        // ----------------------------------------------------
        // SEARCH
        // ----------------------------------------------------

        const term =
            search.trim().toLowerCase();


        if (!term) {

            return rows;

        }


        if (searchMode === "employee") {

            return rows.filter(row =>
                getFullName(row)
                    .toLowerCase()
                    .includes(term)
            );

        }


        if (searchMode === "manager") {

            return rows.filter(row =>
                (row.managerName || "")
                    .toLowerCase()
                    .includes(term)
            );

        }


        return rows;

    }, [
        tableRows,
        search,
        searchMode,
        viewingManager
    ]);


    // ========================================================
    // TEAM COUNTS
    // ========================================================

    const managerTeamCounts =
        useMemo(() => {

            const map = {};

            tableRows.forEach(row => {

                if (!row.managerId) {
                    return;
                }

                map[row.managerId] =
                    (map[row.managerId] || 0) + 1;

            });

            return map;

        }, [tableRows]);


    // ========================================================
    // CLEAR TEAM VIEW
    // ========================================================

    const clearTeamView = () => {

        setViewingManager(null);

        setSearch("");

    };


    return (

        <div
            className="
                flex
                flex-col
                h-full
                min-h-0
            "
        >


            {/* =================================================
                SEARCH BAR
            ================================================= */}

            <div
                className="
                    p-2
                    border-b
                    bg-white
                    flex-shrink-0
                    space-y-2
                "
            >


                {/* SEARCH */}

                <div className="
                    flex
                    items-center
                    gap-2
                ">


                    {/* SEARCH MODE */}

                    <div className="
                        flex
                        rounded-md
                        border
                        border-slate-200
                        overflow-hidden
                        flex-shrink-0
                    ">

                        <button
                            onClick={() =>
                                setSearchMode(
                                    "employee"
                                )
                            }
                            className={`
                                px-2
                                py-1.5
                                text-[9px]
                                ${
                                    searchMode ===
                                    "employee"
                                        ? `
                                            ${THEME.bg50}
                                            ${THEME.text700}
                                          `
                                        : `
                                            bg-white
                                            text-slate-500
                                          `
                                }
                            `}
                        >
                            Employee
                        </button>

                        <button
                            onClick={() =>
                                setSearchMode(
                                    "manager"
                                )
                            }
                            className={`
                                px-2
                                py-1.5
                                text-[9px]
                                border-l
                                border-slate-200

                                ${
                                    searchMode ===
                                    "manager"
                                        ? `
                                            ${THEME.bg50}
                                            ${THEME.text700}
                                          `
                                        : `
                                            bg-white
                                            text-slate-500
                                          `
                                }
                            `}
                        >
                            Manager
                        </button>

                    </div>


                    {/* SEARCH INPUT */}

                    <div className="
                        relative
                        flex-1
                    ">

                        <Search
                            className="
                                absolute
                                left-2
                                top-1.5
                                w-3.5
                                h-3.5
                                text-slate-400
                            "
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={e =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder={
                                searchMode ===
                                "manager"
                                    ? "Search manager..."
                                    : "Search employee..."
                            }
                            className="
                                w-full
                                pl-7
                                pr-2
                                py-1.5
                                text-xs
                                border
                                border-slate-200
                                rounded-md
                                focus:outline-none
                                focus:ring-1
                                focus:ring-blue-300
                            "
                        />

                    </div>

                </div>


                {/* TEAM VIEW */}

                {viewingManager && (

                    <div className="
                        flex
                        items-center
                        justify-between
                        px-2
                        py-1.5
                        rounded-md
                        bg-blue-50
                        border
                        border-blue-100
                    ">

                        <div className="
                            flex
                            items-center
                            gap-1.5
                            min-w-0
                        ">

                            <Users
                                className="
                                    w-3.5
                                    h-3.5
                                    text-blue-600
                                    flex-shrink-0
                                "
                            />

                            <span className="
                                text-[10px]
                                text-blue-700
                            ">
                                Viewing team of
                            </span>

                            <span className="
                                text-[10px]
                                font-semibold
                                text-blue-800
                                truncate
                            ">
                                {
                                    viewingManager.managerName
                                }
                            </span>

                        </div>


                        <button
                            onClick={
                                clearTeamView
                            }
                            className="
                                flex
                                items-center
                                gap-1
                                text-[9px]
                                text-blue-600
                                hover:text-blue-800
                                px-1.5
                                py-0.5
                                rounded
                                hover:bg-blue-100
                            "
                        >

                            <ArrowLeft
                                className="w-3 h-3"
                            />

                            All employees

                        </button>

                    </div>

                )}

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div
                className="
                    flex-1
                    overflow-auto
                    min-h-0
                "
            >

                <table
                    className="
                        w-full
                        text-xs
                        border-collapse
                    "
                >

                    <thead
                        className="
                            bg-slate-50
                            sticky
                            top-0
                            z-10
                            border-b
                        "
                    >

                        <tr>

                            <th
                                className="
                                    p-2
                                    text-left
                                    font-medium
                                    text-slate-500
                                "
                            >
                                Employee
                            </th>

                            <th
                                className="
                                    p-2
                                    text-left
                                    font-medium
                                    text-slate-500
                                "
                            >
                                Role
                            </th>

                            <th
                                className="
                                    p-2
                                    text-left
                                    font-medium
                                    text-slate-500
                                "
                            >
                                Category
                            </th>

                            <th
                                className="
                                    p-2
                                    text-left
                                    font-medium
                                    text-slate-500
                                "
                            >
                                Reports To
                            </th>

                            <th
                                className="
                                    p-2
                                    text-center
                                    font-medium
                                    text-slate-500
                                    w-20
                                "
                            >
                                Team
                            </th>

                            <th
                                className="
                                    p-2
                                    text-center
                                    font-medium
                                    text-slate-500
                                    w-16
                                "
                            >
                                Select
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {filteredRows.map(
                            (row, index) => {

                                const selected =
                                    selectedIds.includes(
                                        row.userId
                                    );

                                const role =
                                    getRole(row);


                                return (

                                    <tr
                                        key={
                                            row.rowKey
                                        }
                                        className={`
                                            border-b
                                            border-slate-100

                                            ${
                                                index % 2
                                                    ? "bg-slate-50/50"
                                                    : "bg-white"
                                            }

                                            ${
                                                selected
                                                    ? `${THEME.bg50}/70`
                                                    : ""
                                            }
                                        `}
                                    >


                                        {/* EMPLOYEE */}

                                        <td className="
                                            p-2
                                        ">

                                            <button
                                                onClick={() =>
                                                    onToggleUser(
                                                        row.userId
                                                    )
                                                }
                                                disabled={
                                                    isLoading
                                                }
                                                className={`
                                                    font-medium
                                                    text-left
                                                    ${THEME.hoverText700}

                                                    ${
                                                        selected
                                                            ? THEME.text700
                                                            : "text-slate-800"
                                                    }
                                                `}
                                            >

                                                {getFullName(
                                                    row
                                                )}

                                            </button>

                                            <div className="
                                                text-[9px]
                                                text-slate-400
                                            ">
                                                {
                                                    row.userId
                                                }
                                            </div>

                                        </td>


                                        {/* ROLE */}

                                        <td className="
                                            p-2
                                        ">

                                            <span
                                                className="
                                                    text-[9px]
                                                    px-1.5
                                                    py-0.5
                                                    rounded-full
                                                    whitespace-nowrap
                                                "
                                                style={{
                                                    background:
                                                        role.bg,
                                                    color:
                                                        role.color
                                                }}
                                            >

                                                {
                                                    row.roleName ||
                                                    role.text
                                                }

                                            </span>

                                        </td>


                                        {/* CATEGORY */}

                                        <td className="
                                            p-2
                                        ">

                                            <span className="
                                                text-[9px]
                                                px-1.5
                                                py-0.5
                                                rounded
                                                bg-slate-100
                                                text-slate-600
                                                border
                                                border-slate-200
                                            ">

                                                {
                                                    row.categoryName
                                                }

                                            </span>

                                        </td>


                                        {/* REPORTING MANAGER */}

                                        <td className="
                                            p-2
                                        ">

                                            {row.managerName ? (

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-1
                                                ">

                                                    <span className="
                                                        text-[10px]
                                                        text-slate-700
                                                    ">
                                                        {
                                                            row.managerName
                                                        }
                                                    </span>

                                                </div>

                                            ) : (

                                                <span className="
                                                    text-[10px]
                                                    text-slate-400
                                                ">
                                                    —
                                                </span>

                                            )}

                                        </td>


                                        {/* VIEW TEAM */}

                                        <td className="
                                            p-2
                                            text-center
                                        ">

                                            {row.userId &&
                                                managerTeamCounts[
                                                    row.userId
                                                ] > 0 ? (

                                                <button
                                                    onClick={() => {

                                                        setViewingManager({

                                                            managerId:
                                                                row.userId,

                                                            managerName:
                                                                getFullName(
                                                                    row
                                                                )

                                                        });

                                                        setSearch("");

                                                    }}
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1
                                                        px-1.5
                                                        py-1
                                                        rounded
                                                        text-[9px]
                                                        text-blue-600
                                                        bg-blue-50
                                                        hover:bg-blue-100
                                                        border
                                                        border-blue-100
                                                    "
                                                    title="View this manager's team"
                                                >

                                                    <Users
                                                        className="
                                                            w-3
                                                            h-3
                                                        "
                                                    />

                                                    {
                                                        managerTeamCounts[
                                                            row.userId
                                                        ]
                                                    }

                                                </button>

                                            ) : (

                                                <span className="
                                                    text-[9px]
                                                    text-slate-300
                                                ">
                                                    —
                                                </span>

                                            )}

                                        </td>


                                        {/* SELECT */}

                                        <td className="
                                            p-2
                                            text-center
                                        ">

                                            <button
                                                onClick={() =>
                                                    onToggleUser(
                                                        row.userId
                                                    )
                                                }
                                                disabled={
                                                    isLoading
                                                }
                                                className={`
                                                    w-5
                                                    h-5
                                                    rounded
                                                    border
                                                    flex
                                                    items-center
                                                    justify-center
                                                    mx-auto

                                                    ${
                                                        selected
                                                            ? `
                                                                ${THEME.bg500}
                                                                ${THEME.border500}
                                                                text-white
                                                              `
                                                            : `
                                                                bg-white
                                                                border-slate-300
                                                                ${THEME.hoverBorder400}
                                                              `
                                                    }
                                                `}
                                            >

                                                {selected && (

                                                    <Check
                                                        className="
                                                            w-3
                                                            h-3
                                                        "
                                                    />

                                                )}

                                            </button>

                                        </td>

                                    </tr>

                                );

                            }
                        )}

                    </tbody>

                </table>


                {filteredRows.length === 0 && (

                    <div className="
                        p-8
                        text-center
                        text-xs
                        text-slate-400
                    ">

                        {viewingManager
                            ? "No team members found."
                            : "No employees found."
                        }

                    </div>

                )}

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="
                px-2
                py-1.5
                border-t
                bg-slate-50
                flex-shrink-0
                text-[10px]
                text-slate-500
                flex
                items-center
                justify-between
            ">

                <span>
                    {filteredRows.length} rows
                </span>

                {viewingManager && (

                    <span className="
                        text-blue-600
                    ">
                        Team view
                    </span>

                )}

            </div>

        </div>
    );
}


// ============================================================
// CATEGORY HEADER
// ============================================================

function CategoryHeader({
    category,
    onRemove
}) {

    return (

        <div className="
            flex
            items-center
            justify-between
            px-2.5
            py-1.5
            rounded-md
            bg-slate-100
            border
            border-slate-200
            mb-1.5
        ">

            <div className="
                flex
                items-center
                gap-2
                min-w-0
            ">

                <span className="
                    w-1.5
                    h-4
                    rounded-full
                    bg-blue-400
                " />

                <span className="
                    font-semibold
                    text-xs
                    text-slate-700
                    whitespace-nowrap
                ">
                    {category.categoryName}
                </span>

                <span className="
                    text-[9px]
                    text-slate-400
                ">
                    {category.users?.length || 0} root
                </span>

            </div>


            <button
                onClick={() =>
                    onRemove(
                        category.categoryId
                    )
                }
                className="
                    w-5
                    h-5
                    rounded
                    flex
                    items-center
                    justify-center
                    text-slate-400
                    hover:text-red-500
                    hover:bg-red-50
                "
                title="Remove category"
            >

                <X className="w-3 h-3" />

            </button>

        </div>

    );
}


// ============================================================
// MAIN USER TREE
// ============================================================

export default function UserTree({
    data,
    onSelectionChange,
    isLoading = false,
    selectedIds = []
}) {

    const [viewMode, setViewMode] =
        useState("tree");

    const [showTooltip, setShowTooltip] =
        useState(true);

    const [expandedMap, setExpandedMap] =
        useState({});

    const [
        selectedCategoryIds,
        setSelectedCategoryIds
    ] = useState([]);


    // ========================================================
    // SALES DEPARTMENT ONLY
    // ========================================================

    const salesDepartment =
        useMemo(() => {

            if (
                !data?.departments?.length
            ) {
                return null;
            }

            return data.departments.find(
                department =>
                    department.departmentName
                        ?.trim()
                        .toLowerCase() ===
                    "sales"
            ) || data.departments[0];

        }, [data]);


    // ========================================================
    // ALL SALES CATEGORIES
    // ========================================================

    const allCategories =
        useMemo(() => {

            return (
                salesDepartment?.categories ||
                []
            );

        }, [salesDepartment]);


    // ========================================================
    // DEFAULT SELECT ALL CATEGORIES
    // ========================================================

    useEffect(() => {

        if (
            allCategories.length > 0 &&
            selectedCategoryIds.length === 0
        ) {

            setSelectedCategoryIds(
                allCategories.map(
                    category =>
                        category.categoryId
                )
            );

        }

    }, [
        allCategories,
        selectedCategoryIds.length
    ]);


    // ========================================================
    // SELECTED CATEGORIES
    // ========================================================

    const selectedCategories =
        useMemo(() => {

            return allCategories.filter(
                category =>
                    selectedCategoryIds.includes(
                        category.categoryId
                    )
            );

        }, [
            allCategories,
            selectedCategoryIds
        ]);


    // ========================================================
    // CATEGORY TOGGLE
    // ========================================================

    const toggleCategory =
        categoryId => {

            setSelectedCategoryIds(prev => {

                if (
                    prev.includes(
                        categoryId
                    )
                ) {

                    return prev.filter(
                        id =>
                            id !== categoryId
                    );

                }

                return [
                    ...prev,
                    categoryId
                ];

            });

        };


    // ========================================================
    // REMOVE CATEGORY
    // ========================================================

    const removeCategory =
        categoryId => {

            setSelectedCategoryIds(
                prev =>
                    prev.filter(
                        id =>
                            id !== categoryId
                    )
            );

        };


    // ========================================================
    // CLEAR USER SELECTION
    // ========================================================

    const clearUserSelection =
        () => {

            onSelectionChange?.([]);

        };


    // ========================================================
    // USER SELECTION
    //
    // GLOBAL BY USER ID
    // ========================================================

    const toggleUser =
        userId => {

            if (isLoading) {
                return;
            }

            const updated =
                selectedIds.includes(
                    userId
                )

                    ? selectedIds.filter(
                        id =>
                            id !== userId
                    )

                    : [
                        ...selectedIds,
                        userId
                    ];

            onSelectionChange?.(
                updated
            );

        };


    // ========================================================
    // TEAM SELECTION
    // ========================================================

    const selectTeam =
        (
            childIds,
            select
        ) => {

            if (isLoading) {
                return;
            }

            let updated = [
                ...selectedIds
            ];


            if (select) {

                childIds.forEach(id => {

                    if (
                        !updated.includes(id)
                    ) {

                        updated.push(id);

                    }

                });

            } else {

                updated =
                    updated.filter(
                        id =>
                            !childIds.includes(
                                id
                            )
                    );

            }


            onSelectionChange?.(
                updated
            );

        };


    // ========================================================
    // EXPAND / COLLAPSE
    // ========================================================

    const toggleExpand =
        key => {

            setExpandedMap(prev => ({

                ...prev,

                [key]:
                    !(prev[key] ?? true)

            }));

        };


    // ========================================================
    // SELECTED COUNT
    // ========================================================

    const selectedCount =
        selectedIds.length;


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <div
            className="
                flex
                flex-col
                h-full
                min-h-0
                bg-white
                border
                border-slate-200
                rounded-lg
                overflow-hidden
            "
        >


            {/* =================================================
                TOP BAR
            ================================================= */}

            <div className="
                flex
                items-center
                justify-between
                gap-2
                px-2
                py-1.5
                border-b
                bg-white
                flex-shrink-0
            ">


                {/* VIEW TOGGLE */}

                <div className="
                    flex
                    items-center
                    gap-1
                ">

                    <button
                        onClick={() =>
                            setViewMode(
                                "tree"
                            )
                        }
                        className={`
                            flex
                            items-center
                            gap-1
                            px-2
                            py-1
                            rounded
                            text-[10px]
                            border

                            ${
                                viewMode ===
                                "tree"
                                    ? `
                                        ${THEME.bg500}
                                        text-white
                                        ${THEME.border500}
                                      `
                                    : `
                                        bg-white
                                        text-slate-500
                                        border-slate-200
                                      `
                            }
                        `}
                    >

                        <GitBranch
                            className="w-3 h-3"
                        />

                        Tree

                    </button>


                    <button
                        onClick={() =>
                            setViewMode(
                                "table"
                            )
                        }
                        className={`
                            flex
                            items-center
                            gap-1
                            px-2
                            py-1
                            rounded
                            text-[10px]
                            border

                            ${
                                viewMode ===
                                "table"
                                    ? `
                                        ${THEME.bg500}
                                        text-white
                                        ${THEME.border500}
                                      `
                                    : `
                                        bg-white
                                        text-slate-500
                                        border-slate-200
                                      `
                            }
                        `}
                    >

                        <List
                            className="w-3 h-3"
                        />

                        Table

                    </button>

                </div>


                {/* SELECTION */}

                <div className="
                    flex
                    items-center
                    gap-2
                ">

                    <span className="
                        text-[10px]
                        text-slate-500
                    ">
                        {selectedCount} selected
                    </span>


                    {selectedCount > 0 && (

                        <button
                            onClick={
                                clearUserSelection
                            }
                            className="
                                flex
                                items-center
                                gap-1
                                text-[10px]
                                text-red-500
                                hover:text-red-700
                                px-1.5
                                py-1
                                rounded
                                hover:bg-red-50
                            "
                            title="Clear all selected users"
                        >

                            <RotateCcw
                                className="w-3 h-3"
                            />

                            Clear users

                        </button>

                    )}

                </div>

            </div>


            {/* =================================================
                CATEGORY SELECTION

                Only shown when there is more than one
                category to choose from — with a single
                category there's nothing to select.
            ================================================= */}

            {allCategories.length > 1 && (

                <div className="
                    px-2
                    py-1.5
                    border-b
                    bg-slate-50
                    flex-shrink-0
                ">

                    <div className="
                        flex
                        items-center
                        gap-1.5
                        flex-wrap
                    ">

                        <span className="
                            text-[10px]
                            font-semibold
                            text-slate-500
                            mr-1
                        ">
                            Categories:
                        </span>


                        {allCategories.map(
                            category => {

                                const checked =
                                    selectedCategoryIds.includes(
                                        category.categoryId
                                    );


                                return (

                                    <label
                                        key={
                                            category.categoryId
                                        }
                                        className={`
                                            flex
                                            items-center
                                            gap-1
                                            px-2
                                            py-1
                                            rounded-full
                                            border
                                            cursor-pointer
                                            text-[10px]
                                            whitespace-nowrap
                                            transition

                                            ${
                                                checked
                                                    ? `
                                                        ${THEME.bg50}
                                                        ${THEME.border300}
                                                        ${THEME.text700}
                                                      `
                                                    : `
                                                        bg-white
                                                        border-slate-200
                                                        text-slate-500
                                                      `
                                            }
                                        `}
                                    >

                                        <input
                                            type="checkbox"
                                            checked={
                                                checked
                                            }
                                            onChange={() =>
                                                toggleCategory(
                                                    category.categoryId
                                                )
                                            }
                                            className="
                                                accent-blue-500
                                                w-3
                                                h-3
                                            "
                                        />

                                        {
                                            category.categoryName
                                        }

                                    </label>

                                );

                            }
                        )}

                    </div>

                </div>

            )}


            {/* =================================================
                ACTIVE CATEGORY CHIPS
            ================================================= */}
{/* 
            {viewMode === "tree" &&
                selectedCategories.length > 0 && (

                    <div className="
                        px-2
                        py-1
                        border-b
                        bg-white
                        flex-shrink-0
                        flex
                        gap-1
                        overflow-x-auto
                    ">

                        {selectedCategories.map(
                            category => (

                                <div
                                    key={
                                        category.categoryId
                                    }
                                    className="
                                        flex
                                        items-center
                                        gap-1
                                        bg-slate-100
                                        border
                                        border-slate-200
                                        rounded
                                        px-1.5
                                        py-0.5
                                        text-[9px]
                                        text-slate-600
                                        whitespace-nowrap
                                    "
                                >

                                    {
                                        category.categoryName
                                    }

                                    <button
                                        onClick={() =>
                                            removeCategory(
                                                category.categoryId
                                            )
                                        }
                                        className="
                                            text-slate-400
                                            hover:text-red-500
                                        "
                                        title="Remove category"
                                    >

                                        <X
                                            className="
                                                w-2.5
                                                h-2.5
                                            "
                                        />

                                    </button>

                                </div>

                            )
                        )}

                    </div>

                )} */}


            {/* =================================================
                TOOLTIP CONTROL
            ================================================= */}

            {viewMode === "tree" && (

                <div className="
                    flex
                    items-center
                    justify-end
                    px-2
                    py-0.5
                    border-b
                    bg-slate-50
                    flex-shrink-0
                ">

                    <label className="
                        flex
                        items-center
                        gap-1
                        text-[9px]
                        text-slate-500
                        cursor-pointer
                    ">

                        <input
                            type="checkbox"
                            checked={
                                showTooltip
                            }
                            onChange={() =>
                                setShowTooltip(
                                    value =>
                                        !value
                                )
                            }
                            className="
                                accent-blue-500
                                w-3
                                h-3
                            "
                        />

                        Details on hover

                    </label>

                </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {isLoading && (

                <div className="
                    px-2
                    py-1
                    bg-blue-50
                    border-b
                    border-blue-100
                    text-blue-600
                    text-[10px]
                    flex-shrink-0
                ">

                    Fetching hierarchy...

                </div>

            )}


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="
                flex-1
                min-h-0
                overflow-hidden
            ">


                {/* =================================================
                    TREE
                ================================================= */}

                {viewMode === "tree" && (

                    <div className="
                        h-full
                        overflow-auto
                        p-2
                    ">

                        {selectedCategories.length === 0 ? (

                            <div className="
                                h-full
                                flex
                                items-center
                                justify-center
                                text-xs
                                text-slate-400
                            ">

                                Select a category to view
                                its hierarchy.

                            </div>

                        ) : (

                            <div className="
                                space-y-3
                                min-w-max
                            ">

                                {selectedCategories.map(
                                    category => (

                                        <div
                                            key={
                                                category.categoryId
                                            }
                                        >

                                            {/* CATEGORY */}

                                            <CategoryHeader
                                                category={
                                                    category
                                                }
                                                onRemove={
                                                    removeCategory
                                                }
                                            />


                                            {/* USERS */}

                                            <div className="
                                                pl-1
                                            ">

                                                {(
                                                    category.users ||
                                                    []
                                                ).map(
                                                    user => (

                                                        <TreeNode
                                                            key={`
                                                                ${category.categoryId}-
                                                                ${user.userId}
                                                            `}
                                                            node={
                                                                user
                                                            }
                                                            category={
                                                                category
                                                            }
                                                            selectedIds={
                                                                selectedIds
                                                            }
                                                            onToggleUser={
                                                                toggleUser
                                                            }
                                                            onSelectTeam={
                                                                selectTeam
                                                            }
                                                            expandedMap={
                                                                expandedMap
                                                            }
                                                            onToggleExpand={
                                                                toggleExpand
                                                            }
                                                            showTooltip={
                                                                showTooltip
                                                            }
                                                            isLoading={
                                                                isLoading
                                                            }
                                                        />

                                                    )
                                                )}


                                                {(
                                                    category.users ||
                                                    []
                                                ).length ===
                                                    0 && (

                                                        <div className="
                                                            text-[10px]
                                                            text-slate-400
                                                            px-2
                                                            py-2
                                                        ">

                                                            No users
                                                            found.

                                                        </div>

                                                    )}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                )}


                {/* =================================================
                    TABLE
                ================================================= */}

                {viewMode === "table" && (

                    <TableView
                        categories={
                            selectedCategories
                        }
                        selectedIds={
                            selectedIds
                        }
                        onToggleUser={
                            toggleUser
                        }
                        isLoading={
                            isLoading
                        }
                    />

                )}

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            {selectedCount > 0 && (

                <div className="
                    flex-shrink-0
                    px-2
                    py-1
                    border-t
                    bg-blue-50
                    text-[9px]
                    text-blue-600
                    flex
                    items-center
                    gap-1
                ">

                    <UserRound
                        className="w-3 h-3"
                    />

                    Selection is based on User ID.
                    The same employee remains selected
                    across categories.

                </div>

            )}

        </div>
    );
}
