import { useState, useRef } from "react";
import DayTabs from "./DayTabs";
import { ManageActivityModal } from "./ManageActivityModal";
import {
  colors,
  DAY_COLORS,
  iconButtonStyle,
  dashedAddButtonStyle,
  activityCardStyle,
  activityTimeStyle,
  activityTitleStyle,
  activityNotesStyle,
  dayPanelStyle,
  addActivityButtonStyle,
} from "../itineraryStyles";



// ── uid helper (local, only needed for days) ──────────────────────────────
let _dayId = 500;
const uid = () => String(++_dayId);

export function mkDay(n) {
  return { id: uid(), title: `Day ${n} Title`, activities: [] };
}

// ── DayWiseSchedule ───────────────────────────────────────────────────────
/**
 * Props:
 *   days      {Array}    – array of day objects
 *   setDays   {Function} – state setter from parent
 */
export default function DayWiseSchedule({ days, setDays }) {
  const [selectedDay, setSelectedDay]         = useState(0);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingIndex, setEditingIndex]       = useState(null);

  const dragIdx      = useRef(null);
  const dragOverIdx  = useRef(null);

  const handleDragSort = () => {
    const from = dragIdx.current;
    const to   = dragOverIdx.current;
    if (from !== null && to !== null && from !== to) {
      setDays((prev) => {
        const copy    = [...prev];
        const [moved] = copy.splice(from, 1);
        copy.splice(to, 0, moved);
        return copy;
      });
    }
    dragIdx.current     = null;
    dragOverIdx.current = null;
  };

  const openAddActivity = () => {
    setEditingActivity(null);
    setEditingIndex(null);
    setShowActivityModal(true);
  };

  const openEditActivity = (activity, index) => {
    setEditingActivity(activity);
    setEditingIndex(index);
    setShowActivityModal(true);
  };

  const closeActivityModal = () => {
    setShowActivityModal(false);
    setEditingActivity(null);
    setEditingIndex(null);
  };

  const saveActivity = (activity) => {
    setDays((prev) =>
      prev.map((day, dayIndex) => {
        if (dayIndex !== selectedDay) return day;
        const activities = [...(day.activities || [])];
        if (editingIndex !== null) {
          activities[editingIndex] = activity;
        } else {
          activities.push(activity);
        }
        return { ...day, activities };
      })
    );
    setEditingActivity(null);
    setEditingIndex(null);
  };

  const deleteActivity = (activityIndex) => {
    setDays((prev) =>
      prev.map((day, dayIndex) =>
        dayIndex === selectedDay
          ? {
              ...day,
              activities: day.activities.filter((_, i) => i !== activityIndex),
            }
          : day
      )
    );
  };

  return (
    <>
      <div
        style={{
          background: colors.white,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          padding: 20,
        }}
      >
        {/* Section heading */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                background: colors.primary,
                color: colors.white,
                borderRadius: "50%",
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              3
            </span>
            <span style={{ fontWeight: 700, fontSize: 15, color: colors.primary }}>
              Day Wise Schedule
            </span>
            <span style={{ fontSize: 11, color: colors.textSubtle }}>
              (Same for all variants) ⓘ
            </span>
          </div>
        </div>

        {/* Day tabs */}
        <DayTabs
          days={days}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onAddDay={() => setDays((prev) => [...prev, mkDay(prev.length + 1)])}
          dragItem={dragIdx}
          dragOverItem={dragOverIdx}
          onDragSort={handleDragSort}
          onDeleteDay={(index) => {
            setDays((prev) => prev.filter((_, i) => i !== index));
            if (selectedDay >= days.length - 1) {
              setSelectedDay(Math.max(0, selectedDay - 1));
            }
          }}
        />

        {/* Selected day panel */}
        {days[selectedDay] && (
          <div style={dayPanelStyle}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: colors.text }}>
              Day {selectedDay + 1}
            </h3>

            {/* Activity list */}
            <div>
              {days[selectedDay].activities?.map((activity, index) => (
                <div key={index} style={activityCardStyle}>
                  {/* Time */}
                  <div style={activityTimeStyle}>{activity.time}</div>

                  {/* Title + notes */}
                  <div style={{ flex: 1 }}>
                    <div style={activityTitleStyle}>{activity.title}</div>
                    {activity.notes && (
                      <div style={activityNotesStyle}>{activity.notes}</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
                    <button
                      onClick={() => openEditActivity(activity, index)}
                      style={iconButtonStyle("edit")}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteActivity(index)}
                      style={iconButtonStyle("delete")}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add activity button */}
            <button onClick={openAddActivity} style={addActivityButtonStyle}>
              + Add Activity
            </button>
          </div>
        )}
      </div>

      {/* Activity modal */}
      <ManageActivityModal
        open={showActivityModal}
        initialActivity={editingActivity}
        onClose={closeActivityModal}
        onSave={saveActivity}
      />
    </>
  );
}