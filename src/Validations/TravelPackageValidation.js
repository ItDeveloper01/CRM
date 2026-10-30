export const validateTravelPackages = (packages = []) => {
    const packageErrors = {};

    packages.forEach((pkg, index) => {
        const errors = {};

        // From Date
        if (!pkg.fromDate) {
            errors.fromDate = "From Date is required.";
        }

        // To Date
        if (!pkg.toDate) {
            errors.toDate = "To Date is required.";
        } else if (
            pkg.fromDate &&
            new Date(pkg.toDate) < new Date(pkg.fromDate)
        ) {
            errors.toDate =
                "To Date cannot be earlier than From Date.";
        }

        // Flexible Days
        if (
            pkg.isFlexibleDates &&
            (
                pkg.flexibleDays === null ||
                pkg.flexibleDays === undefined ||
                pkg.flexibleDays === "" ||
                !Number.isFinite(Number(pkg.flexibleDays)) ||
                Number(pkg.flexibleDays) <= 0
            )
        ) {
            errors.flexibleDays =
                "Flexible Days must be greater than 0.";
        }

        // Budget Preference
        if (
            pkg.budgetPreference === null ||
            pkg.budgetPreference === undefined ||
            pkg.budgetPreference === ""
        ) {
            errors.budgetPreference =
                "Package Preference is required.";
        }

        // Trip Budget
        // if (
        //     pkg.tripBudget === null ||
        //     pkg.tripBudget === undefined ||
        //     String(pkg.tripBudget).trim() === ""
        // ) {
        //     errors.tripBudget = "Trip Budget is required.";
        // } else if (
        //     !Number.isFinite(Number(pkg.tripBudget)) ||
        //     Number(pkg.tripBudget) <= 0
        // ) {
        //     errors.tripBudget =
        //         "Trip Budget must be greater than 0.";
        // }

         if (!String(pkg.tripBudget ?? "").trim()) {
            errors.tripBudget =
                "Trip Budget is required.";
        }


        // Hotel Category
        if (
            pkg.hotelCategory === null ||
            pkg.hotelCategory === undefined ||
            pkg.hotelCategory === ""
        ) {
            errors.hotelCategory =
                "Hotel Category is required.";
        }

        // Meal Plan
        if (
            pkg.mealPlan === null ||
            pkg.mealPlan === undefined ||
            pkg.mealPlan === ""
        ) {
            errors.mealPlan = "Meal Plan is required.";
        }

        // Vehicle Type
        if (
            pkg.vehicleType === null ||
            pkg.vehicleType === undefined ||
            pkg.vehicleType === ""
        ) {
            errors.vehicleType =
                "Vehicle Type is required.";
        }

        // Trip Description
        if (!String(pkg.tripDescription ?? "").trim()) {
            errors.tripDescription =
                "Trip Description is required.";
        }

        // Arrival City
        if (!String(pkg.arrivalCity ?? "").trim()) {
            errors.arrivalCity =
                "Arrival City is required.";
        }

        // Departure City
        if (!String(pkg.departureCity ?? "").trim()) {
            errors.departureCity =
                "Departure City is required.";
        }

        // Destinations
        // if (!String(pkg.destinations ?? "").trim()) {
        //     errors.destinations =
        //         "Destinations are required.";
        // }

        // Sketch Itinerary
        if (!String(pkg.sketchItinerary ?? "").trim()) {
            errors.sketchItinerary =
                "Sketch Itinerary is required.";
        }

        // Store errors separately for each package
        if (Object.keys(errors).length > 0) {
            packageErrors[index] = errors;
        }
    });

    return packageErrors;
};