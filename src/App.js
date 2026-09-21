import React, {
  useEffect
} from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Leads from './Leads';
import Login from './Login';
import Layout from './Layout';
import NewCustomerInfo from './NewCustomerInfo';
import Users from './Users';
import LeadsGeneration from './LeadsGeneration';
import UserCreate from './UserCreate';
import AdminRoute from './AdminRoute';
import UserDashboardTemp from './UserDashboardTemp';
import LeadsUpdateForms from "./LeadsUpdateForms";
import { useGetSessionUser } from "./SessionContext";
import ProfileDisplay from './ProfileDisplay';
import SMTPForm from './SMTPForm';
import LeadAnalytics from './LeadAnalytics';

import { NotificationProvider } from "./Notification";

import { GlobalDebug } from './Remove-Console';
import AppreciationBannerAdmin from './AppreciationBannerAdmin';
import ManagerAnalytics from './ManagerAnalytics';
import ManagerTeamAnalytics from './ManagerTeamAnalytics';
import ManagerAnalyticBoard from './ManagerAnlayticBoard';
import OLAPDashboardTabs from './OLAPScreens/OLAPDashboardTabs';
import SignalRService from './SignalRService';

import DashboardWrapper from './Dashboard/DashboardCommonComponents/DashboardWrapper';
import RoleMenuMapping from './RBACSystemScreens/RoleMenuMapping';

import { ContextProvider } from "./RBACSystemScreens/ContextContext";
import ContextWrapper from "./RBACSystemScreens/ContextWrapper";

import MasterSettings from './MasterSettingsBoard';
import TravelAgencyItineraryManager from './Operations/Itinerary/ItineraryManager';
import AnalyticsBoardWrapper from './MyTeamAnalyticsBoard/AnalyticsBoardWrapper';


export default function App() {

  const {
  user,
  setUser,
  menu,
} = useGetSessionUser();


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


  // =========================================================
  // 🔔 Notification for specific user
  // =========================================================

  const handleNotification = (msg) => {
    console.log("🔔 ReceiveNotification:", msg);
  };


  // =========================================================
  // 📢 Notification broadcast
  // =========================================================

  const handleNotificationForAll = (msg) => {
    console.log("📢 ReceiveNotificationForAll:", msg);
  };


  // =========================================================
  // 🗑 Delete notification
  // =========================================================

  const handleDeleteNotification = (msg) => {
    console.log("🗑 DeleteNotification:", msg);
  };


  // =========================================================
  // 👏 Appreciation received
  // =========================================================

  const handleAppreciation = (msg) => {
    console.log("👏 ReceiveAppreciation:", msg);
  };


  // =========================================================
  // 🗑 Appreciation removed
  // =========================================================

  const handleDeleteAppreciation = (msg) => {
    console.log("🗑 DeleteAppreciation:", msg);
  };


  // =========================================================
  // 📦 Lead transferred
  // =========================================================

  const handleLeadTransfer = (dto) => {
    console.log("📦 transferredleaddto:", dto);
  };


  // =========================================================
  // 🌍 REGISTER ALL HANDLERS
  // =========================================================

  const registerHandlers = () => {

    console.log("🌍 Registering global SignalR handlers");

    SignalRService.safeOn(
      "ReceiveNotification",
      handleNotification
    );

    // SignalRService.safeOn(
    //   "ReceiveNotificationForAll",
    //   handleNotificationForAll
    // );

    // SignalRService.safeOn(
    //   "DeleteNotification",
    //   handleDeleteNotification
    // );

    SignalRService.safeOn(
      "ReceiveAppreciation",
      handleAppreciation
    );

    SignalRService.safeOn(
      "DeleteAppreciation",
      handleDeleteAppreciation
    );

    SignalRService.safeOn(
      "transferredleaddto",
      handleLeadTransfer
    );
  };


  // =========================================================
  // 🛑 DEREGISTER ALL HANDLERS
  // =========================================================

  const deregisterHandlers = () => {

    console.log("🌍 Removing global SignalR handlers");

    SignalRService.safeOff(
      "ReceiveNotification",
      handleNotification
    );

    // SignalRService.safeOff(
    //   "ReceiveNotificationForAll",
    //   handleNotificationForAll
    // );

    // SignalRService.safeOff(
    //   "DeleteNotification",
    //   handleDeleteNotification
    // );

    SignalRService.safeOff(
      "ReceiveAppreciation",
      handleAppreciation
    );

    SignalRService.safeOff(
      "DeleteAppreciation",
      handleDeleteAppreciation
    );

    SignalRService.safeOff(
      "transferredleaddto",
      handleLeadTransfer
    );
  };


  // =========================================================
  // SIGNALR
  // =========================================================

  useEffect(() => {

    const startSignalR = async () => {

      try {

        await SignalRService.startConnection();

        console.log(
          "✅ SignalR started globally"
        );

      } catch (err) {

        console.error(
          "🚫 SignalR start failed",
          err
        );

      }

    };

    startSignalR();

  }, []);


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <NotificationProvider>

      {/* =====================================================
          Router
          ===================================================== */}

      <Router>

        {/* ===================================================
            IMPORTANT:
            ContextProvider MUST be INSIDE Router
            because ContextContext uses useNavigate()
            =================================================== */}

        <ContextProvider>

          <Routes>

            {/* =================================================
                AUTHENTICATED USER
                ================================================= */}

            {user && user.isLoggedIn ? (

              <>

                {/* =============================================
                    APPLICATION LAYOUT
                    ============================================= */}

                <Route
                  element={
                    <Layout
                      auth={user}
                      setAuth={setUser}
                    />
                  }
                >

                  <Route
                    path='/'
                    element={
                      <Navigate
                        to="/context"
                        replace
                      />
                    }
                  />

                  {/* =========================================
                      CONTEXT RESOLVER
                      ========================================= */}

                  <Route
                    path="/context"
                    element={<ContextWrapper />}
                  />

                  {/* =========================================
                      DASHBOARD
                      ========================================= */}

                  <Route
                    path='/dashboard'
                    element={<DashboardWrapper />}
                  />

                  <Route
  path="/access-denied"
  element={
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Access Denied
        </h1>

        <p className="mt-2 text-gray-500">
          You do not have access to any menu in this context.
        </p>
      </div>
    </div>
  }
/>


                  {/* =========================================
                      LEADS
                      ========================================= */}

                  <Route
                    path='/leads'
                    element={<Leads />}
                  />


                  {/* =========================================
                      NEW CUSTOMER
                      ========================================= */}

                  <Route
                    path='/NewCustomer'
                    element={<NewCustomerInfo />}
                  />


                  {/* =========================================
                      LEAD GENERATION
                      ========================================= */}

                  <Route
                    path='/LeadsGeneration'
                    element={<LeadsGeneration />}
                  />


                  {/* =========================================
                      UPDATE LEADS
                      ========================================= */}

                  {/*
                  <Route
                    path="/updateLeads/:id"
                    element={<LeadsUpdateForms />}
                  />
                  */}


                  {/* =========================================
                      LEAD ANALYTICS
                      ========================================= */}

                  <Route
                    path='/LeadsAnalytics'
                    element={<LeadAnalytics />}
                  />

                  <Route
                    path='/teamStatistics/LeadsAnalytics'
                    element={<LeadAnalytics />}
                  />


                  {/* =========================================
                      APPRECIATION
                      ========================================= */}

                  <Route
                    path='/appreciation'
                    element={<AppreciationBannerAdmin />}
                  />


                  {/* =========================================
                      MANAGER ANALYTICS
                      ========================================= */}

                  <Route
                    path='/teamStatistics/managerAnalytics'
                    element={<ManagerAnalytics />}
                  />

                  <Route
                    path='/teamStatistics/managerIndividualAnalytics'
                    element={<ManagerTeamAnalytics />}
                  />

                  <Route
                    path='/teamStatistics/managerAnalyticBoard'
                    element={<AnalyticsBoardWrapper />}
                  />


                  {/* =========================================
                      BUSINESS ANALYSIS
                      ========================================= */}

                  <Route
                    path='/businessAnalysis'
                    element={<OLAPDashboardTabs />}
                  />


                  {/* =========================================
                      MASTER SETTINGS
                      ========================================= */}

                  <Route
                    path='/masterSettings'
                    element={<MasterSettings />}
                  />


                  {/* =========================================
                      ITINERARY MANAGER
                      ========================================= */}

                  <Route
                    path='/operations/ItineraryManager'
                    element={<TravelAgencyItineraryManager />}
                  />


                  {/* =========================================
                      DASHBOARD V2
                      ========================================= */}

                  <Route
                    path='/DashboardV2'
                    element={<UserDashboardTemp />}
                  />


                  {/* =========================================
                      ROLE MENU MAPPING
                      ========================================= */}

                  <Route
                    path='/RBAC/RoleMenuMappings'
                    element={<RoleMenuMapping />}
                  />


                  {/* =========================================
                      USERS
                      ========================================= */}

                  <Route
                    path='/users'
                    element={
                      <AdminRoute auth={user}>
                        <Users />
                      </AdminRoute>
                    }
                  />


                  {/* =========================================
                      SMTP SETTINGS
                      ========================================= */}

                  <Route
                    path='/smtpsettings'
                    element={
                      <AdminRoute auth={user}>
                        <SMTPForm />
                      </AdminRoute>
                    }
                  />


                  {/* =========================================
                      USER CREATE
                      ========================================= */}

                  <Route
                    path='/users/create'
                    element={
                      <AdminRoute auth={user}>
                        <UserCreate />
                      </AdminRoute>
                    }
                  />


                  {/* =========================================
                      PROFILE
                      ========================================= */}

                  <Route
                    path='/ProfileDisplay'
                    element={<ProfileDisplay />}
                  />

                </Route>


                {/* =============================================
                    UNKNOWN AUTHENTICATED ROUTE
                    ============================================= */}

                {/* <Route
                  path="*"
                  element={
                    <Navigate
                      to="/context"
                      replace
                    />
                  }
                /> */}

                <Route
                  path="*"
                  element={
                    <Navigate
                      to="/context"
                      replace
                    />
                  }
                />
              </>

            ) : (

              /* =================================================
                 NOT AUTHENTICATED
                 ================================================= */

              <>

                <Route
                  path='/'
                  element={<Login setUser={setUser} />}
                />

                <Route
                  path="/updateLeads/:id"
                  element={<LeadsUpdateForms />}
                />

                <Route
                  path='*'
                  element={
                    <Navigate
                      to='/login'
                      replace
                    />
                  }
                />

                <Route
                  path="/login"
                  element={<Login />}
                />

              </>

            )}

          </Routes>

        </ContextProvider>

      </Router>

    </NotificationProvider>
  );
}
