import React, { useState, useRef, useEffect } from "react";

const MultiSelectDropdown = ({ options, onChange, placeholder = "Select options" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const dropdownRef = useRef(null);

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  // Select Department Dropdown 
  // Handle selection
  const handleSelect = (option) => {
    let newSelected;
    if (selected.includes(option)) {
      newSelected = selected.filter((item) => item !== option);
    } else {
      newSelected = [...selected, option];
    }
    setSelected(newSelected);
    onChange && onChange(newSelected);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-64" ref={dropdownRef}>
      {/* Selected box */}
      <div
        className="border rounded-lg px-4 py-2 flex justify-between items-center cursor-pointer bg-white shadow-sm"
        onClick={toggleDropdown}
      >
        <span className="truncate">
          {selected.length > 0 ? selected.join(", ") : placeholder}
        </span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
          {options.map((option, idx) => (
            <label
              key={idx}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => handleSelect(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
