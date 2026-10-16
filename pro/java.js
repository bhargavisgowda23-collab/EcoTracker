
// Demonstration emission factors
const FACTORS = {
    electricity: 0.70, // kg CO2e per kWh
    petrol: 2.31,      // kg CO2e per litre
    bus: 0.10,         // illustrative kg CO2e per passenger-km
    waste: 0.15        // illustrative kg CO2e per kg of waste
};

// Load previously saved green points and activities
let points = Number(localStorage.getItem("ecoPoints")) || 0;
let activities = Number(localStorage.getItem("ecoActivities")) || 0;

// Determine the achievement badge
function getBadge(pointsValue) {
    if (pointsValue >= 100) {
        return "Eco Champion";
    }

    if (pointsValue >= 30) {
        return "Green Starter";
    }

    return "Beginner";
}

// Update dashboard information
function updateDashboard(total, units) {
    document.getElementById("footprint").textContent =
        total.toFixed(2) + " kg";

    document.getElementById("electricity").textContent =
        units + " kWh";

    document.getElementById("points").textContent = points;
    document.getElementById("activities").textContent = activities;

    document.getElementById("badge").textContent =
        getBadge(points);
}

// Scroll to calculator
document.getElementById("scrollToCalculator")
    .addEventListener("click", function () {
        document.getElementById("calculator")
            .scrollIntoView({ behavior: "smooth" });
    });

// Calculate carbon footprint
document.getElementById("carbonForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const units = Number(document.getElementById("units").value);
        const fuel = Number(document.getElementById("fuel").value);
        const travel = Number(document.getElementById("travel").value);
        const waste = Number(document.getElementById("waste").value);

        // Validate user inputs
        if (
            !Number.isFinite(units) || units < 0 ||
            !Number.isFinite(fuel) || fuel < 0 ||
            !Number.isFinite(travel) || travel < 0 ||
            !Number.isFinite(waste) || waste < 0
        ) {
            alert("Please enter valid, non-negative values.");
            return;
        }

        // Calculate emissions for each activity
        const electricityEmissions = units * FACTORS.electricity;
        const fuelEmissions = fuel * FACTORS.petrol;
        const travelEmissions = travel * FACTORS.bus;
        const wasteEmissions = waste * 4 * FACTORS.waste;

        // Calculate total monthly emissions
        const total =
            electricityEmissions +
            fuelEmissions +
            travelEmissions +
            wasteEmissions;

        // Display results
        document.getElementById("result").style.display = "block";

        document.getElementById("total").textContent =
            total.toFixed(2) +
            " kg CO₂e per month (estimated)";

        document.getElementById("breakdown").innerHTML =
            "Electricity: " +
            electricityEmissions.toFixed(2) + " kg CO₂e<br>" +
            "Petrol: " +
            fuelEmissions.toFixed(2) + " kg CO₂e<br>" +
            "Bus travel: " +
            travelEmissions.toFixed(2) + " kg CO₂e<br>" +
            "Waste: " +
            wasteEmissions.toFixed(2) + " kg CO₂e";

        // Give recommendations based on emissions
        let advice =
            "Consider saving electricity, reducing waste, and choosing lower-emission transport.";

        if (total > 200) {
            advice =
                "Review your electricity, fuel, and transport usage to identify opportunities for reducing emissions.";
        } else if (total < 50) {
            advice =
                "Great start! Continue tracking your consumption and maintaining eco-friendly habits.";
        }

        document.getElementById("advice").textContent =
            "Recommendation: " + advice;

        // Save the latest calculation
        localStorage.setItem("ecoLastTotal", total.toFixed(2));
        localStorage.setItem("ecoLastUnits", String(units));

        // Refresh dashboard
        updateDashboard(total, units);
    });

// Complete the weekly green challenge
document.getElementById("completeChallenge")
    .addEventListener("click", function () {

        points += 10;
        activities += 1;

        // Save points and activities
        localStorage.setItem("ecoPoints", String(points));
        localStorage.setItem("ecoActivities", String(activities));

        document.getElementById("challengeMessage").textContent =
            "Well done! 10 green points added. Total points: " + points;

        // Refresh dashboard
        updateDashboard(
            Number(localStorage.getItem("ecoLastTotal")) || 0,
            Number(localStorage.getItem("ecoLastUnits")) || 0
        );
    });

// Restore the last calculation after refreshing
const savedTotal = localStorage.getItem("ecoLastTotal");
const savedUnits = localStorage.getItem("ecoLastUnits");

if (savedTotal !== null && savedUnits !== null) {
    updateDashboard(Number(savedTotal), Number(savedUnits));
} else {
    updateDashboard(0, 0);
}
