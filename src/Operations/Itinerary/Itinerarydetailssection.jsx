import { colors, labelStyle, inputStyle } from "../itineraryStyles";

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
  debugger;
  console.log("Itinerary:", itineraryObj);
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
  const travScope = [
    { id: 1, travelScope: "Domestic" },
    { id: 2, travelScope: "International" },
  ]

  
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
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
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

      {/* Fields */}
      <div style={{ display: "grid", gridTemplateColumns: "120px 2fr 3fr 130px 150px", gap: 14, alignItems: "end" }}>
        {/* Tour Code */}
        <div>
          <label style={labelStyle}>Tour Code *</label>
          <input
            value={basic.tourCode}
            // onChange={(e)=> setTourCode(e.target.value)}
            onChange={(e) =>
              handleChange("tourCode", e.target.value)
            }
            style={inputStyle}
            placeholder="e.g. KD001"
          />
        </div>

        {/* Itinerary Name */}
        <div>
          <label style={labelStyle}>Itinerary Name *</label>
          <input
            value={basic.itName}
            // onChange={(e) => setItName(e.target.value)}
            onChange={(e)=>
    handleChange("itName",e.target.value)
}
            style={inputStyle}
            placeholder="e.g. Kerala Backwaters Escape"
          />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description</label>
          <input
            // value={description}
            // onChange={(e) => setDesc(e.target.value)}
            value={basic.description}

onChange={(e)=>
    handleChange("description",e.target.value)
}
            style={inputStyle}
            placeholder="e.g. Explore the beautiful backwaters…"
          />
        </div>

        {/* Number of Days */}
        <div>
          <label style={labelStyle}>Number of Days *</label>
          <div style={{ position: "relative" }}>
            <input
              type="number"
              min="0"
              max="30"
              // value={numDays}
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

        {/* Travel Scope */}
        <div>
          <label style={labelStyle}>Travel Sector *</label>
          <select
            // value={travelSector}
            // ========
            // value={travelScope}
            // onChange={(e) =>
            //   setTravelScope(
            //     e.target.value === "" ? null : Number(e.target.value)
            //   )
            // }
            value={basic.travelScope ?? ""}
            onChange={(e)=>

handleChange(

"travelScope",

e.target.value === ""
? null
: Number(e.target.value)

)

}
            style={inputStyle}
          >
            <option value=""> Select Sector</option>
            {travScope.map((travSect) => (
              <option key={travSect.id} value={travSect.id}>
                {travSect.travelScope}
              </option>
            ))}
          </select>

        </div>
      </div>

    </div>
  );
}