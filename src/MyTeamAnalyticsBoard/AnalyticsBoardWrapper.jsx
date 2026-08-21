import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { useGetSessionUser } from '../SessionContext';
import ManagerAnalyticBoard from "../ManagerAnlayticBoard";
import { LoadingOverlay } from "../LeadsSharedTable";
// import OperationsAnalyticBoard from "./OperationsAnalyticBoard";
// import TeleCallingAnalyticBoard from "./TeleCallingAnalyticBoard";

export default function AnalyticsBoardWrapper({
    apiUrl,
    token
}) {

    const [analyticsContext, setAnalyticsContext] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const { user: sessionUser } = useGetSessionUser();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const currentUser = sessionUser?.user;
    const [dashboardLoading, setDashboardLoading] = useState(false);

    const analyticsAPIURL = config.apiUrl + '/AnalyticsBoardWrapper/';
    const getUserAnalyticsContexURL = analyticsAPIURL + "GetUserAnalyticsContext";

    //--------------------------------------------------
    // Load user's analytics hierarchy
    //--------------------------------------------------

    useEffect(() => {

        debugger;
        loadAnalyticsContext();

    }, []);

    //--------------------------------------------------
    // API
    //--------------------------------------------------

    const loadAnalyticsContext = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                getUserAnalyticsContexURL,
                {
                    params: {
                        userId: currentUser.userId
                    },
                    headers: {
                        Authorization: `Bearer ${sessionUser.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = response.data;

            console.log(
                "Analytics Context:",
                data
            );

            setAnalyticsContext(data);

            //--------------------------------------------------
            // Automatically select default department
            //--------------------------------------------------

            const departments =
                data?.departments || [];

            if (departments.length === 1) {

                setSelectedDepartment(
                    departments[0]
                );

            }
            else if (departments.length > 1) {

                const defaultDepartment =
                    departments.find(
                        x => x.isDefaultDepartment
                    );

                setSelectedDepartment(
                    defaultDepartment ||
                    departments[0]
                );
            }

        }
        catch (error) {

            console.error(
                "Error loading analytics context:",
                error
            );

            setError(
                "Unable to load analytics information."
            );

        }
        finally {

            setLoading(false);

        }

    };

    //--------------------------------------------------
    // Loading
    //--------------------------------------------------

    if (loading) {

        return (
            <div className="w-full h-full flex items-center justify-center">

                <div className="text-sm text-slate-500">
                    Loading analytics...
                </div>

            </div>
        );

    }

    //--------------------------------------------------
    // Error
    //--------------------------------------------------

    if (error) {

        return (
            <div className="w-full h-full flex items-center justify-center">

                <div className="text-sm text-red-500">
                    {error}
                </div>

            </div>
        );

    }

    //--------------------------------------------------
    // No access
    //--------------------------------------------------

    const departments =
        analyticsContext?.departments || [];

    if (departments.length === 0) {

        return (
            <div className="w-full h-full flex items-center justify-center">

                <div className="text-sm text-slate-500">
                    You don't have access to any analytics.
                </div>

            </div>
        );

    }

    //--------------------------------------------------
    // Department change
    //--------------------------------------------------

    const handleDepartmentChange = (department) => {

        console.log(
            "Selected Department:",
            department
        );

        setSelectedDepartment(
            department
        );

    };

    //--------------------------------------------------
    // Render department analytics
    //--------------------------------------------------

    const renderDepartmentBoard = () => {

        if (!selectedDepartment)
            return null;

        switch (
        selectedDepartment.departmentName
            ?.toLowerCase()
        ) {

            case "sales":

                return (
                    <ManagerAnalyticBoard
                        department={selectedDepartment}
                        apiUrl={apiUrl}
                        token={token}
                        onLoadingChange={setDashboardLoading}
                    />
                );

            case "operations":

            // return (
            //     <OperationsAnalyticBoard
            //         department={selectedDepartment}
            //         apiUrl={apiUrl}
            //         token={token}
            //     />
            //);

            case "tele calling":

            // return (
            //     <TeleCallingAnalyticBoard
            //         department={selectedDepartment}
            //         apiUrl={apiUrl}
            //         token={token}
            //     />
            //);

            default:

                return (
                    <div className="p-4 text-sm text-slate-500">
                        Analytics board is not available for{" "}
                        {selectedDepartment.departmentName}.
                    </div>
                );
        }

    };

    //--------------------------------------------------
    // UI
    //--------------------------------------------------

    return (
        <div className="w-full h-full flex flex-col">

            <LoadingOverlay visible={dashboardLoading} />
            {/* Department Switcher */}

            {departments.length > 1 && (

                <div className="flex-shrink-0 mb-4">

                    <div className="inline-flex items-center gap-1 rounded-xl bg-slate-100 p-1">

                        {departments.map(
                            department => {

                                const isSelected =
                                    selectedDepartment?.departmentId ===
                                    department.departmentId;

                                return (

                                    <button
                                        key={
                                            department.departmentId
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleDepartmentChange(
                                                department
                                            )
                                        }
                                        className={`
                                            px-4 py-2
                                            rounded-lg
                                            text-sm
                                            font-medium
                                            transition-all
                                            ${isSelected
                                                ? "bg-white text-blue-600 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
                                            }
                                        `}
                                    >

                                        {department.departmentName}

                                    </button>

                                );

                            }
                        )}

                    </div>

                </div>

            )}

            {/* Selected Department Analytics */}

            <div className="flex-1 min-h-0">

                {renderDepartmentBoard()}

            </div>

        </div>
    );
}