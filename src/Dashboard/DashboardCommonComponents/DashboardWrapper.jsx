import React, { useEffect, useState } from "react";
import axios from "axios";

import config from "../../config";
import { useGetSessionUser } from "../../SessionContext";

import SalesDashboard from "../SalesDashboard/SalesDashboard";
import DashboardDepartmentHeader from "../DashboardCommonComponents/DashboardDepartmentHeader";
import DashboardViewToggle from "../DashboardCommonComponents/DashboardViewToggle";
import AppreciationBanner from "../../AppreciationBanner";

// Future
// import OperationsDashboard from "../Operations/OperationsDashboard";
// import TeleDashboard from "../TeleCalling/TeleDashboard";

const DashboardURL = config.apiUrl + "/Dashboard/";
const getUserPermissionsMatrix = DashboardURL + "GetUserPermissionsMatrix";

const DEPARTMENT = {
    SALES: 1,
    OPERATIONS: 2,
    TELECALLING: 3
};

const DashboardWrapper = () => {

    const { user: sessionUser } = useGetSessionUser();

    const currentUser = sessionUser?.user;

    const [loading, setLoading] = useState(true);

    const [dashboardContext, setDashboardContext] = useState(null);

    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

    const [selectedView, setSelectedView] = useState("mine");

    //---------------------------------------------------
    // Load Dashboard Context
    //---------------------------------------------------

    useEffect(() => {

        const fetchDashboardContext = async () => {

            try {

                const response = await axios.post(
                    getUserPermissionsMatrix,
                    currentUser.userId,
                    {
                        headers: {
                            Authorization: `Bearer ${sessionUser.token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const data = response.data;

                console.log("Dashboard Context", data);

                setDashboardContext(data);
console.log("Departments received:", data.departments?.length, data.departments);

console.log("Dashboard Context:", data);
                setSelectedDepartmentId(
                    data.defaultDepartmentId ??
                    data.departments?.[0]?.departmentId
                );

            }
            catch (error) {

                console.error("Error loading dashboard context", error);

            }
            finally {

                setLoading(false);

            }

        };

        if (currentUser?.userId) {
            fetchDashboardContext();
        }

    }, [currentUser, sessionUser]);

    //---------------------------------------------------
    // Derived State
    //---------------------------------------------------

    const selectedDept = dashboardContext?.departments?.find(
        d => d.departmentId === selectedDepartmentId
    );

    const canViewTeam = selectedDept?.canViewTeamDashboard ?? false;

    //---------------------------------------------------
    // Handlers
    //---------------------------------------------------

    const handleDepartmentChange = (departmentId) => {

        setSelectedDepartmentId(departmentId);

        // Whenever department changes go back to My Dashboard
        setSelectedView("mine");

    };

    //---------------------------------------------------
    // Dashboard Switch
    //---------------------------------------------------

    const renderDashboard = () => {

        switch (selectedDepartmentId) {

            case DEPARTMENT.SALES:

                return (

                    <SalesDashboard
                        department={selectedDept}
                        currentUser={dashboardContext}
                        viewMode={selectedView}
                        canViewTeam={canViewTeam}
                        onViewChange={setSelectedView}
                    />

                );

            // case DEPARTMENT.OPERATIONS:
            //     return (
            //         <OperationsDashboard
            //             department={selectedDept}
            //             currentUser={dashboardContext}
            //             viewMode={selectedView}
            //         />
            //     );

            // case DEPARTMENT.TELECALLING:
            //     return (
            //         <TeleDashboard
            //             department={selectedDept}
            //             currentUser={dashboardContext}
            //             viewMode={selectedView}
            //         />
            //     );

            default:

                return (

                    <div className="flex h-[80vh] items-center justify-center text-slate-500">

                        No dashboard available.

                    </div>

                );

        }

    };

    //---------------------------------------------------
    // Loading
    //---------------------------------------------------

    if (loading) {

        return (

            <div className="flex h-screen items-center justify-center">

                Loading Dashboard...

            </div>

        );

    }

    //---------------------------------------------------
    // UI
    //---------------------------------------------------

    return (

        <div className="flex min-h-full flex-col bg-slate-100">

            <div className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">

                <div className="flex items-center justify-between px-4 py-2">

                    <DashboardDepartmentHeader
                        departments={dashboardContext?.departments || []}
                        selectedDepartment={selectedDepartmentId}
                        onDepartmentChange={handleDepartmentChange}
                        userName={dashboardContext?.userName}
                        roleName={selectedDept?.roleName}
                        verticles={selectedDept?.verticles || []}
                    />

                    {/* {canViewTeam && (

                        <DashboardViewToggle
                            canViewTeamDashboard={canViewTeam}
                            viewMode={selectedView}
                            setViewMode={setSelectedView}
                        />

                    )} */}

                </div>

            </div>

            <div className="px-4 pt-3">

                <AppreciationBanner />

            </div>

            {renderDashboard()}

        </div>

    );

};

export default DashboardWrapper;