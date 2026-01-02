import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.olapUrl+"/OLAPDashboard", // already includes /olap
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

export const getReasonTrendGeneral = (filter) =>
  api.post("/reason-trend", filter);

export const getLeadsByModule = (filter) =>
  api.post("/leads-by-module", filter);

export const getLeadsByStatus = (filter) =>
  api.post("/leads-by-status", filter);

export const getLeadsByBranch = (filter) =>
  api.post("/leads-by-branch", filter);

export const getMonthlyTrend = (filter) =>
  api.post("/monthly-trend", filter);


