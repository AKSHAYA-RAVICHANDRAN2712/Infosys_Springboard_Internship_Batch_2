package com.shap.shap_integration.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "shap_prediction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SHAPPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prediction_id")
    private Long predictionId;

    @Column(name = "age")
    private Integer age;

    @Column(name = "blood_pressure")
    private BigDecimal bloodPressure;

    @Column(name = "cholesterol")
    private BigDecimal cholesterol;

    @Column(name = "bmi")
    private BigDecimal bmi;

    @Column(name = "glucose")
    private BigDecimal glucose;

    @Column(name = "actual_class")
    private Integer actualClass;

    @Column(name = "predicted_class")
    private Integer predictedClass;

    @Column(name = "prediction", length = 50)
    private String prediction;

    @Column(name = "confidence", precision = 8, scale = 5)
    private BigDecimal confidence;

    @Column(name = "class_0_probability", precision = 8, scale = 5)
    private BigDecimal class0Probability;

    @Column(name = "class_1_probability", precision = 8, scale = 5)
    private BigDecimal class1Probability;

    @Column(name = "validity_score", precision = 8, scale = 2)
    private BigDecimal validityScore;

    @Column(name = "final_result", length = 30)
    private String finalResult;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}