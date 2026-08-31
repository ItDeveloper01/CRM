import React, { useState, useEffect, useRef, useCallback } from "react";
import { Phone,Mail } from "lucide-react";

const DEBOUNCE_MS = 350;

/**
 * Dumb, reusable search-bar shell.
 * Parent dashboard (Sales/Operations/Telecalling) owns:
 *   - which endpoint to call
 *   - which params to send (leadId/name/phone + dept/vertical context)
 *   - what a "result" looks like
 * This component only owns: input state, debounce, dropdown, loading/error UI.
 */
const DashboardSearchBarWrapper = ({
    placeholder = "Search by name, phone, or Lead ID",
    onSearch,           // required: async (query) => resultsArray
    onSelectResult,     // required: (result) => void
    renderResult,       // optional: (result) => JSX, custom row renderer
    minChars = 2
}) => {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const debounceRef = useRef(null);
    const wrapperRef = useRef(null);
    const requestIdRef = useRef(0); // guards against out-of-order responses


    // Close dropdown on outside click
    useEffect(() => {

        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);


    // Debounced search
    useEffect(() => {

        if (debounceRef.current) clearTimeout(debounceRef.current);

        const trimmed = query.trim();

        if (trimmed.length < minChars) {
            setResults([]);
            setIsOpen(false);
            setIsLoading(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {

            const requestId = ++requestIdRef.current;
            setIsLoading(true);
            setError(null);

            try {

                const data = await onSearch(trimmed);

                // Ignore stale responses if the user kept typing
                if (requestId !== requestIdRef.current) return;

                debugger;
                setResults(data || []);
                setIsOpen(true);

            } catch (err) {

                if (requestId !== requestIdRef.current) return;
                console.error("Dashboard search error:", err);
                setError("Search failed");
                setResults([]);
                setIsOpen(true);

            } finally {

                if (requestId === requestIdRef.current) {
                    setIsLoading(false);
                }

            }

        }, DEBOUNCE_MS);

        return () => clearTimeout(debounceRef.current);

    }, [query, minChars, onSearch]);


    const handleSelect = (result) => {
        onSelectResult(result);
        setQuery("");
        setResults([]);
        setIsOpen(false);
    };

    const handleClear = () => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
    };


    return (
        <div ref={wrapperRef} className="relative w-full max-w-sm">

            <div className="relative">

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                    placeholder={placeholder}
                    className="
                        w-full h-9 pl-9 pr-8
                        text-sm text-slate-700
                        bg-white border border-slate-200
                        rounded-lg shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                    "
                />

                <svg
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path
                        strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                </svg>

                {isLoading && (
                    <svg
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 animate-spin"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                )}

                {!isLoading && query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm leading-none"
                    >
                        ✕
                    </button>
                )}

            </div>

            {isOpen && (

                <div
                    className="
                        absolute z-20 mt-1 w-full
                        max-h-80 overflow-y-auto
                        bg-white border border-slate-200
                        rounded-lg shadow-lg
                    "
                >

                    {error && (
                        <div className="px-3 py-2 text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    {!error && !isLoading && results.length === 0 && (
                        <div className="px-3 py-2 text-sm text-slate-400">
                            No matches found
                        </div>
                    )}

                    {!error && results.map((result, idx) => (

                      <div
    key={result.leadId ?? result.id ?? idx}
    onClick={() => handleSelect(result)}
    className="
        cursor-pointer
        border-b border-slate-100
        px-3 py-2.5
        transition-colors
        last:border-b-0
        hover:bg-slate-50
    "
>
    {renderResult ? (
        renderResult(result)
    ) : (
        <div className="space-y-1.5">

            {/* Name + Customer Type */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">
                    {result.customerName || result.name}
                </span>

                {result.customerType && (
                    <span className="
                        rounded-full
                        bg-indigo-50
                        px-2 py-0.5
                        text-[10px]
                        font-semibold
                        text-indigo-600
                    ">
                        {result.customerType}
                    </span>
                )}
            </div>

            {/* Contact Details */}
            <div className="flex items-center gap-4 text-xs text-slate-400">

                {result.phone && (
                    <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{result.phone}</span>
                    </span>
                )}

                {result.emailId && (
                    <span className="flex min-w-0 items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate">
                            {result.emailId}
                        </span>
                    </span>
                )}

            </div>

        </div>
    )}
</div>

                    ))}

                </div>

            )}

        </div>
    );

};

export default DashboardSearchBarWrapper;