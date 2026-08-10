import React from "react";
import { Search, RotateCcw, ChevronDown } from "lucide-react";

const DashboardSearchFiltersABC = ({
    searchText,
    setSearchText,

    destination,
    setDestination,
    destinations,

    status,
    setStatus,
    statuses,

    priority,
    setPriority,
    priorities,

    category,
    setCategory,
    categories,

    onClear
}) => {

    return (

        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

            <div className="flex flex-wrap items-center gap-2">

                {/* Search */}

                <div className="relative flex-1 min-w-[220px]">

                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search customer..."
                        className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none"
                    />

                </div>

                <FilterSelect
                    value={destination}
                    onChange={setDestination}
                    options={destinations}
                    placeholder="Destination"
                />

                <FilterSelect
                    value={status}
                    onChange={setStatus}
                    options={statuses}
                    placeholder="Status"
                />

                <FilterSelect
                    value={priority}
                    onChange={setPriority}
                    options={priorities}
                    placeholder="Priority"
                />

                <FilterSelect
                    value={category}
                    onChange={setCategory}
                    options={categories}
                    placeholder="Category"
                />

                <button
                    onClick={onClear}
                    className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                    <RotateCcw className="h-4 w-4" />
                    Clear
                </button>

            </div>

        </div>

    );
};

const FilterSelect = ({
    value,
    onChange,
    options,
    placeholder
}) => {

    return (

        <div className="relative">

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none"
            >

                <option value="">
                    {placeholder}
                </option>

                {options.map(option => (

                    <option
                        key={option}
                        value={option}
                    >
                        {option}
                    </option>

                ))}

            </select>

            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        </div>

    );

};

export default DashboardSearchFiltersABC;