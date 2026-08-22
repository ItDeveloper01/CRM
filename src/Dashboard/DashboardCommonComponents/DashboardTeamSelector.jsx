import { Combobox } from "@headlessui/react";
import { Check, ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

const DashboardTeamSelector = ({
    teamMembers = [],
    selectedTeamMember,
    onTeamMemberChange
}) => {

    const [query, setQuery] = useState("");

    const filteredMembers = useMemo(() => {

        const members = Array.isArray(teamMembers)
            ? teamMembers
            : [];

        if (!query.trim())
            return members;

        const search = query.toLowerCase();

        return members.filter(member =>
            (member.userName || "")
                .toLowerCase()
                .includes(search) ||

            (member.roleName || "")
                .toLowerCase()
                .includes(search)
        );

    }, [query, teamMembers]);


    //---------------------------------------------------
    // Avatar
    //---------------------------------------------------

    const renderAvatar = (member) => {

        if (member?.photoBase64) {

            return (
                <img
                    src={
                        member.photoBase64.startsWith("data:")
                            ? member.photoBase64
                            : `data:image/jpeg;base64,${member.photoBase64}`
                    }
                    alt={member.userName || ""}
                    className="
                        h-8
                        w-8
                        shrink-0
                        rounded-full
                        object-cover
                        border
                        border-slate-200
                    "
                />
            );

        }

        // Empty placeholder
        return (
            <div
                className="
                    h-8
                    w-8
                    shrink-0
                    rounded-full
                    border
                    border-slate-200
                    bg-slate-100
                "
            />
        );
    };


    return (

        <Combobox
            value={selectedTeamMember}
            onChange={onTeamMemberChange}
        >

            <div className="relative w-72">

                {/* Search icon */}

                <Search
                    className="
                        pointer-events-none
                        absolute
                        left-3
                        top-1/2
                        z-10
                        h-4
                        w-4
                        -translate-y-1/2
                        text-slate-400
                    "
                />

                <Combobox.Input
                    className="
                        w-full
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        pt-1.5
                        pb-1
                        pl-9
                        pr-10
                        text-sm
                        shadow-sm
                        focus:border-blue-500
                        focus:outline-none
                    "
                    displayValue={(member) =>
                        member?.userName || ""
                    }
                    onChange={(e) =>
                        setQuery(e.target.value)
                    }
                    placeholder="All Team"
                />

                {/* Dropdown arrow */}

                <Combobox.Button
                    className="
                        absolute
                        inset-y-0
                        right-0
                        flex
                        items-center
                        pr-3
                    "
                >
                    <ChevronDown
                        className="h-4 w-4 text-slate-400"
                    />
                </Combobox.Button>


                {/* Dropdown */}

                <Combobox.Options
                    className="
                        absolute
                        z-50
                        mt-2
                        max-h-80
                        w-full
                        overflow-auto
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        shadow-xl
                    "
                >

                    {/* All Team */}

                    <Combobox.Option
                        value={null}
                        className={({ active }) =>
                            `
                                cursor-pointer
                                px-3
                                py-2
                                text-sm
                                ${
                                    active
                                        ? "bg-blue-50"
                                        : ""
                                }
                            `
                        }
                    >

                        {({ selected }) => (

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-2">

                                    <div
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-slate-100
                                            text-sm
                                        "
                                    >
                                        👥
                                    </div>

                                    <span className="font-medium text-slate-600">
                                        All Team
                                    </span>

                                </div>

                                {selected && (
                                    <Check
                                        className="h-4 w-4 text-blue-600"
                                    />
                                )}

                            </div>

                        )}

                    </Combobox.Option>


                    {/* Team Members */}

                    {filteredMembers.map(member => (

                        <Combobox.Option
                            key={member.userId}
                            value={member}
                            className={({ active }) =>
                                `
                                    cursor-pointer
                                    px-3
                                    py-2.5
                                    ${
                                        active
                                            ? "bg-blue-50"
                                            : ""
                                    }
                                `
                            }
                        >

                            {({ selected }) => (

                                <div className="flex items-center gap-3">

                                    {/* Photo */}

                                    {renderAvatar(member)}


                                    {/* Name + Role */}

                                    <div className="min-w-0 flex-1">

                                        <div className="truncate text-sm font-medium text-slate-700">
                                            {member.userName}
                                        </div>

                                        <div className="truncate text-xs text-slate-400">
                                            {member.roleName || "No Role"}
                                        </div>

                                    </div>


                                    {/* Selection */}

                                    {selected && (

                                        <Check
                                            className="
                                                h-4
                                                w-4
                                                shrink-0
                                                text-blue-600
                                            "
                                        />

                                    )}

                                </div>

                            )}

                        </Combobox.Option>

                    ))}


                    {/* No results */}

                    {filteredMembers.length === 0 && (

                        <div className="px-4 py-3 text-sm text-slate-400">
                            No team members found
                        </div>

                    )}

                </Combobox.Options>

            </div>

        </Combobox>

    );

};

export default DashboardTeamSelector;