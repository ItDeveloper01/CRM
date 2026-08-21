import React from "react";

const DashboardDepartmentHeader = ({
    departments = [],
    selectedDepartment,
    onDepartmentChange,

    selectedVertical,
    onVerticalChange,

    roleName,
    verticles = [],
    categories = []
}) => {

    return (

        <div className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm">

            <div className="flex w-full items-center justify-between">

                {/* =================================================
                    LEFT : Department + Category Tabs
                ================================================= */}

                <div className="flex items-center gap-2">

                    {/* ---------------------------------------------
                        Department Tabs
                    --------------------------------------------- */}

                    {departments.map((dept) => {

                        const active =
                            dept.departmentId === selectedDepartment;

                        return (

                            <button
                                key={dept.departmentId}
                                onClick={() =>
                                    onDepartmentChange(
                                        dept.departmentId
                                    )
                                }
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
                                    ${
                                        departments.length === 1
                                            ? "cursor-default"
                                            : ""
                                    }
                                `}
                            >
                                {dept.departmentName}
                            </button>

                        );

                    })}

                    {/* ---------------------------------------------
                        Separator
                    --------------------------------------------- */}

                    {categories.length > 0 && (

                        <div className="mx-1 h-6 w-px bg-slate-200" />

                    )}

                    {/* ---------------------------------------------
                        Category / Vertical Tabs
                    --------------------------------------------- */}

                    {categories.map((category) => {

                        const active =
                            category.verticalId ===
                            selectedVertical;

                        return (

                            <button
                                key={category.verticalId}
                                onClick={() =>
                                    onVerticalChange(
                                        category.verticalId
                                    )
                                }
                                className={`
                                    rounded-lg
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-medium
                                    transition-all
                                    ${
                                        active
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                    }
                                `}
                            >
                                {category.verticalName}
                            </button>

                        );

                    })}

                </div>


                {/* =================================================
                    RIGHT : User Info
                ================================================= */}

                <div className="flex flex-col items-end">

                    {/* Role */}

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">

                        {roleName}

                    </span>


                    {/* User's allotted categories */}

                    {verticles.length > 0 && (

                        <span className="mt-1 text-xs text-slate-500">

                            {verticles
                                .map(v => v.verticleName)
                                .join(" • ")}

                        </span>

                    )}

                </div>

            </div>

        </div>

    );

};

export default DashboardDepartmentHeader;