package com.teamc.fhir_validation.repository;

import com.teamc.fhir_validation.entity.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<PatientEntity, Long> {
    Optional<PatientEntity> findByPatientId(String patientId);
    boolean existsByPatientId(String patientId);
}