/**
 * Dashboard.jsx (rewritten to fix build error)
 *
 * Fixes:
 * - Removed all imports/usages of `@mui/icons-material` (CDN fetch was failing).
 * - No stray `#` comments in import lines or elsewhere.
 *
 * Features retained/enhanced:
 * - Four tiles (Total, Postponed, Lost, Confirmed) with pastel borders & gradients, same size.
 * - Active Leads table with filters: Category, Enquiry Date.
 * - Follow-Up Leads (collapsible) placed below Active Leads with filters: Category, Follow-Up Date.
 * - Follow-Up table has Follow-Up Date column.
 * - Sophisticated table styling (striped rows, hover).
 * - Category badges (Chip) without relying on the icon package.
 *
 * Self-tests:
 * - Console assertions verify filter helpers and totals calculation.
 * - These are additive; no existing tests were changed (none were provided).
 *
 * NOTE: Replace the mock data with your API results. See questions at the bottom to confirm desired behavior.
 */

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Collapse,
  Button,
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

/* ---------- Sample Data (replace with API data) ---------- */
/* Added a 'status' field so tiles can be computed dynamically. */
const ACTIVE_LEADS = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    phone: "1234567890",
    email: "john@example.com",
    enquiryDate: "2025-08-01",
    category: "Holiday",
    status: "Confirmed",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    phone: "9876543210",
    email: "jane@example.com",
    enquiryDate: "2025-08-05",
    category: "AirTicketing",
    status: "Postponed",
  },
];

const FOLLOW_UP_LEADS = [
  {
    id: 101,
    firstName: "Alice",
    lastName: "Brown",
    phone: "1112223333",
    email: "alice@example.com",
    followUpDate: "2025-08-15",
    category: "CarRental",
    status: "Postponed",
  },
  {
    id: 102,
    firstName: "Bob",
    lastName: "White",
    phone: "4445556666",
    email: "bob@example.com",
    followUpDate: "2025-08-18",
    category: "Holiday",
    status: "Lost",
  },
];

/* ---------- Styling helpers ---------- */
const TILE_SX = {
  height: 140,
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

const CATEGORY_BADGE_COLORS = {
  AirTicketing: "#81d4fa",
  Holiday: "#ffcc80",
  CarRental: "#c5e1a5",
  "National GIT": "#b39ddb",
  "International GIT": "#ffab91",
  "National FIT": "#80cbc4",
  "International FIT": "#f48fb1",
};

/* ---------- Pure helpers (easy to test) ---------- */
export function filterActiveLeads(leads, category, enquiryDate) {
  return leads.filter(
    (l) =>
      (category ? l.category === category : true) &&
      (enquiryDate ? l.enquiryDate === enquiryDate : true)
  );
}

export function filterFollowUpLeads(leads, category, followUpDate) {
  return leads.filter(
    (l) =>
      (category ? l.category === category : true) &&
      (followUpDate ? l.followUpDate === followUpDate : true)
  );
}

/* Make a unique set of leads by id across active + follow-up */
export function uniqueLeads(allArrays) {
  const map = new Map();
  allArrays.flat().forEach((l) => {
    if (!map.has(l.id)) map.set(l.id, l);
  });
  return Array.from(map.values());
}

export function countByStatus(leads, status) {
  return leads.filter((l) => l.status === status).length;
}

/* ---------- Component ---------- */
export default function UserDashboard() {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [enquiryDateFilter, setEnquiryDateFilter] = useState("");
  const [followCategoryFilter, setFollowCategoryFilter] = useState("");
  const [followDateFilter, setFollowDateFilter] = useState("");
  const [followUpOpen, setFollowUpOpen] = useState(true);

  const categories = useMemo(
    () => [
      "AirTicketing",
      "Holiday",
      "CarRental",
      "National GIT",
      "International GIT",
      "National FIT",
      "International FIT",
    ],
    []
  );

  const allUniqueLeads = useMemo(
    () => uniqueLeads([ACTIVE_LEADS, FOLLOW_UP_LEADS]),
    []
  );

  const totalLeadsCount = allUniqueLeads.length;
  const postponedCount = countByStatus(allUniqueLeads, "Postponed");
  const lostCount = countByStatus(allUniqueLeads, "Lost");
  const confirmedCount = countByStatus(allUniqueLeads, "Confirmed");

  const filteredActiveLeads = useMemo(
    () => filterActiveLeads(ACTIVE_LEADS, categoryFilter, enquiryDateFilter),
    [categoryFilter, enquiryDateFilter]
  );

  const filteredFollowUpLeads = useMemo(
    () =>
      filterFollowUpLeads(
        FOLLOW_UP_LEADS,
        followCategoryFilter,
        followDateFilter
      ),
    [followCategoryFilter, followDateFilter]
  );

  /* ---------- Lightweight runtime tests (console) ---------- */
  useEffect(() => {
    // No-filter cases
    console.assert(
      filterActiveLeads(ACTIVE_LEADS, "", "").length === ACTIVE_LEADS.length,
      "Active: default filter returns all"
    );
    console.assert(
      filterFollowUpLeads(FOLLOW_UP_LEADS, "", "").length ===
        FOLLOW_UP_LEADS.length,
      "FollowUp: default filter returns all"
    );

    // Category filters
    console.assert(
      filterActiveLeads(ACTIVE_LEADS, "Holiday", "").length === 1,
      "Active: Holiday should match 1"
    );
    console.assert(
      filterFollowUpLeads(FOLLOW_UP_LEADS, "Holiday", "").length === 1,
      "FollowUp: Holiday should match 1"
    );

    // Date filters
    console.assert(
      filterActiveLeads(ACTIVE_LEADS, "", "2025-08-05").length === 1,
      "Active: enquiryDate 2025-08-05 should match 1"
    );
    console.assert(
      filterFollowUpLeads(FOLLOW_UP_LEADS, "", "2025-08-18").length === 1,
      "FollowUp: followUpDate 2025-08-18 should match 1"
    );

    // Unique + status counts
    console.assert(totalLeadsCount === 4, "Total unique leads should be 4");
    console.assert(postponedCount === 2, "Postponed count should be 2");
    console.assert(lostCount === 1, "Lost count should be 1");
    console.assert(confirmedCount === 1, "Confirmed count should be 1");
  }, [totalLeadsCount, postponedCount, lostCount, confirmedCount]);

  return (
    <Box p={3}>
      {/* Tiles: same size, pastel borders & text */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Total Leads */}
        <Grid item xs={12} sm={3}>
          <Card
            sx={{
              ...TILE_SX,
              border: "2px solid #cfd8dc", // pastel gray-blue
              background: "linear-gradient(135deg, #eceff1, #f5f5f5)",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "#607d8b" }}>
                Total Leads
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#455a64" }}>
                {totalLeadsCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Postponed */}
        <Grid item xs={12} sm={3}>
          <Card
            sx={{
              ...TILE_SX,
              border: "2px solid #ffe082", // pastel yellow
              background: "linear-gradient(135deg, #fffde7, #fff9c4)",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "#8d6e63" }}>
                Postponed Leads
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#a1887f" }}>
                {postponedCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Lost */}
        <Grid item xs={12} sm={3}>
          <Card
            sx={{
              ...TILE_SX,
              border: "2px solid #ef9a9a", // pastel red
              background: "linear-gradient(135deg, #ffebee, #ffcdd2)",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "#b71c1c" }}>
                Lost Leads
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#c62828" }}>
                {lostCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Confirmed */}
        <Grid item xs={12} sm={3}>
          <Card
            sx={{
              ...TILE_SX,
              border: "2px solid #a5d6a7", // pastel green
              background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: "#1b5e20" }}>
                Confirmed Leads
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
                {confirmedCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Active Leads */}
      <Typography variant="h6" sx={{ mb: 1.5 }}>
        Active Leads
      </Typography>
      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          type="date"
          label="Enquiry Date"
          InputLabelProps={{ shrink: true }}
          value={enquiryDateFilter}
          onChange={(e) => setEnquiryDateFilter(e.target.value)}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", mb: 3 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f4f6f8" }}>
              {["Lead ID", "First Name", "Last Name", "Phone", "Email", "Enquiry Date", "Category"].map(
                (header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontWeight: "bold",
                      color: "#374151",
                      textTransform: "uppercase",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredActiveLeads.map((lead, idx) => (
              <TableRow
                key={lead.id}
                sx={{
                  backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fafafa",
                  "&:hover": { backgroundColor: "#e8f4fd" },
                }}
              >
                <TableCell>{lead.id}</TableCell>
                <TableCell>{lead.firstName}</TableCell>
                <TableCell>{lead.lastName}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.enquiryDate}</TableCell>
                <TableCell>
                  <Chip
                    label={lead.category}
                    sx={{
                      backgroundColor: CATEGORY_BADGE_COLORS[lead.category] || "#e0e0e0",
                      fontWeight: "bold",
                    }}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
            {filteredActiveLeads.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No active leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Follow-Up Leads (collapsible) */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
        <Typography variant="h6">Follow-Up Leads</Typography>
        <Button variant="contained" onClick={() => setFollowUpOpen((p) => !p)}>
          {followUpOpen ? "Hide" : "Show"}
        </Button>
      </Box>

      <Collapse in={followUpOpen}>
        <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={followCategoryFilter}
              onChange={(e) => setFollowCategoryFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            type="date"
            label="Follow-Up Date"
            InputLabelProps={{ shrink: true }}
            value={followDateFilter}
            onChange={(e) => setFollowDateFilter(e.target.value)}
          />
        </Box>

        <TableContainer
          component={Paper}
          sx={{ borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f4f6f8" }}>
                {[
                  "Lead ID",
                  "First Name",
                  "Last Name",
                  "Phone",
                  "Email",
                  "Follow-Up Date",
                  "Category",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontWeight: "bold",
                      color: "#374151",
                      textTransform: "uppercase",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFollowUpLeads.map((lead, idx) => (
                <TableRow
                  key={lead.id}
                  sx={{
                    backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fafafa",
                    "&:hover": { backgroundColor: "#e8f4fd" },
                  }}
                >
                  <TableCell>{lead.id}</TableCell>
                  <TableCell>{lead.firstName}</TableCell>
                  <TableCell>{lead.lastName}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.followUpDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={lead.category}
                      sx={{
                        backgroundColor: CATEGORY_BADGE_COLORS[lead.category] || "#e0e0e0",
                        fontWeight: "bold",
                      }}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
              {filteredFollowUpLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No follow-up leads found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Box>
  );
}
