package com.medisphere.controller;

import com.medisphere.model.ClinicalOutcomeApproval;
import com.medisphere.service.OutcomeApprovalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/approvals")
@CrossOrigin(origins = "*")
public class OutcomeApprovalController {

    @Autowired
    private OutcomeApprovalService service;

    @GetMapping("/pending")
    public ResponseEntity<List<ClinicalOutcomeApproval>> getPendingApprovals() {
        return ResponseEntity.ok(service.getPendingApprovals());
    }

    @GetMapping("/all")
    public ResponseEntity<List<ClinicalOutcomeApproval>> getAllAuditedOutcomes() {
        return ResponseEntity.ok(service.getVerifiedOutcomes());
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<?> reviewProposal(
            @PathVariable Long id,
            @RequestParam String status, // APPROVED, REJECTED, OVERRIDDEN
            @RequestParam String doctorId,
            @RequestParam(required = false, defaultValue = "Approved per clinical protocols") String notes,
            @RequestHeader(value = "X-User-Role", defaultValue = "PROVIDER") String role) {

        // RBAC Enforcement: Only PROVIDERS can approve treatment/outcome plans
        if (!"PROVIDER".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access Denied: Only licensed Providers can approve clinical treatment plans.");
        }

        return ResponseEntity.ok(service.processApproval(id, status, doctorId, notes));
    }
}