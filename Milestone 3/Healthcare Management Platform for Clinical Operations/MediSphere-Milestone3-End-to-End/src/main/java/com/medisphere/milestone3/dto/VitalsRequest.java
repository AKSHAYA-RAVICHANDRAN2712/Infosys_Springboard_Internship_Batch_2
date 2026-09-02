package com.medisphere.milestone3.dto;
import jakarta.validation.constraints.*;
public record VitalsRequest(@NotBlank String patientId,@NotNull @DecimalMin("0") @DecimalMax("250") Double heartRate,@NotNull @DecimalMin("0") @DecimalMax("300") Double systolicBp,@NotNull @DecimalMin("0") @DecimalMax("200") Double diastolicBp,@NotNull @DecimalMin("25") @DecimalMax("45") Double temperature,@NotNull @DecimalMin("0") @DecimalMax("100") Double spo2,@NotNull @DecimalMin("0") @DecimalMax("100") Double respiratoryRate) {}
