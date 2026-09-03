const express = require("express");
const Alert = require("../models/Alert");
const {
  analyzeHeartRate,
} = require("../services/alertEngine.cjs");

const router = express.Router();

/*
 * =========================================================
 * GET ALL ALERTS
 * =========================================================
 *
 * Frontend calls:
 *
 * GET /api/alerts
 *
 * Alerts are now loaded from MongoDB instead of
 * hard-coded frontend data.
 */

router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find({})
      .sort({ detectedAt: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      alerts,
    });

  } catch (error) {
    console.error(
      "Failed to fetch alerts:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch alerts",
    });
  }
});


/*
 * =========================================================
 * ANALYZE TELEMETRY
 * =========================================================
 *
 * Frontend sends heart-rate telemetry here.
 *
 * POST /api/alerts/analyze
 *
 * If the Alert Engine detects an anomaly,
 * an alert is stored in MongoDB.
 */

router.post("/analyze", async (req, res) => {
  try {

    const {
      patientId,
      patientName,
      heartRate,
      previousAverage,
    } = req.body;


    /*
     * -----------------------------
     * VALIDATION
     * -----------------------------
     */

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "patientId is required",
      });
    }

    if (!patientName) {
      return res.status(400).json({
        success: false,
        message: "patientName is required",
      });
    }

    if (
      heartRate === undefined ||
      heartRate === null ||
      heartRate === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "heartRate is required",
      });
    }

    if (
      previousAverage === undefined ||
      previousAverage === null ||
      previousAverage === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "previousAverage is required",
      });
    }


    const currentHeartRate =
      Number(heartRate);

    const averageHeartRate =
      Number(previousAverage);


    if (!Number.isFinite(currentHeartRate)) {
      return res.status(400).json({
        success: false,
        message: "heartRate must be a valid number",
      });
    }


    if (
      !Number.isFinite(averageHeartRate) ||
      averageHeartRate <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "previousAverage must be a valid number greater than 0",
      });
    }


    /*
     * -----------------------------
     * RUN ALERT ENGINE
     * -----------------------------
     */

    const analysis =
      analyzeHeartRate({
        heartRate: currentHeartRate,
        previousAverage: averageHeartRate,
      });


    /*
     * -----------------------------
     * NORMAL TELEMETRY
     * -----------------------------
     *
     * No alert is created.
     */

    if (!analysis.alert) {

      return res.status(200).json({
        success: true,

        alertCreated: false,

        patient: {
          id: String(patientId),
          name: String(patientName),
        },

        analysis,
      });
    }


    /*
     * -----------------------------
     * ANOMALY DETECTED
     * -----------------------------
     */

    const alertId =
      `ALT-${Date.now()}`;


    /*
     * Store alert in MongoDB.
     */

    const newAlert =
      await Alert.create({

        alertId,

        patientId:
          String(patientId),

        patientName:
          String(patientName),

        vital:
          "Heart Rate",

        value:
          `${currentHeartRate} bpm`,

        severity:
          analysis.severity,

        status:
          "ACTIVE",

        message:
          analysis.message,

        notes:
          analysis.recommendedActions
            .join(" | "),

        detectedAt:
          new Date(
            analysis.detectedAt
          ),
      });


    /*
     * -----------------------------
     * RETURN CREATED ALERT
     * -----------------------------
     */

    return res.status(201).json({

      success: true,

      alertCreated: true,

      patient: {
        id: String(patientId),
        name: String(patientName),
      },

      alert: newAlert,

      analysis,
    });


  } catch (error) {

    console.error(
      "Real-Time Alert Engine Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Alert analysis failed",
    });
  }
});


/*
 * =========================================================
 * ACKNOWLEDGE ALERT
 * =========================================================
 *
 * PATCH /api/alerts/:alertId/acknowledge
 */

router.patch(
  "/:alertId/acknowledge",
  async (req, res) => {

    try {

      const alert =
        await Alert.findOneAndUpdate(

          {
            alertId:
              req.params.alertId,
          },

          {
            status:
              "ACKNOWLEDGED",

            acknowledgedAt:
              new Date(),
          },

          {
            new: true,
          }
        );


      if (!alert) {

        return res.status(404).json({
          success: false,
          message: "Alert not found",
        });
      }


      return res.status(200).json({
        success: true,
        alert,
      });


    } catch (error) {

      console.error(
        "Failed to acknowledge alert:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to acknowledge alert",
      });
    }
  }
);


/*
 * =========================================================
 * RESOLVE ALERT
 * =========================================================
 *
 * PATCH /api/alerts/:alertId/resolve
 */

router.patch(
  "/:alertId/resolve",
  async (req, res) => {

    try {

      const alert =
        await Alert.findOneAndUpdate(

          {
            alertId:
              req.params.alertId,
          },

          {
            status:
              "RESOLVED",

            resolvedAt:
              new Date(),
          },

          {
            new: true,
          }
        );


      if (!alert) {

        return res.status(404).json({
          success: false,
          message: "Alert not found",
        });
      }


      return res.status(200).json({
        success: true,
        alert,
      });


    } catch (error) {

      console.error(
        "Failed to resolve alert:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to resolve alert",
      });
    }
  }
);


module.exports = router;