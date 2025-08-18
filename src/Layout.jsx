import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ auth, setAuth }) {
  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar
        auth={auth}
        setAuth={setAuth}
      />
      <div className='flex-1 flex flex-col'>
        <Navbar
          auth={auth}
          setAuth={setAuth}
        />
        <main className='p-6 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
