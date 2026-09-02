package com.medisphere.milestone3.dto;
public record PrecisionResponse(double precision,double precisionPercent,long truePositives,long falsePositives,long total,double threshold,boolean targetMet) {}
