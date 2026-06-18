import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";

export default function DestinationSearch({ scope= 'International', onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length > 1) fetchResults(query);
    }, 300);

    return () => clearTimeout(delay);
  }, [query, scope]); // 👈 important

 const fetchResults = async (text) => {
    debugger;
  const res = await axios.get(config.apiUrl+"/TempLead/Search", {
    params: {
      query: text,
      scope: scope   // must be string
    }
  });

    debugger;
    console.log("Search results: ", res.data);
  setResults(res.data);
};

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search destinations..."
      />

      <div>
        {results.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            style={{ cursor: "pointer", padding: 5 }}
          >
            <b>{item.name}</b>
            <div style={{ fontSize: 12 }}>
              {item.fullPath}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}