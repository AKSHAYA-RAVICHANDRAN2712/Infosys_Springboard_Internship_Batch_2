package com.medisphere.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medisphere.entity.Alert;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByRoutedToRole(String role);
    List<Alert> findByAcknowledgedFalse();
    long countByIsFalseAlertTrue();
}