import React, { useState } from "react";
import CommonTablesBoard from "./MasterSettingsBoardScreens/CommonTablesBoard";

export default function MasterSettings() {
  const [activeTab, setActiveTab] = useState("visa");

  return (
    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-4">Master Settings</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "visa"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("visa")}
        >
          Visa
        </button>

        <button
          className={`px-4 py-2 ${
            activeTab === "car"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("car")}
        >
          Car Rental
        </button>

         <button
          className={`px-4 py-2 ${
            activeTab === "common"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("common")}
        >
          Common Tables
        </button>
      </div>

{activeTab === "common" && (
        <div>
          {/* Common Tables */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Common Tables</h3>
            </div>
            <CommonTablesBoard />
          </div>
        </div>
      )}
      {/* Tab Content */}
      {activeTab === "visa" && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Visa Masters</h2>

          {/* Visa Types */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Visa Types</h3>
              <button className="text-blue-600">+ Add</button>
            </div>

            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2">Tourist</td>
                  <td className="p-2">Active</td>
                  <td className="p-2">Edit</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">Business</td>
                  <td className="p-2">Active</td>
                  <td className="p-2">Edit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "car" && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Car Rental Masters</h2>

          {/* Car Types */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Car Types</h3>
              <button className="text-blue-600">+ Add</button>
            </div>

            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2">Sedan</td>
                  <td className="p-2">Active</td>
                  <td className="p-2">Edit</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">SUV</td>
                  <td className="p-2">Active</td>
                  <td className="p-2">Edit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}