import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

//Scroll bar functionality for overall scrm is adjusted from here 
export default function Layout({ auth, setAuth ,menu }) {
  return (
    <div className='flex h-screen overflow-hidden bg-gray-100'>
      <Sidebar
        auth={auth}
        setAuth={setAuth}
      />
      <div className='flex-1 min-w-0 flex flex-col overflow-hidden'>
        <Navbar
          auth={auth}
          setAuth={setAuth}
        />
        <main className='flex-1 min-w-0 p-6 overflow-y-auto overflow-x-hidden'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
