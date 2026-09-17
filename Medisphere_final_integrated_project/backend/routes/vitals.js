const express = require("express");
const Vitals = require("../models/Vitals");

const router = express.Router();

// Get all vitals
router.get("/", async (req, res) => {
    try {
        const vitals = await Vitals.find({}).sort({ createdAt: -1 });
        res.json(vitals);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch vitals",
            error: err.message
        });
    }
});



// Add new vitals
router.post("/", async (req, res) => {
    try {
        const vitalsData = req.body;
        const vitals = new Vitals(vitalsData);
        await vitals.save();
        res.status(201).json(vitals);
    } catch (err) {
        res.status(500).json({
            message: "Failed to save vitals",
            error: err.message
        });
    }
});

module.exports = router;
