import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import config from "../../config";
import { useGetSessionUser } from "../../SessionContext";

import SalesDashboard from "../SalesDashboard/SalesDashboard";

import DashboardDepartmentHeader from "../DashboardCommonComponents/DashboardDepartmentHeader";

import AppreciationBanner from "../../AppreciationBanner";
import { LoadingOverlay } from "../../LeadsSharedTable";
import DashboardSearchBarWrapper from "./DashboardSearchWrapper";
import SalesSearchResultsBoard from "./SalesSearchResultBoard";

// Future
// import OperationsDashboard from "../Operations/OperationsDashboard";
// import OperationsSearchResultsBoard from "../Operations/OperationsSearchResultsBoard";
// import TeleDashboard from "../TeleCalling/TeleDashboard";
// import TeleSearchResultsBoard from "../TeleCalling/TeleSearchResultsBoard";

const DashboardURL = config.apiUrl + "/Dashboard/";
const getUserPermissionsMatrix =
    DashboardURL + "GetUserPermissionsMatrix";

const DEPARTMENT = {
    SALES: 1,
    OPERATIONS: 2,
    TELECALLING: 3
};

// ---------------------------------------------------
// Per-department search config
// Each department can point at its own search endpoint
// and its own results-board component.
// ---------------------------------------------------

const SEARCH_CONFIG = {

    [DEPARTMENT.SALES]: {
        searchUrl: config.apiUrl + "/LeadSearch/Search",
        ResultsBoard: SalesSearchResultsBoard
    },

    [DEPARTMENT.OPERATIONS]: {
        searchUrl: config.apiUrl + "/OperationsDashboard/SearchRecords",
        ResultsBoard: null // future
    },

    [DEPARTMENT.TELECALLING]: {
        searchUrl: config.apiUrl + "/TelecallingDashboard/SearchRecords",
        ResultsBoard: null // future
    }

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
    // VIEW MODE: "dashboard" | "search"
    //---------------------------------------------------

    const [viewMode, setViewMode] = useState("dashboard");

    const [selectedSearchResult, setSelectedSearchResult] =
        useState(null);


    // const [viewMode, setViewMode] = useState("search"); // temp for testing
    // const [selectedSearchResult, setSelectedSearchResult] = useState({ leadId: 1042 }); // temp

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

        // Switching department always drops back to
        // that department's dashboard, not a stale search view
        setViewMode("dashboard");
        setSelectedSearchResult(null);

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
    // SEARCH
    //---------------------------------------------------

    // Called by DashboardSearchBarWrapper as the user types.
    // Substring matching (on name OR phone digits) happens
    // server-side — frontend just forwards the raw query.

    const searchRecords = useCallback(async (query) => {

        const activeConfig =
            SEARCH_CONFIG[selectedDepartmentId];

        if (!activeConfig?.searchUrl) {
            return [];
        }

        const response = await axios.get(
            activeConfig.searchUrl,
            {
                headers: {
                    Authorization: `Bearer ${sessionUser?.token}`
                },
                params: {
                    query,
                    departmentId: selectedDepartmentId,
                    verticalId: selectedVerticalId
                }
            }
        );

        console.log("SEARCH QUERY:", query);
        console.log("SEARCH RESPONSE:", response.data);
        console.log("SEARCH RESULTS:", response.data?.results);


        return response.data?.results || [];

    }, [selectedDepartmentId, selectedVerticalId, sessionUser?.token]);


    // User picked a row from the dropdown
    // -> switch into that department's search-results screen

    const handleSelectSearchResult = (result) => {

        setSelectedSearchResult(result);
        setViewMode("search");

    };


    // Back button on the results screen

    const handleBackToDashboard = () => {

        setViewMode("dashboard");
        setSelectedSearchResult(null);

    };


    //---------------------------------------------------
    // Search Results Board Resolver
    // (mirrors getDashboardComponent's pattern)
    //---------------------------------------------------

    const getSearchResultsComponent = (departmentId) => {

        return SEARCH_CONFIG[departmentId]?.ResultsBoard || null;

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
    // Render Search Results
    //---------------------------------------------------

    const renderSearchResults = () => {

        const ResultsBoard =
            getSearchResultsComponent(selectedDepartmentId);

        if (!ResultsBoard) {

            return (
                <div className="flex h-[80vh] flex-col items-center justify-center gap-3 text-slate-500">
                    <div>Search results view not available for this department yet.</div>
                    <button
                        onClick={handleBackToDashboard}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Back to Dashboard
                    </button>
                </div>
            );

        }

        return (
            <ResultsBoard
                selectedResult={selectedSearchResult}
                department={selectedDepartment}
                category={selectedCategory}
                currentUser={dashboardContext}
                setGlobalDashboardLoading={setIsDashboardLoading}
                onBack={handleBackToDashboard}
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

                <div className="flex items-center justify-between gap-3 px-4 py-2">

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

                    {/* SEARCH BAR */}
                    <DashboardSearchBarWrapper
                        placeholder="Search by name or phone"
                        onSearch={searchRecords}
                        onSelectResult={handleSelectSearchResult}
                        onSubmitSearch={(query) => {
                            // Enter/"view all" with no specific row picked yet —
                            // still routes to the results board, just without
                            // a pre-selected record. Board can run its own
                            // full search using the query.
                            setSelectedSearchResult({ query });
                            setViewMode("search");
                        }}
                    />

                </div>

            </div>

            {/* ------------------------------------------------
                Appreciation Banner — only on dashboard view
            ------------------------------------------------ */}

            {viewMode === "dashboard" && (

                <div className="px-1 pt-1">

                    <AppreciationBanner />

                </div>

            )}

            {/* ------------------------------------------------
                Content: Dashboard OR Search Results
            ------------------------------------------------ */}

            {viewMode === "dashboard"
                ? renderDashboard()
                : renderSearchResults()}

        </div>

    );

};

export default DashboardWrapper;