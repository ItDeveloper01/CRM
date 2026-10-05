import { useEffect, useState } from "react";
import { colors, labelStyle, inputStyle } from "../itineraryStyles";
import { useItinerary } from "./UseItinerary";
import LocationPicker from "./LocationPicker";
// import { da } from "intl-tel-input/i18n";


/**
 * ItineraryDetailsSection
 *
 * Props:
 *   itName      {string}    – itinerary name value
 *   setItName   {Function}  – setter for itName
 *   description {string}    – description value
 *   setDesc     {Function}  – setter for description
 *   numDays     {number}    – number of days value
 *   updateNumDays {Function} – handler that validates + sets numDays AND resizes the days array
 */
export default function ItineraryDetailsSection({
  // tourCode,
  // setTourCode,
  // itName,
  // setItName,
  // description,
  // setDesc,
  // numDays,
  // updateNumDays,
  // travelScope,
  // setTravelScope,
  itineraryObj,
  setItineraryObj,
  updateNumDays,
}) {

  const { getSectorTypeList } = useItinerary();
  const [travelScope, setTravelScope] = useState([]);
  // console.log("Itinerary:", itineraryObj);
  const basic = itineraryObj.itineraryBasicDetails;
  const handleChange = (field, value) => {

    setItineraryObj(prev => ({

      ...prev,

      itineraryBasicDetails: {

        ...prev.itineraryBasicDetails,

        [field]: value

      }

    }));

  };

  // ========================================================= 
  // Destination Select 
  // =========================================================
  //  const handleDestinationSelect = (destination) => {
  //   console.log("Selected Destination:", destination);

  //   setItineraryObj(prev => ({
  //     ...prev,
  //     itineraryBasicDetails: {
  //       ...prev.itineraryBasicDetails,
  //       destinationId: destination.id,
  //       destinationName: destination.name,
  //       destinationFullPath: destination.fullPath,
  //     }
  //   }));
  // };

  const handleDestinationSelect = (destination) => {
    console.log("Selected Destination:", destination);
    setItineraryObj((prev) => {
      const existingDestinations = prev.itineraryBasicDetails.selectedDestinations || [];
      // Prevent duplicate destination 
      const alreadyExists = existingDestinations.some((item) => item.id === destination.id);
      if (alreadyExists) { return prev; }
      return {
        ...prev, itineraryBasicDetails: {
          ...prev.itineraryBasicDetails, selectedDestinations:
            [
              ...existingDestinations,
              destination,
            ],
        },
      };
    });
  };

  // ========================================================= 
  // // Remove Destination 
  // // ========================================================= 
  const handleRemoveDestination = (destinationId) => {
    setItineraryObj((prev) => ({
      ...prev, itineraryBasicDetails: {
        ...prev.itineraryBasicDetails, selectedDestinations:
          (prev.itineraryBasicDetails.selectedDestinations || [])
            .filter((destination) => destination.id !== destinationId),
      },
    }));
  };

  // ========================================================= 
  // Clear All Destinations 
  // ============================================

  const handleClearAllDestinations = () => {
    handleChange("selectedDestinations", []);
  };

  // ========================================================= 
  // Clear All Details 
  // =========================================================

  const handleClearAllDetails = () => {

    setItineraryObj((prev) => ({

      ...prev,
      itineraryBasicDetails: {
        ...prev.itineraryBasicDetails,
        // basic

        tourCode: "",
        itName: "",
        description: "",
        travelScope: null,
        selectedDestinations: [],

      },
    }));
    // numDays ko bhi reset karna hai + days array resize karna hai
    updateNumDays(0);
  };

  useEffect(() => {
    const fetchSectorType = async () => {

      try {
        debugger;
        const data = await getSectorTypeList();
        // console.log("Sector Type Api Response:", data);
        // setTravelScope(data);
        setTravelScope(data);

      }
      catch (error) {
        console.error("Failed to fetch Sector List: ", error);
      }
    }
    fetchSectorType();
  }, [getSectorTypeList]);
  // }, [getSectorTypeList]);
  // const travScope = [
  //   { id: 1, travelScope: "Domestic" },
  //   { id: 2, travelScope: "International" },
  // ]


  return (
    <div
      style={{
        background: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: 20,
      }}
    >
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              background: colors.primary,
              color: colors.white,
              borderRadius: "50%",
              width: 22,
              height: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            1
          </span>
          <span style={{ fontWeight: 700, fontSize: 15, color: colors.primary }}>
            Itinerary Details
          </span>
        </div>

        {/* Clear All Details button - same line as heading */}
        <button
          type="button"
          onClick={handleClearAllDetails}
          style={{
            border: `1px solid ${colors.border}`,
            background: colors.white,
            color: "#dc2626",
            borderRadius: 6,
            padding: "4px 10px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Clear All Details
        </button>
      </div>

      {/* Fields */}
      {/* Fields */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1.3fr",
          gridTemplateRows: "auto auto",
          gap: 14,
          alignItems: "start",
        }}
      >
        {/* Row 1, Col 1: Tour Code */}
        <div style={{ gridColumn: 1, gridRow: 1 }}>
          <label style={labelStyle}>Tour Code *</label>
          <input
            value={basic.tourCode}
            onChange={(e) => handleChange("tourCode", e.target.value)}
            style={inputStyle}
            placeholder="e.g. KD001"
          />
        </div>

        {/* Row 1, Col 2: Itinerary Name */}
        <div style={{ gridColumn: 2, gridRow: 1 }}>
          <label style={labelStyle}>Itinerary Name *</label>
          <input
            value={basic.itName}
            onChange={(e) => handleChange("itName", e.target.value)}
            style={inputStyle}
            placeholder="e.g. Kerala Backwaters Escape"
          />
        </div>

        {/* Row 1, Col 3: Travel Scope */}
        <div style={{ gridColumn: 3, gridRow: 1 }}>
          <label style={labelStyle}>Travel Sector *</label>

          <select
            value={basic.travelScope ?? ""}
            onChange={(e) => {
              const selectedScope =
                e.target.value === ""
                  ? null
                  : Number(e.target.value);

              handleChange("travelScope", selectedScope);
              handleChange("selectedDestinations", []);
            }}
            style={inputStyle}
          >
            <option value="">Select Travel Sector</option>

            {travelScope?.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.sectorTypeName}
              </option>
            ))}
          </select>
        </div>


        {/* Row 1-2, Col 4: Selected Destinations (right side) */}
        <div style={{ gridColumn: 4, gridRow: "1 / 3" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={labelStyle}>Selected Destinations</label>
            {(basic.selectedDestinations || []).length > 0 && (
              <button
                type="button"
                onClick={handleClearAllDestinations}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#dc2626",
                  fontSize: 9,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Clear Selected Destination
              </button>
            )}
          </div>
          <div
            style={{

              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              background: "#f9fafb",
              padding: 8,
              minHeight: 105,        // roughly 3 rows worth of height
              maxHeight: 96,        // fixed height for exactly ~3 rows
              overflowY: "auto",
              display: "flex",
              flexWrap: "wrap",
              alignItems: (basic.selectedDestinations || []).length === 0 ? "center" : "flex-start",
              justifyContent: (basic.selectedDestinations || []).length === 0 ? "center" : "flex-start",
              gap: 6,

            }}
          >
            {(basic.selectedDestinations || []).length === 0 ? (
              <span style={{ fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>
                No destinations selected
              </span>
            ) : (
              (basic.selectedDestinations || []).map((destination) => (
                <span
                  key={destination.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    flexShrink: 0,
                    border: "1px solid #bfdbfe",
                    backgroundColor: "#eff6ff",
                    borderRadius: 9999,
                    paddingLeft: 8,
                    paddingRight: 4,
                    paddingTop: 4,
                    paddingBottom: 4,
                    fontSize: 12,
                    color: "#1d4ed8",
                    whiteSpace: "nowrap",
                  }}
                  title={destination.fullPath || destination.name}
                >
                  📍 {destination.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveDestination(destination.id)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#60a5fa",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: 14,
                      lineHeight: 1,
                      padding: "0 3px",
                    }}
                    title="Remove destination"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
        {/* Row 2, Col 1: Number of Days */}
        <div style={{ gridColumn: 1, gridRow: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, }} >
            <label style={labelStyle}>Number of Days *</label>
            <span
              style={{
                fontSize: 9,
                color: colors.danger
              }}
            >
              (Please select days to generate variant)
            </span>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type="number"
              min="0"
              max="100"
              value={basic.numDays}
              onChange={(e) => updateNumDays(e.target.value)}
              style={{ ...inputStyle, paddingRight: 36 }}
            />
            <span
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: colors.textSubtle,
                fontSize: 12,
              }}
            >
              days
            </span>
          </div>
        </div>

        {/* Row 2, Col 2: Description */}
        <div style={{ gridColumn: 2, gridRow: 2 }}>
          <label style={labelStyle}>Description</label>
          <input
            value={basic.description}
            maxLength={100}
            onChange={(e) => handleChange("description", e.target.value)}
            style={inputStyle}
            placeholder="e.g. Explore the beautiful backwaters…"
          />
        </div>

        {/* Row 2, Col 3: Destination Search */}
        <div style={{ gridColumn: 3, gridRow: 2 }}>
          <label style={labelStyle}>Destination Search</label>
          <LocationPicker
            scope={basic.travelScope}
            onSelect={handleDestinationSelect}
            disabled={!basic.travelScope}
          />
        </div>
      </div>

    </div>
  );
}