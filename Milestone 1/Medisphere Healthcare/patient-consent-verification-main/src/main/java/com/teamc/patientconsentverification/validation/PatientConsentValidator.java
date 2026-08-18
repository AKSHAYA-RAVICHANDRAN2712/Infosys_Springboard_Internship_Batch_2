package com.teamc.patientconsentverification.validation;

import com.teamc.patientconsentverification.dto.PatientConsentRequest;
import com.teamc.patientconsentverification.exception.PatientConsentException;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PatientConsentValidator {

    private static final List<String> VALID_CONSENT_TYPES = List.of(
            "SURGERY",
            "TREATMENT",
            "DATA_SHARING",
            "EMERGENCY"
    );

    public void validate(PatientConsentRequest request) {

        if (!VALID_CONSENT_TYPES.contains(request.getConsentType().toUpperCase())) {
            throw new PatientConsentException(
                    "Invalid consent type. Allowed values: SURGERY, TREATMENT, DATA_SHARING, EMERGENCY"
            );
        }

        if (Boolean.FALSE.equals(request.getConsentStatus())) {
            throw new PatientConsentException(
                    "Patient consent is not approved."
            );
        }
    }
}