package com.teamc.fhir_validation.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dbId;
    @Column(nullable = false, unique = true)
    private String patientId;
    @Column(nullable = false)
    private String resourceType;
    private Boolean active;
    private String gender;
    private String birthDate;
}