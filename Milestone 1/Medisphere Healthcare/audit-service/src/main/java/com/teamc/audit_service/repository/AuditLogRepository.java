package com.teamc.audit_service.repository;

import com.teamc.audit_service.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByModuleOrderByTimestampDesc(String module);

    List<AuditLog> findAllByOrderByTimestampDesc();

    List<AuditLog> findByStatus(String status);

    List<AuditLog> findByEventType(String eventType);

    List<AuditLog> findByResourceType(String resourceType);

    List<AuditLog> findByAction(String action);
}