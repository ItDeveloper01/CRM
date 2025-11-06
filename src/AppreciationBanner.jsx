import React, { useEffect, useState } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import config from "./config";

function AppreciationBanner() {
  const [messages, setMessages] = useState([]);
  const fetchMessagesAPI = config.apiUrl + "/Broadcast/GetTodayMessages";

  useEffect(() => {
    // 1️⃣ Fetch today's messages when site loads
    axios.get(fetchMessagesAPI).then((res) => {
      if (Array.isArray(res.data)) setMessages(res.data);
    });

    // 2️⃣ Connect to SignalR for live updates
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(config.socketUrl, { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => console.log("✅ Connected to AppreciationHub"))
      .catch((err) => console.error("❌ SignalR error:", err));

    // When new message arrives → append it
    connection.on("ReceiveAppreciation", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => connection.stop();
  }, []);

  if (messages.length === 0) return null;

  // 3️⃣ Combine all messages into one scrolling line
  const combinedMessage = messages.join("     🌟     ");

  return (
    <div className="relative overflow-hidden bg-green-100 text-green-800 font-semibold py-2 shadow-md">
      <div className="whitespace-nowrap animate-marquee">
        🌟 {combinedMessage} 🌟
      </div>
    </div>
  );
}

export default AppreciationBanner;
