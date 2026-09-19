package com.teamc.patientconsentverification.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "patient_consents", indexes = {
        @Index(name = "idx_patient_consent_patient", columnList = "patient_id")
})
public class PatientConsentEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="patient_id", nullable=false, length=255) private String patientId;
    @Column(name="patient_name", nullable=false, length=255) private String patientName;
    @Column(name="consent_type", nullable=false, length=50) private String consentType;
    @Column(name="consent_status", nullable=false, length=30) private String consentStatus;
    @Column(name="authorized_by", nullable=false, length=255) private String authorizedBy;
    @Column(name="consent_date", nullable=false) private LocalDate consentDate;
    @Column(name="expiry_date") private LocalDate expiryDate;

    public PatientConsentEntity() {}
    public Long getId(){return id;}
    public String getPatientId(){return patientId;} public void setPatientId(String v){patientId=v;}
    public String getPatientName(){return patientName;} public void setPatientName(String v){patientName=v;}
    public String getConsentType(){return consentType;} public void setConsentType(String v){consentType=v;}
    public String getConsentStatus(){return consentStatus;} public void setConsentStatus(String v){consentStatus=v;}
    public String getAuthorizedBy(){return authorizedBy;} public void setAuthorizedBy(String v){authorizedBy=v;}
    public LocalDate getConsentDate(){return consentDate;} public void setConsentDate(LocalDate v){consentDate=v;}
    public LocalDate getExpiryDate(){return expiryDate;} public void setExpiryDate(LocalDate v){expiryDate=v;}
}
