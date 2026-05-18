import React, { useState } from "react";
import { Car, Map, Plane, Shield, Train } from "lucide-react";
import TrainBookingForm from "../Service/TrainBookings";
import CarRentalBookingForm from "../Service/CarRentalBookings";
import AirportTransferForm from "../Service/AirportTransferForm";
import SightseeingForm from "../Service/SightSeeingForm";
import { useEffect } from "react";


export default function ServicesAccordion({

  getBookings,
  addBooking,
  removeBooking,
  updateBooking,
  getAIAssistant
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeService, setActiveService] = useState(
    // serviceConfig[0]?.key 
  );
  const [activeBookingIndex, setActiveBookingIndex] = useState({});


  // ======================================================
  // PLACEHOLDER
  // ======================================================

  function PlaceholderForm() {

    return (
      <div className="p-4 text-gray-500">
        Coming Soon...
      </div>
    );
  }

  // ======================================================
  // SERVICE CONFIG
  // ======================================================

  const serviceConfig = [

    {
      key: "train",
      label: "Train Tickets",
      icon: <Train size={16} />,
      component: TrainBookingForm
    },

    {
      key: "car",
      label: "Car Rental",
      icon: <Car size={16} />,
      component: CarRentalBookingForm
    },

    {
      key: "transfer",
      label: "Airport Transfers",
      icon: <Plane size={16} />,
      component: AirportTransferForm
    },

    {
      key: "sightseeing",
      label: "Sightseeing",
      icon: <Map size={16} />,
      component: SightseeingForm
    },

    {
      key: "insurance",
      label: "Insurance",
      icon: <Shield size={16} />,
      component: PlaceholderForm
    },

    {
      key: "visa",
      label: "Visa",
      icon: <Shield size={16} />,
      component: PlaceholderForm
    }
  ];

  const filteredServices =
    serviceConfig.filter(service =>
      activeService?.services
        ?.includes(service.key)
    );

  const setActiveIndexForService = (key, idx) => {
    setActiveBookingIndex(prev => ({
      ...prev,
      [key]: idx
    }));
  };

  // 🔢 Total bookings across all services
  const totalBookings = serviceConfig.reduce(
    (sum, s) => sum + getBookings(s.key).length,
    0
  );

  useEffect(() => {
    if (serviceConfig.length > 0 && !activeService) {
      setActiveService(serviceConfig[0].key);
    }
  }, [serviceConfig, activeService]);



  return (
    <div className="w-full border rounded-lg bg-white">

      {/* 🔥 HEADER */}
      <div
        onClick={() => setIsOpen(prev => !prev)}
        className="flex justify-between items-center p-3 bg-gray-100 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold">Services</span>

          {totalBookings > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 rounded-full">
              {totalBookings}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 🟢 Pulse when collapsed */}
          {totalBookings > 0 && !isOpen && (
            <span className="w-3.5 h-3.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.9)]"></span>
          )}
          <span>{isOpen ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* 🔥 BODY */}
      {isOpen && (
        <div>

          {/* 🔹 TABS */}
          <div className="flex gap-2 border-b overflow-x-auto px-4 pt-3 bg-gray-50">
            {serviceConfig.map(service => {
              const bookings = getBookings(service.key);
              const isActive = activeService === service.key;

              return (
                <button
                  key={service.key}
                  onClick={() => setActiveService(service.key)}
                  className={`relative px-5 py-2.5 flex items-center gap-2 rounded-t-lg border transition-all duration-200

          ${isActive
                      ? "bg-white border-gray-300 border-b-white text-blue-600 font-semibold shadow-sm"
                      : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200 hover:text-gray-800"
                    }
        `}
                >
                  {/* 🔹 TOP ACTIVE INDICATOR */}
                  {isActive && (
                    <span className="absolute top-0 left-0 w-full h-[3px] bg-blue-500 rounded-t-lg"></span>
                  )}

                  {/* 🔹 LABEL */}
                  <span>{service.label}</span>

                  {/* 🔹 COUNT */}
                  {bookings.length > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full
            ${isActive
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {bookings.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 🔹 ACTIVE SERVICE VIEW */}
          <div className="border border-gray-300 border-t-0 p-5 bg-white">
            {serviceConfig.map(service => {
              if (service.key !== activeService) return null;

              const bookings = getBookings(service.key);
              const Component = service.component;
              const activeIdx = activeBookingIndex[service.key] ?? 0;

              const ai =
                bookings[activeIdx]
                  ? getAIAssistant(service.key, bookings[activeIdx])
                  : [];

              return (
                <div key={service.key} className="flex gap-4">

                  {/* LEFT: BOOKING LIST */}
                  <div className="w-44 border-r pr-2">
                    {bookings.map((_, idx) => (
                      <div key={idx} className="flex items-center gap-1 mb-2">

                        <button
                          onClick={() =>
                            setActiveIndexForService(service.key, idx)
                          }
                          className={`flex-1 text-left px-2 py-2 text-sm rounded
                            ${activeIdx === idx
                              ? "bg-blue-500 text-white"
                              : "bg-blue-50 text-gray-700"
                            }`}
                        >
                          Booking {idx + 1}
                        </button>

                        <button
                          onClick={() => removeBooking(service.key, idx)}
                          className="text-red-500 text-sm px-1"
                        >
                          ✕
                        </button>

                      </div>
                    ))}

                    <button
                      className="text-blue-600 text-sm mt-2 hover:underline"
                      onClick={() => {
                        addBooking(service.key);
                        setIsOpen(true); // 🔥 auto-open
                      }}
                    >
                      + Add Booking
                    </button>

                    {/* 🤖 AI Suggestions */}
                    {ai.length > 0 && (
                      <div className="mt-4 text-xs bg-blue-50 p-2 rounded">
                        <b>AI 🤖</b>
                        {ai.map((a, i) => (
                          <div key={i}>• {a}</div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RIGHT: FORM */}
                  <div className="flex-1">
                    {bookings.length > 0 ? (
                      <Component
                        data={bookings[activeIdx] || {}}
                        onChange={(val) =>
                          updateBooking(service.key, activeIdx, val)
                        }
                      />
                    ) : (
                      <button
                        className="text-blue-600"
                        onClick={() => {
                          addBooking(service.key);
                          setIsOpen(true);
                        }}
                      >
                        Add First Booking
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}