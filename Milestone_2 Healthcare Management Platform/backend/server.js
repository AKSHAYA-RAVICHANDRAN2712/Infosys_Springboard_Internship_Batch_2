require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

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

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

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

app.get("/", (req, res) => {
  res.send("Hospital Management API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
