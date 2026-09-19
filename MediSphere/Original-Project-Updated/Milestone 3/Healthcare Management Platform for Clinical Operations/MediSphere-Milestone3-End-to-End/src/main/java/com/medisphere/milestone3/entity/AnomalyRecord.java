package com.medisphere.milestone3.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="m3_anomaly_record")
public class AnomalyRecord {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="patient_id", length=255) private String patientId;
    @Column(name="anomaly_detected", nullable=false) private boolean anomalyDetected;
    @Column(name="anomaly_score") private Double anomalyScore;
    @Column(name="prediction") private Integer prediction;
    @Column(name="precision_percent") private Double precisionPercent;
    @Column(name="heart_rate") private Double heartRate;
    @Column(name="systolic_bp") private Double systolicBp;
    @Column(name="diastolic_bp") private Double diastolicBp;
    @Column(name="respiratory_rate") private Double respiratoryRate;
    @Column(name="spo2") private Double spo2;
    @Column(name="temperature") private Double temperature;
    @Column(name="created_at") private LocalDateTime createdAt;
    @Column(columnDefinition="TEXT") private String message;
    @PrePersist void prePersist(){if(createdAt==null)createdAt=LocalDateTime.now();}
    public Long getId(){return id;} public String getPatientId(){return patientId;} public void setPatientId(String v){patientId=v;}
    public boolean isAnomalyDetected(){return anomalyDetected;} public void setAnomalyDetected(boolean v){anomalyDetected=v;}
    public Double getAnomalyScore(){return anomalyScore;} public void setAnomalyScore(Double v){anomalyScore=v;}
    public Integer getPrediction(){return prediction;} public void setPrediction(Integer v){prediction=v;}
    public Double getPrecisionPercent(){return precisionPercent;} public void setPrecisionPercent(Double v){precisionPercent=v;}
    public Double getHeartRate(){return heartRate;} public void setHeartRate(Double v){heartRate=v;}
    public Double getSystolicBp(){return systolicBp;} public void setSystolicBp(Double v){systolicBp=v;}
    public Double getDiastolicBp(){return diastolicBp;} public void setDiastolicBp(Double v){diastolicBp=v;}
    public Double getRespiratoryRate(){return respiratoryRate;} public void setRespiratoryRate(Double v){respiratoryRate=v;}
    public Double getSpo2(){return spo2;} public void setSpo2(Double v){spo2=v;}
    public Double getTemperature(){return temperature;} public void setTemperature(Double v){temperature=v;}
    public LocalDateTime getCreatedAt(){return createdAt;} public String getMessage(){return message;} public void setMessage(String v){message=v;}
}
