import { bg } from "intl-tel-input/i18n";

export const Roles = {
  SUPER_ADMIN: "SuperAdmin",
  ADMIN: "Admin",
  USER: "User",
};


export const LeadStatusOptions = {
 OPEN: "Open",
  LOST:"Lost",
  CANCELLED:"Cancelled",
  CONFIRMED:"Confirmed",
  CLOSED:"Closed",
};

export const ErrorMessages={
ERROR_FETCHING_CITIES : "Error fetching cities:",
}

export const BannerMessages = {
  EMPTY_MESSAGE_ERROR: "Please enter a message before sending!",
  BROADCAST_SUCCESS: "Message broadcasted successfully!",
  SEND_FAIL: "Failed to send message.",
  DELETE_SUCCESS: "Message deleted successfully!",
  DELETE_FAIL: "Failed to delete message.",
};

export const ApiEndpoints = {
  GET_USER_MESSAGES_FOR_DELETE: "/Broadcast/GetUserWiseMessagesForDelete",
  DELETE_MESSAGE: "/Broadcast/DeleteMessage",
  POST_MESSAGE: "/Broadcast/PostMessage",
};

export const MESSAGE_TYPES = {
 WARNING: "WARNING",
 ERROR: "ERROR",
  INFO:"INFO"
};
// constants.js
export const MESSAGE_TYPES_DETAILS = {
  WARNING: {
    icon: "⚠️",
    label: "Warning",
    color: "bg-yellow-500 hover:bg-yellow-600",
  },
 ERROR: {
    icon: "❌",
    label: "Error",
    color: "bg-red-500 hover:bg-red-600",
  },
  INFO: {
    icon: "ℹ️",
    label: "Information",
    color: "bg-blue-500 hover:bg-blue-600",
  },
};

export const TIME_OPTIONS = {
  Monthly: "Monthly",
  Quarterly: "Quarterly",
  Yearly: "Yearly",
};

  // Define options for each period type

  export const MONTHS = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
  ];

  export const QUARTERS = [ "Q1 (Apr–Jun)", "Q2 (Jul–Sep)", "Q3 (Oct–Dec)","Q4 (Jan–Mar)"];

  export const Quarter_WISE_Months = {
    "Q1 (Apr–Jun)": ["April", "May", "June"],
    "Q2 (Jul–Sep)": ["July", "August", "September"],
    "Q3 (Oct–Dec)": ["October", "November", "December"],
    "Q4 (Jan–Mar)": ["January", "February", "March"],
  };




//  If you want to change color  then change in Tailwind.config.js file it will show effectively every where for more check status in leadgeneration
export const COLORS = {
  primarylightblue: "#158bfaff",
  blueborder: "#60A5FA",
  yellowborder: "#facc15",
  redborder: "#f36975ff",
  greenborder: "#6aee3ec6",
  purpleborder: "#9b5de5",
  grayborder: "#d1d5db",
  bluebg : "#DBEAFE",
  yellowbg : "#FEF9C3",
  redbg : "#FEE2E2",
  greenbg : "#DCFCE7",
  purplebg : "#F3E8FF",
  totalcounttextclr : "#1E40AF",
  // opentext : "#7b6c10a7",
  opentext : "#eab308",
  losttext: "#991B1B",
  confirmedtext: "#166534",
  postponedtext: "#6B21A8",
  chartCreated:"#67aceeff",
  chartopen: "#facc15",
  chartlost:"#eb4242ff",
  chartconfirmed:"#25f10acf",
  chartpostponed:"#a871ebff",
  superadmin:  "#a871ebff",
  admin: "#4185f2ff",
  hod:  "#f59e0bff",
  manager: "#ea85d8ff",
  user: "#55d244d0",
  


  
  // FEE2E2
 

};

export const STATUS_STYLES = {
  Open: {
    border: "border-yellowBorder",           // use color from tailwind.config.js
    ring: "focus:ring-yellowBorder",
    
  },
  Lost: {
    border: "border-redBorder",
    ring: "focus:ring-redBorder",
    
  },
  Confirmed: {
    border: "border-greenBorder",
    ring: "focus:ring-greenBorder",
    
  },
  Postponed: {
    border: "border-purpleBorder",
    ring:"focus:ring-purpleBorder",
    
  },
 
};


export const NOTIFICATION_COLORS = {
  unreadBackground: "bg-blue-100",
  unreadBorder: "border-blue-500",
  readBackground: "bg-gray-50",
  readText: "text-gray-500",
  tickColor: "text-gray-400",
  hover: "hover:bg-gray-100",
  badgeBackground: "bg-red-500",
  badgeText: "text-white"
};


// export const STATUS_STYLES = {
//   Open: {
//     border: "border-[#ecd57fff]",
//     ring: "focus:ring-[#ecd57fff]",
//   },
//   Lost: {
//     border: "border-red-400",
//     ring: "focus:ring-red-300",
//   },
//   Confirmed: {
//     border: "border-green-400",
//     ring: "focus:ring-green-300",
//   },
//   Postponed: {
//     border: "border-purple-400",
//     ring: "focus:ring-purple-300",
//   },
 
// };

// export const MESSAGE_TYPES = {
//   WARNING: {
//     icon: "⚠️",
//     label: "Warning",
//     color: "bg-yellow-500 hover:bg-yellow-600",
//   },
//   ERROR: {
//     icon: "❌",
//     label: "Error",
//     color: "bg-red-500 hover:bg-red-600",
//   },
//   INFO: {
//     icon: "ℹ️",
//     label: "Information",
//     color: "bg-blue-500 hover:bg-blue-600",
//   },
// };
