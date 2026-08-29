package com.medisphere.repository;

import com.medisphere.model.ClinicalOutcomeApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutcomeApprovalRepository extends JpaRepository<ClinicalOutcomeApproval, Long> {
    List<ClinicalOutcomeApproval> findByApprovalStatus(String approvalStatus);
}