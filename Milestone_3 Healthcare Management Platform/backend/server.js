require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Wearable Device Integration
const {
  startWearableSimulator
} = require("./services/wearableSimulator");

// Kafka Streams Anomaly Detection
const {
  startKafkaAnomalyDetector
} = require("./services/kafkaAnomalyDetector");

const appointmentRoutes = require("./routes/appointments");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctors");
const fhirResourceRoutes = require("./routes/fhirResources");
const vitalsRoutes = require("./routes/vitals");
const labResultRoutes = require("./routes/labResults");
const kafkaEventRoutes = require("./routes/kafkaEvents");
const userRoutes = require("./routes/users");
const employeeRoutes = require("./routes/employees");
const cvdRoutes = require("./routes/cvd");
const diabetesRoutes = require("./routes/diabetes");

// Module 3 - Real-Time Alert Engine
const alertRoutes = require("./routes/alerts.cjs");

const app = express();

// =========================================================
// DATABASE
// =========================================================

connectDB();


// =========================================================
// MIDDLEWARE
// =========================================================

app.use(cors());
app.use(express.json());


// =========================================================
// EXISTING API ROUTES
// =========================================================

app.use("/api/appointments", appointmentRoutes);

app.use("/api/doctors", doctorRoutes);

app.use("/api/patients", patientRoutes);

app.use("/api/fhir-resources", fhirResourceRoutes);

app.use("/api/vitals", vitalsRoutes);

app.use("/api/lab-results", labResultRoutes);

app.use("/api/kafka-events", kafkaEventRoutes);

app.use("/api/users", userRoutes);

app.use("/api/employees", employeeRoutes);

app.use("/api/cvd", cvdRoutes);

app.use("/api/diabetes", diabetesRoutes);


// =========================================================
// MODULE 3 - REAL-TIME ALERT ENGINE
// =========================================================

app.use("/api/alerts", alertRoutes);


// =========================================================
// ROOT ROUTE
// =========================================================

app.get("/", (req, res) => {
  res.send("Hospital Management API Running...");
});


// =========================================================
// START SERVER
// =========================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

  // Start wearable device simulator
  startWearableSimulator();

  // Start Kafka Streams anomaly detector
  startKafkaAnomalyDetector();

});