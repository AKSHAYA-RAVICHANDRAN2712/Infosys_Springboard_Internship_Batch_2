package com.medisphere.controller;

import com.medisphere.entity.Patient;
import com.medisphere.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    public PatientController(
            PatientRepository patientRepository,
            PasswordEncoder passwordEncoder) {

        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Patient patient) {

        if (patientRepository.existsByEmail(patient.getEmail())) {
            return ResponseEntity.badRequest()
                    .body("Email already registered");
        }

        patient.setPassword(
                passwordEncoder.encode(patient.getPassword())
        );

        Patient savedPatient = patientRepository.save(patient);

        savedPatient.setPassword(null);

        return ResponseEntity.ok(savedPatient);
    }

    @GetMapping
    public ResponseEntity<?> getAllPatients() {
        return ResponseEntity.ok(patientRepository.findAll());
    }
}