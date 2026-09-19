package com.teamc.patientconsentverification.service.impl;
import com.teamc.patientconsentverification.entity.PatientEntity;

import com.teamc.patientconsentverification.client.AuditClient;
import com.teamc.patientconsentverification.dto.AuditLogRequest;
import com.teamc.patientconsentverification.dto.PatientConsentRequest;
import com.teamc.patientconsentverification.dto.PatientConsentResponse;
import com.teamc.patientconsentverification.exception.PatientConsentException;
import com.teamc.patientconsentverification.repository.PatientRepository;
import com.teamc.patientconsentverification.repository.PatientConsentRepository;
import com.teamc.patientconsentverification.entity.PatientConsentEntity;
import java.time.LocalDate;
import com.teamc.patientconsentverification.service.PatientConsentService;
import com.teamc.patientconsentverification.util.ResponseUtil;
import com.teamc.patientconsentverification.validation.PatientConsentValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientConsentServiceImpl implements PatientConsentService {

    @Autowired
    private PatientConsentValidator validator;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PatientConsentRepository consentRepository;

    @Autowired
    private AuditClient auditClient;

    @Override
    public PatientConsentResponse verifyConsent(
            PatientConsentRequest request) {

        try {

            // Validate consent type and consent status
            validator.validate(request);

            // Check whether patient exists
            if (!patientRepository.existsByPatientId(
                    request.getPatientId())) {

                auditClient.log(new AuditLogRequest(
                        "CONSENT_VERIFICATION",
                        "CONSENT",
                        "PatientConsent",
                        request.getPatientId(),
                        "VERIFY",
                        "FAILURE",
                        "Patient not found."
                ));

                return ResponseUtil.failure(
                        "Patient not found.",
                        List.of("Invalid Patient ID")
                );
            }

            // Persist the verified consent so the dashboard and audit trail use real database data.
            PatientEntity patient = patientRepository.findByPatientId(request.getPatientId()).orElse(null);
            PatientConsentEntity consent = consentRepository.findAllByOrderByIdAsc().stream()
                    .filter(c -> c.getPatientId().equalsIgnoreCase(request.getPatientId()) && c.getConsentType().equalsIgnoreCase(request.getConsentType()))
                    .findFirst().orElseGet(PatientConsentEntity::new);
            consent.setPatientId(request.getPatientId());
            consent.setPatientName(patient != null && patient.getPatientName() != null ? patient.getPatientName() : request.getPatientId());
            consent.setConsentType(request.getConsentType());
            consent.setConsentStatus(Boolean.TRUE.equals(request.getConsentStatus()) ? "Granted" : "Not Granted");
            consent.setAuthorizedBy(request.getAuthorizedBy());
            if (consent.getConsentDate() == null) consent.setConsentDate(LocalDate.now());
            if (Boolean.TRUE.equals(request.getConsentStatus()) && consent.getExpiryDate() == null) consent.setExpiryDate(consent.getConsentDate().plusYears(1));
            consentRepository.save(consent);

            // Consent verification successful
            auditClient.log(new AuditLogRequest(
                    "CONSENT_VERIFICATION",
                    "CONSENT",
                    "PatientConsent",
                    request.getPatientId(),
                    "VERIFY",
                    "SUCCESS",
                    "Patient consent verified successfully."
            ));

            return ResponseUtil.success(
                    "Patient consent verified successfully."
            );

        } catch (PatientConsentException e) {

            // Audit consent validation failure
            auditClient.log(new AuditLogRequest(
                    "CONSENT_VERIFICATION",
                    "CONSENT",
                    "PatientConsent",
                    request.getPatientId(),
                    "VERIFY",
                    "FAILURE",
                    e.getMessage()
            ));

            // Re-throw exception so your existing
            // GlobalExceptionHandler handles the response
            throw e;
        }
    }
}