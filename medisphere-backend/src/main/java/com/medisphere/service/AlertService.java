package com.medisphere.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.medisphere.entity.Alert;
import com.medisphere.repository.AlertRepository;

@Service
public class AlertService {

    private final AlertRepository alertRepository;

    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public Alert createAndRouteAlert(Long patientId, String alertType, String message, String assignedDoctorId) {
        String targetRole;
        String targetUser = assignedDoctorId;

        if ("CRITICAL".equalsIgnoreCase(alertType)) {
            targetRole = "DOCTOR";
        } else if ("WARNING".equalsIgnoreCase(alertType)) {
            targetRole = "NURSE";
            targetUser = "DUTY_NURSE_POOL";
        } else {
            targetRole = "ADMIN";
            targetUser = "CLINICAL_ADMIN";
        }

        Alert alert = new Alert(patientId, alertType, message, targetRole, targetUser);
        return alertRepository.save(alert);
    }

    public Alert acknowledgeAlert(Long alertId, String acknowledgedBy, boolean isFalsePositive, String feedback) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found with ID: " + alertId));

        alert.setAcknowledged(true);
        alert.setAcknowledgedAt(LocalDateTime.now());
        alert.setAcknowledgedBy(acknowledgedBy);
        alert.setFalseAlert(isFalsePositive);
        alert.setClinicalFeedback(feedback);

        return alertRepository.save(alert);
    }

    public Map<String, Object> calculateFalseAlertRate() {
        long totalAlerts = alertRepository.count();
        long falseAlerts = alertRepository.countByIsFalseAlertTrue();

        double farPercentage = totalAlerts == 0 ? 0.0 : ((double) falseAlerts / totalAlerts) * 100.0;
        boolean compliant = farPercentage < 3.0;

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalAlerts", totalAlerts);
        metrics.put("falseAlerts", falseAlerts);
        metrics.put("falseAlertRatePercentage", Math.round(farPercentage * 100.0) / 100.0);
        metrics.put("isCompliantWithTarget", compliant);
        metrics.put("status", compliant ? "HEALTHY (FAR < 3%)" : "CRITICAL_DRIFT (FAR >= 3%)");

        return metrics;
    }

    public List<Alert> getPendingAlerts() {
        return alertRepository.findByAcknowledgedFalse();
    }
}