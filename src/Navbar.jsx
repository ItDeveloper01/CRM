import { useState, useRef, useEffect } from "react";
import logo from "./logo.svg";
import { LogOut, Settings, User, Bell } from "lucide-react";
import { useGetSessionUser } from "./SessionContext";
import { ErrorMessages } from "./Constants";
import { useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import config from "./config";

export default function Navbar({ auth, setAuth }) {

  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const { logout, setUser } = useGetSessionUser();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("loggedInUser");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const getNotificationURL=   config.apiUrl + '/Notification/GetNotifications';

  const initialLetter =
    loggedInUser?.user?.userId?.charAt(0).toUpperCase() || "G";

  // 🔹 Load Notifications + Start SignalR
  useEffect(() => {

    debugger;

    if (!loggedInUser?.user?.userId) return;
    console.log("############Loading notifications for user:", loggedInUser.user.userId);
    
    
    loadNotifications();

   // csignalRHubConnection();

  }, []);


 const csignalRHubConnection = () => {
  const connection = new signalR.HubConnectionBuilder()
  .withUrl(config.notificationUrl, {
    accessTokenFactory: () => loggedInUser.token
  })
  .withAutomaticReconnect()
  .build();

connection.on("ReceiveNotification", (notification) => {
  console.log("##########Received notification:", notification);
  setNotifications(prev => [notification, ...prev]);
  setUnreadCount(prev => prev + 1);
});

connection.start()
  .then(() => console.log("########Connected to NotificationHub"))
  .catch(err => console.error("#################SignalR Connection Error:", err));

    return () => {
      connection.stop();
    };
  }; 

  // 🔹 Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }

      if (
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 🔹 Profile
  const handleProfile = () => {
    navigate("/ProfileDisplay", {
      state: { user: loggedInUser.user }
    });
    setOpen(false);
  };


const loadNotifications = async () => {
      try {

        debugger;
        console.log("##########API URL:", getNotificationURL);
        const res = await axios.get( getNotificationURL ,
          {
            params: { userId: loggedInUser?.user.userId },
            headers: {
              Authorization: `Bearer ${loggedInUser.token}`
            }
          }
        );
        debugger;

        console.log("***********Loaded notifications:", res);
       const data = res.data;

        if (Array.isArray(data)) {
          setNotifications(data);
          setUnreadCount(data.filter(x => !x.isRead).length);
        } else {
          console.error("********************Notifications response is not an array:", data);
          setNotifications([]);
        }
        //setUnreadCount(res.data.filter(x => !x.isRead).length);
      } catch (err) {
        console.error("********Error loading notifications", err);
      }
    };


  // 🔹 Logout
  const handleLogout = async () => {
    try {
      logout();

      await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error(ErrorMessages.LOGOUT_API_FAILED, error);
    }

    localStorage.removeItem("auth");
    setUser({ isLoggedIn: false, role: null, user: null });
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-4 relative">

      {/* Logo */}
      <img src={logo} alt="Logo" className="h-10 w-auto" />

      {/* Right Section */}
      <div className="flex items-center gap-6 relative">

        {/* 🔔 Notification Bell */}
        <div className="relative" ref={notifRef}>
          <div
            className="cursor-pointer relative"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setUnreadCount(0);
            }}
          >
            <Bell size={22} />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map((n, index) => (
                  <div
                    key={index}
                    className="p-3 border-b hover:bg-gray-100">
                    <div className="font-semibold text-sm">
                      {n.title}
                    </div>
                    <div className="text-xs text-gray-600">
                      {n.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 👤 Avatar */}
        <div
          className="flex items-center gap-4 relative"
          ref={dropdownRef}
        >
          <span className="font-medium hidden sm:block">
            {loggedInUser?.user?.userObj.firstName || "Guest"}
          </span>

          <div
            className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90"
            onClick={() => setOpen(!open)}
            style={{
              backgroundColor: !loggedInUser?.user?.photoBase64
                ? "#3b82f6"
                : "transparent"
            }}
          >
            {loggedInUser?.user?.photoBase64 ? (
              <img
                src={`data:image/${loggedInUser.user.photoMimeType || "jpeg"};base64,${loggedInUser.user.photoBase64}`}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold">
                {initialLetter}
              </span>
            )}
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-14 w-48 bg-white border rounded-lg shadow-lg z-50">
              <button className='flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100'   onClick={handleProfile}             >
                <User size={18} /> Profile
              </button>

              <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100">
                <Settings size={18} /> Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-100"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
