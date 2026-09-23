package com.medisphere.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patientId;

    @Column(nullable = false)
    private String alertType; // CRITICAL, WARNING, INFO

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private String routedToRole; // DOCTOR, NURSE, ADMIN

    private String routedToUserId;

    @Column(nullable = false)
    private boolean acknowledged = false;

    private LocalDateTime acknowledgedAt;
    private String acknowledgedBy;

    @Column(nullable = false)
    private boolean isFalseAlert = false;

    private String clinicalFeedback;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Alert() {}

    public Alert(Long patientId, String alertType, String message, String routedToRole, String routedToUserId) {
        this.patientId = patientId;
        this.alertType = alertType;
        this.message = message;
        this.routedToRole = routedToRole;
        this.routedToUserId = routedToUserId;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public String getAlertType() { return alertType; }
    public void setAlertType(String alertType) { this.alertType = alertType; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getRoutedToRole() { return routedToRole; }
    public void setRoutedToRole(String routedToRole) { this.routedToRole = routedToRole; }
    public String getRoutedToUserId() { return routedToUserId; }
    public void setRoutedToUserId(String routedToUserId) { this.routedToUserId = routedToUserId; }
    public boolean isAcknowledged() { return acknowledged; }
    public void setAcknowledged(boolean acknowledged) { this.acknowledged = acknowledged; }
    public LocalDateTime getAcknowledgedAt() { return acknowledgedAt; }
    public void setAcknowledgedAt(LocalDateTime acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; }
    public String getAcknowledgedBy() { return acknowledgedBy; }
    public void setAcknowledgedBy(String acknowledgedBy) { this.acknowledgedBy = acknowledgedBy; }
    public boolean isFalseAlert() { return isFalseAlert; }
    public void setFalseAlert(boolean falseAlert) { isFalseAlert = falseAlert; }
    public String getClinicalFeedback() { return clinicalFeedback; }
    public void setClinicalFeedback(String clinicalFeedback) { this.clinicalFeedback = clinicalFeedback; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}