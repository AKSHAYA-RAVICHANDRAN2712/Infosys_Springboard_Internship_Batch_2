package com.medisphere.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medisphere.entity.Alert;
import com.medisphere.service.AlertService;

@RestController
@RequestMapping("/api/v1/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @PostMapping("/route")
    public ResponseEntity<Alert> routeAlert(
            @RequestParam Long patientId,
            @RequestParam String alertType,
            @RequestParam String message,
            @RequestParam(required = false, defaultValue = "DOC-101") String doctorId) {
        return ResponseEntity.ok(alertService.createAndRouteAlert(patientId, alertType, message, doctorId));
    }

    @PostMapping("/{id}/acknowledge")
    public ResponseEntity<Alert> acknowledgeAlert(
            @PathVariable Long id,
            @RequestParam String clinicianId,
            @RequestParam(defaultValue = "false") boolean isFalsePositive,
            @RequestParam(required = false, defaultValue = "Acknowledged and attended.") String feedback) {
        return ResponseEntity.ok(alertService.acknowledgeAlert(id, clinicianId, isFalsePositive, feedback));
    }

    @GetMapping("/metrics/far")
    public ResponseEntity<Map<String, Object>> getFalseAlertRateMetrics() {
        return ResponseEntity.ok(alertService.calculateFalseAlertRate());
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingAlerts() {
        return ResponseEntity.ok(alertService.getPendingAlerts());
    }
}