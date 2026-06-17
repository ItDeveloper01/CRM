import { useState, useEffect,useRef } from "react";


export const ManageActivityModal = ({ open, onClose, onSave, initialActivity, }) => {
  const nextActivityId = useRef(1);
  const [activity, setActivity] = useState({id:"", time: "14:00", title: "", notes: "" });
  useEffect(() => {
    if (initialActivity) {
      debugger;
      setActivity(initialActivity);
    } else {
      setActivity({
        id:nextActivityId.current,
        time: "14:00",
        title: "",
        notes: "",
      });
    }
  }, [initialActivity, open]);
  if (!open) return null;
  const submit = () => {
    if (!activity.title.trim()) return;
    onSave(activity);
    nextActivityId.current += 1;
    setActivity({ id:nextActivityId.current, time: "14:00", title: "", notes: "" });
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/25 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[560px] shadow-xl">
        {/* <h2 className="text-2xl font-semibold mb-5">Add Activity</h2> */}
        <h2 className="text-2xl font-semibold mb-5">
          {initialActivity ? "Edit Activity" : "Add Activity"}
        </h2>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="text-sm text-gray-500">Time</label>
            <input type="time" value={activity.time} onChange={(e) => setActivity({ ...activity, time: e.target.value })} className="w-full border rounded-lg p-3 mt-1" />
          </div>
          <div className="flex-1">
            <label className="text-sm text-gray-500">Activity Title</label>
            <input placeholder="e.g Beach walk" value={activity.title} onChange={(e) => setActivity({ ...activity, title: e.target.value })} className="w-full border rounded-lg p-3 mt-1" />
          </div>
        </div>
        <textarea rows="4" placeholder="Optional details" value={activity.notes} onChange={(e) => setActivity({ ...activity, notes: e.target.value })} className="w-full border rounded-lg p-3" />
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="border px-5 py-2 rounded-xl">Cancel</button>
          {/* <button onClick={submit} className="border px-5 py-2 rounded-xl">Add Activity</button> */}
          <button onClick={submit} className="border px-5 py-2 rounded-xl">
            {initialActivity ? "Update Activity" : "Add Activity"}
          </button>
        </div>
      </div>
    </div>
  );
}