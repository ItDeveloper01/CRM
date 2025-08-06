import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ setIsLoggedIn }) {
  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar setIsLoggedIn={setIsLoggedIn} />
      <div className='flex-1 flex flex-col'>
        <Navbar />
        <main className='p-6 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
