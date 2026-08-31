import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import { useGetSessionUser } from "../../SessionContext";
import { MESSAGE_TYPES } from '../../Constants';
import { useMessageBox } from "../../Notification";
import LeadsTableForExistingPhone from "../../LeadsTableForExistingPhone";

const SalesSearchResultsBoard = ({
    selectedResult,
    department,
    category,
    currentUser,
    setGlobalDashboardLoading,
    onBack
}) => {

    // =========================================================
    // STATE
    // =========================================================

    const [record, setRecord] = useState(null);

    const [fullResults, setFullResults] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState(null);

    const { user: sessionUser } = useGetSessionUser();

    const { showMessage } = useMessageBox();

    const [existingCustomerLeads, setExistingCustomerLeads] = useState([]);

    // =========================================================
    // API
    // =========================================================

    const GetLeadDetailsForSelectedCustomerAPI = config.apiUrl + "/TempLead/GetLeadDetailsForExistingCustomer/";

    const SEARCHAPIURL =
        config.apiUrl + "/SalesDashboard/";

    const GetLeadDetail =
        SEARCHAPIURL + "GetLeadDetail";

    const SearchLeads =
        SEARCHAPIURL + "SearchLeads";


    // =========================================================
    // DUMMY DATA
    // (stand-ins until backend endpoints are ready)
    // =========================================================

    const DUMMY_RECORD = {
        leadId: 1042,
        customerName: "Priya Sharma",
        phone: "9894512345",
        status: "Follow-up",
        priority: "High",
        destination: "Bali",
        leadType: "FIT",
        tripType: "International",
        executive: "Rahul",
        followUpDate: "2026-08-24",
        createdDate: "2026-08-18",
        notes: "Requested honeymoon package, waiting on passport copy"
    };

    const DUMMY_FULL_RESULTS = [

        {
            leadId: 1042,
            customerName: "Priya Sharma",
            phone: "9894512345",
            status: "Follow-up",
            executive: "Rahul",
            followUpDate: "2026-08-24"
        },

        {
            leadId: 1078,
            customerName: "Priyanka Iyer",
            phone: "9894598765",
            status: "Open",
            executive: "Sneha",
            followUpDate: "2026-08-25"
        },

        {
            leadId: 1103,
            customerName: "ABC Travels (Priyank contact)",
            phone: "9894511111",
            status: "Quote Sent",
            executive: "Rahul",
            followUpDate: "2026-08-26"
        }

    ];


    // =========================================================
    // FETCH DETAIL / RESULTS
    // =========================================================

    const fetchDetail = async () => {

        try {
            console.log("Fetching search result for:", selectedResult);

            setIsLoading(true);
            setError(null);
            setGlobalDashboardLoading?.(true);



            // -------------------------------------------------
            // CASE 1: Specific lead picked from the dropdown
            // -------------------------------------------------

            if (selectedResult?.leadId) {

                // -----------------------------------------
                // REAL API CALL (uncomment when backend is ready)
                // -----------------------------------------
                /*
                const response = await axios.get(
                    GetLeadDetail,
                    {
                        params: {
                            leadId: selectedResult.leadId
                        },
                        headers: {
                            Authorization: `Bearer ${currentUser?.token}`
                        }
                    }
                );

                setRecord(response.data);
                */

                try {
                    const res = await axios.get(GetLeadDetailsForSelectedCustomerAPI, {
                        headers: {
                            Authorization: `Bearer ${sessionUser.token}`, // ✅ JWT token
                            "Content-Type": "application/json"
                        },
                        params: {
                            currentUser: sessionUser.user.userId,
                            leadId: selectedResult.leadId

                        }
                    });

                    console.log("Fetching Customer Lead details:", res.data);

                    // if (res.data && res.data.length > 0) {
                    //     if (value != null) {
                    //         showMessage(
                    //             "Duplicate mobile number found. Please check the existing leads.",
                    //             MESSAGE_TYPES.warning
                    //         );
                    //     }
                    //     console.log("Duplicate mobile number found. Leads:", res.data);
                    //     setISLeadsForPhoneVisible(true);
                    //     setLeadsForPhoneNumber(res.data);
                    // } else {
                    //    setISLeadsForPhoneVisible(false);
                    //}

                    setRecord(res.data);

                    setExistingCustomerLeads(res.data);

                    setIsLoading(false);
                    setError(null);
                    setGlobalDashboardLoading?.(false);

                } catch (error) {
                    console.error("Error checking duplicate mobile number:", error);
                    showMessage(
                        "Something went wrong while fetching Lead Details. Please try again.",
                        MESSAGE_TYPES.error
                    );
                } finally {
                    // setIsScreenLocked(false);
                }



                // -----------------------------------------
                // DUMMY DATA (remove once real call is live)
                // -----------------------------------------

                await new Promise(resolve => setTimeout(resolve, 400)); // simulate latency

                //setRecord(DUMMY_RECORD);
                setFullResults([]);

            }

            // -------------------------------------------------
            // CASE 2: Enter / "View all results" — no specific
            // lead picked yet, run the full search
            // -------------------------------------------------

            else if (selectedResult?.query) {

                // -----------------------------------------
                // REAL API CALL (uncomment when backend is ready)
                // -----------------------------------------
                /*
                const response = await axios.get(
                    SearchLeads,
                    {
                        params: {
                            query: selectedResult.query,
                            departmentId: department?.departmentId,
                            verticalId: category?.verticalId,
                            fullResults: true
                        },
                        headers: {
                            Authorization: `Bearer ${currentUser?.token}`
                        }
                    }
                );
            
                setFullResults(response.data?.results || []);
                */

                // -----------------------------------------
                // DUMMY DATA (remove once real call is live)
                // -----------------------------------------

                await new Promise(resolve => setTimeout(resolve, 400)); // simulate latency

                setFullResults(DUMMY_FULL_RESULTS);
                setRecord(null);

            }

        }
        catch (err) {

            console.error(
                "Error loading search result:",
                err
            );

            setError("Failed to load search results");

        }
        finally {

            setIsLoading(false);
            setGlobalDashboardLoading?.(false);

        }

    };


    useEffect(() => {

        if (selectedResult) {
            fetchDetail();
        }

    }, [selectedResult]);


    // =========================================================
    // UI
    // =========================================================

    return (
        // <div className="p-4 space-y-3">

        //     {/* =================================================
        //         BACK + HEADER
        //     ================================================= */}

        //     <div className="flex items-center gap-3">

        //         <button
        //             onClick={onBack}
        //             className="
        //                 flex items-center gap-1
        //                 text-sm text-slate-500
        //                 hover:text-slate-800
        //             "
        //         >
        //             <svg
        //                 className="h-4 w-4"
        //                 fill="none"
        //                 viewBox="0 0 24 24"
        //                 stroke="currentColor"
        //             >
        //                 <path
        //                     strokeLinecap="round"
        //                     strokeLinejoin="round"
        //                     strokeWidth={2}
        //                     d="M15 19l-7-7 7-7"
        //                 />
        //             </svg>
        //             Back to Dashboard
        //         </button>

        //         {selectedResult?.query && (
        //             <div className="text-sm text-slate-400">
        //                 Results for <span className="font-medium text-slate-700">"{selectedResult.query}"</span>
        //                 {!isLoading && fullResults.length > 0 && ` — ${fullResults.length} found`}
        //             </div>
        //         )}

        //     </div>


        //     {/* =================================================
        //         LOADING / ERROR
        //     ================================================= */}

        //     {isLoading && (
        //         <div className="text-sm text-slate-400 py-8 text-center">
        //             Loading...
        //         </div>
        //     )}

        //     {!isLoading && error && (
        //         <div className="text-sm text-red-500 py-8 text-center">
        //             {error}
        //         </div>
        //     )}


        //     {/* =================================================
        //         SINGLE RECORD VIEW
        //         (user picked an exact row from the dropdown)
        //     ================================================= */}

        //     {!isLoading && !error && record && (

        //         <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">

        //             <div className="flex items-start justify-between">

        //                 <div>
        //                     <div className="text-lg font-semibold text-slate-800">
        //                         {record.customerName}
        //                     </div>
        //                     <div className="text-sm text-slate-400">
        //                         {record.phone} • Lead #{record.leadId}
        //                     </div>
        //                 </div>

        //                 <span
        //                     className="
        //                         text-xs font-medium
        //                         px-2.5 py-1 rounded-full
        //                         bg-blue-50 text-blue-600
        //                     "
        //                 >
        //                     {record.status}
        //                 </span>

        //             </div>

        //             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">

        //                 <div>
        //                     <div className="text-slate-400 text-xs">Priority</div>
        //                     <div className="text-slate-700 font-medium">{record.priority}</div>
        //                 </div>

        //                 <div>
        //                     <div className="text-slate-400 text-xs">Destination</div>
        //                     <div className="text-slate-700 font-medium">{record.destination}</div>
        //                 </div>

        //                 <div>
        //                     <div className="text-slate-400 text-xs">Type</div>
        //                     <div className="text-slate-700 font-medium">{record.leadType} • {record.tripType}</div>
        //                 </div>

        //                 <div>
        //                     <div className="text-slate-400 text-xs">Executive</div>
        //                     <div className="text-slate-700 font-medium">{record.executive}</div>
        //                 </div>

        //                 <div>
        //                     <div className="text-slate-400 text-xs">Follow-up Date</div>
        //                     <div className="text-slate-700 font-medium">{record.followUpDate}</div>
        //                 </div>

        //                 <div>
        //                     <div className="text-slate-400 text-xs">Created</div>
        //                     <div className="text-slate-700 font-medium">{record.createdDate}</div>
        //                 </div>

        //             </div>

        //             {record.notes && (

        //                 <div className="pt-2 border-t border-slate-100">
        //                     <div className="text-slate-400 text-xs mb-1">Notes</div>
        //                     <div className="text-sm text-slate-600">{record.notes}</div>
        //                 </div>

        //             )}

        //         </div>

        //     )}


        //     {/* =================================================
        //         MULTI-RESULT LIST VIEW
        //         ("View all results" from search bar)
        //     ================================================= */}

        //     {!isLoading && !error && fullResults.length > 0 && (

        //         <div className="bg-white border border-slate-200 rounded-xl shadow-sm divide-y divide-slate-100">

        //             {fullResults.map((lead) => (

        //                 <div
        //                     key={lead.leadId}
        //                     onClick={() => {
        //                         // Drill from list-view into single-record view
        //                         setRecord({ ...DUMMY_RECORD, ...lead });
        //                         setFullResults([]);
        //                     }}
        //                     className="
        //                         flex items-center justify-between
        //                         px-4 py-3
        //                         hover:bg-slate-50
        //                         cursor-pointer
        //                     "
        //                 >

        //                     <div>
        //                         <div className="text-sm font-medium text-slate-700">
        //                             {lead.customerName}
        //                         </div>
        //                         <div className="text-xs text-slate-400">
        //                             {lead.phone} • Lead #{lead.leadId}
        //                             {lead.status ? ` • ${lead.status}` : ""}
        //                         </div>
        //                     </div>

        //                     <span className="text-xs text-slate-300">
        //                         {lead.followUpDate || ""}
        //                     </span>

        //                 </div>

        //             ))}

        //         </div>

        //     )}


        //     {/* =================================================
        //         EMPTY STATE
        //     ================================================= */}

        //     {!isLoading && !error && !record && fullResults.length === 0 && (

        //         <div className="text-sm text-slate-400 py-8 text-center">
        //             No matches found
        //         </div>

        //     )}

        // </div>

        <div className="p-4 space-y-3">

            {/* =================================================
        BACK + HEADER
    ================================================= */}

            <div className="flex items-center gap-3">

                <button
                    onClick={onBack}
                    className="
                flex items-center gap-1
                text-sm text-slate-500
                hover:text-slate-800
            "
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>

                    Back to Dashboard
                </button>

                {selectedResult?.query && (
                    <div className="text-sm text-slate-400">
                        Results for{" "}
                        <span className="font-medium text-slate-700">
                            "{selectedResult.query}"
                        </span>

                        {!isLoading &&
                            existingCustomerLeads?.length > 0 &&
                            ` — ${existingCustomerLeads.length} found`}
                    </div>
                )}

            </div>


            {/* =================================================
                    LOADING
                ================================================= */}

            {isLoading && (
                <div className="text-sm text-slate-400 py-8 text-center">
                    Loading...
                </div>
            )}


            {/* =================================================
                    ERROR
                ================================================= */}

            {!isLoading && error && (
                <div className="text-sm text-red-500 py-8 text-center">
                    {error}
                </div>
            )}


            {/* =================================================
                    EXISTING CUSTOMER LEADS
                ================================================= */}

            {!isLoading &&
                !error &&
                existingCustomerLeads?.length > 0 && (

                    <LeadsTableForExistingPhone
                        followLeads={existingCustomerLeads}
                    />

                )}


            {/* =================================================
                    EMPTY STATE
                ================================================= */}

            {!isLoading &&
                !error &&
                (!existingCustomerLeads ||
                    existingCustomerLeads.length === 0) && (

                    <div className="
                            rounded-xl
                            border border-slate-200
                            bg-white
                            py-10
                            text-center
                            shadow-sm
                        ">
                        <div className="text-2xl mb-2">
                            🔍
                        </div>

                        <div className="text-sm font-medium text-slate-600">
                            No existing leads found
                        </div>

                        <div className="mt-1 text-xs text-slate-400">
                            This customer does not have any existing leads.
                        </div>
                    </div>

                )}

        </div>
    );

};

export default SalesSearchResultsBoard;