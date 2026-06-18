import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import EditIcon from "@mui/icons-material/Edit";
import HolidaySpecialRequirements from "./HolidaySpecialRequirements";

export default function SpecialRequirementsSection({
  holidayLeadObj,
  setHolidayLeadObj,
  isViewMode = false,
  allRequirements = [],   // ← passed from LeadHolidays (specialRequirement state)
}) {
  const [showModal, setShowModal] = useState(false);

  const selectedIds = Array.isArray(holidayLeadObj?.specialRequirement)
    ? holidayLeadObj.specialRequirement
    : [];

  // Resolve id → label+isFree for chip display
  const selectedChips = selectedIds
    .map((id) => {
      const match = allRequirements.find((r) => r.id === id);
      return match
        ? { id, label: match.specialRequirements ?? match.name, isFree: match.isFree !== false }
        : null;
    })
    .filter(Boolean);

  const handleSave = (ids) => {
    setHolidayLeadObj((prev) => ({ ...prev, specialRequirement: ids }));
    setShowModal(false);
  };

  return (
    <div>
      <label className="label-style">Special Requirements</label>

      <div className="flex items-center flex-wrap gap-2 mt-2">
        {selectedChips.length > 0 ? (
          selectedChips.map(({ id, label, isFree }) => (
            <Chip
              key={id}
              label={label}
              size="small"
              sx={{
                backgroundColor: isFree ? "#EAF3DE" : "#FAEEDA",
                color: isFree ? "#3B6D11" : "#854F0B",
                border: `1px solid ${isFree ? "#639922" : "#BA7517"}`,
                fontWeight: 500,
                fontSize: 12,
              }}
            />
          ))
        ) : (
          <span className="text-gray-500 text-sm">-</span>
        )}

        <IconButton size="small" onClick={() => setShowModal(true)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </div>

      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: 16 }}>
          Select Special Requirements
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <HolidaySpecialRequirements
            requirements={allRequirements}          // ← the fetched list
            selectedIds={selectedIds}               // ← pre-ticks in edit mode
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}