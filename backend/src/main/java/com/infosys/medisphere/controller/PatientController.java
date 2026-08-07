package com.infosys.medisphere.controller;

import com.infosys.medisphere.model.PatientTwin;
import com.infosys.medisphere.service.TwinCompletenessService;
import com.infosys.medisphere.service.VitalsValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/v1/patients")
@CrossOrigin(origins = "*") // Allow React frontend to connect
public class PatientController {

    // In-memory Database Replacement (Stores data in RAM)
    private static final Map<String, PatientTwin> mockDatabase = new ConcurrentHashMap<>();

    @Autowired
    private TwinCompletenessService completenessService;

    @Autowired
    private VitalsValidationService vitalsValidationService;

    @PostMapping("/save")
    public ResponseEntity<?> savePatientData(
            @RequestHeader("X-User-Role") String userRole,
            @RequestBody PatientTwin twin) {

        // 1. RBAC Guardrail
        if (!"PROVIDER".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access Denied: Only Providers can create or update records.");
        }

        // 2. Vitals Range Guardrail
        if (!vitalsValidationService.validateVitals(twin.getVitals())) {
            return ResponseEntity.badRequest()
                    .body("Validation Error: Vitals fall outside safe physiological ranges.");
        }

        // 3. Completeness Engine Check (>95%)
        double completeness = completenessService.calculateCompleteness(twin);
        if (completeness < 95.0) {
            return ResponseEntity.badRequest()
                    .body("Completeness Error: Digital Twin completeness (" + completeness + "%) is below the required 95% threshold.");
        }

        // 4. Save to In-Memory Map (No MongoDB Required!)
        mockDatabase.put(twin.getPatientId(), twin);
        return ResponseEntity.ok(twin);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPatientById(
            @RequestHeader("X-User-Role") String userRole,
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String id) {

        // RBAC Authorization Check
        if ("PATIENT".equalsIgnoreCase(userRole) && !userId.equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access Denied: You are only allowed to view your own record.");
        }

        // Fetch from In-Memory Map
        PatientTwin twin = mockDatabase.get(id);
        if (twin != null) {
            return ResponseEntity.ok(twin);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Patient record not found in memory.");
        }
    }
}