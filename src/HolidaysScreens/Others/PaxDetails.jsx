import React, { useState, useEffect } from "react";

// ✅ NEW: PAX Component (isolated & reusable)
export function PaxDetails({ holidayLeadObj, setHolidayLeadObj }) {
  const [adults, setAdults] = useState(holidayLeadObj.NoOfAdults);
  const [children, setChildren] = useState(holidayLeadObj.NoOfChildren);
  const [infants, setInfants] = useState(holidayLeadObj.NoOfInfants);
  const [diffAbled, setDiffAbled] = useState(holidayLeadObj.IsDifferentAbled);
  const [seniorCitizen, setSeniorCitizen] = useState(holidayLeadObj.IsSeniorCitizen);
  const [extraAdults, setExtraAdults] = useState(0);
  const [childrenWithBed, setChildrenWithBed] = useState(0);
  const [childrenWithoutBed, setChildrenWithoutBed] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [roomType, setRoomType] = useState("");
  const [hotelType, setHotelType] = useState("");
  //const total = Number(adults) + Number(children) + Number(infants);
  const [isPaxOpen, setIsPaxOpen] = useState(true);

  const paxCount =
    Number(adults || 0) +
    Number(extraAdults || 0) +
    Number(childrenWithBed || 0) +
    Number(childrenWithoutBed || 0) +
    Number(infants || 0);

  const hasPaxDetails = paxCount > 0;

  useEffect(() => {
    console.log("In Pax Componenet", { holidayLeadObj });
    console.log("PAX Details Updated:", { adults, children, infants, diffAbled, seniorCitizen });
  }, []);


  useEffect(() => {
    setHolidayLeadObj(prev => ({ ...prev, NoOfAdults: adults, NoOfChildren: children, NoOfInfants: infants }));
  }, [adults, children, infants, setHolidayLeadObj]);

  return (
    <div className="mt-5 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

      {/* 🔥 HEADER */}
      <div
        onClick={() => setIsPaxOpen(prev => !prev)}
        className="flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-50 cursor-pointer transition-all border-b"
      >

        {/* LEFT */}
        <div className="flex items-center gap-2">

          <span className="font-semibold text-sm text-gray-800">
            PAX Details
          </span>

          {/* Count Badge */}
          {paxCount > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {paxCount}
            </span>
          )}

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {/* 🟢 Pulse when collapsed */}
          {paxCount > 0 && !isPaxOpen && (
            <span className="w-3.5 h-3.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.9)]"></span>
          )}
          <span>{isPaxOpen ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* BODY */}
      <div
        className={`transition-all duration-300 overflow-hidden
      ${isPaxOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"}
      `}
      >
        <div className="border-t border-gray-100 px-5 py-5 bg-gradient-to-br from-white to-blue-50/30">

          {/* GRID */}
          <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">

            {/* Adults */}
            <div className="min-w-[90px]">
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">
                Adults
              </label>

              <input
                type="number"
                value={adults}
                onChange={(e) => setAdults(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Extra Adults */}
            <div className="min-w-[100px]">
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">
                Extra Adults
              </label>

              <input
                type="number"
                value={extraAdults}
                onChange={(e) => setExtraAdults(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Child W Bed */}
            <div className="min-w-[110px]">
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">
                Child W/ Bed
              </label>

              <input
                type="number"
                value={childrenWithBed}
                onChange={(e) => setChildrenWithBed(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Child WO Bed */}
            <div className="min-w-[115px]">
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">
                Child W/O Bed
              </label>

              <input
                type="number"
                value={childrenWithoutBed}
                onChange={(e) => setChildrenWithoutBed(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Infants */}
            <div className="min-w-[90px]">
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">
                Infants
              </label>

              <input
                type="number"
                value={infants}
                onChange={(e) => setInfants(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Rooms */}
            <div className="min-w-[80px]">
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">
                Rooms
              </label>

              <input
                type="number"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Room Type */}
            <div className="min-w-[120px]">
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">
                Room Type
              </label>

              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select</option>
                <option>Single</option>
                <option>Double</option>
                <option>Triple</option>
                <option>Twin Bed</option>
              </select>
            </div>

            {/* Hotel Type */}
            <div className="min-w-[120px]">
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">
                Hotel Type
              </label>

              <select
                value={hotelType}
                onChange={(e) => setHotelType(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select</option>
                <option>Budget</option>
                <option>3 Star</option>
                <option>4 Star</option>
                <option>5 Star</option>
                <option>Luxury</option>
                <option>Resort</option>
                <option>Villa</option>
              </select>
            </div>

            {/* Total */}
            <div className="min-w-[90px]">
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">
                Total
              </label>

              <div className="h-[42px] rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                {paxCount}
              </div>
            </div>

          </div>

          {/* Bottom Section */}
          <div className="mt-5 flex flex-wrap items-center gap-5 border-t border-gray-200 pt-4">

            {/* Senior */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={seniorCitizen}
                onChange={() => setSeniorCitizen(!seniorCitizen)}
                className="accent-blue-600 h-4 w-4"
              />

              <span className="text-xs font-medium text-gray-700">
                Senior Citizen
              </span>
            </label>

            {/* Diff Abled */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={diffAbled}
                onChange={() => setDiffAbled(!diffAbled)}
                className="accent-blue-600 h-4 w-4"
              />

              <span className="text-xs font-medium text-gray-700">
                Differently Abled
              </span>
            </label>

            {/* Disability */}
            <div className="min-w-[220px]">
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">
                Disability Type
              </label>

              <select
                disabled={!diffAbled}
                className={`w-full rounded-xl border px-3 py-2 text-sm shadow-sm outline-none
              ${diffAbled
                    ? "border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    : "border-gray-100 bg-gray-100 text-gray-400"
                  }`}
              >
                <option>Select</option>
                <option>Wheelchair</option>
                <option>Visual</option>
                <option>Hearing</option>
                <option>Other</option>
              </select>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}