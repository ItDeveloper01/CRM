// This is helper function file 

// Used to get selected vlaue from api in View Mode 
export const getLabelById = (list, id, idKey, labelKey) => {
  if (!list || id == null) return "-";
  const item = list.find((el) => el[idKey] === id);
  return item ? item[labelKey] : "-";
};

// Used to get selected value for radio button in View Mode 
  export const getRadioValue = ({
    selectedValue,
    optionValue,
    isViewMode,
    activeClass = "option-highlight-active",
    inactiveClass = "option-highlight-inactive",
    viewActiveClass = "bg-gray-100 text-gray-800 border border",
  }) => {
    if (selectedValue !== optionValue) return inactiveClass;
    return isViewMode ? viewActiveClass : activeClass;
  };