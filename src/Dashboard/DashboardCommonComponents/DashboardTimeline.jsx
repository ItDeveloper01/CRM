

import React, { useState } from "react";
import BucketCard from "./BucketCard";

const DashboardTimeline = ({
    timeline,

    onCall,
    onNote,
    onReschedule,
    onOpen,

    noteOpen,
    rescheduleOpen,

    onSaveNote,
    onSaveReschedule,
    onRescheduleSuccess,
    onCancelInline
}) => {

    const [expandedBucket, setExpandedBucket] = useState(null);

    const bucketOrder = [
        "overdue",
        "today",
        "created",
        "upcoming"
    ];

    // Always have a valid object
    const safeTimeline = timeline || {};
    console.log(
        "🔥 DASHBOARD TIMELINE CALLBACK:",
        onRescheduleSuccess
    );
      return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div
                className={`grid min-h-0 flex-1 gap-2 ${
                    expandedBucket
                        ? "grid-cols-1 grid-rows-1"
                        : "grid-cols-1 md:grid-cols-2 md:grid-rows-2"
                }`}
            >
                {bucketOrder
                    .filter(
                        bucket =>
                            !expandedBucket ||
                            expandedBucket === bucket
                    )
                    .map(bucket => (
                        <BucketCard
                            key={bucket}
                            bucket={bucket}
                            leads={
                                Array.isArray(safeTimeline[bucket])
                                    ? safeTimeline[bucket]
                                    : []
                            }
                            showOwner={false}
                            expanded={expandedBucket === bucket}
                            onToggleExpand={() =>
                                setExpandedBucket(current =>
                                    current === bucket ? null : bucket
                                )
                            }
                            onCall={onCall}
                            onNote={onNote}
                            onReschedule={onReschedule}
                            onOpen={onOpen}
                            noteOpen={noteOpen}
                            rescheduleOpen={rescheduleOpen}
                            onSaveNote={onSaveNote}
                            onSaveReschedule={onSaveReschedule}
                            onCancelInline={onCancelInline}
                            onRescheduleSuccess={(lead, newDate) => {
                                onRescheduleSuccess(lead, newDate);
                            }}
                        />
                    ))}
            </div>
        </div>
    );
};

export default DashboardTimeline;