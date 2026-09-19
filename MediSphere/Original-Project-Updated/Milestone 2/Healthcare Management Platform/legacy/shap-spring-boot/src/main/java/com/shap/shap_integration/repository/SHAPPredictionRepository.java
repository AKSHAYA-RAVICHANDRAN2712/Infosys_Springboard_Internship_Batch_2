package com.shap.shap_integration.repository;

import com.shap.shap_integration.entity.SHAPPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SHAPPredictionRepository
        extends JpaRepository<SHAPPrediction, Long> {

}

