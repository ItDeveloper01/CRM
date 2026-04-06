import React, { useState } from "react";
import CommonTablesBoard from "./MasterSettingsBoardScreens/CommonTablesBoard";
import {
  fetchTablesApi,
  saveTableApi,
  checkActiveRecordsApi
} from "./api/tableApi";
import {
  fetchCarTablesApi,
  saveCarTableApi
} from "./api/carTableApi";

export default function MasterSettings() {
  const [activeTab, setActiveTab] = useState("common");

  // 🔄 reload control
  const [refreshKey, setRefreshKey] = useState({
    common: 0,
    car: 0
  });

  // 🔄 loading per tab (for spinner)
  const [loadingTabs, setLoadingTabs] = useState({
    common: false,
    car: false
  });

  const handleReload = () => {
    // start loading
    setLoadingTabs((prev) => ({
      ...prev,
      [activeTab]: true
    }));

    // trigger reload
    setRefreshKey((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab] + 1
    }));

    // stop spinner after slight delay (UI sync)
    setTimeout(() => {
      setLoadingTabs((prev) => ({
        ...prev,
        [activeTab]: false
      }));
    }, 800);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Master Settings</h1>

      {/* Tabs with Reload */}
      <div className="flex border-b items-center">

        {/* CAR TAB */}
        <button
          className={`px-4 py-2 flex items-center gap-2 ${
            activeTab === "car"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("car")}
        >
          Car Rental

          {activeTab === "car" && (
            <span
              onClick={(e) => {
                e.stopPropagation(); // 🚨 important
                handleReload();
              }}
              className={`text-sm cursor-pointer ${
                loadingTabs.car ? "animate-spin" : "hover:scale-110"
              }`}
              title="Reload"
            >
              🔄
            </span>
          )}
        </button>

        {/* COMMON TAB */}
        <button
          className={`px-4 py-2 flex items-center gap-2 ${
            activeTab === "common"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("common")}
        >
          Common Tables

          {activeTab === "common" && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleReload();
              }}
              className={`text-sm cursor-pointer ${
                loadingTabs.common ? "animate-spin" : "hover:scale-110"
              }`}
              title="Reload"
            >
              🔄
            </span>
          )}
        </button>
      </div>

      {/* Keep both mounted */}
      <div style={{ display: activeTab === "common" ? "block" : "none" }}>
        <CommonTablesBoard
          fetchTablesApi={fetchTablesApi}
          saveTableApi={saveTableApi}
          checkActiveRecordsApi={checkActiveRecordsApi}
          refreshKey={refreshKey.common}
        />
      </div>

      <div style={{ display: activeTab === "car" ? "block" : "none" }}>
        <CommonTablesBoard
          fetchTablesApi={fetchCarTablesApi}
          saveTableApi={saveCarTableApi}
          checkActiveRecordsApi={checkActiveRecordsApi}
          refreshKey={refreshKey.car}
        />
      </div>
    </div>
  );
}