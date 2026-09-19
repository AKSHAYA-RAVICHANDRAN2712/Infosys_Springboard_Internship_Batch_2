package com.shap.shap_integration.repository;


import com.shap.shap_integration.entity.SHAPValidation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SHAPValidationRepository
        extends JpaRepository<SHAPValidation, Long> {

    Optional<SHAPValidation> findByPrediction_PredictionId(Long predictionId);
}
