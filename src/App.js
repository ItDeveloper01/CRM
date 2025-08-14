import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './Dashboard';
import Leads from './Leads';
import Bookings from './Bookings';
import Login from './Login';
import Layout from './Layout';
import NewCustomerInfo from './NewCustomerInfo';
import Users from './Users';
import LeadsGeneration from './LeadsGeneration';
import UserCreate from './UserCreate'; // ✅ import
import AdminRoute from './AdminRoute'; // ✅ import

export default function App() {
  const [auth, setAuth] = useState({ isLoggedIn: false, role: null });

  return (
    <Router>
      <Routes>
        {auth.isLoggedIn ? (
          <>
            <Route
              element={
                <Layout
                  auth={auth}
                  setAuth={setAuth}
                />
              }>
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
                path='/LeadsGeneration'
                element={<LeadsGeneration />}
              />

              {/* ✅ Users List */}
              <Route
                path='/users'
                element={
                  <AdminRoute auth={auth}>
                    <Users />
                  </AdminRoute>
                }
              />
              {/* ✅ User Creation inside same Layout */}
              <Route
                path='/users/create'
                element={
                  <AdminRoute auth={auth}>
                    <UserCreate />
                  </AdminRoute>
                }
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
              element={<Login setAuth={setAuth} />}
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
