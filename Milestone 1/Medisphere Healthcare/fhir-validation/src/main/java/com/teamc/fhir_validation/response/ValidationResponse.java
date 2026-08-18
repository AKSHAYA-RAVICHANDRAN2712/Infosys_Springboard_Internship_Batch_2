package com.teamc.fhir_validation.response;

import lombok.Data;

import java.util.List;
@Data
public class ValidationResponse {
    private String status;
    private String message;
    private List<String> errors;
}
