package com.teamc.careplansafety.service;
import com.teamc.careplansafety.dto.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.time.OffsetDateTime;
import java.util.*;
@Service
public class CarePlanSafetyService {
 private final JdbcTemplate jdbc; public CarePlanSafetyService(JdbcTemplate jdbc){this.jdbc=jdbc;}
 public CarePlanSafetyResponse validate(CarePlanSafetyRequest r){
  List<SafetyViolation> v=new ArrayList<>();
  if(r.getDosage()>10000) v.add(new SafetyViolation("DOSAGE_LIMIT_EXCEEDED","HIGH","Dosage exceeds the configured software safety limit"));
  String f=r.getFrequency().trim().toLowerCase(Locale.ROOT); if(f.equals("0")||f.contains("0 time")||f.contains("0 times")||f.contains("never")) v.add(new SafetyViolation("INVALID_FREQUENCY","MEDIUM","Frequency must specify a positive schedule"));
  if(r.getDuration()>365) v.add(new SafetyViolation("INVALID_DURATION","MEDIUM","Treatment duration exceeds the configured software limit of 365 days"));
  if(r.getMedication().trim().length()<2) v.add(new SafetyViolation("INVALID_MEDICATION","MEDIUM","Medication name is invalid"));
  boolean safe=v.isEmpty(); String status=safe?"SAFE":"UNSAFE";
  jdbc.update("insert into careplan_safety_result(patient_id,medication,dosage,unit,frequency,duration,status,violations,checked_at) values (?,?,?,?,?,?,?,?,now())",parseLong(r.getPatientId()),r.getMedication().trim(),r.getDosage(),r.getUnit().trim(),r.getFrequency().trim(),r.getDuration(),status,v.stream().map(SafetyViolation::getMessage).reduce((a,b)->a+" | "+b).orElse(""));
  return new CarePlanSafetyResponse(safe,status,v,OffsetDateTime.now().toString());
 }
 public List<Map<String,Object>> history(String patientId){return jdbc.queryForList("select id, medication, dosage, unit, frequency, duration, status, violations, checked_at from careplan_safety_result where patient_id=? order by id desc limit 20",parseLong(patientId));}
 public long resultCount(){return jdbc.queryForObject("select count(*) from careplan_safety_result",Long.class);}
 private Long parseLong(String s){try{return Long.valueOf(s);}catch(Exception e){return null;}}
}
