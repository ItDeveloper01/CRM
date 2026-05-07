import React, { useState, useEffect, useMemo, useRef } from "react";
// import { fetchTablesApi, saveTableApi,checkActiveRecordsApi, TABLE_API_MAP } from "../api/tableApi";
import { useGetSessionUser } from "../../src/SessionContext";
import { useMessageBox } from "../Notification"; 
import { MESSAGE_TYPES } from "../Constants" ;
import { Trash2, Undo2, XCircle } from "lucide-react";



// ================= THEME =================
const THEME = {
  tableContainer: "border rounded-2xl p-4 shadow-sm bg-white",
  headerBg: "bg-gray-100",
  hoverRow: "hover:bg-gray-50",

  newRow: "bg-green-50",
  dirtyRow: "bg-yellow-50",

  buttonPrimary:
    "px-3 py-1 rounded-lg bg-blue-600 text-white disabled:opacity-40",
  buttonAdd: "px-3 py-1 rounded-lg bg-green-600 text-white",
  buttonSecondary: "px-3 py-1 rounded-lg border text-gray-600",

  deleteText: "text-red-600 text-sm",

  activeBtn: "px-2 py-1 text-xs rounded bg-green-600 text-white",
  inactiveBtn: "px-2 py-1 text-xs rounded bg-gray-400 text-white",

  input: "border rounded px-2 py-1 w-full",
  inputError: "border-red-500",
  searchInput: "w-full border rounded-lg px-3 py-2 pr-10",
};

// ================= STATUS TOGGLE =================
// function StatusToggle({ value, onToggle }) {
//   debugger;
//   const isActive = String(value).toLowerCase() === "active";

//   return (
//     <button
//       onClick={() => {
//         if (
//           window.confirm(`Mark as ${isActive ? "Inactive" : "Active"}?`)
//         ) {
//           onToggle(isActive ? "Inactive" : "Active");
//         }
//       }}
//       className={isActive ? THEME.activeBtn : THEME.inactiveBtn}
//     >
//       {isActive ? "Active" : "Inactive"}
//     </button>
//   );
// }

function StatusToggle({ value, onToggle }) {
  const isActive = String(value).toLowerCase() === "active";

  const handleToggle = () => {
    const nextValue = isActive ? "Inactive" : "Active";

    const confirmed = window.confirm(`Mark as ${nextValue}?`);
    if (!confirmed) return;

    onToggle(nextValue);
  };
 
  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 ${
        isActive ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full shadow-md transition-transform duration-300 ${
          isActive ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ================= MAIN COMPONENT =================
export default function CommonTablesBoard({
 fetchTablesApi,
  saveTableApi,
 checkActiveRecordsApi, refreshKey 
}) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableSearch, setTableSearch] = useState("");
   const { showMessage } = useMessageBox();

  const { user } = useGetSessionUser();

  const tableRefs = useRef({});

  // ================= FETCH =================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTablesApi(user.token);

        // const formatted = data.map((t) => ({
        //   ...t,
        //   rows: t.rows.map((r) => ({
        //     ...r,
        //     isDirty: false,
        //     isNew: false,
        //     isEditing: false,
        //     errors: {},
        //   })),
        // }));

        const formatted = data.map((t) => {
  const rows = t.rows.map((r) => ({
    ...r,
    isDirty: false,
    isNew: false,
    isEditing: false,
    isDeleted: false,   // ✅ ADD THIS
    errors: {},
  }));

  return {
    ...t,
    rows,
    originalRows: JSON.parse(JSON.stringify(rows)), // ✅ snapshot
  };
});

        setTables(formatted);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) load();
  }, [user,refreshKey]);

  // ================= HELPERS =================
  const markDirty = (row, updates) => ({
    ...row,
    ...updates,
    isDirty: !row.isNew,
    errors: {},
  });

  const tableHasChanges = (table) =>
    table.rows.some((r) => r.isNew || r.isDirty);

  const tableHasValidChanges = (table) => {
    return table.rows.some((r) => {
      if (!(r.isNew || r.isDirty)) return false;

      return table.columns.every((col) => {
        if (!col.editable) return true;
        const val = r[col.key];
        return val !== "" && val !== null && val !== undefined;
      });
    });
  };

  const validateTable = (table) => {
    let isValid = true;

    const updatedRows = table.rows.map((row) => {
      const errors = {};

      table.columns.forEach((col) => {
        if (!col.editable) return;

        const value = row[col.key];

        if (value === "" || value === null || value === undefined) {
          errors[col.key] = "Required";
          isValid = false;
        }
      });

      return { ...row, errors };
    });

    return { isValid, updatedRows };
  };

  // ================= HANDLERS =================
  const handleInputChange = (tableId, rowId, column, value) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id !== tableId
          ? t
          : {
              ...t,
              rows: t.rows.map((r) =>
                r.id !== rowId ? r : markDirty(r, { [column]: value })
              ),
            }
      )
    );
  };

  const handleToggleStatus = (tableId, rowId, value , row) => {

    debugger;
    console.log("Toggling status for", { tableId, rowId, value, row });

    //handleInputChange(tableId, rowId, "Active", value);

    handleToggleStatusCHange(tableId, row);
  };

  const handleToggleStatusCHange = (tableId, row) => {
  setTables((prev) =>
    prev.map((t) =>
      t.id !== tableId
        ? t
        : {
            ...t,
            rows: t.rows.map((r) => {
              // ✅ match correct row using backend Id
              if (r.Id !== row.Id) return r;

              // ✅ toggle value
              const isActive =
                String(r.Active || "").toLowerCase() === "active";

              const newValue = isActive ? "Inactive" : "Active";

              return {
                ...r,
                Active: newValue,          // ✅ toggle
                isDirty: !r.isNew,         // ✅ mark dirty (important for Save)
                errors: {},                // ✅ clear errors
              };
            }),
          }
    )
  );
};

  const handleAddRow = (tableId) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;

        const existingIds = t.rows
          .map((r) => Number(r.Id))
          .filter((id) => !isNaN(id));

        const nextId =
          existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

        const newRow = {
          id: `new-${Date.now()}`,
          Id: nextId,
          isNew: true,
          isDirty: true,
          isEditing: true,
          Active: "Active",
          errors: {},
        };

        t.columns.forEach((col) => {
          if (!(col.key in newRow)) newRow[col.key] = "";
        });

        return { ...t, rows: [...t.rows, newRow] };
      })
    );

    setTimeout(() => {
      const el = tableRefs.current[tableId];
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
    }, 100);
  };

  debugger;
  const handleDeleteRow = (tableId, rowId) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id !== tableId
          ? t
          : { ...t, rows: t.rows.filter((r) => r.id !== rowId) }
      )
    );
  };

  debugger;
  const handleSoftDelete = async (tableId, row) => {
  // ✅ New row → direct remove
  if (row.isNew) {
    setTables((prev) =>
      prev.map((t) =>
        t.id !== tableId
          ? t
          : { ...t, rows: t.rows.filter((r) => r.id !== row.id) }
      )
    );
    return;
  }

  try {

    debugger;
    // ✅ Backend validation
    //const res = await fetch(`/api/master/${tableId}/can-delete/${row.Id}`);
    //const data = await res.json();

   
//     const res = await checkActiveRecordsApi(tableId, row, user.token);

//     debugger;
//     let data={};

//     console.log("API response for delete validation:", res.result);
//  if(res.result.recordCount>0)
//    {
//        data = { canDelete: res.result.canDelete, message: "This item is linked to "+res.result.recordCount+" active records." }; // Mocked response
//     }
//     else
//     {
//       data= { canDelete: res.result.canDelete, message: "No active records linked." }; // Mocked response
//     }

 
debugger;
let confirmed = false;

// if (!data.canDelete) {
//   // ❌ Only message, no confirmation
//   //alert(`⚠️ ${data.message}`);
//   showMessage(` ${data.message}.` + " Can't be deleted.", MESSAGE_TYPES.WARNING);
//   return;
// }

// ✅ Only when canDelete = true
confirmed = window.confirm("Are you sure you want to delete?");

if (!confirmed) return;

 

    // ✅ Mark as deleted
    setTables((prev) =>
      prev.map((t) =>
        t.id !== tableId
          ? t
          : {
              ...t,
              rows: t.rows.map((r) =>
                r.Id === row.Id
                  ? {
                      ...r,
                      isDeleted: true,
                      isDirty: true,
                    }
                  : r
              ),
            }
      )
    );
  } catch (err) {
    console.error("Delete validation failed", err);
  }
};

const handleUndoDelete = (tableId, row) => {
  setTables((prev) =>
    prev.map((t) =>
      t.id !== tableId
        ? t
        : {
            ...t,
            rows: t.rows.map((r) =>
              r.Id === row.Id
                ? {
                    ...r,
                    isDeleted: false,
                    isDirty: false,
                  }
                : r
            ),
          }
    )
  );
};
  // const handleUndoAll = (tableId) => {
  //   setTables((prev) =>
  //     prev.map((t) => {
  //       if (t.id !== tableId) return t;

  //       return {
  //         ...t,
  //         rows: t.rows
  //           .filter((r) => !r.isNew)
  //           .map((r) => ({
  //             ...r,
  //             isDirty: false,
  //             isEditing: false,
  //             errors: {},
  //           })),
  //       };
  //     })
  //   );
  // };

const handleUndoAll = (tableId) => {
  setTables((prev) =>
    prev.map((t) => {
      if (t.id !== tableId) return t;

      return {
        ...t,
        rows: t.originalRows.map((r) => ({
          ...r,
          isDirty: false,
          isNew: false,
          isEditing: false,
          errors: {},
        })),
      };
    })
  );
};

  const handleSave = async (tableId) => {
    const table = tables.find((t) => t.id === tableId);

    debugger;

    
    const { isValid, updatedRows } = validateTable(table);

    if (!isValid) {
      setTables((prev) =>
        prev.map((t) =>
          t.id !== tableId ? t : { ...t, rows: updatedRows }
        )
      );
      alert("Please fill all required fields ❗");
      return;
    }

    // const payload = {
    //   tableId,
    //   newRows: table.rows.filter((r) => r.isNew),
    //   updatedRows: table.rows.filter((r) => r.isDirty && !r.isNew),
    //   currentUser: user,
    // };

    const payload = {
  tableId,

  newRows: table.rows.filter((r) => r.isNew && !r.isDeleted),

  updatedRows: table.rows.filter((r) => r.isDirty && !r.isNew && !r.isDeleted),

  deletedRows: table.rows.filter((r) => r.isDeleted),

  currentUser: user,
};

    try {
      await saveTableApi(tableId, payload);

      setTables((prev) =>
        prev.map((t) =>
          t.id !== tableId
            ? t
            : {
                ...t,
                rows: t.rows.map((r) => ({
                  ...r,
                  isDirty: false,
                  isNew: false,
                  isEditing: false,
                  errors: {},
                })),

                originalRows: JSON.parse(JSON.stringify(t.rows)), // ✅ reset baseline
              }
        )
      );

      alert("Saved successfully ✅");
    } catch (err) {
      console.error("Save error:", err);
    }
  };
const handleUndoRow = (tableId, row) => {
  setTables((prev) =>
    prev.map((t) => {
      if (t.id !== tableId) return t;

      // 🔍 find original row from snapshot
      const original = t.originalRows.find(
        (r) => r.Id === row.Id
      );

      return {
        ...t,
        rows: t.rows.map((r) => {
          if (r.Id !== row.Id) return r;

          // ✅ revert to original values
          return {
            ...original,
            isDirty: false,
            isNew: false,
            isEditing: false,
            errors: {},
          };
        }),
      };
    })
  );
};
  // ================= SEARCH =================
  const filteredTables = useMemo(() => {
    if (!tableSearch.trim()) return tables;
    return tables.filter((t) =>
      t.title.toLowerCase().includes(tableSearch.toLowerCase())
    );
  }, [tables, tableSearch]);

  // ================= UI =================
  if (loading) return <div className="p-6">Loading...</div>;

return (
  <div className="p-6 font-sans">
    <input
      placeholder="🔎 Search table..."
      value={tableSearch}
      onChange={(e) => setTableSearch(e.target.value)}
      className={THEME.searchInput + " mb-6 max-w-md"}
    />

    <div className="grid grid-cols-2 gap-6">
      {filteredTables.map((table) => (
        <div key={table.id} className={THEME.tableContainer}>
          <h2 className="text-lg font-semibold mb-2">{table.title}</h2>

          <div
            ref={(el) => (tableRefs.current[table.id] = el)}
            className="h-[300px] overflow-y-auto relative"
          >
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-gray-100 z-10 shadow-sm">
                <tr>
                  {table.columns.map((col) => (
                    <th key={col.key} className="p-2 text-left">
                      {col.label}
                    </th>
                  ))}
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {table.rows.map((row) => (
                  <tr
                    key={row.id}
                    className={
                      row.isNew
                        ? THEME.newRow
                        : row.isDirty
                        ? THEME.dirtyRow
                        : ""
                    }
                  >
                    {table.columns.map((col) => {
                      const value = row[col.key];

                      return (
                        <td
                          key={col.key}
                          className={`p-2 ${
                            row.isDeleted
                              ? "opacity-50 line-through"
                              : ""
                          }`}
                        >
                          {col.type === "toggle" ? (
                            <StatusToggle
                              value={value}
                              onToggle={(val) =>
                                handleToggleStatus(
                                  table.id,
                                  row.Id,
                                  val,
                                  row
                                )
                              }
                            />
                          ) : row.isEditing ? (
                            <input
                              value={value || ""}
                              disabled={!col.editable}
                              onChange={(e) =>
                                handleInputChange(
                                  table.id,
                                  row.id,
                                  col.key,
                                  e.target.value
                                )
                              }
                              className={`${THEME.input} ${
                                row.errors?.[col.key]
                                  ? THEME.inputError
                                  : ""
                              }`}
                            />
                          ) : (
                            value ?? "-"
                          )}
                        </td>
                      );
                    })}

                    {/* ✅ Actions Column */}
    <td className="p-2 flex justify-center items-center gap-3">
  {(() => {
    const canDelete =
      row.canBeDeleted === true ||
      row.canBeDeleted === "true" ||
      row.canBeDeleted === 1;

    // 🆕 New Row → Trash
    if (row.isNew) {
      return (
        <button
          onClick={() => handleDeleteRow(table.id, row.id || row.Id)}
          className="text-gray-600 hover:text-red-600 transition"
          title="Remove Row"
        >
          <Trash2 size={18} />
        </button>
      );
    }

    // ❌ Deleted Row → Undo
    if (row.isDeleted) {
      return (
        <button
          onClick={() => handleUndoDelete(table.id, row)}
          className="text-blue-600 hover:text-blue-800 transition"
          title="Undo Delete"
        >
          <Undo2 size={18} />
        </button>
      );
    }

    // 🔄 Dirty Row → Undo
    if (row.isDirty) {
      return (
        <button
          onClick={() => handleUndoRow(table.id, row)}
          className="text-blue-600 hover:text-blue-800 transition"
          title="Undo Changes"   >
          <Undo2 size={18} />
        </button>
      );
    }

    // ✅ Can Delete → Red Delete Icon
    if (canDelete) {
      return (
        <button
          onClick={() => handleSoftDelete(table.id, row)}
          className="text-red-600 hover:text-red-800 transition"
          title="Delete"
        >
          {/* <XCircle size={16} /> */}
            <Trash2 size={18} />
        </button>
      );
    }

    // 🚫 Not Deletable → Badge
    return (
      <span className="text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-semibold title=It is in use.">
        Active
      </span>
    );
  })()}
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleAddRow(table.id)}
              className={THEME.buttonAdd}
            >
              Add Row
            </button>

            <button
              onClick={() => handleSave(table.id)}
              disabled={!tableHasValidChanges(table)}
              className={THEME.buttonPrimary}
            >
              Save Changes
            </button>

            {tableHasChanges(table) && (
              <button
                onClick={() => handleUndoAll(table.id)}
                className={THEME.buttonSecondary}
              >
                Undo All
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// return (
//   <div className="p-6 font-sans">
//     <input
//       placeholder="🔎 Search table..."
//       value={tableSearch}
//       onChange={(e) => setTableSearch(e.target.value)}
//       className={THEME.searchInput + " mb-6 max-w-md"}
//     />

//     <div className="grid grid-cols-2 gap-6">
//       {filteredTables.map((table) => (
//         <div key={table.id} className={THEME.tableContainer}>
//           <h2 className="text-lg font-semibold mb-2">{table.title}</h2>

//           <div
//             ref={(el) => (tableRefs.current[table.id] = el)}
//             className="h-[300px] overflow-y-auto relative"
//           >
//             <table className="w-full border-collapse">
//               <thead className="sticky top-0 bg-gray-100 z-10 shadow-sm">
//                 <tr>
//                   {table.columns.map((col) => (
//                     <th key={col.key} className="p-2 text-left">
//                       {col.label}
//                     </th>
//                   ))}
//                   <th className="p-2">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {table.rows.map((row) => (
//                   <tr
//                     key={row.id}
//                     className={
//                       row.isNew
//                         ? THEME.newRow
//                         : row.isDirty
//                         ? THEME.dirtyRow
//                         : ""
//                     }
//                   >
//                     {table.columns.map((col) => {
//                       const value = row[col.key];

//                       return (
//                         <td
//                           key={col.key}
//                           className={`p-2 ${
//                             row.isDeleted
//                               ? "opacity-50 line-through"
//                               : ""
//                           }`}
//                         >
//                           {col.type === "toggle" ? (
//                             <StatusToggle
//                               value={value}
//                               onToggle={(val) =>
//                                 handleToggleStatus(
//                                   table.id,
//                                   row.Id,
//                                   val,
//                                   row
//                                 )
//                               }
//                             />
//                           ) : row.isEditing ? (
//                             <input
//                               value={value || ""}
//                               disabled={!col.editable}
//                               onChange={(e) =>
//                                 handleInputChange(
//                                   table.id,
//                                   row.id,
//                                   col.key,
//                                   e.target.value
//                                 )
//                               }
//                               className={`${THEME.input} ${
//                                 row.errors?.[col.key]
//                                   ? THEME.inputError
//                                   : ""
//                               }`}
//                             />
//                           ) : (
//                             value ?? "-"
//                           )}
//                         </td>
//                       );
//                     })}

//                     {/* ✅ Single Actions Column */}
//                    <td className="p-2 flex justify-center items-center gap-2">
//                       {row.isNew ? (
//                         /* 🆕 New Row → Hard Delete */
//                         <button
//                           onClick={() =>
//                             handleDeleteRow(
//                               table.id,
//                               row.id || row.Id
//                             )
//                           }
//                           className={THEME.deleteText}
//                           title="Remove Row"
//                         >
//                           🗑
//                         </button>
//                       ) : row.isDirty ? (
//                         /* 🔄 Dirty Row → Undo Only */
//                         <button
//                           onClick={() =>
//                             handleUndoRow(table.id, row)
//                           }
//                           className={THEME.buttonSecondary}
//                           title="Undo Changes"
//                         >
//                           ↩
//                         </button>
//                       ) : row.isDeleted ? (
//                         /* ↩ Deleted Row → Undo Delete */
//                         <button
//                           onClick={() =>
//                             handleUndoDelete(table.id, row)
//                           }
//                           className="text-blue-600 text-xs"
//                           title="Undo Delete"
//                         >
//                           Undo
//                         </button>
//                       ) : (
//                         /* ❌ Normal Row → Soft Delete */
//                         <button
//                           onClick={() =>
//                             handleSoftDelete(table.id, row)
//                           }
//                           className="text-red-600 font-bold"
//                           title="Delete"
//                         >
//                           ❌
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* FOOTER */}
//           <div className="flex gap-2 mt-2">
//             <button
//               onClick={() => handleAddRow(table.id)}
//               className={THEME.buttonAdd}
//             >
//               Add Row
//             </button>

//             <button
//               onClick={() => handleSave(table.id)}
//               disabled={!tableHasValidChanges(table)}
//               className={THEME.buttonPrimary}
//             >
//               Save Changes
//             </button>

//             {tableHasChanges(table) && (
//               <button
//                 onClick={() => handleUndoAll(table.id)}
//                 className={THEME.buttonSecondary}
//               >
//                 Undo All
//               </button>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );
//   return (


//     <div className="p-6 font-sans">
//       <input
//         placeholder="🔎 Search table..."
//         value={tableSearch}
//         onChange={(e) => setTableSearch(e.target.value)}
//         className={THEME.searchInput + " mb-6 max-w-md"}
//       />

//       <div className="grid grid-cols-2 gap-6">
//         {filteredTables.map((table) => (
//           <div key={table.id} className={THEME.tableContainer}>
//             <h2 className="text-lg font-semibold mb-2">{table.title}</h2>

//             {/* <div
//               ref={(el) => (tableRefs.current[table.id] = el)}
//               className="h-[300px] overflow-y-auto"
//             > */}<div
//   ref={(el) => (tableRefs.current[table.id] = el)}
//   className="h-[300px] overflow-y-auto relative"
// >
//               <table className="w-full border-collapse">
//                 <thead className="sticky top-0 bg-gray-100 z-10 shadow-sm">
//                   <tr>
//                     {table.columns.map((col) => (
//                       <th key={col.key} className="p-2 text-left">
//                         {col.label}
//                       </th>
//                     ))}
//                     <th>Delete</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {table.rows.map((row) => (
//                     <tr
//                       key={row.id}
//                       className={
//                         row.isNew
//                           ? THEME.newRow
//                           : row.isDirty
//                           ? THEME.dirtyRow
//                           : ""
//                       }
//                     >
//                       {table.columns.map((col) => {
//                         const value = row[col.key];

//                         return (
//                           <td key={col.key} className="p-2">
//                             {col.type === "toggle" ? (
//                               <StatusToggle
//                                 value={value}
//                                 onToggle={(val) =>
//                                   handleToggleStatus(
//                                     table.id,
//                                     row.Id,
//                                     val,
//                                     row
//                                   )
//                                 }
//                               />
//                             ) : row.isEditing ? (
//                               <input
//                                 value={value || ""}
//                                 disabled={!col.editable}
//                                 onChange={(e) =>
//                                   handleInputChange(
//                                     table.id,
//                                     row.id,
//                                     col.key,
//                                     e.target.value
//                                   )
//                                 }
//                                 className={`${THEME.input} ${
//                                   row.errors?.[col.key]
//                                     ? THEME.inputError
//                                     : ""
//                                 }`}
//                               />
//                             ) : (
//                               value ?? "-"
//                             )}
//                           </td>
//                         );
//                       })}

                     

//                       <td>

//                         <td>
//   {!row.isDeleted ? (
//     <button
//       onClick={() => handleSoftDelete(table.id, row)}
//       className="text-red-600 font-bold"
//     >
//       ❌
//     </button>
//   ) : (
//     <button
//       onClick={() => handleUndoDelete(table.id, row)}
//       className="text-blue-600 text-xs"
//     >
//       Undo
//     </button>
//   )}
// </td>
//   {/* ✅ New Row → Delete */}
//   {row.isNew && (
//     <button
//       onClick={() =>
//         handleDeleteRow(table.id, row.id || row.Id)
//       }
//       className={THEME.deleteText}
//     >
//       Delete
//     </button>
//   )}

//   {/* ✅ Existing Dirty Row → Undo */}
//   {!row.isNew && row.isDirty && (
//     <button
//       onClick={() =>
//         handleUndoRow(table.id, row)
//       }
//       className={THEME.buttonSecondary}
//     >
//       Undo
//     </button>
//   )}
// </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* FOOTER */}
//             <div className="flex gap-2 mt-2">
//               <button
//                 onClick={() => handleAddRow(table.id)}
//                 className={THEME.buttonAdd}
//               >
//                 Add Row
//               </button>

//               <button
//                 onClick={() => handleSave(table.id)}
//                 disabled={!tableHasValidChanges(table)}
//                 className={THEME.buttonPrimary}
//               >
//                 Save Changes
//               </button>

//               {tableHasChanges(table) && (
//                 <button
//                   onClick={() => handleUndoAll(table.id)}
//                   className={THEME.buttonSecondary}
//                 >
//                   Undo All
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
}