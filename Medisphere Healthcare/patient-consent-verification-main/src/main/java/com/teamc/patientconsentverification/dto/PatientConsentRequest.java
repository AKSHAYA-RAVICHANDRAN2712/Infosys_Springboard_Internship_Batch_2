package com.teamc.patientconsentverification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PatientConsentRequest {

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Consent Type is required")
    private String consentType;

    @NotNull(message = "Consent Status is required")
    private Boolean consentStatus;

    @NotBlank(message = "Authorized By is required")
    private String authorizedBy;
}