import React from "react";
import { useState } from "react";
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
    onCancelInline
}) => {

    const [expandedBucket, setExpandedBucket] = useState(null);
    const bucketOrder = [
        "overdue",
        "today",
        "tomorrow",
        "next7"
    ];

    return (

        <div
            className={`grid flex-1 grid-cols-1 gap-3 ${
                expandedBucket ? "" : "md:grid-cols-2"
            }`}
        >

            {bucketOrder
                .filter(bucket => !expandedBucket || expandedBucket === bucket)
                .map(bucket => (
<BucketCard
    key={bucket}
    bucket={bucket}
    leads={timeline[bucket] || []}
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
/>

                ))}

        </div>

    );

};

export default DashboardTimeline;