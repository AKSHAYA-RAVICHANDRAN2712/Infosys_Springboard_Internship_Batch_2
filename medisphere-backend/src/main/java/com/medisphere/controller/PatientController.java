package com.medisphere.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medisphere.entity.Patient;
import com.medisphere.repository.PatientRepository;

@RestController
@RequestMapping({"/api/v1/patients", "/api/patients"})
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    public PatientController(PatientRepository patientRepository, PasswordEncoder passwordEncoder) {
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping({"/save", "/register"})
    public ResponseEntity<?> saveOrRegisterPatient(
            @RequestHeader(value = "X-User-Role", required = false) String role,
            @RequestBody Patient patient) {

        // Validate basic payload presence
        if (patient == null) {
            return ResponseEntity.badRequest().body("Error: Patient payload cannot be empty.");
        }

        // Set fallback default email & password if saving vitals/twin without registration credentials
        if (patient.getEmail() == null || patient.getEmail().isBlank()) {
            patient.setEmail("patient_" + System.currentTimeMillis() + "@medisphere.local");
        }

        if (patient.getPassword() == null || patient.getPassword().isBlank()) {
            patient.setPassword("DefaultPass@123");
        }

        // Check if email already exists
        if (patientRepository.existsByEmail(patient.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
        }

        // Encode password before persisting
        patient.setPassword(passwordEncoder.encode(patient.getPassword()));

        Patient savedPatient = patientRepository.save(patient);
        savedPatient.setPassword(null);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedPatient);
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientRepository.findAll());
    }
}