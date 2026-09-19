package com.teamc.patientconsentverification.config;

import com.teamc.patientconsentverification.entity.PatientConsentEntity;
import com.teamc.patientconsentverification.entity.PatientEntity;
import com.teamc.patientconsentverification.repository.PatientConsentRepository;
import com.teamc.patientconsentverification.repository.PatientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class PatientDataInitializer {
    @Bean
    CommandLineRunner seedPatients(PatientRepository patients, PatientConsentRepository consents) {
        return args -> {
            seedPatient(patients, "P1001", "Rahul Sharma", "male", "1995-04-12");
            seedPatient(patients, "P1002", "Anjali Verma", "female", "1997-08-21");
            seedPatient(patients, "P1003", "Vikram Singh", "male", "1990-02-10");
            seedPatient(patients, "P1004", "Neha Patel", "female", "1993-11-05");
            seedPatient(patients, "P1005", "Arjun Mehta", "male", "1992-06-18");

            seedConsent(consents, "P1001", "Rahul Sharma", "TREATMENT", "Granted", "Dr. Ram", LocalDate.of(2026,7,25), LocalDate.of(2027,7,25));
            seedConsent(consents, "P1002", "Anjali Verma", "TREATMENT", "Pending", "Dr. Ram", LocalDate.of(2026,7,26), null);
            seedConsent(consents, "P1003", "Vikram Singh", "TREATMENT", "Granted", "Dr. Ram", LocalDate.of(2026,7,24), LocalDate.of(2027,7,24));
            seedConsent(consents, "P1004", "Neha Patel", "TREATMENT", "Revoked", "Dr. Ram", LocalDate.of(2026,7,20), LocalDate.of(2026,7,20));
            seedConsent(consents, "P1005", "Arjun Mehta", "TREATMENT", "Granted", "Dr. Ram", LocalDate.of(2026,7,23), LocalDate.of(2027,7,23));
        };
    }

    private void seedPatient(PatientRepository repo, String id, String name, String gender, String birthDate) {
        PatientEntity p = repo.findByPatientId(id).orElseGet(PatientEntity::new);
        p.setPatientId(id); p.setPatientName(name); p.setResourceType("Patient"); p.setActive(true); p.setGender(gender); p.setBirthDate(birthDate);
        repo.save(p);
    }

    private void seedConsent(PatientConsentRepository repo, String patientId, String name, String type, String status, String authorizedBy, LocalDate date, LocalDate expiry) {
        if (repo.existsByPatientIdAndConsentType(patientId, type)) return;
        PatientConsentEntity c = new PatientConsentEntity(); c.setPatientId(patientId); c.setPatientName(name); c.setConsentType(type); c.setConsentStatus(status); c.setAuthorizedBy(authorizedBy); c.setConsentDate(date); c.setExpiryDate(expiry); repo.save(c);
    }
}
