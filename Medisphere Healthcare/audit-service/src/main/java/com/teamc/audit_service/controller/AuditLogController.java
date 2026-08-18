package com.teamc.audit_service.controller;

import com.teamc.audit_service.dto.AuditLogRequest;
import com.teamc.audit_service.dto.AuditLogResponse;
import com.teamc.audit_service.service.AuditLogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "*")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Audit service is UP");
    }

    @PostMapping("/log")
    public ResponseEntity<AuditLogResponse> createAuditLog(
            @Valid @RequestBody AuditLogRequest request) {

        AuditLogResponse response =
                auditLogService.createAuditLog(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/logs")
    public ResponseEntity<List<AuditLogResponse>> getAllLogs(
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String eventType) {

        if (module != null) {
            return ResponseEntity.ok(
                    auditLogService.getLogsByModule(module)
            );
        }

        if (status != null) {
            return ResponseEntity.ok(
                    auditLogService.getLogsByStatus(status)
            );
        }

        if (eventType != null) {
            return ResponseEntity.ok(
                    auditLogService.getLogsByEventType(eventType)
            );
        }

        return ResponseEntity.ok(
                auditLogService.getAllLogs()
        );
    }

    @GetMapping("/logs/{id}")
    public ResponseEntity<AuditLogResponse> getLogById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                auditLogService.getLogById(id)
        );
    }
}