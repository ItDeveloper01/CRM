import { useState, useRef, useEffect } from "react";
import logo from "./logo.svg";
import { LogOut, Settings, User, Bell, Check } from "lucide-react";
import { useGetSessionUser } from "./SessionContext";
import { ErrorMessages } from "./Constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "./config";
import { NOTIFICATION_COLORS } from "./Constants";
import UpdateLeadsModal from "./UpdateLeadsModal";
import { getEmptyLeadObj } from "./Model/LeadModel";

export default function Navbar({ auth, setAuth }) {

  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
   const [modalOpen, setModalOpen] = useState(false);
   const [selectedLead, setSelectedLead] = useState(getEmptyLeadObj());
   const [viewMode, setViewMode] = useState("view"); // "view" or "edit"

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const { logout, setUser } = useGetSessionUser();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("loggedInUser");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  const getNotificationURL = config.apiUrl + "/Notification/GetNotifications";
  const getLeadsForEditAsPerNotificationAPI = config.apiUrl + "/TempLead/GetLeadsAsPerNotification";

  const initialLetter =
    loggedInUser?.user?.userId?.charAt(0).toUpperCase() || "G";

  // 🔹 Load Notifications
  useEffect(() => {
    if (!loggedInUser?.user?.userId) return;
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await axios.get(getNotificationURL, {
        params: { userId: loggedInUser?.user.userId },
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`
        }
      });

      const data = res.data;

      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter(x => !x.isRead).length);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error loading notifications", err);
    }
  };

const leadDeatilsClicked = (notification) => {
  if (notification.leadID) {
    markAsRead(notification);
    
    switch(notification.notificationType) {
    
      case "LeadTransfer":
    
      fetchLeadForEdit(notification);
    
      break;
    
      default:
        //navigate(`/LeadDetails/${notification.leadID}`);
    }
  }
};

  // 🔹 Mark Single Notification As Read
  const markAsRead = async (notification) => {

    if (notification.isRead) return;

    try {
      await axios.post(
        config.apiUrl + "/Notification/MarkAsRead",
        null,
        {
          params: { notificationId: notification.notificationId },
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`
          }
        }
      );

      setNotifications(prev =>
        prev.map(n =>
          n.notificationId === notification.notificationId
            ? { ...n, isRead: true }
            : n
        )
      );

      setUnreadCount(prev => prev > 0 ? prev - 1 : 0);

      // Optional: Navigate to Lead
      if (notification.leadID) {

        fetchLeadForEdit(notification);
       // navigate(`/LeadDetails/${notification.leadID}`);
       
      }

    } catch (err) {
      console.error("Error marking notification as read", err);
    }
  };

 const fetchLeadForEdit = async (notification) => {
  try {
    // Sending entire notification object
    const res = await axios.post(
      getLeadsForEditAsPerNotificationAPI,
      notification, // send entire object in body
      {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`
        }
      }
    );

    const leadData = res.data;
    setSelectedLead(leadData);

     console.log("Lead data fetched for edit:", leadData);

     if(leadData.categoryStatus==1)
      setViewMode("edit");
    else
      setViewMode("view");
             
    setModalOpen(true);

    console.log("View mode set to:", viewMode);
    // Open modal with lead data
    //UpdateLeadsModal.open(notification.leadID, leadData);

  } catch (err) {
    console.error("Error fetching lead for edit", err);
  }
};

  // 🔹 Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfile = () => {
    navigate("/ProfileDisplay", {
      state: { user: loggedInUser.user }
    });
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      logout();
      await fetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error(ErrorMessages.LOGOUT_API_FAILED, error);
    }

    localStorage.removeItem("auth");
    setUser({ isLoggedIn: false, role: null, user: null });
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-4 relative">

      <img src={logo} alt="Logo" className="h-10 w-auto" />

      <div className="flex items-center gap-6 relative">

        {/* 🔔 Notifications */}
        <div className="relative" ref={notifRef}>
          <div
            className="cursor-pointer relative"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Bell size={22} />

            {unreadCount > 0 && (
              <span
                className={`absolute -top-2 -right-2 text-xs px-1 rounded-full ${NOTIFICATION_COLORS.badgeBackground} ${NOTIFICATION_COLORS.badgeText}`}
              >
                {unreadCount}
              </span>
            )}
          </div>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">

              {notifications.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.notificationId}
                    onClick={() => leadDeatilsClicked(n)}
                    className={`p-3 border-b cursor-pointer flex justify-between items-start transition-all duration-200
                      ${!n.isRead
                        ? `${NOTIFICATION_COLORS.unreadBackground} border-l-4 ${NOTIFICATION_COLORS.unreadBorder} font-medium`
                        : `${NOTIFICATION_COLORS.readBackground} ${NOTIFICATION_COLORS.readText}`}
                      ${NOTIFICATION_COLORS.hover}`}
                  >
                    <div>
                      <div className="text-sm">
                        {n.title}
                      </div>
                      <div className="text-xs">
                        {n.message}
                      </div>
                    </div>

                    {n.isRead && (
                      <Check size={14} className={`${NOTIFICATION_COLORS.tickColor} mt-1`} />
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 👤 Avatar */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
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

          {open && (
            <div className="absolute right-0 top-14 w-48 bg-white border rounded-lg shadow-lg z-50">
              <button
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                onClick={handleProfile}
              >
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

      <UpdateLeadsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        lead={selectedLead}
        // readOnly={readOnly}
        mode={viewMode}              // you can write {mode} alson at view place
      />
    </header>

    
  );
}
