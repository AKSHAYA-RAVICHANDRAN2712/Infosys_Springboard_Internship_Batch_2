package com.teamc.fhir_validation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PatientRequest {
    @NotBlank(message = "Resource Type is required")
    private String resourceType;
    @NotBlank(message = "Patient ID is required")
    private String id;
    @NotNull(message = "Active field is required")
    private Boolean active;
    @NotBlank(message = "Gender is required")
    private String gender;
    @NotBlank(message = "Birth Date is required")
    private String birthDate;

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }
}
