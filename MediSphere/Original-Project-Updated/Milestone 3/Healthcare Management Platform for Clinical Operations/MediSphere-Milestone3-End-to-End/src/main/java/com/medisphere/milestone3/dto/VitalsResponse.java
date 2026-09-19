package com.medisphere.milestone3.dto;
public record VitalsResponse(Long id,String patientId,Double heartRate,String heartRateStatus,Double systolicBp,String systolicBpStatus,Double diastolicBp,String diastolicBpStatus,Double temperature,String temperatureStatus,Double spo2,String spo2Status,Double respiratoryRate,String respiratoryRateStatus,String bloodpressureStatus,String overallStatus) {}
