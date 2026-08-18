package com.teamc.fhir_validation.controller;

import com.teamc.fhir_validation.dto.PatientRequest;
import com.teamc.fhir_validation.response.ValidationResponse;
import com.teamc.fhir_validation.service.PatientValidationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fhir/patient")
@CrossOrigin(origins = "*")
public class PatientValidationController {
    private final PatientValidationService patientValidationService;
    public PatientValidationController(
            PatientValidationService patientValidationService){
        this.patientValidationService = patientValidationService;
    }
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("FHIR validation service is UP");
    }

    @PostMapping("/validate")
    public ResponseEntity<ValidationResponse> validatePatient(
          @Valid @RequestBody PatientRequest patientRequest) {

        System.out.println("Request Received: " + patientRequest);
        ValidationResponse response =
                patientValidationService.validatePatient(patientRequest);
        if ("SUCCESS".equals(response.getStatus())) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }
}
