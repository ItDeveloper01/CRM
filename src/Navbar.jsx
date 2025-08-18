import { useState, useRef, useEffect } from 'react';
import logo from './logo.svg';
import { LogOut, Settings, User } from 'lucide-react';

export default function Navbar({ auth, setAuth }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loggedInUser = localStorage.getItem('loggedInUser') || 'Guest';
  const initialLetter = loggedInUser.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setAuth({ isLoggedIn: false, role: null });
  };

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
        <span className='font-medium hidden sm:block'>{loggedInUser}</span>

        {/* Avatar */}
        <div
          className='w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold cursor-pointer hover:bg-blue-600'
          onClick={() => setOpen(!open)}>
          {initialLetter}
        </div>

        {/* Dropdown */}
        {open && (
          <div className='absolute right-0 top-14 w-48 bg-white border rounded-lg shadow-lg z-50'>
            <button className='flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100'>
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
