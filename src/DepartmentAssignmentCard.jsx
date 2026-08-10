import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { useGetSessionUser } from './SessionContext';
import axios from "axios";
import qs from "qs";
import {
    Trash2,
    Building2,
    Briefcase,
    Users,
    UserCheck
} from "lucide-react";

export default function DepartmentAssignmentCard({
    index,

    assignment,
    onChange,
    onDelete,

    departments,
    verticals,
    roles,

    apiUrl,
    token
}) {

    const [managerList, setManagerList] = useState([]);

    useEffect(() => {

        console.log("loadManagers");
        console.log({
            departmentId: assignment.departmentId,
            verticalId: assignment.verticalId,
            roleId: assignment.roleId
        });

        loadManagers();

    }, [
        assignment.departmentId,
        assignment.verticalId,
        assignment.roleId
    ]);

   const updateField = (field, value) => {

    const updatedAssignment = {
        ...assignment,
        [field]: value
    };

    console.log("Field:", field);
    console.log("Value:", value);
    console.log("Updated Assignment:", updatedAssignment);

    onChange(updatedAssignment);
};

    const { user: sessionUser } = useGetSessionUser();

    const loadManagers = async () => {

        if (
            !assignment.departmentId ||
            !assignment.verticalId ||
            !assignment.roleId
        ) {
            setManagerList([]);
            return;
        }
        else {
            try {
                const response = await axios.get(
                    `${apiUrl}/Users/GetManagerList`,
                    {
                        params: {
                            departmentId: Number(assignment.departmentId),
                            verticleId: Number(assignment.verticalId),
                            roleId: Number(assignment.roleId)
                        },
                        headers: {
                            'Authorization': `Bearer ${sessionUser.token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log("Fetched managers:", response.data);
                setManagerList(response.data);
            }
            catch (error) {
                console.error("Error fetching managers:", error);
            }
        }

        // Dummy data for testing
        // setManagerList([
        //     {
        //         userId: 1,
        //         firstName: "John",
        //         lastName: "Smith"
        //     },
        //     {
        //         userId: 2,
        //         firstName: "Gayatri",
        //         lastName: "Manager"
        //     },
        //     {
        //         userId: 3,
        //         firstName: "Operations",
        //         lastName: "Lead"
        //     },
        //     {
        //         userId: 4,
        //         firstName: "Rahul",
        //         lastName: "Sharma"
        //     },
        //     {
        //         userId: 5,
        //         firstName: "Priya",
        //         lastName: "Patil"
        //     },
        //     {
        //         userId: 6,
        //         firstName: "Amit",
        //         lastName: "Desai"
        //     },
        //     {
        //         userId: 7,
        //         firstName: "Sneha",
        //         lastName: "Kulkarni"
        //     },
        //     {
        //         userId: 8,
        //         firstName: "Vishal",
        //         lastName: "Joshi"
        //     },
        //     {
        //         userId: 9,
        //         firstName: "Holiday",
        //         lastName: "Manager"
        //     },
        //     {
        //         userId: 10,
        //         firstName: "Visa",
        //         lastName: "Lead"
        //     }
        // ]);

    };

    // const filteredVerticals = verticals.filter(

    //     x => x.departmentId === Number(assignment.departmentId)

    // );
    const filteredVerticals = verticals.filter(x => {

        console.log(
            "Comparing",
            x.departmentId,
            "with",
            assignment.departmentId
        );

        return Number(x.departmentId) === Number(assignment.departmentId);

    });

    console.log("Selected Department:", assignment.departmentId);
    console.log("All Verticals:", verticals);
    console.log("Filtered Verticals:", filteredVerticals);


    return (
        <div className="relative mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 pt-5 pb-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">

            {/* Assignment Badge */}
            <div className="absolute -top-3 left-4">
                <span className="rounded-full bg-white border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                    Assignment {index + 1}
                </span>
            </div>

            <div className="grid grid-cols-12 gap-3 items-end">

                {/* Department */}

                <div className="col-span-3">

                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                        Department <span className="text-red-500">*</span>
                    </label>

                    <select
                        value={assignment.departmentId}
                        onChange={(e) =>
                            onChange({
                                ...assignment,
                                departmentId: e.target.value,
                                verticalId: 0,
                                roleId: 0,
                                reportingManagerId: []
                            })
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="">Select Department</option>

                        {departments.map(x => (
                            <option key={x.id} value={x.id}>
                                {x.departmentName}
                            </option>
                        ))}
                    </select>

                </div>

                {/* Vertical */}

                <div className="col-span-2">

                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                        Vertical <span className="text-red-500">*</span>
                    </label>

                    <select
                        value={assignment.verticalId}
                        disabled={
                            !assignment.departmentId ||
                            filteredVerticals.length === 0
                        }
                        onChange={(e) =>
                            onChange({
                                ...assignment,
                                verticalId: e.target.value,
                                reportingManagerId: []
                            })
                        }
                        className={`w-full rounded-xl border px-3 py-2 text-sm transition
                    ${!assignment.departmentId
                                ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            }`}
                    >
                        <option value="">
                            {!assignment.departmentId
                                ? "🔒 Select Department"
                                : "Select Vertical"}
                        </option>

                        {filteredVerticals.map(x => (
                            <option key={x.id} value={x.id}>
                                {x.category}
                            </option>
                        ))}
                    </select>

                </div>

                {/* Role */}

                <div className="col-span-2">

                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                        Role <span className="text-red-500">*</span>
                    </label>

                    <select
                        value={assignment.roleId}
                        onChange={(e) =>
                            onChange({
                                ...assignment,
                                roleId: e.target.value,
                                reportingManagerId: []
                            })
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="">Select Role</option>

                        {roles.map(x => (
                            <option key={x.id} value={x.id}>
                                {x.roleName}
                            </option>
                        ))}

                    </select>

                </div>

                {/* Reporting Manager */}

                <div className="col-span-3">

                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                        Reporting Manager <span className="text-red-500">*</span>
                    </label>

                    {/* <Autocomplete
                        multiple
                        size="small"
                        options={managerList}
                        disableCloseOnSelect
                        getOptionLabel={(option) =>
                            `${option.firstName} ${option.lastName} ${option.roleName ? `(${option.roleName})` : "-"}`
                        }
                        value={managerList.filter(x =>
                            (assignment.reportingManagerIds || []).includes(x.userId)
                        )}
                        onChange={(event, newValue) =>
                            updateField(
                                "reportingManagerIds",
                                newValue.map(x => x.userId)
                            )
                        }

                        renderTags={(value) => {
                            if (value.length === 0) return null;

                            if (value.length <= 2) {
                                return (
                                    <span className="text-sm text-slate-700 truncate">
                                        {value
                                            .map(x => `${x.firstName} ${x.lastName}`)
                                            .join(", ")}
                                    </span>
                                );
                            }

                            return (
                                <span className="text-sm text-slate-700 truncate">
                                    {value[0].firstName} {value[0].lastName},
                                    {" "}
                                    {value[1].firstName} {value[1].lastName}
                                    {" "}
                                    +{value.length - 2}
                                </span>
                            );
                        }}

                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Select Reporting Managers"
                                variant="outlined"
                            />
                        )}

                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "0.75rem",          // rounded-xl
                                backgroundColor: "#fff",
                                minHeight: 42,
                                fontSize: "0.875rem",
                                paddingLeft: "4px",

                                "& fieldset": {
                                    borderColor: "#CBD5E1",
                                },

                                "&:hover fieldset": {
                                    borderColor: "#94A3B8",
                                },

                                "&.Mui-focused fieldset": {
                                    borderColor: "#3B82F6",
                                    borderWidth: "1px",
                                },
                            },

                            "& input": {
                                padding: "4px 0 !important",
                            },

                            "& .MuiAutocomplete-endAdornment": {
                                right: 8,
                            },

                            "& .MuiChip-root": {
                                display: "none",   // hide chips completely
                            }
                        }}
                    /> */}

                    <Autocomplete
                        multiple
                        size="small"
                        options={managerList}
                        disableCloseOnSelect

                        getOptionLabel={(option) =>
                            `${option.firstName ?? ""} ${option.lastName ?? ""}`
                        }

                        value={managerList.filter(x =>
                            (assignment.reportingManagerIds || []).includes(x.userId)
                        )}

                        onChange={(event, newValue) =>
                            updateField(
                                "reportingManagerIds",
                                newValue.map(x => x.userId)
                            )
                        }

                        renderOption={(props, option, { selected }) => {

                            const image =
                                option.photoBase64
                                    ? `data:image/jpeg;base64,${option.photoBase64}`
                                    : option.photo
                                        ? `data:image/jpeg;base64,${option.photo}`
                                        : null;

                            return (
                                <li
                                    {...props}
                                    className={`
                flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                ${selected
                                            ? "bg-blue-50 hover:bg-blue-100"
                                            : "hover:bg-slate-100"}
            `}
                                >

                                    {/* Name + Role */}

                                    <div className="flex flex-col flex-1">

                                        <span className="text-sm font-medium text-slate-800">
                                            {option.firstName} {option.lastName}
                                        </span>

                                        <span className="text-xs text-slate-500">
                                            {option.roleName}
                                        </span>

                                    </div>

                                    {/* Photo */}

                                    <div className="flex-shrink-0">

                                        {image ? (
                                            <img
                                                src={image}
                                                alt={option.firstName}
                                                className="w-14 h-14 rounded-full object-cover border border-slate-300"
                                            />
                                        ) : (
                                            <img
                                                src={
                                                    option.gender === "Female"
                                                        ? "/images/avatar-female.png"
                                                        : "/images/avatar-male.png"
                                                }
                                                alt="avatar"
                                                className="w-14 h-14 rounded-full border border-slate-300"
                                            />
                                        )}

                                    </div>

                                    {/* Tick - fixed width so layout never moves */}

                                    <div className="w-6 flex justify-center">
                                        <span
                                            className={`text-blue-600 font-bold text-lg transition-opacity ${selected ? "opacity-100" : "opacity-0"
                                                }`}
                                        >
                                            ✓
                                        </span>
                                    </div>

                                </li>
                            );
                        }}

                        renderTags={(value) => {
                            if (value.length === 0) return null;

                            const MAX_CHARS = 32; // adjust between 30-40

                            let text = "";
                            let shown = 0;

                            for (const manager of value) {
                                const name = `${manager.firstName} ${manager.lastName}`;

                                const candidate =
                                    text === "" ? name : `${text}, ${name}`;

                                if (candidate.length > MAX_CHARS) break;

                                text = candidate;
                                shown++;
                            }

                            const remaining = value.length - shown;

                            return (
                                <span
                                    className="text-sm text-slate-700 truncate block"
                                    title={value
                                        .map(x => `${x.firstName} ${x.lastName}`)
                                        .join(", ")}
                                >
                                    {text}
                                    {remaining > 0 && ` +${remaining}`}
                                </span>
                            );
                        }}

                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder={
                                    (assignment.reportingManagerIds?.length || 0) === 0
                                        ? "Select Reporting Managers"
                                        : ""
                                }
                                variant="outlined"
                            />
                        )}

                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "0.75rem",
                                backgroundColor: "#fff",
                                minHeight: 42,
                                fontSize: "0.875rem",

                                "& fieldset": {
                                    borderColor: "#CBD5E1"
                                },

                                "&:hover fieldset": {
                                    borderColor: "#94A3B8"
                                },

                                "&.Mui-focused fieldset": {
                                    borderColor: "#3B82F6"
                                }
                            },

                            "& input": {
                                padding: "4px 0 !important"
                            },

                            "& .MuiAutocomplete-endAdornment": {
                                right: 8
                            },

                            "& .MuiChip-root": {
                                display: "none"
                            }
                        }}
                    />
                </div>

                {/* Actions */}

                <div className="col-span-2 border-l border-slate-300 pl-3">

                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                        Actions
                    </label>

                    <div className="space-y-2">

                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">

                            <input
                                type="radio"
                                name="defaultAssignment"
                                checked={assignment.isDefaultView}
                                onChange={(e) =>
                                    updateField(
                                        "isDefaultView",
                                        e.target.checked
                                    )
                                }
                            />

                            Default

                        </label>

                        <button
                            type="button"
                            onClick={onDelete}
                            className="text-sm text-red-600 hover:text-red-700 hover:underline"
                        >
                            🗑 Remove
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );

}