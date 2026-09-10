import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useGetSessionUser } from "./SessionContext";
import axios from "axios";
import {
    Trash2
} from "lucide-react";

/* =========================================================
   TEMPORARY DUMMY ROLES
   Later these can come from RoleMaster / API
   ========================================================= */

const DUMMY_EXECUTIVE_ROLES = [
    {
        id: 9001,
        roleName: "CEO",
        contextTypeId: 1
    },
    {
        id: 9002,
        roleName: "COO",
        contextTypeId: 1
    },
    {
        id: 9003,
        roleName: "Director",
        contextTypeId: 1
    },
    {
        id: 9004,
        roleName: "VP",
        contextTypeId: 1
    }
];

const DUMMY_ADMINISTRATIVE_ROLES = [
    {
        id: 9101,
        roleName: "Super Admin",
        contextTypeId: 3
    },
    {
        id: 9102,
        roleName: "System Admin",
        contextTypeId: 3
    },
    {
        id: 9103,
        roleName: "Admin",
        contextTypeId: 3
    }
];


export default function DepartmentAssignmentCard({
    index,
    assignment,
    onChange,
    onDelete,

    contextList,
    departments,
    verticals,
    roles,

    apiUrl,
    token
}) {

    const [managerList, setManagerList] = useState([]);

    const { user: sessionUser } = useGetSessionUser();


    /* =========================================================
       CONTEXT LIST
       ========================================================= */

    const activeContexts = Array.isArray(contextList)
        ? contextList
            .filter(x => x?.isActive)
            .sort(
                (a, b) =>
                    (a?.displayOrder ?? 999) -
                    (b?.displayOrder ?? 999)
            )
        : [];


    /* =========================================================
       SELECTED CONTEXT
       ========================================================= */

    const selectedContext = activeContexts.find(
        x =>
            Number(x.id) ===
            Number(assignment?.contextTypeId)
    );


    const contextName =
        selectedContext?.contextName
            ?.trim()
            ?.toLowerCase() || "";


    const isFunctional =
        contextName === "functional";

    const isExecutive =
        contextName === "executive";

    const isAdministrative =
        contextName === "administrative";


    /* =========================================================
       FILTER VERTICALS BY DEPARTMENT
       
       THIS IS THE OLD BEHAVIOUR
       ========================================================= */

    const filteredVerticals = Array.isArray(verticals)
        ? verticals.filter(x => {

            return (
                Number(x.departmentId) ===
                Number(assignment?.departmentId)
            );

        })
        : [];


    /* =========================================================
       FILTER ROLES
       
       Functional:
           Department + Vertical → Roles

       Executive:
           Dummy Executive Roles

       Administrative:
           Dummy Administrative Roles
       ========================================================= */

    let availableRoles = [];


    if (isFunctional) {

        /*
         * Existing real roles.
         *
         * Your previous component displayed roles
         * from the API.
         *
         * We now additionally filter them based on
         * Department + Vertical.
         */

        availableRoles = Array.isArray(roles)
            ? roles.filter(role => {

                /*
                 * Some APIs may not yet return
                 * departmentId / verticalId on RoleMaster.
                 *
                 * In that case keep the role.
                 */

                const hasDepartment =
                    role?.departmentId !== undefined &&
                    role?.departmentId !== null;

                const hasVertical =
                    role?.verticalId !== undefined ||
                    role?.verticleId !== undefined;

                const departmentMatches =
                    !hasDepartment ||
                    Number(role.departmentId) ===
                    Number(assignment?.departmentId);

                const roleVerticalId =
                    role?.verticalId ??
                    role?.verticleId;

                const verticalMatches =
                    !hasVertical ||
                    Number(roleVerticalId) ===
                    Number(assignment?.verticalId);

                return (
                    departmentMatches &&
                    verticalMatches
                );

            })
            : [];

    } else if (isExecutive) {

        availableRoles =
            DUMMY_EXECUTIVE_ROLES;

    } else if (isAdministrative) {

        availableRoles =
            DUMMY_ADMINISTRATIVE_ROLES;

    }


    /* =========================================================
       DEBUG
       ========================================================= */

    console.log(
        "DepartmentAssignmentCard:",
        {
            index,
            contextList,
            contextName,
            isFunctional,
            isExecutive,
            isAdministrative,
            departments,
            verticals,
            filteredVerticals,
            roles,
            availableRoles,
            assignment
        }
    );


    /* =========================================================
       LOAD REPORTING MANAGERS
       ========================================================= */

    useEffect(() => {

        loadManagers();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        assignment?.contextTypeId,
        assignment?.departmentId,
        assignment?.verticalId,
        assignment?.roleId
    ]);


    const loadManagers = async () => {

        /*
         * No Context or Role
         */

        if (
            !assignment?.contextTypeId ||
            !assignment?.roleId
        ) {

            setManagerList([]);

            return;
        }


        /*
         * Functional requires:
         *
         * Context
         * Department
         * Vertical
         * Role
         */

        if (
            isFunctional &&
            (
                !assignment?.departmentId ||
                !assignment?.verticalId
            )
        ) {

            setManagerList([]);

            return;
        }


        try {

            const response = await axios.get(
                `${apiUrl}/Users/GetManagerList`,
                {

                    params: {

                        contextTypeId:
                            Number(
                                assignment.contextTypeId
                            ),

                        departmentId:
                            isFunctional
                                ? Number(
                                    assignment.departmentId
                                )
                                : 0,

                        /*
                         * Keep your existing backend spelling.
                         */
                        verticleId:
                            isFunctional
                                ? Number(
                                    assignment.verticalId
                                )
                                : 0,

                        roleId:
                            Number(
                                assignment.roleId
                            )
                    },

                    headers: {

                        Authorization:
                            `Bearer ${sessionUser?.token ||
                            token ||
                            ""
                            }`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


            console.log(
                "Fetched managers:",
                response.data
            );


            setManagerList(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Error fetching managers:",
                error
            );

            setManagerList([]);

        }

    };


    /* =========================================================
       GENERIC FIELD UPDATE
       ========================================================= */

    const updateField = (
        field,
        value
    ) => {

        const updatedAssignment = {

            ...assignment,

            [field]: value

        };

        console.log(
            "Field:",
            field
        );

        console.log(
            "Value:",
            value
        );

        console.log(
            "Updated Assignment:",
            updatedAssignment
        );

        onChange(
            updatedAssignment
        );

    };


    /* =========================================================
       CONTEXT CHANGE
       
       Context changes:
       Department
       Vertical
       Role
       Managers
       
       ALL RESET
       ========================================================= */

    const handleContextChange = e => {

        const contextTypeId =
            Number(e.target.value) || 0;


        onChange({

            ...assignment,

            contextTypeId,

            departmentId: 0,

            verticalId: 0,

            roleId: 0,

            reportingManagerIds: []

        });


        setManagerList([]);

    };


    /* =========================================================
       DEPARTMENT CHANGE
       
       Department changes:
       Vertical RESET
       Role RESET
       Manager RESET
       
       This restores old behaviour.
       ========================================================= */

    const handleDepartmentChange = e => {

        debugger;

        console.log("Is Department Change.");
        console.log("Department List: ", departments);
        console.log("Selected Department: ", e.target.value);
        console.log("IsFunctional Flag :", isFunctional);
        console.log("IsExecutive Flag :", isExecutive);

        const departmentId =
            Number(e.target.value) || 0;


        onChange({

            ...assignment,

            departmentId,

            verticalId: 0,

            roleId: 0,

            reportingManagerIds: []

        });


        setManagerList([]);

    };


    /* =========================================================
       VERTICAL CHANGE
       
       Vertical changes:
       Role RESET
       Manager RESET
       ========================================================= */

    const handleVerticalChange = e => {

        debugger;
        const verticalId =
            Number(e.target.value) || 0;


        onChange({

            ...assignment,

            verticalId,

            roleId: 0,

            reportingManagerIds: []

        });


        setManagerList([]);

    };


    /* =========================================================
       ROLE CHANGE
       ========================================================= */

    const handleRoleChange = e => {

        const roleId =
            Number(e.target.value) || 0;


        onChange({

            ...assignment,

            roleId,

            reportingManagerIds: []

        });


        setManagerList([]);

    };


    /* =========================================================
       MANAGER CHANGE
       ========================================================= */

    const handleManagerChange = (
        event,
        newValue
    ) => {

        updateField(
            "reportingManagerIds",
            newValue.map(
                x => x.userId
            )
        );

    };


    /* =========================================================
       SELECTED MANAGERS
       ========================================================= */

    const selectedManagers =
        managerList.filter(
            manager =>
                (
                    assignment?.reportingManagerIds ||
                    []
                ).includes(
                    manager.userId
                )
        );


    /* =========================================================
       RENDER
       ========================================================= */

    return (

        <div
            className="
                relative
                mb-4
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                pt-5
                pb-4
                shadow-sm
                transition-all
                hover:border-blue-300
                hover:shadow-md
            "
        >

            {/* =================================================
                ASSIGNMENT LABEL
               ================================================= */}

            <div className="absolute -top-3 left-4">

                <span
                    className="
                        rounded-full
                        border
                        border-blue-200
                        bg-white
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-blue-700
                        shadow-sm
                    "
                >
                    Assignment {index + 1}
                </span>

            </div>


            <div
                className="
                    grid
                    grid-cols-12
                    items-end
                    gap-3
                "
            >


                {/* =================================================
                    CONTEXT
                   ================================================= */}

                <div className="col-span-2">

                    <label
                        className="
                            mb-1
                            block
                            text-xs
                            font-semibold
                            text-slate-600
                        "
                    >

                        Context

                        <span className="text-red-500">
                            {" "}*
                        </span>

                    </label>


                    <select
                        value={
                            assignment?.contextTypeId || ""
                        }

                        onChange={
                            handleContextChange
                        }

                        className="
                            w-full
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-3
                            py-2
                            text-sm
                            text-slate-700
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    >

                        <option value="">
                            Select Context
                        </option>


                        {activeContexts.map(
                            context => (

                                <option
                                    key={context.id}
                                    value={context.id}
                                >

                                    {
                                        context.contextName
                                    }

                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* =================================================
                    DEPARTMENT
                   ================================================= */}

                <div className="col-span-2">

                    <label
                        className="
                            mb-1
                            block
                            text-xs
                            font-semibold
                            text-slate-600
                        "
                    >
                        Department
                    </label>


                    <select
                        value={
                            assignment?.departmentId || ""
                        }

                        onChange={
                            handleDepartmentChange
                        }

                        disabled={
                            !isFunctional
                        }

                        className={`
                            w-full
                            rounded-lg
                            border
                            px-3
                            py-2
                            text-sm
                            outline-none
                            transition

                            ${!isFunctional
                                ? `
                                        cursor-not-allowed
                                        border-slate-200
                                        bg-slate-100
                                        text-slate-400
                                      `
                                : `
                                        border-slate-300
                                        bg-white
                                        text-slate-700
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                      `
                            }
                        `}
                    >

                        <option value="">

                            {
                                isFunctional
                                    ? "Select Department"
                                    : "Not Applicable"
                            }

                        </option>


                        {isFunctional &&
                            (departments || [])
                                .map(
                                    department => (

                                        <option
                                            key={
                                                department.id
                                            }

                                            value={
                                                department.id
                                            }
                                        >

                                            {
                                                department.departmentName
                                            }

                                        </option>

                                    )
                                )}

                    </select>

                </div>


                {/* =================================================
                    VERTICAL
                   ================================================= */}

                <div className="col-span-2">

                    <label
                        className="
                            mb-1
                            block
                            text-xs
                            font-semibold
                            text-slate-600
                        "
                    >
                        Vertical
                    </label>


                    <select

                        value={
                            assignment?.verticalId || ""
                        }

                        onChange={
                            handleVerticalChange
                        }

                        disabled={
                            !isFunctional ||
                            !assignment?.departmentId ||
                            filteredVerticals.length === 0
                        }

                        className={`
                            w-full
                            rounded-lg
                            border
                            px-3
                            py-2
                            text-sm
                            outline-none
                            transition

                            ${!isFunctional ||
                                !assignment?.departmentId ||
                                filteredVerticals.length === 0
                                ? `
                                        cursor-not-allowed
                                        border-slate-200
                                        bg-slate-100
                                        text-slate-400
                                      `
                                : `
                                        border-slate-300
                                        bg-white
                                        text-slate-700
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                      `
                            }
                        `}
                    >

                        <option value="">

                            {
                                !isFunctional
                                    ? "Not Applicable"
                                    : !assignment?.departmentId
                                        ? "🔒 Select Department"
                                        : filteredVerticals.length === 0
                                            ? "No Verticals"
                                            : "Select Vertical"
                            }

                        </option>


                        {isFunctional &&
                            filteredVerticals.map(
                                vertical => (

                                    <option
                                        key={
                                            vertical.id
                                        }

                                        value={
                                            vertical.id
                                        }
                                    >

                                        {
                                            vertical.category ||
                                            vertical.verticleName ||
                                            vertical.verticalName ||
                                            vertical.name
                                        }

                                    </option>

                                )
                            )}

                    </select>

                </div>


                {/* =================================================
                    ROLE
                   ================================================= */}

                <div className="col-span-2">

                    <label
                        className="
                            mb-1
                            block
                            text-xs
                            font-semibold
                            text-slate-600
                        "
                    >

                        Role

                        <span className="text-red-500">
                            {" "}*
                        </span>

                    </label>


                    <select

                        value={
                            assignment?.roleId || ""
                        }

                        onChange={
                            handleRoleChange
                        }

                        disabled={
                            !assignment?.contextTypeId ||
                            (
                                isFunctional &&
                                (
                                    !assignment?.departmentId ||
                                    !assignment?.verticalId
                                )
                            )
                        }

                        className={`
                            w-full
                            rounded-lg
                            border
                            px-3
                            py-2
                            text-sm
                            outline-none
                            transition

                            ${!assignment?.contextTypeId ||
                                (
                                    isFunctional &&
                                    (
                                        !assignment?.departmentId ||
                                        !assignment?.verticalId
                                    )
                                )
                                ? `
                                        cursor-not-allowed
                                        border-slate-200
                                        bg-slate-100
                                        text-slate-400
                                      `
                                : `
                                        border-slate-300
                                        bg-white
                                        text-slate-700
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                      `
                            }
                        `}
                    >

                        <option value="">
                            Select Role
                        </option>


                        {availableRoles.map(
                            role => (

                                <option
                                    key={role.id}
                                    value={role.id}
                                >

                                    {
                                        role.roleName ||
                                        role.name
                                    }

                                </option>

                            )
                        )}

                    </select>


                    {/* Optional helpful message */}

                    {isFunctional &&
                        Number(assignment?.departmentId) > 0 &&
                        Number(assignment?.verticalId) > 0 &&
                        availableRoles.length === 0 && (
                            <div className="mt-1 text-[10px] text-red-500">
                                No roles available for this Department / Vertical
                            </div>
                        )}

                </div>


                {/* =================================================
                    REPORTING MANAGER
                   ================================================= */}

                <div className="col-span-2">

                    <label
                        className="
                            mb-1
                            block
                            text-xs
                            font-semibold
                            text-slate-600
                        "
                    >
                        Reporting Manager
                    </label>


                    <Autocomplete

                        multiple

                        size="small"

                        options={managerList}

                        disableCloseOnSelect

                        value={
                            selectedManagers
                        }

                        onChange={
                            handleManagerChange
                        }

                        getOptionLabel={
                            option =>
                                `${option.firstName ?? ""} ${option.lastName ?? ""
                                    }`.trim()
                        }

                        isOptionEqualToValue={
                            (option, value) =>
                                Number(
                                    option.userId
                                ) ===
                                Number(
                                    value.userId
                                )
                        }

                        disabled={
                            !assignment?.roleId
                        }

                        renderOption={(
                            props,
                            option,
                            { selected }
                        ) => {

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
                                        flex
                                        items-center
                                        gap-3
                                        px-3
                                        py-2
                                        rounded-lg
                                        transition-colors

                                        ${selected
                                            ? "bg-blue-50 hover:bg-blue-100"
                                            : "hover:bg-slate-100"
                                        }
                                    `}
                                >

                                    {/* Name + Role */}

                                    <div
                                        className="
                                            flex
                                            flex-col
                                            flex-1
                                        "
                                    >

                                        <span
                                            className="
                                                text-sm
                                                font-medium
                                                text-slate-800
                                            "
                                        >

                                            {
                                                option.firstName
                                            }{" "}

                                            {
                                                option.lastName
                                            }

                                        </span>


                                        <span
                                            className="
                                                text-xs
                                                text-slate-500
                                            "
                                        >

                                            {
                                                option.roleName
                                            }

                                        </span>

                                    </div>


                                    {/* Photo */}

                                    <div
                                        className="
                                            flex-shrink-0
                                        "
                                    >

                                        {image ? (

                                            <img
                                                src={image}
                                                alt={
                                                    option.firstName
                                                }
                                                className="
                                                    w-14
                                                    h-14
                                                    rounded-full
                                                    object-cover
                                                    border
                                                    border-slate-300
                                                "
                                            />

                                        ) : (

                                            <img
                                                src={
                                                    option.gender ===
                                                        "Female"
                                                        ? "/images/avatar-female.png"
                                                        : "/images/avatar-male.png"
                                                }

                                                alt="avatar"

                                                className="
                                                    w-14
                                                    h-14
                                                    rounded-full
                                                    border
                                                    border-slate-300
                                                "
                                            />

                                        )}

                                    </div>


                                    {/* Tick */}

                                    <div
                                        className="
                                            w-6
                                            flex
                                            justify-center
                                        "
                                    >

                                        <span
                                            className={`
                                                text-blue-600
                                                font-bold
                                                text-lg
                                                transition-opacity

                                                ${selected
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                }
                                            `}
                                        >
                                            ✓
                                        </span>

                                    </div>

                                </li>

                            );

                        }}


                        renderTags={
                            value => {

                                if (
                                    value.length === 0
                                ) {
                                    return null;
                                }


                                const MAX_CHARS = 32;

                                let text = "";

                                let shown = 0;


                                for (
                                    const manager
                                    of value
                                ) {

                                    const name =
                                        `${manager.firstName} ${manager.lastName}`;


                                    const candidate =
                                        text === ""
                                            ? name
                                            : `${text}, ${name}`;


                                    if (
                                        candidate.length >
                                        MAX_CHARS
                                    ) {
                                        break;
                                    }


                                    text =
                                        candidate;

                                    shown++;

                                }


                                const remaining =
                                    value.length -
                                    shown;


                                return (

                                    <span
                                        className="
                                            text-sm
                                            text-slate-700
                                            truncate
                                            block
                                        "

                                        title={
                                            value
                                                .map(
                                                    x =>
                                                        `${x.firstName} ${x.lastName}`
                                                )
                                                .join(", ")
                                        }
                                    >

                                        {text}

                                        {remaining > 0 &&
                                            ` +${remaining}`}

                                    </span>

                                );

                            }
                        }


                        renderInput={
                            params => (

                                <TextField
                                    {...params}

                                    placeholder={
                                        (
                                            assignment
                                                ?.reportingManagerIds
                                                ?.length ||
                                            0
                                        ) === 0
                                            ? "Select Reporting Managers"
                                            : ""
                                    }

                                    variant="outlined"
                                />

                            )
                        }


                        sx={{

                            "& .MuiOutlinedInput-root": {

                                borderRadius:
                                    "0.75rem",

                                backgroundColor:
                                    "#fff",

                                minHeight: 42,

                                fontSize:
                                    "0.875rem",

                                "& fieldset": {

                                    borderColor:
                                        "#CBD5E1"

                                },

                                "&:hover fieldset": {

                                    borderColor:
                                        "#94A3B8"

                                },

                                "&.Mui-focused fieldset": {

                                    borderColor:
                                        "#3B82F6"

                                }

                            },

                            "& input": {

                                padding:
                                    "4px 0 !important"

                            },

                            "& .MuiAutocomplete-endAdornment": {

                                right: 8

                            },

                            "& .MuiChip-root": {

                                display:
                                    "none"

                            }

                        }}

                    />

                </div>


                {/* =================================================
                    ACTIONS
                   ================================================= */}

                <div
                    className="
                        col-span-2
                        flex
                        items-center
                        justify-end
                        gap-3
                        pb-1
                    "
                >

                    {/* Default */}

                    <label
                        className="
                            flex
                            cursor-pointer
                            items-center
                            gap-2
                            text-xs
                            font-medium
                            text-slate-600
                        "
                    >

                        <input
                            type="radio"

                            name="defaultAssignment"

                            checked={
                                assignment?.isDefaultView ===
                                true
                            }

                            onChange={() =>
                                updateField(
                                    "isDefaultView",
                                    true
                                )
                            }

                            className="
                                h-4
                                w-4
                            "
                        />

                        Default

                    </label>


                    {/* Delete */}

                    <button
                        type="button"

                        onClick={() =>
                            onDelete(index)
                        }

                        className="
                            flex
                            items-center
                            gap-1
                            rounded-lg
                            border
                            border-red-200
                            bg-white
                            px-2.5
                            py-2
                            text-xs
                            font-medium
                            text-red-600
                            transition
                            hover:border-red-300
                            hover:bg-red-50
                        "
                    >

                        <Trash2
                            size={14}
                        />

                        Remove

                    </button>

                </div>

            </div>


            {/* =================================================
                CONTEXT INDICATOR
               ================================================= */}

            {assignment?.contextTypeId > 0 && (

                <div
                    className="
                        mt-3
                        flex
                        items-center
                        gap-2
                        border-t
                        border-slate-200
                        pt-2
                        text-[11px]
                        text-slate-500
                    "
                >

                    <span>
                        Current context:
                    </span>


                    <span
                        className="
                            rounded-full
                            bg-blue-50
                            px-2
                            py-0.5
                            font-semibold
                            text-blue-700
                        "
                    >

                        {
                            selectedContext?.contextName ||
                            "Unknown"
                        }

                    </span>


                    {isExecutive && (

                        <span>
                            Executive roles are currently
                            using temporary dummy data.
                        </span>

                    )}


                    {isAdministrative && (

                        <span>
                            Administrative roles are currently
                            using temporary dummy data.
                        </span>

                    )}

                </div>

            )}

        </div>

    );

}