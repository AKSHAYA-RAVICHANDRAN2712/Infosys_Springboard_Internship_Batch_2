package com.teamc.audit_service.service;

import com.teamc.audit_service.dto.AuditLogRequest;
import com.teamc.audit_service.dto.AuditLogResponse;
import com.teamc.audit_service.entity.AuditLog;
import com.teamc.audit_service.exception.AuditLogNotFoundException;
import com.teamc.audit_service.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public AuditLogResponse createAuditLog(AuditLogRequest request) {

        AuditLog auditLog = new AuditLog();

        auditLog.setEventType(request.getEventType());
        auditLog.setModule(request.getModule());
        auditLog.setResourceType(request.getResourceType());
        auditLog.setResourceId(request.getResourceId());
        auditLog.setAction(request.getAction());
        auditLog.setStatus(request.getStatus());
        auditLog.setMessage(request.getMessage());
        auditLog.setTimestamp(LocalDateTime.now());

        AuditLog savedLog = auditLogRepository.save(auditLog);

        return convertToResponse(savedLog);
    }

    public List<AuditLogResponse> getAllLogs() {

        return auditLogRepository.findAllByOrderByTimestampDesc()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public AuditLogResponse getLogById(Long id) {

        AuditLog auditLog = auditLogRepository.findById(id)
                .orElseThrow(() ->
                        new AuditLogNotFoundException(
                                "Audit log with ID " + id + " not found"
                        )
                );

        return convertToResponse(auditLog);
    }

    public List<AuditLogResponse> getLogsByModule(String module) {

        return auditLogRepository.findByModuleOrderByTimestampDesc(module)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<AuditLogResponse> getLogsByStatus(String status) {

        return auditLogRepository.findByStatus(status)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<AuditLogResponse> getLogsByEventType(String eventType) {

        return auditLogRepository.findByEventType(eventType)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private AuditLogResponse convertToResponse(AuditLog auditLog) {

        AuditLogResponse response = new AuditLogResponse();

        response.setId(auditLog.getId());
        response.setEventType(auditLog.getEventType());
        response.setModule(auditLog.getModule());
        response.setResourceType(auditLog.getResourceType());
        response.setResourceId(auditLog.getResourceId());
        response.setAction(auditLog.getAction());
        response.setStatus(auditLog.getStatus());
        response.setMessage(auditLog.getMessage());
        response.setTimestamp(auditLog.getTimestamp());

        return response;
    }
}