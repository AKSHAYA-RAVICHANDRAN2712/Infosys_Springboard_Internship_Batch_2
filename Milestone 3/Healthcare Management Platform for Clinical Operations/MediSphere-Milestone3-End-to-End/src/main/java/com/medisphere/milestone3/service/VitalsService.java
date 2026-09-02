package com.medisphere.milestone3.service;

import com.medisphere.milestone3.dto.*;
import com.medisphere.milestone3.entity.Vitals;
import com.medisphere.milestone3.enums.AlertSeverity;
import com.medisphere.milestone3.repository.VitalsRepository;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class VitalsService {
    private final VitalsRepository repo; private final AlertFatigueService alertService;
    public VitalsService(VitalsRepository repo,AlertFatigueService alertService){this.repo=repo;this.alertService=alertService;}
    public VitalsResponse save(VitalsRequest r){
        Vitals v=new Vitals();v.setPatientId(r.patientId());v.setHeartRate(r.heartRate());v.setSystolicBp(r.systolicBp());v.setDiastolicBp(r.diastolicBp());v.setTemperature(r.temperature());v.setSpo2(r.spo2());v.setRespiratoryRate(r.respiratoryRate());
        v.setHeartRateStatus(range(r.heartRate(),60,100));v.setSpo2Status(range(r.spo2(),95,100));v.setTemperatureStatus(range(r.temperature(),36.1,37.2));v.setRespiratoryRateStatus(range(r.respiratoryRate(),12,20));
        String sys=range(r.systolicBp(),90,140),dia=range(r.diastolicBp(),60,90);v.setSystolicBpStatus(sys);v.setDiastolicBpStatus(dia);v.setBloodpressureStatus(("NORMAL".equals(sys)&&"NORMAL".equals(dia))?"NORMAL":("HIGH".equals(sys)||"HIGH".equals(dia)?"HIGH":"LOW"));
        repo.save(v);
        if(!"NORMAL".equals(overall(v))){int abnormal=(int)List.of(v.getHeartRateStatus(),v.getSpo2Status(),v.getTemperatureStatus(),v.getRespiratoryRateStatus(),v.getSystolicBpStatus(),v.getDiastolicBpStatus()).stream().filter(x->!"NORMAL".equals(x)).count();AlertSeverity sev=abnormal>=3?AlertSeverity.HIGH:AlertSeverity.MEDIUM;alertService.process(new AlertRequest(r.patientId(),"VITALS_OUT_OF_RANGE",sev,buildMessage(v),null,null,"VITALS_VALIDATION"));}
        return toResponse(v);
    }
    public List<VitalsResponse> recent(){return repo.findTop50ByOrderByIdDesc().stream().map(this::toResponse).toList();}
    private String range(double x,double lo,double hi){return x<lo?"LOW":x>hi?"HIGH":"NORMAL";}
    private String overall(Vitals v){return List.of(v.getHeartRateStatus(),v.getSpo2Status(),v.getTemperatureStatus(),v.getRespiratoryRateStatus(),v.getSystolicBpStatus(),v.getDiastolicBpStatus()).stream().allMatch("NORMAL"::equals)?"NORMAL":"OUT_OF_RANGE";}
    private String buildMessage(Vitals v){StringBuilder m=new StringBuilder("Out-of-range vital(s): ");if(!"NORMAL".equals(v.getHeartRateStatus()))m.append("heart rate ").append(v.getHeartRate()).append("; ");if(!"NORMAL".equals(v.getSpo2Status()))m.append("SpO₂ ").append(v.getSpo2()).append("; ");if(!"NORMAL".equals(v.getTemperatureStatus()))m.append("temperature ").append(v.getTemperature()).append("; ");if(!"NORMAL".equals(v.getRespiratoryRateStatus()))m.append("respiratory rate ").append(v.getRespiratoryRate()).append("; ");if(!"NORMAL".equals(v.getSystolicBpStatus())||!"NORMAL".equals(v.getDiastolicBpStatus()))m.append("blood pressure ").append(v.getSystolicBp()).append('/').append(v.getDiastolicBp()).append(';');return m.toString();}
    private VitalsResponse toResponse(Vitals v){return new VitalsResponse(v.getId(),v.getPatientId(),v.getHeartRate(),v.getHeartRateStatus(),v.getSystolicBp(),v.getSystolicBpStatus(),v.getDiastolicBp(),v.getDiastolicBpStatus(),v.getTemperature(),v.getTemperatureStatus(),v.getSpo2(),v.getSpo2Status(),v.getRespiratoryRate(),v.getRespiratoryRateStatus(),v.getBloodpressureStatus(),overall(v));}
}
