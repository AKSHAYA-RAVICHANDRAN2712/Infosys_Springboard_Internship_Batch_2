package com.medisphere.milestone3.dto;
import java.util.Map;
public record AnomalyResponse(boolean success,boolean anomalyDetected,int prediction,double anomalyScore,double precisionPercent,boolean precisionTargetMet,String message,Map<String,Object> vitals,Map<String,Double> shap) {}
