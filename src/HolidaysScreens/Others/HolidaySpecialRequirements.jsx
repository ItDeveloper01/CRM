import React, { useEffect, useMemo, useState } from "react";

import {
    Box,
    Button,
    Checkbox,
    Chip,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Stack,
    TextField,
    Typography,
    InputAdornment
} from "@mui/material";

import { alpha } from "@mui/material/styles";

import SearchIcon from "@mui/icons-material/Search";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

export default function HolidaySpecialRequirements({

    requirements = [],
    selectedRequirementIds = [],
    onSave,
    onClose,
    isViewMode = false

}) {

    //------------------------------------------------------
    // State
    //------------------------------------------------------

    const [selectedIds, setSelectedIds] = useState([]);

    const [searchText, setSearchText] = useState("");

    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    //------------------------------------------------------
    // preload for edit
    //------------------------------------------------------

    useEffect(() => {

        setSelectedIds(

            (selectedRequirementIds || []).map(id => Number(id))

        );

    }, [selectedRequirementIds]);

    //------------------------------------------------------
    // Selection helpers
    //
    // IDs coming from the parent (selectedRequirementIds, often
    // strings from an API) can be a different type than
    // requirement.requirementID (often a number). A plain
    // Array.includes() uses strict equality, so "12" !== 12 and
    // nothing ever appears selected. Compare as strings instead.
    //------------------------------------------------------

    const isSelected = (id) =>

        selectedIds.some(x => String(x) === String(id));

    //------------------------------------------------------
    // Group requirements
    //------------------------------------------------------

    const groupedRequirements = useMemo(() => {

        const groups = {};

        requirements.forEach(item => {

            if (!groups[item.categoryID]) {

                groups[item.categoryID] = {

                    categoryID: item.categoryID,

                    categoryName: item.categoryName,

                    categoryDisplayOrder:
                        item.categoryDisplayOrder,

                    requirements: []

                };

            }

            groups[item.categoryID]
                .requirements
                .push(item);

        });

        return Object.values(groups)
            .sort((a, b) =>
                a.categoryDisplayOrder -
                b.categoryDisplayOrder
            );

    }, [requirements]);

    //------------------------------------------------------
    // first category
    //------------------------------------------------------

    useEffect(() => {

        if (
            groupedRequirements.length &&
            selectedCategoryId == null
        ) {

            setSelectedCategoryId(
                groupedRequirements[0].categoryID
            );

        }

    }, [groupedRequirements]);

    //------------------------------------------------------
    // Search
    //------------------------------------------------------

    const filteredRequirements = useMemo(() => {

        if (!selectedCategoryId)
            return [];

        let category =
            groupedRequirements.find(
                x =>
                    x.categoryID === selectedCategoryId
            );

        if (!category)
            return [];

        if (!searchText.trim())
            return category.requirements;

        return category.requirements.filter(r =>

            r.specialRequirementName

                .toLowerCase()

                .includes(searchText.toLowerCase())

        );

    }, [

        groupedRequirements,

        selectedCategoryId,

        searchText

    ]);

    //------------------------------------------------------
    // auto switch category while searching
    //------------------------------------------------------

    useEffect(() => {

        if (!searchText.trim())
            return;

        const first = requirements.find(r =>

            r.specialRequirementName

                .toLowerCase()

                .includes(searchText.toLowerCase())

        );

        if (first) {

            setSelectedCategoryId(first.categoryID);

        }

    }, [

        searchText,

        requirements

    ]);

    //------------------------------------------------------
    // toggle
    //------------------------------------------------------

    const toggleSelection = (id) => {

        if (isViewMode)
            return;

        if (isSelected(id)) {

            setSelectedIds(

                selectedIds.filter(x => String(x) !== String(id))

            );

        }
        else {

            setSelectedIds(

                [...selectedIds, Number(id)]

            );

        }

    };

    //------------------------------------------------------
    // category counts
    //------------------------------------------------------

    const getCategorySelectedCount = (category) => {

        return category.requirements.filter(r =>

            isSelected(r.requirementID)

        ).length;

    };

    //------------------------------------------------------
    // Select All (Current Category)
    //------------------------------------------------------

    const handleSelectAll = () => {

        if (isViewMode)
            return;

        const ids = filteredRequirements.map(

            x => Number(x.requirementID)

        );

        const merged = [...selectedIds];

        ids.forEach(id => {

            if (!merged.some(x => x === id)) {

                merged.push(id);

            }

        });

        setSelectedIds(merged);

    };

    //------------------------------------------------------
    // Clear All
    //------------------------------------------------------

    const handleClearAll = () => {

        if (isViewMode)
            return;

        setSelectedIds([]);

    };

    //------------------------------------------------------
    // Save
    //------------------------------------------------------

    const handleSave = () => {

        onSave(selectedIds.map(id => Number(id)));

    };

    //------------------------------------------------------
    // Selected Category
    //------------------------------------------------------

    const selectedCategory =
        groupedRequirements.find(
            x => x.categoryID === selectedCategoryId
        );

    //------------------------------------------------------
    // UI
    //------------------------------------------------------

    return (

        <Paper
            elevation={0}
            sx={{
                height: "72vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: 3
            }}
        >

            {/* ============================================
                Header
            ============================================= */}

            <Box sx={{ px: 3, pt: 2.5, pb: 2 }}>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >

                    <Box>

                        <Typography
                            fontWeight={700}
                            fontSize={19}
                        >
                            Special Requirements
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {isViewMode
                                ? "Requirements included in this booking"
                                : "Pick everything the guest needs for this trip"}
                        </Typography>

                    </Box>

                    <Chip
                        size="small"
                        label={`${selectedIds.length} selected`}
                        sx={{
                            fontWeight: 600,
                            bgcolor: theme => alpha(theme.palette.primary.main, 0.1),
                            color: "primary.main",
                            border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.25)}`
                        }}
                    />

                </Stack>

                <TextField

                    fullWidth

                    size="small"

                    placeholder="Search special requirements..."

                    value={searchText}

                    onChange={(e) =>
                        setSearchText(e.target.value)
                    }

                    InputProps={{

                        startAdornment: (

                            <InputAdornment position="start">

                                <SearchIcon fontSize="small" sx={{ color: "text.disabled" }} />

                            </InputAdornment>

                        )

                    }}

                    sx={{

                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor: "background.default"
                        }

                    }}

                />

                {!isViewMode &&

                    <Stack

                        direction="row"

                        spacing={1}

                        mt={1.5}

                    >

                        <Button

                            size="small"

                            variant="text"

                            onClick={handleSelectAll}

                            sx={{ fontWeight: 600 }}

                        >

                            Select all in category

                        </Button>

                        <Button

                            size="small"

                            color="inherit"

                            variant="text"

                            onClick={handleClearAll}

                            sx={{ fontWeight: 600, color: "text.secondary" }}

                        >

                            Clear all

                        </Button>

                    </Stack>

                }

            </Box>

            <Divider />

            {/* ============================================
                    Body
            ============================================= */}

            <Box

                sx={{

                    display: "flex",

                    flex: 1,

                    overflow: "hidden"

                }}

            >

                {/* =====================================
                        LEFT PANEL — categories
                ====================================== */}

                <Box

                    sx={{

                        width: 250,

                        overflowY: "auto",

                        borderRight: "1px solid",

                        borderColor: "divider",

                        bgcolor: "background.default",

                        py: 1.5,

                        px: 1

                    }}

                >

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={700}
                        sx={{
                            display: "block",
                            px: 1,
                            pb: 1,
                            letterSpacing: 0.4,
                            textTransform: "uppercase"
                        }}
                    >
                        Categories
                    </Typography>

                    <List disablePadding>

                        {

                            groupedRequirements.map(category => {

                                const active =
                                    selectedCategoryId === category.categoryID;

                                const count = getCategorySelectedCount(category);

                                return (

                                    <ListItemButton

                                        key={category.categoryID}

                                        selected={active}

                                        onClick={() =>
                                            setSelectedCategoryId(
                                                category.categoryID
                                            )
                                        }

                                        sx={{

                                            px: 1.5,

                                            py: 1,

                                            mb: 0.5,

                                            borderRadius: 2,

                                            border: "1px solid",

                                            borderColor: active
                                                ? "primary.main"
                                                : "transparent",

                                            bgcolor: active
                                                ? "primary.main"
                                                : "transparent",

                                            "&:hover": {

                                                bgcolor: active
                                                    ? "primary.dark"
                                                    : theme => alpha(theme.palette.primary.main, 0.08),

                                                borderColor: "primary.main"

                                            },

                                            "&.Mui-selected": {

                                                bgcolor: "primary.main",

                                                "&:hover": {
                                                    bgcolor: "primary.dark"
                                                }

                                            }

                                        }}

                                    >

                                        <ListItemText

                                            primary={

                                                <Typography
                                                    fontSize={14}
                                                    fontWeight={active ? 700 : 600}
                                                    color={active ? "primary.contrastText" : "text.primary"}
                                                >

                                                    {category.categoryName}

                                                </Typography>

                                            }

                                            secondary={

                                                <Typography
                                                    variant="caption"
                                                    fontWeight={600}
                                                    sx={{
                                                        color: active
                                                            ? "rgba(255,255,255,0.85)"
                                                            : count > 0
                                                                ? "success.main"
                                                                : "text.secondary"
                                                    }}
                                                >

                                                    {count} / {category.requirements.length} selected

                                                </Typography>

                                            }

                                        />

                                        <ChevronRightRoundedIcon

                                            fontSize="small"

                                            sx={{

                                                color: active
                                                    ? "primary.contrastText"
                                                    : "text.disabled",

                                                opacity: active ? 1 : 0.5

                                            }}

                                        />

                                    </ListItemButton>

                                );

                            })

                        }

                    </List>

                </Box>

                {/* =====================================
                        RIGHT PANEL — requirements
                ====================================== */}

                <Box

                    sx={{

                        flex: 1,

                        overflowY: "auto",

                        p: 2

                    }}

                >
                    {
                        selectedCategory == null ? (

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%",
                                    gap: 1,
                                    color: "text.secondary"
                                }}
                            >
                                <InventoryRoundedIcon sx={{ fontSize: 36, opacity: 0.4 }} />
                                <Typography color="text.secondary">
                                    Select a category to see its requirements
                                </Typography>
                            </Box>

                        ) : filteredRequirements.length === 0 ? (

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%",
                                    gap: 1,
                                    color: "text.secondary"
                                }}
                            >
                                <SearchOffRoundedIcon sx={{ fontSize: 36, opacity: 0.4 }} />
                                <Typography color="text.secondary">
                                    No requirements match "{searchText}"
                                </Typography>
                            </Box>

        ) : (

                            <Stack spacing={0.75}>

                                {
                                    filteredRequirements.map(requirement => {

                                        const selected =
                                            isSelected(requirement.requirementID);

                                        return (

                                            <Paper

                                                key={requirement.requirementID}

                                                variant="outlined"

                                                onClick={() =>
                                                    toggleSelection(
                                                        requirement.requirementID
                                                    )
                                                }

                                                sx={{

                                                    cursor: isViewMode
                                                        ? "default"
                                                        : "pointer",

                                                    py: 1,

                                                    px: 1.5,

                                                    borderRadius: 1.5,

                                                    transition:
                                                        "border-color .15s ease, background-color .15s ease",

                                                    borderColor: selected
                                                        ? "primary.main"
                                                        : "divider",

                                                    bgcolor: selected
                                                        ? theme => alpha(theme.palette.primary.main, 0.05)
                                                        : "background.paper",

                                                    "&:hover": isViewMode
                                                        ? {}
                                                        : {

                                                            borderColor: "primary.main",

                                                            bgcolor: theme =>
                                                                alpha(theme.palette.primary.main, 0.04)

                                                        }

                                                }}

                                            >

                                                <Stack

                                                    direction="row"

                                                    alignItems="center"

                                                    spacing={1}

                                                >

                                                    {!isViewMode &&

                                                        <Checkbox

                                                            checked={selected}

                                                            icon={<RadioButtonUncheckedRoundedIcon fontSize="small" />}

                                                            checkedIcon={<CheckCircleRoundedIcon fontSize="small" />}

                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }

                                                            onChange={() =>
                                                                toggleSelection(
                                                                    requirement.requirementID
                                                                )
                                                            }

                                                            sx={{ p: 0.5 }}

                                                        />

                                                    }

                                                    <Box
                                                        flex={1}
                                                        minWidth={0}
                                                    >

                                                        <Typography
                                                            fontWeight={500}
                                                            fontSize={14}
                                                            noWrap
                                                            sx={{ color: "text.secondary" }}
                                                        >
                                                            {
                                                                requirement.specialRequirementName
                                                            }
                                                        </Typography>

                                                        {
                                                            !requirement.isFree &&
                                                            requirement.extraCostLabel &&

                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                {
                                                                    requirement.extraCostLabel
                                                                }
                                                            </Typography>
                                                        }

                                                    </Box>

                                                    {

                                                        requirement.isFree ? (

                                                            <Chip

                                                                label="Free"

                                                                size="small"

                                                                sx={{
                                                                    fontWeight: 600,
                                                                    bgcolor: theme =>
                                                                        alpha(theme.palette.success.main, 0.12),
                                                                    color: "success.dark"
                                                                }}

                                                            />

                                                        ) : (

                                                            <Chip

                                                                label={
                                                                    requirement.extraCostLabel ??
                                                                    "Chargeable"
                                                                }

                                                                size="small"

                                                                sx={{
                                                                    fontWeight: 600,
                                                                    bgcolor: theme =>
                                                                        alpha(theme.palette.warning.main, 0.15),
                                                                    color: "warning.dark"
                                                                }}

                                                            />

                                                        )

                                                    }

                                                </Stack>

                                            </Paper>

                                        );

                                    })
                                }

                            </Stack>

                        )
                    }

                </Box>

            </Box>

            <Divider />

            {/* ====================================
                    FOOTER
            ===================================== */}

            <Stack

                direction="row"

                justifyContent="flex-end"

                spacing={1.5}

                sx={{

                    px: 3,

                    py: 2

                }}

            >

                <Button

                    variant="outlined"

                    onClick={onClose}

                    sx={{ borderRadius: 2, fontWeight: 600 }}

                >

                    Cancel

                </Button>

                {
                    !isViewMode &&

                    <Button

                        variant="contained"

                        onClick={handleSave}

                        disableElevation

                        sx={{ borderRadius: 2, fontWeight: 600 }}

                    >

                        Save Requirements

                    </Button>
                }

            </Stack>

        </Paper>

    );

}
