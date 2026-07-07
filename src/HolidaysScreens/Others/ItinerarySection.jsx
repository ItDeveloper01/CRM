import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";

import DestinationSearch from "./DestinationSearch";
import config from "../../config";
import { useGetSessionUser } from "../../SessionContext";
import UI from "./IternaryUIStyles";
import { AUDIENCE_COLORS } from "./IternaryUIStyles";

export default function ItinerarySection({
    holidayLeadObj = {},
    setHolidayLeadObj,
    isViewMode = false
}) {

    const { user: sessionUser } = useGetSessionUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const initializedRef = useRef(false);
    const [showDiscount, setShowDiscount] = useState(false);

    const [tabs, setTabs] = useState([{ id: 1 }]);

    const [activeTab, setActiveTab] = useState(0);

    const [tabState, setTabState] = useState({});

    const [audienceList, setAudienceList] = useState([]);

    const [scope, setScope] = useState("International");


    const formatDate = (date) => {

        if (!date) return "";

        return new Date(date)
            .toLocaleDateString(
                "en-GB"
            )
            .replace(/\//g, "-");

    }

    //---------------------------------------------------------
    // View Mode Helpers
    //---------------------------------------------------------

    // Wrap any state-mutating handler with this. In view mode it
    // resolves to `undefined`, so the element behaves as if it has
    // no onClick at all (no-op, no console errors).
    const guard = (fn) => (isViewMode ? undefined : fn);

    // Fail-safe id comparison: undefined/null never matches undefined/null.
    // Used everywhere we highlight a "selected" card/button, so a bad or
    // missing id field results in nothing highlighted, not everything.
    const idsMatch = (a, b) => a !== undefined && a !== null && a === b;

    //---------------------------------------------------------
    // Current Tab
    //---------------------------------------------------------

    const defaultTabState = {

        selectedDestinations: [],
        selectedMonth: "",
        selectedDate: "",
        targetAudienceId: "",
        tourCode: "",

        itineraries: [],

        itinerary: null,

        variant: null,

        pickupPoints: [],

        pickup: null,

        showDiscount: true

    };
    const current = {

        ...defaultTabState,

        ...(tabState[activeTab] || {})

    };

    //---------------------------------------------------------
    // Update Current Tab
    //---------------------------------------------------------

    const updateTabState = (tabIndex, values) => {

        setTabState(prev => ({

            ...prev,

            [tabIndex]: {

                ...prev[tabIndex],

                ...values

            }

        }));

    };

    //---------------------------------------------------------
    // Add Tab
    //---------------------------------------------------------

    const addTab = () => {

        setTabs(prev => [

            ...prev,

            {
                id: Date.now()
            }

        ]);

        setActiveTab(tabs.length);

    };

    //---------------------------------------------------------
    // Remove Tab
    //---------------------------------------------------------

    const removeTab = (index) => {

        const newTabs = tabs.filter((_, i) => i !== index);

        const newState = {};

        Object.keys(tabState).forEach(key => {

            const oldIndex = Number(key);

            if (oldIndex === index)
                return;

            const newIndex =
                oldIndex > index
                    ? oldIndex - 1
                    : oldIndex;

            newState[newIndex] =
                tabState[oldIndex];

        });

        setTabs(newTabs);

        setTabState(newState);

        setActiveTab(prev => {

            if (prev > index)
                return prev - 1;

            return Math.max(0, prev);

        });

    };

    //---------------------------------------------------------
    // Destination Helpers
    //---------------------------------------------------------

    const handleDestinationSelect = (destination) => {

        const exists =
            current.selectedDestinations.some(

                x => x.id === destination.id

            );

        if (exists)
            return;

        updateTabState(activeTab, {

            selectedDestinations: [

                ...current.selectedDestinations,

                destination

            ]

        });

    };

    const removeDestination = (id) => {

        updateTabState(activeTab, {

            selectedDestinations:

                current.selectedDestinations.filter(

                    x => x.id !== id

                )

        });

    };

    //---------------------------------------------------------
    // Pricing Helper
    //---------------------------------------------------------

    const getFinalPrice = () => {

        if (!current.variant)
            return 0;

        const base =
            Number(current.variant.perPaxBaseAmount || 0);

        const pickup =
            Number(current.pickup?.ratePerPax || 0);

        const discount =
            Number(current.variant.discountPercent || 0);

        return ((base + pickup) * (100 - discount)) / 100;

    };

    //---------------------------------------------------------
    // Fetch Audience Master
    //---------------------------------------------------------

    const fetchAudience = async () => {

        try {

            const res = await axios.get(
                config.apiUrl + "/MasterData/GetTargetAudienceMaster",
                {
                    headers: {
                        Authorization: `Bearer ${sessionUser.token}`
                    }
                }
            );

            setAudienceList(res.data);

        }
        catch (err) {

            console.error("Error loading Audience Master", err);

        }

    };

    //---------------------------------------------------------
    // Search Tours
    //---------------------------------------------------------

    const handleSearchTours = async () => {

        try {

            const filters = {

                tourCode: "",

                targetAudienceId: current.targetAudienceId || null,

                travelMonth: current.selectedMonth || null,

                departureDate: current.selectedDate || null,

                destinationIds:
                    (current.selectedDestinations || []).map(x => x.id)

            };

            const res = await axios.post(

                config.apiUrl + "/TempLead/SearchToursByDetails",

                filters,

                {

                    headers: {

                        Authorization: `Bearer ${sessionUser.token}`,

                        "Content-Type": "application/json"

                    }

                }

            );

            updateTabState(activeTab, {

                itineraries: res.data || [],

                itinerary: null,

                variant: null,

                pickupPoints: [],

                pickup: null

            });

        }
        catch (err) {

            console.error("Search failed", err);

        }

    };

    //---------------------------------------------------------
    // Search By Tour Code
    //---------------------------------------------------------

    const handleSearchToursByCode = async () => {

        try {

            const filters = {

                tourCode: current.tourCode,

                targetAudienceId: null,

                travelMonth: null,

                departureDate: null,

                destinationIds: []

            };

            const res = await axios.post(

                config.apiUrl + "/TempLead/SearchToursByDetails",

                filters,

                {

                    headers: {

                        Authorization: `Bearer ${sessionUser.token}`,

                        "Content-Type": "application/json"

                    }

                }

            );

            updateTabState(activeTab, {

                itineraries: res.data || [],

                itinerary: null,

                variant: null,

                pickupPoints: [],

                pickup: null

            });

        }
        catch (err) {

            console.error(err);

        }

    };

    //---------------------------------------------------------
    // Fetch Variant Details
    //---------------------------------------------------------

    const fetchVariantDetails = async (
        tabIndex,
        itineraryId,
        variantId
    ) => {

        try {

            const res = await axios.post(

                config.apiUrl + "/TempLead/FetchVariantDetails",

                {

                    itineraryId,

                    variantId

                },

                {

                    headers: {

                        Authorization: `Bearer ${sessionUser.token}`,

                        "Content-Type": "application/json"

                    }

                }

            );

            updateTabState(tabIndex, {

                pickupPoints:
                    res.data.pickupPoints || [],

                pickup: null

            });

        }
        catch (err) {

            console.error("Variant fetch failed", err);

        }

    };

    //---------------------------------------------------------
    // Load Tour By Code
    //---------------------------------------------------------

    const loadTourByCode = () => {

        if (!current.tourCode?.trim()) {

            alert("Please enter Tour Code");

            return;

        }

        handleSearchToursByCode();

    };

    //---------------------------------------------------------
    // Edit / View Mode Rehydration
    //---------------------------------------------------------

    // Reshapes one entry from holidayLeadObj.selectedGITItinerariesForEdit
    // into the same shape the search-result flow produces, so the rest
    // of the component (audience grouping, price calc, pickup panel)
    // doesn't need to know the difference.
    const normalizeEditEntry = (entry) => {

        const raw = entry.iternaries;

        if (!raw) return null;

        const normalizedVariants = (raw.variants || []).map(v => ({
            variantId: v.variantId,
            itineraryId: v.itineraryID,
            variantsName: v.variantsName,
            targetAudienceID: v.targetAudienceID,
            varinatAudienceName: v.varinatAudienceName || "Unassigned",
            perPaxBaseAmount: v.perPaxBaseAmount,
            discountPercent: v.discountPercent,
            startDate: v.startDate,
            endDate: v.endDate,
            startLocation: v.startLocation,
            endLocation: v.endLocation,
            totalSeats: v.totalSeats,
            occupiedSeats: v.occupiedSeats,
            status: v.status,
            pickupPoints: (v.pickupPoints || []).map(p => ({
                pickupPointId: p.pickupPointId,
                pickupPoint: p.pickupPoint,
                pickupCity: p.pickupCity,
                pickupDate: p.pickupDate,
                ratePerPax: p.pickupRatePerPax
            }))
        }));

        const normalizedItinerary = {
            itineraryId: raw.itineraryId,
            tourCode: (raw.tourCode || "").trim(),
            itName: raw.itName,
            travelScope: raw.travelScope,
            description: raw.description,
            noOfDays: raw.noOfDays,
            nights: raw.noOfDays ? raw.noOfDays - 1 : undefined,
            days: raw.noOfDays,
            status: raw.status,
            variants: normalizedVariants
        };

        const selectedVariant =
            normalizedVariants.find(v => idsMatch(v.variantId, entry.variantId)) || null;

        const selectedPickup =
            selectedVariant?.pickupPoints?.find(
                p => idsMatch(p.pickupPointId, entry.pickupPointId)
            ) || null;

        return {
            itinerary: normalizedItinerary,
            variant: selectedVariant,
            pickup: selectedPickup
        };

    };

    //---------------------------------------------------------
    // Tab Initialization
    //---------------------------------------------------------

    useEffect(() => {

        fetchAudience();

    }, []);

    // Rehydrate tabs from selectedGITItinerariesForEdit (used for both
    // edit and view modes — the flag only controls interactivity below,
    // not whether prefill happens). Runs once per lead load.
    useEffect(() => {

        if (initializedRef.current) return;

        const editList = holidayLeadObj?.selectedGITItinerariesForEdit;

        if (!editList || editList.length === 0) return;

        initializedRef.current = true;

        const newTabs = editList.map((_, i) => ({ id: Date.now() + i }));
        const newTabState = {};

        editList.forEach((entry, index) => {

            const normalized = normalizeEditEntry(entry);

            if (!normalized) return;

            newTabState[index] = {
                ...defaultTabState,
                itineraries: [normalized.itinerary],
                itinerary: normalized.itinerary,
                variant: normalized.variant,
                pickupPoints: normalized.variant?.pickupPoints || [],
                pickup: normalized.pickup,
                activeAudience: normalized.variant?.varinatAudienceName || null
            };

        });

        setTabs(newTabs);
        setTabState(newTabState);
        setActiveTab(0);

    }, [holidayLeadObj?.selectedGITItinerariesForEdit]);

    const audienceGroups = useMemo(() => {
        return Object.entries(
            (current.itinerary?.variants || []).reduce((acc, v) => {
                const key = v.varinatAudienceName || "Unassigned";

                if (!acc[key]) acc[key] = [];
                acc[key].push(v);

                return acc;
            }, {})
        );
    }, [current.itinerary?.variants]);

    const activeAudience =
        current.activeAudience || audienceGroups[0]?.[0];

    //---------------------------------------------------------
    // Update Holiday Lead Object
    //---------------------------------------------------------

    useEffect(() => {

        const selectedItineraries = tabs
            .map((_, index) => {

                const state = tabState[index];

                if (!state?.itinerary || !state?.variant)
                    return null;

                return {

                    itineraryID:
                        state.itinerary.itineraryId,

                    variantID:
                        state.variant.variantId,

                    pickupPointId:
                        state.pickup?.pickupPointId || null,

                };

            })
            .filter(Boolean);

        setHolidayLeadObj(prev => ({

            ...prev,

            selectedItineraries

        }));

    }, [tabState, tabs]);

    // Auto-select first tour when itineraries load (or change) and nothing's selected
    useEffect(() => {
        if (current.itineraries.length > 0 && !current.itinerary) {
            updateTabState(activeTab, {
                itinerary: current.itineraries[0],
                variant: null,
                pickupPoints: [],
                pickup: null,
                activeAudience: null
            });
        }
    }, [current.itineraries]);

    // Auto-select first audience tab once a tour is selected and audienceGroups is built
    useEffect(() => {
        if (current.itinerary && audienceGroups.length > 0 && !activeAudience) {
            updateTabState(activeTab, { activeAudience: audienceGroups[0][0] });
        }
    }, [current.itinerary, audienceGroups]);

    // Auto-select first departure date once an audience is active, and fetch its details
    useEffect(() => {
        if (!activeAudience || current.variant) return;

        const variantsForAudience = audienceGroups.find(([a]) => a === activeAudience)?.[1] || [];
        if (variantsForAudience.length === 0) return;

        const firstVariant = [...variantsForAudience].sort(
            (a, b) => new Date(a.startDate) - new Date(b.startDate)
        )[0];

        updateTabState(activeTab, {
            variant: firstVariant,
            pickupPoints: [],
            pickup: null
        });

        fetchVariantDetails(activeTab, current.itinerary.itineraryId, firstVariant.variantId);
    }, [activeAudience, audienceGroups]);

    // Auto-select first pickup point once pickupPoints loads from fetchVariantDetails
    useEffect(() => {
        if (current.pickupPoints.length > 0 && !current.pickup) {
            updateTabState(activeTab, { pickup: current.pickupPoints[0] });
        }
    }, [current.pickupPoints]);

    //---------------------------------------------------------
    // UI
    //---------------------------------------------------------

    return (

        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

            {/*======================================================
                            TABS
            ======================================================*/}

            <div className="flex gap-2 border-b bg-gray-50 px-3 pt-3 overflow-x-auto">

                {tabs.map((tab, index) => {

                    const state = tabState[index];

                    return (

                        <button

                            key={tab.id}

                            onClick={() => setActiveTab(index)}

                            className={`px-4 py-2 rounded-t-lg text-sm border flex items-center gap-2 whitespace-nowrap
                            ${activeTab === index
                                    ? "bg-white border-b-white font-semibold"
                                    : "bg-gray-100"
                                }`}

                        >

                            Itinerary {index + 1}

                            {state?.itinerary && (

                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>

                            )}

                            {tabs.length > 1 && !isViewMode && (

                                <span

                                    className="text-gray-400 hover:text-red-500"

                                    onClick={(e) => {

                                        e.stopPropagation();

                                        removeTab(index);

                                    }}

                                >

                                    ✕

                                </span>

                            )}

                        </button>

                    );

                })}

                {!isViewMode && (

                    <button

                        onClick={addTab}

                        className="px-3 py-2 text-blue-600 font-bold"

                    >

                        +

                    </button>

                )}

            </div>

            {/*======================================================
                        BODY
            ======================================================*/}

            <div className="p-6 space-y-6">

                {/*======================================================
                        SEARCH SECTION
                ======================================================*/}

                <div className={UI.pageCard}>

                    <div className="flex gap-5 items-start">

                        {/*=========================================
                SEARCH FILTERS
        =========================================*/}

                        <div className="flex-1">

                            <div className={`${UI.sectionCard} ${isViewMode ? "opacity-60 pointer-events-none" : ""}`}>

                                <h3 className={UI.sectionTitle}>
                                    🔍 Search by Filters
                                </h3>

                                <div className="grid grid-cols-12 gap-4 mt-4">

                                    {/* Destination */}
                                    <div className="col-span-6">

                                        <label className={UI.label}>
                                            Destination
                                        </label>

                                        <div className={UI.inputContainer}>
                                            <DestinationSearch
                                                key={`destination-${activeTab}`}
                                                scope={scope}
                                                onSelect={handleDestinationSelect}
                                            />
                                        </div>

                                    </div>

                                    {/* Target Audience */}
                                    <div className="col-span-3">

                                        <label className={UI.label}>
                                            Target Audience
                                        </label>

                                        <select
                                            className={UI.select}
                                            value={current.targetAudienceId}
                                            disabled={isViewMode}
                                            onChange={(e) =>
                                                updateTabState(activeTab, {
                                                    targetAudienceId: Number(e.target.value)
                                                })
                                            }
                                        >
                                            <option value="">All Audiences</option>

                                            {audienceList.map(a => (
                                                <option key={a.id} value={a.id}>
                                                    {a.targetAudienceName}
                                                </option>
                                            ))}

                                        </select>

                                    </div>

                                    {/* Travel Month */}
                                    <div className="col-span-3">

                                        <label className={UI.label}>
                                            Travel Month
                                        </label>

                                        <input
                                            type="month"
                                            className={UI.input}
                                            value={current.selectedMonth}
                                            disabled={isViewMode}
                                            onChange={(e) =>
                                                updateTabState(activeTab, {
                                                    selectedMonth: e.target.value
                                                })
                                            }
                                        />

                                    </div>

                                    <div className="col-span-6 mt-0 flex items-center gap-1.5 overflow-x-auto">
                                        {current.selectedDestinations.length === 0 ? (
                                            <span className="text-xs text-gray-300">No destinations selected</span>
                                        ) : (
                                            current.selectedDestinations.map((destination) => (
                                                <span
                                                    key={destination.id}
                                                    className="flex items-center gap-1 flex-shrink-0 rounded-full border border-blue-200 bg-blue-50 pl-2 pr-1 py-1 text-xs text-blue-700 whitespace-nowrap"
                                                >
                                                    📍 {destination.name}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateTabState(activeTab, {
                                                                selectedDestinations:
                                                                    current.selectedDestinations.filter(
                                                                        x => x.id !== destination.id
                                                                    )
                                                            })
                                                        }
                                                        className="text-blue-400 hover:text-blue-700 font-bold leading-none"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))
                                        )}

                                    </div>
                                    <div className="col-span-6 mt-0 flex justify-end gap-3">

                                        <button
                                            className={UI.primaryButton}
                                            onClick={handleSearchTours}
                                        >
                                            🔍 Search Tours
                                        </button>

                                        <button
                                            className={UI.secondaryButton}
                                            onClick={() =>
                                                updateTabState(activeTab, {
                                                    selectedDestinations: [],
                                                    selectedMonth: "",
                                                    selectedDate: "",
                                                    targetAudienceId: "",
                                                    itineraries: [],
                                                    itinerary: null,
                                                    variant: null,
                                                    pickupPoints: [],
                                                    pickup: null
                                                })
                                            }
                                        >
                                            ↺ Reset
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/*=========================================
                OR
        =========================================*/}

                        <div className="flex items-center justify-center py-10">

                            <div className={UI.orBadge}>
                                OR
                            </div>

                        </div>

                        {/*=========================================
                TOUR CODE
        =========================================*/}

                        <div className="w-72">

                            <div className={`${UI.sectionCard} ${isViewMode ? "opacity-60 pointer-events-none" : ""}`}>

                                <h3 className={UI.sectionTitle}>
                                    🏷 Search by Tour Code
                                </h3>

                                <label className={UI.label}>
                                    Tour Code
                                </label>

                                <input
                                    className={UI.input}
                                    value={current.tourCode}
                                    disabled={isViewMode}
                                    onChange={(e) =>
                                        updateTabState(activeTab, {
                                            tourCode: e.target.value
                                        })
                                    }
                                />

                                <button
                                    className={`${UI.darkButton} w-full mt-4`}
                                    onClick={loadTourByCode}
                                >
                                    🚀 Load Tour
                                </button>

                            </div>

                        </div>

                    </div>

                </div>


                <div className={UI.pageCard}>

                    <div className={UI.workspaceHeader}>
                        <div className="font-semibold">🌍 Tour Selection</div>
                        <div className="text-sm text-gray-500">
                            {current.itineraries.length} Tours Found
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-4 items-stretch">

                        {/* Tours */}
                        <div className="col-span-3">
                            {current.itineraries.length > 0 ? (
                                <div className={UI.tourPanel}>
                                    <div className={UI.tourHeader}>🚨 Available Tours 🚨</div>

                                    <div className={UI.tourList}>
                                        {current.itineraries.map(it => {
                                            const isSelected = idsMatch(current.itinerary?.itineraryId, it.itineraryId);
                                            return (
                                                <button
                                                    key={it.itineraryId}
                                                    type="button"
                                                    onClick={guard(() =>
                                                        updateTabState(activeTab, {
                                                            itinerary: it,
                                                            variant: null,
                                                            pickupPoints: [],
                                                            pickup: null,
                                                            activeAudience: null
                                                        })
                                                    )}
                                                    className={`${UI.tourCard} ${isSelected ? UI.tourCardSelected : UI.tourCardNormal} ${isViewMode ? "cursor-default" : ""}`}
                                                >
                                                    <div className="font-semibold text-gray-800 text-sm truncate">🌍 {it.itName}</div>
                                                    <div className="flex justify-between items-center mt-1 text-xs">
                                                        <span className="text-gray-500">🏷 {it.tourCode}</span>
                                                        <span className="text-blue-700 font-medium">{it.nights}N/{it.days}D</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className={`${UI.emptyState}  flex flex-col items-center justify-center`}>
                                    <div className="text-5xl mb-3">🔍</div>
                                    <h3 className="font-semibold">No Tours Found</h3>
                                    <p className="mt-2">Try changing the destination, travel month or audience.</p>
                                </div>
                            )}
                        </div>

                        {/* Departures */}
                        <div className="col-span-6">
                            <div className={UI.tourPanel}>
                                <h3 className={UI.tourHeader}>Available Departures</h3>

                                {/* Audience Tabs - Fixed */}
                                <div className="pb-2 border-b flex-shrink-0">
                                    <div className="p-2 flex flex-wrap gap-2">
                                        {audienceGroups.map(([audience, variants], index) => {
                                            const color = AUDIENCE_COLORS[index % AUDIENCE_COLORS.length];
                                            const selected = activeAudience === audience;
                                            return (
                                                <button
                                                    key={audience}
                                                    onClick={guard(() => updateTabState(activeTab, { activeAudience: audience }))}
                                                    className={`px-3 h-8 rounded-full border text-xs font-medium transition-all ${selected ? color.selected : color.light} ${isViewMode ? "cursor-default" : ""}`}
                                                >
                                                    {audience}
                                                    <span className="ml-1.5 text-[10px] opacity-80">{variants.length}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Departure Dates - capped at ~5 rows visible, rest scrolls */}
                                <div className="flex-1 min-h-0 overflow-y-auto pt-3 px-2 pb-2">
                                    <div className="flex flex-wrap gap-2 content-start">
                                        {(audienceGroups.find(([a]) => a === activeAudience)?.[1] || [])
                                            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                                            .map((variant) => {
                                                const audienceIndex = audienceGroups.findIndex(([a]) => a === activeAudience);
                                                const color = AUDIENCE_COLORS[audienceIndex % AUDIENCE_COLORS.length];
                                                const selected = idsMatch(current.variant?.variantId, variant.variantId);
                                                return (
                                                    <button
                                                        key={variant.variantId}
                                                        onClick={guard(async () => {
                                                            updateTabState(activeTab, { variant, pickupPoints: [], pickup: null });
                                                            await fetchVariantDetails(activeTab, current.itinerary.itineraryId, variant.variantId);
                                                        })}
                                                        className={`px-4 h-10 rounded-lg border text-sm transition-all ${selected ? color.selected : "bg-white hover:bg-gray-50"} ${isViewMode ? "cursor-default" : ""}`}
                                                    >
                                                        {formatDate(variant.startDate)}
                                                    </button>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pickup */}
                        <div className="col-span-3">
                            <div className={UI.tourPanel}>
                                <h3 className={UI.tourHeader}>Pickup Points</h3>

                                <div className={UI.tourList}>
                                    {current.pickupPoints.map(point => {
                                        const selected = idsMatch(current.pickup?.pickupPointId, point.pickupPointId);
                                        return (
                                            <button
                                                key={point.pickupPointId}
                                                type="button"
                                                onClick={guard(() => updateTabState(activeTab, { pickup: point }))}
                                                className={`${UI.tourCard} ${selected ? UI.tourCardSelected : UI.tourCardNormal} ${isViewMode ? "cursor-default" : ""}`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="font-semibold text-sm">📍 {point.pickupCity}</div>
                                                    <div className="text-green-700 font-semibold text-xs">+₹{point.ratePerPax}</div>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {point.pickupPoint} · 📅 {formatDate(point.pickupDate)}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


                {/*======================================================
                            SUMMARY
                ======================================================*/}

                {current.variant && (

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/*==============================
                                TOUR DETAILS
                        ==============================*/}

                        <div className="border rounded-xl bg-white shadow-sm overflow-hidden">

                            <div className="px-4 py-3 border-b bg-slate-50 flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm">
                                    🧳
                                </span>
                                <h3 className="font-semibold text-sm">Tour Details</h3>
                            </div>

                            <div className="p-4 space-y-2.5 text-sm">

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Departure</span>
                                    <span className="font-medium">{formatDate(current.variant.startDate)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Return</span>
                                    <span className="font-medium">{formatDate(current.variant.endDate)}</span>
                                </div>

                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-500 flex-shrink-0">Variant</span>
                                    <span className="font-medium text-right truncate">{current.variant.variantsName}</span>
                                </div>

                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-gray-500">Status</span>
                                    <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                        {current.variant.status}
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/*==============================
                                PRICE
                        ==============================*/}

                        <div className="border-2 border-green-200 rounded-xl bg-white shadow-sm overflow-hidden relative">

                            <div className="px-4 py-3 border-b border-green-200 bg-green-50 flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-green-100 text-green-700 flex items-center justify-center text-sm">
                                    💰
                                </span>
                                <h3 className="font-semibold text-sm text-green-900">Price</h3>
                                <span className="ml-auto text-[10px] font-medium text-green-700 bg-white border border-green-200 px-2 py-0.5 rounded-full">
                                    per pax
                                </span>

                                {/* Discount visibility toggle — internal-only info, stays live in all modes */}
                                <button
                                    type="button"
                                    onClick={() => setShowDiscount(s => !s)}
                                    title={showDiscount ? "Hide discount (client view)" : "Show discount (internal)"}
                                    className="w-6 h-6 rounded-md flex items-center justify-center text-green-700 hover:bg-white border border-transparent hover:border-green-200 transition"
                                >
                                    {showDiscount ? "🙈" : "👁"}
                                </button>
                            </div>

                            <div className="p-4 space-y-2.5 text-sm">

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tour price</span>
                                    <span>₹{current.variant.perPaxBaseAmount}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Pickup charges</span>
                                    <span>₹{current.pickup?.ratePerPax || 0}</span>
                                </div>

                                {/* Discount row — only rendered when toggled on */}
                                {showDiscount && (
                                    <div className="flex justify-between items-center bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 -mx-0.5">
                                        <span className="text-amber-800 text-xs font-medium flex items-center gap-1">
                                            🔒 Max discount
                                        </span>
                                        <span className="text-amber-800 font-semibold">{current.variant.discountPercent}%</span>
                                    </div>
                                )}

                                <hr className="border-green-100" />

                                <div className="flex justify-between items-baseline">
                                    <span className="font-semibold text-gray-700">Total</span>
                                    <div className="text-right">
                                        {showDiscount && (
                                            <div className="text-xs text-gray-400 line-through">
                                                ₹{current.variant.perPaxBaseAmount + (current.pickup?.ratePerPax || 0)}
                                            </div>
                                        )}
                                        <span className="text-2xl font-bold text-green-600">
                                            ₹{Math.round(
                                                (current.variant.perPaxBaseAmount + (current.pickup?.ratePerPax || 0)) *
                                                (100 - (showDiscount ? current.variant.discountPercent : 0)) / 100
                                            )}
                                        </span>
                                        <span className="text-[11px] text-gray-400 ml-1">/ pax</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/*==============================
                                SEATS
                        ==============================*/}

                        <div className="border rounded-xl bg-white shadow-sm overflow-hidden">

                            <div className="px-4 py-3 border-b bg-slate-50 flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm">
                                    💺
                                </span>
                                <h3 className="font-semibold text-sm">Seats</h3>
                            </div>

                            <div className="p-4 space-y-3 text-sm">

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Total</span>
                                    <span className="font-medium">{current.variant.totalSeats}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Occupied</span>
                                    <span className="font-medium">{current.variant.occupiedSeats}</span>
                                </div>

                                <div className="flex justify-between items-baseline">
                                    <span className="text-gray-500">Available</span>
                                    <span className="text-xl font-bold text-green-600">
                                        {current.variant.totalSeats - current.variant.occupiedSeats}
                                    </span>
                                </div>

                                <div>
                                    <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                                        <div
                                            className={`h-2.5 rounded-full transition-all ${
                                                (current.variant.occupiedSeats / current.variant.totalSeats) > 0.85
                                                    ? "bg-red-500"
                                                    : (current.variant.occupiedSeats / current.variant.totalSeats) > 0.6
                                                    ? "bg-amber-500"
                                                    : "bg-green-500"
                                            }`}
                                            style={{
                                                width: `${(current.variant.occupiedSeats / current.variant.totalSeats) * 100}%`
                                            }}
                                        />
                                    </div>
                                    <div className="text-[11px] text-gray-400 mt-1 text-right">
                                        {Math.round((current.variant.occupiedSeats / current.variant.totalSeats) * 100)}% filled
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                )}

                {/*======================================================
                            SELECTED TOUR SUMMARY
                ======================================================*/}

                {current.itinerary && current.variant && (

                    <div className="border rounded-xl bg-blue-50 p-5">

                        <h3 className="font-semibold mb-3">

                            Selected Tour

                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                            <div>

                                <div className="text-xs text-gray-500">

                                    Tour

                                </div>

                                <div className="font-semibold">

                                    {current.itinerary.itName}

                                </div>

                            </div>

                            <div>

                                <div className="text-xs text-gray-500">

                                    Variant

                                </div>

                                <div className="font-semibold">

                                    {current.variant.variantsName}

                                </div>

                            </div>

                            <div>

                                <div className="text-xs text-gray-500">

                                    Pickup

                                </div>

                                <div className="font-semibold">

                                    {current.pickup?.pickupPoint || "-"}

                                </div>

                            </div>

                            <div>

                                <div className="text-xs text-gray-500">

                                    Final Amount

                                </div>

                                <div className="font-semibold text-green-600">

                                    ₹{getFinalPrice()}

                                </div>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}

