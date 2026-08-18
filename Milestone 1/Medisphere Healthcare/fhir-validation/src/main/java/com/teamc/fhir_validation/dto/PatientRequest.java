package com.teamc.fhir_validation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
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

}
