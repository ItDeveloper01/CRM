import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

// Routes that need edge-to-edge layout (no padding on the main content area)
const NO_PADDING_ROUTES = [
  '/teamStatistics/managerAnalyticBoard',
];

export default function Layout({ auth, setAuth, menu }) {
  const location = useLocation();
  const noPadding = NO_PADDING_ROUTES.includes(location.pathname);

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar auth={auth} setAuth={setAuth} />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Navbar auth={auth} setAuth={setAuth} />
        <main className={`flex-1 overflow-y-auto flex flex-col ${noPadding ? '' : 'p-6'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}


