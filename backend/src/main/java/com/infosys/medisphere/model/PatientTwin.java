package com.infosys.medisphere.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "patient_twins")
public class PatientTwin {

    @Id
    private String patientId;
    private String name;
    private String assignedDoctorId;
    
    private double completenessPercentage;
    private boolean isTwinValid;
    
    // Line 20: Added <String, Object>
    private Map<String, Object> vitals;
    private LocalDateTime lastUpdated;

    public PatientTwin() {
        this.lastUpdated = LocalDateTime.now();
    }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAssignedDoctorId() { return assignedDoctorId; }
    public void setAssignedDoctorId(String assignedDoctorId) { this.assignedDoctorId = assignedDoctorId; }

    public double getCompletenessPercentage() { return completenessPercentage; }
    public void setCompletenessPercentage(double completenessPercentage) { this.completenessPercentage = completenessPercentage; }

    public boolean isTwinValid() { return isTwinValid; }
    public void setTwinValid(boolean twinValid) { isTwinValid = twinValid; }

    // Line 42 & 43: Added <String, Object>
    public Map<String, Object> getVitals() { return vitals; }
    public void setVitals(Map<String, Object> vitals) { this.vitals = vitals; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}