import React from "react";

const DashboardDepartmentHeader = ({
    departments = [],
    selectedDepartment,
    onDepartmentChange,
    roleName,
    verticles = []
}) => {

    return (

        <div className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm">

            <div className="flex w-full items-center justify-between">

                {/* Left : Department Tabs */}

                <div className="flex items-center gap-2">

                    {departments.map((dept) => {

                        const active =
                            dept.departmentId === selectedDepartment;

                        return (

                            <button
                                key={dept.departmentId}
                                onClick={() => onDepartmentChange(dept.departmentId)}
                                disabled={departments.length === 1}
                                className={`
                                    rounded-lg
                                    border
                                    px-4
                                    py-2
                                    text-sm
                                    font-medium
                                    transition-all
                                    ${
                                        active
                                            ? "border-blue-600 bg-blue-600 text-white"
                                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                    }
                                    ${departments.length === 1 ? "cursor-default" : ""}
                                `}
                            >
                                {dept.departmentName}
                            </button>

                        );

                    })}

                </div>

                {/* Right : User Info */}

                <div className="flex flex-col items-end">

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">

                        {roleName}

                    </span>

                    {verticles.length > 0 && (

                        <span className="mt-1 text-xs text-slate-500">

                            {verticles.map(v => v.verticleName).join(" • ")}

                        </span>

                    )}

                </div>

            </div>

        </div>

    );

};

export default DashboardDepartmentHeader;