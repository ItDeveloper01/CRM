// ─── DayTabs.jsx ─────────────────────────────────────────────────────────────
// Shared reusable component used in both the main itinerary view
// AND inside CreateItineraryModal.
//
// Props:
//   days         – array of { name, activities[] }
//   selectedDay  – current active index (number)
//   onSelectDay  – (index) => void
//   onAddDay     – () => void   (triggers Add Day action)
//   dragItem     – React.useRef   (pass null/undefined to disable drag)
//   dragOverItem – React.useRef
//   onDragSort   – () => void
// ─────────────────────────────────────────────────────────────────────────────
 
 const DayTabs= ({
  days,
  selectedDay,
  onSelectDay,
  onAddDay,
  dragItem,
  dragOverItem,
  onDragSort,
  onDeleteDay,
}) => {
  const draggable = !!(dragItem && dragOverItem && onDragSort);
 
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {days.map((day, index) => (
      //   <button
      //     key={index}
      //     draggable={draggable}
      //     onDragStart={draggable ? () => (dragItem.current = index) : undefined}
      //     onDragEnter={draggable ? () => (dragOverItem.current = index) : undefined}
      //     onDragEnd={draggable ? onDragSort : undefined}
      //     onDragOver={draggable ? (e) => e.preventDefault() : undefined}
      //     onClick={() => onSelectDay(index)}
      //     className={`rounded-xl border px-4 py-2 text-left min-w-[90px]
      //       ${draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}
      //       transition-all
      //       ${selectedDay === index
      //         ? "border-indigo-500 bg-indigo-50"
      //         : "border-gray-300 bg-[#f3f3f3] hover:border-indigo-300"
      //       }`}
      //   >
      //     <div className="text-[10px] text-gray-500">Day {index + 1}</div>
      //     {/* <div className="font-medium text-xs truncate">{day.name || "Untitled"}</div> */}
      //   </button>
      // ))}
       <div
      key={index}
      draggable={draggable}
      onDragStart={draggable ? () => (dragItem.current = index) : undefined}
      onDragEnter={draggable ? () => (dragOverItem.current = index) : undefined}
      onDragEnd={draggable ? onDragSort : undefined}
      onDragOver={draggable ? (e) => e.preventDefault() : undefined}
      onClick={() => onSelectDay(index)}
      className={`
        relative rounded-xl border px-4 py-2 min-w-[90px]
        cursor-pointer transition-all
        ${selectedDay === index
          ? "border-indigo-500 bg-blue-50"
          : "border-gray-300 bg-[#f3f3f3] hover:border-blue-600"}
      `}
    >
      {/* Delete Button */}
      {/* {onDeleteDay && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteDay(index);
          }}
          className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center
                     text-gray-400 hover:text-red-500 text-xs"
        >
          ×
        </button>
      )} */}

      {/* Entire card clickable */}
      <div className="w-full h-full">
        <div className="text-[10px] text-gray-500">
          Day {index + 1}
        </div>
      </div>
    </div>
  ))}
 
      {/* ── + Add Day button always at the end ── */}
      {/* {onAddDay && (
        <button
          onClick={onAddDay}
          className="rounded-xl border-2 border-dashed border-indigo-300 px-4 py-2 text-left min-w-[90px]
            hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer"
        >
          <div className="text-[10px] text-indigo-400">Add</div>
          <div className="font-medium text-xs text-indigo-500">+ Day</div>
        </button>
      )} */}
    </div>
  );
}
 
export default DayTabs;