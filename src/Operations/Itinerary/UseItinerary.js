import { useState } from "react";
import axios from "axios";
import config from "../../config";
import { useGetSessionUser } from "../../SessionContext";
// ── Base URL — change this to match your API ──────────────────────────────
const BASE_URL = config.operationsUrl; // ← edit this

// // ── Payload mapper ────────────────────────────────────────────────────────
// // Maps the shape coming out of ManageItineraryForm.onSave → your API body.
// // Edit field names here if your backend uses different keys.
// function toApiPayload(data) {
//   debugger;
//   console.log("Payload details of itinerary:",toApiPayload.data );
//   return {
//     title:       data.itName,
//     description: data.description,
//     num_days:    data.numDays,
//     travelscope : data.travelScope,
//     days: data.days.map((day, index) => ({
//       id:          day.id,
//       day_number:  index + 1,
//       title:       day.title,
//       description: day.desc,
//       activities:  day.activities.map((act) => ({
//         time:  act.time,
//         title: act.title,
//         notes: act.notes,
//       })),
//     })),
//     variants: data.variants.map((v) => ({
//       id:               v.id,
//       name:             v.name,
//       status:           v.status,
//       start_location:   v.startLocation,
//       end_location:     v.endLocation,
//       targetAudience_id: v.targetAudience_id,
//       start_date:       v.startDate,
//       end_date:         v.endDate,
//       total_seats:      v.totalSeats,
//       occupied_seats:   v.occupiedSeats,
//       guide_id:         v.guideId,
//       base_amount:      v.baseAmount,
//       discount_percent: v.discountPercent,
//       pickup_points: (v.pickupPoints || []).map((p) => ({
//         id:       p.id,
//         pickup_point:    p.pickupPoint,
//         pickup_location: p.pickupLocation,
//         rateperpax:     p.ratePerPax,
//       })),
//     })),
//   };
// }

//===============Here we added all api logic for create and update =========

// ── Hook ──────────────────────────────────────────────────────────────────
export function useItinerary() {

    const { user: sessionUser } = useGetSessionUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ── CREATE ──────────────────────────────────────────────────────────────
    const createItinerary = async (request) => {
        request = {
            ...request,

            createdBy_UserID: sessionUser.user.userId,

            updatedBy_UserID: sessionUser.user.userId,
        };
        setLoading(true);
        setError(null);

        try {

            const response = await axios.post(
                `${config.operationsUrl}/Itinerary/CreateItinerary`,
                request,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data;

        } catch (err) {

            setError(
                err.response?.data?.message ||
                err.message ||
                "Create Failed"
            );

            throw err;

        } finally {

            setLoading(false);

        }
    };

    //------------Update Itinerary------------
    const updateItinerary = async (request) => {

        request = {
            ...request,

            // Existing value preserve karo
            createdBy_UserID: request.createdBy_UserID,

            // Current login user
            updatedBy_UserID: sessionUser.user.userId,
        };


        setLoading(true);
        setError(null);

        try {

            const response = await axios.put(
                `${config.operationsUrl}/Itinerary/UpdateItinerary`,
                request,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data;

        } catch (err) {

            setError(
                err.response?.data?.message ||
                err.message ||
                "Update Failed"
            );

            throw err;

        } finally {

            setLoading(false);

        }
    };

    return {

        createItinerary,
        updateItinerary,
        loading,
        error

    };
}