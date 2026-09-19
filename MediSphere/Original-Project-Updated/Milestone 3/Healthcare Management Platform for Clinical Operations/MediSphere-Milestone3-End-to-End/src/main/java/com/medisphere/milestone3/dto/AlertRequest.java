package com.medisphere.milestone3.dto;
import com.medisphere.milestone3.enums.AlertSeverity;
import jakarta.validation.constraints.*;
public record AlertRequest(@NotBlank String patientId,@NotBlank String alertType,@NotNull AlertSeverity severity,@NotBlank String message,Double confidence,String timestamp,String source) {}
