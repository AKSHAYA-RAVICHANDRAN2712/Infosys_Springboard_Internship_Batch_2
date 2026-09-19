package com.medisphere.milestone3.repository;
import com.medisphere.milestone3.entity.AnomalyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface AnomalyRecordRepository extends JpaRepository<AnomalyRecord,Long>{Optional<AnomalyRecord> findTopByOrderByCreatedAtDesc();}
