package com.teamc.patientconsentverification.service.impl;

import com.teamc.patientconsentverification.client.AuditClient;
import com.teamc.patientconsentverification.dto.AuditLogRequest;
import com.teamc.patientconsentverification.dto.PatientConsentRequest;
import com.teamc.patientconsentverification.dto.PatientConsentResponse;
import com.teamc.patientconsentverification.exception.PatientConsentException;
import com.teamc.patientconsentverification.repository.PatientRepository;
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