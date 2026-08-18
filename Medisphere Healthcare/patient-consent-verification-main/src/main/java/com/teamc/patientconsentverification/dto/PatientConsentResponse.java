package com.teamc.patientconsentverification.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientConsentResponse {

    private String status;
    private String message;
    private List<String> errors;

}