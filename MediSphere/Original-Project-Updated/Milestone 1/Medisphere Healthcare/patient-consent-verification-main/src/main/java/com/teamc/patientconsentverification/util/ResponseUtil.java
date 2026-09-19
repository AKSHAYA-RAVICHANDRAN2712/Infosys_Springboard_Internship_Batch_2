package com.teamc.patientconsentverification.util;

import com.teamc.patientconsentverification.dto.PatientConsentResponse;

import java.util.Collections;
import java.util.List;

public class ResponseUtil {

    private ResponseUtil() {
    }

    public static PatientConsentResponse success(String message) {
        return new PatientConsentResponse(
                "SUCCESS",
                message,
                Collections.emptyList()
        );
    }

    public static PatientConsentResponse failure(String message, List<String> errors) {
        return new PatientConsentResponse(
                "FAILED",
                message,
                errors
        );
    }
}