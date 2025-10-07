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
import UserDashboard from './UserDashboard';
import UserDashboardTemp from './UserDashboardTemp';
import LeadsUpdateForms from "./LeadsUpdateForms"
import { useGetSessionUser } from "./SessionContext"; // ✅ import
import { fa } from 'intl-tel-input/i18n';
import ProfileDisplay from './ProfileDisplay';
import SMTPForm from './SMTPForm';
import LeadAnalytics from './LeadAnalytics';

export default function App() {
//  const [auth, setAuth] = useState({ isLoggedIn: false, role: null });
   const { user, setUser } = useGetSessionUser(); // ✅ using user now

  return (
    <Router>
      <Routes>
        {user && user.isLoggedIn ? (
          <>
            <Route
              element={
                <Layout
                  auth={user}
                  setAuth={setUser}
                />
              }>
              <Route
                path='/dashboard'
                element={<UserDashboardTemp />}
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
               <Route
                path='/LeadsAnalytics'
                element={<LeadAnalytics/>}
              />


              {/* ✅ Users List */}
              <Route
                path='/users'
                element={
                  <AdminRoute auth={user}>
                    <Users />
                  </AdminRoute>
                }
              />
               <Route
                path='/smtpsettings'
                element={
                  <AdminRoute auth={user}>
                  <SMTPForm></SMTPForm>
                  </AdminRoute>
                }
              />
              {/* ✅ User Creation inside same Layout */}
              <Route
                path='/users/create'
                element={
                  <AdminRoute auth={user}>
                    <UserCreate />
                  </AdminRoute>
                }
              />
               <Route
              path='/ProfileDisplay'
              element={<ProfileDisplay />}
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
              path='/'
              element={<Login setUser={setUser} />}
            />
           
            <Route path="/updateLeads/:id" element={<LeadsUpdateForms />} />
           
            <Route
              path='*'
              element={<Navigate to='/login' />}
            />
            <Route path="/login" element={<Login />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
