const express = require("express");
const router = express.Router();

const PatientTwin = require("../models/PatientTwin");

// CREATE PATIENT
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

// GET ALL PATIENTS
router.get("/", async (req, res) => {
    try {
        const patients = await PatientTwin.find();

        res.status(200).json(patients);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET SINGLE PATIENT BY PATIENT ID
router.get("/:patientId", async (req, res) => {
    try {

        const patient = await PatientTwin.findOne({
            patientId: req.params.patientId
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        res.status(200).json(patient);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

module.exports = router;