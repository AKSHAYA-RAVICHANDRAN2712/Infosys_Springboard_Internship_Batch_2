const mongoose = require("mongoose");

const patientTwinSchema = new mongoose.Schema({
    patientId: {
        type: String,
        required: true,
        unique: true
    },

    demographics: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"]
        },
        dateOfBirth: {
            type: Date
        },
        phone: {
            type: String
        },
        address: {
            type: String
        }
    },

    medicalHistory: [{
        condition: {
            type: String,
            required: true
        },
        diagnosedDate: {
            type: Date
        },
        status: {
            type: String,
            enum: ["Active", "Recovered", "Chronic"]
        }
    }],

    medications: [{
        name: {
            type: String,
            required: true
        },
        dosage: {
            type: String
        },
        frequency: {
            type: String
        }
    }],

    allergies: [{
        substance: {
            type: String,
            required: true
        },
        reaction: {
            type: String
        }
    }],

    latestVitals: {
        bloodPressure: {
            type: String
        },
        heartRate: {
            type: Number
        },
        temperature: {
            type: Number
        },
        oxygenSaturation: {
            type: Number
        }
    },

    lastUpdated: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("PatientTwin", patientTwinSchema);