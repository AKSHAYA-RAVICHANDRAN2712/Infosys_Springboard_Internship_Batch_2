package com.infosys.medisphere.service;

import com.infosys.medisphere.model.PatientTwin;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TwinCompletenessService {

    // Added <String> generic type parameter on Line 10
    private static final List<String> REQUIRED_FIELDS = List.of(
        "name", "assignedDoctorId", "heartRate", "bloodPressure", "bodyTemperature", "spO2"
    );

    public double calculateCompleteness(PatientTwin twin) {
        int presentCount = 0;

        if (twin.getName() != null && !twin.getName().trim().isEmpty()) presentCount++;
        if (twin.getAssignedDoctorId() != null && !twin.getAssignedDoctorId().trim().isEmpty()) presentCount++;

        if (twin.getVitals() != null) {
            if (twin.getVitals().containsKey("heartRate")) presentCount++;
            if (twin.getVitals().containsKey("bloodPressure")) presentCount++;
            if (twin.getVitals().containsKey("bodyTemperature")) presentCount++;
            if (twin.getVitals().containsKey("spO2")) presentCount++;
        }

        double score = ((double) presentCount / REQUIRED_FIELDS.size()) * 100.0;
        twin.setCompletenessPercentage(score);
        twin.setTwinValid(score >= 95.0);

        return score;
    }
}