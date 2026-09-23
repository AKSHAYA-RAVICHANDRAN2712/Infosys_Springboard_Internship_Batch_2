package com.medisphere.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clinical_outcome_approvals")
public class ClinicalOutcomeApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;
    private String patientName;
    private String predictionType; // e.g., CVD_RISK, DIABETIC_COMPLICATION
    private String proposedTreatment; // e.g., Dosage Adjustment, Diagnostic Followup
    
    private String approvalStatus; // PENDING_REVIEW, APPROVED, REJECTED, OVERRIDDEN
    private String approvedByDoctorId; // e.g., DOC-501
    private LocalDateTime approvalTimestamp;
    private String clinicalNotes;

    // Outcome Tracking Integrity
    private String postInterventionOutcome; // e.g., Systolic Normalized (120 mmHg)
    private Double targetMetricValue;
    private Double observedMetricValue;
    private Boolean outcomeVerified;
    private String cryptographicHash; // SHA-256 for audit immutability

    public ClinicalOutcomeApproval() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPredictionType() { return predictionType; }
    public void setPredictionType(String predictionType) { this.predictionType = predictionType; }

    public String getProposedTreatment() { return proposedTreatment; }
    public void setProposedTreatment(String proposedTreatment) { this.proposedTreatment = proposedTreatment; }

    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }

    public String getApprovedByDoctorId() { return approvedByDoctorId; }
    public void setApprovedByDoctorId(String approvedByDoctorId) { this.approvedByDoctorId = approvedByDoctorId; }

    public LocalDateTime getApprovalTimestamp() { return approvalTimestamp; }
    public void setApprovalTimestamp(LocalDateTime approvalTimestamp) { this.approvalTimestamp = approvalTimestamp; }

    public String getClinicalNotes() { return clinicalNotes; }
    public void setClinicalNotes(String clinicalNotes) { this.clinicalNotes = clinicalNotes; }

    public String getPostInterventionOutcome() { return postInterventionOutcome; }
    public void setPostInterventionOutcome(String postInterventionOutcome) { this.postInterventionOutcome = postInterventionOutcome; }

    public Double getTargetMetricValue() { return targetMetricValue; }
    public void setTargetMetricValue(Double targetMetricValue) { this.targetMetricValue = targetMetricValue; }

    public Double getObservedMetricValue() { return observedMetricValue; }
    public void setObservedMetricValue(Double observedMetricValue) { this.observedMetricValue = observedMetricValue; }

    public Boolean getOutcomeVerified() { return outcomeVerified; }
    public void setOutcomeVerified(Boolean outcomeVerified) { this.outcomeVerified = outcomeVerified; }

    public String getCryptographicHash() { return cryptographicHash; }
    public void setCryptographicHash(String cryptographicHash) { this.cryptographicHash = cryptographicHash; }
}