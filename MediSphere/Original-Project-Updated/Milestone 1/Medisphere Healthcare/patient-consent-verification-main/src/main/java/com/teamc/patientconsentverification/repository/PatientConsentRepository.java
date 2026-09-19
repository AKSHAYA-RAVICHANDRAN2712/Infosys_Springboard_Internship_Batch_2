package com.teamc.patientconsentverification.repository;

import com.teamc.patientconsentverification.entity.PatientConsentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PatientConsentRepository extends JpaRepository<PatientConsentEntity, Long> {
    List<PatientConsentEntity> findAllByOrderByIdAsc();
    boolean existsByPatientIdAndConsentType(String patientId, String consentType);
}
