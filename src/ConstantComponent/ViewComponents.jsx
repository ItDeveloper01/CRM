
  // ViewField is used for For text / date inputs
export const ViewField = ({ value }) => (
  <p className="w-full rounded-lg p-2 h-10 focus:outline-none focus:ring-2 bg-gray-100 border">
    {value || "-"}
  </p>
);

  //ViewSelect For select values (label instead of ID)
  export const ViewSelect = ({ value }) => (
  <p className="w-full rounded-lg p-2 h-10 focus:outline-none focus:ring-2 bg-gray-100 border">
    {value || "-"}
  </p>
);

//Used to arrange date feild dd-mm-yyyy for view mode 
export const DateViewField = ({ value }) => {
  const baseClasses =
    "w-full rounded-lg p-2 h-10 flex items-center bg-gray-100 border text-gray-400";
  // if (!value) return <span className="text-gray-400 w-full rounded-lg p-2 h-10 focus:outline-none focus:ring-2 bg-gray-100 border"> dd-mm-yyyy</span>;
   if (!value) {
    return <div className={baseClasses}>dd-mm-yyyy</div>;
  }
  const date = new Date(value);
  // if (isNaN(date)) return <span className="text-gray-400 w-full rounded-lg p-2 h-10 focus:outline-none focus:ring-2 bg-gray-100 border"> dd-mm-yyyy</span>;
  if (isNaN(date)) {
    return <div className={baseClasses}>dd-mm-yyyy</div>;
  }

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return (
    // <p className="mt-2 px-3 py-2 min-h-[40px] bg-gray-100 rounded-lg text-gray-800">
    <p className="w-full rounded-lg p-2 h-10 focus:outline-none focus:ring-2 bg-gray-100 border ">
       
      {`${dd}-${mm}-${yyyy}`}
    </p>
  );
};