package com.teamc.patientconsentverification.dto;

import java.util.List;

public class PatientConsentResponse {

    private String status;
    private String message;
    private List<String> errors;

    public PatientConsentResponse() {
    }

    public PatientConsentResponse(String status, String message, List<String> errors) {
        this.status = status;
        this.message = message;
        this.errors = errors;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }
}
