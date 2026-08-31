import { Combobox } from "@headlessui/react";
import {
    Check,
    ChevronDown,
    Search
} from "lucide-react";
import {
    useEffect,
    useMemo,
    useState
} from "react";
import config from "../../config";
import axios from "axios";
import { useMessageBox } from "../../Notification"; 
import { MESSAGE_TYPES, BannerMessages, ApiEndpoints } from "../../Constants";



const DashboardTeamSelector = ({
    teamMembers = [],
    selectedTeamMember,
    onTeamMemberChange,

    // NEW: parent needs to know which branch is selected AND
    // exactly which members that branch resolved to (which may
    // be an empty array) so it can tell "no branch selected" apart
    // from "branch selected but has zero members".
    onBranchChange
}) => {

    // =====================================================
    // State
    // =====================================================

    const [query, setQuery] = useState("");

    const [selectedBranch, setSelectedBranch] = useState(null);

    const [branches, setBranches] = useState([]);

  const { showMessage } = useMessageBox();

    const getBranchesPoint = config.apiUrl + '/MasterData/GetBranchList';


    // =====================================================
    // Load Branches
    // =====================================================

    useEffect(() => {

        /*
         * TEMPORARY DUMMY DATA
         *
         * Replace this section with Axios API call.
         *
         * Expected API response:
         *
         * [
         *     {
         *         branchId: 1,
         *         branchName: "Mumbai"
         *     },
         *     {
         *         branchId: 2,
         *         branchName: "Pune"
         *     }
         * ]
         */

        const dummyBranches = [
            {
                branchId: 1,
                branchName: "Mumbai"
            },
            {
                branchId: 2,
                branchName: "Pune"
            },
            {
                branchId: 3,
                branchName: "Delhi"
            },
            {
                branchId: 4,
                branchName: "Bangalore"
            }
        ];



        const fetchBranches = async () => {
            try {
                const branches = await axios.get(getBranchesPoint, {
                    // headers: {
                    //   Authorization: `Bearer ${sessionUser.token}`,
                    // }
                })
                //setTravelClass(branches.data || []);

                setBranches(branches.data);
                console.log("Branches Fected: ",branches);
            } catch (error) {
                console.error("Error fetching Branches :", error);
                showMessage({
                    type: MESSAGE_TYPES.ERROR,
                    message: "Error fetching Branches data.",
                });
            };
        }
        fetchBranches();




        /*
         * =================================================
         * FUTURE AXIOS CALL
         * =================================================
         *
         * Example:
         *
         * const loadBranches = async () => {
         *
         *     try {
         *
         *         const response = await axios.get(
         *             `${config.apiUrl}/Branch/GetBranches`
         *         );
         *
         *         setBranches(response.data || []);
         *
         *     } catch (error) {
         *
         *         console.error(
         *             "Error loading branches:",
         *             error
         *         );
         *
         *         setBranches([]);
         *     }
         * };
         *
         * loadBranches();
         *
         */

    }, []);


    // =====================================================
    // Members scoped to the selected branch (query NOT applied
    // here — this is the "ground truth" list the parent needs,
    // independent of whatever the user is currently typing in
    // the search box)
    // =====================================================

    const branchMembers = useMemo(() => {

        const members = Array.isArray(teamMembers)
            ? teamMembers
            : [];

        return selectedBranch
            ? members.filter(member =>
              member.branchId === selectedBranch.id
            )
            : members;

    }, [
        teamMembers,
        selectedBranch
    ]);


    // =====================================================
    // Filter Team Members (branch scope + search query, for
    // rendering the dropdown itself)
    // =====================================================

    const filteredMembers = useMemo(() => {

        if (!query.trim()) {
            return branchMembers;
        }

        const search = query.toLowerCase();

        return branchMembers.filter(member =>
            (member.userName || "")
                .toLowerCase()
                .includes(search) ||

            (member.roleName || "")
                .toLowerCase()
                .includes(search)
        );

    }, [
        query,
        branchMembers
    ]);


    // =====================================================
    // Avatar
    // =====================================================

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


    // =====================================================
    // Branch Change
    // =====================================================

    const handleBranchChange = (branch) => {

        console.log("Selected Branch : " , branch);

        setSelectedBranch(branch);

        // Clear search
        setQuery("");

        // Clear selected team member
        if (onTeamMemberChange) {
            onTeamMemberChange(null);
        }

        // Tell the parent which branch is now active AND exactly
        // which members it resolved to (could be []). The parent
        // must use this — not just "selectedTeamMember === null" —
        // to decide what to show. An empty array here means
        // "this branch has nobody", not "no filter applied".
        if (onBranchChange) {

            const members = Array.isArray(teamMembers)
                ? teamMembers
                : [];

            const resolvedMembers = branch
                ? members.filter(member =>
                    member.branchId === branch.id
                )
                : members;

            onBranchChange(branch, resolvedMembers);
        }
    };


    // =====================================================
    // Render
    // =====================================================

    return (

        <div className="flex items-center gap-2">


            {/* =================================================
                BRANCH SELECTOR
            ================================================= */}

            <Combobox
                value={selectedBranch}
                onChange={handleBranchChange}
            >

                <div className="relative w-48">


                    {/* Branch Button */}

                    <Combobox.Button
                        className="
                            flex
                            h-9
                            w-full
                            items-center
                            justify-between
                            rounded-lg
                            border
                            border-slate-200
                            bg-white
                            px-3
                            text-sm
                            shadow-sm
                            focus:border-blue-500
                            focus:outline-none
                        "
                    >

                        <span
                            className={
                                selectedBranch
                                    ? "text-slate-700"
                                    : "text-slate-400"
                            }
                        >
                            {selectedBranch?.branchName ||
                                "All Branches"}
                        </span>

                        <ChevronDown
                            className="
                                h-4
                                w-4
                                text-slate-400
                            "
                        />

                    </Combobox.Button>


                    {/* Branch Dropdown */}

                    <Combobox.Options
                        className="
                            absolute
                            z-50
                            mt-2
                            max-h-72
                            w-full
                            overflow-auto
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            py-1
                            shadow-xl
                        "
                    >


                        {/* -----------------------------------------
                            All Branches
                        ----------------------------------------- */}

                        <Combobox.Option
                            value={null}
                            className={({ active }) =>
                                `
                                    cursor-pointer
                                    px-3
                                    py-2.5
                                    text-sm
                                    ${active
                                    ? "bg-blue-50"
                                    : ""
                                }
                                `
                            }
                        >

                            {({ selected }) => (

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >

                                    <span
                                        className="
                                            font-medium
                                            text-slate-600
                                        "
                                    >
                                        All Branches
                                    </span>

                                    {selected && (

                                        <Check
                                            className="
                                                h-4
                                                w-4
                                                text-blue-600
                                            "
                                        />

                                    )}

                                </div>

                            )}

                        </Combobox.Option>


                        {/* -----------------------------------------
                            Branches
                        ----------------------------------------- */}

                        {branches.map(branch => (

                            <Combobox.Option
                                key={branch.id}
                                value={branch}
                                className={({ active }) =>
                                    `
                                        cursor-pointer
                                        px-3
                                        py-2.5
                                        text-sm
                                        ${active
                                        ? "bg-blue-50"
                                        : ""
                                    }
                                    `
                                }
                            >

                                {({ selected }) => (

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                        "
                                    >

                                        <span
                                            className="
                                                text-slate-700
                                            "
                                        >
                                            {branch.branchName}
                                        </span>

                                        {selected && (

                                            <Check
                                                className="
                                                    h-4
                                                    w-4
                                                    text-blue-600
                                                "
                                            />

                                        )}

                                    </div>

                                )}

                            </Combobox.Option>

                        ))}

                    </Combobox.Options>

                </div>

            </Combobox>


            {/* =================================================
                TEAM MEMBER SELECTOR
            ================================================= */}

            <Combobox
                value={selectedTeamMember}
                onChange={onTeamMemberChange}
            >

                <div className="relative w-72">


                    {/* Search Icon */}

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


                    {/* Team Search Input */}

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
                        placeholder={
                            selectedBranch && branchMembers.length === 0
                                ? "No team members"
                                : "All Team"
                        }
                    />


                    {/* Dropdown Arrow */}

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
                            className="
                                h-4
                                w-4
                                text-slate-400
                            "
                        />

                    </Combobox.Button>


                    {/* Team Dropdown */}

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


                        {/* -----------------------------------------
                            All Team
                            (hidden when the selected branch has zero
                            members — "All Team" would be meaningless
                            and misleading here)
                        ----------------------------------------- */}

                        {branchMembers.length > 0 && (

                            <Combobox.Option
                                value={null}
                                className={({ active }) =>
                                    `
                                        cursor-pointer
                                        px-3
                                        py-2
                                        text-sm
                                        ${active
                                        ? "bg-blue-50"
                                        : ""
                                    }
                                    `
                                }
                            >

                                {({ selected }) => (

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >

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

                                            <span
                                                className="
                                                    font-medium
                                                    text-slate-600
                                                "
                                            >
                                                All Team
                                            </span>

                                        </div>


                                        {selected && (

                                            <Check
                                                className="
                                                    h-4
                                                    w-4
                                                    text-blue-600
                                                "
                                            />

                                        )}

                                    </div>

                                )}

                            </Combobox.Option>

                        )}


                        {/* -----------------------------------------
                            Team Members
                        ----------------------------------------- */}

                        {filteredMembers.map(member => (

                            <Combobox.Option
                                key={member.userId}
                                value={member}
                                className={({ active }) =>
                                    `
                                        cursor-pointer
                                        px-3
                                        py-2.5
                                        ${active
                                        ? "bg-blue-50"
                                        : ""
                                    }
                                    `
                                }
                            >

                                {({ selected }) => (

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >

                                        {/* Photo */}

                                        {renderAvatar(member)}


                                        {/* Name + Role */}

                                        <div
                                            className="
                                                min-w-0
                                                flex-1
                                            "
                                        >

                                            <div
                                                className="
                                                    truncate
                                                    text-sm
                                                    font-medium
                                                    text-slate-700
                                                "
                                            >
                                                {member.userName}
                                            </div>

                                            <div
                                                className="
                                                    truncate
                                                    text-xs
                                                    text-slate-400
                                                "
                                            >
                                                {member.roleName ||
                                                    "No Role"}
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


                        {/* -----------------------------------------
                            No Results
                        ----------------------------------------- */}

                        {filteredMembers.length === 0 && (

                            <div
                                className="
                                    px-4
                                    py-3
                                    text-sm
                                    text-slate-400
                                "
                            >
                                {selectedBranch
                                    ? "This branch has no team members"
                                    : "No team members found"}
                            </div>

                        )}

                    </Combobox.Options>

                </div>

            </Combobox>

        </div>
    );
};

export default DashboardTeamSelector;
