import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './Dashboard';
import Leads from './Leads';
import Bookings from './Bookings';
import Login from './Login';
import Layout from './Layout';
import NewCustomerInfo from './NewCustomerInfo';


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <>
            {/* All pages wrapped with Layout */}
            <Route element={<Layout setIsLoggedIn={setIsLoggedIn} />}>
              <Route
                path='/dashboard'
                element={<Dashboard />}
              />
              <Route
                path='/leads'
                element={<Leads />}
              />
              <Route
                path='/NewCustomer'
                element={<NewCustomerInfo />}
              />
              <Route
                path='/bookings'
                element={<Bookings />}
              />
            </Route>
            <Route
              path='*'
              element={<Navigate to='/dashboard' />}
            />
          </>
        ) : (
          <>
            <Route
              path='/login'
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path='*'
              element={<Navigate to='/login' />}
            />
          </>
        )}
      </Routes>
    </Router>
  );
}
