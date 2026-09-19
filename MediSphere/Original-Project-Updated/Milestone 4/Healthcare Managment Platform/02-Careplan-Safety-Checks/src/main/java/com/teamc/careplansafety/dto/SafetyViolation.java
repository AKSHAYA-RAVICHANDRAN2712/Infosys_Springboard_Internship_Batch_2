package com.teamc.careplansafety.dto;
public class SafetyViolation { private String ruleType; private String severity; private String message; public SafetyViolation(){} public SafetyViolation(String r,String s,String m){ruleType=r;severity=s;message=m;} public String getRuleType(){return ruleType;} public String getSeverity(){return severity;} public String getMessage(){return message;} }
