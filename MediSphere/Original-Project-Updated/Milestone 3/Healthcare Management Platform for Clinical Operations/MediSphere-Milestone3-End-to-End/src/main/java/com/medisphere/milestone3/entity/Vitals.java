package com.medisphere.milestone3.entity;

import jakarta.persistence.*;

@Entity
@Table(name="vitals")
public class Vitals {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="patient_id") private String patientId;
    @Column(name="heart_rate") private Double heartRate;
    @Column(name="systolic_bp") private Double systolicBp;
    @Column(name="diastolic_bp") private Double diastolicBp;
    @Column(name="temperature") private Double temperature;
    @Column(name="spo2") private Double spo2;
    @Column(name="respiratory_rate") private Double respiratoryRate;
    @Column(name="heart_rate_status") private String heartRateStatus;
    @Column(name="systolic_bp_status") private String systolicBpStatus;
    @Column(name="diastolic_bp_status") private String diastolicBpStatus;
    @Column(name="temperature_status") private String temperatureStatus;
    @Column(name="spo2_status") private String spo2Status;
    @Column(name="respiratory_rate_status") private String respiratoryRateStatus;
    @Column(name="bloodpressure_status") private String bloodpressureStatus;
    public Long getId(){return id;} public String getPatientId(){return patientId;} public void setPatientId(String v){patientId=v;}
    public Double getHeartRate(){return heartRate;} public void setHeartRate(Double v){heartRate=v;}
    public Double getSystolicBp(){return systolicBp;} public void setSystolicBp(Double v){systolicBp=v;}
    public Double getDiastolicBp(){return diastolicBp;} public void setDiastolicBp(Double v){diastolicBp=v;}
    public Double getTemperature(){return temperature;} public void setTemperature(Double v){temperature=v;}
    public Double getSpo2(){return spo2;} public void setSpo2(Double v){spo2=v;}
    public Double getRespiratoryRate(){return respiratoryRate;} public void setRespiratoryRate(Double v){respiratoryRate=v;}
    public String getHeartRateStatus(){return heartRateStatus;} public void setHeartRateStatus(String v){heartRateStatus=v;}
    public String getSystolicBpStatus(){return systolicBpStatus;} public void setSystolicBpStatus(String v){systolicBpStatus=v;}
    public String getDiastolicBpStatus(){return diastolicBpStatus;} public void setDiastolicBpStatus(String v){diastolicBpStatus=v;}
    public String getTemperatureStatus(){return temperatureStatus;} public void setTemperatureStatus(String v){temperatureStatus=v;}
    public String getSpo2Status(){return spo2Status;} public void setSpo2Status(String v){spo2Status=v;}
    public String getRespiratoryRateStatus(){return respiratoryRateStatus;} public void setRespiratoryRateStatus(String v){respiratoryRateStatus=v;}
    public String getBloodpressureStatus(){return bloodpressureStatus;} public void setBloodpressureStatus(String v){bloodpressureStatus=v;}
}
