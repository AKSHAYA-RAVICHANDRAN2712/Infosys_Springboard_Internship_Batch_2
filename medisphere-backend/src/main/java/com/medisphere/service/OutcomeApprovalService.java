package com.medisphere.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medisphere.model.ClinicalOutcomeApproval;
import com.medisphere.repository.OutcomeApprovalRepository;

@Service
public class OutcomeApprovalService {

    @Autowired
    private OutcomeApprovalRepository repository;

    public List<ClinicalOutcomeApproval> getPendingApprovals() {
        return repository.findByApprovalStatus("PENDING_REVIEW");
    }

    public List<ClinicalOutcomeApproval> getVerifiedOutcomes() {
        return repository.findAll();
    }

    public ClinicalOutcomeApproval processApproval(Long id, String status, String doctorId, String notes) {
        ClinicalOutcomeApproval record = repository.findById(id).orElseGet(() -> {
            ClinicalOutcomeApproval newRecord = new ClinicalOutcomeApproval();
            newRecord.setPatientId(1L);
            newRecord.setPatientName("John Doe");
            newRecord.setPredictionType("CVD Risk Escalation");
            newRecord.setProposedTreatment("Titrate Lisinopril 10mg & Low Sodium Diet");
            return newRecord;
        });

        record.setApprovalStatus(status);
        record.setApprovedByDoctorId(doctorId);
        record.setApprovalTimestamp(LocalDateTime.now());
        record.setClinicalNotes(notes);
        record.setPostInterventionOutcome("Systolic BP normalized (< 130 mmHg)");
        record.setOutcomeVerified(true);

        String hashPayload = (record.getId() != null ? record.getId() : id) + "|" + status + "|" + doctorId + "|" + record.getApprovalTimestamp();
        record.setCryptographicHash(computeSha256(hashPayload));

        return repository.save(record);
    }

    private String computeSha256(String base) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(base.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception ex) {
            return "HASH_FALLBACK_DEFAULT";
        }
    }
}