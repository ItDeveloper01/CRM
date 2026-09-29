import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";

export default function LocationPicker({
  scope,
  onSelect,
  disabled,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // =========================================================
  // Search destinations
  // =========================================================
  useEffect(() => {
    if (disabled || !scope) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const delay = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      try {
        const res = await axios.get(
          config.operationsUrl + "/SharedMaster/Search",
          {
            params: {
              query: query,
              scope: scope,
            },
            signal: controller.signal,
          }
        );

        console.log("Search results:", res.data);

        setResults(res.data);
      } catch (error) {
        // Ignore cancelled requests
        if (
          error.name === "CanceledError" ||
          error.code === "ERR_CANCELED"
        ) {
          console.log("Previous search request cancelled");
          return;
        }

        console.error(
          "Destination search failed:",
          error
        );

        setResults([]);
      }
    }, 300);

    // Cleanup:
    // 1. Cancel debounce timer
    // 2. Cancel previous API request
    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [query, scope, disabled]);

  // =========================================================
  // Select destination
  // =========================================================
  const handleSelect = (destination) => {
    console.log("Selected Destination:", destination);

    // Send selected destination to parent
    onSelect(destination);

    // Clear search box
    setQuery("");

    // Clear old search results
    setResults([]);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={disabled}
        placeholder={
          disabled
            ? "Select travel sector first"
            : "Search destinations..."
        }
        style={{
          ...inputStyle,
          width: "100%",
          boxSizing: "border-box",
          backgroundColor: disabled
            ? "#f3f4f6"
            : "#ffffff",
          cursor: disabled
            ? "not-allowed"
            : "text",
        }}
      />

      {/* Search Results */}
      {!disabled && results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            marginTop: 3,
            maxHeight: 220,
            overflowY: "auto",
            zIndex: 1000,
            boxShadow:
              "0 4px 10px rgba(0,0,0,0.08)",
          }}
        >
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              style={{
                cursor: "pointer",
                padding: "8px 10px",
                borderBottom:
                  "1px solid #f3f4f6",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "#f9fafb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "#ffffff";
              }}
            >
              <b
                style={{
                  fontSize: 13,
                }}
              >
                {item.name}
              </b>

              <div
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  marginTop: 2,
                }}
              >
                {item.fullPath}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =========================================================
// Input Style
// =========================================================
const inputStyle = {
  height: 34,
  padding: "6px 10px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 13,
  outline: "none",
};