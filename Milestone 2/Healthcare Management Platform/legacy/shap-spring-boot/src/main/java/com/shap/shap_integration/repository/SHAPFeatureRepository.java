package com.shap.shap_integration.repository;


import com.shap.shap_integration.entity.SHAPFeature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SHAPFeatureRepository
        extends JpaRepository<SHAPFeature, Long> {

    List<SHAPFeature> findByPrediction_PredictionId(Long predictionId);
}
