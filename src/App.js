import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Leads from './Leads';
import Login from './Login';
import Layout from './Layout';
import NewCustomerInfo from './NewCustomerInfo';
import Users from './Users';
import LeadsGeneration from './LeadsGeneration';
import UserCreate from './UserCreate'; // ✅ import
import AdminRoute from './AdminRoute'; // ✅ import
import UserDashboardTemp from './UserDashboardTemp';
import LeadsUpdateForms from "./LeadsUpdateForms"
import { useGetSessionUser } from "./SessionContext"; // ✅ import
import ProfileDisplay from './ProfileDisplay';
import SMTPForm from './SMTPForm';
import LeadAnalytics from './LeadAnalytics';
// ✅ import your NotificationProvider
import { NotificationProvider } from "./Notification";
import { useEffect } from 'react';
import { GlobalDebug } from './Remove-Console';
import AppreciationBannerAdmin from './AppreciationBannerAdmin';
import ManagerAnalytics from './ManagerAnalytics';
import ManagerTeamAnalytics from './ManagerTeamAnalytics';
import ManagerAnalyticBoard from './ManagerAnlayticBoard';
import OLAPDashboardTabs from './OLAPScreens/OLAPDashboardTabs';


export default function App() {
   const { user, setUser } = useGetSessionUser(); // ✅ using user now
   const { menu, setMenu } = useGetSessionUser(); // ✅ using menu now
   //const NotificationContext = createContext();

   /**
   * @REMOVE_CONSOLES
   * // remove the working of console logs
   * // remove any accidental use of console logs
   */
  useEffect(() => {
    (process.env.NODE_ENV === "production" ||
     process.env.REACT_APP_ENV === "STAGING") &&
      GlobalDebug(false);
  }, []);

  return (
    <NotificationProvider>
    <Router>
      <Routes>
        {user && user.isLoggedIn ? (
          <>
            <Route
              element={
                <Layout
                  auth={user}
                  setAuth={setUser}
                  menu={menu}
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
                <Route
                path='/teamStatistics/LeadsAnalytics'
                element={<LeadAnalytics/>}
              />
              <Route
                path='/appreciation'
                element={<AppreciationBannerAdmin />}
              />
              <Route
                path ='/teamStatistics/managerAnalytics'
                element={<ManagerAnalytics />}
              />
                <Route
                  path ='/teamStatistics/managerIndividualAnalytics'
                  element={<ManagerTeamAnalytics/>}
                 />
                 <Route
                  path='/teamStatistics/managerAnalyticBoard'
                  element={<ManagerAnalyticBoard/>}
                 />
                  <Route
                  path='/businessAnalysis'
                  element={<OLAPDashboardTabs />}
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
    </NotificationProvider>
  );
}
