package com.teamc.clinicalguideline.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class ClinicalGuidelineRequest {
    @NotBlank private String patientId;
    @NotBlank private String carePlanId;
    @NotBlank private String condition;
    @NotNull @Min(0) private Integer age;
    @NotNull @DecimalMin("0.0") private Double hba1c;
    @NotNull @Min(0) private Integer hba1cMonitoringDays;
    private List<String> allergies;
    private List<String> medications;
    private List<String> carePlanMedications;

    public ClinicalGuidelineRequest() {}
    public String getPatientId(){return patientId;} public void setPatientId(String v){patientId=v;}
    public String getCarePlanId(){return carePlanId;} public void setCarePlanId(String v){carePlanId=v;}
    public String getCondition(){return condition;} public void setCondition(String v){condition=v;}
    public Integer getAge(){return age;} public void setAge(Integer v){age=v;}
    public Double getHba1c(){return hba1c;} public void setHba1c(Double v){hba1c=v;}
    public Integer getHba1cMonitoringDays(){return hba1cMonitoringDays;} public void setHba1cMonitoringDays(Integer v){hba1cMonitoringDays=v;}
    public List<String> getAllergies(){return allergies;} public void setAllergies(List<String> v){allergies=v;}
    public List<String> getMedications(){return medications;} public void setMedications(List<String> v){medications=v;}
    public List<String> getCarePlanMedications(){return carePlanMedications;} public void setCarePlanMedications(List<String> v){carePlanMedications=v;}
}
