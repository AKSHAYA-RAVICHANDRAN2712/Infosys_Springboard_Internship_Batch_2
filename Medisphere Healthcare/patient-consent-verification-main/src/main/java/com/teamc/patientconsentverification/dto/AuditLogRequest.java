package com.teamc.patientconsentverification.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogRequest {

    private String eventType;
    private String module;
    private String resourceType;
    private String resourceId;
    private String action;
    private String status;
    private String message;
}