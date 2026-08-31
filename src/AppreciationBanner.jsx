import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import config from "./config";
import { useGetSessionUser } from "./SessionContext";
import SignalRService from "./SignalRService";

function AppreciationBanner() {
  const [messages, setMessages] = useState([]);
  const { user: sessionUser } = useGetSessionUser();
  const renderCounter = useRef(0);
  renderCounter.current++;

  const fetchMessagesAPI = config.apiUrl + "/Broadcast/GetTodayMessages";

  // useEffect(() => {
  //   console.log("🧭 AppreciationBanner mounted");

  //   // Initial fetch of messages
  //   axios
  //     .get(fetchMessagesAPI, {
  //       headers: { Authorization: `Bearer ${sessionUser.token}` },
  //     })
  //     .then((res) => {
  //       if (Array.isArray(res.data) && res.data.length > 0) {
  //         setMessages(res.data); // ✅ data is already an array of strings
  //       } else {
  //         setMessages(["No appreciation messages today."]);
  //       }
  //       console.log("✅ Initial messages fetched:", res.data);
  //     })
  //     .catch((err) => console.error("Error fetching messages:", err)
    
  //   );

  //   // SignalR connection
  //   const connection = new signalR.HubConnectionBuilder()
  //     .withUrl(config.socketUrl, { accessTokenFactory: () => sessionUser.token })
  //     .withAutomaticReconnect()
  //     .configureLogging(signalR.LogLevel.Information)
  //     .build();

  //   connection.on("ReceiveAppreciation", (msg) => {
  //     console.log("📩 Received Appreciation:", msg);
  //     setMessages((prev) => [...prev, msg]); // msg is string
  //   });

  //     // Delete message listener
  //   connection.on("DeleteAppreciation", (msg) => {
  //      console.log("📩 Deleted Appreciation:", msg);
  //   setMessages((prev) => prev.filter((m) => m.id !== msg.id));
  // });

  //   connection.onclose((err) => console.warn("❌ Connection closed:", err));

  //   connection
  //     .start()
  //     .then(() => console.log("✅ Connected to AppreciationHub:", config.socketUrl))
  //     .catch((err) => console.error("🚫 SignalR connection failed:", err));

  //   return () => {
  //     console.log("🧹 Cleaning up SignalR connection...");
  //     connection.stop();
  //   };
  // }, [sessionUser.token]);


  useEffect(() => {
  if (!sessionUser?.token) {
    console.warn("⚠️ No session token found, skipping Appreciation setup");
    return;
  }


console.log("🧭 AppreciationBanner mounted");

    // Initial fetch of messages
    axios
      .get(fetchMessagesAPI, {
        headers: { Authorization: `Bearer ${sessionUser.token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setMessages(res.data); // ✅ data is already an array of strings
        } else {
          setMessages(["No appreciation messages today."]);
        }
        console.log("✅ Initial messages fetched:", res.data);
      })
      .catch((err) => console.error("Error fetching messages:", err)
    
    );

    // SignalR connection and listeners
  console.log("👏 Setting up Appreciation listener");

  let isMounted = true;

  // 📩 Receive appreciation message
  const receiveAppreciation = (msg) => {
    if (!isMounted) return;

    console.log("📩 ReceiveAppreciation:", msg);

    setMessages((prev) => [...prev, msg]);
  };

  // 🗑 Delete appreciation message
  const deleteAppreciation = (msg) => {
    if (!isMounted) return;

    console.log("🗑 DeleteAppreciation:", msg);

    setMessages((prev) =>
      prev.filter((m) => m.id !== msg.id)
    );
  };

  const initSignalR = async () => {
    try {
      console.log("🚀 Starting Appreciation SignalR");

      if (SignalRService?.safeOn) {
        // register handlers
        SignalRService.safeOn("ReceiveAppreciation", receiveAppreciation);
        SignalRService.safeOn("DeleteAppreciation", deleteAppreciation);
      }

      console.log("🎯 Appreciation handlers registered");
    } catch (err) {
      console.error("🔥 Appreciation SignalR init error:", err);
    }
  };

  initSignalR();

  // 🧹 Cleanup
  return () => {
    isMounted = false;

    if (SignalRService?.safeOff) {
      SignalRService.safeOff("ReceiveAppreciation", receiveAppreciation);
      SignalRService.safeOff("DeleteAppreciation", deleteAppreciation);
    }

    console.log("🛑 Appreciation SignalR handlers removed");
  };
}, [sessionUser?.token]);

  const renderStats = useMemo(() => {
    console.log(`🔁 AppreciationBanner render #${renderCounter.current}`);
    return `Render count: ${renderCounter.current}`;
  }, [messages]);

  debugger;
  //if (!messages || messages.length == 0) return null;

  debugger;
  // If messages = [{ id: 1, message: "hello" }, { id: 2, message: "hi" }]
   if (!messages || messages.length === 0) return null;

const combinedMessage = messages
  .filter(m => m?.message?.trim())
  .map(m => m.message)
  .join("        🌟        ");

if (!combinedMessage) return null;

return (
    <div className="relative flex items-center overflow-hidden bg-green-100 shadow-sm border border-green-200 rounded-lg">

        <div className="relative flex h-full shrink-0 items-center justify-center bg-amber-500 px-3 py-2.5">

            <i className="ti ti-mail text-white text-lg" />

            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />

        </div>

        <div className="flex-1 overflow-hidden py-2">

            <div className="whitespace-nowrap animate-marquee px-4 text-sm font-semibold text-green-800">
                ⭐ {combinedMessage} ⭐
            </div>

        </div>

    </div>
);

}

export default AppreciationBanner;
