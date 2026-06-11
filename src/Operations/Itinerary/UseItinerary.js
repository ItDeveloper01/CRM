import { useState } from "react";
import axios from "axios";

// ── Base URL — change this to match your API ──────────────────────────────
const BASE_URL = "https://your-api.com/api"; // ← edit this

// ── Payload mapper ────────────────────────────────────────────────────────
// Maps the shape coming out of ManageItineraryForm.onSave → your API body.
// Edit field names here if your backend uses different keys.
function toApiPayload(data) {
  return {
    title:       data.itName,
    description: data.description,
    num_days:    data.numDays,
    days: data.days.map((day, index) => ({
      id:          day.id,
      day_number:  index + 1,
      title:       day.title,
      description: day.desc,
      activities:  day.activities.map((act) => ({
        time:  act.time,
        title: act.title,
        notes: act.notes,
      })),
    })),
    variants: data.variants.map((v) => ({
      id:               v.id,
      name:             v.name,
      status:           v.status,
      start_location:   v.startLocation,
      end_location:     v.endLocation,
      start_date:       v.startDate,
      end_date:         v.endDate,
      total_seats:      v.totalSeats,
      occupied_seats:   v.occupiedSeats,
      guide_id:         v.guideId,
      base_amount:      v.baseAmount,
      discount_percent: v.discountPercent,
      pickup_points: (v.pickupPoints || []).map((p) => ({
        id:       p.id,
        point:    p.point,
        location: p.location,
        rate:     p.rate,
      })),
    })),
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useItinerary() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // ── CREATE ──────────────────────────────────────────────────────────────
  const createItinerary = async (data, { onSuccess } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${BASE_URL}/itineraries`,
        toApiPayload(data),
        { headers: { "Content-Type": "application/json" } }
      );
      onSuccess?.(response.data);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to create itinerary";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── UPDATE ──────────────────────────────────────────────────────────────
  const updateItinerary = async (id, data, { onSuccess } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${BASE_URL}/itineraries/${id}`,
        toApiPayload(data),
        { headers: { "Content-Type": "application/json" } }
      );
      onSuccess?.(response.data);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to update itinerary";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createItinerary, updateItinerary, loading, error };
}