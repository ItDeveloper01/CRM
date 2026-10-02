// import React, { useState, useEffect } from "react";
// import { ViewField } from "../../ConstantComponent/ViewComponents";
// import { getLabelById } from "../../utils/selectUtils";

// const CalendarIcon = ({ size = 14, color = "#2563eb" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke={color}
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <rect x="3" y="4" width="18" height="18" rx="2" />
//     <line x1="16" y1="2" x2="16" y2="6" />
//     <line x1="8" y1="2" x2="8" y2="6" />
//     <line x1="3" y1="10" x2="21" y2="10" />
//   </svg>
// );

// export default function TravelPackage(
//   carLeaddObj = {},
//   setCarLeadObj,
//   cities = [],
//   isViewMode = false
// ) {
//   const [isOpen, setIsOpen] = useState(false); // collapsed by default
//   const [flexible, setFlexible] = useState(true);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [duration, setDuration] = useState("-");

//   // 🔹 Duration calc
//   useEffect(() => {
//     if (fromDate && toDate) {
//       const start = new Date(fromDate);
//       const end = new Date(toDate);
//       const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

//       if (diff >= 0) {
//         setDuration(`${diff}N/${diff + 1}D`);
//       } else {
//         setDuration("Invalid");
//       }
//     } else {
//       setDuration("-");
//     }
//   }, [fromDate, toDate]);

//   // 🔹 Indicator logic
//   const hasData =
//     fromDate || toDate || carLeaddObj?.servingCity || carLeaddObj?.destinations;

//   return (
//     <div className="w-full mt-4">
//       <div className="w-full border rounded-lg bg-white">

//         {/* 🔥 HEADER */}
//         <div
//           onClick={() => setIsOpen(prev => !prev)}
//           className="flex justify-between items-center w-full p-3 bg-gray-100 cursor-pointer"
//         >
//           <div className="flex items-center gap-2">
//             <span className="font-semibold text-gray-700">
//               Package Preference
//             </span>

//             {/* Summary when collapsed */}
//             {!isOpen && hasData && (
//               <span className="text-xs text-gray-500">
//                 {fromDate && toDate
//                   ? `${fromDate} → ${toDate} | ${duration}`
//                   : "Details added"}
//               </span>
//             )}
//           </div>

//           <div className="flex items-center gap-2">
//             {/* Pulse indicator */}
//             {hasData && !isOpen && (
//               <span className="w-3.5 h-3.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.9)]"></span>
//             )}
//             <span>{isOpen ? "▲" : "▼"}</span>
//           </div>
//         </div>

//         {/* 🔥 BODY */}
//         {isOpen && (
//           <div className="p-3">

//             <div className="border border-gray-300 rounded-lg bg-white px-3 py-3 relative">

//               {/* ROW 1 */}
//               <div className="flex flex-nowrap items-end gap-2 w-full overflow-hidden">

//                 <div className="flex-[1_1_0] min-w-0">
//                   <label className="text-[11px] flex items-center gap-1 mb-0.5 text-gray-600">
//                     <CalendarIcon color="#2563eb" /> From
//                   </label>
//                   <input
//                     type="date"
//                     value={fromDate}
//                     onChange={(e) => setFromDate(e.target.value)}
//                     className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
//                   />
//                 </div>

//                 <div className="flex-[1_1_0] min-w-0">
//                   <label className="text-[11px] flex items-center gap-1 mb-0.5 text-gray-600">
//                     <CalendarIcon color="#16a34a" /> To
//                   </label>
//                   <input
//                     type="date"
//                     value={toDate}
//                     onChange={(e) => setToDate(e.target.value)}
//                     className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
//                   />
//                 </div>

//                 <div className="flex-[0_0_90px]">
//                   <label className="text-[11px] mb-0.5 block text-gray-600">Dur</label>
//                   <input
//                     type="text"
//                     disabled
//                     value={duration}
//                     className="w-full border border-gray-200 rounded px-2 py-1 text-xs bg-gray-100"
//                   />
//                 </div>

//                 {/* FLEXIBLE */}
//                 <div className="flex items-end gap-2">
//                   <div className="flex items-center gap-1 mb-0.5">
//                     <span className="text-[11px] text-gray-600">Flex</span>
//                     <button
//                       onClick={() => setFlexible(!flexible)}
//                       className={`w-9 h-4 flex items-center rounded-full p-0.5 ${
//                         flexible ? "bg-blue-500" : "bg-gray-300"
//                       }`}
//                     >
//                       <div
//                         className={`bg-white w-3 h-3 rounded-full shadow transform ${
//                           flexible ? "translate-x-5" : ""
//                         }`}
//                       />
//                     </button>
//                   </div>

//                   {flexible && (
//                     <div className="flex-[0_0_70px]">
//                       <label className="text-[11px] mb-0.5 block text-gray-600">
//                         ±Days
//                       </label>
//                       <input
//                         type="number"
//                         className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* ROW 2 */}
//               <div className="flex flex-nowrap items-end gap-2 w-full mt-3">

//                 <div className="flex-[1_1_0] min-w-0">
//                   <label className="text-[11px] mb-0.5 block text-gray-600">₹ Budget</label>
//                   <input
//                     type="number"
//                     className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
//                   />
//                 </div>

//                 <div className="flex-[1_1_0] min-w-0">
//                   <label className="text-[11px] mb-0.5 block text-gray-600">Hotel</label>
//                   <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs">
//                     <option>Select</option>
//                     <option>3 Star</option>
//                     <option>4 Star</option>
//                     <option>5 Star</option>
//                   </select>
//                 </div>

//                 <div className="flex-[1_1_0] min-w-0">
//                   <label className="text-[11px] mb-0.5 block text-gray-600">Meal</label>
//                   <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs">
//                     <option>Select</option>
//                     <option>Breakfast</option>
//                     <option>Half Board</option>
//                     <option>Full Board</option>
//                     <option>All Inclusive</option>
//                   </select>
//                 </div>

//               </div>

//               {/* EXTRA FIELDS */}
//               <div className="flex gap-3 flex-wrap mt-3">

//                 <div className="flex-1 min-w-[250px]">
//                   <label className="label-style">Trip Description</label>
//                   {isViewMode ? (
//                     <ViewField value={""} />
//                   ) : (
//                     <input
//                       name="tripDescription"
//                       placeholder="Trip Description"
//                       className="border-highlight"
//                     />
//                   )}
//                 </div>

//                 <div className="flex-1 min-w-[250px]">
//                   <label className="label-style">Departure City</label>
//                   {isViewMode ? (
//                     <ViewField
//                       value={getLabelById(
//                         cities,
//                         carLeaddObj.servingCity,
//                         "id",
//                         "cityName"
//                       )}
//                     />
//                   ) : (
//                     <select
//                       name="servingCity"
//                       value={carLeaddObj.servingCity || ""}
//                       onChange={(e) => {
//                         const value =
//                           e.target.value === ""
//                             ? null
//                             : Number(e.target.value);
//                         setCarLeadObj(prev => ({
//                           ...prev,
//                           servingCity: value
//                         }));
//                       }}
//                       className="border-highlight"
//                     >
//                       <option value="">Select City</option>
//                       {cities.map(city => (
//                         <option key={city.id} value={city.id}>
//                           {city.cityName}
//                         </option>
//                       ))}
//                     </select>
//                   )}
//                 </div>
//               </div>

//               {/* DESTINATIONS */}
//               <div className="mt-3">
//                 <label className="label-style">Destination(s)</label>
//                 {isViewMode ? (
//                   <ViewField value={carLeaddObj?.destinations?.join(", ") || ""} />
//                 ) : (
//                   <input
//                     name="destinations"
//                     placeholder="e.g. Paris, Rome, Zurich"
//                     className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400"
//                   />
//                 )}
//               </div>

//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { getEmptyPackagePreferenceObj } from "./../../Model/HolidayLeadObj";

const CalendarIcon = ({ size = 14, color = "#2563eb" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);


// ============================================================
// TOGGLE SWITCH STYLES
// ============================================================

const toggleStyles = {
    wrapper: "flex items-center gap-2",

    toggle: (isActive) => `
        relative inline-flex items-center h-6 w-11 rounded-full cursor-pointer
        transition-all duration-300 flex-shrink-0 shadow-inner
        ${isActive
            ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
            : "bg-gradient-to-r from-slate-300 to-slate-400"}
    `,

    circle: (isActive) => `
        absolute h-5 w-5 bg-white rounded-full shadow-md transition-transform duration-300
        ${isActive ? "translate-x-5" : "translate-x-0.5"}
    `,

    label: (isActive) => `
        text-xs font-semibold tracking-wide transition-colors duration-200 min-w-[24px]
        ${isActive ? "text-emerald-600" : "text-slate-400"}
    `
};


// ============================================================
// RICH TEXT TOOLBAR
// ============================================================

const RichTextToolbar = ({
    editorRef,
    disabled = false
}) => {

    const execCommand = (command, value = null) => {

        if (disabled) return;

        if (!editorRef.current) return;

        editorRef.current.focus();

        document.execCommand(
            command,
            false,
            value
        );

        editorRef.current.focus();
    };


    return (
        <div className="flex flex-wrap items-center gap-1 px-2 py-2 bg-gray-50 border-b border-gray-200">

            {/* UNDO */}
            <button
                type="button"
                disabled={disabled}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCommand("undo")}
                title="Undo"
                className="
                    h-8 w-8 rounded
                    hover:bg-gray-200
                    text-gray-700
                    flex items-center justify-center
                    disabled:opacity-40
                "
            >
                ↶
            </button>


            {/* REDO */}
            <button
                type="button"
                disabled={disabled}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCommand("redo")}
                title="Redo"
                className="
                    h-8 w-8 rounded
                    hover:bg-gray-200
                    text-gray-700
                    flex items-center justify-center
                    disabled:opacity-40
                "
            >
                ↷
            </button>


            <div className="h-5 w-px bg-gray-300 mx-1" />


            {/* BOLD */}
            <button
                type="button"
                disabled={disabled}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCommand("bold")}
                title="Bold"
                className="
                    h-8 w-8 rounded
                    hover:bg-blue-100
                    text-gray-700
                    font-bold
                    flex items-center justify-center
                    disabled:opacity-40
                "
            >
                B
            </button>


            {/* ITALIC */}
            <button
                type="button"
                disabled={disabled}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCommand("italic")}
                title="Italic"
                className="
                    h-8 w-8 rounded
                    hover:bg-blue-100
                    text-gray-700
                    italic
                    flex items-center justify-center
                    disabled:opacity-40
                "
            >
                I
            </button>


            {/* UNDERLINE */}
            <button
                type="button"
                disabled={disabled}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => execCommand("underline")}
                title="Underline"
                className="
                    h-8 w-8 rounded
                    hover:bg-blue-100
                    text-gray-700
                    underline
                    flex items-center justify-center
                    disabled:opacity-40
                "
            >
                U
            </button>


            <div className="h-5 w-px bg-gray-300 mx-1" />


            {/* FONT SIZE */}
            <select
                disabled={disabled}
                defaultValue="3"
                title="Font Size"
                onChange={(e) =>
                    execCommand(
                        "fontSize",
                        e.target.value
                    )
                }
                className="
                    h-8
                    px-2
                    text-xs
                    border border-gray-300
                    rounded
                    bg-white
                    text-gray-700
                    focus:outline-none
                    focus:ring-1
                    focus:ring-blue-400
                    disabled:opacity-40
                "
            >
                <option value="1">Small</option>
                <option value="2">Normal</option>
                <option value="3">Medium</option>
                <option value="4">Large</option>
                <option value="5">X-Large</option>
                <option value="6">XX-Large</option>
                <option value="7">Huge</option>
            </select>


            {/* TEXT COLOR */}
            <input
                type="color"
                disabled={disabled}
                title="Text Color"
                onChange={(e) =>
                    execCommand(
                        "foreColor",
                        e.target.value
                    )
                }
                className="
                    w-8
                    h-8
                    p-1
                    border
                    border-gray-300
                    rounded
                    cursor-pointer
                    disabled:opacity-40
                "
            />


            <div className="h-5 w-px bg-gray-300 mx-1" />


            {/* ALIGN LEFT */}
            <button
                type="button"
                disabled={disabled}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                    execCommand("justifyLeft")
                }
                title="Align Left"
                className="
                    h-8 w-8 rounded
                    hover:bg-blue-100
                    text-gray-700
                    flex items-center justify-center
                    disabled:opacity-40
                "
            >
                ≡
            </button>


            {/* ALIGN CENTER */}
            <button
                type="button"
                disabled={disabled}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                    execCommand("justifyCenter")
                }
                title="Align Center"
                className="
                    h-8 w-8 rounded
                    hover:bg-blue-100
                    text-gray-700
                    flex items-center justify-center
                    disabled:opacity-40
                "
            >
                ☰
            </button>


            {/* ALIGN RIGHT */}
            <button
                type="button"
                disabled={disabled}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                    execCommand("justifyRight")
                }
                title="Align Right"
                className="
                    h-8 w-8 rounded
                    hover:bg-blue-100
                    text-gray-700
                    flex items-center justify-center
                    disabled:opacity-40
                "
            >
                ≡
            </button>


            <div className="h-5 w-px bg-gray-300 mx-1" />


            {/* BULLET LIST */}
            <button
                type="button"
                disabled={disabled}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                    execCommand(
                        "insertUnorderedList"
                    )
                }
                title="Bulleted List"
                className="
                    h-8 px-2 rounded
                    hover:bg-blue-100
                    text-gray-700
                    flex items-center justify-center
                    disabled:opacity-40
                "
            >
                •☰
            </button>


            {/* NUMBERED LIST */}
            <button
                type="button"
                disabled={disabled}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                    execCommand(
                        "insertOrderedList"
                    )
                }
                title="Numbered List"
                className="
                    h-8 px-2 rounded
                    hover:bg-blue-100
                    text-gray-700
                    flex items-center justify-center
                    disabled:opacity-40
                "
            >
                1.☰
            </button>


            <div className="h-5 w-px bg-gray-300 mx-1" />


            {/* CLEAR FORMAT */}
            <button
                type="button"
                disabled={disabled}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                    execCommand("removeFormat")
                }
                title="Clear Formatting"
                className="
                    h-8
                    px-2
                    rounded
                    hover:bg-red-100
                    text-gray-600
                    text-xs
                    flex items-center justify-center
                    disabled:opacity-40
                "
            >
                Clear
            </button>

        </div>
    );
};


// ============================================================
// RICH TEXT EDITOR
// ============================================================


// ============================================================
// RICH TEXT EDITOR - COMPACT
// ============================================================

const RichTextEditor = ({
    value,
    onChange,
    disabled = false,
    onExpand
}) => {

    const editorRef = useRef(null);


    // --------------------------------------------------------
    // SYNC VALUE FROM PARENT
    // --------------------------------------------------------

    useEffect(() => {

        if (!editorRef.current) return;

        const incomingValue = value || "";

        // Only update DOM if it is actually different.
        // This prevents the cursor from jumping while typing.
        if (
            editorRef.current.innerHTML !==
            incomingValue
        ) {
            editorRef.current.innerHTML =
                incomingValue;
        }

    }, [value]);


    // --------------------------------------------------------
    // HANDLE TYPING
    // --------------------------------------------------------

    const handleInput = () => {

        if (!editorRef.current) return;

        onChange(
            editorRef.current.innerHTML
        );

    };


    // --------------------------------------------------------
    // CHARACTER COUNT
    // --------------------------------------------------------

    const getPlainTextLength = () => {

        if (!editorRef.current)
            return 0;

        return (
            editorRef.current.innerText ||
            editorRef.current.textContent ||
            ""
        ).length;

    };


    return (
        <div className="
            border-2
            border-gray-300
            rounded-lg
            overflow-hidden
            bg-white
        ">

            {/* TOOLBAR */}
            <RichTextToolbar
                editorRef={editorRef}
                disabled={disabled}
            />


            {/* EDITOR */}
            <div className="relative">

                <div
                    ref={editorRef}
                    contentEditable={!disabled}
                    suppressContentEditableWarning
                    onInput={handleInput}
                    className={`
                        min-h-[110px]
                        max-h-[220px]
                        overflow-y-auto
                        px-3
                        py-2
                        text-sm
                        text-gray-700
                        focus:outline-none
                        leading-relaxed

                        [&_ul]:list-disc
                        [&_ul]:ml-5

                        [&_ol]:list-decimal
                        [&_ol]:ml-5

                        [&_li]:ml-2

                        ${disabled
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-white"
                        }
                    `}
                />

                {/* EXPAND */}
                {!disabled && (

                    <button
                        type="button"
                        onClick={onExpand}
                        title="Open full notepad"
                        className="
                            absolute
                            right-2
                            bottom-2
                            h-8
                            px-3
                            rounded-md
                            bg-blue-600
                            text-white
                            text-xs
                            font-medium
                            shadow-sm
                            hover:bg-blue-700
                            transition
                            flex
                            items-center
                            gap-1
                        "
                    >
                        ↗ Expand
                    </button>

                )}

            </div>


            {/* FOOTER */}
            <div className="
                flex
                items-center
                justify-between
                px-3
                py-1.5
                bg-gray-50
                border-t
                border-gray-200
            ">

                <span className="
                    text-[11px]
                    text-gray-400
                ">
                    Rich text formatting supported
                </span>


                <span className="
                    text-xs
                    text-gray-500
                ">
                    {getPlainTextLength()}/300
                </span>

            </div>

        </div>
    );
};


// ============================================================
// FULL SCREEN NOTEPAD
// ============================================================

const FullScreenNotesEditor = ({
    value,
    onChange,
    onClose
}) => {

    const editorRef = useRef(null);


    // --------------------------------------------------------
    // LOAD VALUE WHEN MODAL OPENS / VALUE CHANGES
    // --------------------------------------------------------

    useEffect(() => {

        if (!editorRef.current) return;

        const incomingValue = value || "";

        if (
            editorRef.current.innerHTML !==
            incomingValue
        ) {
            editorRef.current.innerHTML =
                incomingValue;
        }

    }, [value]);


    // --------------------------------------------------------
    // HANDLE TYPING
    // --------------------------------------------------------

    const handleInput = () => {

        if (!editorRef.current) return;

        onChange(
            editorRef.current.innerHTML
        );

    };


    // --------------------------------------------------------
    // FORMAT COMMAND
    // --------------------------------------------------------

    const execCommand = (
        command,
        commandValue = null
    ) => {

        if (!editorRef.current)
            return;

        editorRef.current.focus();

        document.execCommand(
            command,
            false,
            commandValue
        );

        editorRef.current.focus();

        // Immediately save formatting change.
        onChange(
            editorRef.current.innerHTML
        );

    };


    // --------------------------------------------------------
    // CHARACTER COUNT
    // --------------------------------------------------------

    const getPlainTextLength = () => {

        if (!editorRef.current)
            return 0;

        return (
            editorRef.current.innerText ||
            editorRef.current.textContent ||
            ""
        ).length;

    };


    return (
        <div className="
            fixed
            inset-0
            z-[9999]
            bg-black/40
            flex
            items-center
            justify-center
            p-4
        ">

            <div className="
                w-full
                h-full
                max-w-6xl
                max-h-[95vh]
                bg-white
                rounded-xl
                shadow-2xl
                overflow-hidden
                flex
                flex-col
            ">


                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="
                    flex
                    items-center
                    justify-between
                    px-5
                    py-3
                    bg-gradient-to-r
                    from-blue-600
                    to-blue-700
                    text-white
                    flex-shrink-0
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            w-9
                            h-9
                            rounded-lg
                            bg-white/15
                            flex
                            items-center
                            justify-center
                            text-lg
                        ">
                            📝
                        </div>


                        <div>

                            <div className="
                                font-semibold
                                text-sm
                            ">
                                Package Notes
                            </div>

                            <div className="
                                text-[11px]
                                text-blue-100
                            ">
                                Full Notepad
                            </div>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            h-9
                            px-4
                            rounded-lg
                            bg-white/15
                            hover:bg-white/25
                            transition
                            text-sm
                            font-medium
                        "
                    >
                        ✕ Close
                    </button>

                </div>


                {/* ================================================= */}
                {/* TOOLBAR */}
                {/* ================================================= */}

                <div className="
                    flex
                    flex-wrap
                    items-center
                    gap-1
                    px-3
                    py-2
                    bg-gray-50
                    border-b
                    border-gray-200
                    flex-shrink-0
                ">

                    {/* UNDO */}
                    <button
                        type="button"
                        onMouseDown={(e) =>
                            e.preventDefault()
                        }
                        onClick={() =>
                            execCommand("undo")
                        }
                        title="Undo"
                        className="
                            h-9
                            w-9
                            rounded
                            hover:bg-gray-200
                            text-gray-700
                        "
                    >
                        ↶
                    </button>


                    {/* REDO */}
                    <button
                        type="button"
                        onMouseDown={(e) =>
                            e.preventDefault()
                        }
                        onClick={() =>
                            execCommand("redo")
                        }
                        title="Redo"
                        className="
                            h-9
                            w-9
                            rounded
                            hover:bg-gray-200
                            text-gray-700
                        "
                    >
                        ↷
                    </button>


                    <div className="
                        h-6
                        w-px
                        bg-gray-300
                        mx-1
                    " />


                    {/* BOLD */}
                    <button
                        type="button"
                        onMouseDown={(e) =>
                            e.preventDefault()
                        }
                        onClick={() =>
                            execCommand("bold")
                        }
                        title="Bold"
                        className="
                            h-9
                            w-9
                            rounded
                            hover:bg-blue-100
                            font-bold
                            text-gray-700
                        "
                    >
                        B
                    </button>


                    {/* ITALIC */}
                    <button
                        type="button"
                        onMouseDown={(e) =>
                            e.preventDefault()
                        }
                        onClick={() =>
                            execCommand("italic")
                        }
                        title="Italic"
                        className="
                            h-9
                            w-9
                            rounded
                            hover:bg-blue-100
                            italic
                            text-gray-700
                        "
                    >
                        I
                    </button>


                    {/* UNDERLINE */}
                    <button
                        type="button"
                        onMouseDown={(e) =>
                            e.preventDefault()
                        }
                        onClick={() =>
                            execCommand("underline")
                        }
                        title="Underline"
                        className="
                            h-9
                            w-9
                            rounded
                            hover:bg-blue-100
                            underline
                            text-gray-700
                        "
                    >
                        U
                    </button>


                    <div className="
                        h-6
                        w-px
                        bg-gray-300
                        mx-1
                    " />


                    {/* FONT SIZE */}
                    <select
                        defaultValue="3"
                        title="Font Size"
                        onChange={(e) =>
                            execCommand(
                                "fontSize",
                                e.target.value
                            )
                        }
                        className="
                            h-9
                            px-2
                            text-sm
                            border
                            border-gray-300
                            rounded
                            bg-white
                            text-gray-700
                        "
                    >
                        <option value="1">
                            Small
                        </option>

                        <option value="2">
                            Normal
                        </option>

                        <option value="3">
                            Medium
                        </option>

                        <option value="4">
                            Large
                        </option>

                        <option value="5">
                            X-Large
                        </option>

                        <option value="6">
                            XX-Large
                        </option>

                        <option value="7">
                            Huge
                        </option>
                    </select>


                    {/* COLOR */}
                    <input
                        type="color"
                        title="Text Color"
                        onChange={(e) =>
                            execCommand(
                                "foreColor",
                                e.target.value
                            )
                        }
                        className="
                            w-9
                            h-9
                            p-1
                            border
                            border-gray-300
                            rounded
                            cursor-pointer
                        "
                    />


                    <div className="
                        h-6
                        w-px
                        bg-gray-300
                        mx-1
                    " />


                    {/* ALIGN LEFT */}
                    <button
                        type="button"
                        onMouseDown={(e) =>
                            e.preventDefault()
                        }
                        onClick={() =>
                            execCommand(
                                "justifyLeft"
                            )
                        }
                        title="Align Left"
                        className="
                            h-9
                            w-9
                            rounded
                            hover:bg-blue-100
                            text-gray-700
                        "
                    >
                        ≡
                    </button>


                    {/* CENTER */}
                    <button
                        type="button"
                        onMouseDown={(e) =>
                            e.preventDefault()
                        }
                        onClick={() =>
                            execCommand(
                                "justifyCenter"
                            )
                        }
                        title="Align Center"
                        className="
                            h-9
                            w-9
                            rounded
                            hover:bg-blue-100
                            text-gray-700
                        "
                    >
                        ☰
                    </button>


                    {/* RIGHT */}
                    <button
                        type="button"
                        onMouseDown={(e) =>
                            e.preventDefault()
                        }
                        onClick={() =>
                            execCommand(
                                "justifyRight"
                            )
                        }
                        title="Align Right"
                        className="
                            h-9
                            w-9
                            rounded
                            hover:bg-blue-100
                            text-gray-700
                        "
                    >
                        ≡
                    </button>


                    <div className="
                        h-6
                        w-px
                        bg-gray-300
                        mx-1
                    " />


                    {/* BULLET */}
                    <button
                        type="button"
                        onMouseDown={(e) =>
                            e.preventDefault()
                        }
                        onClick={() =>
                            execCommand(
                                "insertUnorderedList"
                            )
                        }
                        title="Bulleted List"
                        className="
                            h-9
                            px-2
                            rounded
                            hover:bg-blue-100
                            text-gray-700
                        "
                    >
                        •☰
                    </button>


                    {/* NUMBER */}
                    <button
                        type="button"
                        onMouseDown={(e) =>
                            e.preventDefault()
                        }
                        onClick={() =>
                            execCommand(
                                "insertOrderedList"
                            )
                        }
                        title="Numbered List"
                        className="
                            h-9
                            px-2
                            rounded
                            hover:bg-blue-100
                            text-gray-700
                        "
                    >
                        1.☰
                    </button>


                    {/* CLEAR */}
                    <button
                        type="button"
                        onMouseDown={(e) =>
                            e.preventDefault()
                        }
                        onClick={() =>
                            execCommand(
                                "removeFormat"
                            )
                        }
                        title="Clear Formatting"
                        className="
                            h-9
                            px-3
                            rounded
                            hover:bg-red-100
                            text-gray-600
                            text-xs
                        "
                    >
                        Clear
                    </button>

                </div>


                {/* ================================================= */}
                {/* EDITOR */}
                {/* ================================================= */}

                <div className="
                    flex-1
                    overflow-hidden
                    bg-white
                    p-5
                ">

                    <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleInput}
                        className="
                            h-full
                            w-full
                            overflow-y-auto
                            px-4
                            py-3
                            text-sm
                            text-gray-700
                            leading-relaxed
                            focus:outline-none

                            [&_ul]:list-disc
                            [&_ul]:ml-6

                            [&_ol]:list-decimal
                            [&_ol]:ml-6

                            [&_li]:ml-2
                        "
                    />

                </div>


                {/* ================================================= */}
                {/* FOOTER */}
                {/* ================================================= */}

                <div className="
                    flex
                    items-center
                    justify-between
                    px-5
                    py-3
                    bg-gray-50
                    border-t
                    border-gray-200
                    flex-shrink-0
                ">

                    <span className="
                        text-xs
                        text-gray-400
                    ">
                        Use the toolbar to format your notes.
                    </span>


                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <span className="
                            text-xs
                            text-gray-500
                        ">
                            {getPlainTextLength()}/300
                        </span>


                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                px-5
                                py-2
                                rounded-lg
                                bg-blue-600
                                text-white
                                text-sm
                                font-medium
                                hover:bg-blue-700
                                transition
                                shadow-sm
                            "
                        >
                            Done
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};






// ============================================================
// MAIN COMPONENT
// ============================================================

export default function TravelPackage({
    holidayLeadObj = {},
    setHolidayLeadObj,
    cities = [],
    isViewMode = false,
    travelScope = ""
}) {

    const [isOpen, setIsOpen] =
        useState(true);

    const scopeLabel =
        travelScope
            ? ` (${travelScope})`
            : "";

    const [activeTab, setActiveTab] =
        useState(0);


    // FULL SCREEN NOTES
    const [isNotesExpanded, setIsNotesExpanded] =
        useState(false);

    const [expandedNotesPackageIndex, setExpandedNotesPackageIndex] =
        useState(null);


    // ============================================================
    // INIT
    // ============================================================

    useEffect(() => {

        if (!holidayLeadObj.packages) {

            setHolidayLeadObj(prev => ({
                ...prev,
                packages: [
                    getEmptyPackagePreferenceObj()
                ]
            }));

        }

    }, [holidayLeadObj.packages, setHolidayLeadObj]);


    const packagesArray =
        holidayLeadObj.packages || [];


    // ============================================================
    // HAS DATA
    // ============================================================

    const hasPackageData = (pkg) => {

        return !!(
            pkg?.fromDate ||
            pkg?.toDate ||
            pkg?.budget ||
            pkg?.tripDescription ||
            pkg?.destinations ||
            pkg?.departureCity
        );

    };


    // ============================================================
    // ACTIVE COUNT
    // ============================================================

    const activePackageCount =
        packagesArray.filter(
            hasPackageData
        ).length;


    // ============================================================
    // UPDATE PACKAGE
    // ============================================================

    const updatePackage = (
        index,
        field,
        value
    ) => {

        const updated =
            [...packagesArray];

        updated[index] = {
            ...updated[index],
            [field]: value
        };


        // AUTO DURATION
        if (
            field === "fromDate" ||
            field === "toDate"
        ) {

            const fromDate =
                field === "fromDate"
                    ? value
                    : updated[index].fromDate;

            const toDate =
                field === "toDate"
                    ? value
                    : updated[index].toDate;


            if (
                fromDate &&
                toDate
            ) {

                const start =
                    new Date(fromDate);

                const end =
                    new Date(toDate);

                const diff =
                    Math.ceil(
                        (
                            end - start
                        ) /
                        (
                            1000 *
                            60 *
                            60 *
                            24
                        )
                    );


                updated[index].duration =
                    diff >= 0
                        ? `${diff}N/${diff + 1}D`
                        : "Invalid";

            }

        }


        setHolidayLeadObj(prev => ({
            ...prev,
            packages: updated
        }));

    };


    // ============================================================
    // ADD
    // ============================================================

    const addPackagePreference = () => {

        setHolidayLeadObj(prev => ({

            ...prev,

            packages: [
                ...(prev.packages || []),
                getEmptyPackagePreferenceObj()
            ]

        }));

    };


    // ============================================================
    // REMOVE
    // ============================================================

    const removePackagePreference = (
        index
    ) => {

        const updated =
            [...packagesArray];

        updated.splice(index, 1);


        setHolidayLeadObj(prev => ({
            ...prev,

            packages:
                updated.length > 0
                    ? updated
                    : [
                        getEmptyPackagePreferenceObj()
                    ]

        }));


        if (
            activeTab >=
            updated.length
        ) {

            setActiveTab(
                Math.max(
                    0,
                    updated.length - 1
                )
            );

        }

    };


    // ============================================================
    // EXPAND NOTES
    // ============================================================

    const openNotesEditor = (
        index
    ) => {

        setExpandedNotesPackageIndex(
            index
        );

        setIsNotesExpanded(true);

    };


    // ============================================================
    // CLOSE NOTES
    // ============================================================

    const closeNotesEditor = () => {

        setIsNotesExpanded(false);

        setExpandedNotesPackageIndex(
            null
        );

    };


    // ============================================================
    // FULL SCREEN NOTES CHANGE
    // ============================================================

    const updateExpandedNotes = (
        value
    ) => {

        if (
            expandedNotesPackageIndex === null
        ) {
            return;
        }

        updatePackage(
            expandedNotesPackageIndex,
            "notes",
            value
        );

    };


    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="w-full mt-4">

            <div className="
                border
                rounded-xl
                bg-white
                overflow-hidden
                shadow-sm
            ">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div
                    onClick={() =>
                        setIsOpen(
                            prev => !prev
                        )
                    }
                    className="
                        flex
                        justify-between
                        items-center
                        p-3
                        bg-gray-100
                        cursor-pointer
                        border-b
                    "
                >

                    <div className="
                        flex
                        items-center
                        gap-2
                    ">

                        <span className="
                            font-semibold
                            text-gray-700
                        ">
                            Package Preferences
                            {scopeLabel}
                        </span>


                        {/* ACTIVE COUNT */}
                        {activePackageCount > 0 && (

                            <span className="
                                text-xs
                                px-2
                                py-0.5
                                rounded-full
                                bg-blue-100
                                text-blue-700
                                font-medium
                            ">
                                {activePackageCount} Active
                            </span>

                        )}

                    </div>


                    <div className="
                        flex
                        items-center
                        gap-2
                    ">

                        {/* GREEN PULSE */}
                        {activePackageCount > 0 && (

                            <span className="
                                w-3.5
                                h-3.5
                                bg-green-500
                                rounded-full
                                animate-pulse
                                shadow-[0_0_8px_rgba(34,197,94,0.9)]
                            " />

                        )}


                        <span>
                            {isOpen
                                ? "▲"
                                : "▼"}
                        </span>

                    </div>

                </div>


                {/* ================================================= */}
                {/* BODY */}
                {/* ================================================= */}

                {isOpen && (

                    <div>

                        {/* ================================================= */}
                        {/* TABS */}
                        {/* ================================================= */}

                        <div className="
                            flex
                            gap-2
                            border-b
                            overflow-x-auto
                            px-4
                            pt-3
                            bg-gray-50
                        ">

                            {packagesArray.map(
                                (pkg, index) => {

                                    const hasData =
                                        hasPackageData(
                                            pkg
                                        );

                                    const isActive =
                                        activeTab ===
                                        index;


                                    return (

                                        <button
                                            key={
                                                pkg.packagePreferenceID ||
                                                index
                                            }
                                            onClick={() =>
                                                setActiveTab(
                                                    index
                                                )
                                            }
                                            className={`
                                                relative
                                                px-5
                                                py-2.5
                                                flex
                                                items-center
                                                gap-2
                                                rounded-t-lg
                                                border
                                                transition-all
                                                duration-200
                                                whitespace-nowrap

                                                ${isActive
                                                    ? "bg-white border-gray-300 border-b-white text-blue-600 font-semibold shadow-sm"
                                                    : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200 hover:text-gray-800"
                                                }
                                            `}
                                        >

                                            {/* ACTIVE TOP BAR */}
                                            {isActive && (

                                                <span className="
                                                    absolute
                                                    top-0
                                                    left-0
                                                    w-full
                                                    h-[3px]
                                                    bg-blue-500
                                                    rounded-t-lg
                                                " />

                                            )}


                                            {/* GREEN DOT */}
                                            {hasData && (

                                                <span className="
                                                    w-2.5
                                                    h-2.5
                                                    bg-green-500
                                                    rounded-full
                                                    animate-pulse
                                                " />

                                            )}


                                            {/* LABEL */}
                                            <span>
                                                Package {index + 1}
                                            </span>


                                            {/* DURATION */}
                                            {pkg.duration && (

                                                <span
                                                    className={`
                                                        text-xs
                                                        px-2
                                                        py-0.5
                                                        rounded-full

                                                        ${isActive
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-gray-200 text-gray-600"
                                                        }
                                                    `}
                                                >
                                                    {pkg.duration}
                                                </span>

                                            )}


                                            {/* REMOVE */}
                                            {!isViewMode &&
                                                packagesArray.length > 1 && (

                                                    <span
                                                        onClick={(e) => {

                                                            e.stopPropagation();

                                                            removePackagePreference(
                                                                index
                                                            );

                                                        }}
                                                        className={`
                                                            ml-1
                                                            text-xs
                                                            w-5
                                                            h-5
                                                            rounded-full
                                                            flex
                                                            items-center
                                                            justify-center

                                                            ${isActive
                                                                ? "hover:bg-blue-100"
                                                                : "hover:bg-red-100"
                                                            }
                                                        `}
                                                    >
                                                        ✕
                                                    </span>

                                                )}

                                        </button>

                                    );

                                }
                            )}


                            {/* ================================================= */}
                            {/* ADD BUTTON */}
                            {/* ================================================= */}

                            {!isViewMode && (

                                <button
                                    type="button"
                                    onClick={() => {

                                        addPackagePreference();

                                        setTimeout(() => {

                                            setActiveTab(
                                                packagesArray.length
                                            );

                                        }, 0);

                                    }}
                                    className="
                                        h-10
                                        min-w-[40px]
                                        rounded-t-lg
                                        bg-blue-600
                                        text-white
                                        hover:bg-blue-700
                                        flex
                                        items-center
                                        justify-center
                                        text-xl
                                        shadow-sm
                                    "
                                >
                                    +
                                </button>

                            )}

                        </div>


                        {/* ================================================= */}
                        {/* ACTIVE PACKAGE */}
                        {/* ================================================= */}

                        <div className="p-4">

                            {packagesArray[activeTab] &&
                                (() => {

                                    const pkg =
                                        packagesArray[
                                            activeTab
                                        ];

                                    const index =
                                        activeTab;


                                    return (

                                        <div className="
                                            border
                                            border-gray-200
                                            rounded-xl
                                            p-4
                                            bg-gray-50
                                        ">

                                            {/* ================================================= */}
                                            {/* ROW 1 */}
                                            {/* ================================================= */}

                                            <div className="
                                                grid
                                                grid-cols-1
                                                md:grid-cols-4
                                                gap-2
                                            ">

                                                {/* FROM */}
                                                <div>

                                                    <label className="
                                                        label-style
                                                        flex
                                                        items-center
                                                        gap-1
                                                    ">
                                                        <CalendarIcon />

                                                        From
                                                    </label>


                                                    <input
                                                        type="date"
                                                        value={
                                                            pkg.fromDate ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            updatePackage(
                                                                index,
                                                                "fromDate",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border-highlight"
                                                    />

                                                </div>


                                                {/* TO */}
                                                <div>

                                                    <label className="
                                                        label-style
                                                        flex
                                                        items-center
                                                        gap-1
                                                    ">
                                                        <CalendarIcon
                                                            color="#16a34a"
                                                        />

                                                        To
                                                    </label>


                                                    <input
                                                        type="date"
                                                        value={
                                                            pkg.toDate ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            updatePackage(
                                                                index,
                                                                "toDate",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border-highlight"
                                                    />

                                                </div>


                                                {/* DURATION */}
                                                <div>

                                                    <label className="label-style">
                                                        Duration
                                                    </label>


                                                    <input
                                                        type="text"
                                                        disabled
                                                        value={
                                                            pkg.duration ||
                                                            ""
                                                        }
                                                        className="
                                                            border-highlight
                                                            bg-gray-100
                                                        "
                                                    />

                                                </div>


                                                {/* FLEXIBLE DATES */}
                                                <div>

                                                    <label className="label-style">
                                                        Flexible Dates
                                                    </label>


                                                    <div className="
                                                        flex
                                                        items-end
                                                        gap-2
                                                    ">

                                                        <div className={
                                                            toggleStyles.wrapper
                                                        }>

                                                            <button
                                                                type="button"
                                                                onClick={() => {

                                                                    if (
                                                                        isViewMode
                                                                    ) {
                                                                        return;
                                                                    }


                                                                    const newValue =
                                                                        !pkg.isFlexibleDates;


                                                                    const updated =
                                                                        [
                                                                            ...packagesArray
                                                                        ];


                                                                    updated[
                                                                        index
                                                                    ] = {

                                                                        ...updated[
                                                                            index
                                                                        ],

                                                                        isFlexibleDates:
                                                                            newValue,

                                                                        ...(newValue === false && {
                                                                            flexibleDays: 0
                                                                        })

                                                                    };


                                                                    setHolidayLeadObj(
                                                                        prev => ({
                                                                            ...prev,
                                                                            packages:
                                                                                updated
                                                                        })
                                                                    );

                                                                }}
                                                                className={
                                                                    toggleStyles.toggle(
                                                                        pkg.isFlexibleDates
                                                                    )
                                                                }
                                                            >

                                                                <div
                                                                    className={
                                                                        toggleStyles.circle(
                                                                            pkg.isFlexibleDates
                                                                        )
                                                                    }
                                                                />

                                                            </button>


                                                            <span
                                                                className={
                                                                    toggleStyles.label(
                                                                        pkg.isFlexibleDates
                                                                    )
                                                                }
                                                            >
                                                                {pkg.isFlexibleDates
                                                                    ? "Yes"
                                                                    : "No"}
                                                            </span>

                                                        </div>


                                                        <input
                                                            type="number"
                                                            disabled={
                                                                isViewMode ||
                                                                !pkg.isFlexibleDates
                                                            }
                                                            value={
                                                                pkg.isFlexibleDates
                                                                    ? (
                                                                        pkg.flexibleDays ||
                                                                        0
                                                                    )
                                                                    : 0
                                                            }
                                                            onChange={(e) =>
                                                                updatePackage(
                                                                    index,
                                                                    "flexibleDays",
                                                                    Number(
                                                                        e.target.value
                                                                    )
                                                                )
                                                            }
                                                            placeholder="Days"
                                                            className={`
                                                                h-9
                                                                w-16
                                                                px-2
                                                                py-1
                                                                text-sm
                                                                border-2
                                                                border-gray-300
                                                                rounded

                                                                ${!pkg.isFlexibleDates
                                                                    ? "bg-gray-100 cursor-not-allowed"
                                                                    : "bg-white"
                                                                }
                                                            `}
                                                        />

                                                    </div>

                                                </div>

                                            </div>


                                            {/* ================================================= */}
                                            {/* ROW 2 */}
                                            {/* ================================================= */}

                                            <div className="
                                                grid
                                                grid-cols-1
                                                md:grid-cols-4
                                                gap-2
                                                mt-2
                                            ">

                                                {/* BUDGET */}
                                                <div>

                                                    <label className="label-style">
                                                        Budget
                                                    </label>


                                                    <input
                                                        type="number"
                                                        value={
                                                            pkg.budget ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            updatePackage(
                                                                index,
                                                                "budget",
                                                                Number(
                                                                    e.target.value
                                                                )
                                                            )
                                                        }
                                                        className="border-highlight"
                                                    />

                                                </div>


                                                {/* CURRENCY */}
                                                <div>

                                                    <label className="label-style">
                                                        Currency
                                                    </label>


                                                    <select
                                                        value={
                                                            pkg.currency ||
                                                            "INR"
                                                        }
                                                        onChange={(e) =>
                                                            updatePackage(
                                                                index,
                                                                "currency",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border-highlight"
                                                    >

                                                        <option value="INR">
                                                            INR
                                                        </option>

                                                        <option value="USD">
                                                            USD
                                                        </option>

                                                        <option value="EUR">
                                                            EUR
                                                        </option>

                                                    </select>

                                                </div>


                                                {/* HOTEL */}
                                                <div>

                                                    <label className="label-style">
                                                        Hotel
                                                    </label>


                                                    <select
                                                        value={
                                                            pkg.hotelCategory ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            updatePackage(
                                                                index,
                                                                "hotelCategory",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border-highlight"
                                                    >

                                                        <option value="">
                                                            Select
                                                        </option>

                                                        <option value="3 Star">
                                                            3 Star
                                                        </option>

                                                        <option value="4 Star">
                                                            4 Star
                                                        </option>

                                                        <option value="5 Star">
                                                            5 Star
                                                        </option>

                                                    </select>

                                                </div>


                                                {/* MEAL PLAN */}
                                                <div>

                                                    <label className="label-style">
                                                        Meal Plan
                                                    </label>


                                                    <select
                                                        value={
                                                            pkg.mealPlan ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            updatePackage(
                                                                index,
                                                                "mealPlan",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border-highlight"
                                                    >

                                                        <option value="">
                                                            Select
                                                        </option>

                                                        <option value="Breakfast">
                                                            Breakfast
                                                        </option>

                                                        <option value="Half Board">
                                                            Half Board
                                                        </option>

                                                        <option value="Full Board">
                                                            Full Board
                                                        </option>

                                                        <option value="All Inclusive">
                                                            All Inclusive
                                                        </option>

                                                    </select>

                                                </div>

                                            </div>


                                            {/* ================================================= */}
                                            {/* ROW 3 */}
                                            {/* ================================================= */}

                                            <div className="
                                                grid
                                                grid-cols-1
                                                md:grid-cols-2
                                                gap-3
                                                mt-3
                                            ">

                                                {/* TRIP DESCRIPTION */}
                                                <div>

                                                    <label className="label-style">
                                                        Trip Description
                                                    </label>


                                                    <input
                                                        type="text"
                                                        value={
                                                            pkg.tripDescription ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            updatePackage(
                                                                index,
                                                                "tripDescription",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border-highlight"
                                                    />

                                                </div>


                                                {/* DEPARTURE CITY */}
                                                <div>

                                                    <label className="label-style">
                                                        Departure City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={pkg.departureCity || ""}
                                                        onChange={(e) =>
                                                            updatePackage(
                                                                index,
                                                                "departureCity",
                                                                e.target.value
                                                            )}
                                                        className="border-highlight"
                                                        placeholder="Enter Departure City"
                                                    />

                                                </div>

                                            </div>


                                            {/* ================================================= */}
                                            {/* DESTINATIONS */}
                                            {/* ================================================= */}

                                            <div className="mt-3">

                                                <label className="label-style">
                                                    Destinations
                                                </label>


                                                <input
                                                    type="text"
                                                    value={
                                                        pkg.destinations ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        updatePackage(
                                                            index,
                                                            "destinations",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g. Paris, Rome, Zurich"
                                                    className="border-highlight"
                                                />

                                            </div>


                                            {/* ================================================= */}
                                            {/* NOTES */}
                                            {/* ================================================= */}

                                            <div className="mt-3">

                                                <div className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    mb-1
                                                ">

                                                    <label className="label-style mb-0">
                                                        Notes
                                                    </label>


                                                    {!isViewMode && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openNotesEditor(
                                                                    index
                                                                )
                                                            }
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                px-2.5
                                                                py-1
                                                                rounded-md
                                                                bg-blue-50
                                                                text-blue-600
                                                                hover:bg-blue-100
                                                                text-xs
                                                                font-medium
                                                                transition
                                                            "
                                                        >
                                                            ↗ Expand Notepad
                                                        </button>

                                                    )}

                                                </div>


                                                <RichTextEditor
                                                    value={
                                                        pkg.notes ||
                                                        ""
                                                    }
                                                    disabled={
                                                        isViewMode
                                                    }
                                                    onChange={(value) =>
                                                        updatePackage(
                                                            index,
                                                            "notes",
                                                            value
                                                        )
                                                    }
                                                    onExpand={() =>
                                                        openNotesEditor(
                                                            index
                                                        )
                                                    }
                                                />

                                            </div>

                                        </div>

                                    );

                                })()}

                        </div>

                    </div>

                )}

            </div>


            {/* ===================================================== */}
            {/* FULL SCREEN NOTES MODAL */}
            {/* ===================================================== */}

            {isNotesExpanded &&
                expandedNotesPackageIndex !== null && (

                    <FullScreenNotesEditor
                        value={
                            packagesArray[
                                expandedNotesPackageIndex
                            ]?.notes || ""
                        }
                        onChange={
                            updateExpandedNotes
                        }
                        onClose={
                            closeNotesEditor
                        }
                    />

                )}

        </div>
    );
}
