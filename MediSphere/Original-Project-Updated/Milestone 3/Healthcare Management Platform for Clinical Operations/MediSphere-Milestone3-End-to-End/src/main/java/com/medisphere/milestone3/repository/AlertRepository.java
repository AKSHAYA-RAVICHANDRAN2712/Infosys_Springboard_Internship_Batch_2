package com.medisphere.milestone3.repository;
import com.medisphere.milestone3.entity.AlertFatigue;
import com.medisphere.milestone3.enums.AlertStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime; import java.util.*;
public interface AlertRepository extends JpaRepository<AlertFatigue,Long>{
 Optional<AlertFatigue> findTopByPatientIdAndAlertTypeAndAlertTimestampAfterOrderByAlertTimestampDesc(String patientId,String alertType,LocalDateTime since);
 List<AlertFatigue> findTop50ByOrderByAlertTimestampDesc();
 long countBySuppressedTrueAndAlertTimestampAfter(LocalDateTime since);
 long countByAlertTimestampAfter(LocalDateTime since);
 long countByStatusAndAlertTimestampAfter(AlertStatus status,LocalDateTime since);
}
