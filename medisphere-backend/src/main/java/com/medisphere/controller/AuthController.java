package com.medisphere.controller;

import com.medisphere.entity.Patient;
import com.medisphere.repository.PatientRepository;
import com.medisphere.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final PatientRepository patientRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            PatientRepository patientRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder) {

        this.patientRepository = patientRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        Patient patient = patientRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        // Email not found
        if (patient == null) {

            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        // Check BCrypt password
        if (!passwordEncoder.matches(
                request.getPassword(),
                patient.getPassword())) {

            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        // Generate JWT
        String token =
                jwtService.generateToken(
                        patient.getEmail()
                );

        return ResponseEntity.ok(
                new LoginResponse(
                        token,
                        patient.getId(),
                        patient.getName(),
                        patient.getEmail()
                )
        );
    }

    // =========================
    // Login Request
    // =========================

    public static class LoginRequest {

        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // =========================
    // Login Response
    // =========================

    public static class LoginResponse {

        private String token;
        private Long id;
        private String name;
        private String email;

        public LoginResponse(
                String token,
                Long id,
                String name,
                String email) {

            this.token = token;
            this.id = id;
            this.name = name;
            this.email = email;
        }

        public String getToken() {
            return token;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getEmail() {
            return email;
        }
    }
}