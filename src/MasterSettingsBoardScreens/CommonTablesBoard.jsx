import React, { useState, useRef, useMemo } from "react";

// ================= THEME / STYLE CONSTANTS =================
const THEME = {
  tableContainer: "border rounded-2xl p-4 shadow-sm bg-white",
  headerBg: "bg-gray-100",
  hoverRow: "hover:bg-gray-50",
  newRow: "bg-green-50",
  dirtyRow: "bg-yellow-50",

  buttonPrimary: "px-3 py-1 rounded-lg bg-blue-600 text-white disabled:opacity-40",
  buttonAdd: "px-3 py-1 rounded-lg bg-green-600 text-white",
  buttonDangerOutline: "px-3 py-1 rounded-lg border border-red-500 text-red-500",

  editText: "text-blue-600 text-sm",
  undoText: "text-gray-600 text-sm",
  deleteText: "text-red-600 text-sm",

  input: "border rounded px-2 py-1 w-full",
  searchInput: "w-full border rounded-lg px-3 py-2 pr-10",
  clearButton: "absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
};

const initialTables = [
  {
    id: 1,
    title: "Table 1",
    headers: ["Name", "Count", "Status"],
    rows: [
      { id: "1-1", Name: "Item A", Count: 3, Status: "OK" },
      { id: "1-2", Name: "Item B", Count: 5, Status: "OK" },
    ],
  },
  {
    id: 2,
    title: "Table 2",
    headers: ["Product", "Qty", "Available"],
    rows: [
      { id: "2-1", Product: "Prod X", Qty: 10, Available: "Yes" },
      { id: "2-2", Product: "Prod Y", Qty: 0, Available: "No" },
      { id: "2-3", Product: "Prod Z", Qty: 7, Available: "Yes" },
    ],
  },
  {
    id: 3,
    title: "Table 3",
    headers: ["User", "Score", "Active"],
    rows: [
      { id: "3-1", User: "Alice", Score: 42, Active: true },
      { id: "3-2", User: "Bob", Score: 37, Active: false },
    ],
  },
];

export default function CommonTablesBoard() {
  const [tableSearch, setTableSearch] = useState("");
  const containerRefs = useRef({});

  const [tables, setTables] = useState(() =>
    initialTables.map((t) => ({
      ...t,
      rows: t.rows.map((r) => ({ ...r, isDirty: false, isEditing: false }))
    }))
  );

  const [sortConfig, setSortConfig] = useState({});

  const startEditRow = (tableId, rowId) => {
    setTables(prev =>
      prev.map(t => {
        if (t.id !== tableId) return t;

        return {
          ...t,
          rows: t.rows.map(r => {
            if (r.id !== rowId) return r;

            return {
              ...r,
              isEditing: true,
              originalRow: { ...r }
            };
          })
        };
      })
    );
  };

  const cancelEditRow = (tableId, rowId) => {
    setTables(prev =>
      prev.map(t => {
        if (t.id !== tableId) return t;

        return {
          ...t,
          rows: t.rows.map(r => {
            if (r.id !== rowId) return r;

            if (r.originalRow) {
              const { originalRow } = r;
              return {
                ...originalRow,
                isEditing: false,
                isDirty: false
              };
            }

            return r;
          })
        };
      })
    );
  };

  const markDirty = (row, updates) => ({ ...row, ...updates, isDirty: !row.isNew });

  const handleDropdownChange = (tableId, rowId, column, value) => {
    setTables(prev =>
      prev.map(t => {
        if (t.id !== tableId) return t;

        return {
          ...t,
          rows: t.rows.map(r => {
            if (r.id !== rowId) return r;

            if (column === "Active") return markDirty(r, { Active: value === "Yes" });

            return markDirty(r, { [column]: value });
          })
        };
      })
    );
  };

  const handleInputChange = (tableId, rowId, column, value) => {
    setTables(prev =>
      prev.map(t => {
        if (t.id !== tableId) return t;

        return {
          ...t,
          rows: t.rows.map(r => {
            if (r.id !== rowId) return r;
            return markDirty(r, { [column]: value });
          })
        };
      })
    );
  };

  const handleAddRow = (tableId) => {
    let newRowId = null;

    setTables(prev =>
      prev.map(t => {
        if (t.id !== tableId) return t;

        const newId = `${tableId}-${Date.now()}`;
        newRowId = newId;

        const newRow = { id: newId, isNew: true, isDirty: true, isEditing: true };

        t.headers.forEach(h => {
          if (h === "Status") newRow[h] = "OK";
          else if (h === "Available") newRow[h] = "Yes";
          else if (h === "Active") newRow[h] = true;
          else if (["Count", "Qty", "Score"].includes(h)) newRow[h] = 0;
          else newRow[h] = "";
        });

        return { ...t, rows: [...t.rows, newRow] };
      })
    );

    setTimeout(() => {
      const rowEl = document.getElementById(newRowId);
      if (rowEl) rowEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
  };

  const handleDeleteRow = (tableId, rowId) => {
    setTables(prev =>
      prev.map(t => {
        if (t.id !== tableId) return t;
        return { ...t, rows: t.rows.filter(r => r.id !== rowId) };
      })
    );
  };

  const handleSort = (tableId, column) => {
    setSortConfig(prev => {
      const direction = prev[column] === "asc" ? "desc" : "asc";

      setTables(tablesPrev =>
        tablesPrev.map(t => {
          if (t.id !== tableId) return t;

          const sorted = [...t.rows].sort((a, b) => {
            if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
            if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
            return 0;
          });

          return { ...t, rows: sorted };
        })
      );

      return { ...prev, [column]: direction };
    });
  };

  const handleClearAll = (tableId) => {
    setTables(prev =>
      prev.map(t => {
        if (t.id !== tableId) return t;

        return {
          ...t,
          rows: t.rows.filter(r => !r.isNew)
        };
      })
    );
  };

  const handleSaveTable = (tableId) => {
    const table = tables.find(t => t.id === tableId);

    const newRows = table.rows.filter(r => r.isNew);
    const updatedRows = table.rows.filter(r => r.isDirty && !r.isNew);

    const payload = {
      tableId,
      newRows,
      updatedRows
    };

    console.log("Batch Save Payload", payload);

    setTables(prev =>
      prev.map(t => {
        if (t.id !== tableId) return t;

        return {
          ...t,
          rows: t.rows.map(r => ({
            ...r,
            isNew: false,
            isDirty: false,
            isEditing: false
          }))
        };
      })
    );

    alert(`Saved ${newRows.length} new and ${updatedRows.length} updated rows.`);
  };

  const filteredTables = useMemo(() => {
    if (!tableSearch.trim()) return tables;

    return tables.filter(t =>
      t.title.toLowerCase().includes(tableSearch.toLowerCase())
    );
  }, [tables, tableSearch]);

  const tableHasChanges = (table) =>
    table.rows.some(r => r.isNew || r.isDirty);

  return (
    <div className="p-6 font-sans">
      <div className="mb-6 max-w-md relative">
        <input
          type="text"
          placeholder="🔎 Search table name..."
          value={tableSearch}
          onChange={(e) => setTableSearch(e.target.value)}
          className={THEME.searchInput}
        />

        {tableSearch && (
          <button
            onClick={() => setTableSearch("")}
            className={THEME.clearButton}
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {filteredTables.map(table => (
          <div key={table.id} className={THEME.tableContainer}>
            <h2 className="text-lg font-semibold mb-3">{table.title}</h2>

            <div
              className="h-64 overflow-y-auto border rounded"
              ref={el => (containerRefs.current[table.id] = el)}
            >
              <table className="w-full border-collapse">
                <thead className={`sticky top-0 ${THEME.headerBg}`}>
                  <tr>
                    {table.headers.map(h => (
                      <th
                        key={h}
                        onClick={() => handleSort(table.id, h)}
                        className="text-left p-2 border-b font-medium cursor-pointer"
                      >
                        {h} ⬍
                      </th>
                    ))}
                    <th className="p-2 border-b">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {table.rows.map(row => (
                    <tr
                      id={row.id}
                      key={row.id}
                      className={`${THEME.hoverRow} ${row.isNew ? "bg-green-50" : row.isDirty ? "bg-yellow-50" : ""}`}
                    >
                      {table.headers.map(col => {
                        const val = row[col] ?? "";

                        if (row.isEditing) {
                          if (["Status", "Available"].includes(col)) {
                            const options = col === "Status" ? ["OK", "Pending", "Failed"] : ["Yes", "No"];

                            return (
                              <td key={col} className="p-2 border-b">
                                <select
                                  value={val}
                                  onChange={e => handleDropdownChange(table.id, row.id, col, e.target.value)}
                                  className={THEME.input}
                                >
                                  {options.map(o => (
                                    <option key={o}>{o}</option>
                                  ))}
                                </select>
                              </td>
                            );
                          }

                          if (col === "Active") {
                            return (
                              <td key={col} className="p-2 border-b">
                                <select
                                  value={val ? "Yes" : "No"}
                                  onChange={e => handleDropdownChange(table.id, row.id, col, e.target.value)}
                                  className={THEME.input}
                                >
                                  <option>Yes</option>
                                  <option>No</option>
                                </select>
                              </td>
                            );
                          }

                          return (
                            <td key={col} className="p-2 border-b">
                              <input
                                value={val}
                                onChange={e => handleInputChange(table.id, row.id, col, e.target.value)}
                                className={THEME.input}
                              />
                            </td>
                          );
                        }

                        return (
                          <td key={col} className="p-2 border-b">
                            {typeof val === "boolean" ? (val ? "Yes" : "No") : String(val)}
                          </td>
                        );
                      })}

                      <td className="p-2 border-b space-x-2">
                        {!row.isEditing && !row.isNew && (
                          <button
                            onClick={() => startEditRow(table.id, row.id)}
                            className={THEME.editText}
                          >
                            Edit
                          </button>
                        )}

                        {row.isEditing && !row.isNew && (
                          <button
                            onClick={() => cancelEditRow(table.id, row.id)}
                            className={THEME.undoText}
                          >
                            Undo
                          </button>
                        )}

                        {row.isNew && (
                          <button
                            onClick={() => handleDeleteRow(table.id, row.id)}
                            className={THEME.deleteText}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleAddRow(table.id)}
                className={THEME.buttonAdd}
              >
                Add Row
              </button>

              <button
                disabled={!tableHasChanges(table)}
                onClick={() => handleSaveTable(table.id)}
                className={THEME.buttonPrimary}
              >
                Save / Update Table
              </button>

              <button
                onClick={() => handleClearAll(table.id)}
                className={THEME.buttonDangerOutline}
              >
                Clear Unsaved Rows
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
