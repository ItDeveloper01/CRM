import { Menu, UserPlus, CalendarCheck, LayoutDashboard, LogOut, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Roles } from './Constants';

export default function Sidebar({ auth, setAuth }) {
  console.log('auth', auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);
debugger;
  return (
    <div
      className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-md transition-all duration-300`}>
      <div className='flex items-center justify-between px-4 py-4 border-b'>
        <h2 className={`text-xl font-bold ${!sidebarOpen && 'hidden'}`}>CRM Panel</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className='p-2 rounded hover:bg-gray-200'>
          <Menu size={20} />
        </button>
      </div>
      <nav className='mt-6 space-y-2 px-2'>
        <Link
          to='/dashboard'
          className='flex items-center gap-3 p-2 rounded hover:bg-blue-100'>
          <LayoutDashboard size={20} />
          {sidebarOpen && 'Dashboard'}
        </Link>

        <Link
          to='/leads'
          className='flex items-center gap-3 p-2 rounded hover:bg-blue-100'>
          <UserPlus size={20} />
          {sidebarOpen && 'Leads'}
        </Link>

        <Link
          to='/NewCustomer'
          className='flex items-center gap-3 p-2 rounded hover:bg-blue-100'>
          {sidebarOpen && 'New Customer'}
        </Link>

        {/* <Link
          to='/Customers'
          className='flex items-center gap-3 p-2 rounded hover:bg-blue-100'>
          <CalendarCheck size={20} />
          {sidebarOpen && 'Customers'}
        </Link>
 */}
        {auth && (auth.role === Roles.ADMIN || auth.role === Roles.SUPER_ADMIN) && (
          <Link
            to='/users'
            className='flex items-center gap-3 p-2 rounded hover:bg-blue-100'>
            <Users size={20} />
            {sidebarOpen && 'Users'}
          </Link>
        )}
      </nav>
    </div>
  );
}
