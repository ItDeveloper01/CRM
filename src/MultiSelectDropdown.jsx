import React, { useState, useRef, useEffect } from 'react';

export default function MultiSelectDropdown({ departmentList = [], selectedDepartmentList = [], setUserObjects, userObjects, errors, multiSelect=false ,onDropDownClosed }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
     
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        // ✅ Trigger callback only when dropdown is actually closing
        // if (onDropDownClosed) {
        //   onDropDownClosed(selectedDepartmentList);
        // }
      }
    };
    document.addEventListener('mousemove', handleClickOutside);
    return () => document.removeEventListener('mousemove', handleClickOutside);
  }, [open, selectedDepartmentList, onDropDownClosed]);

  const handleSelect = (deptId) => {
    if (multiSelect) {
      const updatedList = selectedDepartmentList.includes(deptId)
        ? selectedDepartmentList.filter((id) => id !== deptId)
        : [...selectedDepartmentList, deptId];
      setUserObjects({ ...userObjects, selectedDepartmentList: updatedList });
    } else {
      setUserObjects({ ...userObjects, selectedDepartmentList: [deptId] });
    }
    debugger;
    
  };

  return (
    <div className="relative w-full text-sm" ref={dropdownRef}>
      <div
        // className={`border ${errors?.department ? 'border-red-500' : 'border-gray-300'} rounded w-full cursor-pointer bg-white flex justify-between items-center px-2 py-2 shadow-sm hover:border-blue-400`}
        className={`w-full rounded-lg p-2 h-10 focus:outline-none focus:ring-2 bg-white border ${errors?.department ? 'border-red-500' : 'border-gray-300'} cursor-pointer flex justify-between items-center shadow-sm hover:border-blue-500`}
        onClick={() => setOpen(!open)}
      >
        <span className="text-gray-700 text-sm truncate">
          {selectedDepartmentList.length > 0
            ? selectedDepartmentList
                .map((id) => departmentList.find((dept) => dept.id === id)?.category)
                .filter(Boolean)
                .join(', ')
            : 'Select Department'}
        </span>
        <svg
          className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && departmentList.length > 0 && (
        <div className="absolute mt-1 w-full bg-white border rounded shadow-md z-10 max-h-48 overflow-auto text-sm">
          {departmentList.map((dept) => (
            <label
              key={dept.id}
              className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedDepartmentList.includes(dept.id)}
                onChange={() => handleSelect(dept.id)}
                className="mr-2 h-5 w-5"
              />
              <span className="text-sm text-gray-700">{dept.category}</span>
            </label>
          ))}
        </div>
      )}

      {open && departmentList.length === 0 && (
        <div className="absolute mt-1 w-full bg-white border rounded shadow-md z-10 p-2 text-gray-500 text-sm">
          No departments available
        </div>
      )}
    </div>
  );
}