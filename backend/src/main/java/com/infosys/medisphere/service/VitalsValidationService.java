package com.infosys.medisphere.service;

import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class VitalsValidationService {

    // Line 9: Added <String, Object>
    public boolean validateVitals(Map<String, Object> vitals) {
        if (vitals == null || vitals.isEmpty()) {
            return false;
        }

        if (vitals.containsKey("heartRate")) {
            double hr = Double.parseDouble(vitals.get("heartRate").toString());
            if (hr < 40 || hr > 180) return false;
        }

        if (vitals.containsKey("bloodPressure")) {
            double bp = Double.parseDouble(vitals.get("bloodPressure").toString());
            if (bp < 70 || bp > 190) return false;
        }

        if (vitals.containsKey("spO2")) {
            double spo2 = Double.parseDouble(vitals.get("spO2").toString());
            if (spo2 < 70 || spo2 > 100) return false;
        }

        if (vitals.containsKey("bodyTemperature")) {
            double temp = Double.parseDouble(vitals.get("bodyTemperature").toString());
            if (temp < 35.0 || temp > 41.0) return false;
        }

        return true;
    }
}