import React, { useEffect, useState } from "react";
import axios from "axios";

import config from "../../config";
import { useGetSessionUser } from "../../SessionContext";

import SalesDashboard from "../SalesDashboard/SalesDashboard";
import DashboardDepartmentHeader from "../DashboardCommonComponents/DashboardDepartmentHeader";
import AppreciationBanner from "../../AppreciationBanner";
import { LoadingOverlay } from "../../LeadsSharedTable";

// Future
// import OperationsDashboard from "../Operations/OperationsDashboard";
// import TeleDashboard from "../TeleCalling/TeleDashboard";

const DashboardURL = config.apiUrl + "/Dashboard/";
const getUserPermissionsMatrix =
    DashboardURL + "GetUserPermissionsMatrix";

const DEPARTMENT = {
    SALES: 1,
    OPERATIONS: 2,
    TELECALLING: 3
};

const DashboardWrapper = () => {

    const { user: sessionUser } = useGetSessionUser();

    const currentUser = sessionUser?.user;

    const [loading, setLoading] = useState(true);

    const [dashboardContext, setDashboardContext] =
        useState(null);

        const [isDashboardLoading, setIsDashboardLoading] = useState(false);
    //---------------------------------------------------
    // Selected Department
    //---------------------------------------------------

    const [selectedDepartmentId, setSelectedDepartmentId] =
        useState(null);

    //---------------------------------------------------
    // Selected Category / Vertical
    //---------------------------------------------------

    const [selectedVerticalId, setSelectedVerticalId] =
        useState(null);

    //---------------------------------------------------
    // Load Dashboard Context
    //---------------------------------------------------

    useEffect(() => {

        const fetchDashboardContext = async () => {

            try {

                setLoading(true);

                const response = await axios.post(
                    getUserPermissionsMatrix,
                    currentUser.userId,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${sessionUser.token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const data = response.data;

                console.log(
                    "Dashboard Context:",
                    data
                );

                setDashboardContext(data);

                //---------------------------------------------------
                // Select Default Department
                //---------------------------------------------------

                const defaultDepartment =
                    data.departments?.find(
                        d => d.isDefault
                    ) ||
                    data.departments?.[0];

                if (defaultDepartment) {

                    setSelectedDepartmentId(
                        defaultDepartment.departmentId
                    );

                    //---------------------------------------------------
                    // Select Default Category
                    //---------------------------------------------------

                    const defaultCategory =
                        defaultDepartment.categories?.find(
                            c => c.isDefault
                        ) ||
                        defaultDepartment.categories?.[0];

                    if (defaultCategory) {

                        setSelectedVerticalId(
                            defaultCategory.verticalId
                        );

                    }

                }

            }
            catch (error) {

                console.error(
                    "Error loading dashboard context:",
                    error
                );

            }
            finally {

                setLoading(false);

            }

        };

        if (
            currentUser?.userId &&
            sessionUser?.token
        ) {

            fetchDashboardContext();

        }

    }, [
        currentUser?.userId,
        sessionUser?.token
    ]);

    //---------------------------------------------------
    // Selected Department
    //---------------------------------------------------

    const selectedDepartment =
        dashboardContext?.departments?.find(
            d =>
                d.departmentId ===
                selectedDepartmentId
        );

    //---------------------------------------------------
    // Selected Category
    //---------------------------------------------------

    const selectedCategory =
        selectedDepartment?.categories?.find(
            c =>
                c.verticalId ===
                selectedVerticalId
        );

    //---------------------------------------------------
    // Department Change
    //---------------------------------------------------

    const handleDepartmentChange = (
        departmentId
    ) => {

        setSelectedDepartmentId(
            departmentId
        );

        //---------------------------------------------------
        // When department changes,
        // automatically select its default category
        //---------------------------------------------------

        const department =
            dashboardContext?.departments?.find(
                d =>
                    d.departmentId ===
                    departmentId
            );

        const defaultCategory =
            department?.categories?.find(
                c => c.isDefault
            ) ||
            department?.categories?.[0];

        if (defaultCategory) {

            setSelectedVerticalId(
                defaultCategory.verticalId
            );

        }
        else {

            setSelectedVerticalId(null);

        }

    };

    //---------------------------------------------------
    // Category Change
    //---------------------------------------------------

    const handleCategoryChange = (
        verticalId
    ) => {

        setSelectedVerticalId(
            verticalId
        );

    };

    //---------------------------------------------------
    // Dashboard Resolver
    //
    // Currently:
    // ALL Sales categories use SalesDashboard.
    //
    // Later we can make this category-specific.
    //---------------------------------------------------

    const getDashboardComponent = (
        department,
        category
    ) => {

        switch (department?.departmentId) {

            case DEPARTMENT.SALES:

                // Currently all Sales categories
                // use the same dashboard.

                return SalesDashboard;

            case DEPARTMENT.OPERATIONS:

                // Future
                // return OperationsDashboard;

                return null;

            case DEPARTMENT.TELECALLING:

                // Future
                // return TeleDashboard;

                return null;

            default:

                return null;
        }

    };

    //---------------------------------------------------
    // Render Dashboard
    //---------------------------------------------------

    const renderDashboard = () => {

        if (!selectedDepartment) {

            return (
                <div className="flex h-[80vh] items-center justify-center text-slate-500">
                    No department available.
                </div>
            );

        }

        if (!selectedCategory) {

            return (
                <div className="flex h-[80vh] items-center justify-center text-slate-500">
                    No category available.
                </div>
            );

        }

        const DashboardComponent =
            getDashboardComponent(
                selectedDepartment,
                selectedCategory
            );

        if (!DashboardComponent) {

            return (
                <div className="flex h-[80vh] items-center justify-center text-slate-500">
                    No dashboard available.
                </div>
            );

        }

        return (
            <DashboardComponent
                department={selectedDepartment}
                category={selectedCategory}
                currentUser={dashboardContext}
                  setGlobalDashboardLoading={setIsDashboardLoading}
            />
        );

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

              <LoadingOverlay visible={isDashboardLoading} />

            {/* ------------------------------------------------
                Dashboard Header
            ------------------------------------------------ */}

            <div className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">

                <div className="flex items-center justify-between px-4 py-2">

                    <DashboardDepartmentHeader
                        departments={
                            dashboardContext?.departments || []
                        }

                        selectedDepartment={
                            selectedDepartmentId
                        }

                        onDepartmentChange={
                            handleDepartmentChange
                        }

                        selectedVertical={
                            selectedVerticalId
                        }

                        onVerticalChange={
                            handleCategoryChange
                        }

                        userName={
                            dashboardContext?.userName
                        }

                        roleName={
                            selectedCategory?.roleName || ""
                        }

                        categories={
                            selectedDepartment?.categories || []
                        }
                        
                        setDashboardLoading={setIsDashboardLoading}
                    />

                </div>

            </div>

            {/* ------------------------------------------------
                Appreciation Banner
            ------------------------------------------------ */}

            <div className="px-4 pt-3">

                <AppreciationBanner />

            </div>

            {/* ------------------------------------------------
                Dashboard
            ------------------------------------------------ */}

            {renderDashboard()}

        </div>

    );

};

export default DashboardWrapper;