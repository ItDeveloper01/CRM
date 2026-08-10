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

        if (!query)
            return teamMembers;

        return teamMembers.filter(member =>
            member.userName.toLowerCase().includes(query.toLowerCase()) ||
            member.roleName.toLowerCase().includes(query.toLowerCase()) ||
            member.verticles.some(v =>
                v.verticleName.toLowerCase().includes(query.toLowerCase()))
        );

    }, [query, teamMembers]);

    return (

        <Combobox
            value={selectedTeamMember}
            onChange={onTeamMemberChange}
        >

            <div className="relative w-72">

                <Search
                    className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400"
                />

                <Combobox.Input
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-10 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                    displayValue={(person) =>
                        person
                            ? person.userName
                            : "All Team"
                    }
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="All Team"
                />

                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                </Combobox.Button>

                <Combobox.Options
                    className="absolute z-50 mt-2 max-h-80 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl"
                >

                    <Combobox.Option
                        value={null}
                        className="cursor-pointer px-4 py-2 hover:bg-blue-50"
                    >
                        👥 All Team
                    </Combobox.Option>

                    {filteredMembers.map(member => (

                        <Combobox.Option
                            key={member.userId}
                            value={member}
                            className={({ active }) =>
                                `cursor-pointer px-4 py-3 ${active ? "bg-blue-50" : ""}`
                            }
                        >

                            {({ selected }) => (

                                <div className="flex items-start justify-between">

                                    <div>

                                        <div className="font-medium">
                                            {member.userName}
                                        </div>

                                        <div className="text-xs text-slate-500">
                                            {member.verticles.map(v => v.verticleName).join(" • ")}
                                        </div>

                                    </div>

                                    <div className="flex items-center gap-2">

                                        <span className="text-xs text-slate-500">
                                            {member.roleName}
                                        </span>

                                        {selected && (
                                            <Check className="h-4 w-4 text-blue-600" />
                                        )}

                                    </div>

                                </div>

                            )}

                        </Combobox.Option>

                    ))}

                </Combobox.Options>

            </div>

        </Combobox>

    );

};

export default DashboardTeamSelector;