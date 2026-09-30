
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

import SearchIcon from "@mui/icons-material/Search";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";


/* =========================================================
   SPECIAL REQUIREMENTS THEME
   ---------------------------------------------------------
   Change colors here only.
   ========================================================= */

const SPECIAL_REQUIREMENTS_THEME = {

    primary: "#2563eb",
    primaryDark: "#1d4ed8",

    background: "#ffffff",
    subtleBackground: "#f8fafc",
    hoverBackground: "#f4f7fb",

    border: "#e2e8f0",
    borderLight: "#eef2f7",

    text: "#334155",
    textSecondary: "#64748b",
    textMuted: "#94a3b8",

    selectedCategoryBackground: "#eff6ff",
    selectedCategoryBorder: "#bfdbfe",
    selectedCategoryText: "#1d4ed8",

    selectedRequirementBackground: "#f8fbff",
    selectedRequirementBorder: "#93c5fd",

    free: {
        background: "#f0fdf4",
        text: "#15803d"
    },

    chargeable: {
        background: "#fff7ed",
        text: "#c2410c"
    }
};


/* =========================================================
   FONT / TYPOGRAPHY
   ---------------------------------------------------------
   Change sizes and weights here only.
   ========================================================= */

const SPECIAL_REQUIREMENTS_FONTS = {

    header: {
        size: 17,
        weight: 700
    },

    search: {
        size: 12.5
    },

    category: {
        size: 13,
        weight: 600
    },

    categoryCount: {
        size: 10.5,
        weight: 500
    },

    requirement: {
        size: 13,
        weight: 500,
        selectedWeight: 600
    },

    requirementSubtext: {
        size: 10,
        weight: 400
    },

    badge: {
        size: 9.5,
        weight: 700
    },

    button: {
        size: 11.5,
        weight: 600
    },

    emptyState: {
        size: 12
    },

    footer: {
        size: 11.5,
        weight: 600
    }
};


/* =========================================================
   LAYOUT CONSTANTS
   ========================================================= */

const TWO_COLUMN_THRESHOLD = 6;

const EMPTY_ARRAY = [];


/* =========================================================
   COMPONENT
   ========================================================= */

const HolidaySpecialRequirements = ({
    requirements = EMPTY_ARRAY,
    selectedRequirementIds = EMPTY_ARRAY,
    onSave,
    onClose,
    isViewMode = false
}) => {

    const [selectedIds, setSelectedIds] = useState([]);

    const [searchText, setSearchText] = useState("");

    const [selectedCategoryId, setSelectedCategoryId] =
        useState(null);


    /* =====================================================
       PRELOAD SELECTED REQUIREMENTS
    ===================================================== */

    useEffect(() => {

        setSelectedIds(
            (selectedRequirementIds || []).map(
                id => Number(id)
            )
        );

    }, [selectedRequirementIds]);


    /* =====================================================
       CHECK SELECTION
    ===================================================== */

    const isSelected = (id) => {

        return selectedIds.some(
            x =>
                String(x) === String(id)
        );

    };


    /* =====================================================
       GROUP REQUIREMENTS BY CATEGORY
    ===================================================== */

    const groupedRequirements = useMemo(() => {

        const groups = {};

        (requirements || []).forEach(
            requirement => {

                const categoryId =
                    requirement.categoryID;

                if (!groups[categoryId]) {

                    groups[categoryId] = {

                        categoryID:
                            categoryId,

                        categoryName:
                            requirement.categoryName ||
                            "Other",

                        categoryDisplayOrder:
                            requirement.categoryDisplayOrder ??
                            9999,

                        requirements: []

                    };

                }

                groups[categoryId]
                    .requirements
                    .push(requirement);

            }
        );

        return Object.values(groups)
            .sort(
                (a, b) =>
                    a.categoryDisplayOrder -
                    b.categoryDisplayOrder
            );

    }, [requirements]);


    /* =====================================================
       SET FIRST CATEGORY
    ===================================================== */

    useEffect(() => {

        if (
            groupedRequirements.length &&
            selectedCategoryId == null
        ) {

            setSelectedCategoryId(
                groupedRequirements[0].categoryID
            );

        }

    }, [
        groupedRequirements,
        selectedCategoryId
    ]);


    /* =====================================================
       SEARCH
    ===================================================== */

    const normalizedSearchText =
        searchText
            .trim()
            .toLowerCase();


    const selectedCategory =
        groupedRequirements.find(
            category =>
                category.categoryID ===
                selectedCategoryId
        );


    const filteredRequirements = useMemo(() => {

        if (!selectedCategory) {
            return [];
        }

        if (!normalizedSearchText) {

            return selectedCategory.requirements;

        }

        return selectedCategory.requirements.filter(
            requirement =>
                (
                    requirement
                        .specialRequirementName ||
                    ""
                )
                    .toLowerCase()
                    .includes(
                        normalizedSearchText
                    )
        );

    }, [
        selectedCategory,
        normalizedSearchText
    ]);


    /* =====================================================
       AUTO SELECT CATEGORY WHILE SEARCHING
    ===================================================== */

    useEffect(() => {

        if (!normalizedSearchText) {
            return;
        }

        const matchingCategory =
            groupedRequirements.find(
                category =>
                    category.requirements.some(
                        requirement =>
                            (
                                requirement
                                    .specialRequirementName ||
                                ""
                            )
                                .toLowerCase()
                                .includes(
                                    normalizedSearchText
                                )
                    )
            );

        if (
            matchingCategory &&
            matchingCategory.categoryID !==
                selectedCategoryId
        ) {

            setSelectedCategoryId(
                matchingCategory.categoryID
            );

        }

    }, [
        normalizedSearchText,
        groupedRequirements,
        selectedCategoryId
    ]);


    /* =====================================================
       TOGGLE REQUIREMENT
    ===================================================== */

    const handleToggle = (id) => {

        if (isViewMode) {
            return;
        }

        const numericId =
            Number(id);

        setSelectedIds(previous => {

            const exists =
                previous.some(
                    x =>
                        String(x) ===
                        String(numericId)
                );

            if (exists) {

                return previous.filter(
                    x =>
                        String(x) !==
                        String(numericId)
                );

            }

            return [
                ...previous,
                numericId
            ];

        });

    };


    /* =====================================================
       CATEGORY SELECTED COUNT
    ===================================================== */

    const getCategorySelectedCount =
        (category) => {

            return category.requirements.filter(
                requirement =>
                    isSelected(
                        requirement
                            .requirementID
                    )
            ).length;

        };


    /* =====================================================
       SELECT ALL
    ===================================================== */

    const handleSelectAll = () => {

        if (isViewMode) {
            return;
        }

        const idsToAdd =
            filteredRequirements.map(
                requirement =>
                    Number(
                        requirement
                            .requirementID
                    )
            );

        setSelectedIds(previous => {

            const merged =
                new Set(
                    previous.map(
                        id => Number(id)
                    )
                );

            idsToAdd.forEach(
                id =>
                    merged.add(id)
            );

            return Array.from(merged);

        });

    };


    /* =====================================================
       CLEAR ALL
    ===================================================== */

    const handleClearAll = () => {

        if (isViewMode) {
            return;
        }

        setSelectedIds([]);

    };


    /* =====================================================
       SAVE
    ===================================================== */

    const handleSave = () => {

        if (isViewMode) {

            onClose();

            return;

        }

        onSave(
            selectedIds.map(
                id => Number(id)
            )
        );

    };


    /* =====================================================
       TWO COLUMN LOGIC
    ===================================================== */

    const useTwoColumns =
        filteredRequirements.length >
        TWO_COLUMN_THRESHOLD;


    /* =====================================================
       UI
    ===================================================== */

    return (

        <Paper
            elevation={0}
            sx={{

                height: "72vh",

                display: "flex",
                flexDirection: "column",

                overflow: "hidden",

                backgroundColor:
                    SPECIAL_REQUIREMENTS_THEME
                        .background,

                border:
                    `1px solid ${
                        SPECIAL_REQUIREMENTS_THEME
                            .border
                    }`,

                borderRadius: 2

            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{

                    px: 1.75,
                    py: 1.15,

                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",

                    backgroundColor:
                        SPECIAL_REQUIREMENTS_THEME
                            .background

                }}
            >

                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.8}
                >

                    <Typography
                        sx={{

                            fontSize:
                                SPECIAL_REQUIREMENTS_FONTS
                                    .header
                                    .size,

                            fontWeight:
                                SPECIAL_REQUIREMENTS_FONTS
                                    .header
                                    .weight,

                            color:
                                SPECIAL_REQUIREMENTS_THEME
                                    .text

                        }}
                    >
                        Special Requirements
                    </Typography>


                    <Chip
                        size="small"
                        label={
                            `${selectedIds.length} selected`
                        }
                        sx={{

                            height: 23,

                            fontSize: 10.5,

                            fontWeight: 600,

                            backgroundColor:
                                SPECIAL_REQUIREMENTS_THEME
                                    .selectedCategoryBackground,

                            color:
                                SPECIAL_REQUIREMENTS_THEME
                                    .selectedCategoryText,

                            border:
                                `1px solid ${
                                    SPECIAL_REQUIREMENTS_THEME
                                        .selectedCategoryBorder
                                }`,

                            "& .MuiChip-label": {
                                px: 0.9
                            }

                        }}
                    />

                </Stack>

            </Box>


            <Divider
                sx={{
                    borderColor:
                        SPECIAL_REQUIREMENTS_THEME
                            .borderLight
                }}
            />


            {/* =================================================
                SEARCH + ACTIONS
            ================================================= */}

            <Box
                sx={{

                    px: 1.75,
                    py: 1,

                    display: "flex",
                    alignItems: "center",

                    gap: 0.8

                }}
            >

                <TextField
                    fullWidth
                    size="small"

                    placeholder={
                        "Search requirements..."
                    }

                    value={searchText}

                    onChange={e =>
                        setSearchText(
                            e.target.value
                        )
                    }

                    InputProps={{

                        startAdornment: (

                            <InputAdornment
                                position="start"
                            >

                                <SearchIcon
                                    sx={{
                                        fontSize: 18,
                                        color:
                                            SPECIAL_REQUIREMENTS_THEME
                                                .textMuted
                                    }}
                                />

                            </InputAdornment>

                        )

                    }}

                    sx={{

                        "& .MuiOutlinedInput-root": {

                            height: 36,

                            fontSize:
                                SPECIAL_REQUIREMENTS_FONTS
                                    .search
                                    .size,

                            borderRadius: 1.5,

                            backgroundColor:
                                SPECIAL_REQUIREMENTS_THEME
                                    .subtleBackground,

                            "& fieldset": {

                                borderColor:
                                    SPECIAL_REQUIREMENTS_THEME
                                        .border

                            },

                            "&:hover fieldset": {

                                borderColor:
                                    SPECIAL_REQUIREMENTS_THEME
                                        .selectedRequirementBorder

                            },

                            "&.Mui-focused fieldset": {

                                borderColor:
                                    SPECIAL_REQUIREMENTS_THEME
                                        .primary

                            }

                        }

                    }}

                />


                {!isViewMode && (

                    <>

                        <Button
                            size="small"
                            variant="outlined"

                            onClick={
                                handleSelectAll
                            }

                            disabled={
                                filteredRequirements
                                    .length === 0
                            }

                            sx={{

                                height: 34,

                                px: 1.2,

                                minWidth: "auto",

                                whiteSpace:
                                    "nowrap",

                                textTransform:
                                    "none",

                                fontSize:
                                    SPECIAL_REQUIREMENTS_FONTS
                                        .button
                                        .size,

                                fontWeight:
                                    SPECIAL_REQUIREMENTS_FONTS
                                        .button
                                        .weight,

                                borderColor:
                                    SPECIAL_REQUIREMENTS_THEME
                                        .border,

                                color:
                                    SPECIAL_REQUIREMENTS_THEME
                                        .textSecondary,

                                "&:hover": {

                                    borderColor:
                                        SPECIAL_REQUIREMENTS_THEME
                                            .primary,

                                    color:
                                        SPECIAL_REQUIREMENTS_THEME
                                            .primary,

                                    backgroundColor:
                                        SPECIAL_REQUIREMENTS_THEME
                                            .selectedCategoryBackground

                                }

                            }}
                        >
                            Select All
                        </Button>


                        <Button
                            size="small"
                            variant="text"

                            onClick={
                                handleClearAll
                            }

                            disabled={
                                selectedIds.length === 0
                            }

                            sx={{

                                height: 34,

                                px: 0.8,

                                minWidth: "auto",

                                whiteSpace:
                                    "nowrap",

                                textTransform:
                                    "none",

                                fontSize:
                                    SPECIAL_REQUIREMENTS_FONTS
                                        .button
                                        .size,

                                fontWeight:
                                    SPECIAL_REQUIREMENTS_FONTS
                                        .button
                                        .weight,

                                color:
                                    SPECIAL_REQUIREMENTS_THEME
                                        .textSecondary

                            }}
                        >
                            Clear
                        </Button>

                    </>

                )}

            </Box>


            <Divider
                sx={{
                    borderColor:
                        SPECIAL_REQUIREMENTS_THEME
                            .borderLight
                }}
            />


            {/* =================================================
                BODY
            ================================================= */}

            <Box
                sx={{

                    flex: 1,

                    minHeight: 0,

                    display: "flex",

                    overflow: "hidden"

                }}
            >


                {/* =================================================
                    CATEGORY SIDEBAR
                ================================================= */}

                <Box
                    sx={{

                        width: 215,

                        flexShrink: 0,

                        overflowY: "auto",

                        borderRight:
                            `1px solid ${
                                SPECIAL_REQUIREMENTS_THEME
                                    .borderLight
                            }`,

                        backgroundColor:
                            SPECIAL_REQUIREMENTS_THEME
                                .subtleBackground

                    }}
                >

                    <List
                        disablePadding
                        sx={{
                            py: 0.6
                        }}
                    >

                        {groupedRequirements.map(
                            category => {

                                const count =
                                    getCategorySelectedCount(
                                        category
                                    );

                                const isActive =
                                    category
                                        .categoryID ===
                                    selectedCategoryId;

                                return (

                                    <ListItemButton

                                        key={
                                            category
                                                .categoryID
                                        }

                                        selected={
                                            isActive
                                        }

                                        onClick={() =>
                                            setSelectedCategoryId(
                                                category
                                                    .categoryID
                                            )
                                        }

                                        sx={{

                                            minHeight: 44,

                                            px: 1.3,
                                            py: 0.55,

                                            borderLeft:
                                                isActive
                                                    ? `3px solid ${
                                                        SPECIAL_REQUIREMENTS_THEME
                                                            .primary
                                                    }`
                                                    : "3px solid transparent",

                                            backgroundColor:
                                                isActive
                                                    ? SPECIAL_REQUIREMENTS_THEME
                                                        .selectedCategoryBackground
                                                    : "transparent",

                                            "&:hover": {

                                                backgroundColor:
                                                    SPECIAL_REQUIREMENTS_THEME
                                                        .hoverBackground

                                            },

                                            "&.Mui-selected": {

                                                backgroundColor:
                                                    SPECIAL_REQUIREMENTS_THEME
                                                        .selectedCategoryBackground

                                            },

                                            "&.Mui-selected:hover": {

                                                backgroundColor:
                                                    SPECIAL_REQUIREMENTS_THEME
                                                        .selectedCategoryBackground

                                            }

                                        }}
                                    >

                                        <ListItemText

                                            sx={{
                                                my: 0
                                            }}

                                            primary={

                                                <Typography
                                                    noWrap
                                                    sx={{

                                                        fontSize:
                                                            SPECIAL_REQUIREMENTS_FONTS
                                                                .category
                                                                .size,

                                                        fontWeight:
                                                            isActive
                                                                ? 700
                                                                : SPECIAL_REQUIREMENTS_FONTS
                                                                    .category
                                                                    .weight,

                                                        color:
                                                            isActive
                                                                ? SPECIAL_REQUIREMENTS_THEME
                                                                    .selectedCategoryText
                                                                : SPECIAL_REQUIREMENTS_THEME
                                                                    .text

                                                    }}
                                                >
                                                    {
                                                        category
                                                            .categoryName
                                                    }
                                                </Typography>

                                            }

                                            secondary={

                                                <Typography
                                                    sx={{

                                                        fontSize:
                                                            SPECIAL_REQUIREMENTS_FONTS
                                                                .categoryCount
                                                                .size,

                                                        fontWeight:
                                                            SPECIAL_REQUIREMENTS_FONTS
                                                                .categoryCount
                                                                .weight,

                                                        color:
                                                            count > 0
                                                                ? SPECIAL_REQUIREMENTS_THEME
                                                                    .free
                                                                    .text
                                                                : SPECIAL_REQUIREMENTS_THEME
                                                                    .textMuted

                                                    }}
                                                >
                                                    {count} /{" "}
                                                    {
                                                        category
                                                            .requirements
                                                            .length
                                                    }{" "}
                                                    selected
                                                </Typography>

                                            }

                                        />


                                        <ChevronRightRoundedIcon
                                            sx={{

                                                fontSize: 18,

                                                color:
                                                    isActive
                                                        ? SPECIAL_REQUIREMENTS_THEME
                                                            .primary
                                                        : SPECIAL_REQUIREMENTS_THEME
                                                            .textMuted,

                                                opacity:
                                                    isActive
                                                        ? 0.9
                                                        : 0.45

                                            }}
                                        />

                                    </ListItemButton>

                                );

                            }
                        )}

                    </List>

                </Box>


                {/* =================================================
                    RIGHT REQUIREMENTS AREA
                ================================================= */}

                <Box
                    sx={{

                        flex: 1,

                        minWidth: 0,
                        minHeight: 0,

                        display: "flex",
                        flexDirection: "column",

                        overflow: "hidden",

                        backgroundColor:
                            SPECIAL_REQUIREMENTS_THEME
                                .background

                    }}
                >


                    {/* Category header */}

                    <Box
                        sx={{

                            px: 1.75,
                            py: 1,

                            flexShrink: 0,

                            display: "flex",

                            alignItems: "center",

                            justifyContent:
                                "space-between",

                            borderBottom:
                                `1px solid ${
                                    SPECIAL_REQUIREMENTS_THEME
                                        .borderLight
                                }`

                        }}
                    >

                        <Typography
                            sx={{

                                fontSize: 13.5,

                                fontWeight: 700,

                                color:
                                    SPECIAL_REQUIREMENTS_THEME
                                        .text

                            }}
                        >
                            {
                                selectedCategory?.categoryName ||
                                "Requirements"
                            }
                        </Typography>


                        <Typography
                            sx={{

                                fontSize: 11,

                                color:
                                    SPECIAL_REQUIREMENTS_THEME
                                        .textSecondary

                            }}
                        >
                            {filteredRequirements.length}{" "}
                            option
                            {
                                filteredRequirements.length !== 1
                                    ? "s"
                                    : ""
                            }
                        </Typography>

                    </Box>


                    {/* =================================================
                        REQUIREMENTS LIST

                        1-6 options  = 1 column
                        7+ options   = 2 columns

                        The container itself scrolls when required.
                    ================================================= */}

                    <Box
                        sx={{

                            flex: 1,

                            minHeight: 0,

                            overflowY: "auto",

                            px: 1.5,
                            py: 1.2,

                            "&::-webkit-scrollbar": {
                                width: 6
                            },

                            "&::-webkit-scrollbar-thumb": {

                                backgroundColor:
                                    SPECIAL_REQUIREMENTS_THEME
                                        .border,

                                borderRadius: 4

                            },

                            "&::-webkit-scrollbar-track": {

                                backgroundColor:
                                    "transparent"

                            }

                        }}
                    >

                        {filteredRequirements.length === 0 ? (

                            <Box
                                sx={{

                                    height: "100%",

                                    display: "flex",

                                    flexDirection:
                                        "column",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    color:
                                        SPECIAL_REQUIREMENTS_THEME
                                            .textMuted

                                }}
                            >

                                <SearchOffRoundedIcon
                                    sx={{

                                        fontSize: 34,

                                        mb: 0.5,

                                        opacity: 0.5

                                    }}
                                />

                                <Typography
                                    sx={{

                                        fontSize:
                                            SPECIAL_REQUIREMENTS_FONTS
                                                .emptyState
                                                .size,

                                        fontWeight: 500

                                    }}
                                >
                                    No requirements found
                                </Typography>


                                {searchText && (

                                    <Typography
                                        sx={{

                                            fontSize: 10.5,

                                            mt: 0.3,

                                            color:
                                                SPECIAL_REQUIREMENTS_THEME
                                                    .textMuted

                                        }}
                                    >
                                        Try a different search
                                    </Typography>

                                )}

                            </Box>

                        ) : (

                            <Box
                                sx={{

                                    display: "grid",

                                    gridTemplateColumns:
                                        useTwoColumns
                                            ? {
                                                xs: "1fr",
                                                sm: "repeat(2, minmax(0, 1fr))"
                                            }
                                            : "1fr",

                                    gap: 0.8,

                                    alignContent:
                                        "start"

                                }}
                            >

                                {filteredRequirements.map(
                                    requirement => {

                                        const selected =
                                            isSelected(
                                                requirement
                                                    .requirementID
                                            );

                                        const isFree =
                                            requirement
                                                .isFree ===
                                            true;

                                        return (

                                            <Paper

                                                key={
                                                    requirement
                                                        .requirementID
                                                }

                                                elevation={0}

                                                onClick={() =>
                                                    handleToggle(
                                                        requirement
                                                            .requirementID
                                                    )
                                                }

                                                sx={{

                                                    minWidth: 0,

                                                    minHeight: 48,

                                                    px: 1.1,
                                                    py: 0.8,

                                                    display:
                                                        "flex",

                                                    alignItems:
                                                        "center",

                                                    border:
                                                        `1px solid ${
                                                            selected
                                                                ? SPECIAL_REQUIREMENTS_THEME
                                                                    .selectedRequirementBorder
                                                                : SPECIAL_REQUIREMENTS_THEME
                                                                    .border
                                                        }`,

                                                    borderRadius:
                                                        1.25,

                                                    backgroundColor:
                                                        selected
                                                            ? SPECIAL_REQUIREMENTS_THEME
                                                                .selectedRequirementBackground
                                                            : SPECIAL_REQUIREMENTS_THEME
                                                                .background,

                                                    cursor:
                                                        isViewMode
                                                            ? "default"
                                                            : "pointer",

                                                    transition:
                                                        "border-color .15s ease, background-color .15s ease",

                                                    "&:hover":
                                                        !isViewMode
                                                            ? {

                                                                borderColor:
                                                                    SPECIAL_REQUIREMENTS_THEME
                                                                        .selectedRequirementBorder,

                                                                backgroundColor:
                                                                    selected
                                                                        ? SPECIAL_REQUIREMENTS_THEME
                                                                            .selectedRequirementBackground
                                                                        : SPECIAL_REQUIREMENTS_THEME
                                                                            .hoverBackground

                                                            }
                                                            : {}

                                                }}
                                            >

                                                {/* Checkbox */}

                                                {!isViewMode && (

                                                    <Checkbox

                                                        size="small"

                                                        checked={
                                                            selected
                                                        }

                                                        onChange={() =>
                                                            handleToggle(
                                                                requirement
                                                                    .requirementID
                                                            )
                                                        }

                                                        onClick={e =>
                                                            e.stopPropagation()
                                                        }

                                                        icon={

                                                            <RadioButtonUncheckedRoundedIcon
                                                                sx={{
                                                                    fontSize: 21,
                                                                    color:
                                                                        SPECIAL_REQUIREMENTS_THEME
                                                                            .textMuted
                                                                }}
                                                            />

                                                        }

                                                        checkedIcon={

                                                            <CheckCircleRoundedIcon
                                                                sx={{
                                                                    fontSize: 21,
                                                                    color:
                                                                        SPECIAL_REQUIREMENTS_THEME
                                                                            .primary
                                                                }}
                                                            />

                                                        }

                                                        sx={{

                                                            p: 0.25,

                                                            mr: 0.8,

                                                            flexShrink: 0

                                                        }}

                                                    />

                                                )}


                                                {/* Requirement text */}

                                                <Box
                                                    sx={{

                                                        flex: 1,

                                                        minWidth: 0

                                                    }}
                                                >

                                                    <Typography
                                                        noWrap

                                                        title={
                                                            requirement
                                                                .specialRequirementName
                                                        }

                                                        sx={{

                                                            fontSize:
                                                                SPECIAL_REQUIREMENTS_FONTS
                                                                    .requirement
                                                                    .size,

                                                            fontWeight:
                                                                selected
                                                                    ? SPECIAL_REQUIREMENTS_FONTS
                                                                        .requirement
                                                                        .selectedWeight
                                                                    : SPECIAL_REQUIREMENTS_FONTS
                                                                        .requirement
                                                                        .weight,

                                                            color:
                                                                SPECIAL_REQUIREMENTS_THEME
                                                                    .text,

                                                            overflow:
                                                                "hidden",

                                                            textOverflow:
                                                                "ellipsis"

                                                        }}
                                                    >
                                                        {
                                                            requirement
                                                                .specialRequirementName
                                                        }
                                                    </Typography>


                                                    {requirement.extraCostLabel && (

                                                        <Typography
                                                            noWrap
                                                            sx={{

                                                                fontSize:
                                                                    SPECIAL_REQUIREMENTS_FONTS
                                                                        .requirementSubtext
                                                                        .size,

                                                                fontWeight:
                                                                    SPECIAL_REQUIREMENTS_FONTS
                                                                        .requirementSubtext
                                                                        .weight,

                                                                mt: 0.15,

                                                                color:
                                                                    SPECIAL_REQUIREMENTS_THEME
                                                                        .textSecondary,

                                                                overflow:
                                                                    "hidden",

                                                                textOverflow:
                                                                    "ellipsis"

                                                            }}
                                                        >
                                                            {
                                                                requirement
                                                                    .extraCostLabel
                                                            }
                                                        </Typography>

                                                    )}

                                                </Box>


                                                {/* Free / Chargeable */}

                                                <Chip

                                                    size="small"

                                                    label={
                                                        isFree
                                                            ? "Free"
                                                            : "Chargeable"
                                                    }

                                                    sx={{

                                                        ml: 0.7,

                                                        flexShrink: 0,

                                                        height: 22,

                                                        maxWidth:
                                                            isFree
                                                                ? 48
                                                                : 82,

                                                        fontSize:
                                                            SPECIAL_REQUIREMENTS_FONTS
                                                                .badge
                                                                .size,

                                                        fontWeight:
                                                            SPECIAL_REQUIREMENTS_FONTS
                                                                .badge
                                                                .weight,

                                                        backgroundColor:
                                                            isFree
                                                                ? SPECIAL_REQUIREMENTS_THEME
                                                                    .free
                                                                    .background
                                                                : SPECIAL_REQUIREMENTS_THEME
                                                                    .chargeable
                                                                    .background,

                                                        color:
                                                            isFree
                                                                ? SPECIAL_REQUIREMENTS_THEME
                                                                    .free
                                                                    .text
                                                                : SPECIAL_REQUIREMENTS_THEME
                                                                    .chargeable
                                                                    .text,

                                                        "& .MuiChip-label": {

                                                            px: 0.8,

                                                            overflow:
                                                                "hidden",

                                                            textOverflow:
                                                                "ellipsis"

                                                        }

                                                    }}

                                                />

                                            </Paper>

                                        );

                                    }
                                )}

                            </Box>

                        )}

                    </Box>

                </Box>

            </Box>


            {/* =================================================
                FOOTER
            ================================================= */}

            <Divider
                sx={{
                    borderColor:
                        SPECIAL_REQUIREMENTS_THEME
                            .borderLight
                }}
            />


            <Box
                sx={{

                    px: 1.75,
                    py: 1,

                    display: "flex",

                    justifyContent:
                        "flex-end",

                    gap: 0.8,

                    backgroundColor:
                        SPECIAL_REQUIREMENTS_THEME
                            .subtleBackground

                }}
            >

                <Button
                    size="small"
                    variant="outlined"
                    onClick={onClose}

                    sx={{

                        minHeight: 32,

                        px: 1.6,

                        textTransform:
                            "none",

                        fontSize:
                            SPECIAL_REQUIREMENTS_FONTS
                                .footer
                                .size,

                        fontWeight:
                            SPECIAL_REQUIREMENTS_FONTS
                                .footer
                                .weight,

                        borderColor:
                            SPECIAL_REQUIREMENTS_THEME
                                .border,

                        color:
                            SPECIAL_REQUIREMENTS_THEME
                                .textSecondary,

                        "&:hover": {

                            borderColor:
                                SPECIAL_REQUIREMENTS_THEME
                                    .textSecondary,

                            backgroundColor:
                                SPECIAL_REQUIREMENTS_THEME
                                    .hoverBackground

                        }

                    }}
                >
                    {isViewMode
                        ? "Close"
                        : "Cancel"}
                </Button>


                {!isViewMode && (

                    <Button
                        size="small"
                        variant="contained"

                        onClick={
                            handleSave
                        }

                        sx={{

                            minHeight: 32,

                            px: 1.8,

                            textTransform:
                                "none",

                            fontSize:
                                SPECIAL_REQUIREMENTS_FONTS
                                    .footer
                                    .size,

                            fontWeight:
                                SPECIAL_REQUIREMENTS_FONTS
                                    .footer
                                    .weight,

                            backgroundColor:
                                SPECIAL_REQUIREMENTS_THEME
                                    .primary,

                            boxShadow:
                                "none",

                            "&:hover": {

                                backgroundColor:
                                    SPECIAL_REQUIREMENTS_THEME
                                        .primaryDark,

                                boxShadow:
                                    "none"

                            }

                        }}
                    >
                        Save Requirements
                    </Button>

                )}

            </Box>

        </Paper>
    );
};

export default HolidaySpecialRequirements;
