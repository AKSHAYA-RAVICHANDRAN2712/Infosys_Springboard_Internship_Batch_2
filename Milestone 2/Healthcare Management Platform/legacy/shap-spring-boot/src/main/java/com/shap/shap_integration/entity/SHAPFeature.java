package com.shap.shap_integration.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "shap_feature")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SHAPFeature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "prediction_id",
            nullable = false
    )
    private SHAPPrediction prediction;

    @Column(name = "feature_name", length = 100, nullable = false)
    private String featureName;

    @Column(name = "shap_value", precision = 12, scale = 8)
    private BigDecimal shapValue;
}