package com.teamc.patientconsentverification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PatientConsentRequest {

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Consent Type is required")
    private String consentType;

    @NotNull(message = "Consent Status is required")
    private Boolean consentStatus;

    @NotBlank(message = "Authorized By is required")
    private String authorizedBy;

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getConsentType() {
        return consentType;
    }

    public void setConsentType(String consentType) {
        this.consentType = consentType;
    }

    public Boolean getConsentStatus() {
        return consentStatus;
    }

    public void setConsentStatus(Boolean consentStatus) {
        this.consentStatus = consentStatus;
    }

    public String getAuthorizedBy() {
        return authorizedBy;
    }

    public void setAuthorizedBy(String authorizedBy) {
        this.authorizedBy = authorizedBy;
    }
}
