package com.teamc.fhir_validation.service;

import com.teamc.fhir_validation.client.AuditClient;
import com.teamc.fhir_validation.dto.AuditLogRequest;
import com.teamc.fhir_validation.dto.PatientRequest;
import com.teamc.fhir_validation.entity.PatientEntity;
import com.teamc.fhir_validation.repository.PatientRepository;
import com.teamc.fhir_validation.response.ValidationResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class PatientValidationService {

    private final PatientRepository patientRepository;
    private final AuditClient auditClient;

    public PatientValidationService(
            PatientRepository patientRepository,
            AuditClient auditClient) {

        this.patientRepository = patientRepository;
        this.auditClient = auditClient;
    }

    public ValidationResponse validatePatient(PatientRequest request) {

        List<String> errors = new ArrayList<>();

        validateResourceType(request, errors);
        validatePatientId(request, errors);
        validateGender(request, errors);
        validateBirthDate(request, errors);

        ValidationResponse response = new ValidationResponse();

        if (errors.isEmpty()) {

            // Check if patient already exists
            if (patientRepository.existsByPatientId(request.getId())) {

                response.setStatus("FAILED");
                response.setMessage("Patient ID already exists.");
                response.setErrors(
                        List.of("Patient ID already exists.")
                );

                // Send failure audit
                auditClient.log(new AuditLogRequest(
                        "FHIR_VALIDATION",
                        "FHIR",
                        "Patient",
                        request.getId(),
                        "VALIDATE",
                        "FAILURE",
                        "Patient ID already exists."
                ));

                return response;
            }

            // Create patient
            PatientEntity patientEntity = PatientEntity.builder()
                    .patientId(request.getId())
                    .resourceType(request.getResourceType())
                    .active(request.getActive())
                    .gender(request.getGender())
                    .birthDate(request.getBirthDate())
                    .build();

            // Save patient
            patientRepository.save(patientEntity);

            response.setStatus("SUCCESS");
            response.setMessage(
                    "FHIR Patient Resource is valid and saved successfully."
            );

            // Send success audit
            auditClient.log(new AuditLogRequest(
                    "FHIR_VALIDATION",
                    "FHIR",
                    "Patient",
                    request.getId(),
                    "VALIDATE",
                    "SUCCESS",
                    "FHIR Patient Resource is valid and saved successfully."
            ));

        } else {

            response.setStatus("FAILED");
            response.setMessage("Validation Failed");

            // Send failure audit
            auditClient.log(new AuditLogRequest(
                    "FHIR_VALIDATION",
                    "FHIR",
                    "Patient",
                    request.getId(),
                    "VALIDATE",
                    "FAILURE",
                    "FHIR Patient Resource validation failed."
            ));
        }

        response.setErrors(errors);

        return response;
    }

    private void validateResourceType(
            PatientRequest request,
            List<String> errors) {

        String resourceType = request.getResourceType();

        if (resourceType == null || resourceType.isBlank()) {
            errors.add("Resource Type is required");
            return;
        }

        if (!resourceType.equalsIgnoreCase("Patient")) {
            errors.add("Resource Type must be Patient");
        }
    }

    private void validatePatientId(
            PatientRequest request,
            List<String> errors) {

        String id = request.getId();

        if (id == null || id.isBlank()) {
            errors.add("Patient ID is required");
        }
    }

    private void validateGender(
            PatientRequest request,
            List<String> errors) {

        String gender = request.getGender();

        if (gender == null || gender.isBlank()) {
            errors.add("Gender is required");
            return;
        }

        gender = gender.toLowerCase();

        if (!gender.equals("male")
                && !gender.equals("female")
                && !gender.equals("other")
                && !gender.equals("unknown")) {

            errors.add(
                    "Invalid Gender. Allowed values are: male, female, other, unknown"
            );
        }
    }

    private void validateBirthDate(
            PatientRequest request,
            List<String> errors) {

        String birthDate = request.getBirthDate();

        if (birthDate == null || birthDate.isBlank()) {
            errors.add("Birth Date is required");
            return;
        }

        try {

            DateTimeFormatter formatter =
                    DateTimeFormatter.ofPattern("yyyy-MM-dd");

            LocalDate date =
                    LocalDate.parse(birthDate, formatter);

            if (date.isAfter(LocalDate.now())) {
                errors.add("Birth Date cannot be in the future");
            }

        } catch (DateTimeParseException e) {

            errors.add(
                    "Birth Date must be in yyyy-MM-dd format"
            );
        }
    }
}