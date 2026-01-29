import React, { useEffect } from "react";
import { Bell } from "lucide-react";
import config from "./config";
import axios from "axios";
import { useGetSessionUser } from "./SessionContext";
import { Eye } from "lucide-react";
import { useState } from "react";

// =========================
// OLD CODE - KEEP FOR REFERENCE
// =========================


// function ReminderPanel({ reminders = [] }) {
//   const grouped = reminders.reduce((acc, r) => {
//     acc[r.type] = acc[r.type] || [];
//     acc[r.type].push(r);
//     return acc;
//   }, {});

//   const { user: sessionUser } = useGetSessionUser();
//   const getRemindersAPI = config.apiUrl + "/Reminders/GetReminders";

// useEffect(() => {
//   const fetchReminders = async () => {
//     try {
//       const response = await axios.get(getRemindersAPI, {
//         params: {
//           userID: sessionUser.user.id
//         },
//         // headers: {
//         //   Authorization: `Bearer ${sessionUser.token}`
//         // }
//       });

//       console.log("Fetched Reminders:", response.data);
//     } catch (error) {
//       console.error(
//         "Error fetching reminders:",
//         error.response?.data || error
//       );
//     }
//   };

//   fetchReminders();
// }, []);


//   return (
//     <div className="relative mx-2 mb-3 rounded-lg p-[2px] rainbow-border">
//       <div className="bg-white rounded-lg shadow-sm h-120 flex flex-col">
//         {/* Header */}
//         <div className="font-bold p-2 border-b flex items-center justify-center gap-1 animate-pulse text-red-600">
//           <Bell size={18} />
//           REMINDERS
//         </div>

//         {/* Marquee container */}
//         <div className="relative h-60 overflow-hidden text-sm px-2 py-1">
//           <div className="animate-vertical-marquee">
//             {/* Original content */}
//             {Object.keys(grouped).map((group) => (
//               <div key={group} className="mb-2">
//                 <div className="font-semibold">{group}</div>
//                 {grouped[group].map((r) => (
//                   <div
//                     key={r.id}
//                     className={`pl-2 py-0.5 rounded ${
//                       r.urgent
//                         ? "bg-red-100 text-red-700 font-semibold"
//                         : "text-gray-700"
//                     }`}
//                   >
//                     • {r.text}
//                   </div>
//                 ))}
//               </div>
//             ))}

//             {/* Duplicate content for infinite scroll */}
//             {Object.keys(grouped).map((group) => (
//               <div key={`${group}-dup`} className="mb-2">
//                 <div className="font-semibold">{group}</div>
//                 {grouped[group].map((r) => (
//                   <div
//                     key={`${r.id}-dup`}
//                     className={`pl-2 py-0.5 rounded ${
//                       r.urgent
//                         ? "bg-red-100 text-red-700 font-semibold"
//                         : "text-gray-700"
//                     }`}
//                   >
//                     • {r.text}
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Animation styles */}
//         <style>{`
//           @keyframes vertical-marquee {
//             0% { transform: translateY(0%); }
//             100% { transform: translateY(-50%); }
//           }

//           .animate-vertical-marquee {
//             animation: vertical-marquee 20s linear infinite;
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// }

// export default ReminderPanel;



// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Bell, Eye } from "lucide-react";
// import useGetSessionUser from "../hooks/useGetSessionUser";
// import config from "../config";


function ReminderPanel() {
  const [reminders, setReminders] = useState([]);
  const { user: sessionUser } = useGetSessionUser();

  const getRemindersAPI = config.apiUrl + "/Reminders/GetReminders";
  const snoozeReminderAPI = config.apiUrl + "/Reminders/Snooze";
  const acknowledgeReminderAPI = config.apiUrl + "/Reminders/Acknowledge";
  

  // =========================
  // FETCH REMINDERS
  // =========================
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await axios.get(getRemindersAPI, {
          params: { userID: sessionUser?.user?.id }
        });
        setReminders(res.data || []);
        console.log("Fetched Reminders", res.data);
      } catch (err) {
        console.error("Error fetching reminders", err);
      }
    };

    if (sessionUser?.user?.id) fetchReminders();
  }, [sessionUser]);

  // =========================
  // GROUP BY EVENT TYPE
  // =========================
  const grouped = reminders.reduce((acc, r) => {
    const key = r.eventType || "Others";
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  // =========================
  // ACTION PLACEHOLDERS
  // =========================
  const onViewDetails = (dto) => {
    console.log("VIEW DETAILS DTO →", dto);
   
    // Navigate using entityType + entityId
  };

  const onSnooze = async (dto) => {
    console.log("SNOOZE DTO →", dto);
    // POST /Reminders/Snooze
   
 const setRemindersStatus = async () => {
       try {
      //   const res = await axios.put(snoozeReminderAPI, {
      //     params: { userID: dto }
      //   });


         const response = await axios.put(snoozeReminderAPI, dto, { headers: { "Content-Type": "application/json" } });
        //setReminders(res.data || []);
         setReminders(prev => prev.filter(r => r.id !== dto.id));

        console.log("snoozed Reminders", response.data);
      } catch (err) {
        console.error("Error snoozing reminders", err);
      }
    };

    setRemindersStatus();

     debugger;
  };

  const hasReminders =
  grouped &&
  Object.values(grouped).some(list => list.length > 0);
  const onAcknowledge = async (dto) => {
    console.log("ACKNOWLEDGE DTO →", dto);
   

     const setRemindersStatus = async () => {
      try {
        const response = await axios.put(acknowledgeReminderAPI, dto, { headers: { "Content-Type": "application/json" } });
         // POST /Reminders/Acknowledge
        setReminders(prev => prev.filter(r => r.id !== dto.id));
        //setReminders(res.data || []);
        console.log("acknowledged Reminders", response.data);
      } catch (err) {
        console.error("Error acknowledging reminders", err);
      }
    };

    setRemindersStatus();
     debugger;
  };

  if (!hasReminders) {
  return null; // 🔹 render nothing
     }

  return (
    <div className="reminder-sidebar">
      <div className="reminder-wrapper">
        {/* HEADER */}
        <div className="header">
          <Bell size={16} />
          <span>REMINDERS</span>
        </div>

        {/* CONTENT */}
        <div className="content">
          <div className="marquee">

            {Object.keys(grouped).map(group => (
              <div key={group} className="group">
                <div className="group-title">
                  {group} ({grouped[group].length})
                </div>

                {grouped[group].map(r => (
                  <div
                    key={r.id}
                    className={`reminder-card ${r.offsetDays <= 1 ? "urgent" : ""}`}
                  >
                    {/* NAME */}
                    <div className="name">
                      <span className="fname">{r.fName}</span>
                      <span className="lname">{r.lName}</span>
                    </div>

                    {/* MESSAGE */}
                    <div className="message">{r.message}</div>

                    {/* ACTIONS */}
                    <div className="actions">
                      <button
                        className="icon-btn"
                        onClick={() => onViewDetails(r)}
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        className="btn snooze"
                        onClick={() => onSnooze(r)}
                      >
                        Snooze
                      </button>

                      <button
                        className="btn ok"
                        onClick={() => onAcknowledge(r)}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* =========================
          STYLES
      ========================== */}
      <style>{`
        /* ------------------------
           RESPONSIVE SIDEBAR
        -------------------------*/
        .reminder-sidebar {
          width: 100%;
          max-width: 280px;           /* Desktop sidebar */
        }

        @media (max-width: 1024px) {
          .reminder-sidebar {
            max-width: 240px;
          }
        }

        @media (max-width: 768px) {
          .reminder-sidebar {
            max-width: 100%;
          }
        }

        /* ------------------------
           WRAPPER
        -------------------------*/
        .reminder-wrapper {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px;
          font-weight: 700;
          font-size: 13px;
          color: #dc2626;
          border-bottom: 1px solid #eee;
        }

        /* ------------------------
           CONTENT + MARQUEE
        -------------------------*/
        .content {
          height: 300px;
          overflow: hidden;
        }

        .marquee {
          animation: scroll 14s linear infinite;
        }

        .content:hover .marquee {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }

        @media (max-width: 768px) {
          .marquee {
            animation: none;
          }
          .content {
            height: auto;
          }
        }

        /* ------------------------
           GROUP
        -------------------------*/
        .group {
          padding: 6px;
        }

        .group-title {
          font-weight: 600;
          font-size: 12px;
          margin-bottom: 4px;
        }

        /* ------------------------
           CARD (COMPACT)
        -------------------------*/
        .reminder-card {
          background: #f9fafb;
          border-left: 3px solid #6366f1;
          border-radius: 8px;
          padding: 8px;
          margin-bottom: 6px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .reminder-card.urgent {
          background: #fff1f2;
          border-left-color: #dc2626;
        }

        .name {
          line-height: 1.05;
        }

        .fname {
          font-size: 13px;
          font-weight: 600;
        }

        .lname {
          font-size: 12px;
          color: #555;
        }

        .message {
          font-size: 12px;
          color: #333;
        }

        /* ------------------------
           ACTIONS
        -------------------------*/
        .actions {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 3px;
        }

        .btn {
          flex: 1;
          border-radius: 5px;
          padding: 3px 0;
          font-size: 11px;
          border: none;
          cursor: pointer;
        }

        .btn.snooze {
          background: #fef3c7;
          color: #92400e;
        }

        .btn.ok {
          background: #dcfce7;
          color: #166534;
        }
      `}</style>
    </div>
  );
}

export default ReminderPanel;

