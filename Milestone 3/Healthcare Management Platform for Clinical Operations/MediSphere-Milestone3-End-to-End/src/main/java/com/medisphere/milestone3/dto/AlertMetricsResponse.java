package com.medisphere.milestone3.dto;
public record AlertMetricsResponse(long totalAlerts,long suppressedAlerts,long activeAlerts,double suppressionRate) {}
