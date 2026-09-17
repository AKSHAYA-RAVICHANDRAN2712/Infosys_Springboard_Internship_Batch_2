const ALERT_RULES = {
    mediumDeviationPercentage: 25,
    highDeviationPercentage: 50,
};

function analyzeHeartRate({
    heartRate,
    previousAverage,
}) {
    // ---------------------------------------------
    // Validation
    // ---------------------------------------------

    if (
        typeof heartRate !== "number" ||
        typeof previousAverage !== "number"
    ) {
        throw new Error(
            "heartRate and previousAverage must be numbers"
        );
    }

    if (!Number.isFinite(heartRate)) {
        throw new Error("heartRate must be a valid number");
    }

    if (!Number.isFinite(previousAverage)) {
        throw new Error(
            "previousAverage must be a valid number"
        );
    }

    if (previousAverage <= 0) {
        throw new Error(
            "previousAverage must be greater than 0"
        );
    }

    if (heartRate < 0) {
        throw new Error(
            "heartRate cannot be negative"
        );
    }

    // ---------------------------------------------
    // Calculate deviation
    // ---------------------------------------------

    const difference =
        heartRate - previousAverage;

    const deviationPercentage =
        Math.abs(
            difference / previousAverage
        ) * 100;

    // ---------------------------------------------
    // Determine severity
    // ---------------------------------------------

    let severity = "NORMAL";

    if (
        deviationPercentage >=
        ALERT_RULES.highDeviationPercentage
    ) {
        severity = "HIGH";
    } else if (
        deviationPercentage >=
        ALERT_RULES.mediumDeviationPercentage
    ) {
        severity = "MEDIUM";
    }

    const telemetry = {
        heartRate,
        previousAverage,
        difference,
        deviationPercentage: Number(
            deviationPercentage.toFixed(1)
        ),
    };

    // ---------------------------------------------
    // NORMAL
    // ---------------------------------------------

    if (severity === "NORMAL") {
        return {
            alert: false,

            severity: "NORMAL",

            alertType: "NORMAL_HEART_RATE",

            message:
                "No significant cardiac anomaly detected.",

            telemetry,

            recommendedActions: [],

            detectedAt: new Date().toISOString(),
        };
    }

    // ---------------------------------------------
    // ALERT
    // ---------------------------------------------

    return {
        alert: true,

        severity,

        alertType:
            "POSSIBLE_CARDIAC_ANOMALY",

        message:
            severity === "HIGH"
                ? "High-risk cardiac anomaly detected. Heart rate differs significantly from the patient's previous average."
                : "Moderate cardiac anomaly detected. Heart rate differs significantly from the patient's previous average.",

        telemetry,

        recommendedActions: [
            "Notify cardiologist",
            "Consider ECG review",
            "Display dashboard alert",
        ],

        detectedAt: new Date().toISOString(),
    };
}

module.exports = {
    analyzeHeartRate,
};