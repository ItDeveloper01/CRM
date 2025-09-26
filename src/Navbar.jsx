import { useState, useRef, useEffect } from 'react';
import logo from './logo.svg';
import { LogIn, LogOut, Settings, User } from 'lucide-react';
import {useGetSessionUser}  from "./SessionContext";
import Login from './Login';
import { useNavigate } from "react-router-dom";

export default function Navbar({ auth, setAuth }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const storedUser = localStorage.getItem('loggedInUser');
const loggedInUser = storedUser ? JSON.parse(storedUser) : null;


console.log("Logged in user: " , loggedInUser);

console.log("LoggedIn user Name...."+loggedInUser.user.userId );

  const initialLetter = loggedInUser.user?.userId?.charAt(0).toUpperCase();
  console.log("Initial Letter...", initialLetter);
   // ✅ Get user + setUser from context
  const { user, setUser } = useGetSessionUser();

   const navigate = useNavigate(); // ✅ now navigate is defined

// ✅ User Profile handler
  const handleProfile = async () => {
    try {
      // Call backend to invalidate session/token
      //navigate to profile route

      debugger;

      navigate('/ProfileDisplay', { state: { user: loggedInUser.user } });
      setOpen(false);

      //{ navigate('/profile'); 
      // setOpen(false); }}
   
    } catch (error) {
      console.error("Logout API failed", error);
    }
    
  };

 // ✅ Safe logout handler
  const handleLogout = async () => {
    try {
      // Call backend to invalidate session/token


      debugger;


      await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // if you use cookies
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Logout API failed", error);
    }

   
    // Clear local storage
    localStorage.removeItem("auth");

    // Reset context state
    setUser({ isLoggedIn: false, role: null, user: null });

    // Redirect
   // window.location.href = "/login";
    navigate("/login");

   //
  };


  // return (
  //   <UserContext.Provider value={{ user, setUser, logout }}>
  //     {children}
  //   </UserContext.Provider>
  // );


  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className='h-16 bg-white shadow flex items-center justify-between px-4 py-4 relative'>
      {/* Logo */}
      <img
        src={logo}
        alt='Logo'
        className='h-10 w-auto'
      />

      {/* User Info + Avatar */}
      <div
        className='flex items-center gap-4 relative'
        ref={dropdownRef}>
        <span className='font-medium hidden sm:block'>
           {loggedInUser?.user?.fName || "Guest"}
        </span>
        <div
  className='w-10 h-10 rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90'
  onClick={() => setOpen(!open)}
  style={{ backgroundColor: !loggedInUser.user?.photoBase64 ? "#3b82f6" : "transparent" }} // fallback blue if no photo
>
  {loggedInUser.user?.photoBase64 ? (
    <img
  src={`data:image/${loggedInUser.user?.photoMimeType || 'jpeg'};base64,${loggedInUser.user?.photoBase64}`}
  alt="User Avatar"
  className="w-full h-full object-cover"
/>
  ) : (
    <span className='text-white font-bold'>{initialLetter}</span>
  )}
</div>
        {/* Dropdown */}
        {open && (
          <div className='absolute right-0 top-14 w-48 bg-white border rounded-lg shadow-lg z-50'>
            <button className='flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100'  onClick={handleProfile} >
              <User size={18} /> Profile
            </button>
            <button className='flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100'>
              <Settings size={18} /> Settings
            </button>
            <button
              onClick={handleLogout}
              className='flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-100'>
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
  </div>
  </header>
  );
}
