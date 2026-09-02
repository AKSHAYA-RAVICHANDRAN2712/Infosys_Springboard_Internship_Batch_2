package com.medisphere.milestone3.dto;
public record DashboardResponse(long vitalsOutOfRange,long alertsSuppressed,double anomalyPrecisionPercent,boolean anomalyTargetMet) {}
