package com.teamc.careplansafety.dto;
import jakarta.validation.constraints.*;
public class CarePlanSafetyRequest {
 @NotBlank private String patientId; @NotBlank private String medication; @NotNull @Positive private Double dosage; @NotBlank private String unit; @NotBlank private String frequency; @NotNull @Positive private Integer duration;
 public CarePlanSafetyRequest(){}
 public String getPatientId(){return patientId;} public void setPatientId(String v){patientId=v;} public String getMedication(){return medication;} public void setMedication(String v){medication=v;} public Double getDosage(){return dosage;} public void setDosage(Double v){dosage=v;} public String getUnit(){return unit;} public void setUnit(String v){unit=v;} public String getFrequency(){return frequency;} public void setFrequency(String v){frequency=v;} public Integer getDuration(){return duration;} public void setDuration(Integer v){duration=v;}
}
