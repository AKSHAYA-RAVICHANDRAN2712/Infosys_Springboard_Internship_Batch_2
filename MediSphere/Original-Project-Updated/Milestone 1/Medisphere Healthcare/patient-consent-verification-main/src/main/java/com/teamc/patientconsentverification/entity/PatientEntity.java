package com.teamc.patientconsentverification.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "patients")
public class PatientEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dbId;

    @Column(nullable = false, unique = true)
    private String patientId;

    private String patientName;

    @Column(nullable = false)
    private String resourceType;

    private Boolean active;

    private String gender;

    private String birthDate;

    public PatientEntity() {
    }

    public PatientEntity(Long dbId, String patientId, String resourceType, Boolean active, String gender, String birthDate) {
        this.dbId = dbId;
        this.patientId = patientId;
        this.resourceType = resourceType;
        this.active = active;
        this.gender = gender;
        this.birthDate = birthDate;
    }

    public Long getDbId() {
        return dbId;
    }

    public void setDbId(Long dbId) {
        this.dbId = dbId;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() { return patientName; }

    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }
}
