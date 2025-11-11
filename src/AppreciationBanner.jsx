import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import config from "./config";
import { useGetSessionUser } from "./SessionContext";

function AppreciationBanner() {
  const [messages, setMessages] = useState([]);
  const { user: sessionUser } = useGetSessionUser();
  const renderCounter = useRef(0);
  renderCounter.current++;

  const fetchMessagesAPI = config.apiUrl + "/Broadcast/GetTodayMessages";

  useEffect(() => {
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

    // SignalR connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(config.socketUrl, { accessTokenFactory: () => sessionUser.token })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("ReceiveAppreciation", (msg) => {
      console.log("📩 Received Appreciation:", msg);
      setMessages((prev) => [...prev, msg]); // msg is string
    });

      // Delete message listener
    connection.on("DeleteAppreciation", (msg) => {
       console.log("📩 Deleted Appreciation:", msg);
    setMessages((prev) => prev.filter((m) => m.id !== msg.id));
  });

    connection.onclose((err) => console.warn("❌ Connection closed:", err));

    connection
      .start()
      .then(() => console.log("✅ Connected to AppreciationHub:", config.socketUrl))
      .catch((err) => console.error("🚫 SignalR connection failed:", err));

    return () => {
      console.log("🧹 Cleaning up SignalR connection...");
      connection.stop();
    };
  }, [sessionUser.token]);

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
  <div className="relative overflow-hidden bg-green-100 text-green-800 font-semibold py-2 shadow-md">
    <div className="whitespace-nowrap animate-marquee">
      🌟 {combinedMessage} 🌟
    </div>
  </div>
);
}

export default AppreciationBanner;
