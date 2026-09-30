
import React, { useMemo, useState } from "react";

import {
    Button,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import HolidaySpecialRequirements from "./HolidaySpecialRequirements";

/* =========================================================
   SPECIAL REQUIREMENTS THEME
   ---------------------------------------------------------
   Change colors here to update the complete section.
   ========================================================= */

const SPECIAL_REQUIREMENTS_THEME = {
    // Main section
    section: {
        background: "#f8fafc",
        border: "#dbe3ec"
    },

    // Main heading
    heading: {
        text: "#334155"
    },

    // Selected count chip
    chip: {
        text: "#2563eb",
        background: "#eef5ff",
        border: "#dbeafe"
    },

    // Edit icon button
    editButton: {
        text: "#2563eb",
        background: "#eef5ff",
        border: "#dbeafe",

        hoverBackground: "#dbeafe",
        hoverBorder: "#bfdbfe"
    },

    // Add Requirements button
    addButton: {
        text: "#2563eb",
        background: "#f1f7ff",
        border: "#bfdbfe",

        hoverBackground: "#eaf3ff",
        hoverBorder: "#93c5fd"
    },

    // Empty state
    emptyState: {
        background: "#ffffff",
        border: "#d6dee8",
        text: "#64748b",
        actionText: "#2563eb"
    },

    // Table
    table: {
        background: "#ffffff",
        border: "#dbe3ec",

        headerBackground: "#f8fafc",
        headerText: "#64748b",
        headerBorder: "#e2e8f0",

        rowBorder: "#f1f5f9",
        cellDivider: "#e2e8f0",

        serialNumber: "#94a3b8",

        categoryText: "#334155",
        categoryCount: "#94a3b8"
    },

    // Requirement badges
    requirement: {
        free: {
            background: "#f0fdf4",
            text: "#15803d"
        },

        paid: {
            background: "#fff7ed",
            text: "#c2410c"
        }
    }
};

const EMPTY_REQUIREMENT_IDS = [];

export default function SpecialRequirementsSection({
    holidayLeadObj,
    setHolidayLeadObj,
    isViewMode = false,
    allRequirements = []
}) {
    const [showModal, setShowModal] = useState(false);

    const selectedRequirementIds = Array.isArray(
        holidayLeadObj?.specialRequirements
    )
        ? holidayLeadObj.specialRequirements
        : EMPTY_REQUIREMENT_IDS;

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

    const groupedRequirements = useMemo(() => {
        const groups = {};

        selectedRequirements.forEach(req => {
            const category =
                req.categoryName ||
                req.specialRequirementCategoryName ||
                req.category ||
                "Other";

            if (!groups[category]) {
                groups[category] = [];
            }

            groups[category].push(req);
        });

        Object.keys(groups).forEach(category => {
            groups[category].sort((a, b) => {
                const nameA = a.specialRequirementName || "";
                const nameB = b.specialRequirementName || "";

                return nameA.localeCompare(
                    nameB,
                    undefined,
                    { sensitivity: "base" }
                );
            });
        });

        return Object.fromEntries(
            Object.entries(groups).sort(
                ([categoryA], [categoryB]) =>
                    categoryA.localeCompare(
                        categoryB,
                        undefined,
                        { sensitivity: "base" }
                    )
            )
        );
    }, [selectedRequirements]);

    const handleSave = (ids) => {
        setHolidayLeadObj(prev => ({
            ...prev,
            specialRequirements: ids
        }));

        setShowModal(false);
    };

    const hasSelectedRequirements =
        selectedRequirementIds.length > 0;

    return (
        <div
            style={{
                backgroundColor:
                    SPECIAL_REQUIREMENTS_THEME.section.background,
                border: `1px solid ${SPECIAL_REQUIREMENTS_THEME.section.border}`,
                borderRadius: "10px",
                padding: "10px 12px"
            }}
        >
            {/* Section Header */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={hasSelectedRequirements ? 1 : 0.75}
            >
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >
                    <Typography
                        className="label-style"
                        sx={{
                            fontWeight: 600,
                            color:
                                SPECIAL_REQUIREMENTS_THEME.heading.text
                        }}
                    >
                        Special Requirements
                    </Typography>

                    {hasSelectedRequirements && (
                        <Chip
                            size="small"
                            label={`${selectedRequirementIds.length} Selected`}
                            sx={{
                                height: 24,
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                color:
                                    SPECIAL_REQUIREMENTS_THEME.chip.text,
                                backgroundColor:
                                    SPECIAL_REQUIREMENTS_THEME.chip
                                        .background,
                                border: `1px solid ${SPECIAL_REQUIREMENTS_THEME.chip.border}`,
                                "& .MuiChip-label": {
                                    px: 1
                                }
                            }}
                        />
                    )}
                </Stack>

                {!isViewMode && (
                    <>
                        {hasSelectedRequirements ? (
                            /* Edit button when requirements already exist */
                            <IconButton
                                size="small"
                                title="Edit Special Requirements"
                                aria-label="Edit Special Requirements"
                                onClick={() =>
                                    setShowModal(true)
                                }
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 1.5,
                                    backgroundColor:
                                        SPECIAL_REQUIREMENTS_THEME
                                            .editButton.background,
                                    color:
                                        SPECIAL_REQUIREMENTS_THEME
                                            .editButton.text,
                                    border: `1px solid ${SPECIAL_REQUIREMENTS_THEME.editButton.border}`,

                                    "&:hover": {
                                        backgroundColor:
                                            SPECIAL_REQUIREMENTS_THEME
                                                .editButton
                                                .hoverBackground,
                                        borderColor:
                                            SPECIAL_REQUIREMENTS_THEME
                                                .editButton
                                                .hoverBorder
                                    }
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        ) : (
                            /* More visible action when nothing is selected */
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={
                                    <EditIcon fontSize="small" />
                                }
                                onClick={() =>
                                    setShowModal(true)
                                }
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 1.5,
                                    fontSize: "0.76rem",
                                    fontWeight: 600,
                                    minHeight: 30,
                                    px: 1.25,
                                    color:
                                        SPECIAL_REQUIREMENTS_THEME
                                            .addButton.text,
                                    borderColor:
                                        SPECIAL_REQUIREMENTS_THEME
                                            .addButton.border,
                                    backgroundColor:
                                        SPECIAL_REQUIREMENTS_THEME
                                            .addButton.background,

                                    "&:hover": {
                                        backgroundColor:
                                            SPECIAL_REQUIREMENTS_THEME
                                                .addButton
                                                .hoverBackground,
                                        borderColor:
                                            SPECIAL_REQUIREMENTS_THEME
                                                .addButton
                                                .hoverBorder
                                    }
                                }}
                            >
                                Add Requirements
                            </Button>
                        )}
                    </>
                )}
            </Stack>

            {/* Selected Requirements */}
            {selectedRequirements.length === 0 ? (
                <div
                    style={{
                        backgroundColor:
                            SPECIAL_REQUIREMENTS_THEME.emptyState
                                .background,
                        border: `1px dashed ${SPECIAL_REQUIREMENTS_THEME.emptyState.border}`,
                        borderRadius: "8px",
                        padding: "9px 12px",
                        color:
                            SPECIAL_REQUIREMENTS_THEME.emptyState.text,
                        fontSize: "0.76rem",
                        lineHeight: 1.4
                    }}
                >
                    No special requirements added yet.

                    {!isViewMode && (
                        <>
                            {" "}
                            Click{" "}
                            <span
                                style={{
                                    color:
                                        SPECIAL_REQUIREMENTS_THEME
                                            .emptyState.actionText,
                                    fontWeight: 600
                                }}
                            >
                                Add Requirements
                            </span>{" "}
                            to select.
                        </>
                    )}
                </div>
            ) : (
                <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        boxShadow: "none",
                        borderColor:
                            SPECIAL_REQUIREMENTS_THEME.table.border,
                        backgroundColor:
                            SPECIAL_REQUIREMENTS_THEME.table
                                .background
                    }}
                >
                    <Table
                        size="small"
                        sx={{
                            tableLayout: "fixed",

                            "& th": {
                                backgroundColor:
                                    SPECIAL_REQUIREMENTS_THEME.table
                                        .headerBackground,
                                color:
                                    SPECIAL_REQUIREMENTS_THEME.table
                                        .headerText,
                                fontWeight: 600,
                                fontSize: "0.75rem",
                                padding: "6px 10px",
                                borderBottom: `1px solid ${SPECIAL_REQUIREMENTS_THEME.table.headerBorder}`
                            },

                            "& td": {
                                padding: "6px 10px",
                                borderBottom: `1px solid ${SPECIAL_REQUIREMENTS_THEME.table.rowBorder}`
                            },

                            "& th:not(:last-child), & td:not(:last-child)": {
                                borderRight: `1px solid ${SPECIAL_REQUIREMENTS_THEME.table.cellDivider}`
                            },

                            "& tr:last-child td": {
                                borderBottom: "none"
                            }
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    align="center"
                                    sx={{
                                        width: "55px"
                                    }}
                                >
                                    S.No.
                                </TableCell>

                                <TableCell
                                    sx={{
                                        width: "25%"
                                    }}
                                >
                                    Category
                                </TableCell>

                                <TableCell>
                                    Special Requirements
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {Object.entries(
                                groupedRequirements
                            ).map(
                                (
                                    [
                                        category,
                                        requirements
                                    ],
                                    index
                                ) => (
                                    <TableRow
                                        key={category}
                                    >
                                        {/* S.No. */}
                                        <TableCell
                                            align="center"
                                            sx={{
                                                color:
                                                    SPECIAL_REQUIREMENTS_THEME
                                                        .table
                                                        .serialNumber,
                                                fontSize:
                                                    "0.75rem"
                                            }}
                                        >
                                            {index + 1}
                                        </TableCell>

                                        {/* Category */}
                                        <TableCell
                                            sx={{
                                                verticalAlign:
                                                    "middle"
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                spacing={0.7}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        color:
                                                            SPECIAL_REQUIREMENTS_THEME
                                                                .table
                                                                .categoryText,
                                                        fontSize:
                                                            "0.8rem"
                                                    }}
                                                >
                                                    {category}
                                                </Typography>

                                                <Typography
                                                    component="span"
                                                    sx={{
                                                        fontSize:
                                                            "0.68rem",
                                                        color:
                                                            SPECIAL_REQUIREMENTS_THEME
                                                                .table
                                                                .categoryCount,
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    (
                                                    {
                                                        requirements.length
                                                    }
                                                    )
                                                </Typography>
                                            </Stack>
                                        </TableCell>

                                        {/* Requirements */}
                                        <TableCell
                                            sx={{
                                                verticalAlign:
                                                    "middle"
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                spacing={0.75}
                                                useFlexGap
                                                flexWrap="wrap"
                                            >
                                                {requirements.map(
                                                    req => {
                                                        const requirementTheme =
                                                            req.isFree
                                                                ? SPECIAL_REQUIREMENTS_THEME
                                                                      .requirement
                                                                      .free
                                                                : SPECIAL_REQUIREMENTS_THEME
                                                                      .requirement
                                                                      .paid;

                                                        return (
                                                            <span
                                                                key={
                                                                    req.requirementID
                                                                }
                                                                style={{
                                                                    display:
                                                                        "inline-flex",
                                                                    alignItems:
                                                                        "center",
                                                                    padding:
                                                                        "3px 7px",
                                                                    borderRadius:
                                                                        "5px",
                                                                    backgroundColor:
                                                                        requirementTheme.background,
                                                                    color:
                                                                        requirementTheme.text,
                                                                    fontSize:
                                                                        "0.74rem",
                                                                    lineHeight:
                                                                        1.3,
                                                                    whiteSpace:
                                                                        "nowrap"
                                                                }}
                                                            >
                                                                {
                                                                    req.specialRequirementName
                                                                }
                                                            </span>
                                                        );
                                                    }
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Special Requirements Dialog */}
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

                <DialogContent sx={{ p: 2 }}>
                    <HolidaySpecialRequirements
                        requirements={allRequirements}
                        selectedRequirementIds={
                            selectedRequirementIds
                        }
                        isViewMode={isViewMode}
                        onClose={() =>
                            setShowModal(false)
                        }
                        onSave={handleSave}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
