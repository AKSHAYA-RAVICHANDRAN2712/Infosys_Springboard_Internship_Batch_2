package com.medisphere.milestone3.dto;
import com.medisphere.milestone3.enums.*;
public record AlertResponse(Long id,String patientId,String alertType,AlertSeverity severity,String message,Double confidence,AlertStatus status,boolean suppressed,String suppressionReason,int occurrenceCount,String source,String alertTimestamp,String createdAt,String updatedAt) {}
