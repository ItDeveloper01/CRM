import React, { useState, useEffect } from "react";
import { getEmptyPaxDetailsObj } from "../../Model/HolidayLeadObj";
import axios from "axios";
import config from "../../config";



// ======================
// 🧩 REUSABLE UI
// ======================
function InputBox({ label, value, onChange }) {
  return (
    <div className="min-w-[100px]">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-2 py-1"
      />
    </div>
  );
}

function SelectBox({ label, value, onChange, options = [], disabled }) {
  return (
    <div className="min-w-[140px]">
      <label className="text-xs text-gray-500">{label}</label>
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-2 py-1"
      >
        <option value="">Select</option>
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}

// ✅ NEW: PAX Component (isolated & reusable)
export function PaxDetails({ holidayLeadObj, setHolidayLeadObj }) {

  // ======================
  // 🔥 MOCK API LAYER (same file)
  // ======================
  const getRoomTypesAPI = async () => {
    const response = await axios.get(
      config.apiUrl + "/MasterData/GetRoomTypeList"
    );

    return (response.data || []).map(item => ({
      id: item.id,
      name: item.roomType
    }));
  };

  const getHotelTypesAPI = async () => {
    const response = await axios.get(
      config.apiUrl + "/MasterData/GetHotelTypeList"
    );

    return (response.data || []).map(item => ({
      id: item.id,
      name: item.hotelType
    }));
  };

  const getDisabilityTypesAPI = async () => {
    const response = await axios.get(
      config.apiUrl + "/MasterData/GetDisabilityTypeList"
    );

    return (response.data || []).map(item => ({
      id: item.id,
      name: item.disabilityType
    }));
  };

  const [isPaxOpen, setIsPaxOpen] = useState(true);

  // ======================
  // 🔥 DROPDOWN STATES (NEW)
  // ======================
  const [roomTypes, setRoomTypes] = useState([]);
  const [hotelTypes, setHotelTypes] = useState([]);
  const [disabilityTypes, setDisabilityTypes] = useState([]);

  // ======================
  // 🔥 LOAD DROPDOWNS FROM API
  // ======================
  useEffect(() => {

    const loadDropdowns = async () => {

      try {
        const rooms = await getRoomTypesAPI();
        const hotels = await getHotelTypesAPI();
        const disabilities = await getDisabilityTypesAPI();

        setRoomTypes(rooms);
        setHotelTypes(hotels);
        setDisabilityTypes(disabilities);
      } catch (error) {
        console.error("Error loading pax dropdowns", error);
        setDisabilityTypes([]);
      }
    };

    loadDropdowns();

  }, []);

  // ======================
  // 🔥 Single Source of Truth
  // ======================
  const [paxDetailsObj, setPaxDetailsObj] = useState(
    holidayLeadObj?.paxDetails || getEmptyPaxDetailsObj()
  );

  // ======================
  // 🔥 Derived Count
  // ======================
  const paxCount =
    Number(paxDetailsObj?.noOfAdults || 0) +
    Number(paxDetailsObj?.noOfExtraAdults || 0) +
    Number(paxDetailsObj?.noOfChildrenWithBed || 0) +
    Number(paxDetailsObj?.noOfChildrenWithoutBed || 0) +
    Number(paxDetailsObj?.infants || 0);

  // ======================
  // 🔥 Sync Parent Object
  // ======================
  useEffect(() => {

    setHolidayLeadObj(prev => ({
      ...prev,
      paxDetails: {
        ...paxDetailsObj,
        totalPax: paxCount
      }
    }));

  }, [paxDetailsObj, paxCount]);

  // ======================
  // 🔥 Common Updater
  // ======================
  const updateField = (key, value) => {

    setPaxDetailsObj(prev => ({
      ...prev,
      [key]: value
    }));

  };

  return (
    <div className="mt-5 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

      {/* HEADER */}
      <div
        onClick={() => setIsPaxOpen(prev => !prev)}
        className="flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-50 cursor-pointer transition-all border-b"
      >

        <div className="flex items-center gap-2">

          <span className="font-semibold text-sm text-gray-800">
            PAX Details
          </span>

          {paxCount > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {paxCount}
            </span>
          )}

        </div>

        <div className="flex items-center gap-2">

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
                value={paxDetailsObj.noOfAdults}
                onChange={(e) => updateField("noOfAdults", Number(e.target.value) || 0)}
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
                value={paxDetailsObj.noOfExtraAdults}
                onChange={(e) => updateField("noOfExtraAdults", Number(e.target.value) || 0)}
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
                value={paxDetailsObj.noOfChildrenWithBed}
                onChange={(e) => updateField("noOfChildrenWithBed", Number(e.target.value) || 0)}
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
                value={paxDetailsObj.noOfChildrenWithoutBed}
                onChange={(e) => updateField("noOfChildrenWithoutBed", Number(e.target.value) || 0)}
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
                value={paxDetailsObj.infants}
                onChange={(e) => updateField("infants", Number(e.target.value) || 0)}
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
                value={paxDetailsObj.noOfRooms}
                onChange={(e) => updateField("noOfRooms", Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Room Type (API BIND) */}
            <div className="min-w-[120px]">
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">
                Room Type
              </label>

              <select
                value={paxDetailsObj.roomType}
                onChange={(e) => updateField("roomType", Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select</option>
                {roomTypes.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hotel Type (API BIND) */}
            <div className="min-w-[120px]">
              <label className="text-[11px] font-medium text-gray-500 mb-1 block">
                Hotel Type
              </label>

              <select
                value={paxDetailsObj.hotelType}
                onChange={(e) => updateField("hotelType", Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select</option>
                {hotelTypes.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
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

          {/* Bottom (API BIND Disability) */}
          <div className="mt-5 flex flex-wrap items-center gap-5 border-t border-gray-200 pt-4">

            {/* Senior Citizen */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={paxDetailsObj.isSeniorCitizen}
                onChange={(e) =>
                  updateField("isSeniorCitizen", e.target.checked)
                }
                className="accent-blue-600 h-4 w-4"
              />
              <span className="text-xs font-medium text-gray-700">
                Senior Citizen
              </span>
            </label>

            {/* Differently Abled */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={paxDetailsObj.isDifferentAbled}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  updateField("isDifferentAbled", isChecked);

                  if (!isChecked) {
                    updateField("DisabilityType", 0);
                  }
                }}
                className="accent-blue-600 h-4 w-4"
              />
              <span className="text-xs font-medium text-gray-700">
                Differently Abled
              </span>
            </label>

            {/* Disability Type API */}
            <div className="min-w-[220px]">

              <label className="text-[11px] font-medium text-gray-500 mb-1 block">
                Disability Type
              </label>

              <select
                disabled={!paxDetailsObj.isDifferentAbled}
                value={paxDetailsObj.disabilityType || ""}
                onChange={(e) =>
                  updateField("disabilityType",Number(e.target.value) || 0)
                }
                className={`w-full rounded-xl border px-3 py-2 text-sm shadow-sm outline-none
                ${paxDetailsObj.isDifferentAbled
                    ? "border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    : "border-gray-100 bg-gray-100 text-gray-400"
                  }`}
              >
                <option value="">Select</option>
                {disabilityTypes.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
