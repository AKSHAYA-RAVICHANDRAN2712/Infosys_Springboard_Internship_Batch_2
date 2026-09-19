package com.shap.shap_integration.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "shap_validation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SHAPValidation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "validation_id")
    private Long validationId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "prediction_id",
            nullable = false,
            unique = true
    )
    private SHAPPrediction prediction;

    @Column(name = "consistency", length = 30)
    private String consistency;

    @Column(name = "feature_agreement", length = 30)
    private String featureAgreement;

    @Column(name = "overlap_count")
    private Integer overlapCount;

    @Column(name = "perturbation", length = 30)
    private String perturbation;

    @Column(name = "original_probability", precision = 8, scale = 5)
    private BigDecimal originalProbability;

    @Column(name = "perturbed_probability", precision = 8, scale = 5)
    private BigDecimal perturbedProbability;

    @Column(name = "probability_change", precision = 8, scale = 5)
    private BigDecimal probabilityChange;

    @Column(name = "reconstructed_output", precision = 12, scale = 8)
    private BigDecimal reconstructedOutput;

    @Column(name = "top_feature", length = 100)
    private String topFeature;

    @Column(name = "top_feature_shap_value", precision = 12, scale = 8)
    private BigDecimal topFeatureShapValue;
}