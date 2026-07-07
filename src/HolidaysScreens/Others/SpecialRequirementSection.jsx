import React, { useMemo, useState } from "react";

import {
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Typography
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import HolidaySpecialRequirements from "./HolidaySpecialRequirements";

//---------------------------------------------------------
// Stable empty-array reference.
//
// If we fall back to `[]` inline on every render, that's a
// brand new array each time — a new reference even though
// the "content" is the same empty list. HolidaySpecialRequirements
// resyncs its local selection state whenever this prop's
// reference changes, so any unrelated re-render of this
// component (e.g. another field on the same lead form changing)
// was silently resetting the user's in-progress selection back
// to whatever was last saved. A module-level constant keeps the
// same reference across renders, so the child only resyncs when
// the actual saved list changes.
//---------------------------------------------------------

const EMPTY_REQUIREMENT_IDS = [];

export default function SpecialRequirementsSection({

    holidayLeadObj,
    setHolidayLeadObj,
    isViewMode = false,
    allRequirements = []

}) {

    const [showModal, setShowModal] = useState(false);

    //---------------------------------------------------------
    // Selected Requirement IDs
    //---------------------------------------------------------

    const selectedRequirementIds = Array.isArray(
        holidayLeadObj?.specialRequirements
    )
        ? holidayLeadObj.specialRequirements
        : EMPTY_REQUIREMENT_IDS;

    //---------------------------------------------------------
    // Selected Chips
    //---------------------------------------------------------

    const selectedRequirements = useMemo(() => {

        return selectedRequirementIds
            .map(id => {

                const req = allRequirements.find(
                    x => String(x.requirementID) === String(id)
                );

                return req ?? null;

            })
            .filter(Boolean);

    }, [selectedRequirementIds, allRequirements]);

    //---------------------------------------------------------
    // Save
    //---------------------------------------------------------

    const handleSave = (ids) => {

        setHolidayLeadObj(prev => ({

            ...prev,

            specialRequirements: ids

        }));

        setShowModal(false);

    };

    //---------------------------------------------------------
    // UI
    //---------------------------------------------------------

    return (

        <div>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
            >

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >

                    <Typography
                        className="label-style"
                    >
                        Special Requirements
                    </Typography>

                    {
                        selectedRequirementIds.length > 0 &&

                        <Chip

                            size="small"

                            color="primary"

                            label={`${selectedRequirementIds.length} Selected`}

                        />

                    }

                </Stack>

                {
                    !isViewMode &&

                    <IconButton

                        size="small"

                        onClick={() => setShowModal(true)}

                    >

                        <EditIcon fontSize="small" />

                    </IconButton>

                }

            </Stack>

            {/* ==========================================
                    Selected Requirement Chips
            =========================================== */}

            {

                selectedRequirements.length === 0 ? (

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >

                        No special requirements selected.

                    </Typography>

                ) : (

                    <Stack

                        direction="row"

                        spacing={1}

                        useFlexGap

                        flexWrap="wrap"

                    >

                        {

                            selectedRequirements.map(req => (

                                <Chip

                                    key={req.requirementID}

                                    size="small"

                                    label={req.specialRequirementName}

                                    color={
                                        req.isFree
                                            ? "success"
                                            : "warning"
                                    }

                                    variant="outlined"

                                />

                            ))

                        }

                    </Stack>

                )

            }

            {/* ==========================================
                    Popup
            =========================================== */}

            <Dialog

                open={showModal}

                onClose={() => setShowModal(false)}

                fullWidth

                maxWidth="lg"

                PaperProps={{

                    sx: {

                        borderRadius: 3,

                        height: "85vh"

                    }

                }}

            >

                <DialogTitle>

                    Special Requirements

                </DialogTitle>

                <DialogContent
                    sx={{
                        p: 2
                    }}
                >

                    <HolidaySpecialRequirements

                        requirements={allRequirements}

                        selectedRequirementIds={
                            selectedRequirementIds
                        }

                        isViewMode={isViewMode}

                        onClose={() => setShowModal(false)}

                        onSave={handleSave}

                    />

                </DialogContent>

            </Dialog>

        </div>

    );

}
