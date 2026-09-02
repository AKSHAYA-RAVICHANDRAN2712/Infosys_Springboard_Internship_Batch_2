package com.medisphere.milestone3.entity;

import com.medisphere.milestone3.enums.AlertSeverity;
import com.medisphere.milestone3.enums.AlertStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="alert_fatigue", indexes={
    @Index(name="idx_alert_fatigue_patient_type_time", columnList="patient_id,alert_type,alert_timestamp")
})
public class AlertFatigue {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="patient_id", nullable=false, length=255) private String patientId;
    @Column(name="alert_type", nullable=false, length=100) private String alertType;
    @Enumerated(EnumType.STRING) @Column(nullable=false, length=20) private AlertSeverity severity;
    @Column(columnDefinition="TEXT") private String message;
    private Double confidence;
    @Column(name="alert_timestamp", nullable=false) private LocalDateTime alertTimestamp;
    @Enumerated(EnumType.STRING) @Column(nullable=false, length=30) private AlertStatus status;
    @Column(nullable=false) private boolean suppressed;
    @Column(name="suppression_reason", columnDefinition="TEXT") private String suppressionReason;
    @Column(name="occurrence_count", nullable=false) private int occurrenceCount;
    @Column(length=40) private String source;
    @Column(name="created_at", nullable=false) private LocalDateTime createdAt;
    @Column(name="updated_at", nullable=false) private LocalDateTime updatedAt;

    @PrePersist void prePersist(){
        LocalDateTime now=LocalDateTime.now();
        if(createdAt==null) createdAt=now; if(updatedAt==null) updatedAt=now;
        if(alertTimestamp==null) alertTimestamp=now; if(occurrenceCount<1) occurrenceCount=1;
    }
    @PreUpdate void preUpdate(){updatedAt=LocalDateTime.now();}
    public Long getId(){return id;} public String getPatientId(){return patientId;} public void setPatientId(String v){patientId=v;}
    public String getAlertType(){return alertType;} public void setAlertType(String v){alertType=v;}
    public AlertSeverity getSeverity(){return severity;} public void setSeverity(AlertSeverity v){severity=v;}
    public String getMessage(){return message;} public void setMessage(String v){message=v;}
    public Double getConfidence(){return confidence;} public void setConfidence(Double v){confidence=v;}
    public LocalDateTime getAlertTimestamp(){return alertTimestamp;} public void setAlertTimestamp(LocalDateTime v){alertTimestamp=v;}
    public AlertStatus getStatus(){return status;} public void setStatus(AlertStatus v){status=v;}
    public boolean isSuppressed(){return suppressed;} public void setSuppressed(boolean v){suppressed=v;}
    public String getSuppressionReason(){return suppressionReason;} public void setSuppressionReason(String v){suppressionReason=v;}
    public int getOccurrenceCount(){return occurrenceCount;} public void setOccurrenceCount(int v){occurrenceCount=v;}
    public String getSource(){return source;} public void setSource(String v){source=v;}
    public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
}
