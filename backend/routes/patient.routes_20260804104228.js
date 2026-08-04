const express = require("express");
const router = express.Router();

const PatientTwin = require("../models/PatientTwin");

// Create Patient
router.post("/create", async (req, res) => {
    try {
        const patient = await PatientTwin.create(req.body);

        res.status(201).json({
            message: "Patient created successfully",
            data: patient
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;